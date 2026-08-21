'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Nav from '@/components/nav';
import Footer from '@/components/footer';

import Simplify from '@/components/simplify';
import contexto from '@/context/context';
import listTrybes from '../../../data/trybes.json';
import { IArchetypes, ITrybe } from '../../../interface';

type TrybeData = ITrybe & {
  custom?: boolean;
  patronName?: string;
  renown?: string;
  verbs?: string[];
};

const alternativeAuspiceSections = [
  { key: 'ragabash', title: 'Ragabash' },
  { key: 'theurge', title: 'Theurge' },
  { key: 'phillodox', title: 'Philodox' },
  { key: 'galliard', title: 'Galliard' },
  { key: 'ahroun', title: 'Ahroun' },
] as const;

function toTitleCase(text: string) {
  return text
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function SectionCard(props: { title: string; children: React.ReactNode }) {
  const { title, children } = props;

  return (
    <section className="border border-zinc-500/30 bg-black/80 p-5 text-justify sm:p-6">
      <h2 className="font-kingthings text-2xl uppercase leading-none text-white sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 font-geist-mono text-sm leading-7 text-white/80 sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

function ParagraphBlock(props: { items: Array<string | String> }) {
  return (
    <>
      {props.items.map((paragraph, index) => (
        <p key={index}>{String(paragraph)}</p>
      ))}
    </>
  );
}

function getNonEmptyItems(items?: Array<string | String>) {
  return Array.isArray(items)
    ? items.filter((item) => String(item).trim().length > 0)
    : [];
}

function AuguriesBlock(props: { dataTrybe: TrybeData }) {
  return (
    <div className="space-y-6">
      {alternativeAuspiceSections.map(({ key, title }) => {
        const paragraphs = getNonEmptyItems(props.dataTrybe.alternativeAuspices[key]);

        if (paragraphs.length === 0) return null;

        return (
          <div key={key} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
            <h3 className="font-kingthings text-xl uppercase leading-none text-white sm:text-2xl">{title}</h3>
            <div className="mt-3 space-y-4">
              <ParagraphBlock items={paragraphs} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Trybe() {
  const params = useParams();
  const trybe = params?.trybe as string;
  const [isLoading, setIsLoading] = useState(true);
  const [dataTrybe, setDataTrybe] = useState<TrybeData>();
  const [alternative, setAlternative] = useState(true);
  const { resetPopups, simplify } = useContext(contexto);

  useEffect(() => {
    resetPopups();
    setIsLoading(true);

    if (!trybe) {
      setDataTrybe(undefined);
      return;
    }

    const foundTrybe = listTrybes.find(
      (trb) => trybe.replace(/-/g, ' ') === String(trb.nameEn).toLowerCase()
    ) as TrybeData | undefined;

    setDataTrybe(foundTrybe);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trybe]);

  if (!dataTrybe) {
    return (
      <div className={`relative min-h-screen w-full ${simplify ? 'bg-black' : 'bg-ritual'} bg-cover bg-top`}>
        <div className="w-full h-full bg-black/80">
          <Simplify />
          <div className="absolute inset-0 bg-black/85" />
          <Nav />
          <main className="relative z-10 mx-auto flex min-h-[60vh] w-full max-w-[1200px] items-center justify-center px-4 py-10 text-white sm:px-8">
            <div className="border border-zinc-500/30 bg-black/80 px-6 py-8 text-center">
              <p className="font-geist-mono text-xs uppercase tracking-[0.12em] text-white/65">Tribo</p>
              <h1 className="mt-3 font-kingthings text-3xl uppercase text-white">Não encontrada</h1>
              <p className="mt-4 font-geist-mono text-sm leading-6 text-white/75">
                Não foi possível localizar esta tribo no momento.
              </p>
              <Link
                href="/trybes"
                className="mt-6 inline-flex border border-zinc-500/30 bg-[#7a0000] px-4 py-2 font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#930000]"
              >
                Ver todas as tribos
              </Link>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  const trybeNamePtBr = String(dataTrybe.namePtBr);
  const trybeNameEn = toTitleCase(String(dataTrybe.nameEn));
  const representationAlt = `Representação da tribo ${trybeNamePtBr}`;
  const verbs = Array.isArray(dataTrybe.verbs) ? dataTrybe.verbs.join(' - ') : '';
  const isCustomUnified = dataTrybe.custom === true;
  const officialDescription = getNonEmptyItems(dataTrybe.description);
  const officialWhoAre = getNonEmptyItems(dataTrybe.whoAre);
  const alternativeDescription = getNonEmptyItems(dataTrybe.alternativeDescription);
  const alternativePhrases = getNonEmptyItems(dataTrybe.alternativePhrases);
  const alternativeIdeology = getNonEmptyItems(dataTrybe.alternativeIdeology);
  const alternativeCustoms = getNonEmptyItems(dataTrybe.alternativeCustoms);
  const officialPhrase = String(dataTrybe.phrase || '');
  const showAlternativeView = alternative && !isCustomUnified;
  const heroSubtitle = isCustomUnified
    ? `${trybeNamePtBr} - ${dataTrybe.alternativeTitle || trybeNameEn}`
    : showAlternativeView
      ? `${trybeNamePtBr} - ${dataTrybe.alternativeTitle}`
      : `${trybeNamePtBr} (${trybeNameEn})`;
  const heroPhrases = isCustomUnified
    ? alternativePhrases
    : showAlternativeView
      ? alternativePhrases
      : officialPhrase
        ? [officialPhrase]
        : [];

  return (
    <div className={`relative min-h-screen w-full ${simplify ? 'bg-black' : 'bg-ritual'} bg-cover bg-top`}>
      <div className="w-full h-full bg-black/80">
        <Simplify />
        <div className="absolute inset-0 bg-black/85" />
        <Nav />

        <main className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col px-4 pb-10 pt-4 sm:px-8 sm:pb-14">
          <section className="relative overflow-hidden border border-zinc-500/30 bg-black text-white">
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src={`/images/trybes/${trybeNamePtBr} - wallpaper.jpg`}
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-top opacity-20"
              />
              <div className="absolute inset-0 bg-black/82" />
            </div>

            <div className="relative z-10 grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
              <div>
                <Link
                  href="/trybes"
                  className="inline-flex border border-zinc-500/30 bg-black/70 px-4 py-2 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/80 transition-colors hover:border-red-700 hover:text-white"
                >
                  Voltar para tribos
                </Link>

                <div className="mt-6">
                  <p className="font-geist-mono text-[10px] uppercase tracking-[0.18em] text-white/65">
                    {dataTrybe.renown || 'Renown não informado'}
                  </p>
                  <h1 className="mt-3 font-kingthings text-2xl uppercase leading-none text-white sm:text-3xl lg:text-4xl">
                    {trybeNamePtBr}
                  </h1>
                  <p className="mt-3 font-geist-mono text-[11px] uppercase leading-6 text-white/72">
                    {verbs}
                  </p>
                </div>

                <hr className="mt-6 border-white/12" />

                <div className="mt-5 space-y-3">
                  {!isCustomUnified && (
                    <p className="font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
                      {showAlternativeView ? 'Visão aprofundada' : 'Texto oficial'}
                    </p>
                  )}
                  <p className="font-geist-mono text-sm leading-7 text-white/75 sm:text-[15px]">
                    {heroSubtitle}
                  </p>
                  <div className="space-y-2 font-geist-mono text-sm italic leading-7 text-white/88 sm:text-[15px]">
                    {heroPhrases.map((phrase, index) => <p key={index}>&quot;{phrase}&quot;</p>)}
                  </div>
                </div>

                {!isCustomUnified && (
                  <>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setAlternative(true)}
                        className={`${alternative ? 'border-red-700 bg-[#7a0000] text-white' : 'border-zinc-500/30 bg-black/70 text-white/75 hover:border-red-700 hover:text-white'} px-4 py-2 font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors`}
                      >
                        Visão aprofundada
                      </button>
                      <button
                        type="button"
                        onClick={() => setAlternative(false)}
                        className={`${!alternative ? 'border-red-700 bg-[#7a0000] text-white' : 'border-zinc-500/30 bg-black/70 text-white/75 hover:border-red-700 hover:text-white'} px-4 py-2 font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors`}
                      >
                        Texto oficial
                      </button>
                    </div>

                    <p className="mt-5 max-w-3xl font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
                      {showAlternativeView
                        ? 'Leia a interpretação aprofundada da tribo, com foco em ideologia, costumes e a leitura da comunidade sobre o papel dela no Apocalipse.'
                        : 'Consulte a descrição oficial da tribo, com seu conceito, identidade, espírito patrono e os arquétipos que a representam.'}
                    </p>
                  </>
                )}
              </div>

              <div className="relative flex min-h-[280px] items-center justify-center border border-zinc-500/30 bg-black/55 px-4 py-6">
                {isLoading && <span className="loader absolute z-10" />}
                <Image
                  src={`/images/trybes/${trybeNamePtBr} - wallpaper.jpg`}
                  alt={representationAlt}
                  className="relative z-0 h-auto max-h-[520px] w-full object-contain"
                  width={900}
                  height={900}
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            </div>
          </section>

          <section className="mt-6">
            <div className="space-y-4">
              {isCustomUnified ? (
                <>
                  {officialDescription.length > 0 && (
                    <SectionCard title="Definição">
                      <ParagraphBlock items={officialDescription} />
                    </SectionCard>
                  )}

                  {officialWhoAre.length > 0 && (
                    <SectionCard title={`Quem são os ${trybeNamePtBr}?`}>
                      <ParagraphBlock items={officialWhoAre} />
                    </SectionCard>
                  )}

                  <SectionCard title="Espírito padroeiro">
                    <p>{String(dataTrybe.patron)}</p>
                    <p>
                      <span className="text-white">Favor:</span> {String(dataTrybe.favor)}
                    </p>
                    <p>
                      <span className="text-white">Interdição:</span> {String(dataTrybe.ban)}
                    </p>
                  </SectionCard>

                  {alternativeDescription.length > 0 && (
                    <SectionCard title={String(dataTrybe.alternativeTitle || 'Visão aprofundada')}>
                      <ParagraphBlock items={alternativeDescription} />
                    </SectionCard>
                  )}

                  {alternativeIdeology.length > 0 && (
                    <SectionCard title="Ideologia">
                      <ParagraphBlock items={alternativeIdeology} />
                    </SectionCard>
                  )}

                  {alternativeCustoms.length > 0 && (
                    <SectionCard title="Costumes">
                      <ParagraphBlock items={alternativeCustoms} />
                    </SectionCard>
                  )}

                  <SectionCard title="Augúrios">
                    <AuguriesBlock dataTrybe={dataTrybe} />
                  </SectionCard>

                  <SectionCard title={`Arquétipos de ${trybeNamePtBr}`}>
                    <div className="space-y-5">
                      {dataTrybe.archetypes.map((archetype: IArchetypes, index: number) => (
                        <div key={index} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                          <h3 className="font-kingthings text-xl uppercase leading-none text-white sm:text-2xl">
                            {String(archetype.title)}
                          </h3>
                          <p className="mt-3">{String(archetype.description)}</p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </>
              ) : showAlternativeView ? (
                <>
                  <SectionCard title="Definição">
                    <ParagraphBlock items={alternativeDescription} />
                  </SectionCard>

                  <SectionCard title="Ideologia">
                    <ParagraphBlock items={alternativeIdeology} />
                  </SectionCard>

                  <SectionCard title="Costumes">
                    <ParagraphBlock items={alternativeCustoms} />
                  </SectionCard>

                  <SectionCard title="Augúrios">
                    <AuguriesBlock dataTrybe={dataTrybe} />
                  </SectionCard>
                </>
              ) : (
                <>
                  <SectionCard title="Definição">
                    <ParagraphBlock items={officialDescription} />
                  </SectionCard>

                  <SectionCard title={`Quem são os ${trybeNamePtBr}?`}>
                    <ParagraphBlock items={officialWhoAre} />
                  </SectionCard>

                  <SectionCard title="Espírito padroeiro">
                    <p>{String(dataTrybe.patron)}</p>
                    <p>
                      <span className="text-white">Favor:</span> {String(dataTrybe.favor)}
                    </p>
                    <p>
                      <span className="text-white">Interdição:</span> {String(dataTrybe.ban)}
                    </p>
                  </SectionCard>

                  <SectionCard title={`Arquétipos de ${trybeNamePtBr}`}>
                    <div className="space-y-5">
                      {dataTrybe.archetypes.map((archetype: IArchetypes, index: number) => (
                        <div key={index} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                          <h3 className="font-kingthings text-xl uppercase leading-none text-white sm:text-2xl">
                            {String(archetype.title)}
                          </h3>
                          <p className="mt-3">{String(archetype.description)}</p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}



