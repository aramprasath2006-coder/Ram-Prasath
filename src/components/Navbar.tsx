import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppMode, ActiveScreen, AppTab } from '../types';
import { useStudentAuth } from '../context/StudentAuthContext';
import { 
  GraduationCap, 
  Bell, 
  Sparkles, 
  BookOpen, 
  LayoutDashboard, 
  CheckSquare, 
  CreditCard, 
  BarChart3, 
  ChevronDown,
  Layers,
  Award,
  History,
  ShieldCheck,
  Lock,
  UserCheck,
  Mail,
  KeyRound,
  LogIn,
  Camera,
  Home,
  QrCode,
  User,
  FileText,
  Train,
  BrainCircuit,
  Target,
  Bot
} from 'lucide-react';

interface NavbarProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  credits: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  setMode,
  activeScreen,
  setActiveScreen,
  activeTab,
  setActiveTab,
  credits
}) => {
  const { currentUser, openLoginModal, openPhotoUploadModal, isAuthenticated } = useStudentAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showScreenSwitcher, setShowScreenSwitcher] = useState(false);

  const notifications = [
    { id: 1, title: 'Math Assessment Available', time: '10m ago', desc: 'Weekly Assessment Q5-Q20 is live.' },
    { id: 2, title: 'Attendance Logged', time: '1h ago', desc: 'Verified at Science Block (09:55 AM).' },
    { id: 3, title: 'UPSC Prelims Date Announced', time: '3h ago', desc: 'May 26th scheduled examination.' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050508]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40 transition-all">
      {/* Top Banner / System Switcher Bar */}
      <div className="bg-[#0b0b18] text-slate-300 px-4 py-1.5 text-xs font-medium flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            LIVE SUITE
          </span>
          <span className="hidden sm:inline text-slate-400">Integrated Academic Environment</span>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-0.5 rounded-full bg-white/[0.04] border border-white/10">
          <button
            onClick={() => {
              setMode('eduflow');
              setActiveScreen('eduflow-home');
              setActiveTab('home');
            }}
            className={`relative px-2.5 py-0.5 rounded-full text-xs transition-all flex items-center gap-1.5 z-10 ${
              mode === 'eduflow'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {mode === 'eduflow' && (
              <motion.div
                layoutId="activeModePill"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full border border-indigo-400/40 shadow-xs -z-10"
              />
            )}
            <GraduationCap className="w-3.5 h-3.5" />
            <span>ASCEND STALTECH INDIAA LMS</span>
          </button>
          <button
            onClick={() => {
              setMode('elite-academy');
              setActiveScreen('elite-home');
              setActiveTab('home');
            }}
            className={`relative px-2.5 py-0.5 rounded-full text-xs transition-all flex items-center gap-1.5 z-10 ${
              mode === 'elite-academy'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {mode === 'elite-academy' && (
              <motion.div
                layoutId="activeModePill"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full border border-purple-400/40 shadow-xs -z-10"
              />
            )}
            <Award className="w-3.5 h-3.5" />
            <span>ASCEND STALTECH INDIAA (GATE/UPSC)</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo with Cross-Fade */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => {
              if (mode === 'eduflow') {
                setActiveScreen('eduflow-home');
                setActiveTab('home');
              } else {
                setActiveScreen('elite-home');
                setActiveTab('home');
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500/30 shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
              <img 
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                alt={currentUser?.name || 'Student'} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5"
                >
                  <span className="text-sm sm:text-base md:text-lg font-black tracking-tight font-serif-academy text-white whitespace-nowrap">
                    ASCEND STALTECH INDIAA
                  </span>
                  <span className={`hidden md:inline-block text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border font-mono ${
                    mode === 'elite-academy'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {mode === 'elite-academy' ? 'Competitive Wing' : 'Academic LMS'}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links with Cross-Fade */}
        <div className="hidden md:block">
          <AnimatePresence mode="wait" initial={false}>
            <motion.nav
              key={mode}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1 lg:gap-2"
            >
              {mode === 'eduflow' ? (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('home');
                      setActiveScreen('eduflow-home');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border group ${
                      activeTab === 'home' && activeScreen === 'eduflow-home'
                        ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-600/10 text-white border-indigo-400/30 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-transparent'
                    }`}
                  >
                    <Home className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      activeTab === 'home' && activeScreen === 'eduflow-home' ? 'text-indigo-400' : 'text-slate-400'
                    }`} />
                    <span>Home</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('learning');
                      setActiveScreen('course-library');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border group ${
                      activeTab === 'learning' || activeScreen === 'course-library'
                        ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-600/10 text-white border-indigo-400/30 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-transparent'
                    }`}
                  >
                    <GraduationCap className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      activeTab === 'learning' || activeScreen === 'course-library' ? 'text-indigo-400' : 'text-slate-400'
                    }`} />
                    <span>Courses</span>
                  </button>

                  <button
                    onClick={() => {
                      setMode('eduflow');
                      setActiveScreen('eduflow-home');
                      setActiveTab('home');
                      setTimeout(() => {
                        document.getElementById('school-learning-hub')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border border-emerald-500/30 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 shadow-xs group"
                    title="Affordable School Learning (Classes 6-12) - ₹10 to ₹50 only per video"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Class 6–12 (₹10–₹50)</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('attendance');
                      setActiveScreen('digital-attendance');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border group ${
                      activeTab === 'attendance'
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-600/10 text-emerald-200 border-emerald-400/30 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-transparent'
                    }`}
                  >
                    <QrCode className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      activeTab === 'attendance' ? 'text-emerald-400' : 'text-slate-400'
                    }`} />
                    <span>Attendance</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('learning');
                      setActiveScreen('student-achievements');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border group ${
                      activeScreen === 'student-achievements'
                        ? 'bg-gradient-to-r from-amber-500/20 to-yellow-600/10 text-amber-200 border-amber-400/30 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-transparent'
                    }`}
                  >
                    <Award className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      activeScreen === 'student-achievements' ? 'text-amber-400' : 'text-slate-400'
                    }`} />
                    <span>Badges</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setActiveScreen('student-profile');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border group ${
                      activeTab === 'profile' && activeScreen === 'student-profile'
                        ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-600/10 text-white border-indigo-400/30 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-transparent'
                    }`}
                  >
                    <User className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      activeTab === 'profile' && activeScreen === 'student-profile' ? 'text-indigo-400' : 'text-slate-400'
                    }`} />
                    <span>Profile</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('home');
                      setActiveScreen('elite-home');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border group ${
                      activeScreen === 'elite-home'
                        ? 'bg-gradient-to-r from-purple-500/25 to-indigo-600/15 text-white border-purple-400/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-transparent'
                    }`}
                  >
                    <Home className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      activeScreen === 'elite-home' ? 'text-purple-400' : 'text-slate-400'
                    }`} />
                    <span>Home</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('learning');
                      setActiveScreen('elite-gate');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border group ${
                      activeScreen === 'elite-gate'
                        ? 'bg-gradient-to-r from-purple-500/25 to-indigo-600/15 text-white border-purple-400/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-transparent'
                    }`}
                  >
                    <GraduationCap className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      activeScreen === 'elite-gate' ? 'text-purple-400' : 'text-slate-400'
                    }`} />
                    <span>GATE ME</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('mock-tests');
                      setActiveScreen('elite-mocks');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border group ${
                      activeScreen === 'elite-mocks'
                        ? 'bg-gradient-to-r from-purple-500/25 to-indigo-600/15 text-white border-purple-400/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-transparent'
                    }`}
                  >
                    <FileText className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      activeScreen === 'elite-mocks' ? 'text-purple-400' : 'text-slate-400'
                    }`} />
                    <span>Mock Tests</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveScreen('elite-report');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border group ${
                      activeScreen === 'elite-report'
                        ? 'bg-gradient-to-r from-purple-500/25 to-indigo-600/15 text-white border-purple-400/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-transparent'
                    }`}
                  >
                    <BarChart3 className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      activeScreen === 'elite-report' ? 'text-purple-400' : 'text-slate-400'
                    }`} />
                    <span>Rank Report</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveScreen('elite-proofs');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border group ${
                      activeScreen === 'elite-proofs'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-xs shadow-amber-500/10 font-bold'
                        : 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-500/10 border-amber-500/20'
                    }`}
                    title="Aspirant Photo, Aadhaar & Emergency Contact Proofs"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400 transition-transform group-hover:scale-110" />
                    <span>Candidate Proofs</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveScreen('rrb-exams');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border group ${
                      activeScreen === 'rrb-exams'
                        ? 'bg-gradient-to-r from-amber-500/25 to-orange-600/20 text-amber-300 border-amber-400/50 shadow-xs shadow-amber-500/10 font-bold'
                        : 'text-amber-300/90 hover:text-white hover:bg-white/[0.04] border-transparent'
                    }`}
                    title="Railway Recruitment Board (RRB NTPC, ALP, JE, Group D) Examination Portal"
                  >
                    <Train className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      activeScreen === 'rrb-exams' ? 'text-amber-400' : 'text-amber-400/80'
                    }`} />
                    <span>RRB Exams</span>
                  </button>
                </>
              )}
            </motion.nav>
          </AnimatePresence>
        </div>

        {/* Right Action Icons & Direct Screen Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* YouTube Channel Quick Link Button */}
          <a
            href="http://www.youtube.com/@ascendstaltechindiaa158"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 text-xs font-semibold text-red-200 bg-red-600/15 hover:bg-red-600/25 transition-all shadow-2xs group active:scale-95"
            title="Official YouTube Channel: @ascendstaltechindiaa158"
          >
            <div className="w-5 h-5 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <span className="hidden md:inline font-bold">YouTube</span>
          </a>

          {/* Quick Jump Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowScreenSwitcher(!showScreenSwitcher)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] transition-colors shadow-2xs group"
              title="Quick Screen Navigator"
            >
              <div className="w-5 h-5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                <Layers className="w-3 h-3 text-indigo-400 group-hover:rotate-12 transition-transform" />
              </div>
              <span className="hidden sm:inline">Screens</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showScreenSwitcher && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-[#0b0a17]/95 rounded-2xl shadow-2xl border border-white/10 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-2xl max-h-[85vh] overflow-y-auto scrollbar-thin"
                onClick={() => setShowScreenSwitcher(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-indigo-400/90 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>ASCEND STALTECH INDIAA • Academic Hub</span>
                </div>
                <div className="space-y-0.5">
                  {/* YouTube Video Hub Jump */}
                  <button
                    onClick={() => {
                      setMode('eduflow');
                      setActiveScreen('eduflow-home');
                      setActiveTab('home');
                      setTimeout(() => {
                        document.getElementById('youtube-channel-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-red-500/10 rounded-xl flex items-center gap-2.5 text-red-300 bg-red-500/5 border border-red-500/20 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-red-200">YouTube Video Hub</div>
                      <div className="text-[10px] text-red-400/80">@ascendstaltechindiaa158 Channel</div>
                    </div>
                  </button>

                  {/* Academic Performance Stats Jump */}
                  <button
                    onClick={() => {
                      setMode('eduflow');
                      setActiveScreen('eduflow-home');
                      setActiveTab('home');
                      setTimeout(() => {
                        document.getElementById('academic-performance-stats')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-indigo-500/10 rounded-xl flex items-center gap-2.5 text-indigo-200 bg-indigo-500/5 border border-indigo-500/20 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-3.5 h-3.5 text-indigo-300" />
                    </div>
                    <div>
                      <div className="font-bold text-indigo-200">Academic Performance Stats</div>
                      <div className="text-[10px] text-indigo-400/80">1,500+ Passed • 98% Placed</div>
                    </div>
                  </button>
                  {/* School Students Learning Wing (Classes 6 to 12) Jump */}
                  <button
                    onClick={() => {
                      setMode('eduflow');
                      setActiveScreen('eduflow-home');
                      setActiveTab('home');
                      setTimeout(() => {
                        document.getElementById('school-learning-hub')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-emerald-500/10 rounded-xl flex items-center gap-2.5 text-emerald-200 bg-emerald-500/5 border border-emerald-500/20 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
                    </div>
                    <div>
                      <div className="font-bold text-emerald-200">School Learning Wing (Classes 6-12)</div>
                      <div className="text-[10px] text-emerald-400/80">₹10 to ₹50 Subsidized Micro-Courses</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setMode('eduflow'); setActiveScreen('eduflow-home'); setActiveTab('home'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-white/[0.06] rounded-xl flex items-center gap-2.5 text-slate-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Student Home Dashboard</div>
                      <div className="text-[10px] text-slate-400">Streak, study launcher & goals</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setMode('eduflow'); setActiveScreen('course-library'); setActiveTab('learning'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-white/[0.06] rounded-xl flex items-center gap-2.5 text-slate-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Video Course Library</div>
                      <div className="text-[10px] text-slate-400">Curated modules & playlists</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setMode('eduflow'); setActiveScreen('digital-attendance'); setActiveTab('attendance'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-emerald-500/10 rounded-xl flex items-center gap-2.5 text-emerald-300 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-emerald-300">Digital Attendance Scanner</div>
                      <div className="text-[10px] text-emerald-400/70">Geo-fencing & QR check-in</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setMode('eduflow'); setActiveScreen('mcq-assessment'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-rose-500/10 rounded-xl flex items-center gap-2.5 text-rose-300 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-rose-300">Timed MCQ Assessment</div>
                      <div className="text-[10px] text-rose-400/70">Live speed & accuracy testing</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setMode('eduflow'); setActiveScreen('checkout'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-white/[0.06] rounded-xl flex items-center gap-2.5 text-slate-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Course Checkout & UPI</div>
                      <div className="text-[10px] text-slate-400">Tier billing & discount coupons</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setMode('eduflow'); setActiveScreen('payments-history'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-white/[0.06] rounded-xl flex items-center gap-2.5 text-slate-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <History className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Payments & History</div>
                      <div className="text-[10px] text-slate-400">Invoices & credit ledger ({credits} cr)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setMode('eduflow'); setActiveScreen('student-profile'); setActiveTab('profile'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-white/[0.06] rounded-xl flex items-center gap-2.5 text-slate-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Student Profile & Mastery</div>
                      <div className="text-[10px] text-slate-400">Institutional ID, stats & history</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setMode('eduflow'); setActiveScreen('student-achievements'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-amber-500/10 rounded-xl flex items-center gap-2.5 text-amber-200 bg-amber-500/5 border border-amber-500/20 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                      <Award className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <div>
                      <div className="font-bold text-amber-200">Student Achievements & Badges</div>
                      <div className="text-[10px] text-amber-400/70">Course completion & quiz badges</div>
                    </div>
                  </button>
                </div>

                <div className="px-3 pt-3 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-purple-400/90 border-t border-white/10 mt-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>ASCEND STALTECH INDIAA • Competitive Wing</span>
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => { setMode('elite-academy'); setActiveScreen('elite-home'); setActiveTab('home'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-purple-500/10 rounded-xl flex items-center gap-2.5 text-purple-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-purple-200">UPSC & Competitive Dashboard</div>
                      <div className="text-[10px] text-purple-400/70">Syllabus breakdown & toppers</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setMode('elite-academy'); setActiveScreen('elite-mocks'); setActiveTab('mock-tests'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-purple-500/10 rounded-xl flex items-center gap-2.5 text-purple-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-purple-200">All India Mock Test Series</div>
                      <div className="text-[10px] text-purple-400/70">Timed test papers with AIR rankings</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setMode('elite-academy'); setActiveScreen('elite-gate'); setActiveTab('learning'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-purple-500/10 rounded-xl flex items-center gap-2.5 text-purple-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-purple-200">GATE Mechanical Video Library</div>
                      <div className="text-[10px] text-purple-400/70">Formula bank & high-yield lectures</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setMode('elite-academy'); setActiveScreen('elite-proofs'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-amber-500/20 rounded-xl flex items-center gap-2.5 text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/30 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <div>
                      <div className="font-bold text-amber-300">Candidate Proofs & Aadhaar</div>
                      <div className="text-[10px] text-amber-400/80">Photo, Aadhaar & SOS emergency</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setMode('elite-academy'); setActiveScreen('rrb-exams'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-amber-500/20 rounded-xl flex items-center gap-2.5 text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-xs">
                      <Train className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <div>
                      <div className="font-bold text-amber-300">Railway Recruitment (RRB) Exams</div>
                      <div className="text-[10px] text-amber-400/80">NTPC, ALP, JE, Group D & CBAT Psycho</div>
                    </div>
                  </button>
                </div>

                <div className="px-3 pt-3 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400/90 border-t border-white/10 mt-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Advanced Study & Cognitive Tools</span>
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setActiveScreen('flashcards')}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-indigo-500/20 rounded-xl flex items-center gap-2.5 text-indigo-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Spaced Repetition Flashcards</div>
                      <div className="text-[10px] text-indigo-300/80">Leitner 4-box recall system</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveScreen('formula-bank')}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-purple-500/20 rounded-xl flex items-center gap-2.5 text-purple-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">High-Yield Formula Vault</div>
                      <div className="text-[10px] text-purple-300/80">Equations, pitfalls & cheat sheets</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveScreen('exam-readiness')}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-emerald-500/20 rounded-xl flex items-center gap-2.5 text-emerald-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <Target className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Exam Readiness & AIR Predictor</div>
                      <div className="text-[10px] text-emerald-300/80">Diagnostics & 30-day sprints</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveScreen('ai-tutor')}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-indigo-500/20 rounded-xl flex items-center gap-2.5 text-indigo-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">AI Faculty Mentors & Doubt Clearance</div>
                      <div className="text-[10px] text-indigo-300/80">1-on-1 derivations & interactive quizzes</div>
                    </div>
                  </button>
                </div>

                <div className="px-3 pt-3 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-400/90 border-t border-white/10 mt-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Student & Faculty Controls</span>
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => { setMode('eduflow'); setActiveScreen('student-login'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-indigo-500/20 rounded-xl flex items-center gap-2.5 text-indigo-300 font-semibold bg-indigo-500/10 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center shrink-0">
                      <LogIn className="w-3.5 h-3.5 text-indigo-300" />
                    </div>
                    <div>
                      <div className="font-semibold text-indigo-200">Institutional Student Login</div>
                      <div className="text-[10px] text-indigo-400/80">@edu.in domain accounts</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setMode('eduflow'); setActiveScreen('admin-attendance'); }}
                    className="w-full text-left px-2.5 py-2 text-xs hover:bg-amber-500/20 rounded-xl flex items-center gap-2.5 text-amber-300 font-bold bg-amber-500/10 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/30 border border-amber-400/40 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <div>
                      <div className="font-bold text-amber-300">Admin Attendance & Daily Logins</div>
                      <div className="text-[10px] text-amber-400/80">Institutional faculty audit log</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Photo Trigger */}
          <button
            onClick={openPhotoUploadModal}
            className="flex items-center gap-1.5 p-1 pr-2.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-bold text-indigo-300 transition-all shadow-xs group"
            title={`Student: ${currentUser?.name} (${currentUser?.loginId}) • Click to change profile photo`}
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-indigo-400 relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'Student'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-3 h-3 text-white" />
              </div>
            </div>
            <span className="hidden md:inline text-[11px] font-medium text-slate-300 group-hover:text-white transition-colors">
              {currentUser?.name?.split(' ')[0] || 'Profile'}
            </span>
          </button>

          {/* Student Login ID Quick Switch Button */}
          <button
            onClick={openLoginModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-bold text-indigo-300 transition-all shadow-xs"
            title={`Active Student Login ID: ${currentUser?.loginId} • Click to switch or log in`}
          >
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono">{currentUser?.loginId || 'alex@edu.in'}</span>
          </button>

          {/* Dedicated Admin Portal Button */}
          <button
            onClick={() => {
              setMode('eduflow');
              setActiveScreen('admin-attendance');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all shadow-sm ${
              activeScreen === 'admin-attendance'
                ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-500/40'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}
            title="Institutional Student Attendance & Daily Login Audit Console"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin</span>
            <span className="sm:hidden text-[10px]">Admin</span>
          </button>

          {/* Credits pill button */}
          <button 
            onClick={() => {
              setMode('eduflow');
              setActiveScreen('payments-history');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-bold hover:bg-indigo-500/25 transition-colors border border-indigo-500/30"
          >
            <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
            <span>{credits}</span>
            <span className="text-[10px] text-slate-400 font-normal">Credits</span>
          </button>

          {/* Notification Button with dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#050508]"></span>
            </button>

            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-[#0c0c18] rounded-2xl shadow-2xl border border-white/10 p-3 z-50 animate-in fade-in duration-150 backdrop-blur-xl"
                onClick={() => setShowNotifications(false)}
              >
                <div className="flex justify-between items-center pb-2 border-b border-white/10 mb-2">
                  <span className="font-bold text-sm text-white">Notifications</span>
                  <span className="text-[11px] text-indigo-400 font-semibold cursor-pointer">Mark all read</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((item) => (
                    <div key={item.id} className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer border border-white/5">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                        <span className="text-[10px] text-slate-400">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
