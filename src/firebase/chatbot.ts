import { addDoc, collection, deleteDoc, getDocs, getFirestore, serverTimestamp } from "firebase/firestore";
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
    window.alert('Erro ao remover dados da coleção:' + error);
  }
};

export const sendMessage = async (text: string) => {
  const db = getFirestore(firebaseConfig);
  const messageRef = collection(db, "chatbot");
  const token = localStorage.getItem('Segredos Da Fúria');
  if (token) {
    const decodedToken: { email: string, firstName: string, lastName: string } = jwtDecode(token);
    const { email, firstName, lastName } = decodedToken;
    if (text !== '' && text !== ' ') {
      await addDoc(
        messageRef,
        {
          message: text,
          user: firstName + ' ' + lastName,
          email,
          date: serverTimestamp(),
        }
      );
    }
  }
};