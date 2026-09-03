export interface DailyAttendanceMetric {
  day: string;
  date: string;
  shortDate: string;
  attendanceRate: number; // e.g. 91.6%
  loginRate: number;      // e.g. 94.2%
  presentCount: number;
  lateCount: number;
  absentCount: number;
  excusedCount: number;
  totalEnrolled: number;
  avgStudyHours: number;
  onTimeRate: number;
  biometricVerified: number;
  geoVerified: number;
  portalVerified: number;
}

export interface WeeklyDataset {
  timeframeId: string;
  timeframeLabel: string;
  dateRange: string;
  summary: {
    avgAttendance: number;
    avgLoginRate: number;
    peakDay: string;
    peakRate: number;
    lowestDay: string;
    lowestRate: number;
    totalLogins: number;
    attendanceDelta: number; // vs previous period
  };
  byBatch: Record<string, DailyAttendanceMetric[]>;
}

export const WEEKLY_ATTENDANCE_DATA: WeeklyDataset[] = [
  {
    timeframeId: 'current-week',
    timeframeLabel: 'Current Week',
    dateRange: 'Aug 24 - Aug 29, 2026',
    summary: {
      avgAttendance: 92.8,
      avgLoginRate: 95.4,
      peakDay: 'Wednesday',
      peakRate: 96.5,
      lowestDay: 'Saturday',
      lowestRate: 87.5,
      totalLogins: 68,
      attendanceDelta: +2.6
    },
    byBatch: {
      'All Batches': [
        {
          day: 'Mon',
          date: 'Aug 24, 2026',
          shortDate: '24 Aug',
          attendanceRate: 91.6,
          loginRate: 93.3,
          presentCount: 10,
          lateCount: 1,
          absentCount: 1,
          excusedCount: 0,
          totalEnrolled: 12,
          avgStudyHours: 4.2,
          onTimeRate: 83.3,
          biometricVerified: 5,
          geoVerified: 4,
          portalVerified: 2
        },
        {
          day: 'Tue',
          date: 'Aug 25, 2026',
          shortDate: '25 Aug',
          attendanceRate: 94.2,
          loginRate: 96.0,
          presentCount: 11,
          lateCount: 1,
          absentCount: 0,
          excusedCount: 0,
          totalEnrolled: 12,
          avgStudyHours: 4.8,
          onTimeRate: 91.6,
          biometricVerified: 6,
          geoVerified: 4,
          portalVerified: 2
        },
        {
          day: 'Wed',
          date: 'Aug 26, 2026',
          shortDate: '26 Aug',
          attendanceRate: 96.5,
          loginRate: 98.2,
          presentCount: 11,
          lateCount: 0,
          absentCount: 1,
          excusedCount: 0,
          totalEnrolled: 12,
          avgStudyHours: 5.3,
          onTimeRate: 91.6,
          biometricVerified: 7,
          geoVerified: 3,
          portalVerified: 1
        },
        {
          day: 'Thu',
          date: 'Aug 27, 2026',
          shortDate: '27 Aug',
          attendanceRate: 90.0,
          loginRate: 93.5,
          presentCount: 9,
          lateCount: 2,
          absentCount: 1,
          excusedCount: 0,
          totalEnrolled: 12,
          avgStudyHours: 4.5,
          onTimeRate: 75.0,
          biometricVerified: 5,
          geoVerified: 3,
          portalVerified: 3
        },
        {
          day: 'Fri',
          date: 'Aug 28, 2026',
          shortDate: '28 Aug',
          attendanceRate: 94.8,
          loginRate: 97.0,
          presentCount: 10,
          lateCount: 1,
          absentCount: 1,
          excusedCount: 0,
          totalEnrolled: 12,
          avgStudyHours: 4.9,
          onTimeRate: 83.3,
          biometricVerified: 6,
          geoVerified: 3,
          portalVerified: 2
        },
        {
          day: 'Sat (Today)',
          date: 'Aug 29, 2026',
          shortDate: '29 Aug',
          attendanceRate: 87.5,
          loginRate: 91.6,
          presentCount: 8,
          lateCount: 2,
          absentCount: 2,
          excusedCount: 0,
          totalEnrolled: 12,
          avgStudyHours: 3.9,
          onTimeRate: 66.7,
          biometricVerified: 4,
          geoVerified: 3,
          portalVerified: 3
        }
      ],
      'Computer Science 2026': [
        { day: 'Mon', date: 'Aug 24', shortDate: '24 Aug', attendanceRate: 88.0, loginRate: 92.0, presentCount: 4, lateCount: 1, absentCount: 0, excusedCount: 0, totalEnrolled: 5, avgStudyHours: 4.0, onTimeRate: 80.0, biometricVerified: 2, geoVerified: 2, portalVerified: 1 },
        { day: 'Tue', date: 'Aug 25', shortDate: '25 Aug', attendanceRate: 95.0, loginRate: 98.0, presentCount: 5, lateCount: 0, absentCount: 0, excusedCount: 0, totalEnrolled: 5, avgStudyHours: 4.9, onTimeRate: 100.0, biometricVerified: 3, geoVerified: 1, portalVerified: 1 },
        { day: 'Wed', date: 'Aug 26', shortDate: '26 Aug', attendanceRate: 98.0, loginRate: 100.0, presentCount: 5, lateCount: 0, absentCount: 0, excusedCount: 0, totalEnrolled: 5, avgStudyHours: 5.5, onTimeRate: 100.0, biometricVerified: 3, geoVerified: 1, portalVerified: 1 },
        { day: 'Thu', date: 'Aug 27', shortDate: '27 Aug', attendanceRate: 89.0, loginRate: 94.0, presentCount: 4, lateCount: 1, absentCount: 0, excusedCount: 0, totalEnrolled: 5, avgStudyHours: 4.6, onTimeRate: 80.0, biometricVerified: 2, geoVerified: 2, portalVerified: 1 },
        { day: 'Fri', date: 'Aug 28', shortDate: '28 Aug', attendanceRate: 94.0, loginRate: 96.0, presentCount: 4, lateCount: 1, absentCount: 0, excusedCount: 0, totalEnrolled: 5, avgStudyHours: 5.0, onTimeRate: 80.0, biometricVerified: 3, geoVerified: 1, portalVerified: 1 },
        { day: 'Sat (Today)', date: 'Aug 29', shortDate: '29 Aug', attendanceRate: 80.0, loginRate: 85.0, presentCount: 3, lateCount: 1, absentCount: 1, excusedCount: 0, totalEnrolled: 5, avgStudyHours: 3.8, onTimeRate: 60.0, biometricVerified: 2, geoVerified: 1, portalVerified: 1 }
      ],
      'GATE Mechanical Elite': [
        { day: 'Mon', date: 'Aug 24', shortDate: '24 Aug', attendanceRate: 100.0, loginRate: 100.0, presentCount: 3, lateCount: 0, absentCount: 0, excusedCount: 0, totalEnrolled: 3, avgStudyHours: 5.2, onTimeRate: 100.0, biometricVerified: 1, geoVerified: 1, portalVerified: 1 },
        { day: 'Tue', date: 'Aug 25', shortDate: '25 Aug', attendanceRate: 100.0, loginRate: 100.0, presentCount: 3, lateCount: 0, absentCount: 0, excusedCount: 0, totalEnrolled: 3, avgStudyHours: 5.6, onTimeRate: 100.0, biometricVerified: 2, geoVerified: 1, portalVerified: 0 },
        { day: 'Wed', date: 'Aug 26', shortDate: '26 Aug', attendanceRate: 96.0, loginRate: 100.0, presentCount: 3, lateCount: 0, absentCount: 0, excusedCount: 0, totalEnrolled: 3, avgStudyHours: 5.8, onTimeRate: 100.0, biometricVerified: 2, geoVerified: 1, portalVerified: 0 },
        { day: 'Thu', date: 'Aug 27', shortDate: '27 Aug', attendanceRate: 94.0, loginRate: 97.0, presentCount: 3, lateCount: 0, absentCount: 0, excusedCount: 0, totalEnrolled: 3, avgStudyHours: 5.1, onTimeRate: 100.0, biometricVerified: 2, geoVerified: 1, portalVerified: 0 },
        { day: 'Fri', date: 'Aug 28', shortDate: '28 Aug', attendanceRate: 100.0, loginRate: 100.0, presentCount: 3, lateCount: 0, absentCount: 0, excusedCount: 0, totalEnrolled: 3, avgStudyHours: 5.4, onTimeRate: 100.0, biometricVerified: 2, geoVerified: 1, portalVerified: 0 },
        { day: 'Sat (Today)', date: 'Aug 29', shortDate: '29 Aug', attendanceRate: 100.0, loginRate: 100.0, presentCount: 3, lateCount: 0, absentCount: 0, excusedCount: 0, totalEnrolled: 3, avgStudyHours: 4.8, onTimeRate: 100.0, biometricVerified: 1, geoVerified: 1, portalVerified: 1 }
      ],
      'UPSC Prelims Batch': [
        { day: 'Mon', date: 'Aug 24', shortDate: '24 Aug', attendanceRate: 90.0, loginRate: 95.0, presentCount: 2, lateCount: 0, absentCount: 0, excusedCount: 0, totalEnrolled: 2, avgStudyHours: 4.5, onTimeRate: 100.0, biometricVerified: 1, geoVerified: 1, portalVerified: 0 },
        { day: 'Tue', date: 'Aug 25', shortDate: '25 Aug', attendanceRate: 100.0, loginRate: 100.0, presentCount: 2, lateCount: 0, absentCount: 0, excusedCount: 0, totalEnrolled: 2, avgStudyHours: 5.0, onTimeRate: 100.0, biometricVerified: 1, geoVerified: 1, portalVerified: 0 },
        { day: 'Wed', date: 'Aug 26', shortDate: '26 Aug', attendanceRate: 100.0, loginRate: 100.0, presentCount: 2, lateCount: 0, absentCount: 0, excusedCount: 0, totalEnrolled: 2, avgStudyHours: 5.2, onTimeRate: 100.0, biometricVerified: 1, geoVerified: 1, portalVerified: 0 },
        { day: 'Thu', date: 'Aug 27', shortDate: '27 Aug', attendanceRate: 85.0, loginRate: 90.0, presentCount: 1, lateCount: 1, absentCount: 0, excusedCount: 0, totalEnrolled: 2, avgStudyHours: 4.1, onTimeRate: 50.0, biometricVerified: 1, geoVerified: 0, portalVerified: 1 },
        { day: 'Fri', date: 'Aug 28', shortDate: '28 Aug', attendanceRate: 95.0, loginRate: 100.0, presentCount: 2, lateCount: 0, absentCount: 0, excusedCount: 0, totalEnrolled: 2, avgStudyHours: 4.7, onTimeRate: 100.0, biometricVerified: 1, geoVerified: 1, portalVerified: 0 },
        { day: 'Sat (Today)', date: 'Aug 29', shortDate: '29 Aug', attendanceRate: 100.0, loginRate: 100.0, presentCount: 2, lateCount: 0, absentCount: 0, excusedCount: 0, totalEnrolled: 2, avgStudyHours: 4.2, onTimeRate: 100.0, biometricVerified: 1, geoVerified: 1, portalVerified: 0 }
      ],
      'Applied Mathematics': [
        { day: 'Mon', date: 'Aug 24', shortDate: '24 Aug', attendanceRate: 85.0, loginRate: 85.0, presentCount: 1, lateCount: 0, absentCount: 1, excusedCount: 0, totalEnrolled: 2, avgStudyHours: 3.2, onTimeRate: 50.0, biometricVerified: 1, geoVerified: 0, portalVerified: 0 },
        { day: 'Tue', date: 'Aug 25', shortDate: '25 Aug', attendanceRate: 85.0, loginRate: 85.0, presentCount: 1, lateCount: 1, absentCount: 0, excusedCount: 0, totalEnrolled: 2, avgStudyHours: 3.5, onTimeRate: 50.0, biometricVerified: 0, geoVerified: 1, portalVerified: 1 },
        { day: 'Wed', date: 'Aug 26', shortDate: '26 Aug', attendanceRate: 90.0, loginRate: 90.0, presentCount: 1, lateCount: 0, absentCount: 1, excusedCount: 0, totalEnrolled: 2, avgStudyHours: 3.8, onTimeRate: 50.0, biometricVerified: 1, geoVerified: 0, portalVerified: 0 },
        { day: 'Thu', date: 'Aug 27', shortDate: '27 Aug', attendanceRate: 85.0, loginRate: 85.0, presentCount: 1, lateCount: 0, absentCount: 1, excusedCount: 0, totalEnrolled: 2, avgStudyHours: 3.4, onTimeRate: 50.0, biometricVerified: 0, geoVerified: 0, portalVerified: 1 },
        { day: 'Fri', date: 'Aug 28', shortDate: '28 Aug', attendanceRate: 85.0, loginRate: 90.0, presentCount: 1, lateCount: 0, absentCount: 1, excusedCount: 0, totalEnrolled: 2, avgStudyHours: 3.7, onTimeRate: 50.0, biometricVerified: 0, geoVerified: 0, portalVerified: 1 },
        { day: 'Sat (Today)', date: 'Aug 29', shortDate: '29 Aug', attendanceRate: 50.0, loginRate: 60.0, presentCount: 0, lateCount: 1, absentCount: 1, excusedCount: 0, totalEnrolled: 2, avgStudyHours: 2.1, onTimeRate: 0.0, biometricVerified: 0, geoVerified: 0, portalVerified: 1 }
      ]
    }
  },
  {
    timeframeId: 'prev-week',
    timeframeLabel: 'Previous Week',
    dateRange: 'Aug 17 - Aug 22, 2026',
    summary: {
      avgAttendance: 90.2,
      avgLoginRate: 92.8,
      peakDay: 'Tuesday',
      peakRate: 94.5,
      lowestDay: 'Saturday',
      lowestRate: 84.0,
      totalLogins: 64,
      attendanceDelta: +1.4
    },
    byBatch: {
      'All Batches': [
        { day: 'Mon', date: 'Aug 17, 2026', shortDate: '17 Aug', attendanceRate: 89.2, loginRate: 91.5, presentCount: 9, lateCount: 2, absentCount: 1, excusedCount: 0, totalEnrolled: 12, avgStudyHours: 3.9, onTimeRate: 75.0, biometricVerified: 4, geoVerified: 4, portalVerified: 3 },
        { day: 'Tue', date: 'Aug 18, 2026', shortDate: '18 Aug', attendanceRate: 94.5, loginRate: 96.0, presentCount: 11, lateCount: 1, absentCount: 0, excusedCount: 0, totalEnrolled: 12, avgStudyHours: 4.6, onTimeRate: 91.6, biometricVerified: 6, geoVerified: 3, portalVerified: 3 },
        { day: 'Wed', date: 'Aug 19, 2026', shortDate: '19 Aug', attendanceRate: 92.0, loginRate: 94.2, presentCount: 10, lateCount: 1, absentCount: 1, excusedCount: 0, totalEnrolled: 12, avgStudyHours: 4.4, onTimeRate: 83.3, biometricVerified: 5, geoVerified: 4, portalVerified: 2 },
        { day: 'Thu', date: 'Aug 20, 2026', shortDate: '20 Aug', attendanceRate: 91.0, loginRate: 93.0, presentCount: 10, lateCount: 1, absentCount: 1, excusedCount: 0, totalEnrolled: 12, avgStudyHours: 4.3, onTimeRate: 83.3, biometricVerified: 5, geoVerified: 3, portalVerified: 3 },
        { day: 'Fri', date: 'Aug 21, 2026', shortDate: '21 Aug', attendanceRate: 90.5, loginRate: 93.8, presentCount: 9, lateCount: 2, absentCount: 1, excusedCount: 0, totalEnrolled: 12, avgStudyHours: 4.1, onTimeRate: 75.0, biometricVerified: 5, geoVerified: 4, portalVerified: 2 },
        { day: 'Sat', date: 'Aug 22, 2026', shortDate: '22 Aug', attendanceRate: 84.0, loginRate: 88.0, presentCount: 8, lateCount: 2, absentCount: 2, excusedCount: 0, totalEnrolled: 12, avgStudyHours: 3.4, onTimeRate: 66.7, biometricVerified: 4, geoVerified: 2, portalVerified: 4 }
      ]
    }
  },
  {
    timeframeId: 'month-aggregate',
    timeframeLabel: 'Past 4 Weeks (Month)',
    dateRange: 'Aug 03 - Aug 29, 2026',
    summary: {
      avgAttendance: 91.4,
      avgLoginRate: 93.9,
      peakDay: 'Week 3 (Aug 17-22)',
      peakRate: 93.2,
      lowestDay: 'Week 1 (Aug 03-08)',
      lowestRate: 88.6,
      totalLogins: 268,
      attendanceDelta: +4.2
    },
    byBatch: {
      'All Batches': [
        { day: 'W1 (Aug 03-08)', date: 'Aug 03 - 08', shortDate: 'Week 1', attendanceRate: 88.6, loginRate: 90.8, presentCount: 52, lateCount: 11, absentCount: 9, excusedCount: 0, totalEnrolled: 72, avgStudyHours: 3.8, onTimeRate: 72.2, biometricVerified: 28, geoVerified: 22, portalVerified: 13 },
        { day: 'W2 (Aug 10-15)', date: 'Aug 10 - 15', shortDate: 'Week 2', attendanceRate: 90.8, loginRate: 92.5, presentCount: 55, lateCount: 9, absentCount: 8, excusedCount: 0, totalEnrolled: 72, avgStudyHours: 4.2, onTimeRate: 76.4, biometricVerified: 32, geoVerified: 21, portalVerified: 11 },
        { day: 'W3 (Aug 17-22)', date: 'Aug 17 - 22', shortDate: 'Week 3', attendanceRate: 92.4, loginRate: 94.6, presentCount: 57, lateCount: 8, absentCount: 7, excusedCount: 0, totalEnrolled: 72, avgStudyHours: 4.5, onTimeRate: 79.2, biometricVerified: 34, geoVerified: 22, portalVerified: 9 },
        { day: 'W4 (Aug 24-29)', date: 'Aug 24 - 29', shortDate: 'Week 4', attendanceRate: 93.6, loginRate: 96.2, presentCount: 59, lateCount: 7, absentCount: 6, excusedCount: 0, totalEnrolled: 72, avgStudyHours: 4.8, onTimeRate: 81.9, biometricVerified: 36, geoVerified: 21, portalVerified: 9 }
      ]
    }
  }
];
