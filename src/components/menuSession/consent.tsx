'use client'
import { useContext, useEffect, useMemo, useState } from "react";
import contexto from "@/context/context";
import consentFormList from "../../data/consentForm.json";
import Image from "next/image";
import { collection, getFirestore, query, where } from "firebase/firestore";
import firebaseConfig from "@/firebase/connection";
import { useCollection } from "react-firebase-hooks/firestore";
import { getConsentsBySessionId } from "@/firebase/consentForm";
import ConsentForm from "@/components/popup/consentForm";

type ConsentTab = "editor" | "summary";

export default function Consent() {
  const [list, setList] = useState(consentFormList);
  const [activeTab, setActiveTab] = useState<ConsentTab>("editor");
  const { session, email, setShowMessage, setConsents } = useContext(contexto);

  const db = getFirestore(firebaseConfig);
  const dataRefConsent = collection(db, "consents");
  const queryDataConsent = query(
    dataRefConsent,
    where("sessionId", "==", session.id),
    where("email", "==", email)
  );
  const [snapshot] = useCollection(queryDataConsent);

  const dataRefConsent2 = collection(db, "consents");
  const queryDataConsent2 = query(dataRefConsent2, where("sessionId", "==", session.id));
  const [snapshot2] = useCollection(queryDataConsent2);

  const getAllConsents = async () => {
    const listOfAllConsents = await getConsentsBySessionId(session.id, setShowMessage);
    if (!listOfAllConsents) return;

    const maxValues: { [key: string]: number } = {};
    listOfAllConsents.forEach((userConsent: any) => {
      userConsent.list.forEach((topic: any) => {
        topic.list.forEach((item: any) => {
          maxValues[item.name] = Math.max(maxValues[item.name] ?? 0, item.value);
        });
      });
    });

    const updatedConsentList = consentFormList.map((topic: any) => ({
      ...topic,
      list: topic.list.map((subTopic: any) => ({
        ...subTopic,
        value: maxValues[subTopic.name],
      })),
    }));

    setList(updatedConsentList);
  };

  useEffect(() => {
    const dataWithId = snapshot?.docs?.[0]?.data() as any;

    if (dataWithId?.list?.length > 0) {
      setConsents(dataWithId.list);
    } else {
      setConsents(consentFormList);
    }

    void getAllConsents();
  }, [snapshot, snapshot2]);

  const sortedList = useMemo(() => {
    return [...list].sort((first: any, second: any) => {
      if (first.nameTopic < second.nameTopic) return -1;
      if (first.nameTopic > second.nameTopic) return 1;
      return 0;
    });
  }, [list]);

  const tabButtonClassName = (tab: ConsentTab) => {
    const baseClassName = "inline-flex items-center justify-center border px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] transition-colors";

    return activeTab === tab
      ? `${baseClassName} border-red-950 bg-red-950 text-white`
      : `${baseClassName} border-white/10 bg-black/40 text-white/75 hover:border-red-900 hover:bg-red-950/30 hover:text-white`;
  };

  return (
    <div className="relative grid h-full min-h-0 w-full min-w-0 grid-rows-[auto_auto_minmax(0,1fr)] overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-red-950/40 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(153,27,27,0.22),transparent_42%)]" />

      <div className="relative border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 text-white">
          <div>
            <h2 className="font-kingthings text-lg sm:text-xl">Ficha De Consentimento</h2>
            <p className="mt-1 font-geist-mono text-[11px] sm:text-xs text-white/75">Defina os limites da crônica, navegando entre a edição completa e o resumo consolidado.</p>
          </div>
        </div>
      </div>

      <div className="relative border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("editor")}
            className={tabButtonClassName("editor")}
          >
            Editor De Consentimento
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("summary")}
            className={tabButtonClassName("summary")}
          >
            Ficha geral
          </button>
        </div>
      </div>

      <div className="relative min-h-0 px-4 py-4 sm:px-6">
        {activeTab === "editor" ? (
          <ConsentForm embedded />
        ) : (
          <div className="principles-scrollbar h-full min-h-0 overflow-y-auto overflow-x-hidden border border-white/10 bg-black/55">
            <div className="border-b border-white/10 px-4 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-kingthings text-lg text-white sm:text-xl">Ficha geral de Consentimento</p>
                  <p className="mt-1 font-geist-mono text-[11px] text-white/75">Maior limite escolhido entre os jogadores</p>
                </div>
              </div>
            </div>
            <div className="space-y-5 p-4">
              {sortedList.map((topic: any, topicIndex: number) => (
                <div key={topicIndex} className="border border-white/10 bg-black/40">
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/80">
                      {topic.nameTopic}
                    </p>
                  </div>

                  <div className="space-y-3 px-4 py-4">
                    {[...topic.list].sort((first: any, second: any) => {
                      if (first.nameTopic < second.nameTopic) return -1;
                      if (first.nameTopic > second.nameTopic) return 1;
                      return 0;
                    }).map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Image
                            src={item.value === 1 ? "/images/logos/circle-filled.png" : "/images/logos/circle.png"}
                            alt="Circulo"
                            className="h-5 w-5 object-contain"
                            width={1200}
                            height={800}
                          />
                          <Image
                            src={item.value === 2 ? "/images/logos/triangle-filled.png" : "/images/logos/triangle.png"}
                            alt="Triangulo"
                            className="h-5 w-5 object-contain"
                            width={1200}
                            height={800}
                          />
                          <Image
                            src={item.value === 3 ? "/images/logos/square-filled.png" : "/images/logos/square.png"}
                            alt="Quadrado"
                            className="h-5 w-5 object-contain"
                            width={1200}
                            height={800}
                          />
                        </div>
                        <p className="font-geist-mono text-[11px] leading-relaxed text-white/85">
                          {item.namePtBr}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}