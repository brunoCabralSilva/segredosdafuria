import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "./connection";
import { authenticate, signIn } from "./login";
import { registerMessage } from "./chatbot";
import { actionDeleteUserFromSession } from "@/redux/slice";

export const getAllSessions = async () => {
  const db = getFirestore(firebaseConfig);
  const collectionRef = collection(db, 'sessions');
  const querySnapshot = await getDocs(collectionRef);
  const sessionsList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return sessionsList;
};

export const getSessionByName = async (nameSession: string) => {
  const db = getFirestore(firebaseConfig);
  const sessionsCollection = collection(db, 'sessions');
  const querySnapshot = await getDocs(query(sessionsCollection, where('name', '==', nameSession)));
  let sessionList: any;
  if (!querySnapshot.empty) sessionList = querySnapshot.docs[0].data();
  return { list: sessionList, collection: sessionsCollection};
};

export const getSessionById = async (sessionId: string) => {
  const db = getFirestore(firebaseConfig);
  const sessionsCollectionRef = collection(db, 'sessions');
  const sessionDocRef = doc(sessionsCollectionRef, sessionId);
  const sessionDocSnapshot = await getDoc(sessionDocRef);
  if (sessionDocSnapshot.exists()) {
    return sessionDocSnapshot.data();
  } return null;
};

export const getNameAndDmFromSessions = async (sessionId: string) => {
  const db = getFirestore(firebaseConfig);
  const sessionsCollectionRef = collection(db, 'sessions');
  const sessionDocRef = doc(sessionsCollectionRef, sessionId);
  const sessionDocSnapshot = await getDoc(sessionDocRef);
  if (sessionDocSnapshot.exists()) {
    return sessionDocSnapshot.data();
  } return null;
};

export const getUserByIdSession = async(sessionId: string, email: string) => {
  try {
    const db = getFirestore(firebaseConfig);
    const sessionsCollectionRef = collection(db, 'sessions');
    const sessionDocRef = doc(sessionsCollectionRef, sessionId);
    const sessionDocSnapshot = await getDoc(sessionDocRef);
    if (sessionDocSnapshot.exists()) {
      const players = sessionDocSnapshot.data().players;
      const player: any = players.find((gp: any) => gp.email === email);
      return player;
    } return null;
  } catch (error) {
    window.alert('Erro ao obter valor da Forma: ' + error);
  }
};

export const getUserAndDataByIdSession = async(sessionId: string) => {
  try {
    const db = getFirestore(firebaseConfig);
    const sessionRef = doc(collection(db, 'sessions'), sessionId);
    const sessionDocSnapshot = await getDoc(sessionRef);
    let players = [];
  if (sessionDocSnapshot.exists()) {
    const sessionData = sessionDocSnapshot.data();
    players = sessionData.players;
  }
  return { players, sessionRef };
  } catch (error) {
    window.alert('Erro ao obter valor da Forma: ' + error);
  }
};

export const getChatAndDataByIdSession = async(sessionId: string) => {
  try {
    const db = getFirestore(firebaseConfig);
    const sessionRef = doc(collection(db, 'sessions'), sessionId);
    const sessionDocSnapshot = await getDoc(sessionRef);
    let chat = [];
  if (sessionDocSnapshot.exists()) {
    const sessionData = sessionDocSnapshot.data();
    chat = sessionData.chat;
  }
  return { chat, sessionRef };
  } catch (error) {
    window.alert('Erro ao obter valor da Forma: ' + error);
  }
};

export const leaveFromSession = async (slice: any, dispatch: any, router: any) => {
  const db = getFirestore(firebaseConfig);
  const authData: { email: string, name: string } | null = await authenticate();
  try {
    if (authData && authData.email && authData.name) {
        const { email, name } = authData;
        const sessionDocRef = doc(db, 'sessions', slice.sessionId);
        const sessionDocSnapshot = await getDoc(sessionDocRef);

        if (sessionDocSnapshot.exists()) {
        const sessionDoc = sessionDocSnapshot.data();
        const filterListPlayer = sessionDoc.players.filter((player: any) => player.email !== email);

        if (filterListPlayer.length === 0) {
          await deleteDoc(sessionDocRef);
        } else {
            let oldestPlayer = filterListPlayer[0];
            for (let i = 0; i <= filterListPlayer.length - 1; i += 1) {
                if (filterListPlayer[i].creationDate < oldestPlayer.creationDate) {
                    oldestPlayer = filterListPlayer[i];
                }
            }
            const updatedNotifications = [{
              message: `Olá, tudo bem? O jogador ${name} saiu desta sala. Você pode integrá-lo novamente, caso o mesmo solicite novamente acessar esta sessão.`,
              type: 'transfer',
            }];

            await updateDoc(sessionDocRef, {
              players: filterListPlayer,
              dm: oldestPlayer.email,
              notifications: updatedNotifications,
            });

            await registerMessage({
              message: `O jogador ${name} saiu definitivamente desta sala.`,
              user: 'notification',
              email: email,
            }, sessionDoc.name); // Se quiser usar o nome da sessão, você pode acessá-lo diretamente de sessionDoc

            dispatch(actionDeleteUserFromSession(false));
            window.alert("Esperamos que sua jornada nessa Sessão tenha sido divertida e gratificante. Até logo!");
            router.push('/sessions');
          }
        } else {
          const sign = await signIn();
          if (!sign) {
            window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
            router.push('/');
          }
        }
      }
  } catch (error) {
    window.alert("Ocorreu um erro ao tentar remover a Sessão: " + error);
  }
};