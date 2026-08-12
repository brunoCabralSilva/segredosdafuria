'use client';

import { useContext, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/footer';
import listForms from '../../data/forms.json';
import contexto from '@/context/context';
import Nav from '@/components/nav';
import Simplify from '@/components/simplify';
import { IForm } from '../../interface';

type FormListItem = IForm & {
  list?: string[];
};

const introParagraphs = [
  'Um Garou nasce de humano ou lobo, mas desperta para muito mais do que uma única pele. Depois da Primeira Transformação, ele aprende a atravessar diferentes formas, cada uma com vantagens, limitações e impactos sociais muito próprios.',
  'Mudar de forma não é só uma decisão mecânica. Entre os Garou, cada corpo comunica intenção, poder, ameaça, deferência ou urgência. Saber quando assumir cada forma é tão importante quanto dominar seus efeitos em cena.',
];

const formOrder = ['Hominídeo', 'Glabro', 'Crinos', 'Hispo', 'Lupino'];

const sortedForms = [...(listForms as FormListItem[])].sort(
  (a, b) => formOrder.indexOf(String(a.name)) - formOrder.indexOf(String(b.name))
);

const toFormSlug = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function Forms() {
  const { resetPopups, simplify } = useContext(contexto);

  useEffect(() => {
    resetPopups();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`relative min-h-screen w-full ${simplify ? 'bg-black' : 'bg-ritual'} bg-cover bg-top`}>
      <div className="w-full h-full bg-black/80">
        <Simplify />
        <div className="absolute inset-0 bg-black/85" />
        <Nav />
        <main className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col px-4 pb-10 pt-4 sm:px-8 sm:pb-14">
          <section className="relative overflow-hidden text-white text-justify">
            <div className="relative px-5 pb-8 sm:px-8">
              <div className="grid gap-8">
                <div>
                  <h1 className="font-kingthings text-3xl sm:text-4xl lg:text-5xl">Formas</h1>
                  <hr className="mt-5" />
                  <p className="mt-4 w-full font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px] text-justify">
                    Conheça as formas que um Garou pode assumir, seus custos, limites e o impacto que cada corpo provoca no mundo.
                  </p>

                  <div className="mt-6 space-y-4 text-justify text-sm leading-7 text-white/82 sm:text-[15px]">
                    {introParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                {sortedForms.map((form) => {
                  const formName = String(form.name);
                  const listItems = Array.isArray(form.list) ? form.list : [];

                  return (
                    <Link
                      key={formName}
                      href={`/forms/${toFormSlug(formName)}`}
                      className="group relative overflow-hidden border border-gray-900 bg-black/75 p-5 text-white text-justify transition-colors cursor-default sm:p-6"
                    >
                      <div className="relative z-10 flex h-full flex-col text-justify">
                        <div className="flex items-center gap-4">
                          <Image
                            src={`/images/forms/${formName}-white.png`}
                            alt={`Glifo da forma ${formName}`}
                            className="h-16 w-20 shrink-0 object-contain transition-all duration-300 group-hover:scale-105 sm:h-20 sm:w-24"
                            width={200}
                            height={200}
                          />
                          <div>
                            <h3 className="font-kingthings text-2xl transition-colors group-hover:text-red-500">
                              {formName}
                            </h3>
                            <p className="mt-2 font-geist-mono text-xs italic leading-6 text-white/60">
                              {String(form.subtitle)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 space-y-4 border-t border-white/10 pt-4">
                          <p className="font-geist-mono text-[11px] leading-6 text-white/68 sm:text-xs">
                            {String(form.description)}
                          </p>

                          <p className="font-geist-mono text-[11px] leading-6 text-white/68 sm:text-xs">
                            <span className="text-white/88">Custo:</span> {String(form.cost)}
                          </p>

                          <p className="font-geist-mono text-[11px] leading-6 text-white/68 sm:text-xs">
                            <span className="text-white/88">Habilidades e limitações:</span> {String(form.skills)}
                          </p>

                          {listItems.length > 0 && (
                            <div className="space-y-2 border-t border-white/10 pt-4">
                              {listItems.map((item, index) => (
                                <p
                                  key={`${formName}-${index}`}
                                  className="font-geist-mono text-[11px] leading-6 text-white/68 sm:text-xs"
                                >
                                  - {item}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

