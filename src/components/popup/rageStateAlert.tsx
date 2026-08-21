'use client'
import contexto from '@/context/context';
import { useContext } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

export default function RageStateAlert() {
  const { showRageAlert, setShowRageAlert } = useContext(contexto);

  return (
    <div
      className="fixed inset-0 z-[190] flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6"
      onClick={() => setShowRageAlert({ show: false, title: '', text: '' })}
    >
      <div
        className="relative flex w-full max-w-xl flex-col overflow-hidden border border-zinc-500/40 bg-zinc-950/85"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/wallpapers/128.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/90" />

        <button
          type="button"
          onClick={() => setShowRageAlert({ show: false, title: '', text: '' })}
          className="absolute right-4 top-4 z-20 text-2xl text-white/70 transition-colors hover:text-red-400"
          aria-label="Fechar aviso de Fúria"
        >
          <AiFillCloseCircle />
        </button>

        <div className="relative z-10 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <h2 className="mt-2 font-kingthings text-xl sm:text-2xl">{showRageAlert.title}</h2>
        </div>

        <div className="relative z-10 px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="principles-scrollbar max-h-[50vh] overflow-y-auto bg-black/35 px-1 py-1">
            <p className="whitespace-pre-line font-geist-mono text-xs leading-6 tracking-[0.08em] text-white/85 sm:text-[13px]">
              {showRageAlert.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}