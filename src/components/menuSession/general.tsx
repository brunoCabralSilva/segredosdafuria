'use client'
import { useContext, useEffect, useState } from "react";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import dataTrybes from '../../data/trybes.json';
import { updateDataPlayer } from "@/firebase/players";
import contexto from "@/context/context";
import Item from "../sheetItems/item";
import ItemAgravated from "../sheetItems/itemAgravated";
import ResetSheet from "../popup/resetSheet";
import { getUserByEmail } from "@/firebase/user";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { CiEdit } from "react-icons/ci";
import Image from "next/image";
import DeleteSheet from "../popup/deleteSheet";
import { registerHistory } from "@/firebase/history";

export default function General() {
  const [input, setInput] = useState('');
  const [input2, setInput2] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
	const {
    players,
    email,
    dataSheet,
		showResetSheet, setShowResetSheet,
    showDeleteSheet,
    setShowMenuSession,
    setShowGiftRoll,
    setShowRitualRoll,
    setShowMessage,
    setShowDeleteSheet,
    setShowEvaluateSheet,
    setShowDownloadPdf,
    sheetId,
    session,
	} = useContext(contexto);

  useEffect(() => {
    setShowGiftRoll({ show: false, gift: {}});
    setShowRitualRoll({ show: false, ritual: {}});
    setNewName(dataSheet.data.name);
    setNewEmail(dataSheet.email);
  }, [dataSheet])

  const typeName = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setNewName(sanitizedValue);
  };

  const updateValue = async (key: string, value: string, namePtBr: string) => {
    const findPlayer = players.find((player: any) => player.id === sheetId);
    if (findPlayer) {
      const dataPersist = findPlayer.data[key];
      findPlayer.data[key] = value;
      if (key === 'name') {
        if (value === '' || value === ' ') {
          setShowMessage({ show: true, text: 'Necessário preencher um Nome válido' });
        } else {
          await updateDataPlayer(sheetId, findPlayer, setShowMessage);
          setNewName(findPlayer.data.name);
          await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(findPlayer.user)} alterou o nome do personagem ${dataPersist}${findPlayer.email !== email ? ` do jogador ${capitalizeFirstLetter(findPlayer.user)}` : '' } para ${capitalizeFirstLetter(value)}.`, type: 'notification' }, null, setShowMessage);
        await updateDataPlayer(sheetId, findPlayer, setShowMessage);
        }
      } else {
        await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(findPlayer.user)} alterou ${namePtBr === 'Tribo' ? 'a' : 'o'} ${namePtBr} do personagem ${findPlayer.data.name}${findPlayer.email !== email ? ` do jogador ${capitalizeFirstLetter(findPlayer.user)}` : '' } ${dataPersist !== '' ? `de ${capitalizeFirstLetter(dataPersist)} ` : ' '}para ${capitalizeFirstLetter(value)}.`, type: 'notification' }, null, setShowMessage);
        await updateDataPlayer(sheetId, findPlayer, setShowMessage);
      }
    }
  };

  const updateEmail = async (value: string) => {
    const findPlayer = players.find((player: any) => player.id === sheetId);
    if (findPlayer) {
      const playerData = await getUserByEmail(value, setShowMessage);
      findPlayer.email = value;
      findPlayer.user = capitalizeFirstLetter(playerData.firstName) + ' ' + capitalizeFirstLetter(playerData.lastName);
      const validate = /\S+@\S+\.\S+/;
      const vEmail = !validate.test(value) || value === '';
      if (vEmail) {
        setShowMessage({ show: true, text: 'Necessário preencher um Email válido' });
      } else {
        await updateDataPlayer(sheetId, findPlayer, setShowMessage);
        setNewEmail(findPlayer.email);
        await registerHistory(session.id, { message: `O Narrador alterou o email do personagem ${capitalizeFirstLetter(findPlayer.user)} para ${value}.`, type: 'notification' }, null, setShowMessage);
      }
    }
  };

  return(
    <div className="flex flex-col w-full pr-2 h-75vh overflow-y-auto mb-3 p-1 text-white items-start justify-start font-bold px-4">
      <p className="mt-5">Nome do Personagem</p>
      <div
        className="w-full flex justify-between items-center cursor-pointer bg-black p-2 mt-1 border border-white"
        onClick={() => setInput('nameCharacter')}
      >
        { 
          input !== 'nameCharacter' && <span className="break-words w-full text-center">{
            dataSheet && dataSheet.data && dataSheet.data.name && (dataSheet.data.name.length === 0 || dataSheet.data.name[0] === '' || dataSheet.data.name[0] === ' ')
            ? <span className=" w-full">
                Insira um nome
              </span>
            : <span className="w-full">
                { dataSheet.data.name }
              </span>
          }</span>
        }
        { 
          input === 'nameCharacter' &&
          <input
            type="text"
            className="text-center w-full mr-1 bg-black outline-none"
            placeholder="Nome"
            value={ newName }
            onChange={(e) => typeName(e)}
          />
        }
        { 
          input === 'nameCharacter'
            ? <BsCheckSquare
                onClick={(e:any) => {
                  updateValue('name', newName, 'nome do personagem');
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
      {
        session.gameMaster === email &&
        <div className="w-full">
          <p className="mt-5">Email do Usuário (Altere o Email se quiser compartilhar a ficha com outro jogador)</p>
          <div
            className="w-full flex justify-between items-center cursor-pointer bg-black p-2 mt-1 border border-white"
            onClick={() => setInput2('emailCharacter')}
          >
            { 
              input2 !== 'emailCharacter' && <span className="text-center break-words w-full">{
                dataSheet.email && (dataSheet.email[0] === '' || dataSheet.email[0] === ' ')
                ? <span className=" w-full">
                    Insira um email
                  </span>
                : <span className="w-full">
                    { dataSheet.email }
                  </span>
              }</span>
            }
            { 
              input2 === 'emailCharacter' &&
              <input
                type="text"
                className="text-center w-full mr-1 bg-black outline-none"
                placeholder="Email"
                value={ newEmail }
                onChange={(e) => setNewEmail(e.target.value)}
              />
            }
            { 
              input2
                ? <BsCheckSquare
                    onClick={(e:any) => {
                      updateEmail(newEmail);
                      setInput2('');
                      e.stopPropagation();
                    }}
                    className="text-3xl"
                  />
                : <FaRegEdit
                    onClick={
                      (e:any) => {
                        setInput2('emailCharacter');
                        e.stopPropagation();
                      }}
                    className="text-3xl"
                  />
            }
          </div>
        </div>
      }
      <div className="w-full flex sm:flex-row flex-col justify-between items-center gap-4 mt-5">
        <div className="w-full sm:w-60 h-60 sm:h-44 border-2 border-white bg-black relative">
          {
            dataSheet && dataSheet.data && dataSheet.data.profileImage ?
            <Image
              src={ dataSheet.data.profileImage }
              alt="Imagem de Perfil"
              className="w-full h-full object-cover object-center"
              width={ 1200 }
              height={ 800 }
            />
            : <p className="w-full h-full flex items-center justify-center text-center px-2">Sem imagem de Perfil</p>
          }
          <button
            type="button"
            onClick={ () => setShowMenuSession('edit-image') }
            className="bg-black rounded absolute bottom-1 right-1 text-xl border border-white hover:bg-white hover:text-black transition-colors duration-400"
          >
            <CiEdit />
          </button>
        </div>
        <div className="w-full">
          <div className="capitalize flex-col justify-between items-center w-full">
          <span className="pr-3">Augúrio</span>
          <select
            className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white mt-2 cursor-pointer"
            value={dataSheet.data.auspice}
            onChange={ (e) => updateValue('auspice', e.target.value, 'Augúrio') }
          >
            <option disabled value="">Escolha um Augúrio</option>
            <option value="ragabash">Ragabash</option>
            <option value="theurge">Theurge</option>
            <option value="philodox">Philodox</option>
            <option value="galliard">Galliard</option>
            <option value="ahroun">Ahroun</option>
          </select>
        </div>
        <div className="mt-5 capitalize flex-col justify-between items-center w-full">
          <span className="pr-3">Tribo</span>
          <select
            className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white mt-2 cursor-pointer"
            value={ dataSheet.data.trybe }
            onChange={ (e) => updateValue('trybe', e.target.value, 'Tribo') }
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
        </div>
      </div>
      <ItemAgravated name="willpower" namePtBr="Força de Vontade" />
      <ItemAgravated name="health" namePtBr="Vitalidade" />
      <Item quant={5} name="rage" namePtBr="Fúria" />
      <Item quant={5} name="harano" namePtBr="Harano" />
      <Item quant={5} name="hauglosk" namePtBr="Hauglosk" />
      <div className="pt-8 text-xl">Renome </div>
      <Item quant={5} name="honor" namePtBr="Honra" />
      <Item quant={5} name="glory" namePtBr="Glória" />
      <Item quant={5} name="wisdom" namePtBr="Sabedoria" />
      <button
        type="button"
        onClick={ () => setShowEvaluateSheet({show: true, data: 'player' }) }
        className="mt-8 mb-2 p-2 w-full text-center border-2 border-white text-white bg-black cursor-pointer font-bold hover:border-red-500 transition-colors"
      >
        Avaliar Ficha 
      </button>
      <button
        type="button"
        onClick={ () => setShowDownloadPdf({ show: true, email: '' }) }
        className="mb-2 p-2 w-full text-center border-2 border-white text-white bg-black cursor-pointer font-bold hover:border-red-500 transition-colors"
      >
        Exportar Ficha 
      </button>
      <button
        type="button"
        onClick={ () => setShowResetSheet(true) }
        className="p-2 w-full text-center border-2 border-white text-white bg-red-800 cursor-pointer font-bold hover:bg-red-900 transition-colors"
      >
        Redefinir Ficha
      </button>
      {
        session.gameMaster === email &&
        <button
          type="button"
          onClick={ () => setShowDeleteSheet(true) }
          className="mt-2 p-2 w-full text-center border-2 border-white text-white bg-red-800 cursor-pointer font-bold hover:bg-red-900 transition-colors"
        >
          Excluir Personagem
        </button>
      }
      { showResetSheet && <ResetSheet /> }
      { showDeleteSheet && <DeleteSheet /> }
    </div>
  );
}