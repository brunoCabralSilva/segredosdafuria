'use client'
import contexto from '@/context/context';
import { registerHistory } from '@/firebase/history';
import { updateDataPlayer } from '@/firebase/players';
import { capitalizeFirstLetter, translate } from '@/firebase/utilities';
import { useContext, useEffect, useMemo, useState } from 'react';
import { BsCheckSquare } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';

export default function ItemSkill(props: any) {
  const { name, quant } = props;
  const { dataSheet, session, email, sheetId, setShowMessage } = useContext(contexto);
  const sheetData = dataSheet?.data;
  const skillsData = sheetData?.skills;
  const currentSkill = useMemo(
    () => skillsData?.[name] ?? { value: 0, specialty: '' },
    [name, skillsData]
  );
  const [skill, setSkill] = useState<string>('');
  const [input, setInput] = useState(false);

  useEffect(() => {
    setSkill(currentSkill.specialty || '');
    setInput(false);
  }, [currentSkill.specialty, name]);

  const updateValue = async (value: number) => {
    if (!dataSheet || !sheetData || !skillsData) return;

    const dataPersist = currentSkill.value ?? 0;
    if (currentSkill.value === 1 && value === 1) skillsData[name] = { value: 0, specialty: skill };
    else skillsData[name] = { value, specialty: skill };
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a habilidade ${translate(name)} do personagem ${sheetData.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} ${dataPersist !== '' ? `de ${dataPersist} ` : ' '}para ${value}.`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  };

  const updateSpecialty = async () => {
    if (!dataSheet || !sheetData || !skillsData) return;

    const dataPersist = currentSkill.specialty || '';
    skillsData[name] = { value: currentSkill.value ?? 0, specialty: skill };
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a especialização da habilidade ${translate(name)} do personagem ${sheetData.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de '${dataPersist}' para '${skill}'.`,
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
        {points.map((_, index) => {
          const isFilled = Number(currentSkill.value || 0) >= index + 1;

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
              <div className="font-kingthings uppercase text-[0.74rem] tracking-[0.16em] text-white/70">{translate(name)}</div>
              {input ? (
                <input
                  type="text"
                  className="mt-2 w-full border-b border-red-700/55 bg-transparent pb-1 font- text-[0.63rem] tracking-[0.16em] text-zinc-200 outline-none placeholder:text-zinc-500"
                  placeholder=""
                  value={skill}
                  onChange={(e) => setSkill(e.target.value.replace(/\s+/g, ' '))}
                />
              ) : (
                <div className={`mt-2 ${specialtyText !== '' ? 'border-b' : ''} border-zinc-500/20 pb-1 font-kingthings uppercase text-[0.56rem] tracking-[0.22em] text-zinc-500`}>
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