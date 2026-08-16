import contexto from "@/context/context";
import { authenticate } from "@/firebase/authenticate";
import { registerHistory } from "@/firebase/history";
import { updateSession } from "@/firebase/sessions";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SpecialRollFrame, specialRollActionButtonClass, specialRollLabelClass } from "./specialRollShared";

export default function AddPrinciple() {
  const [description, setDescription] = useState('');
  const [listPrinciples, setListPrinciples] = useState<any[]>([]);
  const {
    email,
    dataSheet,
    addPrinciple,
    setShowMessage,
    setAddPrinciple,
    session,
  } = useContext(contexto);
  const router = useRouter();

  useEffect(() => {
    if (addPrinciple.data.description) {
      setDescription(addPrinciple.data.description);
      setListPrinciples(session.principles.filter((principle: any) => principle.order !== addPrinciple.data.order));
      return;
    }

    setDescription('');
    setListPrinciples(session.principles || []);
  }, [addPrinciple.data.description, addPrinciple.data.order, session.principles]);

  const createPrinciple = async () => {
    const auth = await authenticate(setShowMessage);
    const newDataSession = session;
    if (auth) {
      if (addPrinciple.data.description) {
        const principleOwnerEmail = addPrinciple.data.email || auth.email;
        newDataSession.principles = listPrinciples;
        newDataSession.principles = [...newDataSession.principles, { email: principleOwnerEmail, description, order: newDataSession.principles.length + 1 }];
        await updateSession(newDataSession, setShowMessage);
      } else {
        newDataSession.principles = [...newDataSession.principles, { email: auth.email, description, order: newDataSession.principles.length + 1 }];
        await updateSession(newDataSession, setShowMessage);
      }
      await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} ${addPrinciple.data.description ? ' atualizou' : ' adicionou'} um Princípio ${addPrinciple.data.description ? 'do' : 'ao' } personagem${dataSheet.data.name !== '' ? ` ${dataSheet.data.name}` : ''}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}.` : '.' }`, type: 'notification' }, null, setShowMessage);
    } else router.push('/login');
    setAddPrinciple({ show: false, data: {} });
  };

  const textareaClass = 'principles-scrollbar min-h-[180px] w-full resize-none border border-white/10 bg-black/75 px-3 py-2 font-geist-mono text-[10px] leading-5 tracking-[0.05em] text-white outline-none transition-colors placeholder:text-white/28 hover:border-red-700/70 focus:border-red-700/70';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-3">
      <div className="w-full max-w-md">
        <SpecialRollFrame
          title={addPrinciple.data.description ? 'Editar Princípio' : 'Adicionar Princípio'}
          description="Princípios da crônica"
          onClose={() => setAddPrinciple({ show: false, data: {} })}
        >
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className={specialRollLabelClass}>Descrição do Princípio</span>
              <textarea
                className={textareaClass}
                value={description}
                placeholder="Descreva o princípio que deve orientar esta crônica."
                onChange={(e) => {
                  const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                  setDescription(sanitizedValue);
                }}
              />
            </label>
            <button
              type="button"
              onClick={createPrinciple}
              className={`${specialRollActionButtonClass} bg-black text-white hover:border-red-800 hover:bg-[#190505]`}
            >
              {addPrinciple.data.description ? 'Atualizar Princípio' : 'Adicionar Princípio'}
            </button>
          </div>
        </SpecialRollFrame>
      </div>
    </div>
  );
}