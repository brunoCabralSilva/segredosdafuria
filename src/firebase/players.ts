import { addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "./connection";
import { registerMessage } from "./messagesAndRolls";

export const createPlayersData = async(sessionId: string) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'players'); 
    await addDoc(collectionRef, { sessionId, list: [] });
  } catch(err)  {
    throw new Error ('Ocorreu um erro ao criar jogadores para a Sessão: ' + err);
  }
};

export const getPlayersBySession = async (sessionId: string) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'players'); 
    const q = query(collectionRef, where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const dataDoc = querySnapshot.docs[0];
      const data = dataDoc.data();
      return data.list;
    } return [];
  } catch (err) {
    throw new Error('Ocorreu um erro ao buscar os usuários da Sessão: ' + err);
  }
};

export const getPlayerByEmail = async (sessionId: string, email: string) => {
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
    throw new Error('Ocorreu um erro ao buscar o Jogador na Sessão: ' + err);
  }
};

export const updateDataPlayer = async (sessionId: string, email: string, newData: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'players');
    const q = query(collectionRef, where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const dataDoc = querySnapshot.docs[0];
      const data = dataDoc.data();
      const playerIndex = data.list.findIndex((item: any) => item.email === email);
      if (playerIndex !== -1) {
        data.list[playerIndex].data = newData;
        const docRef = doc(db, 'players', dataDoc.id);
        await updateDoc(docRef, { list: data.list });
      } else throw new Error('Jogador não encontrado.');
    } else throw new Error('Sessão não encontrada.');
  } catch (err) {
    throw new Error('Ocorreu um erro ao atualizar os dados do Jogador: ' + err);
  }
};

export const updateDataWithRage = async (sessionId: string, email: string, newData: any, nameForm: string) => {
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
    const newRage = newData.rage - (resultOfRage.length - success);
    if (newRage < 0) newData.rage = 0;

    newData.rage = newRage;

    let textNumberofChecks = '';
    let textActualRage = '';
    let textForm = '.';
    if (nameForm) textForm = ' por mudar para a forma ' + nameForm + '.';
    if (numberOfChecks === 2) {
      textNumberofChecks = 'Foram realizados dois Testes de Fúria';
      if (success === 2) textActualRage = 'Obteve sucesso nos dois testes e a Fúria foi mantida.';
      else if (success === 1) textActualRage = 'Obteve um sucesso e uma falha no Teste. A Fúria foi reduzida para ' + newData.rage + '.'
      else textActualRage = 'Falhou nos dois Testes. A fúria foi reduzida para ' + newData.rage + '.';
    } else {
      textNumberofChecks = 'Foi realizado um Teste de Fúria';
      if (success === 0) textActualRage = 'Não obteve sucesso no Teste. A Fúria foi reduzida para ' + newData.rage + '.';
      else textActualRage = 'Obteve sucesso no Teste. A fúria foi mantida.';
    }
    await registerMessage(
      sessionId,
      {
        message: textNumberofChecks + textForm,
        rollOfRage: resultOfRage,
        result: textActualRage,
        rage: newData.rage,
        success,
        type: 'rage-check',
      },
      email,
    );
    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'players');
    const q = query(collectionRef, where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const dataDoc = querySnapshot.docs[0];
      const data = dataDoc.data();
      const playerIndex = data.list.findIndex((item: any) => item.email === email);
      if (playerIndex !== -1) {
        data.list[playerIndex].data = newData;
        const docRef = doc(db, 'players', dataDoc.id);
        await updateDoc(docRef, { list: data.list });
      } else throw new Error('Jogador não encontrado.');
    } else throw new Error('Sessão não encontrada.');
  } catch (err) {
    throw new Error('Ocorreu um erro ao atualizar os dados do Jogador: ' + err);
  }
};