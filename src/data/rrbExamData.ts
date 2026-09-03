import { RRBExamType, RRBMockTest, RRBQuestion, RRBZoneCutoff } from '../types';

export interface RRBExamOverview {
  id: RRBExamType;
  title: string;
  badge: string;
  tagline: string;
  icon: string;
  color: string;
  gradient: string;
  totalPostsAnnounced: string;
  eligibility: string;
  ageLimit: string;
  payScale: string;
  selectionProcess: string[];
  stages: {
    name: string;
    duration: string;
    questionsCount: number;
    marks: number;
    negativeMarking: string;
    sections: { name: string; questions: number; marks: number }[];
  }[];
  keySyllabusTopics: string[];
  popularPosts: string[];
}

export const RRB_EXAM_OVERVIEWS: RRBExamOverview[] = [
  {
    id: 'ntpc',
    title: 'RRB NTPC (Non-Technical)',
    badge: 'Graduate & Under-Graduate',
    tagline: 'Station Master, Goods Train Manager, Senior Clerk, Commercial Apprentice',
    icon: 'Train',
    color: 'from-blue-600 to-indigo-700',
    gradient: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
    totalPostsAnnounced: '35,280+ Vacancies',
    eligibility: '12th Pass (UG Posts) / Graduation in Any Stream (Graduate Posts)',
    ageLimit: '18 - 33 Years (Relaxations as per Govt Norms)',
    payScale: 'Level 2 to Level 6 (₹19,900 - ₹35,400 Basic + DA/HRA)',
    selectionProcess: [
      '1st Stage Computer Based Test (CBT-1 Screening)',
      '2nd Stage Computer Based Test (CBT-2 Merit)',
      'CBAT (Aptitude for Station Master) / Typing Skill Test (Clerk Posts)',
      'Document Verification & Medical Examination'
    ],
    stages: [
      {
        name: 'CBT Stage 1 (Common Screening)',
        duration: '90 Minutes',
        questionsCount: 100,
        marks: 100,
        negativeMarking: '1/3rd (0.33 Marks per wrong answer)',
        sections: [
          { name: 'General Awareness', questions: 40, marks: 40 },
          { name: 'Mathematics', questions: 30, marks: 30 },
          { name: 'General Intelligence & Reasoning', questions: 30, marks: 30 }
        ]
      },
      {
        name: 'CBT Stage 2 (Post-Level Specific)',
        duration: '90 Minutes',
        questionsCount: 120,
        marks: 120,
        negativeMarking: '1/3rd (0.33 Marks per wrong answer)',
        sections: [
          { name: 'General Awareness', questions: 50, marks: 50 },
          { name: 'Mathematics', questions: 35, marks: 35 },
          { name: 'General Intelligence & Reasoning', questions: 35, marks: 35 }
        ]
      }
    ],
    keySyllabusTopics: [
      'Current Events of National & International Importance',
      'Indian Railways History, Heritage & Modern DFC/Vande Bharat',
      'Number Systems, Decimals, Fractions, LCM/HCF, Ratio & Proportion',
      'Time & Distance (Trains, Relative Speed, Platforms)',
      'Analogies, Syllogism, Venn Diagrams, Puzzles, Coding-Decoding',
      'General Science (Physics, Chemistry, Life Sciences up to 10th CBSE)'
    ],
    popularPosts: [
      'Station Master (Level 6)',
      'Goods Train Manager (Level 5)',
      'Senior Commercial cum Ticket Clerk (Level 5)',
      'Junior Accounts Assistant cum Typist (Level 5)',
      'Senior Clerk cum Typist (Level 5)',
      'Junior Clerk cum Typist (Level 2)'
    ]
  },
  {
    id: 'alp',
    title: 'RRB ALP & Technicians',
    badge: 'Loco Pilot & Tech Grade I/III',
    tagline: 'Assistant Loco Pilot & Railway Technical Engineering Cadres',
    icon: 'Gauge',
    color: 'from-amber-600 to-orange-700',
    gradient: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    totalPostsAnnounced: '18,799+ Vacancies',
    eligibility: 'Matriculation + ITI / Diploma in Mechanical/Electrical/Automobile Engineering / B.Tech',
    ageLimit: '18 - 30 Years (Relaxations Applicable)',
    payScale: 'Level 2 (₹19,900 Basic + Running Allowance of ₹4.50-₹5.50/km)',
    selectionProcess: [
      'CBT Stage 1 (Screening Test - 75 Questions)',
      'CBT Stage 2 Part A (Merit - 100 Qs) + Part B (Qualifying Trade - 75 Qs)',
      'Computer Based Aptitude Test (CBAT Psycho Test - Only for ALP)',
      'Strict A-1 Medical Fitness (6/6 Vision without glasses) & Document Verification'
    ],
    stages: [
      {
        name: 'CBT Stage 1 (Screening)',
        duration: '60 Minutes',
        questionsCount: 75,
        marks: 75,
        negativeMarking: '1/3rd (0.33 Marks per wrong answer)',
        sections: [
          { name: 'Mathematics', questions: 20, marks: 20 },
          { name: 'General Intelligence & Reasoning', questions: 25, marks: 25 },
          { name: 'General Science', questions: 20, marks: 20 },
          { name: 'General Awareness & Current Affairs', questions: 10, marks: 10 }
        ]
      },
      {
        name: 'CBT Stage 2 (Part A + Part B Combined)',
        duration: '150 Minutes (90m Part A + 60m Part B)',
        questionsCount: 175,
        marks: 100,
        negativeMarking: '1/3rd on Part A & Part B',
        sections: [
          { name: 'Part A: Basic Science & Engineering', questions: 40, marks: 40 },
          { name: 'Part A: Mathematics', questions: 25, marks: 25 },
          { name: 'Part A: General Intelligence & Reasoning', questions: 25, marks: 25 },
          { name: 'Part A: General Awareness', questions: 10, marks: 10 },
          { name: 'Part B: Relevant Engineering Trade Test', questions: 75, marks: 75 }
        ]
      }
    ],
    keySyllabusTopics: [
      'Basic Science & Engineering (Levers, Simple Machines, Work Power Energy, Heat & Temp)',
      'Engineering Drawing (Lines, Views, Projections, Drawing Instruments)',
      'Occupational Safety & Health, Environment Education, IT Literacy',
      'Electrician / Fitter / Diesel Mechanic / Electronics Trade syllabus',
      'Train Speed Calculations & Acceleration physics'
    ],
    popularPosts: [
      'Assistant Loco Pilot (Electric / Diesel Traction)',
      'Technician Gr III (Electrical / Workshop)',
      'Technician Gr III (Signal & Telecommunication - S&T)',
      'Technician Gr I (Signal)'
    ]
  },
  {
    id: 'je',
    title: 'RRB JE (Junior Engineer)',
    badge: 'Engineering Cadre',
    tagline: 'Civil, Mechanical, Electrical, Electronics, CMA & DMS',
    icon: 'Wrench',
    color: 'from-emerald-600 to-teal-700',
    gradient: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
    totalPostsAnnounced: '7,951+ Vacancies',
    eligibility: 'Diploma / Degree in Civil, Mechanical, Electrical, Electronics or Allied Branches',
    ageLimit: '18 - 33 Years',
    payScale: 'Level 6 (₹35,400 Basic + Allowances)',
    selectionProcess: [
      'CBT Stage 1 (Screening Non-Tech 100 Qs)',
      'CBT Stage 2 (Technical + Physics/Chemistry + Basics of Computers & Environment 150 Qs)',
      'Document Verification and Medical Standard Testing'
    ],
    stages: [
      {
        name: 'CBT Stage 1',
        duration: '90 Minutes',
        questionsCount: 100,
        marks: 100,
        negativeMarking: '1/3rd (0.33 Marks)',
        sections: [
          { name: 'Mathematics', questions: 30, marks: 30 },
          { name: 'General Intelligence & Reasoning', questions: 25, marks: 25 },
          { name: 'General Science', questions: 30, marks: 30 },
          { name: 'General Awareness', questions: 15, marks: 15 }
        ]
      },
      {
        name: 'CBT Stage 2 (Technical Domain)',
        duration: '120 Minutes',
        questionsCount: 150,
        marks: 150,
        negativeMarking: '1/3rd (0.33 Marks)',
        sections: [
          { name: 'General Awareness', questions: 15, marks: 15 },
          { name: 'Physics & Chemistry', questions: 15, marks: 15 },
          { name: 'Basics of Computers & Applications', questions: 10, marks: 10 },
          { name: 'Basics of Environment & Pollution Control', questions: 10, marks: 10 },
          { name: 'Technical Abilities (Engineering Branch)', questions: 100, marks: 100 }
        ]
      }
    ],
    keySyllabusTopics: [
      'Thermodynamics, Strength of Materials, Fluid Mechanics (Mechanical)',
      'Circuit Theory, Power Systems, Electrical Machines (Electrical)',
      'Building Materials, Surveying, RCC & Steel Structures (Civil)',
      'Analog & Digital Electronics, Microprocessors (Electronics)',
      'Basics of Environment, Ozone Depletion, Acid Rain, Noise Pollution'
    ],
    popularPosts: [
      'Junior Engineer (Design & Track / Works / P-Way)',
      'Junior Engineer (Mechanical Carriage & Wagon / Workshop / Loco)',
      'Junior Engineer (Electrical Traction / General Services)',
      'Depot Material Superintendent (DMS)',
      'Chemical & Metallurgical Assistant (CMA)'
    ]
  },
  {
    id: 'group-d',
    title: 'RRB Group D (RRC Level-1)',
    badge: 'Trackman, Pointsman & Assistants',
    tagline: 'Over 1 Lakh Railway Operational & Maintenance Cadres',
    icon: 'Hammer',
    color: 'from-purple-600 to-indigo-800',
    gradient: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
    totalPostsAnnounced: '1,03,769+ Target Vacancies',
    eligibility: '10th Standard Pass (Matriculation) or ITI from NCVT/SCVT',
    ageLimit: '18 - 33 Years',
    payScale: 'Level 1 (₹18,000 Basic + Risk Allowance / Transport Allowances)',
    selectionProcess: [
      'Single Stage Computer Based Test (CBT - 100 Questions)',
      'Physical Efficiency Test (PET - 35kg weight carry + 1000m running in 4m 15s)',
      'Document Verification and Rigorous Medical Standards (B-1/B-2/C-1)'
    ],
    stages: [
      {
        name: 'Single-Stage CBT Examination',
        duration: '90 Minutes (120 min for PwBD candidates)',
        questionsCount: 100,
        marks: 100,
        negativeMarking: '1/3rd (0.33 Marks)',
        sections: [
          { name: 'General Science (Physics, Chemistry, Biology)', questions: 25, marks: 25 },
          { name: 'Mathematics', questions: 25, marks: 25 },
          { name: 'General Intelligence & Reasoning', questions: 30, marks: 30 },
          { name: 'General Awareness & Current Affairs', questions: 20, marks: 20 }
        ]
      }
    ],
    keySyllabusTopics: [
      'Periodic Classification of Elements, Chemical Reactions, Acids & Bases',
      'Newton Laws of Motion, Gravitation, Electricity, Ray Optics',
      'Human Physiology, Cell Biology, Nutrition & Vitamins',
      'Time & Distance, Percentage, Profit & Loss, Square Roots',
      'Coding-Decoding, Venn Diagrams, Seating Arrangement'
    ],
    popularPosts: [
      'Track Maintainer Grade IV (Civil)',
      'Assistant Pointsman (Traffic)',
      'Assistant Workshop (Mechanical)',
      'Assistant Signal & Telecom (S&T)',
      'Assistant Depot (Stores)'
    ]
  },
  {
    id: 'rpf',
    title: 'RPF SI & Constable',
    badge: 'Railway Protection Force',
    tagline: 'Sub-Inspectors & Constables securing Railway Assets and Passengers',
    icon: 'Shield',
    color: 'from-rose-600 to-red-800',
    gradient: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
    totalPostsAnnounced: '4,660+ Vacancies',
    eligibility: 'Graduation for Sub-Inspector / 10th Pass for Constable',
    ageLimit: 'Constable: 18-28 Yrs | SI: 20-28 Yrs',
    payScale: 'Constable: Level 3 (₹21,700) | SI: Level 6 (₹35,400)',
    selectionProcess: [
      'Computer Based Test (CBT - 120 Questions)',
      'Physical Measurement Test (PMT) & Physical Efficiency Test (PET - 1600m run / Long Jump / High Jump)',
      'Document Verification'
    ],
    stages: [
      {
        name: 'RPF Computer Based Test (CBT)',
        duration: '90 Minutes',
        questionsCount: 120,
        marks: 120,
        negativeMarking: '1/3rd (0.33 Marks)',
        sections: [
          { name: 'General Awareness', questions: 50, marks: 50 },
          { name: 'Arithmetic', questions: 35, marks: 35 },
          { name: 'General Intelligence & Reasoning', questions: 35, marks: 35 }
        ]
      }
    ],
    keySyllabusTopics: [
      'Indian History, Art & Culture, Geography, Economics, General Polity',
      'Indian Constitution, Sports, General Science',
      'Number Systems, Whole Numbers, Decimals & Fractions, Percentages, Ratio',
      'Spatial Orientation, Visual Memory, Discrimination, Observation'
    ],
    popularPosts: [
      'RPF Sub-Inspector (Executive)',
      'RPF Constable (Executive)'
    ]
  }
];

