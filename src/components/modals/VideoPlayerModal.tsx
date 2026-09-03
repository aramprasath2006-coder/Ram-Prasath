import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Maximize, 
  CheckCircle, 
  MessageSquare, 
  BookOpen, 
  Clock, 
  Video, 
  ExternalLink 
} from 'lucide-react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subject: string;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  title,
  subject
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  const [activeTab, setActiveTab] = useState<'chapters' | 'notes'>('chapters');
  const [videoMode, setVideoMode] = useState<'youtube' | 'simulation'>('youtube');
  const [selectedYoutubeId, setSelectedYoutubeId] = useState<'0BC72VZdtwM' | 'oghLOmhSoIg'>('0BC72VZdtwM');
  const [notes, setNotes] = useState<string[]>([
    'Key concept: Integration by parts formula: ∫u dv = uv - ∫v du',
    'Remember to check for trigonometric substitution: x = a sin(θ) for √(a² - x²)',
    'ASCEND STALTECH INDIAA: Master problem solving methods from YouTube channel @ascendstaltechindiaa158'
  ]);
  const [newNote, setNewNote] = useState('');

  if (!isOpen) return null;

  const chapters = [
    { time: '00:00', title: 'Introduction & Prerequisites', completed: true },
    { time: '04:20', title: 'Integration by Parts In-Depth', completed: true },
    { time: '12:45', title: 'Partial Fractions Method', current: true },
    { time: '22:10', title: 'Trigonometric Substitution Solved Examples' },
    { time: '35:00', title: 'Summary & Practice Problems' }
  ];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([...notes, newNote.trim()]);
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0c0c18] rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[95vh]">
        {/* Top bar */}
        <div className="bg-[#070710] border-b border-white/10 text-white px-5 py-3.5 flex flex-wrap justify-between items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                {subject} • Classroom Lecture
              </span>
              <a
                href="http://www.youtube.com/@ascendstaltechindiaa158"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-colors flex items-center gap-1"
              >
                <span>@ascendstaltechindiaa158</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <h3 className="text-base sm:text-lg font-bold line-clamp-1 font-serif-academy">{title}</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setVideoMode('youtube')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  videoMode === 'youtube'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3 h-3" />
                <span>YouTube Lecture</span>
              </button>
              <button
                onClick={() => setVideoMode('simulation')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  videoMode === 'simulation'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Blackboard</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-y-auto">
          {/* Main Video Viewport */}
          <div className="lg:col-span-2 bg-[#020205] flex flex-col justify-between relative min-h-[320px] sm:min-h-[420px]">
            {videoMode === 'youtube' ? (
              <div className="flex-1 flex flex-col justify-between bg-black">
                {/* Embedded YouTube Player */}
                <div className="w-full flex-1 min-h-[280px] sm:min-h-[360px]">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${selectedYoutubeId}?autoplay=1&rel=0`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Video switcher footer bar */}
                <div className="bg-[#070710] p-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">Select YouTube Lecture:</span>
                    <button
                      onClick={() => setSelectedYoutubeId('0BC72VZdtwM')}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                        selectedYoutubeId === '0BC72VZdtwM'
                          ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      Lecture 1 (0BC72VZdtwM)
                    </button>
                    <button
                      onClick={() => setSelectedYoutubeId('oghLOmhSoIg')}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                        selectedYoutubeId === 'oghLOmhSoIg'
                          ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      Lecture 2 (oghLOmhSoIg)
                    </button>
                  </div>

                  <a
                    href={`https://youtu.be/${selectedYoutubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 font-bold"
                  >
                    <span>Open on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <>
                {/* Blackboard Animation Simulation */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white relative">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  <div className="relative z-10 font-mono space-y-4">
                    <div className="text-xl sm:text-2xl text-emerald-400 font-bold">
                      ∫ (3x² + 2x) / (x + 1) dx
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                      Step 1: Perform polynomial long division: <br />
                      (3x² + 2x) ÷ (x + 1) = 3x - 1 + 1/(x + 1)
                    </div>
                    <div className="text-sm sm:text-base text-yellow-400 font-bold">
                      = 3x²/2 - x + ln|x + 1| + C
                    </div>
                  </div>

                  {/* Central Play/Pause Watermark */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 flex items-center justify-center group bg-black/20 hover:bg-black/40 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform border border-indigo-400/30">
                      {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white ml-1" />}
                    </div>
                  </button>
                </div>

                {/* Video Controls Bar */}
                <div className="bg-[#070710]/95 backdrop-blur-md border-t border-white/10 text-white p-3 sm:p-4 flex flex-col gap-2">
                  {/* Progress Slider */}
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span>12:45</span>
                    <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden cursor-pointer">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[36%]"></div>
                    </div>
                    <span>35:00</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-indigo-400">
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button className="hover:text-indigo-400">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <Volume2 className="w-4 h-4 text-slate-400" />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const speeds = ['1x', '1.25x', '1.5x', '2x'];
                          const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                          setPlaybackSpeed(next);
                        }}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 font-mono font-bold text-xs text-indigo-300 border border-white/10"
                      >
                        {playbackSpeed}
                      </button>
                      <Maximize className="w-4 h-4 cursor-pointer hover:text-white text-slate-400" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Chapters & Notes Sidebar */}
          <div className="bg-[#090914] border-l border-white/10 flex flex-col h-full">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-white/10 bg-[#070710]">
              <button
                onClick={() => setActiveTab('chapters')}
                className={`flex-1 py-3 text-xs font-bold transition-all ${
                  activeTab === 'chapters'
                    ? 'border-b-2 border-indigo-500 text-indigo-300 bg-white/[0.04]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Chapters ({chapters.length})
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-3 text-xs font-bold transition-all ${
                  activeTab === 'notes'
                    ? 'border-b-2 border-indigo-500 text-indigo-300 bg-white/[0.04]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Smart Notes ({notes.length})
              </button>
            </div>

            {/* Chapters Tab */}
            {activeTab === 'chapters' && (
              <div className="p-3 space-y-2 flex-1 overflow-y-auto">
                {chapters.map((ch, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all ${
                      ch.current
                        ? 'bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 font-bold shadow-xs'
                        : 'bg-white/[0.03] border border-white/10 text-slate-300 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{ch.time}</span>
                      <span>{ch.title}</span>
                    </div>
                    {ch.completed && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </div>
                ))}
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="p-4 flex flex-col justify-between flex-1 gap-3 overflow-y-auto">
                <div className="space-y-2 flex-1">
                  {notes.map((note, idx) => (
                    <div key={idx} className="p-3 bg-white/[0.04] rounded-xl border border-white/10 text-xs text-slate-300 shadow-2xs">
                      {note}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2 pt-2 border-t border-white/10">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type note at 12:45..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-950/50"
                  >
                    Add
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
