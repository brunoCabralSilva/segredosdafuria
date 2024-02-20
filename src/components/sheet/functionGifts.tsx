import CatFeet from "./giftRolls/catfeet";
import SimpleWillPowerTest from "./giftRolls/simpleWillPowerTest";
import SimplesRageTest from "./giftRolls/simplesRageTest";
import Staredown from "./giftRolls/staredown";
import AutoRollWithRage from "./giftRolls/autoRollWithRage";
import AutoRollwithWill from "./giftRolls/autoRollwithWill";
import SpiritOfTheFray from "./giftRolls/spiritOfTheFray";
import TongueOfBeasts from "./giftRolls/tongueOfBeasts";
import OpenSeal from "./giftRolls/openSeal";
import PulseOfThePrey from "./giftRolls/pulseOfThePrey";
import ScentOfRunningWater from "./giftRolls/scentOfRunningWater";
import LunasBlessing from "./giftRolls/lunasBlessing";
import SightFromBeyond from "./giftRolls/sightFromBeyond";
import GraspfromBeyond from "./giftRolls/graspFromBeyond";
import Mindspeak from "./giftRolls/mindspeak";
import DrainSpirit from "./giftRolls/drainSpirit";
import GaiasCandor from "./giftRolls/gaiasCandor";
import HaltTheCowardsFlight from "./giftRolls/haltTheCowardsFlight";
import RazorClaws from "./giftRolls/razorClaws";
import Camouflage from "./giftRolls/camouflage";
import NoTestRoll from "./giftRolls/noTestRoll";
import PackInstinct from "./giftRolls/packInstinct";
import RapidShift from "./giftRolls/rapidShift";
import EyesOfTheCobra from "./giftRolls/eyesOfTheCobra";
import { updateDoc } from "firebase/firestore";
import { returnRageCheck, returnValue } from "@/firebase/checks";
import { registerMessage, sendMessage } from "@/firebase/chatbot";
import { actionPopupGiftRoll, actionShowMenuSession } from "@/redux/slice";
import { getUserAndDataByIdSession, getUserByIdSession } from "@/firebase/sessions";

