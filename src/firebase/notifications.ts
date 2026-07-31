import {
  addDoc,
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { capitalizeFirstLetter, getOfficialTimeBrazil, sheetStructure } from "./utilities";
import { authenticate } from "./authenticate";
import firebaseConfig from "./connection";
import { registerMessage } from "./messagesAndRolls";
import { createConsentForm } from "./consentForm";
import { addNewSheetMandatory } from "./players";
import { registerHistory } from "./history";

const getNotificationDocumentRef = async (db: any, sessionId: string) => {
  const notificationRef = collection(db, "notifications");
  const q = query(notificationRef, where("sessionId", "==", sessionId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return null;

  return querySnapshot.docs[0].ref;
};

const buildSheetLinkRequestMessage = (sheet: any) => {
  const sheetName = sheet?.data?.name?.trim();
  const userName = capitalizeFirstLetter(sheet?.user || "usuário");

  if (sheetName) {
    return `A ficha "${capitalizeFirstLetter(sheetName)}" de ${userName} solicitou vínculo com esta sessão.`;
  }

  return `Uma ficha de ${userName} solicitou vínculo com esta sessão.`;
};

const ensureConsentForm = async (
  sessionId: string,
  email: string,
  setShowMessage: any
) => {
  const db = getFirestore(firebaseConfig);
  const consentsRef = collection(db, "consents");
  const consentQuery = query(
    consentsRef,
    where("email", "==", email),
    where("sessionId", "==", sessionId),
  );
  const consentSnapshot = await getDocs(consentQuery);

  if (consentSnapshot.empty) {
    await createConsentForm(sessionId, email, setShowMessage);
  }
};

export const getNotificationsById = async (sessionId: string) => {
  const db = getFirestore(firebaseConfig);
  const sessionsCollectionRef = collection(db, "sessions");
  const sessionDocRef = doc(sessionsCollectionRef, sessionId);
  const sessionDocSnapshot = await getDoc(sessionDocRef);
  if (sessionDocSnapshot.exists()) {
    return sessionDocSnapshot;
  }
  return false;
};

export const createNotificationData = async (sessionId: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const notificationsCollection = collection(db, "notifications");
    await addDoc(notificationsCollection, { sessionId, list: [] });
  } catch (err: any) {
    setShowMessage({
      show: true,
      text: "Ocorreu um erro ao criar uma aba de notificação na Sessão: " + err.message,
    });
  }
};

export const getNotificationBySession = async (sessionId: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, "notifications");
    const q = query(collectionRef, where("sessionId", "==", sessionId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const notificationDoc = querySnapshot.docs[0];
      const notificationData = notificationDoc.data();
      return notificationData.list;
    }
    return [];
  } catch (err) {
    setShowMessage({
      show: true,
      text: "Ocorreu um erro ao buscar as notificações da Sessão: " + err,
    });
  }
};

export const requestApproval = async (sessionId: string, setShowMessage: any) => {
  try {
    const authData: any = await authenticate(setShowMessage);
    if (authData && authData.email && authData.displayName) {
      const { email, displayName } = authData;
      const db = getFirestore(firebaseConfig);
      const notificationRef = collection(db, "notifications");
      const q = query(notificationRef, where("sessionId", "==", sessionId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setShowMessage({
          show: true,
          text: "Não foi possível localizar a notificação da Sessão fornecida.",
        });
        return;
      }
      const notificationDoc = querySnapshot.docs[0];
      const notificationData = notificationDoc.data();
      const notificationDocRef = notificationDoc.ref;
      await runTransaction(db, async (transaction: any) => {
        const updatedList = [
          ...notificationData.list,
          {
            message: `O Usuário ${capitalizeFirstLetter(displayName)} de email "${email}" solicitou acesso à sua Sessão.`,
            email,
            type: "approval",
            user: displayName,
          },
        ];
        transaction.update(notificationDocRef, { list: updatedList });
      });
    }
  } catch (error) {
    setShowMessage({ show: true, text: "Ocorreu um erro ao enviar Solicitação: " + error });
  }
};

export const registerNotification = async (
  sessionId: string,
  notification: any,
  setShowMessage: any
) => {
  const db = getFirestore(firebaseConfig);
  const notificationRef = collection(db, "notifications");
  const q = query(notificationRef, where("sessionId", "==", sessionId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    setShowMessage({
      show: true,
      text: "Não foi possível localizar a notificação da Sessão fornecida.",
    });
    return;
  }
  const notificationDoc = querySnapshot.docs[0];
  const notificationData = notificationDoc.data();
  const notificationDocRef = notificationDoc.ref;
  await runTransaction(db, async (transaction: any) => {
    const updatedList = [...notificationData.list, notification];
    transaction.update(notificationDocRef, { list: updatedList });
  });
};

export const requestSheetLink = async (
  sheetId: string,
  sheet: any,
  targetSession: any,
  setShowMessage: any
) => {
  try {
    if (!sheetId) throw new Error("Ficha não encontrada.");
    if (!targetSession?.id) throw new Error("Sessão não encontrada.");
    if (sheet?.sessionId === targetSession.id) {
      setShowMessage({
        show: true,
        text: "Esta ficha já está vinculada à sessão selecionada.",
      });
      return null;
    }

    const db = getFirestore(firebaseConfig);
    const playerRef = doc(db, "players", sheetId);
    const notificationDocRef = await getNotificationDocumentRef(db, targetSession.id);

    if (!notificationDocRef) {
      throw new Error("Não foi possível localizar a área de notificações da sessão selecionada.");
    }

    const requestedAt = await getOfficialTimeBrazil();
    const requestId = `${sheetId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const sessionName = capitalizeFirstLetter(targetSession.name || "Sessão");
    const message = buildSheetLinkRequestMessage(sheet);

    const pendingSessionLink = {
      requestId,
      sessionId: targetSession.id,
      sessionName,
      requestedAt,
      message,
    };

    const notification = {
      message,
      type: "sheet-link-request",
      email: sheet.email,
      user: sheet.user,
      sheetId,
      sheetName: sheet?.data?.name || "",
      requestId,
      requestedAt,
      targetSessionId: targetSession.id,
      targetSessionName: sessionName,
    };

    await runTransaction(db, async (transaction) => {
      const playerSnapshot = await transaction.get(playerRef);
      const notificationSnapshot = await transaction.get(notificationDocRef);

      if (!playerSnapshot.exists()) throw new Error("Ficha não encontrada.");
      if (!notificationSnapshot.exists()) throw new Error("Sessão não encontrada.");

      const playerData = playerSnapshot.data();
      const notificationData = notificationSnapshot.data();

      if (playerData.pendingSessionLink?.requestId) {
        throw new Error("Esta ficha já possui uma solicitação pendente.");
      }

      transaction.update(playerRef, { pendingSessionLink });
      transaction.update(notificationDocRef, {
        list: [...(notificationData.list || []), notification],
      });
    });

    setShowMessage({
      show: true,
      text: `Solicitação enviada para ${sessionName}.`,
    });

    return pendingSessionLink;
  } catch (error: any) {
    setShowMessage({
      show: true,
      text: "Ocorreu um erro ao solicitar vínculo da ficha: " + error.message,
    });
    return null;
  }
};

export const removeNotification = async (
  sessionId: string,
  message: string,
  setShowMessage: any
) => {
  try {
    const db = getFirestore(firebaseConfig);
    const notificationsRef = collection(db, "notifications");
    const q = query(notificationsRef, where("sessionId", "==", sessionId));
    await runTransaction(db, async (transaction) => {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setShowMessage({ show: true, text: "Não foi possível encontrar a notificação." });
        return;
      }
      const notificationDoc = querySnapshot.docs[0];
      const notificationDocRef = doc(db, "notifications", notificationDoc.id);
      const notificationData = notificationDoc.data();
      const updatedList = (notificationData.list || []).filter(
        (notification: any) => notification.message !== message
      );
      transaction.update(notificationDocRef, { list: updatedList });
    });
  } catch (error: any) {
    setShowMessage({ show: true, text: "Ocorreu um erro: " + error.message });
  }
};

export const cancelSheetLinkRequest = async (
  sheetId: string,
  pendingSessionLink: any,
  setShowMessage: any
) => {
  try {
    if (!sheetId) throw new Error("Ficha não encontrada.");
    if (!pendingSessionLink?.requestId) {
      throw new Error("Não há solicitação pendente para cancelar.");
    }

    const db = getFirestore(firebaseConfig);
    const playerRef = doc(db, "players", sheetId);
    const notificationDocRef = pendingSessionLink.sessionId
      ? await getNotificationDocumentRef(db, pendingSessionLink.sessionId)
      : null;

    await runTransaction(db, async (transaction) => {
      const playerSnapshot = await transaction.get(playerRef);
      const notificationSnapshot = notificationDocRef
        ? await transaction.get(notificationDocRef)
        : null;

      if (!playerSnapshot.exists()) throw new Error("Ficha não encontrada.");

      const playerData = playerSnapshot.data();

      if (playerData.pendingSessionLink?.requestId !== pendingSessionLink.requestId) {
        throw new Error("A solicitação pendente já foi alterada.");
      }

      transaction.update(playerRef, { pendingSessionLink: deleteField() });

      if (notificationDocRef && notificationSnapshot?.exists()) {
        const notificationData = notificationSnapshot.data();
        const updatedList = (notificationData.list || []).filter(
          (notification: any) => notification.requestId !== pendingSessionLink.requestId
        );

        transaction.update(notificationDocRef, { list: updatedList });
      }
    });

    setShowMessage({
      show: true,
      text: "Solicitação de vínculo cancelada com sucesso.",
    });
  } catch (error: any) {
    setShowMessage({
      show: true,
      text: "Ocorreu um erro ao cancelar a solicitação: " + error.message,
    });
  }
};

export const denySheetLinkRequest = async (
  notification: any,
  sessionId: string,
  setShowMessage: any
) => {
  try {
    const db = getFirestore(firebaseConfig);
    const playerRef = doc(db, "players", notification.sheetId);
    const notificationDocRef = await getNotificationDocumentRef(db, sessionId);

    if (!notificationDocRef) throw new Error("Notificação não encontrada.");

    await runTransaction(db, async (transaction) => {
      const notificationSnapshot = await transaction.get(notificationDocRef);
      const playerSnapshot = await transaction.get(playerRef);

      if (!notificationSnapshot.exists()) {
        throw new Error("Notificação não encontrada.");
      }

      const notificationData = notificationSnapshot.data();
      const updatedList = (notificationData.list || []).filter(
        (item: any) => item.requestId !== notification.requestId
      );

      transaction.update(notificationDocRef, { list: updatedList });

      if (playerSnapshot.exists()) {
        const playerData = playerSnapshot.data();

        if (playerData.pendingSessionLink?.requestId === notification.requestId) {
          transaction.update(playerRef, { pendingSessionLink: deleteField() });
        }
      }
    });

    setShowMessage({
      show: true,
      text: "Solicitação de vínculo recusada.",
    });
  } catch (error: any) {
    setShowMessage({
      show: true,
      text: "Ocorreu um erro ao recusar a solicitação: " + error.message,
    });
  }
};

export const approveSheetLinkRequest = async (
  notification: any,
  session: any,
  setShowMessage: any
) => {
  try {
    const db = getFirestore(firebaseConfig);
    const playerRef = doc(db, "players", notification.sheetId);
    const sessionDocRef = doc(db, "sessions", session.id);
    const notificationDocRef = await getNotificationDocumentRef(db, session.id);

    if (!notificationDocRef) throw new Error("Notificação não encontrada.");

    const result = await runTransaction(db, async (transaction) => {
      const playerSnapshot = await transaction.get(playerRef);
      const sessionSnapshot = await transaction.get(sessionDocRef);
      const notificationSnapshot = await transaction.get(notificationDocRef);

      if (!sessionSnapshot.exists()) throw new Error("Sessão não encontrada.");
      if (!notificationSnapshot.exists()) throw new Error("Notificação não encontrada.");

      const notificationData = notificationSnapshot.data();
      const updatedList = (notificationData.list || []).filter(
        (item: any) => item.requestId !== notification.requestId
      );

      transaction.update(notificationDocRef, { list: updatedList });

      if (!playerSnapshot.exists()) {
        return { accepted: false, reason: "Ficha não encontrada." };
      }

      const playerData = playerSnapshot.data();

      if (playerData.pendingSessionLink?.requestId !== notification.requestId) {
        return {
          accepted: false,
          reason: "A solicitação desta ficha não está mais pendente.",
        };
      }

      transaction.update(playerRef, {
        sessionId: session.id,
        pendingSessionLink: deleteField(),
      });
      transaction.update(sessionDocRef, {
        players: arrayUnion(notification.email),
      });

      return {
        accepted: true,
        sheetName: playerData?.data?.name || "",
      };
    });

    if (!result.accepted) {
      setShowMessage({
        show: true,
        text: result.reason,
      });
      return;
    }

    await ensureConsentForm(session.id, notification.email, setShowMessage);

    const characterName = result.sheetName
      ? `"${capitalizeFirstLetter(result.sheetName)}"`
      : "sem nome";

    await registerHistory(
      session.id,
      {
        message: `A ficha ${characterName} de ${capitalizeFirstLetter(notification.user)} foi vinculada à Sessão.`,
        type: "notification",
      },
      null,
      setShowMessage,
    );

    setShowMessage({
      show: true,
      text: "Ficha vinculada à sessão com sucesso.",
    });
  } catch (error: any) {
    setShowMessage({
      show: true,
      text: "Ocorreu um erro ao aprovar o vínculo da ficha: " + error.message,
    });
  }
};

export const approveUser = async (notification: any, session: any, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const dateMessage = await getOfficialTimeBrazil();
    const sessionsCollectionRef = collection(db, "sessions");
    const sessionDocRef = doc(sessionsCollectionRef, session.id);
    await runTransaction(db, async (transaction) => {
      const sessionDocSnapshot = await getDoc(sessionDocRef);
      if (sessionDocSnapshot.exists()) {
        transaction.update(sessionDocRef, { players: arrayUnion(notification.email) });
        await createConsentForm(session.id, notification.email, setShowMessage);
        const sheet = sheetStructure(notification.email, notification.user, dateMessage);
        await addNewSheetMandatory(session.id, sheet, setShowMessage);
        await registerMessage(
          session.id,
          {
            message: `${capitalizeFirstLetter(notification.user)} iniciou sua jornada nesta Sessão! Seja bem-vindo!`,
            type: "notification",
          },
          null,
          setShowMessage,
        );
        await registerHistory(
          session.id,
          {
            message: `${capitalizeFirstLetter(notification.user)} ingressou na Sessão.`,
            type: "notification",
          },
          null,
          setShowMessage,
        );
        await removeNotification(session.id, notification.message, setShowMessage);
      } else {
        throw new Error("Sessão não encontrada");
      }
    });
  } catch (err: any) {
    setShowMessage({
      show: true,
      text: "Ocorreu um erro ao atualizar os dados da Sessão: " + err.message,
    });
  }
};
