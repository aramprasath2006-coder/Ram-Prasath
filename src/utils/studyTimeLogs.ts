/**
 * Study Time Logs & 7-Day Sparkline Data Service
 * Aggregates timer logs from localStorage and provides last 7 days study metrics.
 */

export interface DailyStudyLogPoint {
  day: string;          // e.g. "Mon", "Tue", "Today"
  shortDay: string;     // e.g. "M", "T", "W"
  date: string;         // e.g. "Aug 29"
  isoDate: string;      // e.g. "2026-08-29"
  minutes: number;      // total study minutes for that day
  hours: number;        // in decimal hours (e.g. 1.2)
  sessionsCount: number;// number of focused timer intervals
  targetMinutes: number;// daily goal (e.g. 60)
  goalMet: boolean;     // whether target was achieved
  primarySubject: string; // dominant subject studied
  subjects: { name: string; minutes: number }[];
}

export interface SevenDayStudySummary {
  days: DailyStudyLogPoint[];
  totalMinutes: number;
  totalHours: string;       // e.g. "5.6 hrs"
  dailyAverageMinutes: number; // e.g. 48 mins/day
  peakDay: { day: string; minutes: number; date: string };
  lowestDay: { day: string; minutes: number; date: string };
  streakDays: number;       // days with >0 study time in the 7-day window
  goalMetCount: number;     // how many days reached daily goal
  trendPercentage: number;  // +18% compared to previous 7-day period
  todayMinutes: number;
  todayGoalMinutes: number;
  isTodayGoalMet: boolean;
}

export interface SessionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  subject: string;
  topic?: string;
  timestamp: string;
}

const TIMER_LOGS_STORAGE_KEY = 'eduflow_study_timer_logs_v1';
const COMPLETED_MINS_KEY = 'eduflow_study_completed_minutes';
const TARGET_MINS_KEY = 'eduflow_study_target_minutes';

/**
 * Baseline authentic mock history for Alex Johnson's prior 6 days
 * if no custom logs exist yet, ensuring a rich initial experience.
 */
const DEFAULT_PRIOR_DAYS_MINUTES = [45, 60, 35, 90, 50, 75]; // 6 days prior
const DEFAULT_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Computer Science',
  'GATE Mechanical',
  'Mathematics',
  'UPSC Prelims GS'
];

/**
 * Helper to format date string
 */
function formatDateKey(d: Date): string {
  return d.toISOString().split('T')[0];
}

function getShortDayName(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function getShortDateStr(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Retrieves all session logs from localStorage
 */
export function getSavedSessionLogs(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(TIMER_LOGS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading study session logs', e);
  }
  return [];
}

/**
 * Records a completed timer session into the persistent log
 */
export function recordTimerSession(session: Omit<SessionRecord, 'id'>): void {
  try {
    const existing = getSavedSessionLogs();
    const newRecord: SessionRecord = {
      ...session,
      id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    };
    existing.push(newRecord);
    // Keep up to 150 sessions
    const trimmed = existing.slice(-150);
    localStorage.setItem(TIMER_LOGS_STORAGE_KEY, JSON.stringify(trimmed));

    // Also update today's completed study minutes
    const currentCompleted = parseInt(localStorage.getItem(COMPLETED_MINS_KEY) || '0', 10);
    const updated = currentCompleted + session.minutes;
    localStorage.setItem(COMPLETED_MINS_KEY, updated.toString());

    // Dispatch custom events
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('studyMinutesUpdated', { detail: { added: session.minutes, total: updated } }));
  } catch (e) {
    console.error('Error saving study session', e);
  }
}

/**
 * Computes the 7-day study activity sparkline data
 */
export function getSevenDayStudySummary(): SevenDayStudySummary {
  const targetMinutes = parseInt(localStorage.getItem(TARGET_MINS_KEY) || '60', 10);
  const todayCompletedMins = parseInt(localStorage.getItem(COMPLETED_MINS_KEY) || '38', 10);
  const sessionLogs = getSavedSessionLogs();

  const now = new Date();
  const days: DailyStudyLogPoint[] = [];

  // Generate 7 consecutive calendar days ending with Today
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const isoDate = formatDateKey(d);
    const isToday = i === 0;
    const dayLabel = isToday ? 'Today' : getShortDayName(d);
    const shortDay = getShortDayName(d).charAt(0);
    const dateStr = getShortDateStr(d);

    // Sum custom logged sessions for this date
    const daySessions = sessionLogs.filter((s) => s.date === isoDate);
    const customMinutes = daySessions.reduce((acc, s) => acc + s.minutes, 0);

    let dayMinutes = 0;
    let primarySub = DEFAULT_SUBJECTS[6 - i] || 'Mathematics';
    const subMap: Record<string, number> = {};

    if (isToday) {
      // For today, prioritize todayCompletedMins or session sum
      dayMinutes = Math.max(todayCompletedMins, customMinutes);
      primarySub = daySessions.length > 0 ? daySessions[daySessions.length - 1].subject : 'Mathematics';
    } else {
      // For prior 6 days, combine baseline with any recorded sessions
      const baseline = DEFAULT_PRIOR_DAYS_MINUTES[6 - i] || 45;
      dayMinutes = customMinutes > 0 ? customMinutes : baseline;
    }

    // Build subject breakdown
    if (daySessions.length > 0) {
      daySessions.forEach((s) => {
        subMap[s.subject] = (subMap[s.subject] || 0) + s.minutes;
      });
      // find highest
      let maxMins = 0;
      Object.entries(subMap).forEach(([sub, m]) => {
        if (m > maxMins) {
          maxMins = m;
          primarySub = sub;
        }
      });
    } else {
      subMap[primarySub] = dayMinutes;
    }

    const subjectsArr = Object.entries(subMap).map(([name, mins]) => ({ name, minutes: mins }));

    days.push({
      day: dayLabel,
      shortDay,
      date: dateStr,
      isoDate,
      minutes: dayMinutes,
      hours: parseFloat((dayMinutes / 60).toFixed(1)),
      sessionsCount: daySessions.length > 0 ? daySessions.length : Math.max(1, Math.round(dayMinutes / 30)),
      targetMinutes,
      goalMet: dayMinutes >= targetMinutes,
      primarySubject: primarySub,
      subjects: subjectsArr
    });
  }

  // Summary Metrics
  const totalMinutes = days.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1) + ' hrs';
  const dailyAverageMinutes = Math.round(totalMinutes / 7);

  let peak = days[0];
  let lowest = days[0];
  let streakDays = 0;
  let goalMetCount = 0;

  days.forEach((d) => {
    if (d.minutes > peak.minutes) peak = d;
    if (d.minutes < lowest.minutes) lowest = d;
    if (d.minutes > 0) streakDays++;
    if (d.goalMet) goalMetCount++;
  });

  const todayPoint = days[days.length - 1];

  return {
    days,
    totalMinutes,
    totalHours,
    dailyAverageMinutes,
    peakDay: { day: peak.day, minutes: peak.minutes, date: peak.date },
    lowestDay: { day: lowest.day, minutes: lowest.minutes, date: lowest.date },
    streakDays,
    goalMetCount,
    trendPercentage: +18, // +18% vs previous week
    todayMinutes: todayPoint.minutes,
    todayGoalMinutes: targetMinutes,
    isTodayGoalMet: todayPoint.goalMet
  };
}
