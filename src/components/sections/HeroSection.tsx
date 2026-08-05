"use client";

import React, { useState, useEffect } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

const positions = [
  "left-[15%] max-[900px]:left-[5%] max-sm:-left-[15%] translate-x-0 top-[60px] w-[280px] h-[360px] -rotate-6 z-10 p-4 opacity-90 shadow-[0_20px_40px_-10px_rgba(42,37,34,0.06)] border border-border-warm rounded-2xl gap-3",
  "left-1/2 -translate-x-1/2 top-0 w-[340px] h-[460px] rotate-0 z-30 p-5 opacity-100 shadow-brutal border border-border-warm rounded-[20px] gap-4",
  "left-[85%] max-[900px]:left-[95%] max-sm:left-[115%] -translate-x-full top-[80px] w-[280px] h-[360px] rotate-6 z-10 p-4 opacity-90 shadow-[0_20px_40px_-10px_rgba(42,37,34,0.06)] border border-border-warm rounded-2xl gap-3"
];

export default function HeroSection() {
  const [cycle, setCycle] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setCycle((c) => c + 1);
    }, 3000);
    
    const tickInterval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1500);
    
    return () => {
      clearInterval(cycleInterval);
      clearInterval(tickInterval);
    };
  }, []);

  const cards = [
    {
      id: "left-card",
      content: (
        <>
          <div className="w-full h-[160px] bg-chip-yellow rounded-xl transition-all duration-500 overflow-hidden relative">
             {/* Moving block inside */}
             <div 
               className="absolute top-1/4 h-1/2 bg-white/40 rounded-lg transition-all duration-[1500ms] ease-in-out"
               style={{ 
                 left: tick % 2 === 0 ? '10%' : '30%',
                 right: tick % 2 === 0 ? '40%' : '10%'
               }} 
             />
          </div>
          <div className="h-4 bg-user-bubble rounded mt-3 transition-all duration-[1500ms]" style={{ width: tick % 3 === 0 ? '60%' : tick % 3 === 1 ? '80%' : '50%' }} />
          <div className="h-3 bg-surface-base rounded mt-2 transition-all duration-[1500ms]" style={{ width: tick % 2 === 0 ? '40%' : '65%' }} />
          <div className="h-3 bg-surface-base rounded mt-2 transition-all duration-[1500ms]" style={{ width: tick % 3 === 0 ? '90%' : '75%' }} />
        </>
      )
    },
    {
      id: "center-card",
      content: (
        <>
          <div className="w-full h-[260px] bg-highlight-green rounded-xl relative overflow-hidden transition-all duration-500">
            {/* Pulsing indicator */}
            <div className={`absolute top-4 left-4 w-3 h-3 rounded-full bg-[#e8b835] transition-opacity duration-1000 ${tick % 2 === 0 ? 'opacity-100' : 'opacity-20'}`} />
            
            {/* PIP View Floating */}
            <div 
              className="absolute w-[80px] h-[110px] bg-white rounded-lg border border-border-warm flex items-center justify-center transition-all duration-[1500ms] ease-in-out shadow-sm"
              style={{
                bottom: tick % 2 === 0 ? '16px' : '24px',
                right: '16px'
              }}
            >
              <SparklesIcon className={`w-5 h-5 text-[#e8b835] transition-all duration-1000 ${tick % 2 === 0 ? 'scale-110 rotate-12' : 'scale-90 -rotate-12'}`} />
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex flex-col items-start gap-1 w-full">
              <div className="h-4 bg-user-bubble rounded transition-all duration-[1500ms]" style={{ width: tick % 2 === 0 ? '100px' : '140px' }} />
              <div className="h-3 bg-surface-base rounded transition-all duration-[1500ms]" style={{ width: tick % 3 === 1 ? '80px' : '60px' }} />
            </div>
            <div className={`px-3 py-1.5 rounded-2xl text-xs font-medium text-dark-charcoal border border-border-warm whitespace-nowrap transition-colors duration-1000 ${tick % 2 === 0 ? 'bg-highlight-blue' : 'bg-chip-blue'}`}>
              Live
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-auto pb-2">
            <div className={`w-12 h-12 rounded-full border border-border-warm transition-all duration-[1500ms] ${tick % 3 === 0 ? 'bg-chip-pink -translate-y-2 shadow-sm' : 'bg-surface-base'}`} />
            <div className={`w-12 h-12 rounded-full border border-border-warm transition-all duration-[1500ms] ${tick % 3 === 1 ? 'bg-chip-orange -translate-y-2 shadow-sm' : 'bg-surface-base'}`} />
            <div className={`w-12 h-12 rounded-full border border-border-warm transition-all duration-[1500ms] ${tick % 3 === 2 ? 'bg-chip-green -translate-y-2 shadow-sm' : 'bg-chip-pink'}`} />
          </div>
        </>
      )
    },
    {
      id: "right-card",
      content: (
        <>
          <div className="w-full h-[160px] bg-chip-orange rounded-xl transition-all duration-500 relative overflow-hidden">
             {/* Chart bars mock */}
             <div className="absolute bottom-4 left-4 flex gap-2 items-end h-[100px]">
               <div className="w-6 bg-white/50 rounded-t-sm transition-all duration-[1500ms]" style={{ height: tick % 3 === 0 ? '40%' : '60%' }} />
               <div className="w-6 bg-white/60 rounded-t-sm transition-all duration-[1500ms]" style={{ height: tick % 2 === 0 ? '70%' : '40%' }} />
               <div className="w-6 bg-white/70 rounded-t-sm transition-all duration-[1500ms]" style={{ height: tick % 3 === 1 ? '50%' : '90%' }} />
               <div className="w-6 bg-white/80 rounded-t-sm transition-all duration-[1500ms]" style={{ height: tick % 2 === 1 ? '80%' : '50%' }} />
             </div>
          </div>
          <div className="h-4 bg-user-bubble rounded mt-3 transition-all duration-[1500ms]" style={{ width: tick % 2 === 0 ? '80%' : '65%' }} />
          <div className="h-3 bg-surface-base rounded mt-2 transition-all duration-[1500ms]" style={{ width: tick % 3 === 0 ? '60%' : '45%' }} />
          <div className="w-full h-10 bg-surface-base rounded-lg mt-auto flex items-center px-3 gap-2">
            <div className={`w-4 h-4 rounded-full transition-colors duration-1000 ${tick % 2 === 0 ? 'bg-chip-green' : 'bg-border-warm'}`} />
            <div className="h-2 bg-border-warm rounded flex-1 transition-all duration-[1500ms]" style={{ width: tick % 2 === 0 ? '100%' : '70%' }} />
          </div>
        </>
      )
    }
  ];
  return (
    <section
      id="hero"
      className="pt-[160px] max-md:pt-[100px] relative overflow-hidden bg-surface-base text-center"
      style={{
        backgroundImage: "linear-gradient(to bottom, transparent 0%, var(--color-surface-base) 80%, var(--color-surface-base) 100%), url('/images/hero_bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      {/* Subtle radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(217,235,249,0.45)_0%,transparent_65%)] pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Massive Headline */}
        <h1 className="font-heading text-[clamp(65px,11vw,180px)] font-bold text-dark-charcoal leading-[0.85] tracking-[-0.01em] mb-10 z-20">
          LEARNING THAT<br />
          FEELS <em className="animated-highlight font-signature capitalize font-normal tracking-normal text-[0.8em] ml-2">personal</em>.
        </h1>

        {/* Cascading Cards Container */}
        <div className="relative w-full h-[460px] mt-4 mb-6 transform scale-100 max-[900px]:scale-[0.8] max-sm:scale-[0.55] max-sm:-mt-[100px] max-sm:-mb-[80px]">
          {cards.map((card, idx) => {
            const posIndex = (idx + cycle) % 3;
            const posClass = positions[posIndex];
            
            return (
              <div
                key={card.id}
                className={`absolute bg-white flex flex-col transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${posClass}`}
              >
                {card.content}
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
