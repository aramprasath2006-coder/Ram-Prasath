import React, { useState, useEffect } from 'react';
import { RRB_ALP_PSYCHO_BATTERIES, PsychoTestBattery } from '../../data/rrbExamData';
import {
  ArrowLeft,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  HelpCircle,
  ShieldCheck,
  Eye,
  Activity,
  Layers
} from 'lucide-react';

interface RRBPsychoTestSimulatorProps {
  onBack: () => void;
}

export const RRBPsychoTestSimulator: React.FC<RRBPsychoTestSimulatorProps> = ({ onBack }) => {
  const [selectedBattery, setSelectedBattery] = useState<PsychoTestBattery>(RRB_ALP_PSYCHO_BATTERIES[0]);
  const [testStage, setTestStage] = useState<'instructions' | 'memorize' | 'test' | 'result'>('instructions');
  const [timerSec, setTimerSec] = useState(120);
  const [score, setScore] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [userSelections, setUserSelections] = useState<Record<number, number>>({});

  // Brick Depth Perception Questions Simulation
  const brickQuestions = [
    { id: 1, targetBrick: 'Brick A', correctTouching: 4, prompt: 'Count how many bricks are in direct surface contact with Brick A in the 3D isometric stack.' },
    { id: 2, targetBrick: 'Brick B', correctTouching: 3, prompt: 'Count how many bricks are in direct surface contact with Brick B.' },
    { id: 3, targetBrick: 'Brick C', correctTouching: 5, prompt: 'Count how many bricks are in direct surface contact with Brick C in the base layer.' },
    { id: 4, targetBrick: 'Brick D', correctTouching: 2, prompt: 'Count how many bricks are in direct surface contact with Brick D on the upper edge.' },
    { id: 5, targetBrick: 'Brick E', correctTouching: 4, prompt: 'Count how many bricks are in direct surface contact with Brick E in the central column.' }
  ];

  // Concentration (Find 6s) Questions Simulation
  const concentrationRows = [
    { id: 1, sequence: '8 4 6 2 9 6 3 1 6 7 5 6 9 2 6 8 1 6', count6: 6 },
    { id: 2, sequence: '6 3 9 1 6 8 2 6 7 4 6 5 6 9 3 6 8 2 6', count6: 7 },
    { id: 3, sequence: '9 2 6 4 8 1 6 7 3 6 5 2 9 8 6 4 1 6', count6: 5 },
    { id: 4, sequence: '6 8 2 9 6 3 1 7 6 4 8 6 9 2 6 5 3 6 8 6', count6: 7 },
    { id: 5, sequence: '3 9 1 8 6 4 2 6 7 5 9 6 8 1 2 6 4 9 6', count6: 5 }
  ];

  // Following Directions Matrix Test
  const directionQuestions = [
    {
      id: 1,
      prompt: 'Start at Cell (Row 3, Col 2). Move 2 steps UP, 1 step RIGHT, then move 1 step diagonally DOWN-RIGHT. Which letter do you land on?',
      options: ['A', 'K', 'M', 'R'],
      correct: 'K'
    },
    {
      id: 2,
      prompt: 'Start at Cell (Row 1, Col 4). Move 3 steps DOWN, turn 90° Clockwise and move 2 steps LEFT. Which letter do you land on?',
      options: ['B', 'P', 'X', 'T'],
      correct: 'P'
    }
  ];

  useEffect(() => {
    let interval: any = null;
    if ((testStage === 'memorize' || testStage === 'test') && timerSec > 0) {
      interval = setInterval(() => {
        setTimerSec((prev) => {
          if (prev <= 1) {
            if (testStage === 'memorize') {
              setTestStage('test');
              return 60; // 60s for test
            } else {
              setTestStage('result');
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testStage, timerSec]);

  const handleStartTest = () => {
    if (selectedBattery.id === 'memory-test') {
      setTestStage('memorize');
      setTimerSec(30); // 30s memory preview
    } else {
      setTestStage('test');
      setTimerSec(selectedBattery.timeLimitSec);
    }
    setScore(0);
    setActiveQuestion(0);
    setUserSelections({});
  };

  const handleAnswerBrick = (answer: number) => {
    setUserSelections((prev) => ({ ...prev, [activeQuestion]: answer }));
    if (activeQuestion < brickQuestions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      // Calculate score
      let correct = 0;
      brickQuestions.forEach((q, idx) => {
        if ((userSelections[idx] || answer) === q.correctTouching) correct++;
      });
      setScore(correct);
      setTestStage('result');
    }
  };

  const tScore = Math.min(80, Math.round(50 + ((score - 3) / 1.5) * 10));
  const isQualified = tScore >= selectedBattery.passingTScore;

  return (
    <div className="min-h-screen bg-[#050508] immersive-bg text-slate-200 pb-16 animate-in fade-in duration-200">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0c0c18]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                RDSO STANDARDS
              </span>
              <h1 className="text-sm sm:text-base font-bold font-serif-academy text-white">
                RRB ALP Computer Based Aptitude Test (CBAT)
              </h1>
            </div>
            <p className="text-xs text-slate-400">Official 5-Battery Psycho Test Simulator</p>
          </div>
        </div>

        {/* Passing Rule Pill */}
        <div className="flex items-center gap-2 text-xs font-semibold bg-indigo-950/60 border border-indigo-500/40 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline text-slate-300">Minimum Qualifying T-Score:</span>
          <span className="text-emerald-400 font-bold">42 Marks (Each Battery)</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Battery Selector Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {RRB_ALP_PSYCHO_BATTERIES.map((battery) => (
            <button
              key={battery.id}
              onClick={() => {
                setSelectedBattery(battery);
                setTestStage('instructions');
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                selectedBattery.id === battery.id
                  ? 'border-amber-500/60 bg-gradient-to-br from-amber-950/40 to-indigo-950/40 text-white shadow-md'
                  : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span className="text-[10px] font-bold text-amber-300 uppercase block mb-1">
                {battery.id.replace('-', ' ')}
              </span>
              <h3 className="text-xs font-bold truncate text-slate-200">{battery.name}</h3>
            </button>
          ))}
        </div>

        {/* Stage 1: Instructions Mode */}
        {testStage === 'instructions' && (
          <div className="bg-[#0c0c18]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {selectedBattery.testType}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif-academy text-white">
                  {selectedBattery.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {selectedBattery.description}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white/[0.04] p-3 rounded-2xl border border-white/10">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Time</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {selectedBattery.timeLimitSec}s
                  </span>
                </div>
                <div className="h-6 w-px bg-white/10"></div>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {selectedBattery.questionCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Test Instructions */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>RDSO Examination Instructions & Rules:</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {selectedBattery.instructions.map((inst, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{inst}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2 bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-500/30 text-indigo-200">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    No negative marking in CBAT Psycho test. Candidates must score at least 42 T-score in EVERY battery to qualify for Assistant Loco Pilot merit.
                  </span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleStartTest}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-950/50 border border-amber-400/40 active:scale-98 transition-all"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Launch Battery Simulation Now</span>
            </button>
          </div>
        )}

        {/* Stage 2: Memory Study Phase */}
        {testStage === 'memorize' && (
          <div className="bg-[#0c0c18]/90 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 animate-pulse" /> Memorization Phase (Look & Retain)
              </span>
              <div className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-xl">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="font-mono text-sm font-bold text-amber-300">{timerSec}s</span>
              </div>
            </div>

            {/* Railway Station Map Layout Grid */}
            <div className="max-w-md mx-auto p-4 bg-gradient-to-br from-[#121226] to-[#0a0a16] border border-white/20 rounded-2xl shadow-xl">
              <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">
                Railway Terminal Master Blueprint
              </h4>
              <div className="grid grid-cols-3 gap-3 p-2 bg-black/40 rounded-xl border border-white/10">
                <div className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-lg text-center">
                  <span className="text-xs font-bold text-indigo-300 block">Station A</span>
                  <span className="text-[10px] text-slate-400">Main Platform 1</span>
                </div>
                <div className="p-3 bg-slate-900 border border-white/10 rounded-lg text-center opacity-40">
                  <span className="text-[10px] text-slate-500">Track 2</span>
                </div>
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-center">
                  <span className="text-xs font-bold text-emerald-300 block">Loco Shed</span>
                  <span className="text-[10px] text-slate-400">Electric Traction</span>
                </div>
                <div className="p-3 bg-slate-900 border border-white/10 rounded-lg text-center opacity-40">
                  <span className="text-[10px] text-slate-500">Signal Gantry</span>
                </div>
                <div className="p-3 bg-amber-950/60 border border-amber-500/30 rounded-lg text-center">
                  <span className="text-xs font-bold text-amber-300 block">Control Tower</span>
                  <span className="text-[10px] text-slate-400">Cabin #4</span>
                </div>
                <div className="p-3 bg-rose-950/60 border border-rose-500/30 rounded-lg text-center">
                  <span className="text-xs font-bold text-rose-300 block">Fuel Tank</span>
                  <span className="text-[10px] text-slate-400">Diesel Bay</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Memorize where each terminal structure is located. Once timer reaches zero, you will place them accurately.
            </p>

            <button
              onClick={() => {
                setTestStage('test');
                setTimerSec(60);
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all"
            >
              I am Ready, Skip to Test
            </button>
          </div>
        )}

        {/* Stage 3: Active Interactive Test Phase */}
        {testStage === 'test' && (
          <div className="bg-[#0c0c18]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Question {activeQuestion + 1} of {brickQuestions.length}
                </span>
                <h3 className="text-lg font-bold text-white font-serif-academy">
                  {brickQuestions[activeQuestion].targetBrick} - Contact Analysis
                </h3>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
                <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-mono text-sm font-bold text-emerald-300">{timerSec}s</span>
              </div>
            </div>

            {/* 3D Isometric Brick Canvas Mock */}
            <div className="bg-gradient-to-b from-[#14142b] to-[#0d0d1a] border border-white/20 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="space-y-1 mb-4">
                <div className="flex gap-2 justify-center">
                  <div className="w-16 h-8 bg-slate-700 border-2 border-slate-500 rounded-sm flex items-center justify-center font-bold text-xs text-slate-300">
                    Brick D
                  </div>
                  <div className="w-16 h-8 bg-amber-600 border-2 border-amber-300 rounded-sm flex items-center justify-center font-bold text-xs text-white shadow-lg animate-pulse">
                    Brick A
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <div className="w-16 h-8 bg-slate-700 border-2 border-slate-500 rounded-sm flex items-center justify-center font-bold text-xs text-slate-300">
                    Brick B
                  </div>
                  <div className="w-16 h-8 bg-slate-700 border-2 border-slate-500 rounded-sm flex items-center justify-center font-bold text-xs text-slate-300">
                    Brick E
                  </div>
                  <div className="w-16 h-8 bg-slate-700 border-2 border-slate-500 rounded-sm flex items-center justify-center font-bold text-xs text-slate-300">
                    Brick C
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-medium max-w-md">
                {brickQuestions[activeQuestion].prompt}
              </p>
            </div>

            {/* Answer Selector (1 to 6 Bricks) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Select Number of Touching Bricks:
              </span>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleAnswerBrick(num)}
                    className="py-3 rounded-xl bg-white/10 hover:bg-amber-600 hover:text-slate-950 text-white font-bold font-mono text-base border border-white/10 active:scale-95 transition-all"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stage 4: Results & T-Score Evaluation */}
        {testStage === 'result' && (
          <div className="bg-[#0c0c18]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto border-2 ${
              isQualified ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-rose-500/20 border-rose-500/50 text-rose-400'
            }`}>
              {isQualified ? <CheckCircle2 className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
            </div>

            <div>
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                isQualified
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {isQualified ? 'RDSO Psycho Standard Passed' : 'Below Cutoff Threshold'}
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold font-serif-academy text-white mt-3">
                Calculated T-Score: <span className={isQualified ? 'text-emerald-400' : 'text-rose-400'}>{tScore}</span> / 80
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Raw Accuracy: {score} of {brickQuestions.length} Correct Responses
              </p>
            </div>

            {/* Scorecard Table */}
            <div className="bg-white/[0.04] rounded-2xl p-4 border border-white/10 max-w-md mx-auto text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Battery Name:</span>
                <span className="font-bold text-white">{selectedBattery.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Qualifying Minimum:</span>
                <span className="font-bold text-amber-300">42 T-Score</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Candidate T-Score:</span>
                <span className="font-bold text-emerald-400">{tScore}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="text-slate-400">Loco Pilot Aptitude Status:</span>
                <span className={`font-bold ${isQualified ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isQualified ? 'ELIGIBLE & QUALIFIED' : 'NEEDS PRACTICE'}
                </span>
              </div>
            </div>

            <div className="flex gap-3 max-w-md mx-auto">
              <button
                onClick={() => setTestStage('instructions')}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Battery</span>
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md"
              >
                Back to RRB Portal
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
