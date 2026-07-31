'use client'
import contexto from '@/context/context';
import { registerHistory } from '@/firebase/history';
import { updateDataPlayer } from '@/firebase/players';
import { capitalizeFirstLetter, translate } from '@/firebase/utilities';
import { usePathname } from 'next/navigation';
import { useContext } from "react";

export default function ItemAtr(props: any) {
  const { value, name, namePtBr, quant } = props;
  const pathname = usePathname();
  const isSheetStandalone = pathname?.startsWith('/sheets/');
  const { sheetId, dataSheet, email, session, setShowMessage } = useContext(contexto);

  const getStandaloneDisplayPenalty = (fieldName: string) => {
    if (!isSheetStandalone || !['strength', 'dexterity', 'stamina'].includes(fieldName)) return 0;

    if (dataSheet.data.form === 'Crinos') return 4;

    if (dataSheet.data.form === 'Hispo' || dataSheet.data.form === 'Glabro') {
      const hasResilienciaDeLuna = dataSheet.data.advantagesAndFlaws.advantages.some((advantage: { title: string }) => advantage.title === 'Resiliência de Luna');
      return hasResilienciaDeLuna ? 4 : 2;
    }

    return 0;
  };

  const updateValue = async (fieldName: string, nextValue: number) => {
    const dataPersist = dataSheet.data.attributes[fieldName];
    const persistValue = nextValue + getStandaloneDisplayPenalty(fieldName);
    dataSheet.data.attributes[fieldName] = persistValue;
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou o atributo ${translate(fieldName)} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} ${dataPersist !== '' ? `de ${dataPersist} ` : ' '}para ${persistValue}.`, type: 'notification' }, null, setShowMessage);
  };

  const returnPoints = (fieldName: string) => {
    const points = Array(quant).fill('');
    return (
      <div className="flex flex-wrap gap-2 pt-1">
        {
          points.map((_, index) => {
            if (value >= index + 1) {
              return (
                <button
                  type="button"
                  onClick={() => {
                    if (isSheetStandalone || dataSheet.data.form === 'Hominídeo' || dataSheet.data.form === 'Lupino') {
                      updateValue(fieldName, index + 1);
                    } else {
                      setShowMessage({ show: true, text: 'Os Atributos só podem ser atualizados na forma Hominídea ou Lupina' });
                    }
                  }}
                  key={index}
                  className="h-6 w-6 rounded-full bg-black border-white border-2 cursor-pointer"
                />
              );
            }

            return (
              <button
                type="button"
                onClick={() => {
                  if (isSheetStandalone || dataSheet.data.form === 'Hominídeo' || dataSheet.data.form === 'Lupino') {
                    updateValue(fieldName, index + 1);
                  } else {
                    setShowMessage({ show: true, text: 'Os Atributos só podem ser atualizados na forma Hominídea ou Lupina' });
                  }
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

  return (
    <div className="w-full mt-4">
      <span className="capitalize">{namePtBr} ({name})</span>
      <div className="w-full mt-1">
        {returnPoints(name)}
      </div>
    </div>
  );
}