export const MechanicGift = (props: { nameGift: string }) => {
  switch(props.nameGift) {
    case 'Catfeet': return <CatFeet />;

    case 'Eyes of the Owl': return <SimpleWillPowerTest />;

    case "Hare's Leap": return <AutoRollWithRage attribute="strength" skill="" renown="glory" dificulty={1} />;

    case 'Penumbral Senses': return <AutoRollwithWill attribute="intelligence" skill="" renown="wisdom" dificulty={2} textDificulty={'Dificuldade da Película Local'} />;

    case 'Raging Strike': return <SimplesRageTest />;

    case 'Staredown': return <Staredown />;

    case 'Sharpened Senses': return <SimpleWillPowerTest />;

    case 'Spirit of the Fray': return <SpiritOfTheFray />

    case 'Thwarting the Arrow':  return <SimpleWillPowerTest />;

    case 'Body Shift': return <AutoRollWithRage attribute="stamina" skill="" renown="glory" dificulty={2} />

    case 'Jam Technology': return <AutoRollwithWill attribute="resolve" skill="" renown="honor" dificulty={2} textDificulty={'Dificuldade(computadores (incluindo celulares) com dificuldade 2, eletrônicos (incluindo câmeras) com dificuldade 3, motores elétricos ou de combustão (carros, trens, etc)  com dificuldade 4, armas de fogo e outras reações químicas (explosivos, fogo, etc) com dificuldade 5 e dispositivos estritamente mecânicos (guincho, bicicleta, trava mecânica) com dificuldade 6+).'} />

    case 'Tongue of Beasts': return <TongueOfBeasts />;

    case 'Blissful Ignorance': return <SimpleWillPowerTest />;

    case "Crow's Laughter": return <AutoRollWithRage attribute="manipulation" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Autocontrole + Intuição, ou um valor imposto pelo Narrador).'} />

    case 'Gremlins': return <AutoRollWithRage attribute="charisma" skill="" renown="glory" dificulty={2} textDificulty="Dificuldade - Nível de complexidade: computadores (incluindo celulares) com dificuldade 2, eletrônicos (incluindo câmeras) com dificuldade 3, motores elétricos ou de combustão (carros, trens, etc)  com dificuldade 4, armas de fogo e outras reações químicas (explosivos, fogo, etc) com dificuldade 5 e dispositivos estritamente mecânicos (guincho, bicicleta, trava mecânica) com dificuldade 6+." />

    case "Spider's Song": return <AutoRollwithWill attribute="resolve" skill="" renown="wisdom" dificulty={1} textDificulty={'Qualquer criptografia aumenta a Dificuldade em 1 ou mais.'} />
    
    case 'Blur of the Milky Eye': return <SimplesRageTest />;

    case 'Open Seal': return <OpenSeal />;

    case 'Pulse of the Prey': return <PulseOfThePrey />;

    case 'Scent of Running Water': return <ScentOfRunningWater />;

    case "Luna's Blessing": return <LunasBlessing />

    case 'Thieving Talons of the Magpie': return <AutoRollwithWill attribute="intelligence" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (Rank de um Dom ou valor apropriado para outro alvo sobrenatural. Se não houver classificação, o Narrador deve atribuir uma Dificuldade apropriada).'} />

    case 'The Thousand Forms': return <AutoRollWithRage attribute="dexterity" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (Se a forma desejada for particularmente grande, pequena ou exótica, a Dificuldade pode aumentar em 1 ou mais, a critério do Contador de Histórias)." />

    case 'Whelp Body': return <AutoRollWithRage attribute="resolve" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Ocultismo, ou um valor imposto pelo Narrador).'} />

    case 'Ensnare Spirit': return <AutoRollwithWill attribute="wits" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo espírito alvo em um teste de Poder, ou um valor imposto pelo Narrador).'} /> 

    case "Mother's Touch": return <AutoRollwithWill attribute="intelligence" skill="" renown="glory" dificulty={1} />

    case "Blessed Brew": return <SimpleWillPowerTest />

    case 'Shadow Sense': return <AutoRollwithWill attribute="wits" skill="" renown="wisdom" dificulty={2} textDificulty="Dificuldade (A Dificuldade do teste é 2, mas pode ser modificado por poderes que permitem que criaturas sobrenaturais escondam sua presença, como a habilidade vampírica de iludir a observação)." /> 

    case 'Sight from Beyond': return <SightFromBeyond />

    case 'Banish Spirit': return <AutoRollWithRage attribute="resolve" skill="" renown="glory" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo espírito alvo em um teste de Poder, ou um valor imposto pelo Narrador).'} /> 

    case 'Grasp from Beyond': return <GraspfromBeyond />

    case 'Mindspeak': return <Mindspeak />

    case 'Umbral Tether': return <SimpleWillPowerTest />

    case 'Command Spirit': return <AutoRollwithWill attribute="charisma" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo espírito alvo em um teste de Poder, ou um valor imposto pelo Narrador).'} />

    case 'Drain Spirit': return <DrainSpirit />

    case 'Feral Regression': return <AutoRollWithRage attribute="intelligence" skill="" renown="glory" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Determinação + Ocultismo, ou um valor imposto pelo Narrador).'} />

    case 'Living Ward': return <AutoRollWithRage attribute="resolve" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo espírito alvo em um teste de Poder, ou um valor imposto pelo Narrador).'} /> 

    case 'Ancestral Conviction': return <SimpleWillPowerTest />

    case "Gaia's Candor": return <GaiasCandor />

    case "Porcupine's Reprisal": return <SimplesRageTest />

    case "Sense the True Form": return <AutoRollWithRage attribute="wits" skill="" renown="wisdom" dificulty={1} textDificulty={'Dificuldade (Detectar um companheiro Garou com dificuldade 2, parentes antes de sua Primeira Mudança com dificuldade 3, enquanto algo quase indistinguível de um humano mundano, como um feiticeiro, pode ter dificuldade 5. Vampiros estão em algum lugar entre a dificuldade 2 e 4, dependendo se eles estão se disfarçando ativamente como mortais e seu nível geral de monstruosidade).'} />

    case "Beast's Fealty": return <AutoRollWithRage attribute="charisma" skill="" renown="honor" dificulty={3} />

    case 'Command the Gathering': return <SimplesRageTest />

    case "Fangs of Judgment": return <AutoRollwithWill attribute="resolve" skill="" renown="honor" dificulty={3} />

    case 'Scent of the Past': return <AutoRollwithWill attribute="intelligence" skill="" renown="wisdom" dificulty={1} textDificulty='Dificuldade (Perceber as circunstâncias de um duelo travado na semana passada com uma arma específica é Dificuldade 2, mas obter informações sobre os membros de uma reunião secreta em um parque anos atrás aproxima-se de Dificuldade 6 ou superior).' />

    case 'Geas': return <AutoRollWithRage attribute="manipulation" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Ocultismo, ou um valor imposto pelo Narrador. Outras criaturas sobrenaturais e humanos familiarizados com o Garou podem resistir, assim como qualquer um se o comando for contra sua natureza ou causar danos àqueles que o alvo ama. Uma ordem que prejudique diretamente a vítima irá falhar, por exemplo atirar em si mesma, assim como os comandos que exigem o impossível)." />
    
    case "Oathbreaker's Bane": return <SimpleWillPowerTest />

    case 'Animal Magnetism': return <SimplesRageTest />

    case 'Howl of Assembly': return <AutoRollWithRage attribute="charisma" skill="" renown="honor" dificulty={2} />

    case 'Song of Rage': return <AutoRollWithRage attribute="charisma" skill="" renown="glory" dificulty={3} />

    case 'Song of Serenity': return <AutoRollwithWill attribute="composure" skill="" renown="honor" dificulty={3} />

    case "Halt the Coward's Flight": return <HaltTheCowardsFlight />

    case "Razor Claws": return <RazorClaws />

    case 'Sense Danger': return <NoTestRoll />

    case 'Curse of Aeolus': return <AutoRollwithWill attribute="resolve" skill="" renown="glory" dificulty={2} />

    case 'Odious Aroma': return <AutoRollWithRage attribute="stamina" skill="" renown="honor" dificulty={3} />

    case "Brother's Scent": return <SimpleWillPowerTest />

    case 'Camouflage': return <Camouflage />

    case 'Lacerating Wind': return <AutoRollWithRage attribute="resolve" skill="" renown="honor" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Sobrevivência, ou Destreza + Atletismo, ou um valor imposto pelo Narrador)." />

    case 'Augur': return <AutoRollwithWill attribute="intelligence" skill="" renown="wisdom" dificulty={1} textDificulty="Dificuldade (Um ponto de ônibus próximo abençoado com um espelho e uma poça adjacente pode ter uma Dificuldade 2, enquanto uma caverna do outro lado da Terra pode exigir uma Dificuldade 6 para encontrar a única gota de água da qual espionar)." />

    case 'Blackout': return <SimplesRageTest />

    case 'Skinbind': return <SimpleWillPowerTest />

    case 'Sacred Boundary': return <NoTestRoll />

    case 'Hidden Killer': return <SimpleWillPowerTest />

    case 'Render Down': return <AutoRollWithRage attribute="resolve" skill="" renown="honor" dificulty={2} textDificulty="Dificuldade (As Dificuldades variam de 2, para algo como uma arma de fogo, até 5 para uma coluna de pedra esculpida)." />

    case 'Fatal Flaw': return <AutoRollwithWill attribute="intelligence" skill="" renown="glory" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Raciocínio + Lábia, ou um valor imposto pelo Narrador).'} />

    case 'Icy Chill of Despair': return <SimplesRageTest />

    case 'Fetch Bounty': return <AutoRollwithWill attribute="wits" skill="" renown="wisdom" dificulty={1} textDificulty={'Dificuldade (Encontrar um carro pode ter Dificuldade 2, enquanto localizar um Chevrolet Corvette 75 se aproxima de 4 ou 5 e pode exigir horas de viagem).'} />

    case 'Speech of the World': return <AutoRollwithWill attribute="intelligence" skill="" renown="wisdom" dificulty={1} textDificulty={'Dificuldade (chinês ou qualquer variante de árabe, por exemplo, teriam Dificuldade 2, uma tabuleta escrita em um dialeto obscuro do sumério teria Dificuldade 4, e runas entalhadas por uma mão desconhecida antes do alvorecer da humanidade teriam Dificuldade 5 ou mais).'} /> 

    case 'Whispered Passage': return <SimpleWillPowerTest />

    case 'The Silver Compact': return <SimplesRageTest />

    case 'Pack Instinct': return <PackInstinct />

    case 'Rapid Shift': return <RapidShift />

    case 'Call the Ridden': return <AutoRollwithWill attribute="charisma" skill="" renown="glory" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Determinação + Intuição, ou um valor imposto pelo Narrador).'} />

    case 'Eyes of the Cobra': return <EyesOfTheCobra />

    case 'Song of Valor': return <AutoRollWithRage attribute="charisma" skill="" renown="honor" dificulty={3} />

    case 'Song of Inspiration': return <AutoRollwithWill attribute="manipulation" skill="" renown="wisdom" dificulty={3} textDificulty={'Dificuldade (3 se tiver menos de dois pontos na Habilidade escolhida, ou 2 se o possuir 2 ou mais pontos.'} /> 

    case 'Snarl of Challenge': return <AutoRollWithRage attribute="charisma" skill="" renown="honor" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Compostura + Intuição, ou um valor imposto pelo Narrador)." />

    case 'True Fear': return <AutoRollWithRage attribute="charisma" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Autocontrole + Intuição, ou um valor imposto pelo Narrador)." />

    case "Luna's Avenger": return <SimplesRageTest />

    case 'Unity of the Pack': return <SimpleWillPowerTest />

    case 'Blood of the Pack': return <SimplesRageTest />

    case 'The Golden Path': return <SimpleWillPowerTest />

    case 'Burrow': return <AutoRollWithRage attribute="strength" skill="" renown="wisdom" dificulty={2} textDificulty="Dificuldade (Solo macio é Dificuldade 2, enquanto solo rochoso compacto é Dificuldade 4)." />

    case 'Under the Gun': return <SimpleWillPowerTest />

    case 'Thunderclap': return <AutoRollWithRage attribute="strength" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Raciocínio de todos dentro de 20 metros, ou um valor imposto pelo Narrador)." />

    case 'Dire Distraction': return <AutoRollWithRage attribute="composure" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Raciocínio + Ocultismo (ou Sabedoria), ou um valor imposto pelo Narrador)." /> 

    case 'Shield of the Wyld': return <SimpleWillPowerTest />

    case 'Quicksand': return <AutoRollWithRage attribute="intelligence" skill="" renown="honor" dificulty={2} textDificulty="Dificuldade (A dificuldade inicial é 2, mas deve ser aumentada em 1 para cada dez metros adicionais de distância)." />

    case "Gaia's Embrace": return <SimplesRageTest />

    case "Balor's Gaze": return <AutoRollwithWill attribute="charisma" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Autocontrole + Ocultismo, ou um valor imposto pelo Narrador)." />

    case 'Territorial Dominance': return <SimplesRageTest />

    case 'Recovery Memory': return <AutoRollwithWill attribute="intelligence" skill="" renown="wisdom" dificulty={1} textDificulty="Dificuldade (Quanto pior o estado do objeto e quanto mais tempo ele passou nesse estado, maior será a Dificuldade." />

    case 'Doppelganger': return <AutoRollwithWill attribute="manipulation" skill="" renown="wisdom" dificulty={3} />

    case 'Control Machine': return <AutoRollWithRage attribute="manipulation" skill="" renown="wisdom" dificulty={3} textDificulty="Dificuldade (Depende da complexidade do comando e do tamanho do alvo, e essa Dificuldade aumenta se o dispositivo for solicitado a fazer algo contrário ao seu propósito principal, como pedir a uma fechadura (projetada para barrar a entrada) que se abra. A Dificuldade nunca é inferior a 3, em qualquer caso, já que esse Dom é notoriamente complicado e muitos Garou prefeririam simplesmente destruir o dispositivo do que conversar com ele)." />

    case 'Take the True Form': return <AutoRollwithWill attribute="manipulation" skill="" renown="honor" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Determinação, ou um valor imposto pelo Narrador)." />

    case 'Against the Odds': return <SimplesRageTest />

    case 'Closing the Gap': return <SimplesRageTest />

    case 'Kiss of Helios': return <SimplesRageTest />

    case "Luna's Armor": return <SimpleWillPowerTest />

    case 'Coup de Grâce': return <SimpleWillPowerTest />

    case "Kali's Scar": return <SimplesRageTest />

    case 'Face in the Crowd': return <SimpleWillPowerTest />

    case 'Between the Cracks': return <SimplesRageTest />

    case 'Share the Pain': return <SimplesRageTest />
  }
}

