import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  User, 
  CheckCircle2, 
  MessageCircle, 
  Volume2, 
  VolumeX, 
  Bot, 
  GraduationCap, 
  Lightbulb, 
  AlertTriangle, 
  HelpCircle,
  RotateCcw,
  Zap
} from 'lucide-react';
import { AVATAR_TEACHER_URL } from '../../data/mockData';

interface TeacherChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  specialty: string;
  greeting: string;
  suggestedPrompts: string[];
}

const MENTORS: Mentor[] = [
  {
    id: 'reed',
    name: 'Dr. Evelyn Reed',
    avatar: AVATAR_TEACHER_URL,
    title: 'Senior Faculty Mentor',
    specialty: 'Engineering Math & Calculus',
    greeting: "Hello! I'm Dr. Reed. I specialize in Higher Engineering Mathematics, Vector Calculus, and Differential Equations. What mathematical concept or problem can I break down for you today?",
    suggestedPrompts: [
      "Explain Green's vs Stokes' Theorem",
      "Eigenvalues: Trace & Determinant shortcut",
      "Cauchy-Riemann equations condition"
    ]
  },
  {
    id: 'rajesh',
    name: 'Er. Rajesh Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Ex-BHEL • GATE ME AIR 42',
    specialty: 'Thermodynamics & Fluid Mechanics',
    greeting: "Namaste aspirant! I focus on GATE Mechanical, Thermal Sciences, SOM, and Fluid Dynamics. Ask me any numerical doubt or conceptual derivation!",
    suggestedPrompts: [
      "Derive Carnot Cycle thermal efficiency",
      "Bernoulli Equation assumptions & head terms",
      "Fixed-Pinned column Euler buckling load"
    ]
  },
  {
    id: 'ananya',
    name: 'Ananya Sen',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Railway Cadre Specialist',
    specialty: 'RRB NTPC, ALP & General Science',
    greeting: "Welcome! I specialize in Railway Recruitment Board exams (NTPC, ALP, JE, Group D), General Science, and Speed Aptitude shortcuts. What can I clarify?",
    suggestedPrompts: [
      "Trick for Two Trains crossing each other",
      "Indian Railway Zones & Headquarters mnemonics",
      "Ohm's Law: Series vs Parallel bulb power"
    ]
  },
  {
    id: 'vikram',
    name: 'Prof. Vikramaditya',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Former UPSC Interview Board',
    specialty: 'Indian Polity, Governance & Ethics',
    greeting: "Greetings aspirant. I mentor candidates for UPSC Civil Services and State PSCs in Constitutional Law, Landmark Judgments, and Governance frameworks.",
    suggestedPrompts: [
      "Article 32 vs Article 226 Writs comparison",
      "Rule of 4 for Constitutional Emergencies",
      "Basic Structure Doctrine landmark cases"
    ]
  }
];

interface ChatMessage {
  id: number;
  sender: 'mentor' | 'user';
  text: string;
  time: string;
  conceptBreakdown?: {
    formula?: string;
    pitfall?: string;
    shortcut?: string;
  };
}

