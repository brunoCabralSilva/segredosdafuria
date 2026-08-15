'use client'
import contexto from '@/context/context';
import { signOutFirebase } from '@/firebase/authenticate';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

export default function Logout() {
  const router = useRouter();
  const { setShowMenuSession, setLogoutUser, setShowMessage } = useContext(contexto);

  const closePopup = () => {
    setLogoutUser(false);
    setShowMenuSession('');
  };

  const logout = async () => {
    signOutFirebase(setShowMessage);
    setLogoutUser(false);
    setShowMenuSession('');
    router.push('/');
    location.reload();
  };

  return(
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
          aria-label="Fechar logout"
        >
          <AiFillCloseCircle />
        </button>

        <div className="relative z-10 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <h2 className="mt-2 font-kingthings text-2xl sm:text-3xl">Logout</h2>
          <p className="mt-2 max-w-xl font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
            Tem certeza de que deseja deslogar? Assim, você tera acesso limitado aos Segredos da Fúria.
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
            onClick={logout}
            className="inline-flex flex-1 items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