export const rollDiceWithRage = async (
  slice: any,
  dispatch: any,
  dificulty: number,
  attribute: string,
  skill: string,
  renown: string,
  userData: { name: string, email: string },
  penaltyOrBonus: number,
) => {
  const rage = await verifyRage(slice.sessionId, userData);
  if (rage) {
    await returnRageCheck(1, 'manual', slice.sessionId, slice.userData);
    const dtSheet: any | null = await returnValue(
      attribute,
      skill,
      renown,
      slice.sessionId,
      slice.userData.email,
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
        await registerMessage({
          message: {
            rollOfMargin: resultOf,
            rollOfRage: resultOfRage,
            dificulty,
            penaltyOrBonus,
            roll: 'true',
            gift: slice.showPopupGiftRoll.gift.data.gift,
            giftPtBr: slice.showPopupGiftRoll.gift.data.giftPtBr,
            cost: slice.showPopupGiftRoll.gift.data.cost,
            action: slice.showPopupGiftRoll.gift.data.action,
            duration: slice.showPopupGiftRoll.gift.data.duration,
            pool: slice.showPopupGiftRoll.gift.data.pool,
            system: slice.showPopupGiftRoll.gift.data.systemPtBr,
        },
          user: userData.name,
          email: userData.email,
        }, slice.sessionId);
      } catch (error) {
      window.alert('Erro ao obter valor da Forma: ' + error);
      }
    }
  } else {
    await sendMessage('Não foi possível conjurar o dom (Não possui Fúria suficiente para a ação requisitada).', slice.sessionId, slice.userData);
  }
  dispatch(actionShowMenuSession(''));
  dispatch(actionPopupGiftRoll({ show: false, gift: { session: '', data: '' }}));
};

