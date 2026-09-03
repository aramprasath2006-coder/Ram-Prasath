import React, { useState } from 'react';
import { AchievementBadge, StudentUser } from '../../types';
import { 
  X, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Share2, 
  Download, 
  Sparkles, 
  ExternalLink,
  Flame,
  Check,
  QrCode,
  Layers,
  Crown,
  BookOpenCheck,
  Gem,
  Medal,
  CalendarCheck2,
  Timer,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BadgeDetailModalProps {
  badge: AchievementBadge | null;
  studentUser: StudentUser;
  onClose: () => void;
  onNavigateToQuiz?: () => void;
  onNavigateToCourses?: () => void;
}

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  badge,
  studentUser,
  onClose,
  onNavigateToQuiz,
  onNavigateToCourses
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!badge) return null;

  const renderBadgeIcon = (iconName: string, sizeClass = "w-10 h-10") => {
    switch (iconName) {
      case 'Flame': return <Flame className={sizeClass} />;
      case 'CheckCircle2': return <CheckCircle2 className={sizeClass} />;
      case 'Layers': return <Layers className={sizeClass} />;
      case 'Crown': return <Crown className={sizeClass} />;
      case 'BookOpenCheck': return <BookOpenCheck className={sizeClass} />;
      case 'Sparkles': return <Sparkles className={sizeClass} />;
      case 'Award': return <Award className={sizeClass} />;
      case 'Gem': return <Gem className={sizeClass} />;
      case 'Medal': return <Medal className={sizeClass} />;
      case 'CalendarCheck2': return <CalendarCheck2 className={sizeClass} />;
      case 'Timer': return <Timer className={sizeClass} />;
      default: return <Compass className={sizeClass} />;
    }
  };

  const getTierColors = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return {
          border: 'border-amber-700/60',
          bg: 'from-amber-950/80 via-orange-950/40 to-slate-900',
          glow: 'bg-amber-600/20',
          text: 'text-amber-400',
          badgeText: 'bg-amber-900/40 text-amber-300 border-amber-600/40'
        };
      case 'silver':
        return {
          border: 'border-slate-300/60',
          bg: 'from-slate-800/90 via-slate-900/60 to-slate-950',
          glow: 'bg-slate-400/20',
          text: 'text-slate-200',
          badgeText: 'bg-slate-700/40 text-slate-200 border-slate-400/40'
        };
      case 'gold':
        return {
          border: 'border-amber-400/80',
          bg: 'from-amber-900/80 via-yellow-950/40 to-slate-900',
          glow: 'bg-amber-400/30',
          text: 'text-amber-300',
          badgeText: 'bg-amber-500/20 text-amber-300 border-amber-400/50'
        };
      case 'platinum':
        return {
          border: 'border-cyan-400/80',
          bg: 'from-cyan-950/90 via-sky-950/50 to-slate-900',
          glow: 'bg-cyan-500/30',
          text: 'text-cyan-300',
          badgeText: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
        };
      case 'diamond':
        return {
          border: 'border-fuchsia-400/80',
          bg: 'from-fuchsia-950/90 via-purple-950/50 to-slate-900',
          glow: 'bg-fuchsia-500/30',
          text: 'text-fuchsia-300',
          badgeText: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/50'
        };
      case 'legendary':
      default:
        return {
          border: 'border-purple-400/90',
          bg: 'from-purple-950/90 via-indigo-950/60 to-slate-900',
          glow: 'bg-purple-600/40',
          text: 'text-purple-300',
          badgeText: 'bg-purple-500/30 text-purple-200 border-purple-400/60'
        };
    }
  };

  const colors = getTierColors(badge.tier);

  const handleShare = () => {
    navigator.clipboard.writeText(`https://eduflow.institute/credentials/verify/${badge.verificationHash}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleDownload = () => {
    setDownloading(true);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {
      // ignore
    }
    setTimeout(() => {
      setDownloading(false);
      alert(`Academic Certificate for [${badge.title}] has been generated with hash #${badge.verificationHash}. In a production portal, this triggers a cryptographically signed PDF.`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-[#0c0c1a] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden flex flex-col gap-5 max-h-[92vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient */}
        <div className={`absolute -top-20 -right-20 w-56 h-56 ${colors.glow} rounded-full blur-3xl pointer-events-none`} />

        {/* Modal Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${colors.badgeText}`}>
              {badge.tier} Tier • {badge.rarity}
            </span>
            {badge.unlocked && (
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Holographic Badge Emblem */}
        <div className="flex flex-col items-center text-center py-2 relative z-10">
          <div className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br ${colors.bg} border-2 ${colors.border} shadow-2xl flex items-center justify-center p-4 mb-4 group transition-all duration-300 ${!badge.unlocked ? 'opacity-60 grayscale-[40%]' : 'hover:scale-105'}`}>
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none`} />
            
            <div className={colors.text}>
              {renderBadgeIcon(badge.iconName, "w-14 h-14 sm:w-16 sm:h-16")}
            </div>

            {!badge.unlocked && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-3xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-slate-400" />
              </div>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-academy">{badge.title}</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5 max-w-sm">{badge.subtitle}</p>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              +{badge.xpReward} Academic XP
            </span>
          </div>
        </div>

        {/* Badge Description & Criteria */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 space-y-3 relative z-10 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Achievement Objective</span>
            <p className="text-slate-200 mt-1 leading-relaxed">{badge.description}</p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-slate-400">Target Threshold:</span>
            <span className="font-bold text-white bg-black/40 px-2 py-0.5 rounded border border-white/10">{badge.thresholdText}</span>
          </div>

          {/* Current Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Current Advancement</span>
              <span className="font-bold text-white font-mono">{badge.progressPct}% Complete</span>
            </div>
            <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/10">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  badge.unlocked 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                }`}
                style={{ width: `${badge.progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Unlocked Perks & Privileges */}
        <div className="space-y-2 relative z-10">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Granted Perks & Honours</span>
          <div className="space-y-1.5">
            {badge.perks.map((perk, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Verification Stamp */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/25 flex items-center justify-between gap-3 text-xs relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="font-bold text-white">Institutional Hash</div>
              <div className="font-mono text-[10px] text-indigo-300">{badge.verificationHash}</div>
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-400">
            <div>Holder: <span className="font-bold text-white">{studentUser.loginId}</span></div>
            <div className="text-emerald-400 font-semibold">{badge.unlocked ? 'Awarded' : 'Locked'}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 relative z-10 border-t border-white/10">
          {badge.unlocked ? (
            <>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-950/50 active:scale-98 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Verifying Certificate...' : 'Download Certificate'}</span>
              </button>
              <button
                onClick={handleShare}
                className="py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Credential'}</span>
              </button>
            </>
          ) : (
            <>
              {badge.criteriaType === 'quiz_score' && onNavigateToQuiz && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToQuiz();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <BookOpenCheck className="w-4 h-4" />
                  <span>Take Live Quiz to Unlock</span>
                </button>
              )}
              {badge.criteriaType === 'course_completion' && onNavigateToCourses && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToCourses();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <Compass className="w-4 h-4" />
                  <span>Resume Enrolled Courses</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Close</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
