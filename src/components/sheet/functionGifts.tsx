import firebaseConfig from "@/firebase/connection";
import { authenticate, signIn } from "@/firebase/login";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import CatFeet from "./giftRolls/catfeet";

export const MechanicGift = (props: { nameGift: any }) => {
  if(props.nameGift === 'Catfeet') return <CatFeet />
}

export const reduceFdv = async (session: string): Promise<any> => {
  const db = getFirestore(firebaseConfig);
  const authData: { email: string, name: string } | null = await authenticate();
  // try {
    if (authData && authData.email && authData.name) {
      const { email } = authData;
      const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
      const userQuerySnapshot = await getDocs(userQuery);
      const players: any = [];
      userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
      const player: any = players.find((gp: any) => gp.email === email);
      if (player.data.willpower.length === 0) {
        player.data.willpower = [ { value: 1, agravated: false }];
      } else {
        const resolveComposure = player.data.attributes.resolve + player.data.attributes.composure;
        const agravated = player.data.willpower.filter((fdv: any) => fdv.agravated === true).map((fd: any) => fd.value);
        const superficial = player.data.willpower.filter((fdv: any) => fdv.agravated === false).map((fd: any) => fd.value);
        const allValues = Array.from({ length: resolveComposure }, (_, i) => i + 1);
        const missingInBoth = allValues.filter(value => !agravated.includes(value) && !superficial.includes(value));
        if (missingInBoth.length > 0) {
          const smallestNumber = Math.min(...missingInBoth);
          player.data.willpower.push({ value: smallestNumber, agravated: false });
          const docRef = userQuerySnapshot.docs[0].ref;
          const playersFiltered = players.filter((gp: any) => gp.email !== email);
          await updateDoc(docRef, { players: [...playersFiltered, player] });
          return true;
        } else {
          const missingInAgravated = allValues.filter(value => !agravated.includes(value));
          if (missingInAgravated.length > 0) {
            const smallestNumber = Math.min(...missingInAgravated);
            player.data.willpower.push({ value: smallestNumber, agravated: true });
            const docRef = userQuerySnapshot.docs[0].ref;
            const playersFiltered = players.filter((gp: any) => gp.email !== email);
            await updateDoc(docRef, { players: [...playersFiltered, player] });
            return true;
          } else {
            window.alert(`Você não possui mais pontos de Força de Vontade para realizar este teste (Já sofreu todos os danos Agravados possíveis).`);
            return false;
          }
        }
      }
    } else {
      const sign = await signIn();
      if (!sign) {
        window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
      }
    }
  // } catch (error) {
  //   window.alert('Erro ao atualizar valor de Força de Vontade ' + error );
  // }
};


export const eyesOfTheOwl = async () => {
  console.log("O usuário pode ver em qualquer escuridão natural sem penalidade. Se a escuridão for de origem sobrenatural, ele ganha um bônus igual a sua Sabedoria em qualquer tentativa de resistir a ela, se a resistência for possível.");
}

export const haresLeap = async () => {
  console.log("O jogador testa Força +  Glória e pula três metros na horizontal ou dois metros na vertical para cada sucesso no teste.");
}

export const penumbralSenses = async () => {
  console.log("O jogador testa Inteligência + Sabedoria contra a Dificuldade da Película local (geralmente 2–5). Se bem-sucedido, o Garou pode perceber e interagir com habitantes de ambos os mundos sem penalidade, a critério do Narrador. Embora essa habilidade não o torne visível para entidades físicas se usada na Umbra, ela alerta alguns espíritos de sua presença se usada no mundo físico.");
}

export const ragingStrike = async () => {
  console.log("O jogador faz um Teste de Fúria para ganhar dados de bônus igual à sua Glória em um único ataque de  Briga.");
}

export const staredown = async () => {
  console.log("Este Dom pode ser usado em qualquer humano ou animal, dentro de dois metros, com quem o Garou possa estabelecer contato visual. O Dom funciona automaticamente em humanos e animais mundanos e faz com que o alvo saia do caminho do lobisomem enquanto desvia seus olhos, se não rastejando completamente. Criaturas sobrenaturais e humanos cientes dos Garou e seus poderes não são afetados a menos que o jogador obtenha sucesso em um teste de Carisma + Honra vs. Compostura + Determinação. Uma criatura pode ser alvo deste Dom apenas uma vez por cena, e o Dom não pode ser usado durante um conflito físico. Este Dom pode ser usado em qualquer forma.");
}

