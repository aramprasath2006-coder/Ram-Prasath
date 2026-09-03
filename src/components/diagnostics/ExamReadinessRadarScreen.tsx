import React, { useState } from 'react';
import { 
  BarChart3, 
  ArrowLeft, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Award, 
  ChevronRight, 
  RefreshCw, 
  BrainCircuit, 
  BookOpen, 
  Layers,
  Flame,
  ShieldAlert,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveScreen, ExamDiagnostic } from '../../types';
import { INITIAL_DIAGNOSTICS } from '../../data/mockDiagnostics';

interface ExamReadinessRadarScreenProps {
  onBack: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const ExamReadinessRadarScreen: React.FC<ExamReadinessRadarScreenProps> = ({
  onBack,
  setActiveScreen
}) => {
  const [selectedExamKey, setSelectedExamKey] = useState<string>('rrb-ntpc');
  const [diagnostics, setDiagnostics] = useState<Record<string, ExamDiagnostic>>(INITIAL_DIAGNOSTICS);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const currentDiagnostic = diagnostics[selectedExamKey] || diagnostics['rrb-ntpc'];

  // Handle re-calculation simulation
  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setDiagnostics((prev) => {
        const curr = prev[selectedExamKey];
        const boost = Math.min(99, curr.overallReadinessPct + 2);
        const scoreBoost = Math.min(curr.totalPossibleScore, Number((curr.predictedScore + 1.5).toFixed(1)));
        const percentileBoost = Math.min(99.4, Number((curr.predictedPercentile + 0.6).toFixed(1)));

        return {
          ...prev,
          [selectedExamKey]: {
            ...curr,
            overallReadinessPct: boost,
            predictedScore: scoreBoost,
            predictedPercentile: percentileBoost
          }
        };
      });
      setIsRecalculating(false);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 900);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6 pb-28 md:pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c0c18]/80 p-5 rounded-3xl border border-white/10 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-slate-200 transition-colors shrink-0"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Target className="w-3 h-3 text-indigo-400" />
                AI Diagnostic Engine
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                Live Readiness Model
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Exam Readiness &amp; Score Predictor
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Multi-parameter diagnostic analyzing mock tests, flashcard recall, and accuracy benchmarks.
            </p>
          </div>
        </div>

        {/* Recalculate Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-md shadow-indigo-950/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{isRecalculating ? 'Analyzing Telemetry...' : 'Recalculate Score'}</span>
          </button>
        </div>
      </div>

      {/* Target Exam Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { key: 'rrb-ntpc', title: 'RRB NTPC (Railway)' },
          { key: 'gate-me', title: 'GATE 2027 Mechanical' },
          { key: 'upsc-cse', title: 'UPSC Civil Services' }
        ].map((exam) => (
          <button
            key={exam.key}
            onClick={() => setSelectedExamKey(exam.key)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border whitespace-nowrap ${
              selectedExamKey === exam.key
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/50 shadow-md shadow-indigo-950/30'
                : 'bg-[#0c0c18]/60 text-slate-400 hover:text-white hover:bg-white/[0.06] border-white/5'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-indigo-300" />
            <span>{exam.title}</span>
          </button>
        ))}
      </div>

      {/* Primary Diagnostic Bento Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Score & Readiness Gauge */}
        <div className="bg-gradient-to-br from-[#12102e] to-[#0c0c18] rounded-3xl p-6 border border-indigo-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
                Target Benchmark
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" />
                {currentDiagnostic.daysLeft} Days to Exam
              </span>
            </div>

            <h2 className="text-xl font-black text-white leading-tight">
              {currentDiagnostic.examName}
            </h2>
            <p className="text-xs text-slate-400 mt-1">Scheduled Date: {currentDiagnostic.targetDate}</p>

            {/* Circular / Large Metric */}
            <div className="my-6 p-5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">Overall Readiness</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{currentDiagnostic.overallReadinessPct}%</span>
                  <span className="text-xs font-bold text-emerald-400">+3.4% this week</span>
                </div>
                <div className="text-[11px] text-indigo-300 mt-1">
                  Readiness Index: High Probability of Qualifying
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 block mb-1">Predicted Score</span>
                <span className="text-2xl font-black text-amber-300">
                  {currentDiagnostic.predictedScore} <span className="text-xs text-slate-400">/ {currentDiagnostic.totalPossibleScore}</span>
                </span>
                <div className="text-[11px] font-bold text-indigo-400 mt-1">
                  {currentDiagnostic.predictedPercentile}th Percentile
                </div>
              </div>
            </div>

            {/* Micro Badges */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400 block text-[10px]">Predicted Cutoff</span>
                <span className="font-bold text-emerald-400">Safe Clearance (+12)</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400 block text-[10px]">Recommended Mock</span>
                <span className="font-bold text-indigo-300">CBT Simulator 4</span>
              </div>
            </div>
          </div>

          {/* Quick Jump Buttons */}
          <div className="pt-6 border-t border-white/10 flex items-center gap-2 relative z-10">
            <button
              onClick={() => setActiveScreen('flashcards')}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Train Flashcards</span>
            </button>
            <button
              onClick={() => setActiveScreen('formula-bank')}
              className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-white/10"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Review Formulas</span>
            </button>
          </div>
        </div>

        {/* Center & Right: Sectional Diagnostic Breakdown */}
        <div className="lg:col-span-2 bg-[#0c0c18]/90 rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Sectional Strength &amp; Weakness Diagnostic</h3>
              </div>
              <span className="text-xs text-slate-400">Weighted by Exam Blueprint</span>
            </div>

            <div className="space-y-4">
              {currentDiagnostic.categoryScores.map((cat, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{cat.category}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">({cat.weightPct}% Weight)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        cat.status === 'Strong'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : cat.status === 'Average'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}>
                        {cat.status}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">{cat.scorePct}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.scorePct >= 80
                          ? 'bg-emerald-400'
                          : cat.scorePct >= 65
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${cat.scorePct}%` }}
                    />
                  </div>

                  {/* Recommendation */}
                  <div className="flex items-start justify-between gap-2 text-xs pt-1 text-slate-300">
                    <div className="flex items-start gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400">Prescribed Drill: </span>
                        <span className="font-semibold text-slate-200">{cat.recommendedDrill}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">{cat.actionItem}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Diagnostics updated continuously as you complete mock exams and flashcards.</span>
            <button
              onClick={() => setActiveScreen('rrb-exams')}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              <span>Take Full Mock Test</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 30-Day Sprint Roadmap */}
      <div className="bg-[#0c0c18]/90 rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white">AI-Tailored 30-Day Sprint Roadmap</h3>
          </div>
          <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            Target: +12 Marks Score Elevation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentDiagnostic.sprintPlan.map((sprint, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border flex flex-col justify-between ${
                sprint.urgency === 'high'
                  ? 'bg-rose-500/5 border-rose-500/30'
                  : sprint.urgency === 'medium'
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : 'bg-indigo-500/5 border-indigo-500/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-extrabold text-white">{sprint.dayRange}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    sprint.urgency === 'high'
                      ? 'bg-rose-500/20 text-rose-300'
                      : sprint.urgency === 'medium'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-indigo-500/20 text-indigo-300'
                  }`}>
                    {sprint.urgency} Priority
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-3">{sprint.focusArea}</h4>

                <ul className="space-y-2 text-xs text-slate-300">
                  {sprint.targetActions.map((act, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10">
                <button
                  onClick={() => setActiveScreen('flashcards')}
                  className="w-full py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Start Sprint Task</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
