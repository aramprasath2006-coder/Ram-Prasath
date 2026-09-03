import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  User,
  CheckCircle2,
  RefreshCw,
  X,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';

interface CandidatePhotoPickerProps {
  photoUrl?: string;
  onChange: (photoDataUrl: string) => void;
  candidateName?: string;
  label?: string;
  required?: boolean;
}

const PRESET_ACADEMIC_AVATARS = [
  {
    id: 'male-1',
    label: 'Portrait 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80'
  },
  {
    id: 'male-2',
    label: 'Portrait 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80'
  },
  {
    id: 'female-1',
    label: 'Portrait 3',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&auto=format&fit=crop&q=80'
  },
  {
    id: 'female-2',
    label: 'Portrait 4',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&auto=format&fit=crop&q=80'
  },
  {
    id: 'academic-5',
    label: 'Portrait 5',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80'
  }
];

export const CandidatePhotoPicker: React.FC<CandidatePhotoPickerProps> = ({
  photoUrl,
  onChange,
  candidateName = 'Candidate',
  label = 'Candidate Official Photo (Passport Size)',
  required = false
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser or environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Unable to access webcam:', err);
      setCameraError(err?.message || 'Camera permission denied or camera not found. Please upload a photo instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCountdown(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          snapFrame();
          return null;
        }
        return prev - 1;
      });
    }, 600);
  };

  const snapFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth, video.videoHeight) || 400;
    canvas.width = 360;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop square center
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;
    ctx.drawImage(video, startX, startY, size, size, 0, 0, 360, 360);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onChange(dataUrl);
    stopCamera();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const compressed = await compressImageFile(file, {
        maxWidth: 360,
        maxHeight: 360,
        quality: 0.85,
        format: 'image/jpeg'
      });
      onChange(compressed);
    } catch (err) {
      console.error('Failed to process uploaded photo:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    setIsProcessing(true);
    try {
      const compressed = await compressImageFile(file, {
        maxWidth: 360,
        maxHeight: 360,
        quality: 0.85,
        format: 'image/jpeg'
      });
      onChange(compressed);
    } catch (err) {
      console.error('Failed to process dropped photo:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#0f0f1e]/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3.5">
      {/* Label and Info Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-indigo-400" />
          <span>{label}</span>
          {required && <span className="text-rose-400">*</span>}
        </label>

        {photoUrl ? (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Photo Verified</span>
          </span>
        ) : (
          <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
            Required for ID & Certificate
          </span>
        )}
      </div>

      {/* Main Interactive Photo Area */}
      {isCameraActive ? (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-square max-w-[280px] mx-auto border-2 border-indigo-500 shadow-xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Oval frame overlay for passport alignment */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-36 h-48 rounded-[48%] border-2 border-dashed border-indigo-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
          </div>

          {countdown !== null && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
              <span className="text-5xl font-black text-white animate-ping">{countdown}</span>
            </div>
          )}

          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-10">
            <button
              type="button"
              onClick={stopCamera}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 border border-white/20"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button
              type="button"
              onClick={capturePhoto}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 active:scale-95"
            >
              <Camera className="w-4 h-4" /> Snap Photo
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Photo Avatar Preview with Passport badge */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="relative w-28 h-36 rounded-xl overflow-hidden bg-[#151528] border-2 border-dashed border-white/20 hover:border-indigo-400/60 transition-all flex flex-col items-center justify-center shrink-0 group cursor-pointer shadow-inner"
            onClick={() => fileInputRef.current?.click()}
            title="Click or drag to upload candidate photo"
          >
            {photoUrl ? (
              <>
                <img
                  src={photoUrl}
                  alt={candidateName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white bg-indigo-600/90 px-2 py-1 rounded-md">
                    Change
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                  }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-md transition-colors"
                  title="Remove Photo"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400 group-hover:text-indigo-300 transition-colors">
                <User className="w-8 h-8 mb-1 text-slate-500 group-hover:text-indigo-400" />
                <span className="text-[10px] font-bold">Upload Photo</span>
                <span className="text-[8px] text-slate-500">3x4 Passport</span>
              </div>
            )}
          </div>

          {/* Action buttons & explanation */}
          <div className="flex-1 flex flex-col justify-between space-y-2 w-full">
            <div className="space-y-1">
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Attach the candidate&apos;s formal portrait photo. This image is printed on the official Course Enrollment Badge, Attendance Roster, and Final Certificate.
              </p>
              {cameraError && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {cameraError}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/10 active:scale-95"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>{photoUrl ? 'Replace Photo' : 'Upload File'}</span>
              </button>

              <button
                type="button"
                onClick={startCamera}
                className="px-3 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-indigo-500/40 active:scale-95"
              >
                <Camera className="w-3.5 h-3.5 text-indigo-300" />
                <span>Take Snapshot</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-purple-500/30 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Choose Sample</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preset Portraits Drawer */}
      {showPresets && (
        <div className="pt-2 border-t border-white/10 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Select a verified sample academic portrait:</span>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {PRESET_ACADEMIC_AVATARS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                }}
                className={`relative w-12 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-transform hover:scale-105 ${
                  photoUrl === preset.url ? 'border-indigo-400 ring-2 ring-indigo-400/40' : 'border-white/20'
                }`}
              >
                <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
