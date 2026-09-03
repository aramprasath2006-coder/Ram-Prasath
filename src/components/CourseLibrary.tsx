import React, { useState } from 'react';
import { Course, ActiveScreen } from '../types';
import { 
  Search, 
  Star, 
  Clock, 
  BookOpen, 
  PlayCircle, 
  Sparkles, 
  CheckCircle2, 
  Atom, 
  Binary, 
  Play,
  Layers,
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  Heart,
  Tag,
  Percent,
  Check
} from 'lucide-react';

interface CourseLibraryProps {
  courses: Course[];
  setActiveScreen: (screen: ActiveScreen) => void;
  onSelectCourseForCheckout: (course: Course) => void;
  onOpenVideoPlayer: (title: string, subject: string) => void;
  onToggleBookmark?: (courseId: string) => void;
}

type GradeFilter = 'All Grades' | 'Class 6' | 'Class 7' | 'Class 8' | 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';
type PriceTier = 'All Prices' | 'Under ₹25' | '₹25 – ₹50' | 'Above ₹50';

export const CourseLibrary: React.FC<CourseLibraryProps> = ({
  courses,
  setActiveScreen,
  onSelectCourseForCheckout,
  onOpenVideoPlayer,
  onToggleBookmark
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Courses');
  const [selectedGrade, setSelectedGrade] = useState<GradeFilter>('All Grades');
  const [selectedPriceTier, setSelectedPriceTier] = useState<PriceTier>('All Prices');

  const savedCoursesCount = courses.filter((c) => c.isBookmarked).length;

  const categories = [
    'All Courses',
    'School Wing (Classes 6-12) • ₹10-₹50',
    savedCoursesCount > 0 ? `Saved (${savedCoursesCount})` : 'Saved',
    'Mathematics',
    'Science',
    'Physics',
    'Chemistry',
    'Biology',
    'Social Studies',
    'English',
    'Computer Science'
  ];

  const gradeList: GradeFilter[] = [
    'All Grades',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
    'Class 11',
    'Class 12'
  ];

  const priceTiers: PriceTier[] = ['All Prices', 'Under ₹25', '₹25 – ₹50', 'Above ₹50'];

  const enrolledCourses = courses.filter((c) => {
    if (!c.isEnrolled) return false;
    if (selectedCategory.startsWith('Saved')) return c.isBookmarked;
    return true;
  });
  
  const recommendedCourses = courses
    .filter((c) => !c.isEnrolled)
    .filter((c) => {
      // 1. Saved filter
      if (selectedCategory.startsWith('Saved') && !c.isBookmarked) {
        return false;
      }

      // 2. School Wing Category
      if (selectedCategory === 'School Wing (Classes 6-12) • ₹10-₹50') {
        if (!c.isSchoolStudentExclusive && !c.gradeLevel) return false;
      } else if (!selectedCategory.startsWith('Saved') && selectedCategory !== 'All Courses') {
        // Match general categories
        const matchesCategory = 
          c.category.toLowerCase() === selectedCategory.toLowerCase() ||
          (selectedCategory === 'Science' && ['Science', 'Physics', 'Chemistry', 'Biology'].includes(c.category));
        if (!matchesCategory) return false;
      }

      // 3. Grade Filter
      if (selectedGrade !== 'All Grades') {
        if (c.gradeLevel !== selectedGrade) return false;
      }

      // 4. Price Tier Filter
      if (selectedPriceTier === 'Under ₹25' && c.price > 25) return false;
      if (selectedPriceTier === '₹25 – ₹50' && (c.price < 25 || c.price > 50)) return false;
      if (selectedPriceTier === 'Above ₹50' && c.price <= 50) return false;

      // 5. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          c.title.toLowerCase().includes(query) || 
          c.description.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query) ||
          (c.gradeLevel && c.gradeLevel.toLowerCase().includes(query)) ||
          (c.keyTopics && c.keyTopics.some(t => t.toLowerCase().includes(query)));
        if (!matchesSearch) return false;
      }

      return true;
    });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 pb-28 md:pb-12 animate-in fade-in duration-200">
      {/* Search Bar & Quick Wishlist Counter */}
      <section className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full md:w-2/3 lg:w-1/2">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, subjects, or topics..."
            className="w-full bg-[#0c0c18]/80 backdrop-blur-xl border border-white/10 rounded-xl py-3 pl-[42px] pr-4 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-lg shadow-black/20"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-white/10 px-2 py-0.5 rounded-full"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Wishlist Stats Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setSelectedCategory(savedCoursesCount > 0 ? `Saved (${savedCoursesCount})` : 'Saved')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shadow-sm ${
              selectedCategory.startsWith('Saved')
                ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-amber-950/40'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/10'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${savedCoursesCount > 0 ? 'text-amber-400 fill-amber-400/40' : 'text-slate-400'}`} />
            <span>Wishlist ({savedCoursesCount})</span>
          </button>
        </div>
      </section>

      {/* Category Filter Chips */}
      <section className="overflow-x-auto hide-scrollbar py-1 -mx-4 px-4 md:mx-0 md:px-0 flex gap-2 sm:gap-3">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          const isSavedTab = category.startsWith('Saved');
          const isSchoolTab = category.includes('School Wing');
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? isSavedTab
                    ? 'border border-amber-500 bg-amber-500/20 text-amber-300 shadow-md shadow-amber-950/40'
                    : isSchoolTab
                      ? 'border border-emerald-400 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 text-emerald-300 shadow-md shadow-emerald-950/40'
                      : 'border border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-md shadow-indigo-950/40'
                  : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
              }`}
            >
              {isSavedTab && <Bookmark className="w-3 h-3 text-amber-400" />}
              {isSchoolTab && <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{category}</span>
            </button>
          );
        })}
      </section>

      {/* Grade Level & Price Tier Sub-Filters */}
      <section className="flex flex-col gap-3 p-4 rounded-2xl bg-[#0c0c18]/60 border border-white/10 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Grade Selector (Classes 6 to 12) */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Grade:</span>
            </span>
            {gradeList.map((grade) => {
              const isSelected = selectedGrade === grade;
              return (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/10'
                  }`}
                >
                  {grade}
                </button>
              );
            })}
          </div>

          {/* Price Tier Selector (₹10 - ₹50) */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Fee:</span>
            </span>
            {priceTiers.map((tier) => {
              const isSelected = selectedPriceTier === tier;
              return (
                <button
                  key={tier}
                  onClick={() => setSelectedPriceTier(tier)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/10'
                  }`}
                >
                  {tier}
                </button>
              );
            })}
          </div>
        </div>

        {/* School Welfare Pricing Callout */}
        {(selectedCategory.includes('School Wing') || selectedGrade !== 'All Grades' || selectedPriceTier.includes('₹')) && (
          <div className="mt-1 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>School Welfare Initiative:</strong> All Classes 6 to 12 video modules are strictly <strong>₹10 to ₹50</strong> only.
              </span>
            </div>
            {(selectedGrade !== 'All Grades' || selectedPriceTier !== 'All Prices') && (
              <button
                onClick={() => {
                  setSelectedGrade('All Grades');
                  setSelectedPriceTier('All Prices');
                }}
                className="text-[11px] text-indigo-400 hover:underline font-semibold"
              >
                Reset Grade &amp; Fee Filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* My Enrolled Courses Section */}
      {(!selectedCategory.startsWith('Saved') || enrolledCourses.length > 0) && (
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white">My Enrolled Courses</h2>
            <span className="text-xs font-semibold text-slate-400">{enrolledCourses.length} In Progress</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="bg-[#0c0c18]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-lg shadow-black/20 hover:border-indigo-500/40 hover:bg-[#111124] transition-all relative overflow-hidden group"
              >
                {/* Progress Top Bar Indicator */}
                <div 
                  className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
                  style={{ width: `${course.enrolledProgress || 0}%` }}
                ></div>

                <div className="flex justify-between items-start pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 flex-shrink-0 group-hover:scale-105 transition-transform">
                      {course.category === 'Physics' ? (
                        <Atom className="w-5 h-5 text-indigo-400" />
                      ) : course.category === 'Computer Science' ? (
                        <Binary className="w-5 h-5 text-indigo-400" />
                      ) : (
                        <GraduationCap className="w-5 h-5 text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">{course.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onToggleBookmark && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(course.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-all ${
                          course.isBookmarked
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-white/[0.04] text-slate-400 border-white/10 hover:text-white'
                        }`}
                        title={course.isBookmarked ? 'Saved to favorites' : 'Bookmark course'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${course.isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    )}
                    <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg text-xs font-bold">
                      {course.enrolledProgress}%
                    </span>
                  </div>
                </div>

                <div className="mt-1 flex gap-4 text-xs font-medium text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{course.subjectsCount} Subjects</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PlayCircle className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{course.chaptersCount} Chapters</span>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${course.enrolledProgress}%` }}
                  ></div>
                </div>

                <button
                  onClick={() => onOpenVideoPlayer(course.title, course.subject)}
                  className="mt-2 w-full py-2.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 active:scale-98 group-hover:border-indigo-400/30"
                >
                  <span>Continue Learning</span>
                  <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended / Explore Courses Section */}
      <section className="flex flex-col gap-4 mt-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {selectedCategory.startsWith('Saved') ? 'Saved Courses for Enrollment' : 'Recommended For You'}
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            {selectedCategory.startsWith('Saved') ? `${recommendedCourses.length} in Wishlist` : `Filtered by ${selectedCategory}`}
          </span>
        </div>

        {recommendedCourses.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-[#0c0c18]/80 backdrop-blur-xl rounded-2xl border border-white/10 text-slate-400 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 mb-1">
              <Bookmark className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-300">
              {selectedCategory.startsWith('Saved')
                ? 'You have not bookmarked any courses yet.'
                : 'No courses matching your search filter.'}
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              {selectedCategory.startsWith('Saved')
                ? 'Tap the bookmark icon on any course below or in other categories to save it for quick access.'
                : 'Try modifying your search keywords or resetting the category filter.'}
            </p>
            <button 
              onClick={() => { setSelectedCategory('All Courses'); setSearchQuery(''); }}
              className="mt-3 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all"
            >
              Reset Filters to All Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => (
              <div
                key={course.id}
                className={`bg-[#0c0c18]/80 backdrop-blur-xl border rounded-2xl overflow-hidden flex flex-col shadow-lg shadow-black/20 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group relative ${
                  course.isBookmarked ? 'border-amber-500/40 bg-[#100f24]' : 'border-white/10 hover:border-indigo-500/40'
                }`}
              >
                {/* Course Banner Image */}
                <div 
                  className="h-36 w-full bg-cover bg-center relative group-hover:scale-102 transition-transform duration-500"
                  style={{ backgroundImage: `url('${course.imageUrl}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c18] via-transparent to-transparent"></div>

                  {/* Top floating controls: Category badge and Bookmark toggle */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-black/70 backdrop-blur-md text-indigo-300 border border-indigo-500/40 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {course.category}
                      </span>
                      {course.gradeLevel && (
                        <span className="bg-emerald-600/90 backdrop-blur-md text-white border border-emerald-400/40 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-sm">
                          <GraduationCap className="w-2.5 h-2.5" />
                          <span>{course.gradeLevel}</span>
                        </span>
                      )}
                    </div>

                    {/* Bookmark / Favorite Action Button */}
                    {onToggleBookmark && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(course.id);
                        }}
                        className={`p-2 rounded-xl backdrop-blur-md border transition-all duration-200 active:scale-90 shadow-md ${
                          course.isBookmarked
                            ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/30 ring-2 ring-amber-400/30'
                            : 'bg-black/60 hover:bg-black/90 text-white/80 hover:text-amber-300 border-white/20'
                        }`}
                        title={course.isBookmarked ? 'Remove from Saved / Wishlist' : 'Bookmark & Save for later'}
                      >
                        <Bookmark className={`w-4 h-4 ${course.isBookmarked ? 'fill-slate-950 stroke-slate-950' : ''}`} />
                      </button>
                    )}
                  </div>

                  <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-white">
                    <span className="text-[11px] font-medium bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                      {course.duration}
                    </span>
                    <span className="text-[11px] font-medium bg-indigo-950/60 backdrop-blur-sm px-2 py-0.5 rounded border border-indigo-500/30">
                      {course.level || (course.gradeLevel ? `${course.gradeLevel} Level` : 'Comprehensive')}
                    </span>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1.5">
                        {course.isBookmarked && (
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                            <BookmarkCheck className="w-3 h-3 text-amber-400" />
                            <span>Saved</span>
                          </span>
                        )}
                        {course.isSchoolStudentExclusive && (
                          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                            <Percent className="w-2.5 h-2.5 text-emerald-400" />
                            <span>School Rate</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-base font-bold ${course.isFree ? 'text-emerald-400' : 'text-emerald-400 font-mono'}`}>
                            {course.isFree ? 'Free' : `₹${course.price}`}
                          </span>
                          {course.isSchoolStudentExclusive && (
                            <span className="text-[11px] text-slate-500 line-through">
                              ₹499
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Key Syllabus Topics Tags */}
                    {course.keyTopics && course.keyTopics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {course.keyTopics.slice(0, 2).map((topic, idx) => (
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

                  <div>
                    <div className="flex items-center justify-between text-slate-400 text-xs font-semibold py-2 border-t border-white/10">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-slate-300">{course.rating} ({course.reviewsCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => onOpenVideoPlayer(course.title, course.subject)}
                        className="py-2.5 font-bold text-xs rounded-xl transition-all border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                        <span>Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectCourseForCheckout(course)}
                        className={`py-2.5 font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 active:scale-98 ${
                          course.isSchoolStudentExclusive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40 border border-emerald-400/30'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 border border-indigo-400/30 shadow-indigo-950/40'
                        }`}
                      >
                        <span>{course.isFree ? 'Enroll Free' : `Enroll for ₹${course.price}`}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

