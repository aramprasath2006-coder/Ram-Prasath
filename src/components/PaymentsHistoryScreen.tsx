import React, { useState } from 'react';
import { Transaction, ActiveScreen } from '../types';
import { ArrowLeft, Plus, HelpCircle, Filter, ArrowUpRight, ArrowDownLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PaymentsHistoryScreenProps {
  transactions: Transaction[];
  credits: number;
  onBack: () => void;
  onOpenAddFunds: () => void;
  onViewReceipt: (tx: Transaction) => void;
}

export const PaymentsHistoryScreen: React.FC<PaymentsHistoryScreenProps> = ({
  transactions,
  credits,
  onBack,
  onOpenAddFunds,
  onViewReceipt
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'purchases' | 'refunds'>('all');

  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilter === 'purchases') return tx.type === 'purchase';
    if (activeFilter === 'refunds') return tx.type === 'refund' || tx.type === 'fund_added';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050508] immersive-bg text-slate-200 flex flex-col pb-20 animate-in fade-in duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c18]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-all border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-white">Payments & History</h1>
        </div>

        <button 
          onClick={() => alert('Support helpline: billing@eduflow.edu or +91 (800) 425-3388')}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors border border-white/10"
          title="Payment Support"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Balance Card (Rich Navy/Indigo Background with Add Funds) */}
        <section className="bg-gradient-to-br from-indigo-950 via-[#0c0c18] to-purple-950 border border-indigo-500/30 text-white rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="absolute right-[-40px] top-[-40px] w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Available Credits Balance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {credits.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-emerald-400">Credits</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">1 Credit = ₹1.00 Value for course enrollments</p>
          </div>

          <button
            onClick={onOpenAddFunds}
            className="relative z-10 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg hover:from-emerald-400 hover:to-teal-300 transition-all flex items-center gap-2 active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Funds</span>
          </button>
        </section>

        {/* Filter Chips */}
        <section className="flex gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/40 border border-indigo-400/30'
                : 'bg-white/[0.06] border border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setActiveFilter('purchases')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'purchases'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/40 border border-indigo-400/30'
                : 'bg-white/[0.06] border border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            Purchases
          </button>
          <button
            onClick={() => setActiveFilter('refunds')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'refunds'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/40 border border-indigo-400/30'
                : 'bg-white/[0.06] border border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            Refunds & Credits
          </button>
        </section>

        {/* Transactions List */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 px-1">
            Transaction Activity
          </h2>

          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => onViewReceipt(tx)}
              className="bg-[#0c0c18]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg shadow-black/20 hover:border-indigo-500/40 hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  tx.status === 'failed'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : tx.amount > 0
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  <span className="material-symbols-outlined text-[22px]">
                    {tx.icon || 'receipt_long'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {tx.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{tx.date}</p>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                <span className={`text-sm sm:text-base font-bold ${
                  tx.status === 'failed'
                    ? 'text-slate-500 line-through'
                    : tx.amount > 0
                    ? 'text-emerald-400'
                    : 'text-white'
                }`}>
                  {tx.amount > 0 ? `+₹${tx.amount}.00` : `-₹${Math.abs(tx.amount)}.00`}
                </span>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tx.status === 'success'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {tx.status === 'success' ? 'Success' : 'Failed'}
                </span>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};
