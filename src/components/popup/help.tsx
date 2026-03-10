'use client'
import contexto from "@/context/context";
import Image from "next/image";
import { useContext, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import dataForms from '../../data/forms.json';

export default function Help() {
  const { setShowHelp } = useContext(contexto);
  const [type, setType] = useState('Lista de Atributos');
  const order = ['Hispo', 'Glabro', 'Lupino', 'Humano'];

  return (
    <div className="z-80 sm:z-50 fixed md:relative w-full h-screen flex flex-col items-center justify-center bg-black/80 px-3 sm:px-0 border-white border-2">
      <div className="w-full flex justify-center pt-3 bg-black">
        <div className="px-2 sm:px-5 text-white font-bold text-2xl w-full">Ajuda (Regras Rápidas)</div>
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer mr-5"
          onClick={ () => setShowHelp(false) }
        />
      </div>
      <div className="px-2 md:px-5 w-full h-full overflow-y-auto text-white md:grid md:grid-cols-11 gap-3 mt-5 mb-10 bg-black pb-5">
        <select
          className="w-full bg-black text-white col-span-1 p-2 outline-none border border-white flex md:hidden mb-2 text-center"
          value={ type }
          onChange={ (e: any) => setType(e.target.value) }
        >
          <option value="Lista de Atributos">
            Lista de Atributos
          </option>
          <option value="Lista de Habilidades">
            Lista de Habilidades
          </option>
          <option value="Formas">
            Formas
          </option>
          <option value="Fúria, Frenesi e Delírio">
            Fúria, Frenesi e Delírio
          </option>
          <option value="Dificuldade e Iniciativa">
            Dificuldade e Iniciativa
          </option>
          <option value="Renome, Litania e Vexame">
            Renome, Litania e Vexame
          </option>
          <option value="Pilares, Harano e Hauglosk">
            Pilares, Harano e Hauglosk
          </option>
          <option value="Experiência e Modelos de NPCs">
            Experiência e Modelos de NPCs
          </option>
          <option value="Ritos e Hierarquia Espiritual">
            Ritos e Hierarquia Espiritual
          </option>
          <option value="Conflitos">
            Conflitos
          </option>
          <option value="Dano">
            Dano
          </option>
          <option value="Armas e Armaduras">
            Armas e Armaduras
          </option>
          <option value="Feitos de Força">
            Feitos de Força
          </option>
          <option value="Vitalidade e Debilitação">
            Vitalidade e Debilitação
          </option>
          <option value="Força de Vontade">
            Força de Vontade
          </option>
        </select>
        <div className="hidden w-full md:flex flex-col gap-2 md:col-span-2 overflow-y-auto h-full md:pr-2">
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Lista de Atributos' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Lista de Atributos') }
          >
            Lista de Atributos
          </button>
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Lista de Habilidades' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Lista de Habilidades') }
          >
            Lista de Habilidades
          </button>
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Formas' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Formas') }
          >
            Formas
          </button>
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Fúria, Frenesi e Delírio' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Fúria, Frenesi e Delírio') }
          >
            Fúria, Frenesi e Delírio
          </button>
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Dificuldade e Iniciativa' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Dificuldade e Iniciativa') }
          >
            Dificuldade e Iniciativa
          </button>
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Renome, Litania e Vexame' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Renome, Litania e Vexame') }
          >
            Renome, Litania e Vexame
          </button>
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Pilares, Harano e Hauglosk' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Pilares, Harano e Hauglosk') }
          >
            Pilares, Harano e Hauglosk
          </button>
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Experiência e Modelos de NPCs' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Experiência e Modelos de NPCs') }
          >
            Experiência e Modelos de NPCs
          </button>
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Ritos e Hierarquia Espiritual' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Ritos e Hierarquia Espiritual') }
          >
            Ritos e Hierarquia Espiritual
          </button>
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Conflitos' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Conflitos') }
          >
            Conflitos
          </button>
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Dano' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Dano') }
          >
            Dano
          </button>
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Armas e Armaduras' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Armas e Armaduras') }
          >
            Armas e Armaduras
          </button>
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Feitos de Força' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Feitos de Força') }
          >
            Feitos de Força
          </button>
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Vitalidade e Debilitação' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Vitalidade e Debilitação') }
          >
            Vitalidade e Debilitação
          </button>
          <button
            type="button"
            className={`border transition-colors duration-400 border-white w-full p-2 text-sm ${type === 'Força de Vontade' ? 'bg-white text-black' : ''}`}
            onClick={ () => setType('Força de Vontade') }
          >
            Força de Vontade
          </button>
        </div>
        <div className="col-span-9 md:border md:border-white w-full h-full md:overflow-y-auto p-1 md:p-5 bg-black">
          {
            type === 'Lista de Atributos' &&
            <div className="w-full">
              <div className="pb-5 grid grid-cols-4">
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">Atributos</div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">Resumo</div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Força
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Determina o quanto você pode erguer, a potência dos seus socos e o poder geral que seu corpo pode exercer.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Destreza
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Governa sua agilidade e elegância, a rapidez com que você se esquiva de ataques e quanto controle motor apurado você possui quando está contra o relógio.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Vigor
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Sua resistência física: absorve danos físicos, como uma bala em alta velocidade ou as garras de um lobisomem rival, além de permitir que você não ceda a riscos ambientais e esforço árduo.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Carisma
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Mede seu charme natural, presença e sex appeal.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Manipulação
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  É a sua capacidade de convencer os outros do seu ponto de vista, mentir de forma verossímil e partir após enganar alguém sem que ninguém tenha notado.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Autocontrole
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Permite a você manter a calma, dominar suas emoções e deixar à vontade até mesmo as pessoas ansiosas.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Inteligência
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Mede sua capacidade de pensar, pesquisar e aplicar a lógica. Você é capaz de recordar e analisar informações obtidas nos livros ou por meio dos seus sentidos.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Raciocínio
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Indica pensamento rápido e respostas adequadas diante de poucas informações, o tempo de reação e a capacidade de tomar decisões em frações de segundo.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Determinação
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Proporciona foco e persistência, além de quantificar a capacidade de concentração e a força da mente. Este Atributo impele vigílias que varam a noite e bloqueia distrações, especialmente em uma sociedade moderna e tecnológica cheia de coisas para desviar sua atenção.
                </div>
              </div>
            </div>
          }
          {
            type === 'Lista de Habilidades' &&
            <div className="w-full">
              <div className="pb-5 grid grid-cols-4">
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">Habilidade</div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">Resumo</div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Atletismo
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Permite que você supere alguém em uma perseguição, salte para desviar de um carro que se aproxima, e escale e nade com robustez
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Armas Brancas
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Permite manejar armas portáteis como facas, correntes, tacos de beisebol ou klaives com maestria.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Armas de Fogo
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Familiaridade com armas pequenas, de pistolas de bolso a fuzis de assalto. Além disso, inclui outras armas acionáveis por gatilhos - como bestas e lança-foguetes de ombro - e também arcos. Por fim, ela inclui a limpeza, destravamento e recarregamento rápido dessas armas.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Briga
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Permite que os personagens atinjam seus alvos com punhos, pés ou garras.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Condução
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Implica a capacidade de dirigir com segurança e velocidade em condições adversas ou situações estressantes, como manobrar fora da estrada, evitar emboscadas, vencer corridas de rua e escapar de perseguições da polícia, caçadores ou forças de segurança.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Furtividade
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Permite que um personagem siga um alvo sem ser percebido, seja em um ambiente urbano ou nos ermos remotos.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Ladroagem
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Implica familiaridade com ferramentas e técnicas para abrir fechaduras, plantar escutas, desativar alarmes antirroubo residenciais e veiculares, falsificar documentos à mão, fazer ligação direta em automóveis ou até mesmo abrir cofres, além de inúmeras formas de arrombar e invadir.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Ofícios
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Abrange as artes, a criação de itens belos ou meramente funcionais, e ofícios que vão de trabalhar cerâmica até arquitetura e design de interiores.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Sobrevivência
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Capacidade de viver na natureza e em outras condições adversas. Guiar-se pelas estrelas, erguer um abrigo improvisado e reconhecer sinais de presas e predadores fazem parte desta Habilidade, bem como encontrar comida e buscar abrigo. 
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Empatia com Animais
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Permite que você intimide, pacifique e até faça amizade com animais. 
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Etiqueta
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Capacidade de identificar e responder as convenções sociais atuais, estabelecer novos protocolos e agradar a todos com seu encanto. 
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Intimidação
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Poder de oprimir, coagir, ameaçar e forçar seu caminho para uma vitória social. 
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Liderança
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Capacidade de conduzir uma multidão, comandar um destacamento, aumentar a moral de apoiadores e conter (ou provocar) uma revolta. 
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Manha
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Permite ao personagem falar a língua e superar os obstáculos das ruas e do submundo. 
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Performance
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Abrange uma variedade de artes, da dança à poesia, da comédia ao melodrama.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Persuasão
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Usada ao tentar fazer as pessoas mudarem de ideia e aceitarem sua opinião - ou ao tentar convencê-las de que você sabe o que é melhor para elas. 
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Sagacidade
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Capacidade de interpretar linguagem corporal, notar dicas sueis na expressão e no tom e distinguir a verdade da mentira.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Subterfúgio
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Arte de mentir de forma convincente, criar &quot;narrativas&quot; para pautar o debate e inventar ótimas desculpas para ações nada boas. 
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Ciência
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Cobre desde os princípios básicos da vida até a compreensão da entropia universal. As leis da ciência governam o mundo físico - na maioria das vezes - e são estudadas pelos garous que fazem parte desse mundo.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Erudição
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Reflete compreensão, ensino superior e a capacidade de pesquisar nos campos das ciências humanas e profissões liberais.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Finanças
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Permite que você identifique tendências de mercado, invista bem, manipule ações e saiba quando uma crise financeira está chegando. 
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Investigação
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Permite desvendar casos mundanos e misteriosos, localizar pistas, interpretá-las e rastrear pessoas desaparecidas. 
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Medicina
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Possibilita que você trate pessoas ou animais enfermos e faça diagnósticos de causas de morte ou de doenças. 
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Ocultismo
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Representa o que se conhece do mundo místico - sejam os ritos (ou Rituais) e as práticas de várias concepções culturais, como a Umbra, ou o esoterismo em maior ou menor grau. 
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Percepção
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Engloba todos os seus sentidos. Os cabelos da sua nuca podem ficar arrepiados antes de você ser emboscado pelos fomori, você pode notar uma chave jogada no lixo ou sentir um aroma persistente.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Política
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Abrange a diplomacia, tanto humana quanto garou, bem como a burocracia das instituições humanas.
                </div>
                <div className="border border-b-white p-2 text-center col-span-2 md:col-span-1">
                  Tecnologia
                </div>
                <div className="border border-b-white p-2 col-span-2 md:col-span-3">
                  Rege a operação e a compreensão de inovações tecnológicas &quot;modernas&quot;, mas a definição de moderno é um tanto impressionista. Cem anos atrás, Tecnologia poderia abranger principalmente motores a vapor e eletricidade. Hoje em dia, implica computadores e sistemas de informática.
                </div>
              </div>
            </div>
          }
          {
            type === 'Formas' &&
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
              {
                dataForms.filter((form: any) => form.name === 'Crinos').map((form: any, index: number) => (
                  <div
                    key={index}
                    className="w-full cursor-pointer flex-col items-center justify-center border border-white p-5"
                  >
                    <div className="w-full flex items-center justify-center">
                      <Image
                        src={`/images/forms/${form.name}-white.png`}
                        alt={`Glifo dos ${form.name}`}
                        className="object-cover object-top w-14"
                        width={800}
                        height={400}
                      />
                    </div>
                    <div>
                      <p className="w-full text-center py-2 text-white">{ form.name } - { form.subtitle }</p>
                      <ul className="pl-5 text-sm font-normal text-white">
                          <li className="list-disc">
                            {
                              form.cost === 'Nenhum.'
                                ? 'Nenhum Teste de Fúria'
                                : form.cost
                            }
                          </li>
                        {
                          form.resume.map((item: string, index: number) => (
                            <li className="list-disc text-justify" key={index}>
                              { item }
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>
                ))
              }
              <div className="w-full col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {
                  dataForms
                    .filter((form: any) => form.name !== 'Crinos')
                    .sort((a: any, b: any) => {
                      const indexA = order.indexOf(a.name);
                      const indexB = order.indexOf(b.name);

                      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
                    })
                    .map((form: any, index: number) => (
                      <div
                        key={index}
                        className="w-full cursor-pointer flex-col items-center justify-center border border-white p-5"
                      >
                        <div className="w-full flex items-center justify-center">
                          <Image
                            src={`/images/forms/${form.name}-white.png`}
                            alt={`Glifo dos ${form.name}`}
                            className="object-cover object-top w-14"
                            width={800}
                            height={400}
                          />
                        </div>
                        <div>
                          <p className="w-full text-center py-2 text-white">{ form.name } - { form.subtitle }</p>
                          <ul className="pl-5 text-sm font-normal text-white">
                              <li className="list-disc">
                                {
                                  form.cost === 'Nenhum.'
                                    ? 'Nenhum Teste de Fúria'
                                    : form.cost
                                }
                              </li>
                            {
                              form.resume.map((item: string, index: number) => (
                                <li className="list-disc text-justify" key={index}>
                                  { item }
                                </li>
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                  ))
                }
              </div>
            </div>
          }
          {
            type === 'Fúria, Frenesi e Delírio' &&
            <div className="w-full p-2">
              <p className="w-full text-center md:text-left">Fúria (p. 131)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Uma checagem de Fúria é realizada com um único dado. Em caso de vitória - resultado 6 ou mais -, a Fúria do Garou continuará a mesma, mas uma falha - 5 ou menos - reduzirá sua Fúria em 1.
                    </li>
                    <li className="list-disc">
                      A Fúria é uma trilha que vai de 0 à 5.
                    </li>
                    <li className="list-disc">
                      Ganha-se Fúria por meio do primeiro uivo da noite dirigido à lua (único método físico de ganhar Fúria se tiver perdido o lobo), sofrendo dano pela primeira vez durante um combate, tocar a prata (um ponto de Fúria por turno), sofrer dano de Prata (taxa de 1 ponto de Fúria para cada ponto de dano de Prata), provocações e certos Dons ou Rituais.
                    </li>
                    <li className="list-disc">
                      Gasta-se Fúria por meio de checagens de Fúria realizadas com o intuito de regenerar, mudar de forma ou utilizar Dons.
                    </li>
                    <li className="list-disc">
                      Ganhar Fúria suficiente para ultrapassar o limite de 5 pontos causa um de dano Superficial à Força de Vontade para cada ponto ultrapassado.
                    </li>
                    <li className="list-disc">
                      Um Garou com Fúria 0 não consegue praticar atos que exigem checagens de Fúria, manter uma forma sobrenatural ou utilizar Dons ou Rituais.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Dados de Fúria em Testes (p. 133)</p>
                <hr className="pb-3 mt-2" />
                <div className="w-full">
                  <div className="pb-5 text-justify">
                    <ul className="pl-5 text-sm font-normal text-white">
                      <li className="list-disc">
                        Para cada ponto de Fúria, troque um dado por um ponto de Fúria nas suas paradas.
                      </li>
                      <li className="list-disc">
                        Os dados de Fúria têm os mesmos lados de um d10 comum, mas &quot;1&quot; e &quot;2&quot; são considerados resultados Brutais.
                      </li>
                      <li className="list-disc">
                        Dois ou mais resultados Brutais provocam uma consequência Brutal, o que costuma produzir uma falha, a menos que o objetivo seja fazer mal ou causar dano.
                      </li>
                      <li className="list-disc">
                        Não é possível gastar Força de Vontade para rerrolar dados com resultados Brutais.
                      </li>
                    </ul>
                  </div>
                </div>
                <Image
                  src="/images/regras-de-dados-de-furia.png"
                  alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
                  className="w-1/3 object-contain ml-5"
                  width={2000}
                  height={800}
                  priority
                />
              <p className="w-full pt-5 text-center md:text-left">Frenesi (p. 139)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Os personagens Garous entram em frenesi quando não gastam Força de Vontade por causa da forma crinos, ou quando são provocados ao extremo e não passam em um teste de Força de Vontade.
                    </li>
                    <li className="list-disc">
                      Ao entrar em Frenesi, os Garous aumentam sua Fúria para 5 e mudam para a forma crinos (Faça as checagens de Fúria habituais).
                    </li>
                    <li className="list-disc">
                      Durante o Frenesi, os Garous ignoram as penalidades de Debilitação (a não ser que tenha sofrido desmembramento) e têm um bônus de três dados para resistir à maioria dos poderes ou efeitos mentais.
                    </li>
                    <li className="list-disc">
                      Se alguém o estiver atacando, o lobisomem será obrigado a tentar encurtar a distância e travar combate com seu atacante, usando suas armas naturais. Se ninguém o estiver atacando, em primeiro lugar ele persegue quem sair correndo e, depois, atacará possíveis espectadores.
                    </li>
                    <li className="list-disc">
                      Durante o Frenesi, os Garous não conseguem usar Dons, Força de Vontade de maneira alguma e também não tomarão atitudes defensivas.
                    </li>
                    <li className="list-disc">
                      Os Garous poderão sair do Frenesi com uma vitória em um teste de Força de Vontade com Dificuldade 2, Assim que todos os inimigos estiverem mortos ou incapacitados. Se não passarem no teste, continuarão agressivos até sua Fúria acabar ou a cena chegar ao fim. Dons e Rituais também podem encerrar o Frenesi.
                    </li>
                    <li className="list-disc">
                      Assim que os Garous saem do Frenesi, sua Fúria cai para 0, fazendo-os perder o lobo.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Delírio (p. 142)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div>Autocontrole + Determinação de 1 - 5:</div>
                <div className="pb-5 text-justify">Medo (pânico, descrença, catatonia em posição fetal e uma tentativa desesperada e provavelmente inútil de se fingir de morto). Esquece o que presenciou.</div>

                <div>Autocontrole + Determinação de 6 - 9:</div>
                <div className="pb-5 text-justify">Medo controlado (impulso de autopreservação, mas com reações possivelmente recionais ou protetoras, como disparar uma arma no monstro enquanto corre ou tentativas desesperadas de escapar trancando as portar ou lançando obstáculos pelo caminho para ver se o perseguidor desiste).Geralmente esquece o que presenciou.</div>

                <div>Autocontrole + Determinação igual ou maior que 10:</div>
                <div className="text-justify">Resignação (aceita a situação com a qual precisa lidar e toma uma decisão a partir daí).</div>
                <div>Não esquece o que presenciou.</div>

              </div>
            </div>
          }
          {
            type === "Feitos de Força" &&
            <div className="w-full">
              <div className="pb-5 grid grid-cols-7">
                <div className="border-b-white border p-2 text-center">Força</div>
                <div className="border-b-white border p-2 text-center col-span-3">Feitos</div>
                <div className="border-b-white border p-2 text-center col-span-3">Peso Levantado (kg)</div>
                <div className="border-b-white border p-2 text-center">1</div>
                <div className="border-b-white border p-2 text-center col-span-3">Amassar uma lata de cerveja</div>
                <div className="border-b-white border p-2 text-center col-span-3">20 (árvore de Natal, placa de &quot;PARE&quot;)</div>
                <div className="border-b-white border p-2 text-center">2</div>
                <div className="border-b-white border p-2 text-center col-span-3">Quebrar uma cadeira de madeira</div>
                <div className="border-b-white border p-2 text-center col-span-3">45 (vaso sanitário)</div>
                <div className="border-b-white border p-2 text-center">3</div>
                <div className="border-b-white border p-2 text-center col-span-3">Botar abaixo uma porta de madeira</div>
                <div className="border-b-white border p-2 text-center col-span-3">115 (tampa de bueiro, caixão vazio, geladeira)</div>
                <div className="border-b-white border p-2 text-center">4</div>
                <div className="border-b-white border p-2 text-center col-span-3">Quebrar uma tábua; arrombar uma porta comum</div>
                <div className="border-b-white border p-2 text-center col-span-3">180 (caixão cheio, caçamba de lixo vazia)</div>
                <div className="border-b-white border p-2 text-center">5</div>
                <div className="border-b-white border p-2 text-center col-span-3">Arrombar uma porta corta-fogo; rasgar uma cerca de arame ou portão fechado por correntes</div>
                <div className="border-b-white border p-2 text-center col-span-3">250 (motocicleta)</div>
                <div className="border-b-white border p-2 text-center">6</div>
                <div className="border-b-white border p-2 text-center col-span-3">Arremessar uma motocicleta; partir algemas</div>
                <div className="border-b-white border p-2 text-center col-span-3">360 (poste de luz alto e feito de aço)</div>
                <div className="border-b-white border p-2 text-center">7</div>
                <div className="border-b-white border p-2 text-center col-span-3">Virar um carro pequeno de pontacabeça; estourar um cadeado</div>
                <div className="border-b-white border p-2 text-center col-span-3">410 (cavalo)</div>
                <div className="border-b-white border p-2 text-center">8</div>
                <div className="border-b-white border p-2 text-center col-span-3">Quebrar um cano de chumbo; atravessar uma parede de tijolos com um soco</div>
                <div className="border-b-white border p-2 text-center col-span-3">455 (poste telefônico, piano de cauda)</div>
                <div className="border-b-white border p-2 text-center">9</div>
                <div className="border-b-white border p-2 text-center col-span-3">Atravessar concreto com um soco; partir correntes; arrancar a porta de um carro</div>
                <div className="border-b-white border p-2 text-center col-span-3">545 (tronco de árvore, avião pequeno)</div>
                <div className="border-b-white border p-2 text-center">10</div>
                <div className="border-b-white border p-2 text-center col-span-3">Quebrar um cano de aço; entortar uma viga de aço laminado</div>
                <div className="border-b-white border p-2 text-center col-span-3">680 (lancha)</div>
                <div className="border-b-white border p-2 text-center">11</div>
                <div className="border-b-white border p-2 text-center col-span-3">Virar um carro médio de ponta-cabeça; atravessar com um soco uma chapa de metal de 2,5 cm de espessura</div>
                <div className="border-b-white border p-2 text-center col-span-3">910 (drone Predator)</div>
                <div className="border-b-white border p-2 text-center">12</div>
                <div className="border-b-white border p-2 text-center col-span-3">Quebrar um poste de luz feito de metal; arremessar uma bola de demolição</div>
                <div className="border-b-white border p-2 text-center col-span-3">1,3 tonelada (helicóptero da polícia, carro esportivo)</div>
                <div className="border-b-white border p-2 text-center">13</div>
                <div className="border-b-white border p-2 text-center col-span-3">Virar um SUV de ponta-cabeça; arremessar um carro esportivo</div>
                <div className="border-b-white border p-2 text-center col-span-3">1,8 tonelada (carro da polícia)</div>
                <div className="border-b-white border p-2 text-center">14</div>
                <div className="border-b-white border p-2 text-center col-span-3">Virar um ônibus de ponta-cabeça; arrombar a porta de um cofre</div>
                <div className="border-b-white border p-2 text-center col-span-3">2,25 toneladas (contêiner vazio; utilitário esportivo, caminhonete)</div>
                <div className="border-b-white border p-2 text-center">15</div>         
                <div className="border-b-white border p-2 text-center col-span-3">Virar um caminhão de ponta-cabeça; arremessar um SUV</div>
                <div className="border-b-white border p-2 text-center col-span-3">2,75 toneladas (Humvee - Veículo Automóvel Multifunção de Alta Mobilidade)</div>
              </div>
            </div>
          }
          {
            type === 'Dificuldade e Iniciativa' &&
            <div className="w-full p-2">
              <p className="w-full text-center md:text-left">Quem vai primeiro? (p. 125)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Ativar Dons e mudar de forma, então
                    </li>
                    <li className="list-disc">
                      Combate corpo a corpo entre grupos já engajados, então
                    </li>
                    <li className="list-disc">
                      Combate a distância, então
                    </li>
                    <li className="list-disc">
                      Combate físico recém-iniciado, então
                    </li>
                    <li className="list-disc">
                      Qualquer outra coisa que possa estar ocorrendo.
                    </li>
                    <li className="list-disc">
                      Se necessário, desempate comparando Destreza + Raciocínio ou, se houver um empate, comparando os pontos da Habilidade usada.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full mb-2 text-center md:text-left">Dificuldade (p. 119)</p>
              <div className="w-full">
                <div className="pb-5 grid grid-cols-2 md:grid-cols-3">
                  <div className="text-center md:col-span-2 border border-white p-2">Dificuldade da Ação</div>
                  <div className="col-span-1 text-center border border-white p-2">Quantidade de Sucessos</div>
                  <div className="md:col-span-2 border border-white p-2">
                    Fácil (atingir um alvo parado, convencer um 1 amigo leal a ajudá-lo)
                  </div>
                  <div className="col-span-1 text-center border border-white p-2">
                    1 sucesso
                  </div>
                  <div className="md:col-span-2 border border-white p-2">
                    Rotineira (irritar alguém que já está louco para brigar, intimidar uma pessoa mais fraca)
                  </div>
                  <div className="col-span-1 text-center border border-white p-2">
                    2 sucessos
                  </div>
                  <div className="md:col-span-2 border border-white p-2">
                    Moderada (saltar o vão entre dois telhados, convencer um motorista de ônibus indiferente a esperar)
                  </div>
                  <div className="col-span-1 text-center border border-white p-2">
                    3 sucessos
                  </div>
                  <div className="md:col-span-2 border border-white p-2">
                    Desafiadora (localizar a origem de um sussurro, criar uma obra de arte memorável)
                  </div>
                  <div className="col-span-1 text-center border border-white p-2">
                    4 sucessos
                  </div>
                  <div className="md:col-span-2 border border-white p-2">
                    Difícil (convencer a policial que a cocaína não é sua, aplacar um espírito hostil)
                  </div>
                  <div className="col-span-1 text-center border border-white p-2">
                    5 sucessos
                  </div>
                  <div className="md:col-span-2 border border-white p-2">
                    Muito Difícil (correr por um beiral estreito sob fogo cruzado, acalmar uma multidão hostil e violenta)
                  </div>
                  <div className="col-span-1 text-center border border-white p-2">
                    6 sucessos
                  </div>
                  <div className="md:col-span-2 border border-white p-2">
                    Quase Impossível (localizar em apenas uma noite um sem-teto específico na cidade de Los ou mais Angeles, recitar impecavelmente um texto longo e escrito em um idioma que você não fala)
                  </div>
                  <div className="col-span-1 text-center border border-white p-2">
                    7 sucessos
                  </div>
                </div>
              </div>
            </div>
          }
          {
            type === "Renome, Litania e Vexame" &&
            <div className="w-full p-2">
              <p className="w-full text-center md:text-left">Renome (p. 106 - 107)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 md:grid-cols-3 hidden md:grid">
                  <div className="">Glória</div>
                  <div className="">Honra</div>
                  <div className="">Sabedoria</div>
                  <div>Hei de ser valoroso</div>
                  <div>Hei de ser respeitoso</div>
                  <div>Hei de aprender</div>
                  <div>Hei de ser confiável</div>
                  <div>Hei de ser leal</div>
                  <div>Hei de ponderar</div>
                  <div>Hei de ser generoso</div>
                  <div>Hei de ser justo</div>
                  <div>Hei de ser prudente</div>
                  <div>Hei de proteger os fracos</div>
                  <div>Hei de manter a palavra</div>
                  <div>Hei de ser misericordioso</div>
                  <div>Hei de exterminar a Wyrm</div>
                  <div>Hei de aceitar todos os desafios justos</div>
                  <div>Hei de pensar antes de agir e ouvir antes de pensar</div>
                </div>
                <div className="pb-5 grid-cols-1 grid md:hidden">
                  <div className="pb-1">Glória</div>
                  <div>Hei de ser valoroso</div>
                  <div>Hei de ser confiável</div>
                  <div>Hei de ser generoso</div>
                  <div>Hei de proteger os fracos</div>
                  <div>Hei de exterminar a Wyrm</div>
                  <div className="pt-5 pb-1">Honra</div>
                  <div>Hei de ser respeitoso</div>
                  <div>Hei de ser leal</div>
                  <div>Hei de ser justo</div>
                  <div>Hei de manter a palavra</div>
                  <div>Hei de aceitar todos os desafios justos</div>
                  <div className="pt-5 pb-1">Sabedoria</div>
                  <div>Hei de aprender</div>
                  <div>Hei de ponderar</div>
                  <div>Hei de ser prudente</div>
                  <div>Hei de ser misericordioso</div>
                  <div>Hei de pensar antes de agir e ouvir antes de pensar</div>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Vexame (p. 142)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      O Narrador pode declarar que qualquer personagem que aja contra um Renome sofre Vexame.
                    </li>
                    <li className="list-disc">
                      O Renome em questão é temporariamente reduzido em 1 (ou 2 se for o alvo do Ritual da Vergonha) e não pode ser aumentado.
                    </li>
                    <li className="list-disc">
                      O Garou precisa realizar um ato notável que exemplifique esse Renome e sair do Vexame.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Litania (p. 46)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Combate a Wyrm onde ela estiver e sempre que proliferar
                    </li>
                    <li className="list-disc">
                      Respeita o território do próximo
                    </li>
                    <li className="list-disc">
                      Aceita uma rendição honrosa
                    </li>
                    <li className="list-disc">
                      Submete-te a teus superiores
                    </li>
                    <li className="list-disc">
                      Respeita teus inferiores, pois todos pertencem a Gaia
                    </li>
                    <li className="list-disc">
                      Oferece o primeiro quinhão da matança a teus superiores
                    </li>
                    <li className="list-disc">
                      Não provarás da carne humana
                    </li>
                    <li className="list-disc">
                      Não erguerás o Véu
                    </li>
                    <li className="list-disc">
                      Pode-se desafiar o líder a qualquer momento em tempos de paz
                    </li>
                    <li className="list-disc">
                      Não desafiarás o líder em tempos de guerra
                    </li>
                    <li className="list-disc">
                      Não tomarás atitude alguma que provoque a violação de um caern
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          }
          {
            type === 'Pilares, Harano e Hauglosk' &&
            <div className="w-full p-2">
              <p className="w-full text-center md:text-left">Pilares (p. 108 e 109)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Cada jogador por ter de 1 a 3 Pilares que devem ser humanos ou lobos (cuidado ao escolher lobos como pilares, pois estes não costumam viver tanto quanto os seres humanos).
                    </li>
                    <li className="list-disc">
                      Um Garou pode reduzir sua Fúria em 1 passando uma cena ou um interlúdio na companhia de um Pilar.
                    </li>
                    <li className="list-disc">
                      Um Garou pode restaurar ou curar um ponto de dano Agravado à Força de Vontade passando uma cena ou um interlúdio na companhia de um Pilar. Esse benefício se soma à recuperação normal de Força de Vontade.
                    </li>
                    <li className="list-disc">
                      Ao passar uma cena ou interlúdio na companhia de um Pilar, um garou pode transferir uma marca de harano para hauglosk ou vice-versa.
                    </li>
                    <li className="list-disc">
                      Toda vez que o garou sofrer um contratempo sério ou uma ação (ou inação) sua colocar em perigo ou ferir seus Pilares, o jogador terá de fazer um teste de Harano.
                    </li>
                    <li className="list-disc">
                      Quando um Pilar é perdido graças à ação (ou inação) do lobisomem, este ganha automaticamente 1 ponto de harano ou hauglosk (a ser aprovado pelo Narrador de acordo com o contexto), marcando-o na trilha correspondente.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Harano (p. 140)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Fazem-se testes de harano quando ocorrem contratempos sérios ou outras tragédias
                    </li>
                    <li className="list-disc">
                      A parada de dados do teste de Harano é igual à quantidade de quadrados preenchidos nas duas trilhas: harano e hauglosk (mínimo um dado)
                    </li>
                    <li className="list-disc">
                      Se o teste for malsucedido, mais um quadrado de harano será preenchido
                    </li>
                    <li className="list-disc">
                      O jogador pode optar por preencher um quadrado da trilha de harano para elevar imediatamente sua Fúria a 5
                    </li>
                    <li className="list-disc">
                      Se a trilha de harano for preenchida totalmente, o personagem garou sucumbirá ao harano e sairá do jogo
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Hauglosk (p. 140)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Fazem-se testes de hauglosk quando um garou infringe um dos Princípios da Crónica
                    </li>
                    <li className="list-disc">
                      A parada de dados do teste de hauglosk é igual à quantidade de quadrados preenchidos nas duas trilhas: harano e hauglosk (mínimo um dado)
                    </li>
                    <li className="list-disc">
                      Se o teste for malsucedido, mais um quadrado de hauglosk será preenchido 
                    </li>
                    <li className="list-disc">
                      O jogador pode optar por preencher um quadrado da trilha de hauglosk para curar imediatamente todo o dano à sua Força de Vontade 
                    </li>
                    <li className="list-disc">
                      Se a trilha de hauglosk for preenchida totalmente, o personagem garou sucumbirá ao hauglosk e sairá do jogo
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          }
          {
            type === 'Experiência e Modelos de NPCs' &&
            <div className="w-full p-2">
              <p className="w-full text-center md:text-left">Custo de Experiência (p. 110 - 111)</p>
              <div className="w-full mt-2">
                <div className="pb-5 grid grid-cols-2">
                  <div className="text-center border border-white p-2">Característica</div>
                  <div className="text-center border border-white p-2">Pontos de Experiência</div>
                  <div className="text-center border border-white p-2">
                    Aumento em Atributo
                  </div>
                  <div className="text-center border border-white p-2">
                    Novo nível x 5
                  </div>
                  <div className="text-center border border-white p-2">
                    Aumento em Habilidade
                  </div>
                  <div className="text-center border border-white p-2">
                    Novo nível x 3
                  </div>
                  <div className="text-center border border-white p-2">
                    Especialização 
                  </div>
                  <div className="text-center border border-white p-2">
                    3
                  </div>
                  <div className="text-center border border-white p-2">
                    Renome
                  </div>
                  <div className="text-center border border-white p-2">
                    Novo nível x 5
                  </div>
                  <div className="text-center border border-white p-2">
                    Vantagem 
                  </div>
                  <div className="text-center border border-white p-2">
                    3 por ponto
                  </div>
                  <div className="text-center border border-white p-2">
                    Novo Dom
                  </div>
                  <div className="text-center border border-white p-2">
                    Total do Novo Dom x 2
                  </div>
                  <div className="text-center border border-white p-2">
                    Novo Ritual
                  </div>
                  <div className="text-center border border-white p-2">
                    5
                  </div>
                  <div className="text-center border border-white p-2">
                    Graduação do Caem
                  </div>
                  <div className="text-center border border-white p-2">
                    Novo nível x 5
                  </div>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Premiação de Experiência</p>
              <div className="w-full">
                <div className="pb-5 grid grid-cols-2 mt-2">
                  <div className="text-center border border-white p-2">Situação</div>
                  <div className="text-center border border-white p-2">Premiação de Pontos de Experiência</div>
                  <div className="border border-white p-2">
                    Participação
                  </div>
                  <div className="text-center border border-white p-2">
                    1
                  </div>
                  <div className="border border-white p-2">
                    Realizar algo notável durante a sessão; todas na mesa curtiram algo que o personagem disse ou fez
                  </div>
                  <div className="text-center border border-white p-2">
                    1
                  </div>
                  <div className="border border-white p-2">
                    Usar uma Habilidade, Dom ou outra característica de maneira inteligente ou decisiva
                  </div>
                  <div className="text-center border border-white p-2">
                    1
                  </div>
                  <div className="border border-white p-2">
                    &quot;Conte algo importante que seu personagem aprendeu nesta sessão&quot;
                  </div>
                  <div className="text-center border border-white p-2">
                    1
                  </div>
                  <div className="border border-white p-2">
                    Concluir uma história que compõe a crônica
                  </div>
                  <div className="text-center border border-white p-2">
                    2 - 3
                  </div>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Modelos de Personagens Secundários (p. 102 e Capítulo 9)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      As Dificuldades Gerais são expressar como 4 / 2, por exemplo, em que 4 é a Dificuldade no que o personagem do Narrador é bom e 2 no que o personagem é mediano. Um teste de Briga contra um boxeador teria uma Dificuldade 4, enquanto um teste de Ladroagem contra o mesmo boxeador teria uma Dificuldade 2.
                    </li>
                    <li className="list-disc pt-3">
                      Indivíduo Fraco (2 / 1)
                    </li>
                    <p className="list-disc">
                      Paradas: Duas paradas de ação relevantes em 3, três em 2
                    </p>
                    <p className="list-disc">
                      Vantagens: Nenhuma
                    </p>
                    <li className="list-disc pt-3">
                      Indivíduo Médio (3 / 2)
                    </li>
                    <p className="list-disc">
                      Paradas: Duas paradas de ação relevantes em 5, três em 4, quatro em 2
                    </p>
                    <p className="list-disc">
                      Vantagens: Até três pontos (máximo de 2 pontos em Defeitos)
                    </p>
                    <li className="list-disc pt-3">
                      Indivíduo Talentoso (4 / 2)
                    </li>
                    <p className="list-disc">
                      Paradas: Uma parada de ação relevantes em 8,, duas em 6, duas em 4, duas em 3
                    </p>
                    <p className="list-disc">
                      Vantagens: Até 10 pontos (máximo de 4 pontos em Defeitos)
                    </p>
                    <li className="list-disc pt-3">
                      Indivíduo Mortífero (5 / 3)
                    </li>
                    <p className="list-disc">
                      Paradas: Duas paradas de ação relevantes em 10, duas em 8, duas em 6, duas em 5
                    </p>
                    <p className="list-disc">
                      Vantagens: Até 15 pontos (sem Defeitos)
                    </p>
                  </ul>
                </div>
              </div>
            </div>
          }
          {
            type === 'Ritos e Hierarquia Espiritual' &&
            <div className="w-full p-2">
              <p className="w-full text-center md:text-left">Ritos (p. 180)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Um Ritual deve ser conduzido por um mestre do Ritual e este precisa conhecer o Ritual em questão.
                    </li>
                    <li className="list-disc">
                      Cada participante, até mesmo o mestre do Ritual deve ter pelo menos um ponto de Fúria (a não ser que se trate do Ritual do Lobo Renascido: neste caso, o participante-alvo pode ter zero pontos de Fúria).
                    </li>
                    <li className="list-disc">
                      As características que formam a parada de dados, indicadas na descrição do Ritual, são as do mestre do Ritual
                    </li>
                    <li className="list-disc">
                      Cada um dos outros participantes soma um dado de Fúria à parada.
                    </li>
                    <li className="list-disc">
                      Cada um dos outros participantes que conhecer o Ritual também somarão um dado comum à parada.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Película</p>
              <div className="w-full mt-2">
                <div className="pb-5 grid grid-cols-3">
                  <div className="text-center border border-white p-2 col-span-2">Localização</div>
                  <div className="text-center border border-white p-2">Valor da Película</div>
                  <div className="col-span-2 border border-white p-2">
                    Caern ativo
                  </div>
                  <div className="text-center border border-white p-2">
                    2
                  </div>
                  <div className="col-span-2 border border-white p-2">
                    Beco
                  </div>
                  <div className="text-center border border-white p-2">
                    3
                  </div>
                  <div className="col-span-2 border border-white p-2">
                    Rua suburbana
                  </div>
                  <div className="text-center border border-white p-2">
                    4
                  </div>
                  <div className="col-span-2 border border-white p-2">
                    Prédio governamental movimentado
                  </div>
                  <div className="text-center border border-white p-2">
                    5
                  </div>
                  <div className="col-span-2 border border-white p-2">
                    Laboratório estéril
                  </div>
                  <div className="text-center border border-white p-2">
                    6+
                  </div>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Hierarquia Espiritual (p. 232 - 237)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Celestinos, depois
                    </li>
                    <li className="list-disc">
                      Incarnae, depois
                    </li>
                    <li className="list-disc">
                      Jagretes, depois
                    </li>
                    <li className="list-disc">
                      Gafaretes.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          }
          {
            type === 'Armas e Armaduras' &&
            <div className="w-full">
              <div className="w-full">
                <div className="pb-5 grid grid-cols-3">
                  <div className="text-center border border-white p-2 col-span-2 bg-white text-black border-r-black">Arma</div>
                  <div className="text-center border border-white p-2 bg-white text-black">Valor de Dano</div>
                  <div className="col-span-2 border border-white p-2">
                    Arma improvisada
                  </div>
                  <div className="text-center border border-white p-2">
                    +0
                  </div>
                  <div className="col-span-2 border border-white p-2">
                    Impacto leve (soco-inglês)
                  </div>
                  <div className="text-center border border-white p-2">
                    +1
                  </div>
                  <div className="col-span-2 border border-white p-2">
                    Impacto pesado (cassetete, taco, chave de roda, bastão de beisebol), Perfuração leve (virote de besta, canivete) ou Disparo leve (pistola .22)
                  </div>
                  <div className="text-center border border-white p-2">
                    +2
                  </div>
                  <div className="col-span-2 border border-white p-2">
                    Arma branca pesada (espada de lâmina +3 larga, machado de bombeiro), Disparo médio (rifle .308 de tiro único, pistola 9mm ou tiro de escopeta dentro do alcance efetivo)
                  </div>
                  <div className="text-center border border-white p-2">
                    +3
                  </div>
                  <div className="col-span-2 border border-white p-2">
                    Disparo pesado (espingarda 12 a curta distância, Magnum .357), Arma branca enorme (claymore, viga de aço)
                  </div>
                  <div className="text-center border border-white p-2">
                    +4
                  </div>
                  <div className="col-span-2 border border-white p-2 bg-white text-black border-r-black text-center">
                    Tipo de Armadura
                  </div>
                  <div className="text-center border border-white p-2 bg-white text-black">
                    Valor da Armadura
                  </div>
                  <div className="col-span-2 border border-white p-2">
                    Roupas reforçadas/ couro grosso
                  </div>
                  <div className="text-center border border-white p-2">
                    2 (0 vs. armas de fogo)
                  </div>
                  <div className="col-span-2 border border-white p-2">
                    Tecido balístico
                  </div>
                  <div className="text-center border border-white p-2">
                    2
                  </div>
                  <div className="col-span-2 border border-white p-2">
                    Colete de kevlar /jaquetão flack
                  </div>
                  <div className="text-center border border-white p-2">
                    4
                  </div>
                  <div className="col-span-2 border border-white p-2">
                    Armadura tática SWAT /armadura militar (-1 dado nas rolagens de Destreza)
                  </div>
                  <div className="text-center border border-white p-2">
                    6
                  </div>
                </div>
              </div>
              <p className="w-full">Font: p. 195 - 196</p>
            </div>
          }
          {
            type === 'Conflitos' &&
            <div className="w-full p-2">
              <p className="w-full text-center md:text-left">Conflitos (p. 122 à 125)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      No combate, atacante e defensor rolam suas paradas simultaneamente em um conflito básico. O lado que conseguir mais sucessos vencerá esse turno do conflito. O vencedor subtrai os sucessos do perdedor do seu total e aplica o restante na forma de dano a uma das trilhas do perdedor: Força de Vontade ou Vitalidade.
                    </li>
                    <li className="list-disc">
                      O combate à distância é resolvido com uma disputa, geralmente contra Destreza + Atletismo do defensor. Em casos em que dois combatentes se atacam à distância, você pode resolver a situação com um conflito bilateral de Destreza + Armas de Fogo.
                    </li>
                    
                    <li className="list-disc">
                      Para atacar e causar dano a vários inimigos, um personagem deve dividir sua parada de dados entre os pretensos alvos. Você se defende normalmente contra quaisquer oponentes que não tenha atacado; a parada de dados completa menos um dado para cada oponente anterior.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Esquiva</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Quando engajado em uma Briga ou conflito com Armas Brancas, o defensor sempre pode optar por usar Destreza + Atletismo em vez de uma habilidade de combate para se defender. Caso faça isso, não infligirá nenhum dano ao oponente se vencer, não importando a sua margem.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Agarramento</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Um combatente pode tentar agarrar, segurar, restringir ou imobilizar um inimigo rolando Força + Briga.
                    </li>
                    <li className="list-disc">
                      Se o agarrador obtiver mais sucessos do que seu oponente, ele não causa dano; em vez disso, imobiliza o oponente, evitando que este se mova e que engaje outros oponentes, embora ele ainda possa agir contra o próprio agarrador.
                    </li>
                    <li className="list-disc">
                      Na próxima rodada, o agarrador pode engajar seu oponente em uma disputa de Força + Briga. Se o agarrador vencer, ele vai segurar o oponente no lugar onde este se encontra, e pode escolher uma das seguintes opções:
                    </li>
                    <li className="list-disc">
                      1 - Causar dano ao oponente com base na margem de sucesso, como em um ataque normal;
                    </li>
                    <li className="list-disc">
                      2 - Simplesmente não deixar o oponente sair do lugar.
                    </li>
                    <li className="list-disc">
                      Se o combatente agarrado vencer, ele escapa e pode se mover livremente na próxima rodada.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Múltiplos oponentes</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Em um conflito no qual o trabalho em equipe faz sentido, um personagem que esteja enfrentando vários oponentes perde um dado de sua parada quando se defende contra cada oponente sucessivo. Isso se aplica apenas a situações em que o personagem se limita a tentar escapar dos ataques adicionais.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Pegar Metade</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Os Narradores podem deixar os jogadores &quot;pegar metade&quot; em vez de rolar os dados. Para tanto, conte o número de dados da parada, divida esse número pela metade (arredondando para baixo) e considere o resultado como o número de sucessos obtido.
                    </li>
                    <li className="list-disc">
                      Recomenda-se aos Narradores usar esse método sempre que possível ao determinar os sucessos dos personagens do Narrador. Além de poupar tempo, também reduz as chances de se obter aqueles raros mas inevitáveis resultados aberrantes (pode ser, porém, que esse tipo de coisa seja desejável).
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Vitórias Automáticas</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Quando a parada de dados de um personagem for o dobro da Dificuldade da ação, o Narrador pode decidir que o personagem vence automaticamente sem precisar rolar os dados, mesmo que o jogador não tenha decidido pegar metade.
                    </li>
                    <li className="list-disc">
                      Aplique vitórias automáticas tanto quanto possível, especialmente em testes em que a falha do personagem seria desinteressante: testes para a descoberta de informações, puxar papo ou manobras que abram uma cena ou permitam que ela evolua dramaticamente.
                    </li>
                    <li className="list-disc">
                      As vitórias automáticas também são recursos valiosos para os Narradores, já que permitem determinar se o acaso desempenhará um fator relevante e quando certos resultados são bons o suficiente para levar a história adiante.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Críticos</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Um resultado de 10 em dois dados comuns (O, O) é um sucesso crítico. Um sucesso crítico conta como dois sucessos adicionais além dos dois 10 - portanto, quatro sucessos no total.
                    </li>
                    <li className="list-disc">
                      Uma rolagem vencedora incluindo pelo menos um sucesso crítico é chamada de vitória crítica ou, às vezes, apenas crítico. 
                    </li>
                    <li className="list-disc">
                      Cada par de 10 conta como seu próprio sucesso crítico, portanto, três 10 (O, O, O) resultariam em cinco sucessos, enquanto quatro 10 (O, O, O, O) resultariam em oito.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Margem</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      A quantidade de sucessos que exceder a Dificuldade da rolagem é chamada de margem de sucesso, ou apenas margem.
                    </li>
                    <li className="list-disc">
                      Se a Dificuldade for 4 e você tiver obtido sete sucessos, sua margem será três. O dano, os efeitos de muitos Dons e Rituais e algumas outras regras usam a margem de sucesso para calcular sua intensidade.
                    </li>
                    <li className="list-disc">
                      Mesmo fora dessas circunstâncias, o Narrador pode narrar o grau de sucesso de uma ação dependendo do tamanho da margem rolada: quanto maior a margem, maior o sucesso.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Falha Total</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Quando sua rolagem não incluir nenhum sucesso, seu personagem falhou por completo.
                    </li>
                    <li className="list-disc">
                      Às vezes uma falha total só significa que seu personagem não alcançou o resultado desejado. Outras vezes, significa consequências terríveis.
                    </li>
                    <li className="list-disc">
                      O Narrador define o que uma falha total significa de acordo com cada situação e decide se você pode tentar outra vez.
                    </li>
                    <li className="list-disc">
                      Sempre tenha em mente que, em um sentido narrativo, o fracasso é uma consequência de tentar algo.
                    </li>
                    <li className="list-disc">
                      Mesmo que uma tentativa seja malsucedida, esse fracasso pode criar resultados interessantes e levar a escolhas subsequentes. Quando você está prestes a ser detido pela polícia e falha ao tentar se safar só na conversa, os próximos acontecimentos provavelmente serão memoráveis.
                    </li>
                    <li className="list-disc">
                    E, quando você tenta correr da alcateia de Dançarinos da Espiral Negra no seu encalço e falha, é melhor usar o plano B. Tomara que você tenha um plano B
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Trabalho em Equipe</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Se dois ou mais personagens tiverem condições reais de cooperar para cumprir uma tarefa, os jogadores poderão rolar a maior parada envolvida, somando um dado para cada personagem que ajudar e tiver pelo menos um ponto na Habilidade em questão.
                    </li>
                    <li className="list-disc">
                      Se nenhuma Habilidade estiver envolvida, qualquer um pode ajudar.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Vencer a um Custo</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Se a sua rolagem incluir qualquer quantidade de sucessos, e mesmo assim falhar, o Narrador pode permitir que você vença a um custo.
                    </li>
                    <li className="list-disc">
                      Você alcança o seu objetivo, mas algo ocorre e deixa a situação ruim: você sofre dano, atrai atenção hostil (e poderosa), perde algo que considera de valor etc.
                    </li>
                    <li className="list-disc">
                      Qualquer jogador, incluindo você, pode sugerir um custo, mas o Narrador é o árbitro final. Geralmente, o custo deve ser calibrado em relação à quantidade de sucessos que ficaram faltando.
                    </li>
                    <li className="list-disc">
                      Se o preço for alto demais, você sempre pode optar por apenas falhar.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Tente outra vez</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Quando um personagem falha em uma ação, às vezes ele pode tentar de novo, a menos que alguma circunstância o esteja impedindo. Afinal, falhar em arrombar uma fechadura não significa que o personagem jamais poderá inserir uma gazua naquela porta novamente.
                    </li>
                    <li className="list-disc">
                      Para justificar essa segunda chance, as circunstâncias precisam permiti-la - o personagem obteve um novo conjunto de gazuas, por exemplo, sua habilidade aumentou desde a última vez ou ele simplesmente pode tentar de novo porque não há limitação de tempo.
                    </li>
                    <li className="list-disc">
                      Personagens podem repetir a maioria das ações durante combates, perseguições ou outros conflitos. Conflitos são estressantes, com falhas geralmente acarretando seus próprios custos em tais circunstâncias.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          }
          {
            type === 'Dano' &&
            <div className="w-full p-2">
              <p className="w-full text-center md:text-left">Dano (p. 127)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Se o vencedor usou uma arma, ou Garras, ou Mordida, ele soma o valor de dano da arma, Garras ou Mordida, caso haja, ao dano total ou apliqua outras condições impostas por ela. Neste caso, aplique dano à Vitalidade do alvo.
                    </li>
                    <li className="list-disc">
                      Em um conflito social, some o dano extra de acordo com a plateia. O Narrador também pode somar dano se o perdedor der muito valor à opinião da plateia. Neste caso, aplique dano à Força de Vontade do alvo.
                    </li>
                    <li className="list-disc">
                      Dois ou mais resultados Brutais provocam uma consequência Brutal, o que costuma produzir uma falha, a menos que o objetivo seja fazer mal ou causar dano.
                    </li>
                    <li className="list-disc">
                      Dano Superficial causa hematomas, distensões e lesões similares, mas nenhum ferimento que ameace a sobrevivência imediata. Dano Superficial em conflitos sociais significa constrangimento ou um ego ferido e não tem efeitos furadoudos no juízo que o alvo faz de terceiros ou de si mesmo.
                    </li>
                    <li className="list-disc">
                      Salvo indicação contrária, o Dano Superficial é sempre reduzido à metade (e arredondado para cima) antes de ser aplicado à trilha de Vitalidade.
                    </li>
                    <li className="list-disc">
                      Dano Agravado causa ferimentos que ameaçam a sobrevivência. Considera-se dano Agravado na Vitalidade APENAS dano causado por fogo, prata ou fontes declaradamente Agravadas. Ataques que revelem informações secretas do alvo ou ataques de amigos próximos e figuras confiáveis causam dano Agravado à Força de Vontade.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          }
          {
            type === 'Força de Vontade' &&
            <div className="w-full p-2">
              <p className="w-full text-center md:text-left">Força de Vontade (p. 88 e 122)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Gaste um ponto de Força de Vontade (igual a 1 ponto de dano Superficial de Força de Vontade) para rerrolar até três dados em qualquer teste de Habilidade ou Atributo, incluindo testes que envolvam Dons ou outras vantagens especiais.
                    </li>
                    <li className="list-disc">
                      Você não pode gastar Força de Vontade para rerrolar resultados Brutais obtidos nos dados de Fúria ou em uma checagem de Fúria.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Regeneração de Força de Vontade (p. 125, 129 e 134)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      No começo de uma Sessão, um personagem pode remover uma quantidade de níveis de dano Superficial da sua trilha de Força de Vontade igual ao seu valor de Autocontrole ou Determinação (o que for maior), caso não tenha ido contra a Interdição do Patrono de sua tribo (nesse caso, o personagem recupera apenas 1).
                    </li>
                    <li className="list-disc">
                      No final de cada sessão, os personagens que tiverem se portado de acordo com o Renome associado à sua tribo poderão curar 1 nível de dano Agravado à Força de Vontade.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          }
          {
            type === "Vitalidade e Debilitação" &&
            <div className="w-full p-2">
              <p className="w-full text-center md:text-left">Regeneração de Vitalidade (p. 125, 129 e 134)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      So é possível regenerar nas formas glabro, hispo e crinos.
                    </li>
                    <li className="list-disc">
                      Encostar na prata nessas formas sobrenaturais causa 1 de dano Agravado por turno.
                    </li>
                    <li className="list-disc">
                      É possível remover dano Superficial da sua trilha de Vitalidade no início de uma Sessão se houver passado tempo suficiente desde o ferimento para que o personagem tenha se recuperado.
                    </li>
                    <li className="list-disc">
                      O personagem que possui Medicina pode converter dano Agravado na trilha de Vitalidade para dano Superficial realizando um teste de Inteligência + Medicina; a Dificuldade é igual ao total de Dano Agravado do paciente. Tentativas de curar a si próprio somam +1 à Dificuldade. A quantidade máxima de pontos de dano Agravado convertidos é igual à metade do seu valor de Medicina e a cura ocorre ao longo da noite.
                    </li>
                    <li className="list-disc">
                      Dano Agravado na Trilha de Vitalidade também pode ser curado completamente na escala de um ponto de dano por semana.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="w-full text-center md:text-left">Debilitação (p. 128)</p>
              <hr className="pb-3 mt-2" />
              <div className="w-full">
                <div className="pb-5 text-justify">
                  <ul className="pl-5 text-sm font-normal text-white">
                    <li className="list-disc">
                      Tão logo um personagem tenha sofrido dano suficiente para completar uma trilha, ele está Debilitado.
                    </li>
                    <li className="list-disc">
                      Personagens Debilitados perdem dois dados de todas as paradas de dados relevantas: paradas físicas, no caso de Vitalidade, paradas sociais e mentais, no caso de Força de Vontade (e quaisquer outras paradas que, segundo o critério do Narrador, fiquem igualmente Debilitadas).
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}