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
        player.data &&
        <div>
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 w-full">
              <div className="w-full">
                <ItemAtrMaster value={player.data.attributes.strength} name="strength" namePtBr="Força" quant={6} />
                <ItemAtrMaster value={player.data.attributes.dexterity} name="dexterity" namePtBr="Destreza" quant={6} />
                <ItemAtrMaster value={player.data.attributes.stamina} name="stamina" namePtBr="Vigor" quant={6} />
              </div>
              <div className="w-full">
                <ItemAtrMaster value={player.data.attributes.charisma} name="charisma" namePtBr="Carisma" quant={6} />
                <ItemAtrMaster value={player.data.attributes.manipulation} name="manipulation" namePtBr="Manipulação" quant={6} />
                <ItemAtrMaster value={player.data.attributes.composure} name="composure" namePtBr="Autocontrole" quant={6} />
              </div>
              <div className="w-full">
                <ItemAtrMaster value={player.data.attributes.intelligence} name="intelligence" namePtBr="Inteligência" quant={6} />
                <ItemAtrMaster value={player.data.attributes.wits} name="wits" namePtBr="Raciocínio" quant={6} />
                <ItemAtrMaster value={player.data.attributes.resolve} name="resolve" namePtBr="Determinação" quant={6} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 w-full mt-4">
            <ItemMaster value={player.data.honor} name="honor" quant={5} namePtBr="Honra" />
            <ItemMaster value={player.data.glory} name="glory" quant={5} namePtBr="Glória" />
            <ItemMaster value={player.data.wisdom} name="wisdom" quant={5} namePtBr="Sabedoria" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 w-full mt-4">
            <ItemAgravatedMaster name="health" namePtBr="Vitalidade" />
            <ItemAgravatedMaster name="willpower" namePtBr="Força de Vontade" />
          </div>
          <div className="flex flex-col sm:flex-row w-full">
            <div className="w-full sm:w-1/2">
              <div className="flex flex-col justify-start">
                <ItemMaster value={player.data.rage} name="rage" quant={5} namePtBr="Fúria" />
                <ItemMaster value={player.data.harano} name="harano" quant={5} namePtBr="Harano" />
                <ItemMaster value={player.data.hauglosk} name="hauglosk" quant={5} namePtBr="Hauglosk" />
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
              <ItemSkillMaster value={player.data.skills.athletics} name="athletics" namePtBr="Atletismo" quant={5} />
              <ItemSkillMaster value={player.data.skills.brawl} name="brawl" namePtBr="Briga" quant={5} />
              <ItemSkillMaster value={player.data.skills.craft} name="craft" namePtBr="Ofícios" quant={5} />
              <ItemSkillMaster value={player.data.skills.driving} name="driving" namePtBr="Condução" quant={5} />
              <ItemSkillMaster value={player.data.skills.firearms} name="firearms" namePtBr="Armas de Fogo" quant={5} />
              <ItemSkillMaster value={player.data.skills.larceny} name="larceny" namePtBr="Furto" quant={5} />
              <ItemSkillMaster value={player.data.skills.melee} name="melee" namePtBr="Armas Brancas" quant={5} />
              <ItemSkillMaster value={player.data.skills.stealth} name="stealth" namePtBr="Furtividade" quant={5} />
              <ItemSkillMaster value={player.data.skills.survival} name="survival" namePtBr="Sobrevivência" quant={5} />
            </div>
            <div className="sm:pl-10">
              <ItemSkillMaster value={player.data.skills.animalKen} name="animalKen" namePtBr="Empatia com Animais" quant={5} />
              <ItemSkillMaster value={player.data.skills.etiquette} name="etiquette" namePtBr="Etiqueta" quant={5} />
              <ItemSkillMaster value={player.data.skills.insight} name="insight" namePtBr="Intuição" quant={5} />
              <ItemSkillMaster value={player.data.skills.intimidation} name="intimidation" namePtBr="Intimidação" quant={5} />
              <ItemSkillMaster value={player.data.skills.leadership} name="leadership" namePtBr="Liderança" quant={5} />
              <ItemSkillMaster value={player.data.skills.performance} name="performance" namePtBr="Performace" quant={5} />
              <ItemSkillMaster value={player.data.skills.persuasion} name="persuasion" namePtBr="Persuasão" quant={5} />
              <ItemSkillMaster value={player.data.skills.streetwise} name="streetwise" namePtBr="Manha" quant={5} />
              <ItemSkillMaster value={player.data.skills.subterfuge} name="subterfuge" namePtBr="Lábia" quant={5} />
            </div>
            <div className="sm:pl-10">
              <ItemSkillMaster value={player.data.skills.academics} name="academics" namePtBr="Acadêmicos" quant={5} />
              <ItemSkillMaster value={player.data.skills.awareness} name="awareness" namePtBr="Percepção" quant={5} />
              <ItemSkillMaster value={player.data.skills.finance} name="finance" namePtBr="Finanças" quant={5} />
              <ItemSkillMaster value={player.data.skills.investigation} name="investigation" namePtBr="Investigação" quant={5} />
              <ItemSkillMaster value={player.data.skills.medicine} name="medicine" namePtBr="Medicina" quant={5} />
              <ItemSkillMaster value={player.data.skills.occult} name="occult" namePtBr="Ocultismo" quant={5} />
              <ItemSkillMaster value={player.data.skills.politics} name="politics" namePtBr="Política" quant={5} />
              <ItemSkillMaster value={player.data.skills.science} name="science" namePtBr="Ciência" quant={5} />
              <ItemSkillMaster value={player.data.skills.technology} name="technology" namePtBr="Tecnologia" quant={5} />
            </div>
          </div>
        </div>
      }
    </div>
  );
}