import { RiteOfBinding } from "./riteOfBinding";
import { RiteOfPatronage } from "./riteOfPatronage";
import { RiteOfShadowPassage } from "./riteOfShadowPassage";
import { RiteOfTheWolfReborn } from "./riteOfTheWolfReborn";
import { RiteWithRoll } from "./riteWithRoll";
import { SimpleTest } from "./simpleTest";

export default function RitualsMechanic(props: { title: string }) {
  const { title } = props;
  switch(title) {
    case 'Rite of Abjuration':
      return <RiteWithRoll renown="honor" skill="occult" textDifficult="A Dificuldade para purificar um objeto depende de diversos fatores, como o tamanho do objeto, por quanto tempo ele foi imbuido e o poder da entidade que o imbuiu. Uma árvore recentemente habitada por um Bane hostil pode ter uma Dificuldade de 3, enquanto uma montanha que serve como o local de descanso de um espírito antigo por milênios pode ter uma Dificuldade de 6 ou mais." />
    case 'Rite of Rage':
      return <RiteWithRoll renown="glory" skill="intimidation" textDifficult="A Dificuldade base do Rito é igual ao número de participantes, mas nunca menor que 3. Após uma vitória, cada participante aumenta sua Fúria em um ponto (O mestre do Rito pode optar por fazer com que cada membro ganhe 2 pontos em vez disso, o que aumenta a Dificuldade em 2)." />
    case 'Rite of Tranquility':
      return <RiteWithRoll renown="wisdom" skill="performance" textDifficult="A Dificuldade base do Rito é igual ao número de participantes, mas nunca menor que 3" />
    case 'Rite of Contrition':
      return <RiteWithRoll renown="honor" skill="etiquette" textDifficult="A Dificuldade deste Rito é igual a 2 + a penalidade de Renome sofrida devido ao pesar ou, no caso de um espírito, metade de seu Poder (arredondado para cima)." />
    case 'Rite of the Forgetful Record':
      return <RiteWithRoll renown="wisdom" skill="investigation" textDifficult="A Dificuldade para realizar este Rito é igual ao número de participantes." />
    case 'Rite of the Living Caern':
      return <RiteWithRoll renown="wisdom" skill="craft" textDifficult="A Dificuldade para realizar este Rito é igual a 2 + o Valor do Caern" />
    case 'Rite of Kinseeking':
      return <RiteWithRoll renown="wisdom" skill="investigation"  textDifficult="Dificuldade determinada pela distância física para o Parente mais próximo (Dificuldade 2 para o vizinho ao lado, 4 para o outro lado da cidade). A presença de outros lobisomens também complica as coisas, aumentando a Dificuldade em 1 se algum Garou além da matilha dos realizadores do Rito estiver na área." />
    case 'Rite of Spirit Summoning':
      return <RiteWithRoll renown="honor" skill="persuasion" textDifficult="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo espírito alvo em um teste de Poder, ou um valor imposto pelo Narrador)." />
    case 'Rite of Celebration':
      return <RiteWithRoll renown="honor" skill="performance" textDifficult="Dificuldade - O mestre do Rito decide quantos níveis de dano de Força de Vontade os membros da matilha desejam restaurar. A Dificuldade é igual a esse número." />
    case 'Rite of Caern Building':
      return <RiteWithRoll renown="wisdom" skill="craft" textDifficult="A Dificuldade para criar um novo caern é 5. Se estiver tentando aumentar um Valor de Caern, a Dificuldade é 4 + o valor atual." />
    case 'Rite of the Whispering Field':
      return <RiteWithRoll renown="wisdom" skill="survival" textDifficult="A Dificuldade do Rito é 2 mais 1 para cada participante, além do Mestre do Rito." />
    case 'Rite of the Shrouded Glen':
      return <RiteWithRoll renown="wisdom" skill="craft" textDifficult="A Dificuldade para realizar este Rito é 2 + o Valor do Caern." />
    case 'Rite of the Winter Wolf':
      return <SimpleTest />
    case 'Gathering for the Departed':
      return <SimpleTest />
    case 'Rite of Accomplishment':
      return <SimpleTest />
    case 'Satire Rite':
      return <SimpleTest />
    case 'Rite of Passage':
      return <SimpleTest />
    case 'Rite of Shame':
      return <SimpleTest />
    case 'Rite of Dedication':
      return <SimpleTest />
    case 'Rite of the Wolf Reborn':
      return <RiteOfTheWolfReborn />
    case 'Rite of Patronage':
      return <RiteOfPatronage />
    case 'Rite of Binding':
      return <RiteOfBinding />
    case 'Rite of Shadow Passage':
      return <RiteOfShadowPassage />
  }
}