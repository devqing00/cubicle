"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";

interface LanguageData {
  id: string;
  code: string;
  flag: string;
  name: string;
  tag: string;
  level: string;
  intensity: string;
  headline: string;
  detail: string;
  image: string;
  topics: string[];
  phoneticPhrase: string;
  phoneticIpa: string;
  phoneticTip: string;
  commonPitfall: {
    wrong: string;
    right: string;
    explanation: string;
  };
  milestones: {
    timeline: string;
    target: string;
  }[];
}

const languages: LanguageData[] = [
  {
    id: "es",
    code: "01",
    flag: "🇪🇸",
    name: "Spanish Conversational & DELE",
    tag: "Most Popular",
    level: "A1 – C1 Focus",
    intensity: "30 or 60 min",
    headline: "Rolling R sounds, subjunctive moods & workplace fluency",
    detail: "Master everyday Madrid cafe dialogues, past tenses (pretérito vs imperfecto), and official DELE oral examinations.",
    image: "/images/tracks/spanish.jpg",
    topics: ["Subjunctive Mood", "DELE Oral Mock", "Castilian vs LatAm Idioms"],
    phoneticPhrase: "¿Nos pone dos cafés con leche, por favor?",
    phoneticIpa: "[nos ˈpone ðos kaˈfes kõn ˈlet͡ʃe, poɾ faˈβoɾ]",
    phoneticTip: "Castilian rolled 'rr' + soft intervocalic 'd' (pronounced almost like 'th' in 'this').",
    commonPitfall: {
      wrong: "Yo sabo la respuesta / Tengo calor de mi cuerpo",
      right: "Yo sé la respuesta / Hace mucho calor",
      explanation: "Saber has an irregular first-person ('yo sé'). In Spanish, ambient temperature uses 'hace'.",
    },
    milestones: [
      { timeline: "Weeks 1–3", target: "Street fluency, ordering, & asking directions without hesitation" },
      { timeline: "Weeks 4–7", target: "Effortless past tense switching (Pretérito vs Imperfecto)" },
      { timeline: "Weeks 8–12", target: "DELE B2 oral certification benchmark pass" },
    ],
  },
  {
    id: "fr",
    code: "02",
    flag: "🇫🇷",
    name: "French TEF & Express Entry",
    tag: "Express Entry",
    level: "B1 – B2 Target",
    intensity: "60 or 90 min",
    headline: "Immigration interview simulations & past tense mastery",
    detail: "Tailored for Canadian Express Entry candidates targeting CLB 7+ oral benchmarks, formal letter responses, and rapid conversation.",
    image: "/images/tracks/french.jpg",
    topics: ["TEF Section A & B", "Subjonctif & Passé Composé", "Express Entry Oral"],
    phoneticPhrase: "Un croissant chaud et une carafe d'eau, s'il vous plaît.",
    phoneticIpa: "[œ̃ kʁwa.sɑ̃ ʃo e yn ka.ʁaf do sil vu plɛ]",
    phoneticTip: "Clean nasal vowel /œ̃/ followed by the Parisian uvular fricative /ʁ/ in the throat.",
    commonPitfall: {
      wrong: "Je suis excité pour la classe / Visiter mes amis",
      right: "J'ai hâte de commencer / Rendre visite à mes amis",
      explanation: "False friends! 'Excité' has sensual connotations in French; use 'j'ai hâte'. For people, always use 'rendre visite à'.",
    },
    milestones: [
      { timeline: "Weeks 1–3", target: "Spontaneous French pleasantries & train station navigation" },
      { timeline: "Weeks 4–7", target: "Passé composé vs Imparfait instinctual separation" },
      { timeline: "Weeks 8–12", target: "TEF Canada CLB 7+ immigration oral exam pass" },
    ],
  },
  {
    id: "de",
    code: "03",
    flag: "🇩🇪",
    name: "German Goethe-Zertifikat Prep",
    tag: "Goethe Prep",
    level: "A1 – B2 Focus",
    intensity: "60 or 90 min",
    headline: "Grammar breakdown, case systems & confident speaking",
    detail: "Demystify the four German cases (Nominativ, Akkusativ, Dativ, Genitiv), separable prefix verbs, and fluid TeKaMoLo sentence structures.",
    image: "/images/tracks/german.jpg",
    topics: ["Case Systems & Endings", "Sprechen Prüfung", "Sentence Structure (TeKaMoLo)"],
    phoneticPhrase: "Könnten Sie das bitte noch einmal wiederholen?",
    phoneticIpa: "[ˈkœntn̩ ziː das ˈbɪtə nɔx ˈaɪ̯nmaːl viːdɐˈhoːlən]",
    phoneticTip: "Polite Konjunktiv II with rounded front vowel /œ/ and clear glottal stops before vowels.",
    commonPitfall: {
      wrong: "Ich bin heiß / Ich will nicht heute kommen",
      right: "Mir ist heiß / Ich will heute nicht kommen",
      explanation: "'Ich bin heiß' is an embarrassing faux pas meaning 'I am horny'; use dative 'Mir ist heiß'. German word order places time before negation.",
    },
    milestones: [
      { timeline: "Weeks 1–3", target: "Everyday Berlin interactions, cafe orders, & numbers" },
      { timeline: "Weeks 4–7", target: "Nominativ, Akkusativ, & Dativ preposition mastery" },
      { timeline: "Weeks 8–12", target: "Goethe-Zertifikat B1/B2 speaking score" },
    ],
  },
  {
    id: "en",
    code: "04",
    flag: "🇬🇧",
    name: "Executive Business English",
    tag: "Executive Track",
    level: "All Levels",
    intensity: "60 min",
    headline: "Global boardroom presentations, accent clarity & idioms",
    detail: "Tailored for international founders, engineers, and corporate leaders delivering high-stakes pitches, negotiations, and shareholder reports.",
    image: "/images/tracks/english.jpg",
    topics: ["Executive Presentations", "Accent Neutralization", "Boardroom Debates"],
    phoneticPhrase: "Let's touch base to align our quarterly roadmap.",
    phoneticIpa: "[lɛts tʌtʃ beɪs tu əˈlaɪn ˈaʊər ˈkwɔrtərli ˈroʊdˌmæp]",
    phoneticTip: "Cadenced boardroom rhythm with clean stop consonants (p, t, k) and natural phrase linking.",
    commonPitfall: {
      wrong: "I will revert back to you / Explain me the slide",
      right: "I'll follow up with you / Explain the slide to me",
      explanation: "'Revert back' is redundant; use 'follow up'. 'Explain' requires the preposition 'to' with indirect objects.",
    },
    milestones: [
      { timeline: "Weeks 1–3", target: "Eliminating filler pauses (uh, um, like) during updates" },
      { timeline: "Weeks 4–7", target: "Executive storytelling & objection handling" },
      { timeline: "Weeks 8–12", target: "High-stakes boardroom pitches & debate leadership" },
    ],
  },
];

