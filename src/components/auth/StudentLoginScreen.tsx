import React, { useState } from 'react';
import { useStudentAuth } from '../../context/StudentAuthContext';
import { ActiveScreen } from '../../types';
import {
  GraduationCap,
  Mail,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Calendar,
  ArrowRight,
  UserCheck,
  Building,
  School,
  Lock,
  Sparkles,
  Info,
  Smartphone
} from 'lucide-react';

interface StudentLoginScreenProps {
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const StudentLoginScreen: React.FC<StudentLoginScreenProps> = ({ setActiveScreen }) => {
  const { login, registeredStudents, currentUser, isAuthenticated, openMobilePasswordModal } = useStudentAuth();

  const [loginId, setLoginId] = useState(currentUser?.loginId || 'alex@edu.in');
  const [passwordDob, setPasswordDob] = useState(currentUser?.dobPassword || '15082004');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedInput = loginId.trim().toLowerCase();
  const isPersonalDomain = ['@gmail.com', '@yahoo.com', '@outlook.com', '@hotmail.com', '@icloud.com', '@rediffmail.com'].some(
    (dom) => trimmedInput.includes(dom)
  );
  const isValidEduFormat = trimmedInput.endsWith('@edu.in') && trimmedInput.replace('@edu.in', '').length >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const result = login(loginId, passwordDob);
      setIsSubmitting(false);

      if (result.success && result.student) {
        setSuccessMessage(`Authenticated successfully! Welcome, ${result.student.name}.`);
        setTimeout(() => {
          setActiveScreen('eduflow-home');
        }, 800);
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please verify your @edu.in ID and DOB password.');
      }
    }, 400);
  };

  const handleSelectStudent = (student: typeof registeredStudents[0]) => {
    setLoginId(student.loginId);
    setPasswordDob(student.dobPassword);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[85vh] w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-12 flex flex-col justify-center animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Institutional Identity & Security Policy */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <School className="w-3.5 h-3.5" />
            <span>ASCEND STALTECH INDIAA Single Sign-On (SSO)</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif-academy">
              Student Institutional Login
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Access your personalized learning portal, live assessments, course library, and digital biometric attendance with your verified university credentials.
            </p>
          </div>

          {/* Credentials Protocol Card */}
          <div className="bg-[#0c0c18]/90 border border-indigo-500/20 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Mandatory Access Protocol</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">1. Official Student Login ID</p>
                  <p className="text-slate-400 mt-0.5">
                    Format is strictly <span className="font-mono text-indigo-300 font-bold">&lt;name&gt;@edu.in</span>. Personal email providers (e.g. Gmail, Yahoo) cannot access this academic system.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">2. Password = Date of Birth (DOB)</p>
                  <p className="text-slate-400 mt-0.5">
                    Your institutional password is your Date of Birth in <span className="font-mono text-emerald-300 font-bold">DDMMYYYY</span> format (e.g. <code className="bg-black/40 px-1 py-0.5 rounded">15082004</code> for 15 Aug 2004).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Login Box */}
        <div className="lg:col-span-7">
          <div className="bg-[#0c0c18] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 relative overflow-hidden backdrop-blur-2xl">
            {/* Glow Highlights */}
            <div className="absolute -right-20 -top-20 w-52 h-52 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-52 h-52 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-white">Sign In to Your Account</h2>
                  <p className="text-xs text-slate-400">Enter your institutional @edu.in credentials</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Lock className="w-5 h-5" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Login ID Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Student Login ID (Must end with @edu.in)</span>
                    </label>
                    {isValidEduFormat && (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Valid Institutional ID
                      </span>
                    )}
                  </div>

                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => {
                      setLoginId(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="e.g. alex@edu.in, priya@edu.in, rohan@edu.in"
                    required
                    className={`w-full bg-white/[0.05] border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-mono focus:outline-none transition-all ${
                      isPersonalDomain
                        ? 'border-rose-500 ring-2 ring-rose-500/30'
                        : isValidEduFormat
                        ? 'border-emerald-500/60 ring-2 ring-emerald-500/20'
                        : 'border-white/15 focus:border-indigo-500'
                    }`}
                  />

                  {/* Warning on personal domains */}
                  {isPersonalDomain && (
                    <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      <div>
                        <span className="font-bold">Personal Email Prohibited:</span> Students cannot use standard public email services. Please use your assigned student name with <strong className="text-white">@edu.in</strong> (e.g. <code>alex@edu.in</code>).
                      </div>
                    </div>
                  )}

                  {loginId && !loginId.includes('@') && (
                    <button
                      type="button"
                      onClick={() => setLoginId(`${loginId.trim()}@edu.in`)}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 pt-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Click to append institutional domain: <strong>{loginId.trim()}@edu.in</strong></span>
                    </button>
                  )}
                </div>

                {/* Password / DOB */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Password (Your Date of Birth)</span>
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">Format: DDMMYYYY</span>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordDob}
                      onChange={(e) => {
                        setPasswordDob(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="e.g. 15082004 (for 15 August 2004)"
                      required
                      className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-mono focus:outline-none transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Format: DDMMYYYY without spaces.</span>
                    </span>
                    <button
                      type="button"
                      onClick={openMobilePasswordModal}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Change Password with Mobile No</span>
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in shake">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Success Banner */}
                {successMessage && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isPersonalDomain}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl ${
                    isPersonalDomain
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-950/50 active:scale-[0.99]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating with Institutional Server...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Login with Official Student ID</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Enrolled Student Selector Demo Directory */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <UserCheck className="w-4 h-4 text-indigo-400" />
                    <span>Quick Select Enrolled Student Credentials:</span>
                  </div>
                  <span className="text-[11px] text-slate-400">1-Click Autofill</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {registeredStudents.slice(0, 8).map((student) => {
                    const isCurrent = currentUser?.id === student.id && isAuthenticated;
                    return (
                      <button
                        key={`${student.id}-${student.loginId}`}
                        type="button"
                        onClick={() => handleSelectStudent(student)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                          loginId === student.loginId
                            ? 'bg-indigo-600/25 border-indigo-500 text-white'
                            : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-slate-300'
                        }`}
                      >
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate">{student.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                            <span className="font-mono text-indigo-300 truncate">{student.loginId}</span>
                            <span className="font-mono text-slate-400 shrink-0">DOB: {student.dobPassword}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
