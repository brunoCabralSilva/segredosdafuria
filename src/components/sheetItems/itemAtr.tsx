'use client'
import contexto from '@/context/context';
import { registerHistory } from '@/firebase/history';
import { updateDataPlayer } from '@/firebase/players';
import { capitalizeFirstLetter, translate } from '@/firebase/utilities';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';

export default function ItemAtr(props: any) {
  const { value, name, namePtBr, quant } = props;
  const pathname = usePathname();
  const isSheetStandalone = pathname?.startsWith('/sheets/');
  const { sheetId, dataSheet, email, session, setShowMessage } = useContext(contexto);

  const getStandaloneDisplayPenalty = (fieldName: string) => {
    if (!isSheetStandalone || !['strength', 'dexterity', 'stamina'].includes(fieldName)) return 0;

    if (dataSheet.data.form === 'Crinos') return 4;

    if (dataSheet.data.form === 'Hispo' || dataSheet.data.form === 'Glabro') {
      const hasResilienciaDeLuna = dataSheet.data.advantagesAndFlaws.advantages.some(
        (advantage: { title: string }) => advantage.title === 'Resiliência de Luna'
      );
      return hasResilienciaDeLuna ? 4 : 2;
    }

    return 0;
  };

  const updateValue = async (fieldName: string, nextValue: number) => {
    const dataPersist = dataSheet.data.attributes[fieldName];
    const persistValue = nextValue + getStandaloneDisplayPenalty(fieldName);
    dataSheet.data.attributes[fieldName] = persistValue;
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou o atributo ${translate(fieldName)} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} ${dataPersist !== '' ? `de ${dataPersist} ` : ' '}para ${persistValue}.`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  };

  const canEditAttribute = () => {
    return isSheetStandalone || dataSheet.data.form === 'Hominídeo' || dataSheet.data.form === 'Lupino';
  };

  const handlePointClick = (fieldName: string, nextValue: number) => {
    if (canEditAttribute()) {
      updateValue(fieldName, nextValue);
      return;
    }

    setShowMessage({ show: true, text: 'Os atributos só podem ser atualizados na forma Hominídea ou Lupina.' });
  };

  const returnPoints = (fieldName: string) => {
    const points = Array(quant).fill('');

    return (
      <div className="flex flex-wrap justify-start gap-2 md:justify-end">
        {points.map((_, index) => {
          const isFilled = value >= index + 1;

          return (
            <button
              type="button"
              onClick={() => handlePointClick(fieldName, index + 1)}
              key={index}
              className={[
                'h-4 w-4 shrink-0 rotate-45 border transition-colors',
                isFilled
                  ? 'border-red-300/70 bg-red-700/30 shadow-[0_0_10px_rgba(185,28,28,0.18)]'
                  : 'border-zinc-700 bg-transparent',
              ].join(' ')}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="border-b border-white/[0.05] py-3 last:border-b-0">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <span className="font-kingthings text-[0.78rem] uppercase tracking-[0.16em] text-white/70">{namePtBr}</span>
        <div className="md:max-w-[220px]">{returnPoints(name)}</div>
      </div>
    </div>
  );
}

