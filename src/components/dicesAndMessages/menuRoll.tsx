import contexto from "@/context/context";
import { useContext, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import ManualRoll from "./manualRoll";
import AutomatedRoll from "./automatedRoll";
import { registerHistory } from "@/firebase/history";
import { capitalizeFirstLetter, sheetStructure } from "@/firebase/utilities";

export default function MenuRoll(props: { dataSession: any, id: string, gameMaster: boolean }) {
  const { dataSession, id, gameMaster } = props;
  const {
    setShowMenuSession,
    session,
    sheetId,
    email,
    players,
    setSheetId,
    setOptionSelect,
    dataSheet, setDataSheet,
    setShowMessage,
  } = useContext(contexto);

  const [optionRadio, setOptionRadio] = useState<string>(session.gameMaster === email ? 'manual' : 'automated');

  const isNarrator = dataSession?.gameMaster === email || gameMaster;

  const sessionCharacterOptions = isNarrator
    ? players
    : players.filter((player: any) => player.email === email);

  const clearSessionCharacter = async () => {
    if (!isNarrator || sheetId === '') return;
    setSheetId('');
    setOptionSelect('players');
    setDataSheet(sheetStructure('', '', ''));
    setShowMessage({ show: true, text: 'Nenhum personagem selecionado.' });
    await registerHistory(
      id,
      {
        message: 'O Narrador removeu o personagem selecionado.',
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  };

  const selectSessionCharacter = async (playerId: string) => {
    const selectedPlayer = players.find((player: any) => player.id === playerId);

    if (!selectedPlayer || dataSheet?.id === selectedPlayer.id) {
      return;
    }

    setSheetId(selectedPlayer.id);
    setOptionSelect('general');
    setDataSheet(selectedPlayer);
    setShowMessage({
      show: true,
      text: "Voce selecionou o personagem " + (selectedPlayer.data.name !== "" ? selectedPlayer.data.name : "") + " (" + capitalizeFirstLetter(selectedPlayer.user) + ")",
    });

    await registerHistory(
      id,
      {
        message:
          (isNarrator ? "O Narrador" : capitalizeFirstLetter(selectedPlayer.user)) +
          " selecionou um personagem" +
          (isNarrator ? " de " + capitalizeFirstLetter(selectedPlayer.user) : "") +
          (selectedPlayer.data.name !== "" ? " (" + selectedPlayer.data.name + ")." : "."),
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  };

  const getSessionCharacterLabel = (player: any) => {
    if (player && player.data && player.data.name !== '') {
      return player.data.name + " (" + capitalizeFirstLetter(player.user) + ")";
    }
    return capitalizeFirstLetter(player.user);
  };

  return (
    <div className="relative flex w-full flex-col overflow-hidden border border-zinc-500/30 bg-gradient-to-br from-black via-zinc-950 to-red-950/40 text-white shadow-[0_0_24px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(153,27,27,0.25),transparent_45%)]" />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="border-b border-white/10 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="z-[70] w-full flex gap-2">
            <select
              value={isNarrator && sheetId === '' ? '__none__' : sheetId}
              onChange={(event) => {
                if (event.target.value === '__none__') {
                  clearSessionCharacter();
                  return;
                }

                selectSessionCharacter(event.target.value);
              }}
              className="px-4 py-2 text-center font-geist-mono text-[9px] uppercase tracking-[0.08em] transition-colors sm:text-[10px] bg-black text-white' text-white/70 hover:border-red-700/70 hover:text-white outline-none w-full cursor-pointer border border-white/10"
            >
              {isNarrator && <option value="__none__">Nenhum personagem</option>}
              {!isNarrator && sheetId === '' && <option value=''>Selecione um personagem</option>}
              {sessionCharacterOptions.map((player: any) => (
                <option key={player.id} value={player.id}>
                  {getSessionCharacterLabel(player)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowMenuSession('')}
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-black/40 text-white/75 transition-colors hover:border-red-700 hover:bg-[#7a0000] hover:text-white"
              aria-label="Fechar popup de testes"
            >
              <IoIosCloseCircleOutline className="text-2xl" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setOptionRadio('automated')}
              className={`border px-2 py-2 text-center font-geist-mono text-[9px] uppercase tracking-[0.08em] transition-colors sm:text-[10px] ${optionRadio === 'automated' ? 'border-red-700 bg-[#7a0000] text-white' : 'border-white/10 bg-black/40 text-white/70 hover:border-red-700/70 hover:text-white'}`}
            >
              Checagem automatizada
            </button>
            <button
              type="button"
              onClick={() => setOptionRadio('manual')}
              className={`border px-2 py-2 text-center font-geist-mono text-[9px] uppercase tracking-[0.08em] transition-colors sm:text-[10px] ${optionRadio === 'manual' ? 'border-red-700 bg-[#7a0000] text-white' : 'border-white/10 bg-black/40 text-white/70 hover:border-red-700/70 hover:text-white'}`}
            >
              Checagem manual
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 ">
          <div className="border border-white/10 bg-black/45 p-2.5 sm:p-3">
            {
              optionRadio === 'automated'
                ? <AutomatedRoll />
                : <ManualRoll />
            }
          </div>
        </div>
      </div>
    </div>
  );
}