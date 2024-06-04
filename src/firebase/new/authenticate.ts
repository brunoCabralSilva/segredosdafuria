import {
  signOut,
  getAuth,
  updatePassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import firebaseConfig from "../connection";
import { getUserByEmail } from "./user";

export const signIn = async (email: string, password: string) => {
  const auth = getAuth(firebaseConfig);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    return false;
  }
}

export const signOutFirebase = async () => {
  try {
    const auth = getAuth(firebaseConfig);
    await signOut(auth);
    return true;
  } catch (error) {
    window.alert('Não foi possível deslogar o usuário. Por favor, atualize a página e Tente novamente ('+ error + ').' );
    return false;
  }
};

export const authenticate = async () => {
  return new Promise<{ email: string, photoURL: string, displayName: string } | null>((resolve) => {
    const auth = getAuth(firebaseConfig);
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        const dataUser = await getUserByEmail(user.email);
        const displayName = dataUser.firstName + ' ' + dataUser.lastName;
        const photoURL = dataUser.imageURL;
        const { email } = user;
        resolve({
          email,
          displayName,
          photoURL,
        });
      } else {
        resolve(null);
      } unsubscribe();
    });
  });
};

export const changeUserPassword = async (
  oldPassword: string,
  email: string,
  newPassword: string
) => {
  const auth = getAuth(firebaseConfig);
  try {
    const credenciais = signInWithEmailAndPassword(auth, email, oldPassword);
    await credenciais;
    const user: any = auth.currentUser;
    await updatePassword(user, newPassword);
    window.alert('Senha alterada com sucesso!');
    return true
  } catch (error) {
    window.alert('Erro ao alterar a senha: (' + error + ')');
    return false;
  }
};

export const forgotPassword = async (email: string) => {
  const auth = getAuth(firebaseConfig);
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    window.alert('Erro ao enviar e-mail de redefinição de senha: ' + error + ')');
    return false;
  }
};