export const sharpenedSenses = async () => {
  console.log("Upon activating this Gift, the Difficulty of all Awareness tests made by the player are lowered by the character's Wisdom, to a minimum of 2. This Gift can be used in any form.");
}

export const spiritOfTheFray = async () => {
  console.log("The Gift allows the Garou to attack additional opponents, within reach, up to the character's Glory, without penalty. Make a single attack roll and apply it to every opponent engaged and covered by the Rage expenditure (see cost). Any additional bonus to the attack applies to all opponents.");
}

export const thwartingTheArrow = async () => {
  console.log("The Garou gains their Honor as bonus dice to all tests to avoid projectile weapons. This Gift can be used only in crinos form.");
}

export const bodyShift = async () => {
  console.log("The player tests Stamina + Glory at a Difficulty of 2. Each success in the margin allows them to redistribute a single dot from one Physical  Attribute to another. No Attribute can drop below 0 or exceed 5 dots through use of this Gift. At the Storyteller's discretion, this Gift can also allow the user to contort their body to fit into spaces too tight for a normal body to traverse, such as common air ducts or water pipes. In this case, the Difficulty is based on the dimensions of the target space.");
}

export const jamTechnology = async () => {
  console.log("The Garou beseeches the spirit for a turn and their player tests Resolve + Honor against the table below: Computers (including mobile phones) with Difficulty 2, Electronics (including cameras) with Difficulty 3, Electrical or combustion engines (cars, trains, etc.) with Difficulty 4, Firearms and other chemical reactions (explosives, fire, etc.) with Difficulty 5, Strictly mechanical devices (winch, bicycle, mechanical lock) with Difficulty 6+. All equipment within 20 meters with a Difficulty match ing or falling below (see table) the number of successes rolled stops functioning for the duration of the Gift. Note that it is entirely possible to overshoot the target, taking out a far wider range of devices than what was intended, but such are the vagaries of the Wyld.");
}

export const tongueOfBeasts = async () => {
  console.log("O lobisomem pode falar livremente com  qualquer animal, entendendo-o como se fosse uma pessoa, limitado pela perspectiva e mente do animal. Os animais geralmente não estão inclinados a ajudar o Garou, mas podem ser convencidos a fornecer informações com um teste de  Manipulação + Sabedoria ou convencidos a realizar uma tarefa ou serviço com Carisma + Sabedoria. As dificuldades variam de 2 (perguntar a um guaxinim onde a fábrica despeja seu lixo) a 5 (fazer com que um bicho-pau de estimação se sacrifique causando um curto-circuito. Em geral, quanto mais distante dos mamíferos o animal estiver e quanto mais terrível for a informação ou serviço, maior será a Dificuldade.");
};

export const blissfulIgnorance = async () => {
  console.log("O Garou torna-se praticamente invisível,  desde que permaneça imóvel e silencioso. Qualquer  tentativa de localizá-los é feita com uma Dificuldade de 2 + a Sabedoria do usuário do Dom. Qualquer  movimento quebra o efeito e tentar usar o Dom para emboscada está sujeito às regras normais de emboscada, pois o alvo tem a chance de localizar o atacante antes da jogada de ataque. (Teste  Raciocínio + Percepção contra a Compostura + Furtividade do atacante.)");
};

export const crowsLaughter = async () => {
  console.log("O Dom deve ter como alvo alguém dentro da visão e audição do usuário. O Garou ataca o alvo em um teste de Manipulação + Honra vs. Compostura + Percepção para causar dano superficial à Força de Vontade. Caso obtenha sucesso no teste contra o valor, o mesmo deve, em seguida, direcionar sua atenção e ataques ao usuário, a menos que gaste um ponto de Força de Vontade para resistir a esse impulso. Este Dom também pode ser usado na forma hominídea.");
};

export const gremlins = async () => {
  console.log("O usuário visa um dispositivo à vista e dentro de cinco metros e testa Carisma + Glória contra a Dificuldade do dispositivo descrita abaixo. Um sucesso significa que o dispositivo fica inutilizável pelo resto da cena; um sucesso crítico torna o dispositivo completamente inoperante e irreparável. Este Dom também pode que permaneça ser usado na forma de lupino. Nível de complexidade: computadores (incluindo celulares) com dificuldade 2, eletrônicos (incluindo câmeras) com dificuldade 3, motores elétricos ou de combustão (carros, trens, etc)  com dificuldade 4, armas de fogo e outras reações químicas (explosivos, fogo, etc) com dificuldade 5 e dispositivos estritamente mecânicos (guincho, bicicleta, trava mecânica) com dificuldade 6+.");
};