export default function LanguageStudio() {
  const [activeId, setActiveId] = useState<string>("es");
  const [isPlayingPhonetics, setIsPlayingPhonetics] = useState(false);
  const [waveBars, setWaveBars] = useState<number[]>([12, 28, 45, 20, 36, 18, 50, 32, 24, 40, 16, 30]);

  const activeLang = languages.find((l) => l.id === activeId) || languages[0];

  useEffect(() => {
    if (!isPlayingPhonetics) return;
    const interval = setInterval(() => {
      setWaveBars((prev) => prev.map(() => Math.floor(Math.random() * 38) + 10));
    }, 110);
    return () => clearInterval(interval);
  }, [isPlayingPhonetics]);

  return (
    <div className="w-full space-y-8">
      {/* Language Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {languages.map((l) => {
          const isActive = l.id === activeId;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => {
                setActiveId(l.id);
                setIsPlayingPhonetics(false);
              }}
              className={`tactile-btn px-4 sm:px-5 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2.5 border ${
                isActive
                  ? "bg-text-primary text-white border-text-primary shadow-md scale-[1.02]"
                  : "bg-white text-text-secondary border-border-light hover:text-text-primary hover:border-border-subtle"
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <span className="font-heading">{l.name.split(" ")[0]}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-surface-muted text-text-subtle"
                }`}
              >
                {l.level.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Photographic Track Hero Card */}
        <div className="lg:col-span-5 tactile-card-dark rounded-[32px] overflow-hidden relative p-8 sm:p-10 flex flex-col justify-between border border-white/10 shadow-xl min-h-[460px]">
          {/* Photographic Atmosphere */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <Image
              src={activeLang.image}
              alt={activeLang.name}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center opacity-30 transition-all duration-700 ease-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/85 to-transparent" />
          </div>

          {/* Header Metadata */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-mono text-xs font-bold text-accent-blue bg-accent-blue/15 px-3 py-1 rounded-full border border-accent-blue/30">
                ({activeLang.code}) {activeLang.level}
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {activeLang.tag}
              </span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              {activeLang.name}
            </h3>

            <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {activeLang.detail}
            </p>

            {/* Topic Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {activeLang.topics.map((topic, i) => (
                <span
                  key={i}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-slate-200"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Card Action */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <HugeIcon name="video" size={15} className="text-emerald-400" />
              <span>Google Meet 1-on-1 • {activeLang.intensity}</span>
            </div>

            <Link
              href="/signup?redirect=/dashboard/book"
              className="tactile-btn btn-tactile-primary px-5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-2"
            >
              <span>Book Trial Class</span>
              <HugeIcon name="arrow-right" size={14} />
            </Link>
          </div>
        </div>

        {/* Right Column: Live Interactive Pronunciation & Nuance Sandbox */}
        <div className="lg:col-span-7 bg-white border border-border-light rounded-[32px] p-6 sm:p-10 shadow-sm flex flex-col justify-between space-y-6">
          
          {/* Module 1: Interactive Pronunciation Trainer */}
          <div className="p-6 rounded-2xl bg-surface-near-white border border-border-light space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent-blue">
                Phonetic & Audio Sandbox
              </span>
              <button
                type="button"
                onClick={() => setIsPlayingPhonetics(!isPlayingPhonetics)}
                className={`tactile-btn px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                  isPlayingPhonetics
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-text-primary text-white hover:bg-slate-800"
                }`}
              >
                <HugeIcon name={isPlayingPhonetics ? "pause" : "sparkles"} size={14} />
                <span>{isPlayingPhonetics ? "Pause Stream" : "Hear Native Cadence"}</span>
              </button>
            </div>

            <div>
              <p className="font-heading text-lg sm:text-xl font-bold text-text-primary">
                &ldquo;{activeLang.phoneticPhrase}&rdquo;
              </p>
              <p className="font-mono text-xs text-text-secondary mt-1">
                IPA: {activeLang.phoneticIpa}
              </p>
            </div>

            {/* Dynamic Sound Wave Bars */}
            <div className="h-10 bg-white border border-border-light rounded-xl px-4 flex items-center justify-between gap-1 shadow-2xs">
              <span className="text-[10px] font-mono text-text-subtle">WAT Audio Stream</span>
              <div className="flex items-center gap-1.5 h-6">
                {waveBars.map((height, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 bg-gradient-to-t from-accent-blue to-emerald-500 rounded-full transition-all duration-100 ease-out"
                    style={{ height: `${isPlayingPhonetics ? height : 6}px` }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                {isPlayingPhonetics ? "Active (128 kbps)" : "Standby"}
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed font-body">
              <strong className="text-text-primary">Tutor Note:</strong> {activeLang.phoneticTip}
            </p>
          </div>

          {/* Module 2: The Fluency Shift (Mistake vs Native Way) */}
          <div className="p-6 rounded-2xl bg-surface-near-white border border-border-light space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-subtle">
              The Fluency Shift • Trap vs. Native
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-rose-700 flex items-center gap-1">
                  <span>✕</span> Common Learner Trap
                </span>
                <p className="font-body text-xs text-rose-950 font-medium">
                  {activeLang.commonPitfall.wrong}
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 flex items-center gap-1">
                  <span>✓</span> Fluent Native Phrasing
                </span>
                <p className="font-body text-xs text-emerald-950 font-semibold">
                  {activeLang.commonPitfall.right}
                </p>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed font-normal pt-1">
              <strong className="text-text-primary">Why:</strong> {activeLang.commonPitfall.explanation}
            </p>
          </div>

          {/* Module 3: 12-Week Milestone Progression */}
          <div className="p-4 rounded-2xl bg-surface-muted/50 border border-border-light">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-subtle block mb-3">
              12-Week Progression Milestones
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeLang.milestones.map((m, i) => (
                <div key={i} className="p-3 bg-white border border-border-light rounded-xl space-y-1 shadow-2xs">
                  <span className="text-[10px] font-mono font-bold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-full inline-block">
                    {m.timeline}
                  </span>
                  <p className="text-xs text-text-primary font-medium leading-snug">
                    {m.target}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
