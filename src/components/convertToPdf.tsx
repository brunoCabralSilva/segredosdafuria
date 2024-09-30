import React, { useContext, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import contexto from "@/context/context";
import Image from "next/image";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import Loading from "./loading";

export default function ConvertToPdf() {
  const { dataSheet, setShowDownloadPdf, session } = useContext(contexto);
  const pdfRef: any = useRef(null);
  const pdfRef2: any = useRef(null);

  useEffect(() => {
    const handleDownloadPdf = async () => {
      const pdfContainer1 = document.createElement('div');
      pdfContainer1.style.width = '1300px';
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
      pdf.save(dataSheet.name + ".pdf");
      document.body.removeChild(pdfContainer1);
      document.body.removeChild(pdfContainer2);
    };
    handleDownloadPdf();
    setTimeout(() => setShowDownloadPdf(false), 3000);
  }, []);

  const returnPoints = (name: string) => {
    const points = Array(5).fill('');
    return (
      <div className={`flex flex-wrap ${name === 'rage' || name === 'hauglosk' || name === 'harano' ? 'gap-2' : 'gap-1'} pt-1`}>
        {
          points.map((item, index) => {
            if (dataSheet[name] >= index + 1) {
              return <button type="button" key={index} className={`${name === 'rage' || name === 'hauglosk' || name === 'harano' ? 'h-6 w-6' : 'rounded-full h-5 w-5' } bg-black border-black border`} />
            } return <button type="button" key={index} className={`${name === 'rage' || name === 'hauglosk' || name === 'harano' ? 'h-6 w-6' : 'rounded-full h-5 w-5' } bg-white border-black border`} />
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
    if (dataSheet.touchstones.length === 3) length = 185;
    else if (dataSheet.touchstones.length === 2) length = 330;
    if (text.length > length) return text.slice(0, length) + '...';
    return text;
  };

  const returnAttributes = (name: string) => {
    const points = Array(6).fill('');
    return (
      <div className="flex flex-wrap gap-1 pt-1">
        {
          points.map((item, index) => {
            if (dataSheet.attributes[name] >= index + 1) {
              return <button type="button" key={index} className="h-5 w-5 rounded-full bg-black border-black border" />
            } return <button type="button" key={index} className="h-5 w-5 rounded-full bg-white border border-black" />
          })
        }
      </div>
    );
  };

  const returnAdvantage = (cost: number) => {
    console.log(cost);
    const points = Array(7).fill('');
    return (
      <div className="flex flex-wrap gap-1 pt-1">
        {
          points.map((item, index) => {
            if (cost >= index + 1) {
              return <button type="button" key={index} className="h-5 w-5 rounded-full bg-black border-black border" />
            } return <button type="button" key={index} className="h-5 w-5 rounded-full bg-white border border-black" />
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
            if (dataSheet.skills[name].value >= index + 1) {
              return <button type="button" key={index} className="h-5 w-5 rounded-full bg-black border-black border" />
            } return <button type="button" key={index} className="h-5 w-5 rounded-full bg-white border border-black" />
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
              className="h-6 w-6 bg-white border-black border cursor-pointer"
            />
          ))
        }
      </div>
    );
  };

  const returnEmpty = () => {
    let length = 13 - (dataSheet.advantagesAndFlaws.flaws.length + dataSheet.advantagesAndFlaws.advantages.length + dataSheet.advantagesAndFlaws.loresheets.length + dataSheet.advantagesAndFlaws.talens.length);
    if (length < 0) length = 0;
    const points = Array(length).fill('');
    const number = Array(7).fill('');
    return (
      <div className="flex flex-col w-full gap-1 pt-1 pr-4">
        {
          points.map((item, index) => (
            <div key={index} className="flex justify-between w-full px-3 py-2 border border-black">
              <span></span>
              <div className="flex flex-wrap gap-1 pt-1">
                {
                  number.map((item2, index2) => (
                    <button type="button"  className="h-5 w-5 rounded-full bg-white border-black border" />
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
    let length = 18 - (dataSheet.gifts.length - dataSheet.rituals.length);
    if (length < 0) length = 0;
    const points = Array(length).fill('');
    return (
      <div className="flex flex-col w-full">
        {
          points.map((item, index) => (
            <div key={ index } className="grid grid-cols-10 w-full h-8 border-b-transparent">
              <div className={`col-span-3 border border-black border-l-black border-transparent border-b-black border-r-black ${index === length - 1 && 'border-b-black'}`}></div>
              <div className={`col-span-2 border border-black border-transparent border-r-black border-b-black ${index === length - 1 && 'border-b-black'}`}></div>
              <div className={`col-span-4 border border-black border-transparent border-r-black border-b-black ${index === length - 1 && 'border-b-black'}`}></div>
              <div className={`col-span-1 border border-black border-transparent border-r-black border-b-black ${index === length - 1 && 'border-b-black'}`}></div>
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
      <div ref={pdfRef} className="bg-white p-8 border border-black" id="pdf-content">
        <div className="border-2 border-black p-4 mt-3">
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
            <div className="grid grid-cols-3 border border-black w-full">
              <div className="px-1 pb-3 w-full border border-b-black flex items-center justify-start">
                <p className="pr-1 font-bold">Nome:</p>
                <p className="">{ dataSheet.name }</p>
              </div>
              <div className="w-full px-1 pb-3 border border-l-black border-b-black flex items-center justify-start">
                <p className="pr-1 font-bold">Conceito:</p>
                <p></p>
              </div>
              <div className="w-full px-1 pb-3 border border-l-black border-b-black flex items-center justify-start">
                <p className="pr-1 font-bold">Patrono:</p>
                <p></p>
              </div>
              <div className="w-full px-1 pb-3 border">
                <p className="pr-1 font-bold">Crônica:</p>
                <p>{ session.name }</p>
              </div>
              <div className="w-full px-1 pb-3 border border-l-black flex">
                <p className="pr-1 font-bold">Augúrio:</p>
                <p className="capitalize">{ dataSheet.auspice }</p>
              </div>
              <div className="w-full px-1 pb-3 border border-l-black flex">
                <p className="pr-1 font-bold">Tribo:</p>
                <p>{ capitalizeFirstLetter(dataSheet.trybe) }</p>
              </div>
            </div>
          </div>
          {/* Atributos */}
          <div className="flex flex-col">
            <div className="flex items-center justify-center my-1">
              <p className="bg-black text-white px-2 py-1 pb-4">Atributos</p>
            </div>
            <div className="grid grid-cols-3 pb-3">
              <p className="text-center">Físicos</p>
              <p className="text-center">Sociais</p>
              <p className="text-center">Mentais</p>
            </div>
            <div className="grid grid-cols-3">
              <div className="pr-10 border border-transparent border-r-black">
                <div className="flex justify-between items-center pb-2">
                  <p className="pb-2">Força</p>
                  { returnAttributes('strength') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p className="pb-2">Destreza</p>
                  { returnAttributes('dexterity') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p className="pb-2">Vigor</p>
                  { returnAttributes('stamina') }
                </div>
              </div>
              <div className="px-10 border border-transparent border-r-black">
                <div className="flex justify-between items-center pb-2">
                  <p className="pb-2">Carisma</p>
                  { returnAttributes('charisma') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p className="pb-2">Manipulação</p>
                  { returnAttributes('manipulation') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p className="pb-2">Autocontrole</p>
                  { returnAttributes('composure') }
                </div>
              </div>
              <div className="pl-10">
                <div className="flex justify-between items-center pb-2">
                  <p className="pb-2">Inteligência</p>
                  { returnAttributes('intelligence') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p className="pb-2">Raciocínio</p>
                  { returnAttributes('wits') }
                </div>
                <div className="flex justify-between items-center pb-2">
                  <p className="pb-2">Autocontrole</p>
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
                <div className="flex justify-between items-center pt-3">
                  <p>Atletismo { dataSheet.skills.athletics.specialty !== '' && `(${ dataSheet.skills.athletics.specialty})` }</p>
                  { returnSkills('athletics') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Briga { dataSheet.skills.brawl.specialty !== '' && `(${ dataSheet.skills.brawl.specialty})` }</p>
                  { returnSkills('brawl') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Ofícios { dataSheet.skills.craft.specialty !== '' && `(${ dataSheet.skills.craft.specialty})` }</p>
                  { returnSkills('craft') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Condução { dataSheet.skills.driving.specialty !== '' && `(${ dataSheet.skills.driving.specialty})` }</p>
                  { returnSkills('driving') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Armas de Fogo { dataSheet.skills.firearms.specialty !== '' && `(${ dataSheet.skills.firearms.specialty})` }</p>
                  { returnSkills('firearms') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Furto { dataSheet.skills.larceny.specialty !== '' && `(${ dataSheet.skills.larceny.specialty})` }</p>
                  { returnSkills('larceny') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Armas Brancas { dataSheet.skills.melee.specialty !== '' && `(${ dataSheet.skills.melee.specialty})` }</p>
                  { returnSkills('melee') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Furtividade { dataSheet.skills.stealth.specialty !== '' && `(${ dataSheet.skills.stealth.specialty})` }</p>
                  { returnSkills('stealth') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Sobrevivência { dataSheet.skills.survival.specialty !== '' && `(${ dataSheet.skills.survival.specialty})` }</p>
                  { returnSkills('survival') }
                </div>
              </div>
              <div className="px-5">
                <div className="flex justify-between items-center pt-3">
                  <p>Emp. com Animais { dataSheet.skills.animalKen.specialty !== '' && `(${ dataSheet.skills.animalKen.specialty})` }</p>
                  { returnSkills('animalKen') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Etiqueta { dataSheet.skills.etiquette.specialty !== '' && `(${ dataSheet.skills.etiquette.specialty})` }</p>
                  { returnSkills('etiquette') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Intuição { dataSheet.skills.insight.specialty !== '' && `(${ dataSheet.skills.insight.specialty})` }</p>
                  { returnSkills('insight') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Intimidação { dataSheet.skills.intimidation.specialty !== '' && `(${ dataSheet.skills.intimidation.specialty})` }</p>
                  { returnSkills('intimidation') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Liderança { dataSheet.skills.leadership.specialty !== '' && `(${ dataSheet.skills.leadership.specialty})` }</p>
                  { returnSkills('leadership') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Performance { dataSheet.skills.performance.specialty !== '' && `(${ dataSheet.skills.performance.specialty})` }</p>
                  { returnSkills('performance') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Persuasão { dataSheet.skills.persuasion.specialty !== '' && `(${ dataSheet.skills.persuasion.specialty})` }</p>
                  { returnSkills('persuasion') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Manha { dataSheet.skills.streetwise.specialty !== '' && `(${ dataSheet.skills.streetwise.specialty})` }</p>
                  { returnSkills('streetwise') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Lábia { dataSheet.skills.subterfuge.specialty !== '' && `(${ dataSheet.skills.subterfuge.specialty})` }</p>
                  { returnSkills('subterfuge') }
                </div>
              </div>
              <div className="pl-5">
                <div className="flex justify-between items-center pt-3">
                  <p>Acadêmicos { dataSheet.skills.academics.specialty !== '' && `(${ dataSheet.skills.academics.specialty})` }</p>
                  { returnSkills('academics') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Percepção { dataSheet.skills.awareness.specialty !== '' && `(${ dataSheet.skills.awareness.specialty})` }</p>
                  { returnSkills('awareness') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Finanças { dataSheet.skills.finance.specialty !== '' && `(${ dataSheet.skills.finance.specialty})` }</p>
                  { returnSkills('finance') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Investigação { dataSheet.skills.investigation.specialty !== '' && `(${ dataSheet.skills.investigation.specialty})` }</p>
                  { returnSkills('investigation') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Medicina { dataSheet.skills.medicine.specialty !== '' && `(${ dataSheet.skills.medicine.specialty})` }</p>
                  { returnSkills('medicine') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Ocultismo { dataSheet.skills.occult.specialty !== '' && `(${ dataSheet.skills.occult.specialty})` }</p>
                  { returnSkills('occult') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Política { dataSheet.skills.politics.specialty !== '' && `(${ dataSheet.skills.politics.specialty})` }</p>
                  { returnSkills('politics') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Ciência { dataSheet.skills.science.specialty !== '' && `(${ dataSheet.skills.science.specialty})` }</p>
                  { returnSkills('science') }
                </div>
                <div className="flex justify-between items-center pt-3">
                  <p>Tecnologia { dataSheet.skills.technology.specialty !== '' && `(${ dataSheet.skills.technology.specialty})` }</p>
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
            <div className="grid grid-cols-3 border border-black w-full">
              <div className="w-full p-1 py-2 border border-transparent flex items-center justify-between pr-3">
                <p className="px-1 pb-2 font-bold">Glória</p>
                { returnPoints('glory') }
              </div>
              <div className="w-full p-1 py-2 border border-l-black flex items-center justify-between pr-3">
                <p className="px-1 pb-2 font-bold">Honra</p>
                { returnPoints('honor') }
              </div>
              <div className="w-full p-1 border border-l-black flex items-center justify-between pr-3">
                <p className="px-1 pb-2 font-bold">Sabedoria</p>
                { returnPoints('wisdom') }
              </div>
            </div>
          </div>
          {/* Vantagens e Defeitos */}
          <div className="grid grid-cols-2 mt-5">
            <div className="w-full flex flex-col items-center">
              <p className="mb-3">Vantagens e Defeitos</p>
              <div className="w-full pr-4">
                { dataSheet.advantagesAndFlaws.advantages.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between w-full px-3 py-2 border border-black mt-1">
                    <p className="pb-2">{ item.name }{item.title && ` - ${item.title}` }</p>
                    { returnAdvantage(item.cost) }
                  </div>
                )) }
              </div>
              <div className="w-full pr-4">
                { dataSheet.advantagesAndFlaws.loresheets.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between w-full px-3 py-2 border border-black mt-1">
                    <p className="pb-2">{ item.name }{item.title && ` - ${item.title}` }</p>
                    { returnAdvantage(item.cost) }
                  </div>
                )) }
              </div>
              <div className="w-full pr-4">
                { dataSheet.advantagesAndFlaws.talens.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between w-full px-3 py-2 border border-black mt-1">
                    <p className="pb-2">{ item.name }{item.title && ` - ${item.title}` }</p>
                    { returnAdvantage(item.value) }
                  </div>
                )) }
              </div>
              <div className="w-full pr-4">
                { dataSheet.advantagesAndFlaws.flaws.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between w-full px-3 py-2 border border-black mt-1">
                    <p className="pb-2">{ item.name }{item.title && ` - ${item.title}` }</p>
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
              <div className="border border-black w-full">
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
                <div className="grid grid-cols-5 w-full px-3 py-1">
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
                <div className="grid grid-cols-5 w-full px-3 py-1">
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
                <div className="grid grid-cols-5 w-full px-3 py-1">
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
                <div className="grid grid-cols-5 w-full px-3 py-1">
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
        <div className="border-2 border-black p-4 mt-3">
          <div className="flex flex-col">
            {/* Dons e Rituais */}
            <div className="flex flex-col items-center justify-center my-1">
              <p className="bg-black text-white px-2 py-1 pb-4">Dons e Rituais</p>
              <div className="w-full pt-4">
                <div className="grid grid-cols-10 w-full font-bold">
                  <div className="col-span-3 border border-black border-transparent border-l-black border-r-black px-2 pb-3">Nome</div>
                  <div className="col-span-2 border border-black border-transparent border-r-black px-2 pb-3">Custo</div>
                  <div className="col-span-4 border border-black border-transparent border-r-black px-2 pb-3">Teste</div>
                  <div className="col-span-1 border border-black border-transparent border-r-black px-2 pb-3">Página</div>
                </div>
                {
                  dataSheet.rituals.map((item: any, index: number) => (
                    <div key={ index } className="grid grid-cols-10 w-full">
                      <div className={`col-span-3 border pb-3 border-black px-2 py-1 ${index === dataSheet.gifts.length - 1 ? 'border-b-black' : 'border-b-transparent'}`}>{ item.titlePtBr }</div>
                      <div className={`col-span-2 border  pb-3 border-black border-transparent border-t-black border-r-black px-2 py-1 ${index === dataSheet.gifts.length - 1 && 'border-b-black'}`}></div>
                      <div className={`col-span-4 border pb-3 border-black border-transparent border-t-black border-r-black px-2 py-1 ${index === dataSheet.gifts.length - 1 && 'border-b-black'}`}>{ item.pool }</div>
                      <div className={`col-span-1 border pb-3 border-black border-transparent border-t-black border-r-black px-2 py-1 ${index === dataSheet.gifts.length - 1 && 'border-b-black'}`}>{ item.page }</div>
                    </div>
                  ))
                }
                {
                  dataSheet.gifts.map((item: any, index: number) => (
                    <div key={ index } className="grid grid-cols-10 w-full">
                      <div className={`col-span-3 border pb-3 border-black px-2 py-1 ${index === dataSheet.gifts.length - 1 ? 'border-b-black' : 'border-b-transparent'}`}>{ item.giftPtBr }</div>
                      <div className={`col-span-2 border  pb-3 border-black border-transparent border-t-black border-r-black px-2 py-1 ${index === dataSheet.gifts.length - 1 && 'border-b-black'}`}>{ item.cost }</div>
                      <div className={`col-span-4 border pb-3 border-black border-transparent border-t-black border-r-black px-2 py-1 ${index === dataSheet.gifts.length - 1 && 'border-b-black'}`}>{ item.pool }</div>
                      <div className={`col-span-1 border pb-3 border-black border-transparent border-t-black border-r-black px-2 py-1 ${index === dataSheet.gifts.length - 1 && 'border-b-black'}`}>{ item.page }</div>
                    </div>
                  ))
                }
                { returnEmptyGifts() }
              </div>
            </div>
            <div className="grid grid-cols-3 pt-2 gap-2">
              <div className="w-full">
                <p className="text-center w-full pb-3">Princípios da Crônica</p>
                <div className="px-4 py-2 h-96 border border-black"></div>
              </div>
              <div>
                <p className="text-center w-full pb-3">Pedras de Toque</p>
                <div className="h-96 border border-black">
                  <ul className="px-4 py-2">
                  {
                    dataSheet.touchstones.map((item: any, index: number) => (
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
                <div className="px-4 py-2 h-96 border border-black"></div>
              </div>
              <div className="w-full">
                <p className="text-center w-full pb-3">Notas</p>
                <div className="px-4 py-2 h-96 border border-black">{ truncateText(dataSheet.notes, 710) }</div>
              </div>
              <div className="col-span-2 w-full">
                <p className="text-center w-full pb-3">História</p>
                <div className="px-4 py-2 h-96 border border-black">{ truncateText(dataSheet.background, 1600) }</div>
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
