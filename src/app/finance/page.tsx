'use client'
import Footer from "@/components/footer";
import MessageToUser from "@/components/dicesAndMessages/messageToUser";
import Loading from "@/components/loading";
import Nav from "@/components/nav";
import contexto from "@/context/context";
import { authenticate } from "@/firebase/authenticate";
import { createFinance, deleteFinance, duplicateFinance, getFinances, updateFinance } from "@/firebase/finance";
import { getFinancePeriodOrder, getMonthLabelByOrder, sortFinancesByPeriod } from "@/utils/financePeriod";
import { useRouter } from "next/navigation";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useContext, useEffect, useState } from "react";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const emptyPlayer = {
  name: '',
  payDate: '',
  sessions: [],
  value: '',
  situation: '',
};

const normalizePlayers = (players: any[] = []) => (
  players.map((player: any) => ({
    name: player.name || '',
    payDate: player.payDate || '',
    sessions: Array.isArray(player.sessions) ? player.sessions : [],
    value: player.value ?? '',
    situation: player.situation || '',
  }))
);

const normalizeTextValue = (value: string = "") => value.trim().toLowerCase();

const isCurrentFinancePeriod = (finance: any, currentPeriodOrder: number) => (
  getFinancePeriodOrder(finance.month || '', finance.year || '') === currentPeriodOrder
);

const sortFinancesForDisplay = (finances: any[], currentPeriodOrder: number) => {
  const sortedFinances = sortFinancesByPeriod(finances);
  const currentMonthFinances = sortedFinances.filter((finance: any) => (
    isCurrentFinancePeriod(finance, currentPeriodOrder)
  ));
  const otherFinances = sortedFinances.filter((finance: any) => (
    !isCurrentFinancePeriod(finance, currentPeriodOrder)
  ));

  return [...currentMonthFinances, ...otherFinances];
};

const getDefaultCollapsedFinanceIds = (finances: any[], currentPeriodOrder: number) => (
  finances
    .map((finance: any) => finance.id)
    .filter(Boolean)
);

const playerLineColors = [
  "#38bdf8",
  "#f43f5e",
  "#22c55e",
  "#a855f7",
  "#eab308",
  "#fb7185",
  "#14b8a6",
  "#f97316",
  "#818cf8",
  "#84cc16",
  "#06b6d4",
  "#ef4444",
];

