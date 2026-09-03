import React, { useState, useEffect } from 'react';
import { Target, Clock, Flame, CheckCircle2, Edit3, Plus, RotateCcw, Play, Pause, Trophy, Sparkles, Check, X } from 'lucide-react';
import { recordTimerSession } from '../utils/studyTimeLogs';

interface DailyStudyGoalsProps {
  onGoalAchieved?: () => void;
}

export const DailyStudyGoals: React.FC<DailyStudyGoalsProps> = () => {
  // Retrieve saved values or default
  const [targetMinutes, setTargetMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('eduflow_study_target_minutes');
    return saved ? parseInt(saved, 10) : 60;
  });

  const [completedMinutes, setCompletedMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('eduflow_study_completed_minutes');
    return saved ? parseInt(saved, 10) : 38;
  });

  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
  const [customGoalInput, setCustomGoalInput] = useState<string>(targetMinutes.toString());
  const [quickAddAmount, setQuickAddAmount] = useState<number>(15);
  const [isCustomLogOpen, setIsCustomLogOpen] = useState<boolean>(false);
  const [customLogMinutes, setCustomLogMinutes] = useState<string>('20');

  // Mini Focus Stopwatch Timer
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // Sync to localStorage and listen for updates from Countdown Study Timer
  useEffect(() => {
    localStorage.setItem('eduflow_study_target_minutes', targetMinutes.toString());
  }, [targetMinutes]);

  useEffect(() => {
    localStorage.setItem('eduflow_study_completed_minutes', completedMinutes.toString());
  }, [completedMinutes]);

  // Listen to custom & storage events from global countdown timer
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCompleted = localStorage.getItem('eduflow_study_completed_minutes');
      if (savedCompleted) {
        setCompletedMinutes(parseInt(savedCompleted, 10));
      }
      const savedTarget = localStorage.getItem('eduflow_study_target_minutes');
      if (savedTarget) {
        setTargetMinutes(parseInt(savedTarget, 10));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('studyMinutesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('studyMinutesUpdated', handleStorageChange);
    };
  }, []);

  // Focus Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          const next = prev + 1;
          // Every 60 seconds, increment completedMinutes by 1
          if (next % 60 === 0) {
            setCompletedMinutes((cm) => cm + 1);
          }
          return next;
        });
      }, 1000);
    } else if (!isTimerRunning && timerSeconds !== 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const percentage = Math.min(100, Math.round((completedMinutes / targetMinutes) * 100)) || 0;
  const isAchieved = completedMinutes >= targetMinutes;
  const remainingMinutes = Math.max(0, targetMinutes - completedMinutes);

  const handleSaveGoal = (mins: number) => {
    if (mins > 0) {
      setTargetMinutes(mins);
      setIsEditingGoal(false);
    }
  };

  const handleAddMinutes = (mins: number) => {
    if (mins > 0) {
      setCompletedMinutes((prev) => Math.max(0, prev + mins));
      recordTimerSession({
        date: new Date().toISOString().split('T')[0],
        minutes: mins,
        subject: 'Mathematics',
        topic: 'Manual Study Log',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  const handleResetProgress = () => {
    setCompletedMinutes(0);
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  const formatTimerTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const goalPresets = [30, 45, 60, 90, 120];

  return (
    <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-6 shadow-lg shadow-black/20 relative overflow-hidden transition-all">
      {/* Subtle background glow */}
      <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
        isAchieved ? 'bg-emerald-500/20' : 'bg-indigo-500/15'
      }`} />

      {/* Header with Title and Streak */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-md transition-colors ${
            isAchieved 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
              : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
          }`}>
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight font-serif-academy">
                Daily Study Goal
              </h3>
              {isAchieved && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Met!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {isAchieved 
                ? 'Outstanding work! You have reached your daily target.' 
                : `${remainingMinutes} mins remaining to meet today's target.`}
            </p>
          </div>
        </div>

        {/* Badges & Edit Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-xl text-xs font-bold shadow-2xs">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>5 Day Streak</span>
          </div>

          <button
            onClick={() => setIsEditingGoal(!isEditingGoal)}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 transition-all active:scale-95"
            title="Edit Daily Target"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingGoal ? 'Close' : 'Set Goal'}</span>
          </button>
        </div>
      </div>

      {/* Goal Setting Editor (Toggleable) */}
      {isEditingGoal && (
        <div className="relative z-10 mb-5 p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-3 animate-in fade-in duration-150">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Choose Target Minutes / Day:
            </span>
            <button 
              onClick={() => setIsEditingGoal(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {goalPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => handleSaveGoal(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  targetMinutes === preset
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50 border border-indigo-400/30'
                    : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border border-white/10'
                }`}
              >
                {preset} mins ({preset >= 60 ? `${preset / 60}h` : `${preset}m`})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-400">Custom target:</span>
            <input
              type="number"
              min="5"
              max="600"
              value={customGoalInput}
              onChange={(e) => setCustomGoalInput(e.target.value)}
              className="w-20 px-2.5 py-1 text-xs font-bold rounded-lg bg-white/[0.08] border border-white/15 text-white focus:outline-none focus:border-indigo-500"
            />
            <span className="text-xs text-slate-400">mins</span>
            <button
              onClick={() => {
                const parsed = parseInt(customGoalInput, 10);
                if (!isNaN(parsed) && parsed > 0) {
                  handleSaveGoal(parsed);
                }
              }}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Progress Metric & Visual Bar */}
      <div className="relative z-10 space-y-2 mb-5">
        <div className="flex justify-between items-baseline">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif-academy tracking-tight">
              {completedMinutes}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-400">
              / {targetMinutes} mins completed
            </span>
          </div>

          <div className="text-right flex items-center gap-1.5">
            <span className={`text-sm sm:text-base font-bold font-mono ${
              isAchieved ? 'text-emerald-400' : 'text-indigo-300'
            }`}>
              {percentage}%
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-white/[0.08] h-3.5 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out relative ${
              isAchieved
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-md shadow-emerald-500/50'
                : 'bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 shadow-md shadow-indigo-500/50'
            }`}
            style={{ width: `${percentage}%` }}
          >
            {/* Shimmer light effect inside bar */}
            <div className="absolute inset-0 bg-white/20 opacity-30 animate-pulse"></div>
          </div>
        </div>

        {/* Milestone Indicators */}
        <div className="flex justify-between text-[10px] font-semibold text-slate-500 px-0.5">
          <span>0m</span>
          <span>{Math.round(targetMinutes * 0.25)}m</span>
          <span>{Math.round(targetMinutes * 0.5)}m</span>
          <span>{Math.round(targetMinutes * 0.75)}m</span>
          <span className={isAchieved ? 'text-emerald-400 font-bold' : ''}>{targetMinutes}m</span>
        </div>
      </div>

      {/* Action Controls: Quick Log + Live Stopwatch */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Quick Log Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Log:
          </span>
          {[10, 15, 30].map((mins) => (
            <button
              key={mins}
              onClick={() => handleAddMinutes(mins)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-indigo-600/30 hover:border-indigo-500/40 border border-white/10 text-xs font-bold text-slate-300 hover:text-indigo-200 transition-all active:scale-95 flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-indigo-400" />
              +{mins}m
            </button>
          ))}
          
          <button
            onClick={() => setIsCustomLogOpen(!isCustomLogOpen)}
            className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[11px] font-semibold text-slate-400 hover:text-slate-200 transition-all"
          >
            Custom
          </button>
        </div>

        {/* Right: Active Focus Timer & Reset */}
        <div className="flex items-center gap-2 justify-end">
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-xl">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                isTimerRunning ? 'text-amber-400' : 'text-indigo-300 hover:text-indigo-200'
              }`}
              title={isTimerRunning ? 'Pause Session' : 'Start Focus Session Timer'}
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-amber-400" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-indigo-400" />
                  <span>Focus Timer</span>
                </>
              )}
            </button>
            <span className="font-mono text-xs font-bold text-white bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
              {formatTimerTime(timerSeconds)}
            </span>
          </div>

          <button
            onClick={handleResetProgress}
            className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
            title="Reset Today's Tracked Time"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Custom Log Minutes Inline Drawer */}
      {isCustomLogOpen && (
        <div className="relative z-10 mt-3 pt-3 border-t border-white/5 flex items-center gap-2 animate-in fade-in duration-100">
          <span className="text-xs text-slate-400">Log minutes:</span>
          <input
            type="number"
            min="1"
            max="300"
            value={customLogMinutes}
            onChange={(e) => setCustomLogMinutes(e.target.value)}
            className="w-20 px-2 py-1 text-xs font-bold rounded-lg bg-white/[0.08] border border-white/15 text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => {
              const val = parseInt(customLogMinutes, 10);
              if (!isNaN(val) && val > 0) {
                handleAddMinutes(val);
                setIsCustomLogOpen(false);
              }
            }}
            className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-lg transition-all"
          >
            Add Minutes
          </button>
          <button
            onClick={() => setIsCustomLogOpen(false)}
            className="text-slate-500 hover:text-slate-300 text-xs px-2"
          >
            Cancel
          </button>
        </div>
      )}
    </section>
  );
};
