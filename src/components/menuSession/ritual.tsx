import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function Ritual(props: { ritual: any; index: number; length: number }) {
  const [showRitual, setShowRitual] = useState(false);
  const { ritual } = props;
  const { dataSheet, session, email, sheetId, setShowMessage } = useContext(contexto);

  const registerRitual = async () => {
    const findRitual = dataSheet.data.rituals.find((item: any) => item.titlePtBr === ritual.titlePtBr);

    if (findRitual) {
      dataSheet.data.rituals = dataSheet.data.rituals.filter((item: any) => item.titlePtBr !== ritual.titlePtBr);
    } else {
      dataSheet.data.rituals.push(ritual);
    }

    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} ${findRitual ? ' removeu' : ' adicionou'} o ritual ${ritual.titlePtBr} ${findRitual ? 'do' : 'ao'} personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}.` : '.' }`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  };

  const isSelected = Boolean(dataSheet.data.rituals.find((item: any) => item.titlePtBr === ritual.titlePtBr));

  return (
    <div className={`${isSelected ? 'border-red-600 bg-black/85 shadow-[0_0_0_1px_rgba(248,113,113,0.42),0_0_22px_rgba(127,29,29,0.24)]' : 'border-white/10 bg-black/40'} overflow-hidden border transition-colors`}>
      <button
        type="button"
        onClick={() => setShowRitual(!showRitual)}
        className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-white/5"
      >
        <div className="min-w-0 flex-1">
          <p className="font-kingthings text-[0.86rem] uppercase tracking-[0.18em] text-white">{ritual.titlePtBr}</p>
          <p className="mt-1 font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55">{ritual.title}</p>
          <p className="mt-2 font-geist-mono text-[10px] leading-5 text-white/72">{ritual.type}</p>
        </div>
        <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 bg-black/50 text-white/75">
          {showRitual ? <IoIosArrowUp className="text-lg" /> : <IoIosArrowDown className="text-lg" />}
        </span>
      </button>
      {showRitual && (
        <div className="border-t border-white/10 px-4 py-4">
          <div className="space-y-2.5 font-geist-mono text-[11px] leading-5 text-white/75">
            <div><span className="pr-1 uppercase tracking-[0.08em] text-white">Tipo:</span><span>{ritual.type}.</span></div>
            {ritual.pool !== '' && <div><span className="pr-1 uppercase tracking-[0.08em] text-white">Checagem:</span><span>{ritual.pool}.</span></div>}
            <div className="border-t border-white/10 pt-2"><span className="pr-1 uppercase tracking-[0.08em] text-white">Descrição:</span><span className="whitespace-pre-wrap">{ritual.descriptionPtBr}</span></div>
            {ritual.systemPtBr !== '' && <div><span className="pr-1 uppercase tracking-[0.08em] text-white">Sistema:</span><span className="whitespace-pre-wrap">{ritual.systemPtBr}</span></div>}
          </div>
          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[10px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
            onClick={() => { registerRitual(); }}
          >
            {isSelected ? 'Remover' : 'Adicionar'}
          </button>
        </div>
      )}
    </div>
  );
}
