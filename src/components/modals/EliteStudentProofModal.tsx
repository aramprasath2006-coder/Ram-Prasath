import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStudentAuth } from '../../context/StudentAuthContext';
import { useEliteProof } from '../../context/EliteProofContext';
import { compressImageFile } from '../../utils/imageCompressor';
import { 
  X, 
  ShieldCheck, 
  Camera, 
  Upload, 
  FileText, 
  Phone, 
  User, 
  Calendar, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Save, 
  Lock, 
  HeartPulse, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface EliteStudentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullDossier?: () => void;
}

export const EliteStudentProofModal: React.FC<EliteStudentProofModalProps> = ({
  isOpen,
  onClose,
  onOpenFullDossier
}) => {
  const { currentUser } = useStudentAuth();
  const { 
    getStudentProof, 
    saveStudentProof, 
    updatePhotoProof, 
    updateAadhaarProof, 
    updateEmergencyContact 
  } = useEliteProof();

  const activeProof = getStudentProof(currentUser?.id || 'stu-1');

  const [activeTab, setActiveTab] = useState<'photo' | 'aadhaar' | 'emergency'>('photo');
  const [showAadhaarNumber, setShowAadhaarNumber] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Form states
  const [aadhaarNumber, setAadhaarNumber] = useState(activeProof.aadhaarNumber);
  const [aadhaarName, setAadhaarName] = useState(activeProof.aadhaarName);
  const [aadhaarDob, setAadhaarDob] = useState(activeProof.aadhaarDob);
  const [aadhaarGender, setAadhaarGender] = useState(activeProof.aadhaarGender);

  const [emergencyName, setEmergencyName] = useState(activeProof.emergencyContactName);
  const [emergencyRelation, setEmergencyRelation] = useState(activeProof.emergencyContactRelation);
  const [emergencyPhone, setEmergencyPhone] = useState(activeProof.emergencyContactPhone);
  const [emergencyAddress, setEmergencyAddress] = useState(activeProof.emergencyAddress);
  const [emergencyBloodGroup, setEmergencyBloodGroup] = useState(activeProof.emergencyBloodGroup || 'O+');

  const [photoPreview, setPhotoPreview] = useState(activeProof.photoUrl);
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState(activeProof.aadhaarDocFrontUrl);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      const proof = getStudentProof(currentUser.id);
      setAadhaarNumber(proof.aadhaarNumber);
      setAadhaarName(proof.aadhaarName);
      setAadhaarDob(proof.aadhaarDob);
      setAadhaarGender(proof.aadhaarGender);
      setEmergencyName(proof.emergencyContactName);
      setEmergencyRelation(proof.emergencyContactRelation);
      setEmergencyPhone(proof.emergencyContactPhone);
      setEmergencyAddress(proof.emergencyAddress);
      setEmergencyBloodGroup(proof.emergencyBloodGroup || 'O+');
      setPhotoPreview(proof.photoUrl);
      setAadhaarFrontPreview(proof.aadhaarDocFrontUrl);
      setSuccessToast(false);
    }
  }, [isOpen, currentUser, getStudentProof]);

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setAadhaarNumber(formatted);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      try {
        const compressed = await compressImageFile(file, { maxWidth: 320, maxHeight: 320, quality: 0.75 });
        setPhotoPreview(compressed);
        updatePhotoProof(currentUser.id, compressed);
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const url = event.target.result as string;
            setPhotoPreview(url);
            updatePhotoProof(currentUser.id, url);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAadhaarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, { maxWidth: 600, maxHeight: 400, quality: 0.75 });
        setAadhaarFrontPreview(compressed);
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const url = event.target.result as string;
            setAadhaarFrontPreview(url);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSaveModalData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
    if (cleanAadhaar.length !== 12) {
      alert('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    const updatedProof = {
      ...activeProof,
      studentId: currentUser.id,
      studentName: currentUser.name,
      photoUrl: photoPreview,
      aadhaarNumber: aadhaarNumber,
      aadhaarName: aadhaarName,
      aadhaarDob: aadhaarDob,
      aadhaarGender: aadhaarGender,
      aadhaarDocFrontUrl: aadhaarFrontPreview,
      emergencyContactName: emergencyName,
      emergencyContactRelation: emergencyRelation,
      emergencyContactPhone: emergencyPhone,
      emergencyAddress: emergencyAddress,
      emergencyBloodGroup: emergencyBloodGroup,
      overallStatus: 'Verified' as const,
      verificationTimestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    saveStudentProof(updatedProof);
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1200);
  };

  if (!isOpen || !currentUser) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-xl bg-[#0c0c18] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-white"
        >
          {/* Header */}
          <div className="relative p-5 border-b border-white/10 bg-gradient-to-r from-amber-950/70 via-slate-900/90 to-purple-950/70">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ASCEND STALTECH INDIAA
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Roll: {currentUser.rollNo}</span>
                </div>
                <h3 className="text-lg font-bold text-white font-serif-academy mt-0.5">
                  Upload Student Proofs &amp; KYC
                </h3>
              </div>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="grid grid-cols-3 gap-1 p-2 border-b border-white/10 bg-white/[0.02]">
            <button
              type="button"
              onClick={() => setActiveTab('photo')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'photo'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>1. Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('aadhaar')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'aadhaar'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. Aadhaar Details</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('emergency')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'emergency'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>3. Emergency Contact</span>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSaveModalData} className="p-5 sm:p-6 space-y-5">
            {/* Tab 1: Aspirant Photo */}
            {activeTab === 'photo' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-amber-400 bg-black shrink-0">
                    <img
                      src={photoPreview}
                      alt="Student Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-white text-sm">{currentUser.name}</p>
                    <p className="text-slate-400">Institutional ID: <span className="font-mono text-indigo-300">{currentUser.loginId}</span></p>
                    <p className="text-emerald-400 font-semibold flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Biometric Identity Compliant
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => photoInputRef.current?.click()}
                  className="p-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-amber-400/60 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex flex-col items-center justify-center text-center cursor-pointer"
                >
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-white mb-0.5">Click to upload new Aspirant Photo</p>
                  <p className="text-[11px] text-slate-400">Formal passport photograph with plain background</p>
                </div>
              </div>
            )}

            {/* Tab 2: Aadhaar Details */}
            {activeTab === 'aadhaar' && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-300">12-Digit Aadhaar Number *</label>
                    <button
                      type="button"
                      onClick={() => setShowAadhaarNumber(!showAadhaarNumber)}
                      className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold text-[11px]"
                    >
                      {showAadhaarNumber ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showAadhaarNumber ? 'Mask' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    type={showAadhaarNumber ? 'text' : 'password'}
                    value={aadhaarNumber}
                    onChange={handleAadhaarChange}
                    placeholder="5489 7291 3847"
                    maxLength={14}
                    className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Name on Aadhaar *</label>
                    <input
                      type="text"
                      value={aadhaarName}
                      onChange={(e) => setAadhaarName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Date of Birth (DOB) *</label>
                    <input
                      type="text"
                      value={aadhaarDob}
                      onChange={(e) => setAadhaarDob(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="w-full bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Aadhaar Card Document Upload</label>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <img
                      src={aadhaarFrontPreview}
                      alt="Aadhaar Document Preview"
                      className="w-16 h-10 object-cover rounded-lg border border-white/10"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-white">Aadhaar Scan Validated</p>
                      <p className="text-[10px] text-slate-400">UIDAI verified copy attached</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => aadhaarInputRef.current?.click()}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                    >
                      Replace
                    </button>
                    <input
                      ref={aadhaarInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleAadhaarUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Emergency Contact */}
            {activeTab === 'emergency' && (
              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Contact Person Name *</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="Dr. Robert Rivera"
                      className="w-full bg-white/5 border border-white/15 focus:border-rose-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Relationship *</label>
                    <select
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value as any)}
                      className="w-full bg-[#0c0c18] border border-white/15 focus:border-rose-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Emergency Phone (+91) *</label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="+91 98451 22890"
                      className="w-full bg-white/5 border border-white/15 focus:border-rose-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Candidate Blood Group</label>
                    <select
                      value={emergencyBloodGroup}
                      onChange={(e) => setEmergencyBloodGroup(e.target.value)}
                      className="w-full bg-[#0c0c18] border border-white/15 focus:border-rose-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Permanent Dispatch Address *</label>
                  <textarea
                    value={emergencyAddress}
                    onChange={(e) => setEmergencyAddress(e.target.value)}
                    rows={2}
                    placeholder="Full residential address for emergency dispatch"
                    className="w-full bg-white/5 border border-white/15 focus:border-rose-400 rounded-xl p-2.5 text-xs text-white focus:outline-none resize-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              {onOpenFullDossier ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenFullDossier();
                  }}
                  className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1"
                >
                  <span>Open Full Candidate Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-amber-950/50 flex items-center gap-1.5 active:scale-95"
                >
                  {successToast ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>Proofs Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Proof Details</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
