import React from 'react';
import { useStudyTimer } from '../../context/StudySessionContext';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Coffee, 
  RotateCcw, 
  X, 
  ArrowRight, 
  Zap 
} from 'lucide-react';

export const SessionCompletionModal: React.FC = () => {
  const {
    state,
    showCompletionModal,
    closeCompletionModal,
    startBreak,
    startSession
  } = useStudyTimer();

  if (!showCompletionModal) {
    return null;
  }

  const session = state.lastCompletedSession || {
    minutes: state.targetMinutes,
    subject: state.subject,
    topic: state.topic,
    timestamp: 'Just now'
  };

  const handleStartBreak = () => {
    closeCompletionModal();
    startBreak(5);
  };

  const handleStartNext = () => {
    closeCompletionModal();
    startSession(session.minutes || 25, session.subject, session.topic);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0c0c18] border border-emerald-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
        {/* Glow circle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={closeCompletionModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebratory Icon */}
        <div className="relative z-10 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-950/60 mb-4 animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        {/* Title & Congratulations */}
        <div className="relative z-10 space-y-1.5 mb-6">
          <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interval Complete!</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-serif-academy">
            Great Focus, Scholar!
          </h3>
          <p className="text-xs text-slate-300">
            You successfully completed <span className="text-emerald-400 font-bold">{session.minutes} minutes</span> of focused learning.
          </p>
        </div>

        {/* Achievement Badge Bento */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Daily Goal Credit</span>
            <span className="text-base font-extrabold text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4" /> +{session.minutes} Mins
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Academic XP</span>
            <span className="text-base font-extrabold text-amber-400 flex items-center gap-1 mt-0.5">
              <Flame className="w-4 h-4 fill-amber-400" /> +75 XP
            </span>
          </div>
        </div>

        {/* Next Step Choices */}
        <div className="relative z-10 space-y-2.5">
          <button
            onClick={handleStartBreak}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition-all active:scale-98"
          >
            <Coffee className="w-4 h-4" />
            <span>Take 5-Minute Rest Break</span>
          </button>

          <button
            onClick={handleStartNext}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition-all active:scale-98 border border-indigo-400/30"
          >
            <Zap className="w-4 h-4" />
            <span>Start Next Focus Interval</span>
          </button>

          <button
            onClick={closeCompletionModal}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
