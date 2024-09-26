import contexto from "@/context/context";
import { useContext, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Skills from "../player/skills";
import AdvantagesAndFlaws from "../player/advantagesAndFlaws";
import General from "../player/general";
import Rituals from "../player/rituals";
import Anotations from "../player/notes";
import Gifts from "../player/gifts";
import Details from "../player/details";
import Attributes from "../player/attributes";
import Forms from "../player/forms";
import Background from "../player/background";
import HaranoHauglosk from "./haranoHauglosk";
import GiftRoll from "./giftRoll";
import RitualRoll from "./ritualRoll";
import Touchstones from "../player/touchstones";

export default function MenuPlayer() {
  const [optionSelect, setOptionSelect] = useState('general');
  const {
    dataSheet,
    showHarano, setShowHarano,
    showHauglosk, setShowHauglosk,
    showGiftRoll, setShowGiftRoll,
    showRitualRoll, setShowRitualRoll,
    setShowMenuSession,
  } = useContext(contexto);


	const returnDataSheet = () => {
    switch(optionSelect) {
      case ('attributes'): return (<Attributes />);
      case ('skills'): return (<Skills />);
      case ('advantages-flaws'): return (<AdvantagesAndFlaws />);
      case ('forms'): return (<Forms />);
      case ('session'): return (<Details />);
      case ('touchstones'): return (<Touchstones />);
      case ('background'): return (<Background type="background" />);
      case ('anotations'): return (<Anotations type="notes" />);
      case ('gifts'): return (<Gifts />);
      case ('rituals'): return (<Rituals />);
      default: return (<General />);
    }
  };

  return(
    <div className={`w-8/10 px-5 sm:px-8 pb-8 pt-3 sm-p-10 ${showHarano || showHauglosk || showGiftRoll.show || showRitualRoll.show ? 'bg-black' : 'bg-gray-whats-dark'} flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto text-white`}>
      <div className="w-full flex justify-end my-3">
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer mb-2"
          onClick={ () => {
            if (showHarano || showHauglosk || showGiftRoll.show || showRitualRoll.show) {
              setShowHarano(false);
              setShowHauglosk(false);
              setShowGiftRoll({ show: false, gift: {}});
              setShowRitualRoll({ show: false, ritual: {}});
            } else setShowMenuSession('');
          }}
        />
      </div>
      { 
        !showHarano
        && !showHauglosk
        && !showGiftRoll.show
        && !showRitualRoll.show
        && <div className="w-full h-full">
        <select
          defaultValue='general'
          onChange={ (e) => {
          setOptionSelect(e.target.value);
          }}
          className="w-full mb-2 border border-white p-3 cursor-pointer bg-black text-white flex items-center justify-center font-bold text-center"
      >
          <option value={'general'}>Geral</option>
          <option value={'attributes'}>Atributos</option>
          <option value={'skills'}>Habilidades</option>
          <option value={'gifts'}>Dons</option>
          <option value={'rituals'}>Rituais</option>
          <option value={'touchstones'}>Pilares</option>
          <option value={'advantages-flaws'}>Vantagens e Defeitos</option>
          <option value={'forms'}>Formas ( Atual: { dataSheet.form } )</option>
          <option value={'session'}>Sessão</option>
          <option value={'background'}>Background</option>
          <option value={'anotations'}>Anotações</option>
        </select>
        { returnDataSheet() }
        </div>
      }
      { showGiftRoll.show && <GiftRoll /> }
      { showRitualRoll.show && <RitualRoll /> }
      { showHarano && <HaranoHauglosk type="Harano" /> }
      { showHauglosk && <HaranoHauglosk type="Hauglosk" /> }
    </div>
  );
}