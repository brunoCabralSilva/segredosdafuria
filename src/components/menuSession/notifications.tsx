import { useContext, useMemo } from "react";
import contexto from "@/context/context";
import { IoIosCloseCircleOutline } from "react-icons/io";
import {
  approveSheetLinkRequest,
  approveUser,
  denySheetLinkRequest,
  removeNotification,
} from "@/firebase/notifications";

export default function Notifications() {
  const { session, sessionId, listNotification, setListNotification, setShowMessage } = useContext(contexto);

  const notifications = useMemo(() => [...listNotification], [listNotification]);

  const removeFromCache = (notification: any) => {
    const nextList = listNotification.filter(
      (currentNotification: any) => JSON.stringify(currentNotification) !== JSON.stringify(notification)
    );
    setListNotification(nextList);
  };

  const buttonClassName =
    "inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900";

  const renderActions = (notification: any) => {
    if (notification.type === "approval") {
      return (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => removeNotification(sessionId, notification.message, setShowMessage)}
            className={buttonClassName}
          >
            Negar
          </button>
          <button
            type="button"
            onClick={() => approveUser(notification, session, setShowMessage)}
            className={buttonClassName}
          >
            Aceitar
          </button>
        </div>
      );
    }

    if (notification.type === "sheet-link-request") {
      return (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => denySheetLinkRequest(notification, sessionId, setShowMessage)}
            className={buttonClassName}
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => approveSheetLinkRequest(notification, session, setShowMessage)}
            className={buttonClassName}
          >
            Vincular Ficha
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => removeNotification(sessionId, notification.message, setShowMessage)}
          className={buttonClassName}
        >
          Ok
        </button>
      </div>
    );
  };

  return (
    <div className="relative grid h-full min-h-0 w-full min-w-0 grid-rows-[auto,minmax(0,1fr)] overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-red-950/40 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(153,27,27,0.22),transparent_42%)]" />

      <div className="relative border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 text-white sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-kingthings text-lg sm:text-xl">Notificações</h2>
            <p className="mt-1 font-geist-mono text-[11px] sm:text-xs text-white/75">Acompanhe solicitações, avisos e ações pendentes da sessão em um único painel.</p>
          </div>
        </div>
      </div>

      <div className="principles-scrollbar relative min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6">
        {notifications.length === 0 ? (
          <div className="border border-white/15 bg-black/60 px-4 py-6 text-center font-geist-mono text-xs text-white/70">
            Voce não possui notificações.
          </div>
        ) : (
          <div className="grid grid-cols-1 content-start gap-3 pb-5">
            {notifications.map((notification: any, index: number) => (
              <div key={index} className="overflow-hidden border border-zinc-500/30 bg-black/70">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                  <p className="font-geist-mono text-[10px] font-extrabold uppercase tracking-[0.12em] text-red-200/80">
                    {notification.type === "approval"
                      ? "Aprovacao"
                      : notification.type === "sheet-link-request"
                        ? "Vinculo De Ficha"
                        : "Notificacao"}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFromCache(notification)}
                    className="inline-flex h-9 w-9 items-center justify-center border border-white/10 bg-black/40 text-white transition-colors hover:border-red-900 hover:bg-red-950/30"
                    aria-label="Remover da visualizacao"
                  >
                    <IoIosCloseCircleOutline className="text-2xl" />
                  </button>
                </div>
                <div className="space-y-4 px-4 py-4">
                  <p className="whitespace-pre-wrap font-geist-mono text-[11px] leading-relaxed text-white/85">
                    {notification.message}
                  </p>
                  {renderActions(notification)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}