export const spidersSong = async () => {
  console.log("O Garou faz um teste de Determinação + Sabedoria e o número de sucessos indica quanto da conversa ele conseguem entender. Um único sucesso rende apenas algumas palavras espalhadas, enquanto cinco ou mais (ou um sucesso crítico) permite que o usuário ouça cada palavra e possivelmente até identifique quem está do outro lado  da conversa. Para conversas via telefones fixos, o lobisomem deve colocar o ouvido contra um fio telefônico; para ouvir as conversas no celular, eles precisam apenas ver um dos dispositivos em uso. Qualquer criptografia aumenta a Dificuldade em 1 ou mais. Este Dom também pode ser usado na forma hominídea.");
};

export const blurOfTheMilkyEye = async () => {
  console.log("O ragabash ganha seu bônus de Sabedoria em todos os testes de Furtividade, bem como em testes defensivos contra ataques físicos pelo resto da cena. O Dom termina assim que o usuário interagir diretamente com um alvo, como atacá-lo ou engajá-lo em uma conversa.");
};

export const openSeal = async () => {
  console.log("Fechaduras ou barras puramente mecânicas abrem automaticamente quando este Dom é empregado.  Dispositivos eletrônicos ou sobrenaturais requerem um teste de Manipulação + Honra vs. uma Dificuldade definida pelo Narrador (2 para um cadeado regular eletrônico, 5 para um scanner de impressão digital aprimorado). Algumas fechaduras extremamente avançadas podem estar além da capacidade deste Dom de abrir, a critério do Narrador. Este Dom também pode ser usado na forma hominídea.");
};

export const pulseOfThePrey = async () => {
  console.log("Nenhum teste é necessário para rastrear um humano que não esteja escondido. Rastrear uma criatura sobrenatural ou um humano que está se escondendo ativamente requer um teste de Inteligência + Sabedoria contra Inteligência + Manha (para esconderijos urbanos) ou Inteligência + Sobrevivência (em áreas rurais). A Dificuldade aumenta se um alvo tiver maneiras sobrenaturais de esconder-se. O tempo necessário depende tanto da distância até o alvo quanto do resultado da rolagem. Quanto maior a margem, mais rápido o alvo pode ser localizado. Este Dom também pode ser usado na forma de lupino.");
};

export const scentOfRunningWater = async () => {
  console.log("Após a ativação do Dom, o Garou não deixa nenhuma evidência física de sua passagem (pegadas, vegetação perturbada, traços de DNA, etc.). O Garou também ganha sua Sabedoria como um bônus em qualquer teste para evitar rastreamento sobrenatural. A ativação deste Dom é gratuita para o usuário, mas gastando um ponto de Força de Vontade o jogador pode estender os efeitos do Dom à parada de dados do seu personagem por uma cena. Esse dom também pode ser usado na forma de lupino.");
};

export const lunasBlessing = async () => {
  console.log("Para ativar este Dom, a lua deve estar visível para o Garou. Uma vez ativado, por um uivo suplicante direcionado a Luna, trate o dano de prata até a Sabedoria do usuário (por fonte de dano) como Superficial.");
};

export const thievingTalonsOfTheMagpie = async () => {
  console.log("Este Dom pode ter como alvo um poder ou habilidade sobrenatural de qualquer pessoa à vista do usuário, que precisa apenas ter testemunhado o poder em uso pelo Garou. A habilidade deve ser aprendida, não inerente ao alvo (o Dom de um Garou pode ser roubado, mas sua habilidade de mudar de forma não pode, por exemplo). O jogador testa Inteligência + Honra contra a classificação do poder: o rank de um Dom ou valor apropriado para outro alvo sobrenatural (se não houver classificação, o Narrador deve atribuir uma Dificuldade apropriada). Em caso de sucesso, o alvo perde o poder  e quaisquer efeitos derivados dele expiram  imediatamente. Começando com o próximo turno, o lobisomem é capaz de usar o poder como se fosse um Dom possuído por eles, substituindo o renome de Honra por qualquer Característica não-Garou necessária. No começo de cada turno subsequente, um ponto de Força de Vontade deve ser gasto ou o poder retorna ao proprietário original.");
}

export const theThousandForms = async () => {
  console.log("");
}

