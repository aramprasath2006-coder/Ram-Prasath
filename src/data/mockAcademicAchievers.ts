export type ExamCategory = 'ALL' | 'UPSC_IAS' | 'GATE_ENG' | 'RAILWAY_RRB' | 'APTITUDE_BANKING';

export interface ExamAchiever {
  id: string;
  name: string;
  avatar: string;
  rollNo: string;
  batchYear: string; // Year of passing out e.g. "2024", "2023", "2022"
  department: string;
  examName: string; // e.g. "UPSC Civil Services (IAS)", "GATE 2024 (Mechanical)", "RRB NTPC (Senior Commercial Officer)"
  examCategory: ExamCategory;
  rankOrScore: string; // e.g. "AIR 4", "AIR 18 (Score: 948)", "99.85 Percentile", "Selected - Class 1 Officer"
  currentPosting: string; // e.g. "Sub-Divisional Magistrate (IAS), Dehradun", "Scientist 'SC' at ISRO", "Senior Divisional Engineer, Northern Railway"
  quote: string;
  isFeatured?: boolean;
  scoreCardVerified: boolean;
  preparationDuration: string;
  keySubjects: string[];
}

export interface ExamCategoryStats {
  category: ExamCategory;
  label: string;
  iconName: string;
  totalPassedCount: number; // e.g. 340, 480, etc.
  totalAllTimeCount: number;
  topRankAchieved: string;
  topRecruitersOrPostings: string[];
  description: string;
  growthRate: string;
}

export interface YearWisePassoutStat {
  year: string;
  upscCount: number;
  gateCount: number;
  railwayCount: number;
  aptitudeBankingCount: number;
  totalPassedOut: number;
}

export interface CompetitiveExamCategoryCardData {
  id: string;
  category: ExamCategory | 'SSC_GOVT' | 'STATE_PSC';
  title: string;
  subtitle: string;
  iconName: 'landmark' | 'cpu' | 'train' | 'calculator' | 'shield' | 'award';
  shortDescription: string;
  detailedDescription: string;
  successPercentage: number; // e.g. 86.4
  qualifiersCount: number;
  topRank: string;
  activeModulesCount: number;
  mockTestsCount: number;
  keySubjects: string[];
  themeColor: 'indigo' | 'purple' | 'amber' | 'emerald' | 'rose' | 'cyan';
  trendGrowth: string;
  targetRoles: string[];
}

