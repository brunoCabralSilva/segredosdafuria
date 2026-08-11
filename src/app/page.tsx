'use client'

import Footer from '@/components/footer';
import { authenticate } from '@/firebase/authenticate';
import Simplify from '@/components/simplify';
import MessageToUser from '@/components/dicesAndMessages/messageToUser';
import VerifySession from '@/components/popup/verifySession';
import CreateSection from '@/components/popup/createSection';
import contexto from '@/context/context';
import { addNewSheetMandatory, getAllSheets } from '@/firebase/players';
import { getSessions } from '@/firebase/sessions';
import { capitalizeFirstLetter, parseDate, sheetStructure } from '@/firebase/utilities';
import { copyToClipboard } from '@/utils/copyToClipboard';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

const menuItems = [
  { href: '/advantagesAndFlaws', label: 'VANTAGENS E DEFEITOS', image: '/images/wallpapers/45.jpg', position: 'top' },
  { href: '/about', label: 'QUEM SOMOS', image: '/images/wallpapers/128.jpg', position: 'center' },
  { href: '/auspices', label: 'AUGÚRIOS', image: '/images/wallpapers/31.jpg', position: 'center' },
  { href: '/gifts', label: 'DONS', image: '/images/wallpapers/56.jpg', position: 'center' },
  { href: '/forms', label: 'FORMAS', image: '/images/wallpapers/33.jpg', position: 'center' },
  { href: '/sheets', label: 'FICHAS', image: '/images/wallpapers/100.jpg', position: 'bottom' },
  { href: '/loresheets', label: 'FICHAS DE CONHECIMENTO', image: '/images/wallpapers/margraive.jpg', position: 'center' },
  { href: '/profile', label: 'PERFIL', image: '/images/wallpapers/78.jpg', position: 'top' },
  { href: '/rituals', label: 'RITUAIS', image: '/images/wallpapers/0001.png', position: 'center' },
  { href: '/sessions', label: 'SESSÕES', image: '/images/wallpaper.png', position: 'center' },
  { href: '/talismans', label: 'TALISMÃS', image: '/images/wallpapers/122.jpg', position: 'center' },
  { href: '/trybes', label: 'TRIBOS', image: '/images/wallpapers/95.jpg', position: 'center' },
] as const;

const sortedMenuItems = [...menuItems].sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));

type HomeSession = {
  id: string;
  name?: string;
  nameMaster?: string;
  creationDate?: string;
  description?: string;
  imageName?: string;
  statusSession?: string;
  players?: string[];
};

