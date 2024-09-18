'use client'
import { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import dataGifts from '../../data/gifts.json';
import contexto from "@/context/context";
import { IoAdd } from "react-icons/io5";
import { updateDataPlayer } from "@/firebase/players";
import { MdDelete } from "react-icons/md";
import { capitalizeFirstLetter } from "@/firebase/utilities";

export default function AddGift() {
  const {
    email,
    sessionId,
    dataSheet,
    returnSheetValues,
    setShowGiftsToAdd,
    setShowMessage
  } =  useContext(contexto);

  const generateList = () => {
    const sumRenown = Number(dataSheet.glory) + Number(dataSheet.wisdom) + Number(dataSheet.honor);
    const data = dataGifts.filter((gift: any) => {
      const data = gift.belonging.filter((belong: any) => {
        if ((belong.type === 'global' || belong.type === dataSheet.trybe || belong.type === dataSheet.auspice) && belong.totalRenown <= sumRenown) {
          return belong;
        } else return null;
      });
      if (data.find((item: any) => item !== null)) return gift;
    });
    return data;
  }
  
  const registerGift = async (gift: any) => {
    if (dataSheet.gifts.find((item: any) => item.giftPtBr === gift.giftPtBr))
      dataSheet.gifts = dataSheet.gifts.filter((item: any) => item.giftPtBr !== gift.giftPtBr)
    else dataSheet.gifts.push(gift);
    await updateDataPlayer(sessionId, email, dataSheet, setShowMessage);
    returnSheetValues();
  }

  return(
    <div className="fixed top-0 left-0 w-full h-screen flex flex-col bg-black/70 font-normal p-5 pb-3">
      <div className="bg-black border-2 border-white w-full h-full p-5">
        <div className="flex justify-between">
          <p className="text-white font-bold text-2xl py-3 pt-2">Dons</p>
          <button
            type="button"
            className="p-1 right-3 h-10"
            onClick={ () => setShowGiftsToAdd(false) }
          >
            <IoIosCloseCircleOutline
              className="text-4xl text-white cursor-pointer"
              onClick={ () => setShowGiftsToAdd(false) }
            />
          </button>
        </div>
        <div className="custom-grid">
          <div className="flex-1 pt-3 pb-2 text-justify overflow-y-auto col1-73">
            <div className="p-3 bg-gray-whats-dark">
              {
                generateList().map((gift: any, index2: number) => (
                  <div key={index2} className={`${dataSheet.gifts.find((item: any) => item.giftPtBr === gift.giftPtBr) ? 'bg-black': ''} border-2 border-white p-5 mb-3`}>
                    <div className="w-full flex items-start justify-between">
                      <p className="capitalize text-xl pb-3 font-bold flex flex-col">
                        <span>
                          { gift.giftPtBr } - { 
                          gift.belonging.map((belong: { type: string, totalRenown: number }, index: number) => (
                            <span key={ index } className="capitalize">
                              { capitalizeFirstLetter(belong.type) } ({ belong.totalRenown })
                              { index === gift.belonging.length - 1 ? '' : ', ' }
                            </span>
                          ))}
                        </span>
                        <span>({ gift.gift }) </span>
                      </p>
                      <button
                        type="button"
                        className="p-1 border-2 border-white bg-white right-3"
                        onClick={ () => { registerGift(gift)}}
                      >
                        {
                          dataSheet.gifts.find((item: any) => item.giftPtBr === gift.giftPtBr)
                          ? <MdDelete className="text-black text-xl" />
                          : <IoAdd className="text-black text-xl" />
                        }
                      </button>
                    </div>
                    <p>
                    <span className="pr-1 font-bold">Ação:</span>
                      { gift.action }.
                    </p>
                    <p>
                      <span className="pr-1 font-bold">Renome:</span>
                      { gift.renown }.
                    </p>
                    <p>
                      <span className="pr-1 font-bold">Custo:</span>
                      { gift.cost }.
                    </p>
                    {
                      gift.pool !== '' &&
                      <p>
                        <span className="pr-1 font-bold">Teste:</span>
                        { gift.pool }.
                      </p>
                    }
                    <p className="pt-2">
                      <span className="pr-1 font-bold">Descrição:</span>
                      { gift.descriptionPtBr }
                    </p>
                    <p className="pt-2">
                      <span className="pr-1 font-bold">Sistema:</span>
                      { gift.systemPtBr }
                    </p>
                    {
                      gift.duration !== '' &&
                      <p className="pt-2">
                        <span className="pr-1 font-bold">Duração:</span>
                        { gift.duration }.
                      </p>
                    }
                  </div>
                ))
              }
            </div>
          </div>
          <div className="col2-73 flex flex-col w-full pl-2 pt-3">
            <div className="bg-gray-whats-dark w-full h-full overflow-y-auto p-5">
              <p className="capitalize text-lg pb-3 font-bold">Dons Adicionados</p>
              {
                dataSheet.gifts.map((item: any, index: number) => (
                  <div key={index} className="mt-2">
                     - { item.giftPtBr } ({item.gift}) - { 
                    item.belonging.map((belong: { type: string, totalRenown: number }, index: number) => (
                      <span key={ index } className="capitalize">
                        { capitalizeFirstLetter(belong.type) } ({ belong.totalRenown })
                        { index === item.belonging.length - 1 ? '' : ', ' }
                      </span>
                    ))}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}