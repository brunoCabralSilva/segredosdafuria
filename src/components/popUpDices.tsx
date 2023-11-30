'use client'
import firebaseConfig from "@/firebase/connection";
import { useAppDispatch } from "@/redux/hooks";
import { actionShowMenuSession } from "@/redux/slice";
import { collection, getDocs, getFirestore, query, addDoc, serverTimestamp, where, updateDoc } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import dataSheet from '../data/sheet.json';

export default function PopUpDices() {
  const [atrSelected, setAtrSelected] = useState<string>('');
  const [sklSelected, setSklSelected] = useState<string>('');
  const [renSelected, setRenSelected] = useState<string>('');
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(0);
  const [rageCheck, setRageCheck] = useState<number>(1);
  const dispatch = useAppDispatch();
  interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };

  interface IDataValues {
    renown: number,
    rage: number,
    skill: number,
    attribute: number,
  };

  const isEmpty = (obj: any) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  const returnValue = async (): Promise<IDataValues | null> => {
    const db = getFirestore(firebaseConfig);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken: { email: string } = jwtDecode(token);
        const { email } = decodedToken;
        const userQuery = query(collection(db, 'users'), where('email', '==', email));
        const userQuerySnapshot = await getDocs(userQuery);
        if (!isEmpty(userQuerySnapshot.docs)) {
          const userData = userQuerySnapshot.docs[0].data();
          let renown = 0;
          let skill = 0;
          let atr = 0;
          if (atrSelected !== '') renown = userData.characterSheet[0].data.attributes[atrSelected];
          if (renSelected !== '') renown = userData.characterSheet[0].data[renSelected];
          if (sklSelected !== '') skill = userData.characterSheet[0].data.skills[sklSelected].value;
          return {
            renown: renown,
            rage: userData.characterSheet[0].data.rage,
            skill: skill,
            attribute: atr,
          }
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
          return null;
        }
      } catch (error) {
        window.alert('Erro ao obter valor do atributo: ' + error);
      }
    } return null;
  };

  const returnRageCheck = async () => {
    let resultOfRage = [];
    let success = 0;
    for (let i = 0; i < rageCheck; i += 1) {
      const value = Math.floor(Math.random() * 10) + 1;
      if (value >= 6) success += 1;
      resultOfRage.push(value);
    }
    const db = getFirestore(firebaseConfig);
    const messagesRef = collection(db, 'chatbot');
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      const { firstName, lastName, email }: IUser = jwtDecode(token);
      await addDoc(
        messagesRef,
        {
          message: {
            rollOfRage: resultOfRage,
            success,
            cause: 'manual'
          },
          user: firstName + ' ' + lastName,
          email: email,
          date: serverTimestamp(),
      });
      const decodedToken: { email: string } = jwtDecode(token);
      const { email: emailUser } = decodedToken;
      const userQuery = query(collection(db, 'users'), where('email', '==', emailUser));
      const userQuerySnapshot = await getDocs(userQuery);
      if (!isEmpty(userQuerySnapshot.docs)) {
        const userDocRef = userQuerySnapshot.docs[0].ref;
        const userData = userQuerySnapshot.docs[0].data();
        if (userData.characterSheet && userData.characterSheet.length > 0) {
          if (userData.characterSheet[0].data.rage - success < 0) {
            userData.characterSheet[0].data.rage = 0;
          } else userData.characterSheet[0].data.rage = userData.characterSheet[0].data.rage - (resultOfRage.length - success);
          await updateDoc(userDocRef, { characterSheet: userData.characterSheet });
        }
      } else {
        window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
      }
    }
  };

  const registerRoll = async () => {
    const dtSheet: IDataValues | null = await returnValue();
    if (dtSheet) {
      let rage = dtSheet.rage;
      let resultOfRage = [];
      let resultOf = [];
      let dices = dtSheet.attribute + dtSheet.renown + dtSheet.skill + Number(penaltyOrBonus);
      if (dices > 0) {
        if (dices - dtSheet.rage === 0) dices = 0;
        else if (dices - dtSheet.rage > 0) dices = dices - dtSheet.rage;
        else {
          rage = dices;
          dices = 0;
        };

        for (let i = 0; i < rage; i += 1) {
          const value = Math.floor(Math.random() * 10) + 1;
          resultOfRage.push(value);
        }
    
        for (let i = 0; i < dices; i += 1) {
          const value = Math.floor(Math.random() * 10) + 1;
          resultOf.push(value);
        }
      }

      const db = getFirestore(firebaseConfig);
      const messagesRef = collection(db, 'chatbot');
      const token = localStorage.getItem('Segredos Da Fúria');
      if (token) {
        const { firstName, lastName, email }: IUser = jwtDecode(token);
        if (dices + rage >= dificulty) {
          await addDoc(
            messagesRef,
            {
              message: {
                rollOfMargin: resultOf,
                rollOfRage: resultOfRage,
                dificulty,
                penaltyOrBonus,
              },
              user: firstName + ' ' + lastName,
              email: email,
              date: serverTimestamp(),
          }) 
        } else {
          await addDoc(
            messagesRef,
            {
              message: `A soma dos dados é menor que a dificuldade imposta. Sendo assim, a falha no teste foi automática.`,
              user: firstName + ' ' + lastName,
              email: email,
              date: serverTimestamp(),
            }
          );
        }
      }
      dispatch(actionShowMenuSession(''));
    }
  };

  const disabledButton = () => {
    return (atrSelected === '' && renSelected === '' && sklSelected === '') || dificulty <= 0;
  }

  return(
      <div className="w-8/10 p-8 sm-p-10 bg-black flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto">
        <IoIosCloseCircleOutline
          className="fixed top-0 right-1 text-4xl text-white ml-2 mt-2 cursor-pointer z-50"
          onClick={() => dispatch(actionShowMenuSession(''))}
        />
        <label htmlFor="valueOf" className="mb-4 flex items-center w-full gap-2">
            <select
              onClick={(e: any) => setRageCheck(e.target.value)}
              className="w-full py-3 capitalize cursor-pointer"
            >
              <option
                className="capitalize text-center text-black"
                value={1}
              >
                1 Teste de Fúria
              </option>
              <option
                value={2}
                className="capitalize text-center text-black"
              >
                2 Testes de Fúria
              </option>
            </select>
            <button
              className="bg-white p-3"
              onClick={ returnRageCheck }
            >
              Ok
            </button>
        </label>
        <label htmlFor="valueOf" className="mb-4 flex flex-col items-center w-full">
          <p className="text-white w-full pb-3">Atributo</p>
            <select
              onClick={(e: any) => setAtrSelected(e.target.value)}
              className="w-full py-3 capitalize cursor-pointer"
            >
              <option
                className="capitalize text-center text-black"
                disabled selected
              >
                Escolha um atributo
              </option>
              {
                dataSheet.attributes
                  .map((item, index) => (
                  <option
                    className="capitalize text-center text-black"
                    key={index}
                    value={item.value}
                  >
                    { item.namePtBr }
                  </option>
                ))
              }
            </select>
        </label>
        <label htmlFor="valueOf" className="mb-4 flex flex-col items-center w-full">
          <p className="text-white w-full pb-3">Habilidade</p>
            <select
              onClick={(e: any) => setSklSelected(e.target.value)}
              className="w-full py-3 capitalize cursor-pointer"
            > 
              <option
                className="capitalize text-center text-black"
                disabled selected
              >
                Escolha uma Habilidade
              </option>
              <option
                className="text-black capitalize text-center"
                value=""
              >
                Nenhuma
              </option>
              {
                dataSheet.skills
                  .sort((a, b) => a.namePtBr.localeCompare(b.namePtBr))
                  .map((item, index) => (
                    <option
                      className="text-black capitalize text-center"
                      key={index}
                      value={item.value}
                    >
                      { item.namePtBr }
                    </option>
                  ))
              }
            </select>
        </label>
        <label htmlFor="valueOf" className="mb-4 flex flex-col items-center w-full">
          <p className="text-white w-full pb-3">Renome</p>
            <select
              onClick={(e: any) => setRenSelected(e.target.value)}
              className="w-full py-3 capitalize cursor-pointer"
            >
              <option
                className="capitalize text-center text-black"
                disabled selected
              >
                Escolha um Renome
              </option>
              <option
                className="capitalize text-center text-black"
                value=""
              >
                Nenhum
              </option>
              {
                dataSheet.renown
                  .map((item, index) => (
                  <option
                    className="capitalize text-center text-black"
                    key={index}
                    value={item.value}
                  >
                    { item.namePtBr }
                  </option>
                ))
              }
            </select>
        </label>
        <label htmlFor="penaltyOrBonus" className="mb-4 flex flex-col items-center w-full">
          <p className="text-white w-full pb-3">Bônus (+) ou Penalidade (-)</p>
          <div className="flex w-full">
            <button
              type="button"
              className={`border border-white p-3 cursor-pointer ${ penaltyOrBonus === -50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
              onClick={ () => {
                if (penaltyOrBonus > -50) setPenaltyOrBonus(penaltyOrBonus - 1)
              }}
            >
              <FaMinus />
            </button>
            <div
              className="p-2 text-center text-black w-full bg-white"
            >
              <span className="w-full">{ penaltyOrBonus }</span>
            </div>
            <button
              type="button"
              className={`border border-white p-3 cursor-pointer ${ penaltyOrBonus === 50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
              onClick={ () => {
                if (penaltyOrBonus < 50) setPenaltyOrBonus(penaltyOrBonus + 1)
              }}
            >
              <FaPlus />
            </button>
          </div>
        </label>
        <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
          <p className="text-white w-full pb-3">Dificuldade</p>
          <div className="flex w-full">
            <button
              type="button"
              className={`border border-white p-3 cursor-pointer ${ dificulty === 0 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
              onClick={ () => {
                if (dificulty > 0) setDificulty(dificulty - 1);
              }}
            >
              <FaMinus />
            </button>
            <div
              className="p-2 text-center text-black w-full bg-white"
            >
              <span className="w-full">{ dificulty }</span>
            </div>
            <button
              type="button"
              className={`border border-white p-3 cursor-pointer ${ dificulty === 15 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
              onClick={ () => {
                if (dificulty < 15) setDificulty(dificulty + 1)
              }}
            >
              <FaPlus />
            </button>
          </div>
        </label>
        <button
          className={`${disabledButton() ? 'text-black bg-gray-400 hover:bg-gray-600 hover:text-white transition-colors': 'text-white bg-black hover:border-red-800 transition-colors cursor-pointer' } border-2 border-white w-full p-2 mt-6 font-bold`}
          disabled={disabledButton()}
          onClick={registerRoll}
        >
          Rolar dados
        </button>
      </div>
  )
}