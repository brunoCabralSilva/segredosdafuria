'use client'
import { useContext, useEffect } from "react";
import contexto from "@/context/context";
import { collection, getFirestore, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firestoreConfig from '../../firebase/connection';

export default function History() {
	const {
    session,
	} = useContext(contexto);

  const db = getFirestore(firestoreConfig);
  const dataRef = collection(db, "history");
  const queryData = query(dataRef, where("sessionId", "==", session.id));
  const [history] = useCollectionData(queryData, { idField: "id" } as any);

  return(
    <div className="pt-5 w-full h-75vh overflow-y-auto mb-3 p-1 text-white items-start justify-start font-bold bg-black scrollbar">
      {
        history
        && history.length > 0
        && history[0].list
        && history[0].list.length >= 0
        ? history[0]
          && history[0].list
            .sort((a: any, b: any) => b.order - a.order)
            .map((msg: any, index: number) => (
              <div key={ index }className={`w-full flex justify-end text-white`}>
                <div className={`rounded-xl w-full pl-3 text-xs font-normal`}>
                  <div className="">
                    <span className="text-[#dd6b67]">{ msg.date && msg.date }</span> - <span className="">{ msg.message }</span>
                  </div>
                </div>
              </div>		
            ))
        : <div />
      }
    </div>
  );
}