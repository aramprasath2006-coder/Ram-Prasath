import React from 'react';
import { 
  BrainCircuit, 
  Layers, 
  Target, 
  Bot, 
  ArrowRight, 
  Sparkles, 
  Award, 
  Flame, 
  BookOpen, 
  CheckCircle2,
  TrendingUp,
  Zap
} from 'lucide-react';
import { ActiveScreen } from '../../types';

interface AdvancedLearningSuiteSectionProps {
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const AdvancedLearningSuiteSection: React.FC<AdvancedLearningSuiteSectionProps> = ({
  setActiveScreen
}) => {
  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Advanced Cognitive Accelerators
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
            Smart Learning &amp; Assessment Suite
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Engineered tools for active recall, formula mastery, readiness prediction, and 1-on-1 AI doubt solving.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            Active Recall Mode
          </span>
        </div>
      </div>

      {/* 4-Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tool 1: Flashcards */}
        <div
          onClick={() => setActiveScreen('flashcards')}
          className="bg-gradient-to-br from-[#121128] via-[#0c0c18] to-[#161230] rounded-3xl p-5 border border-indigo-500/30 hover:border-indigo-400/60 shadow-xl shadow-black/30 flex flex-col justify-between h-64 cursor-pointer group transition-all relative overflow-hidden"
        >
          {/* Subtle watermark */}
          <div className="absolute right-[-10px] top-[-10px] opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-24 h-24 text-indigo-400" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                Leitner 4-Box
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                Spaced Flashcards
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                3D flip cards with active recall rating, text-to-speech audio, and custom card creator for GATE &amp; RRB.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
            <span>Train 25+ Cards</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tool 2: Formula Vault */}
        <div
          onClick={() => setActiveScreen('formula-bank')}
          className="bg-gradient-to-br from-[#181128] via-[#0c0c18] to-[#1d1334] rounded-3xl p-5 border border-purple-500/30 hover:border-purple-400/60 shadow-xl shadow-black/30 flex flex-col justify-between h-64 cursor-pointer group transition-all relative overflow-hidden"
        >
          <div className="absolute right-[-10px] top-[-10px] opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
            <Layers className="w-24 h-24 text-purple-400" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Exam Traps &amp; Units
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                High-Yield Formula Vault
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                Curated formulas with variable breakdowns, common pitfall warnings, and printable quick revision cheat sheets.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-purple-300">
            <span>Open Formula Bank</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tool 3: Exam Readiness */}
        <div
          onClick={() => setActiveScreen('exam-readiness')}
          className="bg-gradient-to-br from-[#151430] via-[#0c0c18] to-[#121124] rounded-3xl p-5 border border-indigo-500/30 hover:border-indigo-400/60 shadow-xl shadow-black/30 flex flex-col justify-between h-64 cursor-pointer group transition-all relative overflow-hidden"
        >
          <div className="absolute right-[-10px] top-[-10px] opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
            <Target className="w-24 h-24 text-indigo-400" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                AIR Predictor
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                Exam Readiness Radar
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                Multi-parameter score diagnostic for RRB NTPC, GATE 2027 ME &amp; UPSC, with tailored 30-day sprint roadmaps.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
            <span>Check Predicted AIR</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tool 4: AI Tutor */}
        <div
          onClick={() => setActiveScreen('ai-tutor')}
          className="bg-gradient-to-br from-[#1c122e] via-[#0c0c18] to-[#120f26] rounded-3xl p-5 border border-indigo-500/30 hover:border-indigo-400/60 shadow-xl shadow-black/30 flex flex-col justify-between h-64 cursor-pointer group transition-all relative overflow-hidden"
        >
          <div className="absolute right-[-10px] top-[-10px] opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
            <Bot className="w-24 h-24 text-indigo-400" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                4 Mentors Online
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                AI Faculty Mentors
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                Consult Dr. Reed, Er. Rajesh, Ananya Sen or Prof. Vikramaditya for instant step-by-step derivations &amp; quizzes.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
            <span>Consult Mentors</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
};
