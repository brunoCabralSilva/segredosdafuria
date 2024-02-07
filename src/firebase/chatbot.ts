import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "./connection";
import { authenticate } from "./login";
import moment from 'moment';
import 'moment-timezone';

export const getHoraOficialBrasil = () => {
  const horaSaoPaulo = moment().tz('America/Sao_Paulo').format();
  return horaSaoPaulo;
}

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
  const dateMessage = getHoraOficialBrasil();
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