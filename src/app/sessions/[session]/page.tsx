'use client'
import { useEffect, useLayoutEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actionShowMenuSession, useSlice } from '@/redux/slice';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { arrayUnion, collection, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import firestoreConfig from '../../../firebase/connection';
import { jwtDecode } from 'jwt-decode';
import { IGenerateDataRolls, IMsn } from '@/interface';
import Nav from '@/components/nav';
import PopUpDices from '@/components/popUpDices';
import PopUpSheet from '@/components/popUpSheet';
import { verify } from '../../../firebase/user';
import Message from './message';
import { generateDataRoll } from './functions';
import Dice from './dice';
import SessionBar from './sessionBar';
import { useRouter } from 'next/navigation';
import POpUpDicesDm from '@/components/manualRoll';
import MenuDm from '@/components/MenuDm';
import { testToken } from '@/firebase/token';

export default function Chat({ params } : { params: { session: String } }) {
  const [sessionName, setSessionName] = useState('');
  const nameSession = decodeURIComponent(params.session.replace(/-/g, ' ').replace(/_/g, '-'));
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const db = getFirestore(firestoreConfig);
  const sessionRef = collection(db, "sessions");
  const querySession = query(sessionRef, where("name", "==", nameSession));
  const [session] = useCollectionData(querySession, { idField: "id" } as any);
  const [showData, setShowData] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [dm, setDm] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setShowData(false);
    window.scrollTo(0, 0);
    const verification = testToken();
    if (!verification) router.push('/user/login');
    else {
      setDm(false);
      setSessionName(decodeURIComponent(params.session.replace(/-/g, ' ').replace(/_/g, '-')));
      dispatch(actionShowMenuSession(''));
      window.scrollTo(0, 0);
      const registerUserInTheSession = async () => {
        const token = localStorage.getItem('Segredos Da Fúria');
        if (token) {
          setShowData(true);
          const decodification: { email: string, firstName: string, lastName: string } = jwtDecode(token);
          const { email, firstName, lastName } = decodification;
          if (email === 'yslasouzagnr@gmail.com') window.alert('Espero que o tempo passe\nEspero que a semana acabe\nPra que eu possa te ver de novo\nEspero que o tempo voe\nPara que você retorne\nPra que eu possa te abraçar\nTe beijar de novo\n<3');
          const resultado: any = await getDocs(querySession);
          const players: any = [];
          resultado.forEach((doc: any) => players.push(...doc.data().players));
          let dmEmail: string = '';
          resultado.forEach((doc: any) => dmEmail = doc.data().dm);
          if (dmEmail === email) setDm(true);
          else {
            const findByEmail = players.find((user: any) => user.email === email);
            if(!findByEmail) {
              const sheet = {
                session: sessionName,
                email: email,
                user: `${firstName} ${lastName}`,
                creationData: Date.now(),
                data: {
                  trybe: '',
                  auspice: '',
                  name: '',
                  glory: 0,
                  honor: 0,
                  wisdom: 0,
                  health: [],
                  rage: 0,
                  willpower: [],
                  attributes: {
                    strength: 1,
                    dexterity: 1,
                    stamina: 1,
                    charisma: 1,
                    manipulation: 1,
                    composure: 1,
                    intelligence: 1,
                    wits: 1,
                    resolve: 1,
                  },
                  skills: {
                    athletics: { value: 0, specialty: '' },
                    animalKen: { value: 0, specialty: '' },
                    academics: { value: 0, specialty: '' },
                    brawl: { value: 0, specialty: '' },
                    etiquette: { value: 0, specialty: '' },
                    awareness: { value: 0, specialty: '' },
                    craft: { value: 0, specialty: '' },
                    insight: { value: 0, specialty: '' },
                    finance: { value: 0, specialty: '' },
                    driving: { value: 0, specialty: '' },
                    intimidation: { value: 0, specialty: '' },
                    investigation: { value: 0, specialty: '' },
                    firearms: { value: 0, specialty: '' },
                    leadership: { value: 0, specialty: '' },
                    medicine: { value: 0, specialty: '' },
                    larceny: { value: 0, specialty: '' },
                    performance: { value: 0, specialty: '' },
                    occult: { value: 0, specialty: '' },
                    melee: { value: 0, specialty: '' },
                    persuasion: { value: 0, specialty: '' },
                    politics: { value: 0, specialty: '' },
                    stealth: { value: 0, specialty: '' },
                    streetwise: { value: 0, specialty: '' },
                    science: { value: 0, specialty: '' },
                    survival: { value: 0, specialty: '' },
                    subterfuge: { value: 0, specialty: '' },
                    technology: { value: 0, specialty: '' },
                  },
                  gifts: [],
                  rituals: [],
                  advantagesAndFlaws: [],
                  form: 'Hominídeo',
                  background: '',
                  notes: '',
                },
              };
              const docRef = resultado.docs[0].ref;
              await updateDoc(docRef, {
                players: arrayUnion({ ...sheet, date: Date.now() })
              });
            }
          }
        }
        else {
          router.push('/user/login');
        }
      }
      registerUserInTheSession();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      const messagesContainer: HTMLElement | null = document.getElementById('messages-container');
      if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });

  const scrollToBottom = () => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  const messageData = (msn: IMsn) => {
    if (typeof msn === 'string') {
      return ( <div className="px-2 break-words">{ msn }</div> );
    }
    const rollDices: IGenerateDataRolls = generateDataRoll(msn);
    if (msn.rollOfMargin) {
      return(
        <div className="p-2">
          <div className="p-2 flex gap-1 flex-wrap">
            {
              msn.rollOfRage.sort((a, b) => a - b).map((dice, index) => (
                <Dice key={ index } dice={ dice } type="(rage)" />
              ))
            }
            {
              msn.rollOfMargin.sort((a, b) => a - b).map((dice, index) => (
                <Dice key={ index } dice={ dice } type="" />
              ))
            }
          </div>
          <div>
            {
              rollDices.falhaBrutal
              ? rollDices.sucessosParaDano >= 0
                ? <Message rollDices={ rollDices } msn={ msn } type="success-rage" />
                : <Message rollDices={ rollDices } msn={ msn } type="fail" />
              : rollDices.sucessosParaDano >= 0
                ? <Message rollDices={ rollDices } msn={ msn } type="success" />
                : <Message rollDices={ rollDices } msn={ msn } type="fail" />
            }
          </div>
        </div>
      );
    }
    return <Message rollDices={ rollDices } msn={ msn } type="rage-check" />
  };

  const returnDate = (msg: any) => {
    const data = new Date(msg.date);
    const formatoData = `${`${data.getDate() < 10 ? 0 : ''}${data.getDate()}`}/${data.getMonth() + 1}/${data.getFullYear()}`;
    const formatoHora = `${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`;
    return `${formatoHora}, ${formatoData}`;
  }

  const messageForm = (index: number, msg: any, color: string, justify: string) => {
    return(
      <div key={index} className={`w-full flex ${justify === 'end' ? 'justify-end' : 'justify-start' } text-white`}>
        <div className={`${color === 'green' ? 'bg-green-whats': 'bg-gray-whats'} rounded-xl w-11/12 sm:w-7/12 md:w-7/12 p-2 mb-2`}>
          {
            color === 'gray' &&
            <div className="pl-2 pb-2 capitalize font-bold">
              { msg.user }
            </div>
          }
          <div>
            { messageData(msg.message) }
            </div>
            <div className="flex justify-end pt-2">
              <span className="w-full text-right text-sm flex justify-end">
                { msg.date && returnDate(msg) }
              </span>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-ritual bg-cover bg-top">
      <Nav />
      {
        showData
        ? <div className="flex bg-black/80">
            <div className="flex flex-col w-full relative">
              <div id="messages-container" className={`relative h-90vh overflow-y-auto pt-2 px-2`}>
                {
                  session && session.length > 0 && session[0].chat && session[0].chat.length >= 0
                  ? session[0] && session[0].chat.map((msg: any, index: number) => {
                      const token = localStorage.getItem('Segredos Da Fúria');
                      if (token) {
                        const decodedToken = verify(JSON.parse(token));
                        let decode = { email: '' };
                        if (decodedToken) decode = jwtDecode(token);
                        if (token && decode.email !== '' && decode.email === msg.email) {
                          return messageForm(index, msg, 'green', 'end');
                        }
                        return messageForm(index, msg, 'gray', 'start');
                      } return null;
                    })
                  : <div className="bg-black/60 text-white h-90vh flex items-center justify-center flex-col">
                      <span className="loader z-50" />
                    </div>
                }
              </div>
              <SessionBar
                showOptions={showOptions}
                setShowOptions={setShowOptions}
                scrollToBottom={scrollToBottom}
                sessionName={sessionName}
              />
            </div>
            { 
              slice.showMenuSession === 'dices' &&
              <div className="w-full md:w-3/5 absolute sm:relative z-50">
                { dm ? <POpUpDicesDm session={ sessionName } /> : <PopUpDices session={ sessionName } /> }
              </div>
            }
            {
              slice.showMenuSession === 'sheet' && 
                <div className="w-full md:w-3/5 absolute sm:relative z-50">
                { dm ? <MenuDm session={ sessionName } /> : <PopUpSheet session={ sessionName }  /> }
                </div>
            }
          </div>
        : <div className="bg-black/80 text-white h-screen flex items-center justify-center flex-col">
            <span className="loader z-50" />
          </div>
      }
      </div>
  );
}
