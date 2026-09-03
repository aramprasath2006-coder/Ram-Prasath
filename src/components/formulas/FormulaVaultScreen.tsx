import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  BookMarked, 
  Copy, 
  Check, 
  Printer, 
  ArrowLeft, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Filter,
  FileText,
  Star,
  BrainCircuit,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { FormulaItem, ActiveScreen } from '../../types';
import { INITIAL_FORMULAS } from '../../data/mockFormulas';

interface FormulaVaultScreenProps {
  onBack: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

const STORAGE_BOOKMARKS_KEY = 'eduflow_bookmarked_formula_ids';

export const FormulaVaultScreen: React.FC<FormulaVaultScreenProps> = ({
  onBack,
  setActiveScreen
}) => {
  const [formulas, setFormulas] = useState<FormulaItem[]>(INITIAL_FORMULAS);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading formula bookmarks', e);
    }
    return ['form-gate-01', 'form-rrb-01', 'form-math-01'];
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'cheatsheet'>('cards');
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);

  // Toggle bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving formula bookmarks', e);
      }
      return updated;
    });
  };

  // Copy formula
  const handleCopyFormula = (formula: FormulaItem) => {
    navigator.clipboard.writeText(`${formula.title}: ${formula.formula}`);
    setCopiedId(formula.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered formulas
  const filteredFormulas = useMemo(() => {
    return formulas.filter((f) => {
      const matchesCat = activeCategory === 'all' || f.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        f.title.toLowerCase().includes(query) ||
        f.formula.toLowerCase().includes(query) ||
        f.subject.toLowerCase().includes(query) ||
        f.tags.some((t) => t.toLowerCase().includes(query)) ||
        f.variables.some((v) => v.symbol.toLowerCase().includes(query) || v.meaning.toLowerCase().includes(query));
      const matchesBookmark = !onlyBookmarks || bookmarkedIds.includes(f.id);
      return matchesCat && matchesSearch && matchesBookmark;
    });
  }, [formulas, activeCategory, searchQuery, onlyBookmarks, bookmarkedIds]);

  // Categories list
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'GATE Mechanical', label: 'GATE Mechanical' },
    { id: 'Railway Science', label: 'Railway Science' },
    { id: 'Engineering Math', label: 'Engineering Math' },
    { id: 'Quantitative Aptitude', label: 'Quantitative Aptitude' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6 pb-28 md:pb-12 animate-in fade-in duration-200">
      {/* Header */}
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
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Layers className="w-3 h-3 text-purple-400" />
                Formula Vault &amp; Cheat Sheets
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                {bookmarkedIds.length} Saved
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              High-Yield Formula Vault
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Curated equations, variable definitions, and common exam traps for competitive aspirants.
            </p>
          </div>
        </div>

        {/* View mode toggle & Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="flex items-center p-1 rounded-xl bg-white/[0.05] border border-white/10">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Detailed Cards
            </button>
            <button
              onClick={() => setViewMode('cheatsheet')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cheatsheet'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Printable Sheet
            </button>
          </div>

          <button
            onClick={() => setActiveScreen('flashcards')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Open Active Recall Flashcards"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Print Formula Sheet"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white border-purple-400/50 shadow-xs'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <button
            onClick={() => setOnlyBookmarks(!onlyBookmarks)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
              onlyBookmarks
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border-white/5'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyBookmarks ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Bookmarked Only</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search equations, variables, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Content Rendering: Detailed Cards Mode */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredFormulas.map((formula) => {
            const isBookmarked = bookmarkedIds.includes(formula.id);
            const isCopied = copiedId === formula.id;

            return (
              <div
                key={formula.id}
                className="bg-[#0c0c18]/90 rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-xl shadow-black/20 group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {formula.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {formula.subject}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleBookmark(formula.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border ${
                          isBookmarked
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                            : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'
                        }`}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark formula'}
                      >
                        <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleCopyFormula(formula)}
                        className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                        title="Copy formula text"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Title & Significance */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      {formula.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
                      {formula.examSignificance}
                    </span>
                  </div>

                  {/* High Contrast Math Formula Display */}
                  <div className="p-4 rounded-2xl bg-[#06060c] border border-purple-500/30 flex items-center justify-between mb-4 group-hover:border-purple-400/60 transition-colors">
                    <code className="text-base sm:text-lg font-mono font-bold text-amber-300 tracking-wide overflow-x-auto">
                      {formula.formula}
                    </code>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {formula.description}
                  </p>

                  {/* Variables Table */}
                  <div className="mb-4 bg-white/[0.02] rounded-xl p-3 border border-white/5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Variable Symbols &amp; Units
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                      {formula.variables.map((v, i) => (
                        <div key={i} className="flex items-baseline gap-1.5 text-slate-300">
                          <span className="font-mono font-bold text-purple-300">{v.symbol}:</span>
                          <span className="text-slate-300 text-[11px]">{v.meaning}</span>
                          {v.unit && (
                            <span className="text-[10px] text-slate-500 italic">[{v.unit}]</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exam Pitfall Box */}
                  {formula.commonPitfalls && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2 text-xs mb-4">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="text-rose-200">
                        <span className="font-bold text-rose-300 block">Common Exam Trap:</span>
                        {formula.commonPitfalls}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Tags */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {formula.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 border border-white/5">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopyFormula(formula)}
                    className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                  >
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Printable Cheat Sheet View */
        <div className="bg-[#0c0c18] rounded-3xl p-6 border border-white/15 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white">Consolidated Revision Cheat Sheet</h2>
              <p className="text-xs text-slate-400">Condensed formula reference for quick scanning before examinations.</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-400">
              {filteredFormulas.length} Formulas Listed
            </span>
          </div>

          <div className="divide-y divide-white/10">
            {filteredFormulas.map((f, idx) => (
              <div key={f.id} className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                <div className="sm:w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{idx + 1}.</span>
                    <h4 className="text-sm font-bold text-white">{f.title}</h4>
                  </div>
                  <div className="text-[11px] text-purple-400 mt-0.5">{f.category} • {f.subject}</div>
                </div>

                <div className="sm:w-1/2">
                  <code className="text-sm font-mono font-bold text-amber-300 block bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                    {f.formula}
                  </code>
                  <p className="text-[11px] text-rose-300/90 mt-1">
                    <span className="font-bold text-rose-400">Trap: </span>
                    {f.commonPitfalls}
                  </p>
                </div>

                <div className="sm:w-auto self-end sm:self-center">
                  <button
                    onClick={() => handleCopyFormula(f)}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white"
                    title="Copy formula"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
