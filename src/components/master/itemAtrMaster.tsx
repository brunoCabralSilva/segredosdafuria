'use client'
import contexto from '@/context/context';
import { getPlayerByEmail, updateDataPlayer } from '@/firebase/players';
import { useContext } from "react";

export default function ItemAtrMaster(props: any) {
  const { value, name, namePtBr, quant } = props;
	const { session, viewPlayer, returnDataPlayer, dataSheet, setShowMessage } = useContext(contexto);

  const updateValue = async (name: string, value: number) => {
    const player: any = await getPlayerByEmail(session.id, viewPlayer.data.email, setShowMessage);
    if (player) {
			player.data.attributes[name] = value;
			await updateDataPlayer(session.id, viewPlayer.data.email, player.data, setShowMessage);
      returnDataPlayer(viewPlayer.data.email, session.id, null);
    } else setShowMessage({ show: true, text: 'Jogador não encontrado! Por favor, atualize a página e tente novamente' });
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
                    else setShowMessage({ show: true, text: 'Os Atributos só podem ser atualizados na forma Hominídea ou Lupina' })
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
                  else setShowMessage({ show: true, text: 'Os Atributos só podem ser atualizados na forma Hominídea ou Lupina' })
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