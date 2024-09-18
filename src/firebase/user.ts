'use client'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { createProfileImage } from './storage';
import firebaseConfig from "./connection";

export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  image: any,
  setShowMessage: any,
) {
  try {
    const auth = getAuth(firebaseConfig);
    const db = getFirestore(firebaseConfig);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const imageURL = await createProfileImage(user.uid, image, setShowMessage);

    await setDoc(doc(db, 'users', user.uid), {
      email, firstName, lastName, imageURL,
    });

    setShowMessage({ show: true, text: 'Usuário registrado com sucesso!' });
    return true;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    setShowMessage({ show: true, text: 'Erro ao registrar usuário:' + errorCode + ' - ' + errorMessage });
    return false;
  }
}

export async function getUserByEmail(email: string, setShowMessage: any) {
  try {
    const db = getFirestore(firebaseConfig);
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      setShowMessage({ show: true, text: 'Usuário com o email fornecido não encontrado.' });
    } else {
      let user: any;
      querySnapshot.forEach((doc: any) => {
        user = doc.data();
        user.id = doc.id;
      });
      return user;
    }
  } catch (error) {
    setShowMessage({ show: true, text: 'Erro ao obter usuário por email: ' + error });
    return false;
  }
}

export async function getUserById(userId: string, setShowMessage: any) {
  try {
    const db = getFirestore(firebaseConfig);
    const usersCollectionRef = collection(db, 'users');
    const userDoc = await getDoc(doc(usersCollectionRef, userId));

    if (!userDoc.exists()) {
      setShowMessage({ show: true, text: 'Usuário com o ID fornecido não encontrado.' });
      return null;
    } else {
      const user = userDoc.data();
      if (user) {
        user.id = userDoc.id;
        return user;
      } else {
        setShowMessage({ show: true, text: 'Usuário encontrado com ID inválido.' });
        return null;
      }
    }
  } catch (error) {
    setShowMessage({ show: true, text: 'Erro ao obter usuário por ID: ' + error });
    return null;
  }
}

export async function updateUserById(userData: any, setShowMessage: any) {
  try {
    const db = getFirestore(firebaseConfig);
    const userDocRef = doc(db, 'users', userData.id);
    const userDocSnapshot = await getDoc(userDocRef);
    if (!userDocSnapshot.exists()) {
      setShowMessage({ show: true, text: 'Usuário / Empresa não encontrad(a)' });
    } else {
      await updateDoc(userDocRef, userData);
      setShowMessage({ show: true, text: 'Dados atualizados com sucesso!' });
      return true;
    }
  } catch (error) {
    setShowMessage({ show: true, text: 'Erro ao atualizar dados: ' + error });
    return false;
  }
}