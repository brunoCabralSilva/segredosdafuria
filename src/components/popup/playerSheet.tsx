'use client'
import { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import contexto from "@/context/context";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import ItemAtr from "../player/itemAtr";
import ItemAgravated from "../player/itemAgravated";
import Item from "../player/item";
import ItemSkill from "../player/itemSkill";

export default function PlayerSheet() {
  const { viewPlayer, setViewPlayer } =  useContext(contexto);

  return(
    <div className="fixed top-0 left-0 w-full h-screen flex flex-col bg-black/70 font-normal p-5 pb-3 z-60">
      <div className="bg-gray-whats-dark border-2 border-white w-full h-full p-5 overflow-y-auto">
        <div className="flex justify-between">
          <p className="text-white font-bold text-2xl py-3 pt-2">Ficha do Personagem</p>
          <button
            type="button"
            className="p-1 right-3 h-10"
            onClick={ () => setViewPlayer({ show: false, data: {} }) }
          >
            <IoIosCloseCircleOutline
              className="text-4xl text-white cursor-pointer"
            />
          </button>
        </div>
        <div className="pt-3 w-full h-full p-5">
          <p className="text-lg pb-3 font-bold text-white">
            { viewPlayer.data.data.name } - { capitalizeFirstLetter(viewPlayer.data.data.auspice) } dos { capitalizeFirstLetter(viewPlayer.data.data.trybe) }
          </p>
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 w-full">
              <div className="w-full">
                <ItemAtr value={viewPlayer.data.data.attributes.strength} name="strength" namePtBr="Força" quant={5} />
                <ItemAtr value={viewPlayer.data.data.attributes.dexterity} name="dexterity" namePtBr="Destreza" quant={5} />
                <ItemAtr value={viewPlayer.data.data.attributes.stamina} name="stamina" namePtBr="Vigor" quant={5} />
              </div>
              <div className="w-full">
                <ItemAtr value={viewPlayer.data.data.attributes.charisma} name="charisma" namePtBr="Carisma" quant={5} />
                <ItemAtr value={viewPlayer.data.data.attributes.manipulation} name="manipulation" namePtBr="Manipulação" quant={5} />
                <ItemAtr value={viewPlayer.data.data.attributes.composure} name="composure" namePtBr="Autocontrole" quant={5} />
              </div>
              <div className="w-full">
                <ItemAtr value={viewPlayer.data.data.attributes.intelligence} name="intelligence" namePtBr="Inteligência" quant={5} />
                <ItemAtr value={viewPlayer.data.data.attributes.wits} name="wits" namePtBr="Raciocínio" quant={5} />
                <ItemAtr value={viewPlayer.data.data.attributes.resolve} name="resolve" namePtBr="Determinação" quant={5} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 w-full">
            <div className="mt-4">
            <ItemAgravated name="health" namePtBr="Vitalidade" />
            </div>
            <ItemAgravated name="willpower" namePtBr="Força de Vontade" />
            <div />
          </div>
          <div className="w-1/2">
            <div className="flex flex-col justify-start">
              <Item name="rage" quant={5} namePtBr="Fúria" />
              <Item name="harano" quant={5} namePtBr="Harano" />
              <Item name="hauglosk" quant={5} namePtBr="Hauglosk" />
            </div>
          </div>
          <div className="pt-10 pb-5 font-bold text-2xl">Habilidades</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 w-full pb-10">
            <div>
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
            <div className="sm:pl-10">
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
            <div className="sm:pl-10">
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
          <div className="pb-5 font-bold text-2xl">Dons</div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {
              viewPlayer.data.data.gifts.map((gift: any, index: number) => (
                <div key={ index } className="border border-white p-5 text-sm">
                  <div className="px-3 pb-3">
                    <p className="font-bold text-center w-full p-3">{ gift.giftPtBr} ({ gift.gift })</p>
                    <hr className="mt-1 pb-5" />
                    {
                      gift.cost !== '' &&
                      <p className="">
                        <span className="pr-1 font-bold">Custo:</span>
                        { gift.cost } (Possíveis Testes de Fúria e gastos de Força de Vontade são feitos automaticamente).
                      </p>
                    }
                    {
                      gift.action !== '' &&
                      <p className="pt-2">
                        <span className="pr-1 font-bold">Ação:</span>
                        { gift.cost}.
                      </p>
                    }
                    {
                      gift.pool !== '' &&
                      <p className="pt-2">
                        <span className="pr-1 font-bold">Parada de Dados:</span>
                        { gift.pool === '' ? 'Nenhuma.' : gift.pool + '.' }
                      </p>
                    }
                    {
                      gift.duration !== '' &&
                      <p className="pt-2">
                        <span className="pr-1 font-bold">Duração:</span>
                        { gift.duration}.
                      </p>
                    }
                    <p className="pt-2">
                      <span className="pr-1 font-bold">Sistema:</span>
                      { gift.systemPtBr}
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="pt-10 pb-5 font-bold text-2xl">Rituais</div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {
              viewPlayer.data.data.rituals.map((ritual: any, index: number) => (
                <div className="border border-white p-5 text-sm">
                  <div className="px-3 pb-3">
                    <p className="font-bold text-center w-full p-3">{ ritual.titlePtBr} ({ ritual.title })</p>
                    <hr className="mt-1 pb-5" />
                    {
                      ritual.pool !== '' &&
                      <p className="pt-2">
                        <span className="pr-1 font-bold">Parada de Dados:</span>
                        { ritual.pool === '' ? 'Nenhuma.' : ritual.pool + '.' }
                      </p>
                    }
                    <p className="pt-2">
                      <span className="pr-1 font-bold">Sistema:</span>
                      { ritual.systemPtBr}
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
          <div>
            { viewPlayer.data.data.advantagesAndFlaws.advantages.length > 0 && <div className="pt-10 pb-5 font-bold text-2xl">Méritos e Backgrounds</div> }
            {
              viewPlayer.data.data.advantagesAndFlaws.advantages.map((advantage: any, index: number) => (
                <div
                  key="index"
                  className="pt-3 text-justify"
                  >
                  <p>{ advantage.name } - { advantage.cost } - { advantage.title }</p>
                  <p>{ advantage.description }</p>
                </div>
              ))
            }
            <div className="pt-10 pb-5 font-bold text-2xl">Defeitos</div>
            {
              viewPlayer.data.data.advantagesAndFlaws.flaws.map((flaws: any, index: number) => (
                <div
                  key="index"
                  className="pt-3 text-justify"
                  >
                  <p>{ flaws.name } - { flaws.cost } - { flaws.title }</p>
                  <p>{ flaws.description }</p>
                </div>
              ))
            }
            { viewPlayer.data.data.advantagesAndFlaws.talens.length > 0 && <div className="pt-10 pb-5 font-bold text-2xl">Talismãs</div> }
            {
              viewPlayer.data.data.advantagesAndFlaws.talens.map((flaws: any, index: number) => (
                <div
                  key="index"
                  className="pt-3 text-justify"
                  >
                  <p>{ flaws.name } - { flaws.description }</p>
                </div>
              ))
            }
            { viewPlayer.data.data.advantagesAndFlaws.loresheets.length > 0 && <div className="pt-10 pb-5 font-bold text-2xl">Loresheets</div> }
            {
              viewPlayer.data.data.advantagesAndFlaws.loresheets.map((flaws: any, index: number) => (
                <div
                  key="index"
                  className="pt-3 text-justify"
                  >
                  <p>{ flaws.name } - { flaws.skill }</p>
                </div>
              ))
            }
          </div>
          <div className="pt-10 pb-5 font-bold text-2xl">História</div>
          <div className="pb-10 text-justify">
            { viewPlayer.data.data.background }
          </div>
        </div>
      </div>
    </div>
  );
}