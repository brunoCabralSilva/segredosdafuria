import contexto from "@/context/context";
import { useContext, useEffect, useMemo, useState } from "react";
import ChangeGameMaster from "../popup/changeGameMaster";
import LeaveGMFromSession from "../popup/leaveGMFromSession";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { updateSession, updateStatusSession } from "@/firebase/sessions";
import { authenticate } from "@/firebase/authenticate";
import { getUserByEmail } from "@/firebase/user";
import { registerHistory } from "@/firebase/history";
import { addNewSheetMandatory } from "@/firebase/players";
import dataTrybes from "@/data/trybes.json";
import { capitalizeFirstLetter, getOfficialTimeBrazil, sheetStructure } from "@/firebase/utilities";
import { MdDelete } from "react-icons/md";
import DeleteUserFromSession from "../popup/deleteUserFromSession";
import Image from "next/image";
import EndSession from "../popup/endSession";

export default function Details() {
  const {
    email,
    session,
    players,
    showEndSession,
    setShowEndSession,
    showDeletePlayer,
    setShowBannerSession,
    showDelGMFromSession,
    setShowMessage,
    setShowDeletePlayer,
    setShowMenuSession,
    setShowDelGMFromSession,
    showChangeGameMaster,
    setShowChangeGameMaster,
    setSheetId,
    setDataSheet,
    setOptionSelect,
  } = useContext(contexto);

  const [nameSession, setNameSession] = useState("");
  const [description, setDescription] = useState("");
  const [gameMaster, setGameMaster] = useState("");
  const [newGameMaster, setNewGameMaster] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [nameMaster, setNameMaster] = useState("");
  const [image, setImage] = useState("");
  const [typeSession, setTypeSession] = useState("Regras Oficiais");
  const [allowCustomTrybes, setAllowCustomTrybes] = useState(false);
  const [input, setInput] = useState("");
  const [textArea, setTextArea] = useState(false);
  const [creatingSheet, setCreatingSheet] = useState(false);

  useEffect(() => {
    setGameMaster(session.gameMaster || "");
    setNewGameMaster(session.gameMaster || "");
    setNameSession(session.name || "");
    setCreationDate(session.creationDate || "");
    setDescription(session.description || "");
    setNameMaster(session.nameMaster || "");
    setImage(session.imageName || "01");
    setTypeSession(session.typeSession || "Regras Oficiais");
    setAllowCustomTrybes(Boolean(session.allowCustomTrybes));
  }, [session]);

  const normalizedPlayers = useMemo(() => {
    if (!Array.isArray(players)) return [];

    const uniquePlayers = new Map<string, any>();
    players.forEach((player: any) => {
      if (!player?.email || player.email === gameMaster || uniquePlayers.has(player.email)) return;
      uniquePlayers.set(player.email, player);
    });

    return Array.from(uniquePlayers.values());
  }, [players, gameMaster]);

  const customTrybeNames = useMemo(() => {
    const names = new Set<string>();

    dataTrybes.forEach((trybe: any) => {
      if (!trybe?.custom) return;

      [String(trybe?.nameEn || ""), String(trybe?.namePtBr || "")]
        .map((value) => value.trim().toLowerCase())
        .filter((value) => value !== "")
        .forEach((value) => names.add(value));
    });

    return names;
  }, []);

  const linkedSheetsWithCustomTrybe = useMemo(() => {
    if (!Array.isArray(players)) return [];

    return players.filter((player: any) => {
      const selectedTrybe = String(player?.data?.trybe || "").trim().toLowerCase();
      return selectedTrybe !== "" && customTrybeNames.has(selectedTrybe);
    });
  }, [customTrybeNames, players]);

  const playersSummary = useMemo(() => {
    return normalizedPlayers.map((player: any) => player.user).join(", ");
  }, [normalizedPlayers]);

  const buttonClassName =
    "inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900";

  const ghostButtonClassName =
    "inline-flex items-center justify-center border border-white/10 bg-black/40 px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:border-red-900 hover:bg-red-950/30";

  const sanitizeInlineText = (value: string) => value.replace(/\s+/g, " ");

  const sanitizeMultilineText = (value: string) => value
    .replaceAll("\r\n", "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trimEnd())
    .join("\n");

  const typeText = (event: any, type: string) => {
    if (type === "description") {
      setDescription(sanitizeMultilineText(event.target.value));
      return;
    }

    setNameSession(sanitizeInlineText(event.target.value));
  };

  const updateNameSession = async () => {
    if (nameSession === session.name) return;

    const sessionData = {
      ...session,
      name: nameSession,
    };

    await updateSession(sessionData, setShowMessage);
  };

  const updateDescription = async () => {
    if (description === session.description) return;

    const sessionData = {
      ...session,
      description,
    };

    await updateSession(sessionData, setShowMessage);
  };

  const updateGameMaster = async () => {
    if (newGameMaster === gameMaster) return;

    const user = await getUserByEmail(newGameMaster, setShowMessage);
    if (user.email) {
      setShowChangeGameMaster({
        show: true,
        data: {
          email: newGameMaster,
          sessionId: session.id,
          displayName: user.firstName + " " + user.lastName,
        },
      });
      return;
    }

    setShowMessage({
      show: true,
      text: "Necessário inserir o email de um usuário que já esteja cadastrado na plataforma.",
    });
    setNewGameMaster(gameMaster);
  };

  const updateTypeSession = async (nextTypeSession: string) => {
    if (nextTypeSession === session.typeSession) return;

    const sessionData = {
      ...session,
      typeSession: nextTypeSession,
    };

    setTypeSession(nextTypeSession);
    await updateSession(sessionData, setShowMessage);
  };

  const updateAllowCustomTrybes = async (nextAllowCustomTrybes: boolean) => {
    if (nextAllowCustomTrybes === Boolean(session.allowCustomTrybes)) return;

    if (!nextAllowCustomTrybes && linkedSheetsWithCustomTrybe.length > 0) {
      setAllowCustomTrybes(true);
      setShowMessage({
        show: true,
        text: "Não é possível desmarcar a permissão de tribos alternativas enquanto houver ficha vinculada com tribo alternativa. Remova a ficha da sessão ou altere a tribo da ficha primeiro.",
      });
      return;
    }

    const sessionData = {
      ...session,
      allowCustomTrybes: nextAllowCustomTrybes,
    };

    setAllowCustomTrybes(nextAllowCustomTrybes);
    await updateSession(sessionData, setShowMessage);
  };

  const editNameSession = () => {
    return input === "nameSession" ? (
      <BsCheckSquare
        onClick={async (event: any) => {
          event.stopPropagation();
          await updateNameSession();
          setInput("");
        }}
        className="cursor-pointer text-3xl text-white"
      />
    ) : (
      <FaRegEdit
        onClick={(event: any) => {
          setInput("nameSession");
          event.stopPropagation();
        }}
        className="cursor-pointer text-3xl text-white"
      />
    );
  };

  const editDescriptionSession = () => {
    return textArea ? (
      <BsCheckSquare
        onClick={async (event: any) => {
          event.stopPropagation();
          await updateDescription();
          setTextArea(false);
        }}
        className="mb-1 cursor-pointer text-3xl text-white"
      />
    ) : (
      <FaRegEdit
        onClick={(event: any) => {
          setTextArea(true);
          event.stopPropagation();
        }}
        className="cursor-pointer text-3xl text-white"
      />
    );
  };

  const editGameMasterSession = () => {
    return input === "gameMaster" ? (
      <BsCheckSquare
        onClick={async (event: any) => {
          event.stopPropagation();
          await updateGameMaster();
          setInput("");
        }}
        className="mr-1 cursor-pointer text-3xl text-white"
      />
    ) : (
      <FaRegEdit
        onClick={(event: any) => {
          setInput("gameMaster");
          event.stopPropagation();
        }}
        className="cursor-pointer text-3xl text-white"
      />
    );
  };



  const createSessionSheet = async () => {
    if (creatingSheet) return;

    setCreatingSheet(true);
    try {
      const dateMessage = await getOfficialTimeBrazil();
      const auth = await authenticate(setShowMessage);

      if (!auth || !auth.email || !auth.displayName) {
        setShowMessage({ show: true, text: 'Nao foi possivel identificar o usuário para criar a ficha.' });
        return;
      }

      const sheet = sheetStructure(auth.email, auth.displayName, dateMessage);
      const register: string = await addNewSheetMandatory(session.id, sheet, setShowMessage);
      if (!register) return;

      await registerHistory(
        session.id,
        {
          message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(sheet.user)} criou um novo personagem.`,
          type: 'notification',
        },
        null,
        setShowMessage,
      );

      const createdSheet = { ...sheet, id: register, sessionId: session.id };
      setSheetId(register);
      setDataSheet(createdSheet);
      setOptionSelect('general');
      setShowMenuSession('');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session:open-general'));
      }
      setShowMessage({ show: true, text: 'Ficha criada com sucesso!' });
    } catch (error) {
      setShowMessage({ show: true, text: 'Ocorreu um erro inesperado: ' + error });
    } finally {
      setCreatingSheet(false);
    }
  };
  return (
    <div className="relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-red-950/40 text-white">
      {showChangeGameMaster.show && <ChangeGameMaster setGameMaster={setGameMaster} />}
      {showEndSession && <EndSession />}
      {showDelGMFromSession && <LeaveGMFromSession />}
      {showDeletePlayer.show && <DeleteUserFromSession />}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(153,27,27,0.22),transparent_42%)]" />

      <div className="relative border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 text-white sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-kingthings text-lg sm:text-xl">Detalhes da Sessão</h2>
            <p className="mt-1 font-geist-mono text-[11px] sm:text-xs text-white/75">Edite as informações principais, acompanhe os jogadores e acione os modos da crônica a partir deste painel.</p>
          </div>
        </div>
      </div>

      {creationDate !== "" ? (
        <div className="principles-scrollbar relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6">
          <div className="grid min-h-full grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.8fr)]">
            <div className="space-y-4">
              <div className="border border-white/10 bg-black/55">
                <div className="border-b border-white/10 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/80">Nome Da Sessão</p>
                    {gameMaster === email && editNameSession()}
                  </div>
                </div>

                <div
                  className="px-4 py-4"
                  onClick={() => {
                    if (gameMaster === email) setInput("nameSession");
                  }}
                >
                  {input === "nameSession" && gameMaster === email ? (
                    <input
                      type="text"
                      className="w-full border border-white/10 bg-black/40 px-3 py-2 text-left text-xl text-white outline-none"
                      placeholder="Nome"
                      value={nameSession}
                      onChange={(event) => typeText(event, "name")}
                    />
                  ) : (
                    <p className="break-words font-kingthings text-2xl capitalize text-white">
                      {nameSession}
                    </p>
                  )}
                </div>
              </div>

              <div className="border border-white/10 bg-black/55">
                <div className="border-b border-white/10 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/80">Sinopse</p>
                    {gameMaster === email && editDescriptionSession()}
                  </div>
                </div>

                <div className="px-4 py-4">
                  {textArea && gameMaster === email ? (
                    <textarea
                      className="h-72 w-full border border-white/10 bg-black/40 p-3 text-justify font-geist-mono text-[12px] text-white outline-none"
                      value={description}
                      onChange={(event) => typeText(event, "description")}
                    />
                  ) : (
                    <div
                      className="cursor-pointer whitespace-pre-wrap font-geist-mono text-[12px] text-justify leading-relaxed text-white/85"
                      onClick={() => {
                        if (gameMaster === email) setTextArea(true);
                      }}
                    >
                      {description}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="border border-white/10 bg-black/55">
                  <div className="border-b border-white/10 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/80">Narrador</p>
                      {gameMaster === email && editGameMasterSession()}
                    </div>
                  </div>

                  <div
                    className="px-4 py-4"
                    onClick={() => {
                      if (gameMaster === email) setInput("gameMaster");
                    }}
                  >
                    <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/60">
                      {gameMaster === email ? "Você é o narrador desta sessão" : "Narrador da crônica"}
                    </p>
                    {input === "gameMaster" ? (
                      <input
                        type="text"
                        className="mt-3 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
                        placeholder="Email"
                        value={newGameMaster}
                        onChange={(event) => setNewGameMaster(event.target.value)}
                      />
                    ) : (
                      <p className="mt-3 break-words font-geist-mono text-[12px] text-white/85">
                        {gameMaster === email ? newGameMaster : nameMaster}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border border-white/10 bg-black/55">
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/80">Data De Criação</p>
                  </div>
                  <div className="px-4 py-4">
                    <p className="font-geist-mono text-[12px] text-white/85">{creationDate}</p>
                  </div>
                </div>

              </div>

              <div className="border border-white/10 bg-black/55">
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/80">Jogadores</p>
                </div>
                <div className="px-4 py-4">
                  {email !== gameMaster ? (
                    <p className="font-geist-mono text-[12px] leading-relaxed text-white/85">
                      {playersSummary !== "" ? playersSummary : "Nenhum jogador adicional cadastrado."}
                    </p>
                  ) : normalizedPlayers.length > 0 ? (
                    <div className="space-y-3">
                      {normalizedPlayers.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-3 border border-white/10 bg-black/35 px-4 py-3">
                          <div>
                            <p className="capitalize font-geist-mono text-[12px] text-white/90">{item.user}</p>
                            <p className="mt-1 text-[11px] text-white/55">{item.email}</p>
                          </div>
                          <button
                            type="button"
                            className="inline-flex h-9 w-9 items-center justify-center border border-red-950 bg-red-950 text-white transition-colors hover:bg-red-900"
                            onClick={() => setShowDeletePlayer({ show: true, userEmail: item.email })}
                          >
                            <MdDelete className="text-lg" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-geist-mono text-[12px] text-white/85">Nenhum jogador adicional cadastrado.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-white/10 bg-black/55">
                <div className="border-b border-white/10 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/80">Banner da Sessão</p>
                    {email === gameMaster && (
                      <FaRegEdit
                        onClick={() => {
                          setShowBannerSession({ show: true, sessionId: session.id });
                          setShowMenuSession("");
                        }}
                        className="cursor-pointer text-3xl text-white"
                      />
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <Image
                    src={`/images/sessions/${image}.png`}
                    alt="Banner da sessão"
                    className="h-40 w-full object-cover object-center"
                    width={1000}
                    height={1000}
                  />
                </div>
              </div>

              <div className="border border-white/10 bg-black/55">
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/80">Ações Da Sessão</p>
                </div>
                <div className="flex flex-col gap-3 p-4">

                  <button
                    type="button"
                    className={buttonClassName}
                    onClick={() => {
                      void createSessionSheet();
                    }}
                    disabled={creatingSheet}
                  >
                    {creatingSheet ? 'Criando ficha...' : 'Criar Ficha'}
                  </button>

                  {email === gameMaster && (
                    <button
                      type="button"
                      className={buttonClassName}
                      onClick={async () => {
                        if (session.statusSession === "Finalizada") {
                          await updateStatusSession(session.id, "Ativa", setShowMessage);
                        } else {
                          setShowEndSession(true);
                        }
                      }}
                    >
                      {session.statusSession === "Finalizada" ? "Reativar Sessão" : "Finalizar Sessão"}
                    </button>
                  )}


                  <button
                    type="button"
                    className={ghostButtonClassName}
                    onClick={() => {
                      setShowDelGMFromSession(true);
                    }}
                  >
                    Sair Da Sessão
                  </button>
                </div>
              </div>
              <div className="border border-white/10 bg-black/55">
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/80">Regras Da Sessão</p>
                </div>
                <div className="px-4 py-4">
                  <select
                    value={typeSession}
                    disabled={gameMaster !== email}
                    onChange={(event) => {
                      void updateTypeSession(event.target.value);
                    }}
                    className="w-full border border-white/10 bg-black/40 px-3 py-2 font-geist-mono text-[11px] uppercase tracking-[0.08em] text-white outline-none transition-colors hover:border-red-700/60 focus:border-red-700/60 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <option value="Regras Oficiais">Regras Oficiais</option>
                    <option value="Regras Alternativas">Regras Alternativas</option>
                  </select>
                  <p className="mt-3 font-geist-mono text-[11px] leading-relaxed text-white/60">
                    {typeSession === "Regras Oficiais"
                      ? "Usa as regras oficiais do livro Lobisomem: O Apocalipse 5ed"
                      : "Usa um modelo alternativo de regras (Fúria aumenta se falhar em Checagem de Fúria, sair da Forma Crinos não diminui a Fúria para 1, Ao chegar a 5 pontos de Fúria entra em Frenesi)"}
                  </p>
                  <label className="mt-4 flex items-start gap-3 border border-white/10 bg-black/30 px-3 py-3">
                    <input
                      type="checkbox"
                      checked={allowCustomTrybes}
                      disabled={gameMaster !== email}
                      onChange={(event) => {
                        void updateAllowCustomTrybes(event.target.checked);
                      }}
                      className="mt-0.5 h-4 w-4 accent-red-800 disabled:cursor-not-allowed"
                    />
                    <div>
                      <p className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/80">Permitir Tribos Alternativas</p>
                      <p className="mt-2 font-geist-mono text-[11px] leading-relaxed text-white/60">
                        {allowCustomTrybes
                          ? "Tribos Alternativas também aparecem na seleção de tribo das fichas desta sessão."
                          : "A seleção de tribo mostra apenas as tribos padrão da plataforma."}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex h-full items-center justify-center">
          <span className="loader z-50" />
        </div>
      )}
    </div>
  );
}








