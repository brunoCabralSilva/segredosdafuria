'use client'
import { collection, orderBy, limit, getFirestore, query, serverTimestamp, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import firestoreConfig from '../../firebase/connection';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actionLogin, actionRollDice, useSlice } from '@/redux/slice';
import { useRouter } from 'next/navigation';
import { verify } from '../../firebase/user';
import { jwtDecode } from 'jwt-decode';
import { FaDiceD20 } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { FaFile } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { RxUpdate } from "react-icons/rx";
import { FaAngleDown } from "react-icons/fa6";
import firebaseConfig from '../../firebase/connection';
import Nav from '@/components/nav';
import PopUpDices from '@/components/popUpDices';
import Image from 'next/image';
import Simplify from '@/components/simplify';

export default function Chat() {
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const [text, setText] = useState('');
  const router = useRouter();
  const db = getFirestore(firestoreConfig);
  const messageRef = collection(db, "chatbot");
  const queryMessages = query(messageRef, orderBy("date"), limit(25));
  const [messages] = useCollectionData(queryMessages, { idField: "id" });
  const [showData, setShowData] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setShowData(false);
    dispatch(actionRollDice(false));
    window.scrollTo(0, 0);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken = verify(JSON.parse(token));
        if (decodedToken) {
          setShowData(true);
          const { firstName, lastName, email, role } = jwtDecode(token);
          dispatch(actionLogin({ firstName, lastName, email, role }));
        }
        else {
          setShowData(false);
          dispatch(actionLogin({ firstName: '', lastName: '', email: '', role: '' }));
          router.push('/sessions/login');
        }
      } catch(error) {
        console.log(error);
        dispatch(actionLogin({ firstName: '', lastName: '', email: '', role: '' }));
        // router.push('/sessions/login');
        setShowData(true);
      }
    } else {
        setShowData(false);
        dispatch(actionLogin({ firstName: '', lastName: '', email: '', role: '' }));
        router.push('/sessions/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });

  const typeText = (e) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setText(sanitizedValue);
  };

  const clearMessages = async () => {
    const db = getFirestore(firebaseConfig);
    const messagesRef = collection(db, 'chatbot');
    try {
      const querySnapshot = await getDocs(messagesRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      window.alert('Erro ao remover dados da coleção:', error);
    }
  };

  const sendMessage = async () => {
    const { user } = slice;
    if (text !== '' && text !== ' ') {
      await addDoc(
        messageRef,
        {
          message: text,
          user: user.firstName + ' ' + user.lastName,
          email: user.email,
          date: serverTimestamp(),
        }
      );
      setText('');
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  const messageSet = (msn) => {
    if (typeof msn === 'string') return (<div className="pt-2 px-2 break-all">{ msn }</div>);

    let success = 0;
    let fail = 0;
    let brutal = 0;
    let critical = 0;

    for (let i = 0; i < msn.rollOfRage.length; i += 1) {
      if (Number(Number(msn.rollOfRage[i])) === 10) {
        critical += 1;
      } else if (Number(msn.rollOfRage[i]) > 2 && Number(msn.rollOfRage[i]) < 6) {
        fail += 1;
      } else if (Number(msn.rollOfRage[i]) > 5 && Number(msn.rollOfRage[i]) < 10) {
        success += 1;
      } else {
        brutal += 1;
      }
    }

    for (let i = 0; i < msn.rollOfMargin.length; i += 1) {
      if (Number(msn.rollOfMargin[i]) === 10) {
        critical += 1;
      } else if (Number(msn.rollOfMargin[i]) > 2 && Number(msn.rollOfMargin[i]) < 6) {
        fail += 1;
      } else if (Number(msn.rollOfMargin[i]) > 5 && Number(msn.rollOfMargin[i]) < 10) {
        success += 1;
      } else {
        fail += 1;
      }
    }

    let quantParesBrutais = 0;
    let quantParesCriticals = 0;
    if (brutal % 2 !== 0) {
      brutal -= 1;
    }
    quantParesBrutais = brutal * 2;

    if (critical % 2 !== 0 && critical !== 1) {
      critical -= 1;
    }

    if (critical > 1) {
      quantParesCriticals = critical * 2
    } else {
      quantParesCriticals = critical;
    }

    let totalDeSucessosParaDano = quantParesBrutais + quantParesCriticals + success - Number(msn.dificulty);
    const falhaBrutal = brutal > 1;
    if (totalDeSucessosParaDano === 0) totalDeSucessosParaDano += 1;

    return(
      <div className="p-2">
        <div className="flex gap-1 flex-wrap">
          {
            msn.rollOfRage.sort((a, b) => a - b).map((dice, index) => {
                let imgItem = '';
                if (Number(dice) === 10) {
                  imgItem = 'critical(rage).png';
                } else if (Number(dice) > 2 && Number(dice) < 6) {
                  imgItem = 'falha(rage).png';
                } else if (Number(dice) > 5 && Number(dice) < 10) {
                  imgItem = 'success(rage).png';
                } else {
                  imgItem = 'brutal(rage).png';
                }
                return (
                  <div key={index} className="flex flex-col items-center justify-center">
                    <Image
                      alt={`Dado representando o valor ${dice}`}
                      src={`/images/dices/${imgItem}`}
                      width={500}
                      height={500}
                      className="w-10 sm:w-14"
                    />
                  </div>
                )
              }
            )
          }
          {
            msn.rollOfMargin.sort((a, b) => a - b).map((dice, index) => {
                let imgItem = '';
                if (Number(dice) === 10) {
                  imgItem = 'critical.png';
                } else if (Number(dice) > 2 && Number(dice) < 6) {
                  imgItem = 'falha.png';
                } else if (Number(dice) > 5 && Number(dice) < 10) {
                  imgItem = 'success.png';
                } else {
                  imgItem = 'falha.png';
                }
                return (
                  <div key={index} className="flex flex-col items-center justify-center">
                    <Image
                      alt={`Dado representando o valor ${dice}`}
                      src={`/images/dices/${imgItem}`}
                      width={500}
                      height={500}
                      className="w-10 sm:w-14"
                    />
                  </div>
                )
              }
            )
          }
        </div>
        {/* <div className="py-2 pl-1 font-bold">
          <span>{'( '}</span>
          {
            msn.rollOfRage.sort((a, b) => a - b).map((dice, index) => {
              if(index === msn.rollOfRage.length -1 && msn.rollOfMargin.length === 0) {
                return <span className="md:pl-2" key={index}>{ dice } </span>
              } 
              if(index === msn.rollOfRage.length -1) {
                return <span className="md:pl-2" key={index}>{ dice } <span className="md:pl-2">/</span> </span>
              }
                return <span className="md:pl-2" key={index}>{ dice }, </span>;
            })
          }
          {
            msn.rollOfMargin.sort((a, b) => a - b).map((dice, index) => {
              if(index === msn.rollOfMargin.length -1) {
                return <span className="md:pl-2" key={index}>{ dice } </span>
              } return <span className="md:pl-2" key={index}>{ dice }, </span>;
            })
          }
          <span>{' )'}</span>
        </div> */}
        <div>
          {
            falhaBrutal
            ? <div>
              {
                totalDeSucessosParaDano >= 0
                ? <div className="w-full">
                <div className="font-bold py-2 text-left">
                  { 'Obteve sucesso se a ação foi CAUSAR DANO (Caso contrário, ocorreu uma falha brutal)' }
                </div>
                <div className="flex justify-start items-center">
                    <span className="">{`Sucessos: `}</span>
                    <span className="font-bold px-3">
                      {quantParesBrutais + quantParesCriticals + success}
                    </span>
                </div>
                <div className="flex jufy-start items-center">
                    <span className="">{`Dificuldade: `}</span>
                    <span className="font-bold px-3">
                      {Number(msn.dificulty)}
                    </span>
                  </div>
                  <div className="flex tify-start items-center w-full flex-wrap">
                    <span className="">{`Excedente: `}</span>
                    <span className="font-bold px-3">
                      {Number(totalDeSucessosParaDano) <= 0 ? 'Nenhum' : totalDeSucessosParaDano}
                    </span>
                  </div>
                </div>
                : <div>{`Falhou no teste, pois a dificuldade era ${Number(msn.dificulty)} e número de sucessos foi ${Number(quantParesBrutais + quantParesCriticals + success)}. `} </div>
              }
              </div>
            : totalDeSucessosParaDano >= 0
                ? <div className="w-full">
                  <div className="font-bold py-2">
                    Obteve sucesso no teste!
                  </div>
                  <div className="flex justify-start items-center">
                    <span className="">{`Sucessos: `}</span>
                    <span className="font-bold px-3">
                      {quantParesBrutais + quantParesCriticals + success}
                    </span>
                  </div>
                  <div className="flex justify-start items-center">
                    <span className="">{`Dificuldade: `}</span>
                    <span className="font-bold w-10 px-3">
                      {Number(msn.dificulty)}
                    </span>
                  </div>
                  <div className="flex justify-start items-center w-full flex-wrap">
                    <span className="">{`Excedente: `}</span>
                    <span className="font-bold px-3">
                      {Number(totalDeSucessosParaDano) <= 0 ? 'Nenhum' : totalDeSucessosParaDano}
                    </span>
                  </div>
                </div>
              : <div className="font-bold py-2">{`Falhou no teste, pois a dificuldade era ${Number(msn.dificulty)} e número de sucessos foi ${Number(quantParesBrutais + quantParesCriticals + success)}. `} </div>
          }
        </div>
      </div>
    )
  }

  return (
    showData && (
      <div className="h-screen overflow-y-auto bg-ritual">
        <Nav />
        {/* <Simplify /> */}
        <div className="flex bg-black/80">
          <div className="flex flex-col w-full relative">
            <div id="messages-container" className={`relative h-90vh overflow-y-auto pt-2 px-2`}>
              {
                messages && messages.length > 0
                ? messages && messages.map((msg, index) => {
                      const token = localStorage.getItem('Segredos Da Fúria');
                      const decode = jwtDecode(token);
                      if (token && decode.email === msg.email) {
                        return(
                          <div key={index} className="w-full flex justify-end  text-white">
                            <div  className="rounded-xl w-11/12 sm:w-7/12 md:w-7/12 p-2 bg-green-whats mb-2">
                              <div>
                                { messageSet(msg.message) }
                                </div>
                                <div className="flex justify-end pt-2">
                                  <span className="w-full text-right">
                                    {msg.date && msg.date.toDate().toLocaleString()}
                                  </span>
                                </div>
                            </div>
                          </div>
                        ) 
                      }
                      return (
                        <div key={index} className="rounded-xl w-11/12 sm:w-7/12 md:w-7/12 p-2 bg-gray-whats my-2 text-white">
                          <div className="font-bold mb-2 ml-2 capitalize">
                            {msg.user}
                          </div>
                          { messageSet(msg.message) }
                          <div className="flex justify-end pt-2">
                              <span className="w-full text-right">
                                {msg.date && msg.date.toDate().toLocaleString()}
                              </span>
                          </div>
                        </div>
                      )
                  })
                : <div className="bg-black/60 text-white h-90vh flex items-center justify-center flex-col">
                  <span className="loader z-50" />
                  </div>
              }
            </div>
            <div className={`${slice.showRollDice ? 'absolute' : 'fixed'} bottom-0 w-full bg-black p-2 flex flex-col gap-2 justify-center items-center min-h-10vh`}>
                { showOptions &&
                  <div className="flex items-center justify-end w-full gap-2">
                    <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
                      <button
                        className="p-2"
                        title="Realizar um teste com dados"
                        onClick={() => {
                          dispatch(actionRollDice(true));
                          setShowOptions(false);
                        }}
                      >
                        <FaDiceD20 />
                      </button>
                    </div>
                    <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
                      <button
                        className="p-2"
                        title="Acessar a sua ficha"
                        onClick={() => {
                          setShowOptions(false);
                        }}
                      >
                        <FaFile />
                      </button>
                    </div>
                    <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
                      <button
                        className="p-2"
                        onClick={() => {
                          scrollToBottom();
                          setShowOptions(false);
                        }}
                        title="Ir para a mensagem mais recente"
                      >
                        <RxUpdate />
                      </button>
                    </div>
                    { 
                      slice.user.role === 'admin'&&
                        <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
                          <button
                            className="p-2"
                            title="Apagar o histórico de conversas"
                            onClick={() => {
                              clearMessages();
                              setShowOptions(false);
                            }}
                          >
                            <FaEraser />
                          </button>
                        </div>
                    }
                  </div>
                }
              <div className="flex w-full items-end relative">
                <textarea
                  rows={Math.max(1, Math.ceil(text.length / 40))}
                  className="w-full p-2 text-black"
                  value={text}
                  onChange={(e) => typeText(e)}
                />
                <div className="pl-2 gap-2 flex">
                  <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
                    <button
                      className="p-2"
                      title="Enviar uma mensagem"
                      onClick={sendMessage}
                    >
                      <IoIosSend />
                    </button>
                  </div>
                  <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
                    <button
                      className="p-2"
                      title="Enviar uma mensagem"
                      onClick={() => setShowOptions(!showOptions)}
                    >
                      {showOptions? <FaAngleDown /> : <FaPlus /> }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          { slice.showRollDice && 
            <div className="absolute sm:relative z-50">
              <PopUpDices />
            </div>
          }
        </div>
      </div>
    )
  );
}