type HomeSheet = {
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

export default function Home() {
  const describe = useRef<HTMLDivElement | null>(null);
  const [latestSessions, setLatestSessions] = useState<HomeSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [latestSheets, setLatestSheets] = useState<HomeSheet[]>([]);
  const [loadingSheets, setLoadingSheets] = useState(true);
  const [creatingSheet, setCreatingSheet] = useState(false);
  const pixKey = 'garounordeste@gmail.com';

  const {
    simplify,
    showMessage,
    setShowMessage,
    dataSession,
    setDataSession,
    showCreateSession,
    setShowCreateSession,
    dataUser,
    setDataUser,
  } = useContext(contexto);

  const router = useRouter();
  const emptySheetsMessage = 'Nenhuma ficha cadastrada ate o momento.';

  const scrollToComponent = () => {
    if (describe.current) describe.current.scrollIntoView({ behavior: 'smooth' });
  };

  const getCurrentUser = async () => {
    if (dataUser.email !== '' && dataUser.displayName !== '') return dataUser;

    const authData: any = await authenticate(setShowMessage);
    if (!authData || !authData.email || !authData.displayName) return null;

    const authUser = { email: authData.email, displayName: authData.displayName };
    setDataUser(authUser);
    return authUser;
  };

  const requireAuth = async () => {
    const authUser = await getCurrentUser();
    if (!authUser) {
      router.push('/login');
      return null;
    }

    return authUser;
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

  const handleCreateSession = async () => {
    const authUser = await requireAuth();
    if (!authUser) return;

    setShowCreateSession(true);
  };

  const handleCreateSheet = async () => {
    if (creatingSheet) return;

    const authUser = await requireAuth();
    if (!authUser) return;

    setCreatingSheet(true);
    try {
      const creationDate = getCurrentBrazilDateTimeString();
      const sheet = sheetStructure(authUser.email, authUser.displayName, creationDate);
      const sheetId = await addNewSheetMandatory('', sheet, setShowMessage);
      if (!sheetId) return;
      const sheets = await getAllSheets();
      const orderedSheets = [...sheets].sort((a: any, b: any) => {
        const dateA = a.creationDate ? parseDate(String(a.creationDate)) : new Date(0);
        const dateB = b.creationDate ? parseDate(String(b.creationDate)) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setLatestSheets(orderedSheets as HomeSheet[]);
      setShowMessage({ show: true, text: 'Ficha criada com sucesso!' });
      router.push(`/sheets/${sheetId}`);
    } catch (error) {
      setShowMessage({ show: true, text: 'Ocorreu um erro ao criar a ficha: ' + error });
    } finally {
      setCreatingSheet(false);
    }
  };

  const handleOpenSession = async (sessionId: string) => {
    const authUser = await requireAuth();
    if (!authUser) return;

    setDataSession({ show: true, id: sessionId });
  };

  const handleOpenSheet = async (sheetId: string) => {
    const authUser = await requireAuth();
    if (!authUser) return;

    router.push(`/sheets/${sheetId}`);
  };

  const handleCopyPixKey = async () => {
    try {
      await copyToClipboard(pixKey);
      setShowMessage({ show: true, text: 'Chave PIX copiada com sucesso!' });
    } catch {
      setShowMessage({ show: true, text: `Não foi possível copiar automaticamente. Chave PIX: ${pixKey}` });
    }
  };

  useEffect(() => {
    let active = true;

    const loadSessions = async () => {
      try {
        const sessions = await getSessions();
        const orderedSessions = sessions
          .filter((session: any) => session.statusSession !== 'Finalizada')
          .sort((a: any, b: any) => {
            const dateA = a.creationDate ? parseDate(String(a.creationDate)) : new Date(0);
            const dateB = b.creationDate ? parseDate(String(b.creationDate)) : new Date(0);
            return dateB.getTime() - dateA.getTime();
          });

        if (active) setLatestSessions(orderedSessions as HomeSession[]);
      } catch (error) {
        if (active) {
          setShowMessage({ show: true, text: `Ocorreu um erro ao carregar as sessões: ${error}` });
        }
      } finally {
        if (active) setLoadingSessions(false);
      }
    };

    loadSessions();

    return () => {
      active = false;
    };
  }, [setShowMessage]);

  useEffect(() => {
    let active = true;

    const loadSheets = async () => {
      try {
        const sheets = await getAllSheets();
        const orderedSheets = [...sheets].sort((a: any, b: any) => {
          const dateA = a.creationDate ? parseDate(String(a.creationDate)) : new Date(0);
          const dateB = b.creationDate ? parseDate(String(b.creationDate)) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        if (active) setLatestSheets(orderedSheets as HomeSheet[]);
      } catch (error) {
        if (active) {
          setShowMessage({ show: true, text: `Ocorreu um erro ao carregar as fichas: ${error}` });
        }
      } finally {
        if (active) setLoadingSheets(false);
      }
    };

    loadSheets();

    return () => {
      active = false;
    };
  }, [setShowMessage]);

  return (
    <main className="bg-black relative flex flex-col items-center justify-center">
      <Simplify />
      {showMessage.show && <MessageToUser />}
      {dataSession.show && <VerifySession />}
      {showCreateSession && <CreateSection closeHref="/" />}

      <header className={`relative flex h-screen w-full flex-col items-center justify-center bg-cover bg-top ${simplify ? 'bg-black' : 'bg-ritual'}`}>
        <div className="absolute h-full w-full bg-black/50" />
        <div className="z-10 flex h-screen w-full flex-col items-center justify-center">
          <Image
            src="/images/logos/segredos-da-fúria.png"
            alt="Logo do site formato de imagem"
            className="h-50vh w-10/12 object-contain sm:h-70vh sm:w-3/5 md:h-50vh md:w-1/2 xl:w-5/12"
            width={2000}
            height={800}
            priority
          />
          <Image
            src="/images/logos/arrow-down.png"
            alt="seta para baixo"
            className="w-20 cursor-pointer animate-pulse object-contain sm:h-30vh"
            width={2000}
            height={800}
            priority
            onClick={scrollToComponent}
          />
        </div>
      </header>

      <section ref={describe} className="mx-auto w-full max-w-[1200px] px-4 pb-8 sm:px-8">
        <div className={`relative mt-4 flex w-full overflow-hidden bg-cover text-center text-white sm:mt-8 ${simplify ? 'border border-white/20 bg-black' : 'bg-06'}`}>
          <div className="absolute h-full w-full bg-black/70" />
          <p className="relative z-10 px-5 py-5 font-kingthings text-sm sm:text-base">
            Convidamos você a uma jornada repleta de conhecimento ancestral, onde poderá desvendar as características únicas das tribos, augúrios, dons, rituais... enfim! Tudo existente na 5º Edição de Lobisomem: O Apocalipse.
          </p>
        </div>

        <div className="mt-6 w-full">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView="auto"
            spaceBetween={6}
            loop
            speed={700}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              reverseDirection: true,
            }}
            pagination={{ clickable: true }}
            grabCursor
            className="menu-swiper"
            breakpoints={{
              640: { spaceBetween: 16 },
              1024: { spaceBetween: 20 },
            }}
            onSwiper={(swiper) => {
              swiper.autoplay.start();
            }}
          >
            {sortedMenuItems.map((item) => (
              <SwiperSlide key={item.href} className="!w-[6rem] sm:!w-[8.5rem] lg:!w-[10rem]">
                <Link href={item.href} className="group flex w-full flex-col items-center text-center text-white">
                  <div
                    className={`relative h-16 w-16 overflow-hidden rounded-full border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-24 lg:h-32 lg:w-32 ${simplify ? 'border-2 border-white bg-black' : ''}`}
                    style={
                      simplify
                        ? undefined
                        : {
                            backgroundImage: `url('${item.image}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: item.position,
                          }
                    }
                  >
                    {simplify && <div className="absolute inset-0 bg-black/35" />}
                  </div>
                  <p className="mt-2 max-w-[10rem] font-geist-mono text-[10px] leading-snug tracking-[0.06em] sm:text-[11px] lg:text-xs">
                    {item.label}
                  </p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-8 w-full">
          <div className="mb-4 flex flex-col gap-3 text-white sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-kingthings text-lg sm:text-xl">Sessoes</h2>
              <p className="mt-1 font-geist-mono text-[11px] text-white/75 sm:text-xs">
                Entre em Sessões, acompanhe o chat, gerencie fichas e viva toda a crônica em um so lugar.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleCreateSession}
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

          {loadingSessions ? (
            <div className="border border-white/15 bg-black/60 px-4 py-6 text-center font-geist-mono text-xs text-white/70">
              Carregando sessões...
            </div>
          ) : latestSessions.length === 0 ? (
            <div className="border border-white/15 bg-black/60 px-4 py-6 text-center font-geist-mono text-xs text-white/70">
              Nenhuma sessão cadastrada até o momento.
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              spaceBetween={12}
              loop={latestSessions.length > 3}
              speed={700}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              className="recent-sessions-swiper"
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 14 },
                768: { slidesPerView: 3, spaceBetween: 16 },
              }}
            >
              {latestSessions.map((session) => (
                <SwiperSlide key={session.id} className="!h-auto">
                  <button
                    type="button"
                    onClick={() => void handleOpenSession(session.id)}
                    className="group h-full w-full overflow-hidden border border-zinc-500/30 bg-black/70 text-left transition-colors hover:border-red-700/80"
                  >
                    <div className="relative h-36 w-full">
                      <Image
                        src={`/images/sessions/${session.imageName || '01'}.png`}
                        alt={`Banner da sessao ${session.name || ''}`}
                        className="object-cover"
                        fill
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 px-3 pb-1 pt-3">
                        <p className="font-kingthings text-base capitalize text-white transition-colors group-hover:text-red-500">
                          {session.name || 'Sessao sem nome'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 px-4 py-4 uppercase text-white">
                      <p className="font-geist-mono text-[11px] text-white/75">
                        Narrador: <span className="uppercase">{session.nameMaster || 'Nao informado'}</span>
                      </p>
                      <p className="font-geist-mono text-[11px] text-white/75">
                        Criada em: {session.creationDate || 'Nao informada'}
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
              <h2 className="font-kingthings text-lg sm:text-xl">Fichas</h2>
              <p className="mt-1 font-geist-mono text-[11px] text-white/75 sm:text-xs">
                Explore todas as fichas existentes, encontre personagens da comunidade e mantenha sua crônica sempre ao alcance.
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

          {loadingSheets ? (
            <div className="border border-white/15 bg-black/60 px-4 py-6 text-center font-geist-mono text-xs text-white/70">
              Carregando fichas...
            </div>
          ) : latestSheets.length === 0 ? (
            <div className="border border-white/15 bg-black/60 px-4 py-6 text-center font-geist-mono text-xs text-white/70">
              {emptySheetsMessage}
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              spaceBetween={12}
              loop={latestSheets.length > 3}
              speed={700}
              autoplay={{
                delay: 4300,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                reverseDirection: true,
              }}
              className="recent-sheets-swiper"
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 14 },
                768: { slidesPerView: 3, spaceBetween: 16 },
              }}
            >
              {latestSheets.map((sheet) => {
                const formattedAuspice = capitalizeFirstLetter(String(sheet.data?.auspice || '').trim());
                const formattedTrybe = capitalizeFirstLetter(String(sheet.data?.trybe || '').trim());
                const creatorName = sheet.user || 'Usuario nao informado';
                const creatorInitial = creatorName.trim().charAt(0).toUpperCase() || '?';

                return (
                  <SwiperSlide key={sheet.id} className="!h-auto">
                    <button
                      type="button"
                      onClick={() => void handleOpenSheet(sheet.id)}
                      className="group relative h-full w-full overflow-hidden border border-zinc-500/30 bg-black text-left transition-colors hover:border-red-700/80"
                    >
                      {sheet.data?.trybe && (
                        <div className="pointer-events-none absolute inset-0">
                          <Image
                            src={`/images/gifts/${formattedTrybe}.png`}
                            alt=""
                            className="translate-x-[24%] translate-y-[6%] scale-[1.05] object-contain opacity-20"
                            fill
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/35" />

                      <div className="relative z-10 space-y-4 px-4 py-4 text-left text-white">
                        <div>
                          <p className="font-kingthings text-xl capitalize leading-none text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] transition-colors group-hover:text-red-500">
                            {sheet.data?.name || 'Ficha sem nome'}
                          </p>
                        </div>

                        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 font-geist-mono text-[10px] uppercase text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                          <div className="min-w-0">
                            <p className="text-white/60">Augúrio</p>
                            <p className="mt-1 text-[11px] text-white">{formattedAuspice || 'Nao definido'}</p>
                          </div>
                          <div />
                          <div className="min-w-0">
                            <p className="text-white/60">Tribo</p>
                            <p className="mt-1 text-[11px] text-white">{formattedTrybe || 'Nao definida'}</p>
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
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>

        <div className={`mt-10 w-full overflow-hidden border text-white ${simplify ? 'border-white/25 bg-black' : 'border-red-950/80 bg-gradient-to-br from-black via-zinc-950 to-red-950/50'}`}>
          <div className="grid items-center gap-6 px-5 py-6 sm:px-8 md:grid-cols-[minmax(0,1fr)_260px]">
            <div>
              <h2 className="font-kingthings text-xl sm:text-2xl">Apoie o projeto</h2>
              <p className="mt-3 font-geist-mono text-xs leading-relaxed text-white/80 sm:text-sm">
                Tudo aqui é feito por amor ao RPG. Se esse projeto ajuda a sua mesa ou a sua criação de fichas, qualquer apoio é muito bem-vindo pra gente continuar mantendo esse espaço vivo.
              </p>
              <p className="mt-3 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/65 sm:text-xs">
                Chave PIX: {pixKey}
              </p>
              <button
                type="button"
                onClick={() => void handleCopyPixKey()}
                className="mt-4 inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
              >
                Copiar chave PIX
              </button>
            </div>

            <div className="relative mx-auto w-full max-w-[260px]">
              <div className="relative aspect-square overflow-hidden border border-white/10 bg-white/5 p-3 shadow-[0_0_25px_rgba(0,0,0,0.35)]">
                <Image
                  src="/images/pix.jpeg"
                  alt="QR Code para apoiar o projeto via PIX"
                  fill
                  className="object-contain p-3"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
