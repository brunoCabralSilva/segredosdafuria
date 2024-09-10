'use client'
import { returnRageCheck } from "@/firebase/checks";
import { getUserAndDataByIdSession, getUserByIdSession } from "@/firebase/sessions";
import { IItem } from "@/interface";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionShowMenuSession, useSlice } from "@/redux/slice";
import { updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Item(props: IItem) {
  const [ valueItem, setValueItem ] = useState<any>([]);
  const { name, namePtBr, quant } = props;
  const dispatch = useAppDispatch();
  const slice = useAppSelector(useSlice);

  useEffect(() => {
    returnValue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const returnValue = async (): Promise<void> => {
    const player = await getUserByIdSession(
      slice.sessionId,
      slice.userData.email,
    );
    if (player) {
      setValueItem(player.data[name]);
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
  };
  
  const updateValue = async (name: string, value: number) => {
    const getUser: any = await getUserAndDataByIdSession(slice.sessionId);
    const player = getUser.players.find((gp: any) => gp.email === slice.userData.email);
    if (player) {
      if (player.data[name] === 1 && value === 1) player.data[name] = 0;
      else player.data[name] = value;
      const playersFiltered = getUser.players.filter((gp: any) => gp.email !== slice.userData.email);
      await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
      returnValue();
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
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
              className="mt-3 lg:mt-0 bg-white p-1 w-full cursor-pointer capitalize text-center text-black hover:font-bold hover:bg-black hover:text-white rounded border-2 border-black hover:border-white transition-colors duration-600"
              onClick={ () => {
                returnRageCheck(1, 'manual', slice.sessionId, slice.userData);
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