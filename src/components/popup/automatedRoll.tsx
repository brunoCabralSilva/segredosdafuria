import { useContext, useEffect, useState } from "react";
import dataSheet from '../../data/sheet.json';
import { FaMinus, FaPlus } from "react-icons/fa";
import contexto from "@/context/context";
import { authenticate } from "@/firebase/authenticate";
import { useRouter } from "next/navigation";
import { registerAutomatedRoll } from "@/firebase/messagesAndRolls";
import { getPlayerByEmail } from "@/firebase/players";
import { playerSheet } from "@/firebase/utilities";

export default function AutomatedRoll(props: { gameMaster: boolean }) {
  const { gameMaster } = props;
  const [atrSelected, setAtrSelected] = useState<string>('0');
  const [sklSelected, setSklSelected] = useState<string>('0');
  const [renSelected, setRenSelected] = useState<string>('0');
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(0);
  const [players, setPlayers] = useState([]);
  const [dataUser, setDataUser] = useState<any>(playerSheet);
  const [playerSelected, setPlayerSelected] = useState<any>('0');
  const { setShowMenuSession, sessionId } = useContext(contexto);
  const router = useRouter();

  useEffect(() => {
    if (!gameMaster) verifyUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  
  const verifyUser = async() => {
    const auth: any = await authenticate();
    if (auth && auth.email) {
      setPlayerSelected(auth.email);
      const data = await getPlayerByEmail(sessionId, auth.email);
      setDataUser(data.data);
    }
    else router.push('/login');
  }

  const disabledButton = () => {
    return ((atrSelected === '0' || atrSelected === '1') && (sklSelected === '0' || sklSelected === '1') && (renSelected === '0' || renSelected === '1')) || dificulty <= 0;
  }

  const rollDices = async () => {
    await registerAutomatedRoll(
      sessionId,
      playerSelected,
      atrSelected,
      sklSelected,
      renSelected,
      penaltyOrBonus,
      dificulty,
    );
    setShowMenuSession('');
  };

  return(
    <div className="w-full bg-black flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto">
      {
        gameMaster &&
        <label htmlFor="valueOf" className="mb-4 flex flex-col items-center w-full">
          <select
            onChange={(e: any) => {
              setPlayerSelected(e.target.value);
            }}
            value={playerSelected}
            className="w-full py-3 text-black capitalize cursor-pointer"
          >
            <option
              className="capitalize text-center text-black"
              value="0"
              disabled
            >
              Escolha um Jogador
            </option>
            {
              players.map((player: any, index: number) => (
                <option
                  className="capitalize text-center text-black"
                  key={index}
                  value={player.email}
                >
                  { player.user } ({ player.data.name })
                </option>
              ))
            }
          </select>
        </label>
      }
      <label htmlFor="valueOf" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Atributo</p>
          <select
            value={atrSelected}
            onChange={(e: any) => setAtrSelected(e.target.value)}
            className="w-full py-3 text-black capitalize cursor-pointer"
          >
            <option
              className="capitalize text-center text-black"
              value="0"
              disabled
            >
              Escolha um atributo
            </option>
            <option
              className="text-black capitalize text-center"
              value="1"
            >
              Nenhum
            </option>
            {
              dataSheet.attributes
                .map((item, index) => (
                <option
                  className="capitalize text-center text-black"
                  key={index}
                  value={item.value}
                >
                  { item.namePtBr } ({ dataUser.attributes[item.value] })
                </option>
              ))
            }
          </select>
      </label>
      <label htmlFor="valueOf" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Habilidade</p>
          <select
            value={sklSelected}
            onChange={(e: any) => setSklSelected(e.target.value)}
            className="w-full py-3 capitalize cursor-pointer text-black"
          > 
            <option
              className="capitalize text-center text-black"
              value="0"
              disabled
            >
              Escolha uma Habilidade
            </option>
            <option
              className="text-black capitalize text-center"
              value="1"
            >
              Nenhuma
            </option>
            {
              dataSheet.skills
                .sort((a, b) => a.namePtBr.localeCompare(b.namePtBr))
                .map((item, index) => (
                  <option
                    className="text-black capitalize text-center"
                    key={index}
                    value={item.value}
                  >
                    { item.namePtBr }
                    ({ dataUser.skills[item.value].value })
                    {/* {
                      dataUser.skills[item.value].specialty !== ''
                      && dataUser.skills[item.value].specialty !== ' '
                      ? <p> +1 em Especialização </p>
                      : ''
                    } */}
                  </option>
                ))
            }
          </select>
      </label>
      <label htmlFor="valueOf" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Renome</p>
          <select
            value={renSelected}
            onChange={(e: any) => setRenSelected(e.target.value)}
            className="w-full py-3 capitalize cursor-pointer text-black"
          >
            <option
              value="0"
              className="capitalize text-center text-black"
              disabled
            >
              Escolha um Renome
            </option>
            <option
              className="text-black capitalize text-center"
              value="1"
            >
              Nenhum
            </option>
            {
              dataSheet.renown
                .map((item, index) => (
                <option
                  className="capitalize text-center text-black"
                  key={index}
                  value={item.value}
                >
                  { item.namePtBr } ({ dataUser[item.value] })
                </option>
              ))
            }
          </select>
      </label>
      <label htmlFor="penaltyOrBonus" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Bônus (+) ou Penalidade (-)</p>
        <div className="flex w-full">
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ penaltyOrBonus === -50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (penaltyOrBonus > -50) setPenaltyOrBonus(penaltyOrBonus - 1)
            }}
          >
            <FaMinus />
          </button>
          <div
            className="p-2 text-center text-black w-full bg-white"
          >
            <span className="w-full">{ penaltyOrBonus }</span>
          </div>
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ penaltyOrBonus === 50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (penaltyOrBonus < 50) setPenaltyOrBonus(penaltyOrBonus + 1)
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Dificuldade</p>
        <div className="flex w-full">
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ dificulty === 0 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (dificulty > 0) setDificulty(dificulty - 1);
            }}
          >
            <FaMinus />
          </button>
          <div
            className="p-2 text-center text-black w-full bg-white"
          >
            <span className="w-full">{ dificulty }</span>
          </div>
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ dificulty === 15 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (dificulty < 15) setDificulty(dificulty + 1)
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <button
        className={`${disabledButton() ? 'text-black bg-gray-400 hover:bg-gray-600 hover:text-white transition-colors': 'text-white bg-black hover:border-red-800 transition-colors cursor-pointer' } border-2 border-white w-full p-2 mt-6 font-bold`}
        disabled={disabledButton()}
        onClick={ rollDices }
      >
        Rolar dados
      </button>
    </div>
  );
}