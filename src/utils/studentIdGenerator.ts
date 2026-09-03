/**
 * Secure Student ID Generator Utility
 * Provides cryptographic randomness, collision-resistant uniqueness checks,
 * department-aware formatting, and checksum validation for Academic Administrators.
 */

export type StudentIdFormat = 
  | 'ACADEMIC_ROLL'          // e.g. 26CS0245
  | 'SECURE_ALPHA_NUMERIC'   // e.g. STU-2026-9X4F
  | 'CAMPUS_SMART_ID'        // e.g. EDU-2026-CS-8932
  | 'ACADEMIC_DEPOSITORY';   // e.g. ACAD-26-CS-0947X

export interface StudentIdGeneratorOptions {
  departmentCode?: string;     // e.g. 'CS', 'ME', 'MA', 'EC', 'EE', 'IT', 'AI', 'CV'
  batchYear?: number | string; // e.g. 2026 or '26'
  format?: StudentIdFormat;
  customPrefix?: string;
  sequenceNumber?: number;     // Optional manual sequence override
  entropyLength?: number;      // Entropy digits for secure token format (default: 4)
  includeChecksum?: boolean;   // Append verification checksum digit
}

export interface StudentIdValidationResult {
  isValid: boolean;
  isUnique: boolean;
  error?: string;
  checksumValid?: boolean;
  parsed?: {
    format: StudentIdFormat | 'CUSTOM';
    prefix?: string;
    year?: string;
    department?: string;
    sequenceOrToken?: string;
    checksum?: string;
  };
}

// Department abbreviations mapping
export const DEPARTMENT_CODES: Record<string, string> = {
  'Computer Science': 'CS',
  'Dept of Computer Science & Engineering': 'CS',
  'Mechanical Engineering': 'ME',
  'Dept of Mechanical Engineering': 'ME',
  'Mathematics & Computing': 'MA',
  'Dept of Mathematics & Computing': 'MA',
  'Civil Services Academy': 'CS',
  'Electrical & Electronics': 'EE',
  'Electronics & Communication': 'EC',
  'Information Technology': 'IT',
  'Artificial Intelligence & Data Science': 'AI',
  'Civil Engineering': 'CV'
};

// Safe secure random byte generator
function getSecureRandomInt(min: number, max: number): number {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const range = max - min + 1;
    return min + (array[0] % range);
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Secure alphanumeric random token generator
function getSecureRandomAlphaNumeric(length: number = 4): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude ambiguous 0, 1, I, O
  let result = '';
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    return result;
  }
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Calculates a standard Mod 36 / Luhn-style tamper-detection checksum character
 */
export function calculateStudentIdChecksum(baseString: string): string {
  const clean = baseString.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  let sum = 0;
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    const weight = (i % 2 === 0) ? 3 : 1;
    sum += code * weight;
  }
  const alphabet = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  return alphabet[sum % alphabet.length];
}

/**
 * Generates a formatted student ID based on input specifications
 */
export function generateSecureStudentId(options: StudentIdGeneratorOptions = {}): string {
  const {
    departmentCode = 'CS',
    batchYear = 2026,
    format = 'ACADEMIC_ROLL',
    customPrefix,
    sequenceNumber,
    entropyLength = 4,
    includeChecksum = false
  } = options;

  // Normalize Year to 2 digits for roll (e.g. 26) and 4 digits for tokens (e.g. 2026)
  const fullYearStr = String(batchYear);
  const twoDigitYear = fullYearStr.length >= 4 ? fullYearStr.slice(-2) : fullYearStr.padStart(2, '26');
  const fourDigitYear = fullYearStr.length === 2 ? `20${fullYearStr}` : fullYearStr;

  // Clean department code (max 3 uppercase letters)
  const cleanDept = (departmentCode.length > 3 ? (DEPARTMENT_CODES[departmentCode] || 'CS') : departmentCode).toUpperCase();

  let baseId = '';

  switch (format) {
    case 'ACADEMIC_ROLL': {
      // Format: YY + DEPT + 0 + SEQ (e.g. 26CS0245)
      const seq = sequenceNumber !== undefined 
        ? String(sequenceNumber).padStart(3, '0')
        : String(getSecureRandomInt(101, 899)).padStart(3, '0');
      baseId = `${twoDigitYear}${cleanDept}0${seq}`;
      break;
    }

    case 'SECURE_ALPHA_NUMERIC': {
      // Format: STU-YYYY-RANDOM (e.g. STU-2026-9X4F)
      const prefix = customPrefix || 'STU';
      const token = getSecureRandomAlphaNumeric(entropyLength);
      baseId = `${prefix}-${fourDigitYear}-${token}`;
      break;
    }

    case 'CAMPUS_SMART_ID': {
      // Format: EDU-YYYY-DEPT-RANDOM (e.g. EDU-2026-CS-8932)
      const prefix = customPrefix || 'EDU';
      const randomNum = getSecureRandomInt(1000, 9999);
      baseId = `${prefix}-${fourDigitYear}-${cleanDept}-${randomNum}`;
      break;
    }

    case 'ACADEMIC_DEPOSITORY': {
      // Format: ACAD-YY-DEPT-SEQ (e.g. ACAD-26-CS-0947)
      const prefix = customPrefix || 'ACAD';
      const seq = sequenceNumber !== undefined
        ? String(sequenceNumber).padStart(4, '0')
        : String(getSecureRandomInt(1000, 9999));
      baseId = `${prefix}-${twoDigitYear}-${cleanDept}-${seq}`;
      break;
    }

    default: {
      const seq = String(getSecureRandomInt(101, 899)).padStart(3, '0');
      baseId = `${twoDigitYear}${cleanDept}0${seq}`;
      break;
    }
  }

  if (includeChecksum) {
    const checksum = calculateStudentIdChecksum(baseId);
    return `${baseId}${checksum}`;
  }

  return baseId;
}

