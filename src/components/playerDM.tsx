import firestoreConfig from '../firebase/connection';
import { useAppDispatch } from "@/redux/hooks";
import { actionDeletePlayer, actionForm, actionPopupGift, actionPopupRitual, actionShowAdvantage } from "@/redux/slice";
import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import dataTrybes from '../data/trybes.json';
import dataAuspices from '../data/auspices.json';
import { useEffect, useState } from "react";
import { BsCheckSquare } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { IoArrowDownCircleSharp, IoArrowUpCircleSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import firebaseConfig from '../firebase/connection';
import { returnRageCheckForOthers } from '@/firebase/checks';
import { registerMessage } from '@/firebase/chatbot';

export default function PlayersDm(props: any) {
  const { player, returnValue, sessionId } = props;
  const [show, setShow] = useState(false);
  const [valueform, setValueForm] = useState('');
  const [editNameUser, setEditNameUser] = useState(false);
  const [editNameChar, setEditNameChar] = useState(false);
  const [editTrybe, setEditTrybe] = useState(false);
  const [editAuspice, setEditAuspice] = useState(false);
  const [editRage, setEditRage] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editRenown, setEditRenown] = useState(false);
  const [editAttributes, setEditAttributes] = useState(false);
  const [editSkills, setEditSkills] = useState(false);
  const [editHarano, setEditHarano] = useState(false);
  const [editHauglosk, setEditHauglosk] = useState(false);
  const [editGifts, setEditGifts] = useState(false);
  const [editRituals, setEditRituals] = useState(false);
  const [editbackground, setEditBackground] = useState(false);
  const [dataUser, setDataUser] = useState<any>({});
  const dispatch = useAppDispatch();

  useEffect(() => {
    setDataUser(player);
    setValueForm(player.data.form);
  }, []);

  const updateOption = (player: any) => {
    dispatch(actionDeletePlayer({show: true, player: player}));
    props.returnValue();
  };

  const truncateString = (str: string) =>  {
    if (str.length <= 20) return str;
    else return str.substring(0, 20) + '...';
  }

  const returnHealth = (player: any) => {
    let hp = 0;
    if (player.data.form === 'Crinos') {
      hp = player.data.attributes.stamina + 7
    } else hp = player.data.attributes.stamina + 3;
    const rest = Array(hp - player.data.health.length).fill('');
    return (
      <div className="pl-5 w-full">
        <div className="w-full flex justify-start">
          <span className="font-bold pr-1 text-start w-full pb-2 pt-2">Vitalidade Total: { hp }</span>
        </div>
        <div className="flex items-center w-full justify-between mb-2">
          <div className="flex w-full flex-wrap gap-1 justify-start">
            { 
              player.data.health.map((heal: any, index: number) => (
                <span key={index} className={`h-6 w-6 rounded-full border-white border-2 ${heal.agravated ? 'bg-black': 'bg-gray-400'}`} />
              ))
            }
            { 
              rest.map((heal: any, index: number) => (
                <span key={index} className="h-6 w-6 rounded-full border-white border-2 bg-white" />
              ))
            }
          </div>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
      </div>
    );
  };

  const returnWillpower = (player: any) => {
    const hp = player.data.attributes.composure + player.data.attributes.resolve;
    const rest = Array(hp - player.data.willpower.length).fill('');
    return (
      <div className="w-full pl-5">
        <p className="w-full font-bold pr-1 text-left pb-2 pt-2">Força de Vontade Total: { player.data.attributes.composure + player.data.attributes.resolve }</p>
        <div className="flex items-center w-full justify-between mb-2">
          <div className="flex flex-wrap w-full gap-1 justify-start">
            { 
              player.data.willpower.map((heal: any, index: number) => (
                <span key={index} className={`h-6 w-6 rounded-full border-white border-2 ${heal.agravated ? 'bg-black': 'bg-gray-400'}`} />
              ))
            }
            { 
              rest.map((heal: any, index: number) => (
                <span key={index} className="h-6 w-6 rounded-full border-white border-2 bg-white" />
              ))
            }
          </div>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
      </div>
    );
  };

  const returnSumPoints = (list: any) => {
    let adv = 0;
    let flw = 0;
    let type = "";
    list.forEach((item: any) => {
      if (item.flaw) {
        flw += item.value;
        type = 'flaw';
      } else {
        adv += item.value;
        type = 'adv';
      }
    });
    if (type === 'adv') return adv;
    if (type === 'flaw') return flw;
  };

  const updateForm = async () => {
    const db = getFirestore(firebaseConfig);
    try {
      const sessionsCollectionRef = collection(db, 'sessions');
      const sessionDocRef = doc(sessionsCollectionRef, sessionId);
      const sessionDocSnapshot = await getDoc(sessionDocRef);
      if (sessionDocSnapshot.exists()) {
        const sessionData = sessionDocSnapshot.data();
        const session = sessionData.name;
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const docRef = userQuerySnapshot.docs[0].ref;
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const players = docSnapshot.data().players;
          console.log(players);
          if (valueform !== dataUser.data.form) {
            if (dataUser.data.form === 'Crinos' && dataUser.data.rage 
            > 0 ) {
              dataUser.data.rage = 1;
                await registerMessage({
                  message: 'Fúria reduzida para 1 por ter saído da forma Crinos.',
                  user: dataUser.user,
                  email: dataUser.email,
                }, session);
                setDataUser({
                  ...dataUser,
                  data: { ...dataUser.data, form: valueform, rage: 1 },
                });
            } else {
              if (valueform === 'Hominídeo' || valueform === 'Lupino') {
                await registerMessage({
                  message: `Mudou para a forma ${valueform}.`,
                  user: dataUser.user,
                  email: dataUser.email,
                }, session);
                setDataUser({ ...dataUser, data: { ...dataUser.data, form: valueform }});
              } else {
                if ( dataUser.data.rage <= 0) {
                  await registerMessage({
                    message: 'Você não possui Fúria para realizar esta ação. Após chegar a zero pontos de Fúria, o Garou perde o Lobo e não pode realizar ações como usar dons, mudar de forma, realizar testes de Fúria, dentre outros.',
                    user: dataUser.user,
                    email: dataUser.email,
                  }, session);
                  setValueForm(dataUser.data.form);
                } else if (valueform === 'Glabro' || valueform === 'Hispo') {
                  await returnRageCheckForOthers(1, valueform, session, dataUser, setDataUser);
                  setDataUser({ ...dataUser, data: { ...dataUser.data, form: valueform }});
                } else {
                  await returnRageCheckForOthers(2, valueform, session, dataUser, setDataUser);
                  setDataUser({ ...dataUser, data: { ...dataUser.data, form: valueform }});
                }
              }
            }
            const playersFiltered = players.filter((gp: any) => gp.email !== dataUser.email);
            await updateDoc(docRef, { players: [...playersFiltered, { ...dataUser, data: { ...dataUser.data, form: valueform }}] });
            dispatch(actionForm(valueform));
            returnValue();
          }
        }
      }
    } catch (error) {
      window.alert('Erro ao atualizar Forma (' + error + ')');
    }
  };

  const updateDataValue = async (value: any) => {
    try {
      const db = getFirestore(firestoreConfig);
      const sessionsCollectionRef = collection(db, 'sessions');
      const sessionDocRef = doc(sessionsCollectionRef, sessionId);
      const sessionDocSnapshot = await getDoc(sessionDocRef);
      if (sessionDocSnapshot.exists()) {
        let findPlayer = sessionDocSnapshot.data().players.find((player: any) => player.email === dataUser.email);
        if (findPlayer && findPlayer.data[value] !== dataUser.data[value]) {
          findPlayer = {
            ...findPlayer,
            data: {
              ...findPlayer.data,
              [value]: dataUser.data[value],
            }
          }
          const playersFiltered = sessionDocSnapshot.data().players.filter((gp: any) => gp.email !== dataUser.email);
          await updateDoc(sessionDocSnapshot.ref, { players: [...playersFiltered, findPlayer] });
          window.alert('Atualização realizada com Sucesso');
        }
      }} catch (error) {
        window.alert(`Erro ao atualizar valor de ${value}: ${error}.`);
      }
      returnValue();
  };

  const updateRenown = async () => {
    try {
      const db = getFirestore(firestoreConfig);
      const sessionsCollectionRef = collection(db, 'sessions');
      const sessionDocRef = doc(sessionsCollectionRef, sessionId);
      const sessionDocSnapshot = await getDoc(sessionDocRef);
      if (sessionDocSnapshot.exists()) {
        let findPlayer = sessionDocSnapshot.data().players.find((player: any) => player.email === dataUser.email);
        if (findPlayer && (findPlayer.data.honor !== dataUser.data.honor || findPlayer.data.glory !== dataUser.data.glory || findPlayer.data.wisdom !== dataUser.data.wisdom)) {
          findPlayer = {
            ...findPlayer,
            data: {
              ...findPlayer.data,
              honor: dataUser.data.honor,
              glory: dataUser.data.glory,
              wisdom: dataUser.data.wisdom,
            }
          }
          const playersFiltered = sessionDocSnapshot.data().players.filter((gp: any) => gp.email !== dataUser.email);
          await updateDoc(sessionDocSnapshot.ref, { players: [...playersFiltered, findPlayer] });
          window.alert('Atualização realizada com Sucesso');
        }
    }} catch (error) {
      window.alert(`Erro ao atualizar valor de Renome: ${error}.`);
    }
    returnValue();
  };

  const updateValue = async (value: any) => {
    try {
      const db = getFirestore(firestoreConfig);
      const sessionsCollectionRef = collection(db, 'sessions');
      const sessionDocRef = doc(sessionsCollectionRef, sessionId);
      const sessionDocSnapshot = await getDoc(sessionDocRef);
      if (sessionDocSnapshot.exists()) {
        let findPlayer = sessionDocSnapshot.data().players.find((player: any) => player.email === dataUser.email);
        if (findPlayer && findPlayer[value] !== dataUser[value]) {
          findPlayer = {
            ...findPlayer,
            user: dataUser[value],
          }
          const playersFiltered = sessionDocSnapshot.data().players.filter((gp: any) => gp.email !== dataUser.email);
          await updateDoc(sessionDocSnapshot.ref, { players: [...playersFiltered, findPlayer] });
          window.alert('Atualização realizada com Sucesso');
        }
      }} catch (error) {
        window.alert(`Erro ao atualizar valor de ${value}: ${error}.`);
      }
      returnValue();
  };

  return(
    <div className="w-full">
      { !show
      ? <button
          className="border-2 border-white mb-2 p-2 py-3 hover:bg-black transition-colors w-full text-white capitalize relative flex md:justify-center justify-between items-center text-center"
          type="button"
          onClick={() => setShow(true)}
        >
          <span className="w-full">
            { 
              dataUser.user && `${truncateString(dataUser .user)} (${dataUser.data.name === '' ? 'Sem nome': truncateString(dataUser.data.name)})`
            }
          </span>
          <button
            type="button"
            className="md:absolute top-2 right-3"
            onClick={ () => setShow(true) }
          >
            <IoArrowDownCircleSharp className="text-3xl text-white" />
          </button>
        </button>
      : <div className="text-white w-full border-2 border-white flex flex-col items-center justify-center p-3 mb-4">
        <div className="w-full flex items-center justify-between pb-3 sm:pb-0 ">
          <div className="flex justify-start pl-5">
          </div>
          <div className="flex">
            <MdDelete
              className="text-3xl text-white cursor-pointer"
              onClick={ () => updateOption(dataUser) }
            />
            <button
              type="button"
              className="ml-2"
              onClick={ () => {
                setShow(false);
                setEditNameUser(false);
                setEditNameChar(false);
                setEditTrybe(false);
                setEditAuspice(false);
                setEditRage(false);
                setEditForm(false);
                setEditRenown(false);
                setEditAttributes(false);
                setEditSkills(false);
                setEditGifts(false);
                setEditRituals(false);
                setEditHarano(false);
                setEditHauglosk(false);
              }}
            >
              <IoArrowUpCircleSharp className="text-3xl text-white" />
            </button>
          </div>
        </div>
        <div className="flex items-center w-full justify-between pl-5 mt-5 gap-3 mb-1">
          {
            !editNameUser
            ? <h1 className="capitalize text-xl text-center my-1 border border-transparent">
                { dataUser.user }
              </h1>
            : <h1 className="capitalize text-xl text-center">
                <input
                  type="text"
                  onChange={ (e: any) => setDataUser({
                    ...dataUser,
                    user: e.target.value,
                  })}
                  value={ dataUser.user }
                  className="w-full text-white bg-black p-1 border-white border"
                />
              </h1>
          }
          {
            !editNameUser
            ? <FaEdit onClick={ () => setEditNameUser(true) } className="text-2xl cursor-pointer" />
            : <BsCheckSquare
              onClick={() => {
                updateValue('user');
                setEditNameUser(false);
              }}
              className="text-2xl cursor-pointer"
            />
          }
        </div>
        <div className="flex items-center w-full justify-between pl-5 mb-2 gap-3">
          {
            !editNameChar
            ? <h1 className="capitalize text-xl text-center my-1 border border-transparent">
                {`(${dataUser.data.name === '' ? 'Sem nome': dataUser.data.name})`}
              </h1>
            : <h1 className="capitalize text-xl text-center">
                <input
                  type="text"
                  placeholder="Insira um nome"
                  onChange={ (e: any) => setDataUser({
                    ...dataUser,
                    data: {
                      ...dataUser.data,
                      name: e.target.value,
                    }
                  })}
                  value={ dataUser.data.name }
                  className="w-full text-white bg-black p-1 border-white border"
                />
              </h1>
          }
          {
            !editNameChar
            ? <FaEdit onClick={ () => setEditNameChar(true) } className="text-2xl cursor-pointer" />
            : <BsCheckSquare
              onClick={() => {
                updateDataValue('name');
                setEditNameChar(false);
              }}
              className="text-2xl cursor-pointer"
            />
          }
        </div>
        <div className="flex items-center w-full justify-between pl-5 mb-2 gap-2">
          <div className="flex items-center">
            <span className="font-bold pr-1">Tribo:</span>
            {
              !editTrybe
              ? <span className="capitalize my-1">{ dataUser.data.trybe === '' ? 'Indefinida' : dataUser.data.trybe }</span>
              : <div className="capitalize flex-col justify-between items-center">
                <select
                  className="w-full text-left py-1 bg-gray-whats-dark border-2 border-white cursor-pointer"
                  value={ dataUser.data.trybe }
                  onChange={ (e) => {
                    setDataUser({
                      ...dataUser,
                      data: {
                        ...dataUser.data,
                        trybe: e.target.value,
                      }
                    });
                  }}
                >
                  <option disabled value="">Escolha uma Tribo</option>
                  {
                    dataTrybes
                      .sort((a, b) => a.namePtBr.localeCompare(b.namePtBr))
                      .map((trybe, index) => (
                      <option
                        key={index}
                        value={ trybe.nameEn }
                      >
                        { trybe.namePtBr }
                      </option>
                    ))
                  }
                </select>
              </div>
            }
          </div>
          {
            !editTrybe
            ? <FaEdit onClick={ () => setEditTrybe(true) } className="text-2xl cursor-pointer" />
            : <BsCheckSquare
              onClick={() => {
                updateDataValue('trybe');
                setEditTrybe(false);
              }}
              className="text-2xl cursor-pointer"
            />
          }
        </div>
        <div className="flex items-center w-full justify-between pl-5 mb-2 gap-2">
          <div className="flex items-center">
            <span className="font-bold pr-1">Augúrio:</span>
            {
              !editAuspice
              ? <span className="capitalize my-1">{ dataUser.data.auspice === '' ? 'Indefinida' : dataUser.data.auspice }</span>
              : <div className="capitalize flex-col justify-between items-center">
                <select
                  className="w-full text-left py-1 bg-gray-whats-dark border-2 border-white cursor-pointer"
                  value={ dataUser.data.auspice }
                  onChange={ (e) => {
                    setDataUser({
                      ...dataUser,
                      data: {
                        ...dataUser.data,
                        auspice: e.target.value,
                      }
                    });
                  }}
                >
                  <option disabled value="">Escolha um Augúrio</option>
                  {
                    dataAuspices
                      .map((auspice, index) => (
                      <option
                        key={index}
                        value={ auspice.name }
                      >
                        { auspice.name }
                      </option>
                    ))
                  }
                </select>
              </div>
            }
          </div>
          {
            !editAuspice
            ? <FaEdit onClick={ () => setEditAuspice(true) } className="text-2xl cursor-pointer" />
            : <BsCheckSquare
              onClick={() => {
                updateDataValue('auspice');
                setEditAuspice(false);
              }}
              className="text-2xl cursor-pointer"
            />
          }
        </div>
        <div className="flex items-center w-full justify-between pl-5 mb-2 gap-2">
          <div className="flex items-center">
            <span className="font-bold pr-1">Fúria:</span>
            {
              !editRage
              ? <span className="capitalize my-1">{ dataUser.data.rage }</span>
              : <div className="capitalize flex-col justify-between items-center">
                <select
                  className="text-left py-1 bg-gray-whats-dark border-2 border-white cursor-pointer"
                  value={ dataUser.data.rage }
                  onChange={ (e) => {
                    setDataUser({
                      ...dataUser,
                      data: {
                        ...dataUser.data,
                        rage: e.target.value,
                      }
                    });
                  }}
                >
                  <option disabled value="">Escolha um valor de Fúria</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
            }
          </div>
          {
            !editRage
            ? <FaEdit onClick={ () => setEditRage(true) } className="text-2xl cursor-pointer" />
            : <BsCheckSquare
              onClick={() => {
                updateDataValue('rage');
                setEditRage(false);
              }}
              className="text-2xl cursor-pointer"
            />
          }
        </div>
        { returnWillpower(dataUser) }
        { returnHealth(dataUser) }
        <div className="mt-2 flex items-center w-full justify-between pl-5 mb-2 gap-2">
          <div className="flex items-center">
            <span className="font-bold pr-1">Harano:</span>
            {
              !editHarano
              ? <span className="capitalize my-1">{ dataUser.data.harano }</span>
              : <div className="capitalize flex-col justify-between items-center">
                <select
                  className="text-left py-1 bg-gray-whats-dark border-2 border-white cursor-pointer"
                  value={ dataUser.data.harano }
                  onChange={ (e) => {
                    setDataUser({
                      ...dataUser,
                      data: {
                        ...dataUser.data,
                        harano: e.target.value,
                      }
                    });
                  }}
                >
                  <option disabled value="">Escolha um valor de Harano</option>
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
            }
          </div>
          {
            !editHarano
            ? <FaEdit onClick={ () => setEditHarano(true) } className="text-2xl cursor-pointer" />
            : <BsCheckSquare
              onClick={() => {
                updateDataValue('harano');
                setEditHarano(false);
              }}
              className="text-2xl cursor-pointer"
            />
          }
        </div>
        <div className="mt-2 flex items-center w-full justify-between pl-5 mb-2 gap-2">
          <div className="flex items-center">
            <span className="font-bold pr-1">Hauglosk:</span>
            {
              !editHauglosk
              ? <span className="capitalize my-1">{ dataUser.data.hauglosk }</span>
              : <div className="capitalize flex-col justify-between items-center">
                <select
                  className="text-left py-1 bg-gray-whats-dark border-2 border-white cursor-pointer"
                  value={ dataUser.data.hauglosk }
                  onChange={ (e) => {
                    setDataUser({
                      ...dataUser,
                      data: {
                        ...dataUser.data,
                        hauglosk: e.target.value,
                      }
                    });
                  }}
                >
                  <option disabled value="">Escolha um valor de Hauglosk</option>
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
            }
          </div>
          {
            !editHauglosk
            ? <FaEdit onClick={ () => setEditHauglosk(true) } className="text-2xl cursor-pointer" />
            : <BsCheckSquare
              onClick={() => {
                updateDataValue('hauglosk');
                setEditHauglosk(false);
              }}
              className="text-2xl cursor-pointer"
            />
          }
        </div>
        <div className="mt-2 flex items-center w-full justify-between pl-5 mb-2 gap-2">
          <div className="flex items-center">
            <span className="font-bold pr-1">Forma:</span>
            {
              !editForm
              ? <span className="capitalize my-1">{ valueform }</span>
              : <div className="capitalize flex-col justify-between items-center">
                <select
                  className="text-left py-1 bg-gray-whats-dark border-2 border-white cursor-pointer"
                  value={ valueform }
                  onChange={ (e) => {
                    setValueForm(e.target.value);
                  }}
                >
                  <option disabled value="">Escolha um valor de Fúria</option>
                  <option value={'Hominídeo'}>Hominídeo</option>
                  <option value={'Glabro'}>Glabro</option>
                  <option value={'Crinos'}>Crinos</option>
                  <option value={'Hispo'}>Hispo</option>
                  <option value={'Lupino'}>Lupino</option>
                </select>
              </div>
            }
          </div>
          {
            !editForm
            ? <FaEdit onClick={ () => setEditForm(true) } className="text-2xl cursor-pointer" />
            : <BsCheckSquare
              onClick={() => {
                updateForm();
                setEditForm(false);
              }}
              className="text-2xl cursor-pointer"
            />
          }
        </div>
        <div className="flex items-center w-full justify-between pl-5">
          <p className="font-bold pr-1 mt-3">Renome</p>
          {
            !editRenown
            ? <FaEdit onClick={ () => setEditRenown(true) } className="text-2xl cursor-pointer" />
            : <BsCheckSquare
              onClick={() => {
                updateRenown();
                setEditRenown(false);
              }}
              className="text-2xl cursor-pointer"
            />
          }
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full pl-5 pt-2 gap-2">
        {
          !editRenown
          ? <h1 className="capitalize text-left my-1 border border-transparent">
              Honra: { dataUser.data.honor }
            </h1>
          : <h1 className="capitalize text-center">
              <p className="text-left">Honra:</p>
              <input
                type="text"
                onChange={ (e: any) => setDataUser({
                  ...dataUser,
                  data: {
                    ...dataUser.data,
                    honor: e.target.value,
                  },
                })}
                value={ dataUser.data.honor }
                className="w-full text-center text-white bg-black p-1 border-white border"
              />
            </h1>
          }
          {
            !editRenown
            ? <h1 className="capitalize text-left my-1 border border-transparent">
                Glória: { dataUser.data.glory }
              </h1>
            : <h1 className="capitalize text-center">
                <p className="text-left">Glória:</p>
                <input
                  type="text"
                  onChange={ (e: any) => setDataUser({
                    ...dataUser,
                    data: {
                      ...dataUser.data,
                      glory: e.target.value,
                    },
                  })}
                  value={ dataUser.data.glory }
                  className="w-full text-white text-center bg-black p-1 border-white border"
                />
              </h1>
          }
          {
            !editRenown
            ? <h1 className="capitalize text-left my-1 border border-transparent">
                Sabedoria: { dataUser.data.wisdom }
              </h1>
            : <h1 className="capitalize text-center">
                <p className="text-left">Sabedoria:</p>
                <input
                  type="text"
                  onChange={ (e: any) => setDataUser({
                    ...dataUser,
                    data: {
                      ...dataUser.data,
                      wisdom: e.target.value,
                    },
                  })}
                  value={ dataUser.data.wisdom }
                  className="w-full text-white bg-black p-1 border-white border text-center"
                />
              </h1>
          }
        </div>
        <div className="mt-3 flex items-center w-full justify-between pl-5">
          <p className="font-bold pr-1 mt-3">Atributos</p>
          {
            !editAttributes
            ? <FaEdit onClick={ () => setEditAttributes(true) } className="text-2xl cursor-pointer" />
            : <BsCheckSquare
              onClick={() => {
                updateDataValue('attributes');
                setEditAttributes(false);
              }}
              className="text-2xl cursor-pointer"
            />
          }
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full pl-5 pt-2 gap-2">
          {
            Object.entries(dataUser.data.attributes).map(([chave, valor]: any, index: number) => {
              if(!editAttributes) {
                return (
                  <div className="capitalize text-left" key={index}>
                    {chave}: {valor}
                  </div>
                );
              } else {
                return(
                  <h1 className="capitalize text-center" key={index}>
                    <p className="text-left">{chave}</p>
                    <input
                      type="text"
                      onChange={ (e: any) => {
                        let valueAttribute = e.target.value;
                        if (Number(valueAttribute) > 6) valueAttribute = 6;
                        setDataUser({
                          ...dataUser,
                          data: {
                            ...dataUser.data,
                            attributes: {
                              ...dataUser.data.attributes,
                              [chave]: Number(valueAttribute),
                            },
                          },
                        })}}
                      value={ valor }
                      className="w-full text-center text-white bg-black p-1 border-white border"
                    />
                  </h1>
                );
              }
            })
          }
        </div>
        <div className="mt-3 flex items-center w-full justify-between pl-5">
          <p className="font-bold pr-1 mt-3">Habilidades</p>
          {
            !editSkills
            ? <FaEdit onClick={ () => setEditSkills(true) } className="text-2xl cursor-pointer" />
            : <BsCheckSquare
              onClick={() => {
                updateDataValue('skills');
                setEditSkills(false);
              }}
              className="text-2xl cursor-pointer"
            />
          }
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full pl-5 pt-2 gap-2">
          {
            Object.entries(dataUser.data.skills).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)).map(([chave, valor]: any, index) => {
              if(!editSkills) {
                {
                  if (valor.value !== 0)
                  return (
                    <div className="capitalize text-left w-full" key={index}>
                      {chave}: { valor.value }
                      {valor.specialty === '' ? '' : ` (${valor.specialty} ${valor.value + 1})`}
                    </div>
                  )
                }
              } else {
                return(
                  <h1 className="capitalize text-center" key={index}>
                    <p className="text-left">{chave}</p>
                    <input
                      type="text"
                      onChange={ (e: any) => {
                        let valueSkill = e.target.value;
                        if (Number(valueSkill) > 6) valueSkill = 6;
                        setDataUser({
                          ...dataUser,
                          data: {
                            ...dataUser.data,
                            skills: {
                              ...dataUser.data.skills,
                              [chave]: {
                                ...dataUser.data.skills[chave],
                                value: Number(valueSkill),
                              }
                            },
                          },
                        })}}
                      value={ valor.value }
                      className="w-full text-center text-white bg-black p-1 border-white border"
                    />
                    <input
                      type="text"
                      placeholder="Especialização"
                      onChange={ (e: any) => {
                        let valueSkill = e.target.value;
                        setDataUser({
                          ...dataUser,
                          data: {
                            ...dataUser.data,
                            skills: {
                              ...dataUser.data.skills,
                              [chave]: {
                                ...dataUser.data.skills[chave],
                                specialty: valueSkill,
                              }
                            },
                          },
                        })}}
                      value={ valor.specialty }
                      className="mt-1 w-full text-center text-white bg-black p-1 border-white border text-sm"
                    />
                  </h1>
                );
              }
            })
          }
        </div>
        <div className="mt-3 flex items-center w-full justify-between pl-5">
          <p className="font-bold pr-1 w-full text-left mt-3">Dons</p>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
        <div className="flex items-center justify-start flex-wrap w-full gap-1 pl-5">
          { 
            dataUser.data.gifts.length === 0
              ? <p className="text-left">Nenhum</p>
              : dataUser.data.gifts.map((gift: any, index: number) => (
                  <button
                    type="button"
                    className="text-center border border-transparent hover:border-white rounded-full px-2 py-1"
                    key={index}
                    onClick={ () => dispatch(actionPopupGift({ show: true, gift: gift })) }
                  >
                    { gift.giftPtBr }
                  </button>
                ))
          }
        </div>
        <div className="mt-3 flex items-center w-full justify-between pl-5">
          <p className="font-bold pr-1 w-full text-left mt-3">Rituais</p>
          <FaEdit className="text-2xl cursor-pointer" />
        </div>
        <div className="flex items-center justify-start flex-wrap w-full gap-1 pl-5">
          { 
            dataUser.data.rituals.length === 0
              ? <p className="text-center">Nenhum</p>
              : dataUser.data.rituals.map((ritual: any, index: number) => (
                  <button
                    className="text-center border border-transparent hover:border-white rounded-full px-2 py-1"
                    key={index}
                    onClick={ () => dispatch(actionPopupRitual({ show: true, ritual: ritual })) }
                  >
                    { ritual.titlePtBr }
                  </button>
                ))
          }
        </div>
        <div className="w-full">
          <div className="mt-3 flex items-center w-full justify-between pl-5">
            <p className="font-bold pr-1 w-full text-left mt-3">Vantagens</p>
            <FaEdit className="text-2xl cursor-pointer" />
          </div>
          <div className="flex items-center justify-start flex-wrap w-full gap-1 pl-5">
          {
            dataUser.data.advantagesAndFlaws.map((adv: any, index: number) => {
              if (adv.advantages.length > 0) {
                return(
                  <div key={index}>
                    {
                      <button
                        type="button"
                        className="w-full"
                        onClick={ () => dispatch(actionShowAdvantage({ show: true, item: adv })) }
                      >
                        <p className="text-center border border-transparent hover:border-white rounded-full px-2 py-1">{ adv.name }({returnSumPoints(adv.advantages)})</p>
                      </button>
                    }
                  </div>
                );
              } return null;
              }
            )
          }
        </div>
        </div>
        <div className="w-full">
          <div className="mt-3 flex items-center w-full justify-between pl-5">
            <p className="font-bold pr-1 w-full text-left mt-3">Desvantagens</p>
            <FaEdit className="text-2xl cursor-pointer" />
          </div>
          <div className="flex items-center justify-start flex-wrap w-full gap-1 pl-5">
          {
            dataUser.data.advantagesAndFlaws.map((adv: any, index: number) => {
              if (adv.flaws.length > 0) {
                return <div key={index}>
                  {
                    <button
                      type="button"
                      className="w-full"
                      onClick={ () => dispatch(actionShowAdvantage({ show: true, item: adv })) }
                    >
                      <p className="text-center border border-transparent hover:border-white rounded-full px-2 py-1">{ adv.name }({returnSumPoints(adv.flaws)})</p>
                    </button>
                  }
              </div>
              } return null;
              }
            )
          }
          </div>
        </div>
        <div className="flex items-center w-full justify-between pl-5 mb-2 gap-2">
          <div className="flex flex-col items-center w-full">
            <div className="mt-3 flex items-center w-full justify-between">
              <p className="font-bold pr-1 mt-3">Background</p>
              {
                !editbackground
                ? <FaEdit onClick={ () => setEditBackground(true) } className="text-2xl cursor-pointer" />
                : <BsCheckSquare
                  onClick={() => {
                    updateDataValue('background');
                    setEditBackground(false);
                  }}
                  className="text-2xl cursor-pointer"
                />
              }
            </div>
            {
              !editbackground
              ? <div className="my-1">
                  <p className="text-justify">{ dataUser.data.background }</p>
                </div>
              : <div className="flex-col justify-between items-center w-full">
                <textarea
                  className="text-left py-1 bg-gray-whats-dark border-2 border-white w-full mt-3 p-3 text-justify resize-none overflow-hidden"
                  value={ dataUser.data.background }
                  rows={16}
                  onChange={ (e) => {
                    setDataUser({
                      ...dataUser,
                      data: {
                        ...dataUser.data,
                        background: e.target.value,
                      }
                    });
                  }}
                >
                </textarea>
              </div>
            }
          </div>
        </div>
        <p className="mt-3 text-left w-full pl-5 mb-3">
          <span className="font-bold pr-1 w-full text-left">Ficha criada em:</span>
          <span>{ dataUser.creationDate }</span>
        </p>
      </div>
      }
    </div>
  );
}