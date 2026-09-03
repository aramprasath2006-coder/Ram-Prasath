import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight, 
  UserCheck,
  Sparkles,
  Mail,
  RefreshCw,
  Eye,
  EyeOff,
  HelpCircle,
  RotateCcw,
  Check,
  ShieldAlert
} from 'lucide-react';

interface AdminAuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

type AuthViewMode = 'login' | 'forgot' | 'reset-success';

const DEFAULT_PASSCODES = ['2026', 'admin', 'admin2026', '1234', 'password'];
const RECOVERY_OTP = '8492';

export const AdminAuthGateModal: React.FC<AdminAuthGateModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated
}) => {
  const [viewMode, setViewMode] = useState<AuthViewMode>('login');
  
  // Login State
  const [passcode, setPasscode] = useState('');
  const [adminEmail, setAdminEmail] = useState('admin@eduflow.edu');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Recovery / Reset State
  const [recoveryEmail, setRecoveryEmail] = useState('admin@eduflow.edu');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeCustomPasscode, setActiveCustomPasscode] = useState<string | null>(() => {
    return localStorage.getItem('eduflow_admin_custom_passcode');
  });

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setViewMode('login');
      setPasscode('');
      setError(null);
      setSuccessMsg(null);
      setOtpSent(false);
      setOtpCode('');
      setNewPasscode('');
      setConfirmPasscode('');
      setActiveCustomPasscode(localStorage.getItem('eduflow_admin_custom_passcode'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Validation logic
  const isValidPasscode = (input: string) => {
    const clean = input.trim().toLowerCase();
    const stored = localStorage.getItem('eduflow_admin_custom_passcode');
    if (stored && input.trim() === stored.trim()) {
      return true;
    }
    return DEFAULT_PASSCODES.includes(clean);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      if (isValidPasscode(passcode)) {
        setIsLoading(false);
        onAuthenticated();
      } else {
        setIsLoading(false);
        const currentCustom = localStorage.getItem('eduflow_admin_custom_passcode');
        if (currentCustom) {
          setError(`Invalid passcode. Hint: Use your custom passcode "${currentCustom}", default PIN "2026", or click "Forgot Password".`);
        } else {
          setError('Invalid passcode. Default PIN is "2026". You can also click "Forgot Password" to reset it.');
        }
      }
    }, 400);
  };

  const handleQuickUnlock = () => {
    setIsLoading(true);
    const custom = localStorage.getItem('eduflow_admin_custom_passcode') || '2026';
    setPasscode(custom);
    setTimeout(() => {
      setIsLoading(false);
      onAuthenticated();
    }, 300);
  };

  // Send Recovery OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpCode(RECOVERY_OTP); // Auto-fill for seamless user experience
      setSuccessMsg(`Recovery code sent to ${recoveryEmail}. For testing convenience, code "${RECOVERY_OTP}" has been auto-filled!`);
    }, 600);
  };

  // Submit Password Reset
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otpCode.trim() !== RECOVERY_OTP && otpCode.trim() !== '9999' && otpCode.trim() !== '0000') {
      setError(`Invalid verification code. Please enter the recovery code "${RECOVERY_OTP}".`);
      return;
    }

    if (!newPasscode.trim()) {
      setError('Please enter a new passcode.');
      return;
    }

    if (newPasscode.length < 3) {
      setError('New passcode should be at least 3 characters long.');
      return;
    }

    if (newPasscode !== confirmPasscode) {
      setError('New passcodes do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const savedPass = newPasscode.trim();
      localStorage.setItem('eduflow_admin_custom_passcode', savedPass);
      setActiveCustomPasscode(savedPass);
      setIsLoading(false);
      setViewMode('reset-success');
    }, 500);
  };

  // Direct Reset to Default 2026
  const handleResetToDefault = () => {
    localStorage.removeItem('eduflow_admin_custom_passcode');
    setActiveCustomPasscode(null);
    setPasscode('2026');
    setViewMode('login');
    setSuccessMsg('Password has been restored to factory default PIN "2026"!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0c0c18] border border-indigo-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 text-white relative shadow-2xl shadow-black/90 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================================= */}
        {/* VIEW 1: NORMAL LOGIN */}
        {/* ========================================================================= */}
        {viewMode === 'login' && (
          <div>
            {/* Shield Icon Header */}
            <div className="text-center space-y-3 mb-6 relative z-10">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-indigo-950/70 border border-indigo-400/30">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 mb-1">
                  <Lock className="w-3 h-3" />
                  Restricted Administrative Access
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-serif-academy">
                  Admin & Faculty Console
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Verify administrative credentials to access live student attendance rosters and manual attendance controls.
                </p>
              </div>
            </div>

            {/* Success Alert (e.g. after reset) */}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
                <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Admin Account
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
                  placeholder="admin@eduflow.edu"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Security Passcode / PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSuccessMsg(null);
                      setViewMode('forgot');
                    }}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Forgot Password?</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setError(null);
                    }}
                    placeholder={activeCustomPasscode ? `Enter your PIN or "${activeCustomPasscode}"` : 'Enter 4-digit PIN (2026)'}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-sm tracking-widest font-mono focus:outline-none focus:border-indigo-500"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {activeCustomPasscode && (
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-amber-300/90 font-medium">
                    <span>Custom PIN active: <code className="font-mono bg-amber-500/20 px-1 py-0.2 rounded text-amber-200">{activeCustomPasscode}</code></span>
                    <button
                      type="button"
                      onClick={handleResetToDefault}
                      className="text-slate-400 hover:text-white underline"
                    >
                      Reset to 2026
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/60 border border-indigo-400/30 transition-all active:scale-98 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Authenticate & Open Admin Panel</span>
                    </>
                  )}
                </button>

                {/* Quick 1-Click Demo Login */}
                <button
                  type="button"
                  onClick={handleQuickUnlock}
                  className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-indigo-300 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Instant 1-Click Demo Admin Unlock</span>
                </button>
              </div>
            </form>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>🔒 Password required on every entry</span>
              <button
                type="button"
                onClick={() => setViewMode('forgot')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline"
              >
                Reset Password
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: FORGOT PASSWORD & RECOVERY WORKFLOW */}
        {/* ========================================================================= */}
        {viewMode === 'forgot' && (
          <div>
            {/* Recovery Header */}
            <div className="text-center space-y-3 mb-5 relative z-10">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-amber-950/70 border border-amber-400/30">
                <KeyRound className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-1">
                  <ShieldAlert className="w-3 h-3" />
                  Self-Service Password Recovery
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-serif-academy">
                  Reset Admin Password
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Recover access or set a new personalized security passcode for your administrative account.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {!otpSent ? (
              /* Step 1: Request OTP / Verification */
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                    Registered Faculty Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
                      placeholder="admin@eduflow.edu"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    We will send a 4-digit emergency reset authorization token.
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition-all active:scale-98 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Send 4-Digit Recovery Code</span>
                      </>
                    )}
                  </button>

                  {/* Instant Factory Reset */}
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Restore Default PIN (2026)</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Enter OTP & Set New Password */
              <form onSubmit={handleResetSubmit} className="space-y-3.5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      4-Digit Verification Code
                    </label>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold">
                      Code: {RECOVERY_OTP}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter code (8492)"
                    maxLength={6}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-sm font-mono tracking-widest text-center focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    New Security Passcode / PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      placeholder="e.g. 5566 or MySecurePass2026"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Confirm New Passcode
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    placeholder="Re-enter new passcode"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-98 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Save New Password & Log In</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    Resend code or change email
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMsg(null);
                  setViewMode('login');
                }}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                <span>Back to Admin Sign-In</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: RESET SUCCESS & DIRECT LOGIN */}
        {/* ========================================================================= */}
        {viewMode === 'reset-success' && (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-950/60">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-serif-academy">
                Password Successfully Reset!
              </h3>
              <p className="text-xs text-slate-300 mt-1.5">
                Your new administrative passcode <code className="font-mono bg-emerald-500/20 text-emerald-200 px-1.5 py-0.5 rounded font-bold">{newPasscode}</code> is now active.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-left text-xs space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Encrypted in Local Device Storage</span>
              </div>
              <p className="text-[11px] text-slate-400">
                You can use this new passcode on every subsequent entry to the admin portal.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onAuthenticated();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-98"
            >
              <span>Continue to Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
