import React, { useState, useEffect } from 'react';
import { RRBQuestion, RRBMockTest } from '../../types';
import { RRB_MOCK_TEST_QUESTIONS } from '../../data/rrbExamData';
import { useStudentAuth } from '../../context/StudentAuthContext';
import {
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Bookmark,
  Sparkles,
  Calculator,
  Eye,
  Languages,
  Award,
  Zap,
  Check,
  X,
  Layers,
  FileText
} from 'lucide-react';

interface RRBCbtSimulatorProps {
  onBack: () => void;
  examTitle?: string;
  examType?: string;
}

type QuestionStatus = 'answered' | 'not-answered' | 'marked' | 'answered-marked' | 'not-visited';

export const RRBCbtSimulator: React.FC<RRBCbtSimulatorProps> = ({
  onBack,
  examTitle = 'RRB NTPC & ALP Combined CBT-1 Full Simulation',
  examType = 'RRB Mega Mock 2026'
}) => {
  const { currentUser } = useStudentAuth();
  const questions = RRB_MOCK_TEST_QUESTIONS;

  // Exam state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true });
  const [timeLeftSec, setTimeLeftSec] = useState(90 * 60); // 90 mins
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>('All');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const currentQ = questions[currentIdx];

  // Helper to determine status
  const getStatus = (idx: number): QuestionStatus => {
    const qId = questions[idx].id;
    const hasAnswer = selectedAnswers[qId] !== undefined;
    const isMarked = markedForReview[qId] === true;
    const isVis = visited[idx] === true;

    if (hasAnswer && isMarked) return 'answered-marked';
    if (hasAnswer) return 'answered';
    if (isMarked) return 'marked';
    if (isVis) return 'not-answered';
    return 'not-visited';
  };

  const handleSelectOption = (key: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key
    }));
  };

  const handleSaveAndNext = () => {
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setVisited((prev) => ({ ...prev, [nextIdx]: true }));
    }
  };

  const handleMarkForReviewAndNext = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQ.id]: true
    }));
    handleSaveAndNext();
  };

  const handleClearResponse = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
    setMarkedForReview((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleJumpToQuestion = (idx: number) => {
    setCurrentIdx(idx);
    setVisited((prev) => ({ ...prev, [idx]: true }));
  };

  // Calculator basic evaluate
  const handleCalcClick = (val: string) => {
    if (val === 'C') {
      setCalcInput('');
    } else if (val === '=') {
      try {
        // Safe arithmetic eval for basic math
        const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, '');
        const res = Function(`'use strict'; return (${sanitized})`)();
        setCalcInput(String(res));
      } catch {
        setCalcInput('Error');
      }
    } else {
      setCalcInput((prev) => prev + val);
    }
  };

  // Format time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate statistics
  const sections = Array.from(new Set(questions.map((q) => q.section)));
  
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  questions.forEach((q) => {
    const userAns = selectedAnswers[q.id];
    if (!userAns) {
      unattemptedCount++;
    } else if (userAns === q.correctAnswer) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const rawScore = +(correctCount * 1 - wrongCount * (1 / 3)).toFixed(2);
  const accuracy = correctCount + wrongCount > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;
  const percentileEstimate = Math.min(99.8, Math.max(45.0, +(75 + (rawScore / questions.length) * 24).toFixed(1)));

  // If submitted, show the comprehensive Railway Scorecard & Review
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#050508] immersive-bg text-slate-200 pb-16 animate-in fade-in duration-200">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#0c0c18]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold font-serif-academy text-white">
                RRB CBT Performance & Solutions Analysis
              </h1>
              <p className="text-xs text-slate-400">{examTitle}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSubmitted(false);
              setSelectedAnswers({});
              setMarkedForReview({});
              setVisited({ 0: true });
              setCurrentIdx(0);
              setTimeLeftSec(90 * 60);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Exam</span>
          </button>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Score Overview Card */}
          <div className="bg-gradient-to-br from-indigo-950/80 via-[#0c0c18] to-purple-950/70 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                    Evaluation Complete (TCS iON Formula)
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Roll: {currentUser?.rollNo || '26RRB9821'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif-academy text-white">
                  Score: <span className="text-emerald-400">{rawScore}</span> / {questions.length} Marks
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Calculated with official 1/3 negative marking scheme (-0.33 marks per incorrect response).
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Correct</span>
                  <span className="text-xl font-bold font-mono text-white">{correctCount}</span>
                </div>
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-rose-400 block">Incorrect</span>
                  <span className="text-xl font-bold font-mono text-white">{wrongCount}</span>
                </div>
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Accuracy</span>
                  <span className="text-xl font-bold font-mono text-white">{accuracy}%</span>
                </div>
                <div className="bg-white/[0.06] border border-indigo-500/40 rounded-2xl p-3 text-center bg-indigo-950/40">
                  <span className="text-[10px] uppercase font-bold text-indigo-300 block">Est. Percentile</span>
                  <span className="text-xl font-bold font-mono text-emerald-300">{percentileEstimate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Language Toggle for Solutions */}
          <div className="flex items-center justify-between bg-[#0c0c18] border border-white/10 p-3 rounded-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Languages className="w-4 h-4 text-indigo-400" />
              <span>Solution Language:</span>
            </div>
            <div className="flex bg-white/10 p-0.5 rounded-xl">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'hi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिंदी (Hindi)
              </button>
            </div>
          </div>

          {/* Detailed Question by Question Solutions */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-serif-academy flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Question Analysis & Step-by-Step Explanations</span>
            </h3>

            {questions.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              const isUnattempted = !userAns;

              return (
                <div
                  key={q.id}
                  className={`bg-[#0c0c18]/90 border rounded-2xl p-5 sm:p-6 transition-all ${
                    isCorrect
                      ? 'border-emerald-500/40'
                      : isUnattempted
                      ? 'border-white/10'
                      : 'border-rose-500/40'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white font-mono">
                        Q{idx + 1}
                      </span>
                      <span className="text-xs text-indigo-300 font-semibold bg-indigo-950/60 px-2.5 py-0.5 rounded-md border border-indigo-500/30">
                        {q.section}
                      </span>
                      {q.topic && (
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          • {q.topic}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                          <Check className="w-3.5 h-3.5" /> +1.00 Mark
                        </span>
                      ) : isUnattempted ? (
                        <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                          Not Attempted (0.00)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/30">
                          <X className="w-3.5 h-3.5" /> -0.33 Negative
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <p className="text-sm sm:text-base font-semibold text-white mb-4 leading-relaxed">
                    {language === 'hi' && q.hindiPrompt ? q.hindiPrompt : q.prompt}
                  </p>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                    {q.options.map((opt) => {
                      const isOptionSelected = userAns === opt.key;
                      const isOptionCorrect = q.correctAnswer === opt.key;

                      let optClasses = 'border-white/10 bg-white/[0.02] text-slate-300';
                      if (isOptionCorrect) {
                        optClasses = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200 font-semibold';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        optClasses = 'border-rose-500/60 bg-rose-500/10 text-rose-200 font-semibold';
                      }

                      return (
                        <div
                          key={opt.key}
                          className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${optClasses}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center font-bold text-xs">
                              {opt.key}
                            </span>
                            <span>{language === 'hi' && opt.hindiText ? opt.hindiText : opt.text}</span>
                          </div>
                          {isOptionCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                          {isOptionSelected && !isOptionCorrect && <X className="w-4 h-4 text-rose-400" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Detailed Explanation & Railway Shortcut */}
                  <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 text-xs text-slate-300 space-y-2">
                    <div>
                      <span className="font-bold text-indigo-300 uppercase tracking-wider block mb-0.5">
                        Detailed Explanation:
                      </span>
                      <p className="leading-relaxed text-slate-300">{q.explanation}</p>
                    </div>

                    {q.shortcutTip && (
                      <div className="pt-2 border-t border-indigo-500/20 flex items-start gap-1.5 text-amber-300 font-medium">
                        <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-amber-300">Railway Shortcut / Key Concept:</strong> {q.shortcutTip}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // Active CBT Examination Screen
  return (
    <div className="min-h-screen bg-[#050508] text-slate-200 flex flex-col justify-between select-none">
      {/* Top Examination TCS iON Styled Bar */}
      <header className="bg-[#0b0b18] border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to exit the test? Your responses will not be saved.')) {
                onBack();
              }
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 border border-white/10"
            title="Exit CBT"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded">
                RRB OFFICIAL CBT ENGINE
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
                {examTitle}
              </h1>
            </div>
          </div>
        </div>

        {/* Right side: Language, Calculator & Timer */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'))}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'en' ? 'Hindi' : 'English'}</span>
          </button>

          {/* Calculator Tool */}
          <button
            onClick={() => setShowCalculator((prev) => !prev)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Calc</span>
          </button>

          {/* Timer */}
          <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-mono text-xs sm:text-sm font-bold text-emerald-300">
              {formatTime(timeLeftSec)}
            </span>
          </div>

          {/* Candidate Profile Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-400/40 hidden sm:block">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
              alt="Candidate"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Calculator Modal Popover */}
      {showCalculator && (
        <div className="fixed top-14 right-4 z-50 bg-[#121226] border border-white/20 rounded-2xl p-4 shadow-2xl w-64 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" /> Railway Virtual Calculator
            </span>
            <button
              onClick={() => setShowCalculator(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <div className="bg-black/60 border border-white/10 rounded-xl p-2 mb-3 text-right font-mono text-base text-emerald-400 min-h-[36px] overflow-x-auto">
            {calcInput || '0'}
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcClick(btn)}
                className={`py-2 rounded-lg transition-all ${
                  btn === 'C'
                    ? 'col-span-4 bg-rose-600/30 text-rose-300 hover:bg-rose-600/50'
                    : btn === '='
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : ['/', '*', '-', '+'].includes(btn)
                    ? 'bg-indigo-600/40 text-indigo-300 hover:bg-indigo-600/60'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section Tabs Bar */}
      <div className="bg-[#0f0f20] border-b border-white/10 px-4 sm:px-6 py-2 overflow-x-auto flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Sections:
        </span>
        <button
          onClick={() => setActiveSectionFilter('All')}
          className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
            activeSectionFilter === 'All'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          All ({questions.length})
        </button>
        {sections.map((sec) => {
          const count = questions.filter((q) => q.section === sec).length;
          return (
            <button
              key={sec}
              onClick={() => setActiveSectionFilter(sec)}
              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
                activeSectionFilter === sec
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              {sec} ({count})
            </button>
          );
        })}
      </div>

      {/* Main CBT Workspace: Left Question Area, Right Palette */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Question Display and Options */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-[#0c0c18]/90 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl relative">
          <div>
            {/* Question Header */}
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-white font-mono">
                  Question {currentIdx + 1}
                </span>
                <span className="text-xs text-indigo-300 font-semibold bg-indigo-950/80 border border-indigo-500/30 px-2.5 py-0.5 rounded">
                  {currentQ.section}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-emerald-400 font-bold">+1.00</span>
                <span>/</span>
                <span className="text-rose-400 font-bold">-0.33</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="min-h-[100px] mb-6">
              <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                {language === 'hi' && currentQ.hindiPrompt ? currentQ.hindiPrompt : currentQ.prompt}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswers[currentQ.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-[0.99] ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-md shadow-indigo-950/40'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {opt.key}
                      </div>
                      <span className="text-xs sm:text-sm font-medium">
                        {language === 'hi' && opt.hindiText ? opt.hindiText : opt.text}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-500'
                          : 'border-white/30'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleMarkForReviewAndNext}
                className="px-3.5 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Mark for Review & Next</span>
              </button>

              <button
                onClick={handleClearResponse}
                className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 text-xs font-bold transition-colors"
              >
                Clear Response
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentIdx === 0}
                onClick={() => handleJumpToQuestion(currentIdx - 1)}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleSaveAndNext}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-950/50 border border-indigo-400/30 transition-all active:scale-95"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Question Palette & Legend */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-[#0c0c18]/90 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h2 className="text-sm font-bold text-white font-serif-academy flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Question Palette</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                {questions.length} Questions
              </span>
            </div>

            {/* Question Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 mb-4 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-rose-500"></span>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-purple-600"></span>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-700"></span>
                <span>Not Visited</span>
              </div>
            </div>

            {/* Question Grid Buttons */}
            <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                if (activeSectionFilter !== 'All' && q.section !== activeSectionFilter) {
                  return null;
                }

                const status = getStatus(idx);
                const isCurrent = idx === currentIdx;

                let btnBg = 'bg-slate-800 text-slate-400 border-white/10';
                if (status === 'answered') {
                  btnBg = 'bg-emerald-600 text-white font-bold border-emerald-400';
                } else if (status === 'not-answered') {
                  btnBg = 'bg-rose-600 text-white font-bold border-rose-400';
                } else if (status === 'marked') {
                  btnBg = 'bg-purple-600 text-white font-bold border-purple-400';
                } else if (status === 'answered-marked') {
                  btnBg = 'bg-purple-700 text-emerald-300 font-bold border-emerald-400 ring-1 ring-emerald-400';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`h-9 rounded-xl text-xs font-mono transition-all border flex items-center justify-center ${btnBg} ${
                      isCurrent ? 'ring-2 ring-white scale-105 z-10 shadow-md' : 'hover:opacity-80'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Test Button */}
          <div className="pt-4 border-t border-white/10 mt-4">
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-950/40 border border-emerald-400/40 active:scale-98 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit CBT Examination</span>
            </button>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121226] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white font-serif-academy">
              Submit Railway CBT Examination?
            </h3>

            <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Questions:</span>
                <span className="font-bold text-white">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Answered:</span>
                <span className="font-bold text-emerald-400">
                  {Object.keys(selectedAnswers).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Marked for Review:</span>
                <span className="font-bold text-purple-300">
                  {Object.keys(markedForReview).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Unanswered / Left:</span>
                <span className="font-bold text-rose-400">
                  {questions.length - Object.keys(selectedAnswers).length}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Once submitted, instant evaluation with TCS iON normalization score & detailed solutions will be displayed.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Resume Test
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  setIsSubmitted(true);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-bold text-xs hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-950/40"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
