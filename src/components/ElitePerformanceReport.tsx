import React from 'react';
import { ActiveScreen } from '../types';
import { ArrowLeft, Download, Award, Target, AlertTriangle, CheckCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface ElitePerformanceReportProps {
  onBack: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const ElitePerformanceReport: React.FC<ElitePerformanceReportProps> = ({
  onBack,
  setActiveScreen
}) => {
  return (
    <div className="min-h-screen bg-[#050508] immersive-bg text-slate-200 flex flex-col pb-20 animate-in fade-in duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c18]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-all border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-serif-academy text-white">
              Performance Report: GATE CS 2025
            </h1>
            <p className="text-xs text-slate-400">All India Benchmark Diagnostic</p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 text-slate-200 hover:bg-white/20 text-xs font-bold transition-all border border-white/10"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export Scorecard</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* AIR & Metric Highlights Card */}
        <section className="bg-gradient-to-br from-indigo-950 via-[#0c0c18] to-purple-950 border border-indigo-500/30 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Predicted All India Rank
              </span>
              <p className="text-3xl sm:text-4xl font-extrabold font-serif-academy text-white">
                AIR 245 - 310
              </p>
              <p className="text-xs text-slate-300 mt-1">Percentile: Top 1.2% (1,28,000 Aspirants)</p>
            </div>

            <div className="sm:border-l sm:border-white/10 sm:pl-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Overall Accuracy
              </span>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
                78.0%
              </p>
              <p className="text-xs text-slate-300 mt-1">51 Correct / 65 Total Questions</p>
            </div>

            <div className="sm:border-l sm:border-white/10 sm:pl-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Negative Penalty
              </span>
              <p className="text-3xl sm:text-4xl font-extrabold text-rose-400">
                -4.66
              </p>
              <p className="text-xs text-slate-300 mt-1">7 Incorrect in MCQ sections</p>
            </div>
          </div>
        </section>

        {/* Subject-wise Analysis */}
        <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg shadow-black/20 space-y-4">
          <h2 className="text-base sm:text-lg font-bold font-serif-academy text-white">
            Subject-wise Accuracy & Performance
          </h2>

          <div className="space-y-4">
            {/* Computer Networks */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="flex justify-between items-center mb-1 text-xs sm:text-sm">
                <span className="font-bold text-white">Computer Networks (TCP/IP, Congestion Control)</span>
                <span className="font-bold text-emerald-400">85% Accuracy (High)</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Operating Systems */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="flex justify-between items-center mb-1 text-xs sm:text-sm">
                <span className="font-bold text-white">Operating Systems (CPU Scheduling, Semaphores)</span>
                <span className="font-bold text-indigo-300">62% Accuracy (Moderate)</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>

            {/* Engineering Mathematics */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="flex justify-between items-center mb-1 text-xs sm:text-sm">
                <span className="font-bold text-white">Engineering Mathematics (Linear Algebra & Calculus)</span>
                <span className="font-bold text-rose-400">45% Accuracy (Needs Attention)</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Error Breakdown Analysis */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">
              Conceptual Gaps
            </span>
            <p className="text-2xl font-bold text-white">6 Questions</p>
            <p className="text-xs text-slate-400 mt-1">Primarily in Matrix Eigenvalues & Page Replacements.</p>
          </div>

          <div className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Calculation Mistakes
            </span>
            <p className="text-2xl font-bold text-white">3 Questions</p>
            <p className="text-xs text-slate-400 mt-1">Arithmetic slip in 2-Mark NAT questions.</p>
          </div>

          <div className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">
              Unattempted
            </span>
            <p className="text-2xl font-bold text-white">4 Questions</p>
            <p className="text-xs text-slate-400 mt-1">Time management constraint on Section B.</p>
          </div>
        </section>

        {/* Actionable Study Recommendations */}
        <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg shadow-black/20 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold font-serif-academy text-white">
              AI Rank Booster: Recommended Action Items
            </h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded uppercase">
                  Priority 1
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Eigenvalues, Eigenvectors & Cayley-Hamilton Theorem
                </h4>
                <p className="text-xs text-slate-400">Estimated rank boost: +45 positions</p>
              </div>

              <button
                onClick={() => setActiveScreen('mcq-assessment')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-950/40 border border-indigo-400/30"
              >
                <span>Start Review Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded uppercase">
                  Priority 2
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Virtual Memory, Two-Level Paging & TLB Hit Numericals
                </h4>
                <p className="text-xs text-slate-400">Estimated rank boost: +30 positions</p>
              </div>

              <button
                onClick={() => setActiveScreen('mcq-assessment')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-950/40 border border-indigo-400/30"
              >
                <span>Practice 20 Numericals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
