'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionForm, actionShowMenuSession, useSlice } from "@/redux/slice";
import { useEffect, useState } from "react";
import General from "./sheet/general";
import Attributes from "./sheet/attributes";
import Skills from "./sheet/skills";
import Forms from "./sheet/forms";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import firebaseConfig from "@/firebase/connection";
import Notes from './sheet/notes';
import GiftsSheet from "./sheet/gifts";
import AdvantagesAnsFlaws from "./sheet/advantagesAndFlaws";
import RitualSheet from "./sheet/rituals";
import Background from "./sheet/background";
import { authenticate, signIn } from "@/firebase/login";
import { useRouter } from "next/navigation";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function PopUpSheet(props: { session: string }) {
  const { session } = props;
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [optionSelect, setOptionSelect] = useState('general');

  const getForm = async() => {
    const db = getFirestore(firebaseConfig);
    try {
      const authData: { email: string, name: string } | null = await authenticate();
      if (authData && authData.email && authData.name) {
        const { email } = authData;
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        dispatch(actionForm(player.data.form));
      } else {
        const sign = await signIn();
        if (!sign) {
          window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
          router.push('/');
        }
      }
    } catch (error) {
      window.alert('Erro ao obter valor do atributo: ' + error);
    }
  };

  useEffect(() => {
    getForm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const returnDataSheet = () => {
    switch(optionSelect) {
      case ('general'):
        return <General session={session} />
      case ('attributes'):
        return <Attributes session={session} />;
      case ('skills'):
        return <Skills session={session} />;
      case ('gifts-rituals'):
        return (
          <div className="w-full overflow-y-auto flex flex-col items-center justify-start">
            <GiftsSheet session={session} />
            <hr className="mt-5 mb-8 w-11/12" />
            <RitualSheet session={session} />
          </div>
        );
      case ('advantages-flaws'):
        return <AdvantagesAnsFlaws session={session} />;
      case ('forms'):
        return <Forms session={session} />;
      case ('background'):
        return <Background type="background" session={session} /> ;
      case ('anotations'):
        return <Notes type="notes" session={session}  />;
      default:
        return <General session={session} />
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
          <option value={'background'}>Background</option>
          <option value={'anotations'}>Anotações</option>
        </select>
        { returnDataSheet() }
      </div>
  )
}