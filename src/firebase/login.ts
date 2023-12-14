import {
  signOut,
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD6c5jqiOrV8calseJ_dNPfKY29_py18Uo",
  authDomain: "segredos-da-furia.firebaseapp.com",
  projectId: "segredos-da-furia",
  storageBucket: "segredos-da-furia.appspot.com",
  messagingSenderId: "147800519056",
  appId: "1:147800519056:web:a81dd7f056d683f199c315",
  measurementId: "G-QCQHM1ZNTF"
};

const app = initializeApp(firebaseConfig);

export const signIn = async () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  auth.languageCode = 'it';
  try {
    const result = await signInWithRedirect(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential) {
      return true;
    } else {
      window.alert('Não foi possível realizar o login. Por favor, tente novamente.');
      return false;
    }
  } catch (error: any) {
    window.alert('Ocorreu um erro ao realizar o login: ' + error + ' / ' + error.code);
    return false;
  }
};

export const signOutFirebase = async () => {
  try {
    const auth = getAuth(app);
    await signOut(auth);
    return true
  } catch (error) {
    window.alert('Não foi possível deslogar o usuário. Por favor, atualize a página e Tente novamente ('+ error + ').' );
    return false;
  }
};

export const authenticate = () => {
  return new Promise<{ email: string, name: string } | null>((resolve) => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve({ email: user.email || '', name: user.displayName || '' });
      } else {
        resolve(null);
      } unsubscribe();
    });
  });
};