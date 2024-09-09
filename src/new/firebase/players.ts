import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import firebaseConfig from "./connection";

export const createPlayersData = async(sessionId: string) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'players'); 
    const docRef = await addDoc(collectionRef, { sessionId, list: [] });
  } catch(err)  {
    throw new Error ('Ocorreu um erro ao criar jogadores para a Sessão: ' + err);
  }
};

export const getPlayersBySession = async (sessionId: string) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'players'); 
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