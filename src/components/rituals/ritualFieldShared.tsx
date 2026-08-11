import { ReactNode } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import {
  specialRollActionButtonClass,
  specialRollCounterButtonClass,
  specialRollDisabledCounterButtonClass,
  specialRollLabelClass,
  specialRollSelectClass,
  specialRollValueClass,
} from "../popup/specialRollShared";

export const ritualParticipantsLabel = "Quantidade de participantes (que têm pelo menos um ponto de Fúria), além do Mestre do Ritual, que estão participando. Cada outro participante soma um dado de Fúria à parada.";
export const ritualKnownParticipantsLabel = "Dentre os informados acima, cite quantos participantes, além do Mestre do Ritual, conhecem o Ritual. Cada um deles soma um dado de Fúria e um dado comum à parada.";
export const ritualPenaltyLabel = "Penalidade (-) ou bônus (+) para o teste";
export const ritualSectionClass = "mb-4 flex w-full flex-col items-center";
export const ritualDescriptionClass = `${specialRollLabelClass} normal-case text-[10px] leading-5 tracking-[0.05em] text-white/72`;
export const ritualActionButtonClass = `${specialRollActionButtonClass} bg-black text-white hover:border-red-800 hover:bg-[#190505]`;
export const ritualDisabledActionButtonClass = "cursor-not-allowed border-white/10 bg-zinc-700 text-black/70";
export const ritualSelectClass = `${specialRollSelectClass} mb-4 text-[10px]`;
export const ritualCheckboxLabelClass = "mb-4 flex w-full cursor-pointer items-start gap-2 border border-white/10 bg-black/55 px-2.5 py-2 font-geist-mono text-[10px] uppercase tracking-[0.06em] text-white/78";
export const ritualCheckboxInputClass = "mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#7f1d1d]";

export function RitualCounterField(props: {
  label: ReactNode,
  value: number,
  decreaseDisabled: boolean,
  increaseDisabled: boolean,
  onDecrease: () => void,
  onIncrease: () => void,
}) {
  const { label, value, decreaseDisabled, increaseDisabled, onDecrease, onIncrease } = props;

  return (
    <label className={ritualSectionClass}>
      <p className={ritualDescriptionClass}>{label}</p>
      <div className="flex w-full items-stretch gap-px bg-white/10">
        <button
          type="button"
          disabled={decreaseDisabled}
          className={`${specialRollCounterButtonClass} ${decreaseDisabled ? specialRollDisabledCounterButtonClass : "hover:border-red-700/70 hover:bg-[#140404]"}`}
          onClick={onDecrease}
        >
          <FaMinus />
        </button>
        <div className={specialRollValueClass}>{value}</div>
        <button
          type="button"
          disabled={increaseDisabled}
          className={`${specialRollCounterButtonClass} ${increaseDisabled ? specialRollDisabledCounterButtonClass : "hover:border-red-700/70 hover:bg-[#140404]"}`}
          onClick={onIncrease}
        >
          <FaPlus />
        </button>
      </div>
    </label>
  );
}