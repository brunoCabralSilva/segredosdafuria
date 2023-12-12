import md5 from 'md5';
import jwt from 'jsonwebtoken';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore/lite';
import firebaseConfig from './connection';

const db = getFirestore(firebaseConfig);
const secretKey: any = process.env.NEXT_PUBLIC_SECRET_KEY;

export const getUser = async (email: string, password: string) => {
  try {
    const getData = query(collection(db, 'users'), where('email', '==', email), where('password', '==', password));

    const querySnapshot = await getDocs(getData);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      };
    }
    return null;
  } catch (error) {
    window.alert('Error getting user: ' + error);
    return error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const encryptedPass = md5(password);
    const response = await getUser(email, encryptedPass);

    if (!response) return null;

    const token = jwt.sign(response, secretKey, { expiresIn: '4h' });
    localStorage.setItem('Segredos Da Fúria', JSON.stringify(token));

    return response;
  } catch (error: any) {
    window.alert('Error signing token: ' + error);
    return null;
  }
};

export const verify = (token: string) => {
  try {
    return jwt.verify(token, secretKey);
  } catch(error) {
    return false;
  }
};

export const registerUser = async (email: string, firstName: string, lastName: string, password: string) => {
  await addDoc(collection(db, 'users'), {
    email,
    firstName,
    lastName,
    password: md5(password),
    role: 'normal',
  });
};

export const verifyEmail = async (email: string) => {
  try {
    const getData = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(getData);
    return !querySnapshot.empty;
  } catch (error) {
    window.alert('Error verifying email: ' + error);
    return false;
  }
};
