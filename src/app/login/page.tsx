'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { FaBackward } from 'react-icons/fa6';
import { authenticate, signIn } from '@/firebase/authenticate';
import contexto from '@/context/context';
import ForgotPassword from '@/components/popup/forgotPassword';
import Loading from '@/components/loading';
import MessageToUser from '@/components/dicesAndMessages/messageToUser';
import Nav from '@/components/nav';

function App() {
  const [showData, setShowData] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    dataUser, setDataUser,
    showForgotPassword, setShowForgotPassword,
    resetPopups, setShowMessage,
    showMessage,
  } = useContext(contexto);

  useEffect(() => {
    resetPopups();
    const authUser = async () => {
      if (dataUser.email !== '' && dataUser.displayName !== '') {
        router.push('/sessions');
      } else {
        const auth = await authenticate(setShowMessage);
        if (auth && auth.email && auth.displayName) {
          setDataUser({ email: auth.email, displayName: auth.displayName });
          router.push('/sessions');
        } else setShowData(true);
      }
    };
    authUser();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const validate = /\S+@\S+\.\S+/;
    const vEmail = !email || !validate.test(email) || email === '';
    if (vEmail) {
      setShowMessage({ show: true, text: 'Necessário preencher um Email válido' });
      setLoading(false);
    } else if (!password || password.length < 6) {
      setShowMessage({ show: true, text: 'Necessário inserir uma Senha com pelo menos 6 dí­gitos' });
      setLoading(false);
    } else {
      const log = await signIn(email, password);
      if (log) {
        const auth = await authenticate(setShowMessage);
        if (auth && auth.email && auth.displayName) {
          setDataUser({ email: auth.email, displayName: auth.displayName });
          router.push('/sessions');
        }
      } else {
        setShowMessage({ show: true, text: 'Não foi possí­vel realizar o login. Por favor, verifique suas credenciais e tente novamente.' });
        setLoading(false);
      }
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const buttonSend = document.getElementById('sendMessage');
      if (buttonSend) buttonSend.click();
    }
  };

  const inputClassName = 'w-full border border-zinc-500/40 bg-black/70 px-4 py-3 font-geist-mono text-xs text-white outline-none transition-colors placeholder:text-white/30 focus:border-red-700/80';
  const labelClassName = 'font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/70';

  return(
    <section className="bg-ritual bg-cover bg-center bg-fixed min-h-screen w-full">
      {showMessage.show && <MessageToUser />}
      <div className="flex min-h-screen items-center justify-center bg-black/90 px-4 py-8 sm:px-6">
        {
          !showData
            ? <Loading />
            : <div className="relative w-full max-w-2xl overflow-hidden border border-zinc-500/40 bg-zinc-950/85 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                <Nav />
                <div className="absolute inset-0 bg-cover bg-center" />
                <div className="relative z-10 px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 w-full">
                  <div className="w-full flex items-center justify-center">
                    <Image
                      src="/images/logos/segredos-da-fúria.png"
                      alt="Segredos da Fúria"
                      width={420}
                      height={180}
                      priority
                      className="h-auto w-full max-w-[220px] object-contain sm:max-w-[280px]"
                    />
                  </div>

                  <div className="mt-6 grid gap-4">
                    <label className="flex flex-col gap-2">
                      <span className={labelClassName}>Email</span>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClassName}
                        placeholder="name@company.com"
                      />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className={labelClassName}>Senha</span>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        className={inputClassName}
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex items-center justify-end">
                    <button
                      onClick={() => setShowForgotPassword(true)}
                      className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-red-400"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={handleLogin}
                      id="sendMessage"
                      disabled={loading}
                      className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900 disabled:cursor-not-allowed disabled:bg-red-950/60"
                    >
                      {loading ? 'Verificando...' : 'Entrar'}
                    </button>

                    <Link
                      href="/register"
                      className="text-center font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-red-400"
                    >
                      Nao tem uma conta? Cadastrar
                    </Link>
                  </div>

                  {loading && (
                    <div className="mt-6 flex justify-center border-t border-white/10 pt-5">
                      <Loading />
                    </div>
                  )}
                </div>
                {showForgotPassword && <ForgotPassword />}
              </div>
        }
      </div>
    </section>
  );
}

export default App;
