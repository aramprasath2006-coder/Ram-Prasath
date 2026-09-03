import { FormulaItem } from '../types';

export const INITIAL_FORMULAS: FormulaItem[] = [
  // GATE Mechanical
  {
    id: 'form-gate-01',
    category: 'GATE Mechanical',
    subject: 'Applied Thermodynamics',
    title: 'Carnot Cycle Thermal Efficiency',
    formula: 'η_th = 1 - (T_L / T_H) = (T_H - T_L) / T_H',
    variables: [
      { symbol: 'η_th', meaning: 'Thermal Efficiency (fraction or %)', unit: 'dimensionless' },
      { symbol: 'T_H', meaning: 'Absolute Temperature of Heat Source', unit: 'Kelvin (K)' },
      { symbol: 'T_L', meaning: 'Absolute Temperature of Heat Sink', unit: 'Kelvin (K)' }
    ],
    description: 'Defines the upper thermodynamic ceiling of efficiency for any heat engine operating between two fixed thermal reservoirs.',
    keyApplications: [
      'Maximum theoretical work calculation in power cycles',
      'Second Law of Thermodynamics violations verification',
      'Reversible heat pump & refrigerator COP bounds'
    ],
    commonPitfalls: 'Using Celsius (°C) instead of absolute Kelvin (K). Always add 273.15 before substitution.',
    examSignificance: 'Ultra High Yield',
    tags: ['Thermodynamics', 'Carnot', 'Cycles', 'Efficiency']
  },
  {
    id: 'form-gate-02',
    category: 'GATE Mechanical',
    subject: 'Fluid Mechanics',
    title: 'Darcy-Weisbach Major Pipe Head Loss',
    formula: 'h_f = (f * L * V²) / (2 * g * D) = (8 * f * L * Q²) / (π² * g * D⁵)',
    variables: [
      { symbol: 'h_f', meaning: 'Frictional head loss', unit: 'meters (m)' },
      { symbol: 'f', meaning: 'Darcy friction factor (f = 4 * f_fanning)', unit: 'dimensionless' },
      { symbol: 'L', meaning: 'Pipe length', unit: 'meters (m)' },
      { symbol: 'V', meaning: 'Mean flow velocity', unit: 'm/s' },
      { symbol: 'D', meaning: 'Internal pipe diameter', unit: 'meters (m)' },
      { symbol: 'Q', meaning: 'Volumetric flow rate', unit: 'm³/s' }
    ],
    description: 'Calculates the pressure drop or head loss due to boundary shear friction in steady, incompressible pipe flow.',
    keyApplications: [
      'Pumping power sizing for water supply systems',
      'Hydraulic grade line (HGL) and Energy grade line (EGL) plots',
      'Laminar flow: f = 64 / Re; Turbulent flow: Moody diagram'
    ],
    commonPitfalls: 'Confusing Darcy friction factor (f) with Fanning friction coefficient (f_F = f / 4). If formula uses 4fLV²/(2gD), f is Fanning!',
    examSignificance: 'Ultra High Yield',
    tags: ['Fluid Mechanics', 'Pipes', 'Friction', 'Head Loss']
  },
  {
    id: 'form-gate-03',
    category: 'GATE Mechanical',
    subject: 'Strength of Materials',
    title: 'Flexural Bending Stress Equation',
    formula: '(M / I) = (σ_b / y) = (E / R)',
    variables: [
      { symbol: 'M', meaning: 'Bending moment at section', unit: 'N·m' },
      { symbol: 'I', meaning: 'Area moment of inertia about neutral axis', unit: 'm⁴' },
      { symbol: 'σ_b', meaning: 'Normal bending stress at fiber distance y', unit: 'Pa or MPa' },
      { symbol: 'y', meaning: 'Perpendicular distance from Neutral Axis', unit: 'meters (m)' },
      { symbol: 'E', meaning: 'Modulus of Elasticity (Young\'s Modulus)', unit: 'GPa' },
      { symbol: 'R', meaning: 'Radius of curvature of bent neutral axis', unit: 'meters (m)' }
    ],
    description: 'Fundamental pure bending relationship relating internal moment, beam geometry, stress profile, and curvature.',
    keyApplications: [
      'Maximum tensile and compressive fiber stress in I-beams',
      'Section Modulus Z = I / y_max sizing (σ_max = M / Z)',
      'Curvature relation d²y/dx² = M / (E*I)'
    ],
    commonPitfalls: 'Evaluating I about the wrong axis. Must always be about the neutral centroidal bending axis.',
    examSignificance: 'Ultra High Yield',
    tags: ['SOM', 'Beams', 'Bending Stress', 'Section Modulus']
  },

  // Railway Science & Tech
  {
    id: 'form-rrb-01',
    category: 'Railway Science',
    subject: 'Basic Electrical Engineering',
    title: 'Electrical Power & Joule\'s Heating Law',
    formula: 'P = V * I = I² * R = V² / R   |   H = I² * R * t',
    variables: [
      { symbol: 'P', meaning: 'Electric power consumed', unit: 'Watts (W)' },
      { symbol: 'V', meaning: 'Voltage across component', unit: 'Volts (V)' },
      { symbol: 'I', meaning: 'Current flowing', unit: 'Amperes (A)' },
      { symbol: 'R', meaning: 'Electrical resistance', unit: 'Ohms (Ω)' },
      { symbol: 'H', meaning: 'Heat energy dissipated', unit: 'Joules (J)' },
      { symbol: 't', meaning: 'Time duration', unit: 'seconds (s)' }
    ],
    description: 'Relates electrical rate of energy transfer and thermal dissipation in resistive conductors.',
    keyApplications: [
      'Locomotive traction motor wattage calculation',
      'Series vs Parallel heating resistor comparisons',
      'Circuit breaker (MCB) amp rating verification'
    ],
    commonPitfalls: 'For bulbs in series, the lowest wattage bulb has higher resistance and glows brighter; in parallel, the higher wattage bulb glows brighter.',
    examSignificance: 'Ultra High Yield',
    tags: ['RRB ALP', 'Electricity', 'Power', 'Ohm\'s Law']
  },
  {
    id: 'form-rrb-02',
    category: 'Railway Science',
    subject: 'Railway Track Engineering',
    title: 'Equilibrium Superelevation (Cant) on Curves',
    formula: 'e = (G * V²) / (127 * R)',
    variables: [
      { symbol: 'e', meaning: 'Equilibrium Cant (elevation of outer rail)', unit: 'centimeters (cm) or mm' },
      { symbol: 'G', meaning: 'Dynamic gauge of railway track (1750 mm for BG)', unit: 'mm' },
      { symbol: 'V', meaning: 'Speed of the train', unit: 'km/h' },
      { symbol: 'R', meaning: 'Radius of circular curve', unit: 'meters (m)' }
    ],
    description: 'Gives the height by which the outer rail must be raised above the inner rail on a horizontal curve to counter centrifugal acceleration.',
    keyApplications: [
      'Indian Railways Broad Gauge (BG = 1.676m) track design',
      'Cant deficiency and maximum permissible speed calculation',
      'Passenger comfort and equal wheel flange wear'
    ],
    commonPitfalls: 'For Broad Gauge standard formula: e (in cm) = (G * V²) / (127 * R) = (1.676 * V²) / (127 * R) ≈ (V²) / (75.8 * R). Units must strictly match!',
    examSignificance: 'Frequently Tested',
    tags: ['Civil Engineering', 'Railway Tracks', 'Cant', 'Curves']
  },

  // Engineering Mathematics
  {
    id: 'form-math-01',
    category: 'Engineering Math',
    subject: 'Vector Calculus',
    title: 'Green\'s & Gauss Divergence Theorems',
    formula: '∮_C (P dx + Q dy) = ∬_R (∂Q/∂x - ∂P/∂y) dA   |   ∯_S (F · n̂) dS = ∭_V (∇ · F) dV',
    variables: [
      { symbol: 'P, Q', meaning: 'Scalar components of planar vector field', unit: 'functions of x,y' },
      { symbol: 'C', meaning: 'Closed positively oriented boundary curve', unit: 'contour' },
      { symbol: 'F', meaning: 'Vector field in 3D space', unit: 'vector' },
      { symbol: '∇ · F', meaning: 'Divergence of F = ∂F_x/∂x + ∂F_y/∂y + ∂F_z/∂z', unit: 'scalar' }
    ],
    description: 'Transforms difficult line integrals over closed loops into 2D area integrals, and closed surface flux integrals into 3D volume integrals.',
    keyApplications: [
      'Evaluating work done along closed non-conservative loops',
      'Calculating area enclosed by parameter curves: Area = 1/2 ∮ (x dy - y dx)',
      'Net outward flux from closed spheres, cylinders, and boxes'
    ],
    commonPitfalls: 'Applying Divergence theorem to an open surface (like an open hemisphere) without closing the base circle.',
    examSignificance: 'Ultra High Yield',
    tags: ['Calculus', 'Vectors', 'Green\'s', 'Gauss Divergence']
  },
  {
    id: 'form-math-02',
    category: 'Engineering Math',
    subject: 'Linear Algebra',
    title: 'Cayley-Hamilton Theorem & Matrix Inversion',
    formula: 'p(A) = Aⁿ + c_{n-1} A^{n-1} + ... + c_1 A + c_0 I = 0   ⇒   A⁻¹ = -(1 / c_0) [ A^{n-1} + ... + c_1 I ]',
    variables: [
      { symbol: 'A', meaning: 'Square matrix of order n × n', unit: 'matrix' },
      { symbol: 'p(λ)', meaning: 'Characteristic polynomial det(A - λI) = 0', unit: 'polynomial' },
      { symbol: 'I', meaning: 'Identity matrix of order n', unit: 'matrix' },
      { symbol: 'c_0', meaning: 'Constant term = (-1)ⁿ * det(A)', unit: 'scalar' }
    ],
    description: 'Every square matrix satisfies its own characteristic equation. Enables rapid calculation of higher matrix powers (A⁵, A¹⁰) and inverse A⁻¹ without determinants of minors.',
    keyApplications: [
      'Finding A⁴ or A⁻¹ in 2×2 and 3×3 matrices in under 60 seconds',
      'State transition matrix in control systems e^(At)',
      'Minimal polynomial determination'
    ],
    commonPitfalls: 'Multiplying by A⁻¹ when det(A) = 0 (singular matrix). Cayley-Hamilton still holds, but A⁻¹ does not exist.',
    examSignificance: 'Ultra High Yield',
    tags: ['Linear Algebra', 'Eigenvalues', 'Matrix Powers', 'Inverse']
  },

  // Quantitative Aptitude
  {
    id: 'form-apt-01',
    category: 'Quantitative Aptitude',
    subject: 'Arithmetic & Speed Math',
    title: 'Relative Speed: Two Bodies in Motion',
    formula: 'Opposite Directions: S_rel = S_1 + S_2   |   Same Direction: S_rel = |S_1 - S_2|',
    variables: [
      { symbol: 'S_rel', meaning: 'Effective relative speed', unit: 'km/h or m/s' },
      { symbol: 'S_1, S_2', meaning: 'Individual speeds of body 1 and 2', unit: 'consistent speed units' },
      { symbol: 'Distance', meaning: 'Sum of lengths (L_1 + L_2) when crossing trains', unit: 'meters (m)' }
    ],
    description: 'Determines the rate at which distance between two moving objects shrinks or expands.',
    keyApplications: [
      'Two trains crossing each other in opposite vs same direction',
      'Police chasing a thief with a head start',
      'Boats and Streams (Downstream = B + S, Upstream = B - S)'
    ],
    commonPitfalls: 'When trains cross each other, the distance is ALWAYS the sum of their lengths (L1 + L2), regardless of direction!',
    examSignificance: 'Ultra High Yield',
    tags: ['Aptitude', 'Relative Speed', 'Trains', 'Time & Distance']
  },
  {
    id: 'form-apt-02',
    category: 'Quantitative Aptitude',
    subject: 'Commercial Math',
    title: 'Successive Percentage Changes & Discount',
    formula: 'Net Change % = a + b + (a * b / 100)   |   Single Equivalent Discount = (d_1 + d_2 - (d_1 * d_2 / 100)) %',
    variables: [
      { symbol: 'a, b', meaning: 'Percentage increases (+ve) or decreases (-ve)', unit: '%' },
      { symbol: 'd_1, d_2', meaning: 'Successive discount percentages', unit: '%' }
    ],
    description: 'Calculates the compounding effect of two consecutive percentage shifts on any initial base price or quantity.',
    keyApplications: [
      'Store offers: "Buy 1 Get 1" or "30% + 20% off"',
      'Length increased by 20%, breadth decreased by 10% → Net area change',
      'Inflation across consecutive quarters'
    ],
    commonPitfalls: 'Two successive discounts of 20% and 10% do NOT equal 30%! They equal 20 + 10 - (200/100) = 28%.',
    examSignificance: 'Frequently Tested',
    tags: ['Percentages', 'Discounts', 'Profit & Loss', 'Speed Math']
  }
];