export const rollDiceWithWillpower = async (
  slice: any,
  dispatch: any,
  dificulty: number,
  attribute: string,
  skill: string,
  renown: string,
  userData: { name: string, email: string },
  penaltyOrBonus: number,
) => {
  const willpower = await reduceFdv(slice.sessionId, false, userData);
  if (willpower) {
      const dtSheet: any | null = await returnValue(attribute, skill, renown, slice.sessionId, userData.email);
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
                roll: 'true',
                gift: slice.showPopupGiftRoll.gift.data.gift,
                giftPtBr: slice.showPopupGiftRoll.gift.data.giftPtBr,
                cost: slice.showPopupGiftRoll.gift.data.cost,
                action: slice.showPopupGiftRoll.gift.data.action,
                duration: slice.showPopupGiftRoll.gift.data.duration,
                pool: slice.showPopupGiftRoll.gift.data.pool,
                system: slice.showPopupGiftRoll.gift.data.systemPtBr,
            },
              user: userData.name,
              email: userData.email,
            }, slice.sessionId);
          }
        } catch (error) {
        window.alert('Erro ao obter valor da Forma: ' + error);
        }
      }
  } else {
    await sendMessage('Não foi possível conjurar o dom (Não possui Força de Vontade suficiente para a ação requisitada).', slice.sessionId, slice.userData);
  }
  dispatch(actionShowMenuSession(''));
  dispatch(actionPopupGiftRoll({ show: false, gift: { session: '', data: '' }}));
}

