"use client";

import React, { useState } from "react";
import Link from "next/link";
import HugeIcon from "@/components/ui/HugeIcon";

interface Subject {
  id: string;
  name: string;
  nativeName: string;
  flagEmoji: string;
  level: string;
  description: string;
  popularFor: string;
  curriculum: string[];
}

const SUBJECTS: Subject[] = [
  {
    id: "spanish",
    name: "Spanish",
    nativeName: "Español",
    flagEmoji: "🇪🇸",
    level: "A1 to C2 • Conversational & DELE Prep",
    description: "Master grammar fundamentals, practical everyday conversation, Latin American idioms, and professional business Spanish.",
    popularFor: "Travel, Relocation, Business, DELE Exam",
    curriculum: ["Pronunciation & Ser vs Estar", "Past Tenses (Pretérito & Imperfecto)", "Subjunctive Mood Mastery", "Real-World Native Dialogue"],
  },
  {
    id: "french",
    name: "French",
    nativeName: "Français",
    flagEmoji: "🇫🇷",
    level: "A1 to C1 • DELF/DALF & TEF Canada",
    description: "Develop authentic Parisian pronunciation, conversational fluency, and rigorous preparation for immigration TEF/DELF exams.",
    popularFor: "TEF Canada Immigration, Diplomacy, Academics",
    curriculum: ["French Phonetics & Nasal Vowels", "Passé Composé & Imparfait", "Conditional & Formal Etiquette", "TEF Exam Speaking Drills"],
  },
  {
    id: "english",
    name: "Business & Academic English",
    nativeName: "English",
    flagEmoji: "🇬🇧",
    level: "B1 to C2 • IELTS, TOEFL & Executive",
    description: "Refine executive presentation skills, corporate communication, accent neutralization, and score 8.0+ on IELTS Academic.",
    popularFor: "Executive Interviews, IELTS, University Admissions",
    curriculum: ["High-Impact Business Vocabulary", "Accent & Intonation Polish", "IELTS Task 2 & Speaking Part 3", "Negotiation & Persuasion"],
  },
  {
    id: "german",
    name: "German",
    nativeName: "Deutsch",
    flagEmoji: "🇩🇪",
    level: "A1 to B2 • Goethe-Zertifikat & Work",
    description: "Break down German noun genders, case systems (Akkusativ/Dativ), and conversational fluency for working in DACH regions.",
    popularFor: "Study in Germany, Blue Card, Goethe Exam",
    curriculum: ["Articles (Der, Die, Das) & Cases", "Modal Verbs & Word Order (TeKaMoLo)", "Professional Workplace German", "Goethe Speaking Simulation"],
  },
  {
    id: "mandarin",
    name: "Mandarin Chinese",
    nativeName: "普通话 (Pǔtōnghuà)",
    flagEmoji: "🇨🇳",
    level: "HSK 1 to 4 • Tones & Business",
    description: "Gain confidence in the 4 tonal inflections, Pinyin phonetics, essential Hanzi radicals, and modern commercial Mandarin.",
    popularFor: "Trade, Global Business, HSK Certification",
    curriculum: ["The 4 Tones & Pinyin Fluency", "Essential Sentence Structures (SVO+Time)", "Commerce & Trade Vocabulary", "HSK Practice Modules"],
  }
];

export default function SubjectsPage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  return (
    <div className="space-y-8 font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Language Learning Catalog
          </h1>
          <p className="font-body text-xs sm:text-sm text-text-secondary mt-1">
            Explore 1-on-1 personalized language tracks tailored to your career and personal goals.
          </p>
        </div>

        <Link
          href="/dashboard/book"
          className="tactile-btn btn-tactile-dark px-6 py-3 rounded-full font-body text-xs font-semibold self-start md:self-auto"
        >
          Book 1-on-1 Session
        </Link>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBJECTS.map((subject) => (
          <div
            key={subject.id}
            className="tactile-card p-7 rounded-[28px] flex flex-col justify-between hover:border-accent-blue/40 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{subject.flagEmoji}</span>
                <span className="text-[11px] font-semibold text-text-secondary">
                  {subject.level.split("•")[0].trim()}
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-text-primary group-hover:text-accent-blue transition-colors">
                {subject.name}
              </h3>
              <p className="font-heading text-xs font-semibold text-text-subtle mb-3">
                {subject.nativeName}
              </p>

              <p className="font-body text-xs text-text-secondary leading-relaxed mb-6">
                {subject.description}
              </p>

              {/* Curriculum Highlights */}
              <div className="space-y-1.5 pt-4 border-t border-border-light mb-6">
                <p className="font-heading text-[11px] font-bold text-text-primary uppercase tracking-wider">
                  Curriculum Highlights
                </p>
                {subject.curriculum.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                    <HugeIcon name="check" size={12} className="text-accent-blue shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/dashboard/book"
              className="tactile-btn btn-tactile-secondary w-full py-3 rounded-full text-xs font-heading font-bold flex items-center justify-center gap-2"
            >
              <span>Schedule {subject.name}</span>
              <HugeIcon name="arrow-right" size={14} />
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
