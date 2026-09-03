import React, { useState } from 'react';
import { 
  Landmark, 
  Cpu, 
  Train, 
  Calculator, 
  Shield, 
  Award, 
  TrendingUp, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  ChevronRight,
  Info,
  Flame,
  Target
} from 'lucide-react';
import { 
  COMPETITIVE_EXAM_CATEGORY_LIST, 
  CompetitiveExamCategoryCardData 
} from '../../data/mockAcademicAchievers';
import { CompetitiveExamCategoryModal } from './CompetitiveExamCategoryModal';
import { ActiveScreen, AppMode } from '../../types';

interface CompetitiveExamCategoriesGridProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  setMode?: (mode: AppMode) => void;
  onScrollToAchievers?: () => void;
}

export const CompetitiveExamCategoriesGrid: React.FC<CompetitiveExamCategoriesGridProps> = ({
  setActiveScreen,
  setMode,
  onScrollToAchievers
}) => {
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<CompetitiveExamCategoryCardData | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CIVIL' | 'TECH' | 'FINANCE'>('ALL');

  const filteredCategories = COMPETITIVE_EXAM_CATEGORY_LIST.filter(item => {
    if (activeFilter === 'CIVIL') return item.category === 'UPSC_IAS' || item.category === 'STATE_PSC' || item.category === 'SSC_GOVT';
    if (activeFilter === 'TECH') return item.category === 'GATE_ENG' || item.category === 'RAILWAY_RRB';
    if (activeFilter === 'FINANCE') return item.category === 'APTITUDE_BANKING';
    return true;
  });

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'landmark': return <Landmark className="w-5 h-5" />;
      case 'cpu': return <Cpu className="w-5 h-5" />;
      case 'train': return <Train className="w-5 h-5" />;
      case 'calculator': return <Calculator className="w-5 h-5" />;
      case 'shield': return <Shield className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const getThemeStyles = (color: string) => {
    switch (color) {
      case 'indigo':
        return {
          gradient: 'from-indigo-950/70 via-[#0c0c18] to-purple-950/40',
          border: 'border-indigo-500/30 hover:border-indigo-400/60',
          iconBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          accentText: 'text-indigo-400',
          progressBg: 'bg-gradient-to-r from-indigo-500 to-purple-500',
          badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
        };
      case 'purple':
        return {
          gradient: 'from-purple-950/70 via-[#0c0c18] to-pink-950/40',
          border: 'border-purple-500/30 hover:border-purple-400/60',
          iconBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          accentText: 'text-purple-400',
          progressBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
          badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
        };
      case 'amber':
        return {
          gradient: 'from-amber-950/70 via-[#0c0c18] to-orange-950/40',
          border: 'border-amber-500/30 hover:border-amber-400/60',
          iconBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          accentText: 'text-amber-400',
          progressBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        };
      case 'emerald':
        return {
          gradient: 'from-emerald-950/70 via-[#0c0c18] to-teal-950/40',
          border: 'border-emerald-500/30 hover:border-emerald-400/60',
          iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          accentText: 'text-emerald-400',
          progressBg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        };
      case 'rose':
        return {
          gradient: 'from-rose-950/70 via-[#0c0c18] to-pink-950/40',
          border: 'border-rose-500/30 hover:border-rose-400/60',
          iconBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          accentText: 'text-rose-400',
          progressBg: 'bg-gradient-to-r from-rose-500 to-pink-500',
          badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
        };
      default:
        return {
          gradient: 'from-cyan-950/70 via-[#0c0c18] to-blue-950/40',
          border: 'border-cyan-500/30 hover:border-cyan-400/60',
          iconBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          accentText: 'text-cyan-400',
          progressBg: 'bg-gradient-to-r from-cyan-500 to-blue-500',
          badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
        };
    }
  };

  const handleCardClick = (cat: CompetitiveExamCategoryCardData) => {
    setSelectedCategoryForModal(cat);
  };

  const handleStartPrep = (cat: CompetitiveExamCategoryCardData, e: React.MouseEvent) => {
    e.stopPropagation();
    if (cat.category === 'UPSC_IAS') {
      if (setMode) setMode('elite-academy');
      setActiveScreen('elite-home');
    } else if (cat.category === 'GATE_ENG') {
      if (setMode) setMode('elite-academy');
      setActiveScreen('elite-gate');
    } else if (cat.category === 'APTITUDE_BANKING') {
      setActiveScreen('mcq-assessment');
    } else {
      setActiveScreen('course-library');
    }
  };

  return (
    <div id="competitive-exam-categories-section" className="flex flex-col gap-6 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
              Exam Vertical Matrix &amp; Performance Metrics
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Competitive Exam Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Explore dedicated coaching tracks with institutional success rates, syllabus modules, and verified qualifiers across national examinations.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto bg-black/40 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Exams ({COMPETITIVE_EXAM_CATEGORY_LIST.length})
          </button>
          <button
            onClick={() => setActiveFilter('CIVIL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'CIVIL'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Civil &amp; Govt
          </button>
          <button
            onClick={() => setActiveFilter('TECH')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'TECH'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            GATE &amp; Railways
          </button>
          <button
            onClick={() => setActiveFilter('FINANCE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'FINANCE'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aptitude &amp; Banking
          </button>
        </div>
      </div>

      {/* Responsive Grid of Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((item) => {
          const theme = getThemeStyles(item.themeColor);

          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-3xl p-5 sm:p-6 shadow-xl shadow-black/20 flex flex-col justify-between gap-5 transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden`}
            >
              {/* Subtle top indicator */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${theme.progressBg}`} />

              {/* Card Header & Title */}
              <div className="space-y-3.5 pt-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl ${theme.iconBg} border flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                      {renderIcon(item.iconName)}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">{item.subtitle}</p>
                    </div>
                  </div>

                  {/* Top Rank Badge */}
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border font-mono shrink-0 ${theme.badge}`}>
                    {item.topRank.split(' ')[0]} {item.topRank.split(' ')[1] || ''}
                  </span>
                </div>

                {/* Short Description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {item.shortDescription}
                </p>

                {/* Success Percentage & Progress Bar */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-300">Exam Success Rate</span>
                    </div>
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-lg font-black text-emerald-300">{item.successPercentage}%</span>
                      <span className="text-[10px] text-emerald-400 font-bold">{item.trendGrowth}</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${theme.progressBg} rounded-full transition-all duration-700`}
                      style={{ width: `${item.successPercentage}%` }}
                    />
                  </div>

                  {/* Metric Chips */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-medium">
                    <span><strong>{item.qualifiersCount}+</strong> Qualifiers</span>
                    <span><strong>{item.activeModulesCount}</strong> Modules</span>
                    <span><strong>{item.mockTestsCount}</strong> Mock CBTs</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(item);
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Syllabus &amp; Stats</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleStartPrep(item, e)}
                  className={`px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1 group-hover:border-indigo-400/40`}
                >
                  <span>Start Prep</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-300 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Category Details Modal */}
      <CompetitiveExamCategoryModal
        category={selectedCategoryForModal}
        isOpen={!!selectedCategoryForModal}
        onClose={() => setSelectedCategoryForModal(null)}
        setActiveScreen={setActiveScreen}
        setMode={setMode}
      />
    </div>
  );
};
