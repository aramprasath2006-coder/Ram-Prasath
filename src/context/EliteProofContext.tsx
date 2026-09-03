import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { EliteStudentProof } from '../types';
import { REGISTERED_STUDENTS } from './StudentAuthContext';
import { safeLocalStorageSet } from '../utils/imageCompressor';

const STORAGE_ELITE_PROOFS_KEY = 'eduflow_elite_student_proofs_v2';

// Default Aadhaar and Document visual mockups
const DEFAULT_AADHAAR_FRONT = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
const DEFAULT_AADHAAR_BACK = 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=600&auto=format&fit=crop&q=80';

// Generate initial sample proofs for registered students
export const INITIAL_ELITE_PROOFS: Record<string, EliteStudentProof> = {
  'stu-1': {
    studentId: 'stu-1',
    studentName: 'Alex Rivera',
    studentLoginId: 'alex@edu.in',
    rollNo: '2024-CS-042',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    photoUploadDate: '2025-01-15',
    photoVerified: true,
    aadhaarNumber: '5489 7291 3847',
    aadhaarName: 'Alex Rivera',
    aadhaarDob: '15/08/2004',
    aadhaarGender: 'Male',
    aadhaarDocFrontUrl: DEFAULT_AADHAAR_FRONT,
    aadhaarDocBackUrl: DEFAULT_AADHAAR_BACK,
    aadhaarVerificationStatus: 'Verified',
    aadhaarLastUpdated: '2025-01-15',
    emergencyContactName: 'Dr. Robert Rivera',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '+91 98451 22890',
    emergencyContactSecondaryPhone: '+91 98451 22891',
    emergencyContactEmail: 'robert.rivera@medicare.org',
    emergencyAddress: 'Flat 402, Oakwood Towers, Science City Road, Bengaluru 560012',
    emergencyBloodGroup: 'O+',
    emergencyContactVerified: true,
    overallStatus: 'Verified',
    verificationTimestamp: '2025-01-16 11:30 AM',
    verifiedByOfficer: 'Col. S. Deshmukh (Registrar, ASCEND STALTECH INDIAA)',
    eliteEnrollmentCategory: 'UPSC Civil Services',
    examRollNumber: 'UPSC-2025-084920'
  },
  'stu-2': {
    studentId: 'stu-2',
    studentName: 'Priya Sharma',
    studentLoginId: 'priya@edu.in',
    rollNo: '2024-EE-118',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    photoUploadDate: '2025-01-18',
    photoVerified: true,
    aadhaarNumber: '7612 9043 1184',
    aadhaarName: 'Priya Sharma',
    aadhaarDob: '22/11/2003',
    aadhaarGender: 'Female',
    aadhaarDocFrontUrl: DEFAULT_AADHAAR_FRONT,
    aadhaarDocBackUrl: DEFAULT_AADHAAR_BACK,
    aadhaarVerificationStatus: 'Verified',
    aadhaarLastUpdated: '2025-01-18',
    emergencyContactName: 'Sunita Sharma',
    emergencyContactRelation: 'Mother',
    emergencyContactPhone: '+91 91234 56789',
    emergencyContactSecondaryPhone: '+91 91234 56780',
    emergencyContactEmail: 'sunita.sharma@edu.in',
    emergencyAddress: 'H.No 88, Vasant Vihar Phase 2, New Delhi 110057',
    emergencyBloodGroup: 'B+',
    emergencyContactVerified: true,
    overallStatus: 'Verified',
    verificationTimestamp: '2025-01-19 03:15 PM',
    verifiedByOfficer: 'Col. S. Deshmukh (Registrar, ASCEND STALTECH INDIAA)',
    eliteEnrollmentCategory: 'UPSC Civil Services',
    examRollNumber: 'UPSC-2025-091482'
  },
  'stu-3': {
    studentId: 'stu-3',
    studentName: 'Rohan Verma',
    studentLoginId: 'rohan@edu.in',
    rollNo: '2024-ME-077',
    photoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
    photoUploadDate: '2025-01-20',
    photoVerified: true,
    aadhaarNumber: '6821 4459 2038',
    aadhaarName: 'Rohan Verma',
    aadhaarDob: '05/03/2004',
    aadhaarGender: 'Male',
    aadhaarDocFrontUrl: DEFAULT_AADHAAR_FRONT,
    aadhaarDocBackUrl: DEFAULT_AADHAAR_BACK,
    aadhaarVerificationStatus: 'Verified',
    aadhaarLastUpdated: '2025-01-20',
    emergencyContactName: 'Mahesh Verma',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '+91 98765 43210',
    emergencyContactSecondaryPhone: '',
    emergencyContactEmail: 'mahesh.verma@techcorp.in',
    emergencyAddress: 'Plot 14, Civil Lines, Pune, Maharashtra 411001',
    emergencyBloodGroup: 'A+',
    emergencyContactVerified: true,
    overallStatus: 'Verified',
    verificationTimestamp: '2025-01-21 09:45 AM',
    verifiedByOfficer: 'Dr. K. Raman (Academic Dean)',
    eliteEnrollmentCategory: 'GATE Mechanical',
    examRollNumber: 'GATE-2025-ME-4029'
  }
};

