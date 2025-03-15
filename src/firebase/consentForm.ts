import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "./connection";

export const createConsentForm = async (sessionId: string, email: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'consents'); 
    await addDoc(collectionRef, { sessionId, email, list: [],
    });
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    setShowMessage({ show: true, text: 'Erro ao registrar Ficha de Consentimento: ' + errorCode + ' - ' + errorMessage + '. Por favor, atualize a página e tente novvamente' });
    return false;
  }
}

export const getConsentsByEmailAndSessionId = async (email: string, sessionId: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'consents');
    const q = query(collectionRef, where('email', '==', email), where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setShowMessage({ show: true, text: 'Nenhum registro encontrado para o email e sessionId fornecidos.' });
      return null;
    }
    const consent = querySnapshot.docs[0].data();
    return consent;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    setShowMessage({ show: true, text: 'Erro ao buscar Ficha de Consentimento: ' + errorCode + ' - ' + errorMessage });
    return null;
  }
};

export const getConsentsBySessionId = async (sessionId: string, setShowMessage: any) => {
  try {
    const db = getFirestore();
    const collectionRef = collection(db, "consents");
    const q = query(collectionRef, where("sessionId", "==", sessionId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setShowMessage({ show: true, text: "Nenhum registro encontrado para o sessionId fornecido." });
      return [];
    }

    const consents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return consents;
  } catch (error: any) {
    setShowMessage({ show: true, text: `Erro ao buscar Fichas de Consentimento: ${error.code} - ${error.message}` });
    return [];
  }
};

export const updateConsentList = async (email: string, sessionId: string, newList: any[], setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'consents');
    const q = query(collectionRef, where('email', '==', email), where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setShowMessage({ show: true, text: 'Nenhum registro encontrado para o email e sessionId fornecidos.' });
      return false;
    }
    const consentDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, 'consents', consentDoc.id), {
      list: newList
    });
    return true;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    setShowMessage({ show: true, text: 'Erro ao atualizar Ficha de Consentimento: ' + errorCode + ' - ' + errorMessage });
    return false;
  }
};

export const deleteConsent = async (email: string, sessionId: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'consents');
    const q = query(collectionRef, where('email', '==', email), where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setShowMessage({ show: true, text: 'Nenhum registro encontrado para o email e sessionId fornecidos.' });
      return;
    }
    const docRef = doc(db, 'consents', querySnapshot.docs[0].id);
    await deleteDoc(docRef);
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    setShowMessage({ show: true, text: 'Erro ao excluir Ficha de Consentimento: ' + errorCode + ' - ' + errorMessage });
  }
};


