import contexto from "@/context/context";
import RequestSessionLink from "@/components/popup/requestSessionLink";
import { cancelSheetLinkRequest } from "@/firebase/notifications";
import { getSessionById } from "@/firebase/sessions";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function SessionLink() {
  const { dataSheet, sheetId, setShowMessage } = useContext(contexto);
  const [linkedSession, setLinkedSession] = useState<any>(null);
  const [showRequestPopup, setShowRequestPopup] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      if (!dataSheet?.sessionId) {
        setLinkedSession(null);
        return;
      }

      const session = await getSessionById(dataSheet.sessionId);
      setLinkedSession(session || null);
    };

    loadSession();
  }, [dataSheet]);

  const pendingRequest = dataSheet?.pendingSessionLink;

  const renderRequestBlock = (title: string, description: string) => (
    <div className="w-full border border-white bg-black p-4 text-center">
      <p className="font-bold text-lg">{title}</p>
      {pendingRequest ? (
        <>
          <p className="mt-3">
            Solicitação enviada para{" "}
            <span className="font-bold">{pendingRequest.sessionName}</span>.
          </p>
          <p className="mt-2 text-sm">{description}</p>
          <button
            type="button"
            onClick={() =>
              cancelSheetLinkRequest(sheetId, pendingRequest, setShowMessage)
            }
            className="inline-flex mt-4 border border-white px-4 py-2 font-bold hover:border-red-500 transition-colors cursor-pointer"
          >
            Cancelar solicitação
          </button>
        </>
      ) : (
        <>
          <p className="mt-3">
            Envie esta ficha para avaliação de um narrador e aguarde a aprovação.
          </p>
          <button
            type="button"
            onClick={() => setShowRequestPopup(true)}
            className="inline-flex mt-4 border border-white px-4 py-2 font-bold hover:border-red-500 transition-colors cursor-pointer"
          >
            Escolher sessão
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="w-full h-full flex items-start">
      <div className="w-full flex flex-col gap-2">
        {linkedSession ? (
          <div className="w-full border border-white bg-black p-4 text-center flex items-center justify-between gap-3">
            <p className="font-bold text-lg capitalize">{linkedSession.name}</p>
            <Link
              href={`/sessions/${linkedSession.id}`}
              className="inline-flex border border-white px-4 py-2 font-bold hover:border-red-500 transition-colors"
            >
              Abrir sessão
            </Link>
          </div>
        ) : (
          <div className="w-full border border-white bg-black p-4 text-center font-bold">
            Você não está vinculado a nenhuma sessão com essa ficha.
          </div>
        )}

        {linkedSession
          ? renderRequestBlock(
              "Solicitar vínculo com outra sessão",
              "O vínculo atual permanece até que o narrador aceite ou você cancele o pedido.",
            )
          : renderRequestBlock(
              "Solicitar vínculo com sessão",
              "Enquanto ela estiver pendente, esta ficha não pode ser enviada para outra sessão.",
            )}
      </div>

      {showRequestPopup && (
        <RequestSessionLink onClose={() => setShowRequestPopup(false)} />
      )}
    </div>
  );
}
