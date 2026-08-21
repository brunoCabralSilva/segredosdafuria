'use client';

import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Footer from '@/components/footer';
import Nav from '@/components/nav';
import Simplify from '@/components/simplify';
import MessageToUser from '@/components/dicesAndMessages/messageToUser';
import contexto from '@/context/context';
import { authenticate } from '@/firebase/authenticate';
import { addNewSheetMandatory, getAllSheets, getSheetsByEmail } from '@/firebase/players';
import { capitalizeFirstLetter, parseDate, sheetStructure } from '@/firebase/utilities';

type SheetCard = {
  id: string;
  email?: string;
  sessionId?: string;
  creationDate?: string;
  user?: string;
  data?: {
    name?: string;
    background?: string;
    auspice?: string;
    trybe?: string;
  };
};

type SectionFilters = {
  auspice: string;
  trybe: string;
  page: number;
};

const DEFAULT_SECTION_FILTERS: SectionFilters = {
  auspice: 'all',
  trybe: 'all',
  page: 1,
};

const ITEMS_PER_PAGE = 9;

export default function Sheets() {
  const router = useRouter();
  const {
    simplify,
    dataUser,
    setDataUser,
    resetPopups,
    showMessage,
    setShowMessage,
  } = useContext(contexto);
  const [mySheets, setMySheets] = useState<SheetCard[]>([]);
  const [communitySheets, setCommunitySheets] = useState<SheetCard[]>([]);
  const [loadingSheets, setLoadingSheets] = useState(true);
  const [showData, setShowData] = useState(false);
  const [creatingSheet, setCreatingSheet] = useState(false);
  const [mySectionFilters, setMySectionFilters] = useState<SectionFilters>(DEFAULT_SECTION_FILTERS);
  const [communitySectionFilters, setCommunitySectionFilters] = useState<SectionFilters>(DEFAULT_SECTION_FILTERS);

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

  const sortSheets = (sheets: SheetCard[]) => (
    [...sheets].sort((a, b) => {
      const dateA = a.creationDate ? parseDate(String(a.creationDate)) : new Date(0);
      const dateB = b.creationDate ? parseDate(String(b.creationDate)) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
  );

  const getSheetLabelValue = (value?: string, fallback = ''): string => {
    const sanitizedValue = String(value || '').trim();
    return sanitizedValue === '' ? fallback : String(capitalizeFirstLetter(sanitizedValue));
  };

  const refreshSheets = async (userEmail: string) => {
    const [ownedSheets, allSheets] = await Promise.all([
      getSheetsByEmail(userEmail),
      getAllSheets(),
    ]);

    const sortedOwnedSheets = sortSheets(ownedSheets as SheetCard[]);
    const sortedCommunitySheets = sortSheets(
      (allSheets as SheetCard[]).filter((sheet) => sheet.email && sheet.email !== userEmail)
    );

    setMySheets(sortedOwnedSheets);
    setCommunitySheets(sortedCommunitySheets);
  };

  const createSheet = async () => {
    if (creatingSheet) return;

    setCreatingSheet(true);
    try {
      let authUser = dataUser;

      if (authUser.email === '' || authUser.displayName === '') {
        const authData: any = await authenticate(setShowMessage);
        if (!authData || !authData.email || !authData.displayName) {
          router.push('/login');
          return;
        }

        authUser = { email: authData.email, displayName: authData.displayName };
        setDataUser(authUser);
      }

      const creationDate = getCurrentBrazilDateTimeString();
      const sheet = sheetStructure(authUser.email, authUser.displayName, creationDate);
      const sheetId = await addNewSheetMandatory('', sheet, setShowMessage);
      if (!sheetId) return;
      setShowMessage({ show: true, text: 'Ficha criada com sucesso!' });
      router.push(`/sheets/${sheetId}`);
    } catch (error) {
      setShowMessage({ show: true, text: `Ocorreu um erro ao criar a Ficha: ${error}` });
    } finally {
      setCreatingSheet(false);
    }
  };

  const handleOpenSheet = (sheetId: string) => {
    router.push(`/sheets/${sheetId}`);
  };

  const renderSheetCard = (sheet: SheetCard) => {
    const formattedAuspice = getSheetLabelValue(sheet.data?.auspice, 'Não definido');
    const formattedTrybe = getSheetLabelValue(sheet.data?.trybe, 'Não definida');
    const creatorName = sheet.user || 'Usuário não informado';
    const creatorInitial = creatorName.trim().charAt(0).toUpperCase() || '?';

    return (
      <button
        key={sheet.id}
        type="button"
        onClick={() => handleOpenSheet(sheet.id)}
        className="group relative h-full w-full overflow-hidden border border-zinc-500/30 bg-black text-left transition-colors hover:border-red-700/80"
      >
        {sheet.data?.trybe && (
          <div className="pointer-events-none absolute inset-0">
            <Image
              src={`/images/gifts/${formattedTrybe}.png`}
              alt=""
              className="translate-x-[24%] translate-y-[6%] object-contain opacity-20 scale-[1.05]"
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 space-y-4 px-4 py-4 text-left text-white">
          <div>
            <p className="font-kingthings text-xl capitalize leading-none text-white transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] group-hover:text-red-500">
              {sheet.data?.name || 'Ficha sem nome'}
            </p>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 font-geist-mono text-[10px] uppercase text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            <div className="min-w-0">
              <p className="text-white/60">Augúrio</p>
              <p className="mt-1 text-[11px] text-white">{formattedAuspice}</p>
            </div>
            <div />
            <div className="min-w-0">
              <p className="text-white/60">Tribo</p>
              <p className="mt-1 text-[11px] text-white">{formattedTrybe}</p>
            </div>
            <div className="min-w-0 text-right">
              <p className="text-white/60">Criada em</p>
              <p className="mt-1 text-[11px] text-white">{sheet.creationDate || 'Nao informada'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-white/10 pt-3 font-geist-mono text-[11px] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/55 text-sm font-extrabold uppercase text-white">
              {creatorInitial}
            </div>
            <p className="capitalize text-white/90">{creatorName}</p>
          </div>
        </div>
      </button>
    );
  };

  const renderSection = (
    title: string,
    description: string,
    sheets: SheetCard[],
    emptyMessage: string,
    sectionFilters: SectionFilters,
    setSectionFilters: React.Dispatch<React.SetStateAction<SectionFilters>>,
  ) => {
    const auspiceOptions = Array.from(
      new Set(
        sheets
          .map((sheet) => getSheetLabelValue(sheet.data?.auspice))
          .filter((value) => value !== '')
      )
    ).sort((first, second) => first.localeCompare(second, 'pt-BR'));

    const trybeOptions = Array.from(
      new Set(
        sheets
          .map((sheet) => getSheetLabelValue(sheet.data?.trybe))
          .filter((value) => value !== '')
      )
    ).sort((first, second) => first.localeCompare(second, 'pt-BR'));

    const filteredSheets = sheets.filter((sheet) => {
      const currentAuspice = getSheetLabelValue(sheet.data?.auspice);
      const currentTrybe = getSheetLabelValue(sheet.data?.trybe);
      const matchAuspice = sectionFilters.auspice === 'all' || currentAuspice === sectionFilters.auspice;
      const matchTrybe = sectionFilters.trybe === 'all' || currentTrybe === sectionFilters.trybe;
      return matchAuspice && matchTrybe;
    });

    const totalPages = Math.max(1, Math.ceil(filteredSheets.length / ITEMS_PER_PAGE));
    const currentPage = Math.min(sectionFilters.page, totalPages);
    const pageStartIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedSheets = filteredSheets.slice(pageStartIndex, pageStartIndex + ITEMS_PER_PAGE);

    return (
      <section className="mt-8 first:mt-0">
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="font-kingthings text-2xl uppercase tracking-[0.18em] text-white sm:text-3xl">{title}</h2>
          <p className="font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55 sm:text-[11px]">{description}</p>
        </div>

        <div className="mb-4 grid gap-3 border border-zinc-500/30 bg-black/60 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
          <label className="flex flex-col gap-2">
            <span className="font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/60">Filtrar por augúrio</span>
            <select
              value={sectionFilters.auspice}
              onChange={(event) => {
                const nextValue = event.target.value;
                setSectionFilters((current) => ({ ...current, auspice: nextValue, page: 1 }));
              }}
              className="border border-zinc-500/30 bg-black px-3 py-2 font-geist-mono text-[11px] uppercase tracking-[0.08em] text-white outline-none transition-colors hover:border-red-700/80 focus:border-red-700"
            >
              <option value="all">Todos os augúrios</option>
              {auspiceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/60">Filtrar por tribo</span>
            <select
              value={sectionFilters.trybe}
              onChange={(event) => {
                const nextValue = event.target.value;
                setSectionFilters((current) => ({ ...current, trybe: nextValue, page: 1 }));
              }}
              className="border border-zinc-500/30 bg-black px-3 py-2 font-geist-mono text-[11px] uppercase tracking-[0.08em] text-white outline-none transition-colors hover:border-red-700/80 focus:border-red-700"
            >
              <option value="all">Todas as tribos</option>
              {trybeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => setSectionFilters(DEFAULT_SECTION_FILTERS)}
            className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
          >
            Limpar filtros
          </button>
        </div>

        <div className="mb-4 flex flex-col gap-2 font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {filteredSheets.length === 0
              ? 'Nenhum resultado encontrado.'
              : `Mostrando ${pageStartIndex + 1}-${Math.min(pageStartIndex + ITEMS_PER_PAGE, filteredSheets.length)} de ${filteredSheets.length} fichas`}
          </span>
        </div>

        {filteredSheets.length === 0 ? (
          <div className="border border-zinc-500/30 bg-black/60 px-4 py-6 text-center font-geist-mono text-xs text-white/70">
            {emptyMessage}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedSheets.map(renderSheetCard)}
            </div>

            {totalPages > 1 && (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setSectionFilters((current) => ({ ...current, page: Math.max(1, currentPage - 1) }))}
                  className={`inline-flex items-center justify-center border px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] transition-colors ${currentPage === 1 ? 'cursor-not-allowed border-zinc-700 bg-zinc-900 text-zinc-500' : 'border-red-950 bg-red-950 text-white hover:bg-red-900'}`}
                >
                  Pagina anterior
                </button>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      key={`${title}-page-${pageNumber}`}
                      type="button"
                      onClick={() => setSectionFilters((current) => ({ ...current, page: pageNumber }))}
                      className={`min-w-[2.5rem] border px-3 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] transition-colors ${pageNumber === currentPage ? 'border-red-700 bg-red-950 text-white' : 'border-zinc-500/30 bg-black text-white/75 hover:border-red-700/80 hover:text-white'}`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setSectionFilters((current) => ({ ...current, page: Math.min(totalPages, currentPage + 1) }))}
                  className={`inline-flex items-center justify-center border px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] transition-colors ${currentPage === totalPages ? 'cursor-not-allowed border-zinc-700 bg-zinc-900 text-zinc-500' : 'border-red-950 bg-red-950 text-white hover:bg-red-900'}`}
                >
                  Proxima pagina
                </button>
              </div>
            )}
          </>
        )}
      </section>
    );
  };

  useEffect(() => {
    let active = true;

    const fetchData = async (): Promise<void> => {
      try {
        resetPopups();
        if (active) setLoadingSheets(true);

        if (dataUser.email !== '' && dataUser.displayName !== '') {
          await refreshSheets(dataUser.email);
          setShowData(true);
        } else {
          const authData: any = await authenticate(setShowMessage);
          if (authData && authData.email && authData.displayName) {
            const authUser = { email: authData.email, displayName: authData.displayName };
            if (active) setDataUser(authUser);
            await refreshSheets(authData.email);
            setShowData(true);
          } else {
            router.push('/login');
            return;
          }
        }
      } catch (error) {
        if (active) {
          setShowMessage({ show: true, text: `Ocorreu um erro ao obter Fichas: ${error}` });
        }
      } finally {
        if (active) setLoadingSheets(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={`relative min-h-screen w-full ${simplify ? 'bg-black' : 'bg-ritual'} bg-cover bg-top`}>
      <Simplify />
      {showMessage.show && <MessageToUser />}
      <Nav />

      <section className="h-full w-full bg-black/90">
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 pb-10 pt-4 sm:px-8 sm:pb-14">
          {!showData || loadingSheets ? (
            <div className="flex min-h-[60vh] items-center justify-center bg-black/80 px-6 py-10 text-white">
              <span className="loader z-50" />
            </div>
          ) : (
            <section className="text-white">
              <div className="py-8 sm:py-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h1 className="font-kingthings text-3xl sm:text-4xl lg:text-5xl">Fichas</h1>
                    <p className="mt-2 font-geist-mono text-[11px] text-white/75 sm:text-xs">
                      Explore suas fichas, consulte personagens da comunidade e copie qualquer ficha publica para a sua conta.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => void createSheet()}
                      className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
                    >
                      {creatingSheet ? 'Criando...' : 'Criar Ficha'}
                    </button>
                  </div>
                </div>
                <hr className="mt-5 border-white/10" />
              </div>

              {renderSection(
                'Minhas Fichas',
                'Personagens que pertencem a sua conta e continuam totalmente editáveis.',
                mySheets,
                'Voce ainda não possui fichas cadastradas.',
                mySectionFilters,
                setMySectionFilters,
              )}

              {renderSection(
                'Fichas Criadas Pela Comunidade',
                'Fichas públicas de outros jogadores. Você pode abrir, consultar e copiar para a sua conta.',
                communitySheets,
                'Nenhuma ficha da comunidade foi encontrada até o momento.',
                communitySectionFilters,
                setCommunitySectionFilters,
              )}
            </section>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
