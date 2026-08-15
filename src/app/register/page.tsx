'use client'
import Image from 'next/image';
import { registerUser } from '@/firebase/user';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBackward } from 'react-icons/fa6';
import Loading from '@/components/loading';
import contexto from '@/context/context';
import { authenticate } from '@/firebase/authenticate';
import MessageToUser from '@/components/dicesAndMessages/messageToUser';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setDataUser, resetPopups, setShowMessage, showMessage } = useContext(contexto);

  useEffect(() => resetPopups(), []);

  const handleRegisterDev = async () => {
    const validate = /\S+@\S+\.\S+/;
    const vEmail = !email || !validate.test(email) || email === '';
    if (firstName.length < 2 ) {
      setShowMessage({ show: true, text: 'Necessário preencher um Nome com mais de 2 caracteres' });
    } else if (lastName.length < 2) {
      setShowMessage({ show: true, text: 'Necessário preencher um Sobrenome com mais de 2 caracteres' });
    } else if(vEmail) {
      setShowMessage({ show: true, text: 'Necessário preencher um Email válido' });
    } else if (!password || password.length < 6) {
      setShowMessage({ show: true, text: 'Necessário inserir uma Senha com pelo menos 6 dígitos' });
    } else if (password !== password2) {
      setShowMessage({ show: true, text: 'As senhas inseridas não conferem' });
    } else {
      setLoading(true);
      const reg = await registerUser(
        email,
        password,
        firstName,
        lastName,
        setShowMessage,
      );
      if (reg) {
        const data = await authenticate(setShowMessage);
        if (data) {
          setDataUser({ email: data.email, displayName: data.displayName });
        }
        router.push('/sessions');
      }
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setPassword2('');
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  const inputClassName = 'w-full border border-zinc-500/40 bg-black/70 px-4 py-3 font-geist-mono text-xs text-white outline-none transition-colors placeholder:text-white/30 focus:border-red-700/80';
  const labelClassName = 'font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/70';

  return(
    <section className="bg-ritual bg-cover bg-center bg-fixed min-h-screen w-full ">
      {showMessage.show && <MessageToUser />}
      <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 bg-black/90">
        <div className="relative w-full max-w-2xl overflow-hidden border border-zinc-500/40 bg-zinc-950/85 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <div
            className="absolute inset-0 bg-cover bg-center"
          />
          <div className="relative z-10 px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 w-full">
            <div className="w-full flex flex-col-reverse sm:flex-row sm:items-start sm:justify-between">
              <Image
                src="/images/logos/segredos-da-fúria.png"
                alt="Segredos da Fúria"
                width={420}
                height={180}
                priority
                className="h-auto w-full max-w-[220px] object-contain sm:max-w-[280px]"
              />
              <div className="flex w-full items-center justify-end mb-3">
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-zinc-500/40 bg-black/70 text-lg text-white/75 transition-colors hover:border-red-700/80 hover:text-white"
                  aria-label="Voltar para login"
                >
                  <FaBackward />
                </button>
              </div>
            </div>
            <p className="mt-2 max-w-xl font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
              Cadastre seu perfil para acessar fichas, sessões e outras ferramentas do site.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 sm:col-span-1">
                <span className={labelClassName}>Nome</span>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value.toLowerCase())}
                  className={inputClassName}
                  placeholder="Insira seu primeiro nome"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-1">
                <span className={labelClassName}>Sobrenome</span>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value.toLowerCase())}
                  className={inputClassName}
                  placeholder="Insira seu último nome"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className={labelClassName}>Email</span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  className={inputClassName}
                  placeholder="name@company.com"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-1">
                <span className={labelClassName}>Senha</span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClassName}
                  placeholder="••••••"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-1">
                <span className={labelClassName}>Repita a senha</span>
                <input
                  type="password"
                  id="repeat-password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className={inputClassName}
                  placeholder="••••••"
                  required
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleRegisterDev}
                disabled={loading}
                className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900 disabled:cursor-not-allowed disabled:bg-red-950/60"
              >
                {loading ? 'Registrando, por favor aguarde' : 'Registrar'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-red-400"
              >
                Ja possui uma conta? Entrar
              </button>
            </div>

            {loading && (
              <div className="mt-6 flex justify-center border-t border-white/10 pt-5">
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
