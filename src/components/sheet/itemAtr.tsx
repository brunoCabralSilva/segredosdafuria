'use client'
import firebaseConfig from "@/firebase/connection";
import { authenticate, signIn } from "@/firebase/login";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IAtr {
  name: string;
  namePtBr: string;
  quant: number;
  session: string;
}

export default function ItemAtr(props: IAtr) {
  const [ attributes, setAttributes ] = useState<any>(0);
  const { name, namePtBr, quant, session } = props;
  const router = useRouter();

  useEffect(() => {
    returnValueAttribute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const returnValueAttribute = async (): Promise<void> => {
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
        setAttributes(player.data.attributes[name]);
      } else {
        const sign = await signIn();
        if (!sign) {
          window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
          router.push('/');
        }
      }
    } catch (error) {
      window.alert('Erro ao obter valor da Forma: ' + error);
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
        player.data.attributes[name] = value;
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
      window.alert('Erro ao obter valor: ' + error);
    }    
    returnValueAttribute();
  };

  const returnPoints = (name: string) => {
    const points = Array(quant).fill('');
    return (
      <div className="flex flex-wrap gap-2 pt-1">
        {
          points.map((item, index) => {
            if (attributes >= index + 1) {
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
    <div className="w-full mt-4">
      <span className="capitalize">{ namePtBr } ({ name })</span>
      <div className="w-full mt-1">
        { returnPoints(name) }
      </div>
    </div>
  );
}