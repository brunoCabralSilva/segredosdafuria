'use client'
import { useContext } from 'react';
import contexto from '@/context/context';
import GiftsMechanic from './giftsMechanic';
import { SpecialRollFrame } from '../popup/specialRollShared';
import { getCurrentPoolSummary } from '../popup/poolDiceSummary';

export default function GiftRoll() {
  const { showGiftRoll, setShowGiftRoll, dataSheet } = useContext(contexto);
  const poolSummary = getCurrentPoolSummary(showGiftRoll.gift.pool, dataSheet?.data);

  return (
    <SpecialRollFrame
      title={`Dom: ${showGiftRoll.gift.giftPtBr || ''}`}
      description=""
      onClose={() => setShowGiftRoll({ show: false, gift: {} })}
    >
      <div className="flex flex-col gap-3">
        {showGiftRoll.gift.cost && (
          <div className="border-b border-white/5 pb-2 font-geist-mono text-[10px] leading-5 text-white/78">
            <span className="pr-1 uppercase tracking-[0.08em] text-white">Custo:</span>
            <span>{showGiftRoll.gift.cost}</span>
          </div>
        )}
        {showGiftRoll.gift.pool && (
          <div className="border-b border-white/5 pb-2 font-geist-mono text-[10px] leading-5 text-white/78">
            <span className="pr-1 uppercase tracking-[0.08em] text-white">Checagem:</span>
            <span>{showGiftRoll.gift.pool}</span>
            {poolSummary !== '' && (
              <p className="mt-1 text-white/60">
                <span className="pr-1 uppercase tracking-[0.08em] text-white">Parada atual:</span>
                <span>{poolSummary}</span>
              </p>
            )}
          </div>
        )}
        <div className="font-geist-mono text-[10px] leading-5 text-white/78">
          <span className="pr-1 uppercase tracking-[0.08em] text-white">Sistema:</span>
          <span>{showGiftRoll.gift.systemPtBr}</span>
        </div>
        <div className="border-t border-white/10 pt-3">
          <GiftsMechanic name={showGiftRoll.gift.gift} />
        </div>
      </div>
    </SpecialRollFrame>
  );
}