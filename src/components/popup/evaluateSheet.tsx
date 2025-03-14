'use client'
import contexto from "@/context/context";
import { capitalizeFirstLetter, playerSheet, translate } from "@/firebase/utilities";
import { useContext, useEffect, useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function EvaluateSheet() {
  const {
    showEvaluateSheet, setShowEvaluateSheet, setShowMessage, dataSheet, players,
  } = useContext(contexto);
  const [data, setData] = useState(playerSheet);
  const [name, setName] = useState({ correct: false, errorMessage: '' });
  const [trybe, setTrybe] = useState({ correct: false, errorMessage: '' });
  const [auspice, setAuspice] = useState({ correct: false, errorMessage: '' });
  const [attributes4, setAttributes4] = useState({ correct: false, errorMessage: '' });
  const [attributes3, setAttributes3] = useState({ correct: false, errorMessage: '' });
  const [attributes2, setAttributes2] = useState({ correct: false, errorMessage: '' });
  const [attributes1, setAttributes1] = useState({ correct: false, errorMessage: '' });
  const [background, setBackground] = useState({ correct: false, errorMessage: '' });
  const [touchstone, setTouchstone] = useState({ correct: false, errorMessage: '' });
  const [renownSum, setRenownSum] = useState({ correct: false, errorMessage: '' });
  const [renownTrybe, setRenownTrybe] = useState({ correct: false, errorMessage: '' });
  const [advantages, setAdvantages] = useState({ correct: false, errorMessage: '' });
  const [flaws, setFlaws] = useState({ correct: false, errorMessage: '' });
  const [rituals, setRituals] = useState({ correct: false, errorMessage: '' });
  const [skillsType, setSkillsType] = useState({ correct: false, errorMessage: '' });
  const [skillsCountPlus, setSkillsCountPlus] = useState({ correct: true, errorMessage: '' });
  const [skillsCountPlus4, setSkillsCountPlus4] = useState({ correct: true, errorMessage: '' });
  const [skillsCount4, setSkillsCount4] = useState({ correct: true, errorMessage: '' });
  const [skillsCount3, setSkillsCount3] = useState({ correct: true, errorMessage: '' });
  const [skillsCount2, setSkillsCount2] = useState({ correct: true, errorMessage: '' });
  const [skillsCount1, setSkillsCount1] = useState({ correct: true, errorMessage: '' });
  const [skillsCount0, setSkillsCount0] = useState({ correct: true, errorMessage: '' });
  const [numberPlus, setNumberPlus] = useState(0);
  const [number4, setNumber4] = useState(0);
  const [number3, setNumber3] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [number1, setNumber1] = useState(0);
  const [number0, setNumber0] = useState(0);
  const [skillAcademics, setSkillAcademics] = useState({ correct: true, errorMessage: '' });
  const [skillCraft, setSkillCraft] = useState({ correct: true, errorMessage: '' });
  const [skillPerformance, setSkillPerformance] = useState({ correct: true, errorMessage: '' });
  const [skillScience, setSkillScience] = useState({ correct: true, errorMessage: '' });
  const [skillNewSpecialty, setSkillNewSpecialty] = useState({ correct: false, errorMessage: '' });
  const [skillSpecialtyZero, setSkillSpecialtyZero] = useState({ correct: false, errorMessage: '' });
  const [gifts, setGifts] = useState({ correct: false, errorMessage: '' });
  const [giftsGlobal, setGiftsGlobal] = useState({ correct: false, errorMessage: '' });
  const [giftsTrybe, setGiftsTrybe] = useState({ correct: false, errorMessage: '' });
  const [giftsAuspice, setGiftsAuspice] = useState({ correct: false, errorMessage: '' });

  useEffect(() => {
    let data: any = {};
    if (showEvaluateSheet.data !== 'player') {
      const findPlayer = players.find((player: any) => player.email === showEvaluateSheet.data);
      if (findPlayer) {
        data = findPlayer.data;
        setData(findPlayer.data);
      } else {
        setShowMessage({ show: true, text: 'Não foi possível localizar o Jogador.' });
        setShowEvaluateSheet({ show: false, data: {} });
      }
    } else {
      data = dataSheet.data;
      setData(dataSheet.data);
    }
    //Verificação de Nome de Personagem
    if (data.name.length === 0) {
      setName({
        correct: false,
        errorMessage: 'Na aba "Geral" da Ficha de personagem, deve ser preenchido um Nome.',
      });
    } else setName({ correct: true, errorMessage: '' });
    //Verificação de Tribo
    if (data.trybe === '') {
      setTrybe({
        correct: false,
        errorMessage: 'Na aba "Geral" da Ficha de personagem, deve ser selecionada uma Tribo.',
      });
    } else setTrybe({ correct: true, errorMessage: '' });
    //Verificação de Augúrio
    if (data.auspice === '') {
      setAuspice({
        correct: false,
        errorMessage: 'Na aba "Geral" da Ficha de personagem, deve ser selecionado um Augúrio.',
      });
    } else setAuspice({ correct: true, errorMessage: '' });
    //Verificação de Rituais
    if (data.rituals.length !== 1) {
      setRituals({ correct: false, errorMessage: 'Necessário navegar até a aba "Rituais" e adicionar 1 Ritual. Atualmente, você tem ' + data.rituals.length + '.'  });
    } else setRituals({ correct: true, errorMessage: '' });
    //Verificação de Touchstones
    if (data.touchstones.length < 1 || data.touchstones.length > 3) {
      let text = '';
      if (data.touchstones.length === 0) {
        text = 'Não existem Pilares preenchidos. É necessário preencher de um a três deles.'
      } else {
        text = 'Existem ' + data.touchstones.length + ' Pilares preenchidos. É necessário ir até a aba "Pilares" e preencher de um a três deles.'
      }
      setTouchstone({ correct: false, errorMessage: text });
    } else setTouchstone({ correct: true, errorMessage: '' });
    //Verificação de Backgrounds
    if (data.background === '' || data.background === ' ') {
      setBackground({
        correct: false,
        errorMessage: 'Na aba "Background", é necessário inserir uma história do personagem.',
      });
    } else setBackground({ correct: true, errorMessage: '' });

    verifyRenown(data);
    verifyAttributes(data);
    verifyAdvantagesAndFlaws(data);
    verifyGifts(data);
    verifySkills(data);
  }, [players, dataSheet]);

  const verifyGifts = (data: any) => {
    if (data.gifts.length !== 3) {
      let text = '';
      if (data.gifts.length === 0) text = 'não existem DSons adicionados.'
      else if (data.gifts.length === 1) text = 'existe apenas 1 Dom adicionado.';
      else text = 'existem ' + data.gifts.length + ' Dons adicionados.'
      setGifts({ correct: false, errorMessage: 'Necessário ir até a aba "Dons", clicar no botão "+" e adicionar 3: 1 Dom Nativo, 1 Dom do Augúrio e 1 Dom da Tribo. Atualmente, ' + text });
    } else setGifts({ correct: true, errorMessage: '' });

    const findGlobals = data.gifts.filter((gift: any) => gift.belonging.some((belongingItem: any) => belongingItem.type === 'global'));
    if (findGlobals.length === 0) {
      setGiftsGlobal({ correct: false, errorMessage: 'Necessário navegar até a aba "Dons", clicar no botão "+" e adicionar um Dom que pertenca a Dons Nativos.' });
    } else setGiftsGlobal({ correct: true, errorMessage: '' });

    const findTrybe = data.gifts.filter((gift: any) => gift.belonging.some((belongingItem: any) => belongingItem.type === data.trybe));
    if (findTrybe.length === 0) {
      setGiftsTrybe({ correct: false, errorMessage: 'Necessário navegar até a aba "Dons", clicar no botão "+" e adicionar um Dom que Pertença à Tribo ' + capitalizeFirstLetter(data.trybe) + '.' });
    } else setGiftsTrybe({ correct: true, errorMessage: '' });

    const findAuspice = data.gifts.filter((gift: any) => gift.belonging.some((belongingItem: any) => belongingItem.type === data.auspice));
    if (findAuspice.length === 0) {
      setGiftsAuspice({ correct: false, errorMessage: 'Necessário navegar até a aba "Dons", clicar no botão "+" e adicionar um Dom que Pertença ao Augúrio ' + capitalizeFirstLetter(data.auspice) + '.' });
    } else setGiftsAuspice({ correct: true, errorMessage: '' });
  }

  const verifyCorrectlySkills = (): boolean => {
    let condition = skillsType.correct && skillsCount3.correct && skillsCount2.correct && skillsCount1.correct && skillsCount0.correct && skillNewSpecialty.correct;
    if (data.skills.performance.value !== 0) {
      condition = condition && skillPerformance.correct;
    }
    if (data.skills.craft.value !== 0) {
      condition = condition && skillCraft.correct;
    }
    if (data.skills.academics.value !== 0) {
      condition = condition && skillAcademics.correct;
    }
    if (data.skills.science.value !== 0) {
      condition = condition && skillScience.correct;
    }

    if (data.skills.type === 'Especialista') {
      condition = condition && skillsCountPlus.correct && skillsCount4.correct;
    } else condition = condition && skillsCountPlus4.correct;
    return condition;
  }

  const verifySkills = async (data: any) => {
    if (data.skills.type === '') {
      setSkillsType({ correct: false, errorMessage: 'Necessário navegar até a aba "Habilidades" e selecionar o modelo de distribuição.' });
    } else {
      setSkillsType({ correct: true, errorMessage: '' });
      var countPlus = 0;
      let count4 = 0;
      let count3 = 0;
      let count2 = 0;
      let count1 = 0;
      let count0 = 0;
      for (const key in data.skills) {
        if (data.skills.hasOwnProperty(key)) {
          const value = data.skills[key].value;
          if (value > 4) countPlus += 1;
          else if (value === 4) count4 += 1;
          else if (value === 3) count3 += 1;
          else if (value === 2) count2 += 1;
          else if (value === 1) count1 += 1;
          else if (value === 0) count0 += 1;
        }
      }
      if (data.skills.type === 'Pau pra toda Obra') {
        setNumberPlus(0);
        setNumber4(0);
        setNumber3(1);
        setNumber2(8);
        setNumber1(10);
        setNumber0(8);
        if ((count4 + countPlus === 0) && count3 === 1 && count2 === 8 && count1 === 10 && count0 === 8) {
          setSkillsCountPlus4({ correct: true, errorMessage: '' });
          setSkillsCountPlus({ correct: true, errorMessage: '' });
          setSkillsCount4({ correct: true, errorMessage: '' });
          setSkillsCount3({ correct: true, errorMessage: '' });
          setSkillsCount2({ correct: true, errorMessage: '' });
          setSkillsCount1({ correct: true, errorMessage: '' });
          setSkillsCount0({ correct: true, errorMessage: '' });
        } else {
          if (countPlus + count4 === 0) {
            setSkillsCountPlus4({ correct: true, errorMessage: '' });
          } else {
            let text = ''; 
            if (countPlus + count4 === 1) text = 'existe 1 Habilidade com mais de 3 pontos';
            else text = 'existem ' + (countPlus + count4) + ' Habilidades com mais de 3 pontos';
            setSkillsCountPlus4({ correct: false, errorMessage: 'Nenhuma Habilidade pode ultrapassar 3 pontos. Atualmente, ' + text });
          }

          if (count3 === 1) {
            setSkillsCount3({ correct: true, errorMessage: '' });
          } else {
            let text = '';
            if (count3 > 1) text = 'existem ' + count3 + ' habilidades com 3 pontos.';
            else text = 'não há Nenhuma Habilidade com 3 pontos.';
            setSkillsCount3({ correct: false, errorMessage: 'Deve existir 1 Habilidade com 3 pontos. Atualmente, ' + text });
          }

          if (count2 === 8) {
            setSkillsCount2({ correct: true, errorMessage: '' });
          } else {
            let text = '';
            if (count2 === 1) text = 'existe ' + count2 + ' Habilidade com 2 pontos.';
            else if (count2 === 0) text = 'não existe nenhuma Habilidade com 2 pontos.';
            else text = 'existem ' + count2 + ' Habilidades com 2 pontos.'; 
            setSkillsCount2({ correct: false, errorMessage: 'Devem existir 8 Habilidades com 2 pontos. Atualmente, ' + text });
          }

          if (count1 === 10) {
            setSkillsCount1({ correct: true, errorMessage: '' });
          } else {
            let text = '';
            if (count1 === 1) text = 'existe ' + count1 + ' Habilidade com 1 ponto.';
            else if (count1 === 0) text = 'não existe nenhuma Habilidade com 1 ponto.';
            else text = 'existem ' + count1 + ' Habilidades com 1 ponto.'; 
            setSkillsCount1({ correct: false, errorMessage: 'Devem existir 10 Habilidades com 1 ponto. Atualmente, ' + text });
          }

          if (count0 === 8) {
            setSkillsCount0({ correct: true, errorMessage: '' });
          } else {
            let text = '';
            if (count0 === 1) text = 'existe ' + count0 + ' Habilidade com 0 pontos.';
            else if (count0 === 0) text = 'não existe nenhuma Habilidade com 0 pontos.';
            else text = 'existem ' + count0 + ' Habilidades com 0 pontos.'; 
            setSkillsCount0({ correct: false, errorMessage: 'Devem existir 8 Habilidades com 0 pontos. Atualmente, ' + text });
          }
        }
      } else if (data.skills.type === 'Equilibrado') {
        setNumberPlus(0);
        setNumber4(0);
        setNumber3(3);
        setNumber2(5);
        setNumber1(7);
        setNumber0(12);
        if ((count4 + countPlus === 0) && count3 === 3 && count2 === 5 && count1 === 7 && count0 === 12) {
          setSkillsCountPlus4({ correct: true, errorMessage: '' });
          setSkillsCountPlus({ correct: true, errorMessage: '' });
          setSkillsCount4({ correct: true, errorMessage: '' });
          setSkillsCount3({ correct: true, errorMessage: '' });
          setSkillsCount2({ correct: true, errorMessage: '' });
          setSkillsCount1({ correct: true, errorMessage: '' });
          setSkillsCount0({ correct: true, errorMessage: '' });
        } else {
          if (countPlus + count4 === 0) {
            setSkillsCountPlus4({ correct: true, errorMessage: '' });
          } else {
            let text = ''; 
            if (countPlus + count4 === 1) text = 'existe Uma Habilidade com mais de três pontos';
            else text = 'existem ' + (countPlus + count4) + ' Habilidades com mais de três pontos';
            setSkillsCountPlus4({ correct: false, errorMessage: 'Nenhuma Habilidade pode ultrapassar 3 pontos. Atualmente, ' + text });
          }

          if (count3 === 3) {
            setSkillsCount3({ correct: true, errorMessage: '' });
          } else {
            let text = '';
            if (count3 > 1) text = 'existem ' + count3 + ' Habilidades com 3 pontos.';
            else if (count3 === 1) text = 'existe 1 Habilidade com 3 pontos.';
            else text = 'não há nenhuma Habilidade com 3 pontos.';
            setSkillsCount3({ correct: false, errorMessage: 'Deve existir Três Habilidades com 3 pontos. Atualmente, ' + text });
          }

          if (count2 === 5) {
            setSkillsCount2({ correct: true, errorMessage: '' });
          } else {
            let text = '';
            if (count2 === 1) text = 'existe ' + count2 + ' Habilidade com 2 pontos.';
            else if (count2 === 0) text = 'não existe nenhuma Habilidade com 2 pontos.';
            else text = 'existem ' + count2 + ' Habilidades com 2 pontos.'; 
            setSkillsCount2({ correct: false, errorMessage: 'Devem existir Cinco Habilidades com 2 pontos. Atualmente, ' + text });
          }

          if (count1 === 7) {
            setSkillsCount1({ correct: true, errorMessage: '' });
          } else {
            let text = '';
            if (count1 === 1) text = 'existe ' + count1 + ' Habilidade com 1 ponto.';
            else if (count1 === 0) text = 'não existe nenhuma Habilidade com 1 ponto.';
            else text = 'existem ' + count1 + ' Habilidades com 1 ponto.'; 
            setSkillsCount1({ correct: false, errorMessage: 'Devem existir Sete Habilidades com 1 ponto. Atualmente, ' + text });
          }

          if (count0 === 12) {
            setSkillsCount0({ correct: true, errorMessage: '' });
          } else {
            let text = '';
            if (count0 === 1) text = 'existe ' + count0 + ' Habilidade com 0 pontos.';
            else if (count0 === 0) text = 'não existe nenhuma Habilidade com 0 pontos.';
            else text = 'existem ' + count0 + ' Habilidades com 0 pontos.'; 
            setSkillsCount0({ correct: false, errorMessage: 'Devem existir Doze Habilidades com 0 pontos. Atualmente, ' + text });
          }
        }
      } else {
        setNumberPlus(0);
        setNumber4(1);
        setNumber3(3);
        setNumber2(3);
        setNumber1(3);
        setNumber0(17);
        if (countPlus === 0 && count4 === 1 && count3 === 3 && count2 === 3 && count1 === 3 && count0 === 17) {
          setSkillsCountPlus4({ correct: true, errorMessage: '' });
          setSkillsCountPlus({ correct: true, errorMessage: '' });
          setSkillsCount4({ correct: true, errorMessage: '' });
          setSkillsCount3({ correct: true, errorMessage: '' });
          setSkillsCount2({ correct: true, errorMessage: '' });
          setSkillsCount1({ correct: true, errorMessage: '' });
          setSkillsCount0({ correct: true, errorMessage: '' });
        } else {
          if (countPlus === 0) {
            setSkillsCountPlus({ correct: true, errorMessage: '' });
          } else {
            let text = ''; 
            if (countPlus === 1) text = 'existe Uma Habilidade com mais de 4 pontos';
            else text = 'existem ' + countPlus  + ' Habilidades com mais de 4 pontos';
            setSkillsCountPlus({ correct: false, errorMessage: 'Nenhuma Habilidade pode ultrapassar 4 pontos. Atualmente, ' + text });
          }

          if (count4 === 1) {
            setSkillsCount4({ correct: true, errorMessage: '' });
          } else {
            let text = '';
            if (count4 > 1) text = 'existem ' + count4 + ' Habilidades com 4 pontos.';
            else text = 'não há nenhuma Habilidade com 4 pontos.';
            setSkillsCount4({ correct: false, errorMessage: 'Deve existir Uma Habilidade com 4 pontos. Atualmente, ' + text });
          }

          if (count3 === 3) {
            setSkillsCount3({ correct: true, errorMessage: '' });
          } else {
            let text = '';
            if (count3 > 1) text = 'existem ' + count3 + ' Habilidades com 3 pontos.';
            else text = 'não há nenhuma Habilidade com 3 pontos.';
            setSkillsCount3({ correct: false, errorMessage: 'Deve existir Três Habilidades com 3 pontos. Atualmente, ' + text });
          }

          if (count2 === 3) {
            setSkillsCount2({ correct: true, errorMessage: '' });
          } else {
            let text = '';
            if (count2 === 1) text = 'existe ' + count2 + ' Habilidade com 2 pontos.';
            else if (count2 === 0) text = 'não existe nenhuma Habilidade com 2 pontos.';
            else text = 'existem ' + count2 + ' Habilidades com 2 pontos.'; 
            setSkillsCount2({ correct: false, errorMessage: 'Devem existir Três Habilidades com 2 pontos. Atualmente, ' + text });
          }

          if (count1 === 3) {
            setSkillsCount1({ correct: true, errorMessage: '' });
          } else {
            let text = '';
            if (count1 === 1) text = 'existe ' + count1 + ' Habilidade com 1 ponto.';
            else if (count1 === 0) text = 'não existe nenhuma Habilidade com 1 ponto.';
            else text = 'existem ' + count1 + ' Habilidades com 1 ponto.'; 
            setSkillsCount1({ correct: false, errorMessage: 'Devem existir Três Habilidades com 1 ponto. Atualmente, ' + text });
          }

          if (count0 === 17) {
            setSkillsCount0({ correct: true, errorMessage: '' });
          } else {
            let text = '';
            if (count0 === 1) text = 'existe ' + count0 + ' Habilidade com 0 pontos.';
            else if (count0 === 0) text = 'não existe nenhuma Habilidade com 0 pontos.';
            else text = 'existem ' + count0 + ' Habilidades com 0 pontos.'; 
            setSkillsCount0({ correct: false, errorMessage: 'Devem existir Dezessete Habilidades com 0 pontos. Atualmente, ' + text });
          }
        }
      }
      
      //academics, craft, performance, science + more one
      if (data.skills.academics.value !== 0) {
        if (data.skills.academics.specialty === '') {
          setSkillAcademics({ correct: false, errorMessage: 'Necessário navegar até a aba Habilidades e clicar no botão de edição da Habilidade "Acadêmicos". No campo de preenchimento, deve ser inserida uma Especialização.' });
        } else setSkillAcademics({ correct: true, errorMessage: '' });
      }

      if (data.skills.craft.value !== 0) {
        if (data.skills.craft.specialty === '') {
          setSkillCraft({ correct: false, errorMessage: 'Necessário navegar até a aba Habilidades e clicar no botão de edição da Habilidade "Ofícios". No campo de preenchimento, deve ser inserida uma Especialização.' });
        } else setSkillCraft({ correct: true, errorMessage: '' });
      }

      if (data.skills.performance.value !== 0) {
        if (data.skills.performance.specialty === '') {
          setSkillPerformance({ correct: false, errorMessage: 'Necessário navegar até a aba Habilidades e clicar no botão de edição da Habilidade "Performance". No campo de preenchimento, deve ser inserida uma Especialização.' });
        } else setSkillPerformance({ correct: true, errorMessage: '' });
      }

      if (data.skills.science.value !== 0) {
        if (data.skills.science.specialty === '') {
          setSkillScience({ correct: false, errorMessage: 'Necessário navegar até a aba Habilidades e clicar no botão de edição da Habilidade "Ciências". No campo de preenchimento, deve ser inserida uma Especialização.' });
        } else setSkillScience({ correct: true, errorMessage: '' });
      }
      
      const valueNonEmptySpecialty: string[] = [];
      Object.entries(data.skills).forEach(([key, skill]: any) => {
        if (key !== 'type' && skill.value === 0 && skill.specialty !== "")
          valueNonEmptySpecialty.push(translate(key));
      });
      if (valueNonEmptySpecialty.length !== 0) {
        let text = '';
        if (valueNonEmptySpecialty.length === 1) text = valueNonEmptySpecialty[0] + '" e apagar a Especialização';
        else {
          const lastItem = valueNonEmptySpecialty.pop();
          text = valueNonEmptySpecialty.join(', ') + ' e ' + lastItem;
          text += '" e apagar as Especializações das Habilidades citadas.';
        }
        setSkillSpecialtyZero({ correct: false, errorMessage: 'Não é possível adicionar especializações em Habilidades com 0 pontos. Necessário navegar até a aba "Habilidades", clicar no botão de edição de "' + text });
      } else setSkillSpecialtyZero({ correct: true, errorMessage: '' });

      const valueWithSpecialty: string[] = [];
      Object.entries(data.skills).forEach(([key, skill]: any) => {
        if (key !== 'type' && key !== 'academics' && key !== 'craft' && key !== 'performance' && key !== 'science' && skill.value > 0 && skill.specialty !== "")
          valueWithSpecialty.push(translate(key));
      });
      if (valueWithSpecialty.length !== 1) {
        let text1 = '';
        let text2 = '';
        if (valueWithSpecialty.length === 0) {
          text1 = 'e adicionar pelo menos uma';
          text2 = 'Atualmente, não existe nenhuma com uma Especialização.';
        } else {
          text1 = 'e adicionar apenas uma ';
          const lastItem = valueWithSpecialty.pop();
          text2 = valueWithSpecialty.join(', ') + ' e ' + lastItem;
          text2 += '" e apagar as Especializações das Habilidades citadas.';
        }
        setSkillNewSpecialty({ correct: false, errorMessage: 'Além de Especializações em Acadêmicos, Ofícios, Performance e Ciência (caso você possua pelo menos um ponto), é necessário adicionar ' + text1 + ' Especialização em alguma outra Habilidade que possua pelo menos um ponto. ' + text2 });
      } else setSkillNewSpecialty({ correct: true, errorMessage: '' });
    }
  }

  const verifyAttributes = (data: any) => {
    let count4 = 0;
    let count3 = 0;
    let count2 = 0;
    let count1 = 0;

    for (const key in data.attributes) {
      if (data.attributes.hasOwnProperty(key)) {
        const value = data.attributes[key];
        if (value === 4) count4 += 1;
        else if (value === 3) count3 += 1;
        else if (value === 2) count2 += 1;
        else if (value === 1) count1 += 1;
      }
    }

    if (count4 === 1 && count3 === 3 && count2 === 4 && count1 === 1) {
      setAttributes4({ correct: true, errorMessage: '' });
      setAttributes3({ correct: true, errorMessage: '' });
      setAttributes2({ correct: true, errorMessage: '' });
      setAttributes1({ correct: true, errorMessage: '' });
    } else {
      if (count4 !== 1) {
        let text = '';
        if (count4 === 1) text = 'Existe apenas Um atributo com 3 pontos. Na aba "Atributos", é necessário preencher Um atributo com este valor.';
        else  text = 'Existem ' + count4 + ' atributos com 4 pontos. Na aba "Atributos", é necessário preencher Um atributo com este valor.';
        setAttributes4({ correct: false, errorMessage: text });
      } else setAttributes4({ correct: true, errorMessage: '' });
      
      if (count3 !== 3) {
        let text = '';
        if (count3 === 1) text = 'Existe apenas Um atributo com 3 pontos. Na aba "Atributos", é necessário preencher Três atributos com este valor.';
        else  text = 'Existem ' + count3 + ' atributos com 3 pontos. Na aba "Atributos", é necessário preencher Três atributos com este valor.';
        setAttributes3({ correct: false, errorMessage: text });
      } else setAttributes3({ correct: true, errorMessage: '' });

      if (count2 !== 4) {
        let text = '';
        if (count2 === 1) text = 'Existe apenas Um atributo com 2 pontos. Na aba "Atributos", é necessário preencher Quatro atributos com este valor.';
        else  text = 'Existem ' + count2 + ' atributos com 2 pontos. Na aba "Atributos", é necessário preencher Quatro atributos com este valor.';
        setAttributes2({ correct: false, errorMessage: text });
      } else setAttributes2({ correct: true, errorMessage: '' });

      if (count1 !== 1) {
        setAttributes1({ correct: false, errorMessage: 'Existem ' + count1 + ' atributos com 2 pontos. Na aba "Atributos", é necessário preencher apenas Um atributo com este valor.' });
      } else setAttributes1({ correct: true, errorMessage: '' });
    }
  }

  const verifyRenown = (data: any) => {
    const sumRenown = Number(data.honor) + Number(data.glory) + Number(data.wisdom);
    if (sumRenown === 3) {
      setRenownSum({ correct: true, errorMessage: '' });
    } else {
      setRenownSum({ correct: false, errorMessage: 'Necessário navegar até a aba "Geral" e preencher três pontos entre Honra, Glória e/ou Sabedoria. Atualmente, a soma dos pontos de Renome é ' + sumRenown + '.' });
    }

    if (data.trybe === '') {
      setRenownTrybe({ correct: false, errorMessage: 'Necessário navegar até a aba "Geral" e preencher uma Tribo para que este item seja avaliado.' });
    } else {
      let renownValue = { en: '', pb: '' };
      switch(data.trybe) {
        case 'glass walkers':
          renownValue.en = 'wisdom';
          renownValue.pb = 'Sabedoria';
          break;
        case 'silent striders':
          renownValue.en = 'wisdom';
          renownValue.pb = 'Sabedoria';
          break;
        case 'black furies':
          renownValue.en = 'glory';
          renownValue.pb = 'Glória';
          break;
        case 'silver fangs':
          renownValue.en = 'honor';
          renownValue.pb = 'Honra';
          break;
        case 'ghost council':
          renownValue.en = 'wisdom';
          renownValue.pb = 'Sabedoria';
          break;
        case 'hart wardens':
          renownValue.en = 'glory';
          renownValue.pb = 'Glória';
          break;
        case 'galestalkers':
          renownValue.en = 'honor';
          renownValue.pb = 'Honra';
          break;
        case 'bone gnawers':
          renownValue.en = 'honor';
          renownValue.pb = 'Honra';
          break;
        case 'shadow lords':
          renownValue.en = 'glory';
          renownValue.pb = 'Glória';
          break;
        case 'children of gaia':
          renownValue.en = 'wisdom';
          renownValue.pb = 'Sabedoria';
          break;
        case 'red talons':
          renownValue.en = 'honor';
          renownValue.pb = 'Honra';
          break;
      }
      if (Number(data[renownValue.en]) !==  2) {
        setRenownTrybe({ correct: false, errorMessage: 'Necessário navegar até a aba "Geral" e preencher o renome relacionado ao patrono da sua tribo (' + renownValue.pb + ') com dois pontos.' });
      } else setRenownTrybe({ correct: true, errorMessage: ''});
    }
  }
  
  const verifyAdvantagesAndFlaws = (data: any) => {
    const loresheetsSum = data.advantagesAndFlaws.loresheets.reduce((sum: any, item: any) => sum + item.cost, 0);
    const advantagesSum = data.advantagesAndFlaws.advantages.reduce((sum: any, item: any) => sum + item.cost, 0);
    const talensSum = data.advantagesAndFlaws.talens.reduce((sum: any, item: any) => sum + item.value, 0);
    const sumAdvantages = loresheetsSum + advantagesSum + talensSum;
    const sumFlaws = data.advantagesAndFlaws.flaws.reduce((sum: any, item: any) => sum + item.cost, 0);
    if (sumAdvantages !== 7) {
      setAdvantages({ correct: false, errorMessage: 'Na aba "Vantagens e Defeitos", é necessário preencher 7 pontos entre as Vantagens disponíveis (Méritos e Backgrounds, Loresheets e/ou Talismãs). Atualmente, ' + sumAdvantages + ' pontos foram preenchidos.' });
    } else setAdvantages({ correct: true, errorMessage: '' });
    if (sumFlaws !== 2) {
      setFlaws({ correct: false, errorMessage: 'Na aba "Vantagens e Defeitos", é necessário preencher 7 pontos entre as Vantagens disponíveis (Méritos e Backgrounds, Loresheets e/ou Talismãs). Atualmente, ' + sumFlaws + ' pontos foram preenchidos.' });
    } else setFlaws({ correct: true, errorMessage: '' });
  }

  return (
    <div className="z-80 sm:z-50 fixed md:relative w-full h-screen flex flex-col items-center justify-center bg-black/80 px-3 sm:px-0 border-white border-2">
      <div className="w-full flex justify-center pt-3 bg-black">
        <div className="px-6 sm:px-10 text-white font-bold text-2xl w-full">Verificação de Ficha:</div>
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer mr-5"
          onClick={ () => setShowEvaluateSheet({ show: false, data: {} }) }
        />
      </div>
      <div className="w-full overflow-y-auto h-full flex flex-col justify-start items-center bg-black relative pb-5">
        <div className="px-6 sm:px-10 w-full text-white">
          {/* Nome */}
          <div className="pt-3">
            <div className="flex gap-2 items-center">
              {
                name.correct
                ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                : <FaRegCircle className="text-red-500 text-lg mt-1" />
              }
              <div className="w-full">Inserir o nome do Personagem</div>
            </div>
              <div className="pl-5">
                { !name.correct && <div> - { name.errorMessage }</div> }
              </div>
          </div>
          {/* Augúrio */}
          <div>
            <div className="flex gap-2 items-center">
              {
                auspice.correct
                ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                : <FaRegCircle className="text-red-500 text-lg mt-1" />
              }
              <div className="w-full">Escolher um Augúrio</div>
            </div>
            <div className="pl-5">
              { !auspice.correct && <div> - { auspice.errorMessage }</div> }
            </div>
          </div>
          {/* Tribo */}
          <div>
            <div className="flex gap-2 items-center">
              {
                trybe.correct
                ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                : <FaRegCircle className="text-red-500 text-lg mt-1" />
              }
              <div className="w-full">Escolher uma Tribo</div>
            </div>
              <div className="pl-5">
                { !trybe.correct && <div> - { trybe.errorMessage }</div> }
              </div>
          </div>
          {/* Renome */}
          <div>
            <div className="flex gap-2 items-center">
              {
                renownSum.correct && renownTrybe.correct
                ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                : <FaRegCircle className="text-red-500 text-lg mt-1" />
              }
              <div className="w-full">Preencher Renome</div>
            </div>
            <div>
              <div className="flex gap-2 pl-5">
                {
                  renownSum.correct
                  ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                  : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
                <div className="w-full">A Soma dos Renomes precisa ser igual a 3</div>
              </div>
              <div className="pl-10">
                { !renownSum.correct && <div> - { renownSum.errorMessage }</div> }
              </div>
              <div className="flex gap-2 pl-5">
                {
                  renownTrybe.correct
                  ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                  : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
                <div className="w-full">O renome relacionado ao patrono precisa ser igual a 2</div>
              </div>
              <div className="pl-10">
                { !renownTrybe.correct && <div> - { renownTrybe.errorMessage }</div> }
              </div>
            </div>
          </div>
          {/* Atributos */} 
          <div>
            <div className="flex gap-2 items-center">
                {
                  attributes3.correct && attributes2.correct && attributes1.correct
                  ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                  : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
              <div className="w-full">Atributos:</div>
            </div>
            <div>
              <div className="flex gap-2 pl-5">
                {
                  attributes4.correct
                  ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                  : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
                <div className="w-full">Preencher Um atributo com 4 pontos</div>
              </div>
              <div className="pl-10">
                { !attributes4.correct && <div> - { attributes4.errorMessage }</div> }
              </div>
            </div>
            <div>
              <div className="flex gap-2 pl-5">
                {
                  attributes3.correct
                  ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                  : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
                <div className="w-full">Preencher Três atributos com 3 pontos</div>
              </div>
              <div className="pl-10">
                { !attributes3.correct && <div> - { attributes3.errorMessage }</div> }
              </div>
            </div>
            <div>
              <div className="flex gap-2 pl-5">
                {
                  attributes2.correct
                  ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                  : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
                <div className="w-full">Preencher Quatro atributos com 2 pontos</div>
              </div>
              <div className="pl-10">
                { !attributes2.correct && <div> - { attributes2.errorMessage }</div> }
              </div>
            </div>
            <div>
              <div className="flex gap-2 pl-5">
                {
                  attributes1.correct
                  ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                  : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
                <div className="w-full">Preencher Um atributo com 1 ponto</div>
              </div>
              <div className="pl-10">
                { !attributes1.correct && <div> - { attributes1.errorMessage }</div> }
              </div>
            </div>
          </div>
          {/* Habilidades */} 
          <div>
            <div className="flex gap-2 items-center">
                {
                  verifyCorrectlySkills()
                  ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                  : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
              <div className="w-full">Habilidades:</div>
            </div>
            <div>
              <div className="flex gap-2 pl-5">
                {
                  skillsType.correct
                  ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                  : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
                <div className="w-full">Escolher um Modelo de Distribuição { data.skills.type !== '' && '(' + data.skills.type + ')'}</div>
              </div>
              <div className="pl-10">
                { !skillsType.correct && <div> - { skillsType.errorMessage }</div> }
              </div>
            </div>
            {
              data.skills.type !== '' &&
              <div>
                <div>
                  { 
                    data.skills.type === 'Especialista'
                    ? <div>
                        <div className="flex gap-2 pl-5">
                          {
                            skillsCountPlus.correct
                            ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                            : <FaRegCircle className="text-red-500 text-lg mt-1" />
                          }
                          <div className="w-full">{numberPlus === 0 ? 'Nenhuma Habilidade': numberPlus > 1 ? numberPlus + ' Habilidades' : numberPlus + ' Habilidade' } com mais de 4 pontos</div>
                        </div>
                        <div className="pl-10">
                          { !skillsCountPlus.correct && <div> - { skillsCountPlus.errorMessage }</div> }
                        </div>
                        <div className="flex gap-2 pl-5">
                          {
                            skillsCount4.correct
                            ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                            : <FaRegCircle className="text-red-500 text-lg mt-1" />
                          }
                          <div className="w-full">{number4 === 0 ? 'Nenhuma Habilidade': number4 > 1 ? number4 + ' Habilidades' : number4 + ' Habilidade' } com 4 pontos</div>
                        </div>
                        <div className="pl-10">
                          { !skillsCount4.correct && <div> - { skillsCount4.errorMessage }</div> }
                        </div>
                      </div>
                    : <div>
                        <div className="flex gap-2 pl-5">
                          {
                            skillsCountPlus4.correct
                            ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                            : <FaRegCircle className="text-red-500 text-lg mt-1" />
                          }
                          <div className="w-full">{numberPlus === 0 ? 'Nenhuma Habilidade': numberPlus > 1 ? numberPlus + ' Habilidades' : numberPlus + ' Habilidade' } com mais de 3 pontos</div>
                        </div>
                        <div className="pl-10">
                          { !skillsCountPlus4.correct && <div> - { skillsCountPlus4.errorMessage }</div> }
                        </div>
                      </div>
                    }
                </div>
                <div>
                  <div className="flex gap-2 pl-5">
                    {
                      skillsCount3.correct
                      ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                      : <FaRegCircle className="text-red-500 text-lg mt-1" />
                    }
                    <div className="w-full">{number3 > 1 || number3 === 0 ? number3 + ' Habilidades' : number3 + ' Habilidade' } com 3 pontos</div>
                  </div>
                  <div className="pl-10">
                    { !skillsCount3.correct && <div> - { skillsCount3.errorMessage }</div> }
                  </div>
                </div>
                <div>
                  <div className="flex gap-2 pl-5">
                    {
                      skillsCount2.correct
                      ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                      : <FaRegCircle className="text-red-500 text-lg mt-1" />
                    }
                    <div className="w-full">{number2 > 1 || number2 === 0 ? number2 + ' Habilidades' : number2 + ' Habilidade' } com 2 pontos</div>
                  </div>
                  <div className="pl-10">
                    { !skillsCount2.correct && <div> - { skillsCount2.errorMessage }</div> }
                  </div>
                </div>
                <div>
                  <div className="flex gap-2 pl-5">
                    {
                      skillsCount1.correct
                      ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                      : <FaRegCircle className="text-red-500 text-lg mt-1" />
                    }
                    <div className="w-full">{number1 > 1 || number1 === 0 ? number1 + ' Habilidades' : number1 + ' Habilidade' } com 1 pontos</div>
                  </div>
                  <div className="pl-10">
                    { !skillsCount1.correct && <div> - { skillsCount1.errorMessage }</div> }
                  </div>
                </div>
                <div>
                  <div className="flex gap-2 pl-5">
                    {
                      skillsCount0.correct
                      ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                      : <FaRegCircle className="text-red-500 text-lg mt-1" />
                    }
                    <div className="w-full">{number0 > 1 || number0 === 0 ? number0 + ' Habilidades' : number0 + ' Habilidade' } com 0 pontos</div>
                  </div>
                  <div className="pl-10">
                    { !skillsCount0.correct && <div> - { skillsCount0.errorMessage }</div> }
                  </div>
                </div>
                {
                  data.skills.academics.value !== 0 &&
                  <div>
                    <div className="flex gap-2 pl-5">
                      {
                        skillAcademics.correct
                        ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                        : <FaRegCircle className="text-red-500 text-lg mt-1" />
                      }
                      <div className="w-full">Preencher uma Especialização em Acadêmicos</div>
                    </div>
                    <div className="pl-10">
                      { !skillAcademics.correct && <div> - { skillAcademics.errorMessage }</div> }
                    </div>
                  </div>
                }
                {
                  data.skills.craft.value !== 0 &&
                  <div>
                    <div className="flex gap-2 pl-5">
                      {
                        skillCraft.correct
                        ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                        : <FaRegCircle className="text-red-500 text-lg mt-1" />
                      }
                      <div className="w-full">Preencher uma Especialização em Ofícios</div>
                    </div>
                    <div className="pl-10">
                      { !skillCraft.correct && <div> - { skillCraft.errorMessage }</div> }
                    </div>
                  </div>
                }
                {
                  data.skills.performance.value !== 0 &&
                  <div>
                    <div className="flex gap-2 pl-5">
                      {
                        skillPerformance.correct
                        ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                        : <FaRegCircle className="text-red-500 text-lg mt-1" />
                      }
                      <div className="w-full">Preencher uma Especialização em Performance</div>
                    </div>
                    <div className="pl-10">
                      { !skillPerformance.correct && <div> - { skillPerformance.errorMessage }</div> }
                    </div>
                  </div>
                }
                {
                  data.skills.science.value !== 0 &&
                  <div>
                    <div className="flex gap-2 pl-5">
                      {
                        skillScience.correct
                        ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                        : <FaRegCircle className="text-red-500 text-lg mt-1" />
                      }
                      <div className="w-full">Preencher uma Especialização em Science</div>
                    </div>
                    <div className="pl-10">
                      { !skillScience.correct && <div> - { skillScience.errorMessage }</div> }
                    </div>
                  </div>
                }
                <div>
                  <div className="flex gap-2 pl-5">
                    {
                      skillNewSpecialty.correct
                      ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                      : <FaRegCircle className="text-red-500 text-lg mt-1" />
                    }
                    <div className="w-full">Adicionar uma nova Especialização em uma Habilidade à sua escolha</div>
                  </div>
                  <div className="pl-10">
                    { !skillNewSpecialty.correct && <div> - { skillNewSpecialty.errorMessage }</div> }
                  </div>
                </div>
                <div>
                  <div className="flex gap-2 pl-5">
                    {
                      skillSpecialtyZero.correct
                      ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                      : <FaRegCircle className="text-red-500 text-lg mt-1" />
                    }
                    <div className="w-full">Nenhuma Habilidade com 0 pontos pode ter uma Especialização</div>
                  </div>
                  <div className="pl-10">
                    { !skillSpecialtyZero.correct && <div> - { skillSpecialtyZero.errorMessage }</div> }
                  </div>
                </div>
              </div>
            }
          </div>
          {/* Dons */}
          <div>
            <div className="flex gap-2 items-center">
                {
                  gifts.correct
                  ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                  : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
              <div className="w-full">Dons:</div>
            </div>
            <div>
              <div className="flex gap-2 pl-5">
                {
                  gifts.correct
                  ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                  : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
                <div className="w-full">Adicionar 3 Dons</div>
              </div>
              <div className="pl-10">
                { !gifts.correct && <div> - { gifts.errorMessage }</div> }
              </div>
            </div>
            <div>
              <div className="flex gap-2 pl-5">
                {
                  giftsGlobal.correct
                  ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                  : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
                <div className="w-full">Adicionar um Dom Nativo</div>
              </div>
              <div className="pl-10">
                { !giftsGlobal.correct && <div> - { giftsGlobal.errorMessage }</div> }
              </div>
              <div>
                <div>
                  <div className="flex gap-2 pl-5">
                    {
                      giftsTrybe.correct
                      ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                      : <FaRegCircle className="text-red-500 text-lg mt-1" />
                    }
                    <div className="w-full">Adicionar um Dom da Tribo ({ capitalizeFirstLetter(data.trybe) })</div>
                  </div>
                  <div className="pl-10">
                    { !giftsTrybe.correct && <div> - { giftsTrybe.errorMessage }</div> }
                  </div>
                </div>
                <div className="flex gap-2 pl-5">
                  {
                    giftsAuspice.correct
                    ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                    : <FaRegCircle className="text-red-500 text-lg mt-1" />
                  }
                  <div className="w-full">Adicionar um Dom do Augúrio <span className="capitalize">({ data.auspice })</span></div>
                </div>
                <div className="pl-10">
                  { !giftsAuspice.correct && <div> - { giftsAuspice.errorMessage }</div> }
                </div>
              </div>
            </div>
          </div>
          {/* Rituais */}
          <div>
            <div className="flex gap-2 items-center">
              {
                rituals.correct
                ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                : <FaRegCircle className="text-red-500 text-lg mt-1" />
              }
              <div className="w-full">Adicionar um Ritual</div>
            </div>
            <div className="pl-5">
              { !rituals.correct && <div> - { rituals.errorMessage }</div> }
            </div>
          </div>
          {/* Pilares */}
          <div>
            <div className="flex gap-2 items-center">
              {
                touchstone.correct
                ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                : <FaRegCircle className="text-red-500 text-lg mt-1" />
              }
              <div className="w-full">Adicionar Pilares para o Personagem</div>
            </div>
            <div className="pl-5">
              { !touchstone.correct && <div> - { touchstone.errorMessage }</div> }
            </div>
          </div>
          {/* Vantagens e Defeitos */}
          <div>
            <div className="flex gap-2 items-center">
                {
                  advantages.correct && flaws.correct
                  ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                  : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
              <div className="w-full">Vantagens e Defeitos:</div>
            </div>
            <div>
              <div className="flex gap-2 pl-5">
                {
                  advantages.correct
                    ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                    : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
                <div className="w-full">Preencher 7 pontos em Vantagens (Méritos e Background, Loresheets e/ou Talismãs)</div>
              </div>
              <div className="pl-10">
                { !advantages.correct && <div> - { advantages.errorMessage }</div> }
              </div>
            </div>
            <div>
              <div className="flex gap-2 pl-5">
                {
                  flaws.correct
                  ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                  : <FaRegCircle className="text-red-500 text-lg mt-1" />
                }
                <div className="w-full">Preencher 2 pontos em Defeitos</div>
              </div>
              <div className="pl-10">
                { !flaws.correct && <div> - { flaws.errorMessage }</div> }
              </div>
            </div>
          </div>
          {/* Background */}
          <div>
            <div className="flex gap-2 items-center">
              {
                background.correct
                ? <FaRegCheckCircle className="text-green-500 text-lg mt-1" />
                : <FaRegCircle className="text-red-500 text-lg mt-1" />
              }
              <div className="w-full">Inserir a história do personagem</div>
            </div>
            <div className="pl-5">
              { !background.correct && <div> - { background.errorMessage }</div> }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}