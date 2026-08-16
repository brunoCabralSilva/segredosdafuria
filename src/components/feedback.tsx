'use client'
import dotenv from 'dotenv';
import emailjs from '@emailjs/browser';
import { FormEvent, useContext, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { BiError } from 'react-icons/bi';
import { VscRepoPush } from 'react-icons/vsc';
import contexto from '@/context/context';

dotenv.config();

type MessagePopup = {
  error: boolean;
  message: string;
  show: boolean;
};

export default function Feedback(props: { title?: string }) {
  const [message, setMessage] = useState('');
  const [nameUser, setNameUser] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [messagePopup, setMessagePopup] = useState<MessagePopup>({
    error: true,
    message: '',
    show: false,
  });
  const { setShowFeedback } = useContext(contexto);

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    const regex = /\S+@\S+\.\S+/;
    e.preventDefault();
    const form = e.currentTarget;

    if (!nameUser || nameUser.length < 2) {
      setMessagePopup({
        message: 'O nome do usuário deve possuir pelo menos 2 caracteres.',
        error: true,
        show: true,
      });
    } else if (!emailUser || !regex.test(emailUser)) {
      setMessagePopup({
        message: 'Por favor, informe um e-mail valido.',
        error: true,
        show: true,
      });
    } else if (!message || message.length <= 5) {
      setMessagePopup({
        message: 'A mensagem deve possuir mais de 5 caracteres.',
        error: true,
        show: true,
      });
    } else {
      const userID: string | undefined = process.env.NEXT_PUBLIC_USERID;
      const templateID: string | undefined = process.env.NEXT_PUBLIC_TEMPLATEID;
      const serviceID: string | undefined = process.env.NEXT_PUBLIC_SERVICEID;

      try {
        await emailjs.sendForm(
          serviceID || '',
          templateID || '',
          form,
          userID,
        );
        form.reset();
        setMessage('');
        setNameUser('');
        setEmailUser('');
        setMessagePopup({
          message: 'Feedback enviado com sucesso. Muito obrigado pela colaboracao!',
          error: false,
          show: true,
        });
        setTimeout(() => setShowFeedback(false), 3000);
      } catch (error: any) {
        global.alert(error);
      }
    }

    setTimeout(() => {
      setMessagePopup({ message: '', error: true, show: false });
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6">
      <form
        onSubmit={sendEmail}
        className="relative flex w-full max-w-2xl flex-col overflow-hidden border border-zinc-500/40 bg-zinc-950/85"
      >
        <div
          className="absolute inset-0 bg-cover bg-center "
          style={{ backgroundImage: "url('/images/wallpapers/128.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/90" />

        <button
          type="button"
          onClick={() => setShowFeedback(false)}
          className="absolute right-4 top-4 z-20 text-2xl text-white/70 transition-colors hover:text-red-400"
          aria-label="Fechar feedback"
        >
          <AiFillCloseCircle />
        </button>

        <div className="relative z-10 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <h2 className="mt-2 font-kingthings text-2xl sm:text-3xl">Enviar Feedback</h2>
          <p className="mt-2 max-w-xl font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
            Compartilhe sugestões, erros encontrados ou ideias para melhorar as sessões, fichas e outras ferramentas do site.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-4 px-5 sm:px-8">
          {props.title && (
            <input
              type="hidden"
              id="gift"
              name="gift"
              value={props.title}
            />
          )}

          <label className="flex flex-col gap-2">
            <span className="font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
              Nome
            </span>
            <input
              type="text"
              id="nameUser"
              name="nameUser"
              value={nameUser}
              className="border border-zinc-500/40 bg-black/70 px-4 py-3 font-geist-mono text-xs text-white outline-none transition-colors placeholder:text-white/30 focus:border-red-700/80"
              placeholder="Insira seu nome"
              onChange={(e) => setNameUser(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
              E-mail
            </span>
            <input
              type="email"
              id="emailUser"
              name="emailUser"
              value={emailUser}
              className="border border-zinc-500/40 bg-black/70 px-4 py-3 font-geist-mono text-xs text-white outline-none transition-colors placeholder:text-white/30 focus:border-red-700/80"
              placeholder="Insira seu e-mail"
              onChange={(e) => setEmailUser(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
              Mensagem
            </span>
            <textarea
              className="h-36 border border-zinc-500/40 bg-black/70 px-4 py-3 font-geist-mono text-xs text-white outline-none transition-colors placeholder:text-white/30 focus:border-red-700/80"
              value={message}
              id="message"
              name="message"
              placeholder="Digite aqui seu feedback"
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>

          {messagePopup.show && (
            <div
              className={`flex w-full items-center gap-3 border px-4 py-3 font-geist-mono text-xs leading-5 ${
                messagePopup.error
                  ? 'border-red-900/70 bg-red-950/20 text-red-200'
                  : 'border-emerald-900/70 bg-emerald-950/20 text-emerald-200'
              }`}
            >
              <span className="text-lg">
                {messagePopup.error ? <BiError /> : <VscRepoPush />}
              </span>
              <p>{messagePopup.message}</p>
            </div>
          )}

          <button
            type="submit"
            value="Submit"
            className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900 mb-5"
          >
            Enviar Feedback
          </button>
        </div>
      </form>
    </div>
  );
}







