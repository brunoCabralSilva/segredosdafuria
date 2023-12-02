import { arrayUnion, collection, deleteDoc, getDocs, getFirestore, orderBy, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "./connection";
import { jwtDecode } from "jwt-decode";

export const clearMessages = async (sessionName: string) => {
  const db = getFirestore(firebaseConfig);
  const sessionsRef = collection(db, 'sessions');
  try {
    const querySnapshot = await getDocs(
      query(sessionsRef, where('name', '==', sessionName))
    )
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, { chat: '' });
    });
  } catch (error) {
    window.alert('Erro ao limpar o campo chat: ' + error);
  }
};

export const sendMessage = async (text: string, sessionName: string) => {
  const token = localStorage.getItem('Segredos Da Fúria');
  if (token) {
    const decodedToken: { email: string, firstName: string, lastName: string } = jwtDecode(token);
    const { email, firstName, lastName } = decodedToken;
    if (text !== '' && text !== ' ') {
      await registerMessage({
        message: text,
        user: firstName + ' ' + lastName,
        email,
      },
      sessionName);
    }
  }
};

export const registerMessage = async (message: any, sessionName: string) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'sessions');
    const q: any = query(collectionRef, where('name', '==', sessionName));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        chat: arrayUnion({ ...message, date: Date.now() })
      });
    }
  } catch (error) {
    window.alert('Ocorreu um erro: ' + error);
  }
};