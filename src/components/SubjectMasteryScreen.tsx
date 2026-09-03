import React from 'react';
import { AVATAR_TEACHER_URL } from '../data/mockData';
import { ArrowLeft, MessageSquare, BookOpen, Award, CheckCircle, Clock, ChevronRight } from 'lucide-react';

interface SubjectMasteryScreenProps {
  onBack: () => void;
  onOpenTeacherChat: () => void;
}

export const SubjectMasteryScreen: React.FC<SubjectMasteryScreenProps> = ({
  onBack,
  onOpenTeacherChat
}) => {
  const topics = [
    { title: 'Differential Calculus', progress: 100, status: 'Completed', color: '#10b981' },
    { title: 'Integral Calculus', progress: 85, status: 'In Progress', color: '#10b981' },
    { title: 'Linear Algebra', progress: 40, status: 'Started', color: '#6366f1' },
    { title: 'Probability & Statistics', progress: 0, status: 'Upcoming', color: '#64748b' }
  ];

  const tests = [
    { title: 'Midterm 1: Comprehensive Calculus', score: '92 / 100', grade: 'Grade A', date: 'Oct 15, 2023' },
    { title: 'Weekly Quiz 4: Integration Techniques', score: '18 / 20', grade: 'Grade A+', date: 'Oct 21, 2023' },
    { title: 'Weekly Quiz 3: Limit Theorems', score: '15 / 20', grade: 'Grade B', date: 'Oct 07, 2023' }
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
            <h1 className="text-lg sm:text-xl font-bold text-white font-serif-academy">Subject Mastery</h1>
            <p className="text-xs text-slate-400">Mathematics Track • 4 Modules</p>
          </div>
        </div>

        {/* Talk to Teacher Action */}
        <button
          onClick={onOpenTeacherChat}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-950/50 active:scale-95 border border-indigo-400/30"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/40">
            <img src={AVATAR_TEACHER_URL} alt="Teacher" className="w-full h-full object-cover" />
          </div>
          <span>Talk to Teacher</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Subject Overview Banner */}
        <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg shadow-black/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 px-2.5 py-1 rounded-lg uppercase">
              Advanced Mathematics
            </span>
            <h2 className="text-2xl font-bold text-white mt-2 font-serif-academy">Overall Mastery: 92%</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Assigned Instructor: <span className="font-semibold text-slate-200">Dr. Evelyn Reed</span>
            </p>
          </div>

          <div className="w-full sm:w-48 bg-white/10 h-3 rounded-full overflow-hidden border border-white/10">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '92%' }}></div>
          </div>
        </section>

        {/* Topic Breakdown Progress */}
        <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg shadow-black/20 space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-white font-serif-academy">Curriculum Topics & Coverage</h3>

          <div className="space-y-4">
            {topics.map((topic, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-bold text-slate-200">{topic.title}</span>
                  <span className="font-bold text-indigo-300">{topic.progress}% ({topic.status})</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${topic.progress}%`, backgroundColor: topic.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Test History */}
        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white font-serif-academy">Recent Math Test Scores</h3>

          <div className="space-y-2.5">
            {tests.map((test, idx) => (
              <div key={idx} className="bg-[#0c0c18]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg shadow-black/20 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white">{test.title}</h4>
                  <p className="text-xs text-slate-400">{test.date}</p>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-indigo-300 block">{test.score}</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {test.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
