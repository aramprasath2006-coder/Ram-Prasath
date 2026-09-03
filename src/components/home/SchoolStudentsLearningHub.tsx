import React, { useState } from 'react';
import { Course, ActiveScreen } from '../../types';
import { 
  GraduationCap, 
  Sparkles, 
  Play, 
  BookOpen, 
  Clock, 
  Star, 
  CheckCircle2, 
  ChevronRight, 
  Bookmark, 
  Video, 
  ArrowRight,
  ShieldCheck,
  Tag,
  Zap,
  Percent
} from 'lucide-react';
import { SCHOOL_COURSES } from '../../data/schoolCoursesData';

interface SchoolStudentsLearningHubProps {
  courses?: Course[];
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenVideoPlayer: (title: string, subject: string) => void;
  onSelectCourseForCheckout: (course: Course) => void;
  onToggleBookmark?: (courseId: string) => void;
}

type GradeFilter = 'All Classes' | 'Class 6' | 'Class 7' | 'Class 8' | 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';
type SubjectFilter = 'All' | 'Mathematics' | 'Science' | 'Social Studies' | 'English';

export const SchoolStudentsLearningHub: React.FC<SchoolStudentsLearningHubProps> = ({
  courses = [],
  setActiveScreen,
  onOpenVideoPlayer,
  onSelectCourseForCheckout,
  onToggleBookmark
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeFilter>('All Classes');
  const [selectedSubject, setSelectedSubject] = useState<SubjectFilter>('All');

  // Pull school courses from courses prop if present, else fallback to SCHOOL_COURSES
  const allSchoolCourses = courses.filter((c) => c.isSchoolStudentExclusive || c.gradeLevel) || SCHOOL_COURSES;
  const pool = allSchoolCourses.length > 0 ? allSchoolCourses : SCHOOL_COURSES;

  const filteredCourses = pool.filter((c) => {
    const matchesGrade = selectedGrade === 'All Classes' || c.gradeLevel === selectedGrade;
    const matchesSubject = selectedSubject === 'All' 
      ? true 
      : selectedSubject === 'Science'
        ? ['Science', 'Physics', 'Chemistry', 'Biology'].includes(c.category)
        : c.category === selectedSubject;
    return matchesGrade && matchesSubject;
  });

  const gradeTiers: { id: GradeFilter; label: string; priceRange: string; tag?: string }[] = [
    { id: 'All Classes', label: 'All Classes (6–12)', priceRange: '₹10 – ₹50' },
    { id: 'Class 6', label: 'Class 6', priceRange: '₹10 – ₹19' },
    { id: 'Class 7', label: 'Class 7', priceRange: '₹15 – ₹25' },
    { id: 'Class 8', label: 'Class 8', priceRange: '₹20 – ₹29' },
    { id: 'Class 9', label: 'Class 9', priceRange: '₹30 – ₹35' },
    { id: 'Class 10', label: 'Class 10', priceRange: '₹35 – ₹45', tag: 'Board Special' },
    { id: 'Class 11', label: 'Class 11', priceRange: '₹40 – ₹49', tag: 'Foundation' },
    { id: 'Class 12', label: 'Class 12', priceRange: '₹45 – ₹50', tag: 'Board & Entrance' },
  ];

  return (
    <section id="school-learning-hub" className="flex flex-col gap-6 scroll-mt-20">
      {/* Header & Subsidized Welfare Mission Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-[#0a1418] to-[#0c0c18] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>School Learning Wing • Classes 6 to 12</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Tag className="w-3 h-3 text-amber-400" />
                <span>Subsidized Rate: ₹10 – ₹50 / Video Module</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-serif-academy tracking-tight">
              Affordable Video Learning for School Students
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Equipping 6th to 12th standard students with concept-clarity video lectures, animated experiments, and board exam problem solving. Each video module is priced between <strong className="text-emerald-400">₹10 and ₹50 only</strong> so every student can learn without economic barriers.
            </p>
          </div>

          {/* Quick Stat Counter Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-black/40 border border-emerald-500/30 rounded-2xl p-3.5 text-center">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">₹10 – ₹50</span>
              <p className="text-[11px] font-semibold text-slate-300 mt-0.5">Nominal Cost Only</p>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 text-center">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">Classes 6–12</span>
              <p className="text-[11px] font-semibold text-slate-300 mt-0.5">NCERT / CBSE / State</p>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 text-center col-span-2 sm:col-span-1">
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">21+</span>
              <p className="text-[11px] font-semibold text-slate-300 mt-0.5">Micro-Courses</p>
            </div>
          </div>
        </div>

        {/* Feature Badges Strip */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Chapter-wise Video Lessons + Timestamped Notes</span>
          </div>
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-amber-400 shrink-0" />
            <span>90% Student Welfare Fee Subsidy</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Instant Video Unlock &amp; Practice Worksheets</span>
          </div>
        </div>
      </div>

      {/* Grade Selector Tabs (Classes 6 to 12) */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>Select Student Grade / Standard:</span>
          </h3>
          <span className="text-xs text-emerald-400 font-semibold font-mono">
            {filteredCourses.length} Courses Available
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {gradeTiers.map((tier) => {
            const isSelected = selectedGrade === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setSelectedGrade(tier.id)}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border shadow-sm ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-emerald-950/50 scale-102'
                    : 'bg-[#0c0c18]/80 hover:bg-white/[0.08] text-slate-300 border-white/10'
                }`}
              >
                <span>{tier.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected ? 'bg-black/30 text-emerald-200' : 'bg-emerald-500/15 text-emerald-300'
                }`}>
                  {tier.priceRange}
                </span>
                {tier.tag && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {tier.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {(['All', 'Mathematics', 'Science', 'Social Studies', 'English'] as SubjectFilter[]).map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              selectedSubject === subj
                ? 'bg-white/15 text-white border-white/30'
                : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/10'
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* School Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-[#0c0c18]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg shadow-black/30 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 group"
          >
            {/* Top Thumbnail Image */}
            <div 
              className="h-36 w-full bg-cover bg-center relative"
              style={{ backgroundImage: `url('${course.imageUrl}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c18] via-black/40 to-transparent"></div>

              {/* Floating Grade & Price Badges */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <span className="bg-emerald-600/90 backdrop-blur-md text-white border border-emerald-400/40 px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-md">
                  <GraduationCap className="w-3 h-3" />
                  <span>{course.gradeLevel || 'Class 6-12'}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="bg-black/80 backdrop-blur-md text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded-lg text-xs font-mono font-black shadow-md">
                    ₹{course.price} Only
                  </span>

                  {onToggleBookmark && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(course.id);
                      }}
                      className={`p-1.5 rounded-lg backdrop-blur-md border transition-all ${
                        course.isBookmarked
                          ? 'bg-amber-500 text-slate-950 border-amber-300'
                          : 'bg-black/60 text-white/80 hover:text-amber-300 border-white/20'
                      }`}
                      title={course.isBookmarked ? 'Saved to Wishlist' : 'Save course'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${course.isBookmarked ? 'fill-slate-950' : ''}`} />
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Meta in Thumbnail */}
              <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-white text-[11px] font-medium">
                <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                  {course.duration}
                </span>
                <span className="bg-emerald-950/80 backdrop-blur-sm text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  {course.chaptersCount || 8} Video Lessons
                </span>
              </div>
            </div>

            {/* Course Card Body */}
            <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {course.category} • {course.syllabusBoard || 'NCERT / CBSE'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="font-bold">{course.rating}</span>
                    <span className="text-slate-500">({course.reviewsCount})</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {course.title}
                </h4>

                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                {/* Key Syllabus Topics Tags */}
                {course.keyTopics && course.keyTopics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {course.keyTopics.slice(0, 3).map((topic, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-white/[0.04] text-slate-300 border border-white/10 px-2 py-0.5 rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-3 border-t border-white/10 space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      ₹{course.price}
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      ₹499
                    </span>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      School Welfare Rate
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Lifetime Access
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenVideoPlayer(course.title, course.subject)}
                    className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span>Watch Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectCourseForCheckout(course)}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-950/40 border border-emerald-400/30 flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span>Enroll for ₹{course.price}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action: Jump to full library */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Need more grade-specific subjects?</h4>
            <p className="text-xs text-slate-400">Browse the full course repository with all Classes 6–12 filters and practice quizzes.</p>
          </div>
        </div>

        <button
          onClick={() => setActiveScreen('course-library')}
          className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
        >
          <span>Open Full Course Library</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
