import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppMode, ActiveScreen, AppTab, Course, Transaction, AttendanceRecord } from './types';
import { 
  INITIAL_COURSES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_ATTENDANCE_LOGS 
} from './data/mockData';

// Components
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { EduFlowHome } from './components/EduFlowHome';
import { CourseLibrary } from './components/CourseLibrary';
import { DigitalAttendance } from './components/DigitalAttendance';
import { AssessmentScreen } from './components/AssessmentScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { PaymentSuccessScreen } from './components/PaymentSuccessScreen';
import { PaymentsHistoryScreen } from './components/PaymentsHistoryScreen';
import { StudentProfile } from './components/StudentProfile';
import { StudentAchievements } from './components/StudentAchievements';
import { AcademicReportScreen } from './components/AcademicReportScreen';
import { SubjectMasteryScreen } from './components/SubjectMasteryScreen';
import { AdminAttendanceDashboard } from './components/admin/AdminAttendanceDashboard';

// Elite Academy Components
import { EliteDashboard } from './components/EliteDashboard';
import { EliteMockSeries } from './components/EliteMockSeries';
import { EliteGateMechanical } from './components/EliteGateMechanical';
import { ElitePerformanceReport } from './components/ElitePerformanceReport';
import { EliteStudentProofScreen } from './components/EliteStudentProofScreen';
import { RRBExamsPortal } from './components/rrb/RRBExamsPortal';

// Advanced Learning & Cognitive Suites
import { FlashcardReviewScreen } from './components/flashcards/FlashcardReviewScreen';
import { FormulaVaultScreen } from './components/formulas/FormulaVaultScreen';
import { ExamReadinessRadarScreen } from './components/diagnostics/ExamReadinessRadarScreen';
import { AiStudyCompanionScreen } from './components/tutor/AiStudyCompanionScreen';

// Modals
import { VideoPlayerModal } from './components/modals/VideoPlayerModal';
import { TeacherChatModal } from './components/modals/TeacherChatModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { AddFundsModal } from './components/modals/AddFundsModal';

// Study Session Timer
import { StudySessionProvider } from './context/StudySessionContext';
import { PersistentFloatingTimerHUD } from './components/timer/PersistentFloatingTimerHUD';
import { FocusRoomModal } from './components/timer/FocusRoomModal';
import { SessionCompletionModal } from './components/timer/SessionCompletionModal';

// Student Authentication & Proofs
import { StudentAuthProvider } from './context/StudentAuthContext';
import { EliteProofProvider } from './context/EliteProofContext';
import { StudentLoginModal } from './components/auth/StudentLoginModal';
import { StudentLoginScreen } from './components/auth/StudentLoginScreen';
import { ChangePasswordWithMobileModal } from './components/auth/ChangePasswordWithMobileModal';
import { StudentPhotoUploadModal } from './components/modals/StudentPhotoUploadModal';

