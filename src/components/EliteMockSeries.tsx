import React, { useState, useEffect } from 'react';
import { ActiveScreen } from '../types';
import { ArrowLeft, Clock, Calendar, Bookmark, Award, CheckCircle2, ChevronRight, PlayCircle, HelpCircle } from 'lucide-react';

interface EliteMockSeriesProps {
  onBack: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const EliteMockSeries: React.FC<EliteMockSeriesProps> = ({ onBack, setActiveScreen }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'bookmarked'>('upcoming');
  const [countdown, setCountdown] = useState({ days: 2, hours: 14, mins: 35, secs: 10 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
            <h1 className="text-lg sm:text-xl font-bold font-serif-academy text-white">All India Mock Series</h1>
            <p className="text-xs text-slate-400">National Level UPSC CSE / GATE Benchmark</p>
          </div>
        </div>

        <button 
          onClick={() => alert('Bookmark saved to your revision queue')}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors border border-white/10"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Countdown Banner */}
        <section className="bg-gradient-to-br from-indigo-950 via-[#0c0c18] to-purple-950 border border-indigo-500/30 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="relative z-10 max-w-md">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Upcoming Mega All India Simulation
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-academy leading-snug">
              GS Paper I Full Syllabus Simulation (AIR #04)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Compete live with over 60,000 aspirants across India.
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center sm:items-end gap-3 w-full md:w-auto">
            <div className="flex gap-2">
              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl text-center min-w-[52px] border border-white/10">
                <span className="text-lg font-bold font-mono text-white">{countdown.days.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-slate-400 block">DAYS</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl text-center min-w-[52px] border border-white/10">
                <span className="text-lg font-bold font-mono text-white">{countdown.hours.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-slate-400 block">HRS</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl text-center min-w-[52px] border border-white/10">
                <span className="text-lg font-bold font-mono text-white">{countdown.mins.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-slate-400 block">MIN</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl text-center min-w-[52px] border border-emerald-500/30">
                <span className="text-lg font-bold font-mono text-emerald-400">{countdown.secs.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-emerald-300 block">SEC</span>
              </div>
            </div>

            <button
              onClick={() => setActiveScreen('mcq-assessment')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-950/40"
            >
              Register & Reserve Seat
            </button>
          </div>
        </section>

        {/* Tab Filters */}
        <section className="flex bg-white/[0.06] rounded-2xl p-1 border border-white/10">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live & Upcoming
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Completed & Evaluated
          </button>
          <button
            onClick={() => setActiveTab('bookmarked')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'bookmarked'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bookmarked
          </button>
        </section>

        {/* Mock Tests List */}
        <section className="space-y-4">
          {/* Mock Test 1: Live Now */}
          <div className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border-2 border-emerald-500/40 shadow-lg shadow-black/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Live Now
                </span>
                <span className="text-xs text-slate-400 font-semibold">UPSC CSAT Paper II</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif-academy text-white">
                CSAT Comprehensive Mock 03 (Logical Reasoning & Quant)
              </h3>
              <div className="flex gap-4 mt-2 text-xs text-slate-400 font-medium">
                <span>80 Questions</span>
                <span>•</span>
                <span>200 Marks</span>
                <span>•</span>
                <span>120 Mins</span>
              </div>
            </div>

            <button
              onClick={() => setActiveScreen('mcq-assessment')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 border border-indigo-400/30 active:scale-95 flex-shrink-0"
            >
              <span>Begin Exam</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mock Test 2: Scheduled */}
          <div className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/10 shadow-lg shadow-black/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase">
                  Scheduled
                </span>
                <span className="text-xs text-slate-400 font-semibold">Starts Saturday, 10:00 AM</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif-academy text-white">
                Polity & Governance Sectional Mock 04
              </h3>
              <div className="flex gap-4 mt-2 text-xs text-slate-400 font-medium">
                <span>50 Questions</span>
                <span>•</span>
                <span>100 Marks</span>
                <span>•</span>
                <span>60 Mins</span>
              </div>
            </div>

            <button
              onClick={() => alert('Reminder set for Saturday 9:55 AM')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 text-slate-200 font-bold text-xs sm:text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/10"
            >
              <Calendar className="w-4 h-4" />
              <span>Set Reminder</span>
            </button>
          </div>

          {/* Mock Test 3: Evaluated */}
          <div className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/10 shadow-lg shadow-black/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase">
                  Evaluated
                </span>
                <span className="text-xs text-slate-400 font-semibold">Completed 3 days ago</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif-academy text-white">
                Modern Indian History & Freedom Struggle
              </h3>
              <div className="flex gap-3 mt-2 text-xs font-semibold">
                <span className="text-indigo-300">Score: 142 / 200</span>
                <span className="text-emerald-400">Percentile: 98.2%</span>
                <span className="text-slate-400">AIR: 114</span>
              </div>
            </div>

            <button
              onClick={() => setActiveScreen('elite-report')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-white font-bold text-xs sm:text-sm hover:bg-white/[0.12] transition-all flex items-center justify-center gap-2"
            >
              <span>View Solutions & AIR</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
