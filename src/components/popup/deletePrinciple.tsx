'use client'
import contexto from "@/context/context";
import { updateSession } from "@/firebase/sessions";
import { useContext, useMemo } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

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
      setShowMessage({ show: true, text: "Nao foi possivel localizar o principio selecionado." });
      closePopup();
      return;
    }

    if (!canDeleteSelectedPrinciple) {
      setShowMessage({ show: true, text: "Voce nao tem permissao para apagar este principio." });
      closePopup();
      return;
    }

    const principleIndex = session.principles.findIndex((principle: any) => {
      const sameDescription = principle.description === selectedPrinciple.description;
      const sameOrder = principle.order === selectedPrinciple.order;
      return sameDescription && sameOrder;
    });

    if (principleIndex === -1) {
      setShowMessage({ show: true, text: "Nao foi possivel localizar o principio selecionado." });
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

  return(
    <div className="z-60 fixed top-0 left-0 flex h-screen w-full items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="relative flex w-full flex-col items-center justify-center overflow-y-auto border-2 border-white bg-black pb-5 sm:w-2/3 md:w-1/2">
        <div className="flex w-full justify-end px-2 pt-4 sm:pt-2">
          <IoIosCloseCircleOutline
            className="cursor-pointer text-4xl text-white"
            onClick={closePopup}
          />
        </div>
        <div className="w-full px-5 pb-5">
          <label htmlFor="palavra-passe" className="flex w-full flex-col items-center">
            <p className="w-full pb-3 text-center text-white">
              Tem certeza de que quer apagar este principio?
            </p>
          </label>

          {selectedPrinciple && (
            <div className="border border-white/15 bg-black/70 px-4 py-3 font-geist-mono text-xs text-white/80">
              {selectedPrinciple.description}
            </div>
          )}

          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={closePopup}
              className="mt-6 w-full cursor-pointer border-2 border-white bg-red-800 p-2 font-bold text-white transition-colors hover:border-red-900"
            >
              Nao
            </button>
            <button
              type="button"
              onClick={deletePrinciple}
              className="mt-6 w-full cursor-pointer border-2 border-white bg-green-whats p-2 font-bold text-white transition-colors hover:border-green-900 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!selectedPrinciple || !canDeleteSelectedPrinciple}
            >
              Sim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}