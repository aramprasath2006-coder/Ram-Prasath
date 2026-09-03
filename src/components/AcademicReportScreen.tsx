import React from 'react';
import { ActiveScreen } from '../types';
import { ArrowLeft, Download, Award, TrendingUp, CheckCircle, AlertTriangle, FileText, ChevronRight } from 'lucide-react';

interface AcademicReportScreenProps {
  onBack: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const AcademicReportScreen: React.FC<AcademicReportScreenProps> = ({ onBack, setActiveScreen }) => {
  const handleDownloadPDF = () => {
    window.print();
  };

  const trendData = [
    { label: 'Asmt 1', score: 75 },
    { label: 'Asmt 2', score: 82 },
    { label: 'Asmt 3', score: 80 },
    { label: 'Asmt 4', score: 90 },
    { label: 'Asmt 5', score: 94 }
  ];

  return (
    <div className="min-h-screen bg-[#050508] immersive-bg text-slate-200 flex flex-col pb-20 animate-in fade-in duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c18]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-all border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white font-serif-academy">Academic Report</h1>
            <p className="text-xs text-slate-400">Fall Semester 2024 • Alex Johnson</p>
          </div>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 text-slate-200 hover:bg-white/20 text-xs font-bold transition-all border border-white/10"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Metric Highlight Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Grade</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-white font-serif-academy">A</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                92.4% GPA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Dean's Honor List Standing</p>
          </div>

          <div className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Class Percentile</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-emerald-400">Top 5%</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Rank #12 out of 240 Students</p>
          </div>

          <div className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Attendance Rate</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-indigo-300">94%</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">42 of 45 Sessions Attended</p>
          </div>
        </section>

        {/* Score Trend Bar Chart Section */}
        <section className="bg-[#0c0c18]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg shadow-black/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-serif-academy">Assessment Score Trajectory</h2>
              <p className="text-xs text-slate-400">Consistent score progression across continuous evaluation</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-4 h-4" />
              <span>+19% Growth</span>
            </div>
          </div>

          {/* Interactive CSS Bar Chart */}
          <div className="h-44 w-full flex items-end justify-between gap-3 sm:gap-6 pt-4 pb-2 px-2 border-b border-white/10">
            {trendData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-xs font-bold text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.score}%
                </span>
                <div className="w-full bg-white/5 rounded-t-xl h-36 flex items-end overflow-hidden border border-white/5">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-700 to-indigo-500 group-hover:from-indigo-600 group-hover:to-purple-500 transition-all duration-500 rounded-t-xl"
                    style={{ height: `${item.score}%` }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Subject Breakdown Cards */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-white font-serif-academy">Subject Breakdown</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => setActiveScreen('subject-mastery')}
              className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20 cursor-pointer hover:border-indigo-500/40 hover:shadow-2xl transition-all group"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors">Mathematics</h3>
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">Mastered</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">95%</p>
              <p className="text-xs text-slate-400 mt-1">Calculus & Linear Algebra</p>
              <div className="mt-3 flex items-center justify-between text-xs text-indigo-300 font-semibold">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-white">Physics</h3>
                <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">Proficient</span>
              </div>
              <p className="text-2xl font-bold text-indigo-300">82%</p>
              <p className="text-xs text-slate-400 mt-1">Mechanics & Thermodynamics</p>
            </div>

            <div className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-white">Chemistry</h3>
                <span className="text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded">Developing</span>
              </div>
              <p className="text-2xl font-bold text-rose-400">68%</p>
              <p className="text-xs text-slate-400 mt-1">Organic Chemistry Synthesis</p>
            </div>
          </div>
        </section>

        {/* Strengths & Growth Areas */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Strong Topics
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Multivariable Partial Differentiation (100% accuracy)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Vector Calculus & Green's Theorem (95% accuracy)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Classical Mechanics & Newton-Euler equations
              </li>
            </ul>
          </div>

          <div className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Recommended Review Areas
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                Organic Chemistry Reaction Mechanisms (Needs +15%)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                Matrix Diagonalization & Eigenvalues in Linear Algebra
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                Thermodynamic Carnot Cycle & Entropy Integrals
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};
