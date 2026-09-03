import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from 'recharts';
import {
  getSevenDayStudySummary,
  DailyStudyLogPoint,
  SevenDayStudySummary
} from '../../utils/studyTimeLogs';
import {
  Clock,
  Flame,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle2,
  Calendar,
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';

interface StudyTimeSparklineProps {
  variant?: 'card' | 'compact' | 'bento';
  onOpenTimerLauncher?: () => void;
  className?: string;
}

export const StudyTimeSparkline: React.FC<StudyTimeSparklineProps> = ({
  variant = 'card',
  onOpenTimerLauncher,
  className = ''
}) => {
  const [summary, setSummary] = useState<SevenDayStudySummary>(() => getSevenDayStudySummary());
  const [hoveredPoint, setHoveredPoint] = useState<DailyStudyLogPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DailyStudyLogPoint | null>(null);

  // Refresh data from storage
  const refreshData = useCallback(() => {
    setSummary(getSevenDayStudySummary());
  }, []);

  // Listen to live study timer events
  useEffect(() => {
    window.addEventListener('storage', refreshData);
    window.addEventListener('studyMinutesUpdated', refreshData);

    return () => {
      window.removeEventListener('storage', refreshData);
      window.removeEventListener('studyMinutesUpdated', refreshData);
    };
  }, [refreshData]);

  // Set default selected point to today
  useEffect(() => {
    if (summary.days.length > 0) {
      setSelectedPoint(summary.days[summary.days.length - 1]);
    }
  }, [summary]);

  const activePoint = hoveredPoint || selectedPoint || summary.days[summary.days.length - 1];

  // Custom Recharts Sparkline Tooltip
  const CustomSparklineTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DailyStudyLogPoint = payload[0].payload;
      return (
        <div className="bg-[#0b0c16]/95 backdrop-blur-md border border-indigo-500/30 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 min-w-[190px] z-50 pointer-events-none">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="font-extrabold text-white text-xs">{data.day} ({data.date})</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              data.goalMet
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            }`}>
              {data.goalMet ? 'Goal Met' : `${data.minutes}m / ${data.targetMinutes}m`}
            </span>
          </div>

          <div className="flex items-baseline justify-between text-slate-300 pt-0.5">
            <span className="text-[11px] text-slate-400">Total Study Time:</span>
            <span className="font-black text-white font-mono text-sm">{data.minutes} mins</span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Focused Sessions:</span>
            <span className="text-indigo-300 font-semibold">{data.sessionsCount} intervals</span>
          </div>

          {data.primarySubject && (
            <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Main Focus:</span>
              <span className="text-amber-300 font-medium truncate max-w-[110px]">{data.primarySubject}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Compact Bento Sparkline (Used in Quick Stats or header pills)
  if (variant === 'compact') {
    return (
      <div className={`flex flex-col justify-between h-full ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>7-Day Study</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 rounded-full">
            +{summary.trendPercentage}%
          </span>
        </div>

        {/* Mini Sparkline Chart */}
        <div className="h-10 w-full my-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={summary.days} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
              <defs>
                <linearGradient id="compactSparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="#818cf8"
                strokeWidth={2}
                fill="url(#compactSparkGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-baseline justify-between text-xs">
          <span className="font-extrabold text-white text-base font-mono">{summary.totalHours}</span>
          <span className="text-[10px] text-slate-400 font-medium">Avg {summary.dailyAverageMinutes}m/d</span>
        </div>
      </div>
    );
  }

  // Bento Card Mini Sparkline (Integrated into Grid)
  if (variant === 'bento') {
    return (
      <div className={`bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/10 shadow-lg shadow-black/20 flex flex-col justify-between hover:border-indigo-500/40 hover:bg-[#111124] transition-all cursor-pointer group ${className}`}>
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 border border-indigo-500/30">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-500/30">
            <TrendingUp className="w-3 h-3" /> +{summary.trendPercentage}%
          </span>
        </div>

        {/* Sparkline Canvas */}
        <div className="h-12 w-full my-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={summary.days} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
              <defs>
                <linearGradient id="bentoSparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#bentoSparkGrad)"
                dot={{ r: 2, fill: '#6366f1' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl sm:text-3xl font-bold text-white font-mono">{summary.totalHours}</p>
            <span className="text-xs text-slate-400">/ 7 days</span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5 group-hover:text-indigo-300 transition-colors">
            Study Activity Sparkline
          </p>
        </div>
      </div>
    );
  }

  // Full Rich Home Screen Card Variant
  return (
    <section className={`bg-[#0c0c18]/85 backdrop-blur-xl rounded-3xl border border-white/10 p-5 sm:p-6 shadow-xl shadow-black/20 relative overflow-hidden transition-all ${className}`}>
      {/* Background Accent Glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center border border-indigo-400/30 shadow-md shadow-indigo-950/40">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                7-Day Study Time Activity
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" /> +{summary.trendPercentage}% vs Prev
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Sourced in real-time from your timer intervals & completed focus sessions.
            </p>
          </div>
        </div>

        {/* Quick Highlights Pill Bar */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-xl text-xs font-bold shadow-2xs">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{summary.goalMetCount}/7 Goals Met</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/10 text-slate-300 px-2.5 py-1 rounded-xl text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono">{summary.totalHours}</span>
          </div>
        </div>
      </div>

      {/* Main KPI Stats Row */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mb-4">
        {/* KPI 1: 7-Day Total */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">7-Day Total</span>
          <p className="text-lg sm:text-xl font-extrabold text-white font-mono">{summary.totalHours}</p>
          <p className="text-[10px] text-indigo-300 font-medium">{summary.totalMinutes} total mins</p>
        </div>

        {/* KPI 2: Daily Average */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Daily Average</span>
          <p className="text-lg sm:text-xl font-extrabold text-white font-mono">{summary.dailyAverageMinutes}m</p>
          <p className="text-[10px] text-slate-400">~{(summary.dailyAverageMinutes / 60).toFixed(1)} hrs/day</p>
        </div>

        {/* KPI 3: Peak Day */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Peak Session</span>
          <p className="text-lg sm:text-xl font-extrabold text-amber-300 font-mono">{summary.peakDay.minutes}m</p>
          <p className="text-[10px] text-amber-400/80 font-medium truncate">{summary.peakDay.day} ({summary.peakDay.date})</p>
        </div>

        {/* KPI 4: Today's Status */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today's Focus</span>
          <div className="flex items-baseline gap-1">
            <p className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">{summary.todayMinutes}m</p>
            <span className="text-[11px] text-slate-400">/ {summary.todayGoalMinutes}m</span>
          </div>
          <p className="text-[10px] text-emerald-400/80 font-medium">
            {summary.isTodayGoalMet ? 'Target Reached!' : `${Math.max(0, summary.todayGoalMinutes - summary.todayMinutes)}m remaining`}
          </p>
        </div>
      </div>

      {/* RECHARTS SPARKLINE CANVAS */}
      <div className="relative z-10 bg-black/40 rounded-2xl p-3 border border-white/10 mb-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 pb-1">
          <span className="font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Study Minutes Progression</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">Daily Target: {summary.todayGoalMinutes}m</span>
        </div>

        <div className="h-32 sm:h-36 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={summary.days}
              margin={{ top: 10, right: 12, left: 12, bottom: 5 }}
              onMouseMove={(state: any) => {
                if (state?.activePayload && state.activePayload.length) {
                  setHoveredPoint(state.activePayload[0].payload);
                }
              }}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="homeSparklineArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                  <stop offset="60%" stopColor="#818cf8" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="day"
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontWeight: 600 }}
              />

              <YAxis hide domain={[0, 'dataMax + 15']} />

              <Tooltip content={<CustomSparklineTooltip />} />

              {/* Goal reference line */}
              <ReferenceLine
                y={summary.todayGoalMinutes}
                stroke="#10b981"
                strokeDasharray="3 3"
                strokeOpacity={0.4}
              />

              <Area
                type="monotone"
                dataKey="minutes"
                stroke="#6366f1"
                strokeWidth={3}
                fill="url(#homeSparklineArea)"
                dot={{
                  r: 4,
                  fill: '#6366f1',
                  stroke: '#0c0c18',
                  strokeWidth: 2
                }}
                activeDot={{
                  r: 6,
                  fill: '#34d399',
                  stroke: '#ffffff',
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-DAY INTERACTIVE DAY CHIPS */}
      <div className="relative z-10 grid grid-cols-7 gap-1.5 sm:gap-2">
        {summary.days.map((item, idx) => {
          const isSelected = activePoint?.day === item.day;
          const isToday = idx === summary.days.length - 1;

          return (
            <button
              key={item.isoDate}
              onClick={() => setSelectedPoint(item)}
              className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[58px] ${
                isSelected
                  ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                  : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className={`text-[11px] font-bold ${isToday ? 'text-indigo-400 font-extrabold' : ''}`}>
                  {item.day === 'Today' ? 'Today' : item.day}
                </span>
                {item.goalMet && (
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                )}
              </div>

              <div className="my-0.5">
                <span className={`text-xs font-mono font-extrabold ${
                  item.minutes >= item.targetMinutes
                    ? 'text-emerald-400'
                    : item.minutes > 0
                    ? 'text-slate-200'
                    : 'text-slate-500'
                }`}>
                  {item.minutes}m
                </span>
              </div>

              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.goalMet ? 'bg-emerald-400' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.round((item.minutes / item.targetMinutes) * 100))}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Inspector Footer for Active Day */}
      {activePoint && (
        <div className="relative z-10 mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              <strong>{activePoint.day} ({activePoint.date}):</strong> Studied <strong className="text-white">{activePoint.minutes} mins</strong> across <strong className="text-indigo-300">{activePoint.sessionsCount} session(s)</strong>
              {activePoint.primarySubject && <> • Focused on <span className="text-amber-300 font-medium">{activePoint.primarySubject}</span></>}.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activePoint.goalMet
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-white/10 text-slate-300 border border-white/10'
            }`}>
              {activePoint.goalMet ? 'Goal Achieved' : `${Math.round((activePoint.minutes / activePoint.targetMinutes) * 100)}% of Goal`}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
