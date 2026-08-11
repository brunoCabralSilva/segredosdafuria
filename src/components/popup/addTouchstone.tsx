import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext, useEffect, useState } from "react";
import { SpecialRollFrame, specialRollActionButtonClass, specialRollLabelClass } from "./specialRollShared";

export default function AddTouchstone() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [listTouchstones, setListTouchstones] = useState<any[]>([]);
  const { email, session, sheetId, dataSheet, addTouchstone, setAddTouchstone, setShowMessage } = useContext(contexto);

  useEffect(() => {
    if (addTouchstone.data.name) {
      setName(addTouchstone.data.name);
      setDescription(addTouchstone.data.description || "");
      setListTouchstones(dataSheet.data.touchstones.filter((touchstone: any) => touchstone.name !== addTouchstone.data.name));
      return;
    }

    setName("");
    setDescription("");
    setListTouchstones(dataSheet.data.touchstones || []);
  }, [addTouchstone.data.description, addTouchstone.data.name, dataSheet.data.touchstones]);

  const createTouchstone = async () => {
    if (addTouchstone.data.name) {
      dataSheet.data.touchstones = listTouchstones;
      dataSheet.data.touchstones = [...dataSheet.data.touchstones, { name, description }];
      await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    } else {
      dataSheet.data.touchstones = [...dataSheet.data.touchstones, { name, description }];
      await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    }

    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} ${addTouchstone.data.name ? 'atualizou' : 'adicionou'} o Pilar ${name} ${addTouchstone.data.name ? 'do' : 'ao'} personagem${dataSheet.data.name !== '' ? ` ${dataSheet.data.name}` : ''}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}.` : '.'}`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
    setAddTouchstone({ show: false, data: {} });
  };

  const inputClass = 'h-9 w-full border border-white/10 bg-black/75 px-3 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white outline-none transition-colors placeholder:text-white/28 hover:border-red-700/70 focus:border-red-700/70';
  const textareaClass = 'principles-scrollbar min-h-[160px] w-full resize-none border border-white/10 bg-black/75 px-3 py-2 font-geist-mono text-[10px] leading-5 tracking-[0.05em] text-white outline-none transition-colors placeholder:text-white/28 hover:border-red-700/70 focus:border-red-700/70';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-3">
      <div className="w-full max-w-md">
        <SpecialRollFrame
          title={addTouchstone.data.name ? 'Editar Pilar' : 'Adicionar Pilar'}
          description="Pilares do personagem"
          onClose={() => setAddTouchstone({ show: false, data: {} })}
        >
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className={specialRollLabelClass}>Nome do Pilar</span>
              <input
                type="text"
                className={inputClass}
                value={name}
                onChange={(e) => {
                  const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                  setName(sanitizedValue);
                }}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={specialRollLabelClass}>Descrição</span>
              <textarea
                className={textareaClass}
                value={description}
                placeholder="Descreva quem é este pilar e o que ele representa para o personagem."
                onChange={(e) => {
                  const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                  setDescription(sanitizedValue);
                }}
              />
            </label>
            <button
              type="button"
              onClick={createTouchstone}
              className={`${specialRollActionButtonClass} bg-black text-white hover:border-red-800 hover:bg-[#190505]`}
            >
              {addTouchstone.data.name ? 'Atualizar Pilar' : 'Adicionar Pilar'}
            </button>
          </div>
        </SpecialRollFrame>
      </div>
    </div>
  );
}