export const whelpBody = async () => {
  console.log("Este Dom pode atingir qualquer um em um raio de cinco metros e à vista do usuário, cujo jogador deve testar Determinação + Honra contra Vigor + Ocultismo do alvo. Para cada sucesso na margem, o alvo perde um ponto de um de seus Atributos Físicos (para um mínimo de zero) enquanto seus corpos são devastados por uma aflição espiritual fulminante. Os efeitos persistem pelo resto da história, embora eles às vezes possam se tornar permanentes, a critério do Narrador.");
}

export const ensnareSpirit = async () => {
  console.log("O espírito deve estar presente e no mesmo reino (físico ou espiritual) que o usuário. O espírito-alvo está sujeito a uma penalidade de dois dados em qualquer tentativa que possa fazer para resistir ou que o usuário possa fazer para negociar com ele ou comandá-lo (incluindo o uso do Espírito de Comando). O espírito também é forçado a ficar onde está, a menos que se liberte em um teste de Poder (sujeito à penalidade de dois dados) contra o Raciocínio + Honra do usuário do dom. Este Dom não pode ser usado em um espírito já hostil e qualquer tentativa de ferir o espírito faz com que o Dom cesse.");
}

export const mothersTouch = async () => {
  console.log("Faça um teste de Inteligência + Glória. O alvo cura um total de pontos de dano físico superficial igual ao número de sucessos obtidos. Se o número de sucessos exceder a Fúria atual do alvo, um único nível de dano Agravado pode ser curado no lugar de um Superficial. Este Dom pode ser usado em qualquer forma.");
}

export const shadowSense = async () => {
  console.log("Em um teste bem-sucedido de Raciocínio + Sabedoria, este Dom alerta o Garou se elementos ou criaturas sobrenaturais estiverem próximos, embora não especifique sua localização ou identidade exata. A Dificuldade do teste é 2, mas pode ser modificado por poderes que permitem que criaturas sobrenaturais escondam sua presença, como a habilidade vampírica de iludir a observação.");
}

export const sightFromBeyond = async () => {
  console.log("As visões proféticas podem vir espontaneamente, onde o Narrador poderá decidir quando e como elas se manifestam. Se desejar, o Narrador pode fazer com que o jogador teste Inteligência + Sabedoria para revelar pistas sobre a história ou alertar sobre o perigo em algum grau e clareza determinada pelo número de sucessos obtidos. Uma vez por cena, um jogador também pode tentar provocar essas visões intencionalmente gastando um ponto de Força de Vontade.");
}

export const banishSpirit = async () => {
  console.log("O espírito deve estar presente e no mesmo reino (físico ou espiritual) que o usuário. Em um teste bem-sucedido de Determinação + Glória contra Poder, o espírito é forçado a abandonar o objeto ou pessoa possuída e se retirar totalmente para a Umbra. Ao sair, um espírito malévolo pode causar seu Poder menos o sucesso obtivo pelo alvo como dano agravado ao seu alvo possuído. Uma vez banidos, a maioria dos espíritos não pode habitar outro alvo durante toda a cena, embora alguns possam, a critério do Narrador. Se usado na Umbra, este Dom forçará o espírito a recuar ou fugir.");
}

export const graspFromBeyond = async () => {
  console.log("Como parte da travesia pela Película (veja p. 230) ou ao observar o mundo físico a partir da Umbra, o usuário agarra o objeto físico firmemente e o puxa para os Planos Espirituais — ou para fora, realizando um teste de Resolução + Sabedoria contra a Dificuldade da Película local. Falhar no teste significa que o objeto permanece onde está, embora o usuário não seja afetado. O custo de Força de Vontade depende do tamanho do objeto, com um item pequeno (um livro ou laptop) requerendo um único ponto, e um grande (um carro ou tenda) requerendo três.");
}

export const mindspeak = async () => {
  console.log("O usuário se concentra e envia uma mensagem mental para opalavra do comando em seu benefício - ou para alvo escolhido. Se o usuário não conheceu o alvo pessoalmente, o alvo deve estar na linha de visão. Se o alvo for conhecido do usuário, mas não estiver presente, um teste de Resolução + Sabedoria é necessário para estabelecer contato (a dificuldade depende da distância e se o usuário está familiarizado com a localização do assunto: um sujeito relaxando em casa é 2, enquanto um sujeito escondido em outro continente é 5). Uma vez estabelecido o contato, os pensamentos podem viajar em ambas as direções, desde que ambos os participantes estejam dispostos. Este Dom não pode ser usado para ler a mente de um alvo; apenas os pensamentos destinados ao receptor podem ser transmitidos.");
}

