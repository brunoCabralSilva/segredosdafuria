import { IDataValues } from "@/interface";
import { updateDoc } from "firebase/firestore";
import { registerMessage } from "./chatbot";
import { getUserAndDataByIdSession, getUserByIdSession } from "./sessions";

export const returnValue = async (
  atrSelected: string,
  sklSelected: string,
  renSelected: string,
  sessionId: string,
  email: string,
): Promise<any> => {
    const player = await getUserByIdSession(sessionId, email);
    if (player) {
      let renown = 0;
      let skill = 0;
      let atr = 0;
      if (atrSelected !== '') atr = Number(player.data.attributes[atrSelected]);
      if (renSelected !== '') renown = Number(player.data[renSelected]);
      if (sklSelected !== '') skill = Number(player.data.skills[sklSelected].value);
      return {
        renown: renown,
        rage: player.data.rage,
        skill: skill,
        attribute: atr,
      }
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente (Return Value)');
};

export const returnRageCheckForOthers = async (
  rageCheck: number,
  type: string,
  sessionId: string,
  dataUser: any,
  setDataUser: any,
) => {
  let resultOfRage = [];
  let success = 0;
  for (let i = 0; i < rageCheck; i += 1) {
    const value = Math.floor(Math.random() * 10) + 1;
    if (value >= 6) success += 1;
    resultOfRage.push(value);
  }
  if (dataUser.data.rage <= 0) {
    setDataUser({ ...dataUser, data: { ...dataUser.data, rage: 0 }});
    await registerMessage({
      message: 'Você não possui Fúria para realizar esta ação. Após chegar a zero pontos de Fúria, o Garou perde o Lobo e não pode realizar ações como usar dons, mudar de forma, realizar testes de Fúria, dentre outros.',
      user: dataUser.email,
      email: dataUser.user,
    }, sessionId);
  } else {
    if (dataUser.data.rage - success < 0) {
      dataUser.data.rage = 0;
    } else {
      dataUser.data.rage = dataUser.data.rage - (resultOfRage.length - success);
      setDataUser({
        ...dataUser,
        data: { ...dataUser.data, rage: dataUser.data.rage - (resultOfRage.length - success) },
      });
    }
    await registerMessage({
      message: {
        rollOfRage: resultOfRage,
        success,
        cause: type,
        rage: dataUser.data.rage,
      },
      user: dataUser.user,
      email: dataUser.email,
    }, sessionId);
  }
};

export const returnRageCheck = async (
  rageCheck: number,
  type: string,
  sessionId: string,
  userData: { email: string, name: string },
) => {
  let resultOfRage = [];
  let success = 0;
  for (let i = 0; i < rageCheck; i += 1) {
    const value = Math.floor(Math.random() * 10) + 1;
    if (value >= 6) success += 1;
    resultOfRage.push(value);
  }
  const getUser: any = await getUserAndDataByIdSession(sessionId);
  const player = getUser.players.find((gp: any) => gp.email === userData.email);

  if (player) {
    if (player.data.rage <= 0) {
      player.data.rage = 0;
      await registerMessage({
        message: 'Você não possui Fúria para realizar esta ação. Após chegar a zero pontos de Fúria, o Garou perde o Lobo e não pode realizar ações como usar dons, mudar de forma, realizar testes de Fúria, dentre outros.',
        user: userData.name,
        email: userData.email
      }, sessionId);
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
        user: userData.name,
        email: userData.email,
      }, sessionId);
    }
    const playersFiltered = getUser.players.filter((gp: any) => gp.email !== userData.email);
    await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
  } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente (Rage Check)');
};

export const registerRoll = async (
  dificulty: number,
  penaltyOrBonus: number,
  atrSelected: string,
  sklSelected: string,
  renSelected: string,
  sessionId: string,
  userData: { email: string, name: string },
) => {
  const dtSheet: IDataValues | null = await returnValue(
    atrSelected, sklSelected, renSelected, sessionId, userData.email,
  );
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
    
    try {
      if (dices + rage >= dificulty) {
        await registerMessage({
          message: {
            rollOfMargin: resultOf,
            rollOfRage: resultOfRage,
            dificulty,
            penaltyOrBonus,
          },
          user: userData.name,
          email: userData.email,
        }, sessionId) 
      } else {
        await registerMessage({
          message: `A soma dos dados é menor que a dificuldade imposta. Sendo assim, a falha no teste foi automática (São ${resultOf.length + resultOfRage.length + penaltyOrBonus } dados para um Teste de Dificuldade ${dificulty}).`,
          user: userData.name,
          email: userData.email,
        }, sessionId);
      }
    } catch (error) {
      window.alert('Erro ao obter valor da Forma: ' + error);
    }
  }
};