import contexto from "@/context/context";
import { updateDataPlayer } from "@/firebase/players";
import { updatePlayerImage } from "@/firebase/storage";
import { useContext, useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function EditImage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { setShowMenuSession, dataSheet, session, sheetId, setShowMessage } = useContext(contexto);

  useEffect(() => {
    return () => {
      if (profileImage) URL.revokeObjectURL(profileImage);
    };
  }, [profileImage]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  }

  const updateImage = async () => {
    if (!imageFile) return;
    try {
      setLoading(true);
      const updateStorage = await updatePlayerImage(session.id, sheetId, imageFile, setShowMessage);
      dataSheet.data.profileImage = updateStorage;
      await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      setShowMenuSession("sheet");
      setLoading(false);
    } catch (error) {
      console.error("Erro ao atualizar imagem:", error);
    }
  };

  return (
    <div className="w-8/10 px-5 sm:px-8 pb-8 pt-3 bg-black flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto text-white">
      <div className="w-full flex justify-end my-3">
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer mb-2"
          onClick={() => setShowMenuSession("sheet")}
        />
      </div>
      <div className="flex flex-col items-start">
        <div className="box-attributes flex flex-col justify-center items-start bg-rule bg-cover w-full">
          <div className="grid grid-cols-1 w-full px-5 pb-5 gap-5">
            <div className="w-full flex justify-center">
              {
                !profileImage && !dataSheet.data.profileImage ?
                <div className="w-60 h-60 bg-black border-2 border-white flex items-center justify-center">
                  Sem Imagem de Perfil
                </div>
                : <img
                  className="w-60 h-60 bg-black border-2 border-white object-cover"
                  alt="Imagem de perfil"
                  src={profileImage || dataSheet.data.profileImage || null}
                />
              }
            </div>
            <div className="flex flex-col justify-between">
              <p className="w-full text-justify">
                Adicione ou altere a imagem do seu personagem
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="w-full mt-5 cursor-pointer"
              />
              {profileImage && (
                <button
                  onClick={updateImage}
                  className="bg-black items-center justify-center font-medium p-2 border-2 border-white w-full hover:border-red-400 hover:bg-black hover:text-red-400 transition-colors duration-400 mt-5"
                >
                  { !loading ? 'Concluído' : 'Registrando...' }
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
