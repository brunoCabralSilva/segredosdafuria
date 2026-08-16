'use client'

import { updateBannerSession } from "@/firebase/sessions";
import contexto from '@/context/context';
import Image from 'next/image';
import { useContext, useMemo, useState } from "react";
import { AiFillCloseCircle } from 'react-icons/ai';

export default function EditBannerSession() {
  const [image, setImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { showBannerSession, setShowBannerSession, setShowMessage } = useContext(contexto);

  const banners = useMemo(
    () => Array.from({ length: 33 }, (_, index) => String(index + 1).padStart(2, '0')),
    [],
  );

  const closePopup = () => {
    setShowBannerSession({ show: false, sessionId: '' });
  };

  const updtSession = async () => {
    if (image === '') {
      setShowMessage({ show: true, text: 'Necessário selecionar uma imagem para a sua sessão' });
      return;
    }

    setLoading(true);
    await updateBannerSession(
      showBannerSession.sessionId,
      image,
      setShowMessage,
    );
    setLoading(false);
    closePopup();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6">
      <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden border border-zinc-500/40 bg-zinc-950/85">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/wallpapers/128.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/90" />

        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 z-20 text-2xl text-white/70 transition-colors hover:text-red-400"
          aria-label="Fechar edição de banner"
        >
          <AiFillCloseCircle />
        </button>

        <div className="relative z-10 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <h2 className="mt-2 font-kingthings text-2xl sm:text-3xl">Editar Banner Da Sessão</h2>
          <p className="mt-2 max-w-3xl font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
            Escolha uma arte para representar a sessão. A imagem selecionada será usada como banner principal nos detalhes da mesa.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-5 px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="flex items-center justify-between gap-3 border border-zinc-500/30 bg-black/45 px-4 py-3 font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
            <span>Banners disponíveis: {banners.length}</span>
            <span>{image === '' ? 'Nenhum banner selecionado' : `Banner ${image} selecionado`}</span>
          </div>

          <div className="principles-scrollbar max-h-[52vh] overflow-y-auto overflow-x-hidden border border-zinc-500/30 bg-black/45 p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {banners.map((banner) => {
                const isSelected = banner === image;

                return (
                  <button
                    key={banner}
                    type="button"
                    onClick={() => setImage(banner)}
                    className={`group relative overflow-hidden border text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-red-700 bg-black/60 shadow-[0_0_0_1px_rgba(185,28,28,0.45)]'
                        : 'border-zinc-700/50 bg-black/35 hover:border-zinc-500/70'
                    }`}
                  >
                    <Image
                      src={`/images/sessions/${banner}.png`}
                      alt={`Banner da sessão ${banner}`}
                      className={`h-36 w-full object-cover object-center transition-all duration-200 sm:h-40 ${
                        isSelected
                          ? 'scale-[1.02] opacity-100'
                          : 'opacity-75 group-hover:opacity-95'
                      }`}
                      width={1000}
                      height={1000}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black via-black/80 to-transparent px-3 py-2 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white">
                      <span>Banner {banner}</span>
                      <span className={isSelected ? 'text-red-300' : 'text-white/60'}>
                        {isSelected ? 'Selecionado' : 'Selecionar'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closePopup}
              className="inline-flex items-center justify-center border border-zinc-500/40 bg-black/60 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:border-white/40 hover:bg-black/80"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={updtSession}
              className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Atualizando Imagem...' : 'Atualizar Imagem'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