export const COMPETITIVE_EXAM_CATEGORY_LIST: CompetitiveExamCategoryCardData[] = [
  {
    id: 'cat-upsc',
    category: 'UPSC_IAS',
    title: 'UPSC Civil Services',
    subtitle: 'IAS, IPS, IFS & Central Services',
    iconName: 'landmark',
    shortDescription: 'Comprehensive Prelims GS, CSAT, Mains analytical essay drafting, and Mock Interview boards.',
    detailedDescription: 'Rigorous national civil service grooming program featuring daily answer-writing evaluation, current affairs gazette integration, and 1-on-1 mentorship with serving civil servants.',
    successPercentage: 86.4,
    qualifiersCount: 342,
    topRank: 'AIR 4 (IAS Selection)',
    activeModulesCount: 18,
    mockTestsCount: 45,
    keySubjects: ['Indian Polity & Constitution', 'Modern History & Art', 'Economic Development', 'Ethics & Integrity (GS IV)'],
    themeColor: 'indigo',
    trendGrowth: '+28% YoY',
    targetRoles: ['Sub-Divisional Magistrate (SDM)', 'Superintendent of Police (ASP)', 'First Secretary (IFS)']
  },
  {
    id: 'cat-gate',
    category: 'GATE_ENG',
    title: 'GATE & PSU Engineering',
    subtitle: 'CS, Mech, Civil, ECE & PSUs',
    iconName: 'cpu',
    shortDescription: 'Core technical syllabus, high-difficulty numerical problem solving, and premier PSU placement drills.',
    detailedDescription: 'Engineered for aspiring researchers and PSU engineers with topic-wise CBT test engines, virtual calculators, and previous 20-year solved question banks for Maharatna recruitment.',
    successPercentage: 94.2,
    qualifiersCount: 485,
    topRank: 'AIR 4 (GATE Score: 982)',
    activeModulesCount: 24,
    mockTestsCount: 60,
    keySubjects: ['Algorithms & Data Structures', 'Thermodynamics & Fluid Flow', 'Structural Mechanics', 'Signals & Control Systems'],
    themeColor: 'purple',
    trendGrowth: '+41% YoY',
    targetRoles: ['Scientist/Engineer at ISRO & BARC', 'Executive Engineer at IOCL/ONGC', 'M.Tech at IIT Bombay / IISc']
  },
  {
    id: 'cat-railways',
    category: 'RAILWAY_RRB',
    title: 'Indian Railways (RRB)',
    subtitle: 'NTPC, JE, SSE & Technical Cadre',
    iconName: 'train',
    shortDescription: 'Zonal recruitment tracks, CBT-1 & CBT-2 syllabus coverage, and technical engineering speed tests.',
    detailedDescription: 'Tailored for Indian Railways competitive recruitment across technical and non-technical popular categories with timed zonal mock papers and general science mastery.',
    successPercentage: 89.5,
    qualifiersCount: 388,
    topRank: 'All-Zone Rank 1 (SSE)',
    activeModulesCount: 16,
    mockTestsCount: 38,
    keySubjects: ['General Science & Physics', 'Engineering Drawing & Basics', 'Railway General Awareness', 'Arithmetic Reasoning'],
    themeColor: 'amber',
    trendGrowth: '+30% YoY',
    targetRoles: ['Senior Section Engineer (SSE)', 'Junior Engineer (JE)', 'Assistant Loco Pilot (ALP)', 'Station Master']
  },
  {
    id: 'cat-aptitude-banking',
    category: 'APTITUDE_BANKING',
    title: 'Aptitude, CAT & Banking',
    subtitle: 'RBI Grade B, SBI PO & CAT/IIM',
    iconName: 'calculator',
    shortDescription: 'Speed arithmetic shortcuts, advanced Data Interpretation, logical puzzles, and banking finance awareness.',
    detailedDescription: 'Fast-paced calculation frameworks, speed math drills, caselet DI simulations, and financial management modules geared for premier banking examinations and CAT 99+ percentiles.',
    successPercentage: 92.8,
    qualifiersCount: 425,
    topRank: '99.94 Percentile (CAT)',
    activeModulesCount: 20,
    mockTestsCount: 52,
    keySubjects: ['Quantitative Aptitude & Speed Math', 'Data Interpretation (DI)', 'Verbal Ability & Reading Comprehension', 'Financial & Banking Awareness'],
    themeColor: 'emerald',
    trendGrowth: '+36% YoY',
    targetRoles: ['RBI Grade B Manager', 'SBI Probationary Officer (PO)', 'IIM Ahmedabad MBA Cadre', 'Treasury & Risk Analyst']
  },
  {
    id: 'cat-ssc-govt',
    category: 'SSC_GOVT',
    title: 'Staff Selection (SSC CGL)',
    subtitle: 'Assistant Audit Officer & Inspector',
    iconName: 'shield',
    shortDescription: 'Tier-I & Tier-II syllabus mastery, high-speed quantitative aptitude, English comprehension, and GA.',
    detailedDescription: 'Focused preparation for Group B & C central government posts including Ministry of External Affairs, Central Excise, and Income Tax Inspector posts with continuous speed tests.',
    successPercentage: 88.2,
    qualifiersCount: 295,
    topRank: 'AIR 8 (SSC CGL)',
    activeModulesCount: 14,
    mockTestsCount: 40,
    keySubjects: ['Advanced Mathematics', 'English Language & Comprehension', 'General Intelligence & Reasoning', 'General Awareness'],
    themeColor: 'rose',
    trendGrowth: '+25% YoY',
    targetRoles: ['Assistant Section Officer (CSS/MEA)', 'Income Tax Inspector', 'Central Excise Examiner']
  },
  {
    id: 'cat-state-psc',
    category: 'STATE_PSC',
    title: 'State Civil Services (PSC)',
    subtitle: 'Group-1 & Gazetted State Services',
    iconName: 'award',
    shortDescription: 'State-specific administrative history, regional geography, governance laws, and state prelims/mains papers.',
    detailedDescription: 'Specialized state public service training covering regional syllabus, state socio-economic surveys, and language papers for state administrative & revenue officer posts.',
    successPercentage: 87.6,
    qualifiersCount: 230,
    topRank: 'Rank 2 (State Deputy Collector)',
    activeModulesCount: 12,
    mockTestsCount: 32,
    keySubjects: ['State History, Culture & Heritage', 'State Geography & Economy', 'Public Administration & Polity', 'Regional Language Paper'],
    themeColor: 'cyan',
    trendGrowth: '+22% YoY',
    targetRoles: ['Deputy Collector / DSP', 'Commercial Tax Officer', 'Block Development Officer (BDO)']
  }
];

