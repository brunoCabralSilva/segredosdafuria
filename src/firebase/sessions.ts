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
  setShowMessage: any
) => {
  try {
    const dateMessage = await getOfficialTimeBrazil();
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'sessions2'); 
    const docRef = await addDoc(collectionRef, {
      name: nameSession.toLowerCase(), creationDate: dateMessage, gameMaster: email, anotations: '', description,
    });
    await createNotificationData(docRef.id, setShowMessage);
    await createPlayersData(docRef.id, setShowMessage);
    await createChatData(docRef.id, setShowMessage);
    return docRef.id;
  } catch(err)  {
    setShowMessage({show: true, text: 'Ocorreu um erro ao criar uma sessão: ' + err });
  }
};

export const clearHistory = async (id: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const docRef = doc(db, 'sessions2', id);
    await updateDoc(docRef, { chat: [] });
  } catch (err) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao limpar o histórico de chat: ' + err });
  }
};

export const leaveFromSession = async (sessionId: string, email: string, name: string, setShowMessage: any) => {
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
      await registerNotification(sessionId, dataNotification, setShowMessage);
      setShowMessage({ show: true, text: "Esperamos que sua jornada nessa Sessão tenha sido divertida e gratificante. Até logo!" });
    } else setShowMessage({ show: true, text: 'Sessão não encontrada.' });
  } catch (err) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao atualizar os dados do Jogador: ' + err });
  }
};

export const getAllSessionsByFunction = async (email: string) => {
  const db = getFirestore(firebaseConfig);
  const playersCollectionRef = collection(db, 'players');
  const playersQuerySnapshot = await getDocs(playersCollectionRef);
  const sessionIds: string[] = [];

  playersQuerySnapshot.forEach((doc) => {
    const data = doc.data();
    if (Array.isArray(data.list)) {
      data.list.forEach((item: any) => {
        if (item.email === email) sessionIds.push(data.sessionId);
      });
    }
  });

  if (sessionIds.length === 0) return { list1: [], list2: [] };

  const sessionsCollectionRef = collection(db, 'sessions2');
  const list1: { id: string; name: string }[] = [];
  const list2: { id: string; name: string }[] = [];

  for (const sessionId of sessionIds) {
    const sessionDoc = await getDoc(doc(sessionsCollectionRef, sessionId));
    if (sessionDoc.exists()) {
      const data = sessionDoc.data();
      if (data.gameMaster === email) {
        list1.push({ id: sessionDoc.id, name: data.name });
      } else {
        list2.push({ id: sessionDoc.id, name: data.name });
      }
    }
  }

  return { list1, list2 };
};
