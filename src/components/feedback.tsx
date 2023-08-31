'use client'
import { actionFeedback, useSlice } from '@/redux/slice';
import emailjs from '@emailjs/browser';
import { useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { useAppSelector } from '@/redux/hooks';
import { AiFillCloseCircle } from 'react-icons/ai';
import { REACT_APP_USER_ID } from '../../env';
import { REACT_APP_SERVICE_ID } from '../../env';
import { REACT_APP_TEMPLATE_ID } from '../../env';

export default function Feedback(props: { gift: string }) {
  const [message, setMessage] = useState('');
  const [nameUser, setNameUser] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const sendEmail = (e: any) => {
    e.preventDefault();
    if (message === '' || message.length <= 3) {

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
      } catch (error: any) {
        global.alert(error);
      }
    }
  }
  return(
    <div className="fixed w-full h-screen top-0 left-0 bg-black/50 flex items-center justify-center flex-col text-white">
      <form
        onSubmit={ sendEmail }
        className="bg-black w-10/12 sm:w-1/2 md:w-1/3 px-5 py-7 relative flex flex-col"
      >
        <div className="absolute top-0 right-0 p-2 text-xl">
          <AiFillCloseCircle
            className="cursor-pointer"
            onClick={() => dispatch(actionFeedback({ show: false, message: '' })) }
          />
        </div>
        <p className="py-2 text-center">
          Deixe abaixo seu Feedback para o dom &apos;{ slice.feedback.message }&apos;:
        </p>
        <input
          type="text"
          id="nameUser"
          name="nameUser"
          value={ nameUser }
          className="py-3 px-2 mt-2 text-black"
          placeholder="Insira seu Nome"
          onChange={ (e) => setNameUser(e.target.value) }
        />
        <input
          type="email"
          id="emailUser"
          name="emailUser"
          value={ emailUser }
          className="py-3 px-2 mt-2 text-black"
          placeholder="Insira seu Email"
          onChange={ (e) => setEmailUser(e.target.value) }
        />
        <textarea
          className="mt-2 w-full h-28 text-black p-2"
          value={ message }
          id="message"
          name="message"
          placeholder="Digite aqui seu feedback"
          onChange={ (e) => setMessage(e.target.value) }
        >
        </textarea>
        <button
          type="submit"
          value="Submit"
          className="border-white w-full my-2 py-3 border-2 hover:border-black hover:bg-white hover:text-black transition-colors duration-200 "
        >
          Enviar
        </button>
      </form>
    </div>
  );
}