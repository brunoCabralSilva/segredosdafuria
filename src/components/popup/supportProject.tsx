'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { copyToClipboard } from '@/utils/copyToClipboard';

const pixKey = 'garounordeste@gmail.com';

type SupportProjectProps = {
  onClose: () => void;
};

export default function SupportProject({ onClose }: SupportProjectProps) {
  const [copyMessage, setCopyMessage] = useState('');

  const handleCopyPixKey = async () => {
    try {
      await copyToClipboard(pixKey);
      setCopyMessage('Chave PIX copiada com sucesso!');
    } catch (error) {
      setCopyMessage(`Nao foi possivel copiar automaticamente. Chave PIX: ${pixKey}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6">
      <div className="relative flex w-full max-w-3xl flex-col overflow-hidden border border-zinc-500/40 bg-zinc-950/85">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/wallpapers/128.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/90" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 text-2xl text-white/70 transition-colors hover:text-red-400"
          aria-label="Fechar apoio"
        >
          <AiFillCloseCircle />
        </button>

        <div className="relative z-10 grid items-center gap-6 px-5 pb-5 pt-6 sm:px-8 sm:pb-8 sm:pt-8 md:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <h2 className="mt-2 font-kingthings text-2xl sm:text-3xl">Apoie o projeto</h2>
            <p className="mt-3 max-w-xl font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
              Tudo aqui é feito por amor ao RPG. Se esse projeto ajuda a sua mesa ou a sua criação de fichas, qualquer apoio é muito bem-vindo para a gente continuar mantendo esse espaço vivo!
            </p>
            <p className="mt-4 font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/65">
              Chave PIX: {pixKey}
            </p>

            <button
              type="button"
              onClick={() => void handleCopyPixKey()}
              className="mt-4 inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
            >
              Copiar chave PIX
            </button>

            {copyMessage && (
              <p className="mt-4 border border-white/10 bg-black/45 px-4 py-3 font-geist-mono text-xs leading-5 text-white/80">
                {copyMessage}
              </p>
            )}
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
    </div>
  );
}
