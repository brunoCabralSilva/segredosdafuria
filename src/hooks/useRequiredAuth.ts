'use client';

import contexto from '@/context/context';
import { authenticate } from '@/firebase/authenticate';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

export type AuthenticatedUser = {
  email: string;
  displayName: string;
  photoURL?: string;
};

export default function useRequiredAuth() {
  const router = useRouter();
  const { setDataUser, setShowMessage } = useContext(contexto);
  const [authChecked, setAuthChecked] = useState(false);
  const [authUser, setAuthUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    let active = true;

    const verifyAuth = async () => {
      const authData: any = await authenticate(setShowMessage);

      if (!active) return;

      if (!authData || !authData.email || !authData.displayName) {
        router.replace('/login');
        return;
      }

      const nextUser: AuthenticatedUser = {
        email: String(authData.email),
        displayName: String(authData.displayName),
        photoURL: authData.photoURL ? String(authData.photoURL) : '',
      };

      setDataUser({ email: nextUser.email, displayName: nextUser.displayName });
      setAuthUser(nextUser);
      setAuthChecked(true);
    };

    verifyAuth();

    return () => {
      active = false;
    };
  }, [router, setDataUser, setShowMessage]);

  return { authChecked, authUser };
}
