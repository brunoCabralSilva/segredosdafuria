import { useAppDispatch } from "@/redux/hooks";
import { actionDeletePlayer, actionPopupGift, actionPopupRitual, actionShowAdvantage } from "@/redux/slice";
import { useState } from "react";
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

  const returnHealth = (player: any) => {
    let hp = 0;
    if (player.data.form === 'Crinos') {
      hp = player.data.attributes.stamina + 7
    } else hp = player.data.attributes.stamina + 3;
    const rest = Array(hp - player.data.health.length).fill('');
    return (
      <div className="mt-3">
        <div className="w-full flex justify-center">
          <span className="font-bold pr-1 text-center w-full pb-2 pt-2">Vitalidade Total: { player.data.form === 'Crinos' ? player.data.attributes.stamina + 7 : player.data.attributes.stamina + 3}</span>
        </div>
        <div className="flex w-full flex-wrap gap-1 justify-center">
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
      </div>
    );
  };

  const returnWillpower = (player: any) => {
    const hp = player.data.attributes.composure + player.data.attributes.resolve;
    const rest = Array(hp - player.data.willpower.length).fill('');
    return (
      <div className="mt-3">
        <div className="w-full flex justify-center">
          <span className="font-bold pr-1 text-center w-full pb-2 pt-2">Força de Vontade Total: { player.data.attributes.composure + player.data.attributes.resolve }</span>
        </div>
        <div className="flex flex-wrap w-full gap-1 justify-center">
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
      </div>
    );
  };

  const returnSumPoints = (list: any) => {
    let adv = 0;
    let flw = 0;
    let type = "";
    list.forEach((item: any) => {
      console.log(item);
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

  const returnDate = (msg: any) => {
    const data = new Date(msg.date);
    const formatoData = `${`${data.getDate() < 10 ? 0 : ''}${data.getDate()}`}/${`${data.getMonth() < 10 ? 0 : ''}${data.getMonth() + 1}`}/${data.getFullYear()}`;
    const formatoHora = `${data.getHours() === 0 ? 0 : ''}${data.getHours()}:${data.getMinutes() < 10 ? 0: ''}${data.getMinutes()}:${data.getSeconds() < 10 ? 0 : ''}${data.getSeconds()}`;
    return `${formatoHora}, ${formatoData}`;
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
        <div className="w-full flex justify-end pb-3 gap-3">
          <MdDelete
            className="text-3xl text-white cursor-pointer"
            onClick={ () => updateOption(player) }
          />
          <button
            type="button"
            onClick={ () => setShow(false) }
          >
            <IoArrowUpCircleSharp className="text-3xl text-white" />
          </button>
        </div>  
        <h1 className="capitalize text-xl text-center">{`${player.user} (${player.data.name === '' ? 'Sem nome': player.data.name})`}</h1>
        <hr className="w-full my-3" />
        <div>
          <span className="font-bold pr-1">Tribo:</span>
          <span className="capitalize">{ player.data.trybe === '' ? 'Indefinida' : player.data.trybe }</span>
        </div>
        <div>
          <span className="font-bold pr-1">Augúrio:</span>
          <span className="capitalize">{ player.data.auspice === '' ? 'Indefinido' : player.data.auspice }</span>
        </div>
        <div className="mt-3">
          <span className="font-bold pr-1">Fúria:</span>
          <span>{ player.data.rage }</span>
        </div>
        { returnWillpower(player) }
        { returnHealth(player) }
        <div className="mt-3">
          <span className="font-bold pr-1">Forma Atual:</span>
          <span className="capitalize">{ player.data.form }</span>
        </div>
        <p className="font-bold pr-1 mt-3">Renome</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
          <p className="text-center">
            Honra: { player.data.honor }
          </p>
          <p className="text-center">
            Glória: { player.data.glory }
          </p>
          <p className="text-center">
            Sabedoria: { player.data.wisdom }
          </p>
        </div>
        <p className="font-bold pr-1 mt-3">Atributos</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
          {
            Object.entries(player.data.attributes).map(([chave, valor]: any, index) => (
              <div className="capitalize text-center" key={index}>
                {chave}: {valor}
              </div>
            ))
          }
        </div>
        <p className="font-bold pr-1 mt-3">Habilidades</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
          {
            Object.entries(player.data.skills).map(([chave, valor]: any, index) => {
              if (valor.value !== 0)
              return (
                <div className="capitalize text-center w-full flex justify-center" key={index}>
                    {chave}: { valor.value }
                  {valor.specialty === '' ? '' : ` (${valor.specialty} ${valor.value + 1})`}
                </div>
              )
            })
          }
        </div>
        <p className="font-bold pr-1 w-full text-center mt-3">Dons</p>
        <div className="flex items-center justify-center flex-wrap w-full gap-1">
          { 
            player.data.gifts.length === 0
              ? <p className="text-center">Nenhum</p>
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
        <p className="font-bold pr-1 w-full text-center mt-3">Rituais</p>
        <div className="flex items-center justify-center flex-wrap w-full gap-1">
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
          <p className="font-bold pr-1 w-full text-center mt-3">Vantagens</p>
          <div className="flex items-center justify-center flex-wrap w-full gap-1">
          {
            player.data.advantagesAndFlaws.map((adv: any, index: number) => {
              if (adv.advantages.length > 0) {
                return <div key={index}>
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
              } return null;
              }
            )
          }
        </div>
        </div>
        <div>
          <p className="font-bold pr-1 w-full text-center mt-3">Desvantagens</p>
          <div className="flex items-center justify-center flex-wrap w-full gap-1">
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
        <p className="font-bold pr-1 w-full text-center mt-3">Background</p>
        <p className="w-full text-center">{ player.data.background }</p>
        <p className="font-bold pr-1 w-full text-center mt-3">Ficha criada em:</p>
        <p>{ returnDate({ date: player.creationDate } ) }</p>
      </div>
      }
    </div>
  );
}