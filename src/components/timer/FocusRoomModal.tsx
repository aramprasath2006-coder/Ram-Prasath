import React, { useState } from 'react';
import { useStudyTimer } from '../../context/StudySessionContext';
import { 
  X, 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Volume2, 
  VolumeX, 
  Coffee, 
  Zap, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  FileText,
  RotateCcw
} from 'lucide-react';

const FOCUS_QUOTES = [
  { quote: "Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
  { quote: "It is not that I'm so smart. But I stay with the questions much longer.", author: "Albert Einstein" },
  { quote: "Deep work is the ability to focus without distraction on a cognitively demanding task.", author: "Cal Newport" },
  { quote: "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.", author: "Dwayne Johnson" }
];

export const FocusRoomModal: React.FC = () => {
  const {
    state,
    pauseSession,
    resumeSession,
    stopSession,
    extendSession,
    startBreak,
    toggleSound,
    isExpandedModalOpen,
    setIsExpandedModalOpen,
    formattedTime,
    progressPercentage
  } = useStudyTimer();

  const [notes, setNotes] = useState<string>('');
  const [quoteIndex] = useState<number>(() => Math.floor(Math.random() * FOCUS_QUOTES.length));

  if (!isExpandedModalOpen) {
    return null;
  }

  const activeQuote = FOCUS_QUOTES[quoteIndex];

  // SVG Circular progress radius
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0c0c18] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Glow ambient */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 ${
          state.mode === 'break' ? 'bg-amber-500' : 'bg-indigo-500'
        }`} />

        {/* Modal Header */}
        <div className="relative z-10 bg-[#070710] border-b border-white/10 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              state.mode === 'break' 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
            }`}>
              {state.mode === 'break' ? <Coffee className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-300">
                {state.mode === 'break' ? 'Rest Interval' : 'Deep Work Focus Room'}
              </span>
              <h2 className="text-base sm:text-lg font-extrabold font-serif-academy leading-tight">
                {state.subject} • {state.topic}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title={state.soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
            >
              {state.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsExpandedModalOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Center: Circular Dial & Timer Controls */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center text-center space-y-6">
            {/* Circular Progress Dial */}
            <div className="relative flex items-center justify-center w-72 h-72">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
                {/* Background Ring */}
                <circle
                  cx="140"
                  cy="140"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Active Progress Ring */}
                <circle
                  cx="140"
                  cy="140"
                  r={radius}
                  stroke={state.mode === 'break' ? '#f59e0b' : '#6366f1'}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                />
              </svg>

              {/* Inside Timer Numbers */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                  {state.mode === 'break' ? 'Rest Time' : 'Time Remaining'}
                </span>
                <span className="font-mono text-5xl sm:text-6xl font-black tracking-tight drop-shadow-md">
                  {formattedTime}
                </span>
                <span className={`text-xs font-bold mt-2 px-3 py-0.5 rounded-full ${
                  state.isPaused
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {state.isPaused ? 'Paused' : `${progressPercentage}% Complete`}
                </span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                onClick={state.isPaused ? resumeSession : pauseSession}
                className={`px-6 py-3.5 rounded-2xl font-extrabold text-sm flex items-center gap-2 transition-all shadow-xl active:scale-95 ${
                  state.isPaused
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 border border-indigo-400/40 shadow-indigo-950/60'
                }`}
              >
                {state.isPaused ? (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Resume Focus</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Timer</span>
                  </>
                )}
              </button>

              <button
                onClick={() => extendSession(5)}
                className="px-4 py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>+5 Mins</span>
              </button>

              {state.mode === 'focus' ? (
                <button
                  onClick={() => startBreak(5)}
                  className="px-4 py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Coffee className="w-4 h-4" />
                  <span>5m Break</span>
                </button>
              ) : (
                <button
                  onClick={() => startBreak(15)}
                  className="px-4 py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Coffee className="w-4 h-4" />
                  <span>15m Long Break</span>
                </button>
              )}

              <button
                onClick={() => {
                  stopSession(true);
                  setIsExpandedModalOpen(false);
                }}
                className="px-4 py-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Square className="w-4 h-4" />
                <span>Finish & Log</span>
              </button>
            </div>
          </div>

          {/* Right: Inspirational Note & Scratchpad */}
          <div className="lg:col-span-5 flex flex-col gap-4 h-full">
            {/* Daily Quote Card */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Mindset Anchor</span>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{activeQuote.quote}"
              </p>
              <span className="text-[11px] font-semibold text-slate-400 block text-right">
                — {activeQuote.author}
              </span>
            </div>

            {/* Session Notes Scratchpad */}
            <div className="flex-1 flex flex-col p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 min-h-[160px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Active Session Scratchpad</span>
                </div>
                <span className="text-[10px] text-slate-500">Auto-saved</span>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jot down quick thoughts, formulas, or questions to look up later without breaking focus..."
                className="w-full flex-1 p-3 text-xs rounded-xl bg-black/40 border border-white/10 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed"
                rows={5}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
