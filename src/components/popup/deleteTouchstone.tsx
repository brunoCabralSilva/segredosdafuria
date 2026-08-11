'use client'
import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext } from "react";
import { SpecialRollFrame, specialRollActionButtonClass, specialRollLabelClass } from "./specialRollShared";

export default function DeleteTouchstone() {
  const { email, session, sheetId, dataSheet, showDeleteTouchstone, setShowDeleteTouchstone, setShowMessage } = useContext(contexto);

  const deleteTouchstone = async () => {
    dataSheet.data.touchstones = dataSheet.data.touchstones.filter((touchstone: any) => touchstone.name !== showDeleteTouchstone.name);
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    setShowMessage({ show: true, text: 'O Pilar foi removido.' });
    setShowDeleteTouchstone({ show: false, name: '' });
    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} excluiu o Pilar ${showDeleteTouchstone.name} do personagem${dataSheet.data.name !== '' ? ` ${dataSheet.data.name}` : ''}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}.` : '.'}`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-3">
      <div className="w-full max-w-sm">
        <SpecialRollFrame
          title="Excluir Pilar"
          description={showDeleteTouchstone.name || 'Confirmação'}
          onClose={() => setShowDeleteTouchstone({ show: false, name: '' })}
        >
          <div className="flex flex-col gap-4">
            <div className="px-3 py-3">
              <p className={specialRollLabelClass}>Confirmação</p>
              <p className="mt-2 font-geist-mono text-[10px] uppercase tracking-[0.06em] text-white/74">
                Tem certeza de que quer excluir este pilar?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteTouchstone({ show: false, name: '' })}
                className={`${specialRollActionButtonClass} mt-0 bg-black text-white hover:border-red-800 hover:bg-[#190505]`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={deleteTouchstone}
                className={`${specialRollActionButtonClass} mt-0 border-red-900/70 bg-[#2a0606] text-white hover:border-red-700 hover:bg-[#450808]`}
              >
                Excluir Pilar
              </button>
            </div>
          </div>
        </SpecialRollFrame>
      </div>
    </div>
  );
}