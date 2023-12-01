import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, serverTimestamp } from "firebase/firestore";
import firebaseConfig from "./connection";
import { jwtDecode } from "jwt-decode";

export const clearMessages = async () => {
  const db = getFirestore(firebaseConfig);
  const messagesRef = collection(db, 'chatbot');
  try {
    const querySnapshot = await getDocs(messagesRef);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    window.alert('Erro ao remover dados do chat: ' + error);
  }
};

export const sendMessage = async (text: string) => {
  const token = localStorage.getItem('Segredos Da Fúria');
  if (token) {
    const decodedToken: { email: string, firstName: string, lastName: string } = jwtDecode(token);
    const { email, firstName, lastName } = decodedToken;
    if (text !== '' && text !== ' ') {
      await registerMessage({
        message: text,
        user: firstName + ' ' + lastName,
        email,
        date: serverTimestamp(),
      });
    }
  }
};

export const registerMessage = async (message: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'chatbot');
    const q = query(collectionRef, orderBy('date'));
    const querySnapshot = await getDocs(q);
    const numDocuments = querySnapshot.size;
    const maxDocuments = 19;
    if (numDocuments >= maxDocuments) {
      const oldestDocument = querySnapshot.docs[0];
      await deleteDoc(doc(db, 'chatbot', oldestDocument.id));
    } 
    await addDoc(collectionRef, message);
  } catch (error) {
    window.alert('Ocorreu um erro: ' + error);
  }
};