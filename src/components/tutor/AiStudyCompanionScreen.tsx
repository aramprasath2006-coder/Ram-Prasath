import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Lightbulb, 
  AlertTriangle, 
  Layers, 
  BrainCircuit, 
  Target, 
  Award,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Bookmark
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveScreen } from '../../types';
import { AVATAR_TEACHER_URL } from '../../data/mockData';

interface AiStudyCompanionScreenProps {
  onBack: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

interface MentorProfile {
  id: string;
  name: string;
  avatar: string;
  badge: string;
  specialty: string;
  education: string;
  rating: string;
  greeting: string;
  quickQuestions: string[];
}

const FACULTY: MentorProfile[] = [
  {
    id: 'dr-reed',
    name: 'Dr. Evelyn Reed',
    avatar: AVATAR_TEACHER_URL,
    badge: 'Faculty Chair',
    specialty: 'Engineering Math & Calculus',
    education: 'Ph.D. Applied Mathematics, MIT',
    rating: '4.98 ★ (3,420 students)',
    greeting: "Welcome to your Engineering Math consultation. Whether it's Cauchy integrals, matrix eigenvalues, or partial differential equations, ask away!",
    quickQuestions: [
      "Derive Cayley-Hamilton theorem inverse shortcut",
      "Explain Green's vs Stokes' 3D surface curl",
      "Eigenvalue Trace and Determinant properties"
    ]
  },
  {
    id: 'er-rajesh',
    name: 'Er. Rajesh Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    badge: 'GATE AIR 42',
    specialty: 'Mechanical & Thermal Sciences',
    education: 'M.Tech Thermal, IIT Bombay • Ex-BHEL Senior Engineer',
    rating: '4.95 ★ (2,890 students)',
    greeting: "Namaste! Ready to tackle GATE Mechanical concepts, thermodynamics cycles, Mohr's circle, and fluid mechanics derivations.",
    quickQuestions: [
      "Carnot Engine maximum thermal efficiency derivation",
      "Darcy-Weisbach head loss vs Fanning friction",
      "Euler critical buckling load for Fixed-Pinned column"
    ]
  },
  {
    id: 'ananya-sen',
    name: 'Ananya Sen',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    badge: 'Railway Cadre',
    specialty: 'RRB NTPC, ALP & General Science',
    education: 'IRTS Officer (Exam Topper) • Delhi School of Economics',
    rating: '4.97 ★ (4,150 students)',
    greeting: "Hello railway aspirants! I cover RRB NTPC CBT 1 & 2, ALP Psycho/Tech, Physics/Chemistry numericals, and Time & Work speed arithmetic.",
    quickQuestions: [
      "Relative speed shortcut for two crossing trains",
      "Trick to remember 19 Indian Railway Zones HQ",
      "Joule's law of heating & electric power calculation"
    ]
  },
  {
    id: 'prof-vikram',
    name: 'Prof. Vikramaditya',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    badge: 'UPSC Board Mentor',
    specialty: 'Indian Polity, Governance & Ethics',
    education: 'IAS (Retd.) • LL.M. Constitutional Law, NLSIU',
    rating: '4.99 ★ (5,600 students)',
    greeting: "Greetings. I mentor candidates for UPSC Civil Services Prelims and Mains, focusing on the Indian Constitution, Landmark SC Cases, and Governance.",
    quickQuestions: [
      "Article 32 vs Article 226 Writs comparison",
      "Emergency Provisions +4 rule (Articles 352, 356, 360)",
      "Basic Structure Doctrine landmark evolution"
    ]
  }
];

interface ChatItem {
  id: number;
  sender: 'mentor' | 'user';
  text: string;
  time: string;
  formula?: string;
  trap?: string;
  shortcut?: string;
  quizPrompt?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const AiStudyCompanionScreen: React.FC<AiStudyCompanionScreenProps> = ({
  onBack,
  setActiveScreen
}) => {
  const [selectedFaculty, setSelectedFaculty] = useState<MentorProfile>(FACULTY[0]);
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: 1,
      sender: 'mentor',
      text: FACULTY[0].greeting,
      time: '10:00 AM',
      shortcut: 'Pick a high-yield question or type any technical doubt below.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSelectFaculty = (fac: MentorProfile) => {
    setSelectedFaculty(fac);
    setMessages([
      {
        id: Date.now(),
        sender: 'mentor',
        text: fac.greeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        shortcut: `Connected live with ${fac.name} (${fac.specialty}).`
      }
    ]);
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const handleSendMessage = (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text) return;

    const userMsg: ChatItem = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = "";
      let formula: string | undefined = undefined;
      let trap: string | undefined = undefined;
      let shortcut: string | undefined = undefined;
      let quizPrompt: ChatItem['quizPrompt'] = undefined;

      const lower = text.toLowerCase();

      if (lower.includes('carnot') || lower.includes('efficiency')) {
        reply = "The Carnot cycle defines the absolute theoretical maximum efficiency for any thermal engine operating between two constant thermal reservoirs at absolute temperatures T_H (Source) and T_L (Sink). No irreversible engine can exceed this limit.";
        formula = "η_Carnot = 1 - (T_L / T_H) = (T_H - T_L) / T_H";
        trap = "Never plug temperatures in Celsius into thermodynamic formulas! Always convert to Kelvin (T_K = T_C + 273.15).";
        shortcut = "To improve efficiency most economically: lowering the sink temperature by 10 K delivers a larger percentage efficiency jump than increasing source temperature by 10 K.";
        quizPrompt = {
          question: "A Carnot engine operates between 600 K and 300 K. What is its theoretical thermal efficiency?",
          options: ["25%", "50%", "75%", "100%"],
          correctIndex: 1,
          explanation: "η = 1 - (300 / 600) = 1 - 0.50 = 0.50 or 50%."
        };
      } else if (lower.includes('green') || lower.includes('stoke')) {
        reply = "Green's Theorem transforms a closed line integral in the 2D xy-plane into an area double integral over the enclosed region: ∮_C (L dx + M dy) = ∬_R (∂M/∂x - ∂L/∂y) dA. Stokes' Theorem is the direct 3D generalization relating circulation along a spatial curve to surface flux of curl(F).";
        formula = "∮_C F · dr = ∬_S (∇ × F) · n̂ dS";
        trap = "Orientation matters! The boundary curve must be positively oriented (counter-clockwise) with the enclosed region always to the left.";
        shortcut = "If ∇ × F = 0 (conservative field), ∮ F·dr is immediately 0 for any closed contour!";
        quizPrompt = {
          question: "If a vector field F has curl(F) = 0 everywhere, what is the value of ∮ F·dr along any closed loop?",
          options: ["Depends on loop area", "Exactly 0", "Infinity", "Equal to divergence"],
          correctIndex: 1,
          explanation: "Since curl is zero everywhere, by Stokes' Theorem the surface integral is 0, so closed line integral is identically 0."
        };
      } else if (lower.includes('train') || lower.includes('speed')) {
        reply = "For trains and moving bodies: When moving towards each other (opposite direction), relative speed is S_1 + S_2. When moving in the same direction, relative speed is |S_1 - S_2|. Total distance to cross is always (Length_1 + Length_2).";
        formula = "Time (sec) = (L_1 + L_2) / (S_rel in m/s)   where 1 km/h = 5/18 m/s";
        trap = "Students frequently forget to convert speeds from km/h to m/s before dividing distance in meters.";
        shortcut = "Multiples of 18 km/h correspond to multiples of 5 m/s (18 km/h = 5 m/s, 36 km/h = 10 m/s, 72 km/h = 20 m/s, 90 km/h = 25 m/s).";
        quizPrompt = {
          question: "Two trains of lengths 120m and 180m move towards each other at 54 km/h and 36 km/h. How long to cross?",
          options: ["10 seconds", "12 seconds", "15 seconds", "20 seconds"],
          correctIndex: 1,
          explanation: "Total distance = 120 + 180 = 300m. Relative speed = 54 + 36 = 90 km/h = 90 * (5/18) = 25 m/s. Time = 300 / 25 = 12 seconds."
        };
      } else {
        reply = `That is a high-yield concept in ${selectedFaculty.specialty}. Reviewing key derivations alongside past examination patterns is key to top percentile ranking.`;
        shortcut = "Check the Formula Vault and Spaced Repetition Flashcards for active recall exercises on this topic.";
      }

      const mentorMsg: ChatItem = {
        id: Date.now() + 1,
        sender: 'mentor',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        formula,
        trap,
        shortcut,
        quizPrompt
      };

      setMessages((prev) => [...prev, mentorMsg]);
      setIsThinking(false);
    }, 700);
  };

  const handleQuizAnswer = (msgId: number, optionIdx: number, correctIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [msgId]: optionIdx }));
    if (optionIdx === correctIdx) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6 pb-28 md:pb-12 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c0c18]/80 p-5 rounded-3xl border border-white/10 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-slate-200 transition-colors shrink-0"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Bot className="w-3 h-3 text-indigo-400" />
                AI Faculty Mentors
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Live Conceptual Guidance
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              AI Study Companion &amp; Doubt Solver
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Instant step-by-step solutions, mathematical derivations, and exam traps from specialized AI mentors.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setActiveScreen('flashcards')}
            className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
            <span>Flashcards</span>
          </button>
          <button
            onClick={() => setActiveScreen('formula-bank')}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Formula Bank</span>
          </button>
          <button
            onClick={() => setActiveScreen('exam-readiness')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-950/40"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Readiness Radar</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Faculty Roster, Right Chat Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Faculty Selector */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-2 block">
            Select Faculty Specialist
          </span>

          <div className="space-y-2">
            {FACULTY.map((fac) => {
              const isSelected = selectedFaculty.id === fac.id;
              return (
                <button
                  key={fac.id}
                  onClick={() => handleSelectFaculty(fac)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/60 shadow-lg shadow-indigo-950/30'
                      : 'bg-[#0c0c18]/80 hover:bg-white/[0.05] border-white/10'
                  }`}
                >
                  <img
                    src={fac.avatar}
                    alt={fac.name}
                    className="w-11 h-11 rounded-xl object-cover border border-white/15 shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-white truncate">{fac.name}</h4>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                        {fac.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-300 font-medium truncate mt-0.5">{fac.specialty}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{fac.rating}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tips card */}
          <div className="p-4 rounded-2xl bg-[#0c0c18]/60 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Pro Exam Advice
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Ask about past year question shortcuts, unit conversions, or request interactive mini-quizzes to test your memory on the spot!
            </p>
          </div>
        </div>

        {/* Right Main Chat Thread & Interaction */}
        <div className="lg:col-span-3 bg-[#0c0c18]/90 rounded-3xl border border-white/10 shadow-2xl flex flex-col h-[650px] overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-[#080812] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedFaculty.avatar}
                alt={selectedFaculty.name}
                className="w-10 h-10 rounded-xl object-cover border border-indigo-500/40"
              />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  {selectedFaculty.name}
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-xs text-slate-400">{selectedFaculty.education}</p>
              </div>
            </div>

            <button
              onClick={() => handleSpeak(messages[messages.length - 1]?.text || '')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isSpeaking
                  ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white border-white/10'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeaking ? 'Mute' : 'Voice Readout'}</span>
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-[#06060c] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Suggested:
            </span>
            {selectedFaculty.quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Thread */}
          <div className="flex-1 bg-[#050508] p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-4 rounded-2xl max-w-[85%] leading-relaxed shadow-md space-y-3 ${
                      isUser
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-xs border border-indigo-400/30'
                        : 'bg-[#0c0c18] text-slate-200 border border-white/10 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Formula Callout */}
                    {msg.formula && (
                      <div className="p-3 rounded-xl bg-black/40 border border-indigo-500/30">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-0.5">
                          High-Yield Formula
                        </span>
                        <code className="text-xs sm:text-sm font-mono font-bold text-amber-300">
                          {msg.formula}
                        </code>
                      </div>
                    )}

                    {/* Trap Callout */}
                    {msg.trap && (
                      <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-start gap-1.5 text-rose-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-rose-300">Common Exam Trap:</strong> {msg.trap}
                        </span>
                      </div>
                    )}

                    {/* Shortcut Callout */}
                    {msg.shortcut && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-1.5 text-amber-200">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-amber-300">Pro Shortcut:</strong> {msg.shortcut}
                        </span>
                      </div>
                    )}

                    {/* Interactive Quiz Mini-Card */}
                    {msg.quizPrompt && (
                      <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-2.5 mt-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Interactive Check: Verify Your Recall</span>
                        </div>
                        <p className="font-bold text-xs text-white">{msg.quizPrompt.question}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {msg.quizPrompt.options.map((opt, oIdx) => {
                            const hasAnswered = userAnswers[msg.id] !== undefined;
                            const isSelected = userAnswers[msg.id] === oIdx;
                            const isCorrect = oIdx === msg.quizPrompt?.correctIndex;

                            return (
                              <button
                                key={oIdx}
                                disabled={hasAnswered}
                                onClick={() => handleQuizAnswer(msg.id, oIdx, msg.quizPrompt!.correctIndex)}
                                className={`p-2 rounded-lg text-xs font-semibold text-left border transition-all ${
                                  hasAnswered
                                    ? isCorrect
                                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                      : isSelected
                                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                                      : 'bg-white/[0.02] border-white/5 text-slate-500'
                                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-200'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {userAnswers[msg.id] !== undefined && (
                          <div className="text-[11px] text-emerald-300 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                            <strong>Explanation:</strong> {msg.quizPrompt.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                <span>{selectedFaculty.name} is preparing a step-by-step explanation...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#070710] border-t border-white/10 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask ${selectedFaculty.name} any doubt or concept...`}
              className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950/50 text-xs font-bold"
            >
              <span>Ask Tutor</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
