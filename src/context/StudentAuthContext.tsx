import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { StudentUser } from '../types';
import { INITIAL_STUDENTS_ROSTER } from '../data/mockStudentAttendance';
import { safeLocalStorageSet, sanitizeStudentForStorage, compressDataUrl } from '../utils/imageCompressor';

// Build initial list of registered student accounts
export const REGISTERED_STUDENTS: StudentUser[] = INITIAL_STUDENTS_ROSTER.map((s) => {
  const parts = s.name.split(' ');
  const firstName = parts[0] || 'Student';
  const lastName = parts.slice(1).join(' ') || '';
  // Institutional Login ID format: <firstname>@edu.in (e.g. alex@edu.in, priya@edu.in)
  const loginId = s.loginId || `${firstName.toLowerCase()}@edu.in`;

  return {
    id: s.id,
    name: s.name,
    firstName,
    lastName,
    loginId,
    email: loginId,
    dob: s.dob || '15/08/2004',
    dobPassword: s.dobPassword || '15082004',
    rollNo: s.rollNo,
    batch: s.batch,
    department: s.department,
    semester: 'Semester 4',
    avatar: s.avatar,
    phone: s.phone || '+91 98765 43210',
    parentContact: s.parentContact,
    overallAttendancePct: s.overallAttendancePct,
    studyHours: s.studyHoursToday * 30 || 128,
    enrolledCoursesCount: 3,
    avgScore: 86,
    totalAttended: s.totalAttended,
    totalClasses: s.totalClasses
  };
});

export interface AuthResult {
  success: boolean;
  error?: string;
  student?: StudentUser;
}

export interface MobileOtpResult {
  success: boolean;
  error?: string;
  student?: StudentUser;
  maskedPhone?: string;
  otp?: string;
}

interface StudentAuthContextType {
  currentUser: StudentUser;
  isAuthenticated: boolean;
  registeredStudents: StudentUser[];
  login: (loginId: string, dobPasswordInput: string) => AuthResult;
  logout: () => void;
  switchStudent: (studentId: string) => void;
  validateLoginId: (loginId: string) => { isValid: boolean; error?: string };
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  // Mobile Password Reset
  isMobilePasswordModalOpen: boolean;
  openMobilePasswordModal: (prefillPhoneOrLogin?: string) => void;
  closeMobilePasswordModal: () => void;
  sendMobileOtp: (phoneOrLoginId: string) => MobileOtpResult;
  resetPasswordWithMobile: (studentId: string, newPassword: string) => { success: boolean; student?: StudentUser; error?: string };
  // Admin Only Student ID Management & Enrollment
  enrollNewStudent: (newStudent: {
    name: string;
    rollNo: string;
    loginId: string;
    phone: string;
    dob: string;
    dobPassword?: string;
    batch: string;
    department: string;
    parentContact?: string;
    avatar?: string;
  }) => { success: boolean; student?: StudentUser; error?: string };
  updateStudentIdentity: (
    studentId: string,
    updates: Partial<Pick<StudentUser, 'name' | 'rollNo' | 'loginId' | 'phone' | 'dob' | 'dobPassword' | 'batch' | 'department' | 'parentContact' | 'avatar'>>
  ) => { success: boolean; student?: StudentUser; error?: string };
  deleteStudent: (studentId: string) => { success: boolean; error?: string };
  // Student Profile Photo Upload
  updateProfilePhoto: (newAvatarUrl: string) => void;
  isPhotoUploadModalOpen: boolean;
  openPhotoUploadModal: () => void;
  closePhotoUploadModal: () => void;
}