export const umbralTether = async () => {
  console.log("Ao entrar na Umbra, o usuário pode ativar este Dom, criando uma corda prateada que o conecta ao ponto onde ele primeiro cruzou a Película. Somente o usuário pode ver a corda. Enquanto estiver na Umbra, o usuário sempre pode encontrar o caminho de volta seguindo a corda de prata. O usuário também ganha sua Sabedoria como dados de bônus em qualquer tentativa de navegar pelos Planos Espirituais, já que a corda os ajuda a evitar andar em círculos ou refazer seus passos. Este Dom pode ser usado em qualquer forma.");
}

export const commandSpirit = async () => {
  console.log("O espírito deve estar presente e no mesmo reino (físico ou espiritual) que o usuário. Para cada comando, o jogador deve derrotar o espírito em um teste de Carisma + Honra contra o Poder do espírito. Os espíritos não podem ser ordenados a infligir danos a eles mesmos ou a qualquer coisa a que estejam ligados ou possuídos, e nem podem ser ordenados a se afastarem de um objeto ou criatura ligada ou possuída.");
}

export const drainSpirit = async () => {
  console.log("O espírito deve estar presente e no mesmo reino (físico ou espiritual) que o usuário. O Garou realiza um teste de Determinação + Glória contra o Poder do espírito. Se bem-sucedido, o Garou pode restaurar um ponto de dano de Força de Vontade Superficial para cada sucesso obtido na margem, prejudicando o espírito em igual quantidade. A falha no teste causa um ponto de dano de Força de Vontade Agravada ao usuário. Um espírito pode ser afetado por este Dom apenas uma vez por cena.");
}

export const feralRegression = async () => {
  console.log("O usuário pode ter como alvo qualquer pessoa dentro de sua visão. Para cada sucesso obtido no teste de Inteligência + Glória contra Determinação + Ocultismo do alvo, o alvo perde um único ponto de um de seus Atributos Mentais, embora nenhum Atributo possa cair abaixo de 0. Os efeitos persistem pelo resto da história, embora às vezes possam se tornar permanentes, a critério do Narrador.");
}

export const livingWard = async () => {
  console.log("Enquanto o usuário se concentrar, nenhum espírito pode chegar a três metros da ala viva sem derrotar o jogador do lobisomem em um teste de Poder vs Resolução + Honra. Se o Garou usando este Dom falhar neste competição, eles devem imediatamente diminuir sua proteção ou gastar Força de Vontade igual à quantidade pela qual falharam no teste. concurso.");
}

export const ancestralConviction = async () => {
  console.log("O Garou ganha sua Honra como dados de bônus em Testes de Perícia de Persuasão contra outros Garou. Este Dom pode ser usado em qualquer forma.");
}

export const gaiasCandor = async () => {
  console.log("Nenhum teste é necessário para um humano que não conhece os Garou ou seus poderes. Outra criatura sobrenatural ou um humano com experiência anterior com o Garou pode tentar resistir ao efeito, caso em que o jogador do usuário deve vencer um teste de Carisma + Glória contra Compostura + Lábia.");
}

export const porcupinesReprisal = async () => {
  console.log("Ao receber dano de um ataque de briga ou Arma Branca, o usuário pode fazer um Teste de Fúria para imediatamente causar um dano Superficial igual à sua Glória no atacante. O dano não pode exceder a quantidade recebida no ataque original.");
}

export const senseTheTrueForm = async () => {
  console.log("O jogador realiza um teste de Raciocínio + Sabedoria contra uma Dificuldade dependendo da criatura enfrentada. Este Dom pode ser usado em qualquer forma.");
}

export const beastsFealty = async () => {
  console.log("O Garou tem como alvo um animal dentro da linha de visão e testa Carisma + Honra contra uma dificuldade 3. Se for bem sucedido, o usuário é capaz de se comunicar e emitir comandos para o animal, onde o mesmo obedecerá até a morte. O poder dura até que o Garou libere o animal de sua obrigação para com ele ou até que o animal morra. Este Dom pode controlar apenas um animal por vez.");
}

export const commandthegathering = async () => {
  console.log("Uma vez ativo, o Dom torna o usuário o foco de atenção para todos dentro da linha de visão ou audição, e o jogador pode adicionar seus pontos de Renome em Glória como bônus de dados para qualquer discurso público ou apresentação envolvendo Persuasão ou Performance. Humanos e animais mundanos são atraídos pelo usuário e é impossível usar este Dom e manter qualquer aparência de discrição. A altercação física na presença do usuário quebra o efeito, e o Dom não pode ser usado enquanto o lobisomem estiver envolvido em um conflito físico ou combate direto.");
};

