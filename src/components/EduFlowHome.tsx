import React, { useState } from 'react';
import { ActiveScreen, AppMode, Course } from '../types';
import { 
  Play, 
  ArrowRight, 
  MapPin, 
  Monitor, 
  Calendar, 
  BookOpen, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Mail, 
  UserCheck, 
  ShieldCheck, 
  AlertCircle, 
  Camera,
  CalendarCheck2,
  BookOpenCheck,
  Compass
} from 'lucide-react';
import { DailyStudyGoals } from './DailyStudyGoals';
import { StudySessionLauncherCard } from './timer/StudySessionLauncherCard';
import { StudyTimeSparkline } from './home/StudyTimeSparkline';
import { QuickActionsFloatingMenu } from './home/QuickActionsFloatingMenu';
import { UpcomingDeadlinesModal } from './home/UpcomingDeadlinesModal';
import { AcademicPresenceBanner } from './home/AcademicPresenceBanner';
import { CompetitiveExamCategoriesGrid } from './home/CompetitiveExamCategoriesGrid';
import { CompetitiveExamPassoutHub } from './home/CompetitiveExamPassoutHub';
import { ExamPrepFastTracks } from './home/ExamPrepFastTracks';
import { AdvancedLearningSuiteSection } from './home/AdvancedLearningSuiteSection';
import { SavedCoursesSection } from './home/SavedCoursesSection';
import { AcademicPerformanceStats } from './home/AcademicPerformanceStats';
import { AscendYouTubeHub } from './home/AscendYouTubeHub';
import { SchoolStudentsLearningHub } from './home/SchoolStudentsLearningHub';
import { useStudentAuth } from '../context/StudentAuthContext';

interface EduFlowHomeProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenVideoPlayer: (title: string, subject: string) => void;
  onOpenTeacherChat?: () => void;
  setMode?: (mode: AppMode) => void;
  courses?: Course[];
  onSelectCourseForCheckout?: (course: Course) => void;
  onToggleBookmark?: (courseId: string) => void;
}

