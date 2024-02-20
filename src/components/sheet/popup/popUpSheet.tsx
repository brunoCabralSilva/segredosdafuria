'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionForm, actionShowMenuSession, useSlice } from "@/redux/slice";
import { useEffect, useState } from "react";
import General from "../general";
import Attributes from "../attributes";
import Skills from "../skills";
import Forms from "../forms";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "@/firebase/connection";
import Notes from '../notes';
import GiftsSheet from "../gifts";
import AdvantagesAnsFlaws from "../advantagesAndFlaws";
import RitualSheet from "../rituals";
import Background from "../background";
import { IoIosCloseCircleOutline } from "react-icons/io";
import SessionDetails from "../sessionDetalis";
import { getUserByIdSession } from "@/firebase/sessions";

export default function PopUpSheet() {
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const [optionSelect, setOptionSelect] = useState('general');

  useEffect(() => {
    getForm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getForm = async() => {
    const db = getFirestore(firebaseConfig);
    const player = await getUserByIdSession(
      slice.sessionId,
      slice.userData.email,
    );
    if (player) dispatch(actionForm(player.data.form));
  };

  const returnDataSheet = () => {
    switch(optionSelect) {
      case ('general'):
        return <General />
      case ('attributes'):
        return <Attributes />;
      case ('skills'):
        return <Skills />;
      case ('gifts-rituals'):
        return (
          <div className="w-full overflow-y-auto flex flex-col items-center justify-start">
            <GiftsSheet />
            <hr className="mt-5 mb-8 w-11/12" />
            <RitualSheet />
          </div>
        );
      case ('advantages-flaws'):
        return <AdvantagesAnsFlaws />;
      case ('forms'):
        return <Forms />;
      case ('session'):
        return <SessionDetails />;
      case ('background'):
        return <Background type="background" /> ;
      case ('anotations'):
        return <Notes type="notes"  />;
      default:
        return <General />
    }
  };

  return(
      <div className="flex flex-col items-center justify-start h-screen z-50 top-0 right-0 pl-3 pr-2 pt-12 bg-gray-whats-dark">
        <IoIosCloseCircleOutline
          className="fixed top-0 right-1 text-4xl text-white ml-2 mt-2 cursor-pointer z-50"
          onClick={() => dispatch(actionShowMenuSession(''))}
        />
        <select
          defaultValue='general'
          onChange={ (e) => {
            setOptionSelect(e.target.value);
            getForm();
          }}
          className="w-full mb-2 border border-white p-3 cursor-pointer bg-black text-white flex items-center justify-center font-bold text-center"
        >
          <option value={'general'}>Geral</option>
          <option value={'attributes'}>Atributos</option>
          <option value={'skills'}>Habilidades</option>
          <option value={'gifts-rituals'}>Dons e Rituais</option>
          <option value={'advantages-flaws'}>Vantagens e Defeitos</option>
          <option value={'forms'}>Formas ( Atual: { slice.form } )</option>
          <option value={'session'}>Sessão</option>
          <option value={'background'}>Background</option>
          <option value={'anotations'}>Anotações</option>
        </select>
        { returnDataSheet() }
      </div>
  )
}