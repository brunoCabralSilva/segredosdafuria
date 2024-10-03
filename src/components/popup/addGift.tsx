'use client'
import { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import dataGifts from '../../data/gifts.json';
import contexto from "@/context/context";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import Gift from "../player/gift";

export default function AddGift() {
  const {
    dataSheet,
    setShowGiftsToAdd,
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

  return(
    <div className="z-80 fixed top-0 left-0 w-full h-screen flex flex-col bg-black/70 font-normal p-2 sm:p-5 pb-3">
      <div className="bg-black border-2 border-white w-full h-full p-2 sm:p-5">
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
          <div className="flex-1 pt-3 text-justify overflow-y-auto col1-73">
            <div className="sm:px-3">
              {
                generateList().map((gift: any, index2: number) => (
                  <Gift gift={gift} key={index2} index={index2} length={generateList().length}  />
                ))
              }
            </div>
          </div>
          <div className="col2-73 hidden sm:flex flex-col w-full pl-2 pt-3">
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