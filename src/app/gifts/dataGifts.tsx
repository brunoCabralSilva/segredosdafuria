import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import Image from "next/image";

export default function DataGifts() {
  const slice = useAppSelector(useSlice);
  return (
    <section className="mb-2">
      { !slice.simplify &&
        <div className="h-40vh relative flex bg-white items-end text-black">
        <Image
          src={ "/images/84.png" }
          alt="Matilha contemplando o fim do mundo diante de um espírito maldito"
          className="absolute w-full h-40vh object-contain bg-white"
          width={ 1200 }
          height={ 800 }
        />
      </div>
      }
      <div className="py-6 px-5 bg-black/90 mt-2 flex flex-col items-center sm:items-start text-justify">
        <h1 className="text-4xl relative">Dons</h1>
        <hr className="w-10/12 my-6" />
        <p className="pb-2">
          Um Dom e seus efeitos são a expressão de um pacto entre um lobisomem e um espírito. Os Garou ativos durante a era do Apocalipse passam grande parte do seu tempo buscando e estabelecendo relacionamentos com espíritos, além de manter aqueles que já possuem.
        </p>
        <p className="pb-2">
          Quando os Dons se manifestam, cada um é diferente, e até o mesmo Dom parece diferente quando utilizado por diferentes Garou. Alguns envolvem uma prece sussurrada, outros o toque de uma marca que simboliza o pacto espiritual, e ainda outros começam com um uivo arrepiante. A menos que seja declarado o contrário, o uso de um Dom é sempre evidente, e outros Garou reconhecem que um Dom está sendo usado, mesmo que sua natureza não seja imediatamente óbvia. Os humanos têm menos probabilidade de perceber o uso dos Dons, e se o fazem, tendem a interpretar o ato como um juramento, gesto ou maldição religiosa ou cultural.
        </p>
        <h1 className="text-2xl pt-7 text-center sm:text-justify">Como utilizar o filtro de busca</h1>
        <hr className="w-10/12 my-4" />
        <ol className="list-decimal pl-4">
          <li className="py-3">
            Não selecionar nenhum filtro retornará uma lista com todos os dons existentes.
          </li>
          <li className="py-3">
            Os Filtros Tribos, Augúrios e Dons Nativos retornarão qualquer dom que inclua uma das seleções.
          </li>
          <p className="py-3">
            Exemplo - Bruno selecionou a tribo dos Roedores de ossos e o augúrio Ahroun. Desta forma, a busca retornará qualquer dom que pertença aos Roedores de ossos OU aos Ahroun, sem necessariamente precisar pertencer aos dois filtros selecionados ao mesmo tempo.
          </p>
          <li className="py-3">
            Filtros de Renome Total só retornarão os dons que tiverem um valor igual ou menor que o valor cedido. Além disso, escolher um Renome Total filtra os dons de Tribos, Augúrios e Dons Nativos.
          </li>
          <p className="py-3">
            Exemplo - Jocélio selecionou o valor de Renome Total 6, então só aparecerão dons que possuem Renomes Totais iguais ou abaixo de 6. Da mesma forma, Audeam selecionou os filtros de augúrio Ahroun, tribo dos Presas de Prata e Renome total 7. Sendo assim, serão retornados todos os dons de Renome total 3 que pertençam ao Augúrio dos Ahroun ou a tribo dos Presas de Prata.
          </p>
          <li className="py-3">
            Marcar a opção &quot;Clique aqui para incluir Dons Nativos na Busca&quot; implica dizer que serão retornados todos os Dons nativos que correspondam ao Renome Selecionado. Caso o(s) filtro(s) selecionado(s) seja(m) de Augúrios ou Tribos ao invés de Renome, a busca retornará todos os dons que pertencam a pelo menos uma das seleções, seja Augúrio, Tribo ou Dom Nativo. Caso não haja nenhum outro filtro além do de &quot;Incluir Dons Nativos na busca&quot;, só serão retornados Dons Nativos (mantenha a opção desmarcada para retornar todos os dons).
          </li>
          <p>
            Exemplo: Felipe selecionou a opção &quot;Clique aqui para incluir Dons Nativos na Busca&quot; e escolheu a seleção de Renome total 8. Serão retornados para ele todos os Dons Nativos que tenham um Renome Total igual ou abaixo de 8. Depois, Felipe selecionou a opção &quot;Clique aqui para incluir Dons Nativos na Busca&quot; e também a Tribo dos Andarilhos do Asfalto. Desta forma, serão retornados todos os dons que pertençam aos Dons Nativos ou aos Andarilhos do Asfalto. 
          </p>
          <li className="py-3">
            Caso você digite algum trecho no campo &quot;Digite aqui&quot;, (localizado logo abaixo do título &quot;Digite o nome ou um trecho do nome do Dom&quot;), o método de busca retornará todos os dons que possuírem o trecho digitado em seu nome, seja em inglês ou português, aplicando os demais filtros antes de fazer esta filtragem.
          </li>
          <p>
            Exemplo - Jess digitou o trecho &quot;beyond&quot; e não escolheu nenhuma outra seleção. Assim, o método de busca retornará todos os dons existentes que possuem &quot;beyond&quot; no seu nome. Depois, ela digitou novamente o trecho &quot;beyond&quot; e também clicou na seleção de Augúrio &quot;Theurge&quot;. Desta forma, só serão retornados os dons pertencentes aos Theurge que possuem o trecho digitado.
          </p>
          <li className="py-3">
            Ao selecionar algum filtro, ele aparecerá dentro do botão de busca.
          </li>
        </ol>
        <p className="pt-2">OBS - Você notará que, ao fim de cada Dom, haverá uma opção de &quot;Enviar Feedback&quot;. Você poderá usá-lo, caso encontre algum ponto de melhoria no dom em questão (seja uma tradução que pode melhorar, ou um erro de digitação, ou ausência de informações ou informações em locais errados). Desta forma, será possível encaminhar para o administrador da página a melhoria para que ela seja avaliada. Assim, melhoramos a qualidade dos dados que estamos cedendo por meio desta aplicação! </p>
      </div>
    </section>
  );
}