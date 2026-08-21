import { registerHistory } from '@/firebase/history';
import dataAdvAndFlaws from '../../data/advantagesAndFlaws.json';
import contexto from "@/context/context";
import { updateDataPlayer } from '@/firebase/players';
import { useContext, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { capitalizeFirstLetter } from '@/firebase/utilities';

export default function ItemAdvantage(props: { item: any; type: string }) {
  const { type, item } = props;
  const [showAdvantage, setShowAdvantage] = useState(false);
  const { email, session, sheetId, dataSheet, setShowMessage } = useContext(contexto);

  const updateAdvantageOrFlaw = async (
    name: string,
    cost: string,
    optionType: string,
    description: string,
    title: string,
    advOfFlaw: string,
  ) => {
    const obj = { name, cost, description, type: optionType, title };
    const aliadosEfetividade = dataSheet.data.advantagesAndFlaws.advantages.find((adv: { cost: number; description: string; name: string; title: string; type: string }) => adv.name == 'Aliados - Efetividade');
    const pactoEspiritual = dataSheet.data.advantagesAndFlaws.advantages.find((adv: { cost: number; description: string; name: string; title: string; type: string }) => adv.name == 'Pacto Espiritual');
    const temperamentoEquilibrado = dataSheet.data.advantagesAndFlaws.advantages.find((adv: { cost: number; description: string; name: string; title: string; type: string }) => adv.title === 'Temperamento Equilibrado');
    const amargurado = dataSheet.data.advantagesAndFlaws.flaws.find((flaw: { cost: number; description: string; name: string; title: string; type: string }) => flaw.title === 'Amargurado');
    const melancolico = dataSheet.data.advantagesAndFlaws.flaws.find((flaw: { cost: number; description: string; name: string; title: string; type: string }) => flaw.title === 'Melancólico');
    const homemLobo = dataSheet.data.advantagesAndFlaws.flaws.find((flaw: { cost: number; description: string; name: string; title: string; type: string }) => flaw.title === 'Homem-Lobo');
    const caoDoInferno = dataSheet.data.advantagesAndFlaws.flaws.find((flaw: { cost: number; description: string; name: string; title: string; type: string }) => flaw.title === 'Cão do Inferno');
    const menosMonstruoso = dataSheet.data.advantagesAndFlaws.flaws.find((flaw: { cost: number; description: string; name: string; title: string; type: string }) => flaw.title === 'Menos Monstruoso');

    if (name === 'Aliados - Confiabilidade' && !aliadosEfetividade) {
      setShowMessage({ show: true, text: 'A Vantagem "Aliados - Confiabilidade" só pode ser adquirida caso o personagem possua pelo menos 1 ponto em "Aliados - Efetividade".' });
    } else if (title === 'Temperamento Equilibrado' && (amargurado || melancolico)) {
      setShowMessage({ show: true, text: 'A Vantagem "Temperamento Equilibrado" não pode ser adquirida caso o personagem possua o Defeito "Amargurado" ou "Melancólico".' });
    } else if (advOfFlaw === 'flaw' && (title === 'Amargurado' || title === 'Melancólico') && temperamentoEquilibrado) {
      setShowMessage({ show: true, text: 'O Defeito "' + title + '" não pode ser adquirido caso o personagem possua a Vantagem "Temperamento Equilibrado".' });
    } else if (title === 'Menos Monstruoso' && (homemLobo || caoDoInferno)) {
      setShowMessage({ show: true, text: 'O Defeito "Menos Monstruoso" não pode ser adquirido caso o personagem possua "Homem-Lobo" ou "Cão do Inferno".' });
    } else if (advOfFlaw === 'flaw' && (title === 'Homem-Lobo' || title === 'Cão do Inferno') && menosMonstruoso) {
      setShowMessage({ show: true, text: 'O Defeito "' + title + '" não pode ser adquirido caso o personagem possua o Defeito "Menos Monstruoso".' });
    } else if ((title === 'Acompanhante' || title === 'Hospedeiro') && !pactoEspiritual) {
      setShowMessage({ show: true, text: 'A Vantagem "' + title + '" só pode ser adquirida caso o personagem possua pelo menos 1 ponto em "Pacto Espiritual - Espírito de Poder 1 / gafarete menor".' });
    } else if (title === 'Pacto Condicional' && !pactoEspiritual) {
      setShowMessage({ show: true, text: 'O Defeito "Pacto Condicional" só pode ser adquirido caso o personagem possua pelo menos 1 ponto em "Pacto Espiritual - Espírito de Poder 1 / gafarete menor".' });
    } else {
      let newList: any = [];
      let dataPersist = '';
      if (advOfFlaw === 'flaw') {
        newList = dataSheet.data.advantagesAndFlaws.flaws;
        const findFlaw = dataSheet.data.advantagesAndFlaws.flaws.filter((flaw: any) => flaw.name === name);
        dataPersist = findFlaw.map((flaw: any) => `"${flaw.title || flaw.description} (${flaw.cost})"`).join(', ').replace(/, ([^,]+)$/, ' e $1');
      } else {
        newList = dataSheet.data.advantagesAndFlaws.advantages;
        const findAdvantage = dataSheet.data.advantagesAndFlaws.advantages.filter((adv: any) => adv.name === name);
        dataPersist = findAdvantage.map((adv: any) => `"${adv.title || adv.description} (${adv.cost})"`).join(', ').replace(/, ([^,]+)$/, ' e $1');
      }

      if (newList.length === 0) newList.push(obj);
      else {
        const sameName = newList.filter((currentItem: any) => currentItem.name === name);
        if (sameName.length > 0) {
          const equal = newList.find((currentItem: any) => currentItem.description === description);
          if (equal) newList = newList.filter((currentItem: any) => currentItem.description !== description);
          else {
            if (optionType === 'radio') {
              newList = newList.filter((currentItem: any) => currentItem.name !== name || (currentItem.name === name && currentItem.type !== 'radio'));
              newList.push(obj);
            } else newList.push(obj);
          }
        } else newList.push(obj);
      }

      if (name === 'Aliados - Efetividade') newList = newList.filter((currentItem: any) => currentItem.name !== 'Aliados - Confiabilidade');

      const titlePactoEspiritual = title === 'Espírito de Poder 5 / jagrete médio'
        || title === 'Espírito de Poder 4 / jagrete menor'
        || title === 'Espírito de Poder 3 / gafarete maior ou jagrete inferior'
        || title === 'Espírito de Poder 2 / gafarete médio'
        || title === 'Espírito de Poder 1 / gafarete menor';

      if (titlePactoEspiritual) {
        newList = newList.filter((currentItem: any) => currentItem.title !== 'Acompanhante' && currentItem.title !== 'Hospedeiro');
        dataSheet.data.advantagesAndFlaws.flaws = dataSheet.data.advantagesAndFlaws.flaws.filter((flaw: any) => flaw.title !== 'Pacto Condicional');
      }

      if (advOfFlaw === 'flaw') dataSheet.data.advantagesAndFlaws.flaws = newList;
      else dataSheet.data.advantagesAndFlaws.advantages = newList;
      await updateDataPlayer(sheetId, dataSheet, setShowMessage);

      let newPersist = '';
      if (advOfFlaw === 'flaw') {
        const findFlaw = dataSheet.data.advantagesAndFlaws.flaws.filter((flaw: any) => flaw.name === name);
        newPersist = findFlaw.map((flaw: any) => `"${flaw.title || flaw.description} (${flaw.cost})"`).join(', ').replace(/, ([^,]+)$/, ' e $1');
      } else {
        const findAdvantage = dataSheet.data.advantagesAndFlaws.advantages.filter((adv: any) => adv.name === name);
        newPersist = findAdvantage.map((flaw: any) => `"${flaw.title || flaw.description} (${flaw.cost})"`).join(', ').replace(/, ([^,]+)$/, ' e $1');
      }

      await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou o ${advOfFlaw === 'flaw' ? 'Defeito' : 'Mérito/Background'} ${name} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } de ${dataPersist === '' ? "''" : dataPersist} para ${newPersist === '' ? "''" : newPersist}.`, type: 'notification' }, null, setShowMessage);
    }
  };

  const verifySelected = () => {
    if (type === 'flaw') return item.flaws.find((adv: any) => dataSheet.data.advantagesAndFlaws.flaws.find((item2: any) => item2.description === adv.description));
    return item.advantages.find((adv: any) => dataSheet.data.advantagesAndFlaws.advantages.find((item2: any) => item2.description === adv.description));
  };

  const entries = type === 'flaw' ? item.flaws : item.advantages;
  const isSelected = Boolean(verifySelected());

  return (
    <div>
      {((type === 'advantage' || type === 'flaw') && dataAdvAndFlaws) && (
        <div className={`${isSelected ? 'border-red-600 bg-black/85 shadow-[0_0_0_1px_rgba(248,113,113,0.42),0_0_22px_rgba(127,29,29,0.24)]' : 'border-white/10 bg-black/40'} overflow-hidden border transition-colors`}>
          <button type="button" onClick={() => setShowAdvantage(!showAdvantage)} className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-white/5">
            <div className="min-w-0 flex-1">
              <p className="font-kingthings text-[0.84rem] uppercase tracking-[0.18em] text-white">{item.name}</p>
              {item.description && !showAdvantage && <p className="mt-1 line-clamp-2 font-geist-mono text-[10px] leading-5 text-white/55">{item.description}</p>}
            </div>
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 bg-black/50 text-white/75">{showAdvantage ? <IoIosArrowUp className="text-lg" /> : <IoIosArrowDown className="text-lg" />}</span>
          </button>
          {showAdvantage && (
            <div className="border-t border-white/10 px-4 py-4">
              <p className="whitespace-pre-wrap font-geist-mono text-[11px] leading-6 text-white/72">{item.description}</p>
              <div className="mt-4 space-y-3">
                {entries.map((adv: any, index2: number) => {
                  const optionSelected = type === 'flaw'
                    ? dataSheet.data.advantagesAndFlaws.flaws.find((item2: any) => item2.description === adv.description)
                    : dataSheet.data.advantagesAndFlaws.advantages.find((item2: any) => item2.description === adv.description);
                  const suggestions = Array.isArray(adv.sugestions)
                    ? adv.sugestions
                    : Array.isArray(adv['sugestions:'])
                      ? adv['sugestions:']
                      : [];

                  return (
                    <button
                      key={`${item.name}-${index2}`}
                      type="button"
                      onClick={() => updateAdvantageOrFlaw(item.name, adv.cost, adv.type, adv.description, adv.title, type === 'flaw' ? 'flaw' : 'advantage')}
                      className={`${optionSelected ? 'border-red-500 bg-black/80 text-white shadow-[0_0_18px_rgba(127,29,29,0.24)]' : 'border-white/10 bg-black/35 text-white/78 hover:border-red-900 hover:bg-black/65 hover:text-white'} w-full border px-4 py-3 text-left transition-colors`}
                    >
                      <p className="font-geist-mono text-[10px] uppercase tracking-[0.12em] text-red-300/85">Custo {adv.cost}</p>
                      <p className="mt-2 whitespace-pre-wrap font-geist-mono text-[11px] leading-6">{adv.description}</p>
                      {suggestions.length > 0 && (
                        <div className="mt-3 border-l border-red-900/60 pl-3">
                          <p className="font-geist-mono text-[10px] uppercase tracking-[0.1em] text-red-300/75">Sugestões</p>
                          <div className="mt-2 space-y-2">
                            {suggestions.map((suggestion: string, suggestionIndex: number) => (
                              <p key={`${item.name}-${index2}-suggestion-${suggestionIndex}`} className="whitespace-pre-wrap font-geist-mono text-[10px] leading-5 text-white/70">
                                - {suggestion}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      {adv.title && <p className="mt-2 font-geist-mono text-[10px] uppercase tracking-[0.1em] text-white/55">{adv.title}</p>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}