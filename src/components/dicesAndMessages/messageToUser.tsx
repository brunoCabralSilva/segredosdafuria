'use client'
import contexto from '@/context/context';
import { useContext } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';

export default function MessageToUser() {
  const { showMessage, setShowMessage } = useContext(contexto);
  const messageText = typeof showMessage.text === 'string' ? showMessage.text : '';

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="relative w-full max-w-lg overflow-hidden border border-zinc-500 bg-ritual bg-cover text-white shadow-[0_0_24px_rgba(0,0,0,0.45)]">
        <div className="bg-black/80 h-full w-full relative flex min-h-0 flex-col">
          <div className="border-b border-white/10 flex items-center gap-2 w-full justify-end p-1">
            <button
              type="button"
              onClick={() => setShowMessage({ show: false, text: '' })}
              className="flex h-8 w-8 shrink-0 items-center justify-center text-white/75 transition-colors hover:border-red-700 bg-[#7a0000] hover:text-white"
              aria-label="Fechar mensagem"
            >
              <IoIosCloseCircleOutline className="text-2xl" />
            </button>
          </div>

          <div className="principles-scrollbar max-h-[70vh] overflow-y-auto px-3 py-3 sm:px-4">
            <div className="bg-black/45 p-3 sm:p-4 h-[25vh] flex items-center justify-center">
              <p className="whitespace-pre-line font-geist-mono leading-relaxed tracking-[0.08em] text-white/82 text-sm text-center">
                {messageText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}