export default function Finance() {
  const router = useRouter();
  const [financeList, setFinanceList] = useState<any>([]);
  const [showFinancePage, setShowFinancePage] = useState(false);
  const [activeFinanceTab, setActiveFinanceTab] = useState<'overview' | 'player'>('overview');
  const [isCreatingFinance, setIsCreatingFinance] = useState(false);
  const [editingFinanceHeaderId, setEditingFinanceHeaderId] = useState<string | null>(null);
  const [editingPlayerKey, setEditingPlayerKey] = useState<string | null>(null);
  const [collapsedFinanceIds, setCollapsedFinanceIds] = useState<string[]>([]);
  const [hiddenPlayerLines, setHiddenPlayerLines] = useState<string[]>([]);
  const [selectedPlayerName, setSelectedPlayerName] = useState("");
  const [sortConfigByFinance, setSortConfigByFinance] = useState<Record<string, {
    field: 'name' | 'payDate' | 'value' | 'situation',
    direction: 'asc' | 'desc',
  }>>({});
  const [deletePlayerPopup, setDeletePlayerPopup] = useState<{
    show: boolean,
    financeId: string,
    playerIndex: number,
  }>({
    show: false,
    financeId: '',
    playerIndex: -1,
  });
  const [deleteFinancePopup, setDeleteFinancePopup] = useState<{
    show: boolean,
    financeId: string,
  }>({
    show: false,
    financeId: '',
  });
  const { dataUser, setDataUser, showMessage, setShowMessage } = useContext(contexto);
  const currentYear = new Date().getFullYear();
  const currentMonthNumber = new Date().getMonth() + 1;
  const currentPeriodOrder = (currentYear * 100) + currentMonthNumber;
  const authorizedFinanceEmail = "lycan.byell@gmail.com";

  useEffect(() => {
    const validateAccess = async () => {
      let authUser = dataUser;

      if (authUser.email === '' || authUser.displayName === '') {
        const authData: any = await authenticate(setShowMessage);
        if (!authData?.email || !authData?.displayName) {
          router.push('/');
          return;
        }

        authUser = { email: authData.email, displayName: authData.displayName };
        setDataUser(authUser);
      }

      if (authUser.email !== authorizedFinanceEmail) {
        router.push('/');
        return;
      }

      setShowFinancePage(true);
    };

    validateAccess();
  }, [authorizedFinanceEmail, dataUser, router, setDataUser, setShowMessage]);

  useEffect(() => {
    if (!showFinancePage) return;

    const loadFinances = async () => {
      try {
        const finances = await getFinances();
        const normalizedFinances = sortFinancesForDisplay(
          finances.map((finance: any) => ({
            ...finance,
            month: finance.month || '',
            year: finance.year || '',
            players: normalizePlayers(finance.players),
          })),
          currentPeriodOrder
        );

        setFinanceList(normalizedFinances);
        setCollapsedFinanceIds(getDefaultCollapsedFinanceIds(normalizedFinances, currentPeriodOrder));
      } catch (error) {
        setShowMessage({ show: true, text: 'Ocorreu um erro ao carregar as planilhas: ' + error });
      }
    };

    loadFinances();
  }, [currentPeriodOrder, setShowMessage, showFinancePage]);

  const getSumValues = (players: any[] = []) => {
    let value = 0;
    players.forEach((player: any) => {
      value += Number(player.value) || 0;
    });
    return value;
  };

  const getSumValuesBySituation = (players: any[] = [], situation: string) => {
    let value = 0;
    players.forEach((player: any) => {
      if (player.situation === situation) value += Number(player.value) || 0;
    });
    return value;
  };

  const formatCurrencyValue = (value: number | string) => (
    Number(value || 0).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );

  const getPlayerEditKey = (financeId: string, playerIndex: number) => `${financeId}-${playerIndex}`;

  const getFinanceById = (financeId: string) => financeList.find((finance: any) => finance.id === financeId);

  const getDateSortValue = (dateValue: string) => {
    const trimmedDate = (dateValue || '').trim();
    if (!trimmedDate) return Number.MAX_SAFE_INTEGER;

    if (/^\d+$/.test(trimmedDate)) {
      return Number(trimmedDate);
    }

    const parts = trimmedDate.split('/').map((item) => item.trim());
    if (parts.length >= 2) {
      const day = Number(parts[0]) || 0;
      const month = Number(parts[1]) || 0;
      const year = parts[2] ? Number(parts[2]) : 9999;
      return year * 10000 + month * 100 + day;
    }

    return trimmedDate.toLowerCase();
  };

  const getSortedPlayers = (
    players: any[],
    field: 'name' | 'payDate' | 'value' | 'situation',
    direction: 'asc' | 'desc'
  ) => {
    const sortedPlayers = [...players].sort((playerA: any, playerB: any) => {
      let compareValue = 0;

      if (field === 'name' || field === 'situation') {
        compareValue = String(playerA[field] || '').localeCompare(String(playerB[field] || ''), 'pt-BR');
      }

      if (field === 'payDate') {
        const valueA = getDateSortValue(playerA.payDate);
        const valueB = getDateSortValue(playerB.payDate);
        compareValue = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      }

      if (field === 'value') {
        compareValue = (Number(playerA.value) || 0) - (Number(playerB.value) || 0);
      }

      return direction === 'asc' ? compareValue : compareValue * -1;
    });

    return sortedPlayers;
  };

  const getSortLabel = (financeId: string, field: 'name' | 'payDate' | 'value' | 'situation') => {
    const sortConfig = sortConfigByFinance[financeId];
    if (!sortConfig || sortConfig.field !== field) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const getPlayersForPersist = (players: any[] = []) => (
    players.map((player: any) => ({
      name: player.name || '',
      payDate: player.payDate || '',
      sessions: typeof player.sessionsText === 'string'
        ? player.sessionsText.split(',').map((session: string) => session.trim()).filter(Boolean)
        : (Array.isArray(player.sessions) ? player.sessions : []),
      value: player.value ?? '',
      situation: player.situation || '',
    }))
  );

  const financeSummary = financeList.reduce((accumulator: {
    currentMonthRevenue: number,
    currentYearRevenue: number,
    totalRevenue: number,
  }, finance: any) => {
    const financePeriodOrder = getFinancePeriodOrder(finance.month || '', finance.year || '');
    const paidValue = getSumValuesBySituation(finance.players, 'Pago');

    if (financePeriodOrder === currentPeriodOrder) {
      accumulator.currentMonthRevenue += paidValue;
    }

    if (Math.floor(financePeriodOrder / 100) === currentYear) {
      accumulator.currentYearRevenue += paidValue;
    }

    accumulator.totalRevenue += paidValue;
    return accumulator;
  }, {
    currentMonthRevenue: 0,
    currentYearRevenue: 0,
    totalRevenue: 0,
  });

  const monthlyAverageRevenue = financeSummary.currentYearRevenue / currentMonthNumber;

  const financeChartData = Array.from({ length: 12 }, (_, index) => {
    const monthNumber = index + 1;
    const periodOrder = (currentYear * 100) + monthNumber;

    const monthTotals = financeList.reduce((accumulator: {
      paidValue: number,
      totalValue: number,
    }, finance: any) => {
      const financePeriodOrder = getFinancePeriodOrder(finance.month || '', finance.year || '');
      if (financePeriodOrder !== periodOrder) return accumulator;

      return {
        paidValue: accumulator.paidValue + getSumValuesBySituation(finance.players, 'Pago'),
        totalValue: accumulator.totalValue + getSumValues(finance.players),
      };
    }, {
      paidValue: 0,
      totalValue: 0,
    });

    return {
      periodOrder,
      label: getMonthLabelByOrder(monthNumber),
      paidValue: monthTotals.paidValue,
      totalValue: monthTotals.totalValue,
    };
  });

  const playerPerformanceMap = financeList.reduce((accumulator: Record<string, number[]>, finance: any) => {
    const financePeriodOrder = getFinancePeriodOrder(finance.month || '', finance.year || '');
    if (Math.floor(financePeriodOrder / 100) !== currentYear) return accumulator;

    const monthNumber = financePeriodOrder % 100;
    if (!monthNumber || monthNumber < 1 || monthNumber > 12) return accumulator;

    (finance.players || []).forEach((player: any) => {
      const playerName = String(player.name || '').trim();
      if (!playerName) return;

      if (!accumulator[playerName]) {
        accumulator[playerName] = Array.from({ length: 12 }, () => 0);
      }

      accumulator[playerName][monthNumber - 1] += Number(player.value) || 0;
    });

    return accumulator;
  }, {});

  const playerLineNames = Object.keys(playerPerformanceMap).sort((playerA, playerB) => (
    playerA.localeCompare(playerB, 'pt-BR')
  ));

  const selectablePlayerNames: string[] = Array.from(new Set<string>(
    financeList.flatMap((finance: any) => (
      (finance.players || [])
        .map((player: any) => String(player.name || '').trim())
        .filter(Boolean)
    ))
  )).sort((playerA, playerB) => playerA.localeCompare(playerB, 'pt-BR'));

  useEffect(() => {
    if (selectablePlayerNames.length === 0) {
      setSelectedPlayerName("");
      return;
    }

    setSelectedPlayerName((prevState) => (
      selectablePlayerNames.includes(prevState) ? prevState : selectablePlayerNames[0]
    ));
  }, [selectablePlayerNames]);

  const playerChartData = Array.from({ length: 12 }, (_, index) => {
    const monthNumber = index + 1;
    const monthData: Record<string, number | string> = {
      label: getMonthLabelByOrder(monthNumber),
    };

    playerLineNames.forEach((playerName) => {
      monthData[playerName] = playerPerformanceMap[playerName][index] || 0;
    });

    return monthData;
  });

  const selectedPlayerSummary = financeList.reduce((accumulator: {
    currentYearRevenue: number,
    totalRevenue: number,
  }, finance: any) => {
    if (!selectedPlayerName) return accumulator;

    const financePeriodOrder = getFinancePeriodOrder(finance.month || '', finance.year || '');
    const selectedPlayers = (finance.players || []).filter((player: any) => (
      normalizeTextValue(player.name || "") === normalizeTextValue(selectedPlayerName)
    ));

    const paidValue = selectedPlayers.reduce((total: number, player: any) => (
      player.situation === 'Pago' ? total + (Number(player.value) || 0) : total
    ), 0);

    if (Math.floor(financePeriodOrder / 100) === currentYear) {
      accumulator.currentYearRevenue += paidValue;
    }

    accumulator.totalRevenue += paidValue;
    return accumulator;
  }, {
    currentYearRevenue: 0,
    totalRevenue: 0,
  });

  const selectedPlayerMonthlyAverage = selectedPlayerSummary.currentYearRevenue / currentMonthNumber;

  const handleTogglePlayerLine = (playerName: string) => {
    setHiddenPlayerLines((prevState) => (
      prevState.includes(playerName)
        ? prevState.filter((item) => item !== playerName)
        : [...prevState, playerName]
    ));
  };

  const handleCreateFinance = async () => {
    setIsCreatingFinance(true);

    try {
      const newFinance = await createFinance(setShowMessage);
      if (newFinance) {
        const normalizedFinance = {
          ...newFinance,
          month: newFinance.month || '',
          year: newFinance.year || '',
          players: normalizePlayers(newFinance.players),
        };

        setFinanceList((prevState: any[]) => sortFinancesForDisplay([normalizedFinance, ...prevState], currentPeriodOrder));
        setCollapsedFinanceIds((prevState) => (
          prevState.includes(newFinance.id) ? prevState : [newFinance.id, ...prevState]
        ));
        setEditingFinanceHeaderId(null);
        setShowMessage({ show: true, text: 'Planilha criada com sucesso!' });
      }
    } finally {
      setIsCreatingFinance(false);
    }
  };

  const handleFinanceFieldChange = (financeId: string, field: 'month' | 'year', value: string) => {
    setFinanceList((prevState: any[]) => prevState.map((finance: any) => (
      finance.id === financeId ? { ...finance, [field]: value } : finance
    )));
  };

  const handleDuplicateFinance = async (financeId: string) => {
    const finance = getFinanceById(financeId);
    if (!finance) return;

    const newFinance = await duplicateFinance({
      players: getPlayersForPersist(finance.players).map((player: any) => ({
        ...player,
        situation: 'Pendente',
      })),
    }, setShowMessage);

    if (newFinance) {
      const normalizedFinance = {
        ...newFinance,
        month: '',
        year: '',
        players: normalizePlayers(newFinance.players),
      };

      setFinanceList((prevState: any[]) => sortFinancesForDisplay([normalizedFinance, ...prevState], currentPeriodOrder));
      setCollapsedFinanceIds((prevState) => (
        prevState.includes(newFinance.id) ? prevState : [newFinance.id, ...prevState]
      ));
      setEditingFinanceHeaderId(null);
      setShowMessage({ show: true, text: 'Planilha copiada com sucesso!' });
    }
  };

  const handleSaveFinanceHeader = async (financeId: string) => {
    const finance = getFinanceById(financeId);
    if (!finance) return;
    const success = await updateFinance(financeId, {
      month: finance.month || '',
      year: finance.year || '',
    }, setShowMessage);
    if (success) {
      setFinanceList((prevState: any[]) => sortFinancesForDisplay([...prevState], currentPeriodOrder));
      setEditingFinanceHeaderId(null);
      setShowMessage({ show: true, text: 'Periodo da planilha atualizado com sucesso!' });
    }
  };

  const handlePlayerFieldChange = (
    financeId: string,
    playerIndex: number,
    field: 'name' | 'payDate' | 'sessionsText' | 'value' | 'situation',
    value: string
  ) => {
    setFinanceList((prevState: any[]) => prevState.map((finance: any) => {
      if (finance.id !== financeId) return finance;

      const updatedPlayers = finance.players.map((player: any, index: number) => {
        if (index !== playerIndex) return player;
        return { ...player, [field]: value };
      });

      return { ...finance, players: updatedPlayers };
    }));
  };

  const handleAddPlayer = async (financeId: string) => {
    const finance = getFinanceById(financeId);
    if (!finance) return;

    const nextPlayers = [...normalizePlayers(finance.players), { ...emptyPlayer }];
    const success = await updateFinance(financeId, {
      players: getPlayersForPersist(nextPlayers),
    }, setShowMessage);

    if (success) {
      setFinanceList((prevState: any[]) => prevState.map((item: any) => (
        item.id === financeId ? { ...item, players: nextPlayers } : item
      )));
      setEditingPlayerKey(getPlayerEditKey(financeId, nextPlayers.length - 1));
      setShowMessage({ show: true, text: 'Jogador inserido com sucesso!' });
    }
  };

  const handleOpenDeletePlayerPopup = (financeId: string, playerIndex: number) => {
    setDeletePlayerPopup({ show: true, financeId, playerIndex });
  };

  const handleCloseDeletePlayerPopup = () => {
    setDeletePlayerPopup({ show: false, financeId: '', playerIndex: -1 });
  };

  const handleOpenDeleteFinancePopup = (financeId: string) => {
    setDeleteFinancePopup({ show: true, financeId });
  };

  const handleCloseDeleteFinancePopup = () => {
    setDeleteFinancePopup({ show: false, financeId: '' });
  };

  const handleDeletePlayer = async () => {
    const { financeId, playerIndex } = deletePlayerPopup;
    const finance = getFinanceById(financeId);
    if (!finance) return;

    const nextPlayers = finance.players.filter((_: any, index: number) => index !== playerIndex);
    const success = await updateFinance(financeId, {
      players: getPlayersForPersist(nextPlayers),
    }, setShowMessage);

    if (success) {
      setFinanceList((prevState: any[]) => prevState.map((item: any) => (
        item.id === financeId ? { ...item, players: nextPlayers } : item
      )));
      setEditingPlayerKey((prevState) => (
        prevState === getPlayerEditKey(financeId, playerIndex) ? null : prevState
      ));
      handleCloseDeletePlayerPopup();
      setShowMessage({ show: true, text: 'Jogador excluido com sucesso!' });
    }
  };

  const handleDeleteFinance = async () => {
    const { financeId } = deleteFinancePopup;
    if (!financeId) return;

    const success = await deleteFinance(financeId, setShowMessage);
    if (success) {
      setFinanceList((prevState: any[]) => prevState.filter((finance: any) => finance.id !== financeId));
      setCollapsedFinanceIds((prevState) => prevState.filter((id) => id !== financeId));
      setEditingFinanceHeaderId((prevState) => prevState === financeId ? null : prevState);
      setSortConfigByFinance((prevState) => {
        const nextState = { ...prevState };
        delete nextState[financeId];
        return nextState;
      });
      setEditingPlayerKey((prevState) => prevState?.startsWith(`${financeId}-`) ? null : prevState);
      handleCloseDeleteFinancePopup();
      setShowMessage({ show: true, text: 'Planilha excluida com sucesso!' });
    }
  };

  const handleToggleEditPlayer = async (financeId: string, playerIndex: number) => {
    const playerKey = getPlayerEditKey(financeId, playerIndex);

    if (editingPlayerKey !== playerKey) {
      setEditingPlayerKey(playerKey);
      return;
    }

    const finance = getFinanceById(financeId);
    if (!finance) return;

    const playersToPersist = getPlayersForPersist(finance.players);
    const success = await updateFinance(financeId, {
      players: playersToPersist,
    }, setShowMessage);

    if (success) {
      setFinanceList((prevState: any[]) => prevState.map((item: any) => (
        item.id === financeId ? { ...item, players: playersToPersist } : item
      )));
      setEditingPlayerKey(null);
      setShowMessage({ show: true, text: 'Jogador atualizado com sucesso!' });
    }
  };

  const handleSortPlayers = (
    financeId: string,
    field: 'name' | 'payDate' | 'value' | 'situation'
  ) => {
    const currentSort = sortConfigByFinance[financeId];
    const nextDirection = currentSort?.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';

    setFinanceList((prevState: any[]) => prevState.map((finance: any) => {
      if (finance.id !== financeId) return finance;
      return {
        ...finance,
        players: getSortedPlayers(finance.players || [], field, nextDirection),
      };
    }));

    setSortConfigByFinance((prevState) => ({
      ...prevState,
      [financeId]: {
        field,
        direction: nextDirection,
      },
    }));

    setEditingPlayerKey(null);
    handleCloseDeletePlayerPopup();
  };

  const handleToggleCollapseFinance = (financeId: string) => {
    setCollapsedFinanceIds((prevState) => (
      prevState.includes(financeId)
        ? prevState.filter((id) => id !== financeId)
        : [...prevState, financeId]
    ));
  };

  const handleInputKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  };

  if (!showFinancePage) {
    return (
      <div className="h-screen w-full bg-black/90">
        <Loading />
      </div>
    );
  }

  return(
    <div className="w-full bg-ritual bg-cover bg-top relative">
      <div className="absolute w-full h-full bg-black/80" />
      <Nav />
      <section className="mb-2 relative px-2">
        <div className="py-6 px-5 bg-black/90 text-white mt-2 flex flex-col items-center sm:items-start text-justify">
          <h1 className="text-4xl relative">Financeiro</h1>
          <div className="flex mt-5 w-full flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={ () => setActiveFinanceTab('overview') }
              className={ `border px-4 py-2 text-sm font-bold transition-colors duration-300 ${
                activeFinanceTab === 'overview'
                  ? 'border-white bg-white text-black'
                  : 'border-white/30 bg-black/40 text-white hover:border-white'
              }` }
            >
              Visão geral
            </button>
            <button
              type="button"
              onClick={ () => setActiveFinanceTab('player') }
              className={ `border px-4 py-2 text-sm font-bold transition-colors duration-300 ${
                activeFinanceTab === 'player'
                  ? 'border-white bg-white text-black'
                  : 'border-white/30 bg-black/40 text-white hover:border-white'
              }` }
            >
              Por jogador
            </button>
          </div>
          <hr className="w-10/12" />
        </div>
        {
          activeFinanceTab === 'overview' &&
          <>
            <div className="mb-3 w-full px-4 sm:mb-5 sm:px-0">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-sm border border-white/30 bg-black/70 p-4 text-white">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Faturamento do mês atual
                  </div>
                  <div className="mt-2 text-2xl font-black">
                    R$ { formatCurrencyValue(financeSummary.currentMonthRevenue) }
                  </div>
                </div>
                <div className="rounded-sm border border-white/30 bg-black/70 p-4 text-white">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Faturamento do ano atual
                  </div>
                  <div className="mt-2 text-2xl font-black">
                    R$ { formatCurrencyValue(financeSummary.currentYearRevenue) }
                  </div>
                </div>
                <div className="rounded-sm border border-white/30 bg-black/70 p-4 text-white">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Faturamento total
                  </div>
                  <div className="mt-2 text-2xl font-black">
                    R$ { formatCurrencyValue(financeSummary.totalRevenue) }
                  </div>
                </div>
                <div className="rounded-sm border border-white/30 bg-black/70 p-4 text-white">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Média mensal
                  </div>
                  <div className="mt-2 text-2xl font-black">
                    R$ { formatCurrencyValue(monthlyAverageRevenue) }
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6 rounded-sm border border-white/30 bg-black/70 p-4 text-white">
              <div className="mb-4 flex flex-col gap-1 text-left">
                <h2 className="text-xl font-black">Evolução dos valores pagos</h2>
                <p className="text-sm text-white/70">
                  Janeiro a dezembro de { currentYear }, com total planejado e total pago em cada mês.
                </p>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={ financeChartData }
                    margin={{
                      top: 10,
                      right: 12,
                      left: 0,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#ffffff", fontSize: 12 }}
                      stroke="rgba(255,255,255,0.4)"
                    />
                    <YAxis
                      width={ 90 }
                      tick={{ fill: "#ffffff", fontSize: 12 }}
                      stroke="rgba(255,255,255,0.4)"
                      tickFormatter={ (value) => `R$ ${formatCurrencyValue(value)}` }
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      wrapperStyle={{
                        color: "#ffffff",
                        fontSize: "12px",
                        paddingBottom: "8px",
                      }}
                    />
                    <Tooltip
                      formatter={ (value, name) => [
                        `R$ ${formatCurrencyValue(Number(value) || 0)}`,
                        String(name),
                      ] }
                      labelFormatter={ (label) => `Periodo: ${label} de ${currentYear}` }
                      contentStyle={{
                        backgroundColor: "#050505",
                        border: "1px solid rgba(255,255,255,0.25)",
                        color: "#ffffff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalValue"
                      name="Total planejado"
                      stroke="#f97316"
                      strokeWidth={ 3 }
                      dot={{ r: 4, fill: "#f97316", stroke: "#f97316" }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="paidValue"
                      name="Total pago"
                      stroke="#34d399"
                      strokeWidth={ 3 }
                      dot={{ r: 4, fill: "#34d399", stroke: "#34d399" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        }
        {
          activeFinanceTab === 'player' &&
          <>
            <div className="mb-6 w-full">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-sm border border-white/30 bg-black/70 p-4 text-white">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Jogador
                  </div>
                  <div className="mt-2">
                    <select
                      value={ selectedPlayerName }
                      onChange={ (event) => setSelectedPlayerName(event.target.value) }
                      disabled={ selectablePlayerNames.length === 0 }
                      className="w-full border border-white/30 bg-black px-3 py-2 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {
                        selectablePlayerNames.length > 0 ? selectablePlayerNames.map((playerName) => (
                          <option key={ playerName } value={ playerName } className="text-white">
                            { playerName }
                          </option>
                        )) : (
                          <option value="" className="text-white">
                            Nenhum jogador
                          </option>
                        )
                      }
                    </select>
                  </div>
                </div>
                <div className="rounded-sm border border-white/30 bg-black/70 p-4 text-white">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Faturamento anual do jogador
                  </div>
                  <div className="mt-2 text-2xl font-black">
                    R$ { formatCurrencyValue(selectedPlayerSummary.currentYearRevenue) }
                  </div>
                </div>
                <div className="rounded-sm border border-white/30 bg-black/70 p-4 text-white">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Faturamento total do jogador
                  </div>
                  <div className="mt-2 text-2xl font-black">
                    R$ { formatCurrencyValue(selectedPlayerSummary.totalRevenue) }
                  </div>
                </div>
                <div className="rounded-sm border border-white/30 bg-black/70 p-4 text-white">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Média mensal do jogador
                  </div>
                  <div className="mt-2 text-2xl font-black">
                    R$ { formatCurrencyValue(selectedPlayerMonthlyAverage) }
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6 rounded-sm border border-white/30 bg-black/70 p-4 text-white">
              <div className="mb-4 flex flex-col gap-1 text-left">
                <h2 className="text-xl font-black">Evolução por jogador</h2>
                <p className="text-sm text-white/70">
                  Janeiro a dezembro de { currentYear }, com uma linha por jogador.
                </p>
              </div>
              {
                playerLineNames.length > 0 ? (
                  <>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {
                        playerLineNames.map((playerName, index) => {
                          const isHidden = hiddenPlayerLines.includes(playerName);
                          const playerColor = playerLineColors[index % playerLineColors.length];

                          return (
                            <button
                              key={ playerName }
                              type="button"
                              onClick={ () => handleTogglePlayerLine(playerName) }
                              className={ `rounded-full border px-3 py-1 text-xs font-bold transition-colors duration-300 ${
                                isHidden ? 'border-white/25 bg-transparent text-white/45' : 'text-black'
                              }` }
                              style={ isHidden ? undefined : { backgroundColor: playerColor, borderColor: playerColor } }
                            >
                              { isHidden ? `${playerName} oculto` : playerName }
                            </button>
                          );
                        })
                      }
                    </div>
                    <div className="h-[320px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={ playerChartData }
                          margin={{
                            top: 10,
                            right: 12,
                            left: 0,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                          <XAxis
                            dataKey="label"
                            tick={{ fill: "#ffffff", fontSize: 12 }}
                            stroke="rgba(255,255,255,0.4)"
                          />
                          <YAxis
                            width={ 90 }
                            tick={{ fill: "#ffffff", fontSize: 12 }}
                            stroke="rgba(255,255,255,0.4)"
                            tickFormatter={ (value) => `R$ ${formatCurrencyValue(value)}` }
                          />
                          <Tooltip
                            formatter={ (value, name) => [
                              `R$ ${formatCurrencyValue(Number(value) || 0)}`,
                              String(name),
                            ] }
                            labelFormatter={ (label) => `Periodo: ${label} de ${currentYear}` }
                            contentStyle={{
                              backgroundColor: "#050505",
                              border: "1px solid rgba(255,255,255,0.25)",
                              color: "#ffffff",
                            }}
                          />
                          {
                            playerLineNames.map((playerName, index) => (
                              hiddenPlayerLines.includes(playerName) ? null : (
                                <Line
                                  key={ playerName }
                                  type="monotone"
                                  dataKey={ playerName }
                                  name={ playerName }
                                  stroke={ playerLineColors[index % playerLineColors.length] }
                                  strokeWidth={ 3 }
                                  dot={{
                                    r: 4,
                                    fill: playerLineColors[index % playerLineColors.length],
                                    stroke: playerLineColors[index % playerLineColors.length],
                                  }}
                                  activeDot={{ r: 6 }}
                                />
                              )
                            ))
                          }
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                ) : (
                  <div className="rounded-sm border border-white/15 bg-black/40 px-4 py-6 text-center text-sm text-white/70">
                    Nenhum jogador com valores cadastrados no ano atual para exibir neste grafico.
                  </div>
                )
              }
            </div>
          </>
        }
        <div className="mb-6 flex w-full justify-end px-4 sm:px-0">
          <button
            type="button"
            onClick={ handleCreateFinance }
            disabled={ isCreatingFinance }
            className="px-4 py-2 border-2 rounded-xl border-black text-black font-bold flex items-center justify-center cursor-pointer bg-white w-full sm:w-40 hover:border-white transition-colors duration-400 hover:underline disabled:cursor-not-allowed disabled:opacity-70"
          >
            { isCreatingFinance ? 'Criando...' : 'Nova Planilha' }
          </button>
        </div>
        <div className="text-center">
          {
            financeList.length > 0 ? financeList.map((finance: any, index: number) => (
              <div
                key={ finance.id || index }
                className={ `mb-3 rounded-sm text-white ${
                  isCurrentFinancePeriod(finance, currentPeriodOrder)
                    ? (collapsedFinanceIds.includes(finance.id)
                      ? 'border-2 border-yellow-400 bg-black p-3'
                      : 'border-2 border-yellow-400 bg-black p-4')
                    : (collapsedFinanceIds.includes(finance.id)
                      ? 'border border-white/15 bg-black/70 p-3'
                      : 'border border-white/30 bg-black/70 p-4')
                }` }
              >
                {(() => {
                  const isCollapsed = collapsedFinanceIds.includes(finance.id);

                  return (
                    <>
                <div
                  className={ `flex w-full flex-col gap-3 text-left ${isCollapsed ? 'cursor-pointer' : ''}` }
                  onClick={ isCollapsed ? () => handleToggleCollapseFinance(finance.id) : undefined }
                  onKeyDown={ isCollapsed ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleToggleCollapseFinance(finance.id);
                    }
                  } : undefined }
                  role={ isCollapsed ? 'button' : undefined }
                  tabIndex={ isCollapsed ? 0 : undefined }
                >
                  {
                    isCollapsed ? (
                      <div className="flex w-full items-start justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="text-lg font-black">
                            { finance.month || 'Mes' } / { finance.year || 'Ano' }
                          </div>
                          <div className="text-sm text-white/80">
                            R$ { formatCurrencyValue(getSumValuesBySituation(finance.players, 'Pago')) } / R$ { formatCurrencyValue(getSumValues(finance.players)) }
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={ (event) => {
                              event.stopPropagation();
                              handleToggleCollapseFinance(finance.id);
                            } }
                            className="flex items-center text-white/80 transition-colors duration-300 hover:text-white"
                            aria-label="Expandir planilha"
                          >
                            <MdOutlineDoubleArrow className="rotate-90 text-4xl" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            {
                              editingFinanceHeaderId === finance.id ? (
                                <div className="flex flex-col gap-2 sm:flex-row">
                                  <input
                                    type="text"
                                    value={ finance.month }
                                    placeholder="Mes"
                                    onChange={ (event) => handleFinanceFieldChange(finance.id, 'month', event.target.value) }
                                    onKeyDown={ handleInputKeyDown }
                                    className="border border-white/40 bg-black/30 px-3 py-2 text-white outline-none"
                                  />
                                  <input
                                    type="text"
                                    value={ finance.year }
                                    placeholder="Ano"
                                    onChange={ (event) => handleFinanceFieldChange(finance.id, 'year', event.target.value) }
                                    onKeyDown={ handleInputKeyDown }
                                    className="border border-white/40 bg-black/30 px-3 py-2 text-white outline-none sm:w-28"
                                  />
                                </div>
                              ) : (
                                <div className="text-lg font-black">
                                  { finance.month || 'Mes' } / { finance.year || 'Ano' }
                                </div>
                              )
                            }
                          </div>
                          <div className="flex items-center gap-3 sm:justify-end">
                            <button
                              type="button"
                              onClick={ () => (
                                editingFinanceHeaderId === finance.id
                                  ? handleSaveFinanceHeader(finance.id)
                                  : setEditingFinanceHeaderId(finance.id)
                              ) }
                              className="text-xl transition-colors duration-300 hover:text-green-300"
                            >
                              { editingFinanceHeaderId === finance.id ? <BsCheckSquare /> : <FaRegEdit /> }
                            </button>
                            <button
                              type="button"
                              onClick={ () => handleToggleCollapseFinance(finance.id) }
                              className="flex items-center gap-2 text-sm text-white/80 transition-colors duration-300 hover:text-white"
                            >
                              <MdOutlineDoubleArrow className="-rotate-90 text-2xl" />
                            </button>
                          </div>
                        </div>
                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                          <div className="flex flex-col gap-0 leading-tight">
                            <div className="text-sm text-white/70">
                              Total do mês: R$ { formatCurrencyValue(getSumValues(finance.players)) }
                            </div>
                            <div className="text-sm text-white/70">
                              Total Pago: R$ { formatCurrencyValue(getSumValuesBySituation(finance.players, 'Pago')) }
                            </div>
                            <div className="text-sm text-white/70">
                              Total Pendente: R$ { formatCurrencyValue(getSumValuesBySituation(finance.players, 'Pendente')) }
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                              type="button"
                              onClick={ () => handleAddPlayer(finance.id) }
                              className="px-4 py-2 border-2 rounded-xl border-black text-black font-bold flex items-center justify-center cursor-pointer bg-white w-full text-sm sm:w-40 hover:border-white transition-colors duration-400 hover:underline"
                            >
                              Inserir jogador
                            </button>
                            <button
                              type="button"
                              onClick={ () => handleDuplicateFinance(finance.id) }
                              className="px-4 py-2 border-2 rounded-xl border-black text-black font-bold flex items-center justify-center cursor-pointer bg-white w-full text-sm sm:w-40 hover:border-white transition-colors duration-400 hover:underline"
                            >
                              Copiar planilha
                            </button>
                            <button
                              type="button"
                              onClick={ () => handleOpenDeleteFinancePopup(finance.id) }
                              className="px-4 py-2 border-2 rounded-xl border-red-900 text-white font-bold flex items-center justify-center cursor-pointer bg-red-800 w-full text-sm sm:w-40 hover:border-white transition-colors duration-400 hover:underline"
                            >
                              Excluir planilha
                            </button>
                          </div>
                        </div>
                      </>
                    )
                  }
                </div>
                {
                  !isCollapsed &&
                  <>
                    <hr className="my-3 border-white/30" />
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[860px] border-collapse border border-white/50 text-left">
                    <thead>
                      <tr className="bg-white/10">
                        <th className="border border-white/50 p-2 font-semibold">
                          <button
                            type="button"
                            onClick={ () => handleSortPlayers(finance.id, 'name') }
                            className="w-full text-left"
                          >
                            Jogador{ getSortLabel(finance.id, 'name') }
                          </button>
                        </th>
                        <th className="border border-white/50 p-2 font-semibold">
                          <button
                            type="button"
                            onClick={ () => handleSortPlayers(finance.id, 'payDate') }
                            className="w-full text-left"
                          >
                            Data{ getSortLabel(finance.id, 'payDate') }
                          </button>
                        </th>
                        <th className="border border-white/50 p-2 font-semibold">Sessões</th>
                        <th className="border border-white/50 p-2 font-semibold">
                          <button
                            type="button"
                            onClick={ () => handleSortPlayers(finance.id, 'value') }
                            className="w-full text-left"
                          >
                            Valor{ getSortLabel(finance.id, 'value') }
                          </button>
                        </th>
                        <th className="border border-white/50 p-2 font-semibold">
                          <button
                            type="button"
                            onClick={ () => handleSortPlayers(finance.id, 'situation') }
                            className="w-full text-left"
                          >
                            Situação{ getSortLabel(finance.id, 'situation') }
                          </button>
                        </th>
                        <th className="border border-white/50 p-2 font-semibold text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        finance.players?.length > 0 ? finance.players.map((player: any, index2: number) => {
                          const isEditing = editingPlayerKey === getPlayerEditKey(finance.id, index2);

                          return (
                            <tr key={ `${finance.id}-${index2}` } className="align-top">
                              <td className="border border-white/50 p-2">
                                {
                                  isEditing ? (
                                    <input
                                      type="text"
                                      value={ player.name }
                                      onChange={ (event) => handlePlayerFieldChange(finance.id, index2, 'name', event.target.value) }
                                      className="w-full border border-white/40 bg-black/30 px-2 py-1 text-white outline-none"
                                    />
                                  ) : player.name || '-'
                                }
                              </td>
                              <td className="border border-white/50 p-2 text-center">
                                {
                                  isEditing ? (
                                    <input
                                      type="text"
                                      value={ player.payDate }
                                      onChange={ (event) => handlePlayerFieldChange(finance.id, index2, 'payDate', event.target.value) }
                                      className="w-full border border-white/40 bg-black/30 px-2 py-1 text-white outline-none"
                                    />
                                  ) : (player.payDate || '-')
                                }
                              </td>
                              <td className="border border-white/50 p-2">
                                {
                                  isEditing ? (
                                    <input
                                      type="text"
                                      value={ typeof player.sessionsText === 'string' ? player.sessionsText : (player.sessions || []).join(', ') }
                                      placeholder="Sessao 1, Sessao 2"
                                      onChange={ (event) => handlePlayerFieldChange(finance.id, index2, 'sessionsText', event.target.value) }
                                      className="w-full border border-white/40 bg-black/30 px-2 py-1 text-white outline-none"
                                    />
                                  ) : (
                                    <div className="flex flex-wrap gap-2">
                                      {
                                        player.sessions?.length > 0 ? player.sessions.map((session: string, index3: number) => (
                                          <div key={ `${player.name}-${index3}` } className="rounded-full border border-white/50 px-2 py-1 text-xs">
                                            { session }
                                          </div>
                                        )) : <span>-</span>
                                      }
                                    </div>
                                  )
                                }
                              </td>
                              <td className="border border-white/50 p-2 text-center">
                                {
                                  isEditing ? (
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={ player.value }
                                    onChange={ (event) => handlePlayerFieldChange(finance.id, index2, 'value', event.target.value) }
                                    className="w-full border border-white/40 bg-black/30 px-2 py-1 text-white outline-none"
                                  />
                                  ) : (player.value !== '' && player.value !== undefined ? `R$ ${formatCurrencyValue(player.value)}` : '-')
                                }
                              </td>
                              <td className="border border-white/50 p-2 text-center">
                                {
                                  isEditing ? (
                                    <select
                                      value={ player.situation }
                                      onChange={ (event) => handlePlayerFieldChange(finance.id, index2, 'situation', event.target.value) }
                                      className="w-full border border-white/40 bg-black/30 px-2 py-1 text-white outline-none"
                                    >
                                      <option value="" className="text-black">Selecione</option>
                                      <option value="Pendente" className="text-black">Pendente</option>
                                      <option value="Pago" className="text-black">Pago</option>
                                    </select>
                                  ) : (player.situation || '-')
                                }
                              </td>
                              <td className="border border-white/50 p-2">
                                <div className="flex items-center justify-center gap-3 text-xl">
                                  <button
                                    type="button"
                                    onClick={ () => handleToggleEditPlayer(finance.id, index2) }
                                    className="transition-colors duration-300 hover:text-green-300"
                                  >
                                    { isEditing ? <BsCheckSquare /> : <FaRegEdit /> }
                                  </button>
                                  <button
                                    type="button"
                                    onClick={ () => handleOpenDeletePlayerPopup(finance.id, index2) }
                                    className="transition-colors duration-300 hover:text-red-300"
                                  >
                                    <MdDelete />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }) : (
                          <tr>
                            <td colSpan={ 6 } className="border border-white/50 p-4 text-center text-white/70">
                              Nenhum jogador inserido nesta planilha.
                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                      </table>
                    </div>
                  </>
                }
                    </>
                  );
                })()}
              </div>
            )) : (
              <div className="rounded-sm border border-white/30 bg-black/70 p-6 text-white">
                Nenhuma planilha cadastrada ainda.
              </div>
            )
          }
        </div>
        { showMessage.show && <MessageToUser /> }
        {
          deletePlayerPopup.show &&
          <div className="z-60 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
            <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
              <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
                <IoIosCloseCircleOutline
                  className="text-4xl text-white cursor-pointer"
                  onClick={ handleCloseDeletePlayerPopup }
                />
              </div>
              <div className="pb-5 px-5 w-full">
                <label htmlFor="confirm-delete-player" className="flex flex-col items-center w-full">
                  <p className="text-white w-full text-center pb-3">
                    Tem certeza de que quer apagar este jogador da planilha?
                  </p>
                </label>
                <div className="flex w-full gap-2">
                  <button
                    type="button"
                    onClick={ handleCloseDeletePlayerPopup }
                    className="text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold"
                  >
                    Nao
                  </button>
                  <button
                    id="confirm-delete-player"
                    type="button"
                    onClick={ handleDeletePlayer }
                    className="text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold"
                  >
                    Sim
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
        {
          deleteFinancePopup.show &&
          <div className="z-60 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
            <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
              <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
                <IoIosCloseCircleOutline
                  className="text-4xl text-white cursor-pointer"
                  onClick={ handleCloseDeleteFinancePopup }
                />
              </div>
              <div className="pb-5 px-5 w-full">
                <label htmlFor="confirm-delete-finance" className="flex flex-col items-center w-full">
                  <p className="text-white w-full text-center pb-3">
                    Tem certeza de que quer apagar esta planilha inteira?
                  </p>
                </label>
                <div className="flex w-full gap-2">
                  <button
                    type="button"
                    onClick={ handleCloseDeleteFinancePopup }
                    className="text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold"
                  >
                    Nao
                  </button>
                  <button
                    id="confirm-delete-finance"
                    type="button"
                    onClick={ handleDeleteFinance }
                    className="text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold"
                  >
                    Sim
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </section>
      <div className="relative">
        <Footer />
      </div>
    </div>
  );
}
