'use client'
import { updateDataPlayer } from "@/firebase/players";
import ItemSkill from "../sheetItems/itemSkill";
import { useContext } from "react";
import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { capitalizeFirstLetter } from "@/firebase/utilities";

export default function Skills() {
  const { dataSheet, session, email, sheetId, setShowMessage } = useContext(contexto);
  const updateValue = async (value: string) => {
    const newDataSheet = dataSheet;
    const dataPersist = newDataSheet.data.skills.type;
    newDataSheet.data.skills.type = value;
    await updateDataPlayer(sheetId, newDataSheet, setShowMessage);
    await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou o modelo de distribuição de habilidades do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } ${dataPersist !== '' ? `de ${dataPersist} ` : ' '}para ${value}.`, type: 'notification' }, null, setShowMessage);
  }

  return(
    <div className="flex flex-col w-full h-75vh overflow-y-auto pr-2">
      <div className="w-full h-full mb-2 p-1 text-white flex-col items-start justify-center font-bold">
        <select
          className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white mt-2 cursor-pointer"
          value={ dataSheet.data.skills.type }
          onChange={ (e) => updateValue(e.target.value) }
        >
          <option disabled value="">Escolha um Modelo de distribuição</option>
          <option value="Pau pra toda Obra">Pau pra toda obra</option>
          <option value="Equilibrado">Equilibrado</option>
          <option value="Especialista">Especialista</option>
        </select>
        <div className="w-full px-4 pt-4">
          <ItemSkill name="athletics" quant={5} />
          <ItemSkill name="brawl" quant={5} />
          <ItemSkill name="craft" quant={5} />
          <ItemSkill name="driving" quant={5} />
          <ItemSkill name="firearms" quant={5} />
          <ItemSkill name="larceny" quant={5} />
          <ItemSkill name="melee" quant={5} />
          <ItemSkill name="stealth" quant={5} />
          <ItemSkill name="survival" quant={5} />
        </div>
        <hr className="mx-4 my-6" />
        <div className="w-full px-4">
          <ItemSkill name="animalKen" quant={5} />
          <ItemSkill name="etiquette" quant={5} />
          <ItemSkill name="insight" quant={5} />
          <ItemSkill name="intimidation" quant={5} />
          <ItemSkill name="leadership" quant={5} />
          <ItemSkill name="performance" quant={5} />
          <ItemSkill name="persuasion" quant={5} />
          <ItemSkill name="streetwise" quant={5} />
          <ItemSkill name="subterfuge" quant={5} />
        </div>
        <hr className="mx-4 my-6" />
        <div className="w-full px-4 pb-5">
          <ItemSkill name="academics" quant={5} />
          <ItemSkill name="awareness" quant={5} />
          <ItemSkill name="finance" quant={5} />
          <ItemSkill name="investigation"  quant={5} />
          <ItemSkill name="medicine" quant={5} />
          <ItemSkill name="occult" quant={5} />
          <ItemSkill name="politics" quant={5} />
          <ItemSkill name="science" quant={5} />
          <ItemSkill name="technology" quant={5} />
        </div>
      </div>
    </div>
  );
}