'use client'
import contexto from '@/context/context';
import { getPlayerByEmail, updateDataPlayer } from '@/new/firebase/players';
import { useContext, useState } from "react";

export default function ItemAtr(props: any) {
  const { value, name, namePtBr, quant } = props;
	const { sessionId, email, returnSheetValues, dataSheet } = useContext(contexto);

  const updateValue = async (name: string, value: number) => {
    const player: any = await getPlayerByEmail(sessionId, email);
    if (player) {
			player.data.attributes[name] = value;
			await updateDataPlayer(sessionId, email, player.data);
      returnSheetValues();
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
  };

  const returnPoints = (name: string) => {
    const points = Array(quant).fill('');
    return (
      <div className="flex flex-wrap gap-2 pt-1">
        {
          points.map((item, index) => {
            if (value >= index + 1) {
              return (
                <button
                  type="button"
                  onClick={ () => {
                    if (dataSheet.form === 'Hominídeo' || dataSheet.form === 'Lupino')
                      updateValue(name, index + 1)
                    else window.alert('Os Atributos só podem ser atualizados na forma Hominídea ou Lupina')
                  }}
                  key={index}
                  className="h-6 w-6 rounded-full bg-black border-white border-2 cursor-pointer"
                />
              );
            } return (
              <button
                type="button"
                onClick={ () => {
                  if (dataSheet.form === 'Hominídeo' || dataSheet.form === 'Lupino') updateValue(name, index + 1)
                  else window.alert('Os Atributos só podem ser atualizados na forma Hominídea ou Lupina')
                }}
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