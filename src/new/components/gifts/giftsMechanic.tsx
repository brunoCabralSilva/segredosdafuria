import { RageTestOrWp } from "./rageTestOrWp";

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

    // case 'Catfeet': return <CatFeet />;
    // case "Hare's Leap": return <AutoRollWithRage attribute="strength" skill="" renown="glory" dificulty={1} />; 
    // case 'Penumbral Senses': return <AutoRollwithWill attribute="intelligence" skill="" renown="wisdom" dificulty={2} textDificulty={'Dificuldade da Película Local'} />;
    // case 'Staredown': return <Staredown />;
    // case 'Spirit of the Fray': return <SpiritOfTheFray />
    // case 'Body Shift': return <AutoRollWithRage attribute="stamina" skill="" renown="glory" dificulty={2} />
    // case 'Jam Technology': return <AutoRollwithWill attribute="resolve" skill="" renown="honor" dificulty={2} textDificulty={'Dificuldade(computadores (incluindo celulares) com dificuldade 2, eletrônicos (incluindo câmeras) com dificuldade 3, motores elétricos ou de combustão (carros, trens, etc)  com dificuldade 4, armas de fogo e outras reações químicas (explosivos, fogo, etc) com dificuldade 5 e dispositivos estritamente mecânicos (guincho, bicicleta, trava mecânica) com dificuldade 6+).'} />
    // case 'Tongue of Beasts': return <TongueOfBeasts />;
    // case "Crow's Laughter": return <AutoRollWithRage attribute="manipulation" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Autocontrole + Intuição, ou um valor imposto pelo Narrador).'} />
    // case 'Gremlins': return <AutoRollWithRage attribute="charisma" skill="" renown="glory" dificulty={2} textDificulty="Dificuldade - Nível de complexidade: computadores (incluindo celulares) com dificuldade 2, eletrônicos (incluindo câmeras) com dificuldade 3, motores elétricos ou de combustão (carros, trens, etc)  com dificuldade 4, armas de fogo e outras reações químicas (explosivos, fogo, etc) com dificuldade 5 e dispositivos estritamente mecânicos (guincho, bicicleta, trava mecânica) com dificuldade 6+." />
    // case "Spider's Song": return <AutoRollwithWill attribute="resolve" skill="" renown="wisdom" dificulty={1} textDificulty={'Qualquer criptografia aumenta a Dificuldade em 1 ou mais.'} />
    // case 'Open Seal': return <OpenSeal />;
    // case 'Pulse of the Prey': return <PulseOfThePrey />;
    // case 'Scent of Running Water': return <ScentOfRunningWater />;
    // case "Luna's Blessing": return <LunasBlessing />
    // case 'Thieving Talons of the Magpie': return <AutoRollwithWill attribute="intelligence" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (Rank de um Dom ou valor apropriado para outro alvo sobrenatural. Se não houver classificação, o Narrador deve atribuir uma Dificuldade apropriada).'} />
    // case 'The Thousand Forms': return <AutoRollWithRage attribute="dexterity" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (Se a forma desejada for particularmente grande, pequena ou exótica, a Dificuldade pode aumentar em 1 ou mais, a critério do Contador de Histórias)." />
    // case 'Whelp Body': return <AutoRollWithRage attribute="resolve" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Ocultismo, ou um valor imposto pelo Narrador).'} />
    // case 'Ensnare Spirit': return <AutoRollwithWill attribute="wits" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo espírito alvo em um teste de Poder, ou um valor imposto pelo Narrador).'} /> 
    // case "Mother's Touch": return <AutoRollwithWill attribute="intelligence" skill="" renown="glory" dificulty={1} />
    // case 'Shadow Sense': return <AutoRollwithWill attribute="wits" skill="" renown="wisdom" dificulty={2} textDificulty="Dificuldade (A Dificuldade do teste é 2, mas pode ser modificado por poderes que permitem que criaturas sobrenaturais escondam sua presença, como a habilidade vampírica de iludir a observação)." /> 
    // case 'Sight from Beyond': return <SightFromBeyond />
    // case 'Banish Spirit': return <AutoRollWithRage attribute="resolve" skill="" renown="glory" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo espírito alvo em um teste de Poder, ou um valor imposto pelo Narrador).'} /> 
    // case 'Grasp from Beyond': return <GraspfromBeyond />
    // case 'Mindspeak': return <Mindspeak />
    // case 'Command Spirit': return <AutoRollwithWill attribute="charisma" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo espírito alvo em um teste de Poder, ou um valor imposto pelo Narrador).'} />
    // case 'Drain Spirit': return <DrainSpirit />
    // case 'Feral Regression': return <AutoRollWithRage attribute="intelligence" skill="" renown="glory" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Determinação + Ocultismo, ou um valor imposto pelo Narrador).'} />
    // case 'Living Ward': return <AutoRollWithRage attribute="resolve" skill="" renown="honor" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo espírito alvo em um teste de Poder, ou um valor imposto pelo Narrador).'} /> 
    // case "Gaia's Candor": return <GaiasCandor />
    // case "Sense the True Form": return <AutoRollWithRage attribute="wits" skill="" renown="wisdom" dificulty={1} textDificulty={'Dificuldade (Detectar um companheiro Garou com dificuldade 2, parentes antes de sua Primeira Mudança com dificuldade 3, enquanto algo quase indistinguível de um humano mundano, como um feiticeiro, pode ter dificuldade 5. Vampiros estão em algum lugar entre a dificuldade 2 e 4, dependendo se eles estão se disfarçando ativamente como mortais e seu nível geral de monstruosidade).'} />
    // case "Beast's Fealty": return <AutoRollWithRage attribute="charisma" skill="" renown="honor" dificulty={3} />
    // case "Fangs of Judgment": return <AutoRollwithWill attribute="resolve" skill="" renown="honor" dificulty={3} />
    // case 'Scent of the Past': return <AutoRollwithWill attribute="intelligence" skill="" renown="wisdom" dificulty={1} textDificulty='Dificuldade (Perceber as circunstâncias de um duelo travado na semana passada com uma arma específica é Dificuldade 2, mas obter informações sobre os membros de uma reunião secreta em um parque anos atrás aproxima-se de Dificuldade 6 ou superior).' />
    // case 'Geas': return <AutoRollWithRage attribute="manipulation" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Ocultismo, ou um valor imposto pelo Narrador. Outras criaturas sobrenaturais e humanos familiarizados com o Garou podem resistir, assim como qualquer um se o comando for contra sua natureza ou causar danos àqueles que o alvo ama. Uma ordem que prejudique diretamente a vítima irá falhar, por exemplo atirar em si mesma, assim como os comandos que exigem o impossível)." />
    // case 'Howl of Assembly': return <AutoRollWithRage attribute="charisma" skill="" renown="honor" dificulty={2} />
    // case 'Song of Rage': return <AutoRollWithRage attribute="charisma" skill="" renown="glory" dificulty={3} />
    // case 'Song of Serenity': return <AutoRollwithWill attribute="composure" skill="" renown="honor" dificulty={3} />
    // case "Halt the Coward's Flight": return <HaltTheCowardsFlight />
    // case "Razor Claws": return <RazorClaws />
    // case 'Sense Danger': return <NoTestRoll />
    // case 'Curse of Aeolus': return <AutoRollwithWill attribute="resolve" skill="" renown="glory" dificulty={2} />
    // case 'Camouflage': return <Camouflage />
    // case 'Lacerating Wind': return <AutoRollWithRage attribute="resolve" skill="" renown="honor" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Sobrevivência, ou Destreza + Atletismo, ou um valor imposto pelo Narrador)." />
    // case 'Augur': return <AutoRollwithWill attribute="intelligence" skill="" renown="wisdom" dificulty={1} textDificulty="Dificuldade (Um ponto de ônibus próximo abençoado com um espelho e uma poça adjacente pode ter uma Dificuldade 2, enquanto uma caverna do outro lado da Terra pode exigir uma Dificuldade 6 para encontrar a única gota de água da qual espionar)." />
    // case 'Sacred Boundary': return <NoTestRoll />    
    // case 'Render Down': return <AutoRollWithRage attribute="resolve" skill="" renown="honor" dificulty={2} textDificulty="Dificuldade (As Dificuldades variam de 2, para algo como uma arma de fogo, até 5 para uma coluna de pedra esculpida)." />
    // case 'Fatal Flaw': return <AutoRollwithWill attribute="intelligence" skill="" renown="glory" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Raciocínio + Lábia, ou um valor imposto pelo Narrador).'} />
    // case 'Fetch Bounty': return <AutoRollwithWill attribute="wits" skill="" renown="wisdom" dificulty={1} textDificulty={'Dificuldade (Encontrar um carro pode ter Dificuldade 2, enquanto localizar um Chevrolet Corvette 75 se aproxima de 4 ou 5 e pode exigir horas de viagem).'} />
    // case 'Speech of the World': return <AutoRollwithWill attribute="intelligence" skill="" renown="wisdom" dificulty={1} textDificulty={'Dificuldade (chinês ou qualquer variante de árabe, por exemplo, teriam Dificuldade 2, uma tabuleta escrita em um dialeto obscuro do sumério teria Dificuldade 4, e runas entalhadas por uma mão desconhecida antes do alvorecer da humanidade teriam Dificuldade 5 ou mais).'} /> 
    // case 'Pack Instinct': return <PackInstinct />
    // case 'Rapid Shift': return <RapidShift />
    // case 'Call the Ridden': return <AutoRollwithWill attribute="charisma" skill="" renown="glory" dificulty={1} textDificulty={'Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Determinação + Intuição, ou um valor imposto pelo Narrador).'} />
    // case 'Eyes of the Cobra': return <EyesOfTheCobra />
    // case 'Song of Valor': return <AutoRollWithRage attribute="charisma" skill="" renown="honor" dificulty={3} />
    // case 'Song of Inspiration': return <AutoRollwithWill attribute="manipulation" skill="" renown="wisdom" dificulty={3} textDificulty={'Dificuldade (3 se tiver menos de dois pontos na Habilidade escolhida, ou 2 se o possuir 2 ou mais pontos.'} /> 
    // case 'Snarl of Challenge': return <AutoRollWithRage attribute="charisma" skill="" renown="honor" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Compostura + Intuição, ou um valor imposto pelo Narrador)." />
    // case 'True Fear': return <AutoRollWithRage attribute="charisma" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Autocontrole + Intuição, ou um valor imposto pelo Narrador)." />
    // case 'Burrow': return <AutoRollWithRage attribute="strength" skill="" renown="wisdom" dificulty={2} textDificulty="Dificuldade (Solo macio é Dificuldade 2, enquanto solo rochoso compacto é Dificuldade 4)." />
    // case 'Thunderclap': return <AutoRollWithRage attribute="strength" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Raciocínio de todos dentro de 20 metros, ou um valor imposto pelo Narrador)." />
    // case 'Dire Distraction': return <AutoRollWithRage attribute="composure" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Raciocínio + Ocultismo (ou Sabedoria), ou um valor imposto pelo Narrador)." /> 
    // case 'Quicksand': return <AutoRollWithRage attribute="intelligence" skill="" renown="honor" dificulty={2} textDificulty="Dificuldade (A dificuldade inicial é 2, mas deve ser aumentada em 1 para cada dez metros adicionais de distância)." />
    // case "Balor's Gaze": return <AutoRollwithWill attribute="charisma" skill="" renown="glory" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Autocontrole + Ocultismo, ou um valor imposto pelo Narrador)." />
    // case 'Recovery Memory': return <AutoRollwithWill attribute="intelligence" skill="" renown="wisdom" dificulty={1} textDificulty="Dificuldade (Quanto pior o estado do objeto e quanto mais tempo ele passou nesse estado, maior será a Dificuldade." />
    // case 'Doppelganger': return <AutoRollwithWill attribute="manipulation" skill="" renown="wisdom" dificulty={3} />
    // case 'Control Machine': return <AutoRollWithRage attribute="manipulation" skill="" renown="wisdom" dificulty={3} textDificulty="Dificuldade (Depende da complexidade do comando e do tamanho do alvo, e essa Dificuldade aumenta se o dispositivo for solicitado a fazer algo contrário ao seu propósito principal, como pedir a uma fechadura (projetada para barrar a entrada) que se abra. A Dificuldade nunca é inferior a 3, em qualquer caso, já que esse Dom é notoriamente complicado e muitos Garou prefeririam simplesmente destruir o dispositivo do que conversar com ele)." />
    // case 'Take the True Form': return <AutoRollwithWill attribute="manipulation" skill="" renown="honor" dificulty={1} textDificulty="Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Determinação, ou um valor imposto pelo Narrador)." />
    // case 'Against the Odds': return <SimplesRageTest />
  }
}
