import React from 'react';
import { 
  Award, 
  GraduationCap, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Building2, 
  BookOpen, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { ActiveScreen } from '../../types';

interface AcademicPresenceBannerProps {
  onScrollToAchievers: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const AcademicPresenceBanner: React.FC<AcademicPresenceBannerProps> = ({
  onScrollToAchievers,
  setActiveScreen
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0e0e24] via-[#0b0b18] to-[#161234] p-6 sm:p-8 shadow-2xl shadow-indigo-950/40">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left Column: Academic Standing & Vision */}
        <div className="max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider shadow-xs">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>National Academic Excellence Center</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>NAAC A++ & NBA Accredited</span>
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-snug">
              Academic Presence &amp; <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
                Competitive Exam Legacy
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              Empowering leaders across Civil Services (IAS/IPS), GATE Engineering &amp; PSU research, Indian Railways (RRB), and Quantitative Aptitude. Over <strong className="text-white font-bold">1,500+ passed-out students</strong> have cracked prestigious national competitive examinations with top All India Ranks.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onScrollToAchievers}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-950/60 flex items-center gap-2 transition-all active:scale-95 border border-indigo-400/40"
            >
              <Users className="w-4 h-4" />
              <span>Explore 1,500+ Exam Achievers</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveScreen('course-library')}
              className="px-4 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white text-xs sm:text-sm font-bold transition-all border border-white/15 flex items-center gap-2 active:scale-95 backdrop-blur-sm"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>View Exam Prep Catalog</span>
            </button>
          </div>
        </div>

        {/* Right Column: 4 Pillar High-Impact Academic Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto lg:min-w-[340px] shrink-0">
          {/* Card 1: 1500+ Passed Out Achievers */}
          <div className="bg-black/40 backdrop-blur-xl border border-indigo-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-indigo-400/60 transition-all shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>EXAM QUALIFIERS</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              1,500+
            </div>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Passed-Out &amp; Placed</span>
            </p>
          </div>

          {/* Card 2: UPSC & IAS Officers */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>UPSC &amp; IAS</span>
              <Building2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-200 tracking-tight">
              340+
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Class 1 Officers
            </p>
          </div>

          {/* Card 3: GATE & PSU Ranks */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>GATE &amp; PSUs</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-200 tracking-tight">
              480+
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              ISRO / BARC / IITs
            </p>
          </div>

          {/* Card 4: Railway & Aptitude */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>RAILWAY &amp; APT</span>
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-200 tracking-tight">
              810+
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              RRB &amp; Financial Ranks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