export default function App() {
  // Navigation & Platform State
  const [mode, setMode] = useState<AppMode>('eduflow');
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('eduflow-home');
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  // Application Data States
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const savedBookmarks = localStorage.getItem('eduflow_saved_course_ids');
      if (savedBookmarks) {
        const bookmarkedIds: string[] = JSON.parse(savedBookmarks);
        return INITIAL_COURSES.map((c) => ({
          ...c,
          isBookmarked: bookmarkedIds.includes(c.id)
        }));
      }
    } catch (e) {
      console.error('Error loading bookmarked courses:', e);
    }
    return INITIAL_COURSES;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [credits, setCredits] = useState<number>(1250);
  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState<Course>(INITIAL_COURSES[0]);

  const handleToggleBookmark = (courseId: string) => {
    setCourses((prev) => {
      const updated = prev.map((c) =>
        c.id === courseId ? { ...c, isBookmarked: !c.isBookmarked } : c
      );
      try {
        const bookmarkedIds = updated.filter((c) => c.isBookmarked).map((c) => c.id);
        localStorage.setItem('eduflow_saved_course_ids', JSON.stringify(bookmarkedIds));
      } catch (e) {
        console.error('Error saving bookmarked courses:', e);
      }
      return updated;
    });
  };
  
  // Last payment details state
  const [lastPaymentDetails, setLastPaymentDetails] = useState<{
    course: Course;
    amount: number;
    paymentMethod: string;
    txnId: string;
    date: string;
    candidateName?: string;
    candidatePhoto?: string;
    candidateRollNo?: string;
  }>({
    course: INITIAL_COURSES[0],
    amount: 499,
    paymentMethod: 'Google Pay UPI (aramprasath2006@oksbi)',
    txnId: 'TXN-847291UPI',
    date: 'Oct 24, 2023',
    candidateName: 'Alex Rivera',
    candidatePhoto: '',
    candidateRollNo: '26CS0142'
  });

  // Modal States
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoModalInfo, setVideoModalInfo] = useState({ title: '', subject: '' });
  const [isTeacherChatOpen, setIsTeacherChatOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedTransactionForReceipt, setSelectedTransactionForReceipt] = useState<Transaction | null>(null);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);

  // Handlers
  const handleOpenVideoPlayer = (title: string, subject: string) => {
    setVideoModalInfo({ title, subject });
    setIsVideoModalOpen(true);
  };

  const handleSelectCourseForCheckout = (course: Course) => {
    setSelectedCourseForCheckout(course);
    setActiveScreen('checkout');
  };

  const handlePaymentSuccess = (details: {
    course: Course;
    amount: number;
    paymentMethod: string;
    txnId: string;
    date: string;
    candidateName?: string;
    candidatePhoto?: string;
    candidateRollNo?: string;
  }) => {
    setLastPaymentDetails(details);
    
    // Mark course as enrolled
    setCourses((prev) =>
      prev.map((c) => (c.id === details.course.id ? { ...c, isEnrolled: true, enrolledProgress: 5 } : c))
    );

    // Add transaction
    const newTx: Transaction = {
      id: details.txnId,
      title: `${details.course.title} (Candidate: ${details.candidateName || 'Alex'})`,
      date: `${details.date} • Just Now`,
      amount: -details.amount,
      type: 'purchase',
      status: 'success',
      icon: 'school'
    };
    setTransactions((prev) => [newTx, ...prev]);

    setActiveScreen('payment-success');
  };

  const handleFundsAdded = (amount: number) => {
    setCredits((prev) => prev + amount);
    const newTx: Transaction = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      title: 'Funds Added (Wallet Top-up)',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • Just Now',
      amount: amount,
      type: 'fund_added',
      status: 'success',
      icon: 'add_circle'
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleViewReceiptFromTx = (tx: Transaction) => {
    setSelectedTransactionForReceipt(tx);
    setIsReceiptModalOpen(true);
  };

  const handleAttendanceSuccess = (record: AttendanceRecord) => {
    console.log('Attendance successfully recorded:', record);
  };

  // Determine which primary screen to render
  const renderScreen = () => {
    switch (activeScreen) {
      // EduFlow Screens
      case 'eduflow-home':
        return (
          <EduFlowHome
            setActiveScreen={setActiveScreen}
            onOpenVideoPlayer={handleOpenVideoPlayer}
            onOpenTeacherChat={() => setIsTeacherChatOpen(true)}
            setMode={setMode}
            courses={courses}
            onSelectCourseForCheckout={handleSelectCourseForCheckout}
            onToggleBookmark={handleToggleBookmark}
          />
        );

      case 'course-library':
        return (
          <CourseLibrary
            courses={courses}
            setActiveScreen={setActiveScreen}
            onSelectCourseForCheckout={handleSelectCourseForCheckout}
            onOpenVideoPlayer={handleOpenVideoPlayer}
            onToggleBookmark={handleToggleBookmark}
          />
        );

      case 'digital-attendance':
        return (
          <DigitalAttendance
            onAttendanceSuccess={handleAttendanceSuccess}
            onOpenAdminPanel={() => setActiveScreen('admin-attendance')}
          />
        );

      case 'mcq-assessment':
        return (
          <AssessmentScreen
            onClose={() => setActiveScreen(mode === 'elite-academy' ? 'elite-mocks' : 'eduflow-home')}
            setActiveScreen={setActiveScreen}
          />
        );

      case 'checkout':
        return (
          <CheckoutScreen
            selectedCourse={selectedCourseForCheckout}
            onBack={() => setActiveScreen('course-library')}
            onPaymentSuccess={handlePaymentSuccess}
          />
        );

      case 'payment-success':
        return (
          <PaymentSuccessScreen
            course={lastPaymentDetails.course}
            amount={lastPaymentDetails.amount}
            paymentMethod={lastPaymentDetails.paymentMethod}
            txnId={lastPaymentDetails.txnId}
            date={lastPaymentDetails.date}
            candidateName={lastPaymentDetails.candidateName}
            candidatePhoto={lastPaymentDetails.candidatePhoto}
            candidateRollNo={lastPaymentDetails.candidateRollNo}
            onStartLearning={() => {
              setActiveScreen('course-library');
              handleOpenVideoPlayer(lastPaymentDetails.course.title, lastPaymentDetails.course.subject);
            }}
            onViewReceipt={() => {
              setSelectedTransactionForReceipt(null);
              setIsReceiptModalOpen(true);
            }}
            onReturnDashboard={() => {
              setActiveScreen('eduflow-home');
              setActiveTab('home');
            }}
          />
        );

      case 'payments-history':
        return (
          <PaymentsHistoryScreen
            transactions={transactions}
            credits={credits}
            onBack={() => setActiveScreen('eduflow-home')}
            onOpenAddFunds={() => setIsAddFundsModalOpen(true)}
            onViewReceipt={handleViewReceiptFromTx}
          />
        );

      case 'student-profile':
        return (
          <StudentProfile
            setActiveScreen={setActiveScreen}
          />
        );

      case 'student-achievements':
        return (
          <StudentAchievements
            courses={courses}
            setActiveScreen={setActiveScreen}
            onOpenVideoPlayer={handleOpenVideoPlayer}
          />
        );

      case 'academic-report':
        return (
          <AcademicReportScreen
            onBack={() => setActiveScreen('student-profile')}
            setActiveScreen={setActiveScreen}
          />
        );

      case 'subject-mastery':
        return (
          <SubjectMasteryScreen
            onBack={() => setActiveScreen('student-profile')}
            onOpenTeacherChat={() => setIsTeacherChatOpen(true)}
          />
        );

      case 'student-login':
        return (
          <StudentLoginScreen
            setActiveScreen={setActiveScreen}
          />
        );

      case 'admin-attendance':
        return (
          <AdminAttendanceDashboard
            onBackToStudentPortal={() => {
              setActiveScreen('eduflow-home');
              setActiveTab('home');
            }}
            setActiveScreen={setActiveScreen}
          />
        );

      // Elite Academy Screens
      case 'elite-home':
        return (
          <EliteDashboard
            setActiveScreen={setActiveScreen}
            onOpenVideoPlayer={handleOpenVideoPlayer}
          />
        );

      case 'elite-mocks':
        return (
          <EliteMockSeries
            onBack={() => setActiveScreen('elite-home')}
            setActiveScreen={setActiveScreen}
          />
        );

      case 'elite-gate':
        return (
          <EliteGateMechanical
            onBack={() => setActiveScreen('elite-home')}
            onOpenVideoPlayer={handleOpenVideoPlayer}
          />
        );

      case 'elite-report':
        return (
          <ElitePerformanceReport
            onBack={() => setActiveScreen('elite-home')}
            setActiveScreen={setActiveScreen}
          />
        );

      case 'elite-proofs':
        return (
          <EliteStudentProofScreen
            onBack={() => setActiveScreen('elite-home')}
            setActiveScreen={setActiveScreen}
          />
        );

      case 'rrb-exams':
        return (
          <RRBExamsPortal
            setActiveScreen={setActiveScreen}
            onSelectCourseForCheckout={handleSelectCourseForCheckout}
            onOpenVideoPlayer={handleOpenVideoPlayer}
          />
        );

      case 'flashcards':
        return (
          <FlashcardReviewScreen
            onBack={() => setActiveScreen(mode === 'elite-academy' ? 'elite-home' : 'eduflow-home')}
            setActiveScreen={setActiveScreen}
          />
        );

      case 'formula-bank':
        return (
          <FormulaVaultScreen
            onBack={() => setActiveScreen(mode === 'elite-academy' ? 'elite-home' : 'eduflow-home')}
            setActiveScreen={setActiveScreen}
          />
        );

      case 'exam-readiness':
        return (
          <ExamReadinessRadarScreen
            onBack={() => setActiveScreen(mode === 'elite-academy' ? 'elite-home' : 'eduflow-home')}
            setActiveScreen={setActiveScreen}
          />
        );

      case 'ai-tutor':
        return (
          <AiStudyCompanionScreen
            onBack={() => setActiveScreen(mode === 'elite-academy' ? 'elite-home' : 'eduflow-home')}
            setActiveScreen={setActiveScreen}
          />
        );

      default:
        return (
          <EduFlowHome
            setActiveScreen={setActiveScreen}
            onOpenVideoPlayer={handleOpenVideoPlayer}
            onOpenTeacherChat={() => setIsTeacherChatOpen(true)}
            setMode={setMode}
            courses={courses}
            onSelectCourseForCheckout={handleSelectCourseForCheckout}
            onToggleBookmark={handleToggleBookmark}
          />
        );
    }
  };

  // Check if current screen is full-screen standalone (like Assessment or Checkout)
  const isFullScreenMode = activeScreen === 'mcq-assessment' || activeScreen === 'checkout' || activeScreen === 'payment-success';

  return (
    <StudentAuthProvider>
      <EliteProofProvider>
        <StudySessionProvider>
          <div className="min-h-screen immersive-bg text-slate-200 flex flex-col font-sans selection:bg-indigo-600 selection:text-white antialiased">
            {/* Global Navbar */}
            {!isFullScreenMode && (
              <Navbar
                mode={mode}
                setMode={setMode}
                activeScreen={activeScreen}
                setActiveScreen={setActiveScreen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                credits={credits}
              />
            )}

            {/* Main Viewport Container with Smooth Cross-Fade Animation */}
            <main className="flex-1 w-full overflow-x-hidden relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${mode}-${activeScreen}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{
                    duration: 0.24,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="w-full"
                >
                  {renderScreen()}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Mobile Bottom Navigation */}
            {!isFullScreenMode && (
              <BottomNav
                mode={mode}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeScreen={activeScreen}
                setActiveScreen={setActiveScreen}
              />
            )}

            {/* Persistent Floating Countdown Timer Widget HUD */}
            {!isFullScreenMode && <PersistentFloatingTimerHUD />}

            {/* Student Authentication Modal */}
            <StudentLoginModal />

            {/* Student Password Reset with Mobile OTP Modal */}
            <ChangePasswordWithMobileModal />

            {/* Student Profile Photo Upload Modal */}
            <StudentPhotoUploadModal />

            {/* Interactive Global Modals */}
            <VideoPlayerModal
              isOpen={isVideoModalOpen}
              onClose={() => setIsVideoModalOpen(false)}
              title={videoModalInfo.title}
              subject={videoModalInfo.subject}
            />

            <TeacherChatModal
              isOpen={isTeacherChatOpen}
              onClose={() => setIsTeacherChatOpen(false)}
            />

            <ReceiptModal
              isOpen={isReceiptModalOpen}
              onClose={() => setIsReceiptModalOpen(false)}
              transaction={selectedTransactionForReceipt}
              amount={lastPaymentDetails.amount}
              txnId={lastPaymentDetails.txnId}
              courseTitle={lastPaymentDetails.course.title}
            />

            <AddFundsModal
              isOpen={isAddFundsModalOpen}
              onClose={() => setIsAddFundsModalOpen(false)}
              onFundsAdded={handleFundsAdded}
            />

            {/* Study Focus Room & Completion Modals */}
            <FocusRoomModal />
            <SessionCompletionModal />
          </div>
        </StudySessionProvider>
      </EliteProofProvider>
    </StudentAuthProvider>
  );
}
