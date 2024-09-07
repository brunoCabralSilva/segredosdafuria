import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { getOfficialTimeBrazil } from "./utilities";
import firebaseConfig from "./connection";
import { createNotificationData } from "./notifications";

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
  console.log(sessionList);
  return sessionList;
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
      name: nameSession.toLowerCase(),
      creationDate: dateMessage,
      gameMaster: email,
      anotations: '',
      description,
      players: [],
      chat: [],
    });
    await createNotificationData(docRef.id);
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