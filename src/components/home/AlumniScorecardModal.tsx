import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  FileText, 
  Calendar, 
  Building2,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { ExamAchiever } from '../../data/mockAcademicAchievers';

interface AlumniScorecardModalProps {
  achiever: ExamAchiever | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestMentorship?: (achiever: ExamAchiever) => void;
}

export const AlumniScorecardModal: React.FC<AlumniScorecardModalProps> = ({
  achiever,
  isOpen,
  onClose,
  onRequestMentorship
}) => {
  const [copiedRoll, setCopiedRoll] = useState(false);

  if (!isOpen || !achiever) return null;

  const handleCopyRoll = () => {
    navigator.clipboard.writeText(achiever.rollNo);
    setCopiedRoll(true);
    setTimeout(() => setCopiedRoll(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c0c1a] border border-indigo-500/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl shadow-indigo-950/70 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-[#0c0c1a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Verified Academic Scorecard &amp; Audit</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">Institutional Registry Document ID: AUD-{achiever.rollNo}-2026</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Verified Certificate Document Style */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Certificate Banner Card */}
          <div className="bg-gradient-to-b from-[#14122e] to-[#0d0c1e] border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden text-center shadow-lg">
            <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Institutional Honor Roll</span>
            </div>

            <div className="w-20 h-20 rounded-2xl mx-auto overflow-hidden border-2 border-amber-500/50 shadow-xl mb-3">
              <img src={achiever.avatar} alt={achiever.name} className="w-full h-full object-cover" />
            </div>

            <h4 className="text-xl font-black text-white">{achiever.name}</h4>
            <p className="text-xs text-indigo-300 font-semibold mt-0.5">{achiever.department}</p>
            
            <div className="mt-3 inline-block px-4 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/40 font-mono text-sm font-black tracking-wide">
              {achiever.rankOrScore}
            </div>

            <div className="mt-2 text-xs text-slate-300 font-medium">
              Examination: <strong className="text-white">{achiever.examName}</strong> • Batch of {achiever.batchYear}
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 font-semibold">University Roll Number</span>
              <div className="flex items-center justify-between font-mono font-bold text-white text-sm">
                <span>{achiever.rollNo}</span>
                <button
                  onClick={handleCopyRoll}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title="Copy Roll Number"
                >
                  {copiedRoll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 font-semibold">Current Official Posting</span>
              <p className="font-bold text-emerald-300 text-xs leading-snug">{achiever.currentPosting}</p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 font-semibold">Preparation Duration</span>
              <p className="font-bold text-white text-sm">{achiever.preparationDuration}</p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 font-semibold">Verification Standard</span>
              <p className="font-bold text-indigo-300 text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Scorecard &amp; Gazette Verified
              </p>
            </div>
          </div>

          {/* Key Subject Mastery */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Core Examination Subjects Mastered</span>
            </h5>
            <div className="flex flex-wrap gap-2">
              {achiever.keySubjects.map((sub, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="bg-black/30 border-l-4 border-indigo-500 p-4 rounded-r-2xl text-xs text-slate-300 italic leading-relaxed">
            "{achiever.quote}"
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authenticated by Institutional Exam Cell</span>
          </div>

          <div className="flex items-center gap-2">
            {onRequestMentorship && (
              <button
                onClick={() => {
                  onRequestMentorship(achiever);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Request Mentorship Session
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
