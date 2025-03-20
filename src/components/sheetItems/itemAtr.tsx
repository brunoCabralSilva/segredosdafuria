'use client'
import contexto from '@/context/context';
import { registerHistory } from '@/firebase/history';
import { updateDataPlayer } from '@/firebase/players';
import { capitalizeFirstLetter, translate } from '@/firebase/utilities';
import { useContext } from "react";

export default function ItemAtr(props: any) {
  const { value, name, namePtBr, quant } = props;
	const { sheetId, dataSheet, email, session, setShowMessage } = useContext(contexto);

  const updateValue = async (name: string, value: number) => {
    const dataPersist = dataSheet.data.attributes[name];
    dataSheet.data.attributes[name] = value;
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou o atributo ${translate(name)} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } ${dataPersist !== '' ? `de ${dataPersist} ` : ' '}para ${value}.`, type: 'notification' }, null, setShowMessage);
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
                    if (dataSheet.data.form === 'Hominídeo' || dataSheet.data.form === 'Lupino')
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
                  if (dataSheet.data.form === 'Hominídeo' || dataSheet.data.form === 'Lupino') updateValue(name, index + 1)
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