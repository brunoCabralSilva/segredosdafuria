import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from '@/firebase/players';
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function ItemTalisman(props: { item: any }) {
  const { item } = props;
  const [showTalisman, setShowTalisman] = useState(false);
  const { email, session, sheetId, dataSheet, setShowMessage } = useContext(contexto);

  const updateTalen = async (name: string, description: string, value: number, type: string) => {
    const obj = { name, value, description, type };
    let newList = dataSheet.data.advantagesAndFlaws.talens;
    const findTls = dataSheet.data.advantagesAndFlaws.talens.filter((flaw: any) => flaw.name === name);
    const dataPersist = findTls.map((flaw: any) => `"${flaw.type} (${flaw.value})"`).join(', ').replace(/, ([^,]+)$/, ' e $1');
    if (newList.length === 0) newList.push(obj);
    else {
      const sameName = newList.filter((listItem: any) => listItem.name === name);
      if (sameName.length > 0) {
        const equal = newList.find((listItem: any) => listItem.name === name && listItem.value === value && listItem.type === type);
        if (equal) newList = newList.filter((listItem: any) => listItem.name !== name || (listItem.name === name && listItem.value !== value));
        else newList.push(obj);
      } else newList.push(obj);
    }
    dataSheet.data.advantagesAndFlaws.talens = newList;
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    const findTalen = dataSheet.data.advantagesAndFlaws.talens.filter((flaw: any) => flaw.name === name);
    const newPersist = findTalen.map((flaw: any) => `"${flaw.type} (${flaw.value})"`).join(', ').replace(/, ([^,]+)$/, ' e $1');
    await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou o Talismã ${name} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } de ${findTls.length === 0 ? "''" : dataPersist} para ${findTalen.length === 0 ? "''" : newPersist}.`, type: 'notification' }, null, setShowMessage);
  };

  const verifySelected = () => item.cost.find((adv: any) => dataSheet.data.advantagesAndFlaws.talens.find((item2: any) => item2.name === item.titlePtBr && item2.type === adv.type && item2.value === adv.value));
  const isSelected = Boolean(verifySelected());

  return (
    <div className={`${isSelected ? 'border-red-600 bg-black/85 shadow-[0_0_0_1px_rgba(248,113,113,0.42),0_0_22px_rgba(127,29,29,0.24)]' : 'border-white/10 bg-black/40'} overflow-hidden border transition-colors`}>
      <button type="button" onClick={() => setShowTalisman(!showTalisman)} className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-white/5">
        <div className="min-w-0 flex-1">
          <p className="font-kingthings text-[0.84rem] uppercase tracking-[0.18em] text-white">{item.titlePtBr}</p>
          {!showTalisman && <p className="mt-1 line-clamp-2 font-geist-mono text-[10px] leading-5 text-white/55">{item.descriptionPtBr}</p>}
        </div>
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 bg-black/50 text-white/75">{showTalisman ? <IoIosArrowUp className="text-lg" /> : <IoIosArrowDown className="text-lg" />}</span>
      </button>
      {showTalisman && (
        <div className="border-t border-white/10 px-4 py-4">
          <div className="space-y-2.5 font-geist-mono text-[11px] leading-6 text-white/72">
            <p className="whitespace-pre-wrap">{item.descriptionPtBr}</p>
            <p className="whitespace-pre-wrap">{item.systemPtBr}</p>
            <p className="whitespace-pre-wrap">{item.backgroundCostPtBr}</p>
          </div>
          <div className="mt-4 space-y-3">
            {item.cost.map((adv: any, index2: number) => {
              const optionSelected = dataSheet.data.advantagesAndFlaws.talens.find((item2: any) => item2.name === item.titlePtBr && item2.type === adv.type && item2.value === adv.value);
              return (
                <button key={`${item.titlePtBr}-${adv.type}-${index2}`} type="button" onClick={() => updateTalen(item.titlePtBr, item.descriptionPtBr, adv.value, adv.type)} className={`${optionSelected ? 'border-red-500 bg-black/80 text-white shadow-[0_0_18px_rgba(127,29,29,0.24)]' : 'border-white/10 bg-black/35 text-white/78 hover:border-red-900 hover:bg-black/65 hover:text-white'} w-full border px-4 py-3 text-left transition-colors`}>
                  <p className="font-geist-mono text-[10px] uppercase tracking-[0.12em] text-red-300/85">{adv.type}</p>
                  <p className="mt-2 font-geist-mono text-[11px] leading-6">Custo {adv.value}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}