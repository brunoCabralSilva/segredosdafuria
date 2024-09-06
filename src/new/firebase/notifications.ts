import { collection, doc, getDoc, getFirestore, runTransaction } from "firebase/firestore";
import { capitalize } from "./utilities";
import { authenticate } from "./authenticate";
import firebaseConfig from "./connection";

export const getNotificationsById = async (sessionId: string) => {
  const db = getFirestore(firebaseConfig);
  const sessionsCollectionRef = collection(db, 'sessions2');
  const sessionDocRef = doc(sessionsCollectionRef, sessionId);
  const sessionDocSnapshot = await getDoc(sessionDocRef);
  if (sessionDocSnapshot.exists()) {
    return sessionDocSnapshot;
  } return false;
};

export const requestApproval = async (sessionId: string) => {
  try {
    const authData: any = await authenticate();
    if (authData && authData.email && authData.displayName) {
      const { email, displayName } = authData;
			const db = getFirestore(firebaseConfig);
      await runTransaction(db, async (transaction: any) => {
				const sessionDocRef = doc(db, 'sessions2', sessionId);
        const sessionDocSnapshot = await transaction.get(sessionDocRef);
        if (sessionDocSnapshot.exists()) {
          const sendNot = sessionDocSnapshot.data();
          const updatedNotifications = [
            ...sendNot.notifications,
            {
              message: `O Usuário ${capitalize(displayName)} de email "${email}" solicitou acesso à sua Sessão.`,
              email: email,
              type: 'approval',
              user: displayName,
            }
          ];
          transaction.update(sessionDocSnapshot.ref, { notifications: updatedNotifications });
        } else {
          throw new Error("Não foi possível localizar a Sessão. Por favor, atualize a página e tente novamente.");
        }
      });
    }
  } catch (error) {
    throw new Error('Ocorreu um erro ao enviar Solicitação: ' + error);
  }
};