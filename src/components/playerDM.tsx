import { useAppDispatch } from "@/redux/hooks";
import { actionDeletePlayer, actionPopupGift, actionPopupRitual, actionShowAdvantage } from "@/redux/slice";
import Image from "next/image";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoArrowDownCircleSharp, IoArrowUpCircleSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

export default function PlayersDm(props: any) {
  const [show, setShow] = useState(false);
  const { player } = props;
  const dispatch = useAppDispatch();

  const updateOption = (player: any) => {
    dispatch(actionDeletePlayer({show: true, player: player}));
    props.returnValue();
  }

  function capitalizeFirstLetter(str: string): String {
    switch(str) {
      case 'global': return 'Dons Nativos';
      case 'silent striders': return 'Peregrinos Silenciosos';
      case 'black furies': return 'Fúrias Negras';
      case 'silver fangs': return 'Presas de Prata';
      case 'hart wardens': return 'Guarda do Cervo';
      case 'ghost council': return 'Conselho Fantasma';
      case 'galestalkers': return 'Perseguidores da Tempestade';
      case 'glass walkers': return 'Andarilhos do Asfalto';
      case 'bone gnawers': return 'Roedores de Ossos';
      case 'shadow lords': return 'Senhores das Sombras';
      case 'children of gaia': return 'Filhos de Gaia';
      case 'red talons': return 'Garras Vermelhas';
      default: return str.charAt(0).toUpperCase() + str.slice(1);;
    }
  };

  const returnHealth = (player: any) => {
    let hp = 0;
    if (player.data.form === 'Crinos') {
      hp = player.data.attributes.stamina + 7
    } else hp = player.data.attributes.stamina + 3;
    const rest = Array(hp - player.data.health.length).fill('');
    return (
      <div className="pl-5 mt-3 w-full">
        <div className="w-full flex justify-start">
          <span className="font-bold pr-1 text-start w-full pb-2 pt-2">Vitalidade Total: { player.data.form === 'Crinos' ? player.data.attributes.stamina + 7 : player.data.attributes.stamina + 3}</span>
        </div>
        <div className="flex items-center w-full justify-between mb-2">
          <div className="flex w-full flex-wrap gap-1 justify-start">
            { 
              player.data.health.map((heal: any, index: number) => (
                <span key={index} className={`h-6 w-6 rounded-full border-white border-2 ${heal.agravated ? 'bg-black': 'bg-gray-400'}`} />
              ))
            }
            { 
              rest.map((heal: any, index: number) => (
                <span key={index} className="h-6 w-6 rounded-full border-white border-2 bg-white" />
              ))
            }
          </div>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
      </div>
    );
  };

  const returnWillpower = (player: any) => {
    const hp = player.data.attributes.composure + player.data.attributes.resolve;
    const rest = Array(hp - player.data.willpower.length).fill('');
    return (
      <div className="mt-3 w-full pl-5">
        <p className="w-full font-bold pr-1 text-left pb-2 pt-2">Força de Vontade Total: { player.data.attributes.composure + player.data.attributes.resolve }</p>
        <div className="flex items-center w-full justify-between mb-2">
          <div className="flex flex-wrap w-full gap-1 justify-start">
            { 
              player.data.willpower.map((heal: any, index: number) => (
                <span key={index} className={`h-6 w-6 rounded-full border-white border-2 ${heal.agravated ? 'bg-black': 'bg-gray-400'}`} />
              ))
            }
            { 
              rest.map((heal: any, index: number) => (
                <span key={index} className="h-6 w-6 rounded-full border-white border-2 bg-white" />
              ))
            }
          </div>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
      </div>
    );
  };

  const returnSumPoints = (list: any) => {
    let adv = 0;
    let flw = 0;
    let type = "";
    list.forEach((item: any) => {
      if (item.flaw) {
        flw += item.value;
        type = 'flaw';
      } else {
        adv += item.value;
        type = 'adv';
      }
    });
    if (type === 'adv') return adv;
    if (type === 'flaw') return flw;
  }

  return(
    <div className="w-full">
      { !show
      ? <button
          className="border-2 border-white mb-2 p-2 py-3 hover:bg-black transition-colors w-full text-white capitalize relative flex md:justify-center justify-between items-center text-center"
          type="button"
          onClick={() => setShow(true)}
        >
          <span className="w-full">
            {`${player.user} (${player.data.name === '' ? 'Sem nome': player.data.name})`}
          </span>
          <button
            type="button"
            className="md:absolute top-2 right-3"
            onClick={ () => setShow(true) }
          >
            <IoArrowDownCircleSharp className="text-3xl text-white" />
          </button>
        </button>
      :<div className="text-white w-full border-2 border-white flex flex-col items-center justify-center p-3 mb-4">
        <div className="w-full flex items-center justify-between pb-3 sm:pb-0 ">
          <div className="flex justify-start pl-5">
          </div>
          <div className="flex">
            <MdDelete
              className="text-3xl text-white cursor-pointer"
              onClick={ () => updateOption(player) }
            />
            <button
              type="button"
              className="ml-2"
              onClick={ () => setShow(false) }
            >
              <IoArrowUpCircleSharp className="text-3xl text-white" />
            </button>
          </div>
        </div>
        <div className="flex items-center w-full justify-between pl-5 mb-2 mt-5">
          <h1 className="capitalize text-xl text-center">
            {`${player.user}`}
          </h1>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>  
        <div className="flex items-center w-full justify-between pl-5 mb-5">
          <h1 className="capitalize text-xl text-center">
            {`(${player.data.name === '' ? 'Sem nome': player.data.name})`}
          </h1>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
        <div className="flex items-center w-full justify-between pl-5 mb-2">
          <div>
            <span className="font-bold pr-1">Tribo:</span>
            <span className="capitalize">{ player.data.trybe === '' ? 'Indefinida' : player.data.trybe }</span>
          </div>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
        <div className="flex items-center w-full justify-between pl-5">
          <div>
            <span className="font-bold pr-1">Augúrio:</span>
            <span className="capitalize">{ player.data.auspice === '' ? 'Indefinido' : player.data.auspice }</span>
          </div>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
        <div className="flex items-center w-full justify-between pl-5">
          <div className="mt-3">
            <span className="font-bold pr-1">Fúria:</span>
            <span>{ player.data.rage }</span>
          </div>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
        { returnWillpower(player) }
        { returnHealth(player) }
        <div className="mt-3 flex items-center w-full justify-between">
            <div className="flex items-center w-full justify-between pl-5">
              <div>
                <span className="font-bold pr-1">Forma Atual:</span>
                <span className="capitalize">{ player.data.form }</span>
              </div>
            </div>
            <FaEdit className="text-2xl cursor-pointer" />
        </div>
        <div className="mt-3 flex items-center w-full justify-between pl-5">
          <p className="font-bold pr-1 mt-3">Renome</p>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full pl-5 pt-2">
          <p className="text-left">
            Honra: { player.data.honor }
          </p>
          <p className="text-left">
            Glória: { player.data.glory }
          </p>
          <p className="text-left">
            Sabedoria: { player.data.wisdom }
          </p>
        </div>
        <div className="mt-3 flex items-center w-full justify-between pl-5">
          <p className="font-bold pr-1 mt-3">Atributos</p>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full pl-5 pt-2">
          {
            Object.entries(player.data.attributes).map(([chave, valor]: any, index) => (
              <div className="capitalize text-left" key={index}>
                {chave}: {valor}
              </div>
            ))
          }
        </div>
        <div className="mt-3 flex items-center w-full justify-between pl-5">
          <p className="font-bold pr-1 mt-3">Habilidades</p>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full pl-5 mt-2">
          {
            Object.entries(player.data.skills).map(([chave, valor]: any, index) => {
              if (valor.value !== 0)
              return (
                <div className="capitalize text-left w-full" key={index}>
                    {chave}: { valor.value }
                  {valor.specialty === '' ? '' : ` (${valor.specialty} ${valor.value + 1})`}
                </div>
              )
            })
          }
        </div>
        <div className="mt-3 flex items-center w-full justify-between pl-5">
          <p className="font-bold pr-1 w-full text-left mt-3">Dons</p>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
        <div className="flex items-center justify-start flex-wrap w-full gap-1 pl-5">
          { 
            player.data.gifts.length === 0
              ? <p className="text-left">Nenhum</p>
              : player.data.gifts.map((gift: any, index: number) => (
                  <button
                    type="button"
                    className="text-center border border-transparent hover:border-white rounded-full px-2 py-1"
                    key={index}
                    onClick={ () => dispatch(actionPopupGift({ show: true, gift: gift })) }
                  >
                    { gift.giftPtBr }
                  </button>
                ))
          }
        </div>
        <div className="mt-3 flex items-center w-full justify-between pl-5">
          <p className="font-bold pr-1 w-full text-left mt-3">Rituais</p>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
        <div className="flex items-center justify-start flex-wrap w-full gap-1 pl-5">
          { 
            player.data.rituals.length === 0
              ? <p className="text-center">Nenhum</p>
              : player.data.rituals.map((ritual: any, index: number) => (
                  <button
                    className="text-center border border-transparent hover:border-white rounded-full px-2 py-1"
                    key={index}
                    onClick={ () => dispatch(actionPopupRitual({ show: true, ritual: ritual })) }
                  >
                    { ritual.titlePtBr }
                  </button>
                ))
          }
        </div>
        <div>
          <div className="mt-3 flex items-center w-full justify-between pl-5">
            <p className="font-bold pr-1 w-full text-left mt-3">Vantagens</p>
            <FaEdit className="text-2xl cursor-pointer" />
          </div>
          <div className="flex items-center justify-start flex-wrap w-full gap-1 pl-5">
          {
            player.data.advantagesAndFlaws.map((adv: any, index: number) => {
              if (adv.advantages.length > 0) {
                return(
                  <div key={index}>
                    {
                      <button
                        type="button"
                        className="w-full"
                        onClick={ () => dispatch(actionShowAdvantage({ show: true, item: adv })) }
                      >
                        <p className="text-center border border-transparent hover:border-white rounded-full px-2 py-1">{ adv.name }({returnSumPoints(adv.advantages)})</p>
                      </button>
                    }
                  </div>
                );
              } return null;
              }
            )
          }
        </div>
        </div>
        <div className="w-full">
          <div className="mt-3 flex items-center w-full justify-between pl-5">
            <p className="font-bold pr-1 w-full text-left mt-3">Desvantagens</p>
            <FaEdit className="text-2xl cursor-pointer" />
          </div>
          <div className="flex items-center justify-start flex-wrap w-full gap-1 pl-5">
          {
            player.data.advantagesAndFlaws.map((adv: any, index: number) => {
              if (adv.flaws.length > 0) {
                return <div key={index}>
                  {
                    <button
                      type="button"
                      className="w-full"
                      onClick={ () => dispatch(actionShowAdvantage({ show: true, item: adv })) }
                    >
                      <p className="text-center border border-transparent hover:border-white rounded-full px-2 py-1">{ adv.name }({returnSumPoints(adv.flaws)})</p>
                    </button>
                  }
              </div>
              } return null;
              }
            )
          }
          </div>
        </div>
        <div className="mt-3 flex items-center w-full justify-between pl-5">
          <p className="font-bold pr-1 w-full text-left mt-3">Background</p>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
        <p className="w-full text-center mt-1 text-justify px-5">{ player.data.background }</p>
        <p className="mt-3 text-left w-full pl-5 mb-3">
          <span className="font-bold pr-1 w-full text-left">Ficha criada em:</span>
          <span>{ player.creationDate }</span>
        </p>
      </div>
      }
    </div>
  );
}