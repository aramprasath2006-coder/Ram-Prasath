import React, { useState } from 'react';
import { StudentAttendance } from '../../types';
import { 
  Send, 
  Bell, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Smartphone, 
  Mail, 
  Users,
  Sparkles
} from 'lucide-react';

interface BroadcastAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  absentStudents: StudentAttendance[];
  onBroadcastSent: (message: string, recipientCount: number) => void;
}

const TEMPLATES = [
  {
    title: 'Daily Absence Notice',
    message: 'Dear Student, you have not logged in or verified attendance for today\'s academic sessions yet. Please check in via ASCEND STALTECH INDIAA portal or contact your faculty coordinator immediately.'
  },
  {
    title: 'Lecture in Progress Alert',
    message: 'Important Notice: Today\'s scheduled core lectures are live now. Your attendance has not been registered. Kindly join your lecture or submit an authorized medical leave.'
  },
  {
    title: 'Attendance Warning (Below 80%)',
    message: 'Academic Alert: Your cumulative attendance has dropped near critical limits. Daily login and active class participation are mandatory for semester exam eligibility.'
  }
];

export const BroadcastAlertModal: React.FC<BroadcastAlertModalProps> = ({
  isOpen,
  onClose,
  absentStudents,
  onBroadcastSent
}) => {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [customMessage, setCustomMessage] = useState<string>(TEMPLATES[0].message);
  const [channel, setChannel] = useState<'all' | 'sms' | 'app'>('all');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      onBroadcastSent(customMessage, absentStudents.length);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0c0c18] border border-amber-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-7 text-white relative shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-serif-academy">
              Broadcast Absence Alert
            </h3>
            <p className="text-xs text-slate-400">
              Notify <span className="text-amber-400 font-bold">{absentStudents.length} students</span> who have not logged in or checked in today.
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3 animate-in zoom-in duration-200">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">Broadcast Dispatched Successfully!</h4>
            <p className="text-xs text-slate-400">
              SMS and ASCEND STALTECH INDIAA push alerts delivered to {absentStudents.length} recipients.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Target Recipient Preview */}
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Targeted Absent Roster:</span>
              </div>
              <span className="font-bold text-amber-400">{absentStudents.length} Unchecked Students</span>
            </div>

            {/* Quick Templates */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Select Message Template
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={tmpl.title}
                    type="button"
                    onClick={() => {
                      setSelectedTemplateIndex(idx);
                      setCustomMessage(tmpl.message);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      selectedTemplateIndex === idx
                        ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                        : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tmpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Message Field */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Message Content
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl bg-white/[0.05] border border-white/15 text-white text-xs font-sans leading-relaxed focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Broadcast Channels */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">Channel:</span>
              <button
                type="button"
                onClick={() => setChannel('all')}
                className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all ${
                  channel === 'all' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-white/5 text-slate-400 border-white/10'
                }`}
              >
                SMS + Push Notification + Parent Copy
              </button>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={isSending || absentStudents.length === 0}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-950/60 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSending ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Immediate Broadcast</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
