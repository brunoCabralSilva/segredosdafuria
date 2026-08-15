'use client'
import contexto from '@/context/context';
import { registerHistory } from '@/firebase/history';
import { deleteDataPlayer } from '@/firebase/players';
import { capitalizeFirstLetter, playerSheet, sheetStructure } from '@/firebase/utilities';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

export default function DeleteSheet(props: { isGameMaster: any }) {
  const { isGameMaster } = props;
  const router = useRouter();
  const pathname = usePathname();
  const {
    sheetId,
    session,
    email,
    dataSheet,
    setSheetId,
    setDataSheet,
    setShowMessage,
    setShowDeleteSheet,
    setShowMenuSession,
    setOptionSelect,
  } = useContext(contexto);

  const closePopup = () => setShowDeleteSheet(false);

  const deleteSheet = async () => {
    try {
      setDataSheet({ ...dataSheet, data: playerSheet });
      await deleteDataPlayer(sheetId, session.id, dataSheet.data.profileImage, setShowMessage);
      setShowDeleteSheet(false);
      setSheetId('');
      setDataSheet(sheetStructure('', '', ''));
      setShowMenuSession('');
      await registerHistory(
        session.id,
        {
          message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} excluiu a Ficha do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''}.`,
          type: 'notification',
        },
        null,
        setShowMessage,
      );
      if (isGameMaster) setOptionSelect('players');
      if (pathname?.startsWith('/sheets/')) {
        router.back();
      }
    } catch (error) {
      setShowMessage({ show: true, text: 'Ocorreu um erro: ' + error });
      setShowDeleteSheet(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6">
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden border border-zinc-500/40 bg-zinc-950/85">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/wallpapers/128.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/90" />

        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 z-20 text-2xl text-white/70 transition-colors hover:text-red-400"
          aria-label="Fechar exclusão de ficha"
        >
          <AiFillCloseCircle />
        </button>

        <div className="text-left relative z-10 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <h2 className="mt-2 font-kingthings text-2xl sm:text-3xl">Excluir Ficha</h2>
          <p className="mt-2 font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
            Tem certeza de que quer apagar esta ficha do banco de dados? Absolutamente tudo o que foi registrado nela será apagado, e ela deixará de existir na lista de personagens
          </p>
        </div>

        <div className="relative z-10 flex gap-3 px-5 pb-5 sm:px-8 sm:pb-8">
          <button
            type="button"
            onClick={closePopup}
            className="inline-flex flex-1 items-center justify-center border border-zinc-600/50 bg-black/70 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:border-zinc-400/70"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={deleteSheet}
            className="inline-flex flex-1 items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
