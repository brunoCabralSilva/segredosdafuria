'use client'
import { actionFeedback, useSlice } from '@/redux/slice';
import emailjs from '@emailjs/browser';
import { useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { useAppSelector } from '@/redux/hooks';
import { REACT_APP_USER_ID } from '../../env';
import { REACT_APP_SERVICE_ID } from '../../env.js';
import { REACT_APP_TEMPLATE_ID } from '../../env.js';
import { AiFillCloseCircle } from 'react-icons/ai';
import { BiError } from 'react-icons/bi';
import { VscError, VscRepoPush } from "react-icons/vsc";

export default function Feedback(props: { gift: string }) {
  const [message, setMessage] = useState('');
  const [nameUser, setNameUser] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [messagePopup, setMessagePopup] = useState(
    { error: true, message: '', show: false }
  );
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const sendEmail = (e: any) => {
    const regex = /\S+@\S+\.\S+/
    e.preventDefault();
    if (!nameUser || nameUser === '' || nameUser.length < 2) {
      setMessagePopup(
        {
          message: 'O nome do usuário deve possuir pelo menos 2 caracteres',
          error: true,
          show: true,
        }
      );
    } else if (!emailUser || !regex.test(emailUser) || emailUser === '') {
      setMessagePopup(
        {
          message: 'Por favor, informe um e-mail válido',
          error: true,
          show: true,
        }
      );
    } else if (!message || message === '' || message.length <= 5) {
      setMessagePopup(
        {
          message: 'A mensagem deve possuir pelo menos mais de 5 caracteres',
          error: true,
          show: true,
        }
      );
    } else {
      const userID: any = REACT_APP_USER_ID;
      const templateID: any = REACT_APP_TEMPLATE_ID;
      const serviceID: any = REACT_APP_SERVICE_ID;
      try {
      emailjs.sendForm(
        serviceID,
        templateID,
        e.target,
        userID,
        );
        e.target.reset();
        setMessagePopup(
          {
            message: 'Feedback enviado com sucesso! Muito obrigado por sua colaboração!',
            error: false,
            show: true,
          }
        );
        // setTimeout(() => {
        //   dispatch(actionFeedback({ show: false, message: '' }))
        // }, 3000);
      } catch (error: any) {
        global.alert(error);
      }
    }

    // setTimeout(() => {
    //   setMessagePopup(
    //     {
    //       message: '',
    //       error: true,
    //       show: false,
    //     }
    //   );
    // }, 4000);
  }
  return(
    <div className="fixed w-full h-screen top-0 left-0 bg-black/50 flex items-center justify-center flex-col text-white">
      <form
        onSubmit={ sendEmail }
        className="bg-ritual w-10/12 sm:w-1/2 md:w-1/3 px-5 py-7 relative flex flex-col"
      >
        <div className="absolute top-0 right-0 p-2 text-xl">
          <AiFillCloseCircle
            className="cursor-pointer"
            onClick={() => dispatch(actionFeedback({ show: false, message: '' })) }
          />
        </div>
        <p className="py-2 text-center px-4 font-bold">
          Deixe aqui seu Feedback e em breve responderemos:
        </p>
        <input type="text"
          id="gift"
          name="gift"
          value={ slice.feedback.message }
          className="py-3 px-2 mt-2 text-center bg-transparent font-bold border-transparent"
        />
        <input
          type="text"
          id="nameUser"
          name="nameUser"
          value={ nameUser }
          className="py-3 px-2 mt-2 bg-black/70 border border-white"
          placeholder="Insira seu Nome"
          onChange={ (e) => setNameUser(e.target.value) }
        />
        <input
          type="email"
          id="emailUser"
          name="emailUser"
          value={ emailUser }
          className="py-3 px-2 mt-2 bg-black/70 border border-white"
          placeholder="Insira seu Email"
          onChange={ (e) => setEmailUser(e.target.value) }
        />
        <textarea
          className="mt-2 w-full h-28 bg-black/70 border border-white p-2"
          value={ message }
          id="message"
          name="message"
          placeholder="Digite aqui seu feedback"
          onChange={ (e) => setMessage(e.target.value) }
        >
        </textarea>
        {
          messagePopup.show &&
          <div className="w-full text-center flex flex-col items-center justify-center py-4 px-4 font-bold">
            <p className="text-2xl w-full flex justify-center">{ messagePopup.error ? <BiError className="text-red-500" /> : <VscRepoPush className="text-green-500" />}</p>
            { messagePopup.message }
          </div>
        }
        <button
          type="submit"
          value="Submit"
          className="border-white w-full my-2 py-3 border-2 bg-black hover:border-black font-bold hover:bg-white hover:text-black transition-colors duration-200 "
        >
          Enviar
        </button>
      </form>
    </div>
  );
}