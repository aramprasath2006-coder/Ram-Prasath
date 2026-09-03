import React from 'react';
import { Course, ActiveScreen } from '../../types';
import { 
  Bookmark, 
  BookmarkCheck, 
  Star, 
  Clock, 
  ArrowRight, 
  Play, 
  Sparkles, 
  CreditCard,
  BookOpen,
  Trash2,
  GraduationCap
} from 'lucide-react';

interface SavedCoursesSectionProps {
  courses: Course[];
  setActiveScreen: (screen: ActiveScreen) => void;
  onSelectCourseForCheckout: (course: Course) => void;
  onOpenVideoPlayer: (title: string, subject: string) => void;
  onToggleBookmark: (courseId: string) => void;
}

export const SavedCoursesSection: React.FC<SavedCoursesSectionProps> = ({
  courses,
  setActiveScreen,
  onSelectCourseForCheckout,
  onOpenVideoPlayer,
  onToggleBookmark
}) => {
  const savedCourses = courses.filter((c) => c.isBookmarked);

  return (
    <section className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shadow-xs">
            <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400/30" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Saved Courses &amp; Wishlist
              </h3>
              {savedCourses.length > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {savedCourses.length} {savedCourses.length === 1 ? 'Course' : 'Courses'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Courses saved for later enrollment, syllabus review, and semester planning.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveScreen('course-library')}
          className="text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Manage in Library</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      {savedCourses.length === 0 ? (
        <div className="bg-[#0c0c18]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center gap-3 relative overflow-hidden group shadow-lg shadow-black/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 group-hover:scale-105 group-hover:border-amber-500/40 group-hover:text-amber-300 transition-all">
            <Bookmark className="w-6 h-6 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="max-w-md">
            <h4 className="text-base font-bold text-white">No courses saved yet</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Explore the Course Library and tap the bookmark icon on any course to save it here for upcoming enrollment cycles or future review.
            </p>
          </div>
          <button
            onClick={() => setActiveScreen('course-library')}
            className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-950/40 border border-indigo-400/30 flex items-center gap-2 active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Course Library</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {savedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-[#0c0c18]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-lg shadow-black/20 hover:border-amber-500/40 hover:bg-[#111124] transition-all duration-300 group relative"
            >
              {/* Thumbnail with Overlay & Bookmark Action */}
              <div 
                className="h-36 w-full bg-cover bg-center relative group-hover:scale-[1.02] transition-transform duration-500"
                style={{ backgroundImage: `url('${course.imageUrl}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c18] via-black/30 to-transparent" />
                
                {/* Top Badge & Bookmark Remove Toggle */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-md text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-sm">
                    <BookmarkCheck className="w-3 h-3 text-amber-400" />
                    <span>Saved</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(course.id);
                    }}
                    className="p-1.5 rounded-lg bg-black/70 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 backdrop-blur-md border border-white/10 hover:border-rose-500/40 transition-all shadow-sm group/btn"
                    title="Remove from saved courses"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom Stats over thumbnail */}
                <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-white text-[11px]">
                  <span className="font-medium bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                    {course.duration}
                  </span>
                  <span className="font-medium bg-indigo-950/70 backdrop-blur-sm px-2 py-0.5 rounded border border-indigo-500/30 text-indigo-200">
                    {course.level || 'All Levels'}
                  </span>
                </div>
              </div>

              {/* Course Info & Details */}
              <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
                <div>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {course.category}
                    </span>
                    <span className={`text-sm font-bold ${course.isFree ? 'text-emerald-400' : 'text-white'}`}>
                      {course.isFree ? 'Free' : `₹${course.price}`}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Meta details & Action Buttons */}
                <div className="pt-2 border-t border-white/10 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-slate-200 font-semibold">{course.rating}</span>
                      <span className="text-slate-400 text-[11px]">({course.reviewsCount})</span>
                    </div>
                    {course.instructor && (
                      <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                        By {course.instructor}
                      </span>
                    )}
                  </div>

                  {/* Dual Action CTAs */}
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      onClick={() => onOpenVideoPlayer(course.title, course.subject)}
                      className="py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Play className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => onSelectCourseForCheckout(course)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-indigo-950/40 ${
                        course.isEnrolled
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/40'
                          : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border border-amber-400/40'
                      }`}
                    >
                      <CreditCard className="w-3 h-3" />
                      <span>{course.isEnrolled ? 'Already In' : 'Enroll Now'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
