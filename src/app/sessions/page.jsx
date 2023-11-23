'use client'
import { collection, orderBy, limit, getFirestore, query, serverTimestamp, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import firestoreConfig from '../../firebase/connection';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';
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
    if (typeof msn === 'string') return (<div>{ msn }</div>);

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

    console.log('falhas ', fail, ', sucessos ', success, ' brutais ', brutal, ' critical ', critical);

    let quantParesBrutais = 0;
    let quantParesCriticals = 0;
    if (brutal % 2 !== 0) {
      brutal -= 1;
    }
    quantParesBrutais = brutal * 2;

    console.log('falhas brutais ', quantParesBrutais);

    if (critical % 2 !== 0 && critical !== 1) {
      critical -= 1;
    }

    if (critical > 1) {
      quantParesCriticals = critical * 2
    } else {
      quantParesCriticals = critical;
    }

    console.log('criticos ', quantParesCriticals);

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
                    <span className="text-2xl font-bold mt-2">{dice}</span>
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
                    <span className="text-2xl font-bold mt-2">{dice}</span>
                  </div>
                )
              }
            )
          }
        </div>
        <div>
          {
            falhaBrutal
            ? <div>
              {
                totalDeSucessosParaDano >= 0
                ? <div>
                    <div>
                      O jogador obteve sucesso se sua ação foi causar dano (Caso sua ação não tenha sido causar dano, ocorreu uma falha brutal)
                    </div>
                    <div>
                      {` Número de Sucessos: ${quantParesBrutais + quantParesCriticals + success}`}
                    </div>
                    <div>{`Dificuldade: ${Number(msn.dificulty)}`}</div>
                    <div>
                      {`Excedente: ${totalDeSucessosParaDano}`}
                    </div>
                  </div>
                : <div>{`O jogador falhou no teste, pois a dificuldade era ${Number(msn.dificulty)} e ele obteve ${Number(totalDeSucessosParaDano)} sucessos. `} </div>
              }
              </div>
            : <div>
                <div>
                  O jogador obteve sucesso no seu teste
                </div>
                <div>
                    {` Número de Sucessos: ${quantParesBrutais + quantParesCriticals + success}`}
                  </div>
                  <div>{`Dificuldade: ${Number(msn.dificulty)}`}</div>
                  <div>
                    {`Excedente: ${totalDeSucessosParaDano}`}
                  </div>
                </div>
          }
        </div>
      </div>
    )
  }

  return (
    showData && (
      <div className="h-screen overflow-y-auto bg-ritual">
        <Nav />
        { slice.showRollDice && <PopUpDices /> }
        <div id="messages-container" className="h-90vh overflow-y-auto p-2">
          {
            messages && messages.map((msg, index) => {
              const token = localStorage.getItem('Segredos Da Fúria');
              const decode = jwtDecode(token);
              if (token && decode.email === msg.email) {
                return(
                  <div key={index} className="w-full flex justify-end  text-black">
                    <div  className="rounded-xl w-11/12 sm:w-7/12 md:w-7/12 p-2 bg-green-400 my-2">
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
                <div key={index} className="rounded-xl w-11/12 sm:w-7/12 md:w-7/12 p-2 bg-blue-400 my-2 text-black">
                  <div className="font-bold mb-2">
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
          }
        </div>
        <div className="fixed bottom-0 w-full bg-black p-2 flex flex-col gap-2 items-center">
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
          <div className="flex w-full items-end">
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
    )
  );
}
