import dataAdvantages from '../data/advantagesAndFlaws.json';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionFeedback, actionShowAdvantage, useSlice } from "@/redux/slice";
import Feedback from "./feedback";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useEffect, useState } from 'react';

export default function PopupAdvantage() {
  const dispatch: any = useAppDispatch();
  const slice = useAppSelector(useSlice);
  const [advantageData, setAdvantageData] = useState<any>();

  useEffect(() => {
    const advantage = dataAdvantages.find((ad: any) => slice.showAdvantage.item.name === ad.name);
    setAdvantageData(advantage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <div className="w-full h-screen fixed top-0 left-0 bg-black z-50">
      <section className="mb-2 relative px-2 h-full overflow-y-auto flex flex-col items-center justify-center">
        <div className="w-full flex justify-end mt-5 mb-3 px-2 sm:px-10">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer mb-2"
            onClick={() => dispatch(actionShowAdvantage({ show: false, item: {} }))}
          />
        </div>
        <div className="px-2 sm:px-10 flex flex-col w-full z-20 text-white text-justify">
          <article className="w-full h-full px-4 pb-4 text-white">
            <div className="flex flex-col justify-center dataGifts-center sm:dataGifts-start">
              <h1 className="font-bold text-lg text-center w-full">
                {`${ slice.showAdvantage.item.name } `}
              </h1>
            </div>
            <p className="text-center py-2">{advantageData && advantageData.description }</p>
            {
              slice.showAdvantage.item.advantages.map((ad: any, index: number) => 
              <div key={index}>
                <p className="text-center">Custo { ad.value } - { ad.advantage }</p>
              </div>
            )}
            { 
              slice.showAdvantage.item.flaws.length > 0 && 
              <div>
                {
                  slice.showAdvantage.item.flaws.map((ad: any, index: number) => 
                  <div key={index}>
                    <p className="pt-3 text-center">Custo { ad.value } - { ad.flaw }</p>
                  </div>
                )}
              </div>
            }
            <div className="flex flex-col justify-center items-center">
            <button
              type="button"
              className={`pb-3 ${!slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}`}
              onClick={() => dispatch(actionFeedback({ show: true, message: '' })) }
            >
              Enviar Feedback
            </button>
            {
              slice.feedback.show && <Feedback title={ slice.showAdvantage.item.name } /> 
            }
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}