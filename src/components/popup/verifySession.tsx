'use client'

import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from "react";
import contexto from '@/context/context';
import { AiFillCloseCircle } from 'react-icons/ai';
import Loading from '../loading';
import { getNameAndDmFromSessions } from '@/firebase/sessions';
import { authenticate } from '@/firebase/authenticate';
import { getPlayersBySession } from '@/firebase/players';
import { getNotificationBySession, requestApproval } from '@/firebase/notifications';

export default function VerifySession() {
  const router = useRouter();
  const [popup, setPopup] = useState('');
  const [name, setName] = useState('');
  const { dataUser, dataSession, setDataSession, setShowMessage, setOptionSelect } = useContext(contexto);

  useEffect(() => {
    requestSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestSession = async () => {
    try {
      let email = '';
      if (dataUser.email !== '' && dataUser.displayName !== '') email = dataUser.email;
      else {
        const authData: any = await authenticate(setShowMessage);
        if (!authData || !authData.email || !authData.displayName) {
          router.push('/login');
        } else email = authData.email;
      }
      const getData = await getNameAndDmFromSessions(dataSession.id);
      if (getData) {
        setName(getData.name);
        if (email === getData.gameMaster || email == 'bruno.cabral.silva2018@gmail.com') {
          router.push(`/sessions/${dataSession.id}`);
          setOptionSelect('players');
        } else {
          setOptionSelect('general');
          const notifications = await getNotificationBySession(dataSession.id, setShowMessage);
          let authNotification = false;
          notifications.forEach((notification: { email: string, type: string }) => {
            if (notification.email === email && notification.type === 'approval') authNotification = true;
          });
          if (authNotification) {
            setPopup('waiting');
          } else {
            let auth = false;
            const getPlayers = await getPlayersBySession(dataSession.id, setShowMessage);
            getPlayers.forEach((player: any) => {
              if (player === email) auth = true;
            });
            if (auth) {
              router.push(`/sessions/${dataSession.id}`);
            } else setPopup('authorization');
          }
        }
      }
    } catch(error) {
      setShowMessage({ show: true, text: 'Ocorreu um erro: ' + error });
    }
  };

  const closePopup = () => setDataSession({ show: false, id: '' });

  const returnNotification = () => {
    switch (popup) {
      case 'authorization':
        return (
          <>
            <div className="flex flex-col gap-3 font-geist-mono text-xs leading-6 text-white/80 sm:text-[13px]">
              <p>Olá, tudo bem?</p>
              <p>Notamos que você é novo nesta Sessão.</p>
              <p>
                Como é a sua primeira vez por aqui, podemos encaminhar uma notificação
                para que o Narrador da Sessão possa autorizar seu acesso, que tal?
              </p>
            </div>
            <div className="mt-5 flex w-full gap-3">
              <button
                type="button"
                onClick={closePopup}
                className="inline-flex flex-1 items-center justify-center border border-zinc-600/50 bg-black/70 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:border-zinc-400/70"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  await requestApproval(dataSession.id, requestApproval);
                  setPopup('send');
                }}
                className="inline-flex flex-1 items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
              >
                Solicitar
              </button>
            </div>
          </>
        );
      case 'waiting':
        return (
          <p className="font-geist-mono text-xs leading-6 text-white/80 sm:text-[13px]">
            Voce já enviou uma solicitação para ter acesso a esta Sessão. Assim que
            possível, o Narrador avaliará sua petição.
          </p>
        );
      case 'send':
        return (
          <p className="font-geist-mono text-xs leading-6 text-white/80 sm:text-[13px]">
            Tudo pronto! Enviamos uma solicitação ao Narrador e logo mais ele responderá.
            Por favor, aguarde até a resposta dele.
          </p>
        );
      default:
        return (
          <div className="flex min-h-[120px] items-center justify-center">
            <Loading />
          </div>
        );
    }
  };

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6">
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden border border-zinc-500/40 bg-zinc-950/85">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/wallpapers/128.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/90" />

        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 z-20 text-2xl text-white/70 transition-colors hover:text-red-400"
          aria-label="Fechar verificação da sessão"
        >
          <AiFillCloseCircle />
        </button>

        <div className="relative z-10 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <h2 className="mt-2 font-kingthings text-2xl sm:text-xl uppercase">
            {name !== '' ? name : 'Sessão'}
          </h2>
        </div>

        <div className="relative z-10 flex flex-col gap-4 px-5 pb-5 sm:px-8 sm:pb-8">
          {returnNotification()}
        </div>
      </div>
    </div>
  );
}
