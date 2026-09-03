import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Upload,
  Camera,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Check,
  RefreshCw,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useStudentAuth } from '../../context/StudentAuthContext';

interface ProfilePhotoUploadModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Curated academic student avatars for quick selection
const ACADEMIC_AVATAR_PRESETS = [
  {
    id: 'preset-alex',
    name: 'Tech & Engineering',
    category: 'Computer Science',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-priya',
    name: 'Civil Services Aspirant',
    category: 'UPSC Academy',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-marcus',
    name: 'Mechanical & Robotics',
    category: 'GATE Engineering',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-ananya',
    name: 'Mathematics & Analytics',
    category: 'Applied Science',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-rahul',
    name: 'Railway Technical Cadre',
    category: 'RRB Engineering',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-elena',
    name: 'Research & Innovation',
    category: 'Academic Scholar',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-david',
    name: 'Quantitative Finance',
    category: 'Banking & CAT',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-aisha',
    name: 'Bio-Technology',
    category: 'Applied Sciences',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
  }
];

export const ProfilePhotoUploadModal: React.FC<ProfilePhotoUploadModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    currentUser, 
    updateProfilePhoto, 
    isPhotoUploadModalOpen, 
    closePhotoUploadModal 
  } = useStudentAuth();

  const isModalOpen = isOpen !== undefined ? isOpen : isPhotoUploadModalOpen;
  const handleClose = onClose || closePhotoUploadModal;

  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'presets'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<'none' | 'crisp' | 'warm' | 'mono'>('none');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset state when opening modal
  useEffect(() => {
    if (isModalOpen) {
      setSelectedImage(currentUser?.avatar || null);
      setZoom(1);
      setRotation(0);
      setActiveFilter('none');
      setErrorMessage(null);
      setIsSuccess(false);
      setActiveTab('upload');
    } else {
      stopCamera();
    }
  }, [isModalOpen, currentUser]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Stop webcam stream safely
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
    setCountdown(null);
  };

  // Start webcam stream
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera capture is not supported on this browser or environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
        audio: false
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Unable to access webcam:', err);
      setCameraError(err.message || 'Camera permission denied or camera device unavailable.');
      setIsCameraActive(false);
    }
  };

  // Switch tabs
  const handleTabChange = (tab: 'upload' | 'camera' | 'presets') => {
    setActiveTab(tab);
    setErrorMessage(null);
    if (tab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  };

  // Handle local image file selection
  const processImageFile = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WebP, GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB limit. Please choose a smaller photo.');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setSelectedImage(result);
        setZoom(1);
        setRotation(0);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processImageFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Trigger camera snapshot
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    setCountdown(3);

    let current = 3;
    const interval = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountdown(current);
      } else {
        clearInterval(interval);
        setCountdown(null);

        // Take snapshot from video element
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement('canvas');
        const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Center square crop from video
          const startX = ((video.videoWidth || 480) - size) / 2;
          const startY = ((video.videoHeight || 480) - size) / 2;
          ctx.drawImage(video, startX, startY, size, size, 0, 0, 400, 400);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setSelectedImage(dataUrl);
          stopCamera();
          setActiveTab('upload');
        }
      }
    }, 800);
  };

  // Generate optimized output image via Canvas
  const generateOptimizedAvatar = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!selectedImage) {
        reject(new Error('No image selected'));
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const targetSize = 400;
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(selectedImage);
          return;
        }

        // Apply background fill
        ctx.fillStyle = '#0b0b18';
        ctx.fillRect(0, 0, targetSize, targetSize);

        ctx.save();
        // Translate to center for rotation and zoom
        ctx.translate(targetSize / 2, targetSize / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);

        // Calculate aspect fill
        const hRatio = targetSize / img.width;
        const vRatio = targetSize / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShiftX = -(img.width * ratio) / 2;
        const centerShiftY = -(img.height * ratio) / 2;

        ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
        ctx.restore();

        // Apply visual filter
        if (activeFilter === 'mono') {
          const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
          }
          ctx.putImageData(imageData, 0, 0);
        } else if (activeFilter === 'crisp') {
          // Slight contrast boost
          const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, (data[i] - 128) * 1.15 + 128);
            data[i + 1] = Math.min(255, (data[i + 1] - 128) * 1.15 + 128);
            data[i + 2] = Math.min(255, (data[i + 2] - 128) * 1.15 + 128);
          }
          ctx.putImageData(imageData, 0, 0);
        } else if (activeFilter === 'warm') {
          const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.08); // Boost red/warmth
            data[i + 2] = Math.max(0, data[i + 2] * 0.92); // Lower blue
          }
          ctx.putImageData(imageData, 0, 0);
        }

        const finalDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        resolve(finalDataUrl);
      };

      img.onerror = () => {
        resolve(selectedImage);
      };

      img.src = selectedImage;
    });
  };

  // Save new photo
  const handleSavePhoto = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    try {
      const optimizedUrl = await generateOptimizedAvatar();
      updateProfilePhoto(optimizedUrl);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        handleClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage('Failed to process and update photo: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset to default institutional avatar initials
  const handleResetToDefault = () => {
    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      currentUser?.name || 'Student'
    )}&backgroundColor=4f46e5,7c3aed&textColor=ffffff`;
    setSelectedImage(defaultAvatar);
    setZoom(1);
    setRotation(0);
    setActiveFilter('none');
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c0c18] border border-indigo-500/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl shadow-indigo-950/80 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-[#0c0c18] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Upload Student Profile Photo
              </h2>
              <p className="text-xs text-indigo-300">
                Official profile picture for {currentUser?.name} ({currentUser?.loginId})
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 border-b border-white/10 bg-black/20 flex gap-2">
          <button
            onClick={() => handleTabChange('upload')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <button
            onClick={() => handleTabChange('camera')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Take Photo</span>
          </button>

          <button
            onClick={() => handleTabChange('presets')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Presets</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: UPLOAD FILE & LIVE ADJUSTMENT */}
          {activeTab === 'upload' && (
            <div className="space-y-5">
              {/* Drag and drop / file input box */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                  isDragging
                    ? 'border-indigo-400 bg-indigo-500/15 scale-[0.99]'
                    : 'border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/40'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center shadow-md mb-1">
                  <Upload className="w-6 h-6" />
                </div>

                <div className="text-sm font-bold text-white">
                  Drag and drop student photo, or <span className="text-indigo-400 underline">Browse</span>
                </div>
                <p className="text-xs text-slate-400 max-w-xs">
                  Supports JPG, PNG, WEBP files up to 10MB. Instant auto-cropping and compression.
                </p>
              </div>

              {/* Photo Preview & Controls */}
              {selectedImage && (
                <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Live Photo Preview &amp; Adjustment
                    </span>
                    <button
                      onClick={handleResetToDefault}
                      className="text-[11px] font-bold text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    {/* Circle Frame Preview */}
                    <div className="relative">
                      <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-indigo-500/60 shadow-2xl bg-[#050508] relative">
                        <img
                          src={selectedImage}
                          alt="Avatar preview"
                          className="w-full h-full object-cover transition-transform duration-150"
                          style={{
                            transform: `scale(${zoom}) rotate(${rotation}deg)`,
                            filter:
                              activeFilter === 'mono'
                                ? 'grayscale(100%) contrast(1.1)'
                                : activeFilter === 'crisp'
                                ? 'contrast(1.15) brightness(1.05)'
                                : activeFilter === 'warm'
                                ? 'sepia(0.2) saturate(1.2)'
                                : 'none'
                          }}
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-[#0c0c18] shadow-md">
                        <Check className="w-3 h-3" />
                      </span>
                    </div>

                    {/* Controls */}
                    <div className="flex-1 w-full space-y-3.5">
                      {/* Zoom Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-slate-300 font-semibold">
                          <span className="flex items-center gap-1">
                            <ZoomIn className="w-3.5 h-3.5 text-indigo-400" /> Zoom Level
                          </span>
                          <span className="font-mono text-indigo-300">{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="2.5"
                          step="0.05"
                          value={zoom}
                          onChange={(e) => setZoom(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>

                      {/* Rotate & Reset Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRotation((prev) => (prev + 90) % 360)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Rotate 90°</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setZoom(1);
                            setRotation(0);
                            setActiveFilter('none');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset Adjustments</span>
                        </button>
                      </div>

                      {/* Filter Presets */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aesthetic Tone</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(['none', 'crisp', 'warm', 'mono'] as const).map((f) => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => setActiveFilter(f)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                activeFilter === f
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                              }`}
                            >
                              {f === 'none' ? 'Natural' : f === 'crisp' ? 'Studio Crisp' : f === 'warm' ? 'Warm Glow' : 'Monochrome'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CAMERA SNAPSHOT */}
          {activeTab === 'camera' && (
            <div className="space-y-4 text-center">
              {cameraError ? (
                <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                  <p className="text-xs sm:text-sm text-rose-300 font-medium">
                    {cameraError}
                  </p>
                  <p className="text-xs text-slate-400">
                    You can switch to the <strong>Upload File</strong> tab to choose any photo from your device.
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="space-y-4 flex flex-col items-center">
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-indigo-500/40 bg-black shadow-2xl flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />

                    {/* Circular target guide */}
                    <div className="absolute inset-0 border-4 border-dashed border-indigo-400/40 rounded-full m-6 pointer-events-none" />

                    {/* Countdown Overlay */}
                    {countdown !== null && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center animate-in zoom-in-50">
                        <span className="text-6xl font-black text-white font-mono animate-ping">
                          {countdown}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-400">
                    Align your face inside the target circle and click <strong>Take Snapshot</strong>.
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={captureSnapshot}
                      disabled={countdown !== null}
                      className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/60 flex items-center gap-2 active:scale-95 transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Snapshot (3s Timer)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACADEMIC PRESET AVATARS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Select a Curated Scholar Avatar
                </span>
                <span className="text-[11px] text-slate-400">8 High-Resolution Presets</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ACADEMIC_AVATAR_PRESETS.map((preset) => {
                  const isSelected = selectedImage === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        setSelectedImage(preset.url);
                        setZoom(1);
                        setRotation(0);
                        setActiveFilter('none');
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-2 group ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-400 ring-2 ring-indigo-500/30'
                          : 'bg-white/[0.03] border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-md relative group-hover:scale-105 transition-transform">
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {preset.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">{preset.category}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Syncs automatically across student ID, attendance &amp; profile</span>
            <span className="sm:hidden">Auto-syncs profile</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePhoto}
              disabled={!selectedImage || isProcessing}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-1.5 ${
                isSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-950/60'
              } disabled:opacity-50 disabled:pointer-events-none`}
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Photo Saved!</span>
                </>
              ) : isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
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
      </div>
    </div>
  );
};
