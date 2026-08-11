'use client';

import { useContext, useEffect } from 'react';
import Image from 'next/image';
import { BsFacebook, BsInstagram, BsSpotify, BsYoutube } from 'react-icons/bs';
import Footer from '@/components/footer';
import Nav from '@/components/nav';
import Simplify from '@/components/simplify';
import contexto from '@/context/context';

const socialLinks = [
  {
    href: 'https://www.instagram.com/garounordeste/',
    label: 'Instagram',
    icon: BsInstagram,
  },
  {
    href: 'https://open.spotify.com/show/7kal4LDO3ptHc3sG64btYI',
    label: 'Spotify',
    icon: BsSpotify,
  },
  {
    href: 'https://www.facebook.com/garounordeste',
    label: 'Facebook',
    icon: BsFacebook,
  },
  {
    href: 'https://www.youtube.com/c/GarouNordeste',
    label: 'YouTube',
    icon: BsYoutube,
  },
];

const contactLinks: { title: string; value: string; href?: string }[] = [
  {
    title: 'Criador, revisor e tradutor',
    value: 'Bruno Gabryell Cabral da Silva',
  },
  {
    title: 'Contato / Whatsapp',
    value: '+55 83 9 9836 4408',
  },
  {
    title: 'E-mail',
    value: 'bruno.cabral.silva2018@gmail.com',
  },
  {
    title: 'Github',
    value: 'github.com/brunoCabralSilva',
    href: 'https://github.com/brunoCabralSilva',
  },
  {
    title: 'Portfólio',
    value: 'bruno-cabral-portfolio.vercel.app/',
    href: 'https://bruno-cabral-portfolio.vercel.app/',
  },
];

export default function About() {
  const { resetPopups, simplify } = useContext(contexto);

  useEffect(() => {
    resetPopups();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={`relative min-h-screen w-full ${simplify ? 'bg-black' : 'bg-ritual'} bg-cover bg-top`}>
      <Simplify />
      <Nav />
      <div className="h-full w-full bg-black/90">
        <section className="relative z-10 mx-auto w-full max-w-[1200px] px-4 pb-10 pt-4 sm:px-8 sm:pb-14">
          <div className="overflow-hidden bg-black/80 text-white">
            <div className="relative px-5 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-10">
              <h1 className="font-kingthings text-3xl text-white sm:text-4xl lg:text-5xl">Quem Somos</h1>
            </div>

            <div className="px-5 pb-8 sm:px-8">
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="inline-flex h-11 w-11 items-center justify-center border border-red-950 bg-red-950 text-base text-white transition-colors hover:bg-red-900"
                  >
                    <Icon />
                  </a>
                ))}
              </div>

              <div className="mt-8 space-y-6 border-t border-white/10 pt-8 text-justify font-geist-mono text-[11px] leading-7 text-white/78 sm:text-xs">
                <p>
                  O Garou Nordeste é um projeto visionário que busca mergulhar nas riquezas culturais e místicas do Nordeste do Brasil, transportando essa riqueza para o emocionante cenário de &quot;Lobisomem: O Apocalipse&quot;, inserido no universo do sistema WoD (Mundo das Trevas).
                </p>
                <p>
                  A semente desse projeto foi plantada nas mentes de três apaixonados: Bruno Gabryell, Felipe Brito e Jocélio Procópio, que, unidos sob o estandarte da &quot;Taverna Literária&quot;, decidiram embarcar em uma jornada única. Eles almejavam criar algo que destacasse o Nordeste e a cultura dos Garou, mostrando ao Brasil inteiro que nossa região é muito mais do que os estereótipos de seca e carência.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="relative overflow-hidden border border-zinc-500/30 bg-black/60">
                  <Image
                    src="/images/modelo01.jpeg"
                    alt="Modelo branco da camisa do Garou Nordeste"
                    className="h-full w-full object-cover"
                    width={1200}
                    height={800}
                  />
                </div>
                <div className="relative overflow-hidden border border-zinc-500/30 bg-black/60">
                  <Image
                    src="/images/modelo02.jpeg"
                    alt="Modelo preto da camisa do Garou Nordeste"
                    className="h-full w-full object-cover"
                    width={1200}
                    height={800}
                  />
                </div>
              </div>

              <p className="mt-3 text-center font-geist-mono text-[11px] leading-6 text-white/72 sm:text-xs">
                Imagens criadas por{' '}
                <a
                  href="https://www.instagram.com/cesarbard/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white underline transition-colors hover:text-red-400"
                >
                  @cesarbard
                </a>
              </p>

              <div className="mt-8 space-y-6 border-t border-white/10 pt-8 text-justify font-geist-mono text-[11px] leading-7 text-white/78 sm:text-xs">
                <p>
                  O Garou Nordeste é um tributo à diversidade e à espiritualidade profundamente enraizada no coração do Nordeste. É uma celebração da força da natureza, da resiliência de seu povo e da riqueza de suas tradições. Neste projeto, os jogadores de &quot;Lobisomem: O Apocalipse&quot; serão levados a uma jornada única, onde os mistérios da região se mesclam com a mitologia dos Garou de uma forma que cativa, educa e inspira.
                </p>
                <p>
                  Nós convidamos você a se juntar a nós nessa aventura emocionante, à medida que desvendamos os segredos do Nordeste, trazendo à tona a magia e o poder dos Garou em uma narrativa que ecoa com a alma vibrante dessa região fascinante. Juntos, vamos descobrir um Brasil que é rico em diversidade e cultura, repleto de histórias esperando para serem contadas. Bem-vindo ao Garou Nordeste, onde a jornada é tão grandiosa quanto o destino!
                </p>
              </div>

              <div className="mt-8 grid gap-4 border-t border-white/10 pt-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
                <div className="flex justify-center border border-zinc-500/30 bg-black/60 px-4 py-6">
                  <Image
                    src="/images/garou-Nordeste - icone.png"
                    alt="Logo do Garou Nordeste"
                    className="w-full max-w-[260px] object-contain"
                    width={1200}
                    height={800}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {contactLinks.map((item) => (
                    <div key={item.title} className="border border-zinc-500/30 bg-black/60 p-5">
                      <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/60">{item.title}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 block break-words font-geist-mono text-[11px] leading-6 text-white underline transition-colors hover:text-red-400 sm:text-xs"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-3 break-words font-geist-mono text-[11px] leading-6 text-white sm:text-xs">
                          {item.value}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

