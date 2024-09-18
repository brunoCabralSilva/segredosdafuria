'use client'
import contexto from "@/context/context";
import { getPlayerByEmail, updateDataPlayer } from "@/firebase/players";
import { useContext, useEffect, useState } from "react";

export default function ItemAgravated(props: any) {
  const [totalItem, setTotalItem] = useState(0);
  const { name, namePtBr } = props;
	const { sessionId, email, dataSheet, returnSheetValues, setShowMessage } = useContext(contexto);

  useEffect(() => {
    const returnValues = async (): Promise<void> => {
      if (name === 'willpower') setTotalItem(Number(dataSheet.attributes.composure) + Number(dataSheet.attributes.resolve));
      if (name === 'health') setTotalItem(Number(dataSheet.attributes.stamina) + 3);
    };
    returnValues();
  }, []);

  
  const updateValue = async (name: string, value: number) => {
    const player: any = await getPlayerByEmail(sessionId, email, setShowMessage);
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
			await updateDataPlayer(sessionId, email, player.data, setShowMessage);
    } else setShowMessage({ show: true, text: 'Jogador não encontrado! Por favor, atualize a página e tente novamente' });
    returnSheetValues();
  };

  const returnPoints = (name: string) => {
    const pointsRest = Array(totalItem).fill('');
    return ( 
      <div className="flex flex-wrap gap-2 pt-1">
        {
          pointsRest.map((item, index) => {
            const willpowerMap: number[] = dataSheet[name].map((element: any) => element.value);
            if (willpowerMap.includes(index + 1)) {
              const filterPoint = dataSheet[name].find((ht: any) => ht.value === index + 1 && ht.agravated === true);
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
    <div className={ `w-full ${ name === 'willpower' ? 'mt-8' : 'mt-4' }` }>
      <span className="capitalize">{ namePtBr } total: {totalItem}</span>
      <div className="w-full mt-1">
        { returnPoints(name) }
      </div>
    </div>
  );
}