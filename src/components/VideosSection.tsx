import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language, VideoItem } from '../types';
import { DEFAULT_HERO_BANNER } from '../assets/images';
import { toggleVote, getUserVote } from '../lib/storage';
import {
  Video,
  Play,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  X
} from 'lucide-react';

interface VideosSectionProps {
  videos: VideoItem[];
  language: Language;
}

export const VideosSection: React.FC<VideosSectionProps> = ({
  videos,
  language
}) => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [, setForceUpdate] = useState(0);
  const t = TRANSLATIONS[language];

  const handleVote = (e: React.MouseEvent, vidId: string, type: 'like' | 'dislike') => {
    e.stopPropagation();
    toggleVote('video', vidId, type);
    setForceUpdate(prev => prev + 1);
  };

  return (
    <section id="videos" className="py-14 sm:py-20 bg-white dark:bg-[#070D1E] transition-colors border-b border-slate-200 dark:border-blue-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 pb-4 border-b border-slate-200 dark:border-blue-950">
          <div className="flex items-center gap-2 text-blue-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Video className="w-4 h-4" />
            <span>{t.nav.videos}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.sections.videosTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {t.sections.videosSubtitle}
          </p>
        </div>

        {/* Video Grid */}
        {videos.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-[#0B172E] rounded-3xl border border-dashed border-slate-200 dark:border-blue-900/40 space-y-2">
            <Video className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500 mb-2 opacity-70" />
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {language === 'ps'
                ? '«تر اوسه هېڅ محتوا نه ده خپره شوې»'
                : language === 'fa'
                ? '«تا هنوز هیچ محتوایی منتشر نشده است»'
                : '«No content has been published yet»'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ps'
                ? 'دا برخه د تعلیمي ویډیوګانو او سمینارونو خپرولو لپاره چمتو ده.'
                : language === 'fa'
                ? 'این بخش برای نشر ویدیوهای آموزشی و سمینارها آماده می‌باشد.'
                : 'Ready for educational lectures, webinars, and technical video sessions.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {videos.map(video => {
            const userVote = getUserVote(video.id);
            return (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group flex flex-col justify-between rounded-3xl bg-slate-50 dark:bg-[#0B172E] border border-slate-200/90 dark:border-blue-900/50 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer"
              >
                <div>
                  {/* Thumbnail with Play Overlay */}
                  <div className="relative h-48 bg-slate-950 overflow-hidden">
                    <img
                      src={video.thumbnail || DEFAULT_HERO_BANNER}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e: any) => {
                        e.target.src = DEFAULT_HERO_BANNER;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-mono flex items-center gap-1 backdrop-blur-sm">
                      <Clock className="w-3 h-3" />
                      <span>{video.duration}</span>
                    </span>
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold uppercase">
                      {video.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{video.publishedAt}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{video.views}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {video.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-5 pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => handleVote(e, video.id, 'like')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition ${
                        userVote === 'like'
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold'
                          : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{video.likes}</span>
                    </button>
                    <button
                      onClick={e => handleVote(e, video.id, 'dislike')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition ${
                        userVote === 'dislike'
                          ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 font-bold'
                          : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                      <span>{video.dislikes}</span>
                    </button>
                  </div>

                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <span>{language === 'ps' ? 'کتل' : 'Watch'}</span>
                    <Play className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
              <h4 className="text-sm font-bold text-white line-clamp-1">
                {activeVideo.title}
              </h4>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black flex items-center justify-center">
              {activeVideo.videoUrl.includes('youtube.com') || activeVideo.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={activeVideo.videoUrl.replace('watch?v=', 'embed/')}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  className="w-full h-full"
                  poster={activeVideo.thumbnail}
                >
                  Your browser does not support HTML5 video.
                </video>
              )}
            </div>

            <div className="p-6 space-y-2 bg-slate-900">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{activeVideo.category}</span>
                <span>{activeVideo.duration}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
