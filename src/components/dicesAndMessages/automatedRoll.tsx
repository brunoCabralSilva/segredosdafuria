import { useContext, useEffect, useState } from "react";
import sheetData from '../../data/sheet.json';
import { FaMinus, FaPlus } from "react-icons/fa";
import contexto from "@/context/context";
import { authenticate } from "@/firebase/authenticate";
import { useRouter } from "next/navigation";
import { registerAutomatedRoll } from "@/firebase/messagesAndRolls";

export default function AutomatedRoll() {
  const [atrSelected, setAtrSelected] = useState<string>('0');
  const [sklSelected, setSklSelected] = useState<string>('0');
  const [renSelected, setRenSelected] = useState<string>('0');
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(0);
  const [playerSelected, setPlayerSelected] = useState<any>('0');
  const { setShowMenuSession, sheetId, sessionId, setShowMessage, dataSheet, setOptionSelect } = useContext(contexto);
  const router = useRouter();

  useEffect(() => { verifyUser() }, []);
  
  const verifyUser = async() => {
    const auth: any = await authenticate(setShowMessage);
    if (auth && auth.email) setPlayerSelected(auth.email);
    else router.push('/login');
  }

  const disabledButton = () => {
    return ((atrSelected === '0' || atrSelected === '1') && (sklSelected === '0' || sklSelected === '1') && (renSelected === '0' || renSelected === '1')) || dificulty <= 0;
  }

  const rollDices = async () => {
    await registerAutomatedRoll(
      sheetId,
      sessionId,
      playerSelected,
      atrSelected,
      sklSelected,
      renSelected,
      penaltyOrBonus,
      dificulty,
      setShowMessage,
    );
    setShowMenuSession('');
  };

  if (sheetId !== '')
  return(
    <div className="flex h-full min-h-0 w-full flex-col items-center overflow-y-auto bg-transparent">
      <label htmlFor="valueOf" className="mb-3 flex w-full flex-col items-center">
        <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">Atributo</p>
          <select
            value={atrSelected}
            onChange={(e: any) => setAtrSelected(e.target.value)}
            className="h-8 w-full cursor-pointer border border-white/10 bg-white px-2 text-xs text-black capitalize font-geist-mono"
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
              sheetData.attributes
                .map((item, index) => (
                <option
                  className="capitalize text-center text-black"
                  key={index}
                  value={item.value}
                >
                  { item.namePtBr } ({ dataSheet.data.attributes[item.value] })
                </option>
              ))
            }
          </select>
      </label>
      <label htmlFor="valueOf" className="mb-3 flex w-full flex-col items-center">
        <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">Habilidade</p>
          <select
            value={sklSelected}
            onChange={(e: any) => setSklSelected(e.target.value)}
            className="h-8 w-full cursor-pointer border border-white/10 bg-white px-2 text-xs text-black capitalize font-geist-mono"
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
              sheetData.skills
                .sort((a, b) => a.namePtBr.localeCompare(b.namePtBr))
                .map((item, index) => (
                  <option
                    className="text-black capitalize text-center"
                    key={index}
                    value={item.value}
                  >
                    { item.namePtBr }
                    ({ dataSheet.data.skills[item.value].value })
                  </option>
                ))
            }
          </select>
      </label>
      <label htmlFor="valueOf" className="mb-3 flex w-full flex-col items-center">
        <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">Renome</p>
          <select
            value={renSelected}
            onChange={(e: any) => setRenSelected(e.target.value)}
            className="h-8 w-full cursor-pointer border border-white/10 bg-white px-2 text-xs text-black capitalize font-geist-mono"
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
              sheetData.renown
                .map((item, index) => (
                <option
                  className="capitalize text-center text-black"
                  key={index}
                  value={item.value}
                >
                  { item.namePtBr } ({ dataSheet.data[item.value] })
                </option>
              ))
            }
          </select>
      </label>
      <label htmlFor="penaltyOrBonus" className="mb-3 flex w-full flex-col items-center">
        <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">Bônus (+) ou Penalidade (-)</p>
        <div className="flex w-full">
          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ penaltyOrBonus === -50 ? 'bg-gray-500 text-black' : 'bg-black/70 text-white'}`}
            onClick={ () => {
              if (penaltyOrBonus > -50) setPenaltyOrBonus(penaltyOrBonus - 1)
            }}
          >
            <FaMinus />
          </button>
          <div
            className="flex h-8 w-full items-center justify-center bg-white px-2 text-center text-[11px] font-semibold text-black"
          >
            <span className="w-full">{ penaltyOrBonus }</span>
          </div>
          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ penaltyOrBonus === 50 ? 'bg-gray-500 text-black' : 'bg-black/70 text-white'}`}
            onClick={ () => {
              if (penaltyOrBonus < 50) setPenaltyOrBonus(penaltyOrBonus + 1)
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <label htmlFor="dificulty" className="mb-3 flex w-full flex-col items-center">
        <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">Dificuldade</p>
        <div className="flex w-full">
          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ dificulty === 0 ? 'bg-gray-500 text-black' : 'bg-black/70 text-white'}`}
            onClick={ () => {
              if (dificulty > 0) setDificulty(dificulty - 1);
            }}
          >
            <FaMinus />
          </button>
          <div
            className="flex h-8 w-full items-center justify-center bg-white px-2 text-center text-[11px] font-semibold text-black"
          >
            <span className="w-full">{ dificulty }</span>
          </div>
          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ dificulty === 15 ? 'bg-gray-500 text-black' : 'bg-black/70 text-white'}`}
            onClick={ () => {
              if (dificulty < 15) setDificulty(dificulty + 1)
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <button
        className={`${disabledButton() ? 'bg-gray-500 text-black': 'bg-black text-white hover:border-red-800' } mt-3 w-full border border-white/20 px-2.5 py-2 font-geist-mono text-[9px] font-bold uppercase tracking-[0.08em] transition-colors`}
        disabled={disabledButton()}
        onClick={ rollDices }
      >
        Rolar dados
      </button>
    </div>
  );
  return(
    <div className="flex h-full min-h-0 w-full flex-col items-center overflow-y-auto bg-transparent">
      <div className="text-center font-geist-mono text-[11px] leading-5 text-white/78">
        <span className="pr-1">Você ainda não selecionou uma Ficha de Personagem para utilizar os Testes Automatizados.</span>
        <span
          onClick={ () => {
            setShowMenuSession('sheet');
            setOptionSelect('players');
          }}
          className="cursor-pointer font-bold text-white underline underline-offset-2 hover:text-red-500"
        >
          Clique aqui
        </span>
        <span className="pl-1">para ser redirecionado à escolha ou criação de personagens!</span>
      </div>
    </div>
  )
}