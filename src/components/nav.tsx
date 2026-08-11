'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { authenticate } from '@/firebase/authenticate';
import contexto from '@/context/context';
import Logout from './popup/logout';

const menuSections = [
  {
    title: 'Ferramentas',
    items: [
      { href: '/sessions', label: 'Sessões' },
      { href: '/sheets', label: 'Fichas' },
    ],
  },
  {
    title: 'Consultas',
    items: [
      { href: '/', label: 'Início' },
      { href: '/trybes', label: 'Tribos' },
      { href: '/auspices', label: 'Augúrios' },
      { href: '/forms', label: 'Formas' },
      { href: '/gifts', label: 'Dons' },
      { href: '/rituals', label: 'Rituais' },
      { href: '/loresheets', label: 'Loresheets' },
      { href: '/talismans', label: 'Talismãs' },
      { href: '/advantagesAndFlaws', label: 'Vantagens e Defeitos' },
    ],
  },
  {
    title: 'Projeto',
    items: [
      { href: '/profile', label: 'Perfil' },
      { href: '/about', label: 'Quem Somos' },
    ],
  },
] as const;

export default function Nav(props: { compact?: boolean }) {
  const { compact = false } = props;
  const [showMenu, setShowMenu] = useState(false);
  const [loginLogout, setLoginLogout] = useState<'login' | 'logout'>('login');
  const router = useRouter();
  const pathname = usePathname();
  const { logoutUser, setLogoutUser, setShowMessage, dataUser } = useContext(contexto);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      if (dataUser.email && dataUser.displayName) {
        if (active) setLoginLogout('logout');
        return;
      }

      const authData = await authenticate(setShowMessage);
      if (!active) return;

      if (authData && authData.email && authData.displayName) {
        setLoginLogout('logout');
      } else {
        setLoginLogout('login');
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [dataUser.displayName, dataUser.email, setShowMessage]);

  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = showMenu ? 'hidden' : previousOverflow || '';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showMenu]);

  const isActivePath = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isSessionDetailsRoute = pathname?.startsWith('/sessions/');
  const linkBaseClass = 'font-geist-mono text-[11px] uppercase tracking-[0.12em] transition-colors';

  const renderMenuLink = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className={`border-b border-white/10 pb-3 pt-1 ${linkBaseClass} ${isActivePath(href) ? 'text-red-500' : 'text-white/76 hover:text-red-400'}`}
    >
      {label}
    </Link>
  );

  return (
    <>
      {logoutUser && <Logout />}

      <nav className={`sticky top-0 z-[100] w-full flex justify-center ${compact ? "bg-transparent px-0 pt-0 sm:px-0" : "bg-black px-4 pt-2 sm:px-8"}`}> 
        <div className={compact ? "flex w-full justify-center" : `flex w-full ${!showMenu && !isSessionDetailsRoute ? 'max-w-[1200px]' : ''} justify-end`}> 
          <button
            type="button"
            aria-label={showMenu ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={showMenu}
            onClick={() => setShowMenu((current) => !current)}
            className={`group flex h-11 w-11 items-center justify-center border transition-colors ${showMenu ? 'fixed right-2 top-4 z-[110] border-red-700 bg-[#7a0000] sm:right-2' : 'border-zinc-500/30 bg-black/80 hover:border-red-700'}`}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-[2px] w-5 bg-white transition-transform duration-300 ${showMenu ? 'translate-y-[7px] rotate-45' : ''}`}
              />
              <span
                className={`absolute left-0 top-[7px] h-[2px] w-5 bg-white transition-opacity duration-300 ${showMenu ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`absolute left-0 top-[14px] h-[2px] w-5 bg-white transition-transform duration-300 ${showMenu ? '-translate-y-[7px] -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[80] transition-opacity duration-300 ${showMenu ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setShowMenu(false)}
          className="absolute inset-0 bg-black/80"
        />

        <aside
          className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col border-l border-zinc-500/30 bg-black pb-8 pt-20 text-white transition-transform duration-300 pr-2 pl-8 ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex-1 space-y-8 overflow-y-auto pr-1">
            {menuSections.map((section) => (
              <section key={section.title}>
                <p className="font-kingthings text-2xl uppercase leading-none text-white">
                  {section.title}
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {section.items.map((item) => renderMenuLink(item.href, item.label))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={async () => {
                setShowMenu(false);
                if (loginLogout === 'login') {
                  router.push('/login');
                } else {
                  setLogoutUser(true);
                }
              }}
              className={`inline-flex border px-4 py-2 font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors ${loginLogout === 'logout' ? 'border-red-700 bg-[#7a0000] hover:bg-[#930000]' : 'border-zinc-500/30 bg-black hover:border-red-700 hover:text-red-500'}`}
            >
              {loginLogout === 'logout' ? 'Logout' : 'Login'}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}










