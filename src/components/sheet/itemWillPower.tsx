'use client'
import firebaseConfig from "@/firebase/connection";
import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

interface IWillpower {
  name: string;
  namePtBr: string;
  quant: number;
}

export default function ItemWillpower(props: IWillpower) {
  const [ willpower, setWillpower ] = useState<any>([]);
  const [totalWillpower, setTotalWillpower] = useState(0);
  const { name, namePtBr, quant } = props;

  useEffect(() => {
    returnValueWillpower();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const returnValueWillpower = async (): Promise<void> => {
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
          setWillpower(userData.characterSheet[0].data.willpower);
          setTotalWillpower(Number(userData.characterSheet[0].data.attributes.composure) + Number(userData.characterSheet[0].data.attributes.resolve));
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        }
      } catch (error) {
        window.alert('Erro ao obter valor da Força de Vontade: ' + error);
      }
    }
  };
  
  const isEmpty = (obj: any) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };
  
  const updateValue = async (name: string, value: number) => {
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
            if (userData.characterSheet[0].data.willpower.length === 0) {
              userData.characterSheet[0].data.willpower = [ { value, agravated: false }];
            }
            else {
              const itemAgravated = userData.characterSheet[0].data.willpower.filter((item: any) => item.value === value && item.agravated === true);
              const restOfList = userData.characterSheet[0].data.willpower.filter((item: any) => item.value !== value);
              if (itemAgravated.length > 0) {
                userData.characterSheet[0].data.willpower = restOfList;
              } else {
                const itemLetal = userData.characterSheet[0].data.willpower.filter((item: any) => item.value === value);
                if (itemLetal.length === 0) {
                  userData.characterSheet[0].data.willpower = [ ...restOfList, { value, agravated: false }];
                } else userData.characterSheet[0].data.willpower = [ ...restOfList, { value, agravated: true }];
              }
            }
            await updateDoc(userDocRef, { characterSheet: userData.characterSheet });
          }
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        }
      } catch (error) {
        window.alert('Erro ao atualizar valor: (' + error + ')');
      }
    }
    returnValueWillpower();
  };

  const returnPoints = (name: string) => {
    const pointsRest = Array(quant).fill('');
    return ( 
      <div className="grid grid-cols-5 gap-1 pt-1">
        {
          pointsRest.map((item, index) => {
            const willpowerMap: number[] = willpower.map((element: any) => element.value);
            if (willpowerMap.includes(index + 1)) {
              const filterPoint = willpower.find((ht: any) => ht.value === index + 1 && ht.agravated === true);
              if (filterPoint) {
                return (
                  <button
                    type="button"
                    onClick={ () => updateValue(name, index + 1) }
                    key={index}
                    className="h-5 w-full bg-black border-black border-2 cursor-pointer"
                  />
                );
              } return (
                <button
                  type="button"
                  onClick={ () => updateValue(name, index + 1) }
                  key={index}
                  className="h-5 w-full bg-gray-500 border-black border-2 cursor-pointer"
                />
              );
            } return (
                <button
                  type="button"
                  onClick={ () => updateValue(name, index + 1) }
                  key={index}
                  className="h-5 w-full bg-white border-black border-2 cursor-pointer"
                />
              );
          })
        }
      </div>
    );
  };

  return(
    <div className="w-full mt-2">
      <span className="capitalize">{ namePtBr } total: {totalWillpower}</span>
      <div className="w-full">
        { returnPoints(name) }
      </div>
    </div>
  );
}