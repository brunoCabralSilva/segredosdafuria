import { updateDoc } from "firebase/firestore";
import { getChatAndDataByIdSession } from "./sessions";

export const getHoraOficialBrasil = async () => {
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/America/Sao_Paulo');
    const data = await response.json();
    const date = new Date(data.utc_datetime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`;
    return formattedDate;
  } catch (error) {
    return null;
  }
};

export const sendMessage = async (text: any, sessionId: string, userData: any) => {
  if (text !== '' && text !== ' ') {
    await registerMessage({
      message: text,
      user: userData.name,
      email: userData.email,
    },
    sessionId);
  }
};

export const registerMessage = async (message: any, sessionId: string) => {
  const dateMessage = await getHoraOficialBrasil();
  const getUser: any = await getChatAndDataByIdSession(sessionId);
  if (getUser.chat) {
    const updatedChatArray = [...getUser.chat, { ...message, date: dateMessage }];
    updatedChatArray.sort((a, b) => a.date - b.date);
    if (updatedChatArray.length > 15) {
      updatedChatArray.shift();
    }
    await updateDoc(getUser.sessionRef, {
      chat: updatedChatArray
    });
  } else window.alert('Não foi possível encontrar informações sobre o chat. Por favor, atualize a página e tente novamente.');
};