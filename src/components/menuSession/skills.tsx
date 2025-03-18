'use client'
import { updateDataPlayer } from "@/firebase/players";
import ItemSkill from "../sheetItems/itemSkill";
import { useContext } from "react";
import contexto from "@/context/context";

export default function Skills() {
  const { dataSheet, sheetId, setShowMessage } = useContext(contexto);
  const updateValue = async (value: string) => {
    const newDataSheet = dataSheet;
    newDataSheet.data.skills.type = value;
    await updateDataPlayer(sheetId, newDataSheet, setShowMessage);
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
          <ItemSkill name="athletics" namePtBr="Atletismo" quant={5} />
          <ItemSkill name="brawl" namePtBr="Briga" quant={5} />
          <ItemSkill name="craft" namePtBr="Ofícios" quant={5} />
          <ItemSkill name="driving" namePtBr="Condução" quant={5} />
          <ItemSkill name="firearms" namePtBr="Armas de Fogo" quant={5} />
          <ItemSkill name="larceny" namePtBr="Furto" quant={5} />
          <ItemSkill name="melee" namePtBr="Armas Brancas" quant={5} />
          <ItemSkill name="stealth" namePtBr="Furtividade" quant={5} />
          <ItemSkill name="survival" namePtBr="Sobrevivência" quant={5} />
        </div>
        <hr className="mx-4 my-6" />
        <div className="w-full px-4">
          <ItemSkill name="animalKen" namePtBr="Empatia com Animais" quant={5} />
          <ItemSkill name="etiquette" namePtBr="Etiqueta" quant={5} />
          <ItemSkill name="insight" namePtBr="Intuição" quant={5} />
          <ItemSkill name="intimidation" namePtBr="Intimidação" quant={5} />
          <ItemSkill name="leadership" namePtBr="Liderança" quant={5} />
          <ItemSkill name="performance" namePtBr="Performace" quant={5} />
          <ItemSkill name="persuasion" namePtBr="Persuasão" quant={5} />
          <ItemSkill name="streetwise" namePtBr="Manha" quant={5} />
          <ItemSkill name="subterfuge" namePtBr="Lábia" quant={5} />
        </div>
        <hr className="mx-4 my-6" />
        <div className="w-full px-4 pb-5">
          <ItemSkill name="academics" namePtBr="Acadêmicos" quant={5} />
          <ItemSkill name="awareness" namePtBr="Percepção" quant={5} />
          <ItemSkill name="finance" namePtBr="Finanças" quant={5} />
          <ItemSkill name="investigation" namePtBr="Investigação" quant={5} />
          <ItemSkill name="medicine" namePtBr="Medicina" quant={5} />
          <ItemSkill name="occult" namePtBr="Ocultismo" quant={5} />
          <ItemSkill name="politics" namePtBr="Política" quant={5} />
          <ItemSkill name="science" namePtBr="Ciência" quant={5} />
          <ItemSkill name="technology" namePtBr="Tecnologia" quant={5} />
        </div>
      </div>
    </div>
  );
}