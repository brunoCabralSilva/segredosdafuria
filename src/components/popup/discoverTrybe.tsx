'use client';

import contexto from '@/context/context';
import listTrybes from '@/data/trybes.json';
import {
  calculateTrybeQuizResult,
  tribeQuizQuestionCount,
  tribeQuizQuestions,
  type TribeQuizAnswers,
  type TribeQuizResultId,
} from '@/data/trybeQuiz';
import {
  registerTrybeQuizWinner,
  type TrybeQuizScoreboardItem,
} from '@/firebase/trybeQuiz';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useMemo, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

export default function DiscoverTrybePopup(props: { onClose: () => void }) {
  const { onClose } = props;
  const { setShowMessage } = useContext(contexto);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<TribeQuizAnswers>({});
  const [scoreboard, setScoreboard] = useState<TrybeQuizScoreboardItem[]>([]);
  const [savingScoreboard, setSavingScoreboard] = useState(false);
  const [hasRegisteredWinner, setHasRegisteredWinner] = useState(false);

  const isResultStep = currentQuestionIndex >= tribeQuizQuestionCount;
  const currentQuestion = tribeQuizQuestions[Math.min(currentQuestionIndex, tribeQuizQuestionCount - 1)];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;

  const ranking = useMemo(() => {
    if (!isResultStep) return [];
    return calculateTrybeQuizResult(answers);
  }, [answers, isResultStep]);

  const topTrybeId = ranking[0]?.trybeId as TribeQuizResultId | undefined;

  const topTrybe = useMemo(() => {
    if (!topTrybeId) return null;
    return listTrybes.find((trybe) => trybe.nameEn === topTrybeId) || null;
  }, [topTrybeId]);

  const secondaryTrybes = useMemo(() => {
    return ranking
      .slice(1, 3)
      .map((item) => listTrybes.find((trybe) => trybe.nameEn === item.trybeId))
      .filter(Boolean);
  }, [ranking]);

  const rankedScoreboard = useMemo(() => {
    return [...scoreboard]
      .map((item) => ({
        ...item,
        trybe: listTrybes.find((trybe) => trybe.nameEn === item.trybeId) || null,
      }))
      .sort((first, second) => {
        if (second.total !== first.total) return second.total - first.total;
        return String(first.trybe?.namePtBr || first.trybeId).localeCompare(
          String(second.trybe?.namePtBr || second.trybeId),
          'pt-BR',
        );
      });
  }, [scoreboard]);

  const totalQuizResults = useMemo(() => {
    return scoreboard.reduce((total, item) => total + Number(item.total || 0), 0);
  }, [scoreboard]);

  const progressPercentage = Math.round((Object.keys(answers).length / tribeQuizQuestionCount) * 100);

  const getTrybeSlug = (nameEn: string) => nameEn.toLowerCase().replace(/ /g, '-');

  const getTrybeSummary = (trybe: any) => {
    return String(trybe?.alternativeDescription?.[0] || trybe?.description?.[0] || '');
  };

  const handleSelectOption = (optionId: string) => {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (!selectedOptionId) return;
    if (currentQuestionIndex === tribeQuizQuestionCount - 1) {
      setCurrentQuestionIndex(tribeQuizQuestionCount);
      return;
    }
    setCurrentQuestionIndex((current) => current + 1);
  };

  const handlePrevious = () => {
    if (isResultStep) {
      setCurrentQuestionIndex(tribeQuizQuestionCount - 1);
      return;
    }
    setCurrentQuestionIndex((current) => Math.max(0, current - 1));
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setScoreboard([]);
    setSavingScoreboard(false);
    setHasRegisteredWinner(false);
  };

  useEffect(() => {
    let ignore = false;

    if (!isResultStep || !topTrybeId || hasRegisteredWinner) return;

    const saveScoreboard = async () => {
      try {
        setSavingScoreboard(true);
        const nextScoreboard = await registerTrybeQuizWinner(topTrybeId);
        if (ignore) return;
        setScoreboard(nextScoreboard);
        setHasRegisteredWinner(true);
      } catch (error: any) {
        if (ignore) return;
        setShowMessage({
          show: true,
          text: 'Ocorreu um erro ao salvar o resultado do teste de tribo: ' + (error?.message || error),
        });
      } finally {
        if (!ignore) setSavingScoreboard(false);
      }
    };

    void saveScoreboard();

    return () => {
      ignore = true;
    };
  }, [hasRegisteredWinner, isResultStep, setShowMessage, topTrybeId]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6">
      <div className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-y-auto border border-zinc-500/40 bg-black/90">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/wallpapers/95.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/90" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 text-2xl text-white/70 transition-colors hover:text-red-400"
          aria-label="Fechar descoberta de tribo"
        >
          <AiFillCloseCircle />
        </button>

        <div className="relative z-10 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <h2 className="mt-2 font-kingthings text-2xl sm:text-3xl">Descubra Sua Tribo</h2>
          <p className="mt-2 max-w-3xl font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
            Responda {tribeQuizQuestionCount} situações e descubra qual tribo mais
            combina com seus impulsos, valores e sua forma de enxergar o mundo.
            Não é necessário conhecer Werewolf: The Apocalypse.
          </p>
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-4 px-5 pb-6 sm:px-8 sm:pb-8">
          {!isResultStep ? (
            <>
              <div className="border border-zinc-500/30 bg-black/45 px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
                      Pergunta {currentQuestionIndex + 1} de {tribeQuizQuestionCount}
                    </p>
                    <p className="mt-1 font-geist-mono text-[11px] uppercase tracking-[0.08em] text-white/45">
                      {progressPercentage}% do caminho concluído
                    </p>
                  </div>
                  <div className="grid w-full grid-cols-10 gap-1 sm:max-w-[320px]">
                    {tribeQuizQuestions.map((question, index) => {
                      const answered = Boolean(answers[question.id]);
                      const isCurrent = index === currentQuestionIndex;

                      return (
                        <span
                          key={question.id}
                          className={`h-2 w-full ${isCurrent
                            ? 'bg-red-600'
                            : answered
                              ? 'bg-white/70'
                              : 'bg-white/15'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="principles-scrollbar relative min-h-0 flex-1 border border-zinc-500/30 bg-black/90 [direction:rtl] px-2 pb-0 pt-2 pr-2 sm:px-2 sm:pb-0 sm:pt-2 sm:pr-2">
                <div className="w-full [direction:ltr]">
                  <div className="border border-white/10 bg-black/60 p-4 sm:p-5">
                    <h3 className="font-kingthings text-lg leading-7 text-white sm:text-lg">
                      {currentQuestion.situation}
                    </h3>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 pb-2">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = selectedOptionId === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleSelectOption(option.id)}
                          className={`border px-4 py-4 text-left transition-colors sm:px-5 ${isSelected
                            ? 'border-red-700 bg-red-950/30'
                            : 'border-zinc-500/30 bg-black/55 hover:border-zinc-300/40 hover:bg-black/70'}`}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center border font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] ${isSelected
                              ? 'border-red-700 bg-red-950/60 text-white'
                              : 'border-white/15 bg-black/70 text-white/70'}`}>
                              {String.fromCharCode(65 + index)}
                            </span>
                            <div>
                              <p className="font-geist-mono text-xs leading-6 text-white/68 sm:text-[13px]">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
                  {selectedOptionId ? 'Resposta registrada para esta situação' : 'Escolha uma alternativa para continuar'}
                </div>
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="inline-flex items-center justify-center border border-zinc-500/40 bg-black/60 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:border-white/40 hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!selectedOptionId}
                    className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-white/35"
                  >
                    {currentQuestionIndex === tribeQuizQuestionCount - 1 ? 'Ver Resultado' : 'Próxima Pergunta'}
                  </button>
                </div>
              </div>
            </>
          ) : topTrybe ? (
            <>
              <div className="principles-scrollbar relative min-h-0 flex-1 border border-zinc-500/30 bg-black/45 [direction:rtl] px-2 pb-0 pt-2 pr-2 sm:px-2 sm:pb-0 sm:pt-2 sm:pr-2">
                <div className="w-full [direction:ltr]">
                  <div className="grid gap-5 pb-2 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <div className="border border-white/10 bg-black/65 p-4">
                      <div className="relative border border-zinc-500/30 bg-black/70">
                        <div className="absolute inset-0">
                          <Image
                            src={`/images/trybes/${topTrybe.namePtBr} - wallpaper.jpg`}
                            alt=""
                            className="h-full w-full object-cover object-center opacity-30"
                            fill
                            sizes="280px"
                          />
                        </div>
                        <div className="relative flex min-h-[260px] items-center justify-center p-6">
                          <Image
                            src={`/images/trybes/${topTrybe.namePtBr}.png`}
                            alt={`Glifo da tribo ${topTrybe.namePtBr}`}
                            className="h-36 w-36 object-contain"
                            width={320}
                            height={320}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 border border-white/10 bg-black/65 p-4 sm:p-5">
                      <div>
                        <p className="font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/55">
                          Resultado predominante
                        </p>
                        <h3 className="mt-2 font-kingthings text-3xl leading-none text-white sm:text-4xl">
                          {topTrybe.namePtBr}
                        </h3>
                        <p className="mt-2 font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/65">
                          {topTrybe.alternativeTitle} · Renome {topTrybe.renown}
                        </p>
                      </div>

                      <p className="font-geist-mono text-xs leading-6 text-white/74 sm:text-[13px]">
                        {getTrybeSummary(topTrybe)}
                      </p>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="border border-white/10 bg-black/60 px-4 py-3">
                          <p className="font-geist-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                            Espírito patrono
                          </p>
                          <p className="mt-2 font-geist-mono text-sm text-white/88">
                            {topTrybe.patronName}
                          </p>
                        </div>
                        <div className="border border-white/10 bg-black/60 px-4 py-3">
                          <p className="font-geist-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                            Verbos centrais
                          </p>
                          <p className="mt-2 font-geist-mono text-sm text-white/88">
                            {Array.isArray(topTrybe.verbs) ? topTrybe.verbs.slice(0, 4).join(' · ') : 'Sem dados'}
                          </p>
                        </div>
                      </div>

                      <div className="border border-white/10 bg-black/60 px-4 py-3">
                        <p className="font-geist-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                          Também ressoam em você
                        </p>
                        <p className="mt-2 font-geist-mono text-sm leading-6 text-white/82">
                          {secondaryTrybes.length > 0
                            ? secondaryTrybes.map((trybe: any) => trybe.namePtBr).join(' e ')
                            : 'Seu resultado ficou fortemente concentrado em uma única tribo.'}
                        </p>
                      </div>

                      <blockquote className="border-l border-red-700/70 pl-4 font-geist-mono text-sm leading-6 text-white/78">
                        {topTrybe.phrase}
                      </blockquote>

                      <div className="border border-white/10 bg-black/60 px-4 py-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-geist-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                            Placar das tribos
                          </p>
                          <p className="font-geist-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                            {savingScoreboard ? 'Atualizando placar...' : `${totalQuizResults} resultados registrados`}
                          </p>
                        </div>

                        <div className="mt-3 grid gap-2">
                          {rankedScoreboard.map((item, index) => (
                            <div
                              key={item.trybeId}
                              className={`flex items-center justify-between border px-3 py-2 ${
                                item.trybeId === topTrybeId
                                  ? 'border-red-700/70 bg-red-950/30'
                                  : 'border-white/10 bg-black/45'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-geist-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                                  #{index + 1}
                                </span>
                                <span className="font-geist-mono text-xs text-white/82 sm:text-[13px]">
                                  {item.trybe?.namePtBr || item.trybeId}
                                </span>
                              </div>
                              <span className="font-geist-mono text-xs font-bold text-white sm:text-[13px]">
                                {item.total}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetQuiz}
                  className="inline-flex items-center justify-center border border-zinc-500/40 bg-black/60 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:border-white/40 hover:bg-black/80"
                >
                  Refazer Teste
                </button>
                <Link
                  href={`/trybes/${getTrybeSlug(topTrybe.nameEn)}`}
                  className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
                >
                  Conhecer Tribo
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
