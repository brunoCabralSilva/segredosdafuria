import { RiteOfBinding } from "./riteOfBinding";
import { RiteOfPatronage } from "./riteOfPatronage";
import { RiteOfShadowPassage } from "./riteOfShadowPassage";
import { RiteOfTheSacredScar } from "./RiteOfTheSacredScar";
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
    case 'Rite of the Borne Word':
      return <RiteWithRoll renown="honor" skill="etiquette" textDifficult="A Dificuldade é 3 (ou mais alta, se o espírito for hostil)." />
    case 'Rite of the Broken Sun':
      return <RiteWithRoll renown="honor" skill="occult" textDifficult="A Dificuldade do Ritual é igual ao maior valor de Renome do Garou sendo punido." />
    case 'Rite of Caging':
      return <RiteWithRoll renown="wisdom" skill="awareness" textDifficult="A Dificuldade do Ritual é igual à classificação da Película local: um caern ativo pode ser 2, um beco urbano 3 ou 4, enquanto um ambiente de laboratório estéril pode chegar até 6." />
    case 'Rite of Chiminage':
      return <RiteWithRoll renown="wisdom" skill="etiquette" textDifficult="A Dificuldade base varia de 2 para gafflings menores a 6 para entidades quase divinas, como os Celestinos." />
    case 'Rite of the Grim Reach':
      return <RiteWithRoll renown="glory" skill="survival" textDifficult="A Dificuldade é igual à Classificação da Película" />
    case 'Rite of the Living Tale':
      return <RiteWithRoll renown="wisdom" skill="survival" textDifficult="A Dificuldade é 2 (ou mais, dependendo da complexidade do cheiro)." />
    case "Rite of the Moon's Fickle Grace":
      return <RiteWithRoll renown="glory" skill="performance" textDifficult="A Dificuldade é 3" />
    case 'Rite of Shared Fury':
      return <RiteWithRoll renown="honor" skill="politics" textDifficult="A Dificuldade base do Ritual é igual ao número de participantes, embora nunca seja menor que 3." />
    case 'Rite of the Ban Shared':
      return <SimpleTest />
    case 'Cleansing Rite':
      return <SimpleTest />
    case 'The Long Vigil':
      return <SimpleTest />
    case 'Pledging Rite':
      return <SimpleTest />
    case 'The Renewal Circle':
      return <SimpleTest />
    case 'Rite of Renunciation':
      return <SimpleTest />
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
    case 'Rite of the Sacred Scar':
      return <RiteOfTheSacredScar />
    case 'Rite of the Wolf Reborn':
      return <RiteOfTheWolfReborn />
    case 'Rite of Patronage':
      return <RiteOfPatronage />
    case 'Rite of Binding':
      return <RiteOfBinding />
    case 'Rite of Shadow Passage':
      return <RiteOfShadowPassage />
    case 'Rite of the Broken Wolf':
      return <RiteWithRoll renown="honor" skill="leadership" textDifficult="A Dificuldade deste Rito é igual a 2 + o maior valor de Renome do alvo" />
    case 'Rite of the Capricious Sky':
      return <RiteWithRoll renown="glory" skill="etiquette" textDifficult="A Dificuldade do Rito depende da intensidade e da rapidez da mudança desejada. Mudanças menores, como aumentar ou diminuir alguns graus de temperatura ou fazer nuvens leves se dissiparem ou choverem suavemente, têm Dificuldade 2. Alterações mais intensas, como transformar nuvens em tempestade ou névoa densa, são Dificuldade 4. Grandes mudanças, como invocar tempestades violentas em um dia de verão calmo, têm Dificuldade 6" />
    case 'Rite of Forging':
      return <RiteWithRoll renown="honor" skill="craft" textDifficult="Dificuldade é igual ao valor em pontos do Talismã" />
    case "Rite of Gaia's Bravery":
      return <RiteWithRoll renown="honor" skill="leadership" textDifficult="A Dificuldade deste Rito é 2 + 1 para cada participante humano" />
    case "Rite of Spiritual Succor":
      return <RiteWithRoll renown="wisdom" skill="etiquette" textDifficult="A Dificuldade básica do Rito é igual ao número de participantes, nunca inferior a 3" />
  }
}