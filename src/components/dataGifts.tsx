import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import Image from "next/image";

export default function DataGifts() {
  const slice = useAppSelector(useSlice);
  return (
    <div className="mb-2">
      { !slice.simplify &&
        <div className="h-40vh relative flex bg-black items-end text-black">
        <Image
          src={ "/images/32.jpg" }
          alt="Matilha contemplando o fim do mundo diante de um espírito maldito"
          className="absolute w-full h-40vh object-cover object-top"
          width={ 1200 }
          height={ 800 }
        />
      </div>
      }
      <div className="py-6 px-5 bg-black/90 mt-2 flex flex-col items-center sm:items-start text-justify">
        <h1 className="text-4xl z-10 relative">Dons</h1>
        <hr className="w-10/12 my-6" />
        <p className="pb-2">
          Um Dom e seus efeitos são a expressão de um pacto entre um lobisomem e um espírito. Os Garou ativos durante a era do Apocalipse passam grande parte do seu tempo buscando e estabelecendo relacionamentos com espíritos, além de manter aqueles que já possuem.
        </p>
        <p className="pb-2">
          Quando os Dons se manifestam, cada um é diferente, e até o mesmo Dom parece diferente quando utilizado por diferentes Garou. Alguns envolvem uma prece sussurrada, outros o toque de uma marca que simboliza o pacto espiritual, e ainda outros começam com um uivo arrepiante. A menos que seja declarado o contrário, o uso de um Dom é sempre evidente, e outros Garou reconhecem que um Dom está sendo usado, mesmo que sua natureza não seja imediatamente óbvia. Os humanos têm menos probabilidade de perceber o uso dos Dons, e se o fazem, tendem a interpretar o ato como um juramento, gesto ou maldição religiosa ou cultural.
        </p>
        <h1 className="text-2xl pt-7">Como utilizar o filtro de busca</h1>
        <hr className="w-10/12 my-4" />
        <p className="py-2">
          Filtros Tribos, Augúrios e Dons Nativos retornarão qualquer dom que inclua um dos selecionados:
        </p>
        <p className="py-2">
          Exemplo - Ao selecionar A tribo dos roedores de ossos e o augúrio Ahroun, a busca retornará qualquer dom que pertença aos aos roedores de ossos ou aos Ahroun, sem necessariamente precisar pertencer aos dois filtros selecionados;
        </p>
        <p className="py-2">
          Filtros de Renome Total só retornarão os dons que tiverem um valor igual ou menor que o valor cedido:
        </p>
        <p className="py-2">
          Exemplo - Se selecionar o valor de Renome Total 6, só aparecerão dons que possuem Renomes Totais de 6 abaixo;
        </p>
        <p className="py-2">
          Mesclando as duas categorias de filtros acima citados, você pode achar qualquer dom que desejar:
        </p>
        <p className="py-2">
          Exemplo - ao selecionar os filtros de augúrio Ahroun, tribo dos Presas de Prata e Renome total 7, serão retornados todos os dons de Renome total 3 que pertençam ao augúrio Ahroun ou a tribo dos Presas de Prata;
        </p>

        <p className="py-2">
          Ao selecionar algum filtro, o item selecionado aparecerá em um pop-up no canto inferior direito, onde você poderá acompanhar todos os filtros escolhidos e também removê-los caso deseje;
        </p>
        <p className="py-2">
          Marcar a opção &quot;Clique aqui para incluir Dons Nativos na Busca&quot; implica dizer que todos os Dons nativos que correspondam ao filtro de busca serão retornados. Caso seja o único filtro, só serão retornados Dons Nativos (mantenha a opção desmarcada para retornar todos os dons). Caso não haja nenhum filtro selecionado, serão retornados todos os dons, inclusive os Nativos.
        </p>
        <p className="py-2">
          Caso você digite algum trecho no campo &quot;Digite aqui&quot;, logo abaixo do título &quot;Digite o nome ou um trecho do nome do Dom&quot;, o método de busca retornará todos os dons que possuírem o trecho digitado em seu nome, seja em inglês ou português, aplicando os demais filtros antes de fazer esta filtragem. Por exemplo, se você apenas digitar o trecho &quot;beyond&quot; e não escolher nenhuma outra seleção, o método de busca retornará, dentre todos os dons existentes, os que possuem &quot;beyond&quot; no seu nome. Caso você digite o trecho &quot;beyond&quot; e também clique na seleção de Augúrio &quot;Theurge&quot;, só serão retornados os dons de Theurge que possuem o trecho digitado.
        </p>
        <p className="py-2">
          Não selecionar nenhum filtro retornará uma lista com todos os dons.
        </p>

        <p>OBS - Você notará que, ao fim de cada Dom, haverá uma opção de &quot;Enviar Feedback&quot;. Você poderá usá-lo, caso encontre algum ponto de melhoria no dom em questão (seja uma tradução que pode melhorar, ou um erro de digitação, ou ausência de informações ou informações em locais errados), você possa encaminhar para o adm da página para que ele a corrija. É uma espécie de, mutuamente, melhorar a qualidade dos dados que estamos divulgando por meio desta aplicação! </p>
      </div>
    </div>
  );
}