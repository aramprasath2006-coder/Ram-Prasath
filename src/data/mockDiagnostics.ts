import { ExamDiagnostic } from '../types';

export const INITIAL_DIAGNOSTICS: Record<string, ExamDiagnostic> = {
  'rrb-ntpc': {
    examId: 'rrb-ntpc',
    examName: 'Railway Recruitment Board (RRB NTPC CBT-1 & 2)',
    targetDate: 'Nov 18, 2026',
    daysLeft: 76,
    overallReadinessPct: 78,
    predictedPercentile: 92.4,
    predictedScore: 84.5,
    totalPossibleScore: 100,
    categoryScores: [
      {
        category: 'Mathematics & Speed Quantitative',
        scorePct: 86,
        weightPct: 30,
        status: 'Strong',
        recommendedDrill: 'Advanced Number Systems & Mensuration 3D',
        actionItem: 'Maintain current velocity; practice 25 speed drill questions daily.'
      },
      {
        category: 'General Intelligence & Reasoning',
        scorePct: 88,
        weightPct: 30,
        status: 'Strong',
        recommendedDrill: 'Syllogisms & Circular Seating Arrangement',
        actionItem: 'Speed is good; focus on edge cases with negative premises.'
      },
      {
        category: 'General Science (Physics & Chemistry)',
        scorePct: 74,
        weightPct: 20,
        status: 'Average',
        recommendedDrill: 'Ohm\'s Law Circuits, Periodic Trends & Lens Optics',
        actionItem: 'Review NCERT Class 9-10 science chapter summaries and formula flashcards.'
      },
      {
        category: 'Indian Railways & Current Affairs GK',
        scorePct: 58,
        weightPct: 20,
        status: 'Critical Review',
        recommendedDrill: 'Railway Zones, Vande Bharat Routes & Union Budget Schemes',
        actionItem: 'Spend 30 minutes daily in the Railway GK Flashcard module and passout hub notes.'
      }
    ],
    sprintPlan: [
      {
        dayRange: 'Days 1 - 10',
        focusArea: 'Intensive GK & Science Deficit Elimination',
        targetActions: [
          'Complete 50 Railway GK flashcards with Leitner repetitions',
          'Review Physics formulas for Work, Energy & Electric Power',
          'Attempt 2 targeted 30-min sectional mock tests'
        ],
        urgency: 'high'
      },
      {
        dayRange: 'Days 11 - 20',
        focusArea: 'Speed Arithmetic & Negative Marking Control',
        targetActions: [
          'Time & Work and Trains relative speed shortcut drills',
          'Limit skipped questions to under 8% to maximize score',
          'Take full-length CBT-1 Simulator Test #4'
        ],
        urgency: 'medium'
      },
      {
        dayRange: 'Days 21 - 30',
        focusArea: 'Full CBT Simulation & Endurance Optimization',
        targetActions: [
          'Simulate 90-minute timed conditions in RRB Portal at 10:00 AM',
          'Fine-tune error log notebook and revisit marked formula cheat sheets',
          'Complete CBT Psycho test speed aptitude drill'
        ],
        urgency: 'normal'
      }
    ]
  },
  'gate-me': {
    examId: 'gate-me',
    examName: 'GATE 2027 Mechanical Engineering (IIT Guwahati)',
    targetDate: 'Feb 07, 2027',
    daysLeft: 157,
    overallReadinessPct: 82,
    predictedPercentile: 96.8,
    predictedScore: 71.5,
    totalPossibleScore: 100,
    categoryScores: [
      {
        category: 'Applied Thermodynamics & Thermal Fluids',
        scorePct: 89,
        weightPct: 25,
        status: 'Strong',
        recommendedDrill: 'Refrigeration Cycles & Steam Turbines Rankine Variations',
        actionItem: 'Solid conceptual foundation; practice multi-stage compression numericals.'
      },
      {
        category: 'Engineering Mathematics',
        scorePct: 84,
        weightPct: 15,
        status: 'Strong',
        recommendedDrill: 'Vector Integral Theorems & Laplace Differential Equations',
        actionItem: 'Revisit Green\'s Theorem surface area integrals.'
      },
      {
        category: 'Strength of Materials & Machine Design',
        scorePct: 76,
        weightPct: 25,
        status: 'Average',
        recommendedDrill: 'Mohr\'s Circle Multi-axial Stress & Thick Cylinders',
        actionItem: 'Review principal stress directions and torsion of thin-walled tubes.'
      },
      {
        category: 'Manufacturing & Industrial Engineering',
        scorePct: 62,
        weightPct: 20,
        status: 'Critical Review',
        recommendedDrill: 'Merchant Circle Force Analysis & Orthogonal Cutting Equations',
        actionItem: 'High-yield scoring area; memorize Taylor\'s tool life equation and shear angle relations.'
      },
      {
        category: 'General Aptitude (Verbal & Numerical)',
        scorePct: 91,
        weightPct: 15,
        status: 'Strong',
        recommendedDrill: 'Spatial Reasoning & Data Interpretation',
        actionItem: 'Consistent full marks in aptitude practice.'
      }
    ],
    sprintPlan: [
      {
        dayRange: 'Days 1 - 15',
        focusArea: 'Manufacturing Sciences & Metal Cutting Deep-Dive',
        targetActions: [
          'Solve 40 previous GATE 2-mark questions on Merchant circle and shear strain',
          'Master casting solidification time (Chvorinov\'s rule)',
          'Complete Manufacturing flashcard revision deck'
        ],
        urgency: 'high'
      },
      {
        dayRange: 'Days 16 - 30',
        focusArea: 'Machine Design & Failure Theories Numerical Drills',
        targetActions: [
          'Von Mises vs Tresca yield criteria comparison problems',
          'Soderberg and Goodman line fatigue endurance limits',
          'Attempt 1 Subject Mock Test on Machine Design'
        ],
        urgency: 'medium'
      },
      {
        dayRange: 'Days 31 - 45',
        focusArea: 'Full-Length 65-Question Virtual Calculator Test',
        targetActions: [
          'Simulate 180-minute GATE test with official virtual scientific calculator',
          'Target less than 3 negative marks across 65 questions'
        ],
        urgency: 'normal'
      }
    ]
  },
  'upsc-cse': {
    examId: 'upsc-cse',
    examName: 'UPSC Civil Services Examination (IAS / IPS Prelims)',
    targetDate: 'May 24, 2027',
    daysLeft: 263,
    overallReadinessPct: 71,
    predictedPercentile: 89.2,
    predictedScore: 98.0,
    totalPossibleScore: 200,
    categoryScores: [
      {
        category: 'Indian Polity & Governance',
        scorePct: 85,
        weightPct: 22,
        status: 'Strong',
        recommendedDrill: 'Constitutional Bodies & Supreme Court Landmark Judgments',
        actionItem: 'Continue revising fundamental rights, DPSP, and basic structure doctrine.'
      },
      {
        category: 'Modern Indian History & Culture',
        scorePct: 75,
        weightPct: 20,
        status: 'Average',
        recommendedDrill: 'Freedom Struggle Chronology & Tribal Uprisings',
        actionItem: 'Map out timeline from 1905 Swadeshi to 1947 Independence.'
      },
      {
        category: 'Environment, Ecology & Biodiversity',
        scorePct: 60,
        weightPct: 22,
        status: 'Critical Review',
        recommendedDrill: 'IUCN Red List Species, Ramsar Wetlands & Wildlife Acts',
        actionItem: 'Crucial high-weightage domain; review National Parks map locations and COP declarations.'
      },
      {
        category: 'Indian Economy & Macro Indicators',
        scorePct: 78,
        weightPct: 20,
        status: 'Average',
        recommendedDrill: 'Monetary Policy Committee, Inflation Indices & Balance of Payments',
        actionItem: 'Revisit capital account vs current account components.'
      },
      {
        category: 'Science & Tech and Current Events',
        scorePct: 68,
        weightPct: 16,
        status: 'Average',
        recommendedDrill: 'Space Missions (ISRO), Biotechnology & Quantum Computing',
        actionItem: 'Consolidate monthly current affairs compilations.'
      }
    ],
    sprintPlan: [
      {
        dayRange: 'Days 1 - 15',
        focusArea: 'Environment & Wildlife Protection Acts',
        targetActions: [
          'Memorize critically endangered species in India and habitats',
          'Review Environmental Protection Act 1986 and Biological Diversity Act 2002',
          'Solve 50 previous Prelims questions on Ecology'
        ],
        urgency: 'high'
      },
      {
        dayRange: 'Days 16 - 30',
        focusArea: 'Economic Survey & High-Yield Polity',
        targetActions: [
          'Complete 30 Polity flashcards on Constitutional Amendments',
          'Review RBI repo rates and liquidity adjustment facility mechanisms',
          'Attempt 1 full GS Paper-I 100-question mock test'
        ],
        urgency: 'medium'
      }
    ]
  }
};