export const TeacherChatModal: React.FC<TeacherChatModalProps> = ({ isOpen, onClose }) => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor>(MENTORS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'mentor',
      text: MENTORS[0].greeting,
      time: '10:15 AM',
      conceptBreakdown: {
        shortcut: 'Select any preset topic above or type your own question below.'
      }
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  // Handle switching mentor
  const handleSwitchMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setMessages([
      {
        id: Date.now(),
        sender: 'mentor',
        text: mentor.greeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        conceptBreakdown: {
          shortcut: `Consulting with ${mentor.name} (${mentor.specialty}).`
        }
      }
    ]);
  };

  // Text to speech
  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Send message
  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Intelligent context-aware AI tutor response engine
    setTimeout(() => {
      let replyText = "";
      let formula: string | undefined = undefined;
      let pitfall: string | undefined = undefined;
      let shortcut: string | undefined = undefined;

      const lower = text.toLowerCase();

      if (lower.includes('green') || lower.includes('stoke')) {
        replyText = "Green's Theorem converts a closed 2D loop integral into a double surface integral: ∮ (L dx + M dy) = ∬ (∂M/∂x - ∂L/∂y) dA. Stokes' Theorem generalizes this exact same curl concept to 3D spatial surfaces bounded by a closed contour ∮ F·dr = ∬ (∇×F)·n̂ dS.";
        formula = "∮_C F · dr = ∬_S (∇ × F) · n̂ dS";
        pitfall = "Ensure boundary curve C is traversed counter-clockwise (positive orientation) to maintain proper sign conventions.";
        shortcut = "If curl ∇×F = 0 (conservative field), the closed line integral around ANY loop is immediately ZERO without calculation!";
      } else if (lower.includes('carnot') || lower.includes('efficiency')) {
        replyText = "The Carnot thermal efficiency represents the maximum theoretical efficiency achievable between two thermal reservoirs at absolute temperatures T_H (Source) and T_L (Sink).";
        formula = "η_Carnot = 1 - (T_L / T_H) = (T_H - T_L) / T_H";
        pitfall = "Never calculate efficiency using Celsius! Always convert temperatures to Kelvin (K = °C + 273.15).";
        shortcut = "To maximize Carnot efficiency, either increase Source temperature T_H or decrease Sink temperature T_L. Decreasing T_L by 10K yields a higher % boost than increasing T_H by 10K!";
      } else if (lower.includes('train') || lower.includes('speed') || lower.includes('relative')) {
        replyText = "For two bodies in motion: When moving in OPPOSITE directions, their speeds ADD UP (S_rel = S_1 + S_2). When moving in the SAME direction, speeds SUBTRACT (S_rel = |S_1 - S_2|). When crossing each other, the distance covered is ALWAYS the sum of both lengths (L_1 + L_2).";
        formula = "Time = (Length_1 + Length_2) / (Speed_rel * 5/18)";
        pitfall = "Always convert speed from km/h to m/s by multiplying by (5 / 18) before dividing distance in meters.";
        shortcut = "To convert m/s back to km/h, multiply by (18 / 5). E.g. 20 m/s * (18/5) = 72 km/h.";
      } else if (lower.includes('writ') || lower.includes('article 32') || lower.includes('226')) {
        replyText = "Article 32 was crowned the 'Heart & Soul' of the Constitution by Dr. B.R. Ambedkar. It empowers the Supreme Court to issue 5 Writs: Habeas Corpus (unlawful detention), Mandamus (command to public duty), Prohibition (prevent inferior court from exceeding jurisdiction), Certiorari (quash illegal order), and Quo-Warranto (question right to public office).";
        formula = "Article 32 (Supreme Court) vs Article 226 (High Courts)";
        pitfall = "Article 226 is actually WIDER in scope than Article 32 because High Courts can issue writs for fundamental rights AND ordinary legal rights.";
        shortcut = "Remember the 5 Writs mnemonic: 'How Many People Can Question' (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto).";
      } else if (lower.includes('eigen') || lower.includes('matrix')) {
        replyText = "For any square matrix A: The SUM of its eigenvalues equals the Trace of the matrix (sum of main diagonal elements), and the PRODUCT of its eigenvalues equals the Determinant det(A).";
        formula = "Σ λ_i = Trace(A)   &   Π λ_i = det(A)";
        pitfall = "Eigenvalues of a triangular or diagonal matrix are simply its diagonal entries! Do not waste time computing the characteristic equation.";
        shortcut = "In GATE/RRB multiple-choice options, you can eliminate 3 wrong choices in 10 seconds simply by checking which set of numbers multiplies to det(A) and sums to Trace(A).";
      } else {
        replyText = `That is an insightful query regarding ${selectedMentor.specialty}. In competitive examinations, mastering the underlying principle along with the boundary conditions is what differentiates top percentiles.`;
        shortcut = `Review our curated Formula Vault and Flashcard active recall decks for this subject.`;
      }

      const mentorReply: ChatMessage = {
        id: Date.now() + 1,
        sender: 'mentor',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        conceptBreakdown: {
          formula,
          pitfall,
          shortcut
        }
      };

      setMessages((prev) => [...prev, mentorReply]);
      setIsTyping(false);
    }, 750);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#0c0c18] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-white/10 flex flex-col h-[650px] max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#070710] border-b border-white/10 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-md shrink-0">
              <img src={selectedMentor.avatar} alt={selectedMentor.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight text-white">{selectedMentor.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  AI Live Mentor
                </span>
              </div>
              <p className="text-[11px] text-indigo-300 font-semibold mt-0.5">
                {selectedMentor.title} • {selectedMentor.specialty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSpeak(messages[messages.length - 1]?.text || '')}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
                isSpeaking
                  ? 'bg-indigo-600 text-white border-indigo-400 animate-pulse'
                  : 'bg-white/[0.06] text-slate-300 hover:text-white border-white/10'
              }`}
              title="Voice Readout"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mentor Selection Tabs */}
        <div className="px-3 py-2 bg-[#090914] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          {MENTORS.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSwitchMentor(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
                selectedMentor.id === m.id
                  ? 'bg-indigo-600 text-white border-indigo-400/50 shadow-xs'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border-white/5'
              }`}
            >
              <img src={m.avatar} alt={m.name} className="w-4 h-4 rounded-full object-cover" />
              <span>{m.name.split(' ')[0]} {m.name.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-4 py-2 bg-[#06060c] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Quick Doubts:
          </span>
          {selectedMentor.suggestedPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-[11px] font-medium transition-all whitespace-nowrap shrink-0 active:scale-95"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 bg-[#050508] p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-4 rounded-2xl max-w-[90%] leading-relaxed shadow-md space-y-2.5 ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-xs border border-indigo-400/30'
                      : 'bg-[#0c0c18] text-slate-200 border border-white/10 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Formula Callout */}
                  {msg.conceptBreakdown?.formula && (
                    <div className="p-3 rounded-xl bg-black/40 border border-indigo-500/30">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-0.5">
                        Mathematical Formula
                      </span>
                      <code className="text-xs sm:text-sm font-mono font-bold text-amber-300">
                        {msg.conceptBreakdown.formula}
                      </code>
                    </div>
                  )}

                  {/* Pitfall Callout */}
                  {msg.conceptBreakdown?.pitfall && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-start gap-1.5 text-rose-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-rose-300">Exam Trap:</strong> {msg.conceptBreakdown.pitfall}
                      </span>
                    </div>
                  )}

                  {/* Shortcut Callout */}
                  {msg.conceptBreakdown?.shortcut && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-1.5 text-amber-200">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-amber-300">Pro Shortcut:</strong> {msg.conceptBreakdown.shortcut}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              <span>{selectedMentor.name} is formulating response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }} 
          className="p-3 bg-[#070710] border-t border-white/10 flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask ${selectedMentor.name} a question, formula derivation or doubt...`}
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950/50 text-xs font-bold"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
