import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { 
  Award, 
  BookOpen, 
  Clock, 
  Target, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  AlertCircle,
  ShieldCheck,
  Camera,
  FileText,
  Phone,
  Lock,
  ExternalLink,
  Edit3,
  Train,
  BrainCircuit,
  Layers,
  Bot
} from 'lucide-react';
import { StudySessionLauncherCard } from './timer/StudySessionLauncherCard';
import { useStudentAuth } from '../context/StudentAuthContext';
import { useEliteProof } from '../context/EliteProofContext';
import { EliteStudentProofModal } from './modals/EliteStudentProofModal';

interface EliteDashboardProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenVideoPlayer: (title: string, subject: string) => void;
}

export const EliteDashboard: React.FC<EliteDashboardProps> = ({
  setActiveScreen,
  onOpenVideoPlayer
}) => {
  const { currentUser } = useStudentAuth();
  const { getStudentProof } = useEliteProof();
  const [isQuickProofModalOpen, setIsQuickProofModalOpen] = useState(false);

  const activeProof = getStudentProof(currentUser?.id || 'stu-1');
  const maskedAadhaar = activeProof.aadhaarNumber.replace(/(\d{4})\s(\d{4})\s(\d{4})/, '•••• •••• $3');
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 pb-28 md:pb-12 animate-in fade-in duration-200">
      {/* Quick Modal for Proof Upload */}
      <EliteStudentProofModal
        isOpen={isQuickProofModalOpen}
        onClose={() => setIsQuickProofModalOpen(false)}
        onOpenFullDossier={() => setActiveScreen('elite-proofs')}
      />

      {/* UPSC Target Header */}
      <section className="bg-gradient-to-br from-indigo-950/90 via-purple-950/70 to-[#0c0c18] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-500/30 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              UPSC CSE 2025 Target
            </span>
            <span className="text-xs text-indigo-300 font-mono">Prelims: 214 Days Left</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-academy tracking-tight leading-snug">
            Morning, Aspirant.<br />
            Primary Objective: GS Paper 1
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200/90 mt-2 leading-relaxed">
            Your current study velocity puts you in the top 0.5% of test takers. Maintain your daily revision cadence.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setActiveScreen('elite-mocks')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs sm:text-sm hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Mock Test Series</span>
          </button>
          <button
            onClick={() => setActiveScreen('elite-report')}
            className="px-5 py-3.5 rounded-2xl bg-white/10 text-white font-bold text-xs sm:text-sm hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-1.5 backdrop-blur-sm"
          >
            <span>All India Rank Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Railway Recruitment Board (RRB) Exams Master Hub Banner */}
      <section className="bg-gradient-to-r from-amber-950/60 via-[#121026] to-purple-950/70 rounded-3xl p-6 border border-amber-500/40 shadow-xl shadow-black/30 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Train className="w-3 h-3 text-amber-400" />
              <span>RRB Centralized Exams 2026</span>
            </span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              NTPC • ALP • JE • Group D • RPF
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-academy text-white">
            Railway Recruitment Board (RRB) Examination Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Full TCS iON online CBT simulation, Loco Pilot (ALP) 5-battery psycho test simulator, all 21 zones cutoff tracker, and Railway Super Pass enrollment.
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('rrb-exams')}
          className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-950/50 border border-amber-400/40 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Train className="w-4 h-4" />
          <span>Launch RRB Portal</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      {/* Dedicated Section: Elite Academy Candidate Proof & KYC Verification (FOR ELITE ACADEMY ONLY) */}
      <section className="bg-gradient-to-br from-[#121024] via-[#0d0d1e] to-[#070712] rounded-3xl p-6 border border-amber-500/30 shadow-xl shadow-black/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Candidate Photo Thumbnail */}
            <div className="relative shrink-0">
              <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md bg-black">
                <img
                  src={activeProof.photoUrl || currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3" />
                  <span>ASCEND STALTECH INDIAA Verification</span>
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>KYC Verified</span>
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white font-serif-academy">
                Candidate Proofs &amp; Emergency Dispatch Protocol
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Aadhaar: <strong className="font-mono text-white">{maskedAadhaar}</strong></span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-rose-400" />
                  <span>Emergency: <strong className="text-white">{activeProof.emergencyContactName} ({activeProof.emergencyContactPhone})</strong></span>
                </span>
                <span className="text-amber-300 font-semibold font-mono">
                  Blood Group: {activeProof.emergencyBloodGroup || 'O+'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => setIsQuickProofModalOpen(true)}
              className="flex-1 lg:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>Quick Update</span>
            </button>

            <button
              onClick={() => setActiveScreen('elite-proofs')}
              className="flex-1 lg:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-amber-950/50 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Manage Candidate Proofs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid: Aspirant Performance Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20 flex flex-col justify-between h-32 hover:border-indigo-500/40 hover:bg-[#111124] transition-all">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>ESTIMATED AIR</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">AIR 241</p>
            <p className="text-xs text-emerald-400 font-bold mt-0.5">Top 0.5% (45,000 Aspirants)</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20 flex flex-col justify-between h-32 hover:border-indigo-500/40 hover:bg-[#111124] transition-all">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>MOCK ACCURACY</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">82.4%</p>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Prelims GS Paper I</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20 flex flex-col justify-between h-32 hover:border-indigo-500/40 hover:bg-[#111124] transition-all">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>MAINS ANSWERS</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">18 / 20</p>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Faculty Evaluated</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0c0c18]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20 flex flex-col justify-between h-32 hover:border-indigo-500/40 hover:bg-[#111124] transition-all">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>STUDY STREAK</span>
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-orange-400">42 Days</p>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Consistency Index: High</p>
          </div>
        </div>
      </section>

      {/* Persistent Aspirant Study Session Countdown Launcher */}
      <StudySessionLauncherCard defaultSubject="UPSC Prelims GS" />

      {/* Daily Study Cadence & Active Modules */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Physical Geography */}
        <div className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg shadow-black/20 flex flex-col justify-between gap-4 hover:border-indigo-500/40 hover:bg-[#111124] transition-all">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                GS Paper 1 • Geography
              </span>
              <span className="text-xs font-bold text-emerald-400">3h 45m / 5h Target</span>
            </div>
            <h3 className="text-xl font-bold font-serif-academy text-white mt-1">
              Geomorphology & Continental Drift Theory
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Plate tectonics, volcanic landforms, seismic waves, and geomorphic cycles according to Davis & Penck.
            </p>
          </div>

          <div>
            <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden mb-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style={{ width: '75%' }}></div>
            </div>

            <button
              onClick={() => onOpenVideoPlayer('Geomorphology & Continental Drift Theory', 'UPSC Geography')}
              className="w-full py-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Resume Study Lecture</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Module 2: Indian Polity */}
        <div className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg shadow-black/20 flex flex-col justify-between gap-4 hover:border-indigo-500/40 hover:bg-[#111124] transition-all">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                GS Paper 2 • Indian Polity
              </span>
              <span className="text-xs font-bold text-emerald-400">68% Syllabus Covered</span>
            </div>
            <h3 className="text-xl font-bold font-serif-academy text-white mt-1">
              Constitutional Framework & Fundamental Rights
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Articles 14-32, Basic Structure Doctrine, Judicial Review, and Landmark Supreme Court Verdicts (Kesavananda Bharati).
            </p>
          </div>

          <div>
            <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden mb-3">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '68%' }}></div>
            </div>

            <button
              onClick={() => onOpenVideoPlayer('Constitutional Framework & Fundamental Rights', 'UPSC Polity')}
              className="w-full py-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Resume Study Lecture</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Daily Mains Answer Writing Prompt */}
      <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg shadow-black/20">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base sm:text-lg font-bold font-serif-academy text-white">
              Daily Mains Answer Writing Challenge
            </h3>
          </div>
          <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
            15 Marks • 250 Words
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-white/[0.04] p-4 rounded-2xl border border-white/10">
          "Discuss the constitutional validity of executive ordinances under Article 123. Does frequent ordinance promulgation violate the doctrine of separation of powers? Support with judicial precedents."
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          {answerSubmitted ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Draft submitted to Faculty Review Queue. Evaluator assigned: Dr. Reed.</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Word count target: 200–250 words</span>
          )}
          <button 
            onClick={() => setAnswerSubmitted(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm hover:from-indigo-500 hover:to-purple-500 transition-all border border-indigo-400/30 shadow-lg shadow-indigo-950/40 active:scale-95"
          >
            {answerSubmitted ? 'Resubmit Draft' : 'Submit Answer for Faculty Review'}
          </button>
        </div>
      </section>

      {/* Official YouTube Video Masterclass Banner */}
      <section className="bg-gradient-to-r from-red-950/50 via-[#0e0c18] to-purple-950/30 rounded-3xl p-6 border border-red-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-900/50">
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-red-400">
                Official YouTube Stream
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                @ascendstaltechindiaa158
              </span>
            </div>
            <h3 className="text-lg font-bold font-serif-academy text-white mt-0.5">
              ASCEND STALTECH INDIAA Video Lectures
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Watch official competitive exam lectures, live syllabus deep-dives & video explanations.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => onOpenVideoPlayer('ASCEND STALTECH INDIAA Lecture 1', 'Competitive Masterclass')}
            className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-white font-bold text-xs transition-all flex items-center gap-2"
          >
            <span>Play Lecture 1</span>
          </button>
          <a
            href="http://www.youtube.com/@ascendstaltechindiaa158"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2"
          >
            <span>Visit Channel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Advanced Aspirant Cognitive Accelerators */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-black uppercase tracking-widest text-purple-400">
                Aspirant Cognitive Toolkit
              </span>
            </div>
            <h3 className="text-xl font-bold font-serif-academy text-white mt-0.5">
              High-Yield Preparation Accelerators
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveScreen('flashcards')}
            className="bg-[#0c0c18]/80 hover:bg-[#121128] border border-indigo-500/30 hover:border-indigo-400/60 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between h-48 group shadow-lg"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white group-hover:text-indigo-300 transition-colors text-sm">
                Spaced Flashcards
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2">
                Active recall &amp; audio readout across GATE Engineering, Indian Polity &amp; Science.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-indigo-400 pt-2 border-t border-white/10">
              <span>Review Cards</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setActiveScreen('formula-bank')}
            className="bg-[#0c0c18]/80 hover:bg-[#15102a] border border-purple-500/30 hover:border-purple-400/60 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between h-48 group shadow-lg"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors text-sm">
                Formula Bank &amp; Traps
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2">
                Essential equations, SI units, negative-marking pitfalls &amp; printable cheat sheets.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-purple-400 pt-2 border-t border-white/10">
              <span>Open Vault</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setActiveScreen('exam-readiness')}
            className="bg-[#0c0c18]/80 hover:bg-[#0e1820] border border-emerald-500/30 hover:border-emerald-400/60 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between h-48 group shadow-lg"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white group-hover:text-emerald-300 transition-colors text-sm">
                Exam Readiness Radar
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2">
                Multi-metric AIR predictive radar, accuracy diagnostic &amp; 30-day revision sprint roadmap.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 pt-2 border-t border-white/10">
              <span>View Diagnostics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setActiveScreen('ai-tutor')}
            className="bg-[#0c0c18]/80 hover:bg-[#181128] border border-indigo-500/30 hover:border-indigo-400/60 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between h-48 group shadow-lg"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white group-hover:text-indigo-300 transition-colors text-sm">
                AI Faculty Mentors
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2">
                Real-time doubt solver with specialized UPSC, GATE &amp; RRB faculty mentors.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-indigo-400 pt-2 border-t border-white/10">
              <span>Consult Mentors</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
