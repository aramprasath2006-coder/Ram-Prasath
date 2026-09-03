import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { ArrowLeft, Search, Filter, PlayCircle, BookOpen, Layers, Flame, ChevronRight, Sparkles } from 'lucide-react';

interface EliteGateMechanicalProps {
  onBack: () => void;
  onOpenVideoPlayer: (title: string, subject: string) => void;
}

export const EliteGateMechanical: React.FC<EliteGateMechanicalProps> = ({
  onBack,
  onOpenVideoPlayer
}) => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'pyq' | 'formulas'>('concepts');
  const [searchQuery, setSearchQuery] = useState('');

  const subjects = [
    {
      id: 'thermo',
      title: 'Thermodynamics & Thermal Applications',
      weightage: 'High (12-15 Marks)',
      progress: 70,
      totalVideos: 18,
      completedVideos: 12,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlDqsQP3TN8CTACq9PieTROVl9854T6w-6pqDn9j_2EaHacIGWJzPg1etcGrtt3mGzGPAk8gjczkyUi8XWseAjBeBReEumzonxrkmbEYyfhcWiEr0m_e1EhRYH2oN6uqFxxmL5z5EtemEz2yHYcg05dLNKmmaVGA9g4D1dKovgFxOFdwmQ2tdatSI8e-TfEkb0DPU91RMza91-iTDZWc8m3bqm-Ru9hX83c6JYgfGZIy9i0iyOjQkO9g',
      featuredLecture: 'First Law of Thermodynamics for Open Systems'
    },
    {
      id: 'fluid',
      title: 'Fluid Mechanics & Hydraulic Machinery',
      weightage: 'High (10-12 Marks)',
      progress: 27,
      totalVideos: 24,
      completedVideos: 6,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBx29rr20mySt5e1S3CdHYdMFm-UX9pnIdgkjkUPDLtBCprOpm0kXuWUhayfh1VDCZJzMaPWBO8aOe9HFlDgj88D1c2Fhs8la8iFXkZ5Tcp3qnGF-ilDe40aL5vc2nJyF3HaSF2F-ra0L1TNhJXQFTiBC9wwHzMy5Q3wBSbHNZmIz-C7sLHXhlhPvG7LW4RIBr05LWXLVIgvn-SCbjFc6RSvP8tjJXUwB4_ugy0VtAAUcfAlQo4UBgefA',
      featuredLecture: 'Navier-Stokes Equations & Boundary Layer Theory'
    },
    {
      id: 'tom',
      title: 'Theory of Machines & Mechanical Vibrations',
      weightage: 'Medium (8-10 Marks)',
      progress: 0,
      totalVideos: 16,
      completedVideos: 0,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4yXlzec7U0knKVteibvWrMyZB5btn1Lfyk49D0rZpsybQvfRt-_0csr5Z11HyhAGiYokqtTLYKeYRjOPOTWfmBVeErL-sOr20eL7sz5L7uaqFRrEa4l2Y2eQBd1SIuFE7aJ1rvXT2m2DCPwzDg0iQa0Dh7Tf1-rgunhPJ64kjOQoB5oH4JminNBpSgbJdJy70vpDfiC7SAPWbhj5wuXXqDASszZ8pvsV5VCc4FSRBU-3lnrpRl62XAg',
      featuredLecture: 'Degrees of Freedom & Four-Bar Linkage Synthesis'
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing Engineering & Materials',
      weightage: 'Very High (15-18 Marks)',
      progress: 45,
      totalVideos: 32,
      completedVideos: 14,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8MdEF_Gom_n-kHPNCdfA7IdwmOk5Cf7ugaQXGUw5eCngvpMUS2YtuMCwhREMWoCCDwjfi3-7xv3IxguhPv2Okrxm1aslMJ7Crfm7hzJhzXLhtTAlA--x78NMjZ8HZGOWt4dNNWBRW5CxZp1UJqL9Gn998ggqYbQKejk4B0X4Q6RDnzLBYtom5Af36z_7yc0359yIVcRCbDy09DnyrsoIlwga8LLpl2xDoUK6q64YnF0d_aOm6tiVFqw',
      featuredLecture: 'Orthogonal Metal Cutting & Merchant Circle Analysis'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050508] immersive-bg text-slate-200 flex flex-col pb-20 animate-in fade-in duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c18]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-all border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-serif-academy text-white">GATE Mechanical (ME)</h1>
            <p className="text-xs text-slate-400">Complete 2025 Syllabus Video Library</p>
          </div>
        </div>

        <button 
          onClick={() => alert('Filter applied: All Subjects')}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors border border-white/10"
        >
          <Filter className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Search Bar */}
        <section className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, formulas, or PYQs..."
            className="w-full bg-[#0c0c18]/80 backdrop-blur-xl border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-lg shadow-black/20 transition-all"
          />
        </section>

        {/* Tab Filters */}
        <section className="flex bg-white/[0.06] rounded-2xl p-1 border border-white/10">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'concepts'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Concept Videos
          </button>
          <button
            onClick={() => setActiveTab('pyq')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'pyq'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            30-Year PYQ Solutions
          </button>
          <button
            onClick={() => setActiveTab('formulas')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'formulas'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Formula Master Sheets
          </button>
        </section>

        {/* Subject Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {subjects.map((subj) => (
            <div
              key={subj.id}
              className="bg-[#0c0c18]/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-lg shadow-black/20 hover:border-indigo-500/40 hover:shadow-2xl transition-all flex flex-col justify-between group"
            >
              <div 
                className="h-36 w-full bg-cover bg-center relative cursor-pointer"
                style={{ backgroundImage: `url('${subj.imageUrl}')` }}
                onClick={() => onOpenVideoPlayer(subj.featuredLecture, subj.title)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c18] via-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-6 h-6 text-indigo-950 fill-indigo-950" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white">
                  <span className="text-[11px] font-bold bg-indigo-950/80 border border-indigo-500/30 px-2 py-0.5 rounded">
                    {subj.weightage}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-300">
                    {subj.completedVideos}/{subj.totalVideos} Lectures
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1 gap-3">
                <div>
                  <h3 className="text-base font-bold font-serif-academy text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {subj.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-medium">
                    Latest: {subj.featuredLecture}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
                    <span>{subj.progress}% Completed</span>
                    <span className="text-indigo-300 font-bold">Resume</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-3">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: `${subj.progress}%` }}></div>
                  </div>

                  <button
                    onClick={() => onOpenVideoPlayer(subj.featuredLecture, subj.title)}
                    className="w-full py-2.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <span>Watch Next Lecture</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};
