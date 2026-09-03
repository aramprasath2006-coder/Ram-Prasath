import React, { useState } from 'react';
import { StudentAttendance } from '../../types';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  MapPin, 
  FileText, 
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Search,
  AlertCircle
} from 'lucide-react';

interface ManualAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentAttendance[];
  onAddManualRecord: (
    studentId: string, 
    status: StudentAttendance['attendanceStatus'], 
    time: string, 
    reason: string
  ) => void;
}

export const ManualAttendanceModal: React.FC<ManualAttendanceModalProps> = ({
  isOpen,
  onClose,
  students,
  onAddManualRecord
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [searchStudentTerm, setSearchStudentTerm] = useState<string>('');
  const [status, setStatus] = useState<StudentAttendance['attendanceStatus']>('Present');
  const [time, setTime] = useState<string>(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  const [reason, setReason] = useState<string>('Faculty In-Person Verification');
  const [facultyNote, setFacultyNote] = useState<string>('Admin Office manual check-in override');

  if (!isOpen) return null;

  const filteredStudentOptions = students.filter((s) => 
    s.name.toLowerCase().includes(searchStudentTerm.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchStudentTerm.toLowerCase()) ||
    s.batch.toLowerCase().includes(searchStudentTerm.toLowerCase())
  );

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    const finalReason = `${reason}${facultyNote ? ` (${facultyNote})` : ''}`;
    onAddManualRecord(selectedStudentId, status, time, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0c0c18] border border-indigo-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 text-white relative shadow-2xl overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-1">
              Admin-Only Authority
            </div>
            <h3 className="text-xl font-bold text-white font-serif-academy">
              Put Manual Attendance
            </h3>
            <p className="text-xs text-slate-400">
              Direct faculty intervention to log attendance status and override audit logs.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search / Select Student */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Select Student ({students.length} in Roster)
              </label>
              {selectedStudent && (
                <span className="text-[11px] text-indigo-400 font-mono">
                  Current: {selectedStudent.attendanceStatus}
                </span>
              )}
            </div>

            {/* Quick search input */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchStudentTerm}
                onChange={(e) => setSearchStudentTerm(e.target.value)}
                placeholder="Filter by name, roll number, or batch..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="relative">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-indigo-500 appearance-none"
                required
              >
                {filteredStudentOptions.map((st, idx) => (
                  <option key={`${st.id}-${st.rollNo || idx}`} value={st.id} className="bg-[#0c0c18] text-white">
                    {st.name} ({st.rollNo}) — {st.batch} [{st.attendanceStatus}]
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Status Selection Buttons */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              New Attendance Status
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Present', 'Late', 'Excused', 'Absent'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-all text-center ${
                    status === st
                      ? st === 'Present'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/30'
                        : st === 'Late'
                        ? 'bg-amber-600 text-white border-amber-400 shadow-md ring-2 ring-amber-500/30'
                        : st === 'Excused'
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-500/30'
                        : 'bg-rose-600 text-white border-rose-400 shadow-md ring-2 ring-rose-500/30'
                      : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Timestamp
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. 09:00 AM"
                  required
                />
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Verification Mode
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="Faculty In-Person Verification" className="bg-[#0c0c18]">Faculty In-Person Check</option>
                <option value="Biometric Scanner Bypass" className="bg-[#0c0c18]">Scanner Scanner Bypass</option>
                <option value="Medical Exemption / Slip" className="bg-[#0c0c18]">Medical Exemption / Slip</option>
                <option value="Institutional Field Work" className="bg-[#0c0c18]">Institutional Field Work</option>
                <option value="Lab Session Roll Call" className="bg-[#0c0c18]">Lab Session Roll Call</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              Faculty Justification Note
            </label>
            <input
              type="text"
              value={facultyNote}
              onChange={(e) => setFacultyNote(e.target.value)}
              placeholder="e.g. Approved by Dr. Sarah Vance (Department Head)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
            <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              Logs recorded with Admin Signature
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/60 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Save Manual Attendance</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

