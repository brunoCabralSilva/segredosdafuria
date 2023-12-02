import { arrayUnion, collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
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
      await updateDoc(doc.ref, { chat: [] });
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
    const querySnap: any = querySnapshot.docs[0].data();
    const docRef = querySnapshot.docs[0].ref;
    const chatArray = querySnap.chat;
    const updatedChatArray = [...chatArray, { ...message, date: Date.now() }];
    updatedChatArray.sort((a, b) => a.date - b.date);
    if (updatedChatArray.length > 15) {
      updatedChatArray.shift();
    }
    await updateDoc(docRef, {
      chat: updatedChatArray
    });
  } catch (error) {
    window.alert('Ocorreu um erro: ' + error);
  }
};