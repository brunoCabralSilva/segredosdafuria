import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext, useState } from "react";
import { FaFire, FaHeart } from "react-icons/fa6";
import { GiFangs } from "react-icons/gi";
import { IoIosClose } from "react-icons/io";

const aggravatedMarkerClassName =
  "h-6 w-6 sm:h-3 sm:w-3 border border-red-300/70 bg-red-950/30 flex items-center justify-center cursor-pointer mr-1 mt-1 sm:mt-0";
const superficialMarkerClassName =
  "h-6 w-6 sm:h-3 sm:w-3 border border-red-300/70 bg-black/20 flex items-center justify-center cursor-pointer mr-1 mt-1 sm:mt-0";
const emptyMarkerClassName =
  "h-6 w-6 sm:h-3 sm:w-3 border border-zinc-600/70 bg-transparent cursor-pointer mr-1 mt-1 sm:mt-0";
const filledRageMarkerClassName =
  "h-6 w-6 sm:h-3 sm:w-3 border border-red-300/70 bg-red-700/30 shadow-[0_0_10px_rgba(185,28,28,0.18)] cursor-pointer mr-1 mt-1 sm:mt-0";
const emptyRageMarkerClassName =
  "h-6 w-6 sm:h-3 sm:w-3 border border-zinc-700 bg-transparent cursor-pointer mr-1 mt-1 sm:mt-0";

