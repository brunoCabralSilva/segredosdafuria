'use client'
import firebaseConfig from "@/firebase/connection";
import { useAppDispatch } from "@/redux/hooks";
import { actionForm, actionShowMenuSession } from "@/redux/slice";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import dataForms from '../../data/forms.json';
import Image from "next/image";
import { returnRageCheck } from "@/firebase/checks";
import { registerMessage } from "@/firebase/chatbot";

export default function Forms(props: { session: string }) {
  const { session } = props;
  const [ formSelected, setFormSelected ] = useState<any>('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    returnValue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnValue = async (): Promise<void> => {
    const db = getFirestore(firebaseConfig);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken: { email: string } = jwtDecode(token);
        const { email } = decodedToken;
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        setFormSelected(player.data.form);
      } catch (error) {
        window.alert('Erro ao obter valor da Forma: ' + error);
      }
    }
  };
  
  const updateValue = async (name: string) => {
    const db = getFirestore(firebaseConfig);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken: { email: string, firstName: string, lastName: string } = jwtDecode(token);
        const { email, firstName, lastName } = decodedToken;
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        if (name === 'Hominídeo' || name === 'Lupino') {
          await registerMessage({
            message: `Mudou para a forma ${name}.`,
            user: firstName + ' ' + lastName,
            email: email,
          }, session);
        }
        if (name === 'Crinos') await returnRageCheck(2, name, session);
        if (name === 'Glabro' || name === 'Hispo') await returnRageCheck(1, name, session);
        if (player.data.form === "Crinos") {
          if (player.data.rage > 0) {
            player.data.rage = 1;
            await registerMessage({
              message: 'Fúria reduzida para 1 por ter saído da forma Crinos.',
              user: firstName + ' ' + lastName,
              email: email,
            }, session);
          }
        }
        player.data.form = name;
        const docRef = userQuerySnapshot.docs[0].ref;
        const playersFiltered = players.filter((gp: any) => gp.email !== email);
        await updateDoc(docRef, { players: [...playersFiltered, player] });
        dispatch(actionForm(name));
        dispatch(actionShowMenuSession(''))
      } catch (error) {
        window.alert('Erro ao atualizar Forma (' + error + ')');
      }
    }
    returnValue();
  };

  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold">
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
      </div>
    </div>
  );
}