import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  GraduationCap, 
  TrendingUp, 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  Briefcase, 
  Target, 
  RotateCcw,
  ArrowUpRight,
  Building2,
  Users
} from 'lucide-react';

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  trigger: boolean;
}

const AnimatedNumber: React.FC<CounterProps> = ({ end, duration = 2000, suffix = '', trigger }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = Math.floor(easedProgress * end);
      
      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end, duration, trigger]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const AcademicPerformanceStats: React.FC = () => {
  const [inView, setInView] = useState(true);
  const [animationKey, setAnimationKey] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleReplay = () => {
    setInView(false);
    setTimeout(() => {
      setAnimationKey(prev => prev + 1);
      setInView(true);
    }, 100);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="academic-performance-stats"
      ref={sectionRef}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0e0e24] via-[#090915] to-[#070710] p-6 sm:p-8 lg:p-10 shadow-2xl shadow-black/40"
    >
      {/* Subtle background radial glows */}
      <div className="absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Institutional Milestones &amp; Track Record</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-serif-academy">
            Academic Performance Stats
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Measurable, verifiable outcomes reflecting ASCEND STALTECH INDIAA's national competitive exam dominance, high-impact placements, and alumni leadership.
          </p>
        </div>

        <button
          onClick={handleReplay}
          className="inline-flex items-center gap-1.5 self-start md:self-auto px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all active:scale-95 shadow-sm"
          title="Replay animated counter sequence"
        >
          <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Replay Stats</span>
        </button>
      </div>

      {/* The 3 Core Animated Counter Cards */}
      <div key={animationKey} className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-6 sm:mt-8">
        
        {/* Stat Card 1: 1500+ Alumni Passed */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0e0e22]/90 border border-indigo-500/30 p-6 sm:p-7 backdrop-blur-xl shadow-xl hover:border-indigo-400/50 transition-all group flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <GraduationCap className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Alumni Network
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
              <AnimatedNumber end={1500} suffix="+" trigger={inView} duration={2200} />
            </div>

            <h3 className="text-lg font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">
              Alumni Passed
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Total successful graduates from ASCEND STALTECH INDIAA who cleared degree credentials and competitive qualifying benchmarks.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400">Clearance Index</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              99.4% Pass Ratio
            </span>
          </div>
        </div>

        {/* Stat Card 2: 98% Placement Rate */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0c1815]/90 border border-emerald-500/30 p-6 sm:p-7 backdrop-blur-xl shadow-xl hover:border-emerald-400/50 transition-all group flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <Briefcase className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Career Transition
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
              <AnimatedNumber end={98} suffix="%" trigger={inView} duration={2000} />
            </div>

            <h3 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
              Placement Rate
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Consistently verified industry campus recruitments, central and state public enterprise appointments, and research appointments.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400">Median Package</span>
            <span className="font-bold text-emerald-300 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              ₹14.2 LPA Tier-1
            </span>
          </div>
        </div>

        {/* Stat Card 3: Top-tier Exam Selections */}
        <div className="relative overflow-hidden rounded-2xl bg-[#1b140b]/90 border border-amber-500/35 p-6 sm:p-7 backdrop-blur-xl shadow-xl hover:border-amber-400/60 transition-all group flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                National Ranks
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
              <AnimatedNumber end={420} suffix="+" trigger={inView} duration={2400} />
            </div>

            <h3 className="text-lg font-bold text-white mt-1 group-hover:text-amber-300 transition-colors">
              Top-tier Exam Selections
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Official appointments across UPSC Civil Services (IAS/IPS), GATE Engineering AIR Top 100, RRB Gazette cadres, and IES officers.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400">All India Rankers</span>
            <span className="font-bold text-amber-300 flex items-center gap-1 font-mono">
              <Award className="w-3.5 h-3.5" />
              142 in Top-100 AIR
            </span>
          </div>
        </div>

      </div>

      {/* Comprehensive Category Breakdown Ribbon */}
      <div className="relative z-10 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 rounded-2xl p-4 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-white font-mono">320+ Officers</div>
            <div className="text-[11px] text-slate-400">UPSC Prelims &amp; Mains</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30">
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-white font-mono">450+ Qualifiers</div>
            <div className="text-[11px] text-slate-400">GATE &amp; PSU Scientists</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-white font-mono">510+ Selections</div>
            <div className="text-[11px] text-slate-400">RRB NTPC, JE &amp; ALP</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-white font-mono">220+ Corporates</div>
            <div className="text-[11px] text-slate-400">Tier-1 MNC Placements</div>
          </div>
        </div>
      </div>
    </section>
  );
};
