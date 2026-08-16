'use client'
import { useContext, useMemo } from "react";
import contexto from "@/context/context";
import { collection, getFirestore, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firestoreConfig from "../../firebase/connection";

export default function History() {
  const { session } = useContext(contexto);

  const db = getFirestore(firestoreConfig);
  const dataRef = collection(db, "history");
  const queryData = query(dataRef, where("sessionId", "==", session.id));
  const [history] = useCollectionData(queryData, { idField: "id" } as any);

  const historyList = useMemo(() => {
    if (!history || history.length === 0 || !history[0]?.list) return [];

    return [...history[0].list].sort((first: any, second: any) => second.order - first.order);
  }, [history]);

  return (
    <div className="relative grid h-full min-h-0 w-full min-w-0 grid-rows-[auto,minmax(0,1fr)] overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-red-950/40 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(153,27,27,0.22),transparent_42%)]" />

      <div className="relative border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 text-white sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-kingthings text-lg sm:text-xl">Histórico</h2>
            <p className="mt-1 font-geist-mono text-[11px] sm:text-xs text-white/75">Acompanhe os eventos mais recentes da sessão, incluindo notificações e ações importantes da crônica.</p>
          </div>
        </div>
      </div>

      <div className="principles-scrollbar relative min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6">
        {historyList.length === 0 ? (
          <div className="border border-white/15 bg-black/60 px-4 py-6 text-center font-geist-mono text-xs text-white/70">
            Nenhum registro foi encontrado no histórico desta sessão.
          </div>
        ) : (
          <div className="grid grid-cols-1 content-start pb-5 bg-black/70">
            {historyList.map((msg: any, index: number) => (
              <div key={index} className="overflow-hidden ">
                <div className="px-4">
                  <span className="font-geist-mono text-[10px] font-extrabold uppercase tracking-[0.12em] text-red-200/80">
                    {msg.date || "Sem data"} -{' '}
                  </span>
                  <span className="whitespace-pre-wrap font-geist-mono text-[11px] lespanding-relaxed text-white/85">
                    {msg.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}