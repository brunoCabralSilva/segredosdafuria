'use client'
import { useContext, useEffect, useState } from 'react';
import { BsCheckSquare } from 'react-icons/bs';
import { FaCopy, FaEraser, FaFileDownload, FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import dataTrybes from '../../data/trybes.json';
import { addNewSheetMandatory, updateDataPlayer } from '@/firebase/players';
import { cancelSheetLinkRequest, requestSheetLink } from '@/firebase/notifications';
import { getSessions } from '@/firebase/sessions';
import contexto from '@/context/context';
import Item from '../sheetItems/item';
import ItemAgravated from '../sheetItems/itemAgravated';
import ResetSheet from '../popup/resetSheet';
import { capitalizeFirstLetter, normalizeHealthTrackForFormChange, resolveGiftEntries, serializeGiftEntries, sheetStructure } from '@/firebase/utilities';
import DeleteSheet from '../popup/deleteSheet';
import { registerHistory } from '@/firebase/history';
import { FaFileCircleCheck } from 'react-icons/fa6';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import ItemRenownHaranoHauglosk from '../sheetItems/itemRenownHaranoHauglosk';
import Attributes from './attributes';
import Skills from './skills';
import Gifts from './gifts';
import AdvantagesAndFlaws from '../advantagesAndFlaws/advantagesAndFlaws';
import Forms from './forms';
import Touchstones from './touchstones';
import Background from './background';
import Rituals from '../rituals/rituals';
import Nav from '../nav';
import { AiFillCloseCircle } from 'react-icons/ai';

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
  allowCustomTrybes?: boolean;
};

