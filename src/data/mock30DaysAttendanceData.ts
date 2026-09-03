export interface Day30AttendanceMetric {
  dayNumber: number;        // 1 to 30
  date: string;             // e.g. "Aug 03, 2026"
  shortDate: string;        // e.g. "03 Aug"
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  weekNumber: number;       // 1, 2, 3, 4, 5
  attendanceRate: number;   // e.g. 92.4%
  loginRate: number;        // e.g. 95.1%
  movingAvg7Day: number;    // 7-day rolling average
  presentCount: number;
  lateCount: number;
  absentCount: number;
  excusedCount: number;
  totalEnrolled: number;
  avgStudyHours: number;
  biometricVerified: number;
  geoVerified: number;
  portalVerified: number;
  patternTag?: 'Peak' | 'Trough' | 'Normal' | 'Holiday' | 'Exam Prep';
  notes?: string;
}

export interface DayOfWeekPattern {
  dayOfWeek: string;
  avgAttendanceRate: number;
  avgLoginRate: number;
  avgLateCount: number;
  avgStudyHours: number;
  patternInsight: string;
  color: string;
}

export interface TrendPatternInsight {
  id: string;
  type: 'positive' | 'warning' | 'info' | 'critical';
  title: string;
  description: string;
  metricImpact: string;
  recommendation: string;
}

