import React, { useState } from 'react';
import { ActiveScreen, Course } from '../../types';
import {
  RRB_EXAM_OVERVIEWS,
  RRB_ZONE_CUTOFFS,
  RAILWAY_GK_CAPSULES,
  RRBExamOverview
} from '../../data/rrbExamData';
import { RRBCbtSimulator } from './RRBCbtSimulator';
import { RRBPsychoTestSimulator } from './RRBPsychoTestSimulator';
import {
  Train,
  Gauge,
  Wrench,
  Hammer,
  Shield,
  Clock,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Search,
  Filter,
  Layers,
  ArrowRight,
  TrendingUp,
  FileText,
  MapPin,
  Sparkles,
  Zap,
  GraduationCap,
  Calendar,
  AlertCircle,
  CreditCard,
  QrCode,
  DollarSign
} from 'lucide-react';

interface RRBExamsPortalProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  onSelectCourseForCheckout?: (course: Course) => void;
  onOpenVideoPlayer?: (title: string, subject: string) => void;
}

export const RRBExamsPortal: React.FC<RRBExamsPortalProps> = ({
  setActiveScreen,
  onSelectCourseForCheckout,
  onOpenVideoPlayer
}) => {
  const [activeTab, setActiveTab] = useState<'exams' | 'cbt-mock' | 'psycho' | 'cutoffs' | 'gk-study'>('exams');
  const [selectedExamId, setSelectedExamId] = useState<string>('ntpc');
  const [cutoffSearchQuery, setCutoffSearchQuery] = useState('');
  const [selectedStageTab, setSelectedStageTab] = useState<number>(0);
  
  // Modal/Sub-screen state
  const [isCbtRunning, setIsCbtRunning] = useState(false);
  const [isPsychoRunning, setIsPsychoRunning] = useState(false);

  const currentExam = RRB_EXAM_OVERVIEWS.find((e) => e.id === selectedExamId) || RRB_EXAM_OVERVIEWS[0];

  // If CBT Simulator is active
  if (isCbtRunning) {
    return (
      <RRBCbtSimulator
        onBack={() => setIsCbtRunning(false)}
        examTitle={`${currentExam.title} All India CBT-1 Simulation`}
        examType={currentExam.badge}
      />
    );
  }

  // If Psycho Test Simulator is active
  if (isPsychoRunning) {
    return <RRBPsychoTestSimulator onBack={() => setIsPsychoRunning(false)} />;
  }

  const filteredCutoffs = RRB_ZONE_CUTOFFS.filter(
    (z) =>
      z.zoneName.toLowerCase().includes(cutoffSearchQuery.toLowerCase()) ||
      z.zoneCode.toLowerCase().includes(cutoffSearchQuery.toLowerCase()) ||
      z.headquarters.toLowerCase().includes(cutoffSearchQuery.toLowerCase())
  );

  const handleEnrollRailwayPass = () => {
    const rrbPassCourse: Course = {
      id: 'rrb-super-pass-2026',
      title: 'RRB NTPC & ALP Complete Target Master Pass 2026',
      category: 'Railway Recruitment Board',
      subject: 'RRB Comprehensive CBT & CBAT',
      price: 499,
      rating: 4.95,
      reviewsCount: '8.6k Aspirants',
      duration: '180+ Hours Video & 150 CBT Mocks',
      description: 'Complete Indian Railways preparation pack with full TCS iON CBT Mocks, General Science NCERT drills, Math shortcuts & ALP Psycho batteries.',
      imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop&q=80',
      chaptersCount: 64,
      subjectsCount: 5,
      isEnrolled: false,
      instructor: 'Chief Railway Mentor Ram Prasath & RDSO Faculty',
      level: 'All Levels (10th, 12th & Degree)'
    };

    if (onSelectCourseForCheckout) {
      onSelectCourseForCheckout(rrbPassCourse);
      setActiveScreen('checkout');
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] immersive-bg text-slate-200 pb-20 animate-in fade-in duration-200">
      {/* Top Banner with Railway Live Recruitment Alert */}
      <div className="bg-gradient-to-r from-amber-600/30 via-indigo-950 to-purple-950 border-b border-amber-500/30 px-4 py-2 text-xs flex items-center justify-between text-amber-200">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span className="font-bold uppercase tracking-wider text-amber-300">
            OFFICIAL RRB 2026 NOTIFICATION:
          </span>
          <span className="truncate text-slate-200">
            RRB NTPC (35,280+ Posts), ALP (18,799+ Posts), JE (7,951+ Posts) & Group D Level-1 Centralized Notifications Live!
          </span>
        </div>
        <button
          onClick={handleEnrollRailwayPass}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[11px] hover:bg-amber-300 transition-colors shadow-xs"
        >
          <span>Get RRB Pass</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/10">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                <Train className="w-3.5 h-3.5 text-indigo-400" />
                Ministry of Railways (Government of India)
              </span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                All 21 RRB Zones
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif-academy text-white tracking-tight leading-tight">
              Railway Recruitment Board <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400 bg-clip-text text-transparent">
                (RRB) Examination Portal
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Comprehensive prep ecosystem for Indian Railways career exams — featuring TCS iON CBT simulation engine, Loco Pilot Psycho test batteries, zone-wise cutoff analytics, and verified candidate pass registration.
            </p>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => setIsCbtRunning(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-950/60 border border-indigo-400/40 transition-all active:scale-95"
              >
                <Layers className="w-4 h-4" />
                <span>Launch Live RRB CBT Mock</span>
              </button>

              <button
                onClick={() => setIsPsychoRunning(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 border border-amber-500/40 transition-all"
              >
                <Gauge className="w-4 h-4 text-amber-400" />
                <span>Loco Pilot Psycho Simulator</span>
              </button>

              <button
                onClick={handleEnrollRailwayPass}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/10 transition-all"
              >
                <QrCode className="w-4 h-4 text-indigo-400" />
                <span>Super Pass Enrollment</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="w-full lg:w-80 bg-gradient-to-br from-[#101026] to-[#0a0a16] border border-white/15 rounded-3xl p-5 shadow-2xl space-y-3 shrink-0">
            <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Recruitment Overview
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                Active 2026 Cycle
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Railway Vacancies:</span>
                <span className="font-bold text-emerald-400 text-sm">1,60,000+ Posts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Marking Scheme:</span>
                <span className="font-mono font-bold text-amber-300">+1.00 / -0.33</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Exam Mode:</span>
                <span className="font-bold text-white">Online CBT (TCS iON)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Registered Aspirants:</span>
                <span className="font-bold text-indigo-300">1.25 Crore+</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <div className="p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-[11px] text-indigo-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Bilingual English & Hindi support with live formula sheets.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="mt-8 flex bg-white/[0.04] p-1 rounded-2xl border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('exams')}
            className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'exams'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Exams & Syllabus</span>
          </button>

          <button
            onClick={() => setActiveTab('cbt-mock')}
            className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'cbt-mock'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Live CBT Mock</span>
          </button>

          <button
            onClick={() => setActiveTab('psycho')}
            className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'psycho'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>ALP Psycho (CBAT)</span>
          </button>

          <button
            onClick={() => setActiveTab('cutoffs')}
            className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'cutoffs'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>21 Zones Cutoffs</span>
          </button>

          <button
            onClick={() => setActiveTab('gk-study')}
            className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'gk-study'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Railway GK & Shortcuts</span>
          </button>
        </div>
      </section>

      {/* Tab 1: Detailed Exam Catalog & Selection Process */}
      {activeTab === 'exams' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Horizontal Exam Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {RRB_EXAM_OVERVIEWS.map((exam) => {
              const isSelected = selectedExamId === exam.id;
              return (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedExamId(exam.id);
                    setSelectedStageTab(0);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? `border-indigo-400 bg-gradient-to-b from-[#14142e] to-[#0c0c18] text-white shadow-xl shadow-indigo-950/40 scale-[1.02]`
                      : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                      {exam.id === 'ntpc' && <Train className="w-4 h-4 text-blue-400" />}
                      {exam.id === 'alp' && <Gauge className="w-4 h-4 text-amber-400" />}
                      {exam.id === 'je' && <Wrench className="w-4 h-4 text-emerald-400" />}
                      {exam.id === 'group-d' && <Hammer className="w-4 h-4 text-purple-400" />}
                      {exam.id === 'rpf' && <Shield className="w-4 h-4 text-rose-400" />}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                      {exam.totalPostsAnnounced.split(' ')[0]}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white truncate">{exam.title}</h3>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{exam.badge}</p>
                </button>
              );
            })}
          </div>

          {/* Selected Exam Master Blueprint */}
          <div className="bg-[#0c0c18]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Header Details */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${currentExam.gradient}`}>
                    {currentExam.badge}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">
                    {currentExam.totalPostsAnnounced}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif-academy text-white">
                  {currentExam.title} Master Blueprint
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">{currentExam.tagline}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCbtRunning(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-950/50"
                >
                  <Layers className="w-4 h-4" />
                  <span>Start Mock Test</span>
                </button>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Eligibility Criteria
                </span>
                <p className="text-xs font-semibold text-white leading-relaxed">
                  {currentExam.eligibility}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Age Limits & Relaxation
                </span>
                <p className="text-xs font-semibold text-white leading-relaxed">
                  {currentExam.ageLimit}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Pay Matrix & Grade Pay
                </span>
                <p className="text-xs font-semibold text-emerald-400 leading-relaxed">
                  {currentExam.payScale}
                </p>
              </div>
            </div>

            {/* Exam Pattern & Stages Tabs */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Examination Pattern & Sectional Weightage:</span>
              </h4>

              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                {currentExam.stages.map((stage, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedStageTab(idx)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      selectedStageTab === idx
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {stage.name}
                  </button>
                ))}
              </div>

              {/* Stage Table */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Duration: </span>
                    <strong className="text-white">{currentExam.stages[selectedStageTab].duration}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Questions: </span>
                    <strong className="text-white">{currentExam.stages[selectedStageTab].questionsCount}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Marks: </span>
                    <strong className="text-white">{currentExam.stages[selectedStageTab].marks}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Negative Marking: </span>
                    <strong className="text-rose-400">{currentExam.stages[selectedStageTab].negativeMarking}</strong>
                  </div>
                </div>

                {/* Section breakdown table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400">
                        <th className="pb-2">Test Subject / Section</th>
                        <th className="pb-2 text-center">Number of Questions</th>
                        <th className="pb-2 text-right">Maximum Marks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {currentExam.stages[selectedStageTab].sections.map((sec, i) => (
                        <tr key={i} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 font-medium text-white">{sec.name}</td>
                          <td className="py-2.5 text-center font-mono">{sec.questions} Qs</td>
                          <td className="py-2.5 text-right font-mono text-emerald-400 font-bold">
                            {sec.marks} Marks
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Popular Posts & Key Syllabus Topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Cadres & Designations Covered:</span>
                </h4>
                <div className="space-y-1.5">
                  {currentExam.popularPosts.map((post, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{post}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>High-Weightage Core Topics:</span>
                </h4>
                <div className="space-y-1.5">
                  {currentExam.keySyllabusTopics.map((topic, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 flex items-center gap-2"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Tab 2: Live CBT Mock Test Launcher */}
      {activeTab === 'cbt-mock' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold font-serif-academy text-white">
                All India Railway CBT Examination Series
              </h2>
              <p className="text-xs text-slate-400">
                100% authentic TCS iON software interface with live question palette & instant bilingual solutions.
              </p>
            </div>

            <button
              onClick={() => setIsCbtRunning(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50"
            >
              <Layers className="w-4 h-4" />
              <span>Launch Full CBT-1 Test</span>
            </button>
          </div>

          {/* Featured Full CBT Card */}
          <div className="bg-gradient-to-br from-[#121226] via-[#0c0c18] to-indigo-950/40 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1.5 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Official TCS iON Test Pattern Live
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-academy text-white">
                RRB NTPC & ALP Combined Stage-1 Full Mock Test #01
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Covers General Science (Physics, Chemistry, Biology), Mathematics, General Intelligence & Reasoning, and Indian Railways GK with real negative marking.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
                <span>• 100 Questions</span>
                <span>• 90 Minutes</span>
                <span>• 100 Marks</span>
                <span>• Bilingual (English/Hindi)</span>
              </div>
            </div>

            <button
              onClick={() => setIsCbtRunning(true)}
              className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-950/60 border border-indigo-400/40 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Begin Examination</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sectional Drill Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#0c0c18]/90 border border-white/10 rounded-2xl p-5 space-y-3">
              <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">
                Science Sectional
              </span>
              <h4 className="text-base font-bold text-white">
                Railway General Science 1000 MCQ Master Drill
              </h4>
              <p className="text-xs text-slate-400">
                NCERT Class 9-10 based Physics, Chemical Reactions & Human Biology.
              </p>
              <button
                onClick={() => setIsCbtRunning(true)}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Start Drill (25 Qs)
              </button>
            </div>

            <div className="bg-[#0c0c18]/90 border border-white/10 rounded-2xl p-5 space-y-3">
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                Quantitative Aptitude
              </span>
              <h4 className="text-base font-bold text-white">
                Trains, Relative Speed & Pipes Cisterns Sprint
              </h4>
              <p className="text-xs text-slate-400">
                High-probability questions with 10-second shortcut formulas.
              </p>
              <button
                onClick={() => setIsCbtRunning(true)}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Start Drill (30 Qs)
              </button>
            </div>

            <div className="bg-[#0c0c18]/90 border border-white/10 rounded-2xl p-5 space-y-3">
              <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                Basic Science & Engg
              </span>
              <h4 className="text-base font-bold text-white">
                RRB ALP Part-A Mechanics & Levers Test
              </h4>
              <p className="text-xs text-slate-400">
                Class 1/2/3 levers, mechanical advantage & engineering drawing views.
              </p>
              <button
                onClick={() => setIsCbtRunning(true)}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Start Drill (40 Qs)
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Tab 3: ALP Psycho / CBAT Simulator */}
      {activeTab === 'psycho' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold font-serif-academy text-white">
                RRB ALP Computer Based Aptitude Test (CBAT)
              </h2>
              <p className="text-xs text-slate-400">
                Research Designs & Standards Organisation (RDSO) 5-Battery Aptitude Suite for Assistant Loco Pilots.
              </p>
            </div>

            <button
              onClick={() => setIsPsychoRunning(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-950/50"
            >
              <Gauge className="w-4 h-4 fill-slate-950" />
              <span>Launch Psycho Test Simulator</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-[#0c0c18]/90 border border-white/10 rounded-3xl p-6 space-y-3">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Battery 1
              </span>
              <h3 className="text-base font-bold text-white">Memory Test (Building/Track Map)</h3>
              <p className="text-xs text-slate-400">
                Memorize relative locations of stations, signals and cabins, then place them on blank grid.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-400">
                Min 42 T-Score Required
              </div>
            </div>

            <div className="bg-[#0c0c18]/90 border border-white/10 rounded-3xl p-6 space-y-3">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Battery 2
              </span>
              <h3 className="text-base font-bold text-white">Following Directions / Table Test</h3>
              <p className="text-xs text-slate-400">
                Navigate alphabet grids using clockwise, counter-clockwise & diagonal navigation rules.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-400">
                Min 42 T-Score Required
              </div>
            </div>

            <div className="bg-[#0c0c18]/90 border border-white/10 rounded-3xl p-6 space-y-3">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Battery 3
              </span>
              <h3 className="text-base font-bold text-white">Depth Perception (Brick Test)</h3>
              <p className="text-xs text-slate-400">
                Count exact direct face contacts for designated isometric bricks in 3D perspective.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-400">
                Min 42 T-Score Required
              </div>
            </div>

            <div className="bg-[#0c0c18]/90 border border-white/10 rounded-3xl p-6 space-y-3">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Battery 4
              </span>
              <h3 className="text-base font-bold text-white">Concentration Test (Find 6s & 9s)</h3>
              <p className="text-xs text-slate-400">
                Rapid optical search to detect numbers 6 or 9 under high-speed countdown constraints.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-400">
                Min 42 T-Score Required
              </div>
            </div>

            <div className="bg-[#0c0c18]/90 border border-white/10 rounded-3xl p-6 space-y-3">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Battery 5
              </span>
              <h3 className="text-base font-bold text-white">Perceptual Speed Test</h3>
              <p className="text-xs text-slate-400">
                Match subtle railway signaling patterns amongst confusing distractor geometries.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-400">
                Min 42 T-Score Required
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-950/40 via-[#0c0c18] to-indigo-950/40 border border-amber-500/40 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Psychological Aptitude Rule
                </span>
                <h3 className="text-base font-bold text-white">
                  Formula for T-Score Calculation
                </h3>
                <p className="text-xs text-slate-300 mt-2 font-mono bg-black/40 p-2 rounded-lg border border-white/10">
                  T = 50 + 10 × [(Score - Mean) / StdDev]
                </p>
              </div>

              <button
                onClick={() => setIsPsychoRunning(true)}
                className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Practice Full Psycho Battery
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Tab 4: 21 Zones Cutoff & Vacancy Tracker */}
      {activeTab === 'cutoffs' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold font-serif-academy text-white">
                Official 21 RRB Zones Cutoff & Vacancy Analytics
              </h2>
              <p className="text-xs text-slate-400">
                Normalized CBT-1 & CBT-2 cutoff benchmarks categorized by UR, OBC, SC, ST, and EWS quotas.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cutoffSearchQuery}
                onChange={(e) => setCutoffSearchQuery(e.target.value)}
                placeholder="Search Zone (e.g. Chennai, Mumbai)..."
                className="w-full bg-[#0c0c18] border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Zones Table / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCutoffs.map((zone) => (
              <div
                key={zone.zoneCode}
                className="bg-[#0c0c18]/90 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                      Code: {zone.zoneCode}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{zone.zoneName}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {zone.headquarters}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Active Vacancies
                    </span>
                    <span className="text-base font-bold font-mono text-emerald-400">
                      {zone.activeVacancies.toLocaleString()} Posts
                    </span>
                  </div>
                </div>

                {/* Cutoff Score Badges */}
                <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-white/10 text-center">
                  <div className="bg-white/[0.04] p-2 rounded-xl border border-white/5">
                    <span className="text-[9px] font-bold text-slate-400 block">UR</span>
                    <span className="text-xs font-bold font-mono text-white">{zone.urCutoff}</span>
                  </div>
                  <div className="bg-white/[0.04] p-2 rounded-xl border border-white/5">
                    <span className="text-[9px] font-bold text-slate-400 block">OBC</span>
                    <span className="text-xs font-bold font-mono text-indigo-300">
                      {zone.obcCutoff}
                    </span>
                  </div>
                  <div className="bg-white/[0.04] p-2 rounded-xl border border-white/5">
                    <span className="text-[9px] font-bold text-slate-400 block">EWS</span>
                    <span className="text-xs font-bold font-mono text-amber-300">
                      {zone.ewsCutoff}
                    </span>
                  </div>
                  <div className="bg-white/[0.04] p-2 rounded-xl border border-white/5">
                    <span className="text-[9px] font-bold text-slate-400 block">SC</span>
                    <span className="text-xs font-bold font-mono text-slate-300">
                      {zone.scCutoff}
                    </span>
                  </div>
                  <div className="bg-white/[0.04] p-2 rounded-xl border border-white/5">
                    <span className="text-[9px] font-bold text-slate-400 block">ST</span>
                    <span className="text-xs font-bold font-mono text-slate-300">
                      {zone.stCutoff}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Tab 5: Railway GK & Formula Shortcuts */}
      {activeTab === 'gk-study' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold font-serif-academy text-white">
                Indian Railways General Knowledge & Quick Cheatsheets
              </h2>
              <p className="text-xs text-slate-400">
                High-frequency questions directly tested in RRB NTPC, ALP, JE & Group D CBTs.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {RAILWAY_GK_CAPSULES.map((capsule, i) => (
              <div
                key={i}
                className="bg-[#0c0c18]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4"
              >
                <h3 className="text-lg font-bold text-amber-300 font-serif-academy flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>{capsule.title}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {capsule.points.map((pt, j) => (
                    <div
                      key={j}
                      className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs sm:text-sm text-slate-300 flex items-start gap-2.5 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
};
