'use client'
import firebaseConfig from "@/firebase/connection";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import dataForms from '../../data/forms.json';
import Image from 'next/image';
import { authenticate } from "@/firebase/new/authenticate";
import { useRouter } from 'next/navigation';
import { actionForm, useSlice } from "@/redux/slice";

export default function FormsGift(props: { session: string }) {
  const { session } = props;
  const [ formSelected, setFormSelected ] = useState<any>('');
  const dispatch = useAppDispatch();
  const slice = useAppSelector(useSlice);
  const router = useRouter();

  useEffect(() => {
    returnValue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnValue = async (): Promise<void> => {
    const db = getFirestore(firebaseConfig);
    const authData: any = await authenticate();
    try {
      if (authData && authData.email && authData.displayName) {
        const { email } = authData;
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        setFormSelected(player.data.form);
      } else router.push('/login');
    } catch (error) {
      window.alert('Erro ao obter valor da Forma: ' + error);
    }
  };

  return(
    <div className="flex flex-col w-full pr-2 h-full">
      <div className="w-full h-full flex-col items-start justify-center font-bold">
        <div className="w-full mt-2 text-black">
          <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-2"> 
            {
              dataForms.map((form: any, index) => (
                <div
                  key={index}
                  className={`mt-2 border-white border-2 cursor-pointer flex-col flex items-center justify-center ${formSelected === form.name && 'bg-gray-800'}`}
                  onClick={ () => {
                    dispatch(actionForm(form.name));
                    setFormSelected(form.name);
                  } }
                >
                  <div className="w-full flex items-center justify-center slice.showPopupGiftRoll.gift.session">
                  <Image
                    src={`/images/forms/${form.name}-white.png`}
                    alt={`Glifo dos ${form.name}`}
                    className="object-cover object-top w-20 my-2"
                    width={800}
                    height={400}
                  />
                  </div>
                  <p className="w-full text-center text-sm py-2 text-white">{ form.name }</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}