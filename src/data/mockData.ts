import { Course, Question, Transaction, ScheduleItem, AttendanceRecord } from '../types';
import { SCHOOL_COURSES } from './schoolCoursesData';

export const AVATAR_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnpM6tilQgsfkeilw_JOQfan8ab-XlkeP-6RjrQEikiG-vCZARSETIEgoRfUDCok8FVYwMgSPCk36-CI735nZ8e8O_fQl7xbwumbsoZaGGGGq7iA_QOf-etd-dfdlwH12CodLXfMd-dTLYVQZZkrGgAw_CbZwICE02Njp4kPiSc7vmi02J1jTeDqQjqqyYEl24hx9YYyugf3E0LXF8MsR7PD3flYLZYBEVlfCifP56wC-l2iwlfxtX4w';
export const AVATAR_LARGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNKpx588SFUrXcNFdWVdX1B1Vjku2VNaH5LKP_KqHu_6MpEtWFqumMiW05r2p4KRXeslJzPvscZrOFkiiFq_bE6cSwTLTwBrQcoDdII9TSgKgJOlboG7U-cU3UgQjftkVztIDBqTjpHEf45TgZNN8A1eApF71r0pzrRBdWqM2GvREXPx-HGcUKAppl3FFQORWL2IJ5ZC-KElUXBOXl8m4LDKwYX0SRI-7lbNKaLGOkpNi5f00L8sx6Hg';
export const AVATAR_TEACHER_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIZDGeHJwPxo0Km8O4a7llmD2YGHd1gXafQnRfH1KNreCQsT4Sluhwiaec5ETeTI9GVPEtpSom0jY7hLMdSWa9FjV7G0F-IpmP4B51CBaziossPDyVf1spQWAmW09_DZ00wIJMtmMdCBOcxBOXi5TixqofCGQc9paXd-0I944H27tOZbL4j0GzYFJaBdNZTAZBwDeL-2KNKHQdLuKypaK9hyExsyCfb9NwpPNVGFgyxnkeRih5ofQ9og';
export const CAMERA_BG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPBnq7s9v9R05Mjp83LhbC1zKvRwug6T-T4mmPMEcodgmEwWVY-pyC0Zsr0rzVMLsuqIdI-grWNqQQLRlhIvh8Pk1lAp7e2C4RTElpox5I_KSbHWqZZPMCHU9YsxDuF4xElPUf2XOVk9uhKLv4xO_1dh25sUEqLKPck0hbkz4pNfi8ns6gaTEFNFSDhntSemLR8tfILN2O7AWLKLBUq2hQNJJ8wPGl8aKZrv-172JBVZzKF4ykOJpTiQ';

