import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, runTransaction, where } from "firebase/firestore";
import firebaseConfig from "./connection";
import { registerMessage } from "./messagesAndRolls";

export const createPlayersData = async (sessionId: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'players');
    await addDoc(collectionRef, { sessionId, list: [] });
  } catch (err: any) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao criar jogadores para a Sessão: ' + err.message });
  }
};

export const getPlayersBySession = async (sessionId: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const sessionRef = doc(db, 'sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    if (sessionSnap.exists()) return sessionSnap.data().players;
    return null;
  } catch (err) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao buscar a Sessão: ' + err });
    return null;
  }
};


export const getPlayerById = async (id: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const docRef = doc(db, 'players', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data();
    else {
      setShowMessage({ show: true, text: 'Jogador não encontrado.' });
      return null;
    }
  } catch (err) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao buscar o jogador: ' + err });
    return null;
  }
};


export const getPlayerByEmail = async (sessionId: string, email: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'players'); 
    const q = query(collectionRef, where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const dataDoc = querySnapshot.docs[0];
      const data = dataDoc.data();
      return data.list.find((item: any) => item.email === email);
    } return [];
  } catch (err) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao buscar o Jogador na Sessão: ' + err });
  }
};

export const updateDataPlayer = async (
  id: string,
  newData: any,
  setShowMessage: any
) => {
  try {
    const db = getFirestore(firebaseConfig);
    const docRef = doc(db, 'players', id);
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);
      if (!docSnap.exists()) {
        setShowMessage({ show: true, text: 'Jogador não encontrado.' });
        return;
      }
      transaction.update(docRef, newData);
    });
  } catch (err: any) {
    setShowMessage({
      show: true,
      text: 'Ocorreu um erro ao atualizar os dados do Jogador: ' + err.message,
    });
  }
}
 
  // try {
  //   const db = getFirestore(firebaseConfig);
  //   const collectionRef = collection(db, 'players');
  //   const q = query(collectionRef, where('sessionId', '==', sessionId));
  //   await runTransaction(db, async (transaction) => {
  //     const querySnapshot = await getDocs(q);
  //     if (querySnapshot.empty) {
  //       setShowMessage({ show: true, text: 'Sessão não encontrada.' });
  //       return;
  //     }
  //     const dataDoc = querySnapshot.docs[0];
  //     const docRef = doc(db, 'players', dataDoc.id);
  //     const data = dataDoc.data();
  //     const playerIndex = data.list.findIndex((item: any) => item.email === email);  
  //     if (playerIndex !== -1) {
  //       data.list[playerIndex].data = newData;
  //       transaction.update(docRef, { list: data.list });
  //     } else setShowMessage({ show: true, text: 'Jogador não encontrado.' });
  //   });
  // } catch (err: any) {
  //   setShowMessage({ show: true, text: 'Ocorreu um erro ao atualizar os dados do Jogador: ' + err.message });
  // }

export const updateValueOfSheet = async (setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'players');
    const querySnapshot = await getDocs(collectionRef);

    if (querySnapshot.empty) {
      setShowMessage({ show: true, text: 'Nenhum jogador encontrado.' });
      return;
    }

    await runTransaction(db, async (transaction) => {
      querySnapshot.forEach((playerDoc) => {
        const playerData = playerDoc.data();
        const docRef = doc(db, 'players', playerDoc.id);
        if (Array.isArray(playerData.list)) {
          const updatedList = playerData.list.map((item: any) => {
            return {
              ...item,
              data: {
                ...item.data,
                skills: { ...item.data.skills, type: '' },
              }
            };
          });
          transaction.update(docRef, { list: updatedList });
        }
      });
    });
    setShowMessage({ show: true, text: 'Todos os jogadores foram atualizados com sucesso.' });
  } catch (err: any) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao atualizar os jogadores: ' + err.message });
  }
};

