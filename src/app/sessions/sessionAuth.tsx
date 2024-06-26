'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionLoginInTheSession, actionSessionAuth, useSlice } from "@/redux/slice";
import { updateDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { authenticate } from "@/firebase/new/authenticate";
import { getNameAndDmFromSessions } from "@/firebase/sessions";
import { getNotificationById } from "@/firebase/notifications";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function SessionAuth() {
  const dispatch = useAppDispatch();
  const slice = useAppSelector(useSlice);
  const router = useRouter();
  const [popup, setPopup] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    requestSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const requestSession = async () => {
    try {
      const sessionId = slice.sessionAuth.id;
      const authData: any = await authenticate();
      if (authData && authData.email && authData.displayName) {
        const { email } = authData;
        const getData = await getNameAndDmFromSessions(sessionId);
        if (getData) {
          setName(getData.name);
          if (email === getData.dm) {
            router.push(`/sessions/${sessionId}`);
            dispatch(actionLoginInTheSession({ id: sessionId, logged: true }));
          } else {
            const notifications = getData.notifications;
            let authNotification = false;
            notifications.forEach((notification: { email: string, type: string }) => {
              if (notification.email === email && notification.type === 'approval') authNotification = true;
            });
            if (authNotification) {
              setPopup('waiting');
            } else {
              const sessionNew = getData;
              let auth = false;
              sessionNew.players.forEach((player: { email: string }) => {
                if (player.email === email) auth = true;
              });
              if (auth) {
                router.push(`/sessions/${sessionId}`);
                dispatch(actionLoginInTheSession({ id: sessionId, logged: true }));
              } else setPopup('authorization');
            }
          }
        }
      } else router.push('/login');
    } catch(error) {
      window.alert("Ocorreu um erro: " + error);
    }
  }
  
  const capitalize = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const sendNotification = async () => {
    try {
      const authData: any = await authenticate();
      if (authData && authData.email && authData.displayName) {
        const { email, displayName: name } = authData;
        const sessionDocSnapshot = await getNotificationById(slice.sessionAuth.id);
        if (sessionDocSnapshot) {
          const sendNot = sessionDocSnapshot.data();
          const updatedNotifications = [
            ...sendNot.notifications,
            {
              message: `O Usuário ${capitalize(name)} de email "${email}" solicitou acesso à sua Sessão.`,
              email: email,
              type: 'approval',
              user: name,
            }
          ];
          await updateDoc(sessionDocSnapshot.ref, { notifications: updatedNotifications });
        } else {
          window.alert("Ocorreu um erro. Por favor, tente novamente solicitar o acesso.");
        }
      } else router.push('/login');
    } catch(error) {
      window.alert("Ocorreu um erro: " + error);
    }
  };

  const returnNotification = () => {
    switch(popup) {
      case 'authorization':
        return (<div>
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              {`Olá, tudo bem?`}
            </p>
            <p className="text-white w-full text-center pb-3">
              Notamos que você é novo nesta Sessão.
            </p>
            <p className="text-white w-full text-center pb-3">
              Como é a sua primeira vez por aqui, podemos encaminhar uma notificação para que o Narrador da Sessão possa autorizar seu acesso, que tal?
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={ () => dispatch(actionSessionAuth({ show: false, id: '' })) }
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={ () => {
                sendNotification();
                setPopup('send');
              }}
              className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Solicitar
            </button>
          </div>
        </div>);
      case 'waiting':
        return (<div className="text-white text-center">Você já enviou uma solicitação para ter acesso a esta Sessão. Assim que possível, o Narrador irá avaliar sua petição.</div>);
      case 'send':
        return (<div className="text-white text-center">Tudo pronto! Enviamos uma solicitação ao Narrador e logo mais ele responderá! Por favor, aguarde até a resposta dele.</div>);
      default:
        return (
          <div className="bg-black/80 text-white flex items-center justify-center flex-col">
            <span className="loader z-50" />
          </div>
        );
    }
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => dispatch(actionSessionAuth({ show: false, id: '' }))}
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <h1 className="text-white text-2xl w-full text-center pb-10 capitalize">{ name }</h1>
          { returnNotification() }
        </div>
      </div>
    </div>
  );
}