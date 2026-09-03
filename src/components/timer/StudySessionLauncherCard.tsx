import React, { useState } from 'react';
import { useStudyTimer } from '../../context/StudySessionContext';
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Clock, 
  Sparkles, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Flame, 
  CheckCircle2, 
  Zap, 
  Coffee,
  ChevronDown
} from 'lucide-react';

interface StudySessionLauncherCardProps {
  defaultSubject?: string;
  className?: string;
}

const PRESET_INTERVALS = [
  { mins: 25, label: 'Pomodoro', desc: 'High Focus' },
  { mins: 45, label: 'Deep Work', desc: 'Optimal' },
  { mins: 60, label: 'Power Sprint', desc: 'Extended' },
  { mins: 90, label: 'Mastery Session', desc: 'Exam Prep' },
];

const SUBJECT_OPTIONS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Computer Science',
  'GATE Mechanical',
  'UPSC Prelims GS',
  'Quantitative Aptitude',
  'General Self-Study'
];

export const StudySessionLauncherCard: React.FC<StudySessionLauncherCardProps> = ({ 
  defaultSubject = 'Mathematics',
  className = '' 
}) => {
  const {
    state,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    extendSession,
    startBreak,
    toggleSound,
    setIsExpandedModalOpen,
    formattedTime,
    progressPercentage
  } = useStudyTimer();

  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [selectedSubject, setSelectedSubject] = useState<string>(defaultSubject);
  const [topicNote, setTopicNote] = useState<string>('Concept Revision & Practice');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customMinutesInput, setCustomMinutesInput] = useState<string>('30');

  const handleStart = () => {
    const mins = isCustomMode ? parseInt(customMinutesInput, 10) || 25 : selectedMinutes;
    startSession(mins, selectedSubject, topicNote);
  };

  return (
    <div className={`bg-[#0c0c18]/85 backdrop-blur-xl rounded-3xl border border-white/10 p-5 sm:p-7 shadow-2xl relative overflow-hidden transition-all ${className}`}>
      {/* Dynamic Background Glow */}
      <div 
        className={`absolute -right-16 -top-16 w-60 h-60 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
          state.isActive
            ? state.mode === 'break' 
              ? 'bg-amber-500/20' 
              : 'bg-indigo-500/25'
            : 'bg-purple-600/15'
        }`} 
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg transition-all ${
            state.isActive 
              ? state.mode === 'break'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
                : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white border-indigo-400/40 shadow-indigo-950/60'
              : 'bg-white/[0.06] text-indigo-300 border-white/10'
          }`}>
            {state.isActive && state.mode === 'break' ? (
              <Coffee className="w-6 h-6" />
            ) : (
              <Zap className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight font-serif-academy">
                {state.isActive 
                  ? state.mode === 'break' ? 'Active Rest Break' : 'Focus Study Session'
                  : 'Start Study Interval'}
              </h3>
              {state.isActive && (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Live
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {state.isActive 
                ? `Subject: ${state.subject} • ${state.topic}`
                : 'Choose a dedicated learning interval to lock in deep focus.'}
            </p>
          </div>
        </div>

        {/* Top Controls: Sound toggle & Fullscreen trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
              state.soundEnabled 
                ? 'bg-white/[0.08] text-indigo-300 border-white/15 hover:bg-white/[0.12]' 
                : 'bg-white/[0.03] text-slate-500 border-white/5 hover:bg-white/[0.08]'
            }`}
            title={state.soundEnabled ? 'Chime Sound Enabled' : 'Sound Muted'}
          >
            {state.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {state.isActive && (
            <button
              onClick={() => setIsExpandedModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Focus Room</span>
            </button>
          )}
        </div>
      </div>

      {/* STATE 1: ACTIVE RUNNING SESSION VIEW */}
      {state.isActive ? (
        <div className="relative z-10 space-y-6 animate-in fade-in duration-200">
          {/* Main Countdown Display Card */}
          <div className="bg-[#070710]/90 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px]"></div>

            {/* Circular or Centered Large Timer */}
            <div className="relative z-10 text-center space-y-1 my-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {state.mode === 'break' ? 'Break Time Remaining' : 'Focus Interval Remaining'}
              </span>
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-md">
                {formattedTime}
              </div>
              <div className="text-xs font-semibold text-indigo-300">
                {state.isPaused ? '⏸ Session Paused' : '⚡ Interval in progress...'}
              </div>
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full max-w-md bg-white/[0.08] h-3 rounded-full overflow-hidden p-0.5 border border-white/10 mt-4 relative">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  state.mode === 'break'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                    : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="w-full max-w-md flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
              <span>0%</span>
              <span className="font-bold text-white">{progressPercentage}% Completed</span>
              <span>100%</span>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              {/* Play / Pause */}
              <button
                onClick={state.isPaused ? resumeSession : pauseSession}
                className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
                  state.isPaused
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 border border-indigo-400/30'
                }`}
              >
                {state.isPaused ? (
                  <>
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Resume Session</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pause Session</span>
                  </>
                )}
              </button>

              {/* End / Stop */}
              <button
                onClick={() => stopSession(true)}
                className="px-4 py-3 rounded-2xl bg-white/[0.06] hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/10 text-slate-300 hover:text-rose-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95"
                title="End session and log minutes"
              >
                <Square className="w-4 h-4 text-rose-400" />
                <span>Finish & Log</span>
              </button>
            </div>

            {/* Quick Actions: +5m & Break */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => extendSession(5)}
                className="px-3.5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-slate-200 transition-all flex items-center gap-1"
                title="Add 5 more minutes to current session"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                <span>+5m</span>
              </button>

              {state.mode === 'focus' ? (
                <button
                  onClick={() => startBreak(5)}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold text-amber-300 transition-all flex items-center gap-1.5"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>5m Break</span>
                </button>
              ) : (
                <button
                  onClick={() => startSession(25, state.subject, state.topic)}
                  className="px-3.5 py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-xs font-bold text-indigo-200 transition-all flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Resume Focus</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* STATE 2: LAUNCHER CONFIGURATION VIEW */
        <div className="relative z-10 space-y-5">
          {/* Interval Duration Presets */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2.5">
              1. Select Interval Duration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_INTERVALS.map((preset) => {
                const isSelected = !isCustomMode && selectedMinutes === preset.mins;
                return (
                  <button
                    key={preset.mins}
                    type="button"
                    onClick={() => {
                      setSelectedMinutes(preset.mins);
                      setIsCustomMode(false);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-98 ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-600/90 to-purple-700/90 border-indigo-400 text-white shadow-lg shadow-indigo-950/60 ring-2 ring-indigo-500/40'
                        : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-bold">{preset.label}</span>
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-slate-400'
                      }`}>
                        {preset.mins}m
                      </span>
                    </div>
                    <span className={`text-[11px] mt-2 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {preset.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Minutes Option */}
            <div className="flex items-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                  isCustomMode
                    ? 'bg-indigo-600 text-white border-indigo-400'
                    : 'bg-white/[0.04] text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                Custom Minutes:
              </button>
              {isCustomMode && (
                <div className="flex items-center gap-2 animate-in fade-in duration-150">
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={customMinutesInput}
                    onChange={(e) => setCustomMinutesInput(e.target.value)}
                    className="w-20 px-3 py-1 text-xs font-bold rounded-xl bg-white/[0.08] border border-white/15 text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs text-slate-400 font-semibold">minutes</span>
                </div>
              )}
            </div>
          </div>

          {/* Subject & Topic Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                2. Subject Category
              </label>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  {SUBJECT_OPTIONS.map((sub) => (
                    <option key={sub} value={sub} className="bg-[#0c0c18] text-white">
                      {sub}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                3. Topic / Goal Note
              </label>
              <input
                type="text"
                value={topicNote}
                onChange={(e) => setTopicNote(e.target.value)}
                placeholder="e.g. Chapter 4 Practice or Mock Test"
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Start Action Trigger Button */}
          <div className="pt-2">
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-950/70 border border-indigo-400/40 transition-all active:scale-98"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>
                Start {isCustomMode ? customMinutesInput : selectedMinutes}-Minute Study Session
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