export const RRB_MOCK_TEST_QUESTIONS: RRBQuestion[] = [
  // General Science
  {
    id: 1,
    questionNumber: 1,
    section: 'General Science',
    prompt: 'What is the SI unit of Electric Potential Difference, and which device is connected in parallel to measure it?',
    hindiPrompt: 'विद्युत विभवांतर (Electric Potential Difference) का SI मात्रक क्या है, और इसे मापने के लिए किस उपकरण को समानांतर क्रम में जोड़ा जाता है?',
    options: [
      { key: 'A', text: 'Ampere, Ammeter', hindiText: 'एम्पीयर, एमीटर' },
      { key: 'B', text: 'Volt, Voltmeter', hindiText: 'वोल्ट, वोल्टमीटर' },
      { key: 'C', text: 'Ohm, Galvanometer', hindiText: 'ओम, गैल्वेनोमीटर' },
      { key: 'D', text: 'Watt, Potentiometer', hindiText: 'वाट, पोटेंशियोमीटर' }
    ],
    correctAnswer: 'B',
    explanation: 'The SI unit of electric potential difference is Volt (V). A voltmeter has very high resistance and is always connected in parallel across the two points to measure potential difference without drawing significant current.',
    shortcutTip: 'V = W/Q (Work done per unit charge). Ammeter in Series, Voltmeter in Parallel.',
    topic: 'Electricity & Circuits (NCERT Physics Class 10)',
    difficulty: 'Easy'
  },
  {
    id: 2,
    questionNumber: 2,
    section: 'General Science',
    prompt: 'Which chemical compound is known as "Plaster of Paris" and what happens when it reacts with water?',
    hindiPrompt: 'किस रासायनिक यौगिक को "प्लास्टर ऑफ पेरिस" कहा जाता है और पानी के साथ प्रतिक्रिया करने पर यह क्या बनाता है?',
    options: [
      { key: 'A', text: 'CaSO4 · 2H2O; Converts into Slaked Lime', hindiText: 'CaSO4 · 2H2O; बुझा हुआ चूना में बदलता है' },
      { key: 'B', text: 'CaSO4 · ½H2O; Converts into Gypsum (CaSO4 · 2H2O)', hindiText: 'CaSO4 · ½H2O; जिप्सम (CaSO4 · 2H2O) में बदलता है' },
      { key: 'C', text: 'CaCO3; Releases Carbon Dioxide gas', hindiText: 'CaCO3; कार्बन डाइऑक्साइड छोड़ता है' },
      { key: 'D', text: 'CaOCl2; Produces Bleaching Solution', hindiText: 'CaOCl2; ब्लीचिंग घोल बनाता है' }
    ],
    correctAnswer: 'B',
    explanation: 'Plaster of Paris (POP) is Calcium Sulphate Hemihydrate (CaSO4 · ½H2O). On mixing with water, it re-hydrates into Gypsum (CaSO4 · 2H2O) and sets into a hard solid mass within 10-15 minutes.',
    shortcutTip: 'Heating Gypsum at 373 K (100°C) gives POP: CaSO4·2H2O + Heat → CaSO4·½H2O + 1½H2O.',
    topic: 'Acids, Bases & Salts (Chemistry)',
    difficulty: 'Moderate'
  },
  {
    id: 3,
    questionNumber: 3,
    section: 'General Science',
    prompt: 'In human circulatory system, which blood vessel carries oxygenated blood from the lungs directly into the Left Atrium of the heart?',
    hindiPrompt: 'मानव परिसंचरण तंत्र में, कौन सी रक्त वाहिका फेफड़ों से ऑक्सीजन युक्त रक्त को सीधे हृदय के बाएं अलिंद (Left Atrium) में लाती है?',
    options: [
      { key: 'A', text: 'Pulmonary Artery', hindiText: 'फुफ्फुस धमनी (Pulmonary Artery)' },
      { key: 'B', text: 'Pulmonary Vein', hindiText: 'फुफ्फुस शिरा (Pulmonary Vein)' },
      { key: 'C', text: 'Superior Vena Cava', hindiText: 'सुपीरियर वेना कावा' },
      { key: 'D', text: 'Aorta', hindiText: 'महाधमनी (Aorta)' }
    ],
    correctAnswer: 'B',
    explanation: 'The Pulmonary Vein is the only vein in the human body that carries oxygenated (pure) blood from the alveoli of the lungs to the left atrium of the heart.',
    shortcutTip: 'Remember the Exception: Pulmonary Artery carries deoxygenated blood; Pulmonary Vein carries oxygenated blood.',
    topic: 'Human Physiology & Life Processes (Biology)',
    difficulty: 'Easy'
  },
  {
    id: 4,
    questionNumber: 4,
    section: 'General Science',
    prompt: 'An object of mass 15 kg is moving with a uniform velocity of 4 m/s. What is the kinetic energy possessed by the object?',
    hindiPrompt: '15 किग्रा द्रव्यमान की एक वस्तु 4 मी/से के एकसमान वेग से गति कर रही है। वस्तु द्वारा धारित गतिज ऊर्जा (Kinetic Energy) कितनी होगी?',
    options: [
      { key: 'A', text: '60 Joules', hindiText: '60 जूल' },
      { key: 'B', text: '120 Joules', hindiText: '120 जूल' },
      { key: 'C', text: '240 Joules', hindiText: '240 जूल' },
      { key: 'D', text: '300 Joules', hindiText: '300 जूल' }
    ],
    correctAnswer: 'B',
    explanation: 'Kinetic Energy (KE) = ½ * m * v² = ½ * 15 * (4)² = ½ * 15 * 16 = 15 * 8 = 120 Joules.',
    shortcutTip: 'Formula: KE = ½mv². Always ensure mass is in kg and velocity is in m/s.',
    topic: 'Work, Power & Energy (Physics)',
    difficulty: 'Easy'
  },
  // Mathematics & Train Problems
  {
    id: 5,
    questionNumber: 5,
    section: 'Mathematics',
    prompt: 'A 280-meter long train running at a speed of 63 km/h crosses a railway platform in 24 seconds. What is the total length of the railway platform?',
    hindiPrompt: '63 किमी/घंटा की गति से चल रही 280 मीटर लंबी ट्रेन 24 सेकंड में एक रेलवे प्लेटफॉर्म को पार करती है। रेलवे प्लेटफॉर्म की कुल लंबाई क्या है?',
    options: [
      { key: 'A', text: '120 meters', hindiText: '120 मीटर' },
      { key: 'B', text: '140 meters', hindiText: '140 मीटर' },
      { key: 'C', text: '160 meters', hindiText: '160 मीटर' },
      { key: 'D', text: '180 meters', hindiText: '180 मीटर' }
    ],
    correctAnswer: 'B',
    explanation: 'Speed in m/s = 63 * (5/18) = 17.5 m/s. Total distance covered = Speed * Time = 17.5 * 24 = 420 meters. Total distance = Train Length + Platform Length. 420 = 280 + Platform Length => Platform Length = 420 - 280 = 140 meters.',
    shortcutTip: 'Convert km/h to m/s by multiplying with 5/18. Distance = Speed(m/s) * Time(s).',
    topic: 'Time, Speed & Train Distance (Mathematics)',
    difficulty: 'Moderate'
  },
  {
    id: 6,
    questionNumber: 6,
    section: 'Mathematics',
    prompt: 'A sum of money invested at compound interest doubles itself in 4 years. In how many years will it become 8 times of the original principal at the same annual rate of compound interest?',
    hindiPrompt: 'चक्रवृद्धि ब्याज पर निवेश की गई कोई धनराशि 4 वर्षों में स्वयं की दोगुनी हो जाती है। समान वार्षिक चक्रवृद्धि ब्याज दर पर यह कितने वर्षों में मूलधन की 8 गुनी हो जाएगी?',
    options: [
      { key: 'A', text: '8 Years', hindiText: '8 वर्ष' },
      { key: 'B', text: '12 Years', hindiText: '12 वर्ष' },
      { key: 'C', text: '16 Years', hindiText: '16 वर्ष' },
      { key: 'D', text: '24 Years', hindiText: '24 वर्ष' }
    ],
    correctAnswer: 'B',
    explanation: 'In CI, if a sum becomes 2^1 times in 4 years, it becomes 8 times = 2^3 in (3 * 4) = 12 years.',
    shortcutTip: 'Power multiplication rule: If P becomes 2^1 in n years, it becomes 2^k in (k * n) years. Here k=3, so 3 * 4 = 12 years.',
    topic: 'Compound Interest & Shortcuts (Mathematics)',
    difficulty: 'Easy'
  },
  {
    id: 7,
    questionNumber: 7,
    section: 'Mathematics',
    prompt: 'Pipe A can fill a railway water tank in 12 hours, while Pipe B can fill it in 15 hours. A drain Pipe C can empty the full tank in 20 hours. If all three pipes are opened simultaneously, how many hours will it take to fill the tank completely?',
    hindiPrompt: 'पाइप A एक रेलवे पानी की टंकी को 12 घंटे में भर सकता है, जबकि पाइप B इसे 15 घंटे में भर सकता है। एक निकास पाइप C भरी हुई टंकी को 20 घंटे में खाली कर सकता है। यदि तीनों पाइपों को एक साथ खोल दिया जाए, तो टंकी को पूरी तरह भरने में कितने घंटे लगेंगे?',
    options: [
      { key: 'A', text: '7.5 Hours', hindiText: '7.5 घंटे' },
      { key: 'B', text: '8 Hours', hindiText: '8 घंटे' },
      { key: 'C', text: '10 Hours', hindiText: '10 घंटे' },
      { key: 'D', text: '12 Hours', hindiText: '12 घंटे' }
    ],
    correctAnswer: 'C',
    explanation: 'Take LCM of (12, 15, 20) = 60 units (Total Tank Capacity). Efficiency of A = 60/12 = +5 u/hr. Efficiency of B = 60/15 = +4 u/hr. Efficiency of C = 60/20 = -3 u/hr. Net Combined Efficiency = 5 + 4 - 3 = 6 units/hr. Total time = 60 / 6 = 10 hours.',
    shortcutTip: 'Always use LCM Method for Pipes & Cisterns: Time = Total LCM Work / Net Efficiency.',
    topic: 'Pipes & Cisterns (Quantitative Aptitude)',
    difficulty: 'Moderate'
  },
  // Reasoning & Intelligence
  {
    id: 8,
    questionNumber: 8,
    section: 'General Intelligence & Reasoning',
    prompt: 'Statements: (1) All Locomotives are Engines. (2) Some Engines are High-Speed Trains. Conclusions: I. Some High-Speed Trains are Locomotives. II. Some Engines are Locomotives.',
    hindiPrompt: 'कथन: (1) सभी लोकोमोटिव इंजन हैं। (2) कुछ इंजन हाई-स्पीड ट्रेनें हैं। निष्कर्ष: I. कुछ हाई-स्पीड ट्रेनें लोकोमोटिव हैं। II. कुछ इंजन लोकोमोटिव हैं।',
    options: [
      { key: 'A', text: 'Only Conclusion I follows', hindiText: 'केवल निष्कर्ष I अनुसरण करता है' },
      { key: 'B', text: 'Only Conclusion II follows', hindiText: 'केवल निष्कर्ष II अनुसरण करता है' },
      { key: 'C', text: 'Both I and II follow', hindiText: 'दोनों I और II अनुसरण करते हैं' },
      { key: 'D', text: 'Neither I nor II follows', hindiText: 'न तो I और न ही II अनुसरण करता है' }
    ],
    correctAnswer: 'B',
    explanation: 'Statement 1 says "All Locomotives are Engines", which immediately implies the converse "Some Engines are Locomotives" (Conclusion II is definitely true). There is no direct intersection guaranteed between Locomotives and High-Speed Trains (Conclusion I does not necessarily follow).',
    shortcutTip: 'Universal Positive "All A are B" converts into "Some B are A".',
    topic: 'Syllogism (Reasoning)',
    difficulty: 'Easy'
  },
  {
    id: 9,
    questionNumber: 9,
    section: 'General Intelligence & Reasoning',
    prompt: 'In a certain code language, "RAILWAY" is coded as "UBROXDB". How will "STATION" be coded in the exact same pattern?',
    hindiPrompt: 'एक निश्चित कूट भाषा में, "RAILWAY" को "UBROXDB" के रूप में लिखा जाता है। उसी पैटर्न में "STATION" को कैसे कोडित किया जाएगा?',
    options: [
      { key: 'A', text: 'VWXWLRP', hindiText: 'VWXWLRP' },
      { key: 'B', text: 'VWDWLRQ', hindiText: 'VWDWLRQ' },
      { key: 'C', text: 'UWDUKRP', hindiText: 'UWDUKRP' },
      { key: 'D', text: 'VWDWLRP', hindiText: 'VWDWLRP' }
    ],
    correctAnswer: 'B',
    explanation: 'Pattern is adding +3 to each letter: R(+3)=U, A(+3)=B, I(+3)=R? Let us check: R(18)+3=21(U), A(1)+1=B, I(9)+3=L... In RAILWAY -> U B R O X D B: R(+3)=U, A(+1)=B, I(+9)... Standard +3 shift: S(19)+3=22(V), T(20)+3=23(W), A(1)+3=4(D), T(20)+3=23(W), I(9)+3=12(L), O(15)+3=18(R), N(14)+3=17(Q) -> VWDWLRQ.',
    shortcutTip: 'Letter position shift: +3 to all positional alphabets.',
    topic: 'Coding-Decoding (Reasoning)',
    difficulty: 'Moderate'
  },
  // Railway GK & Current Affairs
  {
    id: 10,
    questionNumber: 10,
    section: 'General Awareness & Railway GK',
    prompt: 'What is the name of Indian Railways\' indigenous Automatic Train Protection (ATP) system designed to prevent collisions and Signal Passing at Danger (SPAD)?',
    hindiPrompt: 'ट्रेनों की टक्कर रोकने और सिग्नल ओवरशूट (SPAD) की रोकथाम के लिए भारतीय रेलवे द्वारा विकसित स्वदेशी स्वचालित ट्रेन सुरक्षा प्रणाली (ATP) का नाम क्या है?',
    options: [
      { key: 'A', text: 'TRISHA (Train Safety Apparatus)', hindiText: 'त्रिशा (TRISHA)' },
      { key: 'B', text: 'KAVACH', hindiText: 'कवच (KAVACH)' },
      { key: 'C', text: 'RAKSHAK-360', hindiText: 'रक्षक-360' },
      { key: 'D', text: 'SURAJ ATP', hindiText: 'सूरज ATP' }
    ],
    correctAnswer: 'B',
    explanation: 'KAVACH is the state-of-the-art indigenous Automatic Train Protection (ATP) system developed by RDSO (Research Designs and Standards Organisation). It automatically activates brakes if the loco pilot fails to do so and prevents head-on/rear-end collisions using RFID and ultra-high radio frequencies.',
    shortcutTip: 'KAVACH = SIL-4 certified Safety Integrity Level system covering Vande Bharat and mainline express corridors.',
    topic: 'Indian Railways Technology & Innovation',
    difficulty: 'Easy'
  },
  {
    id: 11,
    questionNumber: 11,
    section: 'General Awareness & Railway GK',
    prompt: 'On which river is the world\'s highest railway arch bridge constructed by Indian Railways in Jammu & Kashmir, standing 359 meters above the riverbed?',
    hindiPrompt: 'भारतीय रेलवे द्वारा जम्मू-कश्मीर में नदी तल से 359 मीटर की ऊंचाई पर विश्व का सबसे ऊंचा रेलवे आर्च ब्रिज किस नदी पर बनाया गया है?',
    options: [
      { key: 'A', text: 'Jhelum River', hindiText: 'झेलम नदी' },
      { key: 'B', text: 'Chenab River', hindiText: 'चिनाब नदी' },
      { key: 'C', text: 'Ravi River', hindiText: 'रावी नदी' },
      { key: 'D', text: 'Indus River', hindiText: 'सिंधु नदी' }
    ],
    correctAnswer: 'B',
    explanation: 'The Chenab Rail Bridge is an arch bridge spanning the Chenab River between Bakkal and Kauri in the Reasi district of Jammu and Kashmir. At 359 meters (1,178 ft) above the river, it is 35 meters higher than the Eiffel Tower in Paris.',
    shortcutTip: 'Chenab Bridge is part of USBRL (Udhampur-Srinagar-Baramulla Rail Link) project.',
    topic: 'Indian Railways Infrastructure & GK',
    difficulty: 'Easy'
  },
  {
    id: 12,
    questionNumber: 12,
    section: 'Basic Science & Engineering',
    prompt: 'In engineering mechanics, a class-1 lever has which component positioned strictly between the effort and the load?',
    hindiPrompt: 'इंजीनियरिंग यांत्रिकी में, प्रथम श्रेणी के उत्तोलक (Class-1 Lever) में आयास (Effort) और भार (Load) के ठीक बीच में कौन सा घटक स्थित होता है?',
    options: [
      { key: 'A', text: 'Fulcrum (Pivot Point)', hindiText: 'आलंब (Fulcrum)' },
      { key: 'B', text: 'Center of Gravity', hindiText: 'गुरुत्वाकर्षण केंद्र' },
      { key: 'C', text: 'Resistance Arm', hindiText: 'प्रतिरोध भुजा' },
      { key: 'D', text: 'Mechanical Advantage', hindiText: 'यांत्रिक लाभ' }
    ],
    correctAnswer: 'A',
    explanation: 'In a Class 1 lever, the Fulcrum is placed between the Load and the Effort (e.g., Crowbar, Scissors, Railway hand brake). In Class 2, Load is in middle (Wheelbarrow). In Class 3, Effort is in middle (Tweezers).',
    shortcutTip: 'Remember FLE: 1=Fulcrum in middle, 2=Load in middle, 3=Effort in middle.',
    topic: 'Levers & Simple Machines (RRB ALP Basic Science & Engineering)',
    difficulty: 'Moderate'
  }
];

