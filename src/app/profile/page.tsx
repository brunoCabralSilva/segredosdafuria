'use client';

import { useContext, useEffect, useState } from 'react';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import Loading from '@/components/loading';
import Simplify from '@/components/simplify';
import MessageToUser from '@/components/dicesAndMessages/messageToUser';
import VerifySession from '@/components/popup/verifySession';
import CreateSection from '@/components/popup/createSection';
import Info from '@/components/info';
import contexto from '@/context/context';
import { addNewSheetMandatory, getSheetsByEmail } from '@/firebase/players';
import { getAllSessionsByFunction, getSessions } from '@/firebase/sessions';
import { capitalizeFirstLetter, parseDate, sheetStructure } from '@/firebase/utilities';
import useRequiredAuth from '@/hooks/useRequiredAuth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { IoIosInformationCircle } from 'react-icons/io';

type ProfileSession = {
  id: string;
  gameMaster?: string;
  name?: string;
  nameMaster?: string;
  creationDate?: string;
  description?: string;
  imageName?: string;
  statusSession?: string;
  players?: string[];
};

type ProfileSheet = {
  id: string;
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

const resumeText = (text: string, totalLength: number) => {
  if (text.length <= totalLength) return text;
  return `${text.slice(0, totalLength)}...`;
};

export default function Profile() {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [creatingSheet, setCreatingSheet] = useState(false);
  const [email, setEmail] = useState('');
  const [nameUser, setNameUser] = useState('');
  const [narratorSessions, setNarratorSessions] = useState<ProfileSession[]>([]);
  const [playerSessions, setPlayerSessions] = useState<ProfileSession[]>([]);
  const [mySheets, setMySheets] = useState<ProfileSheet[]>([]);
  const router = useRouter();
  const { authChecked, authUser } = useRequiredAuth();
  const {
    simplify,
    dataSession,
    setDataSession,
    resetPopups,
    showMessage,
    setShowMessage,
    setDataUser,
    showCreateSession,
    setShowCreateSession,
    showInfoSessions,
    setShowInfoSessions,
  } = useContext(contexto);

  const getProfileUser = async () => {
    if (authUser) {
      return { email: authUser.email, displayName: authUser.displayName };
    }

    return null;
  };

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

  const handleOpenSession = (sessionId: string) => {
    setDataSession({ show: true, id: sessionId });
  };

  const handleOpenSheet = (sheetId: string) => {
    router.push(`/sheets/${sheetId}`);
  };

  const handleCreateSession = async () => {
    const authUser = await getProfileUser();
    if (!authUser) {
      router.push('/login');
      return;
    }

    setShowCreateSession(true);
  };

  const handleCreateSheet = async () => {
    if (creatingSheet) return;

    const authUser = await getProfileUser();
    if (!authUser) {
      router.push('/login');
      return;
    }

    setCreatingSheet(true);

    try {
      const creationDate = getCurrentBrazilDateTimeString();
      const sheet = sheetStructure(authUser.email, authUser.displayName, creationDate);
      const sheetId = await addNewSheetMandatory('', sheet, setShowMessage);
      if (!sheetId) return;
      const sheets = await getSheetsByEmail(authUser.email);
      const orderedSheets = [...(sheets as ProfileSheet[])].sort((a, b) => {
        const dateA = a.creationDate ? parseDate(String(a.creationDate)) : new Date(0);
        const dateB = b.creationDate ? parseDate(String(b.creationDate)) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setMySheets(orderedSheets);
      setShowMessage({ show: true, text: 'Ficha criada com sucesso!' });
      router.push(`/sheets/${sheetId}`);
    } catch (error) {
      setShowMessage({ show: true, text: `Ocorreu um erro ao criar a Ficha: ${error}` });
    } finally {
      setCreatingSheet(false);
    }
  };

  useEffect(() => {
    if (!authChecked || !authUser) return;

    let active = true;

    const loadProfile = async () => {
      try {
        resetPopups();
        if (active) setDataSession({ show: false, id: '' });

        if (!authChecked || !authUser) return;

        if (active) {
          setEmail(authUser.email);
          setNameUser(authUser.displayName);
          setDataUser({ email: authUser.email, displayName: authUser.displayName });
        }

        const [sessions, sessionMemberships, sheets] = await Promise.all([
          getSessions(),
          getAllSessionsByFunction(authUser.email),
          getSheetsByEmail(authUser.email),
        ]);

        const playerSessionIds = new Set((sessionMemberships.list2 || []).map((session: { id: string }) => String(session.id)));

        const orderedSessions = (sessions as ProfileSession[])
          .filter((session) => session.statusSession !== 'Finalizada')
          .sort((a, b) => {
            const dateA = a.creationDate ? parseDate(String(a.creationDate)) : new Date(0);
            const dateB = b.creationDate ? parseDate(String(b.creationDate)) : new Date(0);
            return dateB.getTime() - dateA.getTime();
          });

        const nextNarratorSessions = orderedSessions.filter(
          (session) => String(session.gameMaster || '') === authUser.email,
        );

        const nextPlayerSessions = orderedSessions.filter((session) => {
          const isNarrator = String(session.gameMaster || '') === authUser.email;
          const isPlayerFromSession = Array.isArray(session.players) && session.players.includes(authUser.email);
          const isPlayerFromMembership = playerSessionIds.has(String(session.id));
          return !isNarrator && (isPlayerFromSession || isPlayerFromMembership);
        });

        const orderedSheets = [...(sheets as ProfileSheet[])].sort((a, b) => {
          const dateA = a.creationDate ? parseDate(String(a.creationDate)) : new Date(0);
          const dateB = b.creationDate ? parseDate(String(b.creationDate)) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        if (active) {
          setNarratorSessions(nextNarratorSessions);
          setPlayerSessions(nextPlayerSessions);
          setMySheets(orderedSheets);
        }
      } catch (error) {
        if (active) {
          setShowMessage({
            show: true,
            text: `Ocorreu um erro ao carregar o perfil: ${error}`,
          });
        }
      } finally {
        if (active) setLoadingProfile(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [authChecked, authUser, resetPopups, setDataSession, setDataUser, setShowMessage]);

  if (!authChecked) {
    return (
      <main className='flex min-h-screen items-center justify-center bg-black'>
        <Loading />
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-black">
      <Simplify />
      {showMessage.show && <MessageToUser />}
      {dataSession.show && <VerifySession />}
      {showCreateSession && <CreateSection closeHref="/profile" />}
      {showInfoSessions && <Info />}
      <Nav />

      <section className={`w-full ${simplify ? 'bg-black' : 'bg-ritual'} bg-cover bg-top`}>
        <div className="h-full w-full bg-black/90">
          <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 pb-10 pt-4 sm:px-8 sm:pb-14">
            {loadingProfile ? (
              <div className="flex min-h-[60vh] items-center justify-center bg-black/80 px-6 py-10 text-white">
                <span className="loader z-50" />
              </div>
            ) : (
              <section className="text-white">
                <div className="pb-8">
                  <h1 className="font-kingthings text-3xl sm:text-4xl lg:text-5xl">Perfil</h1>
                  <hr className="mt-5 border-white/10" />

                  <div className="mt-6 w-full">
                    <p className="mt-2 font-kingthings text-2xl capitalize leading-none text-white sm:text-3xl">{nameUser}</p>
                    <p className="mt-4 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/60">Email de cadastro</p>
                    <p className="mt-2 break-all font-geist-mono text-[11px] leading-6 text-white/85 sm:text-xs">{email}</p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="mb-4 flex flex-col gap-3 text-white sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="font-kingthings text-lg sm:text-xl">Sessões em que você é narrador</h2>
                        <button
                          type="button"
                          onClick={() => {
                            setShowInfoSessions(!showInfoSessions);
                            setShowCreateSession(false);
                          }}
                          className="text-white/70 transition-colors hover:text-red-400"
                          aria-label="Informações sobre sessões"
                        >
                          <IoIosInformationCircle className="text-2xl sm:text-3xl" />
                        </button>
                      </div>
                      <p className="mt-1 font-geist-mono text-[11px] text-white/75 sm:text-xs">
                        Acompanhe as mesas que estão sob sua condução e retome cada crônica com um clique.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => void handleCreateSession()}
                        className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
                      >
                        Criar Sessão
                      </button>
                      <Link
                        href="/sessions"
                        className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
                      >
                        Ver Tudo
                      </Link>
                    </div>
                  </div>

                  {narratorSessions.length === 0 ? (
                    <div className="border border-zinc-500/30 bg-black/60 px-4 py-6 text-center font-geist-mono text-xs text-white/70">
                      Você ainda não possui sessões ativas em que seja narrador.
                    </div>
                  ) : (
                    <Swiper
                      modules={[Autoplay, Pagination]}
                      slidesPerView={1.08}
                      spaceBetween={12}
                      loop={narratorSessions.length > 3}
                      speed={700}
                      autoplay={{
                        delay: 4500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      pagination={{
                        clickable: true,
                      }}
                      className="recent-sessions-swiper"
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 14,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 16,
                        },
                      }}
                    >
                      {narratorSessions.map((session) => (
                        <SwiperSlide key={`narrator-${session.id}`} className="!h-auto">
                          <button
                            type="button"
                            onClick={() => handleOpenSession(session.id)}
                            className="group h-full w-full overflow-hidden border border-zinc-500/30 bg-black/70 text-left transition-colors hover:border-red-700/80"
                          >
                            <div className="relative h-36 w-full">
                              <Image
                                src={`/images/sessions/${session.imageName || '01'}.png`}
                                alt={`Banner da sessão ${session.name || ''}`}
                                className="object-cover"
                                fill
                                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              />
                              <div className="absolute inset-0 bg-black/35" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                              <div className="absolute inset-x-0 bottom-0 px-3 pb-1 pt-3">
                                <p className="font-kingthings text-base capitalize text-white transition-colors group-hover:text-red-500">
                                  {session.name || 'Sessão sem nome'}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2 px-4 py-4 text-white uppercase">
                              <p className="font-geist-mono text-[11px] text-white/75">
                                Narrador: <span className="uppercase">{session.nameMaster || 'Não informado'}</span>
                              </p>
                              <p className="font-geist-mono text-[11px] text-white/75">
                                Criada em: {session.creationDate || 'Não informada'}
                              </p>
                              <p className="font-geist-mono text-[11px] text-white/75">
                                Status: {session.statusSession || 'Ativa'}
                              </p>
                              <p className="font-geist-mono text-[11px] leading-relaxed text-white/85">
                                {resumeText(session.description || 'Sem sinopse cadastrada.', 120)}
                              </p>
                            </div>
                          </button>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>

                <div className="mt-10 w-full">
                  <div className="mb-4 flex flex-col gap-3 text-white sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="font-kingthings text-lg sm:text-xl">Sessões em que você é jogador</h2>
                        <button
                          type="button"
                          onClick={() => {
                            setShowInfoSessions(!showInfoSessions);
                            setShowCreateSession(false);
                          }}
                          className="text-white/70 transition-colors hover:text-red-400"
                          aria-label="Informações sobre sessões"
                        >
                          <IoIosInformationCircle className="text-2xl sm:text-3xl" />
                        </button>
                      </div>
                      <p className="mt-1 font-geist-mono text-[11px] text-white/75 sm:text-xs">
                        Encontre rapidamente as mesas em que seu personagem participa e siga a história de onde parou.
                      </p>
                    </div>
                    <Link
                      href="/sessions"
                      className="inline-flex items-center justify-center self-start border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900 sm:self-auto"
                    >
                      Ver Tudo
                    </Link>
                  </div>

                  {playerSessions.length === 0 ? (
                    <div className="border border-zinc-500/30 bg-black/60 px-4 py-6 text-center font-geist-mono text-xs text-white/70">
                      Você ainda não possui sessões ativas em que seja jogador.
                    </div>
                  ) : (
                    <Swiper
                      modules={[Autoplay, Pagination]}
                      slidesPerView={1.08}
                      spaceBetween={12}
                      loop={playerSessions.length > 3}
                      speed={700}
                      autoplay={{
                        delay: 4300,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                        reverseDirection: true,
                      }}
                      pagination={{
                        clickable: true,
                      }}
                      className="recent-sessions-swiper"
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 14,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 16,
                        },
                      }}
                    >
                      {playerSessions.map((session) => (
                        <SwiperSlide key={`player-${session.id}`} className="!h-auto">
                          <button
                            type="button"
                            onClick={() => handleOpenSession(session.id)}
                            className="group h-full w-full overflow-hidden border border-zinc-500/30 bg-black/70 text-left transition-colors hover:border-red-700/80"
                          >
                            <div className="relative h-36 w-full">
                              <Image
                                src={`/images/sessions/${session.imageName || '01'}.png`}
                                alt={`Banner da sessão ${session.name || ''}`}
                                className="object-cover"
                                fill
                                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              />
                              <div className="absolute inset-0 bg-black/35" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                              <div className="absolute inset-x-0 bottom-0 px-3 pb-1 pt-3">
                                <p className="font-kingthings text-base capitalize text-white transition-colors group-hover:text-red-500">
                                  {session.name || 'Sessão sem nome'}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2 px-4 py-4 text-white uppercase">
                              <p className="font-geist-mono text-[11px] text-white/75">
                                Narrador: <span className="uppercase">{session.nameMaster || 'Não informado'}</span>
                              </p>
                              <p className="font-geist-mono text-[11px] text-white/75">
                                Criada em: {session.creationDate || 'Não informada'}
                              </p>
                              <p className="font-geist-mono text-[11px] text-white/75">
                                Status: {session.statusSession || 'Ativa'}
                              </p>
                              <p className="font-geist-mono text-[11px] leading-relaxed text-white/85">
                                {resumeText(session.description || 'Sem sinopse cadastrada.', 120)}
                              </p>
                            </div>
                          </button>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>

                <div className="mt-10 w-full">
                  <div className="mb-4 flex flex-col gap-3 text-white sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="font-kingthings text-lg sm:text-xl">Suas fichas</h2>
                      <p className="mt-1 font-geist-mono text-[11px] text-white/75 sm:text-xs">
                        Reencontre seus personagens, acompanhe seus augúrios e tribos, e retome cada ficha sem esforço.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => void handleCreateSheet()}
                        className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
                      >
                        {creatingSheet ? 'Criando...' : 'Criar Ficha'}
                      </button>
                      <Link
                        href="/sheets"
                        className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
                      >
                        Ver Tudo
                      </Link>
                    </div>
                  </div>

                  {mySheets.length === 0 ? (
                    <div className="border border-zinc-500/30 bg-black/60 px-4 py-6 text-center font-geist-mono text-xs text-white/70">
                      Você ainda não possui fichas cadastradas.
                    </div>
                  ) : (
                    <Swiper
                      modules={[Autoplay, Pagination]}
                      slidesPerView={1.08}
                      spaceBetween={12}
                      loop={mySheets.length > 3}
                      speed={700}
                      autoplay={{
                        delay: 4200,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      pagination={{
                        clickable: true,
                      }}
                      className="recent-sheets-swiper"
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 14,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 16,
                        },
                      }}
                    >
                      {mySheets.map((sheet) => {
                        const formattedAuspice = capitalizeFirstLetter(String(sheet.data?.auspice || '').trim());
                        const formattedTrybe = capitalizeFirstLetter(String(sheet.data?.trybe || '').trim());
                        const creatorName = sheet.user || nameUser || 'Usuário não informado';
                        const creatorInitial = creatorName.trim().charAt(0).toUpperCase() || '?';

                        return (
                          <SwiperSlide key={sheet.id} className="!h-auto">
                            <button
                              type="button"
                              onClick={() => handleOpenSheet(sheet.id)}
                              className="group relative h-full w-full overflow-hidden border border-zinc-500/30 bg-black transition-colors hover:border-red-700/80"
                            >
                              {sheet.data?.trybe && (
                                <>
                                  <div className="pointer-events-none absolute inset-0">
                                    <Image
                                      src={`/images/gifts/${formattedTrybe}.png`}
                                      alt=""
                                      className="translate-x-[24%] translate-y-[6%] object-contain opacity-20 scale-[1.05]"
                                      fill
                                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                    />
                                  </div>
                                  <div className="absolute inset-0 bg-black/35" />
                                </>
                              )}

                              <div className="relative z-10 space-y-4 px-4 py-4 text-left text-white">
                                <div>
                                  <p className="font-kingthings text-xl capitalize leading-none text-white transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] group-hover:text-red-500">
                                    {sheet.data?.name || 'Ficha sem nome'}
                                  </p>
                                </div>

                                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 font-geist-mono text-[10px] uppercase text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                                  <div className="min-w-0">
                                    <p className="text-white/60">Augúrio</p>
                                    <p className="mt-1 text-[11px] text-white">{formattedAuspice || 'Não definido'}</p>
                                  </div>
                                  <div />
                                  <div className="min-w-0">
                                    <p className="text-white/60">Tribo</p>
                                    <p className="mt-1 text-[11px] text-white">{formattedTrybe || 'Não definida'}</p>
                                  </div>
                                  <div className="min-w-0 text-right">
                                    <p className="text-white/60">Criada em</p>
                                    <p className="mt-1 text-[11px] text-white">{sheet.creationDate || 'Não informada'}</p>
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
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}



