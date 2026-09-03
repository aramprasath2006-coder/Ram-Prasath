import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  X, 
  ArrowRight, 
  BookOpen, 
  Sparkles,
  ExternalLink,
  Check,
  Bell
} from 'lucide-react';
import { ActiveScreen } from '../../types';

export interface DeadlineItem {
  id: string;
  title: string;
  course: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  dueHoursLeft: number;
  type: 'Assignment' | 'Lab Quiz' | 'Project' | 'Exam';
  points: number;
  weightage: string;
  status: 'pending' | 'submitted' | 'urgent';
  screenTarget?: ActiveScreen;
}

export const INITIAL_DEADLINES: DeadlineItem[] = [
  {
    id: 'dl-1',
    title: 'Assignment 4: Multi-variable Integration & Stokes Theorem',
    course: 'Advanced Calculus',
    subject: 'Mathematics',
    dueDate: 'Today, Oct 24',
    dueTime: '11:59 PM',
    dueHoursLeft: 14,
    type: 'Assignment',
    points: 50,
    weightage: '10% of Final Grade',
    status: 'urgent',
    screenTarget: 'mcq-assessment'
  },
  {
    id: 'dl-2',
    title: 'Lab Quiz 2: Binary Search Trees & AVL Balance',
    course: 'Data Structures & Algorithms',
    subject: 'Computer Science',
    dueDate: 'Tomorrow, Oct 25',
    dueTime: '4:00 PM',
    dueHoursLeft: 30,
    type: 'Lab Quiz',
    points: 30,
    weightage: '5% of Lab Grade',
    status: 'pending',
    screenTarget: 'mcq-assessment'
  },
  {
    id: 'dl-3',
    title: 'Organic Synthesis Lab Report #3 (Spectroscopy)',
    course: 'Organic Chemistry Basics',
    subject: 'Chemistry',
    dueDate: 'Thursday, Oct 26',
    dueTime: '5:00 PM',
    dueHoursLeft: 54,
    type: 'Project',
    points: 100,
    weightage: '15% of Lab Grade',
    status: 'pending'
  },
  {
    id: 'dl-4',
    title: 'GATE Mechanical Thermodynamics Test Series #1',
    course: 'GATE Prep Series',
    subject: 'Mechanical Eng.',
    dueDate: 'Saturday, Oct 28',
    dueTime: '10:00 AM',
    dueHoursLeft: 96,
    type: 'Exam',
    points: 100,
    weightage: 'Mock Ranking Test',
    status: 'pending',
    screenTarget: 'elite-mocks'
  },
  {
    id: 'dl-5',
    title: 'Linear Algebra Quiz 1: Matrix Inversion & Rank',
    course: 'Engineering Mathematics',
    subject: 'Mathematics',
    dueDate: 'Oct 20, 2026',
    dueTime: '11:59 PM',
    dueHoursLeft: 0,
    type: 'Lab Quiz',
    points: 25,
    weightage: '5% of Grade',
    status: 'submitted'
  }
];

interface UpcomingDeadlinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenVideoPlayer: (title: string, subject: string) => void;
}

export const UpcomingDeadlinesModal: React.FC<UpcomingDeadlinesModalProps> = ({
  isOpen,
  onClose,
  setActiveScreen,
  onOpenVideoPlayer
}) => {
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(INITIAL_DEADLINES);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'urgent' | 'submitted'>('all');
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleSubmit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeadlines(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'submitted' ? 'pending' : 'submitted';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const handleSetReminder = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReminderToast(`Study reminder set for "${title}"!`);
    setTimeout(() => {
      setReminderToast(null);
    }, 3000);
  };

  const filteredDeadlines = deadlines.filter(d => {
    if (activeFilter === 'pending') return d.status === 'pending' || d.status === 'urgent';
    if (activeFilter === 'urgent') return d.status === 'urgent';
    if (activeFilter === 'submitted') return d.status === 'submitted';
    return true;
  });

  const pendingCount = deadlines.filter(d => d.status === 'pending' || d.status === 'urgent').length;
  const urgentCount = deadlines.filter(d => d.status === 'urgent').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl bg-[#0c0c1a] border border-white/15 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-950/70 via-[#0c0c1a] to-purple-950/60 relative">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-md">
              <Calendar className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Upcoming Deadlines</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  {pendingCount} Pending
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Track assignments, graded quizzes, and submission milestones
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reminder Notification Toast */}
        <AnimatePresence>
          {reminderToast && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-500/20 border-b border-emerald-500/30 px-5 py-2.5 flex items-center justify-between text-emerald-300 text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{reminderToast}</span>
              </div>
              <button onClick={() => setReminderToast(null)} className="text-emerald-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Pills Bar */}
        <div className="px-5 sm:px-6 pt-4 pb-3 flex items-center justify-between gap-2 border-b border-white/5 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              All ({deadlines.length})
            </button>
            <button
              onClick={() => setActiveFilter('urgent')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === 'urgent'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
              Due Today ({urgentCount})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'pending'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveFilter('submitted')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'submitted'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Completed ({deadlines.filter(d => d.status === 'submitted').length})
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              setActiveScreen('study-timer');
            }}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0 ml-auto"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Focus Session</span>
          </button>
        </div>

        {/* Deadlines List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 flex-1 divide-y divide-white/5">
          {filteredDeadlines.map((item) => {
            const isUrgent = item.status === 'urgent';
            const isSubmitted = item.status === 'submitted';

            return (
              <div
                key={item.id}
                className={`pt-3.5 first:pt-0 group p-4 rounded-2xl transition-all border ${
                  isUrgent
                    ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/50'
                    : isSubmitted
                    ? 'bg-emerald-950/15 border-emerald-500/20 opacity-75'
                    : 'bg-white/[0.03] border-white/10 hover:border-indigo-500/30 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 space-y-1.5">
                    {/* Badges & Tags */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {item.course}
                      </span>
                      <span className="font-semibold px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/10">
                        {item.type}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {item.points} Pts • {item.weightage}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className={`text-sm sm:text-base font-bold text-white group-hover:text-indigo-200 transition-colors ${
                      isSubmitted ? 'line-through text-slate-400' : ''
                    }`}>
                      {item.title}
                    </h4>

                    {/* Due Time & Urgency */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`font-semibold flex items-center gap-1 ${
                        isUrgent ? 'text-red-400' : isSubmitted ? 'text-emerald-400' : 'text-slate-300'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        {item.dueDate} at {item.dueTime}
                      </span>

                      {isUrgent && (
                        <span className="text-[11px] font-bold text-red-300 bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Due in {item.dueHoursLeft}h
                        </span>
                      )}

                      {isSubmitted && (
                        <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Submitted
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={(e) => handleSetReminder(item.title, e)}
                      title="Set reminder"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-indigo-300 border border-white/10 transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleToggleSubmit(item.id, e)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        isSubmitted
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/20'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSubmitted ? 'Completed' : 'Mark Done'}</span>
                    </button>

                    {item.screenTarget && !isSubmitted && (
                      <button
                        onClick={() => {
                          onClose();
                          setActiveScreen(item.screenTarget!);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-indigo-950/50"
                      >
                        <span>Start</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Summary */}
        <div className="p-4 sm:p-5 bg-[#080812] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Automatic calendar sync enabled with Institutional LMS portal</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenVideoPlayer('Integration Techniques & Applications', 'Mathematics');
            }}
            className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
          >
            <span>Resume Calculus Lecture</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
