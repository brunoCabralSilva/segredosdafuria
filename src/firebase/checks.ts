import { IDataValues, IUser } from "@/interface";
import { collection, getDocs, getFirestore, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "./connection";
import { jwtDecode } from "jwt-decode";
import { registerMessage } from "./chatbot";

const isEmpty = (obj: any) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

export const returnValue = async (
  atrSelected: string,
  sklSelected: string,
  renSelected: string
): Promise<IDataValues | null> => {
  const db = getFirestore(firebaseConfig);
  const token = localStorage.getItem('Segredos Da Fúria');
  if (token) {
    try {
      const decodedToken: { email: string } = jwtDecode(token);
      const { email } = decodedToken;
      const userQuery = query(collection(db, 'users'), where('email', '==', email));
      const userQuerySnapshot = await getDocs(userQuery);
      if (!isEmpty(userQuerySnapshot.docs)) {
        const userData = userQuerySnapshot.docs[0].data();
        let renown = 0;
        let skill = 0;
        let atr = 0;
        if (atrSelected !== '') renown = userData.characterSheet[0].data.attributes[atrSelected];
        if (renSelected !== '') renown = userData.characterSheet[0].data[renSelected];
        if (sklSelected !== '') skill = userData.characterSheet[0].data.skills[sklSelected].value;
        return {
          renown: renown,
          rage: userData.characterSheet[0].data.rage,
          skill: skill,
          attribute: atr,
        }
      } else {
        window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        return null;
      }
    } catch (error) {
      window.alert('Erro ao obter valor do atributo: ' + error);
    }
  } return null;
};

export const returnRageCheck = async (rageCheck: number, type="manual") => {
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
    const { firstName, lastName, email }: IUser = jwtDecode(token);
    const decodedToken: { email: string } = jwtDecode(token);
    const { email: emailUser } = decodedToken;
    const userQuery = query(collection(db, 'users'), where('email', '==', emailUser));
    const userQuerySnapshot = await getDocs(userQuery);
    if (!isEmpty(userQuerySnapshot.docs)) {
      const userDocRef = userQuerySnapshot.docs[0].ref;
      const userData = userQuerySnapshot.docs[0].data();
      if (userData.characterSheet && userData.characterSheet.length > 0) {
        if (userData.characterSheet[0].data.rage <= 0) {
          userData.characterSheet[0].data.rage = 0;
          await registerMessage({
            message: 'Você não possui Fúria para realizar esta ação. Após chegar a zero pontos de Fúria, o Garou perde o Lobo e não pode realizar ações como usar dons, mudar de forma, dentre outros.',
            user: firstName + ' ' + lastName,
            email: email,
            date: serverTimestamp(),
          });
        } else {
          if (userData.characterSheet[0].data.rage - success < 0) {
            userData.characterSheet[0].data.rage = 0;
          } else {
            userData.characterSheet[0].data.rage = userData.characterSheet[0].data.rage - (resultOfRage.length - success);
          }
          await registerMessage({
            message: {
              rollOfRage: resultOfRage,
              success,
              cause: type,
              rage: userData.characterSheet[0].data.rage,
            },
            user: firstName + ' ' + lastName,
            email: email,
            date: serverTimestamp(),
          });
        }
        await updateDoc(userDocRef, { characterSheet: userData.characterSheet });
      }
    } else {
      window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
    }
  }
};

export const registerRoll = async (
  dificulty: number,
  penaltyOrBonus: number,
  atrSelected: string,
  sklSelected: string,
  renSelected: string,
) => {
  const dtSheet: IDataValues | null = await returnValue(atrSelected, sklSelected, renSelected);
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
          date: serverTimestamp(),
        }) 
      } else {
        await registerMessage({
          message: `A soma dos dados é menor que a dificuldade imposta. Sendo assim, a falha no teste foi automática (São ${resultOf.length + resultOfRage.length + penaltyOrBonus } dados para um Teste de Dificuldade ${dificulty}).`,
          user: firstName + ' ' + lastName,
          email: email,
          date: serverTimestamp(),
        });
      }
    }
  }
};