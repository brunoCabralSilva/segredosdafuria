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

export default function Profile() {
  const router = useRouter();
  const [showData, setShowData] = useState<boolean>(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [editFirstName, setEditFirstName] = useState(false);
  const [editLastName, setEditLastName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [lastPassword, setLastPassword] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [id, setId] = useState('');
  const [message, setMessage] = useState({ error: false, info: '' });
  const [passMessage, setPassMessage] = useState({ error: false, info: '' });

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
      if (type === 'firstName') setMessage({
        error: true, info: 'primeiro nome com menos de 3 caracteres'});
      if (type === 'lastName') setMessage({
        error: true, info: 'Último nome com menos de 3 caracteres'});
    } else {
      setMessage({
        error: false, info: 'Atualização realizada com sucesso!'});
      await updateInBD(name, type);
    }
    setTimeout(() => { setMessage({error: false , info: '' })}, 5000);
  }

  const updateEmail = async () => {
    const validateEmail = /\S+@\S+\.\S+/;
    if (!validateEmail.test(newEmail)) {
      setMessage({
        error: true, info: 'Necessário informar um e-mail válido'});
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
            setMessage({
              error: false, info: 'Email atualizado com sucesso!'});
          } else {
            setMessage({
              error: true, info: 'Email já está em uso'});
          }
        } else {
          await updateInBD(newEmail, 'email');
          setMessage({
            error: false, info: 'Email atualizado com sucesso!'});
        }
        setTimeout(() => { setMessage({error: false , info: '' })}, 5000);
      } catch (error) {
        window.alert('Error verifying email: ' + error);
        return false;
      }
    }
  }
  
  const updatePassword = async () => {
    try {
      if (password.length < 6 || repeatPassword.length < 6) {
        setPassMessage({error: true , info: 'A nova senha precisa ter pelo menos 6 caracteres' });
      } else if (password !== repeatPassword) {
        setPassMessage({error: true , info: 'Senhas não conferem. Tente novamente' });
      } else {
        const db = getFirestore(firebaseConfig);
      const token = localStorage.getItem('Segredos Da Fúria');
      if (token) {
          const decodedToken: { email: string } = jwtDecode(token);
          const { email } = decodedToken;
          const encryptedPass = md5(lastPassword);
          const response = await getUserData(email, encryptedPass);
          if (!response) {
            setPassMessage({error: true , info: 'Senhas não conferem. Tente novamente' });
          } else {
            await updateInBD(password, 'password');
            setPassMessage({ error: false, info: 'Senha atualizada com sucesso!'});
          }
      }
    }
    setTimeout(() => { setPassMessage({error: false , info: '' })}, 5000);
  } catch(error) {
    window.alert('Erro ao tentar atualizar sua senha: ' + error);
  }
  }

  return(
    <div className="bg-ritual bg-cover bg-top">
      {
        showData
          ? <div className={`bg-black/90 flex flex-col items-center justify-center w-full ${editPassword ? 'h-full' : 'h-screen'}`}>
              <Nav />
              <div className="flex flex-col items-center justify-center w-11/12 sm:w-8/12 md:w-4/12">
                <div className="text-white pt-4 flex flex-col w-full">
                  <span>Primeiro Nome:</span>
                  <div className={`flex justify-between items-center border-2 border-white ${!editFirstName ? 'p-3': ''} mt-2`}>
                    {
                      editFirstName
                        ? <input
                            type="text"
                            value={ newFirstName }
                            className="text-black p-3 h-full bg-white w-full"
                            onChange={ (e: any) => setNewFirstName(e.target.value) }
                          />
                        : <span className="capitalize">{ newFirstName }</span>
                    }
                    { 
                      editFirstName
                        ? <BsCheckSquare
                            onClick={(e:any) => {
                              updateName(newFirstName, 'firstName');
                              setEditFirstName(false);
                              e.stopPropagation();
                            }}
                            className="text-3xl w-14"
                          />
                        : <FaRegEdit
                            onClick={
                              (e:any) => {
                                setEditFirstName(true);
                                e.stopPropagation();
                              }}
                            className="text-3xl"
                          />
                    }
                  </div>
                </div>
                <div className="text-white pt-4 flex flex-col w-full">
                  <span>Último Nome:</span>
                  <div className={`flex justify-between items-center border-2 border-white ${!editLastName ? 'p-3': ''} mt-2`}>
                    {
                      editLastName
                        ? <input
                            type="text"
                            value={ newLastName }
                            className="text-black p-3 h-full bg-white w-full"
                            onChange={ (e: any) => setNewLastName(e.target.value) }
                          />
                        : <span className="capitalize">{ newLastName }</span>
                    }
                    { 
                      editLastName
                        ? <BsCheckSquare
                            onClick={(e:any) => {
                              updateName(newLastName, 'lastName');
                              setEditLastName(false);
                              e.stopPropagation();
                            }}
                            className="text-3xl w-14"
                          />
                        : <FaRegEdit
                            onClick={
                              (e:any) => {
                                setEditLastName(true);
                                e.stopPropagation();
                              }}
                            className="text-3xl"
                          />
                    }
                  </div>
                </div>
                <div className="text-white pt-4 flex flex-col w-full">
                  <span>Email:</span>
                  <div className={`flex justify-between items-center border-2 border-white ${!editEmail ? 'p-3': ''} mt-2`}>
                    {
                      editEmail
                      ? <input
                          type="email"
                          value={ newEmail }
                          className="text-black p-3 h-full bg-white w-full"
                          onChange={ (e: any) => setNewEmail(e.target.value) }
                        />
                      : <span>{ newEmail }</span>
                    }
                    { 
                      editEmail
                        ? <BsCheckSquare
                            onClick={(e:any) => {
                              updateEmail();
                              setEditEmail(false);
                              e.stopPropagation();
                            }}
                            className="text-3xl w-14"
                          />
                        : <FaRegEdit
                            onClick={
                              (e:any) => {
                                setEditEmail(true);
                                e.stopPropagation();
                              }}
                            className="text-3xl"
                          />
                    }
                  </div>
                  <div className="h-28">
                  { message.info !== '' && 
                    <div className={`${message.error ? 'border-red-500' : 'border-green-500'} border-2 p-3 my-4 text-white text-center`}>{ message.info }</div>
                  }
                  </div>
                </div>
                {
                  editPassword && <div className="w-full mt-10">
                    <div className="w-full border-2 border-white mt-2 flex flex-col">
                      <span className="text-white p-3">Senha Antiga</span>
                      <input
                        type="text"
                        value={ lastPassword }
                        className="text-black bg-white p-3"
                        placeholder=""
                        onChange={ (e: any) => setLastPassword(e.target.value) }
                      />
                    </div>
                    <div className="w-full border-2 border-white mt-2 flex flex-col">
                      <span className="text-white p-3">Nova Senha</span>
                      <input
                        type="text"
                        value={ password }
                        className="text-black bg-white p-3"
                        placeholder=""
                        onChange={ (e: any) => setPassword(e.target.value) }
                      />
                    </div>
                    <div className="w-full border-2 border-white mt-2 flex flex-col">
                      <span className="text-white p-3">Repita a Nova Senha</span>
                      <input
                        type="text"
                        value={ repeatPassword }
                        className="text-black bg-white p-3"
                        placeholder=""
                        onChange={ (e: any) => setRepeatPassword(e.target.value) }
                      />
                    </div>
                  </div>
                }
                {
                  !editPassword ? <button
                    onClick={() => setEditPassword(true)}
                    className="border-2 border-white p-3 mt-2 mb-10 text-white pt-4 flex flex-col w-full text-center items-center justify-center"
                  >
                    Alterar Senha
                  </button>
                  : <button
                      onClick={() => updatePassword()}
                      className="border-2 border-white p-3 mt-2 mb-10 text-white pt-4 flex flex-col w-full text-center items-center justify-center"
                    >
                      Ok
                    </button>
                }
                { passMessage.info !== '' && 
                    <div className={`${passMessage.error ? 'border-red-500' : 'border-green-500'} border-2 p-3 my-4 text-center text-white`}>{ passMessage.info }</div>
                  }
              </div>
            </div>
          : <div className="bg-black/80 text-white h-screen flex items-center justify-center flex-col">
              <span className="loader z-50" />
            </div>
      }
      <Footer />
    </div>
  )
}