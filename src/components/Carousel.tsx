import React, { useEffect, useRef } from 'react';
import SwiperCore, { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { EffectCube, Pagination } from 'swiper/modules';

export default function Carousel(props : { list: String[] }) {
  return (
    <Swiper
      effect="cube"
      // grabCursor={true}
      // modules={[EffectCube, Pagination]}
      // cubeEffect={{
      //   shadow: true,
      //   slideShadows: true,
      //   shadowOffset: 20,
      //   shadowScale: 0.94,
      // }}
      // pagination={{ clickable: true }}
      // navigation={true}
      loop={ true }
    >
      {
        props.list.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="bg-black/80 color-black h-screen flex items-center justify-center">
              <span className="flex items-center justify-center bg-white p-5 w-1/2 h-96">{ item }</span>
            </div>
          </SwiperSlide>
        ))
      }
    </Swiper>
  );
};
