import React, { useState } from 'react';
import { Course, ActiveScreen } from '../types';
import { useStudentAuth } from '../context/StudentAuthContext';
import {
  ArrowLeft,
  QrCode,
  CreditCard,
  Landmark,
  Lock,
  ShieldCheck,
  Check,
  Sparkles,
  UserCheck,
  ChevronRight,
  AlertCircle,
  FileCheck2,
  Clock,
  CheckCircle2,
  PartyPopper
} from 'lucide-react';
import { triggerEnrollmentConfetti } from '../utils/confettiCelebration';
import { CandidatePhotoPicker } from './CandidatePhotoPicker';
import { UpiQrScannerCard } from './UpiQrScannerCard';
import { CardPaymentForm, CardDetails } from './CardPaymentForm';

interface CheckoutScreenProps {
  selectedCourse: Course;
  onBack: () => void;
  onPaymentSuccess: (details: {
    course: Course;
    amount: number;
    paymentMethod: string;
    txnId: string;
    date: string;
    candidateName?: string;
    candidatePhoto?: string;
    candidateRollNo?: string;
  }) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  selectedCourse,
  onBack,
  onPaymentSuccess
}) => {
  const { currentUser, updateProfilePhoto } = useStudentAuth();

  // Candidate Enrollment Information & Photo
  const [candidateName, setCandidateName] = useState(currentUser?.name || 'Alex Rivera');
  const [candidateRollNo, setCandidateRollNo] = useState(currentUser?.rollNo || '26CS0142');
  const [candidatePhoto, setCandidatePhoto] = useState<string>(currentUser?.avatar || '');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Card Details State
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '4532 8901 2345 4242',
    cardHolder: currentUser?.name?.toUpperCase() || 'ALEX RIVERA',
    expiryMonth: '08',
    expiryYear: '28',
    cvv: '891',
    saveCard: true
  });

  const price = selectedCourse.price > 0 ? selectedCourse.price : 499;
  const subtotal = Math.round((price / 1.18) * 100) / 100;
  const gst = Math.round((price - subtotal) * 100) / 100;

  const handlePhotoChange = (photoUrl: string) => {
    setCandidatePhoto(photoUrl);
    if (photoUrl && updateProfilePhoto) {
      updateProfilePhoto(photoUrl);
    }
  };

  const handlePay = () => {
    setErrorMessage(null);

    // Validate Candidate Information
    if (!candidateName.trim()) {
      setErrorMessage('Please enter the Candidate Full Name for the course enrollment.');
      return;
    }

    // Validate Card if card selected
    if (paymentMethod === 'card') {
      const cleanNum = cardDetails.cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 15) {
        setErrorMessage('Please enter a valid 16-digit Card Number.');
        return;
      }
      if (!cardDetails.expiryMonth || !cardDetails.expiryYear) {
        setErrorMessage('Please enter a valid Expiry Date (MM/YY).');
        return;
      }
      if (cardDetails.cvv.length < 3) {
        setErrorMessage('Please enter the 3-digit CVV number printed on the back of your card.');
        return;
      }
    }

    setIsProcessing(true);

    // Step 1: Simulate banking gateway authorization & validation
    setTimeout(() => {
      // Step 2: Payment is validated - trigger celebratory confetti animation
      setIsValidated(true);
      triggerEnrollmentConfetti({
        particleCount: 120,
        spread: 100
      });

      // Step 3: Transition smoothly after celebrating validation on Checkout screen
      setTimeout(() => {
        setIsProcessing(false);
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}UPI`;

        let methodLabel = 'Google Pay UPI (aramprasath2006@oksbi)';
        if (paymentMethod === 'card') {
          const last4 = cardDetails.cardNumber.replace(/\s+/g, '').slice(-4) || '4242';
          methodLabel = `Credit/Debit Card (•••• ${last4})`;
        } else if (paymentMethod === 'netbanking') {
          methodLabel = `Net Banking (${selectedBank})`;
        }

        onPaymentSuccess({
          course: selectedCourse,
          amount: price,
          paymentMethod: methodLabel,
          txnId,
          date: dateString,
          candidateName,
          candidatePhoto,
          candidateRollNo
        });
      }, 1000);
    }, 750);
  };

  return (
    <div className="min-h-screen bg-[#050508] immersive-bg text-slate-200 flex flex-col pb-20 animate-in fade-in duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c18]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-all active:scale-95 border border-white/10"
            title="Go back to courses"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
              Enroll in Course &amp; Checkout
            </h1>
            <p className="text-[11px] text-slate-400">
              Attach Candidate Photo &amp; Complete Secure Payment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Course Summary Card */}
        <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-400" />
              <span>Course Enrollment Summary</span>
            </h2>
            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 px-2 py-0.5 rounded-md uppercase">
              {selectedCourse.category}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/10 shadow-md">
              <img
                src={selectedCourse.imageUrl}
                alt={selectedCourse.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between flex-1 gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                  {selectedCourse.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {selectedCourse.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {selectedCourse.duration || '6 Weeks'}
                  </span>
                  <span>•</span>
                  <span>{selectedCourse.level || 'Intermediate'}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">Lifetime Access</span>
                  {selectedCourse.gradeLevel && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-300 font-bold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
                        {selectedCourse.gradeLevel}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-xl font-bold text-emerald-400">
                  ₹{price.toFixed(2)}
                </span>
                {selectedCourse.isSchoolStudentExclusive && (
                  <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    School Welfare Subsidy (₹10–₹50 Tier)
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Candidate Photo & Enrollment Details Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Candidate Enrollment &amp; Photo</span>
            </h2>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
              Passport Verification
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Candidate Photo Picker Component */}
            <div className="lg:col-span-2">
              <CandidatePhotoPicker
                photoUrl={candidatePhoto}
                onChange={handlePhotoChange}
                candidateName={candidateName}
                label="Candidate Passport Photo for Course Certificate"
                required={true}
              />
            </div>

            {/* Candidate Identity Meta */}
            <div className="bg-[#0f0f1e]/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Candidate Full Name
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => {
                      setCandidateName(e.target.value);
                      setCardDetails((prev) => ({
                        ...prev,
                        cardHolder: e.target.value.toUpperCase()
                      }));
                    }}
                    placeholder="Candidate Name"
                    required
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Student Roll No / ID
                  </label>
                  <input
                    type="text"
                    value={candidateRollNo}
                    onChange={(e) => setCandidateRollNo(e.target.value.toUpperCase())}
                    placeholder="26CS0142"
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-mono font-bold text-indigo-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1 font-bold text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Academic Verification</span>
                </div>
                <p className="text-[10px] leading-tight">
                  This photo and candidate name will appear on the course attendance roster, interactive study portal, and final verified certificate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Payment Method Selection (UPI QR Scanner vs Card vs Net Banking) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>Select Payment Method</span>
            </h2>
            <span className="text-xs text-slate-400">All payment modes 100% secure</span>
          </div>

          {/* Payment Method Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. UPI QR Scanner Option (Highlighted with Ram Prasath QR) */}
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between gap-3 shadow-lg ${
                paymentMethod === 'upi'
                  ? 'border-indigo-500 bg-indigo-500/15 ring-2 ring-indigo-500/30'
                  : 'border-white/10 bg-[#0c0c18]/80 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
                  <QrCode className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Instant QR
                </span>
              </div>

              <div>
                <span className="text-sm font-bold text-white block">
                  UPI QR Scanner
                </span>
                <span className="text-[11px] text-slate-400 line-clamp-1">
                  GPay • PhonePe • Paytm • BHIM
                </span>
              </div>
            </button>

            {/* 2. Credit / Debit Card Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between gap-3 shadow-lg ${
                paymentMethod === 'card'
                  ? 'border-indigo-500 bg-indigo-500/15 ring-2 ring-indigo-500/30'
                  : 'border-white/10 bg-[#0c0c18]/80 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-white/10 px-2 py-0.5 rounded-full">
                  Cards
                </span>
              </div>

              <div>
                <span className="text-sm font-bold text-white block">
                  Credit / Debit Card
                </span>
                <span className="text-[11px] text-slate-400 line-clamp-1">
                  Visa • Mastercard • RuPay • Amex
                </span>
              </div>
            </button>

            {/* 3. Net Banking Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between gap-3 shadow-lg ${
                paymentMethod === 'netbanking'
                  ? 'border-indigo-500 bg-indigo-500/15 ring-2 ring-indigo-500/30'
                  : 'border-white/10 bg-[#0c0c18]/80 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-md border border-white/10">
                  <Landmark className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-white/10 px-2 py-0.5 rounded-full">
                  NetBanking
                </span>
              </div>

              <div>
                <span className="text-sm font-bold text-white block">
                  Net Banking
                </span>
                <span className="text-[11px] text-slate-400 line-clamp-1">
                  SBI • HDFC • ICICI • Axis • All Banks
                </span>
              </div>
            </button>
          </div>

          {/* Active Payment Method Body */}
          <div className="pt-2">
            {/* View A: Google Pay / UPI QR Scanner for Ram Prasath (aramprasath2006@oksbi) */}
            {paymentMethod === 'upi' && (
              <div className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl flex flex-col items-center">
                <div className="w-full text-center pb-4 mb-4 border-b border-white/10">
                  <h3 className="text-base font-bold text-white">
                    Scan Google Pay / UPI QR Code to Pay
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Open Google Pay, PhonePe, Paytm, BHIM or any UPI scanner to pay the course fee.
                  </p>
                </div>

                <UpiQrScannerCard
                  amount={price}
                  courseTitle={selectedCourse.title}
                  payeeName="Ram Prasath"
                  upiId="aramprasath2006@oksbi"
                  onUtrVerified={(utr) => {
                    handlePay();
                  }}
                />
              </div>
            )}

            {/* View B: Card Details Form (Visa, Mastercard, RuPay, Amex) */}
            {paymentMethod === 'card' && (
              <CardPaymentForm
                cardDetails={cardDetails}
                onChange={setCardDetails}
                candidateName={candidateName}
              />
            )}

            {/* View C: Net Banking Form */}
            {paymentMethod === 'netbanking' && (
              <div className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white">Select Your Bank</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    'State Bank of India',
                    'HDFC Bank',
                    'ICICI Bank',
                    'Axis Bank',
                    'Punjab National Bank',
                    'Bank of Baroda'
                  ].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        selectedBank === bank
                          ? 'border-indigo-500 bg-indigo-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 4. Price Breakdown */}
        <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-5 space-y-3 border border-white/10 shadow-xl">
          <div className="flex justify-between text-xs sm:text-sm text-slate-400">
            <span>Course Fee (Subtotal)</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400">
            <span>GST (18% Educational Content)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          <hr className="border-white/10" />
          <div className="flex justify-between text-base sm:text-lg text-white font-bold">
            <span>Total Payable Amount</span>
            <span className="text-emerald-400 font-black">₹{price.toFixed(2)}</span>
          </div>
        </section>

        {/* 5. Complete Enrollment Action Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handlePay}
            disabled={isProcessing || isValidated}
            className={`w-full text-white font-bold text-sm sm:text-base py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-95 border ${
              isValidated
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 border-emerald-400 shadow-emerald-950/60 ring-2 ring-emerald-400/50 scale-[1.01]'
                : isProcessing
                ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 border-amber-400/50 shadow-amber-950/60'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white border-indigo-400/40 shadow-indigo-950/60'
            }`}
          >
            {isValidated ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
                <span>Payment Validated! Celebrating Enrollment 🎉</span>
              </>
            ) : isProcessing ? (
              <>
                <Sparkles className="w-5 h-5 text-amber-200 animate-spin" />
                <span>Authorizing Payment with Banking Gateway...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>{`Complete Enrollment • Pay ₹${price.toFixed(2)}`}</span>
              </>
            )}
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 px-2 gap-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secure 256-bit encrypted checkout</span>
            </span>
            <span>Instant Certificate &amp; Portal Activation</span>
          </div>
        </div>

        {/* Celebratory Fullscreen Confetti Overlay upon Successful Validation */}
        {isValidated && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-b from-[#161430] via-[#0d0c1e] to-[#080814] border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-emerald-950/90 text-center space-y-4 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
                <PartyPopper className="w-10 h-10" />
              </div>

              <div className="space-y-1 relative z-10">
                <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 inline-flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                  <span>Validation Successful</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-serif-academy">
                  Enrollment Confirmed! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Candidate <strong className="text-emerald-300">{candidateName}</strong> is officially enrolled in <strong className="text-white">{selectedCourse.title}</strong>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Unlocking Course Syllabus &amp; Student Pass...</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
