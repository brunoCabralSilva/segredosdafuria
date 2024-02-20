'use client'
import { getUserAndDataByIdSession, getUserByIdSession } from "@/firebase/sessions";
import { IItem } from "@/interface";
import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import { updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function ItemAgravated(props: IItem) {
  const [ dataItem, setDataItem ] = useState<any>([]);
  const [totalItem, setTotalItem] = useState(0);
  const { name, namePtBr } = props;
  const slice = useAppSelector(useSlice);

  useEffect(() => {
    returnValueWillpower();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const returnValueWillpower = async (): Promise<void> => {
    const player = await getUserByIdSession(
      slice.sessionId,
      slice.userData.email,
    );
    if (player) {
      setDataItem(player.data[name]);
      if (name === 'willpower') setTotalItem(Number(player.data.attributes.composure) + Number(player.data.attributes.resolve));
      if (name === 'health') {
        if (player.data.form === 'Crinos') {
          setTotalItem(Number(player.data.attributes.stamina) + 7);
        } else {
          setTotalItem(Number(player.data.attributes.stamina) + 3);
        }
      }
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');    
  };
  
  const updateValue = async (name: string, value: number) => {
    const getUser: any = await getUserAndDataByIdSession(slice.sessionId);
    const player = getUser.players.find((gp: any) => gp.email === slice.userData.email);
    if (player) {
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
      const playersFiltered = getUser.players.filter((gp: any) => gp.email !== slice.userData.email);
      await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
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