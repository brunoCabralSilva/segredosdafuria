'use client'
import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GiD10 } from "react-icons/gi";

export default function ItemAgravated(props: any) {
  const [totalItem, setTotalItem] = useState(0);
  const { name, namePtBr } = props;
  const pathname = usePathname();
  const isSheetStandalone = pathname?.startsWith('/sheets/');
  const { dataSheet, setShowMessage, sheetId, session, email, setShowWillpowerTest } = useContext(contexto);

  const hasAdvantage = (title: string) =>
    dataSheet.data.advantagesAndFlaws?.advantages?.some(
      (advantage: { title: string }) => advantage.title === title
    );

  const getStandaloneStaminaValue = () => {
    const currentValue = Number(dataSheet.data.attributes?.stamina || 0);

    if (!isSheetStandalone) return currentValue;

    if (dataSheet.data.form === 'Crinos') {
      return Math.max(0, currentValue - 4);
    }

    if (dataSheet.data.form === 'Hispo' || dataSheet.data.form === 'Glabro') {
      return Math.max(0, currentValue - (hasAdvantage('Resiliência de Luna') ? 4 : 2));
    }

    return currentValue;
  };

  useEffect(() => {
    const returnValues = async (): Promise<void> => {
      if (name === 'willpower') {
        setTotalItem(Number(dataSheet.data.attributes.composure) + Number(dataSheet.data.attributes.resolve));
      }

      if (name === 'health') {
        const findMaldicaoDaAncia = dataSheet.data.advantagesAndFlaws.flaws.find(
          (advantage: { title: string }) => advantage.title === 'Maldição da Anciã'
        );
        const findPeleEspessa = dataSheet.data.advantagesAndFlaws.advantages.find(
          (advantage: { title: string }) => advantage.title === 'Pele Espessa'
        );
        const staminaValue = getStandaloneStaminaValue();

        if (findMaldicaoDaAncia && findPeleEspessa) {
          setTotalItem(staminaValue + 3);
        } else if (findMaldicaoDaAncia) {
          setTotalItem(staminaValue + 2);
        } else if (findPeleEspessa) {
          setTotalItem(staminaValue + 4);
        } else {
          setTotalItem(staminaValue + 3);
        }
      }
    };

    returnValues();
  }, [dataSheet, name]);

  const updateValue = async (value: number) => {
    if (dataSheet) {
      const dataPersist = dataSheet.data[name].reduce((acc: any, item: any) => {
        item.agravated ? acc.agravated += 1 : acc.letal += 1;
        return acc;
      }, { agravated: 0, letal: 0 });
      const persistMessage = `Dano Agravado(${dataPersist.agravated}) e Dano Letal (${dataPersist.letal})`;

      if (dataSheet.data[name].length === 0) {
        dataSheet.data[name] = [{ value, agravated: false }];
      } else {
        const itemAgravated = dataSheet.data[name].filter((item: any) => item.value === value && item.agravated === true);
        const restOfList = dataSheet.data[name].filter((item: any) => item.value !== value);
        if (itemAgravated.length > 0) {
          dataSheet.data[name] = restOfList;
        } else {
          const itemLetal = dataSheet.data[name].filter((item: any) => item.value === value);
          if (itemLetal.length === 0) {
            dataSheet.data[name] = [...restOfList, { value, agravated: false }];
          } else {
            dataSheet.data[name] = [...restOfList, { value, agravated: true }];
          }
        }
      }
      await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      const newPersist = dataSheet.data[name].reduce((acc: any, item: any) => {
        item.agravated ? acc.agravated += 1 : acc.letal += 1;
        return acc;
      }, { agravated: 0, letal: 0 });
      const persistValue = `Dano Agravado(${newPersist.agravated}) e Dano Letal(${newPersist.letal})`;
      await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a ${namePtBr} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${persistMessage} para ${persistValue}.`, type: 'notification' }, null, setShowMessage);
    } else {
      setShowMessage({ show: true, text: 'Jogador não encontrado! Por favor, atualize a página e tente novamente' });
    }
  };

  return (
    <div className={`w-full ${name === 'willpower' ? 'mt-6' : 'mt-4'}`}>
      {isSheetStandalone ? <span className="capitalize">{namePtBr}:</span> : <>Dano em <span className="capitalize">{namePtBr}:</span></>}
      <div className="w-full mt-1 flex flex-between items-center">
        <div className="flex flex-wrap gap-2 pt-1 w-full">
          {
            Array(totalItem).fill('').map((_, index) => {
              if (isSheetStandalone) {
                return (
                  <button
                    type="button"
                    key={index}
                    className="h-6 w-6 bg-white border-white border-2 cursor-default"
                  />
                );
              }

              const willpowerMap: number[] = dataSheet.data[name].map((element: any) => element.value);
              if (willpowerMap.includes(index + 1)) {
                const filterPoint = dataSheet.data[name].find((ht: any) => ht.value === index + 1 && ht.agravated === true);
                if (filterPoint) {
                  return (
                    <button
                      type="button"
                      onClick={() => !isSheetStandalone && updateValue(index + 1)}
                      key={index}
                      className={`h-6 w-6 ${isSheetStandalone ? '' : 'rounded-full'} bg-black border-white border-2 ${isSheetStandalone ? 'cursor-default' : 'cursor-pointer'}`}
                    />
                  );
                }

                return (
                  <button
                    type="button"
                    onClick={() => !isSheetStandalone && updateValue(index + 1)}
                    key={index}
                    className={`h-6 w-6 ${isSheetStandalone ? '' : 'rounded-full'} bg-gray-500 border-white border-2 ${isSheetStandalone ? 'cursor-default' : 'cursor-pointer'}`}
                  />
                );
              }

              return (
                <button
                  type="button"
                  onClick={() => !isSheetStandalone && updateValue(index + 1)}
                  key={index}
                  className={`h-6 w-6 ${isSheetStandalone ? '' : 'rounded-full'} bg-white border-white border-2 ${isSheetStandalone ? 'cursor-default' : 'cursor-pointer'}`}
                />
              );
            })
          }
        </div>
        {
          !isSheetStandalone
          && namePtBr === "Força de Vontade"
          && <button
            className="text-3xl flex justify-center transition-colors text-white px-2"
            onClick={async () => setShowWillpowerTest(true)}
          >
            <GiD10 />
          </button>
        }
      </div>
    </div>
  );
}