export const rollWillPower = async (slice: any) => {
  const willpower = await reduceFdv(slice.sessionId, false, slice.userData);
  if (willpower) {
    await sendMessage({
      roll: 'false',
      gift: slice.showPopupGiftRoll.gift.data.gift,
      giftPtBr: slice.showPopupGiftRoll.gift.data.giftPtBr,
      cost: slice.showPopupGiftRoll.gift.data.cost,
      action: slice.showPopupGiftRoll.gift.data.action,
      duration: slice.showPopupGiftRoll.gift.data.duration,
      pool: 'Nenhuma',
      system: slice.showPopupGiftRoll.gift.data.systemPtBr,
    }, slice.sessionId, slice.userData);
  } else {
    await sendMessage('Não foi possível conjurar o dom (Não possui Força de Vontade suficiente para a ação requisitada).', slice.sessionId, slice.userData);
  }
};

export const rollRage = async (slice: any) => {
  const rage = await verifyRage(slice.sessionId, slice.userData);
  if (rage) {
    await returnRageCheck(1, 'manual', slice.sessionId, slice.userData);
    await sendMessage({
      roll: 'false',
      gift: slice.showPopupGiftRoll.gift.data.gift,
      giftPtBr: slice.showPopupGiftRoll.gift.data.giftPtBr,
      cost: slice.showPopupGiftRoll.gift.data.cost,
      action: slice.showPopupGiftRoll.gift.data.action,
      duration: slice.showPopupGiftRoll.gift.data.duration,
      pool: 'Nenhuma',
      system: slice.showPopupGiftRoll.gift.data.systemPtBr,
    }, slice.sessionId, slice.userData);
  } else {
    await sendMessage('Não foi possível conjurar o dom (Não possui Força de Vontade suficiente para a ação requisitada).', slice.sessionId, slice.userData);
  }
}

