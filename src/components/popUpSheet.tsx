'use client'
import { useAppDispatch } from "@/redux/hooks";
import { actionShowSheet } from "@/redux/slice";
import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import General from "./sheet/general";
import Attributes from "./sheet/Attributes";

export default function PopUpSheet() {
  const [optionSelect, setOptionSelect] = useState('');
  const dispatch = useAppDispatch();

  const returnDataSheet = () => {
    switch(optionSelect) {
      case ('general'):
        return <General />
      case ('attributes'):
        return <Attributes />;
      case ('skills'):
        return '';
      case ('gifts'):
        return '';
      case ('rituals'):
        return '';
      case ('advantages-flaws'):
        return '';
      case ('forms'):
        return '';
      case ('background'):
        return '';
      case ('anotations'):
        return '';
      default:
        return <General />
    }
  };

  return(
      <div className="w-full pl-3 pr-2 pt-12 bg-black flex flex-col items-center justify-center h-screen z-50 top-0 right-0">
        <IoIosCloseCircleOutline
          className="fixed top-0 right-1 text-4xl text-white ml-2 mt-2 cursor-pointer z-50"
          onClick={() => dispatch(actionShowSheet(false))}
        />
        <select
          onChange={ (e) => setOptionSelect(e.target.value) }
          className="w-full mb-2 border border-white p-3 cursor-pointer text-black bg-white flex items-center justify-center font-bold"
        >
          <option value={'general'}>Geral</option>
          <option value={'attributes'}>Atributos</option>
          <option value={'skills'}>Habilidades</option>
          <option value={'gifts'}>Dons</option>
          <option value={'rituals'}>Rituais</option>
          <option value={'advantages-flaws'}>Vantagens e Defeitos</option>
          <option value={'forms'}>Formas</option>
          <option value={'background'}>Background</option>
          <option value={'anotations'}>Anotações</option>
        </select>
        { returnDataSheet() }
      </div>
  )
}