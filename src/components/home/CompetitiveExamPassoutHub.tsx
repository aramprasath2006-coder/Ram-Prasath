import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Landmark, 
  Cpu, 
  Train, 
  Calculator, 
  CheckCircle2, 
  ExternalLink, 
  UserCheck, 
  Clock, 
  Calendar, 
  BarChart3, 
  ChevronRight,
  ArrowRight,
  BookOpen,
  Mail,
  Send,
  Download,
  Flame,
  Check
} from 'lucide-react';
import { 
  ExamCategory, 
  ExamAchiever, 
  ACADEMIC_EXAM_STATS, 
  YEAR_WISE_PASSOUT_DATA, 
  FEATURED_EXAM_ACHIEVERS 
} from '../../data/mockAcademicAchievers';
import { AlumniScorecardModal } from './AlumniScorecardModal';
import { ActiveScreen } from '../../types';

interface CompetitiveExamPassoutHubProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenTeacherChat?: () => void;
}

export const CompetitiveExamPassoutHub: React.FC<CompetitiveExamPassoutHubProps> = ({
  setActiveScreen,
  onOpenTeacherChat
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAchieverForScorecard, setSelectedAchieverForScorecard] = useState<ExamAchiever | null>(null);
  const [mentorshipRequestedFor, setMentorshipRequestedFor] = useState<string | null>(null);
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    searched: boolean;
    found?: ExamAchiever;
    error?: string;
  } | null>(null);
  const [showYearlyAnalytics, setShowYearlyAnalytics] = useState(false);

  // Filter achievers based on selected category and search query
  const filteredAchievers = useMemo(() => {
    return FEATURED_EXAM_ACHIEVERS.filter((achiever) => {
      const matchesCategory = selectedCategory === 'ALL' || achiever.examCategory === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        achiever.name.toLowerCase().includes(q) ||
        achiever.examName.toLowerCase().includes(q) ||
        achiever.rollNo.toLowerCase().includes(q) ||
        achiever.rankOrScore.toLowerCase().includes(q) ||
        achiever.currentPosting.toLowerCase().includes(q) ||
        achiever.batchYear.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Current Category Stats
  const activeCategoryStat = useMemo(() => {
    return ACADEMIC_EXAM_STATS.find(s => s.category === selectedCategory) || ACADEMIC_EXAM_STATS[0];
  }, [selectedCategory]);

  const handleVerifyRoll = (e: React.FormEvent) => {
    e.preventDefault();
    const query = verificationInput.trim().toUpperCase();
    if (!query) return;

    const found = FEATURED_EXAM_ACHIEVERS.find(
      a => a.rollNo.toUpperCase() === query || a.name.toUpperCase().includes(query)
    );

    if (found) {
      setVerificationResult({ searched: true, found });
    } else {
      setVerificationResult({
        searched: true,
        error: `No records found for "${query}". Note: Database contains verified passed-out alumni roll numbers (e.g. 21CS0104, 21ME0210, 20ME0088).`
      });
    }
  };

  const handleRequestMentorship = (achiever: ExamAchiever) => {
    setMentorshipRequestedFor(achiever.name);
    setTimeout(() => setMentorshipRequestedFor(null), 4000);
  };

  return (
    <div id="academic-achievers-section" className="flex flex-col gap-6 sm:gap-8 scroll-mt-24">
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-950/40">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Passed-Out Alumni &amp; Competitive Exam Hall of Fame
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mt-1">
            1,500+ Students Cleared National Competitive Exams
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Our academy takes immense pride in over <strong>1,540+ passed-out graduates</strong> who secured stellar All-India Ranks and appointments across <strong>UPSC Civil Services (IAS/IPS), GATE Engineering, Indian Railways (RRB), and Quantitative Aptitude / Banking examinations</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowYearlyAnalytics(!showYearlyAnalytics)}
            className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-indigo-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{showYearlyAnalytics ? 'Hide Growth Chart' : 'Yearly Pass-Out Analytics'}</span>
          </button>
        </div>
      </div>

      {/* CATEGORY BREAKDOWN CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* UPSC / IAS Card */}
        <div
          onClick={() => setSelectedCategory('UPSC_IAS')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
            selectedCategory === 'UPSC_IAS'
              ? 'bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border-indigo-400 shadow-xl shadow-indigo-950/50'
              : 'bg-[#0c0c18]/80 border-white/10 hover:border-indigo-500/40 hover:bg-[#111124]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1 text-indigo-300">
              <Landmark className="w-3.5 h-3.5" /> UPSC &amp; IAS
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              AIR 4
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">342+</div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-medium">Civil Services Officers</p>
        </div>

        {/* GATE & PSU Card */}
        <div
          onClick={() => setSelectedCategory('GATE_ENG')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
            selectedCategory === 'GATE_ENG'
              ? 'bg-gradient-to-br from-purple-900/60 to-indigo-900/40 border-purple-400 shadow-xl shadow-purple-950/50'
              : 'bg-[#0c0c18]/80 border-white/10 hover:border-purple-500/40 hover:bg-[#111124]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1 text-purple-300">
              <Cpu className="w-3.5 h-3.5" /> GATE &amp; PSUs
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              982 Score
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">485+</div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-medium">ISRO / BARC / IITs</p>
        </div>

        {/* Indian Railways Card */}
        <div
          onClick={() => setSelectedCategory('RAILWAY_RRB')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
            selectedCategory === 'RAILWAY_RRB'
              ? 'bg-gradient-to-br from-amber-900/60 to-orange-900/40 border-amber-400 shadow-xl shadow-amber-950/50'
              : 'bg-[#0c0c18]/80 border-white/10 hover:border-amber-500/40 hover:bg-[#111124]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1 text-amber-300">
              <Train className="w-3.5 h-3.5" /> Railway (RRB)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Rank 1
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">388+</div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-medium">SSE &amp; JE Engineers</p>
        </div>

        {/* Aptitude & Banking Card */}
        <div
          onClick={() => setSelectedCategory('APTITUDE_BANKING')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
            selectedCategory === 'APTITUDE_BANKING'
              ? 'bg-gradient-to-br from-emerald-900/60 to-teal-900/40 border-emerald-400 shadow-xl shadow-emerald-950/50'
              : 'bg-[#0c0c18]/80 border-white/10 hover:border-emerald-500/40 hover:bg-[#111124]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1 text-emerald-300">
              <Calculator className="w-3.5 h-3.5" /> Aptitude &amp; CAT
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              99.94%ile
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">425+</div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-medium">RBI / SBI / IIM Ranks</p>
        </div>
      </div>

      {/* YEARLY GROWTH ANALYTICS EXPANDABLE DRAWER */}
      {showYearlyAnalytics && (
        <div className="bg-gradient-to-br from-[#0c0c18] to-[#121026] border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Historical Passed-Out &amp; Exam Selection Growth (2021 – 2026)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Year-on-year expansion of students clearing national competitive tests</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              +34% Average Annual Growth
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {YEAR_WISE_PASSOUT_DATA.map((row) => (
              <div key={row.year} className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 font-mono">{row.year} Batch</span>
                  <span className="text-xs font-black text-amber-300 font-mono">{row.totalPassedOut} Placed</span>
                </div>

                {/* Progress Stack */}
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-indigo-300">UPSC:</span>
                    <strong className="font-mono">{row.upscCount}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-purple-300">GATE:</span>
                    <strong className="font-mono">{row.gateCount}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-amber-300">Railway:</span>
                    <strong className="font-mono">{row.railwayCount}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-emerald-300">Aptitude:</span>
                    <strong className="font-mono">{row.aptitudeBankingCount}</strong>
                  </div>
                </div>

                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                  <div style={{ width: `${(row.upscCount / row.totalPassedOut) * 100}%` }} className="bg-indigo-500 h-full" title="UPSC" />
                  <div style={{ width: `${(row.gateCount / row.totalPassedOut) * 100}%` }} className="bg-purple-500 h-full" title="GATE" />
                  <div style={{ width: `${(row.railwayCount / row.totalPassedOut) * 100}%` }} className="bg-amber-500 h-full" title="Railway" />
                  <div style={{ width: `${(row.aptitudeBankingCount / row.totalPassedOut) * 100}%` }} className="bg-emerald-500 h-full" title="Aptitude" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER TABS & LIVE SEARCH BAR */}
      <div className="bg-[#0c0c18]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {ACADEMIC_EXAM_STATS.map((stat) => (
            <button
              key={stat.category}
              onClick={() => setSelectedCategory(stat.category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === stat.category
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50 border border-indigo-400/30'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              <span>{stat.label.split(' ')[0]}</span>
              <span className="text-[10px] font-mono opacity-80">({stat.totalPassedCount})</span>
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alumni by name, roll no, AIR rank, or exam..."
            className="w-full bg-black/50 border border-white/15 focus:border-indigo-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* SUCCESS TOAST FOR MENTORSHIP */}
      {mentorshipRequestedFor && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Mentorship connection requested with <strong>{mentorshipRequestedFor}</strong>! The Alumni Relations Cell will connect you via email.</span>
          </div>
          <button onClick={() => setMentorshipRequestedFor(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ACHIEVERS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredAchievers.map((achiever) => {
          const isUpsc = achiever.examCategory === 'UPSC_IAS';
          const isGate = achiever.examCategory === 'GATE_ENG';
          const isRailway = achiever.examCategory === 'RAILWAY_RRB';
          const isAptitude = achiever.examCategory === 'APTITUDE_BANKING';

          return (
            <div
              key={achiever.id}
              className="bg-[#0c0c18]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl shadow-black/20 flex flex-col justify-between gap-5 hover:border-indigo-500/40 hover:bg-[#111124] transition-all group relative overflow-hidden"
            >
              {/* Subtle category accent bar at top */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isUpsc ? 'bg-gradient-to-r from-indigo-500 to-purple-500' :
                  isGate ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                  isRailway ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                  'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`} 
              />

              {/* Achiever Header */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-white/15 group-hover:border-indigo-500/50 transition-all shrink-0 bg-slate-900 shadow-md">
                      <img src={achiever.avatar} alt={achiever.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                        {achiever.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium font-mono">
                        Roll: <strong className="text-slate-200">{achiever.rollNo}</strong> • Batch {achiever.batchYear}
                      </p>
                    </div>
                  </div>

                  {/* Rank Badge */}
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-black shrink-0 border font-mono shadow-xs ${
                    isUpsc ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' :
                    isGate ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                    isRailway ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {achiever.rankOrScore.split(' ')[0]} {achiever.rankOrScore.split(' ')[1] || ''}
                  </span>
                </div>

                {/* Exam Title & Designation */}
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 space-y-1">
                  <div className="flex items-center gap-1 text-xs font-bold text-white">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="line-clamp-1">{achiever.examName}</span>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span className="line-clamp-1">{achiever.currentPosting}</span>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-xs text-slate-300 italic leading-relaxed line-clamp-3">
                  "{achiever.quote}"
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => setSelectedAchieverForScorecard(achiever)}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verify Scorecard</span>
                </button>

                <button
                  onClick={() => handleRequestMentorship(achiever)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Mentorship</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAchievers.length === 0 && (
        <div className="text-center py-12 bg-[#0c0c18]/60 border border-white/10 rounded-3xl p-6 space-y-3">
          <Search className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-slate-300 text-sm font-semibold">No alumni achiever records found matching "{searchQuery}".</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
          >
            Clear Filters &amp; View All 1,500+ Achievers
          </button>
        </div>
      )}

      {/* VERIFY ALUMNI ROLL NUMBER INTERACTIVE WIDGET */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-[#0c0c18] to-purple-950/70 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Official Institutional Roll Number &amp; Rank Verification
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Verify any student's competitive exam merit status directly from the academy's official registry. Enter a University Roll Number (e.g. <strong>21CS0104</strong>, <strong>21ME0210</strong>, <strong>20ME0088</strong>).
          </p>
        </div>

        <form onSubmit={handleVerifyRoll} className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
          <input
            type="text"
            value={verificationInput}
            onChange={(e) => setVerificationInput(e.target.value)}
            placeholder="Enter Student Roll No..."
            className="w-full sm:w-64 bg-black/60 border border-white/20 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-all uppercase"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg transition-all active:scale-95 shrink-0 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Credentials</span>
          </button>
        </form>
      </div>

      {/* Verification Result Feedback Modal / Card */}
      {verificationResult && (
        <div className="bg-[#0e0e22] border border-indigo-500/40 rounded-2xl p-5 animate-in fade-in duration-200">
          {verificationResult.found ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={verificationResult.found.avatar} alt={verificationResult.found.name} className="w-12 h-12 rounded-xl object-cover border border-emerald-500/50" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{verificationResult.found.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Verified Graduate
                    </span>
                  </div>
                  <p className="text-xs text-indigo-300 font-mono mt-0.5">
                    Roll: {verificationResult.found.rollNo} • {verificationResult.found.examName} ({verificationResult.found.rankOrScore})
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">Posting: {verificationResult.found.currentPosting}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedAchieverForScorecard(verificationResult.found!)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  View Verified Scorecard
                </button>
                <button
                  onClick={() => setVerificationResult(null)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white text-xs"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-rose-300">
              <span>{verificationResult.error}</span>
              <button onClick={() => setVerificationResult(null)} className="text-slate-400 hover:text-white ml-3">✕</button>
            </div>
          )}
        </div>
      )}

      {/* SCORECARD AUDIT MODAL */}
      <AlumniScorecardModal
        achiever={selectedAchieverForScorecard}
        isOpen={!!selectedAchieverForScorecard}
        onClose={() => setSelectedAchieverForScorecard(null)}
        onRequestMentorship={handleRequestMentorship}
      />
    </div>
  );
};
