import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import firebaseConfig from "./connection";

export async function createSessionImage(id: string, data: any, setShowMessage: any){
  try {
    const storage = getStorage(firebaseConfig);
    const storageRef = ref(storage, `images/sessions/${id}/${data.name}`);
    await uploadBytes(storageRef, data);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error: any) {
    setShowMessage({ show: true, text: "Erro ao fazer upload imagem: " + error.message });
    return false;
  }
};

export async function createProfileImage(id: string, img: any, setShowMessage: any){
  try {
    const storage = getStorage(firebaseConfig);
    const storageRef = ref(storage, `images/users/${id}/${img.name}`);
    await uploadBytes(storageRef, img);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error: any) {
    setShowMessage({ show: true, text: "Erro ao fazer upload da midia de imagem: " + error.message });
    return false;
  }
};