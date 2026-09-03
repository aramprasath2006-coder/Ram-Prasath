import React, { useState, useEffect } from 'react';
import { useStudentAuth } from '../../context/StudentAuthContext';
import {
  generateUniqueStudentId,
  validateStudentIdFormat,
  StudentIdFormat,
  DEPARTMENT_CODES
} from '../../utils/studentIdGenerator';
import {
  UserPlus,
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
  Sparkles,
  Lock,
  ArrowRight,
  Info,
  RefreshCw,
  Copy,
  Check,
  UserCheck
} from 'lucide-react';
import { CandidatePhotoPicker } from '../CandidatePhotoPicker';

interface EnrollStudentModalProps {
  isOpen: boolean;
  initialRollNo?: string;
  initialName?: string;
  onClose: () => void;
  onSuccess?: (studentName: string, rollNo: string) => void;
}

export const EnrollStudentModal: React.FC<EnrollStudentModalProps> = ({
  isOpen,
  initialRollNo,
  initialName,
  onClose,
  onSuccess
}) => {
  const { enrollNewStudent, registeredStudents } = useStudentAuth();

  const existingRollNos = registeredStudents.map(s => s.rollNo);

  const [name, setName] = useState(initialName || '');
  const [selectedFormat, setSelectedFormat] = useState<StudentIdFormat>('ACADEMIC_ROLL');
  const [department, setDepartment] = useState('Dept of Computer Science & Engineering');
  const [batch, setBatch] = useState('Computer Science 2026');
  
  const [rollNo, setRollNo] = useState(() => {
    if (initialRollNo) return initialRollNo;
    return generateUniqueStudentId(existingRollNos, {
      departmentCode: 'CS',
      batchYear: 2026,
      format: 'ACADEMIC_ROLL'
    });
  });

  const [loginId, setLoginId] = useState('');
  const [phone, setPhone] = useState('+91 9');
  const [parentContact, setParentContact] = useState('+91 9');
  const [dob, setDob] = useState('15/08/2004');
  const [dobPassword, setDobPassword] = useState('15082004');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initial props if modal re-opens
  useEffect(() => {
    if (isOpen) {
      if (initialName) setName(initialName);
      if (initialRollNo) {
        setRollNo(initialRollNo);
      } else {
        const generated = generateUniqueStudentId(existingRollNos, {
          departmentCode: DEPARTMENT_CODES[department] || 'CS',
          batchYear: 2026,
          format: selectedFormat
        });
        setRollNo(generated);
      }
    }
  }, [isOpen, initialName, initialRollNo]);

  if (!isOpen) return null;

  // Validation of currently typed/generated ID
  const idValidation = validateStudentIdFormat(rollNo, existingRollNos);

  const handleGenerateNewId = (fmt: StudentIdFormat = selectedFormat) => {
    setIsGenerating(true);
    setTimeout(() => {
      const deptCode = DEPARTMENT_CODES[department] || 'CS';
      const newId = generateUniqueStudentId(existingRollNos, {
        departmentCode: deptCode,
        batchYear: 2026,
        format: fmt
      });
      setRollNo(newId);
      setIsGenerating(false);
    }, 150);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(rollNo);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Auto-generate suggested login ID when name changes if user hasn't explicitly customized
  const handleNameChange = (val: string) => {
    setName(val);
    const firstName = val.trim().split(' ')[0]?.toLowerCase() || '';
    if (firstName && (!loginId || loginId.endsWith('@edu.in'))) {
      setLoginId(`${firstName}@edu.in`);
    }
  };

  const handleDobChange = (val: string) => {
    setDob(val);
    const digits = val.replace(/[^0-9]/g, '');
    if (digits.length >= 8) {
      setDobPassword(digits);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const result = enrollNewStudent({
        name,
        rollNo,
        loginId,
        phone,
        parentContact,
        dob,
        dobPassword: dobPassword || dob.replace(/[^0-9]/g, ''),
        batch,
        department,
        avatar
      });

      setIsSubmitting(false);

      if (result.success && result.student) {
        if (onSuccess) onSuccess(result.student.name, result.student.rollNo);
        onClose();
      } else {
        setErrorMessage(result.error || 'Failed to enroll student. Please check input parameters.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c0c18] border border-indigo-500/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-indigo-950/60 flex flex-col relative max-h-[92vh]">
        {/* Glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 relative z-10 flex items-start justify-between bg-gradient-to-r from-indigo-950/70 to-purple-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white border border-indigo-400/40 shadow-lg shrink-0">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-serif-academy">
                  Enroll New Student (Admin Authority)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate official Student ID, Roll Number, and register login credentials
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
        <div className="px-6 py-3 bg-indigo-500/10 border-b border-indigo-500/20 flex items-center gap-2.5 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Institutional Policy:</strong> Only authorized Academic Administrators can create new Student IDs or enroll university roll numbers.
          </span>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 relative z-10 flex-1">
          {/* Candidate Photo Picker Component */}
          <CandidatePhotoPicker
            photoUrl={avatar}
            onChange={(newPhoto) => setAvatar(newPhoto)}
            candidateName={name || 'Student Candidate'}
            label="Candidate Passport Photo (for Academic ID & Certificate)"
            required={true}
          />

          {/* Row 1: Full Name & Roll Number with Generator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>Student Full Name</span>
                <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Samir Kulkarni"
                required
                className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Unique Student ID / Roll</span>
                  <span className="text-rose-400">*</span>
                </label>
                
                {/* Real-time Uniqueness Validation Badge */}
                {idValidation.isValid && idValidation.isUnique ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Unique & Valid</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                    <AlertCircle className="w-3 h-3" />
                    <span>{idValidation.error || 'Duplicate ID'}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                  placeholder="e.g. 26CS0245"
                  required
                  className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all"
                />

                <button
                  type="button"
                  onClick={() => handleGenerateNewId()}
                  className={`px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0 transition-all active:scale-95 border border-indigo-400/40 ${
                    isGenerating ? 'opacity-70' : ''
                  }`}
                  title="Generate Collision-Free Unique Student ID"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Generate</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors shrink-0"
                  title="Copy ID"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Quick Format Picker */}
              <div className="flex items-center gap-1.5 pt-0.5 overflow-x-auto pb-1 text-[10px]">
                <span className="text-slate-500 font-semibold shrink-0">Format:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFormat('ACADEMIC_ROLL');
                    handleGenerateNewId('ACADEMIC_ROLL');
                  }}
                  className={`px-2 py-0.5 rounded-md font-mono transition-colors shrink-0 ${
                    selectedFormat === 'ACADEMIC_ROLL'
                      ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Academic (26CS0XXX)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFormat('SECURE_ALPHA_NUMERIC');
                    handleGenerateNewId('SECURE_ALPHA_NUMERIC');
                  }}
                  className={`px-2 py-0.5 rounded-md font-mono transition-colors shrink-0 ${
                    selectedFormat === 'SECURE_ALPHA_NUMERIC'
                      ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Token (STU-2026-XXXX)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFormat('CAMPUS_SMART_ID');
                    handleGenerateNewId('CAMPUS_SMART_ID');
                  }}
                  className={`px-2 py-0.5 rounded-md font-mono transition-colors shrink-0 ${
                    selectedFormat === 'CAMPUS_SMART_ID'
                      ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Smart ID (EDU-2026-CS-XXXX)
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Official @edu.in Login ID */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Official Student Login ID</span>
                <span className="text-rose-400">*</span>
              </label>
              <span className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                Must end with @edu.in
              </span>
            </div>
            <input
              type="text"
              value={loginId}
              onChange={(e) => {
                setLoginId(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="e.g. samir@edu.in"
              required
              className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all"
            />
            <p className="text-[11px] text-slate-400">
              Students log into tests and portals with this ID. Personal email addresses (@gmail, etc.) are strictly rejected.
            </p>
          </div>

          {/* Row 3: Mobile Number & Parent Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Registered Mobile No (for OTP Pass Reset)</span>
                <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full bg-white/[0.05] border border-white/15 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all"
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
                placeholder="+91 98765 00000"
                className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 4: Date of Birth & Initial Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Date of Birth (Display Format)</span>
                <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={dob}
                onChange={(e) => handleDobChange(e.target.value)}
                placeholder="15/08/2004"
                required
                className="w-full bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>Initial Password (DOB DDMMYYYY)</span>
                <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={dobPassword}
                onChange={(e) => setDobPassword(e.target.value)}
                placeholder="15082004"
                required
                className="w-full bg-white/[0.05] border border-white/15 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all"
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
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Enrolling Student Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Generate ID & Enroll Student</span>
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
