import { Flashcard } from '../types';

export const INITIAL_FLASHCARDS: Flashcard[] = [
  // GATE Mechanical & Thermal
  {
    id: 'fc-gate-01',
    category: 'gate-me',
    categoryLabel: 'GATE Mechanical',
    subtopic: 'Thermodynamics',
    question: 'What is the theoretical thermal efficiency of a Carnot Engine operating between temperatures T_H and T_L?',
    answer: 'Carnot efficiency depends solely on the absolute temperatures of the heat source and sink: η_Carnot = 1 - (T_L / T_H) = (T_H - T_L) / T_H, where temperatures must be in Kelvin.',
    formula: 'η = 1 - (T_L / T_H)',
    tip: 'Always convert Celsius to Kelvin (K = °C + 273.15). No real engine can exceed this limit.',
    mnemonic: 'Hot minus Cold over Hot (H-C)/H',
    difficulty: 'Easy',
    boxLevel: 2,
    mastered: false
  },
  {
    id: 'fc-gate-02',
    category: 'gate-me',
    categoryLabel: 'GATE Mechanical',
    subtopic: 'Fluid Mechanics',
    question: 'State the Bernoulli Equation along a streamline for an incompressible, inviscid, steady, irrotational fluid.',
    answer: 'The total mechanical energy per unit weight remains constant along a streamline: (P / ρg) + (V² / 2g) + z = Constant. Terms represent Pressure Head, Velocity Head, and Datum Head.',
    formula: '(P / ρg) + (V² / 2g) + z = C',
    tip: 'Applies ONLY to steady, non-viscous (inviscid), incompressible flow along a streamline without shaft work or heat transfer.',
    mnemonic: 'P-V-Z: Pressure, Velocity, Zenith (height)',
    difficulty: 'Moderate',
    boxLevel: 3,
    mastered: false
  },
  {
    id: 'fc-gate-03',
    category: 'gate-me',
    categoryLabel: 'GATE Mechanical',
    subtopic: 'Strength of Materials',
    question: 'What is the Euler critical buckling load for a column of length L with one end fixed and the other end pinned (hinged)?',
    answer: 'For a fixed-pinned column, the effective length is L_e = L / √2 ≈ 0.707 L. The Euler critical buckling load is P_cr = (2 π² E I) / L².',
    formula: 'P_cr = (π² E I) / (L_e)² = (2.04 π² E I) / L²',
    tip: 'GATE frequently asks effective length ratios: Both Hinged (L_e=L), Both Fixed (L_e=0.5L), Fixed-Free (L_e=2L), Fixed-Pinned (L_e=0.7L).',
    mnemonic: 'Fixed-Pinned is about 70% of actual length (0.7L)',
    difficulty: 'Hard',
    boxLevel: 1,
    mastered: false
  },
  {
    id: 'fc-gate-04',
    category: 'gate-me',
    categoryLabel: 'GATE Mechanical',
    subtopic: 'Heat Transfer',
    question: 'What is the definition and physical significance of the Nusselt Number (Nu)?',
    answer: 'Nu = (h * L_c) / k_fluid. It represents the ratio of convective heat transfer to conductive heat transfer across the same boundary layer thickness.',
    formula: 'Nu = (h * L) / k_fluid',
    tip: 'Do not confuse with Biot number: Biot uses k_solid (internal conduction resistance), Nusselt uses k_fluid.',
    mnemonic: 'Nu = Convection / Pure Conduction (in fluid)',
    difficulty: 'Moderate',
    boxLevel: 2,
    mastered: false
  },

  // Railway Recruitment (RRB)
  {
    id: 'fc-rrb-01',
    category: 'rrb-railway',
    categoryLabel: 'RRB Railways',
    subtopic: 'General Science',
    question: 'What is the SI unit of electrical resistance and what is Ohm\'s law formula relating Voltage (V), Current (I), and Resistance (R)?',
    answer: 'The SI unit of resistance is Ohm (Ω). Ohm\'s law states that at constant temperature, current through a conductor is directly proportional to potential difference: V = I * R.',
    formula: 'V = I * R  ⇒  R = V / I',
    tip: '1 Ohm = 1 Volt / 1 Ampere. Resistance doubles if length of wire doubles, and halves if cross-sectional area doubles (R = ρL/A).',
    mnemonic: 'V on top of I and R in the magic triangle',
    difficulty: 'Easy',
    boxLevel: 4,
    mastered: true
  },
  {
    id: 'fc-rrb-02',
    category: 'rrb-railway',
    categoryLabel: 'RRB Railways',
    subtopic: 'Indian Railways GK',
    question: 'Where is the headquarters of South Central Railway (SCR) and Western Railway (WR)?',
    answer: 'South Central Railway (SCR) headquarters is at Secunderabad (Telangana). Western Railway (WR) headquarters is at Churchgate, Mumbai (Maharashtra).',
    tip: 'Total railway zones in India: 19 (including Kolkata Metro & South Coast Railway). Central Railway headquarters is at CSMT Mumbai.',
    mnemonic: 'SCR = Secunderabad | WR = Western Gateway (Churchgate)',
    difficulty: 'Moderate',
    boxLevel: 2,
    mastered: false
  },
  {
    id: 'fc-rrb-03',
    category: 'rrb-railway',
    categoryLabel: 'RRB Railways',
    subtopic: 'General Science (Physics)',
    question: 'What is the value of acceleration due to gravity on the surface of the Moon compared to the Earth?',
    answer: 'g_moon ≈ g_earth / 6 ≈ 1.62 m/s². An astronaut weighing 60 kg on Earth has a mass of 60 kg on the Moon, but weight of only ~98 Newtons (instead of 588 N on Earth).',
    formula: 'g_moon = 1/6 * g_earth ≈ 1.625 m/s²',
    tip: 'Mass is constant everywhere! Only weight (W = m*g) changes.',
    mnemonic: 'One-Sixth of Earth gravity',
    difficulty: 'Easy',
    boxLevel: 3,
    mastered: false
  },
  {
    id: 'fc-rrb-04',
    category: 'rrb-railway',
    categoryLabel: 'RRB Railways',
    subtopic: 'Railway Technology (ALP/Tech)',
    question: 'What type of braking system is standard on Indian Railways LHB coaching stock?',
    answer: 'Electro-Pneumatic Disc Brake System with Wheel Slide Protection (WSP) unit. Each axle has two axle-mounted cast steel brake discs clamped by synthetic brake pads.',
    tip: 'LHB coaches operate safely up to 160-200 km/h, compared to older ICF coaches that used cast iron brake blocks on wheel treads.',
    mnemonic: 'LHB uses Disc Brakes + WSP (Anti-skid)',
    difficulty: 'Hard',
    boxLevel: 1,
    mastered: false
  },

  // Higher Engineering Mathematics
  {
    id: 'fc-math-01',
    category: 'math',
    categoryLabel: 'Engineering Math',
    subtopic: 'Linear Algebra',
    question: 'What are the two fundamental properties of eigenvalues of any square matrix A?',
    answer: '1. The SUM of the eigenvalues equals the TRACE of the matrix (sum of main diagonal elements): Σ λ_i = tr(A).\n2. The PRODUCT of the eigenvalues equals the DETERMINANT of the matrix: Π λ_i = det(A).',
    formula: 'Σ λ_i = Trace(A)  &  Π λ_i = det(A)',
    tip: 'Use these two properties in GATE/RRB to instantly eliminate 3 out of 4 options without solving the characteristic polynomial!',
    mnemonic: 'Sum = Trace, Product = Determinant',
    difficulty: 'Moderate',
    boxLevel: 3,
    mastered: false
  },
  {
    id: 'fc-math-02',
    category: 'math',
    categoryLabel: 'Engineering Math',
    subtopic: 'Vector Calculus',
    question: 'What is the physical interpretation and condition for a vector field F to be Solenoidal vs Irrotational?',
    answer: '• Solenoidal: Divergence is zero, ∇ · F = 0 (no net flux source or sink, e.g. magnetic B-field).\n• Irrotational (Conservative): Curl is zero, ∇ × F = 0 (can be expressed as gradient of scalar potential F = ∇φ).',
    formula: '∇ · F = 0 (Solenoidal)  |  ∇ × F = 0 (Irrotational)',
    tip: 'If ∇ × F = 0, line integral ∮ F · dr around any closed contour is exactly zero.',
    mnemonic: 'Div 0 = Solenoid (no divergence) | Curl 0 = Irrotational (no rotation)',
    difficulty: 'Moderate',
    boxLevel: 2,
    mastered: false
  },
  {
    id: 'fc-math-03',
    category: 'math',
    categoryLabel: 'Engineering Math',
    subtopic: 'Differential Equations',
    question: 'What is the integrating factor (I.F.) for the linear first-order differential equation: dy/dx + P(x)y = Q(x)?',
    answer: 'The integrating factor is I.F. = e^(∫ P(x) dx). The general solution is y * (I.F.) = ∫ [Q(x) * (I.F.)] dx + C.',
    formula: 'I.F. = exp( ∫ P(x) dx )',
    tip: 'Ensure the coefficient of dy/dx is strictly 1 before identifying P(x) and Q(x).',
    mnemonic: 'e to the integral of P',
    difficulty: 'Easy',
    boxLevel: 3,
    mastered: false
  },

  // Quantitative Aptitude
  {
    id: 'fc-apt-01',
    category: 'aptitude',
    categoryLabel: 'Quantitative Aptitude',
    subtopic: 'Speed, Time & Distance',
    question: 'What is the formula for the time taken by a train of length L_1 moving at speed S_1 to cross a platform of length L_2?',
    answer: 'Total distance to cover is (L_1 + L_2). Time = Total Distance / Speed = (L_1 + L_2) / S_1. Ensure speeds in km/h are converted to m/s by multiplying by (5 / 18).',
    formula: 'Time = (L_train + L_platform) / (Speed * 5/18)',
    tip: 'Speed conversion: 1 km/h = 5/18 m/s, and 1 m/s = 18/5 km/h.',
    mnemonic: '5/18 to shrink km/h into m/s',
    difficulty: 'Easy',
    boxLevel: 4,
    mastered: true
  },
  {
    id: 'fc-apt-02',
    category: 'aptitude',
    categoryLabel: 'Quantitative Aptitude',
    subtopic: 'Work & Efficiency',
    question: 'If A alone can finish a job in 12 days and B alone can finish the same job in 18 days, how many days will they take working together?',
    answer: 'Using LCM method:\nTotal Work = LCM(12, 18) = 36 units.\nEfficiency of A = 36/12 = 3 units/day.\nEfficiency of B = 36/18 = 2 units/day.\nCombined efficiency = 3 + 2 = 5 units/day.\nTime together = 36 / 5 = 7.2 days (or 7 1/5 days).',
    formula: 'Time = (A * B) / (A + B) = (12 * 18) / (12 + 18) = 216 / 30 = 7.2',
    tip: 'The product-over-sum trick (A*B)/(A+B) is faster for two workers, but LCM method scales to 3+ workers.',
    mnemonic: 'Product over Sum',
    difficulty: 'Moderate',
    boxLevel: 2,
    mastered: false
  },
  {
    id: 'fc-apt-03',
    category: 'aptitude',
    categoryLabel: 'Quantitative Aptitude',
    subtopic: 'Compound Interest',
    question: 'What is the difference between Compound Interest (CI) and Simple Interest (SI) for 2 years at rate R% per annum on principal P?',
    answer: 'Difference (CI - SI) for 2 years = P * (R / 100)². For 3 years: Difference = P * (R/100)² * [(300 + R) / 100].',
    formula: 'Δ_2yr = P * (R / 100)²',
    tip: 'This direct 2-year difference formula saves up to 2 minutes of repetitive compounding calculations in RRB NTPC & Bank exams.',
    mnemonic: 'P * (R/100) squared',
    difficulty: 'Hard',
    boxLevel: 1,
    mastered: false
  },

  // Indian Polity & Constitution (UPSC / State PSC)
  {
    id: 'fc-pol-01',
    category: 'polity',
    categoryLabel: 'Indian Polity (UPSC)',
    subtopic: 'Fundamental Rights',
    question: 'Which constitutional article is known as the "Heart and Soul of the Constitution" by Dr. B.R. Ambedkar, and what does it guarantee?',
    answer: 'Article 32: Right to Constitutional Remedies. It empowers citizens to move the Supreme Court directly for the enforcement of Fundamental Rights via 5 Prerogative Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo-Warranto.',
    tip: 'Article 226 gives similar (and wider) writ jurisdiction to High Courts, including non-fundamental legal rights.',
    mnemonic: 'Article 32 = Supreme Court Writs | Article 226 = High Court Writs',
    difficulty: 'Moderate',
    boxLevel: 3,
    mastered: false
  },
  {
    id: 'fc-pol-02',
    category: 'polity',
    categoryLabel: 'Indian Polity (UPSC)',
    subtopic: 'Emergency Provisions',
    question: 'What are the three types of emergencies in the Indian Constitution and their corresponding Articles?',
    answer: '1. National Emergency: Article 352 (grounds: War, External Aggression, Armed Rebellion).\n2. President\'s Rule (State Emergency): Article 356 & Article 365 (failure of constitutional machinery in state).\n3. Financial Emergency: Article 360 (threat to financial stability/credit of India - never declared so far).',
    formula: 'Articles: 352 (+4) -> 356 (+4) -> 360',
    tip: 'Remember the "+4" rule: 352 + 4 = 356, 356 + 4 = 360.',
    mnemonic: 'The Rule of 4: 352, 356, 360',
    difficulty: 'Easy',
    boxLevel: 4,
    mastered: true
  }
];
