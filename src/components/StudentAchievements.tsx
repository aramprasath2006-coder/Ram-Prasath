import React, { useState, useMemo } from 'react';
import { ActiveScreen, Course, AchievementBadge, BadgeCategory, BadgeTier } from '../types';
import { useStudentAuth } from '../context/StudentAuthContext';
import { 
  calculateStudentBadges, 
  PEER_HONOR_ROLL 
} from '../data/achievementBadgesData';
import { BadgeDetailModal } from './modals/BadgeDetailModal';
import {
  Award,
  Sparkles,
  BookOpenCheck,
  CheckCircle2,
  Lock,
  Flame,
  Layers,
  Crown,
  Gem,
  Medal,
  CalendarCheck2,
  Timer,
  Compass,
  ChevronRight,
  Sliders,
  RotateCcw,
  Trophy,
  BarChart3,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentAchievementsProps {
  courses: Course[];
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenVideoPlayer?: (title: string, subject: string) => void;
}

export const StudentAchievements: React.FC<StudentAchievementsProps> = ({
  courses,
  setActiveScreen,
  onOpenVideoPlayer
}) => {
  const { currentUser } = useStudentAuth();

  // Filter & Search States
  const [selectedCategory, setSelectedCategory] = useState<'all' | BadgeCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  // Interactive Live Simulator Controls (for testing and demonstrating dynamic badge awards)
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatedCourseCompletion, setSimulatedCourseCompletion] = useState<number>(65);
  const [simulatedQuizScore, setSimulatedQuizScore] = useState<number>(90);
  const [hasCustomSimulation, setHasCustomSimulation] = useState<boolean>(false);

  // Calculate badges dynamically based on real state + simulation overrides
  const {
    badges,
    stats,
    totalXp,
    level,
    levelTitle,
    nextLevelXp,
    unlockedCount
  } = useMemo(() => {
    return calculateStudentBadges(
      courses,
      currentUser,
      hasCustomSimulation ? simulatedQuizScore : undefined,
      hasCustomSimulation ? simulatedCourseCompletion : undefined
    );
  }, [courses, currentUser, hasCustomSimulation, simulatedCourseCompletion, simulatedQuizScore]);

  // Trigger celebration confetti
  const handleCelebrate = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const handleApplySimulator = (coursePct: number, quizScore: number) => {
    setSimulatedCourseCompletion(coursePct);
    setSimulatedQuizScore(quizScore);
    setHasCustomSimulation(true);
    handleCelebrate();
  };

  const handleResetSimulator = () => {
    setHasCustomSimulation(false);
    setSimulatedCourseCompletion(65);
    setSimulatedQuizScore(90);
  };

  // Filter badges
  const filteredBadges = useMemo(() => {
    return badges.filter((b) => {
      // Category filter
      if (selectedCategory !== 'all' && b.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus === 'unlocked' && !b.unlocked) return false;
      if (selectedStatus === 'locked' && b.unlocked) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.subtitle.toLowerCase().includes(q) ||
          b.tier.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [badges, selectedCategory, selectedStatus, searchQuery]);

  // Render badge icon
  const renderBadgeIcon = (iconName: string, sizeClass = "w-6 h-6") => {
    switch (iconName) {
      case 'Flame': return <Flame className={sizeClass} />;
      case 'CheckCircle2': return <CheckCircle2 className={sizeClass} />;
      case 'Layers': return <Layers className={sizeClass} />;
      case 'Crown': return <Crown className={sizeClass} />;
      case 'BookOpenCheck': return <BookOpenCheck className={sizeClass} />;
      case 'Sparkles': return <Sparkles className={sizeClass} />;
      case 'Award': return <Award className={sizeClass} />;
      case 'Gem': return <Gem className={sizeClass} />;
      case 'Medal': return <Medal className={sizeClass} />;
      case 'CalendarCheck2': return <CalendarCheck2 className={sizeClass} />;
      case 'Timer': return <Timer className={sizeClass} />;
      default: return <Compass className={sizeClass} />;
    }
  };

  // Badge card theme styles
  const getBadgeTierStyle = (tier: BadgeTier, unlocked: boolean) => {
    if (!unlocked) {
      return {
        cardBorder: 'border-white/10 hover:border-white/20',
        bg: 'bg-[#0c0c18]/60',
        ring: 'border-slate-600/40 bg-slate-900/60 text-slate-500',
        text: 'text-slate-400',
        badgePill: 'bg-white/5 text-slate-400 border-white/10'
      };
    }

    switch (tier) {
      case 'bronze':
        return {
          cardBorder: 'border-amber-700/40 hover:border-amber-600/70',
          bg: 'bg-gradient-to-b from-amber-950/30 via-[#0c0c18] to-[#0c0c18]',
          ring: 'border-amber-600/60 bg-amber-950/60 text-amber-300 shadow-amber-500/10 shadow-lg',
          text: 'text-amber-300',
          badgePill: 'bg-amber-950/40 text-amber-300 border-amber-600/40'
        };
      case 'silver':
        return {
          cardBorder: 'border-slate-400/40 hover:border-slate-300/70',
          bg: 'bg-gradient-to-b from-slate-900/40 via-[#0c0c18] to-[#0c0c18]',
          ring: 'border-slate-300/60 bg-slate-800/80 text-slate-200 shadow-slate-400/10 shadow-lg',
          text: 'text-slate-200',
          badgePill: 'bg-slate-800/60 text-slate-200 border-slate-400/40'
        };
      case 'gold':
        return {
          cardBorder: 'border-amber-400/50 hover:border-amber-300/80 shadow-amber-500/5 shadow-md',
          bg: 'bg-gradient-to-b from-amber-950/40 via-[#0c0c18] to-[#0c0c18]',
          ring: 'border-amber-400/80 bg-amber-900/60 text-amber-300 shadow-amber-400/20 shadow-xl',
          text: 'text-amber-300',
          badgePill: 'bg-amber-500/20 text-amber-300 border-amber-400/50'
        };
      case 'platinum':
        return {
          cardBorder: 'border-cyan-400/50 hover:border-cyan-300/80',
          bg: 'bg-gradient-to-b from-cyan-950/40 via-[#0c0c18] to-[#0c0c18]',
          ring: 'border-cyan-400/80 bg-cyan-950/80 text-cyan-300 shadow-cyan-400/20 shadow-xl',
          text: 'text-cyan-300',
          badgePill: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
        };
      case 'diamond':
        return {
          cardBorder: 'border-fuchsia-400/50 hover:border-fuchsia-300/80',
          bg: 'bg-gradient-to-b from-fuchsia-950/40 via-[#0c0c18] to-[#0c0c18]',
          ring: 'border-fuchsia-400/80 bg-fuchsia-950/80 text-fuchsia-300 shadow-fuchsia-400/20 shadow-xl',
          text: 'text-fuchsia-300',
          badgePill: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/50'
        };
      case 'legendary':
      default:
        return {
          cardBorder: 'border-purple-400/60 hover:border-purple-300/90 shadow-purple-500/10 shadow-lg',
          bg: 'bg-gradient-to-b from-purple-950/50 via-[#0c0c18] to-[#0c0c18]',
          ring: 'border-purple-400/90 bg-purple-900/70 text-purple-200 shadow-purple-500/30 shadow-2xl',
          text: 'text-purple-300',
          badgePill: 'bg-purple-500/30 text-purple-200 border-purple-400/60'
        };
    }
  };

  const levelProgressPct = Math.min(100, Math.round((totalXp / nextLevelXp) * 100));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 pb-28 md:pb-12 animate-in fade-in duration-200">
      
      {/* Top Breadcrumb & Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
            <button 
              onClick={() => setActiveScreen('student-profile')}
              className="hover:text-indigo-300 transition-colors"
            >
              Student Portal
            </button>
            <span>/</span>
            <span className="text-indigo-400 font-bold">Student Achievements & Digital Badges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif-academy flex items-center gap-2.5">
            <Award className="w-7 h-7 text-amber-400" />
            <span>Student Achievements</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated digital credentialing and badges awarded for syllabus course completion & quiz performance.
          </p>
        </div>

        {/* Quick Simulator Toggle & Celebrate */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
              showSimulator 
                ? 'bg-indigo-600/30 border-indigo-400 text-white' 
                : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>{showSimulator ? 'Close Simulator' : 'Test & Recalculate Badges'}</span>
          </button>
          
          <button
            onClick={handleCelebrate}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-all active:scale-95"
            title="Celebrate unlocked badges"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Celebrate</span>
          </button>
        </div>
      </div>

      {/* Hero Level & Academic Metrics Dashboard */}
      <section className="bg-[#0c0c18]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow Ambient */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Level Crown & Student Info */}
          <div className="flex items-center gap-4 sm:gap-5 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border-2 border-indigo-400/50 flex flex-col items-center justify-center p-2 shadow-xl shadow-indigo-950/50">
                <Crown className="w-8 h-8 text-amber-400 mb-0.5" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">Level</span>
                <span className="text-xl sm:text-2xl font-black text-white leading-none font-mono">{level}</span>
              </div>
              <div className="absolute -bottom-2 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-black/40 shadow">
                RANK #{level}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-academy">{currentUser.name}</h2>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {currentUser.loginId}
                </span>
              </div>
              <p className="text-sm font-semibold text-indigo-300 mt-0.5">{levelTitle}</p>
              
              {/* Level XP Progress */}
              <div className="mt-3 space-y-1.5 w-full sm:w-72">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-400">{totalXp} XP Earned</span>
                  <span className="text-indigo-300 font-mono">{nextLevelXp} XP for Level {level + 1}</span>
                </div>
                <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full transition-all duration-700" 
                    style={{ width: `${levelProgressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            {/* Metric 1: Course Completion */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center flex flex-col justify-between">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>Course Max</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{stats.highestCourseCompletion}%</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Completion Rate</p>
            </div>

            {/* Metric 2: Quiz Score Accuracy */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center flex flex-col justify-between">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <BookOpenCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>Quiz High</span>
              </div>
              <p className="text-2xl font-bold text-rose-300 font-mono">{stats.highestQuizScore}%</p>
              <p className="text-[10px] text-slate-400 mt-0.5">MCQ Precision</p>
            </div>

            {/* Metric 3: Badges Unlocked */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center flex flex-col justify-between">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Badges</span>
              </div>
              <p className="text-2xl font-bold text-amber-300 font-mono">{unlockedCount} / {badges.length}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Claimed</p>
            </div>

            {/* Metric 4: Academic XP */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center flex flex-col justify-between">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Total XP</span>
              </div>
              <p className="text-2xl font-bold text-emerald-300 font-mono">{totalXp}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Academic Credits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator Card (Collapsible) */}
      {showSimulator && (
        <section className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/40 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 animate-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white font-serif-academy">
                  Interactive Course Completion & Quiz Score Tester
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Adjust sliders to test how real-time course progress or quiz results immediately award digital badges!
              </p>
            </div>
            
            {hasCustomSimulation && (
              <button
                onClick={handleResetSimulator}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all w-max"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Actual Enrolled Progress</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slider 1: Course Completion % */}
            <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  Course Completion Progress
                </span>
                <span className="text-base font-bold text-white font-mono bg-indigo-500/20 px-2.5 py-0.5 rounded-lg border border-indigo-500/30">
                  {simulatedCourseCompletion}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={simulatedCourseCompletion}
                onChange={(e) => handleApplySimulator(Number(e.target.value), simulatedQuizScore)}
                className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% (Enrolled)</span>
                <span>25% (First Step)</span>
                <span>50% (Midway)</span>
                <span>100% (Finisher Badge)</span>
              </div>
            </div>

            {/* Slider 2: Quiz Score Accuracy % */}
            <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-rose-300 flex items-center gap-1.5">
                  <BookOpenCheck className="w-4 h-4 text-rose-400" />
                  MCQ Assessment Score Accuracy
                </span>
                <span className="text-base font-bold text-white font-mono bg-rose-500/20 px-2.5 py-0.5 rounded-lg border border-rose-500/30">
                  {simulatedQuizScore}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={simulatedQuizScore}
                onChange={(e) => handleApplySimulator(simulatedCourseCompletion, Number(e.target.value))}
                className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>60% (Initiate)</span>
                <span>80% (Distinction)</span>
                <span>90% (Virtuoso)</span>
                <span>100% (Centurion 💎)</span>
              </div>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-semibold">Test Presets:</span>
            <button
              onClick={() => handleApplySimulator(100, 100)}
              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold"
            >
              ⭐ 100% Perfect Finisher & Centurion
            </button>
            <button
              onClick={() => handleApplySimulator(50, 85)}
              className="px-3 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-bold"
            >
              🥈 Mid-Term Distinction (50% / 85%)
            </button>
            <button
              onClick={() => handleApplySimulator(25, 60)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 font-bold"
            >
              🥉 Beginner Initiate (25% / 60%)
            </button>
          </div>
        </section>
      )}

      {/* Navigation Filter Toolbar */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex bg-white/[0.04] border border-white/10 rounded-2xl p-1 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Badges ({badges.length})
          </button>
          <button
            onClick={() => setSelectedCategory('course_completion')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'course_completion'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Course Completion</span>
          </button>
          <button
            onClick={() => setSelectedCategory('quiz_score')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'quiz_score'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>Quiz Excellence</span>
          </button>
          <button
            onClick={() => setSelectedCategory('mastery')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'mastery'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Triple Crown & Mastery</span>
          </button>
        </div>

        {/* Status & Search Filter */}
        <div className="flex items-center gap-2">
          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-[#0c0c18] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Status: All</option>
            <option value="unlocked">Claimed & Unlocked</option>
            <option value="locked">Locked Badges</option>
          </select>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search badge..."
              className="w-full bg-[#0c0c18] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* Digital Badges Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredBadges.map((badge) => {
          const style = getBadgeTierStyle(badge.tier, badge.unlocked);

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`rounded-3xl p-5 border ${style.cardBorder} ${style.bg} transition-all duration-300 hover:scale-[1.01] cursor-pointer flex flex-col justify-between group relative overflow-hidden`}
            >
              {/* Top Row: Tier Pill & Unlock Status */}
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${style.badgePill}`}>
                  {badge.tier} Tier • {badge.rarity}
                </span>

                {badge.unlocked ? (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-400 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" /> Locked
                  </span>
                )}
              </div>

              {/* Center Badge Shield & Details */}
              <div className="flex items-start gap-4 my-1 relative z-10">
                {/* Metallic Ring & Icon */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 ${style.ring} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 relative`}>
                  {renderBadgeIcon(badge.iconName, "w-7 h-7 sm:w-8 sm:h-8")}
                  {!badge.unlocked && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                      <Lock className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <h3 className={`text-base font-bold ${badge.unlocked ? 'text-white' : 'text-slate-300'} group-hover:text-indigo-300 transition-colors font-serif-academy leading-snug`}>
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Bottom Progress & XP Reward */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-2 relative z-10">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Requirement: <strong className="text-white">{badge.thresholdText}</strong></span>
                  <span className="font-bold text-indigo-300 flex items-center gap-0.5 font-mono">
                    +{badge.xpReward} XP
                  </span>
                </div>

                {/* Advancement Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Advancement</span>
                    <span className="font-mono font-bold text-white">{badge.progressPct}%</span>
                  </div>
                  <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        badge.unlocked
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                      style={{ width: `${badge.progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Inspect Action Hint */}
                <div className="flex justify-between items-center text-[11px] text-indigo-400 group-hover:text-indigo-300 pt-1 font-semibold">
                  <span>Click to view certificate & perks</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Quick Action Banner: Take Quiz or Resume Courses */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {/* Banner 1: Timed MCQ Quiz */}
        <div 
          onClick={() => setActiveScreen('mcq-assessment')}
          className="bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-900 border border-rose-500/30 rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:border-rose-400/60 transition-all shadow-xl group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white font-serif-academy">
                Take Live Math & Physics MCQ Quiz
              </h4>
              <p className="text-xs text-slate-300">
                Score ≥90% to unlock the <strong>Assessment Virtuoso</strong> gold badge!
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-rose-300 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>

        {/* Banner 2: Resume Course */}
        <div 
          onClick={() => setActiveScreen('course-library')}
          className="bg-gradient-to-r from-indigo-950/40 via-blue-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:border-indigo-400/60 transition-all shadow-xl group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white font-serif-academy">
                Continue Enrolled Video Courses
              </h4>
              <p className="text-xs text-slate-300">
                Reach 100% completion to earn the <strong>Course Finisher</strong> gold badge!
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-300 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>
      </section>

      {/* Peer Honor Roll & Top Badge Leaders */}
      <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white font-serif-academy">
                Institutional Academic Honor Roll
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Top students ranked by earned digital badges and academic XP across department batches.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full w-max">
            Current Semester
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PEER_HONOR_ROLL.map((peer) => (
            <div
              key={peer.rank}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                peer.loginId === currentUser.loginId
                  ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-950/50'
                  : 'bg-white/[0.03] border-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black font-mono shrink-0 ${
                  peer.rank === 1 ? 'bg-amber-400 text-slate-950' :
                  peer.rank === 2 ? 'bg-slate-300 text-slate-950' :
                  peer.rank === 3 ? 'bg-amber-700 text-white' :
                  'bg-white/10 text-slate-300'
                }`}>
                  #{peer.rank}
                </div>

                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 shrink-0 bg-indigo-950">
                  <img src={peer.avatar} alt={peer.name} className="w-full h-full object-cover" />
                </div>

                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{peer.name}</span>
                    {peer.loginId === currentUser.loginId && (
                      <span className="text-[10px] text-indigo-300 font-bold bg-indigo-500/20 px-1.5 rounded">You</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{peer.loginId}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-amber-300">{peer.badgesCount} Badges</div>
                <div className="text-[10px] text-emerald-400 font-mono">+{peer.totalXp} XP</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Badge Inspection & Certificate Modal */}
      {selectedBadge && (
        <BadgeDetailModal
          badge={selectedBadge}
          studentUser={currentUser}
          onClose={() => setSelectedBadge(null)}
          onNavigateToQuiz={() => setActiveScreen('mcq-assessment')}
          onNavigateToCourses={() => setActiveScreen('course-library')}
        />
      )}
    </div>
  );
};