export const ACADEMIC_EXAM_STATS: ExamCategoryStats[] = [
  {
    category: 'ALL',
    label: 'All Competitive Exams',
    iconName: 'trophy',
    totalPassedCount: 1540,
    totalAllTimeCount: 1540,
    topRankAchieved: 'AIR 3 (UPSC), AIR 4 (GATE)',
    topRecruitersOrPostings: ['IAS / IPS', 'ISRO / BARC', 'Indian Railways', 'RBI Grade B', 'IOCL / ONGC'],
    description: 'Total verified alumni passed out and cleared prestigious national competitive examinations.',
    growthRate: '+34% YoY'
  },
  {
    category: 'UPSC_IAS',
    label: 'UPSC Civil Services (IAS / IPS / IFS)',
    iconName: 'landmark',
    totalPassedCount: 342,
    totalAllTimeCount: 342,
    topRankAchieved: 'AIR 3, AIR 11, AIR 18, AIR 34',
    topRecruitersOrPostings: ['IAS (District Admin)', 'IPS (Police Services)', 'IFS (Foreign Services)', 'IRS (Income Tax)'],
    description: 'Aspirants who successfully cleared UPSC Prelims, Mains & Personality Test into Class-1 Gazetted civil services.',
    growthRate: '+28% this year'
  },
  {
    category: 'GATE_ENG',
    label: 'GATE & PSU Engineering (ISRO/BARC/IOCL)',
    iconName: 'cpu',
    totalPassedCount: 485,
    totalAllTimeCount: 485,
    topRankAchieved: 'AIR 4, AIR 12, AIR 19, AIR 42',
    topRecruitersOrPostings: ['ISRO', 'BARC', 'DRDO', 'ONGC', 'IOCL', 'IIT Bombay M.Tech'],
    description: 'Engineering graduates securing 99+ percentile in GATE and direct recruitment into Maharatna/Navratna PSUs.',
    growthRate: '+41% this year'
  },
  {
    category: 'RAILWAY_RRB',
    label: 'Indian Railways (RRB NTPC / JE / SSE)',
    iconName: 'train',
    totalPassedCount: 388,
    totalAllTimeCount: 388,
    topRankAchieved: 'Zone Top Ranker 1 & 2',
    topRecruitersOrPostings: ['Senior Section Engineer (SSE)', 'Junior Engineer (JE)', 'Traffic Apprentice', 'Station Master'],
    description: 'Candidates recruited across Indian Railways zonal boards for core technical engineering & administrative leadership.',
    growthRate: '+30% this year'
  },
  {
    category: 'APTITUDE_BANKING',
    label: 'Aptitude, CAT & Banking (RBI / SBI / SSC)',
    iconName: 'calculator',
    totalPassedCount: 425,
    totalAllTimeCount: 425,
    topRankAchieved: '99.92 %ile CAT, AIR 8 SSC CGL',
    topRecruitersOrPostings: ['RBI Grade B Officer', 'SBI Probationary Officer', 'IIM Ahmedabad', 'Assistant Audit Officer (SSC CGL)'],
    description: 'Mastery in Quantitative Aptitude, Logical Reasoning & Data Interpretation leading to premier financial & executive placements.',
    growthRate: '+36% this year'
  }
];

export const YEAR_WISE_PASSOUT_DATA: YearWisePassoutStat[] = [
  { year: '2021', upscCount: 38, gateCount: 65, railwayCount: 52, aptitudeBankingCount: 60, totalPassedOut: 215 },
  { year: '2022', upscCount: 54, gateCount: 82, railwayCount: 68, aptitudeBankingCount: 78, totalPassedOut: 282 },
  { year: '2023', upscCount: 68, gateCount: 98, railwayCount: 79, aptitudeBankingCount: 89, totalPassedOut: 334 },
  { year: '2024', upscCount: 82, gateCount: 112, railwayCount: 91, aptitudeBankingCount: 96, totalPassedOut: 381 },
  { year: '2025', upscCount: 100, gateCount: 128, railwayCount: 98, aptitudeBankingCount: 102, totalPassedOut: 428 }
];

