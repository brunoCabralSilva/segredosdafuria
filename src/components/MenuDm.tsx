'use client'
import firebaseConfig from "@/firebase/connection";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionDeleteSession, actionLoginInTheSession, actionPopupCreateSheet, actionShowMenuSession, useSlice } from "@/redux/slice";
import { arrayUnion, collection, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import firestoreConfig from '../firebase/connection';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useRouter } from "next/navigation";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import PopupDeleteSession from "./sheet/popup/popupDeleteSession";
import PopupDeletePlayer from "./sheet/popup/popupDeletePlayer";
import PopupGift from "./sheet/popup/popupGift";
import PopupRitual from "./sheet/popup/popupRitual";
import PopupAdvantage from "./sheet/popup/popupAdvantage";
import PlayersDm from "./playerDM";
import { authenticate, signIn } from "@/firebase/login";
import { getHoraOficialBrasil, registerMessage } from "@/firebase/chatbot";
import PopupCreateSheet from "./sheet/popup/popupCreateSheet";

export default function MenuDm(props: { sessionId: string }) {
  const { sessionId } = props;
  const slice: any = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const [optionSelect, setOptionSelect] = useState('general');
  const [players, setPlayers] = useState<any[]>([]);
	const [listNotifications, setListNotifications] = useState<any[]>([]);
  const [nameSession, setNameSession] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [description, setDescription] = useState('');
  const [anotation, setAnotation] = useState('');
  const [textArea, setTextArea] = useState(false);
  const [dm, setDm] = useState('');
  const [textAnotation, setTextAnotation] = useState(false);
  const [input, setInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    setListNotifications([]);
		returnValue();
		getNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const typeText = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setDescription(sanitizedValue);
  };

  const typeName = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setNameSession(sanitizedValue);
  };

  const updateAnotations = async () => {
    try {
      const db = getFirestore(firestoreConfig);
      const sessionsCollectionRef = collection(db, 'sessions');
      const sessionDocRef = doc(sessionsCollectionRef, sessionId);
      const sessionDocSnapshot = await getDoc(sessionDocRef);
      if (sessionDocSnapshot.exists()) {
        await updateDoc(sessionDocRef, { anotations: anotation });
        window.alert('Anotação da sessão feita com sucesso!');
      } else {
        window.alert('Não foi possível encontrar a sessão especificada.');
      }
    } catch (error) {
      window.alert('Ocorreu um erro ao atualizar a Anotação da sessão: ' + error);
    }
  };

  const updateNameSession = async () => {
    if (nameSession.length < 3) {
      window.alert('Necessário preencher um nome com pelo menos 3 caracteres');
    } else if (nameSession.length > 40) {
      window.alert('Necessário preencher um nome com menos de 40 caracteres');
    } else {
      try {
        const db = getFirestore(firestoreConfig);
        const sessionsCollectionRef = collection(db, 'sessions');
        const sessionDocRef = doc(sessionsCollectionRef, sessionId);
        const sessionDocSnapshot = await getDoc(sessionDocRef);
        if (sessionDocSnapshot.exists()) {
          await updateDoc(sessionDocRef, { name: nameSession.toLowerCase() });
          window.alert('Nome da sessão atualizado com sucesso!');
        } else {
          window.alert('Não foi possível encontrar a sessão com o ID especificado.');
        }
      } catch (error) {
        window.alert('Ocorreu um erro ao atualizar o nome da sessão: ' + error);
      }
    }
  };

  const updateDescription = async() => {
    if (description.length < 10) {
      window.alert('Necessário preencher uma descrição com pelo menos 10 caracteres');
    } else if (description.length > 1000) {
      window.alert('Necessário preencher uma descrição com menos de 1000 caracteres');
    } else {
      try {
        const db = getFirestore(firestoreConfig);
        const sessionsCollectionRef = collection(db, 'sessions');
        const sessionDocRef = doc(sessionsCollectionRef, sessionId);
        const sessionDocSnapshot = await getDoc(sessionDocRef);
        if (sessionDocSnapshot.exists()) {
          await updateDoc(sessionDocRef, { description: description });
          window.alert('Descrição da sessão atualizado com sucesso!');
        } else {
          window.alert('Não foi possível encontrar a sessão especificada.');
        }
      } catch (error) {
        window.alert('Ocorreu um erro ao atualizar a descrição da sessão: ' + error);
      }
    }
  };

  const updateDm = async () => {
    const validateEmail = /\S+@\S+\.\S+/;
    if (!validateEmail.test(dm)) {
      window.alert('Necessário preencher um e-mail válido.');
    } else {
      try {
        const authData: { email: string, name: string } | null = await authenticate();
        if (authData && authData.email && authData.name) {
          const { email, name } = authData;
          const db = getFirestore(firestoreConfig);
          const sessionsCollectionRef = collection(db, 'sessions');
          const sessionDocRef = doc(sessionsCollectionRef, sessionId);
          const sessionDocSnapshot: any = await getDoc(sessionDocRef);
          if (sessionDocSnapshot.exists()) {
            const findPlayer = sessionDocSnapshot.data().players.find((player: any) => player.email === dm);
            if (dm === sessionDocSnapshot.data().dm) {
              window.alert('Este já é o Narrador da sessão.');
            } else if (findPlayer) {
              const findDmInPlayers = sessionDocSnapshot.data().players.find((player: any) => player.email === sessionDocSnapshot.data().dm);
              if(!findDmInPlayers) {
                const dateMessage = await getHoraOficialBrasil();
                const sheet = {
                  email: email,
                  user: name,
                  creationDate: dateMessage,
                  data: {
                    advantagesAndFlaws: [
                      { name: "Caern", advantages: [], flaws: [] },
                      { name: "Trabalho Diário", advantages: [], flaws: [] },
                      { name: "Linguística", advantages: [], flaws: [] },
                      { name: "Aparência", advantages: [], flaws: [] },
                      { name: "Refúgio Seguro", advantages: [], flaws: [] },
                      { name: "Situações Sobrenaturais", advantages: [], flaws: [] },
                      { name: "Aliados - Efetividade", advantages: [], flaws: [] },
                      { name: "Aliados - Confiabilidade", advantages: [], flaws: [] },
                      { name: "Contatos", advantages: [], flaws: [] },
                      { name: "Fama", advantages: [], flaws: [] },
                      { name: "Máscara", advantages: [], flaws: [] },
                      { name: "Mentor", advantages: [], flaws: [] },
                      { name: "Recursos", advantages: [], flaws: [] },
                      { name: "Pacto Espiritual", advantages: [], flaws: [] },
                    ],
                    trybe: '',
                    auspice: '',
                    name: '',
                    glory: 0,
                    honor: 0,
                    wisdom: 0,
                    health: [],
                    rage: 0,
                    harano: 0,
                    hauglosk: 0, 
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
                    form: 'Hominídeo',
                    background: '',
                    notes: '',
                  },
                };
                await updateDoc(sessionDocRef, {
                  dm: dm.toLowerCase(),
                  players: arrayUnion(sheet),
                });
              } else {
                await updateDoc(sessionDocRef, {
                  dm: dm.toLowerCase(),
                  notifications: [...sessionDocSnapshot.data().notifications,
                    {
                      message: `Olá, tudo bem? O antigo narrador desta sessão transferiu para você a condição de Narrador. Faça bom proveito! `,
                      type: 'transfer',
                    }
                  ],
                });
                await registerMessage({
                  message: `${name} acaba de transferir o cargo de Narrador para ${findPlayer.user}! Atualize a página para que seus antigos privilégios de Narrador sejam aplicados.`,
                  user: 'notification',
                  email: email,
                }, sessionDocSnapshot.data().name);
              }
              dispatch(actionShowMenuSession(''))
              window.location.reload();
              window.alert('Narrador da sessão atualizado com sucesso! Ao atualizar a página, você terá se tornado um jogador ao invés de um Narrador. O novo narrador também precisa atualizar a página para que seus antigos privilégios sejam aplicados a ele.');
            } else {
              window.alert('O email do usuário informado não foi encontrado na sua lista de jogadores desta sessão.');
              setDm(sessionDocSnapshot.data().dm);
            }
          } else {
            window.alert('Não foi possível encontrar a sessão especificada.');
          }
        } else {
          const sign = await signIn();
          if (!sign) {
            window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
            router.push('/');
          }
        }
      } catch (error) {
        window.alert('Ocorreu um erro ao atualizar o Narrador da sessão: ' + error);
      }
    }
  };
  
	const returnValue = async () => {
		try {
			const db = getFirestore(firebaseConfig);
			const sessionsCollectionRef = collection(db, 'sessions');
      const sessionDocRef = doc(sessionsCollectionRef, sessionId);
      const sessionDocSnapshot = await getDoc(sessionDocRef);
      const authData: { email: string, name: string } | null = await authenticate();
        if (authData && authData.email && authData.name) {
          const { email } = authData;
          if (sessionDocSnapshot.exists()) {
            const sessionData = sessionDocSnapshot.data();
            if (sessionData.dm === email) {
              setNameSession(sessionData.name);
              setCreationDate(sessionData.creationDate);
              setDescription(sessionData.description);
              setDm(sessionData.dm);
              setPlayers(sessionData.players);
              setAnotation(sessionData.anotations);
              dispatch(actionLoginInTheSession({ id: sessionId, logged: true }))
            } else router.push('/sessions');
          } else router.push('/sessions');
        } else {
          const sign = await signIn();
          if (!sign) {
            window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
            router.push('/');
          }
        }
		} catch (error) {
			window.alert(`Erro ao obter a lista de jogadores: ` + error);
    }
	};

	const getNotifications = async() => {
		try {
			const db = getFirestore(firebaseConfig);
			const sessionsCollectionRef = collection(db, 'sessions');
      const sessionDocRef = doc(sessionsCollectionRef, sessionId);
      const sessionDocSnapshot = await getDoc(sessionDocRef);
      const authData: { email: string, name: string } | null = await authenticate();
      if (authData && authData.email && authData.name) {
        if (sessionDocSnapshot.exists()) {
          const notifications = sessionDocSnapshot.data().notifications;
          setListNotifications([...notifications]);
        }
      } else {
        const sign = await signIn();
        if (!sign) {
          window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
          router.push('/');
        }
      }
    } catch(error) {
      window.alert(`Erro ao obter Notificações de jogadores: ` + error);
    }
	};

  const remNotFromCache = async(list: any[]) => {
    const listNotif = listNotifications.filter(listNot => JSON.stringify(listNot) !== JSON.stringify(list));
    setListNotifications(listNotif);
  }

	const removeNotification = async (message: string) => {
		try {
			const db = getFirestore(firestoreConfig);
			const sessionsCollectionRef = collection(db, 'sessions');
      const sessionDocRef = doc(sessionsCollectionRef, slice.loginInTheSession.id);
      const sessionDocSnapshot = await getDoc(sessionDocRef);
			if (sessionDocSnapshot.exists()) {
				const sessionData = sessionDocSnapshot.data();
				const updatedNotifications = sessionData.notifications.filter((notification : any) => notification.message !== message);
				await updateDoc(sessionDocSnapshot.ref, { notifications: updatedNotifications });
			}
			getNotifications();
		} catch (error) {
			window.alert("Ocorreu um erro: " + error);
		}
	};
	
	const approveUser = async (list: {email: string, user: string, message: string }) => {
		try {
			const db = getFirestore(firebaseConfig);
			const sessionsCollectionRef = collection(db, 'sessions');
      const sessionDocRef = doc(sessionsCollectionRef, sessionId);
      const sessionDocSnapshot = await getDoc(sessionDocRef);
      if (sessionDocSnapshot.exists()) {
        const findByEmail = sessionDocSnapshot.data().players.find((user: any) => user.email === list.email);
        if(!findByEmail) {
          const dateMessage = await getHoraOficialBrasil();
          const sheet = {
            email: list.email,
            user: list.user,
            creationDate: dateMessage,
            data: {
              advantagesAndFlaws: [
                { name: "Caern", advantages: [], flaws: [] },
                { name: "Trabalho Diário", advantages: [], flaws: [] },
                { name: "Linguística", advantages: [], flaws: [] },
                { name: "Aparência", advantages: [], flaws: [] },
                { name: "Refúgio Seguro", advantages: [], flaws: [] },
                { name: "Situações Sobrenaturais", advantages: [], flaws: [] },
                { name: "Aliados - Efetividade", advantages: [], flaws: [] },
                { name: "Aliados - Confiabilidade", advantages: [], flaws: [] },
                { name: "Contatos", advantages: [], flaws: [] },
                { name: "Fama", advantages: [], flaws: [] },
                { name: "Máscara", advantages: [], flaws: [] },
                { name: "Mentor", advantages: [], flaws: [] },
                { name: "Recursos", advantages: [], flaws: [] },
                { name: "Pacto Espiritual", advantages: [], flaws: [] },
              ],
              harano: 0,
              hauglosk: 0,
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
              form: 'Hominídeo',
              background: '',
              notes: '',
            },
          };
          const authData: { email: string, name: string } | null = await authenticate();
          await updateDoc(sessionDocSnapshot.ref, {
            players: arrayUnion(sheet)
          });
          if (authData) {
          await registerMessage({
            message: `${list.user} iniciou sua jornada nesta Sessão! seja bem vinde!`,
            user: 'notification',
            email: authData.email,
          }, sessionDocSnapshot.data().name);
        }
        }
        await removeNotification(list.message);
        returnValue();
      } else {
        window.alert('Não foi possível realizar a aprovação do usuário. Atualize a página e tente novamente.');
      }
    } catch (error) {
      window.alert("Ocorreu um erro ao tentar aprovar usuário: " + error);
		}
	};

  return(
		<div className="bg-gray-whats-dark overflow-y-auto flex flex-col items-center justify-start h-screen px-4">
      <div className="w-full flex justify-end my-3">
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer mb-2"
          onClick={() => dispatch(actionShowMenuSession(''))}
        />
      </div>
      <select
        onChange={ (e) => {
          setOptionSelect(e.target.value);
        }}
        className="w-full mb-2 border border-white p-3 cursor-pointer bg-black text-white flex items-center justify-center font-bold text-center"
      >
        <option value={'general'}>Geral</option>
        <option value={'notifications'}>Notificações { listNotifications.length > 0 && `(${listNotifications.length})` }</option>
        <option value={'players'}>Personagens</option>
        <option value={'anotations'}>Anotações</option>
      </select>
      { 
        optionSelect === 'general' &&
        <div className="h-full w-full">{
          creationDate !== ''
          ? <div className="h-full w-full">
              <div className="flex flex-col items-center justify-start w-full">
                <div
                  className="w-full mt-2 capitalize flex justify-between items-center cursor-pointer pr-2 border-2 border-white mb-2"
                  onClick={() => setInput('nameSession')}
                >
                  { 
                    input !== 'nameSession' &&
                    <span className="text-white font-bold text-2xl my-3 capitalize break-words w-full px-4">
                      { nameSession }
                    </span>
                  }
                  { 
                    input === 'nameSession' &&
                    <input
                      type="text"
                      className="border-2 border-white text-white text-left w-full mr-1 bg-black p-2 text-2xl break-words"
                      placeholder="Nome"
                      value={ nameSession }
                      onChange={(e) => typeName(e)}
                    />
                  }
                  { 
                    input
                      ? <BsCheckSquare
                          onClick={(e:any) => {
                            updateNameSession();
                            setInput('');
                            e.stopPropagation();
                          }}
                          className="text-3xl text-white"
                        />
                      : <FaRegEdit
                          onClick={
                            (e:any) => {
                              setInput('nameSession');
                              e.stopPropagation();
                            }}
                          className="text-3xl text-white"
                        />
                  }
                </div>
                <div className="w-full mb-2 flex-col font-bold border-2 border-white">
                  <div className="pl-4 pr-2 pt-2 flex justify-between items-center w-full">
                    <div
                      className="text-white w-full cursor-pointer flex-col items-center justify-center"
                      onClick={
                        () => {
                          setTextArea(true);
                        }
                      }
                    >
                      Descrição:
                    </div>
                    <div>
                    { 
                      textArea
                        ? <BsCheckSquare
                            onClick={(e: any) => {
                              updateDescription();
                              setTextArea(false);
                              e.stopPropagation();
                            }}
                            className="text-3xl text-white cursor-pointer mb-1"
                          />
                        : <FaRegEdit
                            onClick={(e: any) => {
                              setTextArea(true);
                              e.stopPropagation();
                            }}
                            className="text-3xl text-white cursor-pointer" />
                    }
                    </div>
                  </div>
                  <div className="w-full h-full">
                    { 
                      textArea ?
                      <textarea
                        className="text-white bg-black font-normal p-4 w-full h-72 cursor-pointer break-words text-justify border-t-white border"
                        value={ description }
                        onChange={(e) => typeText(e)}
                      />
                      : <div
                          className="text-white font-normal p-4 text-justify w-full h-full cursor-pointer break-words"
                          onClick={() => setTextArea(true)} 
                        >
                        { description }
                      </div>
                    }
                  </div>
                </div>
                <div
                  className={`w-full mb-2 mt-1 flex flex-col justify-between items-center cursor-pointer p-2 border-2 border-white`}
                  onClick={() => setInput('dm')}
                >
                  <div className="flex w-full">
                    <span className="text-white break-words w-full p-2">
                      <span className="font-bold pr-1">Narrador:</span>
                    </span>
                  { 
                    input
                      ? <BsCheckSquare
                          onClick={(e:any) => {
                            updateDm();
                            setInput('');
                            e.stopPropagation();
                          }}
                          className="text-3xl text-white mr-1"
                        />
                      : <FaRegEdit
                          onClick={
                            (e:any) => {
                              setInput('dm');
                              e.stopPropagation();
                            }}
                          className="text-3xl text-white"
                        />
                  }
                  </div>
                  { 
                    input === 'dm' ?
                    <input
                      type="text"
                      className="text-sm border border-white text-white text-left w-full bg-black p-2"
                      placeholder="Nome"
                      value={ dm }
                      onChange={(e) => setDm(e.target.value)}
                    />
                    : <span className="border border-transparent text-sm text-white w-full p-2 break-words">{ dm }</span>
                  }
                </div>
                <p className="mt-1 text-white sm:text-left w-full text-center border-2 border-white p-4">
                  <span className="font-bold pr-1">Data de Criação:</span>
                  <span>{ creationDate }</span>
                </p>
                <div className="text-white pb-3 sm:text-left w-full text-center mt-3 border-2 border-white p-4 mb-3">
                  <span className="pr-1 font-bold">Jogadores:</span>
                  {
                    players.filter((player:any) => player.email !== dm ).map((item: any, index: number) => (
                      <span className="capitalize" key={index}>
                        { index === players.length -2 ? item.user + '.' : item.user + ', ' }
                      </span>
                    ))
                  }
                </div>
                <button
                  type="button"
                  className="mb-3 p-2 w-full text-center border-2 border-white text-white bg-red-800 cursor-pointer font-bold hover:bg-red-900 transition-colors"
                  onClick={() => dispatch(actionDeleteSession(true))}
                >
                  Sair da Sessão
                </button>
                { slice.popupDeleteSession && <PopupDeleteSession sessionId={ sessionId } /> }
              </div>
            </div>
          : <div className="h-full flex items-center justify-center">
              <span className="loader z-50" />
            </div>
        }</div>
      }
      {
        optionSelect === 'notifications' &&
        <div className="text-white w-full">
          {
            <div className="w-full">
              <button className="text-white bg-black border-2 border-white hover:border-red-800 transition-colorscursor-pointer w-full p-2 mt-1 mb-3 font-bold" onClick={getNotifications}>Atualizar</button>
              {
                listNotifications.map((listNot: any, index: number) => (
                  listNot.type === 'approval'
                  ? <div key={index} className="border-2 pt-1 px-1 border-white mb-2">
                    <div className="w-full flex justify-end pb-3">
                      <IoIosCloseCircleOutline
                        className="text-3xl text-white cursor-pointer"
                        onClick={() => remNotFromCache(listNot)}
                      />
                    </div>
                    <p className="text-center w-full px-3">{listNot.message}</p>
                    <div className="flex w-full gap-2 px-3 mb-3">
                      <button
                        type="button"
                        onClick={ () => removeNotification(listNot.message) }
                        className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}

                      >
                        Negar
                      </button>
                      <button
                        type="button"
                        onClick={ () => approveUser(listNot) }
                        className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
                      >
                        Aceitar
                      </button>
                    </div>
                    </div>
                  : <div key={index} className="border-2 pt-1 px-1 border-white mb-2">
                  <div className="w-full flex justify-end pb-3">
                    <IoIosCloseCircleOutline
                      className="text-3xl text-white cursor-pointer"
                      onClick={() => remNotFromCache(listNot)}
                    />
                  </div>
                  <p className="text-center w-full px-3">{listNot.message}</p>
                  <div className="flex w-full gap-2 px-3 mb-3">
                    <button
                      type="button"
                      onClick={ () => removeNotification(listNot.message) }
                      className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
                    >
                      Ok
                    </button>
                  </div>
                    </div>
                ))
              }
              {
                listNotifications.length === 0 &&
                <div className="w-full text-white text-lg text-center mt-4">
                  Você não possui notificações.
                </div>
              }
            </div>
          }
        </div>
      }
      {
        optionSelect === 'players' && 
        <div className="flex flex-col items-center justify-start h-screen z-50 top-0 right-0 w-full">
          <button
            className="text-white bg-black border-2 border-white hover:border-red-800 transition-colors my-1 mb-3 cursor-pointer w-full p-2 font-bold"
            onClick={ () => dispatch(actionPopupCreateSheet(true)) }>
            Criar Ficha
          </button>
          <button className="text-white bg-black border-2 border-white hover:border-red-800 transition-colors my-1 mb-3 cursor-pointer w-full p-2 font-bold" onClick={returnValue}>Atualizar</button>
          { 
            players.length === 0 && <div className="w-full text-white text-lg text-center mt-4">
              Você não possui Jogadores.
            </div>
          }
          {
            players.length > 0 && players.filter((pl) => pl.email !== dm).map((player: any, index: number) => (
              <PlayersDm key={index} player={player} returnValue={returnValue} sessionId={ sessionId } />
            ))
          }
          { slice.popupDeletePlayer.show && <PopupDeletePlayer returnValue={returnValue} sessionId={ sessionId } /> }
        </div>
      }
      {
        optionSelect === 'anotations' &&
        <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
        <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold">
          <div className="mt-1 p-2 flex justify-between items-center">
            <div
              className="text-white mt-2 pb-2 w-full cursor-pointer flex-col items-center justify-center"
              onClick={
                () => {
                  setTextArea(true);
                }
              }
            >
              Anotações do Narrador
            </div>
              { 
                textArea
                  ? <BsCheckSquare
                      onClick={(e: any) => {
                        updateAnotations();
                        setTextArea(false);
                        e.stopPropagation();
                      }}
                      className="text-3xl text-white cursor-pointer"
                    />
                  : <FaRegEdit
                      onClick={(e: any) => {
                        setTextArea(true);
                        e.stopPropagation();
                      }}
                      className="text-3xl text-white cursor-pointer" />
              }
          </div>
          { 
            textArea ?
            <textarea
              className="text-white bg-black font-normal p-2 border-2 border-white w-full mr-1 mt-1 h-full"
              value={ anotation }
              onChange={(e) => setAnotation(e.target.value)}
            />
            : <div
                className="text-white font-normal p-2 border-2 border-white w-full mr-1 mt-1 h-full cursor-pointer"
                onClick={() => setTextAnotation(true)} 
              >
              { anotation }
            </div>
          }
        </div>
      </div>
      }
      { slice.popupGift.show && <PopupGift item={ slice.popupGift.gift } /> }
      { slice.popupCreateSheet && <PopupCreateSheet sessionId={ sessionId } returnValue={ returnValue } /> }
      { slice.popupRitual.show && <PopupRitual item={ slice.popupRitual.ritual } /> }
      { slice.showAdvantage.show && <PopupAdvantage /> }
		</div>
  ) 
}