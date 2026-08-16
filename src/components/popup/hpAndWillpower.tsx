'use client'
import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { getAllPlayersBySessionId, updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter, resolveGiftEntries, resolveRitualEntries } from "@/firebase/utilities";
import { useContext, useEffect, useState } from "react";
import { FaFire, FaHeart } from "react-icons/fa6";
import { GiD10, GiFangs } from "react-icons/gi";
import { MdOutlineDoubleArrow } from "react-icons/md";
import PlayersPopup from "./playersPopup";

const playerPanelClassName =
  "w-full border border-white/10 bg-black/75 p-3 text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm";
const playerSectionTitleClassName =
  "font-geist-mono text-[0.62rem] uppercase tracking-[0.18em] text-red-400/85";
const playerRowClassName =
  "flex items-center justify-between gap-3 text-left last:border-b-0";
const playerDieButtonClassName =
  "flex h-8 w-8 shrink-0 items-center justify-center text-xl text-white/80 transition-colors duration-500 hover:text-red-700/80 hover:text-white";
const aggravatedMarkerClassName =
  "h-4 w-4 border border-red-300/70 bg-red-950/30 flex items-center justify-center cursor-pointer";
const superficialMarkerClassName =
  "h-4 w-4 border border-red-300/70 bg-black/20 flex items-center justify-center cursor-pointer";
const emptyMarkerClassName =
  "h-4 w-4 border border-zinc-600/70 bg-transparent cursor-pointer";
const filledRageMarkerClassName =
  "h-4 w-4 border border-red-300/70 bg-red-700/30 shadow-[0_0_10px_rgba(185,28,28,0.18)] cursor-pointer";
const emptyRageMarkerClassName =
  "h-4 w-4 border border-zinc-700 bg-transparent cursor-pointer";

