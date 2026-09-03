import React from 'react';
import { 
  Landmark, 
  Cpu, 
  Train, 
  Calculator, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  GraduationCap,
  Award
} from 'lucide-react';
import { ActiveScreen, AppMode } from '../../types';

interface ExamPrepFastTracksProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  setMode?: (mode: AppMode) => void;
}

export const ExamPrepFastTracks: React.FC<ExamPrepFastTracksProps> = ({
  setActiveScreen,
  setMode
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
              Exam Preparation Modules
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            Prepare for Competitive Examinations
          </h3>
        </div>
        <button
          onClick={() => setActiveScreen('course-library')}
          className="text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          <span>View All Modules</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Module 1: UPSC Civil Services */}
        <div
          onClick={() => {
            if (setMode) setMode('elite-academy');
            setActiveScreen('elite-home');
          }}
          className="bg-gradient-to-br from-indigo-950/70 via-[#0c0c18] to-purple-950/50 border border-indigo-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between h-56 hover:border-indigo-400/60 hover:shadow-indigo-950/50 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
              UPSC Civil Services (IAS/IPS)
            </h4>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              Comprehensive GS Paper I-IV, Daily Answer Writing &amp; All-India Mock Series.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
            <span>340+ Selected</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 2: GATE Engineering */}
        <div
          onClick={() => {
            if (setMode) setMode('elite-academy');
            setActiveScreen('elite-gate');
          }}
          className="bg-gradient-to-br from-purple-950/70 via-[#0c0c18] to-indigo-950/50 border border-purple-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between h-56 hover:border-purple-400/60 hover:shadow-purple-950/50 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              GATE Engineering &amp; PSUs
            </h4>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              Core Technical numerical simulators for Mechanical, CS, Electrical &amp; Civil.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-purple-400 group-hover:text-purple-300">
            <span>480+ Qualifiers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 3: Indian Railways (RRB) */}
        <div
          onClick={() => setActiveScreen('course-library')}
          className="bg-gradient-to-br from-amber-950/70 via-[#0c0c18] to-orange-950/50 border border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between h-56 hover:border-amber-400/60 hover:shadow-amber-950/50 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Train className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              Indian Railways (RRB NTPC/JE)
            </h4>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              Zonal technical coaching, stage-wise CBT simulations, and general engineering.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-amber-400 group-hover:text-amber-300">
            <span>380+ Placed</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 4: Quantitative Aptitude & Live Assessment */}
        <div
          onClick={() => setActiveScreen('mcq-assessment')}
          className="bg-gradient-to-br from-emerald-950/70 via-[#0c0c18] to-teal-950/50 border border-emerald-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between h-56 hover:border-emerald-400/60 hover:shadow-emerald-950/50 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Quantitative Aptitude &amp; CAT
            </h4>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              Fast calculation shortcuts, live timed assessments, and banking speed tests.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
            <span>420+ Selected</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
