'use client'
import { ReactNode } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

type ManageCollectionFrameProps = {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  sidebar?: ReactNode;
  contentGridClassName?: string;
};

export default function ManageCollectionFrame(props: ManageCollectionFrameProps) {
  const { title, description, onClose, children, sidebar, contentGridClassName = '' } = props;

  const gridClassName = sidebar
    ? `grid h-full min-h-0 flex-1 gap-4 p-4 sm:p-5 md:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.78fr)] ${contentGridClassName}`.trim()
    : `grid h-full min-h-0 flex-1 gap-4 p-4 sm:p-5 ${contentGridClassName}`.trim();

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-3 py-4 backdrop-blur-[2px] sm:px-5">
      <div className="relative flex h-full max-h-[92vh] w-full max-w-[1180px] min-h-0 flex-col overflow-hidden border border-white/10 bg-gradient-to-br from-black via-zinc-950 to-red-950/40 text-white shadow-[0_0_32px_rgba(0,0,0,0.62)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(153,27,27,0.22),transparent_42%)]" />
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 border-b border-white/10 px-4 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-kingthings text-lg sm:text-xl">{title}</h2>
                {description && (
                  <p className="mt-1 max-w-3xl font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/70 sm:text-xs">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-black/45 text-white/75 transition-colors hover:border-red-900 hover:bg-red-950/60 hover:text-white"
                aria-label="Fechar popup"
              >
                <IoIosCloseCircleOutline className="text-[28px]" />
              </button>
            </div>
          </div>
          <div className={gridClassName}>
            <div className="h-full min-h-0 overflow-hidden">{children}</div>
            {sidebar && <aside className="hidden h-full min-h-0 overflow-hidden md:block">{sidebar}</aside>}
          </div>
        </div>
      </div>
    </div>
  );
}