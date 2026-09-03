import { AchievementBadge, Course, StudentUser } from '../types';

export interface StudentAcademicStats {
  highestCourseCompletion: number;
  completedCoursesCount: number;
  averageCourseCompletion: number;
  highestQuizScore: number;
  averageQuizScore: number;
  totalQuizzesTaken: number;
  studyHours: number;
  attendancePct: number;
}

export const BASE_ACHIEVEMENT_BADGES: Omit<AchievementBadge, 'currentValue' | 'progressPct' | 'unlocked' | 'unlockedDate'>[] = [
  // 1. Course Completion Badges
  {
    id: 'badge-course-starter',
    title: 'First Step Scholar',
    subtitle: 'Initiated course journey',
    description: 'Achieve at least 25% completion in any enrolled academic course.',
    category: 'course_completion',
    tier: 'bronze',
    iconName: 'Compass',
    criteriaType: 'course_completion',
    thresholdText: '≥25% in any course',
    requiredValue: 25,
    maxProgress: 25,
    xpReward: 100,
    rarity: 'Common',
    verificationHash: 'EDU-ACH-FST-25',
    perks: ['Unlocked Stage 1 Learning Path', '+100 Academic XP']
  },
  {
    id: 'badge-halfway-hero',
    title: 'Syllabus Sprinter',
    subtitle: 'Crossed the midway threshold',
    description: 'Reach 50% or higher completion in any core syllabus course.',
    category: 'course_completion',
    tier: 'silver',
    iconName: 'Flame',
    criteriaType: 'course_completion',
    thresholdText: '≥50% in any course',
    requiredValue: 50,
    maxProgress: 50,
    xpReward: 250,
    rarity: 'Rare',
    verificationHash: 'EDU-ACH-MID-50',
    perks: ['Mid-Term Review Guide Unlocked', '+250 Academic XP']
  },
  {
    id: 'badge-course-finisher',
    title: 'Course Finisher',
    subtitle: '100% Course Completion',
    description: 'Fully complete 100% of all lectures, modules, and exercises in a course.',
    category: 'course_completion',
    tier: 'gold',
    iconName: 'CheckCircle2',
    criteriaType: 'course_completion',
    thresholdText: '100% in 1 course',
    requiredValue: 100,
    maxProgress: 100,
    xpReward: 500,
    rarity: 'Epic',
    verificationHash: 'EDU-ACH-FIN-100',
    perks: ['Official Course Certificate', '+500 Academic XP', 'Eligible for Honor Roll']
  },
  {
    id: 'badge-dual-discipline',
    title: 'Dual Discipline Master',
    subtitle: 'Multi-course Mastery',
    description: 'Complete 100% across two or more separate specialized academic tracks.',
    category: 'course_completion',
    tier: 'platinum',
    iconName: 'Layers',
    criteriaType: 'course_completion',
    thresholdText: 'Complete 2+ courses 100%',
    requiredValue: 2,
    maxProgress: 2,
    xpReward: 800,
    rarity: 'Epic',
    verificationHash: 'EDU-ACH-DUAL-200',
    perks: ['Cross-Department Recognition', '+800 Academic XP', 'Direct Faculty Mentorship']
  },
  {
    id: 'badge-grand-curriculum',
    title: 'Grand Curriculum Laureate',
    subtitle: '75%+ Overall Across All Courses',
    description: 'Maintain an average completion percentage of 75% or higher across all active enrolled courses.',
    category: 'course_completion',
    tier: 'legendary',
    iconName: 'Crown',
    criteriaType: 'course_completion',
    thresholdText: '≥75% average across all courses',
    requiredValue: 75,
    maxProgress: 75,
    xpReward: 1200,
    rarity: 'Legendary',
    verificationHash: 'EDU-ACH-LAUR-750',
    perks: ['Dean’s Scholar Distinction', '+1200 Academic XP', 'Priority Research Lab Access']
  },

  // 2. Quiz Scores & Assessment Badges
  {
    id: 'badge-quiz-pass',
    title: 'Assessment Initiate',
    subtitle: 'Passed first formal test',
    description: 'Score 60% or higher in any institutional timed MCQ assessment.',
    category: 'quiz_score',
    tier: 'bronze',
    iconName: 'BookOpenCheck',
    criteriaType: 'quiz_score',
    thresholdText: 'Score ≥60% in a quiz',
    requiredValue: 60,
    maxProgress: 60,
    xpReward: 100,
    rarity: 'Common',
    verificationHash: 'EDU-ACH-QZ-60',
    perks: ['Assessment Analytics Access', '+100 Academic XP']
  },
  {
    id: 'badge-quiz-distinction',
    title: 'Quiz Distinction',
    subtitle: 'Exceeded 80% mark',
    description: 'Attain a score of 80% or greater in a timed subject assessment.',
    category: 'quiz_score',
    tier: 'silver',
    iconName: 'Sparkles',
    criteriaType: 'quiz_score',
    thresholdText: 'Score ≥80% in a quiz',
    requiredValue: 80,
    maxProgress: 80,
    xpReward: 300,
    rarity: 'Rare',
    verificationHash: 'EDU-ACH-QZ-80',
    perks: ['Top 20% Percentile Badge', '+300 Academic XP']
  },
  {
    id: 'badge-quiz-virtuoso',
    title: 'Assessment Virtuoso',
    subtitle: 'Score ≥90% on Timed Test',
    description: 'Deliver exceptional precision with a 90% or higher score in rigorous timed testing.',
    category: 'quiz_score',
    tier: 'gold',
    iconName: 'Award',
    criteriaType: 'quiz_score',
    thresholdText: 'Score ≥90% in a quiz',
    requiredValue: 90,
    maxProgress: 90,
    xpReward: 600,
    rarity: 'Epic',
    verificationHash: 'EDU-ACH-QZ-90',
    perks: ['Top 5% Institutional Ranking', '+600 Academic XP', 'Exempt from Remedial Drills']
  },
  {
    id: 'badge-perfect-century',
    title: 'Centurion 100% Precision',
    subtitle: 'Flawless 100% Score',
    description: 'Achieve a flawless 100% score (20/20 correct) with zero errors on any live assessment.',
    category: 'quiz_score',
    tier: 'diamond',
    iconName: 'Gem',
    criteriaType: 'quiz_score',
    thresholdText: 'Score 100% in a quiz',
    requiredValue: 100,
    maxProgress: 100,
    xpReward: 1000,
    rarity: 'Legendary',
    verificationHash: 'EDU-ACH-QZ-100',
    perks: ['Flawless Solver Diamond Frame', '+1000 Academic XP', 'Featured on Academy Wall of Fame']
  },
  {
    id: 'badge-mastery-titan',
    title: 'Dean\'s Triple Crown',
    subtitle: 'Course + Quiz + Attendance Supremacy',
    description: 'Combine ≥70% course progress, ≥85% average quiz score, and ≥90% digital attendance.',
    category: 'mastery',
    tier: 'legendary',
    iconName: 'Medal',
    criteriaType: 'mastery',
    thresholdText: '≥70% Course, ≥85% Quiz, ≥90% Attendance',
    requiredValue: 100,
    maxProgress: 100,
    xpReward: 1500,
    rarity: 'Legendary',
    verificationHash: 'EDU-ACH-TRIPLE-CROWN',
    perks: ['President’s Gold Seal', '+1500 Academic XP', 'Institutional Fellowship Grant']
  },

  // 3. Attendance & Study Hours Badges
  {
    id: 'badge-attendance-hawk',
    title: 'Clockwork Scholar',
    subtitle: 'Punctual & Present',
    description: 'Maintain an institutional verified attendance record of 90% or higher.',
    category: 'attendance',
    tier: 'silver',
    iconName: 'CalendarCheck2',
    criteriaType: 'attendance',
    thresholdText: '≥90% Attendance',
    requiredValue: 90,
    maxProgress: 90,
    xpReward: 250,
    rarity: 'Rare',
    verificationHash: 'EDU-ACH-ATT-90',
    perks: ['100% Attendance Hall of Fame', '+250 Academic XP']
  },
  {
    id: 'badge-study-marathon',
    title: '100-Hour Focus Titan',
    subtitle: 'Deep Work Mastery',
    description: 'Log over 100 hours of focused digital learning and interactive lecture study.',
    category: 'study_hours',
    tier: 'gold',
    iconName: 'Timer',
    criteriaType: 'study_hours',
    thresholdText: '≥100 Hours Logged',
    requiredValue: 100,
    maxProgress: 100,
    xpReward: 400,
    rarity: 'Epic',
    verificationHash: 'EDU-ACH-HRS-100',
    perks: ['Deep Focus Master Badge', '+400 Academic XP']
  }
];

