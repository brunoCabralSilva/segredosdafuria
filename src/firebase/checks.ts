import { IDataValues, IUser } from "@/interface";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "./connection";
import { jwtDecode } from "jwt-decode";
import { registerMessage } from "./chatbot";

export const returnValue = async (
  atrSelected: string,
  sklSelected: string,
  renSelected: string,
  session: string,
): Promise<IDataValues | null> => {
  const db = getFirestore(firebaseConfig);
  const token = localStorage.getItem('Segredos Da Fúria');
  if (token) {
    try {
      const decodedToken: { email: string } = jwtDecode(token);
      const { email } = decodedToken;
      const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
      const userQuerySnapshot = await getDocs(userQuery);
      const players: any = [];
      userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
      const player: any = players.find((gp: any) => gp.email === email);
      let renown = 0;
      let skill = 0;
      let atr = 0;
      if (atrSelected !== '') renown = player.data.attributes[atrSelected];
      if (renSelected !== '') renown = player.data[renSelected];
      if (sklSelected !== '') skill = player.data.skills[sklSelected].value;
      return {
        renown: renown,
        rage: player.data.rage,
        skill: skill,
        attribute: atr,
      } 
    } catch (error) {
      window.alert('Erro ao obter valor do atributo: ' + error);
    }
  } else {
    window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
    return null;
  } return null;
};

export const returnRageCheck = async (rageCheck: number, type: string, session: string ) => {
  let resultOfRage = [];
  let success = 0;
  for (let i = 0; i < rageCheck; i += 1) {
    const value = Math.floor(Math.random() * 10) + 1;
    if (value >= 6) success += 1;
    resultOfRage.push(value);
  }
  const db = getFirestore(firebaseConfig);
  const token = localStorage.getItem('Segredos Da Fúria');
  if (token) {
    try {
      const decodedToken: { email: string, firstName: string, lastName: string } = jwtDecode(token);
      const { email, firstName, lastName } = decodedToken;
      const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
      const userQuerySnapshot = await getDocs(userQuery);
      const players: any = [];
      userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
      const player: any = players.find((gp: any) => gp.email === email);
      if (player.data.rage <= 0) {
        player.data.rage = 0;
        await registerMessage({
          message: 'Você não possui Fúria para realizar esta ação. Após chegar a zero pontos de Fúria, o Garou perde o Lobo e não pode realizar ações como usar dons, mudar de forma, dentre outros.',
          user: firstName + ' ' + lastName,
          email: email
        }, session);
      } else {
        if (player.data.rage - success < 0) {
          player.data.rage = 0;
        } else {
          player.data.rage = player.data.rage - (resultOfRage.length - success);
        }
        await registerMessage({
          message: {
            rollOfRage: resultOfRage,
            success,
            cause: type,
            rage: player.data.rage,
          },
          user: firstName + ' ' + lastName,
          email: email,
        }, session);
      }
      const docRef = userQuerySnapshot.docs[0].ref;
      const playersFiltered = players.filter((gp: any) => gp.email !== email);
      await updateDoc(docRef, { players: [...playersFiltered, player] });
    } catch(error) {
      window.alert('Ocorreu um erro: ' + error);
    }
  }
};

export const registerRoll = async (
  dificulty: number,
  penaltyOrBonus: number,
  atrSelected: string,
  sklSelected: string,
  renSelected: string,
  session: string,
) => {
  const dtSheet: IDataValues | null = await returnValue(atrSelected, sklSelected, renSelected, session);
  if (dtSheet) {
    let rage = dtSheet.rage;
    let resultOfRage = [];
    let resultOf = [];
    let dices = dtSheet.attribute + dtSheet.renown + dtSheet.skill + Number(penaltyOrBonus);
    if (dices > 0) {
      if (dices - dtSheet.rage === 0) dices = 0;
      else if (dices - dtSheet.rage > 0) dices = dices - dtSheet.rage;
      else {
        rage = dices;
        dices = 0;
      };

      for (let i = 0; i < rage; i += 1) {
        const value = Math.floor(Math.random() * 10) + 1;
        resultOfRage.push(value);
      }
  
      for (let i = 0; i < dices; i += 1) {
        const value = Math.floor(Math.random() * 10) + 1;
        resultOf.push(value);
      }
    }
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      const { firstName, lastName, email }: IUser = jwtDecode(token);
      if (dices + rage >= dificulty) {
        await registerMessage({
          message: {
            rollOfMargin: resultOf,
            rollOfRage: resultOfRage,
            dificulty,
            penaltyOrBonus,
          },
          user: firstName + ' ' + lastName,
          email: email,
        }, session) 
      } else {
        await registerMessage({
          message: `A soma dos dados é menor que a dificuldade imposta. Sendo assim, a falha no teste foi automática (São ${resultOf.length + resultOfRage.length + penaltyOrBonus } dados para um Teste de Dificuldade ${dificulty}).`,
          user: firstName + ' ' + lastName,
          email: email,
        }, session);
      }
    }
  }
};