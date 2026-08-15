'use client'

import { useState } from "react";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import DraggablePopup from "./draggablePopup";

type SessionSheetPickerProps = {
  players: any[];
  onClose: () => void;
  onSelectPlayer: (player: any) => void;
};

type SessionUserOption = {
  email: string;
  user: string;
  count: number;
};

export default function SessionSheetPicker(props: SessionSheetPickerProps) {
  const { players, onClose, onSelectPlayer } = props;
  const [selectedEmail, setSelectedEmail] = useState('');

  const userOptions: SessionUserOption[] = [];

  players.forEach((player: any) => {
    if (!player?.email) return;

    const existingOption = userOptions.find((option) => option.email === player.email);

    if (existingOption) {
      existingOption.count += 1;
      return;
    }

    userOptions.push({
      email: player.email,
      user: player.user || player.email,
      count: 1,
    });
  });

  const selectedUserSheets = selectedEmail === ''
    ? []
    : players.filter((player: any) => player?.email === selectedEmail);

  const getPlayerLabel = (player: any) => {
    if (player?.data?.name) {
      return `${player.data.name} (${capitalizeFirstLetter(player.user || player.email || 'usuario')})`;
    }

    return capitalizeFirstLetter(player?.user || player?.email || 'usuario');
  };

  const handleSelectUser = (userEmail: string) => {
    const matchingSheets = players.filter((player: any) => player?.email === userEmail);

    if (matchingSheets.length === 1) {
      onSelectPlayer(matchingSheets[0]);
      return;
    }

    setSelectedEmail(userEmail);
  };

  return (
    <DraggablePopup
      title="Selecionar usuário"
      description="Escolha um usuário para abrir a ficha na área principal da sessão."
      onClose={onClose}
      sizeClassName="w-[calc(100vw-1.5rem)] sm:w-[34rem] h-auto max-h-[80vh]"
      bodyClassName="space-y-4"
    >
      {
        userOptions.length === 0
          ? (
            <div className="border border-white/10 bg-black/60 px-4 py-5 text-center">
              <p className="font-geist-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/82">
                Nenhuma ficha foi encontrada nesta sessão.
              </p>
            </div>
          )
          : (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="font-geist-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#b7bcbc]">
                  Usuarios
                </p>
                <div className="grid gap-2">
                  {userOptions.map((option) => (
                    <button
                      key={option.email}
                      type="button"
                      onClick={() => handleSelectUser(option.email)}
                      className={`border px-3 py-3 text-left transition-colors ${
                        selectedEmail === option.email
                          ? 'border-[#7a0000] bg-black text-white'
                          : 'border-white/10 bg-black/70 text-white/78 hover:border-[#7a0000] hover:text-white'
                      }`}
                    >
                      <span className="block font-geist-mono text-[0.72rem] uppercase tracking-[0.16em]">
                        {capitalizeFirstLetter(option.user)}
                      </span>
                      <span className="mt-1 block font-geist-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#b7bcbc]">
                        {option.count} {option.count === 1 ? 'ficha' : 'fichas'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {
                selectedUserSheets.length > 1 && (
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-geist-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#b7bcbc]">
                        Escolha a ficha
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedEmail('')}
                        className="border border-white/10 bg-black/60 px-3 py-2 font-geist-mono text-[0.58rem] uppercase tracking-[0.14em] text-white/72 transition-colors hover:border-[#7a0000] hover:text-white"
                      >
                        Trocar usuário
                      </button>
                    </div>
                    <div className="grid gap-2">
                      {selectedUserSheets.map((player: any) => (
                        <button
                          key={player?.id || `${player?.email}-${player?.data?.name || player?.user || 'player'}`}
                          type="button"
                          onClick={() => onSelectPlayer(player)}
                          className="border border-white/10 bg-black/70 px-3 py-3 text-left text-white/82 transition-colors hover:border-[#7a0000] hover:text-white"
                        >
                          <span className="block font-geist-mono text-[0.7rem] uppercase tracking-[0.16em]">
                            {getPlayerLabel(player)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              }
            </div>
          )
      }
    </DraggablePopup>
  );
}