export const reduceFdv = async (
  sessionId: string,
  agravatedValue: boolean,
  userData: { name: string, email: string },
): Promise<any> => {
  const getUser: any = await getUserAndDataByIdSession(sessionId);
  const player = getUser.players.find((gp: any) => gp.email === userData.email);
  if (player) {
    if (player.data.willpower.length === 0) {
      if (agravatedValue) player.data.willpower.push({ value: 1, agravated: true });
      else player.data.willpower.push({ value: 1, agravated: false });
      const playersFiltered = getUser.players.filter((gp: any) => gp.email !== userData.email);
      await updateDoc(getUser.sessionId, { players: [...playersFiltered, player] });
      return true;
    } else {
      const resolveComposure = player.data.attributes.resolve + player.data.attributes.composure;
      const agravated = player.data.willpower.filter((fdv: any) => fdv.agravated === true).map((fd: any) => fd.value);
      const superficial = player.data.willpower.filter((fdv: any) => fdv.agravated === false).map((fd: any) => fd.value);
      const allValues = Array.from({ length: resolveComposure }, (_, i) => i + 1);
      const missingInBoth = allValues.filter(value => !agravated.includes(value) && !superficial.includes(value));
      if (missingInBoth.length > 0) {
        const smallestNumber = Math.min(...missingInBoth);
        if (agravatedValue) {
          player.data.willpower.push({ value: smallestNumber, agravated: true });
        } else {
          player.data.willpower.push({ value: smallestNumber, agravated: false });
        }
        const playersFiltered = getUser.players.filter((gp: any) => gp.email !== userData.email);
        await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
        return true;
      } else {
        const missingInAgravated = allValues.filter(value => !agravated.includes(value));
        if (missingInAgravated.length > 0) {
          const smallestNumber = Math.min(...missingInAgravated);
          player.data.willpower.push({ value: smallestNumber, agravated: true });
          const playersFiltered = getUser.players.filter((gp: any) => gp.email !== userData.email);
          await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
          return true;
        } else {
          window.alert(`Você não possui mais pontos de Força de Vontade para realizar este teste (Já sofreu todos os danos Agravados possíveis).`);
          return false;
        }
      }
    }
  } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
};

export const regenerateFdv = async (
  sessionId: string,
  successRoll: number,
  userData: { name: string, email: string },
): Promise<any> => {
  const getUser: any = await getUserAndDataByIdSession(sessionId);
  const player = getUser.players.find((gp: any) => gp.email === userData.email);
  if (player) {
    if (player.data.willpower.length > 0) {
      const superficial = player.data.willpower.filter((fdv: any) => fdv.agravated === false).map((fd: any) => fd.value);
      const agravated = player.data.willpower.filter((fdv: any) => fdv.agravated === true);
      if (superficial.length <= successRoll) {
        player.data.willpower = agravated;
        const playersFiltered = getUser.players.filter((gp: any) => gp.email !== userData.email);
        await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
        return true;
      } else {
        const sortedNumbers = superficial.sort((a: any, b: any) => a - b);
        const remainingNumbers = sortedNumbers.slice(successRoll + 1);
        const restOfDamage = player.data.willpower.filter((item: any) => remainingNumbers.includes(item.value));
        player.data.willpower = [...restOfDamage, ...agravated];
        const playersFiltered = getUser.players.filter((gp: any) => gp.email !== userData.email);
        await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
        return true;
      }
    } else window.alert('Você não possui dano na Força de Vontade');
  } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
}

export const verifyRage = async (sessionId: string, userData: { name: string, email: string }): Promise<any> => {
  const player = await getUserByIdSession(sessionId, userData.email);
  if (player) {
    if (player.data.rage === 0) {
      window.alert('A Fúria é igual a Zero, logo você não pode conjurar dons.')
      return false;
    } else return true;
  } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
};