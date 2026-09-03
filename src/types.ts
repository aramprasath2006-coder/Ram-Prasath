export type AppTab = 'home' | 'learning' | 'attendance' | 'profile' | 'mock-tests';

export type ActiveScreen = 
  | 'eduflow-home'
  | 'course-library'
  | 'digital-attendance'
  | 'mcq-assessment'
  | 'checkout'
  | 'payment-success'
  | 'payments-history'
  | 'student-profile'
  | 'student-achievements'
  | 'academic-report'
  | 'subject-mastery'
  | 'admin-attendance'
  | 'student-login'
  | 'rrb-exams'
  | 'flashcards'
  | 'formula-bank'
  | 'exam-readiness'
  | 'ai-tutor'
  | 'elite-home'
  | 'elite-mocks'
  | 'elite-gate'
  | 'elite-report'
  | 'elite-proofs';

export type RRBExamType = 'ntpc' | 'alp' | 'je' | 'group-d' | 'rpf';

export interface RRBQuestion {
  id: number;
  questionNumber: number;
  section: 'General Science' | 'Mathematics' | 'General Intelligence & Reasoning' | 'General Awareness & Railway GK' | 'Basic Science & Engineering';
  prompt: string;
  hindiPrompt?: string;
  options: {
    key: string;
    text: string;
    hindiText?: string;
  }[];
  correctAnswer: string;
  explanation: string;
  shortcutTip?: string;
  topic?: string;
  difficulty?: 'Easy' | 'Moderate' | 'Hard';
}

export interface RRBMockTest {
  id: string;
  title: string;
  examType: RRBExamType;
  stage: 'CBT-1' | 'CBT-2' | 'CBAT (Psycho)' | 'Group D CBT';
  totalQuestions: number;
  totalMarks: number;
  durationMins: number;
  negativeMarking: number; // e.g. 0.33
  totalAttempts: string;
  avgScore: number;
  isLive?: boolean;
  questions: RRBQuestion[];
}

export interface RRBZoneCutoff {
  zoneName: string;
  zoneCode: string;
  headquarters: string;
  activeVacancies: number;
  urCutoff: number;
  obcCutoff: number;
  scCutoff: number;
  stCutoff: number;
  ewsCutoff: number;
  trend: 'High' | 'Moderate' | 'Competitive';
}

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legendary';

export type BadgeCategory = 
  | 'course_completion'
  | 'quiz_score'
  | 'study_hours'
  | 'attendance'
  | 'mastery';

export interface AchievementBadge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  iconName: string; // Lucide icon identifier
  criteriaType: 'course_completion' | 'quiz_score' | 'study_hours' | 'attendance' | 'mastery';
  thresholdText: string;
  requiredValue: number; // e.g. 100 for 100% course completion, 90 for 90% score, 100 for 100 hrs
  currentValue: number;
  maxProgress: number;
  progressPct: number;
  unlocked: boolean;
  unlockedDate?: string;
  xpReward: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  verificationHash: string;
  perks: string[];
}

export type AppMode = 'eduflow' | 'elite-academy';

export interface EliteStudentProof {
  studentId: string;
  studentName: string;
  studentLoginId: string;
  rollNo: string;
  // Student Photo Proof
  photoUrl: string;
  photoUploadDate: string;
  photoVerified: boolean;
  // Aadhaar Details
  aadhaarNumber: string; // 12 digits formatted e.g. "5489 1234 5678"
  aadhaarName: string;
  aadhaarDob: string;
  aadhaarGender: 'Male' | 'Female' | 'Other';
  aadhaarDocFrontUrl: string;
  aadhaarDocBackUrl?: string;
  aadhaarVerificationStatus: 'Verified' | 'Pending Review' | 'Not Uploaded';
  aadhaarLastUpdated: string;
  // Emergency Contact Details
  emergencyContactName: string;
  emergencyContactRelation: 'Father' | 'Mother' | 'Guardian' | 'Spouse' | 'Sibling' | 'Other';
  emergencyContactPhone: string;
  emergencyContactSecondaryPhone?: string;
  emergencyContactEmail?: string;
  emergencyAddress: string;
  emergencyBloodGroup?: string;
  emergencyContactVerified: boolean;
  // Elite Verification
  overallStatus: 'Verified' | 'Pending Review' | 'Action Required';
  verificationTimestamp: string;
  verifiedByOfficer?: string;
  eliteEnrollmentCategory: 'UPSC Civil Services' | 'GATE Mechanical' | 'IES / ESE' | 'State PSC Elite';
  examRollNumber: string;
}