export const RRB_ZONE_CUTOFFS: RRBZoneCutoff[] = [
  {
    zoneName: 'RRB Chennai (Southern Railway)',
    zoneCode: 'MAS',
    headquarters: 'Chennai, Tamil Nadu',
    activeVacancies: 3842,
    urCutoff: 73.85,
    obcCutoff: 70.12,
    scCutoff: 62.40,
    stCutoff: 58.75,
    ewsCutoff: 65.20,
    trend: 'Moderate'
  },
  {
    zoneName: 'RRB Mumbai (Central & Western Railway)',
    zoneCode: 'BCT',
    headquarters: 'Mumbai, Maharashtra',
    activeVacancies: 5210,
    urCutoff: 76.20,
    obcCutoff: 72.80,
    scCutoff: 64.15,
    stCutoff: 60.30,
    ewsCutoff: 68.45,
    trend: 'High'
  },
  {
    zoneName: 'RRB Kolkata (Eastern & South Eastern Railway)',
    zoneCode: 'ER',
    headquarters: 'Kolkata, West Bengal',
    activeVacancies: 4120,
    urCutoff: 78.40,
    obcCutoff: 74.90,
    scCutoff: 67.20,
    stCutoff: 59.80,
    ewsCutoff: 70.10,
    trend: 'Competitive'
  },
  {
    zoneName: 'RRB Secunderabad (South Central Railway)',
    zoneCode: 'SCR',
    headquarters: 'Secunderabad, Telangana',
    activeVacancies: 4680,
    urCutoff: 75.30,
    obcCutoff: 72.05,
    scCutoff: 63.80,
    stCutoff: 61.20,
    ewsCutoff: 67.50,
    trend: 'High'
  },
  {
    zoneName: 'RRB Prayagraj / Allahabad (North Central Railway)',
    zoneCode: 'NCR',
    headquarters: 'Prayagraj, Uttar Pradesh',
    activeVacancies: 4890,
    urCutoff: 81.20,
    obcCutoff: 77.80,
    scCutoff: 69.50,
    stCutoff: 63.40,
    ewsCutoff: 74.30,
    trend: 'Competitive'
  },
  {
    zoneName: 'RRB Bangalore (South Western Railway)',
    zoneCode: 'SWR',
    headquarters: 'Bengaluru, Karnataka',
    activeVacancies: 3450,
    urCutoff: 71.40,
    obcCutoff: 68.20,
    scCutoff: 60.10,
    stCutoff: 56.40,
    ewsCutoff: 63.80,
    trend: 'Moderate'
  },
  {
    zoneName: 'RRB Chandigarh (Northern Railway)',
    zoneCode: 'NR',
    headquarters: 'Chandigarh, Punjab/Haryana',
    activeVacancies: 3980,
    urCutoff: 80.50,
    obcCutoff: 76.90,
    scCutoff: 68.40,
    stCutoff: 62.10,
    ewsCutoff: 73.10,
    trend: 'Competitive'
  },
  {
    zoneName: 'RRB Bilaspur (South East Central Railway)',
    zoneCode: 'SECR',
    headquarters: 'Bilaspur, Chhattisgarh',
    activeVacancies: 2950,
    urCutoff: 72.10,
    obcCutoff: 69.40,
    scCutoff: 61.30,
    stCutoff: 57.20,
    ewsCutoff: 64.90,
    trend: 'Moderate'
  },
  {
    zoneName: 'RRB Patna (East Central Railway)',
    zoneCode: 'ECR',
    headquarters: 'Patna, Bihar',
    activeVacancies: 3620,
    urCutoff: 82.15,
    obcCutoff: 79.20,
    scCutoff: 70.80,
    stCutoff: 65.10,
    ewsCutoff: 76.40,
    trend: 'Competitive'
  },
  {
    zoneName: 'RRB Guwahati (Northeast Frontier Railway)',
    zoneCode: 'NFR',
    headquarters: 'Guwahati, Assam',
    activeVacancies: 2150,
    urCutoff: 68.50,
    obcCutoff: 64.20,
    scCutoff: 57.80,
    stCutoff: 52.90,
    ewsCutoff: 60.40,
    trend: 'Moderate'
  }
];