export const updateDataWithRage = async (sessionId: string, email: string, sheetId: string, newData: any, nameForm: string, setShowMessage: any) => {
  try {
    let numberOfChecks = 1;
    if (nameForm === 'Crinos') numberOfChecks = 2;
    let resultOfRage = [];
    let success = 0;
    for (let i = 0; i < numberOfChecks; i += 1) {
      const value = Math.floor(Math.random() * 10) + 1;
      if (value >= 6) success += 1;
      resultOfRage.push(value);
    }
    const newRage = newData.data.rage - (resultOfRage.length - success);
    if (newRage < 0) newData.data.rage = 0;

    newData.data.rage = newRage;

    let textNumberofChecks = '';
    let textActualRage = '';
    let textForm = '.';
    if (nameForm) textForm = ' por mudar para a forma ' + nameForm + '.';
    if (numberOfChecks === 2) {
      textNumberofChecks = 'Foram realizados dois Testes de Fúria';
      if (success === 2) textActualRage = 'Obteve sucesso nos dois testes e a Fúria foi mantida.';
      else if (success === 1) textActualRage = 'Obteve um sucesso e uma falha no Teste. A Fúria foi reduzida para ' + newData.data.rage + '.'
      else textActualRage = 'Falhou nos dois Testes. A fúria foi reduzida para ' + newData.data.rage + '.';
    } else {
      textNumberofChecks = 'Foi realizado um Teste de Fúria';
      if (success === 0) textActualRage = 'Não obteve sucesso no Teste. A Fúria foi reduzida para ' + newData.data.rage + '.';
      else textActualRage = 'Obteve sucesso no Teste. A fúria foi mantida.';
    }
    await registerMessage(
      sessionId,
      {
        message: textNumberofChecks + textForm,
        rollOfRage: resultOfRage,
        result: textActualRage,
        rage: newData.data.rage,
        success,
        type: 'rage-check',
      },
      email,
      setShowMessage,
    );
    const db = getFirestore(firebaseConfig);
    const docRef = doc(db, 'players', sheetId);
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);
      if (!docSnap.exists()) {
        setShowMessage({ show: true, text: 'Jogador não encontrado.' });
        return;
      }
      transaction.update(docRef, { ...newData });
    });
  } catch (err) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao atualizar os dados do Jogador: ' + err });
  }
};

export const addNewSheet = async (sessionId: string, sheet: any, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const sessionsCollectionRef = collection(db, 'players');
    const newDoc = { sessionId: sessionId, ...sheet };
    await addDoc(sessionsCollectionRef, newDoc);
    setShowMessage('Nova ficha criada com sucesso');
  } catch (error: any) {
    setShowMessage('Ocorreu um erro ao criar uma nova Ficha: ' + error.message);
  }
};

export const addNewSheetMandatory = async (sessionId: string, sheet: any, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const sessionsCollectionRef = collection(db, 'players');
    const newDocRef = await addDoc(sessionsCollectionRef, { sessionId, ...sheet });
    setShowMessage('Nova ficha criada com sucesso');
    return newDocRef.id;
  } catch (error: any) {
    setShowMessage('Ocorreu um erro ao criar uma nova Ficha: ' + error.message);
    return '';
  }
};

export const removePlayerFromSession = async (sessionId: string, email: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const sessionsCollectionRef = collection(db, 'players');
    const q = query(sessionsCollectionRef, where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);
    const docRef = querySnapshot.docs[0].ref;
    await runTransaction(db, async (transaction) => {
      const docSnapshot = await transaction.get(docRef);
      const data = docSnapshot.data();
      if (!data?.list || data.list.length === 0) {
        setShowMessage({ show: true, text: 'Nenhum jogador encontrado na sessão.' });
        return;
      }
      const updatedList = data.list.filter((player: any) => player.email !== email);
      if (updatedList.length !== data.list.length) {
        transaction.update(docRef, { list: updatedList });
        setShowMessage({ show: true, text: 'Jogador removido com sucesso.' });
      } else {
        setShowMessage({ show: true, text: 'Jogador não encontrado na sessão.' });
      }
    });
  } catch (error: any) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao remover o jogador: ' + error.message });
  }
};