interface EliteProofContextType {
  proofs: Record<string, EliteStudentProof>;
  getStudentProof: (studentId: string) => EliteStudentProof;
  saveStudentProof: (proof: EliteStudentProof) => void;
  updatePhotoProof: (studentId: string, newPhotoUrl: string) => void;
  updateAadhaarProof: (
    studentId: string, 
    aadhaarData: {
      aadhaarNumber: string;
      aadhaarName: string;
      aadhaarDob: string;
      aadhaarGender: 'Male' | 'Female' | 'Other';
      aadhaarDocFrontUrl?: string;
      aadhaarDocBackUrl?: string;
    }
  ) => void;
  updateEmergencyContact: (
    studentId: string,
    contactData: {
      emergencyContactName: string;
      emergencyContactRelation: EliteStudentProof['emergencyContactRelation'];
      emergencyContactPhone: string;
      emergencyContactSecondaryPhone?: string;
      emergencyContactEmail?: string;
      emergencyAddress: string;
      emergencyBloodGroup?: string;
    }
  ) => void;
  isProofModalOpen: boolean;
  openProofModal: () => void;
  closeProofModal: () => void;
}

const EliteProofContext = createContext<EliteProofContextType | undefined>(undefined);

export const EliteProofProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [proofs, setProofs] = useState<Record<string, EliteStudentProof>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ELITE_PROOFS_KEY);
      if (saved) {
        return { ...INITIAL_ELITE_PROOFS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load elite proofs from storage:', e);
    }
    return INITIAL_ELITE_PROOFS;
  });

  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      safeLocalStorageSet(STORAGE_ELITE_PROOFS_KEY, JSON.stringify(proofs));
    } catch (e) {
      console.warn('Failed to save elite proofs to storage:', e);
    }
  }, [proofs]);

  const openProofModal = useCallback(() => setIsProofModalOpen(true), []);
  const closeProofModal = useCallback(() => setIsProofModalOpen(false), []);

  const getStudentProof = useCallback((studentId: string): EliteStudentProof => {
    if (proofs[studentId]) {
      return proofs[studentId];
    }
    
    // Find matching registered student to synthesize clean default
    const matchingStudent = REGISTERED_STUDENTS.find(s => s.id === studentId);
    const defaultProof: EliteStudentProof = {
      studentId: studentId,
      studentName: matchingStudent?.name || 'Aspirant',
      studentLoginId: matchingStudent?.loginId || 'student@edu.in',
      rollNo: matchingStudent?.rollNo || '2024-ELT-001',
      photoUrl: matchingStudent?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      photoUploadDate: new Date().toISOString().split('T')[0],
      photoVerified: true,
      aadhaarNumber: '5489 7291 3847',
      aadhaarName: matchingStudent?.name || 'Aspirant',
      aadhaarDob: matchingStudent?.dob || '15/08/2004',
      aadhaarGender: 'Male',
      aadhaarDocFrontUrl: DEFAULT_AADHAAR_FRONT,
      aadhaarDocBackUrl: DEFAULT_AADHAAR_BACK,
      aadhaarVerificationStatus: 'Verified',
      aadhaarLastUpdated: new Date().toISOString().split('T')[0],
      emergencyContactName: matchingStudent?.parentContact || 'Primary Guardian',
      emergencyContactRelation: 'Father',
      emergencyContactPhone: matchingStudent?.phone || '+91 98765 43210',
      emergencyContactSecondaryPhone: '',
      emergencyContactEmail: 'guardian@edu.in',
      emergencyAddress: 'Campus Scholar Residence, Science Block, Bengaluru',
      emergencyBloodGroup: 'O+',
      emergencyContactVerified: true,
      overallStatus: 'Verified',
      verificationTimestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verifiedByOfficer: 'Col. S. Deshmukh (Registrar, ASCEND STALTECH INDIAA)',
      eliteEnrollmentCategory: 'UPSC Civil Services',
      examRollNumber: `UPSC-2025-${Math.floor(100000 + Math.random() * 900000)}`
    };
    return defaultProof;
  }, [proofs]);

  const saveStudentProof = useCallback((proof: EliteStudentProof) => {
    setProofs(prev => ({
      ...prev,
      [proof.studentId]: proof
    }));
  }, []);

  const updatePhotoProof = useCallback((studentId: string, newPhotoUrl: string) => {
    setProofs(prev => {
      const current = prev[studentId] || getStudentProof(studentId);
      return {
        ...prev,
        [studentId]: {
          ...current,
          photoUrl: newPhotoUrl,
          photoUploadDate: new Date().toISOString().split('T')[0],
          photoVerified: true,
          verificationTimestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
      };
    });
  }, [getStudentProof]);

  const updateAadhaarProof = useCallback((
    studentId: string,
    aadhaarData: {
      aadhaarNumber: string;
      aadhaarName: string;
      aadhaarDob: string;
      aadhaarGender: 'Male' | 'Female' | 'Other';
      aadhaarDocFrontUrl?: string;
      aadhaarDocBackUrl?: string;
    }
  ) => {
    setProofs(prev => {
      const current = prev[studentId] || getStudentProof(studentId);
      return {
        ...prev,
        [studentId]: {
          ...current,
          aadhaarNumber: aadhaarData.aadhaarNumber,
          aadhaarName: aadhaarData.aadhaarName,
          aadhaarDob: aadhaarData.aadhaarDob,
          aadhaarGender: aadhaarData.aadhaarGender,
          aadhaarDocFrontUrl: aadhaarData.aadhaarDocFrontUrl || current.aadhaarDocFrontUrl,
          aadhaarDocBackUrl: aadhaarData.aadhaarDocBackUrl || current.aadhaarDocBackUrl,
          aadhaarVerificationStatus: 'Verified',
          aadhaarLastUpdated: new Date().toISOString().split('T')[0],
          verificationTimestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
      };
    });
  }, [getStudentProof]);

  const updateEmergencyContact = useCallback((
    studentId: string,
    contactData: {
      emergencyContactName: string;
      emergencyContactRelation: EliteStudentProof['emergencyContactRelation'];
      emergencyContactPhone: string;
      emergencyContactSecondaryPhone?: string;
      emergencyContactEmail?: string;
      emergencyAddress: string;
      emergencyBloodGroup?: string;
    }
  ) => {
    setProofs(prev => {
      const current = prev[studentId] || getStudentProof(studentId);
      return {
        ...prev,
        [studentId]: {
          ...current,
          ...contactData,
          emergencyContactVerified: true,
          verificationTimestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
      };
    });
  }, [getStudentProof]);

  return (
    <EliteProofContext.Provider
      value={{
        proofs,
        getStudentProof,
        saveStudentProof,
        updatePhotoProof,
        updateAadhaarProof,
        updateEmergencyContact,
        isProofModalOpen,
        openProofModal,
        closeProofModal
      }}
    >
      {children}
    </EliteProofContext.Provider>
  );
};

export const useEliteProof = () => {
  const context = useContext(EliteProofContext);
  if (!context) {
    throw new Error('useEliteProof must be used within an EliteProofProvider');
  }
  return context;
};