export const EduFlowHome: React.FC<EduFlowHomeProps> = ({
  setActiveScreen,
  onOpenVideoPlayer,
  onOpenTeacherChat,
  setMode,
  courses = [],
  onSelectCourseForCheckout = () => {},
  onToggleBookmark = () => {}
}) => {
  const { currentUser, openLoginModal, openPhotoUploadModal } = useStudentAuth();
  const [isDeadlinesModalOpen, setIsDeadlinesModalOpen] = useState(false);
  const calculusThumbnail = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfYab9Fd-jV1cMLDU51hn-hlJRQoY1rqYBbZmDIOM0_UTY6_118Fe2jRBzkwKRRpqPGxa4nXlei9fE4A0TEHVjTjW8PXI8NlSTShlgAKOVaqsR4LKfwDd6L7xAGJnt3A2vifFxS9smpiUStAopEjCZPYVitabHMu7xwlNjmCzG_8JqH04IknQKeyhInDGhFp6yuOxn2DvrlBRApRrPpT6Oh0mK0fI_45RnyJswmzTSrEDw_xKoYJ-sHA';

  const handleScrollToAchievers = () => {
    const el = document.getElementById('academic-achievers-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 pb-28 md:pb-12 animate-in fade-in duration-200">
      {/* 1. ACADEMIC PRESENCE & INSTITUTIONAL EXCELLENCE HERO BANNER */}
      <AcademicPresenceBanner
        onScrollToAchievers={handleScrollToAchievers}
        setActiveScreen={setActiveScreen}
      />

      {/* 2. Welcome & Active Student Status Bar */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c0c18]/60 p-5 rounded-2xl border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div 
            onClick={openPhotoUploadModal}
            className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-lg shrink-0 bg-indigo-950 cursor-pointer relative group hover:border-indigo-400 transition-all"
            title="Click to update student profile photo"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'Student'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
              <Camera className="w-4 h-4 text-indigo-300" />
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome back, {currentUser?.name || 'Alex'}!
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-mono">
                <Mail className="w-3 h-3 text-indigo-400" />
                {currentUser?.loginId || 'alex@edu.in'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
              Roll No: <span className="font-mono text-slate-200 font-bold">{currentUser?.rollNo || '23BCS-104'}</span> • {currentUser?.department || 'Computer Science & Engineering'} • {currentUser?.batch || '2023-2027'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            onClick={openPhotoUploadModal}
            className="px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Upload or change profile picture"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-400" />
            <span>Photo</span>
          </button>
          <button
            onClick={openLoginModal}
            className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Switch enrolled student account"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Switch Student</span>
          </button>
          <button
            onClick={() => setActiveScreen('study-timer')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-950/50 active:scale-95"
          >
            <Clock className="w-3.5 h-3.5 text-white" />
            <span>Focus Timer</span>
          </button>
        </div>
      </section>

      {/* 3. Bento Grid: Quick Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat Card 1: Attendance */}
        <div 
          onClick={() => setActiveScreen('digital-attendance')}
          className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/10 shadow-lg shadow-black/20 flex flex-col justify-between h-36 hover:border-emerald-500/40 hover:bg-[#111124] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 border border-emerald-500/30 group-hover:scale-110 transition-transform">
              <CalendarCheck2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-500/30">
              Verified
            </span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{currentUser?.overallAttendancePct || 94}%</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5 group-hover:text-emerald-300 transition-colors">Digital Attendance Record</p>
          </div>
        </div>

        {/* Stat Card 2: Active Courses */}
        <div 
          onClick={() => setActiveScreen('course-library')}
          className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/10 shadow-lg shadow-black/20 flex flex-col justify-between h-36 hover:border-indigo-500/40 hover:bg-[#111124] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 border border-indigo-500/30 group-hover:scale-110 transition-transform">
              <BookOpenCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
              Enrolled
            </span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{currentUser?.enrolledCoursesCount || 4}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5 group-hover:text-indigo-300 transition-colors">Active Courses</p>
          </div>
        </div>

        {/* Stat Card 3: 7-Day Study Time Mini Sparkline */}
        <StudyTimeSparkline
          variant="bento"
          onOpenTimerLauncher={() => setActiveScreen('study-timer')}
        />

        {/* Stat Card 4: 1,500+ Exam Pass-Outs Spotlight */}
        <div 
          onClick={handleScrollToAchievers}
          className="bg-gradient-to-br from-[#12102e] to-[#0c0c18] backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-amber-500/30 shadow-lg shadow-black/20 flex flex-col justify-between h-36 relative overflow-hidden group cursor-pointer hover:border-amber-400/60 hover:bg-[#161338] transition-all"
        >
          {/* Trophy Watermark */}
          <div className="absolute right-[-10px] top-[-15px] opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
            <Award className="w-28 h-28 text-amber-400" />
          </div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Exam Legacy</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                1,500+ Passed
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-white">1,540+</span>
                <span className="text-xs font-semibold text-emerald-400">Qualifiers</span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5 group-hover:text-amber-300 transition-colors line-clamp-1">
                UPSC, GATE, Railway &amp; Aptitude
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5. ACADEMIC PERFORMANCE STATS (ANIMATED COUNTERS: 1500+ ALUMNI PASSED, 98% PLACEMENT RATE, TOP-TIER EXAM SELECTIONS) */}
      <AcademicPerformanceStats />

      {/* 4. RESPONSIVE GRID OF COMPETITIVE EXAM CATEGORIES */}
      <CompetitiveExamCategoriesGrid
        setActiveScreen={setActiveScreen}
        setMode={setMode}
        onScrollToAchievers={handleScrollToAchievers}
      />

      {/* 5. THE FLAGSHIP 1,500+ COMPETITIVE EXAM PASSED-OUT ACHIEVERS HUB */}
      <CompetitiveExamPassoutHub
        setActiveScreen={setActiveScreen}
        onOpenTeacherChat={onOpenTeacherChat}
      />

      {/* 6. EXAM PREPARATION FAST-TRACK SUITES */}
      <ExamPrepFastTracks
        setActiveScreen={setActiveScreen}
        setMode={setMode}
      />

      {/* 6.5. ADVANCED LEARNING & ASSESSMENT SUITE (FLASHCARDS, FORMULAS, DIAGNOSTICS, AI TUTOR) */}
      <AdvancedLearningSuiteSection
        setActiveScreen={setActiveScreen}
      />

      {/* 6.8. ASCEND STALTECH INDIAA OFFICIAL YOUTUBE VIDEO HUB & CHANNEL SHOWCASE */}
      <AscendYouTubeHub
        onOpenInLecturePlayer={(title, subject) => onOpenVideoPlayer(title, subject)}
      />

      {/* 6.9. DEDICATED SCHOOL STUDENTS LEARNING WING (CLASSES 6 TO 12 • ₹10 TO ₹50 SUBSIDIZED MICRO-COURSES) */}
      <SchoolStudentsLearningHub
        courses={courses}
        setActiveScreen={setActiveScreen}
        onOpenVideoPlayer={onOpenVideoPlayer}
        onSelectCourseForCheckout={onSelectCourseForCheckout}
        onToggleBookmark={onToggleBookmark}
      />

      {/* 7. SAVED COURSES & WISHLIST FOR LATER ENROLLMENT */}
      <SavedCoursesSection
        courses={courses}
        setActiveScreen={setActiveScreen}
        onSelectCourseForCheckout={onSelectCourseForCheckout}
        onOpenVideoPlayer={onOpenVideoPlayer}
        onToggleBookmark={onToggleBookmark}
      />

      {/* 8. 7-Day Study Time Sparkline Visual Summary */}
      <StudyTimeSparkline
        variant="card"
        onOpenTimerLauncher={() => setActiveScreen('study-timer')}
      />

      {/* 7. Daily Study Goals Section */}
      <DailyStudyGoals />

      {/* 8. Persistent Study Interval Countdown Session Launcher */}
      <StudySessionLauncherCard defaultSubject="Mathematics" />

      {/* 9. Continue Learning Section */}
      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-end">
          <h3 className="text-lg sm:text-xl font-bold text-white">Continue Learning</h3>
          <button 
            onClick={() => setActiveScreen('course-library')}
            className="text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
          >
            View all
          </button>
        </div>

        <div 
          onClick={() => onOpenVideoPlayer('Integration Techniques & Applications', 'Mathematics')}
          className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg shadow-black/30 overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl hover:border-indigo-500/40 hover:bg-[#111124] transition-all cursor-pointer"
        >
          {/* Thumbnail with overlay */}
          <div className="w-full md:w-2/5 lg:w-1/3 h-48 md:h-auto relative bg-slate-900 overflow-hidden flex-shrink-0">
            <img 
              src={calculusThumbnail} 
              alt="Course Thumbnail" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-indigo-900 fill-indigo-900 ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-mono border border-white/10">
              22 mins left
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-6 flex flex-col justify-between w-full gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30">
                  Mathematics
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-white/[0.06] text-slate-300 rounded-lg border border-white/10">
                  Module 3
                </span>
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 ml-auto">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Progress
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                Integration Techniques & Applications
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                Master advanced integration methods including partial fractions and trigonometric substitution in this comprehensive lecture.
              </p>
            </div>

            {/* Progress Bar & CTA */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>45% Completed</span>
                <span className="text-indigo-400 group-hover:text-indigo-300">Click to Resume Lesson</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Upcoming Schedule & Discover Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-white">Today's Schedule</h3>
              <button
                onClick={() => setIsDeadlinesModalOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                title="View active deadlines"
              >
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span>3 Deadlines</span>
              </button>
            </div>
            <span className="text-xs font-bold text-slate-400">Tuesday, Oct 24</span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Timeline Item 1: Active */}
            <div className="flex gap-3 relative">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-indigo-500 border-4 border-[#0c0c18] z-10"></div>
                <div className="w-0.5 h-full bg-indigo-500/30 absolute top-4 bottom-[-12px]"></div>
              </div>
              <div className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-4 flex-1 border border-indigo-500/30 shadow-lg shadow-black/20">
                <div className="flex justify-between items-start mb-1">
                  <h5 className="text-sm font-bold text-white">Organic Chemistry Lab</h5>
                  <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-500/30 shadow-2xs">
                    10:00 AM
                  </span>
                </div>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  Room 302, Science Block
                </p>
              </div>
            </div>

            {/* Timeline Item 2: Upcoming */}
            <div className="flex gap-3 relative">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-slate-600 border-4 border-[#0c0c18] z-10"></div>
              </div>
              <div className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl p-4 flex-1 border border-white/10 shadow-lg shadow-black/20">
                <div className="flex justify-between items-start mb-1">
                  <h5 className="text-sm font-bold text-white">Data Structures & Algorithms</h5>
                  <span className="text-xs font-semibold text-slate-300 bg-white/[0.06] px-2 py-0.5 rounded-md border border-white/10">
                    1:30 PM
                  </span>
                </div>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-1 font-medium">
                  <Monitor className="w-3.5 h-3.5 text-slate-400" />
                  Virtual Classroom Link
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Discover More Card (Blue Gradient Asymmetric) */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg sm:text-xl font-bold text-white">Discover More</h3>
          <div 
            onClick={() => setActiveScreen('course-library')}
            className="bg-gradient-to-br from-indigo-900/70 via-purple-900/50 to-[#0c0c18] rounded-2xl p-6 h-full min-h-[190px] flex flex-col justify-center items-start relative overflow-hidden group cursor-pointer shadow-lg border border-indigo-500/30 hover:border-indigo-400/50 transition-all"
          >
            {/* Ambient Background Bloom */}
            <div className="absolute right-[-30px] bottom-[-30px] w-48 h-48 bg-purple-500/15 rounded-full blur-2xl group-hover:bg-purple-500/25 transition-all"></div>
            <div className="absolute right-4 top-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">
                <Compass className="w-7 h-7 text-indigo-300" />
              </div>
            </div>

            <div className="relative z-10">
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
                Expand Your<br />Horizons
              </h4>
              <p className="text-xs sm:text-sm text-indigo-200/90 mb-5 max-w-[240px] leading-relaxed">
                Browse new subjects, certified electives, and timed test simulations.
              </p>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-950/50 hover:from-indigo-500 hover:to-purple-500 border border-indigo-400/30 transition-all flex items-center gap-2 group-hover:translate-x-1 duration-200">
                <span>Explore Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Quick Launch Action Banner */}
      <section className="bg-gradient-to-r from-indigo-950/60 via-[#0c0c18] to-purple-950/60 rounded-2xl p-4 sm:p-5 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-900/50 border border-indigo-400/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Weekly Math Assessment Live</h4>
            <p className="text-xs text-slate-300">20 Timed MCQs on Calculus, Linear Algebra & Limits.</p>
          </div>
        </div>
        <button
          onClick={() => setActiveScreen('mcq-assessment')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-bold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-900/40 border border-indigo-400/30 flex items-center justify-center gap-2 flex-shrink-0"
        >
          <span>Start Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* 12. Admin Access Quick Banner */}
      <section className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Faculty & Institutional Administrator Portal</h4>
            <p className="text-[11px] text-slate-400">Review today's student login count, real-time presence rates, unique ID generation, and full roster audits.</p>
          </div>
        </div>
        <button
          onClick={() => setActiveScreen('admin-attendance')}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center gap-1.5"
        >
          <span>Open Admin Console</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* Quick Actions Floating Menu (Speed-Dial & Workflow Shortcuts) */}
      <QuickActionsFloatingMenu
        setActiveScreen={setActiveScreen}
        onOpenVideoPlayer={onOpenVideoPlayer}
        onOpenDeadlines={() => setIsDeadlinesModalOpen(true)}
        onOpenTeacherChat={onOpenTeacherChat}
      />

      {/* Upcoming Deadlines Interactive Modal / Sheet */}
      <UpcomingDeadlinesModal
        isOpen={isDeadlinesModalOpen}
        onClose={() => setIsDeadlinesModalOpen(false)}
        setActiveScreen={setActiveScreen}
        onOpenVideoPlayer={onOpenVideoPlayer}
      />
    </div>
  );
};
