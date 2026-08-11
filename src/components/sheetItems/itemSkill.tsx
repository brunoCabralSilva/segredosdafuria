'use client'
import contexto from '@/context/context';
import { registerHistory } from '@/firebase/history';
import { updateDataPlayer } from '@/firebase/players';
import { capitalizeFirstLetter, translate } from '@/firebase/utilities';
import { useContext, useEffect, useState } from 'react';
import { BsCheckSquare } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';

export default function ItemSkill(props: any) {
  const { name, quant } = props;
  const { dataSheet, session, email, sheetId, setShowMessage } = useContext(contexto);
  const [skill, setSkill] = useState<string>(dataSheet.data.skills[name].specialty || '');
  const [input, setInput] = useState(false);

  useEffect(() => {
    setSkill(dataSheet.data.skills[name].specialty || '');
    setInput(false);
  }, [dataSheet, name]);

  const updateValue = async (value: number) => {
    const dataPersist = dataSheet.data.skills[name].value;
    if (dataSheet.data.skills[name].value === 1 && value === 1) dataSheet.data.skills[name] = { value: 0, specialty: skill };
    else dataSheet.data.skills[name] = { value, specialty: skill };
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a habilidade ${translate(name)} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} ${dataPersist !== '' ? `de ${dataPersist} ` : ' '}para ${value}.`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  };

  const updateSpecialty = async () => {
    const dataPersist = dataSheet.data.skills[name].specialty;
    dataSheet.data.skills[name] = { value: dataSheet.data.skills[name].value, specialty: skill };
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a especialização da habilidade ${translate(name)} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de '${dataPersist}' para '${skill}'.`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  };

  const returnPoints = () => {
    const points = Array(quant).fill('');

    return (
      <div className="flex flex-wrap justify-start gap-2 md:justify-end">
        {dataSheet &&
          dataSheet.data &&
          points.map((_, index) => {
            const isFilled = dataSheet.data.skills[name].value >= index + 1;

            return (
              <button
                type="button"
                onClick={() => updateValue(index + 1)}
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

  const specialtyText = skill.trim() !== '' ? skill : '';

  return (
    <div className="border-b border-white/[0.05] py-3 last:border-b-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setInput(true)}>
          <div className="flex items-start gap-2.5">
            <button
              type="button"
              onClick={(e: any) => {
                e.stopPropagation();
                if (input) {
                  updateSpecialty();
                  setInput(false);
                } else {
                  setInput(true);
                }
              }}
              className="sheet-readonly-action pt-[1px] text-red-500/85 transition-colors hover:text-red-400"
            >
              {input ? <BsCheckSquare className="text-base" /> : <FaRegEdit className="text-sm" />}
            </button>
            <div className="min-w-0 flex-1">
              <div className="font-kingthings text-[0.74rem] tracking-[0.16em] text-white/70">{translate(name)}</div>
              {input ? (
                <input
                  type="text"
                  className="mt-2 w-full border-b border-red-700/55 bg-transparent pb-1 font-kingthings text-[0.63rem] tracking-[0.16em] text-zinc-200 outline-none placeholder:text-zinc-500"
                  placeholder=""
                  value={skill}
                  onChange={(e) => setSkill(e.target.value.replace(/\s+/g, ' '))}
                />
              ) : (
                <div className={`mt-2 ${specialtyText !== '' ? 'border-b' : ''} border-zinc-500/20 pb-1 font-kingthings text-[0.56rem] tracking-[0.22em] text-zinc-500`}>
                  {specialtyText}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:max-w-[170px]">{returnPoints()}</div>
      </div>
    </div>
  );
}

