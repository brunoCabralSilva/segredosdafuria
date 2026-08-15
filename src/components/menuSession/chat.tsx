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
  const messagesContainerId = sidebar ? 'messages-container-sidebar' : 'messages-container';

  const db = getFirestore(firestoreConfig);
  const dataRef = collection(db, "chats");
  const queryData = query(dataRef, where("sessionId", "==", id));
  const [chat] = useCollectionData(queryData, { idField: "id" } as any);

  const messages = useMemo(() => {
    const list = chat && chat[0] && chat[0].list ? [...chat[0].list] : null;
    return list ? list.sort((a: any, b: any) => a.order - b.order) : null;
  }, [chat]);

  useLayoutEffect(() => {
    const messagesContainer: HTMLElement | null = document.getElementById(messagesContainerId);
    if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages, messagesContainerId]);

  return(
    <div className={`flex h-full min-h-0 w-full flex-col relative ${sidebar ? 'border-l border-white/10 bg-black/70' : ''}`}>
      {sidebar && (
        <div className="shrink-0 border-b border-white/10 bg-black/80 px-3 py-2">
          <p className="font-geist-mono text-[0.65rem] uppercase tracking-[0.22em] text-white/75">
            Chat
          </p>
        </div>
      )}
      {
        session &&
        <HpAndWillPower />
      }
      <div id={messagesContainerId} className={`principles-scrollbar relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden [direction:rtl] ${sidebar ? 'px-2 pb-2 pt-2' : 'px-2 pb-0 pt-2 pr-2'}`}>
        <div className="w-full [direction:ltr]">
          {
            messages
            ? messages.map((msg: any, index: number) => {
                if (email !== '' && email === msg.email) {
                  return (<Message key={index} dataMessage={msg} color="green" />);
                }

                return (<Message key={index} dataMessage={msg} color="gray" />);
              })
            : <div className="bg-black/60 text-white flex items-center justify-center flex-col">
                <Loading />
              </div>
          }
        </div>
      </div>
      <div className={`shrink-0 ${sidebar ? 'border-t border-white/10' : ''}`}>
        <SessionBar />
      </div>
    </div>
  )
}

