'use client'
import contexto from "@/context/context";
import { updateSession } from "@/firebase/sessions";
import { useContext, useMemo } from "react";
import { SpecialRollFrame, specialRollActionButtonClass, specialRollLabelClass } from "./specialRollShared";

const EMPTY_DELETE_STATE = { show: false, description: "", order: null as number | null };

export default function DeletePrinciple() {
  const {
    email,
    session,
    showDeletePrinciple,
    setShowDeletePrinciple,
    setShowMessage,
  } = useContext(contexto);

  const selectedPrinciple = useMemo(() => {
    if (!Array.isArray(session?.principles)) return null;

    const exactMatch = session.principles.find((principle: any) => {
      const sameDescription = principle.description === showDeletePrinciple.description;
      const sameOrder = showDeletePrinciple.order === null || principle.order === showDeletePrinciple.order;
      return sameDescription && sameOrder;
    });

    if (exactMatch) return exactMatch;

    return session.principles.find(
      (principle: any) => principle.description === showDeletePrinciple.description
    ) ?? null;
  }, [session?.principles, showDeletePrinciple.description, showDeletePrinciple.order]);

  const canDeleteSelectedPrinciple = Boolean(selectedPrinciple) && (
    session?.gameMaster === email || selectedPrinciple.email === email
  );

  const closePopup = () => {
    setShowDeletePrinciple(EMPTY_DELETE_STATE);
  };

  const deletePrinciple = async () => {
    if (!Array.isArray(session?.principles) || !selectedPrinciple) {
      setShowMessage({ show: true, text: "Nao foi possivel localizar o princípio selecionado." });
      closePopup();
      return;
    }

    if (!canDeleteSelectedPrinciple) {
      setShowMessage({ show: true, text: "Você não tem permissão para apagar este princípio." });
      closePopup();
      return;
    }

    const principleIndex = session.principles.findIndex((principle: any) => {
      const sameDescription = principle.description === selectedPrinciple.description;
      const sameOrder = principle.order === selectedPrinciple.order;
      return sameDescription && sameOrder;
    });

    if (principleIndex === -1) {
      setShowMessage({ show: true, text: "Não foi possível localizar o princípio selecionado." });
      closePopup();
      return;
    }

    const nextPrinciples = session.principles
      .filter((_: any, index: number) => index !== principleIndex)
      .map((principle: any, index: number) => ({
        ...principle,
        order: index + 1,
      }));

    const newDataSession = {
      ...session,
      principles: nextPrinciples,
    };

    await updateSession(newDataSession, setShowMessage);
    setShowMessage({ show: true, text: "O principio foi removido." });
    closePopup();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-3">
      <div className="w-full max-w-sm">
        <SpecialRollFrame
          title="Excluir Princípio"
          description={selectedPrinciple?.description || 'Confirmação'}
          onClose={closePopup}
        >
          <div className="flex flex-col gap-4">
            <div className="px-3 py-1">
              <p className="mt-2 font-geist-mono text-[10px] uppercase tracking-[0.06em] text-white/74">
                Tem certeza de que quer apagar este princípio?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={closePopup}
                className={`${specialRollActionButtonClass} mt-0 bg-black text-white hover:border-red-800 hover:bg-[#190505]`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={deletePrinciple}
                className={`${specialRollActionButtonClass} mt-0 border-red-900/70 bg-[#2a0606] text-white hover:border-red-700 hover:bg-[#450808] disabled:cursor-not-allowed disabled:opacity-60`}
                disabled={!selectedPrinciple || !canDeleteSelectedPrinciple}
              >
                Excluir Princípio
              </button>
            </div>
          </div>
        </SpecialRollFrame>
      </div>
    </div>
  );
}