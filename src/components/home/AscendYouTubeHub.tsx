import React, { useState } from 'react';
import { 
  Play, 
  ExternalLink, 
  Copy, 
  Check, 
  Share2, 
  Tv, 
  Sparkles, 
  CheckCircle2, 
  Video,
  MonitorPlay,
  Maximize2
} from 'lucide-react';

interface YouTubeVideo {
  id: string;
  url: string;
  title: string;
  description: string;
  badge: string;
  duration: string;
}

const YOUTUBE_VIDEOS: YouTubeVideo[] = [
  {
    id: '0BC72VZdtwM',
    url: 'https://youtu.be/0BC72VZdtwM?si=7liferpUb-Gbn73G',
    title: 'ASCEND STALTECH INDIAA • Technical Lecture & Academic Masterclass',
    description: 'Core institutional lecture covering applied engineering concepts, exam problem sets, and strategic conceptual analysis.',
    badge: 'Featured Broadcast',
    duration: 'Full Lecture'
  },
  {
    id: 'oghLOmhSoIg',
    url: 'https://youtu.be/oghLOmhSoIg?si=Sgzj5Q58n_oGFz5Q',
    title: 'ASCEND STALTECH INDIAA • Competitive Exam Strategies & Guidance',
    description: 'In-depth session exploring key examination methodologies, quantitative solving tips, and academic guidance.',
    badge: 'Special Session',
    duration: 'Masterclass'
  }
];

const YOUTUBE_CHANNEL = {
  name: 'ASCEND STALTECH INDIAA',
  handle: '@ascendstaltechindiaa158',
  url: 'http://www.youtube.com/@ascendstaltechindiaa158',
};

interface AscendYouTubeHubProps {
  onOpenInLecturePlayer?: (title: string, subject: string, youtubeId: string) => void;
}

export const AscendYouTubeHub: React.FC<AscendYouTubeHubProps> = ({
  onOpenInLecturePlayer
}) => {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo>(YOUTUBE_VIDEOS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (url: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <section 
      id="youtube-channel-section"
      className="relative overflow-hidden rounded-3xl border border-red-500/25 bg-gradient-to-b from-[#140a10] via-[#0e0a14] to-[#070710] p-5 sm:p-7 lg:p-8 shadow-2xl shadow-black/40"
    >
      {/* Red ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with YouTube Branding & Channel Profile Link */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-start sm:items-center gap-3.5">
          {/* YouTube Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-950/60 shrink-0 border border-red-400/40">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                <Video className="w-3 h-3 text-red-400" />
                Official YouTube Channel
              </span>
              <span className="text-xs font-mono text-slate-400">
                {YOUTUBE_CHANNEL.handle}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight font-serif-academy mt-1">
              ASCEND STALTECH INDIAA Video Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Direct video broadcasts, tutorials, and competitive examination masterclasses from our official channel.
            </p>
          </div>
        </div>

        {/* Channel External Link Action */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <a
            href={YOUTUBE_CHANNEL.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-950/60 active:scale-95 border border-red-400/40"
            title="Open official channel on YouTube"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>Visit @ascendstaltechindiaa158</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Player & Playlist Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left / Main: Embedded Interactive YouTube Player */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl shadow-black/80">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=0&rel=0&modestbranding=1`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Active Video Info Banner */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  {selectedVideo.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ID: {selectedVideo.id}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {selectedVideo.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedVideo.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => handleCopyLink(selectedVideo.url, selectedVideo.id, e)}
                className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold transition-all border border-white/10 flex items-center gap-1.5 active:scale-95"
                title="Copy video URL"
              >
                {copiedId === selectedVideo.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <a
                href={selectedVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-200 border border-red-500/40 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                title="Watch directly on YouTube app/website"
              >
                <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                <span>Watch on YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right / Playlist: Video Switcher & Channel Cards */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <MonitorPlay className="w-4 h-4 text-red-400" />
              <span>Available Channel Videos ({YOUTUBE_VIDEOS.length})</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Select to Play</span>
          </div>

          <div className="space-y-3">
            {YOUTUBE_VIDEOS.map((video) => {
              const isCurrent = selectedVideo.id === video.id;
              const thumbUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

              return (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 group ${
                    isCurrent
                      ? 'bg-red-950/30 border-red-500/60 shadow-lg shadow-red-950/40 ring-1 ring-red-500/30'
                      : 'bg-[#0b0b18]/80 hover:bg-[#121226] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Thumbnail preview */}
                    <div className="w-28 h-18 rounded-xl overflow-hidden relative bg-black/60 shrink-0 border border-white/10 group-hover:border-red-400/50 transition-colors">
                      <img
                        src={thumbUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          isCurrent ? 'bg-red-600 text-white' : 'bg-black/60 text-white group-hover:bg-red-600'
                        } transition-colors shadow-md`}>
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[9px] font-mono text-white">
                        {video.duration}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isCurrent ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-slate-400'
                          }`}>
                            {video.badge}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Playing
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-red-300 transition-colors">
                          {video.title}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="font-mono text-[10px]">YouTube HD</span>
                        <button
                          onClick={(e) => handleCopyLink(video.url, video.id, e)}
                          className="hover:text-white p-1"
                          title="Copy Link"
                        >
                          {copiedId === video.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Official Channel Promo Box */}
          <div className="mt-2 p-4 rounded-2xl bg-gradient-to-br from-[#1c0d12] to-[#0c0c18] border border-red-500/30 text-white space-y-2.5 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Tv className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold font-serif-academy text-red-200">
                Subscribe for Live Streams
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never miss new problem breakdown sessions, GATE solution keys, and UPSC answer writing webinars.
            </p>
            <a
              href={YOUTUBE_CHANNEL.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold transition-all border border-white/15 flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Subscribe on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 text-red-400" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
