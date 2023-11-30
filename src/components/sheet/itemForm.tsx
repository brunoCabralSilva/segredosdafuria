'use client'
import firebaseConfig from "@/firebase/connection";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionForm, useSlice } from "@/redux/slice";
import { addDoc, collection, getDocs, getFirestore, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import dataForms from '../../data/forms.json';
import Image from "next/image";

export default function ItemForm() {
  const [ formSelected, setFormSelected ] = useState<any>('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    returnValueAttribute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isEmpty = (obj: any) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  const returnValueAttribute = async (): Promise<void> => {
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
          setFormSelected(userData.characterSheet[0].data.form);
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        }
      } catch (error) {
        window.alert('Erro ao obter valor do atributo: ' + error);
      }
    }
  };
  

  const rollRageCheck = async (numberOfChecks: number, name: string) => {
    let resultOfRage = [];
    let success = 0;
    for (let i = 0; i < numberOfChecks; i += 1) {
      const value = Math.floor(Math.random() * 10) + 1;
      if (value >= 6) success += 1;
      resultOfRage.push(value);
    }
    const db = getFirestore(firebaseConfig);
    const messagesRef = collection(db, 'chatbot');
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      const { firstName, lastName, email }: any = jwtDecode(token);
      await addDoc(
        messagesRef,
        {
          message: {
            rollOfRage: resultOfRage,
            success,
            cause: name,
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
          if (userData.characterSheet[0].data.rage - (resultOfRage.length - success) < 0) {
            userData.characterSheet[0].data.rage = 0;
          } else userData.characterSheet[0].data.rage = userData.characterSheet[0].data.rage - (resultOfRage.length - success);
          userData.characterSheet[0].data.form = name;
          await updateDoc(userDocRef, { characterSheet: userData.characterSheet });
        }
      } else {
        window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
      }
    }
  };

  const sendMessage = async (text: string) => {
    const db = getFirestore(firebaseConfig);
    const messagesRef = collection(db, 'chatbot');
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      await addDoc(
        messagesRef,
        {
          message: text,
          user: decodedToken.firstName + ' ' + decodedToken.lastName,
          email: decodedToken.email,
          date: serverTimestamp(),
        }
      );
    }
  };
  
  const updateValue = async (name: string) => {
    const db = getFirestore(firebaseConfig);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken: { email: string } = jwtDecode(token);
        const { email } = decodedToken;
        const userQuery = query(collection(db, 'users'), where('email', '==', email));
        const userQuerySnapshot = await getDocs(userQuery);
        if (!isEmpty(userQuerySnapshot.docs)) {
          const userDocRef = userQuerySnapshot.docs[0].ref;
          const userData = userQuerySnapshot.docs[0].data();
          if (userData.characterSheet && userData.characterSheet.length > 0) {
            if ((name === 'Crinos' || name === 'Hispo' || name === 'Glabro') && userData.characterSheet[0].data.rage === 0) {
              sendMessage('Sua Fúria está em zero, portanto perdeu o lobo e não pode realizar Transformações para Glabro, Crinos e Hispo.');
            } else {
              if (name === 'Crinos') rollRageCheck(2, name);
              if (name === 'Hispo' || name === 'Glabro') rollRageCheck(1, name);
              if (userData.characterSheet[0].data.form === "Crinos") {
                userData.characterSheet[0].data.rage = 1;
                sendMessage('Você saiu da forma Crinos. Sua Fúria foi reduzida para 1.');
              }
              userData.characterSheet[0].data.form = name;
              await updateDoc(userDocRef, { characterSheet: userData.characterSheet });
              dispatch(actionForm(name));
            }
          }
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        }
      } catch (error) {
        window.alert('Erro ao atualizar Forma (' + error + ')');
      }
    }
    returnValueAttribute();
  };

  return(
    <div className="w-full mt-2 text-black">
      <div className="w-full"> 
        {
          dataForms.map((form: any, index) => (
            <div
              key={index}
              className={`mt-2 p-5 w-ful border-white border-2 cursor-pointer flex-col items-center justify-center ${formSelected === form.name && 'bg-black'}`}
              onClick={ () => updateValue(form.name) }
            >
              <div className="w-full flex items-center justify-center">
              <Image
                src={`/images/forms/${form.name}-white.png`}
                alt={`Glifo dos ${form.name}`}
                className="object-cover object-top w-32 my-2"
                width={800}
                height={400}
              />
              </div>
              <p className="w-full text-center py-2 text-white">{ form.name } - { form.subtitle }</p>
              <ul className="pl-5 text-sm font-normal text-white">
                  <li className="list-disc">
                    {
                      form.cost === 'Nenhum.'
                        ? 'Nenhum Teste de Fúria'
                        : form.cost
                    }
                  </li>
                {
                  form.resume.map((item: string, index: number) => (
                    <li className="list-disc" key={index}>
                      { item }
                    </li>
                  ))
                }
              </ul>
            </div>

          ))
        }
      </div>
    </div>
  );
}