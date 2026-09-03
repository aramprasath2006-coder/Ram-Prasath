import React, { useState, useMemo, useEffect } from 'react';
import { StudentAttendance, ActiveScreen } from '../../types';
import { INITIAL_STUDENTS_ROSTER } from '../../data/mockStudentAttendance';
import { useStudentAuth } from '../../context/StudentAuthContext';
import {
  generateUniqueStudentId,
  validateStudentIdFormat,
  generateBatchStudentIds,
  StudentIdFormat,
  DEPARTMENT_CODES
} from '../../utils/studentIdGenerator';
import { StudentDetailDrawer } from './StudentDetailDrawer';
import { BroadcastAlertModal } from './BroadcastAlertModal';
import { ManualAttendanceModal } from './ManualAttendanceModal';
import { AdminAuthGateModal } from './AdminAuthGateModal';
import { WeeklyAttendanceChart } from './WeeklyAttendanceChart';
import { MonthlyAttendanceTrendChart } from './MonthlyAttendanceTrendChart';
import { EnrollStudentModal } from './EnrollStudentModal';
import { EditStudentIdModal } from './EditStudentIdModal';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  XCircle, 
  ChevronDown, 
  ChevronUp,
  RefreshCw, 
  Bell, 
  Plus, 
  ArrowLeft, 
  Eye, 
  MapPin, 
  Laptop, 
  Smartphone, 
  Wifi, 
  Radio, 
  FileSpreadsheet,
  Layers,
  GraduationCap,
  LineChart as LineChartIcon,
  TrendingUp,
  KeyRound,
  CheckCheck,
  UserPlus,
  Edit3,
  Copy,
  Check,
  Send,
  Mail,
  Zap,
  BookOpen
} from 'lucide-react';

const DEPT_FULL_NAMES: Record<string, string> = {
  'CS': 'Dept of Computer Science & Engineering',
  'ME': 'Dept of Mechanical Engineering',
  'MA': 'Dept of Mathematics & Computing',
  'EC': 'Dept of Electronics & Communication',
  'EE': 'Dept of Electrical Engineering',
  'AI': 'Dept of Artificial Intelligence & Data Science',
  'IT': 'Dept of Information Technology'
};

