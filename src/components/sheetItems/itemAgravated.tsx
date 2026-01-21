'use client'
import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext, useEffect, useState } from "react";
import { GiD10 } from "react-icons/gi";

export default function ItemAgravated(props: any) {
  const [totalItem, setTotalItem] = useState(0);
  const { name, namePtBr } = props;
	const { dataSheet, setShowMessage, sheetId, session, email, setShowWillpowerTest } = useContext(contexto);

  useEffect(() => {
    const returnValues = async (): Promise<void> => {
      if (name === 'willpower') setTotalItem(Number(dataSheet.data.attributes.composure) + Number(dataSheet.data.attributes.resolve));
      if (name === 'health') setTotalItem(Number(dataSheet.data.attributes.stamina) + 3);
    };
    returnValues();
  }, []);

  
  const updateValue = async (value: number) => {
    if (dataSheet) {
      const dataPersist = dataSheet.data[name].reduce((acc: any, item: any) => {
        item.agravated ? acc.agravated += 1 : acc.letal += 1;
        return acc;
      }, { agravated: 0, letal: 0 });
      const persistMessage = `Dano Agravado(${dataPersist.agravated}) e Dano Letal (${dataPersist.letal})`;

      if (dataSheet.data[name].length === 0) {
        dataSheet.data[name] = [ { value, agravated: false }];
      } else {
        const itemAgravated = dataSheet.data[name].filter((item: any) => item.value === value && item.agravated === true);
        const restOfList = dataSheet.data[name].filter((item: any) => item.value !== value);
        if (itemAgravated.length > 0) {
          dataSheet.data[name] = restOfList;
        } else {
          const itemLetal = dataSheet.data[name].filter((item: any) => item.value === value);
          if (itemLetal.length === 0) {
            dataSheet.data[name] = [ ...restOfList, { value, agravated: false }];
          } else dataSheet.data[name] = [ ...restOfList, { value, agravated: true }];
        }
      }
			await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      const newPersist = dataSheet.data[name].reduce((acc: any, item: any) => {
        item.agravated ? acc.agravated += 1 : acc.letal += 1;
        return acc;
      }, { agravated: 0, letal: 0 });
      const persistValue = `Dano Agravado(${newPersist.agravated}) e Dano Letal(${newPersist.letal})`;
      await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a ${namePtBr} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } de ${persistMessage} para ${persistValue}.`, type: 'notification' }, null, setShowMessage);
    } else setShowMessage({ show: true, text: 'Jogador não encontrado! Por favor, atualize a página e tente novamente' });
  };

  return(
    <div className={ `w-full ${ name === 'willpower' ? 'mt-6' : 'mt-4' }` }>
      Dano em <span className="capitalize">{ namePtBr }:</span>
      <div className="w-full mt-1 flex flex-between items-center">
        <div className="flex flex-wrap gap-2 pt-1 w-full">
          {
            Array(totalItem).fill('').map((item, index) => {
              const willpowerMap: number[] = dataSheet.data[name].map((element: any) => element.value);
              if (willpowerMap.includes(index + 1)) {
                const filterPoint = dataSheet.data[name].find((ht: any) => ht.value === index + 1 && ht.agravated === true);
                if (filterPoint) {
                  return (
                    <button
                      type="button"
                      onClick={ () => updateValue(index + 1) }
                      key={index}
                      className="h-6 w-6 rounded-full bg-black border-white border-2 cursor-pointer"
                    />
                  );
                } return (
                  <button
                    type="button"
                    onClick={ () => updateValue(index + 1) }
                    key={index}
                    className="h-6 w-6 rounded-full bg-gray-500 border-white border-2 cursor-pointer"
                  />
                );
              } return (
                  <button
                    type="button"
                    onClick={ () => updateValue(index + 1) }
                    key={index}
                    className="h-6 w-6 rounded-full bg-white border-white border-2 cursor-pointer"
                  />
                );
            })
          }
        </div>
        {
          namePtBr == "Força de Vontade" &&
          <button
            className="text-3xl flex justify-center transition-colors text-white px-2"
            onClick={ async () => setShowWillpowerTest(true) }
          >
            <GiD10 />
          </button>
        }
      </div>
    </div>
  );
}