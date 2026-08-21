'use client'
import { useContext } from "react";
import dataForms from '../../data/forms.json';
import Image from 'next/image';
import contexto from "@/context/context";
import { updateDataPlayer, updateDataWithRage } from "@/firebase/players";
import { registerMessage } from "@/firebase/messagesAndRolls";
import { registerHistory } from "@/firebase/history";
import { capitalizeFirstLetter, normalizeHealthTrackForFormChange } from "@/firebase/utilities";

export default function Forms() {
  const {
    email,
    session,
    dataSheet,
    sessionId,
    sheetId,
    setShowMessage,
  } = useContext(contexto);
  const sheetData = dataSheet?.data;

  const openSessionChat = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('session:open-action-result'));
    }
  };

  const applyFormChange = (previousForm: string, newForm: string) => {
    if (!dataSheet?.data) return;

    dataSheet.data.health = normalizeHealthTrackForFormChange(dataSheet.data, previousForm, newForm);
    dataSheet.data.form = newForm;
  };

  const handleCrinosToHybridTransition = async (actualForm: string, newForm: string) => {
    if (!dataSheet?.data) return;

    const previousRage = Number(dataSheet.data.rage || 0);
    if (previousRage <= 0) {
      setShowMessage({
        show: true,
        text: `O personagem ${dataSheet.data.name} não possui Fúria para realizar esta ação (Mudar para a forma ${newForm}).`,
      });
      return;
    }

    dataSheet.data.rage = 1;
    const rollOfRage = [Math.floor(Math.random() * 10) + 1];
    const success = rollOfRage[0] >= 6 ? 1 : 0;
    let resultingForm = newForm;
    let result = `Obteve sucesso na Checagem. A Fúria foi reduzida para 1 e o personagem assumiu a forma ${newForm}.`;

    if (success === 0) {
      dataSheet.data.rage = 0;
      resultingForm = 'Hominídeo';
      result = 'Não obteve sucesso na Checagem. A Fúria caiu para 0, o personagem perdeu o lobo e voltou para a forma Hominídeo.';
    }

    applyFormChange(actualForm, resultingForm);

    await registerMessage(
      sessionId,
      {
        message: `Foi realizada uma Checagem de Fúria para o personagem "${dataSheet.data.name}" ao sair da forma Crinos e tentar assumir a forma ${newForm}.`,
        rollOfRage,
        result,
        rage: dataSheet.data.rage,
        success,
        user: dataSheet.user,
        type: 'rage-check',
      },
      email,
      setShowMessage,
    );

    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${actualForm} para ${resultingForm} (Fúria ajustada de ${previousRage} para ${dataSheet.data.rage} ao sair da forma Crinos${success === 0 ? ' e o personagem perdeu o lobo' : ''}).`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
    openSessionChat();
  };
  const updateValue = async (newForm: string) => {
    if (!dataSheet || !sheetData) return;

    const actualForm = sheetData.form;
    const isCrinosToHybridTransition = actualForm === 'Crinos' && (newForm === 'Hispo' || newForm === 'Glabro');

    if (session.typeSession === 'Regras Alternativas') {
      if (dataSheet.data.rage >= 5) {
        setShowMessage({
          show: true,
          text: `O personagem ${dataSheet.data.name} possui Fúria 5, se encontra em Frenesi e não pode realizar nenhuma ação que não seja atacar ou sair do mesmo (caso seja possível no momento).`,
        });
      } else if (newForm !== actualForm) {
        if (newForm === 'Hominídeo' || newForm === 'Lupino') {
          if (actualForm === 'Crinos') {
            await registerMessage(sessionId, { message: `O personagem ${dataSheet.data.name} Mudou para a forma ${newForm}.`, type: 'transform' }, email, setShowMessage);
            await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${actualForm} para ${newForm}.`, type: 'notification' }, null, setShowMessage);
          } else if (actualForm === 'Hispo' || actualForm === 'Glabro') {
            await registerMessage(sessionId, { message: `O personagem ${dataSheet.data.name} Mudou para a forma ${newForm}.`, type: 'transform' }, email, setShowMessage);
            await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${actualForm} para ${newForm}.`, type: 'notification' }, null, setShowMessage);
          } else {
            await registerMessage(sessionId, { message: `O personagem ${dataSheet.data.name} Mudou para a forma ${newForm}.`, type: 'transform' }, email, setShowMessage);
            await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${actualForm} para ${newForm}.`, type: 'notification' }, null, setShowMessage);
          }
              applyFormChange(actualForm, newForm);
          await updateDataPlayer(sheetId, dataSheet, setShowMessage);
        } else if (newForm === 'Crinos') {
          if (dataSheet.data.rage === 0) {
            setShowMessage({
              show: true,
              text: `O personagem ${dataSheet.data.name} não possui Fúria para realizar esta ação (Mudar para a forma Crinos).`,
            });
          } else {
            const oldRage = dataSheet.data.rage;
            applyFormChange(actualForm, newForm);
            await updateDataWithRage(session.typeSession, sessionId, email, sheetId, dataSheet, newForm, setShowMessage);
            await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${actualForm} para ${dataSheet.data.form} (${oldRage === dataSheet.data.rage ? 'Não houve aumento de Fúria' : `Fúria atualizada de ${oldRage} para ${dataSheet.data.rage}${dataSheet.data.rage >= 5 ? ' e o personagem entrou em Frenesi)' : ''}`}).`, type: 'notification' }, null, setShowMessage);
            openSessionChat();
          }
        } else {
          if (dataSheet.data.rage === 0) {
            setShowMessage({
              show: true,
              text: `O personagem ${dataSheet.data.name} não possui Fúria para realizar esta ação (Mudar para a forma ${newForm}).`,
            });
          } else {
            applyFormChange(actualForm, newForm);
            const oldRage = dataSheet.data.rage;
            await updateDataWithRage(session.typeSession, sessionId, email, sheetId, dataSheet, newForm, setShowMessage);
            await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${actualForm} para ${dataSheet.data.form} (${oldRage === dataSheet.data.rage ? 'Não houve aumento de Fúria' : `Fúria atualizada de ${oldRage} para ${dataSheet.data.rage}${dataSheet.data.rage >= 5 ? ' e o personagem entrou em Frenesi)' : ''}`}).`, type: 'notification' }, null, setShowMessage);
            openSessionChat();
          }
        }
      }
    } else {
      if (newForm !== actualForm) {
        if (newForm === 'Hominídeo' || newForm === 'Lupino') {
          if (actualForm === 'Crinos') {
            if (dataSheet.data.rage > 0) {
              dataSheet.data.rage = 1;
              await registerMessage(sessionId, { message: `O personagem ${dataSheet.data.name} Mudou para a forma ${newForm}. Fúria reduzida para 1 por ter saído da forma Crinos.`, type: 'transform' }, email, setShowMessage);
              await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${actualForm} para ${newForm} (Fúria reduzida para 1 por ter saído da forma Crinos.).`, type: 'notification' }, null, setShowMessage);
            }
          } else if (actualForm === 'Hispo' || actualForm === 'Glabro') {
            await registerMessage(sessionId, { message: `O personagem ${dataSheet.data.name} Mudou para a forma ${newForm}.`, type: 'transform' }, email, setShowMessage);
            await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${actualForm} para ${newForm}.`, type: 'notification' }, null, setShowMessage);
          } else {
            await registerMessage(sessionId, { message: `O personagem ${dataSheet.data.name} Mudou para a forma ${newForm}.`, type: 'transform' }, email, setShowMessage);
            await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${actualForm} para ${newForm}.`, type: 'notification' }, null, setShowMessage);
          }
              applyFormChange(actualForm, newForm);
          await updateDataPlayer(sheetId, dataSheet, setShowMessage);
        } else if (newForm === 'Crinos') {
          if (dataSheet.data.rage < 2) {
            setShowMessage({
              show: true,
              text: `O personagem ${dataSheet.data.name} não possui Fúria para realizar esta ação (Mudar para a forma Crinos).`,
            });
          } else {
            const oldRage = dataSheet.data.rage;
            applyFormChange(actualForm, newForm);
            await updateDataWithRage(session.typeSession, sessionId, email, sheetId, dataSheet, newForm, setShowMessage);
            await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${actualForm} para ${dataSheet.data.form} (${oldRage === dataSheet.data.rage ? 'Não houve perda de Fúria' : `Fúria atualizada de ${oldRage} para ${dataSheet.data.rage}`}).`, type: 'notification' }, null, setShowMessage);
            openSessionChat();
          }
        } else { 
          if (dataSheet.data.rage < 1) {
            setShowMessage({
              show: true,
              text: `O personagem ${dataSheet.data.name} não possui Fúria para realizar esta ação (Mudar para a forma ${newForm}).`,
            });
          } else if (isCrinosToHybridTransition) {
            await handleCrinosToHybridTransition(actualForm, newForm);
          } else {
            applyFormChange(actualForm, newForm);
            const oldRage = dataSheet.data.rage;
            await updateDataWithRage(session.typeSession, sessionId, email, sheetId, dataSheet, newForm, setShowMessage);
            await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${actualForm} para ${dataSheet.data.form} (${oldRage === dataSheet.data.rage ? 'Não houve perda de Fúria' : `Fúria atualizada de ${oldRage} para ${dataSheet.data.rage}`}).`, type: 'notification' }, null, setShowMessage);
            openSessionChat();
          }
        }
      }
    }
  };

  const currentFormName = sheetData?.form || '';
  const currentForm = dataForms.find((form: any) => form.name === currentFormName);
  const getCostLabel = (cost?: string) => cost?.includes('Nenhum') ? 'Nenhum teste de Fúria' : (cost || '');
  const formColumns = [
    ['Hominídeo', 'Lupino'],
    ['Hispo', 'Glabro'],
    ['Crinos'],
  ];

  const renderFormCard = (form: any) => {
    const isSelected = currentFormName === form.name;

    return (
      <button
        key={form.name}
        type="button"
        onClick={() => updateValue(form.name)}
        className={`${isSelected ? 'border-red-600 bg-black shadow-[0_0_0_1px_rgba(248,113,113,0.24),0_0_26px_rgba(127,29,29,0.22)]' : 'border-white/10 bg-black/35 hover:border-red-900/70 hover:bg-black/60'} group relative min-h-[17rem] overflow-hidden border px-4 py-4 text-left transition-colors`}
      >
        <div className={`absolute inset-x-0 top-0 h-px ${isSelected ? 'bg-red-500/85' : 'bg-white/10 group-hover:bg-red-900/60'}`} />
        <div className="absolute bottom-0 right-0 opacity-[0.12]">
          <Image
            src={`/images/forms/${form.name}-white.png`}
            alt={`Glifo da forma ${form.name}`}
            width={500}
            height={500}
            className="h-full w-50 object-contain object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black via-black/85 to-transparent" />
        </div>

        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-kingthings text-[0.9rem] uppercase tracking-[0.18em] text-white">{form.name}</p>
              <p className="mt-1 font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55">{form.subtitle}</p>
            </div>
            {isSelected && (
              <span className="border border-red-700/80 px-2 py-1 font-geist-mono text-[9px] font-bold uppercase tracking-[0.12em] text-red-200">
                Atual
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
            <p className="font-geist-mono text-[9px] uppercase tracking-[0.12em] text-red-300/85">
              {getCostLabel(form.cost)}
            </p>
          </div>

          <ul className="mt-3 space-y-1.5 font-geist-mono text-[9px]  text-white/70">
            {form.sheet && form.sheet.map((item: string, itemIndex: number) => (
              <li key={itemIndex} className="flex gap-2">
                <span className=" text-red-500/75">+</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-5">
            <span className={`inline-flex border px-2 py-1 font-geist-mono text-[9px] uppercase tracking-[0.14em] ${isSelected ? 'border-red-700/70 text-red-200' : 'border-white/10 text-white/45'}`}>
              {isSelected ? 'Forma ativa' : 'Selecionar forma'}
            </span>
          </div>
        </div>
      </button>
    );
  };

  return(
    <section className="relative mt-2 sm:mt-5 w-full overflow-hidden border border-[#708578]/40 bg-[#090d0e]/95 text-white shadow-[inset_0_0_80px_rgba(0,0,0,0.68)]">
      <span className="absolute right-0 top-0 h-px w-6 bg-red-700/85" />
      <span className="absolute right-0 top-0 h-6 w-px bg-red-700/85" />
      <span className="absolute bottom-0 left-0 h-px w-6 bg-red-700/85" />
      <span className="absolute bottom-0 left-0 h-6 w-px bg-red-700/85" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.16),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative">
        <div className="px-6 pb-4 pt-5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-kingthings text-[0.92rem] uppercase tracking-[0.28em] text-red-500/85">FORMAS</p>
              <p className="mt-2 max-w-3xl font-geist-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                Mudanças de atributos e efeitos são aplicados imediatamente ao confirmar a nova forma.
              </p>
            </div>
            <div className="border border-red-900/60 bg-black/40 px-3 py-2 font-geist-mono text-[10px] uppercase tracking-[0.14em] text-red-200/85">
              Forma atual: {currentFormName}
            </div>
          </div>
          <div className="mt-4 border-b border-white/10" />
        </div>

        <div className="grid gap-4 px-4 pb-5 sm:px-6 lg:grid-cols-2 xl:grid-cols-3">
          {formColumns.map((column, columnIndex) => (
            <div key={`form-column-${columnIndex}`} className="grid grid-cols-1 gap-4">
              {column.map((formName) => {
                const form = dataForms.find((item: any) => item.name === formName);
                return form ? renderFormCard(form) : null;
              })}
            </div>
          ))}
        </div>

        <section className="mx-4 mb-6 mt-1 overflow-hidden border border-[#708578]/30 bg-black/45 sm:mx-6">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-kingthings text-[0.9rem] uppercase tracking-[0.2em] text-white">
                  DETALHES DE {currentFormName}
                </p>
                {currentForm?.subtitle && (
                  <p className="mt-1 font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55">
                    {currentForm.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="gap-4 px-5 py-5 w-full">
            <div className="space-y-4">
              <p className="whitespace-pre-wrap font-geist-mono text-[11px] leading-6 text-white/70">
                {currentForm?.description || 'Selecione uma forma para visualizar os detalhes.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
