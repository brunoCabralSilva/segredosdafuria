'use client'
import { FaRegEdit } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import contexto from "@/context/context";
import { MdDelete } from "react-icons/md";
import dataTrybes from '../../data/trybes.json';
import consentFormList from '../../data/consentForm.json';
import Image from "next/image";
import { collection, getFirestore, query, where } from "firebase/firestore";
import firebaseConfig from "@/firebase/connection";
import { useCollection } from "react-firebase-hooks/firestore";
import { getConsentsBySessionId } from "@/firebase/consentForm";

export default function FavorsAndBans() {
  const [favorTrybe, setFavorTrybe] = useState('');
  const [banTrybe, setBanTrybe] = useState('');
  const [list, setList] = useState(consentFormList);
  const {
    setAddFavorAndBan,
    setShowConsentForm,
    setShowDeleteFavorAndBan,
    setShowEvaluateSheet,
    showConsentForm,
    session,
    email,
    dataSheet,
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

  useEffect(() => {
    if (dataSheet && dataSheet.data && dataSheet.data.trybe !== '') {
      const dataTrybe: any = dataTrybes.find((trybe: any) => trybe.nameEn === dataSheet.data.trybe);
      setFavorTrybe(dataTrybe.favor);
      setBanTrybe(dataTrybe.ban)
    } else {
      if (dataSheet && dataSheet.data) {
        setShowMessage({ show: true, text: 'Necessário definir uma Tribo para que possa ser listado o Favor e a Proibição do Patrono Relacionado.'});
      }
    }
  }, []);

  return(
    <div className="flex flex-col w-full h-75vh overflow-y-auto">
      <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold">
      <button
          type="button"
          onClick={() => {
            setShowConsentForm(true);
            setShowEvaluateSheet({ show: false, data: '' });
          }}
          className="text-white bg-black border-2 border-white hover:border-red-800 transition-colors my-1  w-full p-2 font-bold"
        >
          Editar ficha de consentimento
        </button>
        <button
          type="button"
          onClick={() => setAddFavorAndBan({ show: true, data: {}, type: dataSheet.email === email ? 'master': 'player' }) }
          className="text-white bg-black border-2 border-white hover:border-red-800 transition-colors my-1 mb-3  w-full p-2 font-bold"
        >
          Adicionar Novo Favor ou Proibição
        </button>
        <div className="grid grid-cols-1 gap-3 pb-5">
          {
            dataSheet && dataSheet.data &&
            <div className="flex flex-col gap-3">
              <div className="pb-3 border-white border-2 p-4">
                <div className="flex w-full justify-between items-center">
                  <div className="text-white">Favor do Patrono da Tribo</div>
                </div>
                <div className="text-justify pt-2 font-normal">
                  { favorTrybe }
                </div>
              </div>
              <div className="pb-3 border-white border-2 p-4">
                <div className="flex w-full justify-between items-center">
                  <div className="text-white">Proibição do Patrono da Tribo</div>
                </div>
                <div className="text-justify pt-2 font-normal">
                  { banTrybe }
                </div>
              </div>
            </div>
          }
          {
            session.favorsAndBans
              .map((item: any, index: number) => (
                <div key={index} className="pb-3 border-white border-2 p-4">
                  <div className="flex w-full">
                    {
                      (dataSheet.email === email || session.gameMaster === email) &&
                      <div className="flex justify-between items-start w-full">
                        <div className="">
                          { item.description }
                        </div>
                        <div className="flex items-center gap-1">
                          <FaRegEdit
                            onClick={(e: any) => {
                              setAddFavorAndBan({ show: true, data: item, type: 'master' });
                              e.stopPropagation();
                            }}
                            className="text-2xl text-white "
                          />
                          <MdDelete
                            onClick={(e: any) => {
                              setShowDeleteFavorAndBan({ show: true, name: item.order, type: 'master' });
                              e.stopPropagation();
                            }}
                            className="text-2xl text-white "
                          />
                        </div>
                      </div>
                    }
                  </div>
                </div>
              ))
          }
        </div>
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