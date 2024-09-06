'use client'

import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from "react";
import contexto from '@/context/context';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { requestApproval } from '@/new/firebase/notifications';
import Loading from '../loading';
import { getNameAndDmFromSessions } from '@/new/firebase/sessions';
import { authenticate } from '@/new/firebase/authenticate';

export default function VerifySession() {
  const router = useRouter();
  const [popup, setPopup] = useState('');
  const [name, setName] = useState('');
	const { dataUser, dataSession, setDataSession } = useContext(contexto);

  useEffect(() => {
    requestSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const requestSession = async () => {
    try {
      let email = '';
      let displayName = '';
      if (dataUser.email !== '', dataUser.displayName !== '') {
        email = dataUser.email;
        displayName = dataUser.displayName;
      } else {
        const authData: any = await authenticate();
        if (!authData || !authData.email || !authData.displayName) {
          router.push('/new/login');
        } else {
          email = authData.email;
          displayName = authData.displayName;
        }
      }
      const getData = await getNameAndDmFromSessions(dataSession.id);
      if (getData) {
        setName(getData.name);
        if (email === getData.gameMaster) {
          router.push(`/new/sessions/${dataSession.id}`);
        } else {
          const notifications = getData.notifications;
          let authNotification = false;
          notifications.forEach((notification: { email: string, type: string }) => {
            if (notification.email === email && notification.type === 'approval') authNotification = true;
          });
          if (authNotification) {
            setPopup('waiting');
          } else {
            let auth = false;
            getData.players.forEach((player: { email: string }) => {
              if (player.email === email) auth = true;
            });
            if (auth) {
              router.push(`/new/sessions/${dataSession.id}`);
            } else setPopup('authorization');
          }
        }
      }
    } catch(error) {
      window.alert("Ocorreu um erro: " + error);
    }
  }

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
              onClick={ () => setDataSession({ show: false, id: '' }) }
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={ async () => {
                await requestApproval(dataSession.id);
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
        return (<Loading />);
    }
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={ () => setDataSession({ show: false, id: '' }) }
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