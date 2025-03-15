'use client'
import contexto from "@/context/context";
import Image from "next/image";
import { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { updateConsentList } from "@/firebase/consentForm";

export default function ConsentForm() {
  const { setShowMessage, session, email, setShowConsentForm, setConsents,consents } = useContext(contexto);

  const updateValue = async (name: string, value: number) => {
    const dataConsents = [...consents];
    const newConsents = dataConsents.map((topic: any) => ({
      ...topic,
      list: topic.list.map((item: any) => 
        item.name === name ? { ...item, value } : item
      )
    }));
    await updateConsentList(email, session.id, newConsents, setShowMessage);
  }

  return (
    <div className="z-80 sm:z-50 fixed md:relative w-full h-screen flex flex-col items-center justify-center bg-black/80 px-3 sm:px-0 border-white border-2">
      <div className="w-full flex justify-center pt-3 bg-black">
        <div className="px-6 sm:px-10 text-white font-bold text-2xl w-full mb-3">Ficha de Consentimento:</div>
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer mr-5"
          onClick={ () => setShowConsentForm(false) }
        />
      </div>
      <div className="w-full overflow-y-auto h-full flex flex-col justify-start items-center bg-black relative">
        <div className="px-6 sm:px-10 w-full text-white h-full bg-black">
          <p className="mb-3">
            Marque a cor que melhor representa seu nível de conforto com o seguinte plot ou elemento de história:
          </p>
          <div className="mb-2 hidden sm:flex">
            <Image src={ "/images/logos/circle-filled.png" } alt="Círculo" className="w-6 h-6 object-contain mr-2" width={ 1200 } height={ 800 } />
            <span className="text-blue-400 font-bold pr-1">Azul (Círculo)</span>
            <span>- Consentimento entusiasmado; manda ver!</span>
          </div>
          <div className="mt-3 flex flex-col sm:hidden">
            <div className="flex w-full justify-center mb-1">
              <Image src={ "/images/logos/circle-filled.png" } alt="Círculo" className="w-6 h-6 object-contain mr-2" width={ 1200 } height={ 800 } />
              <span className="text-blue-400 font-bold pr-1">Azul (Círculo)</span>
            </div>
            <span className="text-sm text-center">Consentimento entusiasmado; manda ver!</span>
          </div>
          <div className="mt-3 hidden sm:flex">
            <Image src={ "/images/logos/triangle-filled.png" } alt="Triângulo" className="w-6 h-6 object-contain mr-2" width={ 1200 } height={ 800 } />
            <div>
              <span className="text-orange-400 font-bold pr-1">Laranja (Losango)</span>
              <span>- Ok se velado ou fora de cena; pode ser ok em cena mas requer discussão prévia; incerto.</span>
            </div>
          </div>
          <div className="mt-3 flex flex-col sm:hidden">
            <div className="flex w-full justify-center mb-1">
              <Image src={ "/images/logos/triangle-filled.png" } alt="Triângulo" className="w-6 h-6 object-contain mr-2" width={ 1200 } height={ 800 } />
              <span className="text-orange-400 font-bold pr-1">Laranja (Losango)</span>
            </div>
              <span className="text-sm text-center">Ok se velado ou fora de cena; pode ser ok em cena mas requer discussão prévia; incerto.</span>
          </div>
          <div className="hidden sm:flex mt-3">
            <Image src={ "/images/logos/square-filled.png" } alt="Quadrado" className="w-6 h-6 object-contain mr-2" width={ 1200 } height={ 800 } />
            <div>
              <span className="text-red-500 font-bold pr-1">Vermelho (Quadrado)</span>
              <span>- De jeito nenhum; não incluir.</span>
            </div>
          </div>
          <div className="mt-3 flex flex-col sm:hidden">
            <div className="flex w-full justify-center mb-1">
              <Image src={ "/images/logos/square-filled.png" } alt="Quadrado" className="w-6 h-6 object-contain mr-2" width={ 1200 } height={ 800 } />
              <span className="text-red-500 font-bold pr-1">Vermelho (Quadrado)</span>
            </div>
              <span className="text-sm text-center">De jeito nenhum; não incluir.</span>
          </div>
          <div className="mt-5">
            {
              consents && consents.length > 0 && consents.sort((item1: any, item2: any) => {
                if (item1.nameTopic < item2.nameTopic) return -1;
                if (item1.nameTopic > item2.nameTopic) return 1;
                return 0;
              })
              .map((item2: any, index2: number) => (
                <div key={ index2 }>
                  <div className="my-8 sm:my-3 font-bold text-lg">
                    <p className="text-center sm:text-left w-full">{ item2.nameTopic }</p>
                    <hr className="my-3 sm:my-0 w-full" />
                  </div>
                  <div>
                    {
                      item2.list.sort((item3: any, item4: any) => {
                        if (item3.nameTopic < item4.nameTopic) return -1;
                        if (item3.nameTopic > item4.nameTopic) return 1;
                        return 0;
                      })
                      .map((item: any, index: number) => (
                        <div key={ index } className={`grid grid-cols-1 sm:flex gap-1 sm:gap-3 mb-3 items-center ${item.name === 'torture' ? 'pb-5' : ''}`}>
                          <div className="flex gap-3 items-center justify-center sm:justify-start w-full sm:w-1/4">
                            {
                              item.value === 1
                              ? <Image
                                  onClick={ () => updateValue(item.name, 0) }
                                  src={ "/images/logos/circle-filled.png" }
                                  alt="Círculo" className="w-6 h-6 object-contain cursor-pointer"
                                  width={ 1200 }
                                  height={ 800 }
                                />
                              : <Image
                                  onClick={ () => updateValue(item.name, 1) }
                                  src={ "/images/logos/circle.png" } alt="Círculo" 
                                  className="w-6 h-6 object-contain cursor-pointer"
                                  width={ 1200 }
                                  height={ 800 }
                                />
                            }
                            {
                              item.value === 2
                              ? <Image
                                  onClick={ () => updateValue(item.name, 0) }
                                  src={ "/images/logos/triangle-filled.png" }
                                  alt="Círculo"
                                  className="w-6 h-6 object-contain cursor-pointer"
                                  width={ 1200 }
                                  height={ 800 }
                                />
                              :  <Image
                                  onClick={ () => updateValue(item.name, 2) }
                                  src={ "/images/logos/triangle.png" }
                                  alt="Círculo"
                                  className="w-6 h-6 object-contain cursor-pointer"
                                  width={ 1200 }
                                  height={ 800 }
                                />
                            }
                            {
                              item.value === 3
                              ?  <Image
                                    onClick={ () => updateValue(item.name, 0) }
                                    src={ "/images/logos/square-filled.png" }
                                    alt="Círculo"
                                    className="w-6 h-6 object-contain cursor-pointer"
                                    width={ 1200 }
                                    height={ 800 }
                                  />
                              :  <Image
                                    onClick={ () => updateValue(item.name, 3) }
                                    src={ "/images/logos/square.png" }
                                    alt="Círculo"
                                    className="w-6 h-6 object-contain cursor-pointer"
                                    width={ 1200 }
                                    height={ 800 }
                                  />
                            }
                          </div>
                          <p className="w-full text-center sm:text-left">{ item.namePtBr }</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}