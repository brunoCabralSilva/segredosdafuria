'use client'
import contexto from "@/context/context";
import { rageCheck } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useEffect, useState } from "react";

export default function ItemMaster(props: any) {
	const { name, quant, namePtBr } = props;
  const [points, setPoints]: any = useState([]);
  const [player, setPlayer]: any = useState({});
	const {
    session,
    players,
    showPlayer,
    setShowMessage,
    setShowHarano,
    setShowHauglosk,
    setShowMenuSession,
  } = useContext(contexto);

  useEffect(() => {
    const playerData: any = players.find((item: any) => item.email === showPlayer.email);
    setPlayer(playerData);
    setPoints(Array(quant).fill(''));
  }, []);

  const updateValue = async (value: number) => {
      if (player.data[name] === 1 && value === 1) player.data[name] = 0;
      else player.data[name] = value;
			await updateDataPlayer(session.id, player.email, player.data, setShowMessage);
  };

  return(
    <div className="w-full mt-4">
      <span className="capitalize">{ namePtBr }</span>
      <div className="flex flex-col items-center lg:flex-row">
        <div className="w-full">
        <div className="flex flex-wrap gap-2 pt-1">
          {
            player.data && points.map((item: any, index: number) => {
              if (player.data[name] >= index + 1) {
                return (
                  <button
                    type="button"
                    onClick={ () => updateValue(index + 1) }
                    key={index}
                    className="h-6 w-6 rounded-full bg-black border-white border-2 cursor-pointer"
                  />
                );
              } return (
                <button
                  type="button"
                  onClick={ () => updateValue(index + 1) }
                  key={index}
                  className="h-6 w-6 rounded-full bg-white border-white border-2 cursor-pointer"
                />
              );
            })
          }
        </div>
        </div>
        {
          namePtBr === 'Fúria' &&
          <button
              className="mt-3 lg:mt-0 bg-white p-1 w-full cursor-pointer capitalize text-center text-black hover:font-bold hover:bg-black hover:text-white rounded border-2 border-black hover:border-white transition-colors duration-600"
              onClick={ async () => {
                const rage = await rageCheck(session.id, player.email, setShowMessage);
                updateValue(rage);
                setShowMenuSession('');
              }}
					>
						Teste de Fúria
					</button>
        }
				{
          namePtBr === 'Harano' &&
          <button
            className="mt-3 lg:mt-0 bg-white p-1 w-full cursor-pointer capitalize text-center text-black hover:font-bold hover:bg-black hover:text-white rounded border-2 border-black hover:border-white transition-colors duration-600"
            onClick={
              async () => {
                setShowHarano(true);
                setShowHauglosk(false);
              }}
					>
						Teste de Harano
					</button>
        }
				{
          namePtBr === 'Hauglosk' &&
          <button
            className="mt-3 lg:mt-0 bg-white p-1 w-full cursor-pointer capitalize text-center text-black hover:font-bold hover:bg-black hover:text-white rounded border-2 border-black hover:border-white transition-colors duration-600"
            onClick={ async () => {
              setShowHarano(false);
              setShowHauglosk(true);
            }}
					>
						Teste de Hauglosk
					</button>
        }
      </div>
    </div>
  );
}