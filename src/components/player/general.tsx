'use client'
import { useContext, useEffect, useState } from "react";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import dataTrybes from '../../data/trybes.json';
import { updateDataPlayer } from "@/firebase/players";
import contexto from "@/context/context";
import Item from "./item";
import ItemAgravated from "./itemAgravated";
import ResetSheet from "../popup/resetSheet";

export default function General() {
  const [input, setInput ] = useState('');
  const [newName, setNewName] = useState('');
	const {
		sessionId, email,
    dataSheet, setDataSheet,
		showResetSheet, setShowResetSheet,
    setShowGiftRoll,
    setShowRitualRoll,
    setShowMessage,
    setShowEvaluateSheet,
    setShowDownloadPdf,
	} = useContext(contexto);

  useEffect(() => {
    setShowGiftRoll({ show: false, gift: {}});
    setShowRitualRoll({ show: false, ritual: {}});
    setNewName(dataSheet.name);
  }, [])

  const typeName = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setNewName(sanitizedValue);
  };

  const updateValue = async (key: string, value: string) => {
    const newDataSheet = dataSheet;
    if (key === 'name') newDataSheet.name = newName;
    else newDataSheet[key] = value;
		await updateDataPlayer(sessionId, email, newDataSheet, setShowMessage);
    if (key === 'name') setNewName(newDataSheet.name);
    setDataSheet(newDataSheet);
  };

  return(
    <div className="flex flex-col w-full pr-2 h-75vh overflow-y-auto mb-3 p-1 text-white items-start justify-start font-bold px-4">
      <div
        className="w-full mt-5 capitalize flex justify-between items-center cursor-pointer"
        onClick={() => setInput('nameCharacter')}
      >
        { 
          input !== 'nameCharacter' && <span className="capitalize break-words text-xl w-full">{
            dataSheet && dataSheet.name.length === 0 || dataSheet.name[0] === '' || dataSheet.name[0] === ' '
            ? <span className=" w-full">
                Insira um nome
              </span>
            : <span className="w-full">
                { dataSheet.name }
              </span>
          }</span>
        }
        { 
          input === 'nameCharacter' &&
          <input
            type="text"
            className="border-2 border-white text-white text-center w-full mr-1 bg-black"
            placeholder="Nome"
            value={ newName }
            onChange={(e) => typeName(e)}
          />
        }
        { 
          input
            ? <BsCheckSquare
                onClick={(e:any) => {
                  updateValue('name', dataSheet.name);
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
      <div className="mt-5 capitalize flex-col justify-between items-center w-full">
        <span className="pr-3">Augúrio</span>
        <select
          className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white mt-2 cursor-pointer"
          value={dataSheet.auspice}
          onChange={ (e) => updateValue('auspice', e.target.value) }
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
          value={ dataSheet.trybe }
          onChange={ (e) => updateValue('trybe', e.target.value) }
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
      <ItemAgravated name="willpower" namePtBr="Força de Vontade" />
      <ItemAgravated name="health" namePtBr="Vitalidade" />
      <Item quant={5} name="rage" namePtBr="Fúria" />
      <Item quant={5} name="harano" namePtBr="Harano" />
      <Item quant={5} name="hauglosk" namePtBr="Hauglosk" />
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
      { showResetSheet && <ResetSheet /> }
    </div>
  );
}