import React, { useState } from 'react';
import { X, Plus, CreditCard, QrCode, ShieldCheck, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFundsAdded: (amount: number) => void;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({
  isOpen,
  onClose,
  onFundsAdded
}) => {
  const [amount, setAmount] = useState<number>(500);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [250, 500, 1000, 2000];

  const handleAdd = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onFundsAdded(amount);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#0c0c18] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-white/10 flex flex-col">
        {/* Header */}
        <div className="bg-[#070710] border-b border-white/10 px-5 py-3.5 flex justify-between items-center text-white">
          <h3 className="font-bold text-white text-base font-serif-academy">Add Wallet Credits</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Select or Enter Amount (INR)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-indigo-300">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="100"
                step="50"
                className="w-full text-xl font-bold text-white pl-9 pr-4 py-3 bg-white/[0.06] border-2 border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Quick Amounts */}
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((q) => (
              <button
                key={q}
                onClick={() => setAmount(q)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  amount === q
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50 border border-indigo-400/30'
                    : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.1] border border-white/10'
                }`}
              >
                +₹{q}
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
            <p className="font-bold text-indigo-300">Instant Credit Guarantee</p>
            <p className="text-[11px] text-slate-300">
              Credits are instantly applied to your student balance and can be used for any course or mock series enrollment.
            </p>
          </div>

          <button
            onClick={handleAdd}
            disabled={isProcessing || amount <= 0}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 shadow-lg shadow-indigo-950/50 border border-indigo-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>{isProcessing ? 'Processing Transaction...' : `Add ₹${amount} to Wallet`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
