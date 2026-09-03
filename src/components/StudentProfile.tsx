import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { useStudentAuth } from '../context/StudentAuthContext';
import {
  Award,
  Clock,
  BookOpen,
  BarChart3,
  ChevronRight,
  ShieldCheck,
  Download,
  Settings,
  User,
  CheckCircle2,
  Mail,
  KeyRound,
  Calendar,
  Eye,
  EyeOff,
  Copy,
  Check,
  LogOut,
  UserCheck,
  Sparkles,
  AlertCircle,
  Smartphone,
  Lock,
  ArrowRight
} from 'lucide-react';

interface StudentProfileProps {
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ setActiveScreen }) => {
  const { 
    currentUser, 
    openLoginModal, 
    openMobilePasswordModal,
    logout, 
    registeredStudents, 
    switchStudent 
  } = useStudentAuth();
  const [activeTab, setActiveTab] = useState<'performance' | 'credentials' | 'achievements' | 'activity' | 'settings'>('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 pb-28 md:pb-12 animate-in fade-in duration-200">
      {/* Profile Header Hero Card */}
      <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-lg shadow-black/20 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-indigo-500/40 shadow-xl flex-shrink-0 bg-indigo-950">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif-academy">{currentUser.name}</h1>
            <span className="inline-flex items-center justify-center gap-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-0.5 rounded-full w-max mx-auto sm:mx-0">
              <CheckCircle2 className="w-3.5 h-3.5" /> Institutional Verified
            </span>
          </div>

          {/* Official @edu.in Login ID Badge */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Login ID: {currentUser.loginId}</span>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              Roll No: <span className="font-mono text-slate-200">{currentUser.rollNo}</span>
            </span>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            {currentUser.department} • {currentUser.batch}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/10">
            <div className="text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-bold text-white">{currentUser.studyHours}h</p>
              <p className="text-[11px] font-semibold uppercase text-slate-400">Study Hours</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-bold text-white">{currentUser.enrolledCoursesCount}</p>
              <p className="text-[11px] font-semibold uppercase text-slate-400">Enrolled</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-bold text-emerald-400">{currentUser.overallAttendancePct}%</p>
              <p className="text-[11px] font-semibold uppercase text-slate-400">Attendance</p>
            </div>
          </div>
        </div>

        {/* Quick Switch / Sign In Modal CTA */}
        <div className="sm:self-start flex sm:flex-col gap-2">
          <button
            onClick={openLoginModal}
            className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-sm"
            title="Switch or re-authenticate student"
          >
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <span>Switch ID</span>
          </button>
        </div>
      </section>

      {/* Profile Segment Tabs */}
      <div className="flex bg-white/[0.06] rounded-2xl p-1.5 border border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('credentials')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'credentials'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Login Credentials</span>
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'achievements'
              ? 'bg-gradient-to-r from-amber-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-950/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Achievements & Badges</span>
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'performance'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Mastery</span>
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'activity'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Activity</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Tab 0: Institutional Login Credentials (NEW & HIGHLIGHTED) */}
      {activeTab === 'credentials' && (
        <section className="space-y-4">
          <div className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/30 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white font-serif-academy">
                    Institutional Login Credentials & Identity
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Official University Single Sign-On (SSO) credentials provided by Academic IT.
                </p>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-max">
                Active & Enrolled
              </span>
            </div>

            {/* Credential Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Login ID Box */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-indigo-300">
                    <Mail className="w-4 h-4 text-indigo-400" />
                    Student Login ID
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 font-mono">
                    @edu.in Only
                  </span>
                </div>
                <div className="flex items-center justify-between bg-black/40 px-3.5 py-2.5 rounded-xl border border-white/10">
                  <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wide">
                    {currentUser.loginId}
                  </span>
                  <button
                    onClick={() => handleCopy(currentUser.loginId, 'loginId')}
                    className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                    title="Copy Student Login ID"
                  >
                    {copiedField === 'loginId' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Assigned Roll: <strong className="text-white font-mono">{currentUser.rollNo}</strong></span>
                  <span className="text-amber-400 font-medium">Admin Managed ID</span>
                </div>
              </div>

              {/* Password / DOB Box */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    Active Password
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                    Encrypted
                  </span>
                </div>
                <div className="flex items-center justify-between bg-black/40 px-3.5 py-2.5 rounded-xl border border-white/10">
                  <span className="font-mono text-sm sm:text-base font-bold text-white tracking-widest">
                    {showPassword ? currentUser.dobPassword : '••••••••'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleCopy(currentUser.dobPassword, 'password')}
                      className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                      title="Copy Password"
                    >
                      {copiedField === 'password' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">DOB: <strong className="text-white">{currentUser.dob}</strong></span>
                  <button
                    type="button"
                    onClick={openMobilePasswordModal}
                    className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                  >
                    <span>Change Password →</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Number & Password Reset Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/40 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-md">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white font-serif-academy">
                      Registered Mobile Number Verification
                    </h4>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      OTP Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Linked Phone: <strong className="font-mono text-emerald-300">{currentUser.phone}</strong>. You can change your password anytime via mobile OTP.
                  </p>
                </div>
              </div>

              <button
                onClick={openMobilePasswordModal}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 shrink-0 transition-all"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Change Password with Mobile No</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Institutional Security Notice */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1.5">
                <p className="font-bold text-amber-300">Institutional Identity & ID Enrollment Policy:</p>
                <p className="text-slate-300 leading-relaxed">
                  • <strong>Student IDs & Roll Numbers:</strong> Can <u>ONLY</u> be created, enrolled, or altered by <strong>Academic Administrators</strong> from the Faculty Console.<br />
                  • <strong>Password Control:</strong> Students have full authority to reset or change their password securely using their <strong>Registered Mobile Phone Number</strong> via SMS OTP verification.<br />
                  • <strong>Login Domain:</strong> Student login strictly requires the official <code className="bg-black/30 text-amber-200 px-1 py-0.5 rounded">@edu.in</code> suffix.
                </p>
              </div>
            </div>

            {/* Account Switcher / Login Modal Button */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
              <div className="text-xs text-slate-400">
                Logged in on: <span className="font-semibold text-slate-200">Campus WiFi / Web Portal</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={openLoginModal}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-950/50"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Switch Student / Sign In</span>
                </button>
                <button
                  onClick={() => setActiveScreen('student-login')}
                  className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all border border-white/10"
                >
                  <span>Dedicated Login Page</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab: Digital Achievements & Badges */}
      {activeTab === 'achievements' && (
        <section className="space-y-4">
          <div className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/30 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white font-serif-academy">
                    Awarded Digital Badges & Credentials
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Academic honors awarded based on course syllabus completion and timed assessment scores.
                </p>
              </div>

              <button
                onClick={() => setActiveScreen('student-achievements')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md w-max"
              >
                <span>Open Full Badges Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Digital Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Badge 1 */}
              <div 
                onClick={() => setActiveScreen('student-achievements')}
                className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Gold • Quiz Score
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 font-bold shrink-0 group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      Assessment Virtuoso
                    </h4>
                    <p className="text-[11px] text-slate-400">Score ≥90% on Timed Test</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-[11px] text-slate-400">
                  <span>Holder: <strong>{currentUser.firstName}</strong></span>
                  <span className="text-indigo-300 font-mono">+600 XP</span>
                </div>
              </div>

              {/* Badge 2 */}
              <div 
                onClick={() => setActiveScreen('student-achievements')}
                className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Silver • Completion
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center text-indigo-300 font-bold shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Syllabus Sprinter
                    </h4>
                    <p className="text-[11px] text-slate-400">≥50% in Calculus Course</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-[11px] text-slate-400">
                  <span>Progress: <strong>65% Completed</strong></span>
                  <span className="text-indigo-300 font-mono">+250 XP</span>
                </div>
              </div>

              {/* Badge 3 */}
              <div 
                onClick={() => setActiveScreen('student-achievements')}
                className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Gold • Course Finisher
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> 65% / 100%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 font-bold shrink-0 group-hover:scale-105 transition-transform">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      Course Finisher
                    </h4>
                    <p className="text-[11px] text-slate-400">100% Course Completion</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-[11px] text-slate-400">
                  <span>Advancement: <strong>65%</strong></span>
                  <span className="text-amber-300 font-mono">+500 XP</span>
                </div>
              </div>
            </div>

            {/* Hub Banner */}
            <div 
              onClick={() => setActiveScreen('student-achievements')}
              className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900 border border-indigo-500/40 flex items-center justify-between cursor-pointer hover:border-indigo-400/70 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Interactive Digital Badges & Verification Hub</h4>
                  <p className="text-xs text-slate-300">View all 11+ badges, test completion simulator, and download signed certificates</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white shrink-0" />
            </div>
          </div>
        </section>
      )}

      {/* Tab 1: Subject Mastery & Performance */}
      {activeTab === 'performance' && (
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold text-white font-serif-academy">Subject Mastery</h2>
            <span className="text-xs text-slate-400 font-semibold">Semester-to-Date</span>
          </div>

          <div className="space-y-3">
            {/* Mathematics Card */}
            <div
              onClick={() => setActiveScreen('subject-mastery')}
              className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-lg shadow-black/20 hover:border-indigo-500/40 hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">functions</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Mathematics
                    </h3>
                    <p className="text-xs text-slate-400">Advanced Calculus, Linear Algebra</p>
                  </div>
                </div>
                <span className="text-base font-bold text-emerald-400">92%</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-indigo-300 mt-3 pt-2 border-t border-white/10">
                <span>Click for Chapter Analysis & Teacher Chat</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Physics Card */}
            <div className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-lg shadow-black/20 hover:border-indigo-500/40 transition-all">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">science</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Physics</h3>
                    <p className="text-xs text-slate-400">Mechanics, Thermodynamics, Quantum 101</p>
                  </div>
                </div>
                <span className="text-base font-bold text-emerald-400">78%</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

            {/* Chemistry Card */}
            <div className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-lg shadow-black/20 hover:border-indigo-500/40 transition-all">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">biotech</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Chemistry</h3>
                    <p className="text-xs text-slate-400">Organic Synthesis, Chemical Kinetics</p>
                  </div>
                </div>
                <span className="text-base font-bold text-emerald-400">85%</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          {/* Academic Report CTA Banner */}
          <div
            onClick={() => setActiveScreen('academic-report')}
            className="bg-gradient-to-r from-indigo-900 to-purple-950 border border-indigo-500/30 text-white rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-indigo-400/50 transition-all shadow-xl mt-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-base font-bold">View Full Academic Report</h4>
                <p className="text-xs text-slate-300">Historical score trends, percentile rankings, and downloadable transcript</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </section>
      )}

      {/* Tab 2: Recent Activity */}
      {activeTab === 'activity' && (
        <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-lg shadow-black/20 space-y-4">
          <h3 className="text-base font-bold text-white font-serif-academy">Recent Platform Activity</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white/[0.04] rounded-xl border border-white/10 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">Completed Calculus Quiz 4</p>
                <p className="text-slate-400">Scored 18/20 (90%) • 2 hours ago</p>
              </div>
              <span className="text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">+50 XP</span>
            </div>
            <div className="p-3 bg-white/[0.04] rounded-xl border border-white/10 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">Watched 45 mins of Lecture 12</p>
                <p className="text-slate-400">Organic Chemistry Basics • Yesterday</p>
              </div>
              <span className="text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded font-bold">Progress 100%</span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: Settings */}
      {activeTab === 'settings' && (
        <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-lg shadow-black/20 space-y-4">
          <h3 className="text-base font-bold text-white font-serif-academy">Account & Security Settings</h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex justify-between items-center py-2.5 border-b border-white/10">
              <div>
                <p className="font-bold text-white">Institutional Single Sign-On</p>
                <p className="text-xs text-slate-400">Bound to {currentUser.loginId}</p>
              </div>
              <span className="text-xs text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                Enforced
              </span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-white/10">
              <div>
                <p className="font-bold text-white">Biometric Facial Check-in Auto Sync</p>
                <p className="text-xs text-slate-400">Sync with Science Block Campus Terminals</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-indigo-500 w-4 h-4" />
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-white/10">
              <div>
                <p className="font-bold text-white">Switch Active Student Profile</p>
                <p className="text-xs text-slate-400">Select any enrolled student from institutional roster</p>
              </div>
              <button
                onClick={openLoginModal}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-3 py-1.5 rounded-lg"
              >
                Change ID
              </button>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span>Dark Mode Theme</span>
              <span className="text-xs text-slate-400 font-mono">Immersive Midnight</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
