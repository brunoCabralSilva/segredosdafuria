import md5 from 'md5';
import jwt from 'jsonwebtoken';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore/lite';
import firebaseConfig from './connection';

const db = getFirestore(firebaseConfig);
const secretKey = 'SegredosDaFúria2023';

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
    characterSheet: [
      {
        session: '',
        data: {
          trybe: '',
          auspice: '',
          name: '',
          renown: { glory: 0, honor: 0, wisdom: 0 },
          health: { temporary: 0, total: 0 },
          rage: 0,
          willpower: { temporary: 0, total: 0 },
          attributes: {
            strength: 1,
            dexterity: 1,
            stamina: 1,
            charisma: 1,
            manipulation: 1,
            composure: 1,
            intelligence: 1,
            wits: 1,
            resolve: 1,
          },
          skills: {
            athletics: { value: 0, specialty: '' },
            animalKen: { value: 0, specialty: '' },
            academics: { value: 0, specialty: '' },
            brawl: { value: 0, specialty: '' },
            etiquette: { value: 0, specialty: '' },
            awareness: { value: 0, specialty: '' },
            craft: { value: 0, specialty: '' },
            insight: { value: 0, specialty: '' },
            finance: { value: 0, specialty: '' },
            driving: { value: 0, specialty: '' },
            intimidation: { value: 0, specialty: '' },
            investigation: { value: 0, specialty: '' },
            firearms: { value: 0, specialty: '' },
            leadership: { value: 0, specialty: '' },
            medicine: { value: 0, specialty: '' },
            larceny: { value: 0, specialty: '' },
            performance: { value: 0, specialty: '' },
            occult: { value: 0, specialty: '' },
            melee: { value: 0, specialty: '' },
            persuasion: { value: 0, specialty: '' },
            politics: { value: 0, specialty: '' },
            stealth: { value: 0, specialty: '' },
            streetwise: { value: 0, specialty: '' },
            science: { value: 0, specialty: '' },
            survival: { value: 0, specialty: '' },
            subterfuge: { value: 0, specialty: '' },
            technology: { value: 0, specialty: '' },
          },
          gifts: [],
          rituals: [],
          advantagesAndFlaws: [],
          form: '',
          background: '',
          notes: '',
        },
      },
    ],
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
