import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStudentAuth } from '../../context/StudentAuthContext';
import { compressImageFile, compressDataUrl } from '../../utils/imageCompressor';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Link as LinkIcon, 
  Check, 
  X, 
  AlertCircle, 
  RotateCw, 
  User, 
  ShieldCheck, 
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const PRESET_AVATARS = [
  {
    id: 'scholar-1',
    label: 'Alex Rivera (CS)',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    category: 'Male Scholar'
  },
  {
    id: 'scholar-2',
    label: 'Priya Sharma (EE)',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    category: 'Female Scholar'
  },
  {
    id: 'scholar-3',
    label: 'Rohan Verma (Mech)',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
    category: 'Male Scholar'
  },
  {
    id: 'scholar-4',
    label: 'Ananya Iyer (Data)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    category: 'Female Scholar'
  },
  {
    id: 'scholar-5',
    label: 'Dev Patel (Civil)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    category: 'Male Scholar'
  },
  {
    id: 'scholar-6',
    label: 'Kavya Nair (Biotech)',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    category: 'Female Scholar'
  },
  {
    id: 'scholar-7',
    label: 'Vikramaditya (Aero)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    category: 'Male Scholar'
  },
  {
    id: 'scholar-8',
    label: 'Meera Nambiar (AI)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    category: 'Female Scholar'
  }
];

export const StudentPhotoUploadModal: React.FC = () => {
  const { 
    currentUser, 
    isPhotoUploadModalOpen, 
    closePhotoUploadModal, 
    updateProfilePhoto 
  } = useStudentAuth();

  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'presets' | 'url'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [successToast, setSuccessToast] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sync initial state when modal opens
  useEffect(() => {
    if (isPhotoUploadModalOpen && currentUser) {
      setPreviewUrl(currentUser.avatar || '');
      setUrlInput('');
      setCameraError('');
      setSuccessToast(false);
    } else {
      stopCamera();
    }
  }, [isPhotoUploadModalOpen, currentUser]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError('');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
      } else {
        setCameraError('Camera API is not supported in this browser environment.');
      }
    } catch (err: any) {
      console.warn('Webcam access error:', err);
      setCameraError('Unable to access webcam. Please verify camera permissions or upload an image file.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const size = Math.min(video.videoWidth || 320, 320);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw frame to canvas scaled
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        setPreviewUrl(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP, or SVG).');
      return;
    }
    try {
      const compressed = await compressImageFile(file, { maxWidth: 320, maxHeight: 320, quality: 0.75 });
      setPreviewUrl(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setPreviewUrl(urlInput.trim());
    }
  };

  const handleSavePhoto = () => {
    if (!previewUrl) return;
    updateProfilePhoto(previewUrl);
    setSuccessToast(true);
    stopCamera();
    setTimeout(() => {
      closePhotoUploadModal();
      setSuccessToast(false);
    }, 900);
  };

  if (!isPhotoUploadModalOpen || !currentUser) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-lg bg-[#0c0c18] border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden text-white"
        >
          {/* Header Banner */}
          <div className="relative p-5 pb-4 border-b border-white/10 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80">
            <button
              onClick={() => {
                stopCamera();
                closePhotoUploadModal();
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 shadow-inner">
                <Camera className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-serif-academy tracking-tight">
                  Update Student Profile Photo
                </h3>
                <p className="text-xs text-slate-400">
                  {currentUser.name} • Roll No: <span className="font-mono text-indigo-300">{currentUser.rollNo}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* Live Preview Avatar & Badges */}
            <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-indigo-500 shadow-xl bg-indigo-950">
                  <img
                    src={previewUrl || currentUser.avatar}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = currentUser.avatar;
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-indigo-600 border border-black text-white shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-mono">
                  Official Biometric Badge
                </span>
                <p className="text-sm font-bold text-white">{currentUser.name}</p>
                <p className="text-xs text-slate-400">
                  Synchronized across campus turnstiles, attendance logs, and student identity cards.
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setActiveTab('upload');
                }}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'upload'
                    ? 'bg-indigo-600 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Upload</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('camera');
                  startCamera();
                }}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'camera'
                    ? 'bg-indigo-600 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Webcam</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setActiveTab('presets');
                }}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'presets'
                    ? 'bg-indigo-600 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Avatars</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setActiveTab('url');
                }}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'url'
                    ? 'bg-indigo-600 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">URL</span>
              </button>
            </div>

            {/* Tab 1: Local File Drag & Drop */}
            {activeTab === 'upload' && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                  isDragging
                    ? 'border-indigo-400 bg-indigo-500/15 ring-2 ring-indigo-400/40'
                    : 'border-white/15 hover:border-indigo-400/60 bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 mb-3 border border-indigo-500/30">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-white mb-1">
                  Click to browse or drag &amp; drop student photo
                </p>
                <p className="text-xs text-slate-400">
                  Supports PNG, JPG, WEBP or SVG up to 10MB
                </p>
              </div>
            )}

            {/* Tab 2: Webcam Capture */}
            {activeTab === 'camera' && (
              <div className="space-y-4 text-center">
                {cameraError ? (
                  <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs space-y-2">
                    <AlertCircle className="w-5 h-5 mx-auto text-rose-400" />
                    <p>{cameraError}</p>
                    <button
                      onClick={startCamera}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-56 flex items-center justify-center border border-white/10 shadow-lg">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {!isCameraActive && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-slate-300 text-xs gap-2">
                        <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                        <span>Initializing Camera Stream...</span>
                      </div>
                    )}
                  </div>
                )}

                {isCameraActive && (
                  <button
                    onClick={capturePhoto}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Snapshot</span>
                  </button>
                )}
              </div>
            )}

            {/* Tab 3: Preset Avatars */}
            {activeTab === 'presets' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Select a scholar portrait from the institutional catalog:
                </p>
                <div className="grid grid-cols-4 gap-3 max-h-56 overflow-y-auto pr-1">
                  {PRESET_AVATARS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setPreviewUrl(preset.url)}
                      className={`relative group rounded-2xl overflow-hidden aspect-square border-2 transition-all ${
                        previewUrl === preset.url
                          ? 'border-indigo-400 ring-2 ring-indigo-500/50 scale-95'
                          : 'border-white/10 hover:border-white/30 hover:scale-102'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                      {previewUrl === preset.url && (
                        <div className="absolute inset-0 bg-indigo-600/40 backdrop-blur-2xs flex items-center justify-center text-white">
                          <Check className="w-5 h-5 drop-shadow-md" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1 text-[9px] font-bold truncate text-center text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                        {preset.label.split(' ')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Image Web URL */}
            {activeTab === 'url' && (
              <form onSubmit={handleApplyUrl} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Paste Direct Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                  >
                    Load
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tip: Use high resolution HTTPS links for best clarity.
                </p>
              </form>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  closePhotoUploadModal();
                }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSavePhoto}
                disabled={!previewUrl}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-950/60 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {successToast ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Updated!</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Profile Photo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
