'use client'
import { ReactNode } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export const specialRollLabelClass = 'w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78';
export const specialRollCounterButtonClass = 'flex h-8 w-8 items-center justify-center border border-white/15 bg-black/70 text-[10px] text-white transition-colors';
export const specialRollDisabledCounterButtonClass = 'bg-gray-500 text-black';
export const specialRollValueClass = 'flex h-8 w-full items-center justify-center bg-white px-2 text-center text-[11px] font-semibold text-black';
export const specialRollSelectClass = 'h-8 w-full cursor-pointer border border-white/10 bg-black/70 px-2 text-center font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white outline-none transition-colors hover:border-red-700/70';
export const specialRollActionButtonClass = 'mt-3 w-full border border-white/20 px-2.5 py-2 font-geist-mono text-[9px] font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer';

export function openChatAfterSpecialRoll(setOptionSelect: (state: string) => void, setShowMenuSession: (state: string) => void) {
  setOptionSelect('chat');

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('session:open-action-result'));
  }
}

export function openSheetAfterSessionAction(setOptionSelect: (state: string) => void, setShowMenuSession: (state: string) => void) {
  setOptionSelect('general');
  setShowMenuSession('sheet');
}

export function SpecialRollFrame(props: {
  title: string,
  description?: string,
  onClose: () => void,
  children: ReactNode,
}) {
  const { title, description, onClose, children } = props;

  return (
    <div className="relative flex max-h-[80vh] w-full flex-col overflow-hidden border border-zinc-700/40 bg-gradient-to-br from-black via-zinc-950 to-[#140000] text-white shadow-[0_0_28px_rgba(0,0,0,0.72)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.22),transparent_42%)]" />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="min-w-0">
            <p className="font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white">
              {title}
            </p>
            {description && (
              <p className="mt-1 font-geist-mono text-[9px] uppercase tracking-[0.08em] text-white/55">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-black/70 text-white/75 transition-colors hover:border-red-700 hover:bg-[#5f0000] hover:text-white"
            aria-label="Fechar popup de teste"
          >
            <IoIosCloseCircleOutline className="text-2xl" />
          </button>
        </div>
        <div className="principles-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 sm:px-4">
          <div className="border border-white/10 bg-black/82 p-2.5 sm:p-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
