import React from 'react';
import EditableText from './ui/EditableText';
import { ArrowUpRight } from 'lucide-react';

// Direction B — Stripe Cinematic Editorial
// Philosophy as huge editorial quote + side-by-side founder narrative
const Philosophy: React.FC = () => {
  const clementImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg";
  const alexisImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png";

  return (
    <section id="qui-sommes-nous" className="relative isolate overflow-hidden border-t border-white/[0.06] bg-[#060606] py-32">
      {/* === Ambient gradient orbs === */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div
          className="absolute -left-40 top-1/4 h-[40vw] w-[40vw] rounded-full opacity-40 blur-[140px]"
          style={{ background: 'radial-gradient(closest-side, #F472B6, transparent)' }}
        />
        <div
          className="absolute -right-40 bottom-1/4 h-[36vw] w-[36vw] rounded-full opacity-35 blur-[130px]"
          style={{ background: 'radial-gradient(closest-side, #A78BFA, transparent)' }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Editorial eyebrow */}
        <div className="mb-12 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-white/60">
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <EditableText value="Qui sommes-nous" storageKey="philo_badge" />
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        {/* Massive editorial quote */}
        <div className="mx-auto mb-24 max-w-5xl text-center">
          <h2 className="text-4xl leading-[1.05] tracking-[-0.02em] text-white md:text-6xl lg:text-7xl">
            <span className="font-playfair italic text-white/90">L'excellence technique</span>
            <br />
            <span className="font-medium">rencontre</span>{' '}
            <span className="font-playfair italic bg-gradient-to-r from-[#FFB59E] via-[#F472B6] to-[#A78BFA] bg-clip-text text-transparent">
              la stratégie business.
            </span>
          </h2>
          <p className="mt-8 mx-auto max-w-2xl text-base font-light leading-relaxed text-white/60 md:text-lg">
            Plus qu'une agence : votre pont entre la complexité des machines et la réalité de votre croissance.
          </p>
        </div>

        {/* Founders — editorial split */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          {[
            {
              img: clementImage,
              name: 'Clément Predo',
              school: 'ESSEC · Stratégie',
              quote: '« Le stratège. Je traduis la technologie en rentabilité et leviers de croissance. »',
              stat: { v: '30k+', l: 'Abonnés LinkedIn' },
              linkedin: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/',
              gradient: 'from-[#FFB59E] to-[#F472B6]',
            },
            {
              img: alexisImage,
              name: 'Alexis Zeitoun',
              school: 'Télécom Paris · Tech',
              quote: "« L'ingénieur. Je forge les systèmes et automatise l'intelligence en moteur de production. »",
              stat: { v: '10k+', l: 'Abonnés LinkedIn' },
              linkedin: 'https://www.linkedin.com/in/alexiszeitoun/',
              gradient: 'from-[#A78BFA] to-[#F472B6]',
            },
          ].map((f) => (
            <article key={f.name} className="group relative">
              <div
                className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${f.gradient} opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-30`}
                aria-hidden="true"
              />
              <div className="relative flex flex-col gap-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md md:p-10">
                <div className="flex items-start gap-6">
                  <div className={`flex-shrink-0 rounded-full bg-gradient-to-br ${f.gradient} p-[1.5px]`}>
                    <img
                      src={f.img}
                      alt={f.name}
                      className="h-20 w-20 rounded-full object-cover md:h-24 md:w-24"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-medium tracking-tight text-white md:text-4xl">
                      {f.name}
                    </h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.16em] text-white/50">
                      {f.school}
                    </p>
                  </div>
                  <a
                    href={f.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 transition-colors hover:text-white"
                    aria-label={`LinkedIn de ${f.name}`}
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </a>
                </div>

                <blockquote className="border-l-2 border-white/10 pl-6 font-playfair text-xl italic leading-relaxed text-white/85 md:text-2xl">
                  {f.quote}
                </blockquote>

                <div className="flex items-baseline gap-3 border-t border-white/[0.08] pt-6">
                  <span className={`font-playfair text-5xl italic bg-gradient-to-br ${f.gradient} bg-clip-text text-transparent md:text-6xl`}>
                    {f.stat.v}
                  </span>
                  <span className="text-xs uppercase tracking-[0.18em] text-white/50">
                    {f.stat.l}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
