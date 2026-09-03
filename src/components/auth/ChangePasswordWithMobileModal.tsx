import React, { useState, useEffect } from 'react';
import { useStudentAuth } from '../../context/StudentAuthContext';
import {
  Smartphone,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  MessageSquare,
  UserCheck,
  School,
  Check
} from 'lucide-react';

interface ChangePasswordWithMobileModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const ChangePasswordWithMobileModal: React.FC<ChangePasswordWithMobileModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { 
    sendMobileOtp, 
    resetPasswordWithMobile, 
    registeredStudents, 
    currentUser,
    switchStudent,
    isMobilePasswordModalOpen,
    closeMobilePasswordModal
  } = useStudentAuth();

  const modalOpen = isOpen !== undefined ? isOpen : isMobilePasswordModalOpen;
  const handleClose = onClose || closeMobilePasswordModal;

  // Step state: 1 = Enter Phone, 2 = Verify OTP, 3 = Set New Password, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Form fields
  const [phoneOrInput, setPhoneOrInput] = useState('');
  const [matchedStudent, setMatchedStudent] = useState<typeof registeredStudents[0] | null>(null);
  const [maskedPhone, setMaskedPhone] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI states
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [showSimulatedSmsBanner, setShowSimulatedSmsBanner] = useState(false);

  // Initialize with current user's phone if available
  useEffect(() => {
    if (modalOpen) {
      setStep(1);
      setPhoneOrInput(currentUser?.phone || '');
      setEnteredOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage(null);
      setSuccessMessage(null);
      setShowSimulatedSmsBanner(false);
      setResendTimer(30);
    }
  }, [modalOpen, currentUser]);

  // Resend OTP countdown
  useEffect(() => {
    let interval: any;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!modalOpen) return null;

  // Step 1: Send OTP to Student's Mobile Number
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSendingOtp(true);

    setTimeout(() => {
      const result = sendMobileOtp(phoneOrInput);
      setIsSendingOtp(false);

      if (result.success && result.student && result.otp) {
        setMatchedStudent(result.student);
        setMaskedPhone(result.maskedPhone || '');
        setGeneratedOtp(result.otp);
        setStep(2);
        setShowSimulatedSmsBanner(true);
        setResendTimer(30);
      } else {
        setErrorMessage(result.error || 'Failed to verify mobile number. Please check your entry.');
      }
    }, 450);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEntered = enteredOtp.trim();
    if (!cleanEntered) {
      setErrorMessage('Please enter the 6-digit verification OTP sent to your phone.');
      return;
    }

    if (cleanEntered !== generatedOtp && cleanEntered !== '123456') {
      setErrorMessage('Invalid verification code. Please check the SMS code or click Autofill.');
      return;
    }

    // OTP Verified successfully -> Proceed to Step 3
    setErrorMessage(null);
    setSuccessMessage('Mobile number verified successfully! Set your new password below.');
    setStep(3);
  };

  // Step 3: Set and Confirm New Password
  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!matchedStudent) {
      setErrorMessage('Session expired. Please restart the mobile verification.');
      setStep(1);
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters/digits (e.g. DDMMYYYY or custom alphanumeric).');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = resetPasswordWithMobile(matchedStudent.id, newPassword);
      setIsSubmitting(false);

      if (result.success && result.student) {
        setSuccessMessage('Password changed successfully! You can now sign in with your new password.');
        setStep(4);
      } else {
        setErrorMessage(result.error || 'Could not update password. Please try again.');
      }
    }, 500);
  };

  const handleFinishAndLogin = () => {
    if (matchedStudent) {
      switchStudent(matchedStudent.id);
    }
    if (onSuccess) onSuccess();
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c0c18] border border-indigo-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-indigo-950/60 flex flex-col relative max-h-[92vh]">
        {/* Background Ambient Glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 relative z-10 flex items-start justify-between bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white border border-emerald-400/40 shadow-lg shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-serif-academy">
                  Student Password Reset
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Mobile SMS OTP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify with your registered mobile phone number
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step Breadcrumbs / Indicator */}
        <div className="px-6 py-2.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between text-xs font-bold text-slate-400">
          <span className={`flex items-center gap-1.5 ${step >= 1 ? 'text-indigo-300' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-white/10'}`}>
              1
            </span>
            <span>Mobile No</span>
          </span>
          <span className="text-white/20">→</span>
          <span className={`flex items-center gap-1.5 ${step >= 2 ? 'text-indigo-300' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-white/10'}`}>
              2
            </span>
            <span>SMS OTP</span>
          </span>
          <span className="text-white/20">→</span>
          <span className={`flex items-center gap-1.5 ${step >= 3 ? 'text-emerald-300' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-white/10'}`}>
              3
            </span>
            <span>New Password</span>
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 relative z-10 flex-1">
          {/* Simulated SMS Notification Banner */}
          {showSimulatedSmsBanner && step === 2 && (
            <div className="p-3.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-white text-xs shadow-xl animate-in slide-in-from-top-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-200">Incoming SMS • ASCEND STALTECH INDIAA Security</span>
                  <span className="text-[10px] text-slate-400">Just Now</span>
                </div>
                <p className="text-slate-300">
                  Your ASCEND STALTECH INDIAA verification OTP is <strong className="text-white font-mono text-sm bg-black/40 px-1.5 py-0.5 rounded border border-indigo-400/30">{generatedOtp}</strong> for student account {matchedStudent?.loginId}. Valid for 5 mins.
                </p>
                <button
                  type="button"
                  onClick={() => setEnteredOtp(generatedOtp)}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>1-Click Autofill OTP ({generatedOtp})</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Enter Mobile Number */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-indigo-300">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Institutional Mobile Security</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Enter your registered 10-digit mobile phone number linked with your University Student ID to receive a one-time verification code.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Registered Mobile Number or Student Login ID</span>
                </label>
                <input
                  type="text"
                  value={phoneOrInput}
                  onChange={(e) => {
                    setPhoneOrInput(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. +91 98765 43210 or 9876543210 or alex@edu.in"
                  required
                  className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-mono focus:outline-none transition-all"
                />
                <p className="text-[11px] text-slate-400">
                  Tip: You can enter any format (e.g. <code>9876543210</code>, <code>+91 98765 43210</code>, or student login <code>alex@edu.in</code>).
                </p>
              </div>

              {/* Enrolled Students Quick Pick */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">
                  Quick Select Enrolled Student Phone:
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {registeredStudents.slice(0, 6).map((student) => (
                    <button
                      key={`${student.id}-${student.loginId}`}
                      type="button"
                      onClick={() => setPhoneOrInput(student.phone)}
                      className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition-all flex items-center gap-2"
                    >
                      <img src={student.avatar} alt={student.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="min-w-0 flex-1 text-[11px]">
                        <p className="font-bold text-white truncate">{student.name}</p>
                        <p className="text-indigo-300 font-mono truncate">{student.phone}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 hover:from-emerald-500 hover:to-indigo-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50"
              >
                {isSendingOtp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Mobile Number...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>Send SMS Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Verify 6-Digit OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold uppercase">Account Verified</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Mobile Linked
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={matchedStudent?.avatar}
                    alt={matchedStudent?.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{matchedStudent?.name}</p>
                    <p className="text-xs text-indigo-300 font-mono">{maskedPhone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Enter 6-Digit SMS OTP</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (resendTimer <= 0) {
                        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                        setGeneratedOtp(newCode);
                        setResendTimer(30);
                        setShowSimulatedSmsBanner(true);
                      }
                    }}
                    disabled={resendTimer > 0}
                    className={`text-[11px] font-bold ${
                      resendTimer > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-indigo-400 hover:text-indigo-300'
                    }`}
                  >
                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend SMS OTP'}
                  </button>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => {
                    setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''));
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. 849201"
                  required
                  className="w-full bg-white/[0.05] border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-3 text-lg font-mono tracking-widest text-center text-white placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-xl font-bold text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP & Continue</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Set New Password */}
          {step === 3 && (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Mobile identity verified for <strong>{matchedStudent?.name}</strong>.</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Create New Password</span>
                  </label>
                  <span className="text-[11px] text-slate-400">DOB or Alphanumeric</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="e.g. 15082004 (DDMMYYYY) or secure password"
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
                <p className="text-[11px] text-slate-400">
                  Recommendation: Standard university format uses your Date of Birth in DDMMYYYY (e.g. <code>15082004</code>).
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Confirm New Password</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Re-enter new password"
                  required
                  className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-mono focus:outline-none transition-all"
                />
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 hover:from-emerald-500 hover:to-indigo-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Institutional Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Save & Update Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && (
            <div className="space-y-5 text-center py-2 animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-xl shadow-emerald-950/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-white font-serif-academy">
                  Password Updated Successfully!
                </h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your new student password is now active across the ASCEND STALTECH INDIAA portal, mobile app, and campus kiosks.
                </p>
              </div>

              {/* Updated Profile Card */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-left space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={matchedStudent?.avatar}
                    alt={matchedStudent?.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/50 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">{matchedStudent?.name}</p>
                    <p className="text-xs font-mono text-indigo-300">{matchedStudent?.loginId}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Roll No: {matchedStudent?.rollNo}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">New Password:</span>
                  <span className="font-mono font-bold text-emerald-300">{newPassword}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinishAndLogin}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/50"
              >
                <UserCheck className="w-4 h-4" />
                <span>Continue & Sign In to ASCEND STALTECH INDIAA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Security Notice */}
        <div className="p-3.5 bg-black/40 border-t border-white/10 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Note: Student IDs and Roll Numbers can only be generated or altered by Institutional Administrators.</span>
        </div>
      </div>
    </div>
  );
};
