import contexto from "@/context/context";
import { useContext, useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Skills from "../player/skills";
import AdvantagesAndFlaws from "../player/advantagesAndFlaws";
import General from "../player/general";
import Rituals from "../player/rituals";
import Anotations from "../player/notes";
import Gifts from "../player/gifts";
import Details from "../player/details";
import Attributes from "../player/attributes";
import Forms from "../player/forms";
import Background from "../player/background";
import HaranoHauglosk from "./haranoHauglosk";
import GiftRoll from "./giftRoll";
import RitualRoll from "./ritualRoll";
import Touchstones from "../player/touchstones";
import Principles from "../player/principles";
import FavorsAndBans from "../player/favorsAndBans";
import Notifications from "../player/notifications";
import Players from "../player/players";
import firebaseConfig from "@/firebase/connection";
import { collection, getFirestore, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import EditImage from "./editImage";

export default function MenuPlayer() {
  const {
    dataSheet, setDataSheet,
    session,
    email,
    players,
    showHarano, setShowHarano,
    showHauglosk, setShowHauglosk,
    showGiftRoll, setShowGiftRoll,
    showRitualRoll, setShowRitualRoll,
    optionSelect, setOptionSelect,
    sheetId,
    listNotification,
    setListNotification,
    setShowEvaluateSheet,
    setShowMenuSession,
  } = useContext(contexto);

  const db = getFirestore(firebaseConfig);
  const sessionRef = collection(db, 'notifications');
  const querySession = query(sessionRef, where('sessionId', '==', session.id));
  const [notifications] = useCollectionData(querySession, { idField: 'id' } as any);

  useEffect(() => {
    if (notifications) {
      const allLists = notifications.flatMap(notification => notification.list || []);
      setListNotification(allLists);
    }
  }, [notifications, setListNotification]);

  useEffect(() => {
    if (sheetId && optionSelect === 'players') {
      setOptionSelect('general');
      setDataSheet(players.find((player: any) => player.id === sheetId));
    }
  }, [sheetId, dataSheet])


	const returnDataSheet = () => {
    switch(optionSelect) {
      case ('players'): return (<Players />);
      case ('notifications'): return (<Notifications />);
      case ('attributes'): return (<Attributes />);
      case ('skills'): return (<Skills />);
      case ('advantages-flaws'): return (<AdvantagesAndFlaws />);
      case ('forms'): return (<Forms />);
      case ('session'): return (<Details />);
      case ('touchstones'): return (<Touchstones />);
      case ('background'): return (<Background type="background" />);
      case ('principles-of-the-chronicle'): return (<Principles />);
      case ('favor-ban'): return (<FavorsAndBans />);
      case ('anotations'): return (<Anotations type="notes" />);
      case ('gifts'): return (<Gifts />);
      case ('rituals'): return (<Rituals />);
      default: return (<General />);
    }
  };

  return(
    <div className={`md:w-3/5 absolute sm:relative z-50 w-8/10 px-5 sm:px-8 pb-8 pt-3 sm-p-10 ${showHarano || showHauglosk || showGiftRoll.show || showRitualRoll.show ? 'bg-black' : 'bg-gray-whats-dark'} flex flex-col items-center h-screen z-50 top-0 right-0 text-white`}>
      <div className="w-full flex justify-end my-1">
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer mb-2"
          onClick={ () => {
            if (showHarano || showHauglosk || showGiftRoll.show || showRitualRoll.show) {
              setShowHarano(false);
              setShowHauglosk(false);
              setShowGiftRoll({ show: false, gift: {}});
              setShowRitualRoll({ show: false, ritual: {}});
            } else setShowMenuSession('');
            setShowEvaluateSheet({ show: false, data: '' });
          }}
        />
      </div>
      <div className="w-full h-full">
        { 
          !showHarano
          && !showHauglosk
          && !showGiftRoll.show
          && !showRitualRoll.show
          && <div className="w-full h-full">
          <select
            value={optionSelect}
            onChange={ (e) => {
            setOptionSelect(e.target.value);
            }}
            className="w-full mb-2 border border-white p-3 cursor-pointer bg-black text-white flex items-center justify-center font-bold text-center"
        >
            <option value={'players'}>Personagens</option>
            {
              email === session.gameMaster &&
              <option value={'notifications'}>Notificações { listNotification.length > 0 ? '(' + listNotification.length + ')' : ''}</option>
            }
            { sheetId !== '' && <option value={'general'}>Geral</option> }
            { sheetId !== '' && <option value={'attributes'}>Atributos</option> }
            { sheetId !== '' && <option value={'skills'}>Habilidades</option> }
            { sheetId !== '' && <option value={'gifts'}>Dons</option> }
            { sheetId !== '' && <option value={'rituals'}>Rituais</option> }
            { sheetId !== '' && <option value={'touchstones'}>Pilares</option> }
            { sheetId !== '' && <option value={'advantages-flaws'}>Vantagens e Defeitos</option> }
            { sheetId !== '' && <option value={'forms'}>Formas ( Atual: { dataSheet.data.form } )</option> }
            <option value={'principles-of-the-chronicle'}>Princípios da Crônica</option>
            <option value={'favor-ban'}>Favores e Proibições</option>
            { sheetId !== '' && <option value={'background'}>Background</option> }
            <option value={'anotations'}>Anotações</option>
            <option value={'session'}>Sessão</option>
          </select>
            { returnDataSheet() }
          </div>
        }
        { showGiftRoll.show && <GiftRoll /> }
        { showRitualRoll.show && <RitualRoll /> }
        { showHarano && <HaranoHauglosk type="Harano" /> }
        { showHauglosk && <HaranoHauglosk type="Hauglosk" /> }
      </div>
    </div>
  );
}