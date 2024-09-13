import { capitalize, getOfficialTimeBrazil } from "./utilities";
import firebaseConfig from "./connection";
import { collection, getDocs, getFirestore, query, runTransaction, where } from "firebase/firestore";
import { authenticate } from "./authenticate";
import { getPlayerByEmail } from "./players";

const verifyResult = (
	rollOfRage: number[],
	rollOfMargin: number[],
	dificulty: number
) => {
	let success = 0;
	let fail = 0;
	let brutal = 0;
	let critical = 0;

	if (rollOfRage) {
		for (let i = 0; i < rollOfRage.length; i += 1) {
			if (Number(Number(rollOfRage[i])) === 10) critical += 1;
			else if (Number(rollOfRage[i]) > 2 && Number(rollOfRage[i]) < 6) fail += 1;
			else if (Number(rollOfRage[i]) > 5 && Number(rollOfRage[i]) < 10) success += 1;
			else brutal += 1;
		}
	}
	
	if (rollOfMargin) {
		for (let i = 0; i < rollOfMargin.length; i += 1) {
			if (Number(rollOfMargin[i]) === 10) critical += 1;
			else if (Number(rollOfMargin[i]) > 2 && Number(rollOfMargin[i]) < 6) fail += 1;
			else if (Number(rollOfMargin[i]) > 5 && Number(rollOfMargin[i]) < 10) success += 1;
			else fail += 1;
		}
	}
	
	let paresBrutais = 0;
	let paresCriticals = 0;
	if (brutal % 2 !== 0) brutal -= 1;
	paresBrutais = brutal * 2;
	if (critical % 2 !== 0 && critical !== 1) {
		critical -= 1;
		success += 1;
	}
	if (critical > 1) paresCriticals = critical * 2
	else paresCriticals = critical;
	let sucessosParaDano = paresBrutais + paresCriticals + success - Number(dificulty);
	const falhaBrutal = brutal > 1;
	if (sucessosParaDano === 0) sucessosParaDano += 1;

	let msg = '';

	if (falhaBrutal) {
		if (sucessosParaDano >= 0) {
			msg = 'Obteve sucesso se a ação foi CAUSAR DANO (Caso contrário, ocorreu uma falha brutal).';
		} else {
			msg = `Falhou no teste, pois a dificuldade era ${Number(dificulty)} e número de sucessos foi ${Number(paresBrutais + paresCriticals + success)}. `;
		}
	} else {
		if (sucessosParaDano >= 0) msg =  'Obteve sucesso no teste!';
		else {
			msg = `Falhou no teste, pois a dificuldade era ${Number(dificulty)} e número de sucessos foi ${Number(paresBrutais + paresCriticals + success)}. `;
		}
	}
	return {
		message: msg,
		brutalPairs: paresBrutais,
		criticalPairs: paresCriticals,
		success,
		successesForDamage: sucessosParaDano,
	}
}

const rollTest = (
	valueOfRage: number,
	valueOf: number,
	penaltyOrBonus: number,
	dificulty: number,
) => {
	let resultOfRage = [];
	let resultOf = [];
	let valueWithPenaltyOfBonus = Number(penaltyOrBonus) + Number(valueOf);

	for (let i = 0; i < Number(valueOfRage); i += 1) {
		const value = Math.floor(Math.random() * 10) + 1;
		resultOfRage.push(value);
	}

	for (let i = 0; i < Number(valueWithPenaltyOfBonus); i += 1) {
		const value = Math.floor(Math.random() * 10) + 1;
		resultOf.push(value);
	}

	const generate = verifyResult(resultOfRage, resultOf, dificulty);
	
	return {
		...generate,
		margin: resultOf,
		rage: resultOfRage,
		dificulty,
		penaltyOrBonus,
		type: 'roll',
	}
}

