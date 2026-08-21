import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter, hasReturningMaidenAihanLoresheet, removeAuspiceGiftsExceptGlobalOrTrybe, resolveGiftEntries, serializeGiftEntries } from "@/firebase/utilities";
import { useContext, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function ItemLoresheet(props: { item: any }) {
  const { item } = props;
  const [showLoresheet, setShowLoresheet] = useState(false);
  const { dataSheet, sheetId, session, email, setShowMessage } = useContext(contexto);

    const updateLoresheet = async (name: string, description: string, cost: number, skill: string) => {
    const obj = { name, cost, description, skill };
    const currentLoresheets = Array.isArray(dataSheet.data.advantagesAndFlaws.loresheets)
      ? [...dataSheet.data.advantagesAndFlaws.loresheets]
      : [];
    let newList = currentLoresheets;
    const hadReturningMaidenAihan = hasReturningMaidenAihanLoresheet(dataSheet.data);
    const findLoresheet = currentLoresheets.filter((flaw: any) => flaw.name === name);
    const dataPersist = findLoresheet.map((flaw: any) => `"${flaw.skill.split(':')[0].trim()} (${flaw.cost})"`).join(', ').replace(/, ([^,]+)$/, ' e $1');
    const equal = newList.find((listItem: any) => listItem.skill === skill);
    const different = newList.find((listItem: any) => listItem.name !== name);

    if (equal) newList = newList.filter((listItem: any) => listItem.skill !== skill);
    else if (different) {
      newList = newList.filter((listItem: any) => listItem.name === name);
      newList.push(obj);
    } else newList.push(obj);

    const nextSheetData = {
      ...dataSheet.data,
      advantagesAndFlaws: {
        ...dataSheet.data.advantagesAndFlaws,
        loresheets: newList,
      },
    };

    const hasReturningMaidenAihan = hasReturningMaidenAihanLoresheet(nextSheetData);
    const shouldRemoveAuspiceGifts = hadReturningMaidenAihan && !hasReturningMaidenAihan;
    const resolvedCurrentGifts = resolveGiftEntries(Array.isArray(dataSheet.data.gifts) ? dataSheet.data.gifts : []);
    const nextGifts = shouldRemoveAuspiceGifts
      ? serializeGiftEntries(removeAuspiceGiftsExceptGlobalOrTrybe(resolvedCurrentGifts, nextSheetData))
      : serializeGiftEntries(Array.isArray(dataSheet.data.gifts) ? dataSheet.data.gifts : []);

    const nextSheet = {
      ...dataSheet,
      data: {
        ...nextSheetData,
        gifts: nextGifts,
      },
    };

    dataSheet.data.advantagesAndFlaws.loresheets = newList;
    dataSheet.data.gifts = nextGifts;
    await updateDataPlayer(sheetId, nextSheet, setShowMessage);
    const findLrsheet = newList.filter((flaw: any) => flaw.name === name);
    const newPersist = findLrsheet.map((flaw: any) => `"${flaw.skill.split(':')[0].trim()} (${flaw.cost})"`).join(', ').replace(/, ([^,]+)$/, ' e $1');
    await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Loresheet ${name} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } de ${findLoresheet.length === 0 ? "''" : dataPersist} para ${findLrsheet.length === 0 ? "''" : newPersist}.`, type: 'notification' }, null, setShowMessage);
  };
  const verifySelected = () => item.habilities.find((adv: any) => dataSheet.data.advantagesAndFlaws.loresheets.find((item2: any) => item2.skill === adv.skillPtBr));
  const isSelected = Boolean(verifySelected());

  return (
    <div className={`${isSelected ? 'border-red-600 bg-black/85 shadow-[0_0_0_1px_rgba(248,113,113,0.42),0_0_22px_rgba(127,29,29,0.24)]' : 'border-white/10 bg-black/40'} overflow-hidden border transition-colors`}>
      <button type="button" onClick={() => setShowLoresheet(!showLoresheet)} className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-white/5">
        <div className="min-w-0 flex-1">
          <p className="font-kingthings text-[0.84rem] uppercase tracking-[0.18em] text-white">{item.titlePtBr}</p>
          {!showLoresheet && <p className="mt-1 line-clamp-2 font-geist-mono text-[10px] leading-5 text-white/55">{item.descriptionPtBr}</p>}
        </div>
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 bg-black/50 text-white/75">{showLoresheet ? <IoIosArrowUp className="text-lg" /> : <IoIosArrowDown className="text-lg" />}</span>
      </button>
      {showLoresheet && (
        <div className="border-t border-white/10 px-4 py-4">
          <p className="whitespace-pre-wrap font-geist-mono text-[11px] leading-6 text-white/72">{item.descriptionPtBr}</p>
          <div className="mt-4 space-y-3">
            {item.habilities.map((adv: any, index2: number) => {
              const optionSelected = dataSheet.data.advantagesAndFlaws.loresheets.find((item2: any) => item2.skill === adv.skillPtBr);
              return (
                <button key={`${item.titlePtBr}-${adv.skillPtBr}-${index2}`} type="button" onClick={() => updateLoresheet(item.titlePtBr, item.descriptionPtBr, adv.cost, adv.skillPtBr)} className={`${optionSelected ? 'border-red-500 bg-black/80 text-white shadow-[0_0_18px_rgba(127,29,29,0.24)]' : 'border-white/10 bg-black/35 text-white/78 hover:border-red-900 hover:bg-black/65 hover:text-white'} w-full border px-4 py-3 text-left transition-colors`}>
                  <p className="font-geist-mono text-[10px] uppercase tracking-[0.12em] text-red-300/85">Custo {adv.cost}</p>
                  <p className="mt-2 whitespace-pre-wrap font-geist-mono text-[11px] leading-6">{adv.skillPtBr}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}