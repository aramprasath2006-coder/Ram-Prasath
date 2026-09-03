import React, { useState, useRef } from 'react';
import { ActiveScreen } from '../types';
import { useStudentAuth } from '../context/StudentAuthContext';
import { useEliteProof } from '../context/EliteProofContext';
import { compressImageFile } from '../utils/imageCompressor';
import { 
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
  AlertCircle, 
  ArrowLeft, 
  Download, 
  Printer, 
  Sparkles, 
  Lock, 
  Mail, 
  MapPin, 
  HeartPulse, 
  Edit3, 
  Save, 
  RefreshCw, 
  X,
  ExternalLink,
  Smartphone,
  Check,
  Award
} from 'lucide-react';

interface EliteStudentProofScreenProps {
  onBack: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const EliteStudentProofScreen: React.FC<EliteStudentProofScreenProps> = ({
  onBack,
  setActiveScreen
}) => {
  const { currentUser, registeredStudents, switchStudent } = useStudentAuth();
  const { 
    getStudentProof, 
    saveStudentProof, 
    updatePhotoProof, 
    updateAadhaarProof, 
    updateEmergencyContact 
  } = useEliteProof();

  const activeProof = getStudentProof(currentUser?.id || 'stu-1');

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [showAadhaarNumber, setShowAadhaarNumber] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  // Editable Form Inputs
  const [aadhaarNumberInput, setAadhaarNumberInput] = useState(activeProof.aadhaarNumber);
  const [aadhaarNameInput, setAadhaarNameInput] = useState(activeProof.aadhaarName);
  const [aadhaarDobInput, setAadhaarDobInput] = useState(activeProof.aadhaarDob);
  const [aadhaarGenderInput, setAadhaarGenderInput] = useState(activeProof.aadhaarGender);

  const [emergencyNameInput, setEmergencyNameInput] = useState(activeProof.emergencyContactName);
  const [emergencyRelationInput, setEmergencyRelationInput] = useState(activeProof.emergencyContactRelation);
  const [emergencyPhoneInput, setEmergencyPhoneInput] = useState(activeProof.emergencyContactPhone);
  const [emergencySecondaryPhoneInput, setEmergencySecondaryPhoneInput] = useState(activeProof.emergencyContactSecondaryPhone || '');
  const [emergencyEmailInput, setEmergencyEmailInput] = useState(activeProof.emergencyContactEmail || '');
  const [emergencyAddressInput, setEmergencyAddressInput] = useState(activeProof.emergencyAddress);
  const [emergencyBloodGroupInput, setEmergencyBloodGroupInput] = useState(activeProof.emergencyBloodGroup || 'O+');

  // Upload Previews
  const [photoPreview, setPhotoPreview] = useState(activeProof.photoUrl);
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState(activeProof.aadhaarDocFrontUrl);
  const [aadhaarBackPreview, setAadhaarBackPreview] = useState(activeProof.aadhaarDocBackUrl || '');
  
  // Modal / Preview Lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // File Inputs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const aadhaarFrontInputRef = useRef<HTMLInputElement>(null);
  const aadhaarBackInputRef = useRef<HTMLInputElement>(null);

  // Sync state when student switches
  React.useEffect(() => {
    const proof = getStudentProof(currentUser?.id || 'stu-1');
    setAadhaarNumberInput(proof.aadhaarNumber);
    setAadhaarNameInput(proof.aadhaarName);
    setAadhaarDobInput(proof.aadhaarDob);
    setAadhaarGenderInput(proof.aadhaarGender);
    setEmergencyNameInput(proof.emergencyContactName);
    setEmergencyRelationInput(proof.emergencyContactRelation);
    setEmergencyPhoneInput(proof.emergencyContactPhone);
    setEmergencySecondaryPhoneInput(proof.emergencyContactSecondaryPhone || '');
    setEmergencyEmailInput(proof.emergencyContactEmail || '');
    setEmergencyAddressInput(proof.emergencyAddress);
    setEmergencyBloodGroupInput(proof.emergencyBloodGroup || 'O+');
    setPhotoPreview(proof.photoUrl);
    setAadhaarFrontPreview(proof.aadhaarDocFrontUrl);
    setAadhaarBackPreview(proof.aadhaarDocBackUrl || '');
    setIsEditing(false);
  }, [currentUser?.id, getStudentProof]);

  // Format Aadhaar Input with 4-digit chunks
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setAadhaarNumberInput(formatted);
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

  const handleAadhaarFrontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleAadhaarBackUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, { maxWidth: 600, maxHeight: 400, quality: 0.75 });
        setAadhaarBackPreview(compressed);
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const url = event.target.result as string;
            setAadhaarBackPreview(url);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Validate Aadhaar length
    const cleanAadhaar = aadhaarNumberInput.replace(/\s/g, '');
    if (cleanAadhaar.length !== 12) {
      alert('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    if (!emergencyNameInput.trim() || !emergencyPhoneInput.trim()) {
      alert('Please provide emergency contact person name and emergency phone number.');
      return;
    }

    const updatedProof = {
      ...activeProof,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentLoginId: currentUser.loginId,
      rollNo: currentUser.rollNo,
      photoUrl: photoPreview,
      photoVerified: true,
      aadhaarNumber: aadhaarNumberInput,
      aadhaarName: aadhaarNameInput,
      aadhaarDob: aadhaarDobInput,
      aadhaarGender: aadhaarGenderInput,
      aadhaarDocFrontUrl: aadhaarFrontPreview,
      aadhaarDocBackUrl: aadhaarBackPreview,
      aadhaarVerificationStatus: 'Verified' as const,
      emergencyContactName: emergencyNameInput,
      emergencyContactRelation: emergencyRelationInput,
      emergencyContactPhone: emergencyPhoneInput,
      emergencyContactSecondaryPhone: emergencySecondaryPhoneInput,
      emergencyContactEmail: emergencyEmailInput,
      emergencyAddress: emergencyAddressInput,
      emergencyBloodGroup: emergencyBloodGroupInput,
      emergencyContactVerified: true,
      overallStatus: 'Verified' as const,
      verificationTimestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    saveStudentProof(updatedProof);
    setIsEditing(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const maskedAadhaar = activeProof.aadhaarNumber.replace(/(\d{4})\s(\d{4})\s(\d{4})/, '•••• •••• $3');

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6 pb-28 md:pb-12 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
            title="Back to ASCEND STALTECH INDIAA Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[11px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>ASCEND STALTECH INDIAA Verified</span>
              </span>
              <span className="text-xs text-indigo-300 font-mono">NAVS Security Ref: #ELT-KYC-2025</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-academy mt-0.5">
              Candidate Proof &amp; Verification Dossier
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Aspirant Switcher */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-xs">
            <span className="text-slate-400 font-medium hidden sm:inline">Aspirant:</span>
            <select
              value={currentUser.id}
              onChange={(e) => switchStudent(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {registeredStudents.map((s, idx) => (
                <option key={`${s.id}-${s.rollNo || idx}`} value={s.id} className="bg-[#0c0c18] text-white">
                  {s.name} ({s.rollNo})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrintDossier}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            title="Print Candidate Verification Dossier"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-300" />
            <span>Print Dossier</span>
          </button>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-amber-950/50 flex items-center gap-1.5 active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Proofs</span>
            </button>
          ) : (
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-emerald-950/50 flex items-center gap-1.5 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Toast */}
      {saveSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white">ASCEND STALTECH INDIAA Proofs Updated &amp; Verified</p>
              <p className="text-emerald-300">Candidate photograph, Aadhaar document, and emergency contact details have been securely logged.</p>
            </div>
          </div>
          <button 
            onClick={() => setSaveSuccessToast(false)}
            className="p-1 rounded-lg hover:bg-emerald-500/20 text-emerald-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Verification Card */}
      <section className="bg-gradient-to-br from-indigo-950/90 via-slate-900/90 to-purple-950/80 rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 z-10 text-center sm:text-left">
          {/* Aspirant Passport Photo Card */}
          <div className="relative group shrink-0">
            <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-2xl overflow-hidden border-3 border-amber-400 shadow-2xl bg-black relative">
              <img
                src={photoPreview || activeProof.photoUrl}
                alt={activeProof.studentName}
                className="w-full h-full object-cover"
              />
              <div 
                onClick={() => setLightboxImage(photoPreview || activeProof.photoUrl)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity"
              >
                <Eye className="w-5 h-5 text-amber-300 mb-1" />
                <span className="text-[10px] font-bold">View HD Photo</span>
              </div>
            </div>

            {/* Change Photo Overlay Button */}
            <button
              onClick={() => photoInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg border-2 border-[#0c0c18] font-bold transition-transform active:scale-95"
              title="Upload new aspirant passport photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xl sm:text-2xl font-black text-white font-serif-academy">
                {activeProof.studentName}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>KYC Audited</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
              <span className="font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-indigo-300">
                Institutional ID: <strong>{activeProof.studentLoginId}</strong>
              </span>
              <span className="font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-amber-300">
                Exam Roll: <strong>{activeProof.examRollNumber}</strong>
              </span>
            </div>

            <p className="text-xs text-slate-300 max-w-xl leading-relaxed pt-1">
              Official candidate dossier registered under ASCEND STALTECH INDIAA National Verification Framework. Contains validated Indian Aadhaar credentials, authenticated passport biometric photography, and rapid response emergency dispatch protocol.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-[11px] text-slate-400">
              <span>Verified by: <strong className="text-slate-200">{activeProof.verifiedByOfficer}</strong></span>
              <span>•</span>
              <span>Last Audit: <strong className="text-slate-200">{activeProof.verificationTimestamp}</strong></span>
            </div>
          </div>
        </div>

        {/* Verification Status Badge Block */}
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 z-10 shrink-0 w-full md:w-auto text-left space-y-2.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verification Level</span>
            <span className="text-xs font-black text-amber-400">Level 3 (Govt ID + Biometrics)</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-3 text-slate-300">
              <span className="flex items-center gap-1.5"><Camera className="w-3.5 h-3.5 text-indigo-400" /> Aspirant Photo</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-slate-300">
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-indigo-400" /> Aadhaar Card</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-slate-300">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-400" /> Emergency SOS</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form & Proof Cards Layout */}
      <form onSubmit={handleSaveAll} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Aadhaar Details & Proof Document */}
        <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg shadow-black/20 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white font-serif-academy">
                  1. Aadhaar Card Identification Proof
                </h2>
                <p className="text-xs text-slate-400">
                  UIDAI Government Issued Unique Identification Number &amp; Card Scans
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              UIDAI Validated
            </span>
          </div>

          <div className="space-y-4">
            {/* Aadhaar Number Field with Mask/Unmask */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  12-Digit Aadhaar Card Number *
                </label>
                <button
                  type="button"
                  onClick={() => setShowAadhaarNumber(!showAadhaarNumber)}
                  className="text-xs text-indigo-300 hover:text-indigo-200 flex items-center gap-1 font-semibold"
                >
                  {showAadhaarNumber ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Mask Number</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Reveal Number</span>
                    </>
                  )}
                </button>
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={aadhaarNumberInput}
                  onChange={handleAadhaarChange}
                  placeholder="5489 7291 3847"
                  maxLength={14}
                  className="w-full bg-white/5 border border-white/15 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
                  required
                />
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-sm">
                  <span className="font-bold text-white tracking-widest">
                    {showAadhaarNumber ? activeProof.aadhaarNumber : maskedAadhaar}
                  </span>
                  <span className="text-xs text-slate-400 font-sans flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>256-bit Encrypted</span>
                  </span>
                </div>
              )}
            </div>

            {/* Name on Aadhaar & DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name as per Aadhaar *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={aadhaarNameInput}
                    onChange={(e) => setAadhaarNameInput(e.target.value)}
                    placeholder="Full name on ID"
                    className="w-full bg-white/5 border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                ) : (
                  <p className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white font-medium">
                    {activeProof.aadhaarName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Date of Birth as per Aadhaar *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={aadhaarDobInput}
                    onChange={(e) => setAadhaarDobInput(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full bg-white/5 border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                ) : (
                  <p className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white font-medium">
                    {activeProof.aadhaarDob}
                  </p>
                )}
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Gender *
              </label>
              {isEditing ? (
                <div className="grid grid-cols-3 gap-2">
                  {(['Male', 'Female', 'Other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setAadhaarGenderInput(g)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        aadhaarGenderInput === g
                          ? 'bg-indigo-600 text-white border-indigo-400'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white font-medium">
                  {activeProof.aadhaarGender}
                </p>
              )}
            </div>

            {/* Aadhaar Document Proof Scans (Front & Back) */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Aadhaar Document Scans (Front &amp; Back)
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Front Scan */}
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">Front Side Scan</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Uploaded</span>
                  </div>
                  
                  <div 
                    onClick={() => setLightboxImage(aadhaarFrontPreview || activeProof.aadhaarDocFrontUrl)}
                    className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 cursor-pointer group"
                  >
                    <img
                      src={aadhaarFrontPreview || activeProof.aadhaarDocFrontUrl}
                      alt="Aadhaar Front"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs gap-1.5 transition-opacity">
                      <Eye className="w-4 h-4 text-indigo-300" />
                      <span>Preview Scan</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => aadhaarFrontInputRef.current?.click()}
                    className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3 h-3 text-indigo-400" />
                    <span>Replace Front Scan</span>
                  </button>
                  <input
                    ref={aadhaarFrontInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleAadhaarFrontUpload}
                    className="hidden"
                  />
                </div>

                {/* Back Scan */}
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">Back Side (Address)</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Uploaded</span>
                  </div>
                  
                  <div 
                    onClick={() => setLightboxImage(aadhaarBackPreview || activeProof.aadhaarDocBackUrl || '')}
                    className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 cursor-pointer group"
                  >
                    <img
                      src={aadhaarBackPreview || activeProof.aadhaarDocBackUrl || 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=600&auto=format&fit=crop&q=80'}
                      alt="Aadhaar Back"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs gap-1.5 transition-opacity">
                      <Eye className="w-4 h-4 text-indigo-300" />
                      <span>Preview Scan</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => aadhaarBackInputRef.current?.click()}
                    className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3 h-3 text-indigo-400" />
                    <span>Replace Back Scan</span>
                  </button>
                  <input
                    ref={aadhaarBackInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleAadhaarBackUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card 2: Emergency Contact & Critical Protocol */}
        <section className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg shadow-black/20 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white font-serif-academy">
                  2. Emergency Contact &amp; SOS Protocol
                </h2>
                <p className="text-xs text-slate-400">
                  Designated guardian &amp; immediate medical dispatch information
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>SOS Active</span>
            </span>
          </div>

          <div className="space-y-4">
            {/* Primary Contact Person & Relation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Emergency Contact Name *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={emergencyNameInput}
                    onChange={(e) => setEmergencyNameInput(e.target.value)}
                    placeholder="e.g. Dr. Robert Rivera"
                    className="w-full bg-white/5 border border-white/15 focus:border-rose-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                ) : (
                  <p className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white font-medium">
                    {activeProof.emergencyContactName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Relationship *
                </label>
                {isEditing ? (
                  <select
                    value={emergencyRelationInput}
                    onChange={(e) => setEmergencyRelationInput(e.target.value as any)}
                    className="w-full bg-[#0c0c18] border border-white/15 focus:border-rose-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white font-medium">
                    {activeProof.emergencyContactRelation}
                  </p>
                )}
              </div>
            </div>

            {/* Primary Phone & Secondary Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Primary Emergency Phone *
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={emergencyPhoneInput}
                    onChange={(e) => setEmergencyPhoneInput(e.target.value)}
                    placeholder="+91 98451 22890"
                    className="w-full bg-white/5 border border-white/15 focus:border-rose-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                    required
                  />
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                    <span className="text-white font-mono font-bold">{activeProof.emergencyContactPhone}</span>
                    <a
                      href={`tel:${activeProof.emergencyContactPhone}`}
                      className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-bold transition-colors"
                    >
                      Call SOS
                    </a>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Secondary / Landline (Optional)
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={emergencySecondaryPhoneInput}
                    onChange={(e) => setEmergencySecondaryPhoneInput(e.target.value)}
                    placeholder="+91 98451 22891"
                    className="w-full bg-white/5 border border-white/15 focus:border-rose-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                  />
                ) : (
                  <p className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 font-mono">
                    {activeProof.emergencyContactSecondaryPhone || 'Not provided'}
                  </p>
                )}
              </div>
            </div>

            {/* Email & Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Guardian Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={emergencyEmailInput}
                    onChange={(e) => setEmergencyEmailInput(e.target.value)}
                    placeholder="guardian@example.com"
                    className="w-full bg-white/5 border border-white/15 focus:border-rose-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                ) : (
                  <p className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white font-medium">
                    {activeProof.emergencyContactEmail || 'guardian@edu.in'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Candidate Blood Group
                </label>
                {isEditing ? (
                  <select
                    value={emergencyBloodGroupInput}
                    onChange={(e) => setEmergencyBloodGroupInput(e.target.value)}
                    className="w-full bg-[#0c0c18] border border-white/15 focus:border-rose-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                ) : (
                  <p className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-rose-300 font-bold">
                    {activeProof.emergencyBloodGroup} (Medical Record Validated)
                  </p>
                )}
              </div>
            </div>

            {/* Residential Dispatch Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Permanent / Campus Residential Dispatch Address *
              </label>
              {isEditing ? (
                <textarea
                  value={emergencyAddressInput}
                  onChange={(e) => setEmergencyAddressInput(e.target.value)}
                  rows={3}
                  placeholder="Full residential address for emergency dispatch"
                  className="w-full bg-white/5 border border-white/15 focus:border-rose-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                  required
                />
              ) : (
                <p className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 leading-relaxed">
                  {activeProof.emergencyAddress}
                </p>
              )}
            </div>

            {/* Save Button if Editing */}
            {isEditing && (
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-950/50 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Verification Proofs</span>
                </button>
              </div>
            )}
          </div>
        </section>
      </form>

      {/* Official Elite Candidate ID Dossier (Preview for Print/Verification) */}
      <section className="bg-[#070712] rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif-academy">
                ASCEND STALTECH INDIAA National Aspirant Dossier
              </h3>
              <p className="text-xs text-slate-400">
                Official document issued for examination hall entry and national ranking verification
              </p>
            </div>
          </div>

          <button
            onClick={handlePrintDossier}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official Dossier PDF</span>
          </button>
        </div>

        {/* Printable ID Layout */}
        <div className="bg-[#0d0d1c] p-6 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Candidate Bio Col */}
          <div className="flex items-start gap-4 md:col-span-2">
            <div className="w-24 h-32 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 bg-black">
              <img
                src={photoPreview || activeProof.photoUrl}
                alt={activeProof.studentName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <h4 className="text-base font-bold text-white font-serif-academy">{activeProof.studentName}</h4>
              <p className="text-slate-400">Aspirant Roll No: <span className="font-mono text-slate-200 font-bold">{activeProof.examRollNumber}</span></p>
              <p className="text-slate-400">Aadhaar Reg: <span className="font-mono text-slate-200 font-bold">{maskedAadhaar}</span></p>
              <p className="text-slate-400">Emergency Protocol: <span className="text-rose-300 font-bold">{activeProof.emergencyContactName} ({activeProof.emergencyContactPhone})</span></p>
              <p className="text-slate-400">Blood Group: <span className="text-amber-300 font-bold">{activeProof.emergencyBloodGroup}</span></p>
            </div>
          </div>

          {/* Seal & Registrar Signature Col */}
          <div className="flex flex-col justify-between items-center md:items-end text-center md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-center w-full max-w-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-widest block font-mono">SEAL OF REGISTRAR</span>
              <span className="text-xs font-serif-academy font-bold block mt-1">ELITE ACADEMY OF INDIA</span>
              <span className="text-[9px] text-slate-400 block">UIDAI / UPSC COMPLIANT</span>
            </div>

            <div className="pt-3 text-[11px] text-slate-400">
              <p className="font-serif-academy font-bold text-slate-200">Col. S. Deshmukh</p>
              <p className="text-[10px]">Registrar &amp; Chief Auditor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Preview Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-[#0c0c18] border border-white/20 rounded-3xl p-4 shadow-2xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-amber-300">Document Verification Lightbox</span>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-black max-h-[70vh] flex items-center justify-center">
              <img
                src={lightboxImage}
                alt="Document Lightbox"
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
