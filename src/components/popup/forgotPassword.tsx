'use client'
import { useContext, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import contexto from '@/context/context';
import { forgotPassword } from '@/firebase/authenticate';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const context = useContext(contexto);
  const { setShowForgotPassword, setShowMessage } = context;

  const closePopup = () => setShowForgotPassword(false);

  const forgotUserPassword = async () => {
    const validate = /\S+@\S+\.\S+/;
    const vEmail = !email || !validate.test(email) || email === '';
    if (vEmail) {
      setShowMessage({ show: true, text: 'Por favor, forneça um e-mail válido.' });
    } else {
      setLoading(true);
      await forgotPassword(email, setShowMessage);
      setShowForgotPassword(false);
      setLoading(false);
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
          aria-label="Fechar recuperacao de senha"
        >
          <AiFillCloseCircle />
        </button>

        <div className="relative z-10 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <h2 className="mt-2 font-kingthings text-2xl sm:text-3xl">Esqueceu a Senha?</h2>
          <p className="mt-2 max-w-xl font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
            Informe o e-mail da sua conta para receber o link de redefinição de senha.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-4 px-5 pb-5 sm:px-8 sm:pb-8">
          <label className="flex flex-col gap-2">
            <span className="font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
              E-mail
            </span>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="name@company.com"
              className="border border-zinc-500/40 bg-black/70 px-4 py-3 font-geist-mono text-xs text-white outline-none transition-colors placeholder:text-white/30 focus:border-red-700/80"
              onChange={(e: any) => setEmail(e.target.value)}
            />
          </label>

          <button
            type="button"
            onClick={forgotUserPassword}
            disabled={loading}
            className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900 disabled:cursor-not-allowed disabled:bg-red-950/60"
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
}
