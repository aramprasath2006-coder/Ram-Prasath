import React, { useState, useRef, useEffect } from 'react';
import { CAMERA_BG_URL, AVATAR_URL } from '../data/mockData';
import { AttendanceRecord } from '../types';
import { Camera, RefreshCw, CheckCircle, Video, VideoOff, History, UserCheck, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudentAuth } from '../context/StudentAuthContext';

interface DigitalAttendanceProps {
  onAttendanceSuccess?: (record: AttendanceRecord) => void;
  onOpenAdminPanel?: () => void;
}

export const DigitalAttendance: React.FC<DigitalAttendanceProps> = ({ 
  onAttendanceSuccess,
  onOpenAdminPanel
}) => {
  const { currentUser } = useStudentAuth();
  const [mode, setMode] = useState<'Check-in' | 'Check-out'>('Check-in');
  const [isRealCamera, setIsRealCamera] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [recentRecord, setRecentRecord] = useState<AttendanceRecord | null>(null);
  const [logs, setLogs] = useState<AttendanceRecord[]>([
    {
      id: 'att-prev-1',
      date: 'Today, Oct 24',
      time: '08:45 AM',
      type: 'Check-in',
      status: 'Verified',
      method: 'Facial Recognition',
      location: 'Science Block Cam-04'
    }
  ]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Stop camera when unmounting or switching off
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (isRealCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          activeStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
          setStreamError(null);
        })
        .catch((err) => {
          console.warn('Webcam permission not granted or unavailable:', err);
          setStreamError('Webcam unavailable in this container. Using high-fidelity simulator.');
          setIsRealCamera(false);
        });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isRealCamera]);

  const handleCapture = () => {
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        date: 'Today, ' + now.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        time: timeString,
        type: mode,
        status: 'Verified',
        method: 'Facial Recognition',
        location: 'Science Block Scanner #04'
      };

      setRecentRecord(newRecord);
      setLogs((prev) => [newRecord, ...prev]);
      if (onAttendanceSuccess) onAttendanceSuccess(newRecord);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore
      }
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center gap-6 pb-28 md:pb-12 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="text-center w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Digital Attendance
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-1 font-medium">
          Align your face within the frame for {mode.toLowerCase()}
        </p>
      </div>

      {/* Camera Viewfinder Box */}
      <div className="relative w-full max-w-sm aspect-[3/4] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-500/30">
        {/* Background Stream or Placeholder */}
        {isRealCamera ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={CAMERA_BG_URL}
            alt="Camera Background"
            className="absolute inset-0 w-full h-full object-cover opacity-50 filter blur-[1px]"
          />
        )}

        {/* Dynamic Scanning Reticle Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
          <div className="w-56 h-56 sm:w-64 sm:h-64 border-2 border-indigo-400/40 rounded-2xl relative shadow-inner">
            {/* Corner Accents (Bright Mint Green) */}
            <div className="absolute -top-1.5 -left-1.5 w-7 h-7 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg"></div>
            <div className="absolute -top-1.5 -right-1.5 w-7 h-7 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg"></div>
            <div className="absolute -bottom-1.5 -left-1.5 w-7 h-7 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg"></div>
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 border-b-4 border-r-4 border-emerald-400 rounded-br-lg"></div>

            {/* Laser Scanning Animation Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] opacity-85 animate-scan"></div>

            {/* Scanning In-Progress Target */}
            {isScanning && (
              <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-400 mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Analyzing Biometrics...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Live Camera Badge */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center items-center gap-2">
          <div className="bg-[#0c0c18]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-300 flex items-center gap-2 shadow-xs border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Camera Active</span>
          </div>

          <button
            onClick={() => setIsRealCamera(!isRealCamera)}
            className="bg-black/60 hover:bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-full text-[11px] font-semibold text-white flex items-center gap-1 transition-colors border border-white/10"
          >
            {isRealCamera ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
            <span>{isRealCamera ? 'Simulate' : 'Real Cam'}</span>
          </button>
        </div>
      </div>

      {streamError && (
        <p className="text-xs text-rose-300 bg-rose-950/60 border border-rose-500/30 px-3 py-1 rounded-lg">
          {streamError}
        </p>
      )}

      {/* Mode Toggle: Check-in vs Check-out */}
      <div className="flex bg-white/[0.06] rounded-full p-1 w-full max-w-sm border border-white/10">
        <button
          onClick={() => setMode('Check-in')}
          className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
            mode === 'Check-in'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Check-in
        </button>
        <button
          onClick={() => setMode('Check-out')}
          className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
            mode === 'Check-out'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Check-out
        </button>
      </div>

      {/* Student Profile Card & Action Button */}
      <div className="w-full max-w-sm bg-[#0c0c18]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg shadow-black/20 flex flex-col gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-indigo-500/30 bg-indigo-950 text-white flex items-center justify-center flex-shrink-0">
            <img src={currentUser.avatar || AVATAR_URL} alt={currentUser.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-white">{currentUser.name}</div>
            <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <span className="font-mono text-indigo-300">{currentUser.rollNo}</span>
              <span>• {currentUser.batch}</span>
              <span className="text-emerald-400">● Regular</span>
            </div>
          </div>
        </div>

        {recentRecord && (
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-bold">{recentRecord.type} Verified!</p>
              <p className="text-[11px] text-slate-400">{recentRecord.time} at {recentRecord.location}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleCapture}
          disabled={isScanning}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-98 shadow-lg shadow-indigo-950/50 border border-indigo-400/30 disabled:opacity-75"
        >
          <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
          <span>{isScanning ? 'Processing Face ID...' : `Capture & ${mode}`}</span>
        </button>
      </div>

      {/* Recent Attendance Logs Drawer */}
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <History className="w-3.5 h-3.5" /> Recent Verification Logs
          </span>
          <span className="text-xs text-emerald-400 font-semibold">94% Present Rate</span>
        </div>
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-xl p-3 border border-white/10 text-xs flex justify-between items-center shadow-lg shadow-black/20">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                  {log.type === 'Check-in' ? 'IN' : 'OUT'}
                </div>
                <div>
                  <p className="font-bold text-white">{log.type} - {log.location}</p>
                  <p className="text-[10px] text-slate-400">{log.date} • {log.time}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px]">
                {log.status}
              </span>
            </div>
          ))}
        </div>

        {/* Faculty / Admin Portal Access Banner */}
        {onOpenAdminPanel && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-amber-500/15 border border-amber-500/30 flex flex-col gap-2.5 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white">Manual Attendance Authority</p>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                      Admin Only
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Only authorized faculty/admins can manually mark, adjust, or override student attendance.
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenAdminPanel}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md shrink-0 active:scale-95 flex items-center gap-1.5"
                title="Enter password to access admin manual attendance panel"
              >
                <span>Admin Login</span>
              </button>
            </div>
            <div className="text-[10px] text-slate-400 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-1">
              <span>🔒 Password verification is required every time you enter the Admin Console.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
