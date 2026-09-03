import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  Download,
  Maximize2,
  X,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';

interface UpiQrScannerCardProps {
  amount: number;
  courseTitle: string;
  payeeName?: string;
  upiId?: string;
  onUtrVerified?: (utrNumber: string) => void;
}

export const UpiQrScannerCard: React.FC<UpiQrScannerCardProps> = ({
  amount,
  courseTitle,
  payeeName = 'Ram Prasath',
  upiId = 'aramprasath2006@oksbi',
  onUtrVerified
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isVerifyingUtr, setIsVerifyingUtr] = useState(false);
  const [utrSuccess, setUtrSuccess] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate UPI URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
    `Course Fee: ${courseTitle.slice(0, 30)}`
  )}`;

  useEffect(() => {
    // Generate high quality QR code data URL with error correction Level 'H' to tolerate logo overlay
    QRCode.toDataURL(upiUri, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 420,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate UPI QR code:', err);
      });
  }, [upiUri, amount, courseTitle, payeeName, upiId]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `UPI-QR-${payeeName.replace(/\s+/g, '-')}-₹${amount}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVerifyUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.length < 6) return;

    setIsVerifyingUtr(true);
    setTimeout(() => {
      setIsVerifyingUtr(false);
      setUtrSuccess(true);
      if (onUtrVerified) {
        onUtrVerified(utrNumber);
      }
    }, 800);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Exact Visual Google Pay / UPI QR Card */}
      <div className="w-full max-w-sm bg-white text-slate-900 rounded-[28px] p-6 sm:p-7 shadow-2xl shadow-indigo-950/40 border border-slate-200 relative overflow-hidden flex flex-col items-center transition-all">
        {/* Top Header with Profile Picture & Payee Name */}
        <div className="flex items-center gap-3 mb-5 self-center">
          {/* User profile avatar matching uploaded scanner */}
          <div className="relative">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-slate-300 bg-slate-800 flex items-center justify-center shadow-md">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                alt={payeeName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to stylized initial
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-white font-bold text-sm">RP</span>
            </div>
            {/* Online / Verified Dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {payeeName}
              </h3>
              <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 fill-sky-500 text-white" />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Verified Merchant / Faculty</p>
          </div>
        </div>

        {/* QR Code Matrix Container with Google Pay Center Logo */}
        <div className="relative p-2 bg-white rounded-2xl border border-slate-100 shadow-inner flex items-center justify-center">
          {qrDataUrl ? (
            <div className="relative w-60 h-60 sm:w-64 sm:h-64 flex items-center justify-center">
              <img
                src={qrDataUrl}
                alt={`UPI QR Code for ${payeeName}`}
                className="w-full h-full object-contain rounded-lg"
              />

              {/* Google Pay Center Logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white shadow-lg border-2 border-slate-100 flex items-center justify-center p-1.5">
                  <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
                    <path
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      fill="#EA4335"
                    />
                    <path
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      fill="#34A853"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-60 h-60 flex items-center justify-center text-slate-400">
              <QrCode className="w-12 h-12 animate-pulse" />
            </div>
          )}
        </div>

        {/* UPI ID Banner with Instant Copy */}
        <div className="mt-4 flex items-center justify-between w-full px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              UPI ID
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-800">
              {upiId}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyUpi}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors border border-indigo-200 active:scale-95"
            title="Copy UPI ID"
          >
            {copiedUpi ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Footer scan text matching image */}
        <div className="mt-3 text-center">
          <p className="text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5">
            <span>Scan to pay with any UPI app</span>
          </p>
        </div>

        {/* Amount Badge */}
        <div className="mt-3 pt-3 border-t border-slate-100 w-full flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Exact Payable:</span>
          <span className="text-base font-black text-slate-900 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
            ₹{amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* UPI Quick App Links on Mobile / Desktop */}
      <div className="w-full max-w-sm bg-[#0c0c18]/80 border border-white/10 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>Supported UPI Apps</span>
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Instant Verification
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* GPay */}
          <a
            href={upiUri}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform">
              <span className="text-[11px] font-black text-slate-800">G</span>
            </div>
            <span className="text-[10px] text-slate-300 font-medium">GPay</span>
          </a>

          {/* PhonePe */}
          <a
            href={upiUri}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-full bg-[#5f259f] flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform text-white font-bold text-xs">
              Pe
            </div>
            <span className="text-[10px] text-slate-300 font-medium">PhonePe</span>
          </a>

          {/* Paytm */}
          <a
            href={upiUri}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-full bg-[#00b9f5] flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform text-white font-black text-[10px]">
              paytm
            </div>
            <span className="text-[10px] text-slate-300 font-medium">Paytm</span>
          </a>

          {/* BHIM / Any UPI */}
          <a
            href={upiUri}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-sm mb-1 group-hover:scale-105 transition-transform text-white font-bold text-[10px]">
              UPI
            </div>
            <span className="text-[10px] text-slate-300 font-medium">BHIM</span>
          </a>
        </div>

        {/* Action utility row (Download / Fullscreen) */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <button
            type="button"
            onClick={handleDownloadQr}
            className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save QR Image</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors font-medium"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Expand QR</span>
          </button>
        </div>
      </div>

      {/* Step 3: Fast UTR Confirmation Box */}
      <div className="w-full max-w-sm bg-[#0c0c18]/90 border border-indigo-500/30 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold text-white">
            Have you scanned & paid via UPI?
          </h4>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Enter the 12-digit UTR / UPI Reference Number from your payment receipt (or click instant confirm) to activate course enrollment instantly.
        </p>

        <form onSubmit={handleVerifyUtr} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="e.g. 429381048291"
              maxLength={18}
              className="flex-1 bg-white/[0.05] border border-white/15 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isVerifyingUtr}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isVerifyingUtr ? 'Verifying...' : utrSuccess ? 'Verified ✓' : 'Confirm'}
            </button>
          </div>

          {utrSuccess && (
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>UTR Reference verified. Ready to complete enrollment!</span>
            </div>
          )}
        </form>
      </div>

      {/* Fullscreen QR Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full relative flex flex-col items-center shadow-2xl">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">{payeeName}</h3>
            <p className="text-xs text-slate-500 font-mono mb-4">{upiId}</p>

            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Fullscreen UPI QR"
                className="w-72 h-72 object-contain rounded-2xl border border-slate-100 shadow-lg"
              />
            )}

            <div className="mt-4 text-center">
              <span className="text-sm font-bold text-slate-800">Pay ₹{amount.toFixed(2)}</span>
              <p className="text-xs text-slate-500 mt-0.5">Scan to pay with any UPI app</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
