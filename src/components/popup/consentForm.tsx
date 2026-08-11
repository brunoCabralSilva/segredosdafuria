'use client'
import contexto from "@/context/context";
import Image from "next/image";
import { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { updateConsentList } from "@/firebase/consentForm";

type ConsentFormProps = {
  embedded?: boolean;
};

export default function ConsentForm({ embedded = false }: ConsentFormProps) {
  const { setShowMessage, session, email, setShowConsentForm, setConsents, consents } = useContext(contexto);

  const updateValue = async (name: string, value: number) => {
    const dataConsents = [...consents];
    const newConsents = dataConsents.map((topic: any) => ({
      ...topic,
      list: topic.list.map((item: any) =>
        item.name === name ? { ...item, value } : item
      )
    }));

    setConsents(newConsents);
    await updateConsentList(email, session.id, newConsents, setShowMessage);
  };

  const shellClassName = embedded
    ? "relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden border border-white/10 bg-black/55"
    : "z-80 fixed left-0 top-0 flex h-screen w-full flex-col items-center justify-center border-2 border-white bg-black/80 px-3 sm:px-0";

  const cardClassName = embedded
    ? "relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden"
    : "relative flex h-full w-full flex-col overflow-hidden bg-black sm:w-2/3 md:w-1/2";

  const bodyClassName = embedded
    ? "principles-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6"
    : "principles-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 sm:px-10";

  return (
    <div className={shellClassName}>
      <div className={cardClassName}>
        <div className="border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-kingthings text-lg text-white sm:text-xl">Editor De Consentimento</p>
              <p className="mt-1 font-geist-mono text-[11px] text-white/75">Marque o seu nível de conforto para cada tema da crônica</p>
            </div>
          </div>
        </div>

        <div className={bodyClassName}>
          <div className="border border-white/10 bg-black/35 px-4 py-4">
            <p className="font-geist-mono text-[11px] leading-relaxed text-white/85">
              Marque a cor que melhor representa seu nível de conforto com o seguinte plot ou elemento de história:
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="border border-white/10 bg-black/40 px-3 py-3">
                <div className="flex items-center gap-2">
                  <Image src="/images/logos/circle-filled.png" alt="Circulo" className="h-5 w-5 object-contain" width={1200} height={800} />
                  <span className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-blue-300">Azul</span>
                </div>
                <p className="mt-2 font-geist-mono text-[11px] leading-relaxed text-white/80">Consentimento entusiasmado; manda ver.</p>
              </div>

              <div className="border border-white/10 bg-black/40 px-3 py-3">
                <div className="flex items-center gap-2">
                  <Image src="/images/logos/triangle-filled.png" alt="Triangulo" className="h-5 w-5 object-contain" width={1200} height={800} />
                  <span className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange-300">Laranja</span>
                </div>
                <p className="mt-2 font-geist-mono text-[11px] leading-relaxed text-white/80">Ok se velado ou fora de cena; pode exigir conversa prévia.</p>
              </div>

              <div className="border border-white/10 bg-black/40 px-3 py-3">
                <div className="flex items-center gap-2">
                  <Image src="/images/logos/square-filled.png" alt="Quadrado" className="h-5 w-5 object-contain" width={1200} height={800} />
                  <span className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-red-400">Vermelho</span>
                </div>
                <p className="mt-2 font-geist-mono text-[11px] leading-relaxed text-white/80">De jeito nenhum; não incluir.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-5">
            {consents && consents.length > 0 && [...consents].sort((first: any, second: any) => {
              if (first.nameTopic < second.nameTopic) return -1;
              if (first.nameTopic > second.nameTopic) return 1;
              return 0;
            }).map((topic: any, topicIndex: number) => (
              <div key={topicIndex} className="border border-white/10 bg-black/40">
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/85">
                    {topic.nameTopic}
                  </p>
                </div>

                <div className="space-y-3 px-4 py-4">
                  {[...topic.list].sort((first: any, second: any) => {
                    if (first.nameTopic < second.nameTopic) return -1;
                    if (first.nameTopic > second.nameTopic) return 1;
                    return 0;
                  }).map((item: any, itemIndex: number) => (
                    <div key={itemIndex} className="grid gap-3 border border-white/10 bg-black/35 px-3 py-3 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
                      <div className="flex items-center justify-center gap-3 md:justify-start">
                        <Image
                          onClick={() => updateValue(item.name, item.value === 1 ? 0 : 1)}
                          src={item.value === 1 ? "/images/logos/circle-filled.png" : "/images/logos/circle.png"}
                          alt="Circulo"
                          className="h-6 w-6 cursor-pointer object-contain"
                          width={1200}
                          height={800}
                        />
                        <Image
                          onClick={() => updateValue(item.name, item.value === 2 ? 0 : 2)}
                          src={item.value === 2 ? "/images/logos/triangle-filled.png" : "/images/logos/triangle.png"}
                          alt="Triangulo"
                          className="h-6 w-6 cursor-pointer object-contain"
                          width={1200}
                          height={800}
                        />
                        <Image
                          onClick={() => updateValue(item.name, item.value === 3 ? 0 : 3)}
                          src={item.value === 3 ? "/images/logos/square-filled.png" : "/images/logos/square.png"}
                          alt="Quadrado"
                          className="h-6 w-6 cursor-pointer object-contain"
                          width={1200}
                          height={800}
                        />
                      </div>

                      <p className="text-center font-geist-mono text-[11px] leading-relaxed text-white/85 md:text-left">
                        {item.namePtBr}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}