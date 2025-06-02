import { addDoc, collection, getDocs, getFirestore, query, runTransaction, where } from "firebase/firestore";
import firebaseConfig from "./connection";
import { authenticate } from "./authenticate";
import { getOfficialTimeBrazil } from "./utilities";

export const createHistory = async (sessionId: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'history'); 
    await addDoc(collectionRef, { sessionId, list: [] });
    await registerHistory(sessionId, { message: `Sessão inicializada.`, type: 'notification' }, null, setShowMessage);
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    setShowMessage({ show: true, text: 'Erro ao registrar Histórico: ' + errorCode + ' - ' + errorMessage + '. Por favor, atualize a página e tente novvamente' });
    return false;
  }
}

export const registerHistory = async (sessionId: string, data: any, email: string | null, setShowMessage: any) => {
	try {
	  const authData: any = await authenticate(setShowMessage);
	  if (authData && authData.email && authData.displayName) {
		const date = await getOfficialTimeBrazil();
		const db = getFirestore(firebaseConfig);
		const chatsCollectionRef = collection(db, 'history');
		const querySession = query(chatsCollectionRef, where("sessionId", "==", sessionId));
		const querySnapshot = await getDocs(querySession);
		if (!querySnapshot.empty) {
			const sessionDocRef = querySnapshot.docs[0].ref;
			await runTransaction(db, async (transaction: any) => {
        const sessionDocSnapshot = await transaction.get(sessionDocRef);
        if (sessionDocSnapshot.exists()) {
          let emailToRecord = email;
          if (!emailToRecord) emailToRecord = authData.email;
          const sessionData = sessionDocSnapshot.data();
          const updatedChat = [
          ...sessionData.list,
          { date, email: emailToRecord, user: authData.displayName, ...data, order: sessionData.list.length + 1 },
          ];
          transaction.update(sessionDocRef, { list: updatedChat });
        } else {
          setShowMessage({ show: true, text: "Não foi possível localizar a Sessão. Por favor, atualize a página e tente novamente." });
        }
		  });
		}
	  }
	} catch (error) {
	  setShowMessage({ show: true, text: 'Ocorreu um erro ao enviar a mensagem: ' + error });
	}
};