export function calculateStudentBadges(
  courses: Course[],
  studentUser: StudentUser,
  customQuizScoreOverride?: number,
  customCourseProgressOverride?: number
): {
  badges: AchievementBadge[];
  stats: StudentAcademicStats;
  totalXp: number;
  level: number;
  levelTitle: string;
  nextLevelXp: number;
  unlockedCount: number;
} {
  // Extract student course completion metrics
  const enrolledCourses = courses.filter((c) => c.isEnrolled || (c.enrolledProgress && c.enrolledProgress > 0));
  
  // Calculate highest course completion
  let highestCourseCompletion = 0;
  let completedCoursesCount = 0;
  let sumCompletion = 0;

  enrolledCourses.forEach((c) => {
    const progress = customCourseProgressOverride !== undefined 
      ? Math.max(c.enrolledProgress || 0, customCourseProgressOverride)
      : (c.enrolledProgress || 0);

    if (progress > highestCourseCompletion) {
      highestCourseCompletion = progress;
    }
    if (progress >= 100) {
      completedCoursesCount++;
    }
    sumCompletion += progress;
  });

  const averageCourseCompletion = enrolledCourses.length > 0 
    ? Math.round(sumCompletion / enrolledCourses.length) 
    : (customCourseProgressOverride || 45);

  if (highestCourseCompletion === 0 && customCourseProgressOverride) {
    highestCourseCompletion = customCourseProgressOverride;
  } else if (highestCourseCompletion === 0) {
    highestCourseCompletion = 65; // default student baseline (Calculus 65%)
  }

  // Quiz metrics
  const defaultAvgQuiz = studentUser.avgScore || 88;
  const highestQuizScore = customQuizScoreOverride !== undefined 
    ? Math.max(customQuizScoreOverride, 90) 
    : 92; // Baseline student quiz score (Math Quiz 92%)
  
  const averageQuizScore = customQuizScoreOverride !== undefined
    ? Math.round((defaultAvgQuiz + customQuizScoreOverride) / 2)
    : defaultAvgQuiz;

  const attendancePct = studentUser.overallAttendancePct || 94;
  const studyHours = studentUser.studyHours || 128;

  const stats: StudentAcademicStats = {
    highestCourseCompletion,
    completedCoursesCount,
    averageCourseCompletion,
    highestQuizScore,
    averageQuizScore,
    totalQuizzesTaken: 8,
    studyHours,
    attendancePct
  };

  // Map each badge against current stats
  let totalXp = 0;
  let unlockedCount = 0;

  const badges: AchievementBadge[] = BASE_ACHIEVEMENT_BADGES.map((b) => {
    let currentValue = 0;
    let unlocked = false;
    let progressPct = 0;

    switch (b.id) {
      case 'badge-course-starter':
        currentValue = highestCourseCompletion;
        unlocked = currentValue >= 25;
        progressPct = Math.min(100, Math.round((currentValue / 25) * 100));
        break;

      case 'badge-halfway-hero':
        currentValue = highestCourseCompletion;
        unlocked = currentValue >= 50;
        progressPct = Math.min(100, Math.round((currentValue / 50) * 100));
        break;

      case 'badge-course-finisher':
        currentValue = highestCourseCompletion;
        unlocked = highestCourseCompletion >= 100 || completedCoursesCount >= 1;
        progressPct = Math.min(100, Math.round((highestCourseCompletion / 100) * 100));
        break;

      case 'badge-dual-discipline':
        currentValue = completedCoursesCount;
        unlocked = completedCoursesCount >= 2;
        progressPct = Math.min(100, Math.round((completedCoursesCount / 2) * 100));
        break;

      case 'badge-grand-curriculum':
        currentValue = averageCourseCompletion;
        unlocked = averageCourseCompletion >= 75;
        progressPct = Math.min(100, Math.round((averageCourseCompletion / 75) * 100));
        break;

      case 'badge-quiz-pass':
        currentValue = highestQuizScore;
        unlocked = highestQuizScore >= 60;
        progressPct = Math.min(100, Math.round((highestQuizScore / 60) * 100));
        break;

      case 'badge-quiz-distinction':
        currentValue = highestQuizScore;
        unlocked = highestQuizScore >= 80;
        progressPct = Math.min(100, Math.round((highestQuizScore / 80) * 100));
        break;

      case 'badge-quiz-virtuoso':
        currentValue = highestQuizScore;
        unlocked = highestQuizScore >= 90;
        progressPct = Math.min(100, Math.round((highestQuizScore / 90) * 100));
        break;

      case 'badge-perfect-century':
        currentValue = highestQuizScore;
        unlocked = highestQuizScore >= 100;
        progressPct = Math.min(100, Math.round((highestQuizScore / 100) * 100));
        break;

      case 'badge-attendance-hawk':
        currentValue = attendancePct;
        unlocked = attendancePct >= 90;
        progressPct = Math.min(100, Math.round((attendancePct / 90) * 100));
        break;

      case 'badge-study-marathon':
        currentValue = studyHours;
        unlocked = studyHours >= 100;
        progressPct = Math.min(100, Math.round((studyHours / 100) * 100));
        break;

      case 'badge-mastery-titan':
        // Combo: >=70% course progress, >=85% quiz, >=90% attendance
        const cScore = Math.min(1, highestCourseCompletion / 70);
        const qScore = Math.min(1, highestQuizScore / 85);
        const aScore = Math.min(1, attendancePct / 90);
        const combined = Math.round(((cScore + qScore + aScore) / 3) * 100);
        currentValue = combined;
        unlocked = highestCourseCompletion >= 70 && highestQuizScore >= 85 && attendancePct >= 90;
        progressPct = Math.min(100, combined);
        break;

      default:
        currentValue = 0;
        unlocked = false;
        progressPct = 0;
    }

    if (unlocked) {
      totalXp += b.xpReward;
      unlockedCount++;
    }

    return {
      ...b,
      currentValue,
      progressPct,
      unlocked,
      unlockedDate: unlocked ? 'Awarded this Semester' : undefined
    };
  });

  // Calculate student level from XP
  // Level 1: 0-400, Level 2: 401-800, Level 3: 801-1400, Level 4: 1401-2200, Level 5: 2201-3200, Level 6: 3201+
  let level = 1;
  let levelTitle = 'Academic Initiate';
  let nextLevelXp = 500;

  if (totalXp >= 3500) {
    level = 7;
    levelTitle = 'Grand Master Laureate';
    nextLevelXp = 5000;
  } else if (totalXp >= 2600) {
    level = 6;
    levelTitle = 'Prime Scholar Virtuoso';
    nextLevelXp = 3500;
  } else if (totalXp >= 1800) {
    level = 5;
    levelTitle = 'Elite Academic Specialist';
    nextLevelXp = 2600;
  } else if (totalXp >= 1200) {
    level = 4;
    levelTitle = 'Advanced Discipline Scholar';
    nextLevelXp = 1800;
  } else if (totalXp >= 700) {
    level = 3;
    levelTitle = 'Syllabus Adept';
    nextLevelXp = 1200;
  } else if (totalXp >= 300) {
    level = 2;
    levelTitle = 'Curriculum Explorer';
    nextLevelXp = 700;
  }

  return {
    badges,
    stats,
    totalXp,
    level,
    levelTitle,
    nextLevelXp,
    unlockedCount
  };
}

export const PEER_HONOR_ROLL = [
  { rank: 1, name: 'Alex Rivera', loginId: 'alex@edu.in', badgesCount: 9, totalXp: 3450, tier: 'Diamond', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'Priya Sharma', loginId: 'priya@edu.in', badgesCount: 8, totalXp: 3100, tier: 'Platinum', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'Rahul Verma', loginId: 'rahul@edu.in', badgesCount: 7, totalXp: 2750, tier: 'Gold', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
  { rank: 4, name: 'Ananya Iyer', loginId: 'ananya@edu.in', badgesCount: 6, totalXp: 2300, tier: 'Gold', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' },
  { rank: 5, name: 'Karthik Raja', loginId: 'karthik@edu.in', badgesCount: 5, totalXp: 1950, tier: 'Silver', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' }
];
