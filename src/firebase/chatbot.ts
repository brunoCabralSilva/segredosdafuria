import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "./connection";
import { authenticate } from "./login";

export const getHoraOficialBrasil = async () => {
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/America/Sao_Paulo');
    const data = await response.json();
    const date = new Date(data.utc_datetime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`;
    return formattedDate;
  } catch (error) {
    return null;
  }
};

export const sendMessage = async (text: string, sessionName: string) => {
  const authData: { email: string, name: string } | null = await authenticate();
  try {
    if (authData && authData.email && authData.name) {
      const { email, name } = authData;
      if (text !== '' && text !== ' ') {
        await registerMessage({
          message: text,
          user: name,
          email,
        },
        sessionName);
      }
    }
  } catch (error) {
    window.alert('Erro ao obter valor da Forma: ' + error);
  }
};

export const registerMessage = async (message: any, sessionName: string) => {
  const dateMessage = await getHoraOficialBrasil();
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'sessions');
    const q: any = query(collectionRef, where('name', '==', sessionName));
    const querySnapshot = await getDocs(q);
    const querySnap: any = querySnapshot.docs[0].data();
    const docRef = querySnapshot.docs[0].ref;
    const chatArray = querySnap.chat;
    const updatedChatArray = [...chatArray, { ...message, date: dateMessage }];
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