'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionLoginInTheSession, actionSessionAuth, useSlice } from "@/redux/slice";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import firestoreConfig from '../../firebase/connection';
import { jwtDecode } from "jwt-decode";

export default function SessionAuth(props: { session : string }) {
  const { session } = props;
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [popup, setPopup] = useState('');

  useEffect(() => {
    const endpointSpace = slice.sessionAuth.name.trim();
    const endpoint = endpointSpace
      .replace(/-/g, '_')
      .replace(/\s+/g, '-')
      .toLowerCase();
    const requestSession = async () => {
      try {
        const token = localStorage.getItem('Segredos Da Fúria');
        if (token) {
          const db = getFirestore(firestoreConfig);
          const decode: { email: string } = jwtDecode(token);
          const { email } = decode;
          const sessionsCollectionRef = collection(db, 'sessions');
          const sessionsQuerySnapshot = await getDocs(query(sessionsCollectionRef, where('name', '==', session)));
          const dm = sessionsQuerySnapshot.docs[0].data().dm;
          if (email === dm) {
            router.push(`/sessions/${endpoint}`);
            dispatch(actionSessionAuth({ show: false, name: slice.sessionAuth.name }))
            dispatch(actionLoginInTheSession({ name: session, logged: true }));
          } else {
            const notifications = sessionsQuerySnapshot.docs[0].data().notifications;
            let authNotification = false;
            notifications.forEach((notification: { email: string, type: string }) => {
              if (notification.email === email && notification.type === 'approval') authNotification = true;
            });
            if (authNotification) {
              setPopup('waiting');
            } else {
              const sessionNew = sessionsQuerySnapshot.docs[0].data();
              let auth = false;
              sessionNew.players.forEach((player: { email: string }) => {
                if (player.email === email) auth = true;
              });
              if (auth) {
                router.push(`/sessions/${endpoint}`);
                dispatch(actionSessionAuth({ show: false, name: slice.sessionAuth.name }))
                dispatch(actionLoginInTheSession({ name: session, logged: true }));
              } else setPopup('authorization');
            }
          }
        } else router.push('/login');
      } catch(error) {
        window.alert("Ocorreu um erro: " + error);
      }
    }
    requestSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capitalize = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const sendNotification = async () => {
    try {
      const token = localStorage.getItem('Segredos Da Fúria');
      if (token) {
        const db = getFirestore(firestoreConfig);
        const decode: { email: string, firstName: string, lastName: string } = jwtDecode(token);
        const { email, firstName, lastName } = decode;
        const sessionsCollectionRef = collection(db, 'sessions');
        const sessionsQuerySnapshot = await getDocs(query(sessionsCollectionRef, where('name', '==', session)));
        if (!sessionsQuerySnapshot.empty) {
          const sessionDoc = sessionsQuerySnapshot.docs[0];
          const sessionData = sessionDoc.data();
          const updatedNotifications = [
            ...sessionData.notifications,
            {
              message: `O usuário ${capitalize(firstName)} ${capitalize(lastName)} de Email ${email}, solicitou acesso à sua Sessão`,
              email: email,
              type: 'approval',
              firstName,
              lastName,
            }
          ];
          await updateDoc(sessionDoc.ref, { notifications: updatedNotifications });
        } else {
          window.alert("Ocorreu um erro. Por favor, tente novamente solicitar o acesso.");
        }
      }
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
              Como é a sua primeira vez por aqui, podemos encaminhar uma notificação para que o Narrador da {session} possa autorizar seu acesso, que tal?
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={ () => dispatch(actionSessionAuth({ show: false, name: '' })) }
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
        return null;

    }
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => dispatch(actionSessionAuth({ show: false, name: '' }))}
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <h1 className="text-white text-2xl w-full text-center pb-10">{ slice.sessionAuth.name }</h1>
          { returnNotification() }
        </div>
      </div>
    </div>
  );
}