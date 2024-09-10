import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { capitalize, getOfficialTimeBrazil } from "./utilities";
import firebaseConfig from "./connection";
import { createNotificationData, registerNotification } from "./notifications";
import { createChatData } from "./chats";
import { createPlayersData } from "./players";

export const getSessions = async () => {
  const db = getFirestore(firebaseConfig);
  const collectionRef = collection(db, 'sessions2');
  const querySnapshot = await getDocs(collectionRef);
  const sessionsList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return sessionsList;
};

export const getSessionByName = async (nameSession: string) => {
  const db = getFirestore(firebaseConfig);
  const sessionsCollection = collection(db, 'sessions2');
  const querySnapshot = await getDocs(query(sessionsCollection, where('name', '==', nameSession)));
  let sessionList: any;
  if (!querySnapshot.empty) sessionList = querySnapshot.docs[0].data();
  return sessionList;
};

export const getSessionById = async (sessionId: string) => {
  const db = getFirestore(firebaseConfig);
  const sessionsCollectionRef = collection(db, 'sessions2');
  const sessionDocRef = doc(sessionsCollectionRef, sessionId);
  const sessionDocSnapshot = await getDoc(sessionDocRef);
  if (sessionDocSnapshot.exists()) {
    return sessionDocSnapshot.data();
  } return null;
};

export const getNameAndDmFromSessions = async (sessionId: string) => {
  const db = getFirestore(firebaseConfig);
  const sessionsCollectionRef = collection(db, 'sessions2');
  const sessionDocRef = doc(sessionsCollectionRef, sessionId);
  const sessionDocSnapshot = await getDoc(sessionDocRef);
  if (sessionDocSnapshot.exists()) {
    return sessionDocSnapshot.data();
  } return null;
};

export const createSession = async (
  nameSession: string,
  description: string,
  email: string,
) => {
  try {
    const dateMessage = await getOfficialTimeBrazil();
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'sessions2'); 
    const docRef = await addDoc(collectionRef, {
      name: nameSession.toLowerCase(), creationDate: dateMessage, gameMaster: email, anotations: '', description,
    });
    await createNotificationData(docRef.id);
    await createPlayersData(docRef.id);
    await createChatData(docRef.id);
    return docRef.id;
  } catch(err)  {
    throw new Error ('Ocorreu um erro ao criar uma sessão: ' + err);
  }
};

export const clearHistory = async (id: string) => {
  try {
    const db = getFirestore(firebaseConfig);
    const docRef = doc(db, 'sessions2', id);
    await updateDoc(docRef, { chat: [] });
  } catch (err) {
    throw new Error('Ocorreu um erro ao limpar o histórico de chat: ' + err);
  }
};

export const leaveFromSession = async (sessionId: string, email: string, name: string) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'players');
    const q = query(collectionRef, where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const dataDoc = querySnapshot.docs[0];
      const data = dataDoc.data();
      data.list = data.list.filter((player: any) => player.email !== email);
      const docRef = doc(db, 'players', dataDoc.id);
      const dataNotification = {
        message: `Olá, tudo bem? O jogador ${capitalize(name)} saiu desta sala. Você pode integrá-lo novamente, caso o mesmo solicite novamente acessar esta sessão.`,
        type: 'transfer',
      };
      await updateDoc(docRef, { list: data.list });
      await registerNotification(sessionId, dataNotification);
      window.alert("Esperamos que sua jornada nessa Sessão tenha sido divertida e gratificante. Até logo!");
    } else throw new Error('Sessão não encontrada.');
  } catch (err) {
    throw new Error('Ocorreu um erro ao atualizar os dados do Jogador: ' + err);
  }
};