'use client'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { createProfileImage } from './storage';
import firebaseConfig from "../../firebase/connection";

export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  image: any,
) {
  try {
    const auth = getAuth(firebaseConfig);
    const db = getFirestore(firebaseConfig);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const imageURL = await createProfileImage(user.uid, image);

    await setDoc(doc(db, 'users', user.uid), {
      email, firstName, lastName, imageURL,
    });

    window.alert('Usuário registrado com sucesso!');
    return true;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert('Erro ao registrar:' + errorCode + ' - ' + errorMessage);
    return false;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const db = getFirestore(firebaseConfig);
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      window.alert('Usuário com o email fornecido não encontrado.');
    } else {
      let user: any;
      querySnapshot.forEach((doc: any) => {
        user = doc.data();
        user.id = doc.id;
      });
      return user;
    }
  } catch (error) {
    window.alert('Erro ao obter usuário por email: ' + error);
    return false;
  }
}

export async function getUserById(userId: string) {
  try {
    const db = getFirestore(firebaseConfig);
    const usersCollectionRef = collection(db, 'users');
    const userDoc = await getDoc(doc(usersCollectionRef, userId));

    if (!userDoc.exists()) {
      window.alert('Usuário com o ID fornecido não encontrado.');
      return null;
    } else {
      const user = userDoc.data();
      if (user) {
        user.id = userDoc.id;
        return user;
      } else {
        window.alert('Usuário encontrado com ID inválido.');
        return null;
      }
    }
  } catch (error) {
    window.alert('Erro ao obter usuário por ID: ' + error);
    return null;
  }
}

export async function updateUserById(userData: any) {
  try {
    const db = getFirestore(firebaseConfig);
    const userDocRef = doc(db, 'users', userData.id);
    const userDocSnapshot = await getDoc(userDocRef);
    if (!userDocSnapshot.exists()) {
      window.alert('Usuário / Empresa não encontrad(a)');
    } else {
      await updateDoc(userDocRef, userData);
      window.alert('Dados atualizados com sucesso!');
      return true;
    }
  } catch (error) {
    window.alert('Erro ao atualizar dados: ' + error);
    return false;
  }
}