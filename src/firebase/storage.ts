import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";
import firebaseConfig from "./connection";
import { doc, getFirestore, runTransaction } from "firebase/firestore";

export async function createSessionImage(id: string, data: any, setShowMessage: any) {
  const db = getFirestore(firebaseConfig);
  const storage = getStorage(firebaseConfig);
  const storageRef = ref(storage, `images/sessions/${id}/${data.name}`);
  try {
    await uploadBytes(storageRef, data);
    const downloadUrl = await getDownloadURL(storageRef);
    const sessionDocRef = doc(db, 'sessions', id);
    await runTransaction(db, async (transaction) => {
      const sessionDocSnapshot = await transaction.get(sessionDocRef);
      if (sessionDocSnapshot.exists()) {
        transaction.update(sessionDocRef, { imageUrl: downloadUrl });
      } else throw new Error("Sessão não encontrada.");
    });
    return downloadUrl;
  } catch (error: any) {
    setShowMessage({ show: true, text: "Erro ao fazer upload da imagem: " + error.message });
    return false;
  }
}

export const deletePlayerImage = async (sessionId: string, playerId: string, imageUrl: string, setShowMessage: any) => {
  if (!imageUrl) return;
  
  try {
    const storage = getStorage();
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    setShowMessage({ type: "success", text: "Imagem removida com sucesso!" });
  } catch (error) {
    setShowMessage({ type: "error", text: "Erro ao remover a imagem!" });
  }
};

export async function createProfileImage(id: string, img: any, setShowMessage: any) {
  const db = getFirestore(firebaseConfig);
  const storage = getStorage(firebaseConfig);
  const storageRef = ref(storage, `images/users/${id}/${img.name}`);
  try {
    await uploadBytes(storageRef, img);
    const downloadUrl = await getDownloadURL(storageRef);
    const userDocRef = doc(db, 'users', id);
    await runTransaction(db, async (transaction) => {
      const userDocSnapshot = await transaction.get(userDocRef);
      if (userDocSnapshot.exists()) {
        transaction.update(userDocRef, { imageURL: downloadUrl });
      } else throw new Error("Usuário não encontrado.");
    });
    return downloadUrl;
  } catch (error: any) {
    setShowMessage({ show: true, text: "Erro ao fazer upload da mídia de imagem: " + error.message });
    return false;
  }
}

export async function updatePlayerImage(sessionId: string, playerId: string, newImage: any, setShowMessage: any) {
  const storage = getStorage(firebaseConfig);
  const folderRef = ref(storage, `images/sessions/${sessionId}/players/${playerId}`);
  try {
    const folderContents = await listAll(folderRef);
    for (const itemRef of folderContents.items) {
      await deleteObject(itemRef);
    }
    const newImageRef = ref(storage, `images/sessions/${sessionId}/players/${playerId}/${newImage.name}`);
    await uploadBytes(newImageRef, newImage);
    const newImageUrl = await getDownloadURL(newImageRef);
    return newImageUrl;
  } catch (error: any) {
    setShowMessage({ show: true, text: "Erro ao atualizar imagem: " + error.message });
    return error.message;
  }
}