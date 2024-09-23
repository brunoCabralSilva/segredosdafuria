import { addDoc, collection, getFirestore } from "firebase/firestore";
import firebaseConfig from "./connection";
import { getOfficialTimeBrazil } from "./utilities";
import { registerMessage } from "./messagesAndRolls";

export const createChatData = async(sessionId: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const dateMessage = await getOfficialTimeBrazil();
    const collectionRef = collection(db, 'chats'); 
    await addDoc(collectionRef, { sessionId, list: [] });
    await registerMessage(
      sessionId,
      {
        message: `Sessão inicializada em ${dateMessage}. Aprove solicitações de entrada ou adicione novos jogadores para uma melhor interação com a plataforma!`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  } catch(err)  {
    setShowMessage({show: true, text: 'Ocorreu um erro ao criar um chat para a Sessão: ' + err });
  }
};