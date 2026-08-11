'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import Feedback from '@/components/feedback';
import contexto from '@/context/context';
import SupportProject from '@/components/popup/supportProject';

export default function Footer() {
  const { showFeedback, setShowFeedback } = useContext(contexto);
  const [showSupportProject, setShowSupportProject] = useState(false);

  return (
    <footer className="relative z-5 flex w-full flex-col items-center justify-between bg-black py-2 text-white">
      <hr className="my-5 flex h-0.5 w-full bg-gray-400" />

      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex flex-col items-center gap-10 px-6 py-10 text-center sm:px-10 sm:py-12 md:flex-row md:flex-wrap md:items-start md:justify-start md:gap-x-16 md:gap-y-10 md:text-left lg:flex-nowrap lg:gap-x-20">
          <div className="flex w-[220px] shrink-0 flex-col items-center justify-start text-center md:items-start md:text-left">
            <Image
              src="/images/logos/segredos-da-fúria.png"
              alt="Logo do Garou Nordeste"
              width={1000}
              height={800}
              className="w-24 sm:w-28"
            />
            <p className="max-w-[140px] py-5 font-geist-mono text-xs leading-6 text-gray-400">
              Busque informações e crie sessões e fichas para Lobisomem: O Apocalipse 5ed.
            </p>
            <Link
              href="/about"
              className="cursor-pointer font-geist-mono text-xs text-gray-200 underline hover:text-red-400"
            >
              DESENVOLVIDO PELO GAROU NORDESTE
            </Link>
          </div>

          <div className="flex flex-col items-center justify-start text-center md:items-start md:text-left">
            <p className="pb-5 font-geist-mono text-xs font-bold text-gray-300">PÁGINAS</p>
            <div className="flex flex-col gap-1">
              <Link href="/auspices" className="font-geist-mono text-xs text-gray-400 hover:text-red-400">
                AUGÚRIOS
              </Link>
              <Link href="/sheets" className="font-geist-mono text-xs text-gray-400 hover:text-red-400">
                CRIAÇÃO DE FICHAS
              </Link>
              <Link href="/gifts" className="font-geist-mono text-xs text-gray-400 hover:text-red-400">
                DONS
              </Link>
              <Link href="/trybes" className="font-geist-mono text-xs text-gray-400 hover:text-red-400">
                TRIBOS
              </Link>
              <Link href="/forms" className="font-geist-mono text-xs text-gray-400 hover:text-red-400">
                FORMAS
              </Link>
              <Link href="/advantagesAndFlaws" className="font-geist-mono text-xs text-gray-400 hover:text-red-400">
                VANTAGENS E DEFEITOS
              </Link>
              <Link href="/talismans" className="font-geist-mono text-xs text-gray-400 hover:text-red-400">
                TALISMÃS
              </Link>
              <Link href="/loresheets" className="font-geist-mono text-xs text-gray-400 hover:text-red-400">
                FICHAS DE CONHECIMENTO
              </Link>
              <Link href="/sessions" className="font-geist-mono text-xs text-gray-400 hover:text-red-400">
                SESSÕES
              </Link>
              <Link href="/profile" className="font-geist-mono text-xs text-gray-400 hover:text-red-400">
                PERFIL
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center justify-start text-center md:items-start md:text-left">
            <p className="pb-5 font-geist-mono text-xs font-bold text-gray-300">COMUNIDADE</p>
            <button
              type="button"
              onClick={() => setShowFeedback(true)}
              className="font-geist-mono text-xs text-gray-400 hover:text-red-400"
            >
              ENVIAR UM FEEDBACK
            </button>
            <button
              type="button"
              onClick={() => setShowSupportProject(true)}
              className="mt-1 font-geist-mono text-xs text-gray-400 hover:text-red-400"
            >
              APOIE-NOS
            </button>
          </div>

          <div className="flex flex-col items-center justify-start text-center md:items-start md:text-left">
            <p className="pb-5 font-geist-mono text-xs font-bold text-gray-300">SOCIAL</p>
            <Link
              href="https://www.instagram.com/garounordeste/"
              target="_blank"
              rel="noreferrer"
              className="font-geist-mono text-xs text-gray-400 hover:text-red-400"
            >
              INSTAGRAM
            </Link>
            <Link
              href="https://www.youtube.com/@GarouNordeste"
              target="_blank"
              rel="noreferrer"
              className="mt-1 font-geist-mono text-xs text-gray-400 hover:text-red-400"
            >
              YOUTUBE
            </Link>
            <Link
              href="https://open.spotify.com/show/7kal4LDO3ptHc3sG64btYI?si=51e28a7ee65f4558"
              target="_blank"
              rel="noreferrer"
              className="mt-1 font-geist-mono text-xs text-gray-400 hover:text-red-400"
            >
              SPOTIFY
            </Link>
            <Link
              href="https://discord.gg/xYwmA6zz4f"
              target="_blank"
              rel="noreferrer"
              className="mt-1 font-geist-mono text-xs text-gray-400 hover:text-red-400"
            >
              DISCORD
            </Link>
          </div>
        </div>
      </div>

      <hr className="my-5 w-full bg-gray-400" />

      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex w-full flex-col items-center px-4 pb-8 text-center font-geist-mono text-xs leading-6 text-gray-400 sm:px-6 sm:pb-10">
          <Image
            src="/images/logos/dark-pack.png"
            alt="Dark Pack"
            width={1000}
            height={800}
            className="w-20 pb-4 sm:w-24"
          />
          <p className="w-full pb-3">Projeto de fã não oficial • © Todos os direitos reservados.</p>
          <p className="w-full max-w-4xl pb-3">
            Partes deste material pertencem aos seus respectivos detentores. Para mais informações, visite{' '}
            <a
              href="http://www.white-wolf.com/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-200 underline hover:text-red-400"
            >
              white-wolf.com
            </a>
            .
          </p>
          <p className="w-full max-w-4xl pb-3">
            Este contéudo não é oficial e foi criado por fãs seguindo as diretrizes da comunidade{' '}
            <a
              href="https://www.paradoxinteractive.com/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-200 underline hover:text-red-400"
            >
              neste link
            </a>{' '}
            para mais detalhes.
          </p>
        </div>
      </div>

      {showFeedback && <Feedback />}
      {showSupportProject && <SupportProject onClose={() => setShowSupportProject(false)} />}
    </footer>
  );
}
