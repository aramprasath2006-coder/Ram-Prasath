import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import {
  WEEKLY_ATTENDANCE_DATA,
  DailyAttendanceMetric,
  WeeklyDataset
} from '../../data/mockWeeklyAttendanceData';
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
  LineChart as LineChartIcon
} from 'lucide-react';

interface WeeklyAttendanceChartProps {
  initialBatch?: string;
  onSelectDay?: (dayMetric: DailyAttendanceMetric) => void;
}

type MetricMode = 'rates' | 'headcount' | 'studyHours' | 'channels';

export const WeeklyAttendanceChart: React.FC<WeeklyAttendanceChartProps> = ({
  initialBatch = 'All Batches',
  onSelectDay
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('current-week');
  const [selectedBatch, setSelectedBatch] = useState<string>(initialBatch);
  const [metricMode, setMetricMode] = useState<MetricMode>('rates');
  const [showTargetLine, setShowTargetLine] = useState<boolean>(true);
  const [showDataPoints, setShowDataPoints] = useState<boolean>(true);
  const [isTableView, setIsTableView] = useState<boolean>(false);
  const [activeHoverPoint, setActiveHoverPoint] = useState<DailyAttendanceMetric | null>(null);

  // Available Timeframes
  const activeDataset: WeeklyDataset = useMemo(() => {
    return (
      WEEKLY_ATTENDANCE_DATA.find((d) => d.timeframeId === selectedTimeframe) ||
      WEEKLY_ATTENDANCE_DATA[0]
    );
  }, [selectedTimeframe]);

  // Available Batches in the active dataset
  const availableBatches = useMemo(() => {
    return Object.keys(activeDataset.byBatch);
  }, [activeDataset]);

  // Current batch chart data
  const chartData: DailyAttendanceMetric[] = useMemo(() => {
    if (activeDataset.byBatch[selectedBatch]) {
      return activeDataset.byBatch[selectedBatch];
    }
    return activeDataset.byBatch['All Batches'] || [];
  }, [activeDataset, selectedBatch]);

  // Derived Summary KPIs
  const currentSummary = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return activeDataset.summary;
    }
    const totalAttRate = chartData.reduce((acc, curr) => acc + curr.attendanceRate, 0);
    const avgAtt = (totalAttRate / chartData.length).toFixed(1);
    const totalLogRate = chartData.reduce((acc, curr) => acc + curr.loginRate, 0);
    const avgLog = (totalLogRate / chartData.length).toFixed(1);

    // Find peak and lowest
    let peak = chartData[0];
    let lowest = chartData[0];
    let totalLogins = 0;

    chartData.forEach((d) => {
      if (d.attendanceRate > peak.attendanceRate) peak = d;
      if (d.attendanceRate < lowest.attendanceRate) lowest = d;
      totalLogins += d.presentCount + d.lateCount;
    });

    return {
      avgAttendance: parseFloat(avgAtt),
      avgLoginRate: parseFloat(avgLog),
      peakDay: peak.day,
      peakRate: peak.attendanceRate,
      lowestDay: lowest.day,
      lowestRate: lowest.attendanceRate,
      totalLogins,
      attendanceDelta: activeDataset.summary.attendanceDelta
    };
  }, [chartData, activeDataset]);

  // Export Data to CSV
  const handleExportCSV = () => {
    const headers = ['Day', 'Date', 'Attendance Rate (%)', 'Login Rate (%)', 'Present', 'Late', 'Absent', 'Total Enrolled', 'Avg Study Hours', 'Biometric', 'Geo-Fence', 'Portal'];
    const rows = chartData.map((d) => [
      d.day,
      d.date,
      d.attendanceRate,
      d.loginRate,
      d.presentCount,
      d.lateCount,
      d.absentCount,
      d.totalEnrolled,
      d.avgStudyHours,
      d.biometricVerified,
      d.geoVerified,
      d.portalVerified
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `weekly-attendance-trend-${selectedBatch.toLowerCase().replace(/\s+/g, '-')}-${selectedTimeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom Recharts Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: DailyAttendanceMetric = payload[0]?.payload;
      return (
        <div className="bg-[#0b0c16]/95 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-4 shadow-2xl text-xs space-y-2.5 min-w-[240px] z-50">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <p className="font-extrabold text-white text-sm">{data?.day}</p>
              <p className="text-[11px] text-slate-400 font-mono">{data?.date}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              data?.attendanceRate >= 90 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              data?.attendanceRate >= 75 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {data?.attendanceRate}% Rate
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                <span>Verified Attendance:</span>
              </span>
              <span className="font-black text-white font-mono">{data?.attendanceRate}%</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block"></span>
                <span>Daily Logins Recorded:</span>
              </span>
              <span className="font-black text-white font-mono">{data?.loginRate}%</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                <span>Avg Study Time:</span>
              </span>
              <span className="font-black text-white font-mono">{data?.avgStudyHours} hrs</span>
            </div>
          </div>

          {/* Headcount pill bar */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold">{data?.presentCount} Present</span>
            <span className="text-amber-400 font-bold">{data?.lateCount} Late</span>
            <span className="text-rose-400 font-bold">{data?.absentCount} Absent</span>
            <span className="text-slate-400 font-mono">Total {data?.totalEnrolled}</span>
          </div>

          {/* Verification channel breakdown */}
          <div className="pt-1.5 text-[10px] text-slate-400 flex items-center justify-between border-t border-white/5 font-mono">
            <span>Bio: {data?.biometricVerified}</span>
            <span>Geo: {data?.geoVerified}</span>
            <span>Web: {data?.portalVerified}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0c0c18]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -right-24 -top-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION: Title, Timeframe selector, Batch picker & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Weekly Student Attendance & Login Trends
                </h3>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-[10px] font-extrabold text-indigo-300 uppercase tracking-wider">
                  Recharts Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{activeDataset.dateRange}</span>
                <span>•</span>
                <span className="text-indigo-400 font-semibold">{selectedBatch}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Controls & Filter Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe selector */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            {WEEKLY_ATTENDANCE_DATA.map((t) => (
              <button
                key={t.timeframeId}
                onClick={() => setSelectedTimeframe(t.timeframeId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedTimeframe === t.timeframeId
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.timeframeLabel}
              </button>
            ))}
          </div>

          {/* Batch Selector */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {availableBatches.map((b) => (
              <option key={b} value={b} className="bg-[#0c0c18] text-white">
                {b}
              </option>
            ))}
          </select>

          {/* Toggle View: Chart vs Table */}
          <button
            onClick={() => setIsTableView(!isTableView)}
            className={`p-2 rounded-xl border transition-all text-xs font-bold flex items-center gap-1.5 ${
              isTableView
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-white/[0.05] text-slate-300 hover:text-white border-white/10 hover:bg-white/10'
            }`}
            title={isTableView ? 'Switch to Recharts line view' : 'Switch to tabular audit view'}
          >
            {isTableView ? <LineChartIcon className="w-4 h-4" /> : <TableIcon className="w-4 h-4" />}
            <span className="hidden sm:inline">{isTableView ? 'Chart' : 'Table'}</span>
          </button>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Download Weekly Attendance Report (.CSV)"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 relative z-10">
        {/* Metric 1: Weekly Average Attendance */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/30 space-y-1 transform hover:scale-[1.025] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Weekly Avg Attendance</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              {currentSummary.avgAttendance}%
            </span>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
              +{currentSummary.attendanceDelta}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Institutional average rate</p>
        </div>

        {/* Metric 2: Weekly Peak Day */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-amber-500/30 space-y-1 transform hover:scale-[1.025] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Peak Day</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-amber-300">
              {currentSummary.peakDay}
            </span>
          </div>
          <p className="text-[10px] text-amber-400/80 font-mono font-bold">
            {currentSummary.peakRate}% Highest Attendance
          </p>
        </div>

        {/* Metric 3: Minimum Regulatory Compliance */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-indigo-500/30 space-y-1 transform hover:scale-[1.025] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>UGC Threshold</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-indigo-300 font-mono">
              +{(currentSummary.avgAttendance - 75).toFixed(1)}%
            </span>
            <span className="text-[11px] text-indigo-400 font-bold">Above 75%</span>
          </div>
          <p className="text-[10px] text-slate-400">Statutory minimum satisfied</p>
        </div>

        {/* Metric 4: Total Weekly Student Logins */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-cyan-500/30 space-y-1 transform hover:scale-[1.025] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Weekly Logins</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              {currentSummary.totalLogins}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Sessions</span>
          </div>
          <p className="text-[10px] text-cyan-400 font-mono">{currentSummary.avgLoginRate}% daily login avg</p>
        </div>
      </div>

      {/* METRIC MODE TABS & CHART CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 relative z-10">
        {/* Metric Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setMetricMode('rates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              metricMode === 'rates'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Attendance & Login Rates (%)
          </button>
          <button
            onClick={() => setMetricMode('headcount')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              metricMode === 'headcount'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Headcount Breakdown (P/L/A)
          </button>
          <button
            onClick={() => setMetricMode('studyHours')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              metricMode === 'studyHours'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Avg Study Hours
          </button>
          <button
            onClick={() => setMetricMode('channels')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              metricMode === 'channels'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Verification Channels
          </button>
        </div>

        {/* Chart View Settings */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showTargetLine}
              onChange={(e) => setShowTargetLine(e.target.checked)}
              className="rounded bg-white/10 border-white/20 text-indigo-600 focus:ring-0 cursor-pointer"
            />
            <span>75% Target Line</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showDataPoints}
              onChange={(e) => setShowDataPoints(e.target.checked)}
              className="rounded bg-white/10 border-white/20 text-indigo-600 focus:ring-0 cursor-pointer"
            />
            <span>Data Markers</span>
          </label>
        </div>
      </div>

      {/* CHART CANVAS / TABLE VIEW */}
      {!isTableView ? (
        <div className="w-full h-80 sm:h-96 relative z-10 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
              onMouseMove={(state: any) => {
                if (state?.activePayload && state.activePayload.length) {
                  setActiveHoverPoint(state.activePayload[0].payload);
                }
              }}
              onMouseLeave={() => setActiveHoverPoint(null)}
            >
              {/* Defs for gradients */}
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="loginGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.20} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="studyHoursGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />

              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#ffffff20' }}
                tick={{ fill: '#94a3b8', fontWeight: 600 }}
              />

              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#ffffff20' }}
                tick={{ fill: '#94a3b8' }}
                domain={
                  metricMode === 'rates'
                    ? [40, 100]
                    : metricMode === 'studyHours'
                    ? [0, 8]
                    : [0, 'dataMax + 2']
                }
                unit={metricMode === 'rates' ? '%' : metricMode === 'studyHours' ? 'h' : ''}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
              />

              {/* Regulatory 75% Minimum Compliance Reference Line */}
              {showTargetLine && metricMode === 'rates' && (
                <ReferenceLine
                  y={75}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: '75% Statutory Minimum',
                    fill: '#f87171',
                    fontSize: 10,
                    position: 'insideBottomRight',
                    fontWeight: 700
                  }}
                />
              )}

              {/* Dynamic Lines based on Metric Mode */}
              {metricMode === 'rates' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="attendanceRate"
                    stroke="none"
                    fill="url(#attendanceGradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="attendanceRate"
                    name="Attendance Rate (%)"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={
                      showDataPoints
                        ? { r: 5, fill: '#10b981', stroke: '#0c0c18', strokeWidth: 2 }
                        : false
                    }
                    activeDot={{ r: 7, fill: '#34d399', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="loginRate"
                    name="Daily Login Rate (%)"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={
                      showDataPoints
                        ? { r: 4, fill: '#6366f1', stroke: '#0c0c18', strokeWidth: 2 }
                        : false
                    }
                    activeDot={{ r: 6, fill: '#818cf8', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </>
              )}

              {metricMode === 'headcount' && (
                <>
                  <Line
                    type="monotone"
                    dataKey="presentCount"
                    name="Present Students"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={showDataPoints ? { r: 4, fill: '#10b981' } : false}
                  />
                  <Line
                    type="monotone"
                    dataKey="lateCount"
                    name="Late Arrivals"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={showDataPoints ? { r: 4, fill: '#f59e0b' } : false}
                  />
                  <Line
                    type="monotone"
                    dataKey="absentCount"
                    name="Absent / Unrecorded"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={showDataPoints ? { r: 4, fill: '#f43f5e' } : false}
                  />
                </>
              )}

              {metricMode === 'studyHours' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="avgStudyHours"
                    stroke="none"
                    fill="url(#studyHoursGradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="avgStudyHours"
                    name="Avg Study Hours"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={showDataPoints ? { r: 5, fill: '#f59e0b', stroke: '#0c0c18', strokeWidth: 2 } : false}
                    activeDot={{ r: 7, fill: '#fbbf24', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </>
              )}

              {metricMode === 'channels' && (
                <>
                  <Line
                    type="monotone"
                    dataKey="biometricVerified"
                    name="Biometric Facial Scanner"
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    dot={showDataPoints ? { r: 4, fill: '#a855f7' } : false}
                  />
                  <Line
                    type="monotone"
                    dataKey="geoVerified"
                    name="Campus Geo-Fence"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    dot={showDataPoints ? { r: 4, fill: '#06b6d4' } : false}
                  />
                  <Line
                    type="monotone"
                    dataKey="portalVerified"
                    name="Web & Mobile Portal"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={showDataPoints ? { r: 4, fill: '#3b82f6' } : false}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* TABULAR SUMMARY VIEW */
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Attendance Rate</th>
                <th className="py-3 px-3 text-right">Daily Logins</th>
                <th className="py-3 px-3 text-center">P / L / A</th>
                <th className="py-3 px-3 text-right">Avg Hours</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {chartData.map((d) => (
                <tr
                  key={d.day}
                  onClick={() => onSelectDay && onSelectDay(d)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-bold text-white">{d.day}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{d.date}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400 font-mono">
                    {d.attendanceRate}%
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-indigo-300 font-mono">
                    {d.loginRate}%
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="text-emerald-400 font-bold">{d.presentCount}</span>
                    <span className="text-slate-500"> / </span>
                    <span className="text-amber-400 font-bold">{d.lateCount}</span>
                    <span className="text-slate-500"> / </span>
                    <span className="text-rose-400 font-bold">{d.absentCount}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-amber-300 font-bold">
                    {d.avgStudyHours} hrs
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      d.attendanceRate >= 90
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                        : d.attendanceRate >= 75
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                    }`}>
                      {d.attendanceRate >= 90 ? 'Optimal' : d.attendanceRate >= 75 ? 'Compliant' : 'Warning'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FOOTER INSIGHTS BAR */}
      <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-center gap-2 text-indigo-300">
          <Info className="w-4 h-4 shrink-0 text-indigo-400" />
          <span>
            <strong>Weekly Attendance Analytics Insight:</strong> {currentSummary.peakDay} recorded peak participation at <strong>{currentSummary.peakRate}%</strong>. Overall institutional compliance is trending at <strong>+{currentSummary.attendanceDelta}%</strong> versus the previous cycle.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">Real-time sync active</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>
    </div>
  );
};
