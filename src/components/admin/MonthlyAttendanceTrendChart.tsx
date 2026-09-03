import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  BarChart,
  Cell
} from 'recharts';
import {
  Day30AttendanceMetric,
  GENERATE_30_DAYS_DATA,
  DAY_OF_WEEK_PATTERNS,
  PATTERN_INSIGHTS_30_DAYS,
  TrendPatternInsight
} from '../../data/mock30DaysAttendanceData';
import {
  TrendingUp,
  Calendar,
  Layers,
  Award,
  AlertCircle,
  Clock,
  Sparkles,
  Download,
  Info,
  CheckCircle2,
  Users,
  Activity,
  Table as TableIcon,
  LineChart as LineChartIcon,
  BarChart3,
  Flame,
  ShieldCheck,
  ChevronRight,
  Filter,
  Zap,
  HelpCircle,
  ArrowUpRight,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface MonthlyAttendanceTrendChartProps {
  initialBatch?: string;
  onSelectDay?: (dayMetric: Day30AttendanceMetric) => void;
}

type ChartDisplayMode = 'trend-area' | 'breakdown-bars' | 'study-hours' | 'weekday-patterns';
type RangeFilter = 'all-30' | 'last-14' | 'first-14';

export const MonthlyAttendanceTrendChart: React.FC<MonthlyAttendanceTrendChartProps> = ({
  initialBatch = 'All Batches',
  onSelectDay
}) => {
  const [selectedBatch, setSelectedBatch] = useState<string>(initialBatch);
  const [chartMode, setChartMode] = useState<ChartDisplayMode>('trend-area');
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>('all-30');
  const [showMovingAvg, setShowMovingAvg] = useState<boolean>(true);
  const [showUGCComplianceLine, setShowUGCComplianceLine] = useState<boolean>(true);
  const [selectedDayDetail, setSelectedDayDetail] = useState<Day30AttendanceMetric | null>(null);
  const [isTableView, setIsTableView] = useState<boolean>(false);
  const [showPatternInsights, setShowPatternInsights] = useState<boolean>(true);

  // Batches list
  const availableBatches = [
    'All Batches',
    'Computer Science 2026',
    'GATE Mechanical Elite',
    'UPSC Prelims Batch',
    'Applied Mathematics'
  ];

  // Full 30-Day raw dataset for current batch
  const fullDataset = useMemo(() => {
    return GENERATE_30_DAYS_DATA(selectedBatch);
  }, [selectedBatch]);

  // Filtered dataset according to Range selection
  const chartData = useMemo(() => {
    if (rangeFilter === 'last-14') {
      return fullDataset.slice(16, 30);
    }
    if (rangeFilter === 'first-14') {
      return fullDataset.slice(0, 14);
    }
    return fullDataset;
  }, [fullDataset, rangeFilter]);

  // Aggregate monthly statistical metrics
  const monthlyStats = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return {
        avgAttendance: 0,
        avgLoginRate: 0,
        peakDay: { date: '-', rate: 0 },
        troughDay: { date: '-', rate: 0 },
        totalStudentSessions: 0,
        complianceRate: 100,
        growthDelta: 0
      };
    }

    const totalAttRate = chartData.reduce((acc, curr) => acc + curr.attendanceRate, 0);
    const avgAtt = (totalAttRate / chartData.length).toFixed(1);

    const totalLogRate = chartData.reduce((acc, curr) => acc + curr.loginRate, 0);
    const avgLog = (totalLogRate / chartData.length).toFixed(1);

    let peak = chartData[0];
    let lowest = chartData[0];
    let totalSessions = 0;
    let daysAboveUGC = 0;

    chartData.forEach((d) => {
      if (d.attendanceRate > peak.attendanceRate) peak = d;
      if (d.attendanceRate < lowest.attendanceRate) lowest = d;
      totalSessions += d.presentCount + d.lateCount;
      if (d.attendanceRate >= 75) daysAboveUGC++;
    });

    const firstPoint = chartData[0].attendanceRate;
    const lastPoint = chartData[chartData.length - 1].attendanceRate;
    const delta = (lastPoint - firstPoint).toFixed(1);

    return {
      avgAttendance: parseFloat(avgAtt),
      avgLoginRate: parseFloat(avgLog),
      peakDay: { date: `${peak.shortDate} (${peak.dayOfWeek})`, rate: peak.attendanceRate, notes: peak.notes },
      troughDay: { date: `${lowest.shortDate} (${lowest.dayOfWeek})`, rate: lowest.attendanceRate, notes: lowest.notes },
      totalStudentSessions: totalSessions,
      complianceRate: Math.round((daysAboveUGC / chartData.length) * 100),
      growthDelta: parseFloat(delta)
    };
  }, [chartData]);

  // Export 30-day data to CSV
  const handleExportCSV = () => {
    const headers = [
      'Day Index',
      'Date',
      'Day of Week',
      'Attendance Rate (%)',
      'Login Rate (%)',
      '7-Day Moving Avg (%)',
      'Present Count',
      'Late Count',
      'Absent Count',
      'Excused Count',
      'Total Enrolled',
      'Avg Study Hours',
      'Biometric Verified',
      'Geo-Fence Verified',
      'Portal Verified',
      'Pattern Tag',
      'Observation Notes'
    ];

    const rows = chartData.map((d) => [
      d.dayNumber,
      `"${d.date}"`,
      d.dayOfWeek,
      d.attendanceRate,
      d.loginRate,
      d.movingAvg7Day,
      d.presentCount,
      d.lateCount,
      d.absentCount,
      d.excusedCount,
      d.totalEnrolled,
      d.avgStudyHours,
      d.biometricVerified,
      d.geoVerified,
      d.portalVerified,
      `"${d.patternTag || 'Normal'}"`,
      `"${(d.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `30-day-attendance-trends-${selectedBatch.toLowerCase().replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom Interactive Tooltip for 30-Day Recharts
  const CustomTrendTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: Day30AttendanceMetric = payload[0]?.payload;
      if (!data) return null;

      return (
        <div className="bg-[#0b0c16]/95 backdrop-blur-md border border-indigo-500/40 rounded-2xl p-4 shadow-2xl text-xs space-y-2.5 min-w-[260px] z-50 pointer-events-none">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-sm">{data.date}</span>
                <span className="text-[11px] font-bold text-indigo-400">({data.dayOfWeek})</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Day #{data.dayNumber} of 30-Day Window</p>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                data.attendanceRate >= 90
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : data.attendanceRate >= 75
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {data.attendanceRate}% Rate
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                <span>Verified Attendance:</span>
              </span>
              <span className="font-black text-white font-mono">{data.attendanceRate}%</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
                <span>7-Day Moving Avg:</span>
              </span>
              <span className="font-black text-cyan-300 font-mono">{data.movingAvg7Day}%</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block"></span>
                <span>Portal Logins Recorded:</span>
              </span>
              <span className="font-black text-indigo-300 font-mono">{data.loginRate}%</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                <span>Avg Study Time:</span>
              </span>
              <span className="font-bold text-amber-300 font-mono">{data.avgStudyHours} hrs</span>
            </div>
          </div>

          {/* Student Status Headcount */}
          <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-1 text-[11px] text-center font-mono">
            <div className="p-1 rounded bg-emerald-500/10 text-emerald-300">
              <span className="font-bold">{data.presentCount}</span> Present
            </div>
            <div className="p-1 rounded bg-amber-500/10 text-amber-300">
              <span className="font-bold">{data.lateCount}</span> Late
            </div>
            <div className="p-1 rounded bg-rose-500/10 text-rose-300">
              <span className="font-bold">{data.absentCount}</span> Absent
            </div>
          </div>

          {/* Verification Channel Badges */}
          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5">
            <span>Bio: <strong className="text-slate-200">{data.biometricVerified}</strong></span>
            <span>Geo: <strong className="text-slate-200">{data.geoVerified}</strong></span>
            <span>Web: <strong className="text-slate-200">{data.portalVerified}</strong></span>
          </div>

          {data.notes && (
            <div className="pt-1.5 text-[10px] text-indigo-300 italic bg-indigo-950/40 p-1.5 rounded-lg border border-indigo-500/20">
              💡 {data.notes}
            </div>
          )}

          <div className="text-[9px] text-slate-400 text-center pt-0.5">
            Click point to lock day details
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0c0c18]/90 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5 sm:space-y-6 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER BAR & CONTROLS */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-indigo-950/60 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  30-Day Attendance Trend & Pattern Analyzer
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Recharts Engine</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Long-term behavioral analytics, 7-day moving averages & algorithmic pattern detection (Aug 03 - Sep 01, 2026)
              </p>
            </div>
          </div>
        </div>

        {/* Global Batch & Export Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
          {/* Batch Selector */}
          <div className="relative">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="text-xs font-bold pl-3.5 pr-8 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer shadow-sm transition-all"
            >
              {availableBatches.map((b) => (
                <option key={b} value={b} className="bg-[#0c0c18] text-white">
                  {b}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Timeframe Zoom Filter */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setRangeFilter('all-30')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                rangeFilter === 'all-30'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setRangeFilter('last-14')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                rangeFilter === 'last-14'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Last 14D
            </button>
            <button
              onClick={() => setRangeFilter('first-14')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                rangeFilter === 'first-14'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              First 14D
            </button>
          </div>

          {/* View Toggle (Chart vs Raw Table) */}
          <button
            onClick={() => setIsTableView(!isTableView)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isTableView
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-white/[0.05] hover:bg-white/[0.08] border-white/10 text-slate-300'
            }`}
          >
            {isTableView ? <LineChartIcon className="w-3.5 h-3.5" /> : <TableIcon className="w-3.5 h-3.5" />}
            <span>{isTableView ? 'View Chart' : 'Data Table'}</span>
          </button>

          {/* CSV Export Button */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-black shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 active:scale-95 transition-all"
            title="Download 30-day comprehensive audit report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 30-DAY EXECUTIVE KPI STATS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 relative z-10">
        {/* Metric 1: 30-Day Avg Attendance */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/30 space-y-1 transform hover:scale-[1.025] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>30-Day Avg Rate</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              {monthlyStats.avgAttendance}%
            </span>
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>{monthlyStats.growthDelta >= 0 ? `+${monthlyStats.growthDelta}%` : `${monthlyStats.growthDelta}%`} month gain</span>
          </div>
        </div>

        {/* Metric 2: 30-Day Average Login Rate */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-indigo-500/30 space-y-1 transform hover:scale-[1.025] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Avg Daily Logins</span>
            <Users className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              {monthlyStats.avgLoginRate}%
            </span>
          </div>
          <div className="text-[11px] text-indigo-300 font-medium">
            Portal authentication
          </div>
        </div>

        {/* Metric 3: Peak Day */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-amber-500/30 space-y-1 transform hover:scale-[1.025] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Monthly Peak</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-black text-amber-300 font-mono">
              {monthlyStats.peakDay.rate}%
            </span>
          </div>
          <div className="text-[11px] text-slate-300 truncate" title={monthlyStats.peakDay.date}>
            {monthlyStats.peakDay.date}
          </div>
        </div>

        {/* Metric 4: Lowest Turnout Day */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-rose-500/30 space-y-1 transform hover:scale-[1.025] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Monthly Low</span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-black text-rose-300 font-mono">
              {monthlyStats.troughDay.rate}%
            </span>
          </div>
          <div className="text-[11px] text-slate-300 truncate" title={monthlyStats.troughDay.date}>
            {monthlyStats.troughDay.date}
          </div>
        </div>

        {/* Metric 5: Total Sessions Verified */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-cyan-500/30 space-y-1 transform hover:scale-[1.025] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Verified</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
              {monthlyStats.totalStudentSessions}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Recorded check-ins
          </div>
        </div>

        {/* Metric 6: UGC Compliance Score */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-purple-500/30 space-y-1 transform hover:scale-[1.025] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>UGC Compliance</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-purple-300 font-mono">
              {monthlyStats.complianceRate}%
            </span>
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold">
            Zero regulatory flags
          </div>
        </div>
      </div>

      {/* CHART MODE SWITCHER & CUSTOMIZATION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-black/40 p-2 rounded-2xl border border-white/10 relative z-10">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setChartMode('trend-area')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartMode === 'trend-area'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>30-Day Trend & 7D Moving Avg</span>
          </button>

          <button
            onClick={() => setChartMode('breakdown-bars')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartMode === 'breakdown-bars'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily Status Breakdown</span>
          </button>

          <button
            onClick={() => setChartMode('study-hours')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartMode === 'study-hours'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Study Hours Correlation</span>
          </button>

          <button
            onClick={() => setChartMode('weekday-patterns')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartMode === 'weekday-patterns'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Day-of-Week Pattern Heatmap</span>
          </button>
        </div>

        {/* Toggles: Moving Average & 75% UGC Line */}
        {chartMode === 'trend-area' && (
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white select-none">
              <input
                type="checkbox"
                checked={showMovingAvg}
                onChange={(e) => setShowMovingAvg(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-white/10 border-white/20 text-indigo-600 focus:ring-0"
              />
              <span className="text-cyan-300">7-Day Moving Avg</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white select-none">
              <input
                type="checkbox"
                checked={showUGCComplianceLine}
                onChange={(e) => setShowUGCComplianceLine(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-white/10 border-white/20 text-rose-600 focus:ring-0"
              />
              <span className="text-rose-300">75% UGC Line</span>
            </label>
          </div>
        )}
      </div>

      {/* MAIN CHART CONTAINER OR DATA TABLE */}
      <div className="relative z-10">
        {!isTableView ? (
          <div className="w-full bg-[#0a0b14]/70 border border-white/10 rounded-2xl p-3 sm:p-5">
            {/* VIEW 1: 30-DAY TREND AREA & MOVING AVERAGE */}
            {chartMode === 'trend-area' && (
              <div>
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mb-3 gap-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-500/50"></span>
                      <span className="text-slate-200 font-bold">Daily Verified Attendance (%)</span>
                    </div>
                    {showMovingAvg && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
                        <span className="text-cyan-300 font-bold">7-Day Moving Average</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-indigo-400 inline-block border-t border-dashed border-indigo-400"></span>
                      <span className="text-indigo-300 font-bold">Login Rate (%)</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Hover data point for daily breakdown • Click point to inspect
                  </span>
                </div>

                <div className="h-[320px] sm:h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={chartData}
                      margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
                      onClick={(state: any) => {
                        if (state && state.activePayload && state.activePayload.length) {
                          const clickedData = state.activePayload[0].payload as Day30AttendanceMetric;
                          setSelectedDayDetail(clickedData);
                          if (onSelectDay) onSelectDay(clickedData);
                        }
                      }}
                    >
                      <defs>
                        <linearGradient id="colorAtt30" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorLogin30" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                      <XAxis
                        dataKey="shortDate"
                        stroke="#64748b"
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickLine={{ stroke: '#334155' }}
                        interval={chartData.length > 20 ? 2 : 0}
                      />
                      <YAxis
                        domain={[60, 100]}
                        stroke="#64748b"
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickLine={{ stroke: '#334155' }}
                        tickFormatter={(val) => `${val}%`}
                      />

                      <Tooltip content={<CustomTrendTooltip />} />

                      {/* UGC 75% Regulatory Threshold */}
                      {showUGCComplianceLine && (
                        <ReferenceLine
                          y={75}
                          stroke="#f43f5e"
                          strokeDasharray="4 4"
                          label={{
                            value: 'UGC 75% Threshold',
                            fill: '#f43f5e',
                            fontSize: 10,
                            position: 'insideBottomRight'
                          }}
                        />
                      )}

                      {/* 90% Distinction Benchmark */}
                      <ReferenceLine
                        y={90}
                        stroke="#10b981"
                        strokeOpacity={0.3}
                        strokeDasharray="2 2"
                        label={{
                          value: '90% Target',
                          fill: '#34d399',
                          fontSize: 10,
                          position: 'insideTopRight'
                        }}
                      />

                      {/* Area Fill for Daily Attendance Rate */}
                      <Area
                        type="monotone"
                        dataKey="attendanceRate"
                        name="Attendance Rate"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorAtt30)"
                        dot={{ r: 3, fill: '#10b981', strokeWidth: 1, stroke: '#ffffff' }}
                        activeDot={{ r: 6, fill: '#34d399', stroke: '#ffffff', strokeWidth: 2 }}
                      />

                      {/* Login Rate Line */}
                      <Line
                        type="monotone"
                        dataKey="loginRate"
                        name="Login Rate"
                        stroke="#818cf8"
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                        dot={false}
                      />

                      {/* 7-Day Rolling Moving Average Line */}
                      {showMovingAvg && (
                        <Line
                          type="monotone"
                          dataKey="movingAvg7Day"
                          name="7-Day Moving Avg"
                          stroke="#06b6d4"
                          strokeWidth={2.5}
                          dot={false}
                        />
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* VIEW 2: DAILY COMPOSITION STACKED BAR CHART */}
            {chartMode === 'breakdown-bars' && (
              <div>
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mb-3 gap-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                      <span className="text-slate-200 font-bold">Present</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
                      <span className="text-amber-300 font-bold">Late (After 9AM)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-rose-500 inline-block"></span>
                      <span className="text-rose-300 font-bold">Absent</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-indigo-500 inline-block"></span>
                      <span className="text-indigo-300 font-bold">Excused / Leave</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500">Student headcount distribution per day</span>
                </div>

                <div className="h-[320px] sm:h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
                      onClick={(state: any) => {
                        if (state && state.activePayload && state.activePayload.length) {
                          const clickedData = state.activePayload[0].payload as Day30AttendanceMetric;
                          setSelectedDayDetail(clickedData);
                          if (onSelectDay) onSelectDay(clickedData);
                        }
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                      <XAxis
                        dataKey="shortDate"
                        stroke="#64748b"
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        interval={chartData.length > 20 ? 2 : 0}
                      />
                      <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip content={<CustomTrendTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

                      <Bar dataKey="presentCount" name="Present" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="lateCount" name="Late Arrivals" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="excusedCount" name="On Leave" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="absentCount" name="Absent" stackId="a" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* VIEW 3: STUDY HOURS VS ATTENDANCE RATE CORRELATION */}
            {chartMode === 'study-hours' && (
              <div>
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mb-3 gap-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-amber-400/80 inline-block"></span>
                      <span className="text-amber-300 font-bold">Avg Study Time (Hours) [Left Y-Axis]</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span>
                      <span className="text-emerald-300 font-bold">Attendance Rate (%) [Right Y-Axis]</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Correlation shows days with &gt;4.5h focus reach 95%+ attendance
                  </span>
                </div>

                <div className="h-[320px] sm:h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={chartData}
                      margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
                      onClick={(state: any) => {
                        if (state && state.activePayload && state.activePayload.length) {
                          const clickedData = state.activePayload[0].payload as Day30AttendanceMetric;
                          setSelectedDayDetail(clickedData);
                          if (onSelectDay) onSelectDay(clickedData);
                        }
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                      <XAxis
                        dataKey="shortDate"
                        stroke="#64748b"
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        interval={chartData.length > 20 ? 2 : 0}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#f59e0b"
                        domain={[0, 7]}
                        tick={{ fill: '#fbbf24', fontSize: 11 }}
                        tickFormatter={(val) => `${val}h`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#10b981"
                        domain={[60, 100]}
                        tick={{ fill: '#34d399', fontSize: 11 }}
                        tickFormatter={(val) => `${val}%`}
                      />
                      <Tooltip content={<CustomTrendTooltip />} />

                      <Bar
                        yAxisId="left"
                        dataKey="avgStudyHours"
                        name="Avg Study Hours"
                        fill="#f59e0b"
                        opacity={0.7}
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="attendanceRate"
                        name="Attendance Rate"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#10b981' }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* VIEW 4: WEEKDAY PATTERN HEATMAP & AGGREGATE */}
            {chartMode === 'weekday-patterns' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mb-1 gap-2">
                  <span className="text-slate-200 font-bold">
                    Aggregated Day-of-Week Behavioral Performance (Mon - Sun across 30 Days)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Highlights recurring weekly cycles & drop-off zones
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                  {DAY_OF_WEEK_PATTERNS.map((item) => (
                    <div
                      key={item.dayOfWeek}
                      className={`p-3.5 rounded-2xl border space-y-2 relative overflow-hidden transition-all duration-200 transform hover:scale-105 ${
                        item.avgAttendanceRate >= 95
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : item.avgAttendanceRate >= 90
                          ? 'bg-indigo-950/20 border-indigo-500/30'
                          : 'bg-amber-950/20 border-amber-500/30'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-white">{item.dayOfWeek}</span>
                        <span
                          className="font-mono text-[11px] font-black px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: `${item.color}25`, color: item.color }}
                        >
                          {item.avgAttendanceRate}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.avgAttendanceRate}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>

                      <div className="text-[10px] space-y-1 text-slate-300 font-medium">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Avg Study:</span>
                          <span className="font-mono text-amber-300 font-bold">{item.avgStudyHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Avg Late:</span>
                          <span className="font-mono text-rose-300 font-bold">{item.avgLateCount} / day</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 leading-snug pt-1 border-t border-white/5">
                        {item.patternInsight}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Day-of-week Recharts Bar View */}
                <div className="h-[220px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={DAY_OF_WEEK_PATTERNS}
                      margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                      <XAxis dataKey="dayOfWeek" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis
                        domain={[60, 100]}
                        stroke="#64748b"
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        formatter={(val: any) => [`${val}%`, 'Avg Attendance Rate']}
                        contentStyle={{
                          backgroundColor: '#0b0c16',
                          borderColor: '#6366f1',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="avgAttendanceRate" radius={[6, 6, 0, 0]}>
                        {DAY_OF_WEEK_PATTERNS.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* RAW 30-DAY DATA TABLE VIEW */
          <div className="w-full bg-[#0a0b14]/70 border border-white/10 rounded-2xl overflow-hidden shadow-inner">
            <div className="overflow-x-auto max-h-[420px] custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-[#0e101f] text-slate-300 font-bold border-b border-white/10 shadow-sm">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Day</th>
                    <th className="py-2.5 px-3 text-right">Attendance %</th>
                    <th className="py-2.5 px-3 text-right">7D Moving Avg</th>
                    <th className="py-2.5 px-3 text-right">Login Rate</th>
                    <th className="py-2.5 px-3 text-center">Present</th>
                    <th className="py-2.5 px-3 text-center">Late</th>
                    <th className="py-2.5 px-3 text-center">Absent</th>
                    <th className="py-2.5 px-3 text-right">Avg Study Hours</th>
                    <th className="py-2.5 px-3">Key Observation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {chartData.map((row) => (
                    <tr
                      key={row.dayNumber}
                      onClick={() => {
                        setSelectedDayDetail(row);
                        if (onSelectDay) onSelectDay(row);
                      }}
                      className="hover:bg-white/[0.05] cursor-pointer transition-colors"
                    >
                      <td className="py-2 px-3 text-slate-500 font-sans">{row.dayNumber}</td>
                      <td className="py-2 px-3 text-white font-bold font-sans">{row.date}</td>
                      <td className="py-2 px-3 text-indigo-400 font-sans">{row.dayOfWeek}</td>
                      <td className="py-2 px-3 text-right font-black">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            row.attendanceRate >= 90
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : row.attendanceRate >= 75
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {row.attendanceRate}%
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-cyan-300">{row.movingAvg7Day}%</td>
                      <td className="py-2 px-3 text-right text-indigo-300">{row.loginRate}%</td>
                      <td className="py-2 px-3 text-center text-emerald-400 font-bold">{row.presentCount}</td>
                      <td className="py-2 px-3 text-center text-amber-400">{row.lateCount}</td>
                      <td className="py-2 px-3 text-center text-rose-400">{row.absentCount}</td>
                      <td className="py-2 px-3 text-right text-amber-300">{row.avgStudyHours}h</td>
                      <td className="py-2 px-3 text-slate-400 font-sans text-[11px] truncate max-w-[200px]" title={row.notes}>
                        {row.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SELECTED DAY DETAIL DRAWER / POPUP CARD */}
      {selectedDayDetail && (
        <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-indigo-950/40 border border-indigo-500/40 rounded-2xl p-4 sm:p-5 relative z-10 animate-fade-in shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
                  Day Inspector #{selectedDayDetail.dayNumber}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                  {selectedDayDetail.dayOfWeek}, {selectedDayDetail.date}
                </span>
                {selectedDayDetail.patternTag && selectedDayDetail.patternTag !== 'Normal' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {selectedDayDetail.patternTag}
                  </span>
                )}
              </div>
              <h3 className="text-base font-extrabold text-white">
                Attendance: {selectedDayDetail.attendanceRate}% ({selectedDayDetail.presentCount + selectedDayDetail.lateCount}/{selectedDayDetail.totalEnrolled} active)
              </h3>
            </div>
            <button
              onClick={() => setSelectedDayDetail(null)}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-white/10 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 font-sans block">Biometric Gateway:</span>
              <span className="text-sm font-black text-emerald-400">{selectedDayDetail.biometricVerified} students</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 font-sans block">Geo-Fence Campus:</span>
              <span className="text-sm font-black text-indigo-400">{selectedDayDetail.geoVerified} students</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 font-sans block">Portal Sessions:</span>
              <span className="text-sm font-black text-purple-400">{selectedDayDetail.portalVerified} students</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 font-sans block">Avg Focus Hours:</span>
              <span className="text-sm font-black text-amber-400">{selectedDayDetail.avgStudyHours} hrs</span>
            </div>
          </div>

          {selectedDayDetail.notes && (
            <p className="mt-3 text-xs text-indigo-200 font-medium bg-indigo-900/30 p-2.5 rounded-xl border border-indigo-500/20 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{selectedDayDetail.notes}</span>
            </p>
          )}
        </div>
      )}

      {/* AI PATTERN RECOGNITION INSIGHTS */}
      {showPatternInsights && (
        <div className="space-y-3 relative z-10 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs sm:text-sm font-black text-white tracking-wide uppercase">
                Algorithmic Pattern Recognition (30-Day Analysis)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Generated by institutional trend classifier
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {PATTERN_INSIGHTS_30_DAYS.map((insight) => (
              <div
                key={insight.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-indigo-500/30 transition-all duration-200 transform hover:scale-[1.015] space-y-2 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        insight.type === 'positive'
                          ? 'bg-emerald-400 shadow-sm shadow-emerald-500/50'
                          : insight.type === 'warning'
                          ? 'bg-amber-400 shadow-sm shadow-amber-500/50'
                          : 'bg-indigo-400 shadow-sm shadow-indigo-500/50'
                      }`}
                    />
                    <h4 className="font-extrabold text-white text-xs sm:text-sm">
                      {insight.title}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase font-mono bg-white/10 text-slate-200 shrink-0">
                    {insight.metricImpact}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {insight.description}
                </p>

                <div className="pt-1 text-[11px] text-indigo-300 font-medium flex items-center gap-1.5">
                  <span className="text-indigo-400 font-bold">Action:</span>
                  <span>{insight.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
