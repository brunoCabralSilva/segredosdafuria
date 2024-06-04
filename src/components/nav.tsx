'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actionLogoutUser, useSlice } from '@/redux/slice';
import PopupLogout from './sheet/popup/popupLogout';
import { authenticate } from '@/firebase/login';
import { useRouter } from 'next/navigation';

export default function Nav() {
  const [showMenu, setShowMenu] = useState(false);
  const [loginLogout, setLoginLogout] = useState('');
  const dispatch = useAppDispatch();
  const slice = useAppSelector(useSlice);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const authData = await authenticate();
      if (authData && authData.email && authData.name) {
        setLoginLogout('logout');
      } else {
        setLoginLogout('login');
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const barra1 = () => {
    if(!showMenu) {
      return 'rotate-0 transition duration-500 z-0';
    } return 'rotate-45 transition duration-500 translate-y-2 z-40';
  }

  const barra2 = () => {
    if(!showMenu) {
      return 'rotate-0 transition duration-500 z-0';
    } return '-rotate-45 transition duration-500 z-40';
  }

  const barra3 = () => {
    if(!showMenu) {
      return 'opacity-1 transition duration-500 z-0';
    } return 'opacity-0 transition duration-500 z-40';
  }

  return (
    <nav className="w-full text-base relative 2xl:text-xl leading-6 z-40">
      { slice.logoutUser && <PopupLogout setShowMenu={setShowMenu} setLoginLogout={setLoginLogout} /> }
      <div
        onClick={ () => setShowMenu(!showMenu) }
        className="bg-black px-2 pt-2 pb-1 rounded cursor-pointer fixed right-0 top-0 sm:mt-1 sm:mr-2 flex flex-col z-40"
      >
        <div className={`h-1 w-9 bg-white mb-1 ${barra1()}`} />
        <div className={`h-1 w-9 bg-white mb-1 ${barra2()}`} />
        <div className={`h-1 w-9 bg-white mb-1 ${barra3()}`} />
      </div>
      { showMenu &&
        <ul
          className={`overflow-y-auto fixed top-0 right-0 opacity-1 z-30 w-full sm:w-1/2 md:w-1/4 h-screen items-center pt-2 transition duration-500 flex flex-col text-white justify-center ${slice.simplify ? 'bg-black border-l-2 border-white' : 'bg-black'} font-extrabold`}
        >
          <li>
            <Link
              href="/"
              onClick={ () => setShowMenu(!showMenu) }
              className="text-white transition duration-1000 px-2 hover:underline hover:underline-offset-4"
            >
              Início
            </Link>
          </li>
          <li className="pt-4">
            <Link href="/trybes"
              onClick={ () => setShowMenu(!showMenu) }
              className="text-white transition duration-1000 px-2 hover:underline hover:underline-offset-4"
            >
              Tribos
            </Link>
          </li>
          <li className="pt-4">
            <Link href="/auspices"
              onClick={ () => setShowMenu(!showMenu) }
              className="text-white transition duration-1000 px-2 hover:underline hover:underline-offset-4"
            >
              Augúrios
            </Link>
          </li>
          <li className="pt-4">
            <Link href="/forms"
              onClick={ () => setShowMenu(!showMenu) }
              className="text-white transition duration-1000 px-2 hover:underline hover:underline-offset-4"
            >
              Formas
            </Link>
          </li>
          <li className="pt-4">
            <Link href="/gifts"
              onClick={ () => setShowMenu(!showMenu) }
              className="text-white transition duration-1000 px-2 hover:underline hover:underline-offset-4"
            >
              Dons
            </Link>
          </li>
          <li className="pt-4">
            <Link href="/rituals"
              onClick={ () => setShowMenu(!showMenu) }
              className="text-white transition duration-1000 px-2 hover:underline hover:underline-offset-4"
            >
              Rituais
            </Link>
          </li>
          <li className="pt-4">
            <Link href="/talismans"
              onClick={ () => setShowMenu(!showMenu) }
              className="text-white transition duration-1000 px-2 hover:underline hover:underline-offset-4"
            >
              Talismãs
            </Link>
          </li>
          <li className="pt-4">
            <Link href="/loresheets"
              onClick={ () => setShowMenu(!showMenu) }
              className="text-white transition duration-1000 px-2 hover:underline hover:underline-offset-4"
            >
              Loresheets
            </Link>
          </li>
          <li className="pt-4">
            <Link href="/sessions"
              className="text-white transition duration-1000 px-2 hover:underline hover:underline-offset-4"
            >
              Sessões
            </Link>
          </li>
          <li className="pt-4">
            <Link href="/profile"
              onClick={ () => setShowMenu(!showMenu) }
              className="text-white transition duration-1000 px-2 hover:underline hover:underline-offset-4"
            >
              Perfil
            </Link>
          </li>
          <li className="pt-4">
            <Link href="/about"
              onClick={ () => setShowMenu(!showMenu) }
              className="text-white transition duration-1000 px-2 hover:underline hover:underline-offset-4"
            >
              Quem Somos
            </Link>
          </li>
          <li className="pt-10">
          <button
              type="button"
              onClick={ async () => {
                if (loginLogout === 'login') {
                  setShowMenu(!showMenu)
                  const auth: any = await authenticate();
                  if (auth) setLoginLogout('logout');
                  else router.push('/login');
                }
                else dispatch(actionLogoutUser(true))
              }}
              className="text-white transition duration-1000 px-2 hover:underline hover:underline-offset-4"
            >
              { loginLogout === 'logout' && 'Logout' }
              { loginLogout === 'login' && 'Login' }
            </button>
          </li>
        </ul>
      }
    </nav>
  );
}