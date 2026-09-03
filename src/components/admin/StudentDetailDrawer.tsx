import React, { useState } from 'react';
import { StudentAttendance } from '../../types';
import { EditStudentIdModal } from './EditStudentIdModal';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Laptop, 
  Wifi, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  BookOpen, 
  Award, 
  Activity, 
  Sparkles,
  Smartphone,
  ExternalLink,
  Edit3,
  KeyRound
} from 'lucide-react';

interface StudentDetailDrawerProps {
  student: StudentAttendance | null;
  onClose: () => void;
  onStatusChange: (studentId: string, newStatus: StudentAttendance['attendanceStatus']) => void;
  onStudentUpdated?: (studentName: string, newRollNo: string) => void;
}

export const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({
  student,
  onClose,
  onStatusChange,
  onStudentUpdated
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!student) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
        <div className="bg-[#0c0c18] border-l border-white/10 w-full max-w-xl h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300 relative">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Drawer Header */}
          <div className="p-5 sm:p-6 bg-[#070710] border-b border-white/10 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
                />
                {student.isOnline && (
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#070710] animate-pulse" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white font-serif-academy">{student.name}</h3>
                  <span className="font-mono text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                    {student.rollNo}
                  </span>
                </div>
                <p className="text-xs text-indigo-300 font-medium">{student.batch}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="Admin: Edit Student ID, Roll No, and Login info"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit ID</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 relative z-10 text-slate-200">
            {/* Identity & Admin ID Management Banner */}
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Official Student Identity
                </span>
                <p className="text-xs text-slate-300 font-mono">
                  Login ID: <strong className="text-white">{student.loginId || `${student.name.split(' ')[0].toLowerCase()}@edu.in`}</strong> • Roll: <strong className="text-amber-300">{student.rollNo}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shrink-0 transition-all flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Modify ID</span>
              </button>
            </div>

            {/* Today's Login & Attendance Status Overview Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Today's Login Status
                </span>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
                  student.hasLoggedInToday
                    ? student.isOnline
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {student.hasLoggedInToday 
                    ? student.isOnline ? '● Logged In (Online Now)' : '✓ Logged In Today'
                    : '✕ No Login Recorded Today'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[11px] text-slate-400 block font-medium">First Login Time</span>
                  <span className="text-sm font-bold text-white font-mono mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    {student.todayLoginTime || 'Not Logged In'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[11px] text-slate-400 block font-medium">Attendance Status</span>
                  <span className={`text-sm font-bold mt-0.5 flex items-center gap-1.5 ${
                    student.attendanceStatus === 'Present' ? 'text-emerald-400' :
                    student.attendanceStatus === 'Late' ? 'text-amber-400' :
                    student.attendanceStatus === 'Excused' ? 'text-blue-400' : 'text-rose-400'
                  }`}>
                    {student.attendanceStatus === 'Present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {student.attendanceStatus === 'Late' && <AlertTriangle className="w-3.5 h-3.5" />}
                    {student.attendanceStatus === 'Absent' && <XCircle className="w-3.5 h-3.5" />}
                    {student.attendanceStatus}
                  </span>
                </div>
              </div>

              {/* Quick Status Override Buttons for Admin */}
              <div className="pt-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Faculty Status Override
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Present', 'Late', 'Absent', 'Excused'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => onStatusChange(student.id, st)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                        student.attendanceStatus === st
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
            </div>

            {/* Session Diagnostics & Location Tracking */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Session & Device Diagnostics
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-slate-500" /> Client Device
                  </span>
                  <span className="font-medium text-white text-right max-w-[220px] truncate">
                    {student.deviceInfo}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-slate-500" /> IP & Network Point
                  </span>
                  <span className="font-mono text-white text-right max-w-[220px] truncate">
                    {student.ipAddress}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> Check-in Verification
                  </span>
                  <span className="font-medium text-emerald-400 text-right">
                    {student.verificationMethod || 'N/A'} ({student.location})
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-slate-500" /> Today's Learning Time
                  </span>
                  <span className="font-bold text-indigo-300">{student.studyHoursToday} Hours logged</span>
                </div>
              </div>
            </div>

            {/* Academic Attendance Cumulative Progress */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Semester Attendance Record
                </h4>
                <span className="text-sm font-black text-emerald-400 font-mono">
                  {student.overallAttendancePct}%
                </span>
              </div>

              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    student.overallAttendancePct >= 85 ? 'bg-emerald-500' :
                    student.overallAttendancePct >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${student.overallAttendancePct}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>{student.totalAttended} Attended</span>
                <span>{student.totalClasses - student.totalAttended} Missed</span>
                <span>{student.totalClasses} Total Sessions</span>
              </div>
            </div>

            {/* Activity History Timeline */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Session Audit Trail
              </h4>

              <div className="space-y-3 pt-1">
                {student.activityHistory.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <span className="font-mono text-indigo-400 shrink-0 text-[11px]">{item.time}</span>
                    <div className="flex-1">
                      <p className="text-slate-200 font-medium">{item.action}</p>
                      {item.details && <p className="text-[11px] text-slate-500 mt-0.5">{item.details}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Details & Registered Mobile */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-white/5">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Registered Contacts
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Mobile OTP Enabled
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-mono">{student.email}</span>
              </div>
              {student.phone && (
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mobile: <strong className="font-mono text-white">{student.phone}</strong></span>
                  </div>
                  <span className="text-[10px] text-slate-400">Password Reset Phone</span>
                </div>
              )}
              {student.parentContact && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Parent / Guardian: {student.parentContact}</span>
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-[#070710] border-t border-white/10 flex items-center justify-between gap-2 relative z-10">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Student Identity</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>

      {/* Edit Student Identity Modal */}
      <EditStudentIdModal
        isOpen={isEditModalOpen}
        student={student}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={(updatedName, newRoll) => {
          if (onStudentUpdated) onStudentUpdated(updatedName, newRoll);
        }}
      />
    </>
  );
};

