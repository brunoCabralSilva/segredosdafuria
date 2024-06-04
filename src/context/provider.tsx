'use client'
import { ReactNode, useState } from 'react';
import contexto from './context';
// import { getAllVideos } from '@/firebase/video';
// import { categories } from '@/categories';
// import { getChatsByEmail } from '@/firebase/chat';
// import { getNotificationsByEmail } from '@/firebase/notifications';
// import { getUserByEmail } from '@/firebase/user';

interface IProvider { children: ReactNode }

export default function Provider({children }: IProvider) {
  const [showRegister, setShowRegister] = useState(false);

  const getVideos = async () => {
    // const getVid = await getAllVideos();
    // if (getVid) {
      // setAllFilteredVideos(getVid);
      // setAllVideos(getVid);
      // const uniqueCategories: string[] = [];
      // getVid.forEach((video: any) => {
      //   video.categories.forEach((category: any) => {
      //     if (!uniqueCategories.includes(category)) {
      //       uniqueCategories.push(category);
      //     }
      //   });
      // });
      // setListCategories(uniqueCategories.sort());
    // }
  };

  return (
    <contexto.Provider
      value={{
        showRegister, setShowRegister,
        getVideos,
      }}
    >
      {children}
    </contexto.Provider>
  );
}