import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, runTransaction, where } from "firebase/firestore";
import { capitalize } from "./utilities";
import { authenticate } from "./authenticate";
import firebaseConfig from "./connection";
import { registerMessage } from "./messagesAndRolls";
import { createConsentForm } from "./consentForm";

export const getNotificationsById = async (sessionId: string) => {
  const db = getFirestore(firebaseConfig);
  const sessionsCollectionRef = collection(db, 'sessions');
  const sessionDocRef = doc(sessionsCollectionRef, sessionId);
  const sessionDocSnapshot = await getDoc(sessionDocRef);
  if (sessionDocSnapshot.exists()) {
    return sessionDocSnapshot;
  } return false;
};

export const createNotificationData = async (sessionId: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const notificationsCollection = collection(db, 'notifications');
    await addDoc(notificationsCollection, { sessionId, list: [] });
  } catch (err: any) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao criar uma aba de notificação na Sessão: ' + err.message });
  }
};

export const getNotificationBySession = async (sessionId: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'notifications'); 
    const q = query(collectionRef, where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const notificationDoc = querySnapshot.docs[0];
      const notificationData = notificationDoc.data();
      return notificationData.list;
    } return [];
  } catch (err) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao buscar as notificações da Sessão: ' + err });
  }
};

export const requestApproval = async (sessionId: string, setShowMessage: any) => {
  try {
    const authData: any = await authenticate(setShowMessage);
    if (authData && authData.email && authData.displayName) {
      const { email, displayName } = authData;
			const db = getFirestore(firebaseConfig);
      const notificationRef = collection(db, 'notifications');
      const q = query(notificationRef, where('sessionId', '==', sessionId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) setShowMessage({ show: true, text: "Não foi possível localizar a notificação da Sessão fornecida." });
      const notificationDoc = querySnapshot.docs[0];
      const notificationData = notificationDoc.data();
      const notificationDocRef = notificationDoc.ref;
      await runTransaction(db, async (transaction: any) => {
        const updatedList = [
          ...notificationData.list,
          {
            message: `O Usuário ${capitalize(displayName)} de email "${email}" solicitou acesso à sua Sessão.`,
            email: email,
            type: 'approval',
            user: displayName,
          }
        ];
        transaction.update(notificationDocRef, { list: updatedList });
      });
    }
  } catch (error) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao enviar Solicitação: ' + error });
  }
};

export const registerNotification = async (sessionId: string, notification: any, setShowMessage: any) => {
  const db = getFirestore(firebaseConfig);
  const notificationRef = collection(db, 'notifications');
  const q = query(notificationRef, where('sessionId', '==', sessionId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) setShowMessage({ show: true, text: "Não foi possível localizar a notificação da Sessão fornecida." });
  const notificationDoc = querySnapshot.docs[0];
  const notificationData = notificationDoc.data();
  const notificationDocRef = notificationDoc.ref;
  await runTransaction(db, async (transaction: any) => {
    const updatedList = [...notificationData.list, notification];
    transaction.update(notificationDocRef, { list: updatedList });
  });
};

export const removeNotification = async (sessionId: string, message: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, where('sessionId', '==', sessionId));
    await runTransaction(db, async (transaction) => {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setShowMessage({ show: true, text: 'Não foi possível encontrar a notificação.' });
        return;
      }
      const notificationDoc = querySnapshot.docs[0];
      const notificationDocRef = doc(db, 'notifications', notificationDoc.id);
      const notificationData = notificationDoc.data();
      const updatedList = (notificationData.list || []).filter((notification: any) => notification.message !== message);
      transaction.update(notificationDocRef, { list: updatedList });
    });
  } catch (error: any) {
    setShowMessage({ show: true, text: "Ocorreu um erro: " + error.message });
  }
};

export const approveUser = async (notification: any, session: any, setShowMessage: any) => {
    try {
      const db = getFirestore(firebaseConfig);
      const sessionsCollectionRef = collection(db, 'sessions');
      const sessionDocRef = doc(sessionsCollectionRef, session.id);
      await runTransaction(db, async (transaction) => {
        const sessionDocSnapshot = await getDoc(sessionDocRef);
        if (sessionDocSnapshot.exists()) {
          transaction.update(sessionDocRef, { players: arrayUnion(notification.email) });
          await createConsentForm(session.id, notification.email, setShowMessage);
          await registerMessage(
            session.id,
            {
              message: `${capitalize(notification.user)} iniciou sua jornada nesta Sessão! Seja bem-vindo!`,
              type: 'notification',
            },
            null,
            setShowMessage,
          );
          await removeNotification(session.id, notification.message, setShowMessage);
        } else throw new Error('Sessão não encontrada');
      });
    } catch (err: any) {
      setShowMessage({ show: true, text: 'Ocorreu um erro ao atualizar os dados da Sessão: ' + err.message });
    }

};