export interface StudentUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  loginId: string; // Must follow format: <name>@edu.in (e.g. alex@edu.in, priya@edu.in)
  email: string;   // Institutional @edu.in address
  dob: string;     // Display format e.g. "15/08/2004"
  dobPassword: string; // Format DDMMYYYY e.g. "15082004"
  rollNo: string;
  batch: string;
  department: string;
  semester: string;
  avatar: string;
  phone: string;
  parentContact?: string;
  overallAttendancePct: number;
  studyHours: number;
  enrolledCoursesCount: number;
  avgScore: number;
  totalAttended: number;
  totalClasses: number;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  subject: string;
  price: number; // 0 for Free, 10 to 50 for school courses
  isFree?: boolean;
  rating: number;
  reviewsCount: string;
  duration: string;
  description: string;
  imageUrl: string;
  chaptersCount?: number;
  subjectsCount?: number;
  enrolledProgress?: number; // 0-100
  isEnrolled?: boolean;
  isBookmarked?: boolean; // Saved for later / Favorite
  instructor?: string;
  level?: string;
  gradeLevel?: 'Class 6' | 'Class 7' | 'Class 8' | 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12' | 'Higher Ed' | 'Competitive';
  isSchoolStudentExclusive?: boolean;
  videoCostPerModule?: number; // ₹10 - ₹50
  syllabusBoard?: string;
  keyTopics?: string[];
  youtubeVideoId?: string;
}

export interface Question {
  id: number;
  questionNumber: number;
  totalQuestions: number;
  prompt: string;
  latexFormula?: string;
  options: {
    key: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number; // credits or currency
  type: 'purchase' | 'refund' | 'fund_added';
  status: 'success' | 'failed';
  icon: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  time: string;
  type: 'Check-in' | 'Check-out';
  status: 'Verified' | 'Late';
  method: 'Facial Recognition' | 'Geo-Fence';
  location: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  location: string;
  type: 'lab' | 'virtual' | 'lecture';
  isActive?: boolean;
}

export interface StudentActivityLogItem {
  id: string;
  time: string;
  action: string;
  type: 'login' | 'attendance' | 'quiz' | 'video' | 'override';
  details?: string;
}

export interface StudentAttendance {
  id: string;
  name: string;
  rollNo: string;
  loginId: string; // e.g. "alex@edu.in"
  email: string;   // e.g. "alex@edu.in"
  dob: string;     // e.g. "15/08/2004"
  dobPassword: string; // e.g. "15082004"
  avatar: string;
  batch: string;
  department: string;
  hasLoggedInToday: boolean;
  todayLoginTime: string | null;
  loginMethod: 'Web Portal' | 'Mobile App' | 'Biometric Kiosk' | 'Campus WiFi' | null;
  deviceInfo: string;
  ipAddress: string;
  attendanceStatus: 'Present' | 'Late' | 'Absent' | 'Excused';
  checkInTime: string | null;
  checkOutTime: string | null;
  verificationMethod: 'Facial Recognition' | 'Geo-Fence' | 'Portal Login' | 'Manual Faculty Override' | null;
  location: string;
  isOnline: boolean;
  studyHoursToday: number;
  overallAttendancePct: number;
  totalAttended: number;
  totalClasses: number;
  lastActiveAgo: string;
  phone?: string;
  parentContact?: string;
  activityHistory: StudentActivityLogItem[];
}

export type FlashcardCategory = 'all' | 'gate-me' | 'rrb-railway' | 'math' | 'aptitude' | 'polity';

export interface Flashcard {
  id: string;
  category: 'gate-me' | 'rrb-railway' | 'math' | 'aptitude' | 'polity';
  categoryLabel: string;
  subtopic: string;
  question: string;
  answer: string;
  formula?: string;
  tip?: string;
  mnemonic?: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  mastered?: boolean;
  boxLevel: 1 | 2 | 3 | 4; // Leitner spaced repetition box (1=New, 4=Mastered)
  lastReviewed?: string;
}

export interface FormulaItem {
  id: string;
  category: 'GATE Mechanical' | 'Railway Science' | 'Engineering Math' | 'Quantitative Aptitude' | 'UPSC General Studies';
  subject: string;
  title: string;
  formula: string;
  variables: { symbol: string; meaning: string; unit?: string }[];
  description: string;
  keyApplications: string[];
  commonPitfalls: string;
  examSignificance: 'Ultra High Yield' | 'Frequently Tested' | 'Conceptual';
  tags: string[];
  isBookmarked?: boolean;
}

export interface ExamDiagnosticCategory {
  category: string;
  scorePct: number;
  weightPct: number;
  status: 'Strong' | 'Average' | 'Critical Review';
  recommendedDrill: string;
  actionItem: string;
}

export interface ExamDiagnostic {
  examId: string;
  examName: string;
  targetDate: string;
  daysLeft: number;
  overallReadinessPct: number;
  predictedPercentile: number;
  predictedScore: number;
  totalPossibleScore: number;
  categoryScores: ExamDiagnosticCategory[];
  sprintPlan: {
    dayRange: string;
    focusArea: string;
    targetActions: string[];
    urgency: 'high' | 'medium' | 'normal';
  }[];
}

