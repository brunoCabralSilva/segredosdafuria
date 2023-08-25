import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/nav';

const listMenu = [
  {
    img: "/images/128.jpg",
    name: 'Início',
    link: '/',
    col: 'col-span-3 sm:col-span-2',
  },
  {
    img: "/images/193.jpg",
    name: 'Tribos',
    link:'/',
    col: 'col-span-2 sm:col-span-2',
  },
  {
    img: "/images/art5.png",
    name: 'Augúrios',
    link:'/',
    col: 'col-span-2 sm:col-span-1',
  },
  {
    img: "/images/95.jpg",
    name: 'Raças',
    link:'/',
    col: 'col-span-3 sm:col-span-1 sm:row-span-1',
  },
  {
    img: "/images/31.jpg",
    name: 'Rituais',
    link:'/',
    col: 'col-span-2 sm:col-span-1 sm:row-span-2',
  },
  {
    img: "",
    name: 'Dons',
    link:'/painel-dons',
    col: 'col-span-3 sm:col-span-1 sm:row-span-1',
  },
  {
    img: "/images/31.jpg",
    name: 'Tribos',
    link:'/',
    col: 'col-span-2 sm:col-span-2 sm:row-span-2',
  },
  {
    img: "/images/41.png",
    name: 'Tribos',
    link:'/',
    col: 'col-span-3 sm:col-span-1',
  },
];

// const item = {
//   hidden: {
//     y: 20,
//     opacity: 0
//   },
//   visible: (index) => ({
//     y: 0,
//     opacity: 1,
//     transition: {
//       delay: 0.5 + (0.1 * index),
//       duration: 0.5,
//       type: 'spring',
//       stiffness: 150
//     }
//   }),
//   exit: (index) => ({
//     y: 20,
//     opacity: 0,
//     transition: {
//       delay: (0.1 * index),
//       duration: 0.1,
//     }
//   }),
// }

export default function Menu() {
  return(
    <div className="items-center justify-center h-screen w-screen bg-ritual">
      <Nav />
      {/* {
        listMenu.map((list, index) => (
          <Link
            key={ index }
            href={list.link}
            className={`${list.col} bg-black h-full w-full`}
            >
              <div
                key={index}
                className="relative hover:border hover:border-white h-full"
                // custom={index}
                // variants={item}
                // initial="hidden"
                // animate="visible"
                // exit="exit"
              >
                <Image
                  src={list.img}
                  alt="werewolf"
                  className="absolute h-full w-full object-cover"
                  width={2000}
                  height={800}
                />
                <p className="relative w-full h-full z-10 text-white font-bold flex items-end p-2">
                  {list.name}
                </p>
              </div>
          </Link>
        ))
      } */}
    </div>
  );
}