'use client'
import { FaRegEdit } from "react-icons/fa";
import { useContext, useMemo } from "react";
import contexto from "@/context/context";
import { MdDelete } from "react-icons/md";

type PrinciplesProps = {
  variant?: "default" | "session";
};

export default function Principles({ variant = "default" }: PrinciplesProps) {
  const { setAddPrinciple, setShowDeletePrinciple, session, email } = useContext(contexto);
  const isSessionVariant = variant === "session";
  const isNarrator = session?.gameMaster === email;
  const principles = useMemo(() => {
    if (!Array.isArray(session?.principles)) return [];

    return [...session.principles].sort((first: any, second: any) => first.order - second.order);
  }, [session?.principles]);

  const rootClassName = isSessionVariant
    ? "relative grid h-full min-h-0 w-full min-w-0 grid-rows-[auto,minmax(0,1fr)] overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-red-950/40 text-white"
    : "relative grid h-full min-h-0 w-full min-w-0 grid-rows-[auto,minmax(0,1fr)] overflow-hidden bg-black/70 text-white";

  const scrollClassName = isSessionVariant
    ? "principles-scrollbar min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6 [direction:rtl]"
    : "principles-scrollbar min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4 [direction:rtl]";

  const headerClassName = isSessionVariant
    ? "border-b border-white/10 px-4 py-4 sm:px-6"
    : "border-b border-white/10 px-4 py-4";

  return (
    <div className={rootClassName}>
      {isSessionVariant && <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(153,27,27,0.22),transparent_42%)]" />}

      <div className={headerClassName}>
        <div className="flex flex-col gap-3 text-white sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-kingthings text-lg sm:text-xl">Princípios</h2>
            <p className="mt-1 font-geist-mono text-[11px] sm:text-xs text-white/75">Defina o tom e os limites morais (possíveis de acontecer) que orientam a alcateia</p>
          </div>

          <button
            type="button"
            onClick={() => setAddPrinciple({ show: true, data: {} })}
            className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900 mr-4"
          >
            Adicionar Princípio
          </button>
        </div>
      </div>

      <div className={scrollClassName}>
        <div className="grid grid-cols-1 content-start gap-3 pb-5 [direction:ltr]">
          {principles.length === 0 ? (
            <div className="border border-white/15 bg-black/60 px-4 py-6 text-center font-geist-mono text-xs text-white/70">
              Nenhum princípio foi cadastrado até o momento
            </div>
          ) : (
            principles.map((item: any, index: number) => {
              const canEdit = item.email === email || isNarrator;
              const canDelete = canEdit || isNarrator;

              return (
                <div key={String(item.order) + "-" + String(index)} className="overflow-hidden border border-zinc-500/30 bg-black/70 flex w-full justify-between">
                  <div className="px-4 py-4">
                    <p className="whitespace-pre-wrap font-geist-mono text-[11px] leading-relaxed text-white/85">
                      {item.description}
                    </p>
                  </div>
                  {(canEdit || canDelete) && (
                    <div className="flex items-center justify-end gap-2 border-b border-white/10 px-4 py-3">
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => setAddPrinciple({ show: true, data: item })}
                          className="inline-flex h-9 w-9 items-center justify-center border border-red-950 bg-red-950 text-white transition-colors hover:bg-red-900"
                          aria-label="Editar princípio"
                        >
                          <FaRegEdit className="text-lg" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => setShowDeletePrinciple({ show: true, description: item.description, order: typeof item.order === "number" ? item.order : null })}
                          className="inline-flex h-9 w-9 items-center justify-center border border-red-950 bg-red-950 text-white transition-colors hover:bg-red-900"
                          aria-label="Apagar princípio"
                        >
                          <MdDelete className="text-lg" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}