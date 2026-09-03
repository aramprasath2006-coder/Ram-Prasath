import React from 'react';
import { 
  Landmark, 
  Cpu, 
  Train, 
  Calculator, 
  Shield, 
  Award, 
  CheckCircle2, 
  X, 
  TrendingUp, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  FileCheck,
  Users,
  Target,
  BarChart3
} from 'lucide-react';
import { CompetitiveExamCategoryCardData } from '../../data/mockAcademicAchievers';
import { ActiveScreen, AppMode } from '../../types';

interface CompetitiveExamCategoryModalProps {
  category: CompetitiveExamCategoryCardData | null;
  isOpen: boolean;
  onClose: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
  setMode?: (mode: AppMode) => void;
}

export const CompetitiveExamCategoryModal: React.FC<CompetitiveExamCategoryModalProps> = ({
  category,
  isOpen,
  onClose,
  setActiveScreen,
  setMode
}) => {
  if (!isOpen || !category) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'landmark': return <Landmark className="w-6 h-6" />;
      case 'cpu': return <Cpu className="w-6 h-6" />;
      case 'train': return <Train className="w-6 h-6" />;
      case 'calculator': return <Calculator className="w-6 h-6" />;
      case 'shield': return <Shield className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  const handleStartPrep = () => {
    onClose();
    if (category.category === 'UPSC_IAS') {
      if (setMode) setMode('elite-academy');
      setActiveScreen('elite-home');
    } else if (category.category === 'GATE_ENG') {
      if (setMode) setMode('elite-academy');
      setActiveScreen('elite-gate');
    } else if (category.category === 'APTITUDE_BANKING') {
      setActiveScreen('mcq-assessment');
    } else {
      setActiveScreen('course-library');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c0c1a] border border-indigo-500/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-indigo-950/80 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-[#0c0c1a] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg border border-indigo-400/30">
              {renderIcon(category.iconName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">{category.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {category.successPercentage}% Success Rate
                </span>
              </div>
              <p className="text-xs text-indigo-300 font-medium">{category.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Success & Performance Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-slate-400 font-medium">Success Rate</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 font-mono">
                {category.successPercentage}%
              </div>
              <span className="text-[10px] text-emerald-300 font-bold">{category.trendGrowth}</span>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-slate-400 font-medium">Verified Qualifiers</span>
              <div className="text-xl sm:text-2xl font-black text-white mt-1 font-mono">
                {category.qualifiersCount}+
              </div>
              <span className="text-[10px] text-indigo-300 font-medium">Passed-Out Alumni</span>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-slate-400 font-medium">Top Merit Rank</span>
              <div className="text-sm sm:text-base font-black text-amber-300 mt-1.5 font-mono line-clamp-1">
                {category.topRank.split(' ')[0]} {category.topRank.split(' ')[1] || ''}
              </div>
              <span className="text-[10px] text-amber-400 font-medium">All India Rank</span>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-slate-400 font-medium">Test Materials</span>
              <div className="text-xl sm:text-2xl font-black text-indigo-400 mt-1 font-mono">
                {category.mockTestsCount}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Full Mock CBTs</span>
            </div>
          </div>

          {/* Detailed Syllabus Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Comprehensive Exam Syllabus &amp; Overview</span>
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-black/30 border border-white/10 rounded-2xl p-4">
              {category.detailedDescription}
            </p>
          </div>

          {/* Key Subject Modules Mastered */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Core Examination Subjects &amp; High-Yield Modules</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {category.keySubjects.map((sub, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="font-semibold">{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Government Posts & Designations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>Target Appointments &amp; Career Trajectories</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {category.targetRoles.map((role, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Structured curriculum aligned with 2026 examination pattern</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleStartPrep}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Launch Preparation Track</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
