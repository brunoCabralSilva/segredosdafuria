'use client'
import firebaseConfig from "@/firebase/connection";
import { authenticate, signIn } from "@/firebase/login";
import { getUserAndDataByIdSession, getUserByIdSession } from "@/firebase/sessions";
import { IItem } from "@/interface";
import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ItemAtr(props: IItem) {
  const [ attributes, setAttributes ] = useState<any>(0);
  const { name, namePtBr, quant } = props;
  const router = useRouter();
  const slice = useAppSelector(useSlice);

  useEffect(() => {
    returnValue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnValue = async (): Promise<void> => {
    const player = await getUserByIdSession(
      slice.sessionId,
      slice.userData.email,
    );
    if (player) {
      setAttributes(player.data.attributes[name]);
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
  };

  const updateValue = async (name: string, value: number) => {
    const getUser: any = await getUserAndDataByIdSession(slice.sessionId);
    const player = getUser.players.find((gp: any) => gp.email === slice.userData.email);
    if (player) {
      player.data.attributes[name] = value;
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