export const fangsofjudgment = async () => {
  console.log("O usuário do Dom seleciona um alvo visível que já causou dano a um membro de sua matilha e o realiza um teste de Determinação + Honra com uma dificuldade 3. Se for bem-sucedido, as armas naturais da matilha ganham +1 de dano contra o alvo designado. Apenas um inimigo pode ser marcado por um único Garou e os efeitos não são cumulativos se o alvo for outro Garou com o mesmo Dom. O Dom dura até que o inimigo esteja morto ou a sentença seja revogada, mas esta última só pode ser feita na presença do usuário do dom.");
};

export const scentofthepast = async () => {
  console.log("Faça um teste de Inteligência +  Sabedoria contra uma Dificuldade dependendo da informação procurada. de detecção as circunstâncias de  um duelo travado na semana passada com uma arma específica é de Dificuldade 2, mas obter informações sobre os membros de uma reunião secreta em um parque  anos atrás se aproxima da Dificuldade 6 ou superior. Cada ponto de margem na rolagem permite ao usuário  obter informações progressivamente mais detalhadas. Este Dom também pode ser usado na forma de lupino.");
};

export const geas = async () => {
  console.log("O Garou deve emitir a ordem verbalmente e na presença do alvo. Outras criaturas sobrenaturais e humanos familiarizados com o Garou podem resistir, assim como qualquer um se o comando for contra sua natureza ou causar danos àqueles que o alvo ama. Uma ordem que prejudique diretamente a vítima irá falhar, por exemplo atirar em si mesma, assim como os comandos que exigem o impossível. Até que o alvo complete o ato ou o Garou o libere do feitiço, o alvo tenta realizar o ato pelo resto da cena.");
};

export const oathbreakersbane = async () => {
  console.log("O sujeito deve fazer o juramento pessoalmente para o usuário. O juramento deve ser algo que o receptor compreenda e aceite. Pode ser tão sucinto ou detalhado quanto o usuário do Dom desejar, mas a promessa permanece em vigor enquanto tanto o forjador do juramento quanto o receptor do juramento se lembrarem dele. Assim, não é incomum que o forjador busque o receptor para lembrá-lo de sua promessa. O Garou imediatamente percebe quando o juramento é quebrado, não importa a distância ou o tempo decorrido. A partir de então, qualquer tentativa do usuário de rastrear quem quebrou o juramento concede ao jogador dados bônus iguais à Honra do Garou.");
};

export const strengthofpurpose = async () => {
  console.log("O Garou realiza um teste com um dado para cada ponto de Honra que possui, curando um ponto de Dano Superficial de Força de Vontade para cada sucesso, ou um dos Dano de Força de Vontade agravado a cada dois sucessos. Este Dom pode ser usado apenas uma vez por sessão e pode ser usado em qualquer forma.");
};

export const takethetrueform = async () => {
  console.log("O Garou comanda o alvo para retornar à  sua forma natural, testando Manipulação + Honra contra o Vigor + Determinação do alvo. Caso obtenha sucesso, o alvo retorna à sua forma normal, seguindo suas regras usuais e então não consegue mudar de forma por um número de turnos igual a diferença de sucesso obtida. Este Dom pode ser usado na forma hominídea ou lupina e o Dom deixa de ser ativo se o usuário mudar de forma durante seu efeito.");
};

export const animalmagnetism = async () => {
  console.log("O jogador do Garou ganha sua Glória como dados de bônus em testes de Habilidade Social contra humanos. Este Dom também pode ser usado na forma hominídea.");
};

export const howlofassembly = async () => {
  console.log("O jogador do Garou testa Carisma + Honra contra uma Dificuldade de 2. Se for bem sucedido, outro Garou que ouça o uivo e junte-se à presença do usuário do Dom cura um ponto de Força de Vontade. Para cada sucesso na margem, o som atinge mais 100 metros. Um personagem pode ser afetado por este Dom apenas uma vez por sessão. Este dom também pode ser usado na forma de lupina.");
};

export const songofrage = async () => {
  console.log("Faça um teste de Carisma + Glória com Dificuldade 3. Se for bem-sucedido, todos os demais membros da matilha ao alcance da voz ganham um ponto de Fúria, ou dois pontos em uma vitória crítica. Um personagem pode ser afetado por este Dom apenas uma vez por sessão.");
};
