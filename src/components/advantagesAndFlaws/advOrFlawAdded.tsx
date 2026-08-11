import contexto from "@/context/context";
import { useContext } from "react";

type SectionEntry = { name: string; detail?: string; value: string };

export default function AdvOrFlawAdded(props: { type: string }) {
  const { type } = props;
  const { dataSheet } = useContext(contexto);

  const advantageTotal = dataSheet.data.advantagesAndFlaws.advantages.reduce((total: number, item: any) => total + Number(item.cost), 0)
    + dataSheet.data.advantagesAndFlaws.talens.reduce((total: number, item: any) => total + Number(item.value), 0)
    + dataSheet.data.advantagesAndFlaws.loresheets.reduce((total: number, item: any) => total + Number(item.cost), 0);
  const flawTotal = dataSheet.data.advantagesAndFlaws.flaws.reduce((total: number, item: any) => total + Number(item.cost), 0);

  const total = type === 'advantage' ? advantageTotal : flawTotal;
  const limit = type === 'advantage' ? 7 : 2;
  const totalColor = total > limit ? 'text-red-400' : total === limit ? 'text-[#77a77e]' : 'text-white/72';

  const sections: { title: string; items: SectionEntry[] }[] = type === 'advantage'
    ? [
        { title: 'Méritos e Backgrounds', items: dataSheet.data.advantagesAndFlaws.advantages.sort((a: any, b: any) => a.name.localeCompare(b.name)).map((item: any) => ({ name: item.name, detail: item.title, value: String(item.cost) })) },
        { title: 'Talismãs', items: dataSheet.data.advantagesAndFlaws.talens.sort((a: any, b: any) => a.name.localeCompare(b.name)).map((item: any) => ({ name: item.name, detail: item.type, value: String(item.value) })) },
        { title: 'Loresheets', items: dataSheet.data.advantagesAndFlaws.loresheets.sort((a: any, b: any) => a.name.localeCompare(b.name)).map((item: any) => ({ name: item.name, detail: item.skill, value: String(item.cost) })) },
      ]
    : [
        { title: 'Defeitos', items: dataSheet.data.advantagesAndFlaws.flaws.sort((a: any, b: any) => a.name.localeCompare(b.name)).map((item: any) => ({ name: item.name, detail: item.title, value: String(item.cost) })) },
      ];

  return (
    <section className="border border-white/10 bg-black/45">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="font-kingthings text-[0.82rem] uppercase tracking-[0.18em] text-white">{type === 'advantage' ? 'Vantagens Selecionadas' : 'Defeitos Selecionados'}</p>
        <p className={`mt-1 font-geist-mono text-[10px] uppercase tracking-[0.12em] ${totalColor}`}>Total {total} / {limit}</p>
      </div>
      <div className="space-y-4 px-4 py-4">
        {sections.every((section) => section.items.length === 0) ? (
          <div className="border border-white/10 bg-black/35 px-4 py-5 text-center font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/55">Nenhum item selecionado.</div>
        ) : (
          sections.map((section) => {
            if (section.items.length === 0) return null;
            return (
              <div key={section.title}>
                <div className="mb-2 border-b border-white/10 pb-2 font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55">{section.title}</div>
                <div className="space-y-2">
                  {section.items.map((item, index) => (
                    <div key={`${section.title}-${item.name}-${index}`} className="border border-white/10 bg-black/35 px-3 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-geist-mono text-[11px] uppercase tracking-[0.08em] text-white/82">{item.name}</p>
                          {item.detail && <p className="mt-1 break-words font-geist-mono text-[10px] leading-5 text-white/55">{item.detail}</p>}
                        </div>
                        <span className="shrink-0 font-geist-mono text-[10px] uppercase tracking-[0.12em] text-red-300/85">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}