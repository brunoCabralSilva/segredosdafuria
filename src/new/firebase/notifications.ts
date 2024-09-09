import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, runTransaction, updateDoc, where } from "firebase/firestore";
import { capitalize, getOfficialTimeBrazil } from "./utilities";
import { authenticate } from "./authenticate";
import firebaseConfig from "./connection";
import { sheetStructure } from "@/components/sheet/sheet";
import { registerMessage } from "./messagesAndRolls";

export const getNotificationsById = async (sessionId: string) => {
  const db = getFirestore(firebaseConfig);
  const sessionsCollectionRef = collection(db, 'sessions2');
  const sessionDocRef = doc(sessionsCollectionRef, sessionId);
  const sessionDocSnapshot = await getDoc(sessionDocRef);
  if (sessionDocSnapshot.exists()) {
    return sessionDocSnapshot;
  } return false;
};

export const createNotificationData = async(sessionId: string) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'notifications'); 
    const docRef = await addDoc(collectionRef, { sessionId, list: [] });
  } catch(err)  {
    throw new Error ('Ocorreu um erro ao criar uma aba de notificação na Sessão: ' + err);
  }
};

export const getNotificationBySession = async (sessionId: string) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'notifications'); 
    const q = query(collectionRef, where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw new Error("Nenhuma notificação encontrada para a sessão fornecida.");
    const notificationDoc = querySnapshot.docs[0];
    const notificationData = notificationDoc.data();
    return notificationData.list || [];
  } catch (err) {
    throw new Error('Ocorreu um erro ao buscar as notificações da Sessão: ' + err);
  }
};

export const requestApproval = async (sessionId: string) => {
  try {
    const authData: any = await authenticate();
    if (authData && authData.email && authData.displayName) {
      const { email, displayName } = authData;
			const db = getFirestore(firebaseConfig);
      const notificationRef = collection(db, 'notifications');
      const q = query(notificationRef, where('sessionId', '==', sessionId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) throw new Error("Não foi possível localizar a notificação da Sessão fornecida.");
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
    throw new Error('Ocorreu um erro ao enviar Solicitação: ' + error);
  }
};

export const removeNotification = async (sessionId: string, message: string) => {
  try {
    const db = getFirestore(firebaseConfig);
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw new Error('Não foi possível encontrar a notificação.');
    const notificationDoc = querySnapshot.docs[0];
    const notificationDocRef = doc(db, 'notifications', notificationDoc.id);
    const notificationData = notificationDoc.data();
    const updatedList = (notificationData.list || []).filter((notification: any) => notification.message !== message);
    await updateDoc(notificationDocRef, { list: updatedList });
  } catch (error) {
    window.alert("Ocorreu um erro: " + error);
  }
};

export const approveUser = async (notification: any, sessionId: string) => {
  try {
    const db = getFirestore(firebaseConfig);
    const playersCollectionRef = collection(db, 'players');
    const querySession = query(playersCollectionRef, where("sessionId", "==", sessionId));
    const querySnapshot = await getDocs(querySession);
    if (querySnapshot.empty) {
      throw new Error('Não foi possível localizar a Sessão. Por favor, atualize a página e tente novamente.');
    }
    const playerDocRef = querySnapshot.docs[0].ref;
    await runTransaction(db, async (transaction: any) => {
      const playerDocSnapshot = await transaction.get(playerDocRef);
      const playerData = playerDocSnapshot.data();
      const findByEmail = playerData.list.find((user: any) => user.email === notification.email);
      if (!findByEmail) {
        const dateMessage = await getOfficialTimeBrazil();
        const sheet = sheetStructure(notification.email, notification.user, dateMessage);
        transaction.update(playerDocRef, { list: arrayUnion(sheet) });
        await registerMessage(
          sessionId,
          {
            message: `${capitalize(notification.user)} iniciou sua jornada nesta Sessão! Seja bem-vindo!`,
            type: 'notification',
          },
          null,
        );
        await removeNotification(sessionId, notification.message);
      } else {
        throw new Error('O usuário já está na sessão.');
      }
    });
  } catch (error) {
    window.alert("Ocorreu um erro ao tentar aprovar usuário: " + error);
  }
};

