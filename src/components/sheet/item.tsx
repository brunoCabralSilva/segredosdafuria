'use client'
import { returnRageCheck } from "@/firebase/checks";
import firebaseConfig from "@/firebase/connection";
import { authenticate, signIn } from "@/firebase/login";
import { useAppDispatch } from "@/redux/hooks";
import { actionShowMenuSession } from "@/redux/slice";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IRage {
  name: string;
  namePtBr: string;
  quant: number;
  session: string;
}

export default function Item(props: IRage) {
  const [ valueItem, setValueItem ] = useState<any>([]);
  const { name, namePtBr, quant, session } = props;
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    returnValue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const returnValue = async (): Promise<void> => {
    const db = getFirestore(firebaseConfig);
    const authData: { email: string, name: string } | null = await authenticate();
    try {
      if (authData && authData.email && authData.name) {
        const { email } = authData;
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        setValueItem(player.data[name]);
      } else {
        const sign = await signIn();
        if (!sign) {
          window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
          router.push('/');
        }
      }
    } catch (error) {
      window.alert(`Erro ao atualizar valor de ${namePtBr}: (' + error + ')`)
    }
  };
  
  const updateValue = async (name: string, value: number) => {
    const db = getFirestore(firebaseConfig);
    const authData: { email: string, name: string } | null = await authenticate();
    try {
      if (authData && authData.email && authData.name) {
        const { email } = authData;
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        if (player.data[name] === 1 && value === 1) player.data[name] = 0;
        else player.data[name] = value;
        const docRef = userQuerySnapshot.docs[0].ref;
        const playersFiltered = players.filter((gp: any) => gp.email !== email);
        await updateDoc(docRef, { players: [...playersFiltered, player] });
      } else {
        const sign = await signIn();
        if (!sign) {
          window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
          router.push('/');
        }
      }
    } catch (error) {
      window.alert(`Erro ao atualizar valor de ${name}: (' + error + ')`);
    }
    returnValue();
  };

  const returnPoints = (name: string) => {
    const points = Array(quant).fill('');
    return (
      <div className="flex flex-wrap gap-2 pt-1">
        {
          points.map((item, index) => {
            if (valueItem >= index + 1) {
              return (
                <button
                  type="button"
                  onClick={ () => updateValue(name, index + 1) }
                  key={index}
                  className="h-6 w-6 rounded-full bg-black border-white border-2 cursor-pointer"
                />
              );
            } return (
              <button
                type="button"
                onClick={ () => updateValue(name, index + 1) }
                key={index}
                className="h-6 w-6 rounded-full bg-white border-white border-2 cursor-pointer"
              />
            );
          })
        }
      </div>
    );
  };

  return(
    <div className="w-full mt-8">
      <span className="capitalize">{ namePtBr }</span>
      <div className="flex flex-col items-center lg:flex-row">
        <div className="w-full">
          { returnPoints(name) }
        </div>
        {
          namePtBr === 'Fúria' &&
          <button
              className="mt-3 lg:mt-0 bg-white p-1 w-full cursor-pointer capitalize text-center text-black hover:font-bold hover:bg-black hover:text-white rounded border-2 border-black hover:border-white transition transition-colors duration-600"
              onClick={ () => {
                returnRageCheck(1, 'manual', session);
                dispatch(actionShowMenuSession(''))
              }}
            >
              Teste de Fúria
            </button>
        }
      </div>
    </div>
  );
}