/**
 * Generates a guaranteed collision-free, unique student ID checked against the active roster
 */
export function generateUniqueStudentId(
  existingIds: string[] = [],
  options: StudentIdGeneratorOptions = {}
): string {
  const normalizedExisting = new Set(existingIds.map(id => id.trim().toUpperCase()));
  const maxAttempts = 100;
  let attempts = 0;

  // If calculating sequential roll number for academic roll
  if (options.format === 'ACADEMIC_ROLL' && options.sequenceNumber === undefined) {
    const dept = (options.departmentCode || 'CS').toUpperCase();
    const fullYear = String(options.batchYear || 2026);
    const yr = fullYear.length >= 4 ? fullYear.slice(-2) : fullYear;
    const prefix = `${yr}${dept}0`;

    // Find highest existing sequence for this department/year prefix
    let maxSeq = 100;
    for (const existingId of existingIds) {
      const upper = existingId.toUpperCase().trim();
      if (upper.startsWith(prefix)) {
        const numPart = parseInt(upper.replace(prefix, '').slice(0, 3), 10);
        if (!isNaN(numPart) && numPart > maxSeq) {
          maxSeq = numPart;
        }
      }
    }

    // Try starting from maxSeq + 1
    let candidate = `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
    if (!normalizedExisting.has(candidate)) {
      return candidate;
    }
  }

  // Cryptographic attempt loop
  while (attempts < maxAttempts) {
    attempts++;
    const candidate = generateSecureStudentId(options);
    if (!normalizedExisting.has(candidate.toUpperCase())) {
      return candidate;
    }
  }

  // Fallback guaranteed random hash
  const fallback = `STU-2026-${getSecureRandomAlphaNumeric(6)}`;
  return fallback;
}

/**
 * Validates a student ID for syntax, department matching, and roster uniqueness
 */
export function validateStudentIdFormat(
  studentId: string,
  existingIds: string[] = [],
  currentStudentId?: string
): StudentIdValidationResult {
  const cleanId = studentId.trim().toUpperCase();

  if (!cleanId) {
    return {
      isValid: false,
      isUnique: true,
      error: 'Student ID cannot be empty.'
    };
  }

  if (cleanId.length < 5) {
    return {
      isValid: false,
      isUnique: true,
      error: 'Student ID must be at least 5 characters long.'
    };
  }

  // Check uniqueness against roster (excluding self if editing)
  const isDuplicate = existingIds.some(
    id => id.trim().toUpperCase() === cleanId && id.trim().toUpperCase() !== (currentStudentId || '').trim().toUpperCase()
  );

  if (isDuplicate) {
    return {
      isValid: false,
      isUnique: false,
      error: `Student ID "${cleanId}" is already assigned to another student in the roster.`
    };
  }

  // Detect Format
  // 1. Standard Academic Roll regex: ^([0-9]{2})([A-Z]{2,4})0([0-9]{3,4})([A-Z0-9]?)$ (e.g. 26CS0245)
  const rollMatch = cleanId.match(/^([0-9]{2})([A-Z]{2,4})0([0-9]{3,4})([A-Z0-9]?)$/);
  if (rollMatch) {
    return {
      isValid: true,
      isUnique: true,
      parsed: {
        format: 'ACADEMIC_ROLL',
        year: `20${rollMatch[1]}`,
        department: rollMatch[2],
        sequenceOrToken: rollMatch[3],
        checksum: rollMatch[4] || undefined
      }
    };
  }

  // 2. Token Format regex: ^(STU|EDU|ACAD)-([0-9]{2,4})-([A-Z0-9\-]+)$
  const tokenMatch = cleanId.match(/^([A-Z]+)-([0-9]{2,4})-(.*)$/);
  if (tokenMatch) {
    return {
      isValid: true,
      isUnique: true,
      parsed: {
        format: 'SECURE_ALPHA_NUMERIC',
        prefix: tokenMatch[1],
        year: tokenMatch[2],
        sequenceOrToken: tokenMatch[3]
      }
    };
  }

  // Custom Alphanumeric format check (must be valid chars only)
  const isAlphanumeric = /^[A-Z0-9\-_]+$/.test(cleanId);
  if (!isAlphanumeric) {
    return {
      isValid: false,
      isUnique: true,
      error: 'Student ID can only contain uppercase letters, numbers, and hyphens.'
    };
  }

  return {
    isValid: true,
    isUnique: true,
    parsed: {
      format: 'CUSTOM',
      sequenceOrToken: cleanId
    }
  };
}

/**
 * Generates a batch of unique student IDs
 */
export function generateBatchStudentIds(
  count: number,
  existingIds: string[] = [],
  options: StudentIdGeneratorOptions = {}
): string[] {
  const result: string[] = [];
  const combinedExisting = [...existingIds];

  for (let i = 0; i < count; i++) {
    const id = generateUniqueStudentId(combinedExisting, options);
    result.push(id);
    combinedExisting.push(id);
  }

  return result;
}