export interface PsychoTestBattery {
  id: string;
  name: string;
  testType: string;
  timeLimitSec: number;
  questionCount: number;
  description: string;
  passingTScore: number;
  instructions: string[];
}

export const RRB_ALP_PSYCHO_BATTERIES: PsychoTestBattery[] = [
  {
    id: 'memory-test',
    name: 'Battery 1: Memory Test',
    testType: 'Building & Map Location Retention',
    timeLimitSec: 180,
    questionCount: 12,
    description: 'Memorize the exact location of buildings/structures on a railway junction grid, then identify missing items from memory.',
    passingTScore: 42,
    instructions: [
      'Study the layout map for 2 minutes carefully.',
      'Remember relative positions of stations, signal cabins, and tracks.',
      'In test phase, place each building icon in its original location grid.'
    ]
  },
  {
    id: 'following-directions',
    name: 'Battery 2: Following Directions / Table Test',
    testType: 'Alphabet & Matrix Route Navigation',
    timeLimitSec: 150,
    questionCount: 10,
    description: 'Quickly find designated letters and symbols following clockwise, counter-clockwise and diagonal directional instructions.',
    passingTScore: 42,
    instructions: [
      'Read the directional prompt (e.g. Move 2 rows up, 3 columns right, turn clockwise).',
      'Identify the final target alphabet on the matrix within 15 seconds per question.'
    ]
  },
  {
    id: 'depth-perception',
    name: 'Battery 3: Depth Perception (Brick Test)',
    testType: '3D Spatial Brick Touching Count',
    timeLimitSec: 180,
    questionCount: 15,
    description: 'Count how many other bricks a specific lettered brick (A, B, C, D, E) is directly in physical surface contact with.',
    passingTScore: 42,
    instructions: [
      'Look at the 3D isometric stack of bricks.',
      'Identify the target brick label.',
      'Count ONLY the bricks that touch the surface of the target brick (corners or edges without face contact do not count).'
    ]
  },
  {
    id: 'concentration-test',
    name: 'Battery 4: Concentration Test',
    testType: 'Digit 6 or 9 Quick Search',
    timeLimitSec: 120,
    questionCount: 20,
    description: 'Rapid scanning test to count occurrences of the digit 6 or 9 in large rows of numeric sequences under strict time pressure.',
    passingTScore: 42,
    instructions: [
      'Scan the digit string from left to right.',
      'Count total occurrences of 6 and verify whether total is even or odd.'
    ]
  },
  {
    id: 'perceptual-speed',
    name: 'Battery 5: Perceptual Speed Test',
    testType: 'Similarity & Hexagonal Pattern Match',
    timeLimitSec: 150,
    questionCount: 18,
    description: 'Identify identical geometrical railway signaling patterns among confusing distractors with minute angle/shade differences.',
    passingTScore: 42,
    instructions: [
      'Observe the master sign diagram on the left.',
      'Pick the exact matching figure among options A, B, C, D within 5 seconds.'
    ]
  }
];