interface AdminAttendanceDashboardProps {
  onBackToStudentPortal: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const AdminAttendanceDashboard: React.FC<AdminAttendanceDashboardProps> = ({
  onBackToStudentPortal,
  setActiveScreen
}) => {
  // Authentication State - Strictly requires password on every single visit/entry
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(true);

  // Student State
  const [students, setStudents] = useState<StudentAttendance[]>(() => {
    const saved = localStorage.getItem('eduflow_students_roster');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const seenIds = new Set<string>();
          const deduped: StudentAttendance[] = [];
          for (const s of parsed) {
            if (s && s.id && !seenIds.has(s.id)) {
              seenIds.add(s.id);
              deduped.push(s);
            }
          }
          if (deduped.length > 0) return deduped;
        }
      } catch (e) {}
    }
    return INITIAL_STUDENTS_ROSTER;
  });

  // Always reset authentication on unmount so returning to this screen requires password again
  useEffect(() => {
    return () => {
      localStorage.removeItem('eduflow_admin_authenticated');
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('eduflow_students_roster', JSON.stringify(students));
  }, [students]);

  // Selected Date Filter
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('All Batches');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [dashboardViewTab, setDashboardViewTab] = useState<'all' | '30days' | 'weekly' | 'roster'>('all');
  const [showTrendCharts, setShowTrendCharts] = useState<boolean>(true);
  
  // Real-time stream tick
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Modals & Drawers
  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState<StudentAttendance | null>(null);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState<boolean>(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentAttendance | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Student Auth Context
  const { enrollNewStudent, registeredStudents } = useStudentAuth();

  // Unique Student ID Generator & Fast Registration Console State
  const [generatorDept, setGeneratorDept] = useState<string>('CS');
  const [generatorFormat, setGeneratorFormat] = useState<StudentIdFormat>('ACADEMIC_ROLL');
  const [generatorBatchYear, setGeneratorBatchYear] = useState<number>(2026);
  const [adminGeneratedId, setAdminGeneratedId] = useState<string>(() => {
    const existing = students.map(s => s.rollNo);
    return generateUniqueStudentId(existing, {
      departmentCode: 'CS',
      batchYear: 2026,
      format: 'ACADEMIC_ROLL'
    });
  });
  const [adminStudentName, setAdminStudentName] = useState<string>('');
  const [adminStudentLoginId, setAdminStudentLoginId] = useState<string>('');
  const [adminStudentPhone, setAdminStudentPhone] = useState<string>('+91 98765 ');
  const [adminEnrollBatch, setAdminEnrollBatch] = useState<string>('Computer Science 2026');
  const [isGeneratingId, setIsGeneratingId] = useState<boolean>(false);
  const [isRegisteringStudent, setIsRegisteringStudent] = useState<boolean>(false);
  const [copiedAdminId, setCopiedAdminId] = useState<boolean>(false);
  const [batchIdList, setBatchIdList] = useState<string[]>([]);
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);
  const [isGeneratorPanelOpen, setIsGeneratorPanelOpen] = useState<boolean>(true);

  // Validation of admin typed or generated student ID
  const allExistingRollNos = useMemo(() => {
    const fromState = students.map(s => s.rollNo);
    const fromAuth = registeredStudents.map(s => s.rollNo);
    return Array.from(new Set([...fromState, ...fromAuth]));
  }, [students, registeredStudents]);

  const adminIdValidation = validateStudentIdFormat(adminGeneratedId, allExistingRollNos);

  const handleAdminGenerateNewId = (fmt: StudentIdFormat = generatorFormat, dept: string = generatorDept) => {
    setIsGeneratingId(true);
    setTimeout(() => {
      const nextId = generateUniqueStudentId(allExistingRollNos, {
        departmentCode: dept,
        batchYear: generatorBatchYear,
        format: fmt
      });
      setAdminGeneratedId(nextId);
      setIsGeneratingId(false);
    }, 150);
  };

  const handleAdminNameChange = (val: string) => {
    setAdminStudentName(val);
    const firstName = val.trim().split(' ')[0]?.toLowerCase() || '';
    if (firstName && (!adminStudentLoginId || adminStudentLoginId.endsWith('@edu.in'))) {
      setAdminStudentLoginId(`${firstName}@edu.in`);
    }
  };

  const handleCopyAdminId = () => {
    navigator.clipboard.writeText(adminGeneratedId);
    setCopiedAdminId(true);
    setTimeout(() => setCopiedAdminId(false), 2000);
  };

  const handleAdminBatchGenerate = (count: number = 5) => {
    const list = generateBatchStudentIds(count, allExistingRollNos, {
      departmentCode: generatorDept,
      batchYear: generatorBatchYear,
      format: generatorFormat
    });
    setBatchIdList(list);
    setShowBatchModal(true);
  };

  const handleAdminQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminStudentName.trim()) {
      showToast('Please enter the Student Full Name.');
      return;
    }
    if (!adminGeneratedId.trim()) {
      showToast('Please enter or generate a unique Student ID.');
      return;
    }
    if (!adminStudentLoginId.trim() || !adminStudentLoginId.endsWith('@edu.in')) {
      showToast('Student Login ID must be a valid institutional address ending with @edu.in');
      return;
    }

    if (!adminIdValidation.isValid || !adminIdValidation.isUnique) {
      showToast(`Cannot register: ${adminIdValidation.error || 'Student ID is duplicate or invalid'}`);
      return;
    }

    setIsRegisteringStudent(true);
    setTimeout(() => {
      const result = enrollNewStudent({
        name: adminStudentName.trim(),
        rollNo: adminGeneratedId.trim().toUpperCase(),
        loginId: adminStudentLoginId.trim(),
        phone: adminStudentPhone.trim() || '+91 98765 43210',
        parentContact: '+91 98765 00000',
        dob: '15/08/2004',
        dobPassword: '15082004',
        batch: adminEnrollBatch,
        department: DEPT_FULL_NAMES[generatorDept] || 'Dept of Computer Science & Engineering'
      });

      setIsRegisteringStudent(false);

      if (result.success && result.student) {
        showToast(`🎉 Student ${result.student.name} enrolled with ID ${result.student.rollNo}!`);
        setAdminStudentName('');
        setAdminStudentLoginId('');
        setAdminStudentPhone('+91 98765 ');

        // Automatically generate next unique ID for subsequent student registration
        const nextId = generateUniqueStudentId(
          [...allExistingRollNos, result.student.rollNo],
          {
            departmentCode: generatorDept,
            batchYear: generatorBatchYear,
            format: generatorFormat
          }
        );
        setAdminGeneratedId(nextId);
      } else {
        showToast(`Registration failed: ${result.error || 'Please check inputs'}`);
      }
    }, 250);
  };

  // Sync roster updates across components
  useEffect(() => {
    const handleRosterSync = () => {
      const saved = localStorage.getItem('eduflow_students_roster');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const seenIds = new Set<string>();
            const deduped: StudentAttendance[] = [];
            for (const s of parsed) {
              if (s && s.id && !seenIds.has(s.id)) {
                seenIds.add(s.id);
                deduped.push(s);
              }
            }
            setStudents(deduped);
          }
        } catch (e) {}
      }
    };

    window.addEventListener('eduflow:studentRosterUpdated', handleRosterSync);
    window.addEventListener('studentRosterUpdated', handleRosterSync);
    window.addEventListener('storage', handleRosterSync);

    return () => {
      window.removeEventListener('eduflow:studentRosterUpdated', handleRosterSync);
      window.removeEventListener('studentRosterUpdated', handleRosterSync);
      window.removeEventListener('storage', handleRosterSync);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsRefreshing(false);
      showToast('Live attendance stream synced with campus gates.');
    }, 400);
  };

  const handleLockAdmin = () => {
    localStorage.removeItem('eduflow_admin_authenticated');
    setIsAdminAuthenticated(false);
    setIsAuthModalOpen(true);
  };

  // Status Change Handler
  const handleStatusChange = (studentId: string, newStatus: StudentAttendance['attendanceStatus']) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const isPresentOrLate = newStatus === 'Present' || newStatus === 'Late';
          const newHistoryItem = {
            id: `act-admin-${Date.now()}`,
            time: timeStr,
            action: `Admin adjusted attendance status to ${newStatus}`,
            type: 'override' as const,
            details: 'Manual Faculty Intervention'
          };

          return {
            ...s,
            attendanceStatus: newStatus,
            hasLoggedInToday: isPresentOrLate ? true : s.hasLoggedInToday,
            todayLoginTime: isPresentOrLate && !s.todayLoginTime ? timeStr : s.todayLoginTime,
            verificationMethod: 'Manual Faculty Override',
            activityHistory: [newHistoryItem, ...s.activityHistory]
          };
        }
        return s;
      })
    );

    if (selectedStudentForDrawer && selectedStudentForDrawer.id === studentId) {
      setSelectedStudentForDrawer((prev) => prev ? { ...prev, attendanceStatus: newStatus } : null);
    }

    showToast(`Updated attendance status to ${newStatus}`);
  };

  // Manual record addition
  const handleAddManualRecord = (studentId: string, status: StudentAttendance['attendanceStatus'], time: string, reason: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            attendanceStatus: status,
            hasLoggedInToday: status === 'Present' || status === 'Late' ? true : s.hasLoggedInToday,
            todayLoginTime: s.todayLoginTime || time,
            verificationMethod: 'Manual Faculty Override',
            location: reason,
            activityHistory: [
              {
                id: `act-manual-${Date.now()}`,
                time,
                action: `Manual record logged: ${status} (${reason})`,
                type: 'override',
                details: 'Faculty manual entry'
              },
              ...s.activityHistory
            ]
          };
        }
        return s;
      })
    );
    showToast('Manual attendance record saved successfully.');
  };

  // Mark all logged-in students as present
  const handleMarkAllLoggedInPresent = () => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.hasLoggedInToday && s.attendanceStatus === 'Late') {
          return { ...s, attendanceStatus: 'Present' };
        }
        return s;
      })
    );
    showToast('All checked-in students marked as Present.');
  };

  // 'Mark All Present' Toggle action for entire roster or filtered cohort
  const handleToggleMarkAllPresent = (scope: 'filtered' | 'all' = 'filtered') => {
    const targetStudents = scope === 'all' ? students : filteredStudents;
    if (targetStudents.length === 0) return;

    const targetIds = new Set(targetStudents.map((s) => s.id));
    const allCurrentlyPresent = targetStudents.every((s) => s.attendanceStatus === 'Present');
    const nowTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (allCurrentlyPresent) {
      // Toggle OFF: reset status based on whether they actually logged in
      setStudents((prev) =>
        prev.map((s) => {
          if (targetIds.has(s.id)) {
            const revertedStatus: StudentAttendance['attendanceStatus'] = s.hasLoggedInToday
              ? (s.studyHoursToday >= 2 ? 'Present' : 'Late')
              : 'Absent';
            return {
              ...s,
              attendanceStatus: revertedStatus,
              verificationMethod: s.hasLoggedInToday ? 'Biometric + Geo-Fence Verified' : undefined,
              activityHistory: [
                {
                  id: `act-toggle-off-${Date.now()}-${s.id}`,
                  time: nowTimeStr,
                  action: `Bulk Present toggle turned OFF → Status reset to ${revertedStatus}`,
                  type: 'override',
                  details: 'Faculty batch toggle adjustment'
                },
                ...s.activityHistory
              ]
            };
          }
          return s;
        })
      );
      showToast(
        scope === 'all'
          ? `Reset all ${students.length} students to standard logged states.`
          : `Reset ${targetStudents.length} students in ${selectedBatch} to standard logged states.`
      );
    } else {
      // Toggle ON: mark all target students as Present
      setStudents((prev) =>
        prev.map((s) => {
          if (targetIds.has(s.id)) {
            return {
              ...s,
              attendanceStatus: 'Present',
              hasLoggedInToday: true,
              todayLoginTime: s.todayLoginTime || '09:00 AM',
              verificationMethod: s.verificationMethod || 'Admin Quick Attendance Override',
              activityHistory: [
                {
                  id: `act-toggle-on-${Date.now()}-${s.id}`,
                  time: nowTimeStr,
                  action: 'Marked Present via Admin "Mark All Present" Toggle',
                  type: 'override',
                  details: 'Faculty institutional batch verification'
                },
                ...s.activityHistory
              ]
            };
          }
          return s;
        })
      );
      showToast(
        scope === 'all'
          ? `✓ All ${students.length} enrolled students marked as Present.`
          : `✓ Marked all ${targetStudents.length} students in ${selectedBatch} as Present.`
      );
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Roll No', 'Name', 'Batch', 'Logged In Today', 'Login Time', 'Attendance Status', 'Verification Method', 'Study Hours Today', 'Cumulative Attendance %', 'Email'];
    const rows = filteredStudents.map((s) => [
      s.rollNo,
      `"${s.name}"`,
      `"${s.batch}"`,
      s.hasLoggedInToday ? 'YES' : 'NO',
      s.todayLoginTime || 'N/A',
      s.attendanceStatus,
      s.verificationMethod || 'N/A',
      s.studyHoursToday,
      `${s.overallAttendancePct}%`,
      s.email
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ASCEND_STALTECH_INDIAA_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendance report CSV downloaded.');
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  // Batches List
  const batches = useMemo(() => {
    const set = new Set(students.map((s) => s.batch));
    return ['All Batches', ...Array.from(set)];
  }, [students]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.batch.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBatch = selectedBatch === 'All Batches' || s.batch === selectedBatch;

      let matchesStatus = true;
      if (selectedStatusFilter === 'Logged In') {
        matchesStatus = s.hasLoggedInToday;
      } else if (selectedStatusFilter === 'Online Now') {
        matchesStatus = s.isOnline;
      } else if (selectedStatusFilter === 'Present') {
        matchesStatus = s.attendanceStatus === 'Present';
      } else if (selectedStatusFilter === 'Late') {
        matchesStatus = s.attendanceStatus === 'Late';
      } else if (selectedStatusFilter === 'Absent') {
        matchesStatus = s.attendanceStatus === 'Absent';
      } else if (selectedStatusFilter === 'Excused') {
        matchesStatus = s.attendanceStatus === 'Excused';
      }

      return matchesSearch && matchesBatch && matchesStatus;
    });
  }, [students, searchQuery, selectedBatch, selectedStatusFilter]);

  // Check if all filtered students (or all enrolled students) are currently marked Present
  const areAllFilteredPresent = useMemo(() => {
    if (filteredStudents.length === 0) return false;
    return filteredStudents.every((s) => s.attendanceStatus === 'Present');
  }, [filteredStudents]);

  const areAllEnrolledPresent = useMemo(() => {
    if (students.length === 0) return false;
    return students.every((s) => s.attendanceStatus === 'Present');
  }, [students]);

  const presentCountInFiltered = useMemo(() => {
    return filteredStudents.filter((s) => s.attendanceStatus === 'Present').length;
  }, [filteredStudents]);

  // Calculate Metrics
  const metrics = useMemo(() => {
    const total = students.length;
    const loggedInTodayCount = students.filter((s) => s.hasLoggedInToday).length;
    const loggedInPct = total > 0 ? Math.round((loggedInTodayCount / total) * 100) : 0;
    const presentCount = students.filter((s) => s.attendanceStatus === 'Present').length;
    const lateCount = students.filter((s) => s.attendanceStatus === 'Late').length;
    const absentCount = students.filter((s) => s.attendanceStatus === 'Absent').length;
    const excusedCount = students.filter((s) => s.attendanceStatus === 'Excused').length;
    const onlineNowCount = students.filter((s) => s.isOnline).length;
    const totalStudyHours = students.reduce((acc, curr) => acc + curr.studyHoursToday, 0);
    const avgStudyHours = total > 0 ? (totalStudyHours / total).toFixed(1) : '0';

    return {
      total,
      loggedInTodayCount,
      loggedInPct,
      presentCount,
      lateCount,
      absentCount,
      excusedCount,
      onlineNowCount,
      avgStudyHours
    };
  }, [students]);

  const absentList = useMemo(() => {
    return students.filter((s) => s.attendanceStatus === 'Absent' || !s.hasLoggedInToday);
  }, [students]);

  // If not authenticated, render locked security splash
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-5 shadow-2xl shadow-indigo-950/80 animate-pulse">
          <Lock className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-academy mb-2">
          Admin Portal Locked
        </h2>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          The Student Login Audit & Comprehensive Attendance Console is restricted exclusively to authorized faculty and institutional administrators.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/70 border border-indigo-400/30"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Unlock Admin Console</span>
          </button>
          <button
            onClick={onBackToStudentPortal}
            className="w-full py-3 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm border border-white/10"
          >
            Back to Student App
          </button>
        </div>

        <AdminAuthGateModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthenticated={() => {
            setIsAdminAuthenticated(true);
            setIsAuthModalOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-28 md:pb-16 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-indigo-600/95 backdrop-blur-xl border border-indigo-400 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP ADMIN HEADER BAR */}
      <div className="bg-[#0c0c18]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Administrative Command Center
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Live Gate Scanner Connected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-serif-academy">
              Student Attendance & Daily Login Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Institutional roster overview for <span className="text-white font-bold">{selectedDate}, {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span> • Last synced at {lastRefreshedTime}
            </p>
          </div>

          {/* Top Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefresh}
              className={`p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 hover:text-white transition-all ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              title="Sync latest scanner logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-950/50 active:scale-95 border border-indigo-400/40"
              title="Admin authority: Enroll new student & generate official Student ID"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Enroll Student (Create ID)</span>
            </button>

            <button
              onClick={() => setIsManualModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-950/50 active:scale-95 border border-amber-400/50"
            >
              <UserCheck className="w-4 h-4" />
              <span>👑 Put Manual Attendance</span>
            </button>

            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Nudge Absent ({metrics.absentCount})</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Export filtered roster to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                setIsAdminAuthenticated(false);
                setIsAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-indigo-300 text-xs font-bold transition-all active:scale-95"
              title="Reset or Change Admin Security PIN"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Reset PIN</span>
            </button>

            <button
              onClick={handleLockAdmin}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-bold transition-all active:scale-95"
              title="Lock Admin Console session (requires password to re-enter)"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* ADMIN AUTHORITY & MANUAL ATTENDANCE BANNER */}
      <div className="bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-purple-500/15 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg transform hover:scale-[1.01] hover:border-amber-500/50 transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                Exclusive Admin Authority
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-200 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                Manual Attendance Controller
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Only authorized faculty and admins have permission to manually put attendance, override student records, or issue biometric bypasses.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsManualModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/50 flex items-center gap-2 shrink-0 transform hover:scale-105 active:scale-95 transition-all duration-150"
        >
          <UserCheck className="w-4 h-4" />
          <span>Put Manual Attendance</span>
        </button>
      </div>

      {/* EXECUTIVE KPI METRIC CARDS (HOW MANY LOGGED IN TODAY & ATTENDANCE) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Logged in Today */}
        <div 
          onClick={() => {
            setSelectedStatusFilter('Logged In');
            setDashboardViewTab('all');
          }}
          className={`bg-[#0c0c18]/85 border rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg transition-all duration-200 transform hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer group ${
            selectedStatusFilter === 'Logged In' 
              ? 'border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/20' 
              : 'border-indigo-500/30 hover:border-indigo-400 hover:shadow-indigo-950/50'
          }`}
          title="Click to filter roster by Logged In students"
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300 group-hover:text-indigo-200 transition-colors">
              Logged In Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {metrics.loggedInTodayCount}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ {metrics.total} students</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span>{metrics.loggedInPct}% Login Rate</span>
            <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">Filter →</span>
          </div>
        </div>

        {/* Metric 2: Verified Present */}
        <div 
          onClick={() => {
            setSelectedStatusFilter('Present');
            setDashboardViewTab('all');
          }}
          className={`bg-[#0c0c18]/85 border rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg transition-all duration-200 transform hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer group ${
            selectedStatusFilter === 'Present' 
              ? 'border-emerald-400 ring-2 ring-emerald-500/30 bg-emerald-950/20' 
              : 'border-emerald-500/30 hover:border-emerald-400 hover:shadow-emerald-950/50'
          }`}
          title="Click to filter roster by Verified Present students"
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 group-hover:text-emerald-300 transition-colors">
              Verified Present
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {metrics.presentCount}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Students</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
            <span>Facial & Geo-verified</span>
            <span className="text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">Filter →</span>
          </div>
        </div>

        {/* Metric 3: Late Arrivals */}
        <div 
          onClick={() => {
            setSelectedStatusFilter('Late');
            setDashboardViewTab('all');
          }}
          className={`bg-[#0c0c18]/85 border rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg transition-all duration-200 transform hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer group ${
            selectedStatusFilter === 'Late' 
              ? 'border-amber-400 ring-2 ring-amber-500/30 bg-amber-950/20' 
              : 'border-amber-500/30 hover:border-amber-400 hover:shadow-amber-950/50'
          }`}
          title="Click to filter roster by Late students"
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 group-hover:text-amber-300 transition-colors">
              Late Arrivals
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {metrics.lateCount}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Students</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-amber-400">
            <span>After 09:00 AM cutoff</span>
            <span className="text-[10px] text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">Filter →</span>
          </div>
        </div>

        {/* Metric 4: Absent Students */}
        <div 
          onClick={() => {
            setSelectedStatusFilter('Absent');
            setDashboardViewTab('all');
          }}
          className={`bg-[#0c0c18]/85 border rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg transition-all duration-200 transform hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer group ${
            selectedStatusFilter === 'Absent' 
              ? 'border-rose-400 ring-2 ring-rose-500/30 bg-rose-950/20' 
              : 'border-rose-500/30 hover:border-rose-400 hover:shadow-rose-950/50'
          }`}
          title="Click to filter roster by Absent students"
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400 group-hover:text-rose-300 transition-colors">
              Absent Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {metrics.absentCount}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Unrecorded</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-rose-400 font-semibold">
            <span>{metrics.excusedCount > 0 ? `+${metrics.excusedCount} on leave` : 'Immediate follow-up'}</span>
            <span className="text-[10px] text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity">Filter →</span>
          </div>
        </div>

        {/* Metric 5: Online Now (Active Sessions) */}
        <div 
          onClick={() => {
            setSelectedStatusFilter('Online Now');
            setDashboardViewTab('all');
          }}
          className={`bg-[#0c0c18]/85 border rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg transition-all duration-200 transform hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer group ${
            selectedStatusFilter === 'Online Now' 
              ? 'border-purple-400 ring-2 ring-purple-500/30 bg-purple-950/20' 
              : 'border-purple-500/30 hover:border-purple-400 hover:shadow-purple-950/50'
          }`}
          title="Click to filter roster by actively Online students"
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-300 group-hover:text-purple-200 transition-colors">
              Live Online Now
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {metrics.onlineNowCount}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Active</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Real-time sessions
            </span>
            <span className="text-[10px] text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">Filter →</span>
          </div>
        </div>

        {/* Metric 6: Average Study Duration */}
        <div 
          onClick={() => {
            showToast(`Average focus duration is ${metrics.avgStudyHours} hours across logged students.`);
          }}
          className="bg-[#0c0c18]/85 border border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg transition-all duration-200 transform hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer group hover:shadow-cyan-950/50"
          title="Average study hours logged today"
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300 group-hover:text-cyan-200 transition-colors">
              Avg Study Hours
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {metrics.avgStudyHours}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Hours</span>
          </div>
          <div className="mt-2.5 text-xs text-slate-400">
            Per active student
          </div>
        </div>
      </div>

      {/* INSTITUTIONAL STUDENT ID GENERATOR & FAST REGISTRATION CONSOLE */}
      <div className="bg-gradient-to-br from-[#0e0e22] via-[#0c0c18] to-[#14122e] border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-indigo-950/40 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <span>Student ID Generator & Registration</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Admin Authority
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Collision-Resistant Crypto RNG
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate cryptographically secure, collision-free Student IDs and register new students with real-time uniqueness validation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => handleAdminBatchGenerate(5)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-indigo-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Generate batch of 5 collision-free unique IDs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Batch Generate (5 IDs)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsGeneratorPanelOpen(!isGeneratorPanelOpen)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
              title={isGeneratorPanelOpen ? "Collapse generator" : "Expand generator"}
            >
              {isGeneratorPanelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Form Body */}
        {isGeneratorPanelOpen && (
          <form onSubmit={handleAdminQuickRegister} className="mt-5 space-y-5 relative z-10">
            {/* Top Row: Department & Format Selectors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-black/30 p-4 rounded-2xl border border-white/5">
              {/* Department Pills */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Target Academic Department:</span>
                  </span>
                  <span className="text-[11px] font-mono text-indigo-300 font-bold">
                    {DEPT_FULL_NAMES[generatorDept] || generatorDept}
                  </span>
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {Array.from(new Set(Object.values(DEPARTMENT_CODES))).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setGeneratorDept(code);
                        handleAdminGenerateNewId(generatorFormat, code);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        generatorDept === code
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50 border border-indigo-400/40'
                          : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              {/* ID Format Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>ID Generation Standard & Format:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setGeneratorFormat('ACADEMIC_ROLL');
                      handleAdminGenerateNewId('ACADEMIC_ROLL', generatorDept);
                    }}
                    className={`px-2.5 py-2 rounded-xl text-left transition-all border ${
                      generatorFormat === 'ACADEMIC_ROLL'
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
                        : 'bg-white/[0.03] border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold">Academic Roll</div>
                    <div className="text-[10px] font-mono text-indigo-300">26CS0XXX</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGeneratorFormat('SECURE_ALPHA_NUMERIC');
                      handleAdminGenerateNewId('SECURE_ALPHA_NUMERIC', generatorDept);
                    }}
                    className={`px-2.5 py-2 rounded-xl text-left transition-all border ${
                      generatorFormat === 'SECURE_ALPHA_NUMERIC'
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
                        : 'bg-white/[0.03] border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold">Token ID</div>
                    <div className="text-[10px] font-mono text-indigo-300">STU-2026-XXXX</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGeneratorFormat('CAMPUS_SMART_ID');
                      handleAdminGenerateNewId('CAMPUS_SMART_ID', generatorDept);
                    }}
                    className={`px-2.5 py-2 rounded-xl text-left transition-all border ${
                      generatorFormat === 'CAMPUS_SMART_ID'
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
                        : 'bg-white/[0.03] border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold">Smart Card</div>
                    <div className="text-[10px] font-mono text-indigo-300">EDU-2026-CS-XX</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Input Row: Unique Student ID Input Field & Student Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Field 1: Unique Student ID Input Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Unique Student ID / Roll</span>
                    <span className="text-rose-400">*</span>
                  </label>

                  {/* Real-time Uniqueness Validation Pill */}
                  {adminIdValidation.isValid && adminIdValidation.isUnique ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unique & Valid</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                      <AlertCircle className="w-3 h-3" />
                      <span>{adminIdValidation.error || 'Duplicate'}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={adminGeneratedId}
                    onChange={(e) => setAdminGeneratedId(e.target.value.toUpperCase())}
                    placeholder="e.g. 26CS0245"
                    required
                    className="w-full bg-black/50 border border-indigo-500/40 focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-indigo-200 placeholder-slate-500 focus:outline-none transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => handleAdminGenerateNewId(generatorFormat, generatorDept)}
                    className={`px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0 transition-all active:scale-95 border border-indigo-400/40 ${
                      isGeneratingId ? 'opacity-70' : ''
                    }`}
                    title="Generate collision-free unique ID"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingId ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Regenerate</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyAdminId}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors shrink-0"
                    title="Copy Student ID"
                  >
                    {copiedAdminId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 2: Student Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>Student Full Name</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={adminStudentName}
                  onChange={(e) => handleAdminNameChange(e.target.value)}
                  placeholder="e.g. Rohan Deshmukh"
                  required
                  className="w-full bg-black/50 border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>

              {/* Field 3: Official Login ID */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Official Login ID</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-indigo-300 font-bold">@edu.in</span>
                </div>
                <input
                  type="text"
                  value={adminStudentLoginId}
                  onChange={(e) => setAdminStudentLoginId(e.target.value)}
                  placeholder="e.g. rohan@edu.in"
                  required
                  className="w-full bg-black/50 border border-white/15 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>

              {/* Field 4: Mobile Number & Action */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mobile (for OTP Reset)</span>
                </label>
                <input
                  type="text"
                  value={adminStudentPhone}
                  onChange={(e) => setAdminStudentPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-black/50 border border-white/15 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  Enrolled students are assigned initial password formatted as DOB DDMMYYYY (default 15082004) with full password reset rights.
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/15 text-xs font-bold transition-all active:scale-95"
                >
                  Open Full Form
                </button>

                <button
                  type="submit"
                  disabled={isRegisteringStudent}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all active:scale-95 border border-emerald-400/40"
                >
                  {isRegisteringStudent ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enrolling Student...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Register Student with ID ({adminGeneratedId || 'Generate'})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* BATCH UNIQUE ID GENERATOR MODAL */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0c0c18] border border-indigo-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-indigo-950/60 flex flex-col">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-950/50 to-purple-950/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Batch Generated Unique IDs</h4>
                  <p className="text-[11px] text-slate-400">Pre-verified collision-free IDs for {generatorDept} department</p>
                </div>
              </div>
              <button
                onClick={() => setShowBatchModal(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-2.5">
              {batchIdList.map((id, idx) => (
                <div
                  key={`${id}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-indigo-500/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-mono text-sm font-bold text-indigo-200">{id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setAdminGeneratedId(id);
                        setShowBatchModal(false);
                        showToast(`Selected Student ID ${id} in registration console.`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                    >
                      Use ID
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(id);
                        showToast(`Copied ${id} to clipboard.`);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => handleAdminBatchGenerate(5)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generate Another 5 IDs</span>
              </button>
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW SELECTOR TABS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c0c18]/80 backdrop-blur-xl border border-white/10 p-2.5 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setDashboardViewTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              dashboardViewTab === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full Overview</span>
          </button>

          <button
            onClick={() => setDashboardViewTab('30days')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              dashboardViewTab === '30days'
                ? 'bg-gradient-to-r from-emerald-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>30-Day Trend Analysis (Recharts)</span>
          </button>

          <button
            onClick={() => setDashboardViewTab('weekly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              dashboardViewTab === 'weekly'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Weekly Breakdown</span>
          </button>

          <button
            onClick={() => setDashboardViewTab('roster')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              dashboardViewTab === 'roster'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Roster ({filteredStudents.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTrendCharts(!showTrendCharts)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all"
          >
            <LineChartIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>{showTrendCharts ? 'Hide Charts' : 'Show Charts'}</span>
          </button>
        </div>
      </div>

      {/* 30-DAY ATTENDANCE TREND & PATTERN ANALYZER (RECHARTS) */}
      {(dashboardViewTab === 'all' || dashboardViewTab === '30days') && showTrendCharts && (
        <MonthlyAttendanceTrendChart
          initialBatch={selectedBatch}
          onSelectDay={(dayMetric) => {
            showToast(`Inspecting ${dayMetric.date} (${dayMetric.dayOfWeek}): ${dayMetric.attendanceRate}% Attendance`);
          }}
        />
      )}

      {/* WEEKLY STUDENT ATTENDANCE TRENDS (RECHARTS LINE CHART) */}
      {dashboardViewTab === 'weekly' && showTrendCharts && (
        <WeeklyAttendanceChart
          initialBatch={selectedBatch}
          onSelectDay={(dayMetric) => {
            showToast(`Selected ${dayMetric.day} (${dayMetric.date}): ${dayMetric.attendanceRate}% Attendance`);
          }}
        />
      )}

      {/* SEARCH, FILTER & BATCH CONTROLS */}
      {(dashboardViewTab === 'all' || dashboardViewTab === 'roster') && (
        <>
          <div className="bg-[#0c0c18]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student name, roll no, email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Batch & Status Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Batch Selector */}
          <div className="relative">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="text-xs font-bold pl-3.5 pr-8 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
            >
              {batches.map((b) => (
                <option key={b} value={b} className="bg-[#0c0c18]">
                  {b}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Quick Pill Tabs */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full">
            {['All', 'Logged In', 'Online Now', 'Present', 'Late', 'Absent', 'Excused'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedStatusFilter === st
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* MARK ALL PRESENT TOGGLE CONTROL */}
          <div 
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all select-none ${
              areAllFilteredPresent
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-xs shadow-emerald-950/40'
                : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <CheckCheck className={`w-3.5 h-3.5 ${areAllFilteredPresent ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-xs font-bold whitespace-nowrap">Mark All Present</span>
            </div>

            {/* Accessible Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={areAllFilteredPresent}
              onClick={() => handleToggleMarkAllPresent(selectedBatch === 'All Batches' ? 'all' : 'filtered')}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#0c0c18] ${
                areAllFilteredPresent ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
              title={
                areAllFilteredPresent
                  ? 'All displayed students are marked Present. Click to toggle OFF and restore logged states.'
                  : 'Click to quickly mark all displayed students as Present.'
              }
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  areAllFilteredPresent ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>

            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
              areAllFilteredPresent
                ? 'bg-emerald-500/30 text-emerald-200'
                : 'bg-black/40 text-slate-400 border border-white/5'
            }`}>
              {presentCountInFiltered}/{filteredStudents.length}
            </span>
          </div>

          {/* Admin Put Manual Attendance */}
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            title="Put manual attendance record"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Put Manual Attendance</span>
          </button>
        </div>
      </div>

      {/* STUDENT ATTENDANCE & TODAY'S LOGIN ROSTER TABLE */}
      <div className="bg-[#0c0c18]/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-extrabold text-white font-serif-academy">
              Live Student Roster & Activity Log
            </h3>
            <span className="text-xs text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded-full">
              Showing {filteredStudents.length} of {students.length}
            </span>
          </div>

          {/* Quick Header Bulk Actions & Mark All Present Toggle Button */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleToggleMarkAllPresent(selectedBatch === 'All Batches' ? 'all' : 'filtered')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                areAllFilteredPresent
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-emerald-950/60'
              }`}
              title={areAllFilteredPresent ? 'Click to toggle OFF (reset status)' : 'Mark all students in current view as Present'}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{areAllFilteredPresent ? 'All Present (Active)' : `Mark All (${filteredStudents.length}) Present`}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${areAllFilteredPresent ? 'bg-emerald-500/30 text-emerald-200' : 'bg-black/30 text-white'}`}>
                {presentCountInFiltered}/{filteredStudents.length}
              </span>
            </button>

            {selectedBatch !== 'All Batches' && (
              <button
                onClick={() => handleToggleMarkAllPresent('all')}
                className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1"
                title="Mark entire student directory (all batches) as Present"
              >
                <span>Mark All Batches ({students.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black/50 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 sm:px-6">Student Info</th>
                <th className="py-3.5 px-3">Batch & Branch</th>
                <th className="py-3.5 px-3">Today's Login Status</th>
                <th className="py-3.5 px-3">Attendance Status</th>
                <th className="py-3.5 px-3">Verification & Point</th>
                <th className="py-3.5 px-3">Study Time</th>
                <th className="py-3.5 px-3">Semester %</th>
                <th className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span>Quick Override</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMarkAllPresent('filtered');
                      }}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-normal transition-all ${
                        areAllFilteredPresent
                          ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
                          : 'bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border-white/10 hover:border-emerald-500/30'
                      }`}
                      title={areAllFilteredPresent ? 'Click to toggle OFF (reset statuses)' : 'Click to mark all currently listed students as Present'}
                    >
                      {areAllFilteredPresent ? 'All Present ✓' : 'Mark All'}
                    </button>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <UserX className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold">No students match current search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                      onClick={() => setSelectedStudentForDrawer(student)}
                    >
                      {/* 1. Student Info */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-10 h-10 rounded-xl object-cover border border-white/15"
                            />
                            {student.isOnline && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#0c0c18] animate-pulse" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors truncate">
                              {student.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                              <span className="font-mono">{student.rollNo}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Batch */}
                      <td className="py-3.5 px-3">
                        <span className="font-medium text-slate-300 block truncate max-w-[140px]">
                          {student.batch}
                        </span>
                        <span className="text-[10px] text-slate-500">{student.department}</span>
                      </td>

                      {/* 3. Today's Login Activity */}
                      <td className="py-3.5 px-3">
                        {student.hasLoggedInToday ? (
                          <div>
                            <div className="flex items-center gap-1.5 text-white font-mono font-bold">
                              <Clock className="w-3.5 h-3.5 text-indigo-400" />
                              <span>{student.todayLoginTime}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {student.loginMethod} ({student.isOnline ? 'Online' : student.lastActiveAgo})
                            </span>
                          </div>
                        ) : (
                          <div className="text-rose-400 font-semibold text-xs flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Not Logged In</span>
                          </div>
                        )}
                      </td>

                      {/* 4. Attendance Status Chip */}
                      <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${
                            student.attendanceStatus === 'Present'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : student.attendanceStatus === 'Late'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : student.attendanceStatus === 'Excused'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}>
                            {student.attendanceStatus === 'Present' && <CheckCircle2 className="w-3 h-3" />}
                            {student.attendanceStatus === 'Late' && <AlertTriangle className="w-3 h-3" />}
                            {student.attendanceStatus === 'Absent' && <XCircle className="w-3 h-3" />}
                            {student.attendanceStatus}
                          </span>
                        </div>
                      </td>

                      {/* 5. Verification Method & Point */}
                      <td className="py-3.5 px-3">
                        <span className="text-slate-300 font-medium block truncate max-w-[130px]">
                          {student.verificationMethod || 'Pending Verification'}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate max-w-[130px]">
                          <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                          {student.location}
                        </span>
                      </td>

                      {/* 6. Today's Study Hours */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-white font-mono">
                          {student.studyHoursToday}h
                        </span>
                        <span className="text-[10px] text-slate-500 block">Logged Focus</span>
                      </td>

                      {/* 7. Semester Attendance % */}
                      <td className="py-3.5 px-3">
                        <div className="w-20">
                          <div className="flex justify-between items-center text-[10px] mb-1">
                            <span className="font-bold text-white font-mono">{student.overallAttendancePct}%</span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                student.overallAttendancePct >= 85 ? 'bg-emerald-500' :
                                student.overallAttendancePct >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${student.overallAttendancePct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 8. Quick Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStatusChange(student.id, 'Present')}
                            className={`p-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                              student.attendanceStatus === 'Present'
                                ? 'bg-emerald-600 text-white border-emerald-400'
                                : 'bg-white/5 text-slate-400 hover:text-emerald-300 border-white/10'
                            }`}
                            title="Mark Present"
                          >
                            P
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, 'Late')}
                            className={`p-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                              student.attendanceStatus === 'Late'
                                ? 'bg-amber-600 text-white border-amber-400'
                                : 'bg-white/5 text-slate-400 hover:text-amber-300 border-white/10'
                            }`}
                            title="Mark Late"
                          >
                            L
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, 'Absent')}
                            className={`p-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                              student.attendanceStatus === 'Absent'
                                ? 'bg-rose-600 text-white border-rose-400'
                                : 'bg-white/5 text-slate-400 hover:text-rose-300 border-white/10'
                            }`}
                            title="Mark Absent"
                          >
                            A
                          </button>
                          <button
                            onClick={() => setStudentToEdit(student)}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
                            title="Admin: Edit Student ID & Roll No"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedStudentForDrawer(student)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-indigo-300 border border-white/10 transition-colors"
                            title="Inspect complete log"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BATCH ATTENDANCE COMPARISON & RECENT ACTIVITY STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Batch Wise Attendance Comparison */}
        <div className="lg:col-span-6 bg-[#0c0c18]/85 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Batch Login & Attendance Distribution
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Today's Ratio</span>
          </div>

          <div className="space-y-3.5">
            {[
              { batch: 'Computer Science 2026', total: 5, loggedIn: 4, pct: 80, color: 'bg-indigo-500' },
              { batch: 'GATE Mechanical Elite', total: 3, loggedIn: 3, pct: 100, color: 'bg-purple-500' },
              { batch: 'UPSC Prelims Batch', total: 2, loggedIn: 2, pct: 100, color: 'bg-emerald-500' },
              { batch: 'Applied Mathematics', total: 2, loggedIn: 1, pct: 50, color: 'bg-amber-500' }
            ].map((item) => (
              <div 
                key={item.batch} 
                onClick={() => {
                  setSelectedBatch(item.batch);
                  setSelectedStatusFilter('All');
                  setDashboardViewTab('all');
                  showToast(`Filtered roster to "${item.batch}"`);
                }}
                className={`p-3 rounded-2xl border space-y-2 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 group ${
                  selectedBatch === item.batch
                    ? 'bg-indigo-950/30 border-indigo-500/40 shadow-md ring-1 ring-indigo-500/30'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/5 hover:border-white/15'
                }`}
                title={`Click to filter roster by ${item.batch}`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                    <span>{item.batch}</span>
                    {selectedBatch === item.batch && (
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded-md font-semibold">Active</span>
                    )}
                  </span>
                  <span className="font-mono text-slate-300 group-hover:text-white">
                    {item.loggedIn}/{item.total} Logged In ({item.pct}%)
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color} group-hover:brightness-110 transition-all`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Real-time Live Scanner & Security Audit Stream */}
        <div className="lg:col-span-6 bg-[#0c0c18]/85 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Live Scanner & Session Audit Feed
              </h3>
            </div>
            <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Live Stream
            </span>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {[
              { time: '09:45 AM', user: 'Aditya Sen', action: 'Late check-in recorded via Geo-Fence', loc: 'Civil Services Block' },
              { time: '09:20 AM', user: 'Ananya Iyer', action: 'Logged into Mobile App (iPad Air)', loc: 'Central Library' },
              { time: '08:50 AM', user: 'Sneha Patel', action: 'Facial recognition scan verified', loc: 'Mech Lab 2 Scanner' },
              { time: '08:40 AM', user: 'Kavita Menon', action: 'Biometric Face Scan verified', loc: 'Math Block Cam-02' },
              { time: '08:22 AM', user: 'Tanmay Joshi', action: 'Biometric Entry logged', loc: 'Science Block Scanner #02' },
              { time: '08:15 AM', user: 'Alex Rivera', action: 'Web Portal session authenticated', loc: 'Campus WiFi SciBlock' }
            ].map((feed, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  setSearchQuery(feed.user);
                  setDashboardViewTab('all');
                  showToast(`Searching record for ${feed.user}`);
                }}
                className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 flex items-center justify-between text-xs transition-all duration-200 transform hover:scale-[1.015] hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer group shadow-xs"
                title={`Click to inspect ${feed.user}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-[11px] text-indigo-400 shrink-0 group-hover:text-indigo-300">{feed.time}</span>
                  <div className="min-w-0">
                    <span className="font-bold text-white group-hover:text-indigo-200 transition-colors">{feed.user}</span>
                    <span className="text-slate-400 ml-1.5 text-[11px] truncate group-hover:text-slate-300">{feed.action}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 hidden sm:inline group-hover:text-slate-400">{feed.loc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
      )}

      {/* STUDENT DETAIL DRAWER */}
      <StudentDetailDrawer
        student={selectedStudentForDrawer}
        onClose={() => setSelectedStudentForDrawer(null)}
        onStatusChange={handleStatusChange}
      />

      {/* BROADCAST ALERT MODAL */}
      <BroadcastAlertModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        absentStudents={absentList}
        onBroadcastSent={(msg, count) => {
          showToast(`Attendance alert broadcasted to ${count} students.`);
        }}
      />

      {/* MANUAL ENTRY MODAL */}
      <ManualAttendanceModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        students={students}
        onAddManualRecord={handleAddManualRecord}
      />

      {/* ENROLL NEW STUDENT (ADMIN ONLY) */}
      <EnrollStudentModal
        isOpen={isEnrollModalOpen}
        initialRollNo={adminGeneratedId}
        initialName={adminStudentName}
        onClose={() => setIsEnrollModalOpen(false)}
        onSuccess={(name, roll) => {
          showToast(`Student ${name} successfully enrolled with ID ${roll}.`);
          // Generate new ID for next use
          handleAdminGenerateNewId(generatorFormat, generatorDept);
        }}
      />

      {/* EDIT STUDENT ID & IDENTITY (ADMIN ONLY) */}
      <EditStudentIdModal
        isOpen={!!studentToEdit}
        student={studentToEdit}
        onClose={() => setStudentToEdit(null)}
        onSuccess={(name, newRoll) => {
          showToast(`Updated student identity and Roll No for ${name} (${newRoll}).`);
        }}
      />
    </div>
  );
};