// Generate realistic 30-day data starting from Aug 3, 2026 to Sep 1, 2026
export const GENERATE_30_DAYS_DATA = (batchName: string = 'All Batches'): Day30AttendanceMetric[] => {
  const baseEnrolled = batchName === 'All Batches' ? 12 : 
                       batchName === 'Computer Science 2026' ? 5 :
                       batchName === 'GATE Mechanical Elite' ? 3 :
                       batchName === 'UPSC Prelims Batch' ? 2 : 2;

  const rawDayData: {
    dayOffset: number;
    date: string;
    shortDate: string;
    dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
    baseRate: number;
    avgHours: number;
    tag?: 'Peak' | 'Trough' | 'Normal' | 'Holiday' | 'Exam Prep';
    notes?: string;
  }[] = [
    { dayOffset: 1, date: 'Aug 03, 2026', shortDate: '03 Aug', dayOfWeek: 'Mon', baseRate: 88.5, avgHours: 3.8, notes: 'First Monday of month - slight orientation delay' },
    { dayOffset: 2, date: 'Aug 04, 2026', shortDate: '04 Aug', dayOfWeek: 'Tue', baseRate: 91.2, avgHours: 4.1, notes: 'Steady morning login volume' },
    { dayOffset: 3, date: 'Aug 05, 2026', shortDate: '05 Aug', dayOfWeek: 'Wed', baseRate: 94.0, avgHours: 4.6, tag: 'Peak', notes: 'Mid-week lab practical sessions' },
    { dayOffset: 4, date: 'Aug 06, 2026', shortDate: '06 Aug', dayOfWeek: 'Thu', baseRate: 90.5, avgHours: 4.2, notes: 'Regular lecture schedule' },
    { dayOffset: 5, date: 'Aug 07, 2026', shortDate: '07 Aug', dayOfWeek: 'Fri', baseRate: 92.0, avgHours: 4.4, notes: 'Project submission milestones' },
    { dayOffset: 6, date: 'Aug 08, 2026', shortDate: '08 Aug', dayOfWeek: 'Sat', baseRate: 83.3, avgHours: 3.2, tag: 'Trough', notes: 'Weekend optional workshop' },
    { dayOffset: 7, date: 'Aug 09, 2026', shortDate: '09 Aug', dayOfWeek: 'Sun', baseRate: 78.0, avgHours: 2.4, tag: 'Holiday', notes: 'Sunday self-study portal' },

    { dayOffset: 8, date: 'Aug 10, 2026', shortDate: '10 Aug', dayOfWeek: 'Mon', baseRate: 90.0, avgHours: 4.0, notes: 'Week 2 kick-off' },
    { dayOffset: 9, date: 'Aug 11, 2026', shortDate: '11 Aug', dayOfWeek: 'Tue', baseRate: 93.5, avgHours: 4.5, notes: 'High biometric scanner throughput' },
    { dayOffset: 10, date: 'Aug 12, 2026', shortDate: '12 Aug', dayOfWeek: 'Wed', baseRate: 95.8, avgHours: 5.0, tag: 'Peak', notes: 'Guest lecture on System Architecture' },
    { dayOffset: 11, date: 'Aug 13, 2026', shortDate: '13 Aug', dayOfWeek: 'Thu', baseRate: 89.2, avgHours: 4.1, notes: 'Rain disruption in South Campus' },
    { dayOffset: 12, date: 'Aug 14, 2026', shortDate: '14 Aug', dayOfWeek: 'Fri', baseRate: 93.0, avgHours: 4.7, notes: 'Pre-holiday project reviews' },
    { dayOffset: 13, date: 'Aug 15, 2026', shortDate: '15 Aug', dayOfWeek: 'Sat', baseRate: 82.5, avgHours: 3.1, tag: 'Holiday', notes: 'Independence Day Special Session' },
    { dayOffset: 14, date: 'Aug 16, 2026', shortDate: '16 Aug', dayOfWeek: 'Sun', baseRate: 79.5, avgHours: 2.6, tag: 'Holiday', notes: 'Sunday async study tracks' },

    { dayOffset: 15, date: 'Aug 17, 2026', shortDate: '17 Aug', dayOfWeek: 'Mon', baseRate: 89.2, avgHours: 3.9, notes: 'Week 3 morning attendance' },
    { dayOffset: 16, date: 'Aug 18, 2026', shortDate: '18 Aug', dayOfWeek: 'Tue', baseRate: 94.5, avgHours: 4.6, tag: 'Peak', notes: 'Full batch presence in Computer Labs' },
    { dayOffset: 17, date: 'Aug 19, 2026', shortDate: '19 Aug', dayOfWeek: 'Wed', baseRate: 92.0, avgHours: 4.4, notes: 'Math tutorial sessions' },
    { dayOffset: 18, date: 'Aug 20, 2026', shortDate: '20 Aug', dayOfWeek: 'Thu', baseRate: 91.0, avgHours: 4.3, notes: 'Standard lecture tracking' },
    { dayOffset: 19, date: 'Aug 21, 2026', shortDate: '21 Aug', dayOfWeek: 'Fri', baseRate: 90.5, avgHours: 4.1, notes: 'Department seminar' },
    { dayOffset: 20, date: 'Aug 22, 2026', shortDate: '22 Aug', dayOfWeek: 'Sat', baseRate: 84.0, avgHours: 3.4, tag: 'Trough', notes: 'Half-day remedial classes' },
    { dayOffset: 21, date: 'Aug 23, 2026', shortDate: '23 Aug', dayOfWeek: 'Sun', baseRate: 81.0, avgHours: 2.8, tag: 'Holiday', notes: 'Weekend library digital sessions' },

    { dayOffset: 22, date: 'Aug 24, 2026', shortDate: '24 Aug', dayOfWeek: 'Mon', baseRate: 91.6, avgHours: 4.2, notes: 'Week 4 start - prompt arrivals' },
    { dayOffset: 23, date: 'Aug 25, 2026', shortDate: '25 Aug', dayOfWeek: 'Tue', baseRate: 94.2, avgHours: 4.8, notes: 'Zero unexcused absences' },
    { dayOffset: 24, date: 'Aug 26, 2026', shortDate: '26 Aug', dayOfWeek: 'Wed', baseRate: 96.5, avgHours: 5.3, tag: 'Peak', notes: 'Monthly Peak Day: 96.5% Attendance' },
    { dayOffset: 25, date: 'Aug 27, 2026', shortDate: '27 Aug', dayOfWeek: 'Thu', baseRate: 90.0, avgHours: 4.5, notes: 'GATE mock simulation exam' },
    { dayOffset: 26, date: 'Aug 28, 2026', shortDate: '28 Aug', dayOfWeek: 'Fri', baseRate: 94.8, avgHours: 4.9, notes: 'High digital portal activity' },
    { dayOffset: 27, date: 'Aug 29, 2026', shortDate: '29 Aug', dayOfWeek: 'Sat', baseRate: 87.5, avgHours: 3.9, notes: 'Saturday elective lectures' },
    { dayOffset: 28, date: 'Aug 30, 2026', shortDate: '30 Aug', dayOfWeek: 'Sun', baseRate: 82.0, avgHours: 3.0, tag: 'Holiday', notes: 'Sunday test series portal' },

    { dayOffset: 29, date: 'Aug 31, 2026', shortDate: '31 Aug', dayOfWeek: 'Mon', baseRate: 93.8, avgHours: 4.7, tag: 'Exam Prep', notes: 'Month-end assessment review' },
    { dayOffset: 30, date: 'Sep 01, 2026', shortDate: '01 Sep', dayOfWeek: 'Tue', baseRate: 95.2, avgHours: 5.1, tag: 'Peak', notes: 'September cycle opening - Strong turnout' }
  ];

  // Adjust for batch variations
  let batchMultiplier = 1.0;
  if (batchName === 'GATE Mechanical Elite') batchMultiplier = 1.05;
  if (batchName === 'UPSC Prelims Batch') batchMultiplier = 1.03;
  if (batchName === 'Applied Mathematics') batchMultiplier = 0.92;

  const dataset: Day30AttendanceMetric[] = [];
  const movingWindow: number[] = [];

  rawDayData.forEach((item, idx) => {
    let rate = Math.min(100, Math.round(item.baseRate * batchMultiplier * 10) / 10);
    let loginRate = Math.min(100, Math.round((rate + 2.4) * 10) / 10);

    const totalEnrolled = baseEnrolled;
    const presentCount = Math.max(1, Math.round((rate / 100) * totalEnrolled));
    const lateCount = rate > 92 ? 1 : 2;
    const absentCount = Math.max(0, totalEnrolled - presentCount - (lateCount > 0 ? 0 : 0));
    const excusedCount = item.tag === 'Holiday' ? 1 : 0;

    const bio = Math.round(presentCount * 0.55);
    const geo = Math.round(presentCount * 0.30);
    const portal = Math.max(1, presentCount - bio - geo);

    movingWindow.push(rate);
    if (movingWindow.length > 7) {
      movingWindow.shift();
    }
    const movingAvg = Math.round((movingWindow.reduce((a, b) => a + b, 0) / movingWindow.length) * 10) / 10;

    dataset.push({
      dayNumber: item.dayOffset,
      date: item.date,
      shortDate: item.shortDate,
      dayOfWeek: item.dayOfWeek,
      weekNumber: Math.ceil(item.dayOffset / 7),
      attendanceRate: rate,
      loginRate: loginRate,
      movingAvg7Day: movingAvg,
      presentCount,
      lateCount,
      absentCount,
      excusedCount,
      totalEnrolled,
      avgStudyHours: item.avgHours,
      biometricVerified: bio,
      geoVerified: geo,
      portalVerified: portal,
      patternTag: item.tag || 'Normal',
      notes: item.notes
    });
  });

  return dataset;
};

