import contexto from "@/context/context";
import { getPlayersBySession } from "@/firebase/players";
import { updateSession } from "@/firebase/sessions";
import { getUserByEmail } from "@/firebase/user";
import { useContext, useEffect, useState } from "react";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import ChangeGameMaster from "../popup/changeGameMaster";
import LeaveGMFromSession from "../popup/leaveGMFromSession";

export default function General() {
  const [nameSession, setNameSession] = useState('');
  const [description, setDescription] = useState('');
  const [gameMaster, setGameMaster] = useState('');
  const [creationDate, setCreationDate] = useState('olá');
  const [input, setInput] = useState('');
  const [textArea, setTextArea] = useState(false);

  const {
    session,
    setShowMessage,
    players,
    showChangeGameMaster, setShowChangeGameMaster,
    showDelGMFromSession, setShowDelGMFromSession,
  } = useContext(contexto);

  useEffect(() => {
    setGameMaster(session.gameMaster);
    setNameSession(session.name);
    setCreationDate(session.creationDate);
    setDescription(session.description);
  }, []);

  const typeText = (e: any, type: string) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    if (type === 'description') setDescription(sanitizedValue);
    else setNameSession(sanitizedValue);
  }

  const updateNameSession = async () => {
    const sessionData = session;
    if (nameSession !== sessionData.name) {
      session.name = nameSession;
      await updateSession(sessionData, setShowMessage);
    }
  }

  const updateDescription = async () => {
    const sessionData = session;
    if (description !== sessionData.description) {
      session.description = description;
      await updateSession(sessionData, setShowMessage);
    }
  }

  const updateGameMaster = async () => {
    if (gameMaster !== session.gameMaster) {
      const user = await getUserByEmail(gameMaster, setShowMessage);
      if (user.email) {
        setShowChangeGameMaster({ show: true, data: { email: gameMaster, sessionId: session.id, displayName: user.firstName + ' ' + user.lastName }});
      } else {
        setShowMessage({ show: true, text: 'Necessário inserir o email de um usuário que já esteja cadastrado na plataforma.' });
        setGameMaster(session.gameMaster);
      }
    }
  }

  return(
    <div className="h-full w-full">
      { showChangeGameMaster.show && <ChangeGameMaster setGameMaster={setGameMaster} /> }
      { showDelGMFromSession && <LeaveGMFromSession /> }
      {
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
                    onChange={(e) => typeText(e, 'name')}
                  />
                }
                { 
                  input === 'nameSession'
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
                      onChange={(e) => typeText(e, 'description')}
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
                onClick={() => setInput('gameMaster')}
              >
                <div className="flex w-full">
                  <span className="text-white break-words w-full p-2">
                    <span className="font-bold pr-1">Narrador:</span>
                  </span>
                { 
                  input === 'gameMaster'
                    ? <BsCheckSquare
                        onClick={(e:any) => {
                          updateGameMaster();
                          setInput('');
                          e.stopPropagation();
                        }}
                        className="text-3xl text-white mr-1"
                      />
                    : <FaRegEdit
                        onClick={
                          (e:any) => {
                            setInput('gameMaster');
                            e.stopPropagation();
                          }}
                        className="text-3xl text-white"
                      />
                }
                </div>
                { 
                  input === 'gameMaster' ?
                  <input
                    type="text"
                    className="text-sm border border-white text-white text-left w-full bg-black p-2"
                    placeholder="Nome"
                    value={ gameMaster }
                    onChange={(e) => setGameMaster(e.target.value)}
                  />
                  : <span className="border border-transparent text-sm text-white w-full p-2 break-words">{ session.gameMaster }</span>
                }
              </div>
              <p className="mt-1 text-white sm:text-left w-full text-center border-2 border-white p-4">
                <span className="font-bold pr-1">Data de Criação:</span>
                <span>{ creationDate }</span>
              </p>
              <div className="text-white pb-3 sm:text-left w-full text-center mt-3 border-2 border-white p-4 mb-3">
                <span className="pr-1 font-bold">Jogadores:</span>
                {
                  players.filter((player:any) => player.email !== gameMaster ).map((item: any, index: number) => (
                    <span className="capitalize" key={index}>
                      { index === players.length -1 ? item.user + '.' : item.user + ', ' }
                    </span>
                  ))
                }
              </div>
              <button
                type="button"
                className="mb-3 p-2 w-full text-center border-2 border-white text-white bg-red-800 cursor-pointer font-bold hover:bg-red-900 transition-colors"
                onClick={() => setShowDelGMFromSession(true) }
              >
                Sair da Sessão
              </button>
            </div>
          </div>
        : <div className="h-full flex items-center justify-center">
            <span className="loader z-50" />
          </div>
      }
    </div>
  );
}