export default function General(props: { dataSession: any; id: string; gameMaster: boolean }) {
  const { dataSession, id, gameMaster } = props;
  const pathname = usePathname();
  const router = useRouter();
  const [input, setInput] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [xp, setXp] = useState('0');
  const [portraitUrl, setPortraitUrl] = useState('');
  const [portraitImageError, setPortraitImageError] = useState(false);
  const [activeSessions, setActiveSessions] = useState<SessionListItem[]>([]);
  const [chronicleTransferPrompt, setChronicleTransferPrompt] = useState<SessionListItem | null>(null);
  const [showCopySheetPrompt, setShowCopySheetPrompt] = useState(false);
  const {
    players,
    email,
    name,
    setOptionSelect,
    dataSheet,
    setDataSheet,
    showResetSheet,
    setShowResetSheet,
    showDeleteSheet,
    setShowDeleteSheet,
    setShowGiftRoll,
    setShowRitualRoll,
    setShowMessage,
    setShowEvaluateSheet,
    setShowDownloadPdf,
    sheetId,
    setSheetId,
    session,
  } = useContext(contexto);

  const isNarrator = dataSession?.gameMaster === email || gameMaster;
  const isStandaloneSheetView = pathname?.startsWith('/sheets/');
  const isReadOnlyCommunitySheet = isStandaloneSheetView && !!dataSheet?.email && dataSheet.email !== email;
  const canEditPortraitUrl = isStandaloneSheetView ? dataSheet?.email === email : dataSheet?.email === email || isNarrator;
  const canManageSheetIdentity = isStandaloneSheetView ? dataSheet?.email === email : dataSheet?.email === email || isNarrator;
  const canViewSheetEmail = isStandaloneSheetView ? dataSheet?.email === email : dataSheet?.email === email || isNarrator;
  const canCopySheet = isStandaloneSheetView && dataSheet?.email === email;
  const canDeleteSheet = (isStandaloneSheetView && dataSheet?.email === email) || (!isStandaloneSheetView && isNarrator && sheetId !== '');
  const sessionCharacterOptions = isNarrator ? players : players.filter((player: any) => player.email === email);
  const hasActiveSessionCharacter = sessionCharacterOptions.some((player: any) => player?.id === sheetId);
  const activeSessionCharacterValue = isStandaloneSheetView
    ? sheetId
    : isNarrator
      ? (hasActiveSessionCharacter ? sheetId : '__none__')
      : (hasActiveSessionCharacter ? sheetId : '');
  const shouldBlockUntilCharacterSelection = !isStandaloneSheetView && isNarrator && activeSessionCharacterValue === '__none__';

  const getCurrentBrazilDateTimeString = () => {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    return formatter.format(new Date());
  };

  const copyCommunitySheet = async () => {
    if (!dataSheet || email === '' || name === '') return;

    const clonedSheet = JSON.parse(JSON.stringify(dataSheet));
    const currentForm = clonedSheet?.data?.form || 'Homin\u00eddeo';
    delete clonedSheet.id;
    delete clonedSheet.pendingSessionLink;
    clonedSheet.email = email;
    clonedSheet.user = name;
    clonedSheet.creationDate = getCurrentBrazilDateTimeString();
    clonedSheet.sessionId = '';

    if (clonedSheet?.data) {
      clonedSheet.data.health = normalizeHealthTrackForFormChange(clonedSheet.data, currentForm, 'Homin\u00eddeo');
      clonedSheet.data.form = 'Homin\u00eddeo';
    }

    const newSheetId = await addNewSheetMandatory('', clonedSheet, setShowMessage);

    if (newSheetId) {
      setShowCopySheetPrompt(false);
      setShowMessage({ show: true, text: 'Ficha copiada com sucesso!' });
      router.push(`/sheets/${newSheetId}`);
    }
  };

  const clearSessionCharacter = async () => {
    if (!isNarrator || sheetId === '') return;
    setSheetId('');
    setOptionSelect('players');
    setDataSheet(sheetStructure('', '', ''));
    setShowMessage({ show: true, text: 'Nenhum personagem selecionado.' });
    await registerHistory(
      id,
      {
        message: 'O Narrador removeu o personagem selecionado.',
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  };

  const selectSessionCharacter = async (playerId: string) => {
    const selectedPlayer = players.find((player: any) => player.id === playerId);

    if (!selectedPlayer || dataSheet?.id === selectedPlayer.id) {
      return;
    }

    setSheetId(selectedPlayer.id);
    setOptionSelect('general');
    setDataSheet(selectedPlayer);
    setShowMessage({
      show: true,
      text: `Você selecionou o personagem ${selectedPlayer.data.name !== '' ? selectedPlayer.data.name : ''} (${capitalizeFirstLetter(selectedPlayer.user)})`,
    });

    await registerHistory(
      id,
      {
        message:
          (isNarrator ? 'O Narrador' : capitalizeFirstLetter(selectedPlayer.user)) +
          ' selecionou um personagem' +
          (isNarrator ? ` de ${capitalizeFirstLetter(selectedPlayer.user)}` : '') +
          (selectedPlayer.data.name !== '' ? ` (${selectedPlayer.data.name}).` : '.'),
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  };

  const getSessionCharacterLabel = (player: any) => {
    if (player && player.data && player.data.name !== '') {
      return `${player.data.name} (${capitalizeFirstLetter(player.user)})`;
    }
    return capitalizeFirstLetter(player.user);
  };

  useEffect(() => {
    setShowGiftRoll({ show: false, gift: {} });
    setShowRitualRoll({ show: false, ritual: {} });
    setNewName(dataSheet?.data?.name ?? '');
    setNewEmail(dataSheet?.email ?? '');
    setXp(dataSheet?.data?.xp ? dataSheet.data.xp : '0');
    setPortraitUrl(dataSheet?.data?.portraitUrl ?? '');
    setPortraitImageError(false);
  }, [dataSheet, setShowGiftRoll, setShowRitualRoll]);

  useEffect(() => {
    const loadActiveSessions = async () => {
      try {
        const sessionsList = await getSessions();
        const availableSessions: SessionListItem[] = sessionsList
          .filter((sessionItem: any) => sessionItem.statusSession !== 'Finalizada' && sessionItem.id !== dataSheet?.sessionId)
          .map((sessionItem: any) => ({
            id: String(sessionItem.id || ''),
            name: String(sessionItem.name || ''),
            gameMaster: String(sessionItem.gameMaster || ''),
            nameMaster: String(sessionItem.nameMaster || ''),
            imageName: String(sessionItem.imageName || ''),
            creationDate: String(sessionItem.creationDate || ''),
            description: String(sessionItem.description || ''),
            players: Array.isArray(sessionItem.players) ? sessionItem.players : [],
            statusSession: sessionItem.statusSession ? String(sessionItem.statusSession) : undefined,
            allowCustomTrybes: Boolean(sessionItem.allowCustomTrybes),
          }))
          .sort((first, second) => first.name.localeCompare(second.name));

        setActiveSessions(availableSessions);
      } catch (error) {
        setShowMessage({ show: true, text: 'Ocorreu um erro ao carregar as mesas ativas: ' + error });
      }
    };

    loadActiveSessions();
  }, [dataSheet?.sessionId, setShowMessage]);

  const typeName = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setNewName(sanitizedValue);
  };

  const validatePortraitUrl = (value: string) => {
    if (value === '') return true;

    try {
      const parsedUrl = new URL(value);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const filterAllowedGifts = (gifts: any[], trybe: string, auspice: string) => {
    const normalizedAllowedTypes = new Set(
      ['global', trybe, auspice]
        .map((item) => String(item || '').trim().toLowerCase())
        .filter((item) => item !== '')
    );

    return gifts.filter((gift: any) => {
      const giftBelongings = Array.isArray(gift?.belonging) ? gift.belonging : [];

      return giftBelongings.some((belongingItem: any) => {
        const belongingType = String(belongingItem?.type || '').trim().toLowerCase();
        return normalizedAllowedTypes.has(belongingType);
      });
    });
  };

  const updateValue = async (key: string, value: string, namePtBr: string) => {
    const findPlayer = players.find((player: any) => player.id === sheetId) || dataSheet;
    if (!findPlayer) return false;

    const dataPersist = findPlayer.data[key];

    if (key === 'name') {
      const normalizedName = value.replace(/\s+/g, ' ').trim();
      if (normalizedName === '') {
        setShowMessage({ show: true, text: 'Necessário preencher um nome válido.' });
        return false;
      }

      const updatedPlayer = {
        ...findPlayer,
        data: {
          ...findPlayer.data,
          [key]: normalizedName,
        },
      };

      await updateDataPlayer(sheetId, updatedPlayer, setShowMessage);
      setNewName(normalizedName);
      await registerHistory(
        session.id,
        {
          message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(findPlayer.user)} alterou o nome do personagem ${dataPersist}${findPlayer.email !== email ? ` do jogador ${capitalizeFirstLetter(findPlayer.user)}` : ''} para ${capitalizeFirstLetter(normalizedName)}.`,
          type: 'notification',
        },
        null,
        setShowMessage,
      );
      return true;
    }

    if (key === 'portraitUrl') {
      const normalizedPortraitUrl = value.trim();

      if (!validatePortraitUrl(normalizedPortraitUrl)) {
        setShowMessage({ show: true, text: 'Necessário informar um link de imagem válido com http ou https.' });
        return false;
      }

      const updatedPlayer = {
        ...findPlayer,
        data: {
          ...findPlayer.data,
          [key]: normalizedPortraitUrl,
        },
      };

      await updateDataPlayer(sheetId, updatedPlayer, setShowMessage);
      setPortraitUrl(normalizedPortraitUrl);
      setPortraitImageError(false);
      await registerHistory(
        session.id,
        {
          message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(findPlayer.user)} alterou o link da imagem do personagem ${findPlayer.data.name}${findPlayer.email !== email ? ` do jogador ${capitalizeFirstLetter(findPlayer.user)}` : ''} de ${dataPersist || 'sem link'} para ${normalizedPortraitUrl || 'sem link'}.`,
          type: 'notification',
        },
        null,
        setShowMessage,
      );
      return true;
    }

    const nextTrybe = key === 'trybe' ? value : findPlayer?.data?.trybe || '';
    const nextAuspice = key === 'auspice' ? value : findPlayer?.data?.auspice || '';
    const shouldFilterGifts = key === 'trybe' || key === 'auspice';
    const currentGifts = Array.isArray(findPlayer?.data?.gifts) ? findPlayer.data.gifts : [];
    const resolvedCurrentGifts = resolveGiftEntries(currentGifts);
    const filteredGifts = shouldFilterGifts
      ? serializeGiftEntries(filterAllowedGifts(resolvedCurrentGifts, nextTrybe, nextAuspice))
      : serializeGiftEntries(currentGifts);

    const updatedPlayer = {
      ...findPlayer,
      data: {
        ...findPlayer.data,
        [key]: value,
        ...(shouldFilterGifts ? { gifts: filteredGifts } : {}),
      },
    };

    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(findPlayer.user)} alterou ${namePtBr === 'Tribo' ? 'a' : 'o'} ${namePtBr} do personagem ${findPlayer.data.name}${findPlayer.email !== email ? ` do jogador ${capitalizeFirstLetter(findPlayer.user)}` : ''} ${dataPersist !== '' ? `de ${capitalizeFirstLetter(dataPersist)} ` : ' '}para ${capitalizeFirstLetter(value)}.`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
    await updateDataPlayer(sheetId, updatedPlayer, setShowMessage);
    return true;
  };
  const updateSheetEmail = async (value: string) => {
    const findPlayer = players.find((player: any) => player.id === sheetId) || dataSheet;
    if (!findPlayer) return false;

    const normalizedEmail = value.trim().toLowerCase();
    if (!validateEmail(normalizedEmail)) {
      setShowMessage({ show: true, text: 'Necessário informar um email válido.' });
      return false;
    }

    const previousEmail = findPlayer.email || 'sem email';
    const updatedPlayer = {
      ...findPlayer,
      email: normalizedEmail,
    };

    await updateDataPlayer(sheetId, updatedPlayer, setShowMessage);
    setDataSheet((current: any) => (current ? { ...current, email: normalizedEmail } : current));
    setNewEmail(normalizedEmail);
    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(findPlayer.user)} alterou o email do personagem ${findPlayer.data.name}${findPlayer.email !== email ? ` do jogador ${capitalizeFirstLetter(findPlayer.user)}` : ''} de ${previousEmail} para ${normalizedEmail}.`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
    return true;
  };

  const requestCopySheet = () => {
    setShowCopySheetPrompt(true);
  };

  const requestChronicleLink = (targetSessionId: string) => {
    if (targetSessionId === '__none__') return;

    const targetSession = activeSessions.find((sessionItem) => sessionItem.id === targetSessionId);
    if (!targetSession) return;

    setChronicleTransferPrompt(targetSession);
  };

  const confirmChronicleLink = async () => {
    if (!chronicleTransferPrompt) return;

    const pendingSessionLink = await requestSheetLink(sheetId, dataSheet, chronicleTransferPrompt, setShowMessage);

    if (pendingSessionLink) {
      setDataSheet((current: any) => (current ? { ...current, pendingSessionLink } : current));
    }

    setChronicleTransferPrompt(null);
  };

  const sheetDataValues = dataSheet?.data ?? {};
  const displayName = (dataSheet?.data?.name ?? '').trim();
  const portraitUrlPersisted = (dataSheet?.data?.portraitUrl ?? '').trim();
  const sessionName = dataSession?.name || session?.name || 'Sem crônica';
  const selectedTrybeData = dataTrybes.find((trybe: any) => trybe.nameEn === sheetDataValues.trybe || trybe.namePtBr === sheetDataValues.trybe);
  const patronName = selectedTrybeData?.patronName || 'Sem padroeiro';
  const patronDescription = selectedTrybeData?.patron || 'Selecione uma tribo para visualizar o espirito padroeiro.';
  const playerName = dataSheet?.user ? capitalizeFirstLetter(dataSheet.user) : 'Sem jogador';
  const patronFavor = selectedTrybeData?.favor || 'Selecione uma tribo para visualizar o favor do espirito padroeiro.';
  const patronBan = selectedTrybeData?.ban || 'Selecione uma tribo para visualizar a proibicao do espirito padroeiro.';
  const pendingSessionTransfer = dataSheet?.pendingSessionLink;
  const hasPendingSessionTransfer = !!pendingSessionTransfer?.requestId;
  const allowCustomTrybes = !dataSheet?.sessionId || Boolean(session?.allowCustomTrybes ?? dataSession?.allowCustomTrybes);
  const availableTrybes = [...dataTrybes]
    .filter((trybe: any) => allowCustomTrybes || !trybe.custom || trybe.nameEn === sheetDataValues.trybe || trybe.namePtBr === sheetDataValues.trybe)
    .sort((a, b) => a.namePtBr.localeCompare(b.namePtBr));
  const fieldLabelClass = 'font-geist-mono text-[0.58rem] uppercase tracking-[0.24em] text-[#7f8883]';
  const fieldValueClass = 'mt-2 border-b border-zinc-500/20 pb-2 font-kingthings text-[0.82rem] uppercase tracking-[0.14em] text-[#dfe5da]';
  const selectClass = 'w-full border-b border-zinc-500/25 bg-transparent pb-2 font-kingthings text-[0.82rem] uppercase tracking-[0.14em] text-[#dfe5da] outline-none transition-colors hover:border-red-700/80 focus:border-red-700 [&_option]:bg-[#0a0e0f]';
  const headerCardClass = 'border border-zinc-500/30 bg-[#080c0d]/95 shadow-[inset_0_0_60px_rgba(0,0,0,0.45)]';
  const headerMetaLabelClass = 'font-geist-mono text-[0.54rem] uppercase tracking-[0.24em] text-zinc-500';

  const cancelPendingChronicleLink = async () => {
    if (!pendingSessionTransfer?.requestId) return;

    const cancelled = await cancelSheetLinkRequest(sheetId, pendingSessionTransfer, setShowMessage);

    if (cancelled) {
      setChronicleTransferPrompt(null);
      setDataSheet((current: any) => {
        if (!current) return current;

        const updatedSheet = { ...current };
        delete updatedSheet.pendingSessionLink;
        return updatedSheet;
      });
    }
  };


  return (
    <div className="principles-scrollbar mb-3 flex h-full w-full flex-col items-start justify-start overflow-y-auto overflow-x-hidden sm:px-4 pr-2 text-white font-bold [direction:rtl]">
      <div className="h-full w-full [direction:ltr]">
        <div className="relative min-h-full w-full">
        {isReadOnlyCommunitySheet ? (
          <div className={`${headerCardClass} mt-5 px-4 py-4`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={headerMetaLabelClass}>Ficha da Comunidade</p>
                <div className="mt-2 font-geist-mono text-[0.62rem] uppercase tracking-[0.14em] text-zinc-200">
                  Esta ficha pertence a comunidade. Use o botão de copiar para criar uma versão sua e liberar a edição.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={requestCopySheet} className="items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900" title="Copiar ficha">
                  <FaCopy className="text-base" />
                </button>
                <button type="button" onClick={() => setShowDownloadPdf({ show: true, email: '' })} className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900" title="Download de ficha">
                  <FaFileDownload className="text-base" />
                </button>
                {isStandaloneSheetView && <Nav compact />}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative mt-5 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            <div className={`${headerCardClass} px-4 py-3 ${shouldBlockUntilCharacterSelection ? 'relative z-20' : ''}`}>
              {isStandaloneSheetView ? (
                <>
                  <p className={headerMetaLabelClass}>Navegação</p>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => router.push('/sheets')}
                      className="inline-flex min-h-[42px] w-full items-center justify-center border border-red-950 bg-red-950 px-4 py-2.5 font-geist-mono text-[0.66rem] uppercase tracking-[0.18em] text-white transition-colors hover:bg-red-900"
                    >
                      Retornar para Fichas
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className={headerMetaLabelClass}>Personagem Ativo</p>
                  <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <select
                      value={activeSessionCharacterValue}
                      disabled={isReadOnlyCommunitySheet}
                      onChange={(event) => {
                        if (event.target.value === '__none__') {
                          clearSessionCharacter();
                          return;
                        }

                        selectSessionCharacter(event.target.value);
                      }}
                      className={`min-w-0 flex-1 border border-zinc-500/30 bg-black/60 px-4 py-2.5 text-left font-geist-mono text-[0.66rem] uppercase tracking-[0.18em] text-white/75 outline-none transition-colors hover:border-red-700/80 hover:text-white ${isReadOnlyCommunitySheet ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
                    >
                      {isNarrator && <option key="no-character" value="__none__">Nenhum personagem</option>}
                      {!isNarrator && sheetId === '' && <option key="select-character" value="">Selecione um personagem</option>}
                      {sessionCharacterOptions.map((player: any, index: number) => {
                        const optionValue = player?.id || `session-character-${player?.email || player?.user || 'player'}-${index}`;
                        const optionKey = `${optionValue}-${index}`;

                        return (
                          <option key={optionKey} value={optionValue}>
                            {getSessionCharacterLabel(player)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className={`relative ${headerCardClass} px-4 py-3 ${hasPendingSessionTransfer ? 'pointer-events-none select-none opacity-45' : ''}`}> 
              {shouldBlockUntilCharacterSelection && (
                <div className="absolute inset-0 z-20 bg-black/80" />
              )}
              <div className={`${isStandaloneSheetView ? 'flex justify-end' : 'grid grid-cols-[minmax(0,1fr)_auto] gap-3'} ${shouldBlockUntilCharacterSelection ? 'pointer-events-none select-none' : ''}`}>
                {!isStandaloneSheetView && (
                  <div>
                    <p className={headerMetaLabelClass}>Experiência</p>
                    <div className={`mt-2 flex min-h-[42px] items-center justify-between border border-zinc-500/30 px-3 ${input === 'xp' ? 'bg-[#dfe5da]' : 'bg-[#b8beb5]'}`}>
                      {input === 'xp' ? (
                        <input
                          type="text"
                          className="mr-2 w-full bg-transparent text-center font-geist-mono text-[0.8rem] uppercase tracking-[0.08em] text-black outline-none"
                          placeholder="Valor de XP"
                          value={xp}
                          onChange={(e) => setXp(e.target.value)}
                        />
                      ) : (
                        <span className="w-full break-words text-center font-geist-mono text-[0.78rem] uppercase tracking-[0.14em] text-black">
                          {!sheetDataValues.xp ? 'XP' : sheetDataValues.xp}
                        </span>
                      )}
                      {session.gameMaster === email && !isReadOnlyCommunitySheet && (
                        <div>
                          {input === 'xp' ? (
                            <BsCheckSquare
                              onClick={async (e: any) => {
                                e.stopPropagation();
                                const updated = await updateValue('xp', xp, 'XP');
                                if (updated) setInput('');
                              }}
                              className="sheet-readonly-action cursor-pointer text-lg text-black"
                            />
                          ) : (
                            <FaRegEdit
                              onClick={(e: any) => {
                                setInput('xp');
                                e.stopPropagation();
                              }}
                              className="sheet-readonly-action cursor-pointer text-lg text-black"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <p className={headerMetaLabelClass}>Ações</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button type="button" onClick={() => setShowEvaluateSheet({ show: true, data: 'player' })} className="items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900" title="Verificar ficha">
                      <FaFileCircleCheck className="text-base" />
                    </button>
                    {canCopySheet && (
                      <button type="button" onClick={requestCopySheet} className="items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900" title="Copiar ficha">
                        <FaCopy className="text-base" />
                      </button>
                    )}
                    <button type="button" onClick={() => setShowDownloadPdf({ show: true, email: '' })} className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900" title="Download de ficha">
                      <FaFileDownload className="text-base" />
                    </button>
                    {canDeleteSheet && (
                      <>
                        <button type="button" onClick={() => setShowResetSheet(true)} className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900" title="Limpar ficha">
                          <FaEraser className="text-base" />
                        </button>
                        <button type="button" onClick={() => setShowDeleteSheet(true)} className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900" title="Excluir ficha">
                          <FaTrashAlt className="text-base" />
                        </button>
                      </>
                    )}
                    {isStandaloneSheetView && <Nav compact />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={`relative ${isReadOnlyCommunitySheet && !showCopySheetPrompt ? 'pointer-events-none select-none opacity-80 [&_.sheet-readonly-action]:hidden' : ''}`}>
          {shouldBlockUntilCharacterSelection && (
            <div className="absolute inset-0 z-20 bg-black/80" />
          )}
          <section className={`relative w-full overflow-visible text-slate-300 ${shouldBlockUntilCharacterSelection ? 'pointer-events-none select-none' : ''}`}>
            <span className="absolute right-0 top-0 h-px w-4 bg-red-700/85" />
            <span className="absolute right-0 top-0 h-4 w-px bg-red-700/85" />
            <span className="absolute bottom-0 left-0 h-px w-4 bg-red-700/85" />
            <span className="absolute bottom-0 left-0 h-4 w-px bg-red-700/85" />
            <div className="grid grid-cols-1 sm:gap-5 sm:grid-cols-9 sm:pb-5 w-full">
              <div className={`pb-4 sm:pb-0 relative col-span-1 mt-2 sm:mt-5 h-full w-full overflow-visible sm:col-span-3 text-white shadow-[inset_0_0_80px_rgba(0,0,0,0.72)] ${hasPendingSessionTransfer ? 'pointer-events-none select-none opacity-45' : ''}`}>
                <div className={`border border-zinc-500/30 bg-[#080c0d]/95 w-full h-full`}> 
                  <span className="absolute right-0 top-0 h-px w-4 bg-red-700/85" />
                  <span className="absolute right-0 top-0 h-4 w-px bg-red-700/85" />
                  <span className="absolute bottom-0 left-0 h-px w-4 bg-red-700/85" />
                  <span className="absolute bottom-0 left-0 h-4 w-px bg-red-700/85" />
                  <div className="relative px-6 pb-6 pt-5 h-full">
                    <div className="relative min-h-[190px]">
                      <div className="flex w-full flex-col items-start gap-5 pr-[42%]">
                        {sheetDataValues.trybe && (
                          <Image
                            src={`/images/trybes/${capitalizeFirstLetter(sheetDataValues.trybe)}.png`}
                            alt={`Glifo da tribo ${capitalizeFirstLetter(sheetDataValues.trybe)}`}
                            className="h-auto w-24 object-contain opacity-85"
                            width={2000}
                            height={800}
                            priority
                          />
                        )}

                        <div className="w-full">
                          <div className="mt-2 flex min-w-0 items-center gap-3 border-b border-zinc-500/25 pb-2" onClick={() => { if (canEditPortraitUrl) setInput('portraitUrl'); }}>
                            {input === 'portraitUrl' && canEditPortraitUrl ? (
                              <input
                                type="text"
                                className="w-full bg-transparent font-geist-mono text-[0.68rem] tracking-[0.06em] text-[#e1e7dd] outline-none placeholder:text-zinc-500"
                                placeholder="https://exemplo.com/imagem.png"
                                value={portraitUrl}
                                onChange={(e) => setPortraitUrl(e.target.value)}
                              />
                            ) : (
                              <span className="block w-full truncate whitespace-nowrap font-geist-mono text-[0.62rem] uppercase tracking-[0.12em] text-zinc-400">
                                {portraitUrlPersisted !== '' ? portraitUrlPersisted : 'Cole um link de imagem'}
                              </span>
                            )}
                            {canEditPortraitUrl && (input === 'portraitUrl' ? (
                              <BsCheckSquare
                                onClick={async (e: any) => {
                                  e.stopPropagation();
                                  const updated = await updateValue('portraitUrl', portraitUrl, 'link da imagem');
                                  if (updated) setInput('');
                                }}
                                className="cursor-pointer text-xl text-red-500/85"
                              />
                            ) : (
                              <FaRegEdit
                                onClick={(e: any) => {
                                  setInput('portraitUrl');
                                  e.stopPropagation();
                                }}
                                className="cursor-pointer text-lg text-red-500/85"
                              />
                            ))}
                          </div>
                          {portraitImageError && portraitUrlPersisted !== '' && (
                            <div className="mt-2 font-geist-mono text-[0.54rem] uppercase tracking-[0.16em] text-red-400/80">
                              Não foi possível carregar esta imagem.
                            </div>
                          )}
                        </div>
                      </div>

                      {portraitUrlPersisted !== '' && !portraitImageError && (
                        <>
                          <div className="absolute -right-6 -top-7 z-20 w-[45%] max-w-[158px] -rotate-[7deg] border border-zinc-400/20 bg-black p-1 shadow-[0_26px_46px_rgba(0,0,0,0.52)]">
                            <img
                              src={portraitUrlPersisted}
                              alt={`Imagem de ${displayName || 'personagem'}`}
                              className="h-[190px] w-full object-cover"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={() => setPortraitImageError(true)}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-5 grid w-full grid-cols-1 gap-5">
                      <div>
                        <p className={fieldLabelClass}>Tribo</p>
                        <select className={selectClass} value={sheetDataValues.trybe || ''} onChange={(e) => updateValue('trybe', e.target.value, 'Tribo')}>
                          <option key="trybe-placeholder" disabled value="">Escolha uma tribo</option>
                          {availableTrybes.map((trybe, index) => (
                            <option key={index} value={trybe.nameEn}>
                              {trybe.namePtBr}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className={fieldLabelClass}>Augúrio</p>
                        <select className={selectClass} value={sheetDataValues.auspice || ''} onChange={(e) => updateValue('auspice', e.target.value, 'Augúrio')}>
                          <option key="auspice-placeholder" disabled value="">Escolha um Augúrio</option>
                          <option key="auspice-ragabash" value="ragabash">Ragabash</option>
                          <option key="auspice-theurge" value="theurge">Theurge</option>
                          <option key="auspice-philodox" value="philodox">Philodox</option>
                          <option key="auspice-galliard" value="galliard">Galliard</option>
                          <option key="auspice-ahroun" value="ahroun">Ahroun</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative col-span-6 sm:mt-5 h-full w-full overflow-visible border border-zinc-500/30 bg-[#080c0d]/95 text-white shadow-[inset_0_0_80px_rgba(0,0,0,0.72)]">
                <span className="absolute right-0 top-0 h-px w-4 bg-red-700/85" />
                <span className="absolute right-0 top-0 h-4 w-px bg-red-700/85" />
                <span className="absolute bottom-0 left-0 h-px w-4 bg-red-700/85" />
                <span className="absolute bottom-0 left-0 h-4 w-px bg-red-700/85" />
                <div className="flex items-center justify-between px-6 pb-3 pt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5  w-full">
                    <div className="md:col-span-2">
                      <p className={fieldLabelClass}>Nome do Personagem</p>
                      <div className="mt-2 flex items-center gap-3 border-b border-zinc-500/25 pb-2" onClick={() => { if (!hasPendingSessionTransfer && canManageSheetIdentity) setInput('nameCharacter'); }}>
                        {input !== 'nameCharacter' ? (
                          <span className="w-full break-words font-kingthings text-[0.94rem] uppercase tracking-[0.18em] text-[#e1e7dd]">
                            {displayName === '' ? 'Insira um nome' : displayName}
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-full bg-transparent font-kingthings text-[0.94rem] uppercase tracking-[0.18em] text-[#e1e7dd] outline-none"
                            placeholder="Nome"
                            value={newName}
                            onChange={(e) => typeName(e)}
                          />
                        )}
                        {canManageSheetIdentity && (input === 'nameCharacter' ? (
                          <BsCheckSquare
                            onClick={async (e: any) => {
                              e.stopPropagation();
                              const updated = await updateValue('name', newName, 'nome do personagem');
                              if (updated) setInput('');
                            }}
                            className="cursor-pointer text-xl text-red-500/85"
                          />
                        ) : (
                          <FaRegEdit
                            onClick={(e: any) => {
                              setInput('nameCharacter');
                              e.stopPropagation();
                            }}
                            className="cursor-pointer text-lg text-red-500/85"
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className={fieldLabelClass}>Crônica</p>
                      {hasPendingSessionTransfer && (!isStandaloneSheetView || dataSheet?.email === email) ? (
                        <div className="mt-2 border-b border-zinc-500/20 pb-3">
                          <p className="font-geist-mono text-[0.64rem] uppercase tracking-[0.12em] text-zinc-200">
                            Voce solicitou transferência para a sessão {pendingSessionTransfer.sessionName}
                          </p>
                          <button
                            type="button"
                            onClick={cancelPendingChronicleLink}
                            className="mt-3 inline-flex border border-red-700/60 bg-black px-3 py-2 font-geist-mono text-[0.62rem] uppercase tracking-[0.14em] text-white transition-colors hover:bg-red-950"
                          >
                            Cancelar solicitação
                          </button>
                        </div>
                      ) : (
                        <select
                          value={dataSheet?.sessionId || '__current__'}
                          onChange={async (event) => {
                            await requestChronicleLink(event.target.value);
                          }}
                          className={selectClass}
                        >
                          <option key="current-session" value={dataSheet?.sessionId || '__current__'}>{sessionName}</option>
                          {activeSessions.length > 0 ? (
                            activeSessions.map((sessionItem) => (
                              <option key={sessionItem.id} value={sessionItem.id}>
                                {capitalizeFirstLetter(sessionItem.name)}
                              </option>
                            ))
                          ) : (
                            <option key="empty-sessions" value="__empty__" disabled>
                              Nenhuma mesa ativa disponível
                            </option>
                          )}
                        </select>
                      )}
                    </div>
                    <div>
                      <p className={fieldLabelClass}>Jogador</p>
                      <div className={fieldValueClass}>{playerName}</div>
                    </div>
                    <div className="group relative">
                      <p className={fieldLabelClass}>Padroeiro</p>
                      <div className={`${fieldValueClass} cursor-help pr-4`}>{patronName}</div>
                      <div className="pointer-events-none absolute left-0 top-full z-30 mt-3 hidden w-[min(20rem,calc(100vw-4rem))] border border-red-700/40 bg-black p-3 font-geist-mono text-[0.62rem] leading-relaxed tracking-[0.08em] text-zinc-200 shadow-[0_18px_36px_rgba(0,0,0,0.45)] group-hover:block">
                        {patronDescription}
                      </div>
                    </div>
                    {canViewSheetEmail && (
                      <div>
                        <p className={fieldLabelClass}>Email</p>
                        <div
                          className="mt-2 flex items-center gap-3 border-b border-zinc-500/25 pb-2"
                          onClick={() => {
                            if (!hasPendingSessionTransfer && canManageSheetIdentity) setInput('sheetEmail');
                          }}
                        >
                          {input === 'sheetEmail' && canManageSheetIdentity ? (
                            <input
                              type="email"
                              className="w-full bg-transparent font-geist-mono text-[0.72rem] tracking-[0.08em] text-[#dfe5da] outline-none placeholder:text-zinc-500"
                              placeholder="email@exemplo.com"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                            />
                          ) : (
                            <span className="w-full break-words font-geist-mono text-[0.72rem] tracking-[0.08em] text-[#dfe5da]">
                              {dataSheet?.email || 'Sem email'}
                            </span>
                          )}
                          {canManageSheetIdentity && (input === 'sheetEmail' ? (
                            <BsCheckSquare
                              onClick={async (e: any) => {
                                e.stopPropagation();
                                const updated = await updateSheetEmail(newEmail);
                                if (updated) setInput('');
                              }}
                              className="cursor-pointer text-xl text-red-500/85"
                            />
                          ) : (
                            <FaRegEdit
                              onClick={(e: any) => {
                                setInput('sheetEmail');
                                e.stopPropagation();
                              }}
                              className="cursor-pointer text-lg text-red-500/85"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="sm:col-span-2">
                      <p className={fieldLabelClass}>Favor</p>
                      <div className="mt-2 border-b border-zinc-500/20 pb-2 font-geist-mono uppercase text-[#dfe5da] whitespace-normal break-words pr-2 text-[8px] leading-relaxed tracking-[0.08em]">
                        {patronFavor}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <p className={fieldLabelClass}>Proibição</p>
                      <div className="mt-2 border-b border-zinc-500/20 pb-2 font-geist-mono uppercase text-[#dfe5da] whitespace-normal break-words pr-2 text-[8px] leading-relaxed tracking-[0.08em]">
                        {patronBan}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="grid grid-cols-1 sm:grid-cols-9 sm:gap-4">
            <div className="col-span-6 grid h-full grid-cols-1 sm:grid-cols-6 gap-2 sm:gap-4">
              <div className="col-span-2 h-full sm:pb-5">
                <ItemAgravated name="health" namePtBr="Vitalidade" />
              </div>
              <div className="col-span-2 h-full sm:pb-5">
                <ItemAgravated name="willpower" namePtBr="Força de Vontade" />
              </div>
              <div className="col-span-2 h-full sm:pb-5">
                <Item quant={5} name="rage" namePtBr="Fúria" />
              </div>
            </div>
            <div className="col-span-1 sm:col-span-3 w-full mt-2 sm:mt-0">
              <ItemRenownHaranoHauglosk />
            </div>
          </div>
          <Attributes />
          <Skills />
          <div className="grid w-full md:grid-cols-2 gap-2 sm:gap-5">
            <Gifts />
            <Rituals />
          </div>
          {!isStandaloneSheetView && <Forms />}
          <AdvantagesAndFlaws />
          <Touchstones />
      {showCopySheetPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6">
          <div className="relative flex w-full max-w-2xl flex-col overflow-hidden border border-zinc-500/40 bg-zinc-950/85">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/wallpapers/128.jpg')" }}
            />
            <div className="absolute inset-0 bg-black/90" />

            <button
              type="button"
              onClick={() => setShowCopySheetPrompt(false)}
              className="absolute right-4 top-4 z-20 text-2xl text-white/70 transition-colors hover:text-red-400"
              aria-label="Fechar confirmação de cópia"
            >
              <AiFillCloseCircle />
            </button>

            <div className="relative z-10 flex w-full flex-col items-end px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
              <h2 className="mt-2 w-full text-left font-kingthings text-xl">Copiar Ficha</h2>
              <p className="mt-2 w-full text-left font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
                Deseja copiar esta ficha? Uma nova versão será criada para o seu usuário.
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-4 px-5 pb-6 sm:px-8 sm:pb-8">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-start">
                <button
                  type="button"
                  onClick={() => setShowCopySheetPrompt(false)}
                  className="inline-flex items-center justify-center border border-zinc-500/40 bg-black/60 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:border-white/40 hover:bg-black/80"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => void copyCommunitySheet()}
                  className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {chronicleTransferPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6">
          <div className="relative flex w-full max-w-2xl flex-col overflow-hidden border border-zinc-500/40 bg-zinc-950/85">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/wallpapers/128.jpg')" }}
            />
            <div className="absolute inset-0 bg-black/90" />

            <button
              type="button"
              onClick={() => setChronicleTransferPrompt(null)}
              className="absolute right-4 top-4 z-20 text-2xl text-white/70 transition-colors hover:text-red-400"
              aria-label="Fechar transferência de ficha"
            >
              <AiFillCloseCircle />
            </button>

            <div className="relative z-10 flex w-full flex-col items-end px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
              <h2 className="mt-2 w-full text-left font-kingthings text-xl">Transferência De Ficha</h2>
              <p className="mt-2 w-full text-left font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
                Deseja solicitar a transferência desta ficha para a sessão {capitalizeFirstLetter(chronicleTransferPrompt.name)}?
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-4 px-5 pb-6 sm:px-8 sm:pb-8">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-start">
                <button
                  type="button"
                  onClick={() => setChronicleTransferPrompt(null)}
                  className="inline-flex items-center justify-center border border-zinc-500/40 bg-black/60 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:border-white/40 hover:bg-black/80"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmChronicleLink}
                  className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
          <Background type="background" />
          <Background type="notes" />
        </div>
      </div>
      </div>
      {showResetSheet && <ResetSheet />}
      {showDeleteSheet && <DeleteSheet isGameMaster={session.gameMaster === email} />}
    </div>
  );
}














