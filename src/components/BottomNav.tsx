import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppMode, AppTab, ActiveScreen } from '../types';
import { 
  Home, 
  GraduationCap, 
  FileText, 
  User, 
  ShieldCheck, 
  QrCode,
  Sparkles,
  Train
} from 'lucide-react';

interface BottomNavProps {
  mode: AppMode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  mode,
  activeTab,
  setActiveTab,
  activeScreen,
  setActiveScreen
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-40">
      <AnimatePresence mode="wait" initial={false}>
        {mode === 'elite-academy' ? (
          <motion.nav
            key="elite-bottom-nav"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="w-full flex justify-around items-center px-3 pb-safe pt-2 bg-[#080712]/95 backdrop-blur-2xl border-t border-purple-500/20 shadow-2xl shadow-purple-950/40"
          >
            {/* Home */}
            <button
              onClick={() => {
                setActiveTab('home');
                setActiveScreen('elite-home');
              }}
              className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl transition-all duration-200 group ${
                activeTab === 'home' && activeScreen === 'elite-home'
                  ? 'text-purple-200 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                activeTab === 'home' && activeScreen === 'elite-home'
                  ? 'bg-gradient-to-br from-purple-500/30 to-indigo-500/20 border border-purple-400/40 shadow-sm shadow-purple-500/30 text-purple-300'
                  : 'group-hover:bg-white/[0.04]'
              }`}>
                <Home className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={activeTab === 'home' && activeScreen === 'elite-home' ? 2.4 : 1.8} />
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight">Home</span>
            </button>

            {/* Learning (GATE) */}
            <button
              onClick={() => {
                setActiveTab('learning');
                setActiveScreen('elite-gate');
              }}
              className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl transition-all duration-200 group ${
                activeTab === 'learning'
                  ? 'text-purple-200 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                activeTab === 'learning'
                  ? 'bg-gradient-to-br from-purple-500/30 to-indigo-500/20 border border-purple-400/40 shadow-sm shadow-purple-500/30 text-purple-300'
                  : 'group-hover:bg-white/[0.04]'
              }`}>
                <GraduationCap className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={activeTab === 'learning' ? 2.4 : 1.8} />
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight">GATE ME</span>
            </button>

            {/* Mock Tests */}
            <button
              onClick={() => {
                setActiveTab('mock-tests');
                setActiveScreen('elite-mocks');
              }}
              className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl transition-all duration-200 group ${
                activeTab === 'mock-tests'
                  ? 'text-purple-200 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                activeTab === 'mock-tests'
                  ? 'bg-gradient-to-br from-purple-500/30 to-indigo-500/20 border border-purple-400/40 shadow-sm shadow-purple-500/30 text-purple-300'
                  : 'group-hover:bg-white/[0.04]'
              }`}>
                <FileText className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={activeTab === 'mock-tests' ? 2.4 : 1.8} />
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight">Mocks</span>
            </button>

            {/* Profile / Report */}
            <button
              onClick={() => {
                setActiveTab('profile');
                setActiveScreen('elite-report');
              }}
              className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl transition-all duration-200 group ${
                activeTab === 'profile' && activeScreen !== 'elite-proofs'
                  ? 'text-purple-200 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                activeTab === 'profile' && activeScreen !== 'elite-proofs'
                  ? 'bg-gradient-to-br from-purple-500/30 to-indigo-500/20 border border-purple-400/40 shadow-sm shadow-purple-500/30 text-purple-300'
                  : 'group-hover:bg-white/[0.04]'
              }`}>
                <User className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={activeTab === 'profile' && activeScreen !== 'elite-proofs' ? 2.4 : 1.8} />
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight">Profile</span>
            </button>

            {/* Candidate Proofs */}
            <button
              onClick={() => {
                setActiveTab('profile');
                setActiveScreen('elite-proofs');
              }}
              className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl transition-all duration-200 group ${
                activeScreen === 'elite-proofs'
                  ? 'text-amber-200 font-bold'
                  : 'text-amber-400/70 hover:text-amber-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 relative ${
                activeScreen === 'elite-proofs'
                  ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/20 border border-amber-400/50 shadow-sm shadow-amber-500/30 text-amber-300'
                  : 'bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20'
              }`}>
                <ShieldCheck className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={activeScreen === 'elite-proofs' ? 2.4 : 1.9} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-xs" />
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight text-amber-300">Proofs</span>
            </button>

            {/* RRB Exams */}
            <button
              onClick={() => {
                setActiveScreen('rrb-exams');
              }}
              className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl transition-all duration-200 group ${
                activeScreen === 'rrb-exams'
                  ? 'text-amber-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                activeScreen === 'rrb-exams'
                  ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/20 border border-amber-400/50 shadow-sm shadow-amber-500/30 text-amber-300'
                  : 'group-hover:bg-white/[0.04]'
              }`}>
                <Train className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={activeScreen === 'rrb-exams' ? 2.4 : 1.8} />
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight">RRB</span>
            </button>
          </motion.nav>
        ) : (
          <motion.nav
            key="eduflow-bottom-nav"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="w-full flex justify-around items-center px-3 pb-safe pt-2 bg-[#060610]/95 backdrop-blur-2xl border-t border-indigo-500/20 shadow-2xl shadow-indigo-950/40"
          >
            {/* Home Tab */}
            <button
              onClick={() => {
                setActiveTab('home');
                setActiveScreen('eduflow-home');
              }}
              className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl transition-all duration-200 group ${
                activeTab === 'home'
                  ? 'text-indigo-200 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                activeTab === 'home'
                  ? 'bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 border border-indigo-400/40 shadow-sm shadow-indigo-500/30 text-indigo-300'
                  : 'group-hover:bg-white/[0.04]'
              }`}>
                <Home className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={activeTab === 'home' ? 2.4 : 1.8} />
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight">Home</span>
            </button>

            {/* Learning Tab */}
            <button
              onClick={() => {
                setActiveTab('learning');
                setActiveScreen('course-library');
              }}
              className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl transition-all duration-200 group ${
                activeTab === 'learning'
                  ? 'text-indigo-200 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                activeTab === 'learning'
                  ? 'bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 border border-indigo-400/40 shadow-sm shadow-indigo-500/30 text-indigo-300'
                  : 'group-hover:bg-white/[0.04]'
              }`}>
                <GraduationCap className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={activeTab === 'learning' ? 2.4 : 1.8} />
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight">Courses</span>
            </button>

            {/* Attendance Tab */}
            <button
              onClick={() => {
                setActiveTab('attendance');
                setActiveScreen('digital-attendance');
              }}
              className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl transition-all duration-200 group ${
                activeTab === 'attendance'
                  ? 'text-indigo-200 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                activeTab === 'attendance'
                  ? 'bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 border border-indigo-400/40 shadow-sm shadow-indigo-500/30 text-indigo-300'
                  : 'group-hover:bg-white/[0.04]'
              }`}>
                <QrCode className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={activeTab === 'attendance' ? 2.4 : 1.8} />
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight">Attendance</span>
            </button>

            {/* Profile Tab */}
            <button
              onClick={() => {
                setActiveTab('profile');
                setActiveScreen('student-profile');
              }}
              className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl transition-all duration-200 group ${
                activeTab === 'profile'
                  ? 'text-indigo-200 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 border border-indigo-400/40 shadow-sm shadow-indigo-500/30 text-indigo-300'
                  : 'group-hover:bg-white/[0.04]'
              }`}>
                <User className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={activeTab === 'profile' ? 2.4 : 1.8} />
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight">Profile</span>
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};