export default function PlayersPopup(props: { player: any }) {
  const [closePopup, setClosePopup] = useState(false);
  const { player } = props;
  const { session, setShowMessage, email } = useContext(contexto);

  const updateValue = async (player: any, name: string, value: number) => {
    const dataPersist = player.data[name].reduce((acc: any, item: any) => {
      item.agravated ? acc.agravated += 1 : acc.letal += 1;
      return acc;
    }, { agravated: 0, letal: 0 });
    const persistMessage = `Dano Agravado(${dataPersist.agravated}) e Dano Letal (${dataPersist.letal})`;

    if (player.data[name].length === 0) {
      player.data[name] = [ { value, agravated: false }];
    } else {
      const itemAgravated = player.data[name].filter((item: any) => item.value === value && item.agravated === true);
      const restOfList = player.data[name].filter((item: any) => item.value !== value);
      if (itemAgravated.length > 0) {
        player.data[name] = restOfList;
      } else {
        const itemLetal = player.data[name].filter((item: any) => item.value === value);
        if (itemLetal.length === 0) {
          player.data[name] = [ ...restOfList, { value, agravated: false }];
        } else player.data[name] = [ ...restOfList, { value, agravated: true }];
      }
    }
    await updateDataPlayer(player.id, player, setShowMessage);
    const newPersist = player.data[name].reduce((acc: any, item: any) => {
      item.agravated ? acc.agravated += 1 : acc.letal += 1;
      return acc;
    }, { agravated: 0, letal: 0 });
    const persistValue = `Dano Agravado(${newPersist.agravated}) e Dano Letal(${newPersist.letal})`;
    let namePtBr = 'Força de Vontade';
    if (name === 'health') namePtBr = 'Vitalidade';
    await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(player.user)} alterou a ${namePtBr} do personagem ${player.data.name}${player.email !== email ? ` do jogador ${capitalizeFirstLetter(player.user)}` : '' } de ${persistMessage} para ${persistValue}.`, type: 'notification' }, null, setShowMessage);
  };

  const returnTotalHealth = (player: any) => {
    var findMaldicaoDaAncia = player.data.advantagesAndFlaws.flaws.find((advantage: { title: string }) => advantage.title == 'Maldição da Anciã');
    var findPeleEspessa = player.data.advantagesAndFlaws.advantages.find((advantage: { title: string }) => advantage.title == 'Pele Espessa');
    if (findMaldicaoDaAncia && findPeleEspessa) {
      return (Number(player.data.attributes.stamina) + 3);
    } else if (findMaldicaoDaAncia) {
      return (Number(player.data.attributes.stamina) + 2);
    } else if (findPeleEspessa) {
      return (Number(player.data.attributes.stamina) + 4);
    } else return (Number(player.data.attributes.stamina) + 3);
  }

  const updateRageValue = async (player: any, value: number) => {
    const dataPersist = player.data.rage;
    if (player.data.rage === 1 && value === 1) player.data.rage = 0;
    else player.data.rage = value;
    await updateDataPlayer(player.id, player, setShowMessage);
    await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(player.user)} alterou a Fúria do personagem ${player.data.name}${player.email !== email ? ` do jogador ${capitalizeFirstLetter(player.user)}` : '' } de ${dataPersist} para ${value}.`, type: 'notification' }, null, setShowMessage);
  };

  const limitTextSmart = (text: string) => {
    const maxLength = 25;
    if (!text) return "";
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace !== -1) return truncated.slice(0, lastSpace);
    return truncated + "...";
  }

  if (!closePopup)
    return(
      <div
        className={`${closePopup ? 'hidden' : 'flex'} justify-end items-center p-2 mb-1 bg-black`}
      >
        <div className="w-full text-xs flex flex-col items-center justify-center gap-1">
        <div className="w-full flex items-center justify-between">
            <IoIosClose
              onClick={ () => setClosePopup(true) }
              className="text-xl cursor-pointer"
            />
            <p className="w-full font-kingthings text-right">{ limitTextSmart(player.data.name) }</p>
        </div>
        <div className="flex items-center justify-end w-full">
            {
            Array(Number(player.data.attributes.composure) + Number(player.data.attributes.resolve)).fill('').map((item, index) => {
                const willpowerMap: number[] = player.data.willpower.map((element: any) => element.value);
                if (willpowerMap.includes(index + 1)) {
                const filterPoint = player.data.willpower.find((ht: any) => ht.value === index + 1 && ht.agravated === true);
                if (filterPoint) {
                    return (
                    <button
                        type="button"
                        onClick={ () => updateValue(player, 'willpower', index + 1) }
                        key={index}
                        className={aggravatedMarkerClassName}
                    >
                      <span className="relative block h-3.5 w-3.5 sm:h-2 sm:w-2">
                        <span className="absolute left-1/2 top-0 h-full w-[2px] sm:w-[1px] -translate-x-1/2 rotate-45 bg-red-300/70" />
                        <span className="absolute left-1/2 top-0 h-full w-[2px] sm:w-[1px] -translate-x-1/2 -rotate-45 bg-red-300/70" />
                      </span>
                    </button>
                    );
                } return (
                    <button
                    type="button"
                    onClick={ () => updateValue(player, 'willpower', index + 1) }
                    key={index}
                    className={superficialMarkerClassName}
                  >
                    <span className="block h-4 w-[2px] sm:h-2 sm:w-[1px] rotate-45 bg-red-300/70" />
                  </button>
                );
                } return (
                    <button
                    type="button"
                    onClick={ () => updateValue(player, 'willpower', index + 1) }
                    key={index}
                    className={emptyMarkerClassName}
                />
                );
            })
            }
            <FaFire
            className="text-blue-400 text-xl sm:text-xs"
            title="Força de Vontade"
            />
        </div>
        <div className="flex items-center justify-end w-full">
            <div className="flex flex-wrap justify-end w-full">
            {
                Array(returnTotalHealth(player)).fill('').map((item, index) => {
                const healthMap: number[] = player.data.health.map((element: any) => element.value);
                if (healthMap.includes(index + 1)) {
                    const filterPoint = player.data.health.find((ht: any) => ht.value === index + 1 && ht.agravated === true);
                    if (filterPoint) {
                    return (
                        <button
                        type="button"
                        onClick={ () => updateValue(player, 'health', index + 1) }
                        key={index}
                        className={aggravatedMarkerClassName}
                      >
                        <span className="relative block h-3.5 w-3.5 sm:h-2 sm:w-2">
                          <span className="absolute left-1/2 top-0 h-full w-[2px] sm:w-[1px] -translate-x-1/2 rotate-45 bg-red-300/70" />
                          <span className="absolute left-1/2 top-0 h-full w-[2px] sm:w-[1px] -translate-x-1/2 -rotate-45 bg-red-300/70" />
                        </span>
                      </button>
                    );
                    } return (
                    <button
                        type="button"
                        onClick={ () => updateValue(player, 'health', index + 1) }
                        key={index}
                        className={superficialMarkerClassName}
                    >
                      <span className="block h-4 w-[2px] sm:h-2 sm:w-[1px] rotate-45 bg-red-300/70" />
                    </button>
                    );
                } return (
                    <button
                        type="button"
                        onClick={ () => updateValue(player, 'health', index + 1) }
                        key={index}
                        className={emptyMarkerClassName}
                    />
                    );
                })
            }
            </div>
            <FaHeart
            className="text-red-700 text-xl sm:text-xs w-5 sm:w-3"
            title="Vitalidade"
            />
        </div>
        <div className="flex items-center justify-end w-full">
            {
            Array(5).fill('').map((item, index) => {
                if (player.data.rage >= index + 1) {
                return (
                    <button
                    type="button"
                    onClick={ () => updateRageValue(player, index + 1) }
                    key={index}
                    className={filledRageMarkerClassName}
                    />
                );
                } return (
                <button
                    type="button"
                    onClick={ () => updateRageValue(player, index + 1) }
                    key={index}
                    className={emptyRageMarkerClassName}
                />
                );
            })
            }
            <GiFangs
            className="text-xl sm:text-xs w-5 sm:w-3"
            title="Fúria"
            />
        </div>
        </div>
      </div>
    )
    return <div />
}
