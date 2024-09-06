'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { authenticate, signIn } from "@/new/firebase/authenticate";
import Nav from "@/components/nav";
import contexto from "@/context/context";
import Loading from "../../../new/components/loading";
import ForgotPassword from "@/new/components/popup/forgotPassword";

function App() {
  const [showData, setShowData] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    dataUser, setDataUser,
    showForgotPassword, setShowForgotPassword,
  } = useContext(contexto);

  useEffect(() => {
    const authUser = async () => {
      if (dataUser.email !== '' && dataUser.displayName !== '') {
        router.push("/new/sessions");
      } else {
        const auth = await authenticate();
        if(auth && auth.email && auth.displayName) {
          setDataUser({ email: auth.email, displayName: auth.displayName });
          router.push("/new/sessions");
        } else setShowData(true);
      }
    };
    authUser();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const validate = /\S+@\S+\.\S+/;
    const vEmail = !email || !validate.test(email) || email === '';
    if(vEmail) {
      window.alert('Necessário preencher um Email válido');
      setLoading(false);
    } else if (!password || password.length < 6) {
      window.alert('Necessário inserir uma Senha com pelo menos 6 dígitos');
      setLoading(false);
    } else {
      const log = await signIn(email, password);
      if (log) {
        const auth = await authenticate();
        if(auth && auth.email && auth.displayName) {
          setDataUser({ email: auth.email, displayName: auth.displayName });
          router.push("/new/sessions");
        }
      }
      else {
        window.alert('Não foi possível realizar o login. Por favor, verifique suas credenciais e tente novamente.');
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
  
  return(
    <section className="bg-ritual bg-cover break-words bg-dice bg-center h-screen w-full items-center justify-center">
      <Nav />
      <div className="break-words flex flex-col items-center justify-center sm:px-6 py-8 mx-auto h-full lg:py-0 bg-black/80">
        {
          !showData 
            ? <Loading />            
            : <div className="break-words p-1 bg-prot-light w-full rounded-lg shadow dark:border sm:max-w-md dark:border-gray-700 z-50 my-5">
                <div className="break-words rounded-lg shadow dark:border md:mt-0 w-full xl:p-0 dark:border-gray-700 ">
                  <div className="break-words p-4 space-y-4 md:space-y-6 sm:p-8">
                    <div className="break-words space-y-4 md:space-y-6">
                      <div>
                        <label htmlFor="email" className="break-words block mb-2 text-sm font-medium text-white">Email</label>
                        <div className="break-words border-2 border-prot-light rounded">
                          <input 
                            type="email"
                            name="email"
                            id="email" 
                            onChange={(e) => setEmail(e.target.value)}
                            className="break-words bg-black border-none outline-none text-white text-sm rounded block w-full p-2.5 placeholder-gray-400 text-center sm:text-left" placeholder="name@company.com"
                          />
                        </div>
                      </div>
                      <div>
                          <label htmlFor="password" className="break-words block mb-2 text-sm font-medium text-white">Senha</label>
                          <div className="break-words border-2 border-prot-light rounded">
                            <input 
                            type="password"
                            name="password"
                            id="password"
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            className="break-words text-center sm:text-left bg-black border-none outline-none text-white text-sm rounded block w-full p-2.5 placeholder-gray-400"
                          />
                          </div>
                      </div>
                      <div className="break-words flex items-center justify-center sm:justify-end">
                          <button
                            onClick={() => setShowForgotPassword(true) }
                            className="break-words text-sm font-medium underline text-white hover:text-red-400 transition-colors">
                              Esqueceu a Senha?
                          </button>
                      </div>
                      <button 
                        type="button"
                        onClick={handleLogin}
                        id="sendMessage"
                        className="break-words bg-black border-2 border-prot-light transition-colors hover:border-red-400 text-white w-full focus:ring-prot-light font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        { loading ? 'Verificando...' : 'Entrar'}
                      </button>
                      <Link 
                        href="/new/register"
                        className="break-words text-sm font-light text-white flex flex-col sm:flex-row items-center justify-center">
                        Não tem uma conta? <span className="break-words font-medium hover:underline pl-1 underline text-white hover:text-red-400 transition-colors">Cadastrar</span>
                      </Link>   
                    </div>
                  </div>
                </div>
                { showForgotPassword && <ForgotPassword /> }
              </div>
        }
      </div>
    </section>
  );
}

export default App;