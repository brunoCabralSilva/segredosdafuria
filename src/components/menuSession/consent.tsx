'use client'
import { useContext, useEffect, useState } from "react";
import contexto from "@/context/context";
import consentFormList from '../../data/consentForm.json';
import Image from "next/image";
import { collection, getFirestore, query, where } from "firebase/firestore";
import firebaseConfig from "@/firebase/connection";
import { useCollection } from "react-firebase-hooks/firestore";
import { getConsentsBySessionId } from "@/firebase/consentForm";

export default function Consent() {
  const [list, setList] = useState(consentFormList);
  const {
    setShowConsentForm,
    setShowEvaluateSheet,
    showConsentForm,
    session,
    email,
    setShowMessage,
    setConsents,
  } =  useContext(contexto);

  const db = getFirestore(firebaseConfig);
  const dataRefConsent = collection(db, "consents");
  const queryDataConsent = query(dataRefConsent, where("sessionId", "==", session.id), where('email', '==', email));
  const [snapshot, loading] = useCollection(queryDataConsent);

  const dataRefConsent2 = collection(db, "consents");
  const queryDataConsent2 = query(dataRefConsent2, where("sessionId", "==", session.id));
  const [snapshot2, loading2] = useCollection(queryDataConsent2);


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
    const updatedConsentList = consentFormList.map((topic: any) => (
      { ...topic, list: topic.list.map((subTopic: any) => ({ ...subTopic, value: maxValues[subTopic.name] })) }
    ));
    setList(updatedConsentList);
  };

  useEffect(() => {
    if (snapshot) {
      const dataWithId: any = snapshot.docs[0].data();
      if (dataWithId.list.length > 0) {
        setConsents(dataWithId.list);
      } else setConsents(consentFormList);
      getAllConsents();
    }
  }, [snapshot2]);

  return(
    <div className="flex flex-col w-full h-75vh overflow-y-auto">
      <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold pr-1">
      <button
          type="button"
          onClick={() => {
            setShowConsentForm(true);
            setShowEvaluateSheet({ show: false, data: '' });
          }}
          className="text-white bg-black border-2 border-white hover:border-red-800 transition-colors my-1 mb-3 w-full p-2 font-bold"
        >
          Editar ficha de consentimento
        </button>
        {
          !showConsentForm &&
          <div>
            <div className="text-justify">Consentimento para a Aventura decidido por todos os jogadores (valores maiores de outros jogadores sobrescrevem valores menores de outros):</div>
            <div className="mt-5">
              {
                list && list.length > 0 && list.sort((item1: any, item2: any) => {
                  if (item1.nameTopic < item2.nameTopic) return -1;
                  if (item1.nameTopic > item2.nameTopic) return 1;
                  return 0;
                })
                .map((item2: any, index2: number) => (
                  <div key={ index2 }>
                    <div className="my-8 sm:my-3 font-bold text-lg">
                      <p className="text-center sm:text-left w-full">{ item2.nameTopic }</p>
                      <hr className="my-3 sm:my-0 w-full" />
                    </div>
                    <div>
                      {
                        item2.list.sort((item3: any, item4: any) => {
                          if (item3.nameTopic < item4.nameTopic) return -1;
                          if (item3.nameTopic > item4.nameTopic) return 1;
                          return 0;
                        })
                        .map((item: any, index: number) => (
                          <div key={ index } className={`grid grid-cols-1 sm:flex gap-1 sm:gap-3 mb-3 items-center ${item.name === 'torture' ? 'pb-5' : ''}`}>
                            <div className="flex gap-3 items-center justify-center sm:justify-start w-full sm:w-1/4">
                              {
                                item.value === 1
                                ? <Image
                                    src={ "/images/logos/circle-filled.png" }
                                    alt="Círculo" className="w-6 h-6 object-contain "
                                    width={ 1200 }
                                    height={ 800 }
                                  />
                                : <Image
                                    src={ "/images/logos/circle.png" } alt="Círculo" 
                                    className="w-6 h-6 object-contain "
                                    width={ 1200 }
                                    height={ 800 }
                                  />
                              }
                              {
                                item.value === 2
                                ? <Image
                                    src={ "/images/logos/triangle-filled.png" }
                                    alt="Círculo"
                                    className="w-6 h-6 object-contain "
                                    width={ 1200 }
                                    height={ 800 }
                                  />
                                :  <Image
                                    src={ "/images/logos/triangle.png" }
                                    alt="Círculo"
                                    className="w-6 h-6 object-contain "
                                    width={ 1200 }
                                    height={ 800 }
                                  />
                              }
                              {
                                item.value === 3
                                ?  <Image
                                    src={ "/images/logos/square-filled.png" }
                                    alt="Círculo"
                                    className="w-6 h-6 object-contain "
                                    width={ 1200 }
                                    height={ 800 }
                                  />
                                :  <Image
                                    src={ "/images/logos/square.png" }
                                    alt="Círculo"
                                    className="w-6 h-6 object-contain "
                                    width={ 1200 }
                                    height={ 800 }
                                  />
                              }
                            </div>
                            <p className="w-full text-center sm:text-left">{ item.namePtBr }</p>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        }
      </div>
    </div>
  );
}