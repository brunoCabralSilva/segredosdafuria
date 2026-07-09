'use client'
import Message from "@/components/dicesAndMessages/message";
import Loading from "@/components/loading";
import HpAndWillPower from "@/components/popup/hpAndWillpower";
import SessionBar from "@/components/sessionBar";
import contexto from "@/context/context";
import firestoreConfig from "@/firebase/connection";
import { collection, getFirestore, query, where } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useContext, useLayoutEffect, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Chat(props: { sidebar?: boolean }) {
  const { sidebar = false } = props;
  const params = useParams();
  const id = params?.id as string;
  const { email, session } = useContext(contexto);

  const db = getFirestore(firestoreConfig);
  const dataRef = collection(db, "chats");
  const queryData = query(dataRef, where("sessionId", "==", id));
  const [chat] = useCollectionData(queryData, { idField: "id" } as any);

  const messages = useMemo(() => {
    const list = chat && chat[0] && chat[0].list ? [...chat[0].list] : null;
    return list ? list.sort((a: any, b: any) => a.order - b.order) : null;
  }, [chat]);

  useLayoutEffect(() => {
    const messagesContainer: HTMLElement | null = document.getElementById('messages-container');
    if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages]);

  return(
    <div className="flex flex-col w-full relative">
      {
        session && session.gameMaster == email &&
        <HpAndWillPower />
      }
      <div id="messages-container" className={`relative ${sidebar ? 'h-[79vh] pb-[11vh]' : 'h-90vh'} overflow-y-auto pt-2 px-2`}>
        {
          messages
          ? messages.map((msg: any, index: number) => {
              if (email !== '' && email === msg.email) {
                return (<Message key={index} dataMessage={msg} color="green" />);
              }

              return (<Message key={index} dataMessage={msg} color="gray" />);
            })
          : <div className={`bg-black/60 text-white ${sidebar ? 'h-80vh' : 'h-90vh'} flex items-center justify-center flex-col`}>
              <Loading />
            </div>
        }
      </div>
      <SessionBar />
    </div>
  )
}
