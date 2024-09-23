'use client'
import { useContext, useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import contexto from "@/context/context";
import dataTrybes from '../../data/trybes.json';
import ItemAgravatedMaster from "../master/itemAgravatedMaster";
import ItemAtrMaster from "../master/itemAtrMaster";
import ItemSkillMaster from "../master/itemSkillMaster";
import ItemMaster from "../master/itemMaster";
import HaranoHaugloskMaster from "./haranoHaugloskMaster";
import { updateDataPlayer } from "@/firebase/players";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";

export default function PlayerSheet() {
  const [ player, setPlayer ]: any = useState({});
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState('');
  const {
    showPlayer, setShowPlayer,
    showHauglosk,
    showHarano,
    players,
    session,
    setShowMessage,
  } = useContext(contexto);

  useEffect(() => {
    const playerData = players.find((item: any) => item.email === showPlayer.email);
    setPlayer(playerData);
    setNewName(playerData.data.name)
  }, []);

  const updateValue = async (key: string, value: string) => {
    if (player.data[key] !== value) {
      await updateDataPlayer(session.id, player.email, { ...player.data, [key]: value }, setShowMessage);
      setPlayer({ ...player, data: {  ...player.data, [key]: value }});
    }
  };

  return(
    <div>
    {
      player.data
      ? <div className="fixed top-0 left-0 w-full h-screen flex flex-col bg-black/70 font-normal p-5 sm:p-0 pb-3 z-60 text-white">
        <div className="bg-gray-whats-dark border-2 border-white w-full h-full overflow-y-auto">
          <div className="flex justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 w-full pt-5">
              <div className="text-white font-bold pl-5 ">
                <span className="pr-2">Nome:</span>
                <div className="flex items-center gap-2 mt-2">
                  {
                    edit
                    ? <input 
                        type="text"
                        value={newName}
                        onChange={ (e: any) => {
                          const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                          setNewName(sanitizedValue);
                        }}
                        className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white cursor-pointer"
                      />
                    : <div className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white cursor-pointer">{ newName === '' ? 'Sem Nome definido' : newName }</div>
                  }
                  { 
                    edit
                      ? <BsCheckSquare
                          onClick={(e:any) => {
                            updateValue('name', newName);
                            setEdit(false);
                            e.stopPropagation();
                          }}
                          className="text-3xl cursor-pointer"
                        />
                      : <FaRegEdit
                          onClick={
                            (e:any) => {
                              setEdit(true);
                              setNewName(player.data.name);
                              e.stopPropagation();
                            }}
                          className="text-3xl cursor-pointer"
                        />
                  }
                </div>
              </div>
              <div className="text-white font-bold pl-5">
                <span className="pr-2">Tribo:</span>
                <select
                  className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white mt-2 cursor-pointer"
                  value={ player.data.trybe }
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
              <div className="text-white font-bold pl-5">
                <span className="pr-2">Augúrio:</span>
                <select
                  className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white mt-2 cursor-pointer"
                  value={player.data.auspice}
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
            </div>
            <button
              type="button"
              className="p-1 right-3 h-10"
              onClick={ () => setShowPlayer({ show: false, email: '' }) }
            >
              <IoIosCloseCircleOutline
                className="text-4xl text-white cursor-pointer"
              />
            </button>
          </div>
          <div className="pt-3 w-full h-full sm:px-5 sm:pb-5 p-3">
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-3 w-full">
                <div className="w-full">
                  <ItemAtrMaster value={player.data.attributes.strength} name="strength" namePtBr="Força" quant={5} />
                  <ItemAtrMaster value={player.data.attributes.dexterity} name="dexterity" namePtBr="Destreza" quant={5} />
                  <ItemAtrMaster value={player.data.attributes.stamina} name="stamina" namePtBr="Vigor" quant={5} />
                </div>
                <div className="w-full">
                  <ItemAtrMaster value={player.data.attributes.charisma} name="charisma" namePtBr="Carisma" quant={5} />
                  <ItemAtrMaster value={player.data.attributes.manipulation} name="manipulation" namePtBr="Manipulação" quant={5} />
                  <ItemAtrMaster value={player.data.attributes.composure} name="composure" namePtBr="Autocontrole" quant={5} />
                </div>
                <div className="w-full">
                  <ItemAtrMaster value={player.data.attributes.intelligence} name="intelligence" namePtBr="Inteligência" quant={5} />
                  <ItemAtrMaster value={player.data.attributes.wits} name="wits" namePtBr="Raciocínio" quant={5} />
                  <ItemAtrMaster value={player.data.attributes.resolve} name="resolve" namePtBr="Determinação" quant={5} />
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
            <div className="pb-5 font-bold text-2xl">Dons</div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {
                player.data.gifts.map((gift: any, index: number) => (
                  <div key={ index } className="border border-white p-2 sm:p-5  text-sm">
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
                player.data.rituals.map((ritual: any, index: number) => (
                  <div key={index} className="border border-white p-5 text-sm">
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
              { player.data.advantagesAndFlaws.advantages.length > 0 && <div className="pt-10 pb-5 font-bold text-2xl">Méritos e Backgrounds</div> }
              {
                player.data.advantagesAndFlaws.advantages.map((advantage: any, index: number) => (
                  <div
                    key={ index }
                    className="pt-3 sm:text-justify"
                    >
                    <p>{ advantage.name } - { advantage.cost } - { advantage.title }</p>
                    <p>{ advantage.description }</p>
                  </div>
                ))
              }
              { player.data.advantagesAndFlaws.flaws.length > 0 && <div className="pt-10 pb-5 font-bold text-2xl">Defeitos</div> }
              {
                player.data.advantagesAndFlaws.flaws.map((flaws: any, index: number) => (
                  <div
                    key={ index }
                    className="pt-3 sm:text-justify"
                    >
                    <p>{ flaws.name } - { flaws.cost } - { flaws.title }</p>
                    <p>{ flaws.description }</p>
                  </div>
                ))
              }
              { player.data.advantagesAndFlaws.talens.length > 0 && <div className="pt-10 pb-5 font-bold text-2xl">Talismãs</div> }
              {
                player.data.advantagesAndFlaws.talens.map((flaws: any, index: number) => (
                  <div
                    key={ index }
                    className="pt-3 sm:text-justify"
                    >
                    <p>{ flaws.name } - { flaws.description }</p>
                  </div>
                ))
              }
              { player.data.advantagesAndFlaws.loresheets.length > 0 && <div className="pt-10 pb-5 font-bold text-2xl">Loresheets</div> }
              {
                player.data.advantagesAndFlaws.loresheets.map((flaws: any, index: number) => (
                  <div
                    key={ index }
                    className="pt-3 sm:text-justify"
                    >
                    <p>{ flaws.name } - { flaws.skill }</p>
                  </div>
                ))
              }
            </div>
            { 
              player.data.background !== '' &&
              <div className="pt-10 pb-5 font-bold text-2xl">História</div>
            }
            <div className="pb-10 sm:text-justify">
              { player.data.background }
            </div>
          </div>
        </div>
      </div>
      : <div>Carregando</div>
    }
  </div>
  );
}