export const INITIAL_COURSES: Course[] = [
  // Enrolled Courses
  {
    id: 'course-calc',
    title: 'Advanced Calculus',
    category: 'Mathematics',
    subject: 'Mathematics',
    price: 499,
    rating: 4.9,
    reviewsCount: '2.4k',
    duration: '18h 45m',
    description: 'Deep dive into multivariate functions, partial derivatives, double integrals, and series convergence.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBx29rr20mySt5e1S3CdHYdMFm-UX9pnIdgkjkUPDLtBCprOpm0kXuWUhayfh1VDCZJzMaPWBO8aOe9HFlDgj88D1c2Fhs8la8iFXkZ5Tcp3qnGF-ilDe40aL5vc2nJyF3HaSF2F-ra0L1TNhJXQFTiBC9wwHzMy5Q3wBSbHNZmIz-C7sLHXhlhPvG7LW4RIBr05LWXLVIgvn-SCbjFc6RSvP8tjJXUwB4_ugy0VtAAUcfAlQo4UBgefA',
    chaptersCount: 24,
    subjectsCount: 4,
    enrolledProgress: 65,
    isEnrolled: true,
    instructor: 'Dr. Evelyn Reed',
    level: 'Advanced'
  },
  {
    id: 'course-quantum',
    title: 'Quantum Mechanics 101',
    category: 'Physics',
    subject: 'Physics',
    price: 699,
    rating: 4.8,
    reviewsCount: '1.8k',
    duration: '15h 20m',
    description: 'Wave-particle duality, Schrödinger equation, harmonic oscillator, and quantum spin states.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlDqsQP3TN8CTACq9PieTROVl9854T6w-6pqDn9j_2EaHacIGWJzPg1etcGrtt3mGzGPAk8gjczkyUi8XWseAjBeBReEumzonxrkmbEYyfhcWiEr0m_e1EhRYH2oN6uqFxxmL5z5EtemEz2yHYcg05dLNKmmaVGA9g4D1dKovgFxOFdwmQ2tdatSI8e-TfEkb0DPU91RMza91-iTDZWc8m3bqm-Ru9hX83c6JYgfGZIy9i0iyOjQkO9g',
    chaptersCount: 18,
    subjectsCount: 2,
    enrolledProgress: 12,
    isEnrolled: true,
    instructor: 'Prof. Marcus Vance',
    level: 'Intermediate'
  },
  // Recommended Courses
  {
    id: 'rec-ds',
    title: 'Introduction to Data Structures',
    category: 'Computer Science',
    subject: 'Computer Science',
    price: 499,
    rating: 4.8,
    reviewsCount: '1.2k',
    duration: '12h 30m',
    description: 'Master the fundamentals of organizing data efficiently. Perfect for interview prep and system architecture.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4yXlzec7U0knKVteibvWrMyZB5btn1Lfyk49D0rZpsybQvfRt-_0csr5Z11HyhAGiYokqtTLYKeYRjOPOTWfmBVeErL-sOr20eL7sz5L7uaqFRrEa4l2Y2eQBd1SIuFE7aJ1rvXT2m2DCPwzDg0iQa0Dh7Tf1-rgunhPJ64kjOQoB5oH4JminNBpSgbJdJy70vpDfiC7SAPWbhj5wuXXqDASszZ8pvsV5VCc4FSRBU-3lnrpRl62XAg',
    chaptersCount: 30,
    subjectsCount: 5,
    enrolledProgress: 0,
    isEnrolled: false,
    instructor: 'Alex Rivera',
    level: 'Beginner to Intermediate',
    isBookmarked: true
  },
  {
    id: 'rec-chem',
    title: 'Organic Chemistry Basics',
    category: 'Chemistry',
    subject: 'Chemistry',
    price: 0,
    isFree: true,
    rating: 4.5,
    reviewsCount: '850',
    duration: '5h 15m',
    description: 'A foundational course covering hydrocarbons, functional groups, and fundamental reaction mechanisms.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8MdEF_Gom_n-kHPNCdfA7IdwmOk5Cf7ugaQXGUw5eCngvpMUS2YtuMCwhREMWoCCDwjfi3-7xv3IxguhPv2Okrxm1aslMJ7Crfm7hzJhzXLhtTAlA--x78NMjZ8HZGOWt4dNNWBRW5CxZp1UJqL9Gn998ggqYbQKejk4B0X4Q6RDnzLBYtom5Af36z_7yc0359yIVcRCbDy09DnyrsoIlwga8LLpl2xDoUK6q64YnF0d_aOm6tiVFqw',
    chaptersCount: 12,
    subjectsCount: 2,
    enrolledProgress: 0,
    isEnrolled: false,
    instructor: 'Dr. Sarah Connor',
    level: 'Beginner',
    isBookmarked: false
  },
  {
    id: 'rec-linalg',
    title: 'Linear Algebra Masterclass',
    category: 'Mathematics',
    subject: 'Mathematics',
    price: 999,
    rating: 4.9,
    reviewsCount: '3.4k',
    duration: '24h 00m',
    description: 'Comprehensive guide to matrices, vectors, eigenvalues, and complex mathematical transformations for ML.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlDqsQP3TN8CTACq9PieTROVl9854T6w-6pqDn9j_2EaHacIGWJzPg1etcGrtt3mGzGPAk8gjczkyUi8XWseAjBeBReEumzonxrkmbEYyfhcWiEr0m_e1EhRYH2oN6uqFxxmL5z5EtemEz2yHYcg05dLNKmmaVGA9g4D1dKovgFxOFdwmQ2tdatSI8e-TfEkb0DPU91RMza91-iTDZWc8m3bqm-Ru9hX83c6JYgfGZIy9i0iyOjQkO9g',
    chaptersCount: 42,
    subjectsCount: 6,
    enrolledProgress: 0,
    isEnrolled: false,
    instructor: 'Prof. Gilbert Hayes',
    level: 'All Levels',
    isBookmarked: false
  },
  // =========================================================================
  // DEDICATED SCHOOL STUDENT COURSES (CLASSES 6 TO 12 - ₹10 TO ₹50 PER MODULE)
  // =========================================================================
  ...SCHOOL_COURSES
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    questionNumber: 1,
    totalQuestions: 20,
    prompt: 'Evaluate the limit as x approaches 0 for the function:',
    latexFormula: 'lim (x -> 0) [sin(5x) / x]',
    options: [
      { key: 'A', text: '0' },
      { key: 'B', text: '1' },
      { key: 'C', text: '5' },
      { key: 'D', text: 'Undefined' }
    ],
    correctAnswer: 'C',
    explanation: 'Using the standard trigonometric limit lim(u->0) [sin(u)/u] = 1, lim(x->0) [sin(5x)/(5x) * 5] = 1 * 5 = 5.'
  },
  {
    id: 2,
    questionNumber: 2,
    totalQuestions: 20,
    prompt: 'Find the first derivative dy/dx of y = e^(3x^2):',
    latexFormula: 'd/dx [e^(3x^2)]',
    options: [
      { key: 'A', text: '6x * e^(3x^2)' },
      { key: 'B', text: '3x * e^(3x^2)' },
      { key: 'C', text: '6x^2 * e^(3x)' },
      { key: 'D', text: 'e^(6x)' }
    ],
    correctAnswer: 'A',
    explanation: 'By the chain rule: d/dx [e^u] = e^u * du/dx where u = 3x^2, so du/dx = 6x.'
  },
  {
    id: 3,
    questionNumber: 3,
    totalQuestions: 20,
    prompt: 'Compute the definite integral:',
    latexFormula: '∫ (from 0 to 2) [3x^2 + 2x] dx',
    options: [
      { key: 'A', text: '10' },
      { key: 'B', text: '12' },
      { key: 'C', text: '14' },
      { key: 'D', text: '16' }
    ],
    correctAnswer: 'B',
    explanation: 'Antiderivative is [x^3 + x^2] from 0 to 2 = (2^3 + 2^2) - 0 = 8 + 4 = 12.'
  },
  {
    id: 4,
    questionNumber: 4,
    totalQuestions: 20,
    prompt: 'What are the eigenvalues of the matrix A = [[4, 1], [2, 3]]?',
    latexFormula: 'det(A - λI) = 0',
    options: [
      { key: 'A', text: 'λ = 2, 5' },
      { key: 'B', text: 'λ = 1, 6' },
      { key: 'C', text: 'λ = 3, 4' },
      { key: 'D', text: 'λ = -1, 5' }
    ],
    correctAnswer: 'A',
    explanation: 'Characteristic equation: (4-λ)(3-λ) - 2 = λ^2 - 7λ + 10 = (λ - 5)(λ - 2) = 0 => λ = 2, 5.'
  },
  {
    id: 5,
    questionNumber: 5,
    totalQuestions: 20,
    prompt: 'If f(x) = 3x^2 - 2x + 5, what is the value of f(-2)?',
    latexFormula: 'f(-2) = 3(-2)^2 - 2(-2) + 5',
    options: [
      { key: 'A', text: 'A. 13' },
      { key: 'B', text: 'B. 21' },
      { key: 'C', text: 'C. 9' },
      { key: 'D', text: 'D. -3' }
    ],
    correctAnswer: 'B',
    explanation: 'f(-2) = 3(4) - 2(-2) + 5 = 12 + 4 + 5 = 21.'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Advanced Calculus Masterclass',
    date: 'Oct 24, 2023 • 10:30 AM',
    amount: -150,
    type: 'purchase',
    status: 'success',
    icon: 'play_lesson'
  },
  {
    id: 'tx-2',
    title: 'Physics 101 E-Book',
    date: 'Oct 20, 2023 • 02:15 PM',
    amount: -45,
    type: 'purchase',
    status: 'success',
    icon: 'book'
  },
  {
    id: 'tx-3',
    title: 'Semester Enrollment Fee',
    date: 'Oct 05, 2023 • 09:00 AM',
    amount: -500,
    type: 'purchase',
    status: 'failed',
    icon: 'school'
  },
  {
    id: 'tx-4',
    title: 'Funds Added',
    date: 'Sep 28, 2023 • 11:45 AM',
    amount: 1000,
    type: 'fund_added',
    status: 'success',
    icon: 'add_circle'
  },
  {
    id: 'tx-5',
    title: 'Lab Fee Refund (Chemistry)',
    date: 'Sep 15, 2023 • 04:20 PM',
    amount: 80,
    type: 'refund',
    status: 'success',
    icon: 'replay'
  }
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch-1',
    title: 'Organic Chemistry Lab',
    time: '10:00 AM',
    location: 'Room 302, Science Block',
    type: 'lab',
    isActive: true
  },
  {
    id: 'sch-2',
    title: 'Data Structures & Algorithms',
    time: '1:30 PM',
    location: 'Virtual Classroom Link',
    type: 'virtual'
  },
  {
    id: 'sch-3',
    title: 'Applied Differential Equations',
    time: '4:00 PM',
    location: 'Hall B, Main Building',
    type: 'lecture'
  }
];

export const INITIAL_ATTENDANCE_LOGS: AttendanceRecord[] = [
  {
    id: 'att-1',
    date: 'Today, Oct 24',
    time: '09:55 AM',
    type: 'Check-in',
    status: 'Verified',
    method: 'Facial Recognition',
    location: 'Science Block Cam-04'
  },
  {
    id: 'att-2',
    date: 'Yesterday, Oct 23',
    time: '09:02 AM',
    type: 'Check-in',
    status: 'Verified',
    method: 'Facial Recognition',
    location: 'Main Gate Cam-01'
  },
  {
    id: 'att-3',
    date: 'Yesterday, Oct 23',
    time: '04:30 PM',
    type: 'Check-out',
    status: 'Verified',
    method: 'Facial Recognition',
    location: 'Main Gate Cam-02'
  }
];
