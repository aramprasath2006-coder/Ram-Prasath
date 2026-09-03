import React, { useEffect } from 'react';
import { Course } from '../types';
import {
  CheckCircle2,
  ArrowRight,
  Receipt,
  X,
  GraduationCap,
  ShieldCheck,
  User,
  Sparkles,
  QrCode,
  Calendar,
  CreditCard,
  PartyPopper
} from 'lucide-react';
import { triggerEnrollmentConfetti } from '../utils/confettiCelebration';

interface PaymentSuccessScreenProps {
  course?: Course;
  amount?: number;
  paymentMethod?: string;
  txnId?: string;
  date?: string;
  candidateName?: string;
  candidatePhoto?: string;
  candidateRollNo?: string;
  onStartLearning: () => void;
  onViewReceipt: () => void;
  onReturnDashboard: () => void;
}

export const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({
  course,
  amount = 499,
  paymentMethod = 'Google Pay UPI (aramprasath2006@oksbi)',
  txnId = 'TXN-847291UPI',
  date = 'Oct 24, 2023',
  candidateName = 'Alex Rivera',
  candidatePhoto,
  candidateRollNo = '26CS0142',
  onStartLearning,
  onViewReceipt,
  onReturnDashboard
}) => {
  // Fire celebration confetti when the confirmed payment screen renders
  useEffect(() => {
    triggerEnrollmentConfetti({ particleCount: 110 });
  }, []);

  return (
    <div className="min-h-screen bg-[#050508] immersive-bg text-slate-200 flex flex-col justify-between selection:bg-indigo-500 selection:text-white animate-in fade-in duration-200 pb-12">
      {/* Top Header */}
      <header className="flex justify-between items-center w-full px-4 sm:px-6 py-3 bg-[#0c0c18]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight font-serif-academy">ASCEND STALTECH INDIAA</h1>
        </div>

        <button
          onClick={onReturnDashboard}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors border border-white/10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Success Dialog Canvas */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 relative">
        {/* Ambient Blurred Accents */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-lg bg-[#0c0c18]/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Animated Success Circle Badge with Confetti Trigger */}
          <button
            type="button"
            onClick={() => triggerEnrollmentConfetti({ particleCount: 130 })}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border-2 border-emerald-500/40 flex items-center justify-center mb-5 shadow-xl animate-bounce duration-1000 group transition-all cursor-pointer relative"
            title="Click to celebrate again with confetti! 🎉"
          >
            <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-lg border border-amber-300">
              🎉
            </span>
          </button>

          {/* Headers */}
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-serif-academy">
              Course Enrollment Confirmed!
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mb-5 font-medium flex items-center gap-1.5 justify-center">
            <span>Academic pass issued and syllabus access unlocked.</span>
            <button
              onClick={() => triggerEnrollmentConfetti({ particleCount: 100 })}
              className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-0.5 ml-1 text-xs hover:underline cursor-pointer"
            >
              <PartyPopper className="w-3.5 h-3.5" />
              <span>Celebrate</span>
            </button>
          </p>

          {/* Candidate Pass Card with Photo */}
          <div className="w-full bg-gradient-to-br from-[#121226] to-[#0a0a16] rounded-2xl p-4 sm:p-5 border border-indigo-500/30 mb-5 shadow-xl text-left relative overflow-hidden">
            <div className="flex items-start gap-3.5">
              {/* Candidate Passport Photo Preview */}
              <div className="relative w-16 h-20 sm:w-18 sm:h-24 rounded-xl overflow-hidden bg-slate-800 border-2 border-amber-400/60 shrink-0 shadow-md">
                {candidatePhoto ? (
                  <img
                    src={candidatePhoto}
                    alt={candidateName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400">
                    <User className="w-6 h-6" />
                    <span className="text-[8px] mt-0.5 font-bold">Pass Photo</span>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[7px] text-amber-300 font-bold text-center py-0.5">
                  VERIFIED
                </div>
              </div>

              {/* Candidate Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Official Student Pass
                  </span>
                  <span className="text-[10px] font-mono text-indigo-300 font-bold">
                    {candidateRollNo}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {candidateName}
                </h3>

                <p className="text-xs text-slate-300 font-semibold truncate text-indigo-200">
                  {course?.title || 'Advanced Mathematics & Calculus'}
                </p>

                <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {date}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">₹{amount}.00 Paid</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details Card */}
          <div className="w-full bg-white/[0.04] rounded-2xl p-4 sm:p-5 mb-6 border border-white/10 text-left space-y-3">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-400">Transaction ID</span>
              <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded">
                {txnId}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-400">Payment Channel</span>
              <span className="font-semibold text-white flex items-center gap-1.5 truncate max-w-[230px]">
                <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{paymentMethod}</span>
              </span>
            </div>

            <div className="flex justify-between items-center text-xs sm:text-sm pt-2 border-t border-white/10">
              <span className="text-slate-400 font-semibold">Total Amount</span>
              <span className="text-base font-black text-emerald-400">₹{amount}.00</span>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={onStartLearning}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base py-3.5 rounded-2xl shadow-lg shadow-indigo-950/50 transition-all flex items-center justify-center gap-2 active:scale-98 border border-indigo-400/30"
            >
              <span>Start Learning Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onViewReceipt}
              className="w-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs sm:text-sm py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4 text-indigo-400" />
              <span>View Official Admission Receipt</span>
            </button>
          </div>

          <button
            onClick={onReturnDashboard}
            className="mt-4 text-xs sm:text-sm font-semibold text-slate-400 hover:text-indigo-300 hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
};
