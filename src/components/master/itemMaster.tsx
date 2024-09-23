'use client'
import contexto from "@/context/context";
import { rageCheck } from "@/firebase/messagesAndRolls";
import { getPlayerByEmail, updateDataPlayer } from "@/firebase/players";
import { useContext } from "react";

export default function ItemMaster(props: any) {
	const { name, quant, namePtBr } = props;
	const {
    session,
    viewPlayer,
    returnDataPlayer,
    setShowMessage,
    setShowHarano,
    setShowHauglosk,
    setShowMenuSession,
  } = useContext(contexto);
  
  const updateValue = async (value: number, show: boolean) => {
    const player: any = await getPlayerByEmail(session.id, viewPlayer.data.email, setShowMessage);
    if (player) {
      if (player.data[name] === 1 && value === 1) player.data[name] = 0;
      else player.data[name] = value;
			await updateDataPlayer(session.id, viewPlayer.data.email, player.data, setShowMessage);
      if (show) returnDataPlayer(viewPlayer.data.email, session.id, null);
      else returnDataPlayer(viewPlayer.data.email, session.id, name);
    } else setShowMessage({ show: true, text: 'Jogador não encontrado! Por favor, atualize a página e tente novamente' });
  };

  const returnPoints = (name: string) => {
    const points = Array(quant).fill('');
    return (
      <div className="flex flex-wrap gap-2 pt-1">
        {
          points.map((item, index) => {
            if (viewPlayer.data.data[name] >= index + 1) {
              return (
                <button
                  type="button"
                  onClick={ () => updateValue(index + 1, true) }
                  key={index}
                  className="h-6 w-6 rounded-full bg-black border-white border-2 cursor-pointer"
                />
              );
            } return (
              <button
                type="button"
                onClick={ () => updateValue(index + 1, true) }
                key={index}
                className="h-6 w-6 rounded-full bg-white border-white border-2 cursor-pointer"
              />
            );
          })
        }
      </div>
    );
  };

  return(
    <div className={ `w-full ${ name === 'rage' || name === 'honor' ? 'mt-8' : 'mt-4' }` }>
      <span className="capitalize">{ namePtBr }</span>
      <div className="flex flex-col items-center lg:flex-row">
        <div className="w-full">
          { returnPoints(name) }
        </div>
        {
          namePtBr === 'Fúria' &&
          <button
              className="mt-3 lg:mt-0 bg-white p-1 w-full cursor-pointer capitalize text-center text-black hover:font-bold hover:bg-black hover:text-white rounded border-2 border-black hover:border-white transition-colors duration-600"
              onClick={ async () => {
                const rage = await rageCheck(session.id, viewPlayer.data.email, setShowMessage);
                updateValue(rage, false);
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