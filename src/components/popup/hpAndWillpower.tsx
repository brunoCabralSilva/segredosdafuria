'use client'
import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { getAllPlayersBySessionId, updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { FaFire, FaHeart } from "react-icons/fa6";
import { GiFangs } from "react-icons/gi";
import { MdOutlineDoubleArrow } from "react-icons/md";

export default function HpAndWillPower() {
  const [players, setPlayers] = useState<any>([]);
  const [showData, setShowData] = useState(false);
  const { dataSession, session, setShowMessage, email, players: allPlayers, showMenuSession } = useContext(contexto);

  const getPlayers = async () => {
    const allPlayers = await getAllPlayersBySessionId(session.id, setShowMessage);
    if (allPlayers) setPlayers(allPlayers);
  }

  useEffect(() => {
    getPlayers();
  }, [dataSession, session, allPlayers]);

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

  return(
    <div className={`z-30 pl-1 w-50 absolute ${showMenuSession !== '' ? 'top-2' : 'top-12'} right-1 sm:right-6 rounded-xl`}>
        {
          !showData &&
          <MdOutlineDoubleArrow
            className="rotate-180 cursor-pointer bg-black p-1 rounded-full text-3xl border border-white"
            onClick={ () => setShowData(true) }
          />
        }
        {
          showData &&
          players.map((player: any, index: number) => (
            <div
              key={ index }
              className="flex justify-end items-center border border-white p-2 mb-1 bg-black rounded-xl"
            >
              <div className="text-xs flex flex-col items-center justify-center gap-1">
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
                              className="sm:h-3 sm:w-3 h-6 w-6 rounded-full mr-1 mt-1 sm:mt-0 bg-black border-white border cursor-pointer"
                            />
                          );
                        } return (
                          <button
                            type="button"
                            onClick={ () => updateValue(player, 'willpower', index + 1) }
                            key={index}
                            className="sm:h-3 sm:w-3 h-6 w-6 rounded-full mr-1 mt-1 sm:mt-0 bg-gray-500 border-white border cursor-pointer"
                          />
                        );
                      } return (
                          <button
                            type="button"
                            onClick={ () => updateValue(player, 'willpower', index + 1) }
                            key={index}
                            className="sm:h-3 sm:w-3 h-6 w-6 rounded-full mr-1 mt-1 sm:mt-0 bg-white border-white border cursor-pointer"
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
                                className="sm:h-3 sm:w-3 h-6 w-6 rounded-full mr-1 mt-1 sm:mt-0 bg-black border-white border cursor-pointer"
                              />
                            );
                          } return (
                            <button
                              type="button"
                              onClick={ () => updateValue(player, 'health', index + 1) }
                              key={index}
                              className="sm:h-3 sm:w-3 h-6 w-6 rounded-full mr-1 mt-1 sm:mt-0 bg-gray-500 border-white border cursor-pointer"
                            />
                          );
                        } return (
                            <button
                              type="button"
                              onClick={ () => updateValue(player, 'health', index + 1) }
                              key={index}
                              className="sm:h-3 sm:w-3 h-6 w-6 rounded-full mr-1 mt-1 bg-white border-white border cursor-pointer"
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
                            className="sm:h-3 sm:w-3 h-6 w-6 rounded-full bg-black border-white border cursor-pointer mr-1 mt-1 sm:mt-0"
                          />
                        );
                      } return (
                        <button
                          type="button"
                          onClick={ () => updateRageValue(player, index + 1) }
                          key={index}
                          className="sm:h-3 sm:w-3 h-6 w-6 rounded-full bg-white border-white border cursor-pointer mr-1 mt-1 sm:mt-0"
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
              <div className="ml-1 flex flex-col">
                {
                  player.data.profileImage
                  ?
                    <Image
                      src={ player.data.profileImage }
                      alt=""
                      className="w-12 sm:w-10 h-20 sm:h-14 object-cover rounded-lg border-2 border-white mb-1 ml-2 sm:ml-0"
                      width={ 100 }
                      height={ 200 }
                    />
                  : <div className="w-12 sm:w-10 h-20 sm:h-14 border border-white rounded-lg flex items-center justify-center mb-1 ml-2 sm:ml-0">
                      { player.data.name[0] }
                    </div>
                }
              </div>
            </div>
          ))
        }
         {
          showData &&
          <div className="w-full flex justify-end">
            <MdOutlineDoubleArrow
              className="cursor-pointer bg-black p-1 rounded-full text-3xl border border-white"
              onClick={ () => setShowData(false) }
            />
          </div>
        }
    </div>    
  );
}