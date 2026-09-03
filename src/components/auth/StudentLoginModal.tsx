import React, { useState, useEffect } from 'react';
import { useStudentAuth } from '../../context/StudentAuthContext';
import {
  Lock,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  UserCheck,
  Info,
  X,
  KeyRound,
  Smartphone
} from 'lucide-react';

interface StudentLoginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  isMandatoryScreen?: boolean;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isMandatoryScreen = false
}) => {
  const { 
    login, 
    registeredStudents, 
    currentUser, 
    isAuthenticated, 
    openMobilePasswordModal,
    isLoginModalOpen,
    closeLoginModal 
  } = useStudentAuth();

  const modalOpen = isOpen !== undefined ? isOpen : isLoginModalOpen;
  const handleClose = onClose || closeLoginModal;

  const [loginId, setLoginId] = useState('');
  const [passwordDob, setPasswordDob] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default student ID when opening
  useEffect(() => {
    if (modalOpen) {
      setLoginId(currentUser?.loginId || 'alex@edu.in');
      setPasswordDob(currentUser?.dobPassword || '15082004');
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [modalOpen, currentUser]);

  if (!modalOpen) return null;

  // Real-time domain validation checks
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
        setSuccessMessage(`Welcome back, ${result.student.name}! Institutional session verified.`);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          handleClose();
        }, 900);
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please check your credentials.');
      }
    }, 400);
  };

  const handleSelectDemoStudent = (student: typeof registeredStudents[0]) => {
    setLoginId(student.loginId);
    setPasswordDob(student.dobPassword);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c0c18] border border-indigo-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-indigo-950/50 flex flex-col relative max-h-[92vh]">
        {/* Background Ambient Glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 relative z-10 flex items-start justify-between bg-gradient-to-r from-indigo-950/60 to-purple-950/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white border border-indigo-400/40 shadow-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Student Login Portal</h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  @edu.in Only
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official ASCEND STALTECH INDIAA Institutional Single Sign-On (SSO)
              </p>
            </div>
          </div>

          {!isMandatoryScreen && (
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body with Scroll */}
        <div className="p-6 overflow-y-auto space-y-5 relative z-10 flex-1 custom-scrollbar">
          {/* Institutional Policy Notice */}
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-slate-300 space-y-1">
              <p className="font-bold text-white">Institutional Authentication Rules:</p>
              <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                <li>
                  <strong>Login ID Format:</strong> First name + <code className="bg-black/40 px-1 py-0.2 rounded text-indigo-300">@edu.in</code> (e.g., <span className="text-amber-300 font-mono">alex@edu.in</span>).
                </li>
                <li>
                  <strong>Personal Emails Banned:</strong> Public domains (@gmail.com, @yahoo.com) cannot be used.
                </li>
                <li>
                  <strong>Password:</strong> Your <strong>Date of Birth (DOB)</strong> in <code className="bg-black/40 px-1 py-0.2 rounded text-emerald-300">DDMMYYYY</code> format.
                </li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Login ID Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Student Login ID (Format: name@edu.in)</span>
                </label>
                {isValidEduFormat && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid @edu.in ID
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => {
                    setLoginId(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. alex@edu.in, priya@edu.in"
                  required
                  className={`w-full bg-white/[0.05] border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none transition-all ${
                    isPersonalDomain
                      ? 'border-rose-500 ring-2 ring-rose-500/30'
                      : isValidEduFormat
                      ? 'border-emerald-500/60 ring-2 ring-emerald-500/20'
                      : 'border-white/15 focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* Instant Warning if personal email domain is typed */}
              {isPersonalDomain && (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <span className="font-bold">Personal Email Prohibited:</span> Students cannot use personal email IDs. Please enter your name followed by <strong className="text-white">@edu.in</strong> (e.g. <code>alex@edu.in</code>).
                  </div>
                </div>
              )}

              {/* Quick domain suffix helper if user only typed first name */}
              {loginId && !loginId.includes('@') && (
                <button
                  type="button"
                  onClick={() => setLoginId(`${loginId.trim()}@edu.in`)}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 pt-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Click to complete: <strong>{loginId.trim()}@edu.in</strong></span>
                </button>
              )}
            </div>

            {/* Password (Date of Birth) Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Password (Date of Birth - DDMMYYYY)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">e.g. 15082004</span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordDob}
                  onChange={(e) => {
                    setPasswordDob(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. 15082004 for 15 Aug 2004"
                  required
                  className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  <span>DOB Format (DDMMYYYY)</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    openMobilePasswordModal();
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Change Password with Mobile No</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isPersonalDomain}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                isPersonalDomain
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-950/50 active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In with @edu.in ID</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Enrolled Student Directory Demo Bar */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Registered Students Roster (Click to Autofill)</span>
              </span>
              <span className="text-[10px] text-slate-400">Institutional Database</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
              {registeredStudents.map((student) => {
                const isCurrent = currentUser?.id === student.id && isAuthenticated;
                return (
                  <button
                    key={`${student.id}-${student.loginId}`}
                    type="button"
                    onClick={() => handleSelectDemoStudent(student)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 group ${
                      loginId === student.loginId
                        ? 'bg-indigo-600/25 border-indigo-500 text-white'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-slate-300'
                    }`}
                  >
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{student.name}</span>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Active Session" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
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

        {/* Modal Footer */}
        <div className="p-4 bg-black/40 border-t border-white/10 text-center text-xs text-slate-400">
          ASCEND STALTECH INDIAA LMS • Security Enforcement: Official Institutional SSO Policy
        </div>
      </div>
    </div>
  );
};
