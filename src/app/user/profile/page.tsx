'use client'
import Footer from "@/components/footer";
import jwt from 'jsonwebtoken';
import Nav from "@/components/nav";
import firebaseConfig from "@/firebase/connection";
import { testToken } from "@/firebase/token";
import { verifyEmail } from "@/firebase/user";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import md5 from "md5";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { getUser as getUserData } from "@/firebase/user";
import Simplify from "@/components/simplify";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";

export default function Profile() {
  const router = useRouter();
  const [showData, setShowData] = useState<boolean>(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [editFirstName, setEditFirstName] = useState(false);
  const [editLastName, setEditLastName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [lastPassword, setLastPassword] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [id, setId] = useState('');
  const [passMessage, setPassMessage] = useState({ error: false, info: '' });
  const slice = useAppSelector(useSlice);

  const getUser = async () => {
    try {
      const token = localStorage.getItem('Segredos Da Fúria');
      if (token) {
        const db = getFirestore(firebaseConfig);
        const decodedToken: { email: string } = jwtDecode(token);
        const { email } = decodedToken;
        const userQuery = query(collection(db, 'users'), where('email', '==', email));
        const userQuerySnapshot = await getDocs(userQuery);
        userQuerySnapshot.forEach((doc: any) => {
          setNewFirstName(doc.data().firstName);
          setNewLastName(doc.data().lastName);
          setNewEmail(doc.data().email);
          setId(doc.id);
        });
        setShowData(true);
      }
    } catch(error) {
      window.alert("Não foi possível retornar os dados do usuário. Por favor, faça login novamente " + error );
      router.push('/sessions');
    }
  };

  useEffect(() => {
    setShowData(false);
    const verification = testToken();
    if (!verification) router.push('/user/login');
    getUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateInBD = async (value: string, type: string) => {
    const db = getFirestore(firebaseConfig);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken: { email: string } = jwtDecode(token);
        const { email } = decodedToken;
        const userQuery = query(collection(db, 'users'), where('email', '==', email));
        const userQuerySnapshot = await getDocs(userQuery);
        const userDocRef = userQuerySnapshot.docs[0].ref;
        if (type === 'firstName') await updateDoc(userDocRef, { firstName: value }); 
        if (type === 'lastName') await updateDoc(userDocRef, { lastName: value }); 
        if (type === 'email') await updateDoc(userDocRef, { email: value }); 
        if (type === 'password') await updateDoc(userDocRef, { password: md5(value) });
        await getUser();
        const newToken = jwt.sign({ firstName: newFirstName, lastName: newLastName, email: newEmail }, 'SegredosDaFúria2023', { expiresIn: '4h' });
        localStorage.setItem('Segredos Da Fúria', JSON.stringify(newToken));
      } catch (error) {
        window.alert(`Erro ao atualizar valor de ${type}: ${error}`);
      }
    } else {
      window.alert('Token não é válido.');
    }
  }

  const updateName = async (name: string, type: string) => {
    if (name.length < 3) {
      if (type === 'firstName') window.alert('primeiro nome com menos de 3 caracteres');
      if (type === 'lastName') window.alert('Último nome com menos de 3 caracteres');
    } else {
      window.alert('Atualização realizada com sucesso!');
      await updateInBD(name, type);
    }
  }

  const updateEmail = async () => {
    const validateEmail = /\S+@\S+\.\S+/;
    if (!validateEmail.test(newEmail)) {
      window.alert('Necessário informar um e-mail válido');
    } else {
      try {
        const db = getFirestore(firebaseConfig);
        const getEquals = query(collection(db, 'users'), 
          where('email', '==', newEmail)
        );
        const querySnapshot = await getDocs(getEquals);
        if (querySnapshot.size > 0) {
          let exists = false;
          querySnapshot.forEach((doc) => {
            if (doc.id === id) exists = true;
          });
          if (exists) {
            await updateInBD(newEmail, 'email');
            window.alert('Email atualizado com sucesso!');
          } else {
            window.alert('Email já está em uso');
          }
        } else {
          await updateInBD(newEmail, 'email');
          window.alert('Email atualizado com sucesso!');
        }
      } catch (error) {
        window.alert('Error verifying email: ' + error);
        return false;
      }
    }
  }
  
  const updatePassword = async () => {
    try {
      if (password.length < 6 || repeatPassword.length < 6) {
        window.alert('A nova senha precisa ter pelo menos 6 caracteres');
      } else if (password !== repeatPassword) {
        window.alert('Senhas não conferem. Tente novamente');
      } else {
      const token = localStorage.getItem('Segredos Da Fúria');
      if (token) {
          const decodedToken: { email: string } = jwtDecode(token);
          const { email } = decodedToken;
          const encryptedPass = md5(lastPassword);
          const response = await getUserData(email, encryptedPass);
          if (!response) {
            window.alert('Senhas não conferem. Tente novamente');
          } else {
            await updateInBD(password, 'password');
            window.alert('Senha atualizada com sucesso!');
          }
      }
    }
  } catch(error) {
    window.alert('Erro ao tentar atualizar sua senha: ' + error);
  }
  }

  return (
    <div className="bg-ritual bg-cover bg-top">
      {showData ? (
        <div className="w-full bg-ritual bg-cover bg-top relative">
          <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/90'}`} />
          <Simplify />
          <Nav />
          <section className="relative px-2 pb-5">
            {
              !slice.simplify &&
              <div className="h-40vh relative flex bg-white items-end text-black">
              <Image
                src={ "/images/25.jpg" }
                alt="Matilha contemplando o fim do mundo diante de um espírito maldito"
                className="absolute w-full h-40vh object-cover object-center"
                width={ 1200 }
                height={ 800 }
              />
              </div>
            }
            <div className="py-6 px-5 text-white mt-2 flex flex-col items-center sm:items-start text-justify">
              <h1 className="text-4xl relative">Perfil</h1>
              <hr className="w-full my-6" />
              <div className="text-white pt-5 flex flex-col w-full">
                <span>Primeiro Nome:</span>
                <div className={`flex justify-between items-center border-2 border-white ${!editFirstName ? 'p-3' : ''} mt-2`}>
                  {editFirstName ? (
                    <input
                      type="text"
                      value={newFirstName}
                      className="text-sm sm:text-base break-all bg-black text-white p-4 h-full w-full"
                      onChange={(e: any) => setNewFirstName(e.target.value)}
                    />
                  ) : (
                    <button
                      onClick={(e: any) => {
                        setEditFirstName(true);
                        e.stopPropagation();
                      }}
                      className="capitalize text-sm sm:text-base break-all w-full text-left"
                    >
                      {newFirstName}
                    </button>
                  )}
                  {editFirstName ? (
                    <BsCheckSquare
                      onClick={(e: any) => {
                        updateName(newFirstName, 'firstName');
                        setEditFirstName(false);
                        e.stopPropagation();
                      }}
                      className="text-3xl w-14"
                    />
                  ) : (
                    <FaRegEdit
                      onClick={(e: any) => {
                        setEditFirstName(true);
                        e.stopPropagation();
                      }}
                      className="text-3xl"
                    />
                  )}
                </div>
              </div>
              <div className="text-white pt-5 flex flex-col w-full">
                <span>Último Nome:</span>
                <div className={`flex justify-between items-center border-2 border-white ${!editLastName ? 'p-3' : ''} mt-2`}>
                  {editLastName ? (
                    <input
                      type="text"
                      value={newLastName}
                      className="p-4 h-full bg-black text-white w-full text-sm sm:text-base break-all"
                      onChange={(e: any) => setNewLastName(e.target.value)}
                    />
                  ) : (
                    <button
                      onClick={(e: any) => {
                        setEditLastName(true);
                        e.stopPropagation();
                      }}
                      className="capitalize text-sm sm:text-base break-all w-full text-left"
                    >
                      {newLastName}
                    </button>
                  )}
                  {editLastName ? (
                    <BsCheckSquare
                      onClick={(e: any) => {
                        updateName(newLastName, 'lastName');
                        setEditLastName(false);
                        e.stopPropagation();
                      }}
                      className="text-3xl w-14"
                    />
                  ) : (
                    <FaRegEdit
                      onClick={(e: any) => {
                        setEditLastName(true);
                        e.stopPropagation();
                      }}
                      className="text-3xl"
                    />
                  )}
                </div>
              </div>
              <div className="text-white pt-5 flex flex-col w-full">
                <span>Email:</span>
                <div className={`flex justify-between items-center border-2 border-white ${!editEmail ? 'p-3' : ''} mt-2`}>
                  {editEmail ? (
                    <input
                      type="email"
                      value={newEmail}
                      className="text-sm sm:text-base break-all bg-black text-white p-4 h-full w-full"
                      onChange={(e: any) => setNewEmail(e.target.value)}
                    />
                  ) : (
                    <button
                      onClick={(e: any) => {
                        setEditEmail(true);
                        e.stopPropagation();
                      }}
                      className="text-sm sm:text-base break-all w-full text-left"
                    >
                      {newEmail}
                    </button>
                  )}
                  {editEmail ? (
                    <BsCheckSquare
                      onClick={(e: any) => {
                        updateEmail();
                        setEditEmail(false);
                        e.stopPropagation();
                      }}
                      className="text-3xl w-14"
                    />
                  ) : (
                    <FaRegEdit
                      onClick={(e: any) => {
                        setEditEmail(true);
                        e.stopPropagation();
                      }}
                      className="text-3xl"
                    />
                  )}
                </div>
              </div>
              <span className="mt-5 mb-1 w-full">Alteração de senha:</span>
              <div className="w-full">
                <div className="w-full border-2 border-b-transparent border-white mt-2 flex flex-col">
                  <input
                    type="password"
                    value={lastPassword}
                    className="text-white bg-black/40 p-3 focus:outline-none"
                    placeholder="Digite aqui a senha antiga"
                    onChange={(e: any) => setLastPassword(e.target.value)}
                  />
                </div>
                <div className="w-full flex flex-col border-2 border-b-transparent border-white">
                  <input
                    type="password"
                    value={password}
                    className="text-white bg-black/40 p-3 focus:outline-none"
                    placeholder="Digite aqui A nova senha"
                    onChange={(e: any) => setPassword(e.target.value)}
                  />
                </div>
                <div className="w-full border-2 border-white flex flex-col">
                  <input
                    type="password"
                    value={repeatPassword}
                    className="text-white bg-black/40 p-3 focus:outline-none"
                    placeholder="Repita a nova senha"
                    onChange={(e: any) => setRepeatPassword(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={() => updatePassword()}
                className="border-2 bg-black border-white p-3 mt-2 text-white pt-4 flex flex-col w-full text-center items-center justify-center"
              >
                Alterar Senha
              </button>
              {passMessage.info !== '' && (
                <div className={`${passMessage.error ? 'border-red-500' : 'border-green-500'} border-2 p-3 my-4 text-center text-white`}>
                  {passMessage.info}
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="bg-black/80 text-white h-screen flex items-center justify-center flex-col">
          <span className="loader z-50" />
        </div>
      )}
      <Footer />
    </div>
  );
  
}