import React, { useState, useEffect } from 'react';
import { MOCK_QUESTIONS } from '../data/mockData';
import { ActiveScreen } from '../types';
import { Timer, X, ChevronLeft, ChevronRight, CheckCircle2, HelpCircle, Award, AlertCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AssessmentScreenProps {
  onClose: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const AssessmentScreen: React.FC<AssessmentScreenProps> = ({ onClose, setActiveScreen }) => {
  const [currentIdx, setCurrentIdx] = useState(4); // Default to Question 5 as shown in mockup!
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({
    4: 'B' // preselected Question 5 option B
  });
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(14 * 60 + 58); // 14:58
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 20, percentage: 0 });

  // Timer countdown loop
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = MOCK_QUESTIONS[currentIdx] || MOCK_QUESTIONS[0];

  const handleSelectOption = (key: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: key
    }));
  };

  const handleSubmitTest = () => {
    let correctCount = 0;
    MOCK_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = {
      correct: correctCount + 15, // Simulating 16-18 correct out of 20
      total: 20,
      percentage: Math.round(((correctCount + 15) / 20) * 100)
    };

    setScore(calculatedScore);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] immersive-bg flex flex-col justify-between text-slate-200 animate-in fade-in duration-200">
      {/* Top App Bar with Timer & Actions */}
      <header className="sticky top-0 z-50 bg-[#0c0c18]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors border border-white/10"
            title="Exit Assessment"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
              Weekly Math Assessment
            </h1>
            <p className="text-xs font-semibold text-slate-400">
              Q{currentQ.questionNumber} of {currentQ.totalQuestions}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Timer Pill */}
          <div className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide animate-pulse">
            <Timer className="w-4 h-4" />
            <span className="font-mono">{formatTime(timeLeftSeconds)}</span>
          </div>

          <button
            onClick={handleSubmitTest}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-indigo-950/40 border border-indigo-400/30 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-95"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Assessment Question Area */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Question Header Card */}
        <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-7 shadow-lg shadow-black/20 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Question {currentQ.questionNumber}
            </h2>
            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
              +4 Marks / -1 Mark
            </span>
          </div>

          <div className="w-full h-px bg-white/10"></div>

          <div className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
            <p className="mb-3">{currentQ.prompt}</p>
            {currentQ.latexFormula && (
              <div className="bg-slate-950/80 border border-indigo-500/30 p-3 rounded-xl font-mono text-sm sm:text-base text-indigo-300 font-semibold overflow-x-auto">
                {currentQ.latexFormula}
              </div>
            )}
          </div>
        </section>

        {/* Options List */}
        <section className="flex flex-col gap-3">
          {currentQ.options.map((option) => {
            const isSelected = selectedAnswers[currentIdx] === option.key;
            return (
              <label
                key={option.key}
                onClick={() => handleSelectOption(option.key)}
                className={`cursor-pointer group relative rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-all duration-200 border-2 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-950/40 text-white'
                    : 'border-white/10 bg-[#0c0c18]/80 backdrop-blur-xl hover:bg-white/[0.06] text-slate-300'
                }`}
              >
                {/* Radio circle visual */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-500'
                      : 'border-slate-500 bg-transparent group-hover:border-indigo-400'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>

                {/* Option text */}
                <span
                  className={`text-sm sm:text-base font-semibold flex-1 ${
                    isSelected ? 'text-white' : 'text-slate-200'
                  }`}
                >
                  {option.text}
                </span>

                {isSubmitted && option.key === currentQ.correctAnswer && (
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Correct
                  </span>
                )}
              </label>
            );
          })}
        </section>

        {/* Question Drawer / Grid Selector */}
        <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-4 border border-white/10 mt-2 shadow-lg shadow-black/20">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Question Navigator (20 Total)
            </span>
            <span className="text-xs text-emerald-400 font-bold">
              {Object.keys(selectedAnswers).length} Answered
            </span>
          </div>

          <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
            {Array.from({ length: 20 }, (_, i) => {
              const hasAnswer = selectedAnswers[i] !== undefined;
              const isCurrent = currentIdx === i;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i % MOCK_QUESTIONS.length)}
                  className={`h-8 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ring-2 ring-indigo-400 scale-105 border border-indigo-300'
                      : hasAnswer
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:bg-white/[0.08]'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* Bottom Navigation Area */}
      <footer className="bg-[#0c0c18]/90 backdrop-blur-xl border-t border-white/10 px-4 sm:px-6 py-4 sticky bottom-0 z-40">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <button
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Progress dots indicator */}
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 ring-2 ring-indigo-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
          </div>

          <button
            onClick={() => {
              if (currentIdx < MOCK_QUESTIONS.length - 1) {
                setCurrentIdx((prev) => prev + 1);
              } else {
                handleSubmitTest();
              }
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-950/40 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95"
          >
            <span>{currentIdx === MOCK_QUESTIONS.length - 1 ? 'Submit Test' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Test Submission Summary Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0c0c18]/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-white/10 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">Assessment Completed!</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Your answers have been evaluated with detailed precision.
              </p>
            </div>

            <div className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 flex justify-around items-center">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Score</p>
                <p className="text-2xl font-bold text-indigo-300">{score.correct * 4} / 80</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Accuracy</p>
                <p className="text-2xl font-bold text-emerald-400">{score.percentage}%</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Rank</p>
                <p className="text-2xl font-bold text-amber-400">Top 4%</p>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setActiveScreen('student-achievements');
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-sm rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>View Awarded Digital Badges</span>
              </button>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setActiveScreen('academic-report');
                }}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-950/50 border border-indigo-400/30"
              >
                View Detailed Performance Report
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-white/10 text-slate-300 font-semibold text-xs sm:text-sm rounded-xl hover:bg-white/20 transition-all border border-white/10"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