export const FEATURED_EXAM_ACHIEVERS: ExamAchiever[] = [
  // 1. UPSC / IAS
  {
    id: 'ach-1',
    name: 'Ananya Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    rollNo: '21CS0104',
    batchYear: '2023',
    department: 'Dept of Computer Science & Engineering',
    examName: 'UPSC Civil Services Examination (CSE)',
    examCategory: 'UPSC_IAS',
    rankOrScore: 'AIR 4 (IAS Selected)',
    currentPosting: 'Sub-Divisional Magistrate (SDM), Dehradun',
    quote: 'The daily revision framework, mentor answer review sessions, and GS Paper test series at the academy laid the bedrock for cracking CSE on my first attempt.',
    isFeatured: true,
    scoreCardVerified: true,
    preparationDuration: '18 Months',
    keySubjects: ['GS Paper I-IV', 'Sociology Optional', 'Current Affairs']
  },
  {
    id: 'ach-2',
    name: 'Vikramaditya Rathore',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    rollNo: '20ME0088',
    batchYear: '2022',
    department: 'Dept of Mechanical Engineering',
    examName: 'UPSC Civil Services (IPS Cadre)',
    examCategory: 'UPSC_IAS',
    rankOrScore: 'AIR 18 (IPS Selected)',
    currentPosting: 'Assistant Superintendent of Police (ASP), Lucknow',
    quote: 'Disciplined academic tracking and high-velocity mock interviews simulated the actual UPSC panel with remarkable accuracy.',
    isFeatured: true,
    scoreCardVerified: true,
    preparationDuration: '24 Months',
    keySubjects: ['Ethics & Governance', 'Geography', 'Essay Paper']
  },
  {
    id: 'ach-3',
    name: 'Priya Sundaram',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    rollNo: '22MA0045',
    batchYear: '2024',
    department: 'Dept of Mathematics & Computing',
    examName: 'UPSC Indian Foreign Service (IFS)',
    examCategory: 'UPSC_IAS',
    rankOrScore: 'AIR 31 (IFS Selected)',
    currentPosting: 'Third Secretary, Ministry of External Affairs, New Delhi',
    quote: 'The international relations seminar modules and faculty-guided debate circles gave me unmatched clarity in the personality test.',
    isFeatured: false,
    scoreCardVerified: true,
    preparationDuration: '14 Months',
    keySubjects: ['International Relations', 'Political Science', 'Essay']
  },

  // 2. GATE & PSU
  {
    id: 'ach-4',
    name: 'Arjun K. Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    rollNo: '21ME0210',
    batchYear: '2023',
    department: 'Dept of Mechanical Engineering',
    examName: 'GATE Mechanical Engineering',
    examCategory: 'GATE_ENG',
    rankOrScore: 'AIR 4 (Score: 982/1000)',
    currentPosting: 'Scientist / Engineer "SC", ISRO Satellite Centre',
    quote: 'The Elite GATE Mechanical series with thermodynamic simulations and fluid mechanics numerical breakdowns made solving difficult multi-step problems effortless.',
    isFeatured: true,
    scoreCardVerified: true,
    preparationDuration: '12 Months',
    keySubjects: ['Thermodynamics', 'Fluid Mechanics', 'Strength of Materials']
  },
  {
    id: 'ach-5',
    name: 'Sneha Chawla',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rollNo: '22CS0142',
    batchYear: '2024',
    department: 'Dept of Computer Science & Engineering',
    examName: 'GATE Computer Science & IT',
    examCategory: 'GATE_ENG',
    rankOrScore: 'AIR 12 (Score: 964/1000)',
    currentPosting: 'Systems Researcher & PSU Executive, BARC Mumbai',
    quote: 'Algorithmic rigor and discrete mathematics drills at the academy allowed me to complete the 65-question paper with 25 minutes to spare.',
    isFeatured: true,
    scoreCardVerified: true,
    preparationDuration: '10 Months',
    keySubjects: ['Algorithms & Data Structures', 'Operating Systems', 'Theory of Computation']
  },
  {
    id: 'ach-6',
    name: 'Rohit K. Varma',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    rollNo: '20EE0095',
    batchYear: '2022',
    department: 'Dept of Electrical & Electronics',
    examName: 'GATE Electrical Engineering',
    examCategory: 'GATE_ENG',
    rankOrScore: 'AIR 19 (Score: 948/1000)',
    currentPosting: 'Executive Engineer, Power Grid Corporation of India (PGCIL)',
    quote: 'Mastering power systems and control theories with active faculty guidance propelled my AIR straight into the top 20.',
    isFeatured: false,
    scoreCardVerified: true,
    preparationDuration: '15 Months',
    keySubjects: ['Power Systems', 'Control Theory', 'Signals & Systems']
  },

  // 3. Indian Railways (RRB)
  {
    id: 'ach-7',
    name: 'Rajesh Nambiar',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    rollNo: '19ME0154',
    batchYear: '2022',
    department: 'Dept of Mechanical Engineering',
    examName: 'RRB Senior Section Engineer (SSE)',
    examCategory: 'RAILWAY_RRB',
    rankOrScore: 'Rank 1 (Southern Railway Board)',
    currentPosting: 'Senior Section Engineer (Locomotive Works), Chennai Division',
    quote: 'The technical aptitude modules specifically crafted for railway engineering examinations gave me an edge over thousands of applicants.',
    isFeatured: true,
    scoreCardVerified: true,
    preparationDuration: '8 Months',
    keySubjects: ['Applied Mechanics', 'Machine Design', 'General Technical Aptitude']
  },
  {
    id: 'ach-8',
    name: 'Pooja Tiwari',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    rollNo: '21CS0302',
    batchYear: '2023',
    department: 'Dept of Computer Science & Engineering',
    examName: 'RRB NTPC (Commercial & Traffic Executive)',
    examCategory: 'RAILWAY_RRB',
    rankOrScore: 'Top 0.1% Merit Rank',
    currentPosting: 'Station Director & Operations Superintendent, Western Railway',
    quote: 'The timed live assessment environment in the student portal built my speed and accuracy for the multi-stage Computer Based Tests (CBT).',
    isFeatured: false,
    scoreCardVerified: true,
    preparationDuration: '6 Months',
    keySubjects: ['Quantitative Reasoning', 'General Awareness', 'Data Analysis']
  },
  {
    id: 'ach-9',
    name: 'Karthik S. Iyer',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    rollNo: '20CV0067',
    batchYear: '2023',
    department: 'Dept of Civil Engineering',
    examName: 'RRB Junior Engineer (Track & Bridges)',
    examCategory: 'RAILWAY_RRB',
    rankOrScore: 'Rank 3 (Northern Railway)',
    currentPosting: 'Assistant Divisional Engineer (Bridges), New Delhi',
    quote: 'Practical structural mechanics problems taught in our core electives mapped directly to the RRB Stage-II technical paper.',
    isFeatured: false,
    scoreCardVerified: true,
    preparationDuration: '9 Months',
    keySubjects: ['Structural Mechanics', 'Surveying', 'Concrete Technology']
  },

  // 4. Quantitative Aptitude, CAT & Banking
  {
    id: 'ach-10',
    name: 'Divya M. Banerjee',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
    rollNo: '21MA0112',
    batchYear: '2024',
    department: 'Dept of Mathematics & Computing',
    examName: 'CAT & IIM Management Admission',
    examCategory: 'APTITUDE_BANKING',
    rankOrScore: '99.94 Percentile (Quant 100%ile)',
    currentPosting: 'PGP Candidate at IIM Ahmedabad / Former McKinsey Analyst',
    quote: 'From mental math shortcuts to complex data interpretation case studies, the aptitude foundation provided here is second to none nationally.',
    isFeatured: true,
    scoreCardVerified: true,
    preparationDuration: '8 Months',
    keySubjects: ['Advanced Quant', 'Data Interpretation', 'Logical Reasoning']
  },
  {
    id: 'ach-11',
    name: 'Harsh Vardhan Singh',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    rollNo: '20CS0071',
    batchYear: '2023',
    department: 'Dept of Computer Science & Engineering',
    examName: 'Reserve Bank of India (RBI Grade B Officer)',
    examCategory: 'APTITUDE_BANKING',
    rankOrScore: 'AIR 8 (Final Merit List)',
    currentPosting: 'Manager (Grade B Officer), Reserve Bank of India, Mumbai',
    quote: 'The rigorous focus on financial economics, management principles, and descriptive writing made clearing Phase II seamless.',
    isFeatured: true,
    scoreCardVerified: true,
    preparationDuration: '11 Months',
    keySubjects: ['Economic & Social Issues', 'Finance & Management', 'Quantitative Aptitude']
  },
  {
    id: 'ach-12',
    name: 'Meera N. Patel',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    rollNo: '21EC0188',
    batchYear: '2023',
    department: 'Dept of Electronics & Communication',
    examName: 'State Bank of India (SBI PO)',
    examCategory: 'APTITUDE_BANKING',
    rankOrScore: 'Top 50 All-India Rank',
    currentPosting: 'Probationary Officer & Credit Analyst, SBI Capital Markets',
    quote: 'The weekly speed tests and adaptive question banks helped me consistently clock 95%+ accuracy in reasoning and quant.',
    isFeatured: false,
    scoreCardVerified: true,
    preparationDuration: '7 Months',
    keySubjects: ['Banking Awareness', 'Reasoning Ability', 'Data Analysis']
  }
];
