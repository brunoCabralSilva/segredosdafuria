'use client'
import { useContext, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import contexto from "@/context/context";
import { forgotPassword } from "@/firebase/authenticate";

export default function ForgotPassword() {
	const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const context = useContext(contexto);
  const { setShowForgotPassword } = context;
  
  const forgotUserPassword = async () => {
		const validate = /\S+@\S+\.\S+/;
    const vEmail = !email || !validate.test(email) || email === '';
    if (vEmail) {
			window.alert('Por favor, forneça um e-mail válido.');
    } else { 
			setLoading(true);
      await forgotPassword(email);
      setShowForgotPassword(false);
      setLoading(false);
    }
  };

  return (
    <div className="break-words z-50 fixed top-0 left-0 w-full flex items-center justify-center bg-black/80 px-3 sm:px-0 overflow-y-auto h-full">
      <div className="break-words w-11/12 md:w-1/2 flex flex-col justify-center items-center relative border-red-500 border-2 pb-5 bg-dice bg-ritual bg-cover">
        <div className="break-words pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="break-words text-4xl text-white cursor-pointer hover:text-red-500 duration-500 transition-colors"
            onClick={() => setShowForgotPassword(false) }
          />
        </div>
        <div className="break-words px-6 sm:px-10 w-full">
          <div className="break-words w-full overflow-y-auto flex flex-col justify-center items-center mt-2 mb-10">
            <div className="break-words w-full text-white text-2xl pb-3 font-bold text-center mt-2 mb-2">
              Esqueceu a senha?
            </div>
            <label htmlFor="email" className="break-words mb-4 flex flex-col items-center w-full">
              <p className="break-words w-full mb-1 text-white">Digite o seu Email</p>
              <input
                type="email"
                id="email"
                value={ email }
                placeholder="name@company.com"
                className="break-words bg-black border-white border w-full p-3 cursor-pointer text-white text-left focus:outline-none"
                onChange={ (e: any) => setEmail(e.target.value) }
              />
            </label>
            <button
              onClick={ forgotUserPassword }
              disabled={loading}
              className="break-words relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium bg-black rounded-lg hover:text-white focus:outline-none w-full border-2 border-white hover:border-red-500 mt-3"
              >
              <span className="break-words relative px-5 py-2.5 transition-all ease-in duration-75 text-white rounded-md group-hover:bg-opacity-0">
                { loading ? "Enviando..." : "Enviar" }
              </span>
            </button>
          </div>
        </div>    
      </div>
    </div>
  );
}