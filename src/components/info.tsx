'use client'

import contexto from "@/context/context";

import { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

type GuideItem = {
  title: string;
  description: string;
};

type GuideSection = {
  title: string;
  intro: string;
  items: GuideItem[];
};

const sessionsSections: GuideSection[] = [
  {
    title: "Página Sessões",
    intro:
      "A página de sessões é a porta de entrada para as mesas da plataforma. É nela que o usuário enxerga suas crônicas, cria novas salas e decide qual mesa deseja abrir.",
    items: [
      {
        title: "Botão de informações",
        description:
          "Abre este popup explicativo. Ele existe para orientar o usuário sobre tudo o que pode ser feito no ambiente de Sessões.",
      },
      {
        title: "Criar sessão",
        description:
          "Ao clicar no botão 'Criar Sessão', o usuário pode definir o nome da sessão, tipo de regras, se a mesa permite tribos alternativas, descrição e imagem principal da sessão. Depois da criação, a plataforma redireciona direto para a mesa inserida e quem a criou se torna o Narrador da mesma.",
      },
      {
        title: "Lista de Sessões",
        description:
          "São listadas na página todas as Sessões em que você é narrador, jogador, sessões que não têm nenhuma relação com você e sessões finalizadas. Basta clicar em qualquer uma delas para acessar, caso já pertença a ela, ou para solicitar o ingresso, caso seja de seu interesse. Sendo aceito, o usuário é adicionado à sessão como jogador.",
      },
      {
        title: "Acesso a uma Sessão",
        description:
          "Quando uma sessão é aberta ao clicar, a plataforma muda de nível e vira um painel de crônica. Os ícones laterais funcionam como botões de navegação direta que trocam a área principal da tela em tempo real.",
      },
      {
        title: "Histórico",
        description:
          "Abre a linha do tempo da mesa. É ali que ficam registradas ações importantes da sessão, mudanças de ficha, atualizações de dados e outros eventos relevantes que a plataforma armazena para consulta posterior. Narradores e jogadores conseguem visualizar esta tela.",
      },
      {
        title: "Notificações",
        description:
          "Concentra pedidos de entrada de usuários, solicitações de vinculação de ficha e outros avisos administrativos. Quando existe pendência, o sino recebe uma bolinha vermelha no canto para chamar atenção imediata. Apenas o Narrador da Sessão consegue visualizar esta tela.",
      },
      {
        title: "Sistema e Mecânica",
        description:
          "Abre a área de consulta de regras dentro da própria sessão. Serve como biblioteca de consulta e ajuda com o sistema durante a partida, para que revisem mecânicas sem precisar sair da crônica. Narradores e jogadores conseguem visualizar esta tela.",
      },
      {
        title: "Detalhes da Sessão",
        description:
          "Reúne os controles administrativos da mesa. Nessa área o narrador pode ajustar nome, descrição, regras da sessão, permissão de tribos alternativas, narrador da crônica, criação de ficha, jogadores da sala, imagem da sessão e ações de encerramento ou transferência de responsabilidade. A única ação que o jogador pode fazer nesta tela é sair da Sessão e Criar uma nova Ficha.",
      },
      {
        title: "Ficha de Consentimento",
        description:
          "Abre o documento de segurança e limites da mesa. A sessão usa esse espaço para registrar e revisar as preferências e restrições acordadas entre os participantes da crônica. Narradores e jogadores conseguem visualizar esta tela.",
      },
      {
        title: "Princípios da Crônica",
        description:
          "Exibe e permite manter os princípios narrativos e estruturais da campanha. Essa área funciona como guia de tom, proposta e direcionamento da mesa. Narradores e jogadores conseguem visualizar esta tela.",
      },
      {
        title: "Mapa de Relacionamentos",
        description:
          "Abre o ambiente visual de vínculos da crônica. É útil para organizar conexões entre personagens, NPCs, facções, acontecimentos e qualquer outro elo que o narrador queira acompanhar de forma gráfica. Narradores e jogadores conseguem visualizar esta tela.",
      },
      {
        title: "Mapa da Crônica",
        description:
          "Mostra o espaço visual da campanha. O narrador pode trabalhar pontos do cenário, marcadores, imagens associadas e leitura espacial da história sem sair do painel da sessão. Narradores podem permitir ou não que jogadores acessem esta tela, de acordo com suas necessidades. Narradores e jogadores conseguem visualizar esta tela.",
      },
      {
        title: "Modo Combate",
        description:
          "Abre a área dedicada a cenas táticas. Esse modo concentra mapa de batalha, marcadores, imagens e organização visual de confronto, ajudando o grupo a acompanhar posições e eventos durante o combate. Narradores podem permitir ou não que jogadores acessem esta tela, de acordo com suas necessidades. É possível acessar o chat por esta tela também, caso o modo combate esteja ativo e visível para todos, de acordo com a permissão do narrador.",
      },
      {
        title: "Checagem de dados",
        description:
          "Abre a janela de rolagem manual da sessão. Nela o usuário pode montar testes com quantidade de dados normais, dados de fúria, dificuldade, bônus e penalidades, usando a plataforma como apoio direto para a resolução de cena. Narradores podem fazer checagens com qualquer usuário, enquanto jogadores só podem fazer checagens de seus próprios personagens.",
      },
      {
        title: "Chat da Sessão",
        description:
        "Abre o chat em tempo real da campanha. É o espaço principal de troca de mensagens entre narrador e jogadores durante a sessão e fora dela. Narradores e jogadores conseguem visualizar esta tela.",
      },
      {
        title: "Ficha de Personagem",
        description:
          "Esse botão leva para o núcleo de ficha dentro da sessão. É uma das áreas mais densas da crônica, porque concentra tanto a seleção de personagem quanto a edição e consulta das fichas vinculadas à Sessão.",
      },
    ],
  },
  {
    title: "Tudo o que existe dentro da Ficha de Personagem",
    intro:
      "Quando o usuário entra na área da ficha dentro da sessão, ele passa a usar o centro de dados do personagem conectado àquela crônica. Essa tela acumula consulta, edição, validação e apoio narrativo.",
    items: [
      {
        title: "Seleção de personagem",
        description:
          "Permite escolher qual ficha vinculada à sessão será aberta. Para o narrador, esse seletor também pode exibir a opção de nenhum personagem, facilitando a navegação administrativa pela mesa.",
      },
      {
        title: "Copiar ficha, verificar ficha e baixar PDF",
        description:
          "A ficha dentro da sessão oferece ações rápidas como copiar ficha da comunidade para sua conta, verificar a consistência da ficha (ao clicar no botão, abre um popup informando o que está faltando preencher) e gerar download em PDF. Dependendo do contexto, também podem aparecer ações de limpar ou excluir a ficha.",
      },
      {
        title: "Dados centrais do personagem",
        description:
          "Nessa região ficam nome do personagem, retrato por link, tribo, augúrio, crônica vinculada, jogador dono da ficha, padroeiro, e-mail quando visível, favor e proibição. É o núcleo de identidade e vínculo do personagem com a sessão.",
      },
      {
        title: "Transferência de ficha para outra sessão",
        description:
          "Quando a ficha pode ser movida, a plataforma permite solicitar transferência para outra mesa ativa. Se já houver uma solicitação em andamento, a tela passa a mostrar o pedido pendente e o botão para cancelá-lo.",
      },
      {
        title: "Vitalidade, Força de Vontade, Fúria, Renome, Harano e Hauglosk",
        description:
          "A ficha exibe e controla os recursos mais usados em mesa. Essas áreas servem tanto para acompanhamento quanto para atualização dos valores do personagem durante a campanha. Aqui, é possível marcar o dano recebido em Vitalidade e Força de Vontade, seja Superficial ou Agravado, além de permitir testes de Força de Vontade, de Fúria, de Harano e Hauglosk automatizados, por meio do botão com ícone de um d10.",
      },
      {
        title: "Atributos e Habilidades",
        description:
          "A tela da ficha mostra a parte mecânica central do personagem. É aqui que o usuário consulta e ajusta os valores que sustentam boa parte das rolagens e da construção do perfil mecânico.",
      },
      {
        title: "Dons e Rituais",
        description:
          "Essas áreas exibem Dons e Rituais já associados ao personagem, com consulta de detalhes e integração com rolagens específicas quando aplicável. Por meio do botão Gerenciar, o usuário também pode adicionar ou remover Dons e Rituais (a lista dos dons disponíveis para adição já vem filtrados pelo renome total, tribo e augúrio selecionado pelo usuário).",
      },
      {
        title: "Formas",
        description:
          "Permite acompanhar e interagir com as formas do garou dentro do contexto da sessão. Essa parte conversa diretamente com recursos como Fúria e checagens automatizadas ligadas à transformação.",
      },
      {
        title: "Vantagens e Defeitos",
        description:
          "Centraliza os elementos adicionais de construção do personagem, ajudando a sessão a manter controle sobre benefícios, limitações e investimentos feitos na ficha. Por meio do botão Gerenciar, é possível adicionar ou remover Méritos, Backgrounds, Talismãs, Loresheets e Defeitos.",
      },
      {
        title: "Pilares, Background e Notas",
        description:
          "Essas áreas guardam o lado narrativo da personagem dentro da crônica: vínculos pessoais, história, memória de jogo, observações do jogador e anotações relevantes para a campanha.",
      },
    ],
  },
];

function renderSection(section: GuideSection) {
  return (
    <section key={section.title} className="mt-8 first:mt-0">
      <div className="border border-zinc-500/40 bg-black/60 p-4 sm:p-5">
        <h2 className="font-kingthings text-2xl text-white sm:text-3xl">{section.title}</h2>
        <p className="mt-3 font-geist-mono text-[11px] leading-relaxed text-white/72 sm:text-xs">
          {section.intro}
        </p>
      </div>

      <div className="mt-4 grid gap-4 grid-cols-1">
        {section.items.map((item) => (
          <article key={`${section.title}-${item.title}`} className="border border-zinc-500/40 bg-black/60 p-4 text-left">
            <h3 className="font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.14em] text-white sm:text-xs">
              {item.title}
            </h3>
            <p className="mt-3 font-geist-mono text-[11px] leading-relaxed text-white/78 sm:text-xs">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Info() {
  const { setShowInfoSessions } = useContext(contexto);


  return(
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-3 py-4 text-white backdrop-blur-[3px] sm:px-5 sm:py-6">
      <section className="relative mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden border border-zinc-500/40 bg-zinc-950/85 text-white shadow-[0_0_40px_rgba(0,0,0,0.7)]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/wallpapers/128.jpg')" }} />
        <div className="absolute inset-0 bg-black/90" />

        <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="font-geist-mono text-[11px] uppercase tracking-[0.18em] text-white/45">Guia de sessões</p>
            <h1 className="mt-2 font-kingthings text-xl">
              Bem vindo à área de Sessões do Segredos da Fúria!
            </h1>
            <p className="mt-3 max-w-4xl font-geist-mono text-[11px] leading-relaxed text-white/75 sm:text-xs">
              Este guia descreve o ambiente de sessões da plataforma onde você cria, encontra e acessa Sessões de RPG de Lobisomem: o Apocalipse 5ed.
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 cursor-pointer"
            onClick={ () => {
              setShowInfoSessions(false);
            }}
            aria-label="Fechar guia"
          >
            <IoIosCloseCircleOutline className="text-4xl text-white transition-colors hover:text-red-400" />
          </button>
        </div>

        <div className="principles-scrollbar relative z-10 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {sessionsSections.map(renderSection)}
        </div>
      </section>
    </div>
  );
}




