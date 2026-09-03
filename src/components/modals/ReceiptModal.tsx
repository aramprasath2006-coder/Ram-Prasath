import React from 'react';
import { Transaction } from '../../types';
import { X, Download, Printer, CheckCircle2, ShieldCheck, GraduationCap } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  amount?: number;
  txnId?: string;
  courseTitle?: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
  amount = 499,
  txnId = 'TXN-847291A',
  courseTitle = 'Advanced Calculus - Integration Techniques'
}) => {
  if (!isOpen) return null;

  const displayAmount = transaction ? Math.abs(transaction.amount) : amount;
  const displayTitle = transaction ? transaction.title : courseTitle;
  const displayTxnId = transaction ? transaction.id : txnId;
  const displayDate = transaction ? transaction.date : 'Oct 24, 2023 • 10:30 AM';

  const subtotal = Math.round(displayAmount / 1.18 * 100) / 100;
  const gst = Math.round((displayAmount - subtotal) * 100) / 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#0c0c18] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-white/10 flex flex-col">
        {/* Header */}
        <div className="bg-[#070710] border-b border-white/10 px-5 py-3.5 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm sm:text-base font-serif-academy">Official Payment Receipt</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-200">
          <div className="text-center pb-3 border-b border-white/10">
            <h4 className="text-lg font-bold text-white font-serif-academy">ASCEND STALTECH INDIAA Academic Services</h4>
            <p className="text-xs text-slate-400">Tax Invoice & Course Enrollment Receipt</p>
            <span className="inline-block mt-2 font-mono text-[11px] bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded font-bold">
              ID: {displayTxnId}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block">Billed To:</span>
              <span className="font-bold text-white">Alex Johnson</span>
              <span className="text-slate-400 block font-mono">#EF-2023-8942</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Date & Time:</span>
              <span className="font-bold text-white">{displayDate}</span>
            </div>
          </div>

          <div className="border border-white/10 rounded-xl p-3 bg-white/[0.04] space-y-2">
            <div className="flex justify-between font-bold text-white">
              <span>{displayTitle}</span>
              <span>₹{displayAmount}.00</span>
            </div>
            <hr className="border-white/10" />
            <div className="flex justify-between text-slate-400">
              <span>Subtotal (Base Fee)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>GST @ 18%</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <hr className="border-white/10" />
            <div className="flex justify-between text-base font-bold text-emerald-400">
              <span>Total Paid</span>
              <span>₹{displayAmount}.00</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/20 border border-emerald-500/30 p-2 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Tax Invoice • GSTIN: 29AAACE9482L1Z5</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-[#070710] border-t border-white/10 flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white/10 border border-white/10 text-slate-300 font-semibold text-xs rounded-xl hover:bg-white/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
