'use client'

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';

type DraggablePopupProps = {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  sizeClassName?: string;
  bodyClassName?: string;
  resizable?: boolean;
  allowBackgroundInteraction?: boolean;
};

type PopupPosition = {
  x: number;
  y: number;
};

const POPUP_PADDING = 12;

export default function DraggablePopup(props: DraggablePopupProps) {
  const {
    title,
    description,
    onClose,
    children,
    sizeClassName = 'w-[calc(100vw-1.5rem)] sm:w-[50vw] h-[50vh]',
    bodyClassName = '',
    resizable = false,
    allowBackgroundInteraction = false,
  } = props;

  const popupRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({ dragging: false, offsetX: 0, offsetY: 0 });
  const positionRef = useRef<PopupPosition | null>(null);
  const [position, setPosition] = useState<PopupPosition | null>(null);

  const getPopupBounds = useCallback(() => {
    const popup = popupRef.current;

    return {
      width: popup?.offsetWidth ?? 0,
      height: popup?.offsetHeight ?? 0,
    };
  }, []);

  const clampPosition = useCallback((nextX: number, nextY: number) => {
    const { width, height } = getPopupBounds();
    const maxX = Math.max(POPUP_PADDING, window.innerWidth - width - POPUP_PADDING);
    const maxY = Math.max(POPUP_PADDING, window.innerHeight - height - POPUP_PADDING);

    return {
      x: Math.min(Math.max(POPUP_PADDING, nextX), maxX),
      y: Math.min(Math.max(POPUP_PADDING, nextY), maxY),
    };
  }, [getPopupBounds]);

  const setPopupPosition = useCallback((nextPosition: PopupPosition) => {
    positionRef.current = nextPosition;
    setPosition(nextPosition);
  }, []);

  const centerPopup = useCallback(() => {
    const { width, height } = getPopupBounds();
    const centeredPosition = clampPosition(
      (window.innerWidth - width) / 2,
      (window.innerHeight - height) / 2,
    );

    setPopupPosition(centeredPosition);
  }, [clampPosition, getPopupBounds, setPopupPosition]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!dragStateRef.current.dragging || !positionRef.current) return;

    const nextPosition = clampPosition(
      event.clientX - dragStateRef.current.offsetX,
      event.clientY - dragStateRef.current.offsetY,
    );

    setPopupPosition(nextPosition);
  }, [clampPosition, setPopupPosition]);

  const stopDragging = useCallback(() => {
    dragStateRef.current.dragging = false;
    document.body.style.userSelect = '';
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', stopDragging);
  }, [handlePointerMove]);

  const startDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('[data-popup-close="true"]')) return;

    if (!positionRef.current) return;

    event.preventDefault();
    dragStateRef.current = {
      dragging: true,
      offsetX: event.clientX - positionRef.current.x,
      offsetY: event.clientY - positionRef.current.y,
    };

    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopDragging);
  };

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(centerPopup);

    const handleResize = () => {
      if (!positionRef.current) {
        centerPopup();
        return;
      }

      setPopupPosition(clampPosition(positionRef.current.x, positionRef.current.y));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      stopDragging();
    };
  }, [centerPopup, clampPosition, setPopupPosition, stopDragging]);

  useEffect(() => {
    const popup = popupRef.current;
    if (!popup || typeof ResizeObserver === 'undefined') return;

    const resizeObserver = new ResizeObserver(() => {
      if (!positionRef.current) {
        centerPopup();
        return;
      }

      const nextPosition = clampPosition(positionRef.current.x, positionRef.current.y);
      if (nextPosition.x !== positionRef.current.x || nextPosition.y !== positionRef.current.y) {
        setPopupPosition(nextPosition);
      }
    });

    resizeObserver.observe(popup);

    return () => resizeObserver.disconnect();
  }, [centerPopup, clampPosition, setPopupPosition]);

  return (
    <div className={`fixed inset-0 z-[140] ${allowBackgroundInteraction ? 'pointer-events-none' : ''}`.trim()}>
      {!allowBackgroundInteraction && <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px]" />}
      <div
        ref={popupRef}
        className={`pointer-events-auto absolute min-h-0 overflow-hidden border border-zinc-700/40 bg-gradient-to-br from-black via-zinc-950 to-[#140000] text-white shadow-[0_0_30px_rgba(0,0,0,0.68)] ${resizable ? 'min-h-[18rem] min-w-[18rem]' : ''} ${sizeClassName}`.trim()}
        style={position ? { left: position.x, top: position.y, resize: resizable ? 'both' : 'none' } : { visibility: 'hidden', resize: resizable ? 'both' : 'none' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.22),transparent_42%)]" />
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-black/78">
          <div
            className="flex cursor-move items-start justify-between gap-4 border-b border-white/10 px-4 py-3"
            onPointerDown={startDragging}
          >
            <div className="min-w-0">
              <p className="font-geist-mono text-[0.66rem] uppercase tracking-[0.2em] text-white">
                {title}
              </p>
              {description && (
                <p className="mt-1 font-geist-mono text-[0.58rem] uppercase tracking-[0.14em] text-white/55">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              data-popup-close="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-black/70 text-white/75 transition-colors hover:border-red-700 hover:bg-[#5f0000] hover:text-white"
              aria-label="Fechar popup"
            >
              <IoIosCloseCircleOutline className="text-2xl" />
            </button>
          </div>
          <div className={`principles-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 ${bodyClassName}`.trim()}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}