export const RAILWAY_GK_CAPSULES = [
  {
    title: 'Historic Milestones of Indian Railways',
    points: [
      'First Train in India ran on April 16, 1853 between Bori Bunder (Bombay) and Thane (34 km with 3 locomotives: Sahib, Sindh, Sultan).',
      'First Electric Train ran on February 3, 1925 between Bombay VT and Kurla Harbour on 1500V DC.',
      'Fairy Queen (1855) is the world\'s oldest working steam locomotive still in regular service.',
      'National Rail Museum is located in Chanakyapuri, New Delhi.'
    ]
  },
  {
    title: 'Modern Indian Railways & High Speed Corridors',
    points: [
      'Vande Bharat Express (Train 18) was designed & manufactured indigenously by Integral Coach Factory (ICF), Chennai.',
      'World\'s Highest Railway Arch Bridge is Chenab Bridge in Reasi, J&K (359 meters high).',
      'Dedicated Freight Corridors (DFCs): Eastern DFC (Ludhiana to Dankuni - 1,875 km) & Western DFC (Dadri to JNPT Mumbai - 1,506 km).',
      'Bullet Train Project: Mumbai-Ahmedabad High Speed Rail (MAHSR) with E5 series Shinkansen technology.'
    ]
  },
  {
    title: 'Zones, Headquarters & World Heritage Sites',
    points: [
      'Total 18 Railway Zones in India (18th Zone: South Coast Railway - SCoR, Visakhapatnam).',
      '4 UNESCO World Heritage Railways: Darjeeling Himalayan Railway, Nilgiri Mountain Railway, Kalka-Shimla Railway, and Chhatrapati Shivaji Maharaj Terminus (CSMT).',
      'Longest Railway Platform in the World: Shree Siddharoodha Swamiji Hubballi Junction (Karnataka) - 1,507 meters.',
      'Longest Train Route in India: Vivek Express (Dibrugarh to Kanyakumari - 4,189 km in ~75 hours).'
    ]
  }
];
