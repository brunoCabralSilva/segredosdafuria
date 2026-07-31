import React, { useContext, useLayoutEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import contexto from "@/context/context";
import Image from "next/image";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import Loading from "./loading";
import { usePathname } from "next/navigation";

export default function ConvertToPdf(props: { data: any, preview?: boolean }) {
  const { data, preview = false } = props;
  const pathname = usePathname();
  const isSheetStandalone = pathname?.startsWith('/sheets/');
  const usePreviewPdfLayout = preview || isSheetStandalone;
  const isExportMode = !preview;
  const { setShowDownloadPdf, session } = useContext(contexto);
  const pdfRef: any = useRef(null);
  const pdfRef2: any = useRef(null);
  const hasDownloaded = useRef(false);

  const hasAdvantage = (title: string) => data.advantagesAndFlaws?.advantages?.some((advantage: { title: string }) => advantage.title === title);
  const hasFlaw = (title: string) => data.advantagesAndFlaws?.flaws?.some((flaw: { title: string }) => flaw.title === title);
  const getSheetStandalonePhysicalValue = (name: 'strength' | 'dexterity' | 'stamina') => {
    const currentValue = Number(data.attributes?.[name] || 0);

    if (!isSheetStandalone) return currentValue;

    if (data.form === 'Crinos') {
      return Math.max(0, currentValue - 4);
    }

    if (data.form === 'Hispo' || data.form === 'Glabro') {
      return Math.max(0, currentValue - (hasAdvantage('Resiliência de Luna') ? 4 : 2));
    }

    return currentValue;
  };

  const getAttributeDisplayValue = (name: string) => {
    if (name === 'strength' || name === 'dexterity' || name === 'stamina') {
      return getSheetStandalonePhysicalValue(name);
    }

    return Number(data.attributes?.[name] || 0);
  };

  const getHealthDisplayTotal = () => {
    const stamina = isSheetStandalone
      ? getSheetStandalonePhysicalValue('stamina')
      : Number(data.attributes?.stamina || 0);

    if (hasFlaw('Maldição da Anciã') && hasAdvantage('Pele Espessa')) return stamina + 3;
    if (hasFlaw('Maldição da Anciã')) return stamina + 2;
    if (hasAdvantage('Pele Espessa')) return stamina + 4;
    return stamina + 3;
  };

  const getWillpowerDisplayTotal = () => Number(data.attributes?.composure || 0) + Number(data.attributes?.resolve || 0);

  const pointClass = (type: 'circle' | 'square', filled: boolean, large = false) => {
    const baseSize = isExportMode
      ? large ? 'h-6 w-6' : 'h-5 w-5'
      : usePreviewPdfLayout
        ? large ? 'h-5 w-5' : 'h-4 w-4'
        : large ? 'h-6 w-6' : 'h-5 w-5';

    const shapeClass = type === 'circle' ? 'rounded-full' : '';
    const fillClass = filled ? 'bg-black' : 'bg-white';

    return `${baseSize} ${shapeClass} ${fillClass} border border-black !border-solid`;
  };
  
  const handleDownloadPdf = async () => {
    const pdfContainer1 = document.createElement('div');
    pdfContainer1.style.width = '1300px';
    pdfContainer1.style.overflow = 'hidden';
    pdfContainer1.appendChild(pdfRef.current.cloneNode(true));
    document.body.appendChild(pdfContainer1);
    const pdf = new jsPDF();
    const waitForImages = async (element: HTMLElement) => {
      const images = Array.from(element.querySelectorAll('img'));

      await Promise.all(
        images.map((image) => new Promise<void>((resolve) => {
          const finish = () => resolve();

          if (image.complete && image.naturalWidth > 0) {
            if (typeof image.decode === 'function') {
              image.decode().then(finish).catch(finish);
            } else {
              finish();
            }
            return;
          }

          image.addEventListener('load', finish, { once: true });
          image.addEventListener('error', finish, { once: true });
        })),
      );
    };
    const captureElement = async (element: any) => {
      await waitForImages(element);
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      return { imgData, imgWidth, imgHeight };
    };
    const { imgData: imgData1, imgWidth: imgWidth1, imgHeight: imgHeight1 } = await captureElement(pdfContainer1);
    pdf.addImage(imgData1, "PNG", 0, 0, imgWidth1, imgHeight1);
    pdf.addPage();
    const pdfContainer2 = document.createElement('div');
    pdfContainer2.style.width = '1300px';
    pdfContainer2.style.overflow = 'hidden';
    pdfContainer2.appendChild(pdfRef2.current.cloneNode(true));
    document.body.appendChild(pdfContainer2);
    const { imgData: imgData2, imgWidth: imgWidth2, imgHeight: imgHeight2 } = await captureElement(pdfContainer2);
    pdf.addImage(imgData2, "PNG", 0, 0, imgWidth2, imgHeight2);
    pdf.save(data.name + ".pdf");
    document.body.removeChild(pdfContainer1);
    document.body.removeChild(pdfContainer2);
  };
  
  
  useLayoutEffect(() => {
    if (!preview && !hasDownloaded.current) {
      handleDownloadPdf();
      setTimeout(() => setShowDownloadPdf({ show: false, email: '' }), 3000);
      hasDownloaded.current = true;
    }
  }, [preview, setShowDownloadPdf]);

  const returnPoints = (name: string, noWrap = false) => {
    const points = Array(5).fill('');
    return (
      <div className={`flex ${noWrap ? 'flex-nowrap min-w-max' : 'flex-wrap'} ${name === 'rage' || name === 'hauglosk' || name === 'harano' ? 'gap-2' : 'gap-1'} pt-1`}>
        {
          points.map((item, index) => {
            if (data[name] >= index + 1) {
              return <button type="button" key={index} className={pointClass(name === 'rage' || name === 'hauglosk' || name === 'harano' ? 'square' : 'circle', true, name === 'rage' || name === 'hauglosk' || name === 'harano')} />
            } return <button type="button" key={index} className={pointClass(name === 'rage' || name === 'hauglosk' || name === 'harano' ? 'square' : 'circle', false, name === 'rage' || name === 'hauglosk' || name === 'harano')} />
          })
        }
      </div>
    );
  };

  const truncateText = (text: string, number: number) => {
    if (text.length > number) return text.slice(0, number) + '...';
    return text;
  }

  const typeInTouchstones = (text: string) => {
    let length = 700;
    if (data.touchstones.length === 3) length = 185;
    else if (data.touchstones.length === 2) length = 330;
    if (text.length > length) return text.slice(0, length) + '...';
    return text;
  };

  const returnAttributes = (name: string) => {
    const points = Array(6).fill('');
    const displayValue = getAttributeDisplayValue(name);
    return (
      <div className="flex flex-wrap gap-1 pt-1">
        {
          points.map((item, index) => {
            if (displayValue >= index + 1) {
              return <button type="button" key={index} className={pointClass('circle', true)} />
            } return <button type="button" key={index} className={pointClass('circle', false)} />
          })
        }
      </div>
    );
  };

  const returnAdvantage = (cost: number) => {
    const points = Array(7).fill('');
    return (
      <div className="flex flex-wrap gap-1 pt-1">
        {
          points.map((item, index) => {
            if (cost >= index + 1) {
              return <button type="button" key={index} className={pointClass('circle', true)} />
            } return <button type="button" key={index} className={pointClass('circle', false)} />
          })
        }
      </div>
    );
  }

  const returnSkills = (name: string) => {
    const points = Array(5).fill('');
    return (
      <div className="flex flex-wrap gap-1 pt-1">
        {
          points.map((item, index) => {
            if (data.skills[name].value >= index + 1) {
              return <button type="button" key={index} className={pointClass('circle', true)} />
            } return <button type="button" key={index} className={pointClass('circle', false)} />
          })
        }
      </div>
    );
  };

  const returnAgravated = (name: string, quant: number, noWrap = false) => {
    const pointsRest = Array(quant).fill('');
    return ( 
      <div className={`flex ${noWrap ? 'flex-nowrap min-w-max' : 'flex-wrap'} gap-2 pt-1`}>
        {
          pointsRest.map((item, index) => (
            <button
              type="button"
              key={index}
              className={pointClass('square', false, true)}
            />
          ))
        }
      </div>
    );
  };

  const returnTracker = (name: 'health' | 'willpower', quant: number, noWrap = false) => {
    const tracker = isSheetStandalone ? [] : Array.isArray(data[name]) ? data[name] : [];

    return (
      <div className={`flex ${noWrap ? 'flex-nowrap min-w-max' : 'flex-wrap'} gap-2 pt-1`}>
        {
          Array(quant).fill('').map((_, index) => {
            const point = tracker.find((item: any) => Number(item.value) === index + 1);
            const fillClass = point
              ? point.agravated ? 'bg-black' : 'bg-gray-500'
              : 'bg-white';
            const sizeClass = isExportMode
              ? 'h-6 w-6'
              : usePreviewPdfLayout
                ? 'h-5 w-5'
                : 'h-6 w-6';

            return (
              <button
                type="button"
                key={index}
                className={`${sizeClass} border border-black !border-solid ${fillClass}`}
              />
            );
          })
        }
      </div>
    );
  };

  const returnEmpty = () => {
    let length = 13 - (data.advantagesAndFlaws.flaws.length + data.advantagesAndFlaws.advantages.length + data.advantagesAndFlaws.loresheets.length + data.advantagesAndFlaws.talens.length);
    if (length < 0) length = 0;
    const points = Array(length).fill('');
    const number = Array(7).fill('');
    return (
      <div className="flex flex-col w-full gap-1 pt-1 pr-4">
        {
          points.map((item, index) => (
            <div key={index} className="flex justify-between w-full px-3 py-2 border border-black !border-solid">
              <span></span>
              <div className="flex flex-wrap gap-1 pt-1">
                {
                  number.map((item2, index2) => (
                    <button key={index2} type="button" className={pointClass('circle', false)} />
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    );
  };

  const returnEmptyGifts = () => {
    let length = 13 - (data.gifts.length - data.rituals.length);
    if (length < 0) length = 0;
    const points = Array(length).fill('');
    return (
      <div className="flex flex-col w-full">
        {
          points.map((item, index) => (
            <div key={ index } className="grid grid-cols-10 w-full h-8 border-b-transparent">
              <div className={`col-span-3 border border-black !border-solid border-l-black border-transparent border-b-black border-r-black ${index === length - 1 && 'border-b-black'}`}></div>
              <div className={`col-span-2 border border-black !border-solid border-transparent border-r-black border-b-black ${index === length - 1 && 'border-b-black'}`}></div>
              <div className={`col-span-4 border border-black !border-solid border-transparent border-r-black border-b-black ${index === length - 1 && 'border-b-black'}`}></div>
              <div className={`col-span-1 border border-black !border-solid border-transparent border-r-black border-b-black ${index === length - 1 && 'border-b-black'}`}></div>
            </div>
          ))
        }
      </div>
    );
  };

  return (
    <div className={`${preview ? 'w-full min-h-full bg-white [&_*]:cursor-default [&_button]:pointer-events-none' : 'px-4 pb-4 fixed w-full h-screen overflow-y-auto top-0 left-0 z-80 bg-black'}`}>
      { !preview && <div className="fixed bg-black z-80 h-screen w-full">
        <Loading />
      </div> }
      <div ref={pdfRef} className={`bg-white text-black ${preview ? 'w-full p-4 xl:p-6 text-[10px] xl:text-[11px] leading-tight' : usePreviewPdfLayout ? 'w-full p-4 xl:p-6 text-[13px] xl:text-[14px] leading-tight' : 'p-8 border border-black !border-solid text-[13px] xl:text-[14px] leading-tight'}`} id="pdf-content">
        <div className="border-2 border-black !border-solid p-4 mt-3">
          {/* Cabeçalho */}
          <div className="flex w-full justify-center items-center">
            {
              isExportMode ? (
                <img
                  src="/images/logos/text-black.png"
                  alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
                  className="w-1/3 h-auto object-contain pb-3"
                />
              ) : (
                <Image
                  src="/images/logos/text-black.png"
                  alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
                  className="w-72 object-contain pb-3"
                  width={2000}
                  height={800}
                  priority
                />
              )
            }
          </div>
          <div>
            <div className="grid grid-cols-3 border border-black !border-solid w-full">
              <div className="px-1 pb-3 w-full border border-b-black flex items-center justify-start">
                <p className="pr-1 font-bold">Nome:</p>
                <p className="">{ data.name }</p>
              </div>
              <div className="w-full px-1 pb-3 border border-l-black border-b-black flex items-center justify-start">
                <p className="pr-1 font-bold">Conceito:</p>
                <p></p>
              </div>
              <div className="w-full px-1 pb-3 border border-l-black border-b-black flex items-center justify-start">
                <p className="pr-1 font-bold">Patrono:</p>
                <p></p>
              </div>
              <div className="w-full px-1 pb-3 border flex">
                <p className="pr-1 font-bold">Crônica:</p>
                <p>{ session.name }</p>
              </div>
              <div className="w-full px-1 pb-3 border border-l-black flex">
                <p className="pr-1 font-bold">Augúrio:</p>
                <p className="capitalize">{ data.auspice }</p>
              </div>
              <div className="w-full px-1 pb-3 border border-l-black flex">
                <p className="pr-1 font-bold">Tribo:</p>
                <p>{ capitalizeFirstLetter(data.trybe) }</p>
              </div>
            </div>
          </div>
          {/* Atributos */}
          <div className="flex flex-col">
            <div className="flex items-center justify-center">
              <p className="bg-black text-white px-2 pt-1 pb-3 mt-1">Atributos</p>
            </div>
            <div className="grid grid-cols-3 pb-3">
              <p className="text-center">Fí­sicos</p>
              <p className="text-center">Sociais</p>
              <p className="text-center">Mentais</p>
            </div>
            <div className="grid grid-cols-3">
              <div className="pr-10 border border-transparent border-r-black">
                <div className="flex justify-between items-center pb-2">
                  <p className="">Força</p>
                  { returnAttributes('strength') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p className="">Destreza</p>
                  { returnAttributes('dexterity') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p className="">Vigor</p>
                  { returnAttributes('stamina') }
                </div>
              </div>
              <div className="px-10 border border-transparent border-r-black">
                <div className="flex justify-between items-center pb-2">
                  <p className="">Carisma</p>
                  { returnAttributes('charisma') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p className="">Manipulação</p>
                  { returnAttributes('manipulation') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p className="">Autocontrole</p>
                  { returnAttributes('composure') }
                </div>
              </div>
              <div className="pl-10">
                <div className="flex justify-between items-center pb-2">
                  <p className="">Inteligência</p>
                  { returnAttributes('intelligence') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p className="">Raciocí­nio</p>
                  { returnAttributes('wits') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p className="">Determinação</p>
                  { returnAttributes('resolve') }
                </div>
              </div>
            </div>
          </div>
          {/* Vitalidade e Força de Vontade */}
          {
            usePreviewPdfLayout && <div className="flex w-full items-start justify-between gap-6 px-6 py-3 mt-5">
              <div className="flex min-w-max justify-start">
                <div className="flex items-start justify-start gap-5">
                  <div className="flex flex-col items-center justify-start">
                    <p className="pb-2">Vitalidade</p>
                    { returnTracker('health', getHealthDisplayTotal(), true) }
                  </div>
                  <div className="flex flex-col items-center justify-start">
                    <p className="pb-2">Crinos</p>
                    { returnAgravated('health', 4, true) }
                  </div>
                </div>
              </div>
              <div className="flex min-w-max justify-center">
                <div className="flex flex-col items-center justify-start">
                  <p className="pb-2">Força de Vontade</p>
                  { returnTracker('willpower', getWillpowerDisplayTotal(), true) }
                </div>
              </div>
              <div className="flex min-w-max justify-end">
                <div className="flex flex-col items-center justify-start">
                  <p className="pb-2">Fúria</p>
                  { returnAgravated('rage', 5, true) }
                </div>
              </div>
            </div>
          }
          { !usePreviewPdfLayout && <div className="flex w-full items-start justify-between gap-6 px-6 py-3 mt-5">
            <div className="flex min-w-max justify-start">
              <div className="flex items-start justify-start gap-5">
                <div className="flex flex-col items-center justify-start">
                  <p className="pb-2">Vitalidade</p>
                  { returnAgravated('health', 8, true) }
                </div>
                <div className="flex flex-col items-center justify-start">
                  <p className="pb-2">Crinos</p>
                  { returnAgravated('health', 4, true) }
                </div>
              </div>
            </div>
            <div className="flex min-w-max justify-center">
              <div className="flex flex-col items-center justify-start">
                <p className="pb-2">Força de Vontade</p>
                { returnAgravated('willpower', 8, true) }
              </div>
            </div>
            <div className="flex min-w-max justify-end">
              <div className="flex flex-col items-center justify-start">
                <p className="px-1 pb-2">Fúria</p>
                { returnAgravated('rage', 5, true) }
              </div>
            </div>
          </div> }
          {/* Habilidades */}
          <div className="flex flex-col">
            <div className="flex items-center justify-center my-1">
              <p className="bg-black text-white px-2 py-1 pb-4">Habilidades</p>
            </div>
            <div className="grid grid-cols-3">
              <div className="pr-5">
                <div className="flex justify-between items-center pb-2">
                  <p>Atletismo { data.skills.athletics.specialty !== '' && `(${ data.skills.athletics.specialty})` }</p>
                  { returnSkills('athletics') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Briga { data.skills.brawl.specialty !== '' && `(${ data.skills.brawl.specialty})` }</p>
                  { returnSkills('brawl') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Ofí­cios { data.skills.craft.specialty !== '' && `(${ data.skills.craft.specialty})` }</p>
                  { returnSkills('craft') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Condução { data.skills.driving.specialty !== '' && `(${ data.skills.driving.specialty})` }</p>
                  { returnSkills('driving') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Armas de Fogo { data.skills.firearms.specialty !== '' && `(${ data.skills.firearms.specialty})` }</p>
                  { returnSkills('firearms') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Furto { data.skills.larceny.specialty !== '' && `(${ data.skills.larceny.specialty})` }</p>
                  { returnSkills('larceny') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Armas Brancas { data.skills.melee.specialty !== '' && `(${ data.skills.melee.specialty})` }</p>
                  { returnSkills('melee') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Furtividade { data.skills.stealth.specialty !== '' && `(${ data.skills.stealth.specialty})` }</p>
                  { returnSkills('stealth') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Sobrevivência { data.skills.survival.specialty !== '' && `(${ data.skills.survival.specialty})` }</p>
                  { returnSkills('survival') }
                </div>
              </div>
              <div className="px-5">
                <div className="flex justify-between items-center pb-2">
                  <p>Emp. com Animais { data.skills.animalKen.specialty !== '' && `(${ data.skills.animalKen.specialty})` }</p>
                  { returnSkills('animalKen') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Etiqueta { data.skills.etiquette.specialty !== '' && `(${ data.skills.etiquette.specialty})` }</p>
                  { returnSkills('etiquette') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Intuição { data.skills.insight.specialty !== '' && `(${ data.skills.insight.specialty})` }</p>
                  { returnSkills('insight') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Intimidação { data.skills.intimidation.specialty !== '' && `(${ data.skills.intimidation.specialty})` }</p>
                  { returnSkills('intimidation') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Liderança { data.skills.leadership.specialty !== '' && `(${ data.skills.leadership.specialty})` }</p>
                  { returnSkills('leadership') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Performance { data.skills.performance.specialty !== '' && `(${ data.skills.performance.specialty})` }</p>
                  { returnSkills('performance') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Persuasão { data.skills.persuasion.specialty !== '' && `(${ data.skills.persuasion.specialty})` }</p>
                  { returnSkills('persuasion') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Manha { data.skills.streetwise.specialty !== '' && `(${ data.skills.streetwise.specialty})` }</p>
                  { returnSkills('streetwise') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Lábia { data.skills.subterfuge.specialty !== '' && `(${ data.skills.subterfuge.specialty})` }</p>
                  { returnSkills('subterfuge') }
                </div>
              </div>
              <div className="pl-5">
                <div className="flex justify-between items-center pb-2">
                  <p>Acadêmicos { data.skills.academics.specialty !== '' && `(${ data.skills.academics.specialty})` }</p>
                  { returnSkills('academics') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Percepção { data.skills.awareness.specialty !== '' && `(${ data.skills.awareness.specialty})` }</p>
                  { returnSkills('awareness') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Finanças { data.skills.finance.specialty !== '' && `(${ data.skills.finance.specialty})` }</p>
                  { returnSkills('finance') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Investigação { data.skills.investigation.specialty !== '' && `(${ data.skills.investigation.specialty})` }</p>
                  { returnSkills('investigation') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Medicina { data.skills.medicine.specialty !== '' && `(${ data.skills.medicine.specialty})` }</p>
                  { returnSkills('medicine') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Ocultismo { data.skills.occult.specialty !== '' && `(${ data.skills.occult.specialty})` }</p>
                  { returnSkills('occult') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Polí­tica { data.skills.politics.specialty !== '' && `(${ data.skills.politics.specialty})` }</p>
                  { returnSkills('politics') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Ciência { data.skills.science.specialty !== '' && `(${ data.skills.science.specialty})` }</p>
                  { returnSkills('science') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p>Tecnologia { data.skills.technology.specialty !== '' && `(${ data.skills.technology.specialty})` }</p>
                  { returnSkills('technology') }
                </div>
              </div>
            </div>
          </div>
          {/* Renome */}
          <div>
            <div className="flex items-center justify-center my-1">
              <p className="bg-black text-white px-2 py-1 pb-4">Renome</p>
            </div>
            <div className="grid grid-cols-3 border border-black !border-solid w-full">
              <div className="w-full p-1 py-2 border border-transparent flex items-center justify-between pr-3">
                <p className="px-1 font-bold pb-2">Glória</p>
                { returnPoints('glory') }
              </div>
              <div className="w-full p-1 py-2 border border-l-black flex items-center justify-between pr-3">
                <p className="px-1 font-bold pb-2">Honra</p>
                { returnPoints('honor') }
              </div>
              <div className="w-full p-1 border border-l-black flex items-center justify-between pr-3">
                <p className="px-1 font-bold pb-2">Sabedoria</p>
                { returnPoints('wisdom') }
              </div>
            </div>
          </div>
          {/* Vantagens e Defeitos */}
          <div className="grid grid-cols-2 mt-5">
            <div className="w-full flex flex-col items-center">
              <p className="mb-3">Vantagens e Defeitos</p>
              <div className="w-full pr-4">
                { data.advantagesAndFlaws.advantages.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between w-full px-3 border border-black text-black !border-solid mt-1 items-center py-2">
                    <p className="pb-1 text-black">{ item.name }{item.title && ` - ${item.title}` }</p>
                    { returnAdvantage(item.cost) }
                  </div>
                )) }
              </div>
              <div className="w-full pr-4">
                { data.advantagesAndFlaws.loresheets.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between w-full px-3 border border-black !border-solid mt-1 items-center py-2">
                    <p className="pb-1">{ item.name }{item.title && ` - ${item.title}` }</p>
                    { returnAdvantage(item.cost) }
                  </div>
                )) }
              </div>
              <div className="w-full pr-4">
                { data.advantagesAndFlaws.talens.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between w-full px-3 border border-black !border-solid mt-1 items-center py-2">
                    <p className="pb-1">{ item.name }{item.title && ` - ${item.title}` }</p>
                    { returnAdvantage(item.value) }
                  </div>
                )) }
              </div>
              <div className="w-full pr-4">
                { data.advantagesAndFlaws.flaws.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between w-full px-3 border border-black !border-solid mt-1 items-center py-2">
                    <p className="pb-1">{ item.name }{item.title && ` - ${item.title}` }</p>
                    { returnAdvantage(item.cost) }
                  </div>
                )) }
              </div>
              { returnEmpty() }
              {/* Fúria, Hauglosk e Harano */}
              <div className="pt-4 w-full pr-4">
                <div className="grid grid-cols-2 w-full">
                  <div className="w-full p-1 py-2 flex items-center justify-between pr-3">
                    <p className="px-1 font-bold self-center">Hauglosk</p>
                    { returnPoints('hauglosk', true) }
                  </div>
                  <div className="w-full p-1 pl-3 flex items-center justify-between">
                    <p className="px-1 font-bold self-center">Harano</p>
                    { returnPoints('harano', true) }
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col items-center">
              <p className="mb-3">Formas dos Garou</p>
              <div className="border border-black !border-solid w-full">
                <div className="grid grid-cols-5 w-full px-3 pb-1 pt-3">
                  <p className="col-span-1 font-bold">Hominí­deo</p>
                  <ul className="col-span-3">
                    <li>Custo: Nenhum</li>
                    <li>Incapaz de se regenerar, mas pode tocar prata sem sofrer danos</li>
                  </ul>
                  <div className="col-span-1">
                    {
                      isExportMode ? (
                        <img
                          src="/images/forms/Hominídeo-white.png"
                          alt="Forma Hominídeo"
                          className="block w-[100px] h-auto object-contain pb-3"
                        />
                      ) : (
                        <Image
                          src="/images/forms/Hominídeo-white.png"
                          alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
                          className="object-contain pb-3"
                          width={2000}
                          height={800}
                          priority
                        />
                      )
                    }
                  </div>
                </div>
                <div className="grid grid-cols-5 w-full px-3 pt-1">
                  <p className="col-span-1 font-bold">Glabro</p>
                  <ul className="col-span-3">
                    <li>Custo: Um Teste de Fúria</li>
                    <li>Testes Fí­sicos: Bônus de Dois Dados</li>
                    <li>Testes Sociais: Penalidade de Dois dados</li>
                    <li>Regeneração: 1 por Teste de Fúria</li>
                  </ul>
                  {
                    isExportMode ? (
                      <img
                        src="/images/forms/Glabro-white.png"
                        alt="Forma Glabro"
                        className="block w-[100px] h-auto object-contain pb-3"
                      />
                    ) : (
                      <Image
                        src="/images/forms/Glabro-white.png"
                        alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
                        className="object-contain pb-3"
                        width={2000}
                        height={800}
                        priority
                      />
                    )
                  }
                </div>
                <div className="grid grid-cols-5 w-full px-3 pt-1">
                  <p className="col-span-1 font-bold">Crinos</p>
                  <ul className="col-span-3">
                    <li>Custo: Dois Testes de Fúria</li>
                    <li>Gaste 1 ponto de Força de Vontade por turno ou está sujeito ao Frenesi</li>
                    <li>Testes Fí­sicos: Bônus de Quatro Dados</li>
                    <li>Ní­vel de Vitalidade: +4</li>
                    <li>Testes Sociais e Furtivos: Falha</li>
                    <li>Regeneração: 2 por Teste de Fúria</li>
                    <li>Garras: +3</li>
                    <li>Mordida: +1 Agravado</li>
                    <li>Causa Delírio</li>
                  </ul>
                  {
                    isExportMode ? (
                      <img
                        src="/images/forms/Crinos-white.png"
                        alt="Forma Crinos"
                        className="block w-[100px] h-auto object-contain pb-3"
                      />
                    ) : (
                      <Image
                        src="/images/forms/Crinos-white.png"
                        alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
                        className="object-contain pb-3"
                        width={2000}
                        height={800}
                        priority
                      />
                    )
                  }
                </div>
                <div className="grid grid-cols-5 w-full px-3 pt-1">
                  <p className="col-span-1 font-bold">Hispo</p>
                  <ul className="col-span-3">
                    <li>Custo: um Teste de Fúria</li>
                    <li>Testes Fí­sicos: Bônus de Dois Dados</li>
                    <li>Testes Furtivos: Penalidade de Dois Dados</li>
                    <li>Regeneração: 1 por Teste de Fúria</li>
                    <li>Mordida: +1 Agravado</li>
                  </ul>
                  {
                    isExportMode ? (
                      <img
                        src="/images/forms/Hispo-white.png"
                        alt="Forma Hispo"
                        className="block w-[100px] h-auto object-contain pb-3"
                      />
                    ) : (
                      <Image
                        src="/images/forms/Hispo-white.png"
                        alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
                        className="object-contain pb-3"
                        width={2000}
                        height={800}
                        priority
                      />
                    )
                  }
                </div>
                <div className="grid grid-cols-5 w-full px-3 pt-1">
                  <p className="col-span-1 font-bold">Lupino</p>
                  <ul className="col-span-3">
                    <li>Custo: Nenhum</li>
                    <li>Incapaz de se regenerar, mas pode tocar prata sem sofrer danos</li>
                  </ul>
                  {
                    isExportMode ? (
                      <img
                        src="/images/forms/Lupino-white.png"
                        alt="Forma Lupino"
                        className="block w-[100px] h-auto object-contain pb-3"
                      />
                    ) : (
                      <Image
                        src="/images/forms/Lupino-white.png"
                        alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
                        className="object-contain pb-3"
                        width={2000}
                        height={800}
                        priority
                      />
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref={pdfRef2} className={`bg-white text-black ${preview ? 'mt-6 w-full p-4 xl:p-6 text-[10px] xl:text-[11px] leading-tight' : usePreviewPdfLayout ? 'w-full p-4 xl:p-6 text-[13px] xl:text-[14px] leading-tight' : 'p-8 text-[13px] xl:text-[14px] leading-tight'}`} id="pdf-content">
        <div className="border-2 border-black !border-solid p-4 mt-3">
          <div className="flex flex-col">
            {/* Dons e Rituais */}
            <div className="flex flex-col items-center justify-center my-1">
              <p className="bg-black text-white px-2 py-1 pb-4">Dons e Rituais</p>
              <div className="w-full pt-4">
                <div className="grid grid-cols-10 w-full font-bold">
                  <div className="col-span-3 border border-black !border-solid px-2 pb-3">Nome</div>
                  <div className="col-span-2 border border-black !border-solid px-2">Custo</div>
                  <div className="col-span-4 border border-black !border-solid px-2">Teste</div>
                  <div className="col-span-1 border border-black !border-solid px-2">Página</div>
                </div>
                {
                  data.rituals.map((item: any, index: number) => (
                    <div key={ index } className="grid grid-cols-10 w-full">
                      <div className={`col-span-3 border pb-3 border-black !border-solid px-2 py-1 ${index === data.gifts.length - 1 ? 'border-b-black' : 'border-b-transparent'}`}>{ item.titlePtBr }</div>
                      <div className={`col-span-2 border  pb-3 border-black !border-solid border-transparent border-t-black border-r-black px-2 py-1 ${index === data.gifts.length - 1 && 'border-b-black'}`}></div>
                      <div className={`col-span-4 border pb-3 border-black !border-solid border-transparent border-t-black border-r-black px-2 py-1 ${index === data.gifts.length - 1 && 'border-b-black'}`}>{ item.pool }</div>
                      <div className={`col-span-1 border pb-3 border-black !border-solid border-transparent border-t-black border-r-black px-2 py-1 ${index === data.gifts.length - 1 && 'border-b-black'}`}>{ item.page }</div>
                    </div>
                  ))
                }
                {
                  data.gifts.map((item: any, index: number) => (
                    <div key={ index } className="grid grid-cols-10 w-full">
                      <div className={`col-span-3 border pb-3 border-black !border-solid px-2 py-1 ${index === data.gifts.length - 1 ? 'border-b-black' : 'border-b-transparent'}`}>{ item.giftPtBr }</div>
                      <div className={`col-span-2 border  pb-3 border-black !border-solid border-transparent border-t-black border-r-black px-2 py-1 ${index === data.gifts.length - 1 && 'border-b-black'}`}>{ item.cost }</div>
                      <div className={`col-span-4 border pb-3 border-black !border-solid border-transparent border-t-black border-r-black px-2 py-1 ${index === data.gifts.length - 1 && 'border-b-black'}`}>{ item.pool }</div>
                      <div className={`col-span-1 border pb-3 border-black !border-solid border-transparent border-t-black border-r-black px-2 py-1 ${index === data.gifts.length - 1 && 'border-b-black'}`}>{ item.page }</div>
                    </div>
                  ))
                }
                { returnEmptyGifts() }
              </div>
            </div>
            <div className="grid grid-cols-3 pt-2 gap-2">
              <div className="w-full">
                <p className="text-center w-full pb-3">Princí­pios da Crônica</p>
                <div className="px-4 py-2 h-96 border border-black !border-solid"></div>
              </div>
              <div>
                <p className="text-center w-full pb-3">Pedras de Toque</p>
                <div className="h-96 border border-black !border-solid">
                  <ul className="px-4 py-2">
                  {
                    data.touchstones.map((item: any, index: number) => (
                      <li key={index} className="pb-2">
                        - <span className="font-bold">{ item.name }</span> - { typeInTouchstones(item.description) }
                      </li>
                    ))
                  }
                  </ul>
                </div>
              </div>
              <div>
                <p className="text-center w-full pb-3">Favores e Proibições</p>
                <div className="px-4 py-2 h-96 border border-black !border-solid"></div>
              </div>
              <div className="w-full">
                <p className="text-center w-full pb-3">Notas</p>
                <div className="px-4 py-2 h-96 border border-black !border-solid">{ truncateText(data.notes, 710) }</div>
              </div>
              <div className="col-span-2 w-full">
                <p className="text-center w-full pb-3">História</p>
                <div className="px-4 py-2 h-96 border border-black !border-solid text-justify">{ truncateText(data.background, 1420) }</div>
              </div>
            </div>
            <div>
              <p className="col-span-1 pt-5">Experiência</p>
              <hr className="mt-2" />
            </div>
          </div>
        </div>
      </div>      
    </div>
  );
};


