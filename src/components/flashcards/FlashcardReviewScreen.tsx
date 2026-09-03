import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Search, 
  Filter, 
  Shuffle, 
  BookOpen, 
  Award, 
  Layers, 
  ArrowLeft,
  Flame,
  BrainCircuit,
  Lightbulb,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Flashcard, FlashcardCategory, ActiveScreen } from '../../types';
import { INITIAL_FLASHCARDS } from '../../data/mockFlashcards';

interface FlashcardReviewScreenProps {
  onBack: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

const STORAGE_FLASHCARDS_KEY = 'eduflow_saved_flashcards_v2';

export const FlashcardReviewScreen: React.FC<FlashcardReviewScreenProps> = ({
  onBack,
  setActiveScreen
}) => {
  // Load saved flashcards or fallback
  const [cards, setCards] = useState<Flashcard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FLASHCARDS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading flashcards', e);
    }
    return INITIAL_FLASHCARDS;
  });

  const [activeCategory, setActiveCategory] = useState<FlashcardCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [streakCount, setStreakCount] = useState(14);

  // New card form state
  const [newCard, setNewCard] = useState({
    category: 'gate-me' as Flashcard['category'],
    categoryLabel: 'GATE Mechanical',
    subtopic: '',
    question: '',
    answer: '',
    formula: '',
    tip: '',
    mnemonic: '',
    difficulty: 'Moderate' as Flashcard['difficulty']
  });

  // Filter cards
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesCategory = activeCategory === 'all' || card.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || 
        card.question.toLowerCase().includes(query) ||
        card.answer.toLowerCase().includes(query) ||
        card.subtopic.toLowerCase().includes(query) ||
        card.categoryLabel.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [cards, activeCategory, searchQuery]);

  // Reset current index when category/filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [activeCategory, searchQuery]);

  // Sync to localStorage
  const saveCards = (updated: Flashcard[]) => {
    setCards(updated);
    try {
      localStorage.setItem(STORAGE_FLASHCARDS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving flashcards', e);
    }
  };

  const currentCard = filteredCards[currentIndex];

  // Stats
  const totalMastered = cards.filter((c) => c.boxLevel === 4 || c.mastered).length;
  const masteredPct = Math.round((totalMastered / cards.length) * 100) || 0;

  // Navigation
  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredCards.length - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    saveCards(shuffled);
    setCurrentIndex(0);
  };

  // Leitner spaced repetition rating
  const handleRating = (levelChange: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    let newBox: 1 | 2 | 3 | 4 = currentCard.boxLevel;
    let isMastered = currentCard.mastered;

    if (levelChange === 'again') {
      newBox = 1;
      isMastered = false;
    } else if (levelChange === 'hard') {
      newBox = Math.max(1, currentCard.boxLevel) as 1 | 2 | 3 | 4;
    } else if (levelChange === 'good') {
      newBox = Math.min(4, currentCard.boxLevel + 1) as 1 | 2 | 3 | 4;
      if (newBox === 4) isMastered = true;
    } else if (levelChange === 'easy') {
      newBox = 4;
      isMastered = true;
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    const updated = cards.map((c) =>
      c.id === currentCard.id
        ? {
            ...c,
            boxLevel: newBox,
            mastered: isMastered,
            lastReviewed: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }
        : c
    );

    saveCards(updated);
    setStreakCount((prev) => prev + 1);
    handleNext();
  };

  // Text to Speech
  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Add custom card
  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.question.trim() || !newCard.answer.trim()) return;

    const categoryMap: Record<Flashcard['category'], string> = {
      'gate-me': 'GATE Mechanical',
      'rrb-railway': 'RRB Railways',
      'math': 'Engineering Math',
      'aptitude': 'Quantitative Aptitude',
      'polity': 'Indian Polity (UPSC)'
    };

    const cardToAdd: Flashcard = {
      id: `custom-fc-${Date.now()}`,
      category: newCard.category,
      categoryLabel: categoryMap[newCard.category],
      subtopic: newCard.subtopic.trim() || 'General Concept',
      question: newCard.question.trim(),
      answer: newCard.answer.trim(),
      formula: newCard.formula.trim() || undefined,
      tip: newCard.tip.trim() || undefined,
      mnemonic: newCard.mnemonic.trim() || undefined,
      difficulty: newCard.difficulty,
      boxLevel: 1,
      mastered: false,
      lastReviewed: 'Just Created'
    };

    saveCards([cardToAdd, ...cards]);
    setIsAddModalOpen(false);
    setNewCard({
      category: 'gate-me',
      categoryLabel: 'GATE Mechanical',
      subtopic: '',
      question: '',
      answer: '',
      formula: '',
      tip: '',
      mnemonic: '',
      difficulty: 'Moderate'
    });
    setActiveCategory(cardToAdd.category);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6 pb-28 md:pb-12 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c0c18]/80 p-5 rounded-3xl border border-white/10 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-slate-200 transition-colors shrink-0"
            title="Return to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <BrainCircuit className="w-3 h-3 text-indigo-400" />
                Active Recall Engine
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                {streakCount} Day Streak
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Spaced Repetition Flashcards
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Leitner 4-box system designed for GATE, RRB, Engineering &amp; UPSC aspirants.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleShuffle}
            className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs"
            title="Shuffle deck order"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-400" />
            <span>Shuffle</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-indigo-900/30"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>Create Card</span>
          </button>
          <button
            onClick={() => setActiveScreen('formula-bank')}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Open Formula Vault"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Formula Bank</span>
          </button>
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="bg-[#0c0c18]/70 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Deck Mastery Progress</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{masteredPct}% Mastered</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {totalMastered} of {cards.length} cards in Box 4 (Long-Term Retention)
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-md w-full bg-white/[0.06] rounded-full h-2.5 overflow-hidden border border-white/10">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(5, masteredPct)}%` }}
          />
        </div>
      </div>

      {/* Category Filter Chips & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {[
            { id: 'all', label: 'All Cards' },
            { id: 'gate-me', label: 'GATE ME' },
            { id: 'rrb-railway', label: 'RRB Railways' },
            { id: 'math', label: 'Engg Math' },
            { id: 'aptitude', label: 'Aptitude' },
            { id: 'polity', label: 'UPSC Polity' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as FlashcardCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white border-indigo-400/50 shadow-xs'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Primary 3D Flip Flashcard */}
      {filteredCards.length === 0 ? (
        <div className="p-12 text-center bg-[#0c0c18]/60 rounded-3xl border border-white/10 text-slate-400 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-600" />
          <p className="text-sm font-semibold">No flashcards found matching your filter or search.</p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {/* Deck Counter and Box Level */}
          <div className="flex items-center justify-between w-full max-w-2xl px-2">
            <span className="text-xs font-bold font-mono text-slate-400">
              Card {currentIndex + 1} of {filteredCards.length}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                Leitner Box:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((box) => (
                  <div
                    key={box}
                    className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center border transition-all ${
                      currentCard.boxLevel === box
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-xs'
                        : currentCard.boxLevel > box
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-white/[0.04] text-slate-400 border-white/10'
                    }`}
                  >
                    {box}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3D Interactive Card */}
          <div 
            className="w-full max-w-2xl h-[380px] sm:h-[400px] cursor-pointer perspective-1000 select-none group"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative w-full h-full"
            >
              {/* FRONT SIDE (Question) */}
              <div 
                style={{ backfaceVisibility: 'hidden' }}
                className={`absolute inset-0 bg-[#0c0c18] rounded-3xl p-6 sm:p-8 border flex flex-col justify-between shadow-2xl transition-all ${
                  currentCard.mastered
                    ? 'border-emerald-500/40 shadow-emerald-950/20'
                    : 'border-white/15 hover:border-indigo-500/40'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {currentCard.categoryLabel}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      • {currentCard.subtopic}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(currentCard.question);
                      }}
                      className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                      title="Listen to question"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      currentCard.difficulty === 'Easy'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : currentCard.difficulty === 'Moderate'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}>
                      {currentCard.difficulty}
                    </span>
                  </div>
                </div>

                {/* Question Body */}
                <div className="my-auto py-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 block">
                    Question Prompt
                  </span>
                  <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    {currentCard.question}
                  </p>
                </div>

                {/* Flip Instruction Hint */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                    <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                    Click anywhere to flip for solution &amp; formula
                  </span>
                  {currentCard.formula && (
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-300">
                      Formula Included
                    </span>
                  )}
                </div>
              </div>

              {/* BACK SIDE (Answer & Formulas) */}
              <div 
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                className="absolute inset-0 bg-[#0e0d22] rounded-3xl p-6 sm:p-8 border border-indigo-500/40 flex flex-col justify-between shadow-2xl overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Verified Solution &amp; Derivation
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(currentCard.answer);
                    }}
                    className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                    title="Listen to solution"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Solution Text */}
                <div className="my-auto py-2 space-y-3">
                  <p className="text-sm sm:text-base text-slate-100 whitespace-pre-line leading-relaxed font-medium">
                    {currentCard.answer}
                  </p>

                  {/* Formula Callout */}
                  {currentCard.formula && (
                    <div className="p-3 rounded-xl bg-[#080714] border border-indigo-500/30 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                          Key Mathematical Formula
                        </span>
                        <code className="text-sm font-mono font-bold text-amber-300">
                          {currentCard.formula}
                        </code>
                      </div>
                    </div>
                  )}

                  {/* Exam Tip or Mnemonic */}
                  {(currentCard.tip || currentCard.mnemonic) && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-xs">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-amber-200">
                        {currentCard.tip && <span>{currentCard.tip} </span>}
                        {currentCard.mnemonic && (
                          <span className="font-bold block mt-0.5 text-amber-300">
                            💡 Mnemonic: {currentCard.mnemonic}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Flip Back Hint */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
                  <span>Rate your recall below to schedule next review</span>
                  <span className="text-indigo-400 hover:underline">Flip to question</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recall Feedback Bar (Leitner System Buttons) */}
          <div className="flex flex-col items-center gap-3 w-full max-w-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
              <button
                onClick={() => handleRating('again')}
                className="p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex flex-col items-center gap-1 active:scale-95 group shadow-xs"
              >
                <div className="flex items-center gap-1 font-black">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Again</span>
                </div>
                <span className="text-[10px] text-rose-400/80 font-normal">Box 1 • Review in 1m</span>
              </button>

              <button
                onClick={() => handleRating('hard')}
                className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex flex-col items-center gap-1 active:scale-95 group shadow-xs"
              >
                <div className="flex items-center gap-1 font-black">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hard</span>
                </div>
                <span className="text-[10px] text-amber-400/80 font-normal">Same Box • Repeat soon</span>
              </button>

              <button
                onClick={() => handleRating('good')}
                className="p-3 rounded-2xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all flex flex-col items-center gap-1 active:scale-95 group shadow-xs"
              >
                <div className="flex items-center gap-1 font-black">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Good</span>
                </div>
                <span className="text-[10px] text-indigo-400/80 font-normal">+1 Box • Progress</span>
              </button>

              <button
                onClick={() => handleRating('easy')}
                className="p-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex flex-col items-center gap-1 active:scale-95 group shadow-xs"
              >
                <div className="flex items-center gap-1 font-black">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mastered!</span>
                </div>
                <span className="text-[10px] text-emerald-400/80 font-normal">Box 4 • Long Term</span>
              </button>
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between w-full pt-1">
              <button
                onClick={handlePrev}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline"
              >
                {isFlipped ? 'Show Question' : 'Reveal Solution'}
              </button>

              <button
                onClick={handleNext}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <span>Next Card</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Flashcard Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0c0c18] rounded-3xl max-w-lg w-full p-6 border border-white/15 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Custom Flashcard</h3>
                  <p className="text-[11px] text-slate-400">Save custom formulas, definitions &amp; tricks</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Target Category</label>
                  <select
                    value={newCard.category}
                    onChange={(e) => setNewCard({ ...newCard, category: e.target.value as Flashcard['category'] })}
                    className="w-full p-2 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="gate-me" className="bg-[#0c0c18]">GATE Mechanical</option>
                    <option value="rrb-railway" className="bg-[#0c0c18]">RRB Railways</option>
                    <option value="math" className="bg-[#0c0c18]">Engineering Math</option>
                    <option value="aptitude" className="bg-[#0c0c18]">Quantitative Aptitude</option>
                    <option value="polity" className="bg-[#0c0c18]">Indian Polity (UPSC)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Subtopic / Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Thermodynamics"
                    value={newCard.subtopic}
                    onChange={(e) => setNewCard({ ...newCard, subtopic: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Question / Concept Prompt</label>
                <textarea
                  rows={3}
                  placeholder="Enter the core question, definition request or problem prompt..."
                  value={newCard.question}
                  onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Detailed Solution / Answer</label>
                <textarea
                  rows={3}
                  placeholder="Enter the complete answer, derivation steps and explanation..."
                  value={newCard.answer}
                  onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Key Formula (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. η = 1 - T_L/T_H"
                    value={newCard.formula}
                    onChange={(e) => setNewCard({ ...newCard, formula: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Memory Mnemonic (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Hot minus Cold over Hot"
                    value={newCard.mnemonic}
                    onChange={(e) => setNewCard({ ...newCard, mnemonic: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md"
                >
                  Save Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