const STORAGE_AUTH_KEY = 'eduflow_active_student_user_v3';
const STORAGE_AUTH_STATUS_KEY = 'eduflow_student_is_authenticated_v3';
const STORAGE_REGISTERED_STUDENTS_KEY = 'eduflow_registered_students_v3';

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export const StudentAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registeredStudents, setRegisteredStudents] = useState<StudentUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REGISTERED_STUDENTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Deduplicate by ID and loginId
          const seenIds = new Set<string>();
          const deduped: StudentUser[] = [];
          for (const s of parsed) {
            if (s && s.id && !seenIds.has(s.id)) {
              seenIds.add(s.id);
              deduped.push(s);
            }
          }
          if (deduped.length > 0) return deduped;
        }
      }
    } catch (e) {
      console.error('Error reading registered students from storage', e);
    }
    return REGISTERED_STUDENTS;
  });
  
  // Default to first student (Alex Rivera)
  const [currentUser, setCurrentUser] = useState<StudentUser>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = registeredStudents.find((s) => s.id === parsed.id || s.loginId === parsed.loginId);
        if (match) return match;
      }
    } catch (e) {
      console.error('Error loading saved student session', e);
    }
    return registeredStudents[0] || REGISTERED_STUDENTS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const savedStatus = localStorage.getItem(STORAGE_AUTH_STATUS_KEY);
      if (savedStatus !== null) {
        return savedStatus === 'true';
      }
    } catch (e) {
      // default
    }
    return true; // Active demo default
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobilePasswordModalOpen, setIsMobilePasswordModalOpen] = useState(false);
  const [isPhotoUploadModalOpen, setIsPhotoUploadModalOpen] = useState(false);

  // Sync registered students to local storage
  useEffect(() => {
    try {
      const sanitized = registeredStudents.map(sanitizeStudentForStorage);
      safeLocalStorageSet(STORAGE_REGISTERED_STUDENTS_KEY, JSON.stringify(sanitized));
    } catch (e) {
      console.warn('Safe sync registered students fallback', e);
    }
  }, [registeredStudents]);

  // Sync active user to local storage
  useEffect(() => {
    try {
      const sanitized = currentUser ? sanitizeStudentForStorage(currentUser) : currentUser;
      safeLocalStorageSet(STORAGE_AUTH_KEY, JSON.stringify(sanitized));
      safeLocalStorageSet(STORAGE_AUTH_STATUS_KEY, isAuthenticated.toString());
    } catch (e) {
      console.warn('Safe sync student auth fallback', e);
    }
  }, [currentUser, isAuthenticated]);

  /**
   * Helper to normalize Phone Number for robust matching
   */
  const normalizePhone = (phoneStr: string): string => {
    return phoneStr.replace(/[^0-9]/g, '').slice(-10); // Match last 10 digits
  };

  /**
   * Helper to format masked mobile number: e.g. +91 98*** **210
   */
  const maskPhone = (phoneStr: string): string => {
    const digits = phoneStr.replace(/[^0-9]/g, '');
    if (digits.length >= 10) {
      const last10 = digits.slice(-10);
      return `+91 ${last10.slice(0, 2)}*** **${last10.slice(-3)}`;
    }
    return phoneStr;
  };

  /**
   * Validates student Login ID format
   * Must follow format: <name>@edu.in
   * Explicitly blocks normal personal mail IDs (@gmail.com, @yahoo.com, etc.)
   */
  const validateLoginId = useCallback((rawLoginId: string): { isValid: boolean; error?: string } => {
    const trimmed = rawLoginId.trim().toLowerCase();
    
    if (!trimmed) {
      return { isValid: false, error: 'Please enter your Institutional Student Login ID.' };
    }

    // Check for prohibited personal email domains
    const prohibitedDomains = ['@gmail.com', '@yahoo.com', '@outlook.com', '@hotmail.com', '@icloud.com', '@rediffmail.com', '@zoho.com', '@mail.com'];
    for (const dom of prohibitedDomains) {
      if (trimmed.includes(dom)) {
        return {
          isValid: false,
          error: `Personal email domain (${dom}) is strictly prohibited. You must use your official Institutional Login ID format: <firstname>@edu.in (e.g. alex@edu.in).`
        };
      }
    }

    // Must end with @edu.in
    if (!trimmed.endsWith('@edu.in')) {
      return {
        isValid: false,
        error: 'Institutional ID format invalid. Your Login ID must end with @edu.in (e.g. alex@edu.in, priya@edu.in).'
      };
    }

    const localPart = trimmed.replace('@edu.in', '');
    if (!localPart || localPart.length < 2) {
      return {
        isValid: false,
        error: 'Please specify your student name before @edu.in (e.g. alex@edu.in).'
      };
    }

    return { isValid: true };
  }, []);

  /**
   * Helper to normalize DOB password string (stripping hyphens, slashes, spaces)
   */
  const normalizeDob = (dobStr: string): string => {
    return dobStr.replace(/[^0-9]/g, '');
  };

  /**
   * Performs Student Authentication
   */
  const login = useCallback((rawLoginId: string, rawDobPassword: string): AuthResult => {
    const validation = validateLoginId(rawLoginId);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const trimmedLogin = rawLoginId.trim().toLowerCase();
    const cleanPassword = normalizeDob(rawDobPassword.trim());

    if (!cleanPassword && !rawDobPassword.trim()) {
      return {
        success: false,
        error: 'Password is required. Please enter your registered password.'
      };
    }

    // Find student matching either loginId (e.g. alex@edu.in), or firstName@edu.in, or email, or rollNo
    const student = registeredStudents.find((s) => {
      const matchLogin = s.loginId.toLowerCase() === trimmedLogin;
      const matchFirst = `${s.firstName.toLowerCase()}@edu.in` === trimmedLogin;
      const matchFullEmail = s.email.toLowerCase() === trimmedLogin;
      const matchFullName = `${s.name.toLowerCase().replace(/\s+/g, '.')}@edu.in` === trimmedLogin;
      const matchRoll = s.rollNo.toLowerCase() === trimmedLogin;
      return matchLogin || matchFirst || matchFullEmail || matchFullName || matchRoll;
    });

    if (!student) {
      return {
        success: false,
        error: `No student account found for "${trimmedLogin}". Please verify your name format (<firstname>@edu.in) or check with university administration.`
      };
    }

    // Validate password (matches custom password, or normalized DOB, or literal dob)
    const studentNormalizedDob = normalizeDob(student.dobPassword || student.dob);
    const isPasswordCorrect = 
      rawDobPassword.trim() === student.dobPassword ||
      cleanPassword === studentNormalizedDob ||
      rawDobPassword.trim() === student.dob ||
      cleanPassword === normalizeDob(student.dob);

    if (!isPasswordCorrect) {
      return {
        success: false,
        error: `Incorrect password for ${student.name}. If you forgot your password, click "Forgot Password via Mobile No".`
      };
    }

    // Successful login
    setCurrentUser(student);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);

    try {
      localStorage.setItem('eduflow_study_student_name', student.name);
      localStorage.setItem('eduflow_study_student_id', student.id);
      window.dispatchEvent(new CustomEvent('studentLoginSuccess', { detail: student }));
    } catch (e) {
      // ignore
    }

    return { success: true, student };
  }, [registeredStudents, validateLoginId]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem(STORAGE_AUTH_STATUS_KEY, 'false');
    } catch (e) {
      // ignore
    }
  }, []);

  const switchStudent = useCallback((studentId: string) => {
    const found = registeredStudents.find((s) => s.id === studentId || s.loginId === studentId);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(found));
        localStorage.setItem(STORAGE_AUTH_STATUS_KEY, 'true');
        window.dispatchEvent(new CustomEvent('studentLoginSuccess', { detail: found }));
      } catch (e) {
        // ignore
      }
    }
  }, [registeredStudents]);

  /**
   * Generates and simulates SMS OTP verification for student password reset
   */
  const sendMobileOtp = useCallback((phoneOrLoginId: string): MobileOtpResult => {
    const trimmed = phoneOrLoginId.trim();
    if (!trimmed) {
      return { success: false, error: 'Please enter your registered 10-digit mobile number or Student Login ID.' };
    }

    const inputCleanPhone = normalizePhone(trimmed);
    const inputCleanLogin = trimmed.toLowerCase();

    // Find student in registered roster
    const student = registeredStudents.find((s) => {
      const sPhoneClean = normalizePhone(s.phone || '');
      const sLoginClean = s.loginId.toLowerCase();
      const sRollClean = s.rollNo.toLowerCase();
      const sEmailClean = s.email.toLowerCase();
      
      return (inputCleanPhone.length === 10 && sPhoneClean === inputCleanPhone) ||
             sLoginClean === inputCleanLogin ||
             sRollClean === inputCleanLogin ||
             sEmailClean === inputCleanLogin;
    });

    if (!student) {
      return {
        success: false,
        error: `No registered student account was found matching "${trimmed}". Please enter your 10-digit mobile number (e.g. 9876543210) registered with University Administration.`
      };
    }

    // Generate 6-digit OTP code (e.g. 849201)
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const masked = maskPhone(student.phone || '+91 98765 43210');

    return {
      success: true,
      student,
      maskedPhone: masked,
      otp: generatedOtp
    };
  }, [registeredStudents]);

  /**
   * Resets student password using mobile number verification
   */
  const resetPasswordWithMobile = useCallback((
    studentId: string, 
    newPassword: string
  ): { success: boolean; student?: StudentUser; error?: string } => {
    const cleanPass = newPassword.trim();
    if (!cleanPass || cleanPass.length < 4) {
      return { success: false, error: 'New password must be at least 4 characters or digits (e.g. DDMMYYYY or custom password).' };
    }

    let updatedStudent: StudentUser | undefined;

    setRegisteredStudents((prev) => {
      return prev.map((s) => {
        if (s.id === studentId || s.loginId === studentId || s.rollNo === studentId) {
          const dobFormatted = cleanPass.length === 8 && /^\d+$/.test(cleanPass)
            ? `${cleanPass.slice(0, 2)}/${cleanPass.slice(2, 4)}/${cleanPass.slice(4)}`
            : s.dob;

          updatedStudent = {
            ...s,
            dobPassword: cleanPass,
            dob: dobFormatted
          };
          return updatedStudent;
        }
        return s;
      });
    });

    if (updatedStudent) {
      // If current user is this student, update current user too
      if (currentUser.id === studentId) {
        setCurrentUser(updatedStudent);
      }

      // Also sync to roster in localStorage
      try {
        const savedRoster = localStorage.getItem('eduflow_students_roster');
        if (savedRoster) {
          const roster = JSON.parse(savedRoster);
          const updatedRoster = roster.map((item: any) => {
            if (item.id === studentId || item.loginId === studentId) {
              return {
                ...item,
                dobPassword: cleanPass,
                activityHistory: [
                  {
                    id: `act-pwd-reset-${Date.now()}`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    action: 'Password changed securely via registered Mobile SMS OTP verification',
                    type: 'override',
                    details: `Student verified mobile: ${maskPhone(item.phone || '')}`
                  },
                  ...(item.activityHistory || [])
                ]
              };
            }
            return item;
          });
          localStorage.setItem('eduflow_students_roster', JSON.stringify(updatedRoster));
        }
        window.dispatchEvent(new CustomEvent('studentRosterUpdated'));
      } catch (e) {
        console.error('Error syncing password reset to roster', e);
      }

      return { success: true, student: updatedStudent };
    }

    return { success: false, error: 'Student not found in registry.' };
  }, [currentUser]);

  /**
   * ADMIN ONLY: Enroll New Student & Create Official Student ID
   */
  const enrollNewStudent = useCallback((newStudentData: {
    name: string;
    rollNo: string;
    loginId: string;
    phone: string;
    dob: string;
    dobPassword?: string;
    batch: string;
    department: string;
    parentContact?: string;
    avatar?: string;
  }): { success: boolean; student?: StudentUser; error?: string } => {
    // 1. Validation
    const name = newStudentData.name.trim();
    const rollNo = newStudentData.rollNo.trim().toUpperCase();
    const rawLoginId = newStudentData.loginId.trim().toLowerCase();
    const phone = newStudentData.phone.trim();
    const dob = newStudentData.dob.trim();
    const batch = newStudentData.batch.trim();
    const department = newStudentData.department.trim();

    if (!name || name.length < 2) {
      return { success: false, error: 'Student full name is required (at least 2 characters).' };
    }
    if (!rollNo || rollNo.length < 3) {
      return { success: false, error: 'Valid Roll Number is required (e.g. 26CS0245).' };
    }
    if (!phone || phone.length < 8) {
      return { success: false, error: 'Registered 10-digit mobile number is required for student verification.' };
    }

    // Login ID validation
    const loginValidation = validateLoginId(rawLoginId);
    if (!loginValidation.isValid) {
      return { success: false, error: loginValidation.error };
    }

    // Check duplicates in existing students
    const existingLogin = registeredStudents.find((s) => s.loginId.toLowerCase() === rawLoginId);
    if (existingLogin) {
      return { success: false, error: `Student Login ID "${rawLoginId}" is already assigned to ${existingLogin.name} (${existingLogin.rollNo}).` };
    }

    const existingRoll = registeredStudents.find((s) => s.rollNo.toUpperCase() === rollNo);
    if (existingRoll) {
      return { success: false, error: `Roll Number "${rollNo}" is already assigned to ${existingRoll.name}.` };
    }

    // Generate guaranteed unique Student ID: STD-2026-0XX (checking existing registered students and roster)
    const existingIds = new Set([
      ...registeredStudents.map((s) => s.id),
      ...INITIAL_STUDENTS_ROSTER.map((s) => s.id)
    ]);
    let nextNum = registeredStudents.length + 1;
    let studentId = `STD-2026-${nextNum.toString().padStart(3, '0')}`;
    while (existingIds.has(studentId)) {
      nextNum++;
      studentId = `STD-2026-${nextNum.toString().padStart(3, '0')}`;
    }

    const parts = name.split(' ');
    const firstName = parts[0] || 'Student';
    const lastName = parts.slice(1).join(' ') || '';
    const cleanDobDigits = normalizeDob(dob);
    const dobPassword = newStudentData.dobPassword || (cleanDobDigits.length >= 8 ? cleanDobDigits : '15082004');

    const newStudentUser: StudentUser = {
      id: studentId,
      name,
      firstName,
      lastName,
      loginId: rawLoginId,
      email: rawLoginId,
      dob: dob || '15/08/2004',
      dobPassword,
      rollNo,
      batch: batch || 'Computer Science 2026',
      department: department || 'Dept of Computer Science & Engineering',
      semester: 'Semester 4',
      avatar: newStudentData.avatar || `https://images.unsplash.com/photo-${1535713875002 + nextNum}?w=150&auto=format&fit=crop&q=80`,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone.replace(/[^0-9]/g, '')}`,
      parentContact: newStudentData.parentContact || '+91 98765 00000',
      overallAttendancePct: 100,
      studyHours: 0,
      enrolledCoursesCount: 2,
      avgScore: 85,
      totalAttended: 1,
      totalClasses: 1
    };

    // Add to registered students state without duplicating
    setRegisteredStudents((prev) => {
      const filtered = prev.filter((s) => s.id !== studentId && s.loginId.toLowerCase() !== rawLoginId);
      return [newStudentUser, ...filtered];
    });

    // Also add to eduflow_students_roster in localStorage for attendance dashboard
    try {
      const savedRoster = localStorage.getItem('eduflow_students_roster');
      const roster = savedRoster ? JSON.parse(savedRoster) : [];
      const filteredRoster = Array.isArray(roster)
        ? roster.filter((s: any) => s && s.id !== studentId && s.loginId?.toLowerCase() !== rawLoginId)
        : [];
      
      const newAttendanceRecord = {
        id: studentId,
        name,
        rollNo,
        loginId: rawLoginId,
        email: rawLoginId,
        dob: dob || '15/08/2004',
        dobPassword,
        avatar: newStudentUser.avatar,
        batch: newStudentUser.batch,
        department: newStudentUser.department,
        hasLoggedInToday: false,
        todayLoginTime: null,
        loginMethod: null,
        deviceInfo: 'Newly Enrolled Student Account',
        ipAddress: 'N/A',
        attendanceStatus: 'Absent',
        checkInTime: null,
        checkOutTime: null,
        verificationMethod: null,
        location: 'Newly Enrolled',
        isOnline: false,
        studyHoursToday: 0.0,
        overallAttendancePct: 100,
        totalAttended: 1,
        totalClasses: 1,
        lastActiveAgo: 'Just Enrolled by Admin',
        phone: newStudentUser.phone,
        parentContact: newStudentUser.parentContact,
        activityHistory: [
          {
            id: `act-enroll-${Date.now()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: `Student ID & Roll No enrolled by Institutional Admin (${rollNo} / ${rawLoginId})`,
            type: 'override',
            details: `Official ID ${studentId} generated for ${name}`
          }
        ]
      };

      localStorage.setItem('eduflow_students_roster', JSON.stringify([newAttendanceRecord, ...filteredRoster]));
      window.dispatchEvent(new CustomEvent('studentRosterUpdated'));
    } catch (e) {
      console.error('Error syncing new student to roster', e);
    }

    return { success: true, student: newStudentUser };
  }, [registeredStudents, validateLoginId]);

  /**
   * ADMIN ONLY: Update Student ID / Identity / Details
   */
  const updateStudentIdentity = useCallback((
    studentId: string,
    updates: Partial<Pick<StudentUser, 'name' | 'rollNo' | 'loginId' | 'phone' | 'dob' | 'dobPassword' | 'batch' | 'department' | 'parentContact' | 'avatar'>>
  ): { success: boolean; student?: StudentUser; error?: string } => {
    // If loginId is being changed, validate it
    if (updates.loginId) {
      const validation = validateLoginId(updates.loginId);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }
      // Check duplicate login ID
      const dup = registeredStudents.find(
        (s) => s.id !== studentId && s.loginId.toLowerCase() === updates.loginId!.toLowerCase()
      );
      if (dup) {
        return { success: false, error: `Login ID "${updates.loginId}" is already used by ${dup.name}.` };
      }
    }

    // If rollNo is being changed, check duplicate
    if (updates.rollNo) {
      const dup = registeredStudents.find(
        (s) => s.id !== studentId && s.rollNo.toUpperCase() === updates.rollNo!.toUpperCase()
      );
      if (dup) {
        return { success: false, error: `Roll No "${updates.rollNo}" is already assigned to ${dup.name}.` };
      }
    }

    let updatedUser: StudentUser | undefined;

    setRegisteredStudents((prev) => {
      return prev.map((s) => {
        if (s.id === studentId) {
          const parts = updates.name ? updates.name.split(' ') : [s.firstName, s.lastName];
          const firstName = parts[0] || s.firstName;
          const lastName = parts.slice(1).join(' ') || s.lastName;

          updatedUser = {
            ...s,
            ...updates,
            firstName,
            lastName,
            email: updates.loginId || s.email,
            phone: updates.phone ? (updates.phone.startsWith('+91') ? updates.phone : `+91 ${updates.phone.replace(/[^0-9]/g, '')}`) : s.phone
          };
          return updatedUser;
        }
        return s;
      });
    });

    if (updatedUser) {
      if (currentUser.id === studentId) {
        setCurrentUser(updatedUser);
      }

      // Sync to attendance roster
      try {
        const savedRoster = localStorage.getItem('eduflow_students_roster');
        if (savedRoster) {
          const roster = JSON.parse(savedRoster);
          const updatedRoster = roster.map((item: any) => {
            if (item.id === studentId) {
              return {
                ...item,
                name: updates.name || item.name,
                rollNo: updates.rollNo || item.rollNo,
                loginId: updates.loginId || item.loginId,
                email: updates.loginId || item.email,
                phone: updates.phone || item.phone,
                batch: updates.batch || item.batch,
                department: updates.department || item.department,
                dob: updates.dob || item.dob,
                dobPassword: updates.dobPassword || item.dobPassword,
                parentContact: updates.parentContact || item.parentContact,
                activityHistory: [
                  {
                    id: `act-update-id-${Date.now()}`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    action: 'Student ID & official credentials updated by Admin',
                    type: 'override',
                    details: `Updated Roll No: ${updates.rollNo || item.rollNo} • Login: ${updates.loginId || item.loginId}`
                  },
                  ...(item.activityHistory || [])
                ]
              };
            }
            return item;
          });
          localStorage.setItem('eduflow_students_roster', JSON.stringify(updatedRoster));
        }
        window.dispatchEvent(new CustomEvent('studentRosterUpdated'));
      } catch (e) {
        console.error('Error syncing identity update to roster', e);
      }

      return { success: true, student: updatedUser };
    }

    return { success: false, error: 'Student ID not found in institutional directory.' };
  }, [registeredStudents, currentUser, validateLoginId]);

  /**
   * ADMIN ONLY: Delete Student Record
   */
  const deleteStudent = useCallback((studentId: string): { success: boolean; error?: string } => {
    setRegisteredStudents((prev) => prev.filter((s) => s.id !== studentId));
    try {
      const savedRoster = localStorage.getItem('eduflow_students_roster');
      if (savedRoster) {
        const roster = JSON.parse(savedRoster);
        const updated = roster.filter((s: any) => s.id !== studentId);
        localStorage.setItem('eduflow_students_roster', JSON.stringify(updated));
      }
      window.dispatchEvent(new CustomEvent('studentRosterUpdated'));
    } catch (e) {
      // ignore
    }
    return { success: true };
  }, []);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  const openMobilePasswordModal = useCallback((prefill?: string) => {
    setIsMobilePasswordModalOpen(true);
  }, []);
  const closeMobilePasswordModal = useCallback(() => setIsMobilePasswordModalOpen(false), []);

  const openPhotoUploadModal = useCallback(() => setIsPhotoUploadModalOpen(true), []);
  const closePhotoUploadModal = useCallback(() => setIsPhotoUploadModalOpen(false), []);

  const updateProfilePhoto = useCallback((newAvatarUrl: string) => {
    if (!newAvatarUrl) return;

    // Update active student currentUser
    setCurrentUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        avatar: newAvatarUrl
      };
    });

    // Update registeredStudents list
    setRegisteredStudents(prev =>
      prev.map(student => {
        if (currentUser && (student.id === currentUser.id || student.loginId === currentUser.loginId)) {
          return { ...student, avatar: newAvatarUrl };
        }
        return student;
      })
    );

    // Sync to admin roster if stored in localStorage
    try {
      const savedRoster = localStorage.getItem('eduflow_students_roster');
      if (savedRoster && currentUser) {
        const roster = JSON.parse(savedRoster);
        const updated = roster.map((s: any) => {
          if (s.id === currentUser.id || s.email === currentUser.loginId || s.loginId === currentUser.loginId) {
            return { ...s, avatar: newAvatarUrl };
          }
          return s;
        });
        localStorage.setItem('eduflow_students_roster', JSON.stringify(updated));
      }
      window.dispatchEvent(new CustomEvent('studentRosterUpdated'));
    } catch (e) {
      // ignore
    }
  }, [currentUser]);

  return (
    <StudentAuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        registeredStudents,
        login,
        logout,
        switchStudent,
        validateLoginId,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        isMobilePasswordModalOpen,
        openMobilePasswordModal,
        closeMobilePasswordModal,
        sendMobileOtp,
        resetPasswordWithMobile,
        enrollNewStudent,
        updateStudentIdentity,
        deleteStudent,
        updateProfilePhoto,
        isPhotoUploadModalOpen,
        openPhotoUploadModal,
        closePhotoUploadModal
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
};

export const useStudentAuth = (): StudentAuthContextType => {
  const context = useContext(StudentAuthContext);
  if (!context) {
    throw new Error('useStudentAuth must be used within a StudentAuthProvider');
  }
  return context;
};
