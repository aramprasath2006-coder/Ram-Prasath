import React, { useState } from 'react';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  saveCard: boolean;
}

interface CardPaymentFormProps {
  cardDetails: CardDetails;
  onChange: (updated: CardDetails) => void;
  candidateName?: string;
  onValidStateChange?: (isValid: boolean) => void;
}

export const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  cardDetails,
  onChange,
  candidateName = 'STUDENT NAME',
  onValidStateChange
}) => {
  const [isCvvFocused, setIsCvvFocused] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [showCvvHint, setShowCvvHint] = useState(false);

  // Detect card network brand
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return { name: 'Visa', color: 'from-blue-600 to-indigo-900', badge: 'VISA' };
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return { name: 'Mastercard', color: 'from-red-600 to-amber-800', badge: 'MASTERCARD' };
    if (/^3[47]/.test(clean)) return { name: 'Amex', color: 'from-emerald-600 to-teal-900', badge: 'AMEX' };
    if (/^(?:60|65|81|82|508)/.test(clean)) return { name: 'RuPay', color: 'from-orange-600 to-blue-900', badge: 'RUPAY' };
    return { name: 'Credit / Debit Card', color: 'from-slate-800 via-indigo-950 to-slate-900', badge: 'CARD' };
  };

  const brand = getCardBrand(cardDetails.cardNumber);

  // Formatting Card Number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    // Add spaces every 4 digits
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    onChange({ ...cardDetails, cardNumber: formatted });
  };

  // Expiry MM/YY formatting
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      const mm = parseInt(val.slice(0, 2), 10);
      const safeMm = mm > 12 ? '12' : mm === 0 ? '01' : val.slice(0, 2);
      const yy = val.slice(2);
      val = yy ? `${safeMm}/${yy}` : safeMm;
    }
    const [m = '', y = ''] = val.split('/');
    onChange({
      ...cardDetails,
      expiryMonth: m,
      expiryYear: y
    });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    onChange({ ...cardDetails, cvv: val });
  };

  const isCardNumberValid = cardDetails.cardNumber.replace(/\s+/g, '').length >= 15;
  const isExpiryValid = cardDetails.expiryMonth.length === 2 && cardDetails.expiryYear.length === 2;
  const isCvvValid = cardDetails.cvv.length >= 3;
  const isHolderValid = cardDetails.cardHolder.trim().length >= 2;

  const isFormComplete = isCardNumberValid && isExpiryValid && isCvvValid && isHolderValid;

  return (
    <div className="space-y-6">
      {/* 3D Interactive Card Preview */}
      <div className="perspective-1000 max-w-sm mx-auto">
        <div
          className={`relative w-full h-52 rounded-2xl p-5 shadow-2xl transition-transform duration-700 transform-style-3d border border-white/20 text-white bg-gradient-to-tr ${brand.color}`}
          style={{
            transform: isCvvFocused ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Card FRONT */}
          <div
            className="absolute inset-0 p-5 flex flex-col justify-between backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Top row: Chip and Brand */}
            <div className="flex justify-between items-center">
              {/* EMV Chip */}
              <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 border border-amber-500/60 shadow-inner flex items-center justify-center p-1 relative overflow-hidden">
                <div className="w-full h-[1px] bg-amber-700/40 absolute top-2" />
                <div className="w-full h-[1px] bg-amber-700/40 absolute bottom-2" />
                <div className="h-full w-[1px] bg-amber-700/40 absolute left-3" />
                <div className="h-full w-[1px] bg-amber-700/40 absolute right-3" />
              </div>

              {/* Brand Logo Tag */}
              <span className="font-mono font-black text-sm tracking-wider px-2 py-0.5 rounded bg-black/30 border border-white/20">
                {brand.badge}
              </span>
            </div>

            {/* Middle row: Card Number */}
            <div className="font-mono text-lg sm:text-xl font-bold tracking-[0.22em] text-shadow drop-shadow-md">
              {cardDetails.cardNumber || '•••• •••• •••• ••••'}
            </div>

            {/* Bottom row: Card Holder & Expiration */}
            <div className="flex justify-between items-end text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-300 block font-semibold">
                  Cardholder Name
                </span>
                <span className="font-bold tracking-wider uppercase font-mono truncate max-w-[170px] block">
                  {cardDetails.cardHolder || candidateName}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-slate-300 block font-semibold">
                  Expires
                </span>
                <span className="font-bold font-mono">
                  {cardDetails.expiryMonth || 'MM'} / {cardDetails.expiryYear || 'YY'}
                </span>
              </div>
            </div>
          </div>

          {/* Card BACK (Shows when CVV focused) */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col justify-between py-4 backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {/* Magnetic Stripe */}
            <div className="w-full h-10 bg-black/90 shadow-inner mt-1" />

            {/* Signature & CVV Area */}
            <div className="px-5 space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-300 block font-semibold">
                Authorized Signature / Security Code
              </span>
              <div className="flex items-center">
                <div className="flex-1 h-8 bg-slate-200 rounded-l flex items-center justify-end px-2 text-slate-700 text-xs font-serif italic">
                  Candidate Signature
                </div>
                <div className="w-14 h-8 bg-white rounded-r flex items-center justify-center font-mono font-bold text-slate-900 border-l border-slate-300 text-sm">
                  {cardDetails.cvv ? (showCvv ? cardDetails.cvv : '•••') : 'CVV'}
                </div>
              </div>
            </div>

            {/* Back Disclaimer */}
            <div className="px-5 text-[8px] text-slate-300/80 leading-tight">
              This card is protected by 256-bit bank grade encryption. Never share your OTP or CVV.
            </div>
          </div>
        </div>
      </div>

      {/* Card Details Input Fields */}
      <div className="bg-[#0c0c18]/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Enter Card Payment Details</h3>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" />
            <span>PCI-DSS Compliant</span>
          </span>
        </div>

        {/* Card Number Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Card Number</span>
            <span className="text-[10px] font-mono text-indigo-300">{brand.name}</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardDetails.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="4532 8492 0192 4242"
              maxLength={19}
              required
              className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all pl-10"
            />
            <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {isCardNumberValid && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
            )}
          </div>
        </div>

        {/* Cardholder Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">
            Cardholder Full Name
          </label>
          <input
            type="text"
            value={cardDetails.cardHolder}
            onChange={(e) => onChange({ ...cardDetails, cardHolder: e.target.value.toUpperCase() })}
            placeholder={candidateName || 'e.g. SAMIR KULKARNI'}
            required
            className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-mono uppercase text-white placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Expiry and CVV Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Expiration Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Expiry Date (MM/YY)
            </label>
            <input
              type="text"
              value={
                cardDetails.expiryMonth && cardDetails.expiryYear
                  ? `${cardDetails.expiryMonth}/${cardDetails.expiryYear}`
                  : cardDetails.expiryMonth || ''
              }
              onChange={handleExpiryChange}
              placeholder="MM / YY"
              maxLength={5}
              required
              className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all text-center"
            />
          </div>

          {/* CVV Input with Flip trigger */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <span>CVV / CVC</span>
                <button
                  type="button"
                  onClick={() => setShowCvvHint(!showCvvHint)}
                  className="text-slate-400 hover:text-indigo-300"
                  title="What is CVV?"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </label>
              <button
                type="button"
                onClick={() => setShowCvv(!showCvv)}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
              >
                {showCvv ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showCvv ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showCvv ? 'text' : 'password'}
                value={cardDetails.cvv}
                onChange={handleCvvChange}
                onFocus={() => setIsCvvFocused(true)}
                onBlur={() => setIsCvvFocused(false)}
                placeholder="•••"
                maxLength={4}
                required
                className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all text-center"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* CVV Tooltip */}
        {showCvvHint && (
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              The 3-digit CVV number is printed on the back of your Visa/Mastercard/RuPay card next to the signature strip (or 4 digits on front for Amex).
            </span>
          </div>
        )}

        {/* Save Card Checkbox */}
        <div className="pt-1 flex items-center gap-2.5">
          <input
            type="checkbox"
            id="saveCardCheck"
            checked={cardDetails.saveCard}
            onChange={(e) => onChange({ ...cardDetails, saveCard: e.target.checked })}
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
          />
          <label htmlFor="saveCardCheck" className="text-xs text-slate-300 cursor-pointer select-none">
            Securely save this card for 1-click future course enrollments
          </label>
        </div>
      </div>
    </div>
  );
};
