import contexto from "@/context/context";
import { useContext, useEffect, useState } from "react";
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

export default function MenuPlayer() {
  const [optionSelect, setOptionSelect] = useState('general');
  const {
    sessionId,
    setShowMenuSession,
  } = useContext(contexto);


	const returnDataSheet = () => {
    switch(optionSelect) {
      case ('attributes'): return (<Attributes />);
      case ('skills'): return (<Skills />);
      case ('advantages-flaws'): return (<AdvantagesAndFlaws />);
      case ('forms'): return (<Forms />);
      case ('session'): return (<Details />);
      case ('background'): return (<Anotations type="background" />);
      case ('anotations'): return (<Anotations type="notes" />);
      case ('gifts-rituals'):
        return (
          <div className="w-full overflow-y-auto flex flex-col items-center justify-start">
            <Gifts />
            <hr className="mt-5 mb-8 w-11/12" />
            <Rituals />
          </div>
        );
      default: return (<General />);
    }
  };

  return(
    <div className="w-8/10 px-5 sm:px-8 pb-8 pt-3 sm-p-10 bg-black flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto text-white">
      <div className="w-full flex justify-end my-3">
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer mb-2"
          onClick={ () => setShowMenuSession('') }
        />
      </div>
      <select
        defaultValue='general'
        onChange={ (e) => {
        setOptionSelect(e.target.value);
        // getForm();
        }}
        className="w-full mb-2 border border-white p-3 cursor-pointer bg-black text-white flex items-center justify-center font-bold text-center"
    >
        <option value={'general'}>Geral</option>
        <option value={'attributes'}>Atributos</option>
        <option value={'skills'}>Habilidades</option>
        <option value={'gifts-rituals'}>Dons e Rituais</option>
        <option value={'advantages-flaws'}>Vantagens e Defeitos</option>
        <option value={'forms'}>
          Formas
          {/* ( Atual: { slice.form } ) */}
        </option>
        <option value={'session'}>Sessão</option>
        <option value={'background'}>Background</option>
        <option value={'anotations'}>Anotações</option>
    	</select>
			{ returnDataSheet() }
    </div>
  );
}