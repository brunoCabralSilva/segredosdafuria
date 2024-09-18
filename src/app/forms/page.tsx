'use client'
import { useContext, useEffect } from 'react';
import Image from "next/image";
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import listForms from '../../data/forms.json';
import Link from "next/link";
import Feedback from '@/components/feedback';
import contexto from '@/context/context';

export default function Forms() {
  const { showFeedback, setShowFeedback, resetPopups } = useContext(contexto);
  useEffect(() => resetPopups(), []);
  return (
    <div className="w-full bg-ritual bg-cover bg-top relative">
      <div className="absolute w-full h-full bg-black/80" />
      <Nav />
      <section className="mb-2 relative px-2 pb-5">
        <div className="h-40vh relative flex bg-white items-end text-black">
          <Image
            src={ "/images/25.jpg" }
            alt="Matilha contemplando o fim do mundo diante de um espírito maldito"
            className="absolute w-full h-40vh object-cover object-center"
            width={ 1200 }
            height={ 800 }
          />
        </div>
        <div className="py-6 px-5 bg-black/90 text-white mt-2 flex flex-col items-center sm:items-start text-justify">
          <h1 className="text-4xl relative">Formas</h1>
          <hr className="w-10/12 my-6" />
          <p className="pb-2">
            Um Garou é advindo de um Humano ou um lobo que, ao longo de sua vida, alofra suas habilidades e poderes. Após a Primeira Transformação os Garou aprendem a capacidade de transformar seus corpos em múltiplas formas. Cada forma tem vantagens e desvantagens, bem como limitações em relação à interação manual e social. As formas glabro, crinos e hispo são conhecidas como formas sobrenaturais e também possuem propriedades regenerativas. A maioria dos Dons só pode ser realizada enquanto estiver em uma forma sobrenatural.
          </p>
          <p className="pb-2">
            Especialmente entre os Garou, assumir formas específicas é um poderoso indicador e tem um impacto social inegável. As interações padrão da matilha quase sempre ocorrem nas formas hominídea e lupus - geralmente aquela com a qual o indivíduo se sente mais confortável, ou para mostrar deferência, como ao se curvar perante o lupus. Assumir outras formas geralmente tem um propósito além dos benefícios no uso de ferramentas e movimento. Por exemplo, um galliard pode adotar a forma glabro durante um momento climático ao relatar para os membros da seita uma canção de sacrifício; ou uma Black Fury indignada pode assumir a forma crinos em uma reunião, significando: &quot;Às favas com a política, estou desafiando você para uma luta até a morte, agora.&quot; Escolha sua forma sabiamente.
          </p>
          <p className="pb-2">
            Mudar de forma é uma ação menor que consome dois dados e requer um Teste de Fúria, de acordo com o custo da forma. (Esse custo também deve ser pago para cada cena adicional em que o Garou mantém a forma.) Se o Teste fizer com que eles percam seu último ponto de Fúria, a mudança falha e eles voltam à forma lupina, já que um Garou precisa de pelo menos um ponto de Fúria para permanecer em uma forma sobrenatural. Assim como com Dons e regeneração, a mudança ocorre no início do turno, quando as ações são declaradas, e um personagem só pode mudar de forma uma vez por turno.
          </p>
          <p className="pb-2">
            Observe que a mudança frequente demais (ou frívola...) tem um preço terrível no corpo e na mente. Se um personagem mudar de forma várias vezes em um curto espaço de tempo, como ao buscar simplesmente liberar Fúria, o Narrador pode representar esse enorme estresse corporal infligindo níveis apropriados de dano Agravado à Saúde e/ou Força de Vontade. (Informe ao jogador antes de fazer isso, para ajudar em sua tomada de decisões.)
          </p>
          <p className="pb-2">
            A mudança de forma na frente de humanos comuns normalmente os faz entrar em um episódio do Delírio (consulte p. 142). Certos indivíduos familiarizados com a verdade dos Garou podem não ser afetados, mas em quase todos os casos, o instinto de autopreservação inscrito na memória humana rapidamente vem à tona.
          </p>
        </div>
        <div className="grid grid-cols-1 mobile:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full relative text-white px-4 pb-4 bg-black/90">
          {
            listForms.sort((a, b) => {
              const nomeA = a.name.toLowerCase();
              const nomeB = b.name.toLowerCase();
              return nomeA.localeCompare(nomeB);
            }).map((forms, index) => (
              <Link
                key={ index }
                href={`/forms/${forms.name.replace('í', 'i').toLowerCase()}`}
                className="border-white border-2 p-3 flex items-center justify-center flex-col bg-trybes-background bg-center bg-opacity-10 relative cursor-pointer h-15vh"
              >
              <div className="absolute w-full h-full bg-black/80" />
                <p className="relative font-bold text-center">
                  { forms.name }
                </p>
              </Link>
            ))
          }
        </div>
        <button
          type="button"
          className="pb-3 px-6 text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline"
          onClick={() => setShowFeedback(true) }
        >
          Enviar Feedback
        </button>
        {
          showFeedback && <Feedback title={ 'Página "Formas"'} /> 
        }
      </section>
      <Footer />
    </div>
  );
}