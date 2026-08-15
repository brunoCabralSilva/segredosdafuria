'use client'
import contexto from "@/context/context";
import { useContext, useState } from "react";
import { capitalizeFirstLetter, getOfficialTimeBrazil, sheetStructure } from "@/firebase/utilities";
import { addNewSheetMandatory } from "@/firebase/players";
import { authenticate } from "@/firebase/authenticate";
import { registerHistory } from "@/firebase/history";

export default function SheetSelector() {
  const { setSheetId, setShowSelectSheet, setDataSheet, players, email, session, setShowMessage } = useContext(contexto);
  const [portraitErrors, setPortraitErrors] = useState<Record<string, boolean>>({});
  const ownedPlayers = players.filter((pl: any) => pl.email === email);
  const hasPlayers = ownedPlayers.length > 0;

  const createSheet = async () => {
    try {
      const dateMessage = await getOfficialTimeBrazil();
      let sheet = { user: '' };
      if (email === session.gameMaster) {
        const auth = await authenticate(setShowMessage);
        if (auth && auth.email && auth.displayName) {
          sheet = sheetStructure(auth.email, auth.displayName, dateMessage);
        }
      } else {
        const auth = await authenticate(setShowMessage);
        if (auth && auth.email && auth.displayName) {
          sheet = sheetStructure(email, auth.displayName, dateMessage);
        }
      }
      const register: string = await addNewSheetMandatory(session.id, sheet, setShowMessage);
      await registerHistory(
        session.id,
        { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(sheet.user)} criou um novo personagem.`, type: 'notification' },
        null,
        setShowMessage,
      );
      if (register) {
        setSheetId(register);
        setDataSheet(sheet);
        setShowMessage({ show: true, text: 'Ficha Criada com sucesso!' });
      }
    } catch (error) {
      setShowMessage({ show: true, text: 'Ocorreu um erro inesperado: ' + error });
    }
  };

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6">
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden border border-zinc-500/40 bg-zinc-950/85">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/wallpapers/128.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/90" />

        <div className="relative z-10 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <h2 className="mt-2 font-kingthings text-xl sm:text-2xl">Selecionar Personagem</h2>
          <p className="mt-2 max-w-xl font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
            {hasPlayers
              ? ''
              : 'Voce ainda nao possui personagens criados para esta sessao. Crie sua primeira ficha para comecar o jogo.'}
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-4 px-5 pb-5 sm:px-8 sm:pb-8">
          {!hasPlayers && (
            <button
              type="button"
              onClick={createSheet}
              className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
            >
              Criar Ficha
            </button>
          )}

          {hasPlayers && (
            <div className="principles-scrollbar max-h-[52vh] overflow-y-auto border border-zinc-500/40 bg-black/55 p-3 sm:p-4">
              <div className="flex flex-col gap-3">
                {
                  ownedPlayers.map((player: any, index: number) => {
                  const portraitUrl = (player?.data?.portraitUrl ?? '').trim();
                  const showPortrait = portraitUrl !== '' && !portraitErrors[player.id];
                  const sheetTraits = [
                    player?.data?.auspice ? capitalizeFirstLetter(player.data.auspice) : '',
                    player?.data?.trybe ? capitalizeFirstLetter(player.data.trybe) : '',
                  ].filter(Boolean);

                  return (
                    <button
                      type="button"
                      key={index}
                      onClick={() => {
                        setSheetId(player.id);
                        setDataSheet(player);
                        setShowSelectSheet(false);
                        setShowMessage({ show: true, text: `Usuário ${player.data.name} selecionado. Seja bem vindo!` });
                      }}
                      className="relative w-full overflow-hidden border border-zinc-500/40 bg-black/70 px-4 py-4 text-left transition-colors hover:border-red-700/70 hover:bg-[#140404]"
                    >
                      <div className="relative">
                        <div className={`relative z-[1] flex flex-col ${showPortrait ? 'pr-[6.75rem] sm:pr-[7.5rem]' : ''}`}>
                          <div className="font-kingthings text-base uppercase tracking-[0.08em] text-white sm:text-lg">
                            {player && player.data && player.data.name !== ''
                              ? player.data.name
                              : capitalizeFirstLetter(player.user)}
                          </div>

                          {sheetTraits.length > 0 && (
                            <div className="mt-1 font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                              {sheetTraits.join(' • ')}
                            </div>
                          )}
                        </div>

                        {showPortrait && (
                          <div className="absolute right-0 top-0 z-10 w-[92px] -rotate-[7deg] border border-zinc-400/20 bg-black p-1 shadow-[0_26px_46px_rgba(0,0,0,0.52)] sm:w-[102px]">
                            <div className="relative overflow-hidden bg-black">
                              <img
                                src={portraitUrl}
                                alt={`Imagem de ${player?.data?.name || 'personagem'}`}
                                className="relative z-10 h-[108px] w-full object-cover sm:h-[118px]"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                onError={() => setPortraitErrors((current) => ({ ...current, [player.id]: true }))}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

