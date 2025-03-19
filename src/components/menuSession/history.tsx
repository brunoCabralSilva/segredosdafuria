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
    <div className="flex flex-col w-full pr-2 h-75vh overflow-y-auto mb-3 p-1 text-white items-start justify-start font-bold px-4">
      {
        history
        && history.length > 0
        && history[0].list
        && history[0].list.length >= 0
        ? history[0]
          && history[0].list
            .sort((a: any, b: any) => a.order - b.order)
            .map((msg: any, index: number) => (
              <div key={ index }className={`w-full flex justify-end text-white`}>
                <div className={`bg-green-whats rounded-xl w-11/12 p-2 mb-2 pl-3 text-sm font-normal`}>
                  <div className="pl-1">{ msg.message }</div>
                  <div className="flex justify-end pt-2">
                    <span className="w-full text-right flex justify-end">
                      { msg.date && msg.date }
                    </span>
                  </div>
                </div>
              </div>		
            ))
        : <div />
      }
    </div>
  );
}