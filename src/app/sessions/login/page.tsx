'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Footer from "@/components/footer";
import Image from "next/image";
import { login, verify } from "../../../firebase/user";
import Simplify from "@/components/simplify";
import { useAppDispatch } from "@/redux/hooks";
import { actionLogin } from "@/redux/slice";
import { jwtDecode } from "jwt-decode";
import Nav from "@/components/nav";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorAuth, setErrorAuth] = useState(false);
  const [showData, setShowData] = useState(false);
  const router = useRouter();
  const dispatch: any = useAppDispatch();
  
  useEffect(() => {
    setShowData(false);
    window.scrollTo(0, 0);
    const token = localStorage.getItem('Segredos Da Fúria');
    console.log('Token ', token);
    if (token) {
      try {
        const decodedToken = verify(JSON.parse(token));
        console.log('decoded ', decodedToken);
        if (decodedToken) {
          const { firstName, lastName, email, role }: { firstName: string, lastName: string, email: string, role: string } = jwtDecode(token);
          dispatch(actionLogin({ firstName, lastName, email, role }));
          router.push('/sessions');
        }
        else setShowData(true);
      } catch(error) {
        console.log('Erro', error);
        setShowData(true);
        dispatch(actionLogin({ firstName: '', lastName: '', email: '', role: '' }));
        router.push('/sessions/login');
      }
      } else {
        setShowData(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enableButton = () => {
    const number = 6;
    const validateEmail = /\S+@\S+\.\S+/;
    const vEmail = !email || !validateEmail.test(email) || email === '';
    const vPassword = !password || password.length < number;
    return vEmail || vPassword;
  };

  const loginUser = async () => {
    const logs = await login(email, password);
    if (logs) {
      dispatch(actionLogin(logs));
      router.push('/sessions');
    } else {
      setErrorAuth(true);
      setTimeout(() => {
        setErrorAuth(false);
      }, 3000);
    }
  };

  return(
    showData &&
    <section>
      <Simplify />
      <Nav />
      <div className="h-screen flex flex-col items-center justify-center bg-ritual bg-cover">
        <section className="flex flex-col items-center sm:justify-center bg-black/80 h-full w-full py-10 px-2 sm:p-10 text-white">
          <Image
            src="/images/logos/text.png"
            alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
            className="h-20vh sm:h-70vh md:h-20vh w-10/12 sm:w-3/5 md:w-1/2 xl:w-5/12 object-contain"
            width={2000}
            height={800}
            priority
          />
          <div className="flex flex-col items-center justify-center w-full">
            <input
              className="p-2 text-center mt-10 w-11/12 sm:w-1/2 bg-transparent border border-transparent focus:outline-none border-b-white"
              id="email"
              autoComplete="off"
              value={email}
              placeholder="E-mail"
              onChange={ (e) => setEmail(e.target.value) }
              type="email"
            />
            <input
              className="p-2 text-center mt-5 w-11/12 sm:w-1/2 bg-transparent border border-transparent focus:outline-none border-b-white"
              placeholder="Senha"
              value={password}
              onChange={ (e) => setPassword(e.target.value) }
              type="password"
            />
            <button
              className={`${enableButton() ? 'bg-gray-400 hover:bg-gray-600 hover:text-white transition-colors' : 'bg-black border-2 border-white hover:border-red-800 transition-colors text-white cursor-pointer'} w-11/12 sm:w-1/2 p-2 mt-6 text-black font-bold` }
              id="btn-login"
              disabled={ enableButton() }
              onClick={ loginUser }
            >
              Login
            </button>
            <button
              className="mt-4 hover:underline"
              id="btn-register"
              onClick={ () => router.push('/sessions/register') }
            >
              Registre-se
            </button>
          </div>
          <div className="h-14 flex items-center justify-center mt-4">
            { errorAuth  && <span>Email ou senha incorretos</span> }
          </div>
          
        </section>
      </div>
      <Footer />
    </section>
  );
}

