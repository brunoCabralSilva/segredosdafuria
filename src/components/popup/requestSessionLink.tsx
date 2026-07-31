'use client'

import contexto from '@/context/context';
import { requestSheetLink } from '@/firebase/notifications';
import { getSessions } from '@/firebase/sessions';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Loading from '../loading';

type SessionListItem = {
  id: string;
  name: string;
  gameMaster: string;
  nameMaster: string;
  imageName: string;
  creationDate: string;
  description: string;
  players?: string[];
  statusSession?: string;
};

export default function RequestSessionLink(props: { onClose: () => void }) {
  const { onClose } = props;
  const { dataSheet, sheetId, setShowMessage } = useContext(contexto);
  const [selectedSession, setSelectedSession] = useState<SessionListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionListItem[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessionsList = await getSessions();
        const activeSessions: SessionListItem[] = sessionsList
          .filter(
            (session: any) =>
              session.statusSession !== 'Finalizada' &&
              session.id !== dataSheet?.sessionId
          ).map((session: any) => ({
            id: String(session.id || ''),
            name: String(session.name || ''),
            gameMaster: String(session.gameMaster || ''),
            nameMaster: String(session.nameMaster || ''),
            imageName: String(session.imageName || ''),
            creationDate: String(session.creationDate || ''),
            description: String(session.description || ''),
            players: Array.isArray(session.players) ? session.players : [],
            statusSession: session.statusSession ? String(session.statusSession) : undefined,
          }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name));

        setSessions(activeSessions);
      } catch (error) {
        setShowMessage({
          show: true,
          text: 'Ocorreu um erro ao carregar as sessões: ' + error,
        });
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [dataSheet?.sessionId, setShowMessage]);

  const sendRequest = async () => {
    if (!selectedSession) return;

    const result = await requestSheetLink(
      sheetId,
      dataSheet,
      selectedSession,
      setShowMessage,
    );

    if (result) onClose();
  };

  const resumeSinopse = (text: string) => {
    const totalLength = 220;
    if (text.length > totalLength) return text.slice(0, totalLength) + '...';
    return text.slice(0, totalLength);
  };

  const renderCard = (session: SessionListItem) => {
    const isSelected = selectedSession?.id === session.id;

    return (
      <button
        key={session.id}
        type="button"
        onClick={() => setSelectedSession(session)}
        className={`text-white cursor-pointer bg-ritual bg-cover rounded-xl border transition-colors ${
          isSelected ? 'border-red-500' : 'border-white'
        }`}
      >
        <div className="w-full h-full bg-black/90 font-bold rounded-xl">
          <div className="flex items-center justify-center w-full">
            <Image
              src={`/images/sessions/${session.imageName}.png`}
              alt="Glifo de um lobo"
              className="w-full h-32 relative object-cover object-center mb-2 rounded-t-xl"
              width={1000}
              height={1000}
            />
          </div>
          <div className="w-full pb-8 px-8 pt-4">
            <p className="text-left capitalize">{session.name}</p>
            <div className="w-full pt-1 pb-2">
              <hr />
            </div>
            <p className="text-sm font-normal text-justify capitalize">
              Narrador: {session.nameMaster}
            </p>
            <p className="text-sm font-normal text-justify">
              Status: {!session.statusSession ? 'Ativa' : session.statusSession}
            </p>
            <p className="text-sm font-normal text-justify">
              Jogadores: {session.players?.length || 0}
            </p>
            <p className="text-sm font-normal text-justify">
              Data de Criação: {session.creationDate?.toString()}
            </p>
            <p className="text-sm font-normal text-justify">
              Sinopse: {resumeSinopse(session.description || '')}
            </p>
            {isSelected && (
              <p className="text-sm text-left mt-3 text-red-400">
                Sessão selecionada
              </p>
            )}
          </div>
        </div>
      </button>
    );
  };

  const noSessionsAvailable = !loading && sessions.length === 0;

  return (
    <div className="z-50 fixed inset-0 bg-black/80 px-3 py-4 sm:px-0">
      <div className="h-full flex items-center justify-center">
        <div className="w-full sm:w-11/12 lg:w-5/6 h-full max-h-[calc(100vh-2rem)] bg-black border-white border-2 flex flex-col">
          <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end shrink-0 bg-black">
            <IoIosCloseCircleOutline
              className="text-4xl text-white cursor-pointer"
              onClick={onClose}
            />
          </div>

          <div className="px-5 pb-4 shrink-0">
            <h1 className="text-white text-2xl w-full text-center pb-4">
              Solicitar vínculo com sessão
            </h1>
            <p className="text-white text-center">
              Escolha a sessão que deve avaliar esta ficha.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-4">
            {loading ? (
              <Loading />
            ) : noSessionsAvailable ? (
              <div className="text-white text-center border border-white p-4 rounded-xl">
                Nenhuma sessão ativa está disponível para solicitar vínculo.
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-transparent">
                {sessions.map(renderCard)}
              </div>
            )}
          </div>

          <div className="shrink-0 px-5 pb-5 pt-3 border-t border-white bg-black">
            <div className="flex w-full gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!selectedSession}
                onClick={sendRequest}
                className={`text-white border-2 border-white w-full p-2 font-bold transition-colors ${
                  selectedSession
                    ? 'bg-green-whats hover:border-green-900 cursor-pointer'
                    : 'bg-gray-700 opacity-60'
                }`}
              >
                Enviar solicitação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
