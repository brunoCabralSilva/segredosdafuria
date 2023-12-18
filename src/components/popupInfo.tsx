import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionFeedback, actionInfoSessions, useSlice } from "@/redux/slice";
import Feedback from "./feedback";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function PopupInfo() {
  const dispatch: any = useAppDispatch();
  const slice = useAppSelector(useSlice);

  return(
    <div className="w-full h-screen fixed top-0 left-0 bg-black z-50">
      <section className="mb-2 relative px-2 h-full flex flex-col items-center justify-center">
        <div className="w-full flex justify-end mt-5 mb-3 px-2 sm:px-10">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer mb-2"
            onClick={() => dispatch(actionInfoSessions(false))}
          />
        </div>
        <div className="overflow-y-auto px-2 sm:px-10 flex flex-col w-full z-20 text-white text-center sm:text-justify">
          <article className="w-full h-full px-4 pb-4 text-white">
            <div className="flex flex-col justify-center dataGifts-center sm:dataGifts-start">
              <h1 className="font-bold text-center w-full text-2xl">
                Bem vindo ao ambiente de Sessões do Segredos da Fúria!
              </h1>
              <p className="pt-5">
                O Segredos da Fúria é uma plataforma única que oferece aos seus usuários a oportunidade de vivenciar o mundo do RPG online de duas maneiras distintas: como Narrador e como Jogador. Além de enviar e receber mensagens em tempo real, disponível para ambos os tipos de acesso, essa dualidade proporciona diversas outras experiências ricas e envolventes, moldando a dinâmica de jogo de maneiras únicas.
              </p>
              <div>
                <h1 className="text-lg font-bold pt-3 pb-1">O Jogador</h1>
                <hr className="mb-3" />
                <p>
                  Ao ingressar como jogador na plataforma Segredos da Fúria, você se depara com uma série de funcionalidades projetadas para aprimorar sua experiência no universo d Werewolf: The Apocalypse 5th. Aqui está um pouco da jornada do jogador:
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Ficha de Personagem Dinâmica:</span>
                  <span>
                    Sua ficha de personagem é o coração da sua jornada. Cada atualização é instantaneamente salva no banco de dados, seja atributo, habilidade, dom, ritual, vantagem... aqui, garantimos que as mudanças sejam registradas imediatamente, de forma que você as acesse em qualquer lugar ou dispositivo.
                  </span>
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Exploração de Dons Específicos:</span>
                  <span>
                    Você poderá visualizar os dons escolhidos e seus detalhes. Caso ainda não possua nenhum ou quiser adicionar novos, uma lista com todos os dons que se encaixam no seu renome total, augúrio e tribo é disponibilizada.
                  </span>
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Rituais:</span>
                  <span>
                    Adicione rituais ao seu repertório, desvendando mistérios sobrenaturais.
                  </span>
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Vantagens e Defeitos:</span>
                  <span>
                    À medida que você adiciona vantagens e defeitos à sua ficha, o sistema automaticamente recalcula o total gasto e o saldo restante. Essa abordagem facilita o acompanhamento do desenvolvimento do seu personagem.
                  </span>
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Testes Automáticos e Manuais:</span>
                  <span>
                    Execute testes com base nos dados preenchidos em sua ficha, sejam em testes automáticos relacionados aos atributos e habilidades do personagem ou em testes manuais, onde é necessário informar dados como dificuldade, bônus ou penalidades e quantidade de dados normais e de fúria.
                  </span>
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Fúria e Transformação:</span>
                  <span>
                    Ao clicar em uma forma, o sistema realiza automaticamente o teste de Fúria relacionado a essa transformação. Se você não possui Fúria suficiente, nada acontece, mantendo a fidelidade à mecânica do jogo.
                  </span>
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1">Background e Anotações:</span>
                  <span>
                    Acrescente camadas à sua narrativa pessoal através da capacidade de adicionar histórias e anotações importantes sobre a sessão. Isso permite que você mantenha um registro detalhado das experiências e escolhas do seu personagem.
                  </span>
                </p>
              </div>
              <div>
                <h1 className="text-lg font-bold pt-6 pb-1">O Narrador</h1>
                <p className="py-3">
                <hr className="mb-3" />
                  A aplicação apresenta funcionalidades específicas para o papel do &apos;Narrador&apos; em uma sessão de RPG online. O narrador desempenha um papel crucial na criação e gestão da experiência de jogo para os jogadores. Vamos analisar as principais responsabilidades e interações do Narrador na aplicação:
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Visão Geral:</span>
                  <span>
                    O Narrador é um usuário que lidera uma sessão de RPG online, tendo controle sobre a narrativa, cenário e eventos do jogo.
                  </span>
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Testes:</span>
                  <span>
                    O Narrador pode realizar testes clicando no ícone que representa um dado. Alí, ele pode escolher informações como quantidade de dados normais e de fúria, dificuldade e bônus ou penalidades.
                  </span>
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Detalhes da Sessão:</span>
                  <span>
                    O Narrador pode visualizar e editar detalhes essenciais da sessão, como o nome da sessão, descrição, data de criação e outros elementos relacionados à configuração do jogo. Essas mudanças são refletidas em tempo real para os jogadores.
                  </span>
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Controle de Jogadores:</span>
                  <span>
                    O Narrador tem a capacidade de aprovar ou negar a participação de jogadores na sessão. Ao aprovar, um usuário é adicionado à sessão, com uma ficha inicial sem dados, pronta para ser atualizada. Os dados da ficha de todos os jogadores fica disponível para visualização do narrador.
                  </span>
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Dons, Rituais e Vantagens:</span>
                  <span>
                    Ao clicar em qualquer dom, ritual ou vantagem adicionado pelo jogador, o narrador consegue ver os detalhes destes itens, como descrições, sistema e etc.
                  </span>
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Remoção de Jogadores:</span>
                  <span>
                    O Narrador pode remover jogadores da sessão, caso necessário, gerenciando a dinâmica e o equilíbrio do jogo.
                  </span>
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Anotações do Narrador:</span>
                  <span>
                    Há uma funcionalidade de anotações do Narrador, onde ele pode registrar informações importantes sobre a narrativa, eventos futuros ou outros aspectos relevantes da história.
                  </span>
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Controle de Sessão:</span>
                  <span>
                    O Narrador tem a opção de encerrar a sessão, saindo dela e repassando o cargo de Narração para o jogador mais antigo. A sessão só é encerrada quando não houver mais nenhum jogador para que seja repassado o cargo. O Narrador também pode transferir o cargo de Narrador para outro jogador sem precisar sair da sessão.
                  </span>
                </p>
                <p className="py-3">
                  <span className="font-bold pr-1"> - Atualização por Notificações:</span>
                  <span>
                    A todo momento, o é possível até a área de Notificações para verificar se há algum pedido de acesso pendente ou se alguém transferiu a titularidade para o usuário.
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
            <button
              type="button"
              className={`pb-3 ${!slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}`}
              onClick={() => dispatch(actionFeedback({ show: true, message: '' })) }
            >
              Enviar Feedback
            </button>
            {
              slice.feedback.show && <Feedback title={ 'Popup Info' } /> 
            }
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}