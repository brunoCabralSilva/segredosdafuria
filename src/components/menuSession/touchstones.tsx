'use client'
import { FaRegEdit } from "react-icons/fa";
import { useContext } from "react";
import contexto from "@/context/context";
import { MdDelete } from "react-icons/md";
import { IoAdd } from "react-icons/io5";

export default function Touchstones() {
  const { dataSheet, setAddTouchstone, setShowDeleteTouchstone } = useContext(contexto);
  const sheetData = dataSheet?.data;
  const touchstones = Array.isArray(sheetData?.touchstones)
    ? [...sheetData.touchstones].sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name))
    : [];
  const actionButtonClass = "sheet-readonly-action inline-flex items-center justify-center border border-red-950 bg-red-950 p-2 font-geist-mono text-[9px] uppercase text-white transition-colors hover:bg-red-900";

  return (
    <section className="visage-card relative mt-2 sm:mt-5 w-full overflow-hidden border border-[#708578]/40 bg-[#090d0e]/95 text-slate-300 shadow-[inset_0_0_80px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between px-6 pb-3 pt-5">
        <div>
          <p className="font-kingthings text-[0.82rem] uppercase tracking-[0.26em] text-red-500/85">Pilares</p>
        </div>
        {touchstones.length < 3 && (
          <button
            type="button"
            onClick={() => setAddTouchstone({ show: true, data: {} })}
            className={actionButtonClass}
            aria-label="Adicionar pilar"
          >
            <IoAdd className="text-lg" />
          </button>
        )}
      </div>
      <div className="mx-6 border-b border-white/10" />
      <div className="px-6 pb-5 pt-3">
        <div className="flex flex-col gap-3">
          {touchstones.length === 0 && (
            <div className="border border-dashed border-white/10 bg-black/55 px-4 py-5 text-center font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/52">
              Nenhum pilar cadastrado.
            </div>
          )}
          {touchstones.map((item: any, index: number) => (
            <article key={index} className="border border-white/10 bg-black/72 px-4 py-3 shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-kingthings text-sm uppercase tracking-[0.08em] text-white">{item.name}</p>
                  <p className="mt-2 whitespace-pre-wrap font-geist-mono text-[10px] leading-5 tracking-[0.05em] text-white/72">{item.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e: any) => {
                      setAddTouchstone({ show: true, data: item });
                      e.stopPropagation();
                    }}
                    className={actionButtonClass}
                    aria-label="Editar pilar"
                  >
                    <FaRegEdit className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={(e: any) => {
                      setShowDeleteTouchstone({ show: true, name: item.name });
                      e.stopPropagation();
                    }}
                    className={actionButtonClass}
                    aria-label="Excluir pilar"
                  >
                    <MdDelete className="text-base" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}