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
            if (userData.characterSheet[0].data.form === "Crinos") userData.characterSheet[0].data.rage = 1;
            userData.characterSheet[0].data.form = name;
            await updateDoc(userDocRef, { characterSheet: userData.characterSheet });
            dispatch(actionForm(name));
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