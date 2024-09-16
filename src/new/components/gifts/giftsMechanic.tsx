import { RageOrWpWithRoll } from "./rageOrWpWithRoll";
import { RageTestOrWp } from "./rageTestOrWp";
import { WpConditional } from "./wpConditional";
import { RgOrWpWithConditionInRoll } from "./rgOrWpWithConditionInRoll";
import { PackInstinct } from "./packInstinct";
import { SightFromBeyond } from "./sightFromBeyond";
import { RazorClaws } from "./razorClaws";
import { SilverFangs } from "./silverFangs";
import { ClawsOfFrozenDeath } from "./clawsOfFrozenDeath";
import { WindClaws } from "./windClaws";
import { SimpleTest } from "./simpleTest";
import { NormalTest } from "./normalTest";

export default function GiftsMechanic(props: { name: string }) {
  const { name } = props;
  switch(name) {

    //Dons que custam 1 Teste de Fúria
    case 'Animal Magnetism': return <RageTestOrWp type="rage" />;
    case 'Between the Cracks': return <RageTestOrWp type="rage" />;
    case 'Blackout': return <RageTestOrWp type="rage" />;
    case 'Blood of the Pack': return <RageTestOrWp type="rage" />;
    case 'Blur of the Milky Eye': return <RageTestOrWp type="rage" />;
    case 'Closing the Gap': return <RageTestOrWp type="rage" />;
    case 'Command the Gathering': return <RageTestOrWp type="rage" />;
    case "Gaia's Embrace": return <RageTestOrWp type="rage" />;
    case 'Icy Chill of Despair': return <RageTestOrWp type="rage" />;
    case "Kali's Scar": return <RageTestOrWp type="rage" />;
    case 'Kiss of Helios': return <RageTestOrWp type="rage" />;
    case "Luna's Avenger": return <RageTestOrWp type="rage" />;
    case 'Odious Aroma': return <RageTestOrWp type="rage" />;
    case "Porcupine's Reprisal": return <RageTestOrWp type="rage" />;
    case 'Raging Strike': return <RageTestOrWp type="rage" />;
    case 'Share the Pain': return <RageTestOrWp type="rage" />;
    case 'The Silver Compact': return <RageTestOrWp type="rage" />;
    case "Territorial Dominance": return <RageTestOrWp type="rage" />;
    case "Serpent's Coil": return <RageTestOrWp type="rage" />

    //Dons que custam 1 ponto de Força de Vontade
    case 'Ancestral Conviction': return <RageTestOrWp type="willpower" />;
    case 'Blessed Brew': return <RageTestOrWp type="willpower" />;
    case 'Blissful Ignorance': return <RageTestOrWp type="willpower" />;
    case "Brother's Scent": return <RageTestOrWp type="willpower" />;
    case 'Coup de Grâce': return <RageTestOrWp type="willpower" />;
    case 'Eyes of the Owl': return <RageTestOrWp type="willpower" />;
    case 'Face in the Crowd': return <RageTestOrWp type="willpower" />;
    case 'Hidden Killer': return <RageTestOrWp type="willpower" />;
    case "Luna's Armor": return <RageTestOrWp type="willpower" />;
    case "Oathbreaker's Bane": return <RageTestOrWp type="willpower" />;
    case 'Sharpened Senses': return <RageTestOrWp type="willpower" />;
    case 'Shield of the Wyld': return <RageTestOrWp type="willpower" />;
    case 'Shrouded Aspect': return <RageTestOrWp type="willpower" />;
    case 'Skinbind': return <RageTestOrWp type="willpower" />;
    case 'The Golden Path': return <RageTestOrWp type="willpower" />;
    case 'Thwarting the Arrow': return <RageTestOrWp type="willpower" />;
    case 'Umbral Tether': return <RageTestOrWp type="willpower" />;
    case 'Under the Gun': return <RageTestOrWp type="willpower" />;
    case 'Unity of the Pack': return <RageTestOrWp type="willpower" />;
    case 'Whispered Passage': return <RageTestOrWp type="willpower" />;

    //Dons que custam 1 Teste de Fúria + 1 teste
    case "Hare's Leap":
      return <RageOrWpWithRoll type="rage" attribute="strength" skill="" renown="glory" dificulty={1} textDificulty="" />; 
    case 'Jam Technology':
      return <RageOrWpWithRoll type="rage" attribute="resolve" skill="" renown="honor" dificulty={2} textDificulty={'Dificuldade - Computadores (incluindo celulares) com dificuldade 2, eletrônicos (incluindo câmeras) com dificuldade 3, motores elétricos ou de combustão (carros, trens, etc)  com dificuldade 4, armas de fogo e outras reações químicas (explosivos, fogo, etc) com dificuldade 5 e dispositivos estritamente mecânicos (guincho, bicicleta, trava mecânica) com dificuldade 6+.'} />
    case 'Gremlins':
      return <RageOrWpWithRoll type="rage" attribute="charisma" skill="" renown="glory" dificulty={2} textDificulty="Dificuldade - Computadores (incluindo celulares) com dificuldade 2, eletrônicos (incluindo câmeras) com dificuldade 3, motores elétricos ou de combustão (carros, trens, etc)  com dificuldade 4, armas de fogo e outras reações químicas (explosivos, fogo, etc) com dificuldade 5 e dispositivos estritamente mecânicos (guincho, bicicleta, trava mecânica) com dificuldade 6+." />
    case 'The Thousand Forms':
      return <RageOrWpWithRoll type="rage" attribute="dexterity" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (Se a forma desejada for particularmente grande, pequena ou exótica, a Dificuldade pode aumentar em 1 ou mais, a critério do Contador de Histórias)." />
    case "Crow's Laughter":
      return <RageOrWpWithRoll type="rage" attribute="manipulation" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Autocontrole + Intuição, ou um valor imposto pelo Narrador).'} />
    case 'Whelp Body':
      return <RageOrWpWithRoll type="rage" attribute="resolve" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Ocultismo, ou um valor imposto pelo Narrador).'} />
    case 'Banish Spirit':
      return <RageOrWpWithRoll type="rage" attribute="resolve" skill="" renown="glory" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo espírito alvo em um teste de Poder, ou um valor imposto pelo Narrador).'} />
    case 'Feral Regression':
      return <RageOrWpWithRoll type="rage" attribute="intelligence" skill="" renown="glory" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Determinação + Ocultismo, ou um valor imposto pelo Narrador).'} />
    case 'Living Ward':
      return <RageOrWpWithRoll type="rage" attribute="resolve" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo espírito alvo em um teste de Poder, ou um valor imposto pelo Narrador).'} />
    case "Beast's Fealty":
      return <RageOrWpWithRoll type="rage" attribute="charisma" skill="" renown="honor" dificulty={3} textDificulty="" />
    case 'Geas':
      return <RageOrWpWithRoll type="rage" attribute="manipulation" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Ocultismo, ou um valor imposto pelo Narrador. Outras criaturas sobrenaturais e humanos familiarizados com o Garou podem resistir, assim como qualquer um se o comando for contra sua natureza ou causar danos àqueles que o alvo ama. Uma ordem que prejudique diretamente a vítima irá falhar, por exemplo atirar em si mesma, assim como os comandos que exigem o impossível)." />
    case 'Strength of Purpose':
      return <RageOrWpWithRoll type="rage" attribute="" skill="" renown="honor" dificulty={1}  textDificulty="" />
    case 'Howl of Assembly':
      return <RageOrWpWithRoll type="rage" attribute="charisma" skill="" renown="honor" dificulty={2}  textDificulty="" />
    case 'Song of Rage':
      return <RageOrWpWithRoll type="rage" attribute="charisma" skill="" renown="glory" dificulty={3}  textDificulty="" />
    case 'Song of Valor':
      return <RageOrWpWithRoll type="rage" attribute="charisma" skill="" renown="honor" dificulty={3}  textDificulty="" />
    case 'Against the Odds':
      return <RageOrWpWithRoll type="rage" attribute="" skill="" renown="glory" dificulty={1}  textDificulty="" />
    case 'Burrow':
      return <RageOrWpWithRoll type="rage" attribute="strength" skill="" renown="wisdom" dificulty={2} textDificulty="Dificuldade (Solo macio é Dificuldade 2, enquanto solo rochoso compacto é Dificuldade 4)." />
    case 'Quicksand':
      return <RageOrWpWithRoll type="rage" attribute="intelligence" skill="" renown="honor" dificulty={2} textDificulty="Dificuldade (A dificuldade inicial é 2, mas deve ser aumentada em 1 para cada dez metros adicionais de distância)." />
    case 'Render Down':
      return <RageOrWpWithRoll type="rage" attribute="resolve" skill="" renown="honor" dificulty={2} textDificulty="Dificuldade (As Dificuldades variam de 2, para algo como uma arma de fogo, até 5 para uma coluna de pedra esculpida)." />
    case 'Lacerating Wind':
      return <RageOrWpWithRoll type="rage" attribute="resolve" skill="" renown="honor" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Sobrevivência, ou Destreza + Atletismo, ou um valor imposto pelo Narrador)." />
    case 'Snarl of Challenge':
      return <RageOrWpWithRoll type="rage" attribute="charisma" skill="" renown="honor" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Autocontrole + Intuição, ou um valor imposto pelo Narrador)." />
    case 'True Fear':
      return <RageOrWpWithRoll type="rage" attribute="charisma" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Autocontrole + Intuição, ou um valor imposto pelo Narrador)." />
    case 'Body Shift': 
      return <RageOrWpWithRoll type="rage" attribute="stamina" skill="" renown="glory" dificulty={2} textDificulty="" />
    case 'Break the Shackles':
      return <RageOrWpWithRoll type="rage" attribute="resolve" skill="" renown="glory" dificulty={3} textDificulty="A Dificuldade depende do tipo de efeito que está controlando o alvo e do poder da criatura por trás disso, mas o padrão é 3. O Narrador pode permitir que o alvo adicione sua Determinação ao conjunto de dados do teste do Dom se estiver ativamente tentando resistir ao efeito por conta própria." />

    //Dons que custam 1 ponto de Força de Vontade + 1 teste
    case 'Penumbral Senses':
      return <RageOrWpWithRoll type="willpower" attribute="intelligence" skill="" renown="wisdom" dificulty={2} textDificulty={'Dificuldade da Película Local (De 2 a 5)'} />; 
    case "Spider's Song":
      return <RageOrWpWithRoll type="willpower" attribute="resolve" skill="" renown="wisdom" dificulty={1} textDificulty={'Qualquer criptografia aumenta a Dificuldade em 1 ou mais.'} />
    case 'Thieving Talons of the Magpie':
      return <RageOrWpWithRoll type="willpower" attribute="intelligence" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (Rank de um Dom ou valor apropriado para outro alvo sobrenatural. Se não houver classificação, o Narrador deve atribuir uma Dificuldade apropriada).'} />
    case 'Shadow Sense':
      return <RageOrWpWithRoll type="willpower" attribute="wits" skill="" renown="wisdom" dificulty={2} textDificulty="Dificuldade (A Dificuldade do teste é 2, mas pode ser modificado por poderes que permitem que criaturas sobrenaturais escondam sua presença, como a habilidade vampírica de iludir a observação)." /> 
    case 'Ensnare Spirit':
      return <RageOrWpWithRoll type="willpower" attribute="wits" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo espírito alvo em um teste de Poder, ou um valor imposto pelo Narrador).'} />   
    case 'Command Spirit':
      return <RageOrWpWithRoll type="willpower" attribute="charisma" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo espírito alvo em um teste de Poder, ou um valor imposto pelo Narrador).'} />
    case "Sense the True Form":
      return <RageOrWpWithRoll type="willpower" attribute="wits" skill="" renown="wisdom" dificulty={1} textDificulty={'Dificuldade (Detectar um companheiro Garou com dificuldade 2, parentes antes de sua Primeira Mudança com dificuldade 3, enquanto algo quase indistinguível de um humano mundano, como um feiticeiro, pode ter dificuldade 5. Vampiros estão em algum lugar entre a dificuldade 2 e 4, dependendo se eles estão se disfarçando ativamente como mortais e seu nível geral de monstruosidade).'} />
    case "Fangs of Judgment":
      return <RageOrWpWithRoll type="willpower" attribute="resolve" skill="" renown="honor" dificulty={3} textDificulty="" />
    case 'Scent of the Past':
      return <RageOrWpWithRoll type="willpower" attribute="intelligence" skill="" renown="wisdom" dificulty={1} textDificulty='Dificuldade (Perceber as circunstâncias de um duelo travado na semana passada com uma arma específica é Dificuldade 2, mas obter informações sobre os membros de uma reunião secreta em um parque anos atrás aproxima-se de Dificuldade 6 ou superior).' />
    case 'Take the True Form':
      return <RageOrWpWithRoll type="willpower" attribute="manipulation" skill="" renown="honor" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Determinação, ou um valor imposto pelo Narrador)." />
    case 'Song of Serenity':
      return <RageOrWpWithRoll type="willpower" attribute="composure" skill="" renown="honor" dificulty={3} textDificulty="" />
    case 'Call the Ridden':
      return <RageOrWpWithRoll type="willpower" attribute="charisma" skill="" renown="glory" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Determinação + Intuição, ou um valor imposto pelo Narrador).'} />
    case 'Song of Inspiration':
      return <RageOrWpWithRoll type="willpower" attribute="manipulation" skill="" renown="wisdom" dificulty={3} textDificulty={'Dificuldade (3 se tiver menos de dois pontos na Habilidade escolhida, ou 2 se o possuir 2 ou mais pontos.'} /> 
    case 'Speech of the World':
      return <RageOrWpWithRoll type="willpower" attribute="intelligence" skill="" renown="wisdom" dificulty={1} textDificulty={'Dificuldade (chinês ou qualquer variante de árabe, por exemplo, teriam Dificuldade 2, uma tabuleta escrita em um dialeto obscuro do sumério teria Dificuldade 4, e runas entalhadas por uma mão desconhecida antes do alvorecer da humanidade teriam Dificuldade 5 ou mais).'} />
    case 'Fetch Bounty':
      return <RageOrWpWithRoll type="willpower" attribute="wits" skill="" renown="wisdom" dificulty={1} textDificulty={'Dificuldade (Encontrar um carro pode ter Dificuldade 2, enquanto localizar um Chevrolet Corvette 75 se aproxima de 4 ou 5 e pode exigir horas de viagem).'} />
    case 'Dire Distraction':
      return <RageOrWpWithRoll type="willpower" attribute="composure" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Raciocínio + Ocultismo (ou Sabedoria), ou um valor imposto pelo Narrador)." />
    case 'Fatal Flaw':
      return <RageOrWpWithRoll type="willpower" attribute="intelligence" skill="" renown="glory" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Raciocínio + Lábia, ou um valor imposto pelo Narrador).'} />
    case 'Thunderclap':
      return <RageOrWpWithRoll type="willpower" attribute="strength" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Raciocínio de todos dentro de 20 metros, ou um valor imposto pelo Narrador)." />
    case "Balor's Gaze":
      return <RageOrWpWithRoll type="willpower" attribute="charisma" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Autocontrole + Ocultismo, ou um valor imposto pelo Narrador)." />
    case 'Recovery Memory':
      return <RageOrWpWithRoll type="willpower" attribute="intelligence" skill="" renown="wisdom" dificulty={1} textDificulty="Dificuldade (Quanto pior o estado do objeto e quanto mais tempo ele passou nesse estado, maior será a Dificuldade." />
    case 'Doppelganger':
      return <RageOrWpWithRoll type="willpower" attribute="manipulation" skill="" renown="wisdom" dificulty={3} textDificulty="" />
    case 'Control Machine':
      return <RageOrWpWithRoll type="willpower" attribute="manipulation" skill="" renown="wisdom" dificulty={3} textDificulty="Dificuldade (Depende da complexidade do comando e do tamanho do alvo, e essa Dificuldade aumenta se o dispositivo for solicitado a fazer algo contrário ao seu propósito principal, como pedir a uma fechadura (projetada para barrar a entrada) que se abra. A Dificuldade nunca é inferior a 3, em qualquer caso, já que esse Dom é notoriamente complicado e muitos Garou prefeririam simplesmente destruir o dispositivo do que conversar com ele)." />
    case 'Augur':
      return <RageOrWpWithRoll type="willpower" attribute="intelligence" skill="" renown="wisdom" dificulty={1} textDificulty="Dificuldade (Um ponto de ônibus próximo abençoado com um espelho e uma poça adjacente pode ter uma Dificuldade 2, enquanto uma caverna do outro lado da Terra pode exigir uma Dificuldade 6 para encontrar a única gota de água da qual espionar)." />
    case 'Reveal Trauma':
      return <RageOrWpWithRoll type="willpower" attribute="intelligence" skill="" renown="wisdom" dificulty={1} textDificulty="Dificuldade depende do objeto: 2 para uma criatura viva, 3 para um espírito e 4 para uma máquina ou dispositivo (um objeto que não queira ser examinado pode tentar resistir, em vez de aplicar uma Dificuldade fixa, usando Autocontrole + Lábia)." />
    case 'Calm the Furious Beast':
      return <RageOrWpWithRoll type="willpower" attribute="composure" skill="" renown="wisdom" dificulty={1} textDificulty="Dificuldade igual à Fúria atual de um alvo em frenesi, ou 3 no caso de outras criaturas sobrenaturais" />
    case 'A Thousand Eyes':
      return <RageOrWpWithRoll type="willpower" attribute="wits" skill="" renown="honor" dificulty={1} textDificulty="Dificuldade Dependendo do número de animais nas proximidades e do que o usuário do Dom está procurando (investigar o layout de uma fazenda teria uma dificuldade de 2, enquanto encontrar um cientista específico em um centro médico urbano teria uma dificuldade de 5)." />
    case 'Streets tell Stories':
      return <RageOrWpWithRoll type="willpower" attribute="resolve" skill="" renown="honor" dificulty={1} textDificulty="Dificuldade dependendo do número de pessoas na rua (ou adjacente a ela) e da distância até a conversa buscada (ouvir uma conversa ocorrendo na calçada a duas quadras de distância em uma rua vazia teria uma Dificuldade de 2, enquanto captar uma conversa no 50º andar durante o horário de pico teria uma Dificuldade de 5)." />
    case "Gorgon's Visage":
      return <RageOrWpWithRoll type="willpower" attribute="charisma" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Raciocínio + Ocultismo, ou um valor imposto pelo Narrador)." />
    case 'Dreamwalk':
      return <RageOrWpWithRoll type="willpower" attribute="wits" skill="" renown="wisdom" dificulty={1} textDificulty="Dificuldade 2 para simplesmente observar, 3 para deixar uma mensagem e até 4 ou mais para alterar completamente a paisagem dos sonhos para afetar o sonhador de alguma forma." />
    case 'Curse of Aeolus':
      return <RageOrWpWithRoll type="willpower" attribute="resolve" skill="" renown="glory" dificulty={2} textDificulty="" />
    case "Mother's Touch":
      return <RageOrWpWithRoll type="willpower" attribute="intelligence" skill="" renown="glory" dificulty={1} textDificulty="" />
    case "Drain Spirit":
      return <RageOrWpWithRoll type="willpower" attribute="resolve" skill="" renown="glory" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo espírito alvo em um teste de Poder, ou um valor imposto pelo Narrador).'} />

    //Dons que custam 1 teste de Fúria + 1 teste condicional
    case 'Staredown':
      return <RgOrWpWithConditionInRoll type="rage" attribute="charisma" skill="" renown="honor" dificulty={1} textDificulty="" condition="Marque se o alvo for uma criatura sobrenatural ou humano cientes do Garou e seus poderes" />
    case 'Open Seal':
      return <RgOrWpWithConditionInRoll type="rage" attribute="manipulation" skill="" renown="honor" dificulty={2} textDificulty="Dificuldade 2 para um cadeado regular eletrônico, 5 para um scanner de impressão digital aprimorado" condition="Marque se o alvo é um Dispositivo eletrônico ou sobrenatural (Fechaduras ou barras puramente mecânicas abrem automaticamente)" />
    case "Gaia's Candor":
      return <RgOrWpWithConditionInRoll type="rage" attribute="charisma" skill="" renown="glory" dificulty={2} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Autocontrole + Lábia, ou um valor imposto pelo Narrador)." condition="Marque se o alvo é uma criatura sobrenatural ou um humano com experiência anterior com os Garou" />
    case "Halt the Coward's Flight":
      return <RgOrWpWithConditionInRoll type="rage" attribute="resolve" skill="" renown="honor" dificulty={2} condition="Marque se o alvo é uma criatura sobrenatural, como um vampiro ou outro Garou (o Dom é bem-sucedido automaticamente em pessoas comuns, veículos e animais)" textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Autocontrole + Sobrevivência, ou um valor imposto pelo Narrador)." />

    //Dons que custam 1 ponto de Força de Vontade + 1 teste condicional
    case 'Catfeet':
      return <RgOrWpWithConditionInRoll type="willpower" attribute="wits" skill="survival" renown="" dificulty={3} textDificulty="" condition="Marque se estiver ativando o dom reflexivamente" />
    case 'Pulse of the Prey':
      return <RgOrWpWithConditionInRoll type="willpower" attribute="intelligence" skill="" renown="wisdom" dificulty={3} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Inteligência + Manha (para esconderijos urbanos) ou Inteligência + Sobrevivência (em áreas rurais), ou um valor imposto pelo Narrador). A Dificuldade aumenta se um alvo tiver maneiras sobrenaturais de esconder-se." condition="Marque se estiver rastreando uma criatura sobrenatural ou um humano que está se escondendo ativamente" />
    case 'Mindspeak':
      return <RgOrWpWithConditionInRoll type="willpower" attribute="resolve" skill="" renown="wisdom" dificulty={2} textDificulty="Dificuldade - Depende da distância e se o usuário está familiarizado com a localização do assunto: um sujeito relaxando em casa é 2, enquanto um sujeito escondido em outro continente é 5" condition="Marque se o alvo é conhecido do usuário e não está presente" />
    case 'Eyes of the Cobra':
      return <RgOrWpWithConditionInRoll type="willpower" attribute="charisma" skill="" renown="glory" dificulty={2} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Autocontrole + Determinação, ou um valor imposto pelo Narrador)." condition="Marque se o alvo é uma criatura sobrenatural ou humana ciente dos Garou e seus poderes" />
    case "Life's Presence":
      return <RgOrWpWithConditionInRoll type="willpower" attribute="composure" skill="" renown="wisdom" dificulty={3} textDificulty="" condition="Marque se o alvo é uma Entidade sobrenatural que usa poderes para se ocultar" />

    //Testes que requerem ou não 1 ponto de força de vontade
    case "Scent of Running Water":
      return <WpConditional type="willpower" condition="Marque se deseja estender os efeitos do Dom à parada de dados do seu personagem por uma cena" />
    case "Camouflage":
      return <WpConditional type="willpower" condition="Marque se deseja estender seu efeito para os membros de sua matilha ao alcance" />
    case "Chill Cloak":
      return <WpConditional type="willpower" condition="Marque se deseja estender seu efeito aos membros de sua matilha que estejam ao alcance." />

    //Dons que não precisam de teste
    case "Sense Danger": return <SimpleTest />
    case "Blood of the Wastes": return <SimpleTest />
    case "Sacred Boundary": return <SimpleTest />

    //Dons que não utilizam Força de Vontade ou Fúria
    case 'Wasp Talons':
      return <NormalTest attribute="dexterity" skill="" renown="glory" />
    case "Defy Death":
      return <NormalTest attribute="" skill="" renown="honor" />
    case "Primal Anger":
      return <NormalTest attribute="" skill="" renown="glory" />

    //Testes Individuais
    case 'Pack Instinct': return <PackInstinct />
    case 'Sight from Beyond': return <SightFromBeyond />
    case "Razor Claws": return <RazorClaws />
    case "Silver Fangs": return <SilverFangs />
    case "Claws of Frozen Death": return <ClawsOfFrozenDeath />
    case "Wind Claws": return <WindClaws />
  }
}

// "gift": "Spirit of the Fray", "cost": "1 Teste de Fúria por oponente adicional", "pool": ""
// "gift": "Tongue of Beasts", "cost": "1 ponto de Força de Vontade", "pool": "Manipulação + Sabedoria, Carisma + Sabedoria"
// "gift": "Luna's Blessing", "cost": "1 Teste de Fúria + 1 ponto de Força de Vontade", "pool": ""
// "gift": "Grasp from Beyond", "cost": "1 a 3 pontos de Força de Vontade", "pool": "Determinação + Sabedoria"
// "gift": "Rapid Shift", "cost": "Nenhum (o custo da mudança ainda se aplica).", "pool": "Destreza + Glória"
// "gift": "Energize", "cost": "1 ou mais Testes de Fúria", "pool": "Determinação + Sabedoria"
// "gift": "Hands of Earth", "cost": "1 Teste de Fúria", "pool": "Determinação + Sabedoria, Raciocínio + Sabedoria"
// "gift": "The Living Wood", cost": "1 Teste de Fúria", "pool": "Manipulação + Glória"