// Day-of-week aggregate pattern analysis
export const DAY_OF_WEEK_PATTERNS: DayOfWeekPattern[] = [
  {
    dayOfWeek: 'Monday',
    avgAttendanceRate: 90.8,
    avgLoginRate: 93.5,
    avgLateCount: 1.8,
    avgStudyHours: 4.1,
    patternInsight: 'High attendance with frequent early morning delays (9:00-9:15 AM).',
    color: '#6366f1' // indigo
  },
  {
    dayOfWeek: 'Tuesday',
    avgAttendanceRate: 94.6,
    avgLoginRate: 97.1,
    avgLateCount: 0.8,
    avgStudyHours: 4.7,
    patternInsight: 'Consistent high punctuality across biometric scanners.',
    color: '#3b82f6' // blue
  },
  {
    dayOfWeek: 'Wednesday',
    avgAttendanceRate: 96.2,
    avgLoginRate: 98.4,
    avgLateCount: 0.4,
    avgStudyHours: 5.2,
    patternInsight: 'Weekly Peak Day: highest overall lab engagement and attendance.',
    color: '#10b981' // emerald
  },
  {
    dayOfWeek: 'Thursday',
    avgAttendanceRate: 90.2,
    avgLoginRate: 93.1,
    avgLateCount: 1.2,
    avgStudyHours: 4.3,
    patternInsight: 'Mid-week stabilization with moderate late check-ins.',
    color: '#8b5cf6' // purple
  },
  {
    dayOfWeek: 'Friday',
    avgAttendanceRate: 93.1,
    avgLoginRate: 95.8,
    avgLateCount: 0.9,
    avgStudyHours: 4.7,
    patternInsight: 'Strong finish driven by project milestones & test reviews.',
    color: '#06b6d4' // cyan
  },
  {
    dayOfWeek: 'Saturday',
    avgAttendanceRate: 84.3,
    avgLoginRate: 88.2,
    avgLateCount: 2.1,
    avgStudyHours: 3.4,
    patternInsight: 'Weekend Trough: optional workshop sessions show 10% lower turnout.',
    color: '#f59e0b' // amber
  },
  {
    dayOfWeek: 'Sunday',
    avgAttendanceRate: 80.0,
    avgLoginRate: 84.5,
    avgLateCount: 0.2,
    avgStudyHours: 2.7,
    patternInsight: 'Asynchronous digital library & practice test access.',
    color: '#64748b' // slate
  }
];

// Key 30-Day Trend Insights identified by algorithmic pattern detector
export const PATTERN_INSIGHTS_30_DAYS: TrendPatternInsight[] = [
  {
    id: 'pattern-1',
    type: 'positive',
    title: 'Consistent Upward Monthly Momentum',
    description: '30-day 7-day moving average climbed from 88.5% in early August to 94.8% by month-end (+6.3% growth).',
    metricImpact: '+6.3% Improvement',
    recommendation: 'Sustained by automated daily WhatsApp login reminders and faculty check-in notices.'
  },
  {
    id: 'pattern-2',
    type: 'info',
    title: 'Wednesday Peak Day Phenomenon',
    description: 'Every Wednesday throughout the 30-day window recorded the highest attendance of the week (averaging 96.2%).',
    metricImpact: '96.2% Peak Avg',
    recommendation: 'Ideal timing for major assessments, project submissions, and core lab practicals.'
  },
  {
    id: 'pattern-3',
    type: 'warning',
    title: 'Monday Punctuality Clustering',
    description: 'Mondays experience 2.2x more "Late" arrivals after 09:00 AM compared to midweek days.',
    metricImpact: '18% Morning Tardiness',
    recommendation: 'Recommend shifting Monday core lectures to 09:30 AM or issuing 8:30 AM early morning transit alerts.'
  },
  {
    id: 'pattern-4',
    type: 'positive',
    title: '100% UGC Regulatory Compliance',
    description: 'All recorded 30 days remained well above the mandatory UGC 75% minimum academic threshold.',
    metricImpact: '30/30 Days Compliant',
    recommendation: 'Institutional compliance score is currently A+ grade for campus accreditation audits.'
  }
];