export default function HpAndWillPower() {
  const [sessionSheets, setSessionSheets] = useState<any[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [showData, setShowData] = useState(false);
  const {
    dataSession,
    session,
    setShowMessage,
    players: sessionPlayers,
    email,
    dataSheet,
    setDataSheet,
    sheetId,
    setSheetId,
    setShowGiftRoll,
    setShowRitualRoll,
    showSelectSheet,
  } = useContext(contexto);

  const isGameMaster = session?.gameMaster === email;
  const ownedPlayers = sessionSheets.filter((player: any) => player.email === email);
  const selectedOwnedPlayer =
    ownedPlayers.find((player: any) => player.id === sheetId) ??
    ownedPlayers.find((player: any) => player.id === dataSheet?.id) ??
    ownedPlayers.find((player: any) => player.id === selectedPlayerId) ??
    ownedPlayers[0] ?? null;
  const selectedPlayerGifts = Array.isArray(selectedOwnedPlayer?.data?.gifts)
    ? resolveGiftEntries(selectedOwnedPlayer.data.gifts)
    : [];
  const selectedPlayerRituals = Array.isArray(selectedOwnedPlayer?.data?.rituals)
    ? resolveRitualEntries(selectedOwnedPlayer.data.rituals)
    : [];

  useEffect(() => {
    async function loadPlayers() {
      if (!session?.id) {
        setSessionSheets([]);
        return;
      }

      const allPlayers = await getAllPlayersBySessionId(session.id, setShowMessage);
      if (allPlayers) setSessionSheets(allPlayers);
    }

    loadPlayers();
  }, [dataSession, session?.id, sessionPlayers, setShowMessage]);

  useEffect(() => {
    if (isGameMaster || showSelectSheet) return;

    if (ownedPlayers.length === 0) {
      if (selectedPlayerId !== "") setSelectedPlayerId("");
      return;
    }

    const activeOwnedPlayer =
      ownedPlayers.find((player: any) => player.id === sheetId) ??
      ownedPlayers.find((player: any) => player.id === dataSheet?.id) ??
      ownedPlayers.find((player: any) => player.id === selectedPlayerId) ??
      ownedPlayers[0];

    if (selectedPlayerId !== activeOwnedPlayer.id) {
      setSelectedPlayerId(activeOwnedPlayer.id);
    }

    if (sheetId !== activeOwnedPlayer.id) {
      setSheetId(activeOwnedPlayer.id);
    }

    if (dataSheet?.id !== activeOwnedPlayer.id) {
      setDataSheet(activeOwnedPlayer);
    }
  }, [dataSheet?.id, isGameMaster, ownedPlayers, selectedPlayerId, setDataSheet, setSheetId, sheetId, showSelectSheet]);

  function syncPlayerState(nextPlayer: any) {
    setSessionSheets((currentState) =>
      currentState.map((player) => (player.id === nextPlayer.id ? nextPlayer : player))
    );

    if (selectedPlayerId === nextPlayer.id) {
      setDataSheet(nextPlayer);
      setSheetId(nextPlayer.id);
    }
  }

  function handleSelectPlayer(nextPlayerId: string) {
    setSelectedPlayerId(nextPlayerId);

    const nextPlayer = ownedPlayers.find((player: any) => player.id === nextPlayerId);
    if (!nextPlayer) return;

    setSheetId(nextPlayer.id);
    setDataSheet(nextPlayer);
  }

  async function updateTrackValue(name: "health" | "willpower", value: number) {
    if (!selectedOwnedPlayer) return;

    const currentTrack = Array.isArray(selectedOwnedPlayer.data?.[name])
      ? selectedOwnedPlayer.data[name]
      : [];
    const dataPersist = currentTrack.reduce((acc: any, item: any) => {
      item.agravated ? (acc.agravated += 1) : (acc.letal += 1);
      return acc;
    }, { agravated: 0, letal: 0 });
    const persistMessage = `Dano Agravado(${dataPersist.agravated}) e Dano Letal (${dataPersist.letal})`;

    let nextTrack = [...currentTrack];

    if (nextTrack.length === 0) {
      nextTrack = [{ value, agravated: false }];
    } else {
      const itemAgravated = nextTrack.filter(
        (item: any) => item.value === value && item.agravated === true
      );
      const restOfList = nextTrack.filter((item: any) => item.value !== value);

      if (itemAgravated.length > 0) {
        nextTrack = restOfList;
      } else {
        const itemLetal = nextTrack.filter((item: any) => item.value === value);
        nextTrack =
          itemLetal.length === 0
            ? [...restOfList, { value, agravated: false }]
            : [...restOfList, { value, agravated: true }];
      }
    }

    const nextPlayer = {
      ...selectedOwnedPlayer,
      data: {
        ...selectedOwnedPlayer.data,
        [name]: nextTrack,
      },
    };

    syncPlayerState(nextPlayer);
    await updateDataPlayer(nextPlayer.id, nextPlayer, setShowMessage);

    const newPersist = nextTrack.reduce((acc: any, item: any) => {
      item.agravated ? (acc.agravated += 1) : (acc.letal += 1);
      return acc;
    }, { agravated: 0, letal: 0 });
    const persistValue = `Dano Agravado(${newPersist.agravated}) e Dano Letal(${newPersist.letal})`;
    let namePtBr = "Forca de Vontade";
    if (name === "health") namePtBr = "Vitalidade";

    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? "O Narrador" : capitalizeFirstLetter(nextPlayer.user)} alterou a ${namePtBr} do personagem ${nextPlayer.data.name}${nextPlayer.email !== email ? ` do jogador ${capitalizeFirstLetter(nextPlayer.user)}` : ""} de ${persistMessage} para ${persistValue}.`,
        type: "notification",
      },
      null,
      setShowMessage
    );
  }

  function returnTotalHealth(player: any) {
    const findMaldicaoDaAncia = player.data.advantagesAndFlaws.flaws.find(
      (advantage: { title: string }) => advantage.title == "Maldição da Anciã"
    );
    const findPeleEspessa = player.data.advantagesAndFlaws.advantages.find(
      (advantage: { title: string }) => advantage.title == "Pele Espessa"
    );

    if (findMaldicaoDaAncia && findPeleEspessa) return Number(player.data.attributes.stamina) + 3;
    if (findMaldicaoDaAncia) return Number(player.data.attributes.stamina) + 2;
    if (findPeleEspessa) return Number(player.data.attributes.stamina) + 4;
    return Number(player.data.attributes.stamina) + 3;
  }

  async function updateRageValue(value: number) {
    if (!selectedOwnedPlayer) return;

    const currentRage = Number(selectedOwnedPlayer.data?.rage || 0);
    const nextRage = currentRage === 1 && value === 1 ? 0 : value;
    const nextPlayer = {
      ...selectedOwnedPlayer,
      data: {
        ...selectedOwnedPlayer.data,
        rage: nextRage,
      },
    };

    syncPlayerState(nextPlayer);
    await updateDataPlayer(nextPlayer.id, nextPlayer, setShowMessage);
    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? "O Narrador" : capitalizeFirstLetter(nextPlayer.user)} alterou a Fúria do personagem ${nextPlayer.data.name}${nextPlayer.email !== email ? ` do jogador ${capitalizeFirstLetter(nextPlayer.user)}` : ""} de ${currentRage} para ${nextRage}.`,
        type: "notification",
      },
      null,
      setShowMessage
    );
  }

  function openGiftRoll(gift: any) {
    if (!selectedOwnedPlayer) return;

    setSheetId(selectedOwnedPlayer.id);
    setDataSheet(selectedOwnedPlayer);
    setShowGiftRoll({ show: true, gift });
  }

  function openRitualRoll(ritual: any) {
    if (!selectedOwnedPlayer) return;

    setSheetId(selectedOwnedPlayer.id);
    setDataSheet(selectedOwnedPlayer);
    setShowRitualRoll({ show: true, ritual });
  }

  function renderAgravatedMarker(name: "health" | "willpower", index: number) {
    if (!selectedOwnedPlayer) return null;

    const marker = selectedOwnedPlayer.data[name].find((element: any) => element.value === index + 1);

    if (marker?.agravated) {
      return (
        <button
          type="button"
          onClick={() => updateTrackValue(name, index + 1)}
          key={`${name}-${index}`}
          className={aggravatedMarkerClassName}
        >
          <span className="relative block h-2.5 w-2.5">
            <span className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 rotate-45 bg-red-300/70" />
            <span className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 -rotate-45 bg-red-300/70" />
          </span>
        </button>
      );
    }

    if (marker) {
      return (
        <button
          type="button"
          onClick={() => updateTrackValue(name, index + 1)}
          key={`${name}-${index}`}
          className={superficialMarkerClassName}
        >
          <span className="block h-3 w-[1px] rotate-45 bg-red-300/70" />
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => updateTrackValue(name, index + 1)}
        key={`${name}-${index}`}
        className={emptyMarkerClassName}
      />
    );
  }

  function renderRageMarker(index: number) {
    if (!selectedOwnedPlayer) return null;

    const isFilled = Number(selectedOwnedPlayer.data.rage || 0) >= index + 1;

    return (
      <button
        type="button"
        onClick={() => updateRageValue(index + 1)}
        key={`rage-${index}`}
        className={isFilled ? filledRageMarkerClassName : emptyRageMarkerClassName}
      />
    );
  }

  function renderTrackRow(title: string, icon: React.ReactNode, content: React.ReactNode) {
    return (
      <div className="mt-2 first:mt-0">
        <div className="mb-1 font-geist-mono text-[0.52rem] uppercase tracking-[0.16em] text-white/45">
          {title}
        </div>
        <div className="flex items-start justify-start gap-2">
          <div className="flex w-4 shrink-0 justify-start text-sm text-white/72">{icon}</div>
          <div className="flex min-w-0 flex-1 flex-wrap justify-start gap-1">{content}</div>
        </div>
      </div>
    );
  }

  function renderActionList(
    title: string,
    items: any[],
    emptyText: string,
    getLabel: (item: any) => string,
    onRoll: (item: any) => void,
    labelClassName = "font-geist-mono text-[0.52rem] uppercase tracking-[0.16em] text-zinc-200"
  ) {
    return (
      <div className="mt-3 first:mt-0">
        <div className="border-b border-white/10 pb-1">
          <span className={playerSectionTitleClassName}>{title}</span>
        </div>
        <div className="mt-2">
          {items.length > 0 ? (
            items.map((item: any, index: number) => (
              <div key={`${title}-${index}`} className={playerRowClassName}>
                <span className={`min-w-0 flex-1 break-words ${labelClassName}`}>
                  {getLabel(item)}
                </span>
                <button
                  type="button"
                  className={playerDieButtonClassName}
                  onClick={() => onRoll(item)}
                >
                  <GiD10 />
                </button>
              </div>
            ))
          ) : (
            <p className="pt-2 font-geist-mono text-[0.62rem] uppercase tracking-[0.08em] text-white/45">
              {emptyText}
            </p>
          )}
        </div>
      </div>
    );
  }

  function renderGameMasterPanel() {
    return sessionSheets.map((player: any, index: number) => (
      <PlayersPopup player={player} key={index} />
    ));
  }

  function renderPlayerPanel() {
    return (
      <div className={playerPanelClassName}>
        {ownedPlayers.length > 0 ? (
          <>
            <div className="">
              <select
                value={selectedOwnedPlayer?.id ?? ""}
                onChange={(event) => handleSelectPlayer(event.target.value)}
                className="w-full border border-white/10 bg-black/70 px-3 py-2 font-geist-mono text-[0.68rem] uppercase tracking-[0.08em] text-white outline-none transition-colors hover:border-red-700/60 focus:border-red-700/60"
              >
                {ownedPlayers.map((player: any) => (
                  <option key={player.id} value={player.id}>
                    {player.data?.name || "Sem nome"}
                  </option>
                ))}
              </select>
            </div>

            {selectedOwnedPlayer && (
              <div className="mt-3 ">
                {renderTrackRow(
                  "Forca de Vontade",
                  <FaFire className="text-blue-400" />,
                  Array(Number(selectedOwnedPlayer.data.attributes.composure) + Number(selectedOwnedPlayer.data.attributes.resolve))
                    .fill("")
                    .map((_, index) => renderAgravatedMarker("willpower", index))
                )}
                {renderTrackRow(
                  "Vitalidade",
                  <FaHeart className="text-red-700" />,
                  Array(returnTotalHealth(selectedOwnedPlayer))
                    .fill("")
                    .map((_, index) => renderAgravatedMarker("health", index))
                )}
                {renderTrackRow(
                  "Furia",
                  <GiFangs />,
                  Array(5)
                    .fill("")
                    .map((_, index) => renderRageMarker(index))
                )}
              </div>
            )}

            {renderActionList(
              "DONS",
              selectedPlayerGifts,
              "Nenhum dom nesta ficha.",
              (gift) => gift.giftPtBr || gift.gift || "Dom sem nome",
              openGiftRoll
            )}

            {renderActionList(
              "RITUAIS",
              selectedPlayerRituals,
              "Nenhum ritual nesta ficha.",
              (ritual) => ritual.titlePtBr || ritual.title || "Ritual sem nome",
              openRitualRoll
            )}
          </>
        ) : (
          <p className="mt-3 border-t border-white/10 pt-3 font-geist-mono text-[0.62rem] uppercase tracking-[0.08em] text-white/45">
            Voce nao possui personagens nesta sessao.
          </p>
        )}
      </div>
    );
  }

  return(
    <div className={`absolute right-0 bottom-20 z-30 flex  ${showData ? 'min-w-[200px] max-w-[200px] sm:max-w-[300px] h-screen' : 'h-10'} flex-col justify-end pl-1 pr-3`}>
        {
          showData &&
          <div className="principles-scrollbar flex h-[60vh] flex-col overflow-y-auto overflow-x-hidden">
            <div className="mt-auto flex w-full flex-col">
            {showData && (isGameMaster ? renderGameMasterPanel() : renderPlayerPanel())}
            </div>
          </div>
        }
        {
          !showData &&
          <MdOutlineDoubleArrow
            className="rotate-180 cursor-pointer bg-black p-1 rounded-full text-3xl border-2 border-red-500 text-red-500 animate-pulse"
            onClick={ () => setShowData(true) }
          />
        }
        {
          showData &&
          <div className="w-full flex justify-end mb-1">
            <MdOutlineDoubleArrow
              className="cursor-pointer bg-black p-1 rounded-full text-3xl border-2 border-red-500 text-red-500 animate-pulse"
              onClick={ () => setShowData(false) }
            />
          </div>
        }
    </div>
  );
}








