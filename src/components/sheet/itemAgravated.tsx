'use client'
import firebaseConfig from "@/firebase/connection";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

interface IItem {
  name: string;
  namePtBr: string;
  session: string;
}

export default function ItemAgravated(props: IItem) {
  const [ dataItem, setDataItem ] = useState<any>([]);
  const [totalItem, setTotalItem] = useState(0);
  const { name, namePtBr, session } = props;

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
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        setDataItem(player.data[name]);
        if (name === 'willpower') setTotalItem(Number(player.data.attributes.composure) + Number(player.data.attributes.resolve));
        if (name === 'health') {
          if (player.data.form === 'Crinos') {
            setTotalItem(Number(player.data.attributes.stamina) + 7);
          } else {
            setTotalItem(Number(player.data.attributes.stamina) + 3);
          }
        }
      } catch (error) {
        window.alert(`Erro ao atualizar valor de ${namePtBr}: (' + error + ')`);
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
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        if (player.data[name].length === 0) {
          player.data[name] = [ { value, agravated: false }];
        } else {
          const itemAgravated = player.data[name].filter((item: any) => item.value === value && item.agravated === true);
          const restOfList = player.data[name].filter((item: any) => item.value !== value);
          if (itemAgravated.length > 0) {
            player.data[name] = restOfList;
          } else {
            const itemLetal = player.data[name].filter((item: any) => item.value === value);
            if (itemLetal.length === 0) {
              player.data[name] = [ ...restOfList, { value, agravated: false }];
            } else player.data[name] = [ ...restOfList, { value, agravated: true }];
          }
        }
        const docRef = userQuerySnapshot.docs[0].ref;
        const playersFiltered = players.filter((gp: any) => gp.email !== email);
        await updateDoc(docRef, { players: [...playersFiltered, player] });
      } catch (error) {
        window.alert(`Erro ao atualizar valor de ${name}: (' + error + ')`);
      }
    }
    returnValueWillpower();
  };

  const returnPoints = (name: string) => {
    const pointsRest = Array(totalItem).fill('');
    return ( 
      <div className="flex flex-wrap gap-2 pt-1">
        {
          pointsRest.map((item, index) => {
            const willpowerMap: number[] = dataItem.map((element: any) => element.value);
            if (willpowerMap.includes(index + 1)) {
              const filterPoint = dataItem.find((ht: any) => ht.value === index + 1 && ht.agravated === true);
              if (filterPoint) {
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
                  className="h-6 w-6 rounded-full bg-gray-500 border-white border-2 cursor-pointer"
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
      <span className="capitalize">{ namePtBr } total: {totalItem}</span>
      <div className="w-full mt-1">
        { returnPoints(name) }
      </div>
    </div>
  );
}