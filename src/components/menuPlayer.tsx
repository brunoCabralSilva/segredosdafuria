import contexto from "@/context/context";
import { useContext, useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Skills from "./menuSession/skills";
import AdvantagesAndFlaws from "./advantagesAndFlaws/advantagesAndFlaws";
import General from "./menuSession/general";
import Rituals from "./rituals/rituals";
import Anotations from "./menuSession/notes";
import Gifts from "./menuSession/gifts";
import Details from "./menuSession/details";
import Attributes from "./menuSession/attributes";
import Background from "./menuSession/background";
import HaranoHauglosk from "./popup/haranoHauglosk";
import GiftRoll from "./gifts/giftRoll";
import RitualRoll from "./rituals/ritualRoll";
import Touchstones from "./menuSession/touchstones";
import Principles from "./menuSession/principles";
import FavorsAndBans from "./menuSession/favorsAndBans";
import Notifications from "./menuSession/notifications";
import Players from "./menuSession/players";
import firebaseConfig from "@/firebase/connection";
import { collection, getFirestore, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Consent from "./menuSession/consent";
import History from "./menuSession/history";
import Forms from "./menuSession/forms";
import WillpowerTest from "./popup/willpowerTest";

export default function MenuPlayer() {
  const {
    dataSheet, setDataSheet,
    session,
    email,
    players,
    showWillpowerTest, setShowWillpowerTest,
    showHarano, setShowHarano,
    showHauglosk, setShowHauglosk,
    showGiftRoll, setShowGiftRoll,
    showRitualRoll, setShowRitualRoll,
    optionSelect, setOptionSelect,
    sheetId,
    listNotification,
    setShowConsentForm,
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
      case ('history'): return (<History />);
      case ('attributes'): return (<Attributes />);
      case ('skills'): return (<Skills />);
      case ('advantages-flaws'): return (<AdvantagesAndFlaws />);
      case ('forms'): return (<Forms />);
      case ('session'): return (<Details />);
      case ('touchstones'): return (<Touchstones />);
      case ('background'): return (<Background type="background" />);
      case ('principles-of-the-chronicle'): return (<Principles />);
      case ('favor-ban'): return (<FavorsAndBans />);
      case ('consent'): return (<Consent />);
      case ('anotations'): return (<Anotations type="notes" />);
      case ('gifts'): return (<Gifts />);
      case ('rituals'): return (<Rituals />);
      default: return (<General />);
    }
  };

  return(
    <div className={`md:w-3/5 absolute sm:relative z-50 w-8/10 px-5 sm:px-8 pb-8 pt-3 sm-p-10 ${showHarano || showHauglosk || showGiftRoll.show || showRitualRoll.show || showWillpowerTest ? 'bg-black' : 'bg-gray-whats-dark'} flex flex-col items-center h-screen z-50 top-0 right-0 text-white`}>
      <div className="w-full flex justify-end my-1">
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer mb-2"
          onClick={ () => {
            if (showHarano || showHauglosk || showGiftRoll.show || showRitualRoll.show || showWillpowerTest) {
              setShowHarano(false);
              setShowHauglosk(false);
              setShowGiftRoll({ show: false, gift: {}});
              setShowRitualRoll({ show: false, ritual: {}});
              setShowWillpowerTest(false);
            } else setShowMenuSession('');
            setShowEvaluateSheet({ show: false, data: '' });
            setShowConsentForm(false);
          }}
        />
      </div>
      <div className="w-full h-full">
        { 
          !showHarano
          && !showHauglosk
          && !showGiftRoll.show
          && !showRitualRoll.show
          && !showWillpowerTest
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
            <option value={'history'}>Histórico</option>
            { sheetId !== '' && <option value={'general'}>Geral</option> }
            { sheetId !== '' && <option value={'attributes'}>Atributos</option> }
            { sheetId !== '' && <option value={'skills'}>Habilidades</option> }
            { sheetId !== '' && <option value={'gifts'}>Dons</option> }
            { sheetId !== '' && <option value={'rituals'}>Rituais</option> }
            { sheetId !== '' && <option value={'touchstones'}>Pilares</option> }
            { sheetId !== '' && <option value={'advantages-flaws'}>Vantagens e Defeitos</option> }
            { sheetId !== '' && <option value={'forms'}>Formas { dataSheet && dataSheet.data && dataSheet.data.form ? `( Atual: ${ dataSheet.data.form } )` : '' } </option> }
            <option value={'principles-of-the-chronicle'}>Princípios da Crônica</option>
            <option value={'favor-ban'}>Favores e Proibições</option>
            <option value={'consent'}>Ficha de Consentimento</option>
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
        { showWillpowerTest && <WillpowerTest type="type" /> }
      </div>
    </div>
  );
}