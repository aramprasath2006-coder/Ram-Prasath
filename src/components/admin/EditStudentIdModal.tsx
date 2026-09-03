import React, { useState, useEffect } from 'react';
import { useStudentAuth } from '../../context/StudentAuthContext';
import { StudentAttendance } from '../../types';
import {
  generateUniqueStudentId,
  validateStudentIdFormat,
  DEPARTMENT_CODES,
  StudentIdFormat
} from '../../utils/studentIdGenerator';
import {
  Edit3,
  ShieldCheck,
  Mail,
  Smartphone,
  Calendar,
  KeyRound,
  School,
  Building,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  ArrowRight,
  User,
  Hash,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface EditStudentIdModalProps {
  isOpen: boolean;
  student: StudentAttendance | null;
  onClose: () => void;
  onSuccess?: (studentName: string, newRollNo: string) => void;
}

export const EditStudentIdModal: React.FC<EditStudentIdModalProps> = ({
  isOpen,
  student,
  onClose,
  onSuccess
}) => {
  const { updateStudentIdentity, registeredStudents } = useStudentAuth();

  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [loginId, setLoginId] = useState('');
  const [phone, setPhone] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [dob, setDob] = useState('');
  const [dobPassword, setDobPassword] = useState('');
  const [batch, setBatch] = useState('');
  const [department, setDepartment] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const existingRollNos = registeredStudents.map(s => s.rollNo);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student && isOpen) {
      setName(student.name || '');
      setRollNo(student.rollNo || '');
      setLoginId(student.loginId || `${student.name.split(' ')[0].toLowerCase()}@edu.in`);
      setPhone(student.phone || '+91 98765 43210');
      setParentContact(student.parentContact || '+91 98765 43200');
      setDob(student.dob || '15/08/2004');
      setDobPassword(student.dobPassword || '15082004');
      setBatch(student.batch || 'Computer Science 2026');
      setDepartment(student.department || 'Dept of Computer Science & Engineering');
      setErrorMessage(null);
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  // Validation
  const idValidation = validateStudentIdFormat(rollNo, existingRollNos, student.rollNo);

  const handleGenerateNewRoll = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const deptCode = DEPARTMENT_CODES[department] || 'CS';
      const newId = generateUniqueStudentId(existingRollNos, {
        departmentCode: deptCode,
        batchYear: 2026,
        format: 'ACADEMIC_ROLL'
      });
      setRollNo(newId);
      setIsGenerating(false);
    }, 150);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const result = updateStudentIdentity(student.id, {
        name,
        rollNo,
        loginId,
        phone,
        parentContact,
        dob,
        dobPassword,
        batch,
        department
      });

      setIsSubmitting(false);

      if (result.success && result.student) {
        if (onSuccess) onSuccess(result.student.name, result.student.rollNo);
        onClose();
      } else {
        setErrorMessage(result.error || 'Failed to update student identity. Please verify inputs.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c0c18] border border-indigo-500/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-indigo-950/60 flex flex-col relative max-h-[92vh]">
        {/* Glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 relative z-10 flex items-start justify-between bg-gradient-to-r from-slate-900 via-indigo-950/70 to-purple-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-indigo-600 flex items-center justify-center text-white border border-amber-400/40 shadow-lg shrink-0">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-serif-academy">
                  Modify Student ID & Identity
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Admin Authority
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Account: <strong className="text-white">{student.name}</strong> ({student.id})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Policy Alert */}
        <div className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2.5 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Admin Privilege:</strong> Modifications to Student IDs and Roll Numbers immediately update SSO login gateways and campus biometric registers.
          </span>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 relative z-10 flex-1">
          {/* Row 1: Full Name & Roll Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Student Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-amber-400" />
                  <span>University Roll Number (ID)</span>
                </label>
                {idValidation.isValid && idValidation.isUnique ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Unique</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                    <AlertCircle className="w-3 h-3" />
                    <span>{idValidation.error || 'Duplicate'}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                  required
                  className="w-full bg-white/[0.05] border border-amber-500/40 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm font-mono text-amber-200 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handleGenerateNewRoll}
                  className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shrink-0 transition-all active:scale-95"
                  title="Generate New Unique Roll Number"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Generate</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Official @edu.in Login ID */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Official Student Login ID (@edu.in)</span>
              </label>
              <span className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                Institutional SSO
              </span>
            </div>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
              className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none transition-all"
            />
          </div>

          {/* Row 3: Mobile Number & Parent Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Registered Mobile Number (for Student OTP Reset)</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-white/[0.05] border border-white/15 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-emerald-200 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                <span>Parent / Guardian Contact</span>
              </label>
              <input
                type="text"
                value={parentContact}
                onChange={(e) => setParentContact(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 4: Date of Birth & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Date of Birth</span>
              </label>
              <input
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>Institutional Password (DOB)</span>
              </label>
              <input
                type="text"
                value={dobPassword}
                onChange={(e) => setDobPassword(e.target.value)}
                required
                className="w-full bg-white/[0.05] border border-white/15 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-emerald-200 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 5: Batch & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-indigo-400" />
                <span>Academic Batch</span>
              </label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full bg-[#101020] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              >
                <option value="Computer Science 2026">Computer Science 2026</option>
                <option value="GATE Mechanical Elite">GATE Mechanical Elite</option>
                <option value="Applied Mathematics">Applied Mathematics</option>
                <option value="UPSC Prelims Batch">UPSC Prelims Batch</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                <span>Department</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#101020] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              >
                <option value="Dept of Computer Science & Engineering">Dept of Computer Science & Engineering</option>
                <option value="Dept of Mechanical Engineering">Dept of Mechanical Engineering</option>
                <option value="Dept of Mathematics & Computing">Dept of Mathematics & Computing</option>
                <option value="Civil Services Academy">Civil Services Academy</option>
              </select>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-xl font-bold text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-600 via-indigo-600 to-purple-600 hover:from-amber-500 hover:to-indigo-500 text-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving ID Changes...</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Apply ID & Identity Updates</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
