import React, { useState } from 'react';
import { useStudyTimer } from '../../context/StudySessionContext';
import { 
  Play, 
  Pause, 
  Maximize2, 
  Plus, 
  Zap, 
  Coffee, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Square,
  Sparkles
} from 'lucide-react';

export const PersistentFloatingTimerHUD: React.FC = () => {
  const {
    state,
    pauseSession,
    resumeSession,
    stopSession,
    extendSession,
    setIsExpandedModalOpen,
    formattedTime,
    progressPercentage
  } = useStudyTimer();

  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // If no timer is active, do not render floating HUD
  if (!state.isActive) {
    return null;
  }

  // If minimized into a compact coin badge:
  if (isMinimized) {
    return (
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          className="group flex items-center gap-2 bg-[#0c0c18]/95 backdrop-blur-xl border border-indigo-500/40 p-2.5 sm:px-4 sm:py-2.5 rounded-full shadow-2xl shadow-indigo-950/80 hover:border-indigo-400 hover:scale-105 transition-all"
        >
          <div className="w-3 h-3 rounded-full bg-indigo-500 animate-ping"></div>
          <span className="font-mono font-bold text-white text-xs sm:text-sm">{formattedTime}</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
        </button>
      </div>
    );
  }

  return (
    <aside 
      aria-label="Active Study Session"
      className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 left-3 sm:left-auto max-w-sm sm:w-96 z-40 animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="bg-[#0c0c18]/95 backdrop-blur-2xl border border-indigo-500/40 rounded-3xl p-4 shadow-2xl shadow-black/80 ring-1 ring-white/10 relative overflow-hidden">
        {/* Glow accent */}
        <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-xl pointer-events-none ${
          state.mode === 'break' ? 'bg-amber-500/20' : 'bg-indigo-500/25'
        }`} />

        {/* Top bar of floating card */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              state.isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
            }`}></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300">
              {state.mode === 'break' ? 'Rest Break' : 'Active Study Session'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpandedModalOpen(true)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Expand to Fullscreen Focus Room"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Minimize to floating coin"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Subject and Time Display */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{state.subject}</p>
            <p className="text-[11px] text-slate-400 truncate">{state.topic}</p>
          </div>

          <div className="text-right">
            <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-tight">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden mb-3.5 border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              state.mode === 'break'
                ? 'bg-amber-400'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <button
              onClick={state.isPaused ? resumeSession : pauseSession}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                state.isPaused
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {state.isPaused ? (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 fill-current" />
                  <span>Pause</span>
                </>
              )}
            </button>

            <button
              onClick={() => extendSession(5)}
              className="px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-slate-200 transition-all flex items-center gap-1"
              title="Add 5 minutes"
            >
              <Plus className="w-3 h-3 text-indigo-400" />
              <span>+5m</span>
            </button>
          </div>

          <button
            onClick={() => stopSession(true)}
            className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/10 text-slate-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-all"
            title="Finish & Save minutes"
          >
            <Square className="w-3 h-3 text-rose-400" />
            <span>Finish</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
