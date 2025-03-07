import React, { useContext, useEffect, useLayoutEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import contexto from "@/context/context";
import Image from "next/image";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import Loading from "./loading";

export default function ConvertToPdf(props: { data: any }) {
  const { data } = props;
  const { setShowDownloadPdf, session } = useContext(contexto);
  const pdfRef: any = useRef(null);
  const pdfRef2: any = useRef(null);
  const hasDownloaded = useRef(false);
  
  const handleDownloadPdf = async () => {
    const pdfContainer1 = document.createElement('div');
    pdfContainer1.style.width = '1400px';
    pdfContainer1.style.overflow = 'hidden';
    pdfContainer1.appendChild(pdfRef.current.cloneNode(true));
    document.body.appendChild(pdfContainer1);
    const pdf = new jsPDF();
    const captureElement = async (element: any) => {
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
    pdfContainer2.style.width = '1400px';
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
    if (!hasDownloaded.current) {
      handleDownloadPdf();
      setTimeout(() => setShowDownloadPdf({ show: false, email: '' }), 3000);
      hasDownloaded.current = true;
    }
  }, []);

  const returnPoints = (name: string) => {
    const points = Array(5).fill('');
    return (
      <div className={`flex flex-wrap ${name === 'rage' || name === 'hauglosk' || name === 'harano' ? 'gap-2' : 'gap-1'} pt-1`}>
        {
          points.map((item, index) => {
            if (data[name] >= index + 1) {
              return <button type="button" key={index} className={`${name === 'rage' || name === 'hauglosk' || name === 'harano' ? 'h-6 w-6' : 'rounded-full h-5 w-5' } bg-black border-black !border-solid border`} />
            } return <button type="button" key={index} className={`${name === 'rage' || name === 'hauglosk' || name === 'harano' ? 'h-6 w-6' : 'rounded-full h-5 w-5' } bg-white border-black !border-solid border`} />
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
    return (
      <div className="flex flex-wrap gap-1 pt-1">
        {
          points.map((item, index) => {
            if (data.attributes[name] >= index + 1) {
              return <button type="button" key={index} className="h-5 w-5 rounded-full bg-black border-black !border-solid border" />
            } return <button type="button" key={index} className="h-5 w-5 rounded-full bg-white border border-black !border-solid" />
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
              return <button type="button" key={index} className="h-5 w-5 rounded-full bg-black border-black !border-solid border" />
            } return <button type="button" key={index} className="h-5 w-5 rounded-full bg-white border border-black !border-solid" />
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
              return <button type="button" key={index} className="h-5 w-5 rounded-full bg-black border-black !border-solid border" />
            } return <button type="button" key={index} className="h-5 w-5 rounded-full bg-white border border-black !border-solid" />
          })
        }
      </div>
    );
  };

  const returnAgravated = (name: string, quant: number) => {
    const pointsRest = Array(quant).fill('');
    return ( 
      <div className="flex flex-wrap gap-2 pt-1">
        {
          pointsRest.map((item, index) => (
            <button
              type="button"
              key={index}
              className="h-6 w-6 bg-white border-black !border-solid border cursor-pointer"
            />
          ))
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
                    <button key={index2} type="button"  className="h-5 w-5 rounded-full bg-white border-black !border-solid border" />
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
    let length = 18 - (data.gifts.length - data.rituals.length);
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
    <div className="px-4 pb-4 fixed w-full h-screen overflow-y-auto top-0 left-0 z-80 bg-black">
      <div className="fixed bg-black z-80 h-screen w-full">
        <Loading />
      </div>
      <div ref={pdfRef} className="bg-white p-8 border border-black !border-solid" id="pdf-content">
        <div className="border-2 border-black !border-solid p-4 mt-3">
          <div className="flex w-full justify-center items-center">
            <Image
              src="/images/logos/text-black.png"
              alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
              className="w-72 object-contain pb-3"
              width={2000}
              height={800}
              priority
            />
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
              <p className="text-center">Físicos</p>
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
                  <p className="">Raciocínio</p>
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
          <div className="grid grid-cols-3 w-full py-3 mt-5">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center justify-start">
                <p className="pb-2">Vitalidade</p>
                { returnAgravated('health', 8) }
              </div>
              <div className="flex flex-col items-center justify-start ml-5">
                <p className="pb-2">Crinos</p>
                { returnAgravated('health', 4) }
              </div>
            </div>
            <div className="flex flex-col items-center justify-start">
              <p className="pb-2">Força de Vontade</p>
              { returnAgravated('willpower', 8) }
            </div>
            <div className="flex flex-col items-center justify-start">
              <p className="px-1 pb-2">Fúria</p>
              { returnAgravated('rage', 5) }
            </div>
          </div>
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
                  <p>Ofícios { data.skills.craft.specialty !== '' && `(${ data.skills.craft.specialty})` }</p>
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
                  <p>Política { data.skills.politics.specialty !== '' && `(${ data.skills.politics.specialty})` }</p>
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
                  <div key={index} className="flex justify-between w-full px-3 border border-black !border-solid mt-1 items-center py-2">
                    <p className="pb-1">{ item.name }{item.title && ` - ${item.title}` }</p>
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
                    <p className="px-1 pb-2 font-bold">Hauglosk</p>
                    { returnPoints('hauglosk') }
                  </div>
                  <div className="w-full p-1 pl-3 flex items-center justify-between">
                    <p className="px-1 pb-2 font-bold">Harano</p>
                    { returnPoints('harano') }
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col items-center">
              <p className="mb-3">Formas dos Garou</p>
              <div className="border border-black !border-solid w-full">
                <div className="grid grid-cols-5 w-full px-3 pb-1 pt-3">
                  <p className="col-span-1 font-bold">Hominídeo</p>
                  <ul className="col-span-3">
                    <li>Custo: Nenhum</li>
                    <li>Incapaz de se regenerar, mas pode tocar prata sem sofrer danos</li>
                  </ul>
                  <div className="col-span-1">
                    <Image
                      src="/images/forms/Hominídeo-white.png"
                      alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
                      className="object-contain pb-3"
                      width={2000}
                      height={800}
                      priority
                    />
                  </div>
                </div>
                <div className="grid grid-cols-5 w-full px-3 pt-1">
                  <p className="col-span-1 font-bold">Glabro</p>
                  <ul className="col-span-3">
                    <li>Custo: Um Teste de Fúria</li>
                    <li>Testes Físicos: Bônus de Dois Dados</li>
                    <li>Testes Sociais: Penalidade de Dois dados</li>
                    <li>Regeneração: 1 por Teste de Fúria</li>
                  </ul>
                  <Image
                    src="/images/forms/Glabro-white.png"
                    alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
                    className="object-contain pb-3"
                    width={2000}
                    height={800}
                    priority
                  />
                </div>
                <div className="grid grid-cols-5 w-full px-3 pt-1">
                  <p className="col-span-1 font-bold">Crinos</p>
                  <ul className="col-span-3">
                    <li>Custo: Dois Testes de Fúria</li>
                    <li>Gaste 1 ponto de Força de Vontade por turno ou está sujeito ao Frenesi</li>
                    <li>Testes Físicos: Bônus de Quatro Dados</li>
                    <li>Nível de Vitalidade: +4</li>
                    <li>Testes Sociais e Furtivos: Falha</li>
                    <li>Regeneração: 2 por Teste de Fúria</li>
                    <li>Garras: +3</li>
                    <li>Mordida: +1 Agravado</li>
                    <li>Causa Delírio</li>
                  </ul>
                  <Image
                    src="/images/forms/Crinos-white.png"
                    alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
                    className="object-contain pb-3"
                    width={2000}
                    height={800}
                    priority
                  />
                </div>
                <div className="grid grid-cols-5 w-full px-3 pt-1">
                  <p className="col-span-1 font-bold">Hispo</p>
                  <ul className="col-span-3">
                    <li>Custo: um Teste de Fúria</li>
                    <li>Testes Físicos: Bônus de Dois Dados</li>
                    <li>Testes Furtivos: Penalidade de Dois Dados</li>
                    <li>Regeneração: 1 por Teste de Fúria</li>
                    <li>Mordida: +1 Agravado</li>
                  </ul>
                  <Image
                    src="/images/forms/Hispo-white.png"
                    alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
                    className="object-contain pb-3"
                    width={2000}
                    height={800}
                    priority
                  />
                </div>
                <div className="grid grid-cols-5 w-full px-3 pt-1">
                  <p className="col-span-1 font-bold">Lupino</p>
                  <ul className="col-span-3">
                    <li>Custo: Nenhum</li>
                    <li>Incapaz de se regenerar, mas pode tocar prata sem sofrer danos</li>
                  </ul>
                  <Image
                    src="/images/forms/Lupino-white.png"
                    alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
                    className="object-contain pb-3"
                    width={2000}
                    height={800}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref={pdfRef2} className="bg-white p-8" id="pdf-content">
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
                <p className="text-center w-full pb-3">Princípios da Crônica</p>
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
                <div className="px-4 py-2 h-96 border border-black !border-solid text-justify">{ truncateText(data.background, 1530) }</div>
              </div>
            </div>
            <div className="">
              <p className="col-span-1 pt-5">Experiência Total</p>
              <hr />
            </div>
            <div>
              <p className="col-span-1 pt-5">Experiência Gasta</p>
              <hr />
            </div>
          </div>
        </div>
      </div>      
    </div>
  );
};
