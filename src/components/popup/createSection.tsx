'use client'

import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { authenticate } from '@/firebase/authenticate';
import { createSession, getSessionByName } from '@/firebase/sessions';
import contexto from '@/context/context';
import { createConsentForm } from '@/firebase/consentForm';
import Image from 'next/image';
import { IoIosCloseCircleOutline } from 'react-icons/io';

type CreateSectionProps = {
  closeHref?: string;
};

export default function CreateSection({ closeHref = '/sessions' }: CreateSectionProps) {
  const router = useRouter();
  const [nameSession, setNameSession] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [typeSession, setTypeSession] = useState('Regras Oficiais');
  const [allowCustomTrybes, setAllowCustomTrybes] = useState(false);
  const { dataUser, setShowCreateSession, setShowMessage } = useContext(contexto);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (dataUser.email !== '' && dataUser.displayName !== '') {
          setEmail(dataUser.email);
        } else {
          const authData: any = await authenticate(setShowMessage);
          if (authData && authData.email && authData.displayName) {
            setEmail(authData.email);
          } else {
            router.push('/login');
          }
        }
      } catch (error) {
        setShowMessage({ show: true, text: 'Ocorreu um erro com a validação de dados: ' + error });
        router.push('/login');
      }
    };

    fetchData();
  }, [dataUser.displayName, dataUser.email, router, setShowMessage]);

  const closePopup = () => {
    setShowCreateSession(false);
    router.push(closeHref);
  };

  const registerSession = async () => {
    if (nameSession.length < 3) {
      setShowMessage({ show: true, text: 'Necessário preencher um título com pelo menos 3 caracteres.' });
      return;
    }

    if (nameSession.length > 40) {
      setShowMessage({ show: true, text: 'Necessário preencher um título com menos de 40 caracteres.' });
      return;
    }

    if (description.length < 10) {
      setShowMessage({ show: true, text: 'Necessário preencher uma descrição com pelo menos 10 caracteres.' });
      return;
    }

    if (image === '') {
      setShowMessage({ show: true, text: 'Necessário selecionar uma imagem para a sessão.' });
      return;
    }

    setLoading(true);

    try {
      const sessionList: any = await getSessionByName(nameSession.toLowerCase(), setShowMessage);

      if (sessionList) {
        setShowMessage({ show: true, text: 'Ja existe uma sessão criada com esse nome.' });
        setLoading(false);
        return;
      }

      const docRef: any = await createSession(
        nameSession.toLowerCase(),
        description,
        typeSession,
        allowCustomTrybes,
        email,
        image,
        dataUser.displayName,
        setShowMessage,
      );

      if (docRef) {
        router.push(`/sessions/${docRef}`);
        await createConsentForm(docRef, email, setShowMessage);
        return;
      }

      setShowMessage({ show: true, text: 'Ocorreu um erro ao tentar criar uma nova sessão. Atualize a página e tente novamente.' });
    } catch (error: any) {
      setShowMessage({ show: true, text: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const typeSessionDescription = typeSession === 'Regras Oficiais'
    ? 'Voce está criando uma sessão que utiliza as regras oficiais da Quinta Edição de Lobisomem: O Apocalipse.'
    : 'Você esta criando uma sessão que utiliza regras alternativas para a Quinta Edicao de Lobisomem: O Apocalipse. Falhas em checagens de Fúria aumentam ela ao invés de diminuir.';

  const customTrybesDescription = allowCustomTrybes
    ? 'Tribos alternativas tambem vão aparecer na seleção de tribos das fichas desta sessão.'
    : 'A seleção de tribos vai mostrar apenas as tribos oficiais de Lobisomem: O Apocalipse 5ed.';

  const fieldLabelClass = 'mb-2 font-geist-mono text-[0.62rem] uppercase tracking-[0.2em] text-zinc-300';
  const fieldClass = 'w-full border border-white/10 bg-black/75 px-3 py-3 font-geist-mono text-[0.72rem] uppercase tracking-[0.08em] text-white outline-none transition-colors hover:border-red-700/70 focus:border-red-700';

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/88 px-3 py-4 backdrop-blur-[2px] sm:px-5">
      <div className="relative flex h-full max-h-[94vh] w-full max-w-5xl min-h-0 flex-col overflow-hidden border border-zinc-700/40 bg-gradient-to-br from-black via-zinc-950 to-[#140000] text-white shadow-[0_0_36px_rgba(0,0,0,0.68)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.24),transparent_40%)]" />
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-black/78">
          <div className="shrink-0 border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-geist-mono text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">
                  Nova sessão
                </p>
                <h2 className="mt-2 font-kingthings text-[1.15rem] uppercase tracking-[0.16em] text-[#e1e7dd] sm:text-[1.35rem]">
                  Criar sessão
                </h2>
                <p className="mt-2 max-w-2xl font-geist-mono text-[0.62rem] uppercase tracking-[0.12em] text-zinc-300/80">
                  Defina o título, o tipo, a descrição e escolha a imagem da crônica.
                </p>
              </div>
              <button
                type="button"
                onClick={closePopup}
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-black/70 text-white/75 transition-colors hover:border-red-700 hover:bg-[#5f0000] hover:text-white"
                aria-label="Fechar popup"
              >
                <IoIosCloseCircleOutline className="text-[28px]" />
              </button>
            </div>
          </div>

          <div className="principles-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-5 sm:py-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <div className="space-y-4">
                <div className="border border-white/10 bg-black/82 p-4">
                  <label htmlFor="nameSession" className="block">
                    <p className={fieldLabelClass}>Título</p>
                    <input
                      type="text"
                      id="nameSession"
                      value={nameSession}
                      className={fieldClass}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                        setNameSession(sanitizedValue);
                      }}
                    />
                  </label>

                  <label htmlFor="typeSession" className="mt-4 block">
                    <p className={fieldLabelClass}>Tipo</p>
                    <select
                      value={typeSession}
                      id="typeSession"
                      className={`${fieldClass} cursor-pointer`}
                      onChange={(e) => {
                        setTypeSession(e.target.value);
                      }}
                    >
                      <option value="Regras Oficiais">Regras Oficiais</option>
                      <option value="Regras Alternativas">Regras Alternativas</option>
                    </select>
                  </label>

                  <div className="mt-4 border border-red-900/45 bg-[#120606] px-3 py-3 font-geist-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.12em] text-zinc-200">
                    {typeSessionDescription}
                  </div>

                  <label className="mt-4 block border border-white/10 bg-black/70 px-3 py-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={allowCustomTrybes}
                        onChange={(e) => {
                          setAllowCustomTrybes(e.target.checked);
                        }}
                        className="mt-0.5 h-4 w-4 accent-red-800"
                      />
                      <div>
                        <p className={fieldLabelClass}>Permitir tribos alternativas</p>
                        <p className="font-geist-mono text-[0.62rem] leading-relaxed tracking-[0.08em] text-zinc-300">
                          {customTrybesDescription}
                        </p>
                      </div>
                    </div>
                  </label>

                  <label htmlFor="description" className="mt-4 block">
                    <p className={fieldLabelClass}>Descrição</p>
                    <textarea
                      id="description"
                      rows={8}
                      value={description}
                      className={`${fieldClass} min-h-[11rem] resize-none text-left normal-case tracking-[0.04em]`}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                        setDescription(sanitizedValue);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="border border-white/10 bg-black/82 p-4">
                <p className={fieldLabelClass}>Imagem da sessão</p>
                <div className="principles-scrollbar grid max-h-[52vh] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 33 }, (_, i) => {
                    const imageId = String(i + 1).padStart(2, '0');
                    const selected = imageId === image;

                    return (
                      <button
                        key={imageId}
                        type="button"
                        onClick={() => setImage(imageId)}
                        className={`group relative overflow-hidden border bg-black transition-colors ${selected ? 'border-red-600' : 'border-white/10 hover:border-red-700/70'}`}
                      >
                        <Image
                          src={`/images/sessions/${imageId}.png`}
                          alt={`Imagem da sessão ${imageId}`}
                          className={`h-32 w-full object-cover object-center transition duration-200 ${selected ? 'opacity-100' : 'opacity-65 group-hover:opacity-90'}`}
                          width={1000}
                          height={1000}
                        />
                        <div className={`absolute inset-x-0 bottom-0 border-t px-2 py-2 font-geist-mono text-[0.55rem] uppercase tracking-[0.18em] ${selected ? 'border-red-600 bg-[#190404] text-white' : 'border-white/10 bg-black/80 text-zinc-300'}`}>
                          {selected ? 'Selecionada' : `Opção ${imageId}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closePopup}
                className="border border-zinc-700 bg-black px-4 py-2.5 font-geist-mono text-[0.62rem] uppercase tracking-[0.14em] text-zinc-200 transition-colors hover:border-zinc-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="border border-red-700/60 bg-red-950 px-4 py-2.5 font-geist-mono text-[0.62rem] uppercase tracking-[0.14em] text-white transition-colors hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={registerSession}
                disabled={loading}
              >
                {loading ? 'Criando sessão...' : 'Criar sessão'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



