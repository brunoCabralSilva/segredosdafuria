import { motion } from "framer-motion";
import Image from 'next/image';

export default function InConstruction() {
  return(
    <section className="relative h-screen flex flex-col items-center justify-center text-white text-2xl">
      <motion.h2
        initial={{opacity:0}}
        animate={{opacity:1, transition: {delay: 0.2, duration: 1 }}}
        exit={{opacity:0, transition: { duration: 0.5 }}}
        className="mb-6 text-center w-10/12 mt-20 sm:mt-0"
      >
        Estamos em Construção...
      </motion.h2>
      <motion.h2
        initial={{opacity:0}}
        animate={{opacity:1, transition: {delay: 0.3, duration: 1 }}}
        exit={{opacity:0, transition: { duration: 0.5 }}}
        className="text-center w-10/12"
      >
        Aguarde e em breve retornaremos mais fortes!
      </motion.h2>
      <motion.div 
        initial={{opacity:0}}
        animate={{opacity:1, transition: {delay: 0.3, duration: 1 }}}
        exit={{opacity:0, transition: { duration: 0.5 }}}
        className="flex flex-row justify-center"
      >
        <Image
          src="/images/logos/wolf_run.gif"
          alt="gif de lobo branco correndo"
          className="constr-gif-wolf"
          width={200}
          height={100}
        />
        <Image
          src="/images/logos/wolf_run.gif"
          alt="gif de lobo branco correndo"
          className="hidden sm:flex constr-gif-wolf"
          width={200}
          height={100}
        />
        <Image
          src="/images/logos/wolf_run.gif"
          alt="gif de lobo branco correndo"
          className="hidden md:flex an constr-gif-wolf"
          width={200}
          height={100}
        />
      </motion.div>
    </section>
  );
}