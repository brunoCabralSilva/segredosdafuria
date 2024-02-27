'use client'
import { useEffect, useState } from "react";
import { updateDoc } from "firebase/firestore";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { actionDeleteUserFromSession, actionResetSheet, actionShowMenuSession, useSlice } from "@/redux/slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { getUserAndDataByIdSession, getUserByIdSession } from "@/firebase/sessions";
import Item from "./item";
import dataTrybes from '../../data/trybes.json';
import ItemAgravated from "./itemAgravated";
import PopupDelUserFromSession from "./popup/popupDelUserFromSession";
import { returnHaranoHaugloskCheck } from "@/firebase/checks";

export default function General() {
  const dispatch = useAppDispatch();
  const [input, setInput ] = useState('');
  const [nameCharacter, setNameCharacter] = useState<string>('');
  const [auspice, setAuspice] = useState<string>('');
  const [trybeI, setTrybe] = useState<string>('');
  const router = useRouter();
  const slice = useAppSelector(useSlice);

  const typeName = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setNameCharacter(sanitizedValue);
  };

  useEffect(() => {
    returnValueSkill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const returnValueSkill = async (): Promise<void> => {
    const player = await getUserByIdSession(
      slice.sessionId,
      slice.userData.email,
    );
    if (player) {
      setAuspice(player.data.auspice);
      setTrybe(player.data.trybe);
      setNameCharacter(player.data.name);
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
  };

  const updateValue = async (key: string, value: string) => {
    const getUser: any = await getUserAndDataByIdSession(slice.sessionId);
    const player = getUser.players.find((gp: any) => gp.email === slice.userData.email);
    if (player) {
      if (key === 'name') player.data.name = nameCharacter;
      if (key === 'auspice') player.data.auspice = value;
      if (key === 'trybe') player.data.trybe = value;
      const playersFiltered = getUser.players.filter((gp: any) => gp.email !== slice.userData.email);
      await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
    returnValueSkill();
  };

  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 p-1 text-white flex-col items-start justify-center font-bold px-4">
        <div
          className="w-full mt-5 capitalize flex justify-between items-center cursor-pointer"
          onClick={() => setInput('nameCharacter')}
        >
          { 
            input !== 'nameCharacter' && <span className="capitalize break-words text-xl w-full">{
              nameCharacter.length === 0 || nameCharacter[0] === '' || nameCharacter[0] === ' '
              ? <span className=" w-full">
                  Insira um nome
                </span>
              : <span className="w-full">
                  { nameCharacter }
                </span>
            }</span>
          }
          { 
            input === 'nameCharacter' &&
            <input
              type="text"
              className="border-2 border-white text-white text-center w-full mr-1 bg-black"
              placeholder="Nome"
              value={ nameCharacter }
              onChange={(e) => typeName(e)}
            />
          }
          { 
            input
              ? <BsCheckSquare
                  onClick={(e:any) => {
                    updateValue('name', nameCharacter[0]);
                    setInput('');
                    e.stopPropagation();
                  }}
                  className="text-3xl"
                />
              : <FaRegEdit
                  onClick={
                    (e:any) => {
                      setInput('nameCharacter');
                      e.stopPropagation();
                    }}
                  className="text-3xl"
                />
          }
        </div>
        <div className={ `mt-5 capitalize flex-col justify-between items-center` }>
          <span className="pr-3">Augúrio</span>
          <select
            className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white mt-2 cursor-pointer"
            value={auspice}
            onChange={ (e) => {
              updateValue('auspice', e.target.value);
              setAuspice(e.target.value);
            }}
          >
            <option disabled value="">Escolha um Augúrio</option>
            <option value="ragabash">Ragabash</option>
            <option value="theurge">Theurge</option>
            <option value="philodox">Philodox</option>
            <option value="galliard">Galliard</option>
            <option value="ahroun">Ahroun</option>
          </select>
        </div>
        <div className={ `mt-5 capitalize flex-col justify-between items-center` }>
          <span className="pr-3">Tribo</span>
          <select
            className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white mt-2 cursor-pointer"
            value={ trybeI }
            onChange={ (e) => {
              updateValue('trybe', e.target.value);
              setTrybe(e.target.value);
            }}
          >
            <option disabled value="">Escolha uma Tribo</option>
            {
              dataTrybes
                .sort((a, b) => a.namePtBr.localeCompare(b.namePtBr))
                .map((trybe, index) => (
                <option
                  key={index}
                  value={ trybe.nameEn }
                >
                  { trybe.namePtBr }
                </option>
              ))
            }
          </select>
        </div>
        <Item name="rage" namePtBr="Fúria" quant={5} />
        <ItemAgravated name="willpower" namePtBr="Força de Vontade" />
        <ItemAgravated name="health" namePtBr="Vitalidade" />
        <div className="flex flex-col lg:flex-row">
          <Item name="harano" namePtBr="Harano" quant={5} />
          <Item name="hauglosk" namePtBr="Hauglosk" quant={5} />
        </div>
        {/* <button
          className="mt-3 bg-white p-1 w-full cursor-pointer capitalize text-center text-black hover:font-bold hover:bg-black hover:text-white rounded border-2 border-black hover:border-white transition transition-colors duration-600"
          onClick={ async () => {
            await returnHaranoHaugloskCheck(slice.sessionId, slice.userData);
            dispatch(actionShowMenuSession(''))
          }}
        >
          Teste de Harano / Hauglosk
        </button> */}
        <Item name="honor" namePtBr="Honra" quant={5} />
        <Item name="glory" namePtBr="Glória" quant={5} />
        <Item name="wisdom" namePtBr="Sabedoria" quant={5} />
        <button
            type="button"
            className="mt-8 p-2 w-full text-center border-2 border-white text-white bg-red-800 cursor-pointer font-bold hover:bg-red-900 transition-colors"
            onClick={() => dispatch(actionResetSheet(true))}
          >
            Resetar Ficha
        </button>
        <button
            type="button"
            className="mt-3 mb-3 p-2 w-full text-center border-2 border-white text-white bg-red-800 cursor-pointer font-bold hover:bg-red-900 transition-colors"
            onClick={() => dispatch(actionDeleteUserFromSession(true))}
          >
            Sair da Sessão
        </button>
        { slice.popupDeleteUserFromSession && <PopupDelUserFromSession /> }
      </div>
    </div>
  );
}