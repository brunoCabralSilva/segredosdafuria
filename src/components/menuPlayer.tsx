import contexto from "@/context/context";
import { useContext, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Skills from "./menuSession/skills";
import AdvantagesAndFlaws from "./advantagesAndFlaws/advantagesAndFlaws";
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
import RageTest from "./popup/rageTest";
import WillpowerTest from "./popup/willpowerTest";
import { sheetStructure } from "@/firebase/utilities";
import Chat from "./menuSession/chat";
import { useRouter } from "next/navigation";
import SessionLink from "./menuSession/sessionLink";

export default function MenuPlayer(props: { standalone?: boolean }) {
  const { standalone = false } = props;
  const router = useRouter();
  const {
    dataSheet, setDataSheet,
    session,
    email,
    players,
    showRageTest, setShowRageTest,
    showWillpowerTest, setShowWillpowerTest,
    showHarano, setShowHarano,
    showHauglosk, setShowHauglosk,
    showGiftRoll, setShowGiftRoll,
    showRitualRoll, setShowRitualRoll,
    optionSelect, setOptionSelect,
    sheetId,
    showBattle,
    listNotification,
    setShowConsentForm,
    setListNotification,
    setShowEvaluateSheet,
    setShowMenuSession,
  } = useContext(contexto);

  const db = getFirestore(firebaseConfig);
  const sessionRef = collection(db, 'notifications');
  const querySession = query(sessionRef, where('sessionId', '==', session?.id || '__no_session__'));
  const [notifications] = useCollectionData(querySession, { idField: 'id' } as any);

  useEffect(() => {
    if (notifications) {
      const allLists = notifications.flatMap(notification => notification.list || []);
      setListNotification(allLists);
    }
  }, [notifications, setListNotification]);

  useEffect(() => {
    if (sheetId && optionSelect === 'players') {
      const playerFounded = players.find((player: any) => player.id === sheetId);
      if (playerFounded) setDataSheet(playerFounded);
      else setDataSheet(sheetStructure('', '', ''));
    }
  }, [sheetId, dataSheet, optionSelect, players, setDataSheet]);

  const hasSpecialRollOpen = showRageTest || showHarano || showHauglosk || showGiftRoll.show || showRitualRoll.show || showWillpowerTest;

  const returnDataSheet = () => {
    switch (optionSelect) {
      case 'players': return (<Players />);
      case 'chat': return (<Chat sidebar />);
      case 'notifications': return (<Notifications />);
      case 'history': return (<History />);
      case 'attributes': return (<Attributes />);
      case 'skills': return (<Skills />);
      case 'advantages-flaws': return (<AdvantagesAndFlaws />);
      case 'forms': return (<Forms />);
      case 'session': return (<Details />);
      case 'touchstones': return (<Touchstones />);
      case 'background': return (<Background type="background" />);
      case 'principles-of-the-chronicle': return (<Principles />);
      case 'favor-ban': return (<FavorsAndBans />);
      case 'consent': return (<Consent />);
      case 'anotations': return (<Anotations type="notes" />);
      case 'gifts': return (<Gifts />);
      case 'rituals': return (<Rituals />);
      case 'session-link': return (<SessionLink />);
      // default: return (<General />);
    }
  };

  return (
    <div className={`${standalone ? 'w-full h-full relative' : 'w-full md:w-3/5 absolute sm:relative top-0 right-0 h-screen'} z-50 px-5 sm:px-8 pb-8 pt-3 sm-p-10 ${hasSpecialRollOpen ? 'bg-black' : 'bg-gray-whats-dark'} flex flex-col items-center text-white overflow-y-auto`}>
      <div className="w-full flex justify-end my-1">
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer mb-2"
          onClick={() => {
            if (standalone) {
              router.push('/sheets');
              return;
            }

            if (hasSpecialRollOpen) {
              setShowRageTest(false);
              setShowHarano(false);
              setShowHauglosk(false);
              setShowGiftRoll({ show: false, gift: {} });
              setShowRitualRoll({ show: false, ritual: {} });
              setShowWillpowerTest(false);
            } else {
              setShowMenuSession('');
            }
            setShowEvaluateSheet({ show: false, data: '' });
            setShowConsentForm(false);
          }}
        />
      </div>
      <div className="w-full h-full">
        {
          !showRageTest
          && !showHarano
          && !showHauglosk
          && !showGiftRoll.show
          && !showRitualRoll.show
          && !showWillpowerTest
          && <div className="w-full h-full">
            <select
              value={optionSelect}
              onChange={(e) => {
                setOptionSelect(e.target.value);
              }}
              className="w-full mb-2 border border-white p-3 cursor-pointer bg-black text-white flex items-center justify-center font-bold text-center"
            >
              {!standalone && <option value={'players'}>Personagens</option>}
              {
                !standalone
                && email === session.gameMaster
                && <option value={'notifications'}>Notificacoes {listNotification.length > 0 ? `(${listNotification.length})` : ''}</option>
              }
              {!standalone && <option value={'history'}>Historico</option>}
              {sheetId !== '' && <option value={'general'}>Geral</option>}
              {sheetId !== '' && <option value={'attributes'}>Atributos</option>}
              {sheetId !== '' && <option value={'skills'}>Habilidades</option>}
              {sheetId !== '' && <option value={'gifts'}>Dons</option>}
              {sheetId !== '' && <option value={'rituals'}>Rituais</option>}
              {sheetId !== '' && <option value={'touchstones'}>Pilares</option>}
              {sheetId !== '' && <option value={'advantages-flaws'}>Vantagens e Defeitos</option>}
              {standalone && <option value={'session-link'}>Vincular com Sessao</option>}
              {!standalone && sheetId !== '' && <option value={'forms'}>Formas {dataSheet && dataSheet.data && dataSheet.data.form ? `( Atual: ${dataSheet.data.form} )` : ''} </option>}
              {!standalone && <option value={'principles-of-the-chronicle'}>Principios da Cronica</option>}
              {!standalone && <option value={'favor-ban'}>Favores e Proibicoes</option>}
              {!standalone && <option value={'consent'}>Ficha de Consentimento</option>}
              {sheetId !== '' && <option value={'background'}>Background</option>}
              {!standalone && <option value={'anotations'}>Anotacoes</option>}
              {!standalone && <option value={'session'}>Sessao</option>}
              {!standalone && showBattle.show && <option value={'chat'}>Chat</option>}
            </select>
            {returnDataSheet()}
          </div>
        }
        {showGiftRoll.show && <GiftRoll />}
        {showRitualRoll.show && <RitualRoll />}
        {showRageTest && <RageTest />}
        {showHarano && <HaranoHauglosk type="Harano" />}
        {showHauglosk && <HaranoHauglosk type="Hauglosk" />}
        {showWillpowerTest && <WillpowerTest />}
      </div>
    </div>
  );
}
