'use client'
import contexto from '@/context/context';
import { updateStatusSession } from '@/firebase/sessions';
import { useContext } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';

export default function EndSession() {
  const { setShowEndSession, session, email, setShowMessage } = useContext(contexto);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6">
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden border border-zinc-500/40 bg-zinc-950/85">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/wallpapers/128.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/90" />

        <button
          type="button"
          onClick={() => setShowEndSession(false)}
          className="absolute right-4 top-4 z-20 text-4xl text-white/70 transition-colors hover:text-red-400"
          aria-label="Fechar finalizar sessao"
        >
          <IoIosCloseCircleOutline />
        </button>

        <div className="relative z-10 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <h2 className="mt-2 font-kingthings text-2xl sm:text-3xl">Finalizar Sessão</h2>
          <p className="mt-2 max-w-xl font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
            Confirme esta ação para mover a sessão para a lista de sessões finalizadas.
          </p>
        </div>

        <div className="relative z-10 px-5 pb-5 sm:px-8 sm:pb-6">
          <div className="bg-black/70">
            {session.gameMaster === email ? (
              <p className="font-geist-mono text-xs leading-6 text-white/78 sm:text-[13px]">
                Ao finalizar esta sessão, ela será removida da lista exibida na página de sessões nas quais você atua como Narrador ou Jogador e será movida para a lista de Sessões Finalizadas. Caso deseje, você poderá reativá-la a qualquer momento.
              </p>
            ) : (
              <p className="font-geist-mono text-xs leading-6 text-white/78 sm:text-[13px]">
                Você tem certeza que de fato quer fazer isto?
              </p>
            )}
          </div>

          <div className="mt-5 flex w-full gap-3">
            <button
              type="button"
              onClick={() => setShowEndSession(false)}
              className="inline-flex w-full items-center justify-center border border-zinc-500/40 bg-black/70 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:border-red-900 hover:bg-black/85"
            >
              Não
            </button>
            <button
              type="button"
              onClick={async () => {
                await updateStatusSession(session.id, 'Finalizada', setShowMessage);
                setShowEndSession(false);
              }}
              className="inline-flex w-full items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
            >
              Sim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}