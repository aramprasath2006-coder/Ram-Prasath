import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Play, 
  Calendar, 
  Clock, 
  QrCode, 
  Sparkles, 
  MessageSquare, 
  X, 
  ArrowRight, 
  ChevronRight,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Award
} from 'lucide-react';
import { ActiveScreen } from '../../types';

interface QuickActionsFloatingMenuProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenVideoPlayer: (title: string, subject: string) => void;
  onOpenDeadlines: () => void;
  onOpenTeacherChat?: () => void;
}

export const QuickActionsFloatingMenu: React.FC<QuickActionsFloatingMenuProps> = ({
  setActiveScreen,
  onOpenVideoPlayer,
  onOpenDeadlines,
  onOpenTeacherChat
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard shortcut listener (Alt + Q or Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'q' || e.key === 'Q')) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div 
      ref={menuRef} 
      className="fixed bottom-20 md:bottom-8 right-4 sm:right-8 z-40 flex flex-col items-end"
    >
      {/* Expanded Quick Action Drawer / Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 w-80 sm:w-96 bg-[#0c0c1a]/95 backdrop-blur-2xl border border-indigo-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/90 ring-1 ring-white/15 overflow-hidden text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/50">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    Quick Actions
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Shortcut
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">Instant student workflows & shortcuts</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Close (Esc)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of Actions */}
            <div className="space-y-2">
              {/* Action 0: Official YouTube Channel Broadcast */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  const el = document.getElementById('youtube-channel-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setActiveScreen('eduflow-home');
                    setTimeout(() => {
                      document.getElementById('youtube-channel-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-red-950/60 via-red-900/30 to-[#0c0c1a] border border-red-500/30 hover:border-red-400/60 hover:bg-red-900/20 transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-red-200 transition-colors">
                        YouTube Video Hub
                      </span>
                      <span className="text-[10px] font-bold text-red-300 bg-red-500/20 px-1.5 py-0.2 rounded border border-red-500/30">
                        @ascendstaltechindiaa158
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-1">
                      Technical lectures & exam masterclasses
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-300 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Action 1: Resume Lecture (Primary Hero Action) */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenVideoPlayer('Integration Techniques & Applications', 'Mathematics');
                }}
                className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-indigo-900/40 to-[#0c0c1a] border border-indigo-500/30 hover:border-indigo-400/60 hover:bg-indigo-900/30 transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors">
                        Resume Course
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded">
                        22m left
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-1">
                      Integration Techniques (Module 3)
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Action 2: Check Upcoming Deadlines */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenDeadlines();
                }}
                className="w-full text-left p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.08] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Calendar className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors">
                        Check Deadlines
                      </span>
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
                        3 Due Soon
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Calculus A4, DSA Lab Quiz, Chemistry
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Action 3: Focus Study Timer */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveScreen('study-timer');
                }}
                className="w-full text-left p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.08] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Clock className="w-4 h-4 text-indigo-300" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors block">
                      Launch Study Session
                    </span>
                    <p className="text-[11px] text-slate-400">
                      25 min Pomodoro & streak countdown
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Action 4: Attendance Scan */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveScreen('digital-attendance');
                }}
                className="w-full text-left p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.08] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <QrCode className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors block">
                      Scan Attendance QR
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Geo-fenced verification check-in
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Action 5: Live MCQ Assessment */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveScreen('mcq-assessment');
                }}
                className="w-full text-left p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.08] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4 text-purple-300" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors block">
                      Weekly MCQ Assessment
                    </span>
                    <p className="text-[11px] text-slate-400">
                      20 Timed questions in Math & Physics
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Action 6: Digital Badges & Achievements */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveScreen('student-achievements');
                }}
                className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-amber-950/30 to-purple-950/30 border border-amber-500/30 hover:border-amber-400/60 hover:bg-amber-950/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-amber-200 transition-colors">
                        Student Achievements
                      </span>
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
                        Badges
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Digital credentials, certificates &amp; XP
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Action 6: Ask Faculty Chat (if available) */}
              {onOpenTeacherChat && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenTeacherChat();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.08] transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-4 h-4 text-blue-300" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors block">
                        Ask Faculty Tutor
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Direct chat with Dr. Evelyn Reed
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              )}
            </div>

            {/* Micro Helper / Hotkey hint */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>Quick Launcher</span>
              <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300 border border-white/10">
                Alt + Q
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Trigger Button (FAB) */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all border ${
          isOpen
            ? 'bg-indigo-600 text-white border-indigo-400 shadow-indigo-950/80 ring-2 ring-indigo-400/40'
            : 'bg-[#0c0c1a]/90 hover:bg-[#14142b] text-white border-indigo-500/40 hover:border-indigo-400 shadow-black/80 backdrop-blur-xl'
        }`}
        title="Quick Actions (Alt + Q)"
        aria-label="Open Quick Actions Menu"
      >
        {/* Ambient Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-md opacity-30 group-hover:opacity-60 transition duration-300 pointer-events-none"></div>

        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 ${
          isOpen ? 'bg-white/20 rotate-45' : 'bg-indigo-500/30 group-hover:rotate-12'
        }`}>
          {isOpen ? (
            <X className="w-4 h-4 text-white" />
          ) : (
            <Zap className="w-4 h-4 text-indigo-300 fill-indigo-300" />
          )}
        </div>

        <span className="font-bold text-xs tracking-wide hidden sm:inline-block pr-0.5">
          Quick Actions
        </span>

        {/* Attention badge when closed */}
        {!isOpen && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};
