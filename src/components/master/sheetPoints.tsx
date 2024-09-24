import { useContext, useEffect, useState } from "react";
import HaranoHaugloskMaster from "../popup/haranoHaugloskMaster";
import ItemAgravatedMaster from "./itemAgravatedMaster";
import ItemAtrMaster from "./itemAtrMaster";
import ItemMaster from "./itemMaster";
import ItemSkillMaster from "./itemSkillMaster";
import contexto from "@/context/context";

export default function SheetPoints(props: { player: any }) {
  const { player } = props;
  const { showHauglosk, showHarano } = useContext(contexto);
  return(
    <div>
      { 
        <div>
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 w-full">
              <div className="w-full">
                <ItemAtrMaster player={player} name="strength" namePtBr="Força" quant={6} />
                <ItemAtrMaster player={player} name="dexterity" namePtBr="Destreza" quant={6} />
                <ItemAtrMaster player={player} name="stamina" namePtBr="Vigor" quant={6} />
              </div>
              <div className="w-full">
                <ItemAtrMaster player={player} name="charisma" namePtBr="Carisma" quant={6} />
                <ItemAtrMaster player={player} name="manipulation" namePtBr="Manipulação" quant={6} />
                <ItemAtrMaster player={player} name="composure" namePtBr="Autocontrole" quant={6} />
              </div>
              <div className="w-full">
                <ItemAtrMaster player={player} name="intelligence" namePtBr="Inteligência" quant={6} />
                <ItemAtrMaster player={player} name="wits" namePtBr="Raciocínio" quant={6} />
                <ItemAtrMaster player={player} name="resolve" namePtBr="Determinação" quant={6} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 w-full mt-4">
            <ItemMaster player={player} name="honor" quant={5} namePtBr="Honra" />
            <ItemMaster player={player} name="glory" quant={5} namePtBr="Glória" />
            <ItemMaster player={player} name="wisdom" quant={5} namePtBr="Sabedoria" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 w-full mt-4">
            <ItemAgravatedMaster player={player} name="health" namePtBr="Vitalidade" />
            <ItemAgravatedMaster player={player} name="willpower" namePtBr="Força de Vontade" />
          </div>
          <div className="flex flex-col sm:flex-row w-full">
            <div className="w-full sm:w-1/2">
              <div className="flex flex-col justify-start">
                <ItemMaster player={player} name="rage" quant={5} namePtBr="Fúria" />
                <ItemMaster player={player} name="harano" quant={5} namePtBr="Harano" />
                <ItemMaster player={player} name="hauglosk" quant={5} namePtBr="Hauglosk" />
              </div>
            </div>
            <div className="w-full sm:w-1/2 h-full sm:px-5 md:px-10">
              { showHauglosk && <HaranoHaugloskMaster type="hauglosk" /> }
              { showHarano && <HaranoHaugloskMaster type="harano" /> }
            </div>
          </div>
          <div className="pt-5 sm:pt-10 pb-5 font-bold text-2xl">Habilidades</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 w-full pb-10">
            <div>
              <ItemSkillMaster player={player} name="athletics" namePtBr="Atletismo" quant={5} />
              <ItemSkillMaster player={player} name="brawl" namePtBr="Briga" quant={5} />
              <ItemSkillMaster player={player} name="craft" namePtBr="Ofícios" quant={5} />
              <ItemSkillMaster player={player} name="driving" namePtBr="Condução" quant={5} />
              <ItemSkillMaster player={player} name="firearms" namePtBr="Armas de Fogo" quant={5} />
              <ItemSkillMaster player={player} name="larceny" namePtBr="Furto" quant={5} />
              <ItemSkillMaster player={player} name="melee" namePtBr="Armas Brancas" quant={5} />
              <ItemSkillMaster player={player} name="stealth" namePtBr="Furtividade" quant={5} />
              <ItemSkillMaster player={player} name="survival" namePtBr="Sobrevivência" quant={5} />
            </div>
            <div className="sm:pl-10">
              <ItemSkillMaster player={player} name="animalKen" namePtBr="Empatia com Animais" quant={5} />
              <ItemSkillMaster player={player} name="etiquette" namePtBr="Etiqueta" quant={5} />
              <ItemSkillMaster player={player} name="insight" namePtBr="Intuição" quant={5} />
              <ItemSkillMaster player={player} name="intimidation" namePtBr="Intimidação" quant={5} />
              <ItemSkillMaster player={player} name="leadership" namePtBr="Liderança" quant={5} />
              <ItemSkillMaster player={player} name="performance" namePtBr="Performace" quant={5} />
              <ItemSkillMaster player={player} name="persuasion" namePtBr="Persuasão" quant={5} />
              <ItemSkillMaster player={player} name="streetwise" namePtBr="Manha" quant={5} />
              <ItemSkillMaster player={player} name="subterfuge" namePtBr="Lábia" quant={5} />
            </div>
            <div className="sm:pl-10">
              <ItemSkillMaster player={player} name="academics" namePtBr="Acadêmicos" quant={5} />
              <ItemSkillMaster player={player} name="awareness" namePtBr="Percepção" quant={5} />
              <ItemSkillMaster player={player} name="finance" namePtBr="Finanças" quant={5} />
              <ItemSkillMaster player={player} name="investigation" namePtBr="Investigação" quant={5} />
              <ItemSkillMaster player={player} name="medicine" namePtBr="Medicina" quant={5} />
              <ItemSkillMaster player={player} name="occult" namePtBr="Ocultismo" quant={5} />
              <ItemSkillMaster player={player} name="politics" namePtBr="Política" quant={5} />
              <ItemSkillMaster player={player} name="science" namePtBr="Ciência" quant={5} />
              <ItemSkillMaster player={player} name="technology" namePtBr="Tecnologia" quant={5} />
            </div>
          </div>
        </div>
      }
    </div>
  );
}