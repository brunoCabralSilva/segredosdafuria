'use client'
import { updateDataPlayer } from '@/firebase/players';
import ItemSkill from '../sheetItems/itemSkill';
import { useContext } from 'react';
import contexto from '@/context/context';
import { registerHistory } from '@/firebase/history';
import { capitalizeFirstLetter } from '@/firebase/utilities';

export default function Skills() {
  const { dataSheet, session, email, sheetId, setShowMessage } = useContext(contexto);

  const updateValue = async (value: string) => {
    const newDataSheet = dataSheet;
    const dataPersist = newDataSheet.data.skills.type;
    newDataSheet.data.skills.type = value;
    await updateDataPlayer(sheetId, newDataSheet, setShowMessage);
    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou o modelo de distribuição de habilidades do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} ${dataPersist !== '' ? `de ${dataPersist} ` : ' '}para ${value}.`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  };

  const sectionClass = 'relative overflow-hidden border border-zinc-500/30 bg-[#080c0d]/95 text-white shadow-[inset_0_0_60px_rgba(0,0,0,0.72)]';
  const titleClass = 'px-6 pb-3 pt-5 font-kingthings text-[0.82rem] uppercase tracking-[0.28em] text-red-500/85';
  const bodyClass = 'px-6 pb-5 pt-2';
  const selectClass = 'w-full border border-zinc-500/30 bg-black/60 px-4 py-2 font-kingthings text-[0.82rem] uppercase tracking-[0.18em] text-white/75 outline-none transition-colors hover:border-red-700/80 hover:text-white';

  return (
    <div className="mt-2 sm:mt-5 w-full text-white">
      <div className="mb-2 sm:mb-4 flex justify-end w-full">
        <select className={selectClass} value={dataSheet.data.skills.type} onChange={(e) => updateValue(e.target.value)}>
          <option disabled value="">Escolha um modelo de distribuição de Habilidades</option>
          <option value="Pau pra toda Obra">Pau pra toda obra (Modelo de Distribuição de Habilidades)</option>
          <option value="Equilibrado">Equilibrado (Modelo de Distribuição de Habilidades)</option>
          <option value="Especialista">Especialista (Modelo de Distribuição de Habilidades)</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:gap-5 xl:grid-cols-3">
        <section className={sectionClass}>
          <div>
            <p className={titleClass}>Habilidades Físicas</p>
            <div className="mx-6 border-b border-zinc-500/20" />
            <div className={bodyClass}>
              <ItemSkill name="athletics" quant={5} />
              <ItemSkill name="brawl" quant={5} />
              <ItemSkill name="craft" quant={5} />
              <ItemSkill name="driving" quant={5} />
              <ItemSkill name="firearms" quant={5} />
              <ItemSkill name="larceny" quant={5} />
              <ItemSkill name="melee" quant={5} />
              <ItemSkill name="stealth" quant={5} />
              <ItemSkill name="survival" quant={5} />
            </div>
          </div>
        </section>
        <section className={sectionClass}>
          <div>
            <p className={titleClass}>Habilidades Sociais</p>
            <div className="mx-6 border-b border-zinc-500/20" />
            <div className={bodyClass}>
              <ItemSkill name="animalKen" quant={5} />
              <ItemSkill name="etiquette" quant={5} />
              <ItemSkill name="insight" quant={5} />
              <ItemSkill name="intimidation" quant={5} />
              <ItemSkill name="leadership" quant={5} />
              <ItemSkill name="performance" quant={5} />
              <ItemSkill name="persuasion" quant={5} />
              <ItemSkill name="streetwise" quant={5} />
              <ItemSkill name="subterfuge" quant={5} />
            </div>
          </div>
        </section>
        <section className={sectionClass}>
          <div>
            <p className={titleClass}>Habilidades Mentais</p>
            <div className="mx-6 border-b border-zinc-500/20" />
            <div className={bodyClass}>
              <ItemSkill name="academics" quant={5} />
              <ItemSkill name="awareness" quant={5} />
              <ItemSkill name="finance" quant={5} />
              <ItemSkill name="investigation" quant={5} />
              <ItemSkill name="medicine" quant={5} />
              <ItemSkill name="occult" quant={5} />
              <ItemSkill name="politics" quant={5} />
              <ItemSkill name="science" quant={5} />
              <ItemSkill name="technology" quant={5} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