export const registerMessage = async (sessionId: string, data: any, email: string | null) => {
	try {
	  const authData: any = await authenticate();
	  if (authData && authData.email && authData.displayName) {
		const date = await getOfficialTimeBrazil();
		const db = getFirestore(firebaseConfig);
		const chatsCollectionRef = collection(db, 'chats');
		const querySession = query(chatsCollectionRef, where("sessionId", "==", sessionId));
		const querySnapshot = await getDocs(querySession);
		if (querySnapshot.empty) {
		  throw new Error('Não foi possível localizar a Sessão. Por favor, atualize a página e tente novamente.');
		}
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
			updatedChat.sort((a: any, b: any) => a.order - b.order)
			if (updatedChat.length > 15) updatedChat.shift();
			transaction.update(sessionDocRef, { list: updatedChat });
		  } else {
			throw new Error("Não foi possível localizar a Sessão. Por favor, atualize a página e tente novamente.");
		  }
		});
	  }
	} catch (error) {
	  throw new Error('Ocorreu um erro ao enviar a mensagem: ' + error);
	}
};
  
export const registerManualRoll = async(
	sessionId: string,
	rage: number,
	valueOf: number,
	penaltyOrBonus: number,
	dificulty: number
) => {
	const roll = rollTest(rage, valueOf, penaltyOrBonus, dificulty);
	await registerMessage(sessionId, roll, null);
}

export const registerAutomatedRoll = async(
	sessionId: string,
	emailUser: string,
	atrSelected: string,
	sklSelected: string,
	renSelected: string,
	penaltyOrBonus: number,
	dificulty: number,
) => {
	let valueOf = 0;
	let rage = 0;
	try {
		const player = await getPlayerByEmail(sessionId, emailUser);
		if (player) {
			rage = Number(player.data.rage);
			if (atrSelected !== '0' && atrSelected !== '1')
				valueOf += Number(player.data.attributes[atrSelected]);
			if (sklSelected !== '0' && sklSelected !== '1')
				valueOf += Number(player.data.skills[sklSelected].value);
			if (renSelected !== '0' && renSelected !== '1')
				valueOf += Number(player.data[renSelected]);
			if (rage > valueOf) {
				rage = valueOf;
				valueOf = 0;
			} else valueOf -= rage;
			const roll = rollTest(rage, valueOf, penaltyOrBonus, dificulty);
			await registerMessage(sessionId, roll, emailUser);
		} else throw new Error ('Sessão não encontrada.');
	} catch(error) {
		window.alert('Ocorreu um erro ao buscar os dados do Jogador. Por favor, atualize a página e tente novamente' + '('+ error +').');
	}
}

export const rageCheck = async(sessionId: string, email: string) => {
  let resultOfRage = [];
  let success = 0;
  const value = Math.floor(Math.random() * 10) + 1;
  if (value >= 6) success += 1;
  resultOfRage.push(value);
  const player = await getPlayerByEmail(sessionId, email);
  if (player) {
    if (player.data.rage <= 0) {
      window.alert('Você não possui Fúria suficiente para ativar este Teste.');
    } else {
      let text = '';
      if (success === 0) {
        player.data.rage -= 1;
        text = 'Não obteve sucesso no Teste. A fúria foi reduzida para ' + (player.data.rage) + '.';
      } else text = 'Obteve sucesso no Teste. A fúria foi mantida.';
      await registerMessage(
        sessionId,
        {
        message: 'Foi realizado um Teste de Fúria.',
        rollOfRage: resultOfRage,
        result: text,
        rage: player.data.rage,
        success,
        type: 'rage-check',
        },
        email,
      );
    }
  }
  return player.data.rage;
}

export const haranoHaugloskCheck = async(
	sessionId: string,
	type: string,
	dataSheet: any,
	dificulty: number,
) => {
  let rollTest = [];
  let success = 0;
  let sumData = 0;
  sumData += Number(dataSheet.harano);
  sumData += Number(dataSheet.hauglosk);
  if (sumData === 0) sumData = 1;
  for (let i = 0; i < sumData; i += 1) {
    const value = Math.floor(Math.random() * 10) + 1;
    if (value >= 6) success += 1;
    rollTest.push(value);
  }
  let text = '';
  if (success < dificulty) {
    dataSheet[type] += 1;
    text = `Não obteve sucesso no Teste. O ${type} foi aumentado para ` + dataSheet[type] + '.';
  } else text = 'Obteve sucesso no Teste. Não houve aumento em ' + type + '.';
  await registerMessage(
    sessionId,
    {
      message: `Foi realizado um Teste de ${capitalize(type)}.`,
      rollOf: rollTest,
      result: text,
      value: dataSheet[type],
      type: 'harano-hauglosk',
    },
    null
  );
  return dataSheet[type];
}