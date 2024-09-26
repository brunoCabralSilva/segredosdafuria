'use client'
import contexto from "@/context/context";
import { updateValueOfSheet } from "@/firebase/players";
import { useContext, useEffect, useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function EvaluateSheet() {
  const {
    showEvaluateSheet, setShowEvaluateSheet, setShowMessage,
  } = useContext(contexto);
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
  const [gifts, setGifts] = useState({ correct: false, errorMessage: '' });
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

  useEffect(() => {
    const data = showEvaluateSheet.data;
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
    if (data.touchstones.length < 1 && data.touchstones.length > 3) {
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
  }, []);

  const verifyGifts = (data: any) => {
    // Dons:
    // 1 nativo, um da tribo e um do augúrio
    //Verificação de Rituais
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
        if (count4 === 1) text = 'Existe apenas Um atributo com 3 pontos. Na aba "Atribudos", é necessário preencher Um atributo com este valor.';
        else  text = 'Existem ' + count4 + ' atributos com 4 pontos. Na aba "Atribudos", é necessário preencher Um atributo com este valor.';
        setAttributes4({ correct: false, errorMessage: text });
      } else setAttributes4({ correct: true, errorMessage: '' });
      
      if (count3 !== 3) {
        let text = '';
        if (count3 === 1) text = 'Existe apenas Um atributo com 3 pontos. Na aba "Atribudos", é necessário preencher Três atributos com este valor.';
        else  text = 'Existem ' + count3 + ' atributos com 3 pontos. Na aba "Atribudos", é necessário preencher Três atributos com este valor.';
        setAttributes3({ correct: false, errorMessage: text });
      } else setAttributes3({ correct: true, errorMessage: '' });

      if (count2 !== 4) {
        let text = '';
        if (count2 === 1) text = 'Existe apenas Um atributo com 2 pontos. Na aba "Atribudos", é necessário preencher Quatro atributos com este valor.';
        else  text = 'Existem ' + count2 + ' atributos com 2 pontos. Na aba "Atribudos", é necessário preencher Quatro atributos com este valor.';
        setAttributes2({ correct: false, errorMessage: text });
      } else setAttributes2({ correct: true, errorMessage: '' });

      if (count1 !== 1) {
        setAttributes1({ correct: false, errorMessage: 'Existem ' + count1 + ' atributos com 2 pontos. Na aba "Atribudos", é necessário preencher apenas Um atributo com este valor.' });
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
        case 'silent striders':
          renownValue.en = 'wisdom';
          renownValue.pb = 'Sabedoria';
        case 'black furies':
          renownValue.en = 'glory';
          renownValue.pb = 'Glória';
        case 'silver fangs':
          renownValue.en = 'honor';
          renownValue.pb = 'Honra';
        case 'ghost council':
          renownValue.en = 'wisdom';
          renownValue.pb = 'Sabedoria';
        case 'hart wardens':
          renownValue.en = 'glory';
          renownValue.pb = 'Glória';
        case 'galestalkers':
          renownValue.en = 'honor';
          renownValue.pb = 'Honra';
        case 'bone gnawers':
          renownValue.en = 'honor';
          renownValue.pb = 'Honra';
        case 'shadow lords':
          renownValue.en = 'glory';
          renownValue.pb = 'Glória';
        case 'children of gaia':
          renownValue.en = 'wisdom';
          renownValue.pb = 'Sabedoria';
        case 'red talons':
          renownValue.en = 'honor';
          renownValue.pb = 'Honra';
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
    <div className="z-60 fixed top-0 left-0 w-1/2 h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full overflow-y-auto h-full flex flex-col justify-start items-center bg-black relative border-white border-2 py-5">
        <div className="w-full flex flex-between">
          <p className="px-6 sm:px-10 text-white font-bold text-2xl w-full">Verificação de Ficha:</p>
          <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
            
            <IoIosCloseCircleOutline
              className="text-4xl text-white cursor-pointer"
              onClick={ () => setShowEvaluateSheet({ show: false, data: {} }) }
            />
          </div>
        </div>
        <div className="px-6 sm:px-10 w-full text-white">
          
          {/* Nome */}
          <div>
            <div className="flex gap-2 items-center">
              {
                name.correct
                ? <FaRegCheckCircle className="text-green-500" />
                : <FaRegCircle className="text-red-500" />
              }
              <p>Inserir o nome do Personagem</p>
            </div>
              <p className="pl-5">
                { !name.correct && <p> - { name.errorMessage }</p> }
              </p>
          </div>
          {/* Tribo */}
          <div>
            <div className="flex gap-2 items-center">
              {
                trybe.correct
                ? <FaRegCheckCircle className="text-green-500" />
                : <FaRegCircle className="text-red-500" />
              }
              <p>Escolher uma Tribo</p>
            </div>
              <p className="pl-5">
                { !trybe.correct && <p> - { trybe.errorMessage }</p> }
              </p>
          </div>
          {/* Augúrio */}
          <div>
            <div className="flex gap-2 items-center">
              {
                auspice.correct
                ? <FaRegCheckCircle className="text-green-500" />
                : <FaRegCircle className="text-red-500" />
              }
              <p>Escolher um Augúrio</p>
            </div>
            <p className="pl-5">
              { !auspice.correct && <p> - { auspice.errorMessage }</p> }
            </p>
          </div>
          {/* Renome */}
          <div>
            <div className="flex gap-2 items-center">
              {
                renownSum.correct && renownTrybe.correct
                ? <FaRegCheckCircle className="text-green-500" />
                : <FaRegCircle className="text-red-500" />
              }
              <p>Preencher Renome</p>
            </div>
            <div>
              <div className="flex gap-2 items-center pl-5">
                {
                  renownSum.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
                <p>A Soma dos Renomes precisa ser igual a 3</p>
              </div>
              <div className="pl-10">
                { !renownSum.correct && <p> - { renownSum.errorMessage }</p> }
              </div>
              <div className="flex gap-2 items-center pl-5">
                {
                  renownTrybe.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
                <p>O renome relacionado ao patrono precisa ser igual a 2</p>
              </div>
              <div className="pl-10">
                { !renownTrybe.correct && <p> - { renownTrybe.errorMessage }</p> }
              </div>
            </div>
          </div>
          {/* Atributos */} 
          <div>
            <div className="flex gap-2 items-center">
                {
                  attributes3.correct && attributes2.correct && attributes1.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
              <p>Atributos:</p>
            </div>
            <div>
              <div className="flex gap-2 items-center pl-5">
                {
                  attributes4.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
                <p>Preencher Um atributo com 4 pontos</p>
              </div>
              <div className="pl-10">
                { !attributes4.correct && <p> - { attributes4.errorMessage }</p> }
              </div>
            </div>
            <div>
              <div className="flex gap-2 items-center pl-5">
                {
                  attributes3.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
                <p>Preencher Três atributos com 3 pontos</p>
              </div>
              <div className="pl-10">
                { !attributes3.correct && <p> - { attributes3.errorMessage }</p> }
              </div>
            </div>
            <div>
              <div className="flex gap-2 items-center pl-5">
                {
                  attributes2.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
                <p>Preencher Quatro atributos com 2 pontos</p>
              </div>
              <div className="pl-10">
                { !attributes2.correct && <p> - { attributes2.errorMessage }</p> }
              </div>
            </div>
            <div>
              <div className="flex gap-2 items-center pl-5">
                {
                  attributes1.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
                <p>Preencher Um atributo com 1 ponto</p>
              </div>
              <div className="pl-10">
                { !attributes1.correct && <p> - { attributes1.errorMessage }</p> }
              </div>
            </div>
          </div>
          {/* Habilidades */} 
          <div>
            <div className="flex gap-2 items-center">
                {
                  skillsType.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
              <p>Habilidades:</p>
            </div>
            <div>
              <div className="flex gap-2 items-center pl-5">
                {
                  skillsType.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
                <p>Escolher um Modelo de Distribuição { showEvaluateSheet.data.skills.type !== '' && '(' + showEvaluateSheet.data.skills.type + ')'}</p>
              </div>
              <div className="pl-10">
                { !skillsType.correct && <p> - { skillsType.errorMessage }</p> }
              </div>
            </div>
            <div>
              { showEvaluateSheet.data.skills.type === 'Especialista'
                ? <div>
                    <div className="flex gap-2 items-center pl-5">
                      {
                        skillsCountPlus.correct
                        ? <FaRegCheckCircle className="text-green-500" />
                        : <FaRegCircle className="text-red-500" />
                      }
                      <p>{numberPlus === 0 ? 'Nenhuma Habilidade': numberPlus > 1 ? numberPlus + ' Habilidades' : numberPlus + ' Habilidade' } com mais de 4 pontos</p>
                    </div>
                    <div className="pl-10">
                      { !skillsCountPlus.correct && <p> - { skillsCountPlus.errorMessage }</p> }
                    </div>
                    <div className="flex gap-2 items-center pl-5">
                      {
                        skillsCount4.correct
                        ? <FaRegCheckCircle className="text-green-500" />
                        : <FaRegCircle className="text-red-500" />
                      }
                      <p>{number4 === 0 ? 'Nenhuma Habilidade': number4 > 1 ? number4 + ' Habilidades' : number4 + ' Habilidade' } com 4 pontos</p>
                    </div>
                    <div className="pl-10">
                      { !skillsCount4.correct && <p> - { skillsCount4.errorMessage }</p> }
                    </div>
                  </div>
                : <div>
                    <div className="flex gap-2 items-center pl-5">
                      {
                        skillsCountPlus4.correct
                        ? <FaRegCheckCircle className="text-green-500" />
                        : <FaRegCircle className="text-red-500" />
                      }
                      <p>{numberPlus === 0 ? 'Nenhuma Habilidade': numberPlus > 1 ? numberPlus + ' Habilidades' : numberPlus + ' Habilidade' } com mais de 3 pontos</p>
                    </div>
                    <div className="pl-10">
                      { !skillsCountPlus4.correct && <p> - { skillsCountPlus4.errorMessage }</p> }
                    </div>
                  </div>
              }
            </div>
            <div>
              <div className="flex gap-2 items-center pl-5">
                {
                  skillsCount3.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
                <p>{number3 > 1 || number3 === 0 ? number3 + ' Habilidades' : number3 + ' Habilidade' } com 3 pontos</p>
              </div>
              <div className="pl-10">
                { !skillsCount3.correct && <p> - { skillsCount3.errorMessage }</p> }
              </div>
            </div>
            <div>
              <div className="flex gap-2 items-center pl-5">
                {
                  skillsCount2.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
                <p>{number2 > 1 || number2 === 0 ? number2 + ' Habilidades' : number2 + ' Habilidade' } com 2 pontos</p>
              </div>
              <div className="pl-10">
                { !skillsCount2.correct && <p> - { skillsCount2.errorMessage }</p> }
              </div>
            </div>
            <div>
              <div className="flex gap-2 items-center pl-5">
                {
                  skillsCount1.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
                <p>{number1 > 1 || number1 === 0 ? number1 + ' Habilidades' : number1 + ' Habilidade' } com 1 pontos</p>
              </div>
              <div className="pl-10">
                { !skillsCount1.correct && <p> - { skillsCount1.errorMessage }</p> }
              </div>
            </div>
            <div>
              <div className="flex gap-2 items-center pl-5">
                {
                  skillsCount0.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
                <p>{number0 > 1 || number0 === 0 ? number0 + ' Habilidades' : number0 + ' Habilidade' } com 0 pontos</p>
              </div>
              <div className="pl-10">
                { !skillsCount0.correct && <p> - { skillsCount0.errorMessage }</p> }
              </div>
            </div>
          </div>
          {/* Dons */}
          <div>
            <div className="flex gap-2 items-center">
                {
                  gifts.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
              <p>Dons:</p>
            </div>
            <div>
              <div className="flex gap-2 items-center pl-5">
                {
                  gifts.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
                <p>Adicionar 3 Dons</p>
              </div>
              <div className="pl-10">
                { !gifts.correct && <p> - { gifts.errorMessage }</p> }
              </div>
            </div>
          </div>
          {/* Rituais */}
          <div>
            <div className="flex gap-2 items-center">
              {
                rituals.correct
                ? <FaRegCheckCircle className="text-green-500" />
                : <FaRegCircle className="text-red-500" />
              }
              <p>Adicionar um Ritual</p>
            </div>
            <div className="pl-5">
              { !rituals.correct && <p> - { rituals.errorMessage }</p> }
            </div>
          </div>
          {/* Pilares */}
          <div>
            <div className="flex gap-2 items-center">
              {
                touchstone.correct
                ? <FaRegCheckCircle className="text-green-500" />
                : <FaRegCircle className="text-red-500" />
              }
              <p>Adicionar Pilares para o Personagem</p>
            </div>
            <div className="pl-5">
              { !touchstone.correct && <p> - { touchstone.errorMessage }</p> }
            </div>
          </div>
          {/* Vantagens e Defeitos */}
          <div>
            <div className="flex gap-2 items-center">
                {
                  advantages.correct && flaws.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
              <p>Vantagens e Defeitos:</p>
            </div>
            <div>
              <div className="flex gap-2 items-center pl-5">
                {
                  advantages.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
                <p>Preencher 7 pontos em Vantagens (Méritos e Background, Loresheets e/ou Talismãs)</p>
              </div>
              <div className="pl-10">
                { !advantages.correct && <p> - { advantages.errorMessage }</p> }
              </div>
            </div>
            <div>
              <div className="flex gap-2 items-center pl-5">
                {
                  flaws.correct
                  ? <FaRegCheckCircle className="text-green-500" />
                  : <FaRegCircle className="text-red-500" />
                }
                <p>Preencher 2 pontos em Defeitos</p>
              </div>
              <div className="pl-10">
                { !flaws.correct && <p> - { flaws.errorMessage }</p> }
              </div>
            </div>
          </div>
          {/* Background */}
          <div>
            <div className="flex gap-2 items-center">
              {
                background.correct
                ? <FaRegCheckCircle className="text-green-500" />
                : <FaRegCircle className="text-red-500" />
              }
              <p>Inserir a história do personagem</p>
            </div>
            <div className="pl-5">
              { !background.correct && <p> - { background.errorMessage }</p> }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}