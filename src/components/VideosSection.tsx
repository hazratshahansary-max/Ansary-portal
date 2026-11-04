import React, { useState } from 'react';
import { VideoItem, Language } from '../types';
import { translations } from '../lib/i18n';
import { InteractionBar } from './InteractionBar';
import { Play, Eye, Calendar, Clock, X, Video } from 'lucide-react';

interface Props {
  videos: VideoItem[];
  language: Language;
}

export const VideosSection: React.FC<Props> = ({ videos, language }) => {
  const t = translations[language];
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <section id="videos" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {t.sections.featuredVideos}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          {t.sections.featuredVideosSub}
        </p>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition group"
          >
            <div>
              {/* Thumbnail with Play Overlay */}
              <div
                onClick={() => setActiveVideo(vid)}
                className="relative aspect-video bg-slate-950 cursor-pointer overflow-hidden"
              >
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{vid.duration}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mb-1.5">
                  <span>{vid.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Eye className="w-3 h-3" />
                    {vid.views}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{vid.publishedAt}</span>
                </div>

                <h3
                  onClick={() => setActiveVideo(vid)}
                  className="font-display text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-amber-400 transition cursor-pointer mb-2"
                >
                  {vid.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {vid.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <InteractionBar
                targetId={vid.id}
                targetType="video"
                initialLikes={vid.likes}
                initialDislikes={vid.dislikes}
                itemTitle={vid.title}
                language={language}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl relative text-left [dir=rtl]:text-right text-white">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-5 right-5 [dir=rtl]:right-auto [dir=rtl]:left-5 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Frame */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black mb-6 shadow-inner border border-slate-800">
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 to-[#070D1E]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-amber-500 flex items-center justify-center text-white mb-4 shadow-xl">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <h4 className="text-base font-bold text-white max-w-lg mb-2">
                  {activeVideo.title}
                </h4>
                <p className="text-xs text-slate-400 max-w-md">
                  {activeVideo.description}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={activeVideo.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                  >
                    {language === 'ps' ? 'په یوټیوب کې کتل' : language === 'fa' ? 'تماشا در یوتیوب' : 'Open Video Stream'}
                  </a>
                </div>
              </div>
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-2">
              {activeVideo.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              {activeVideo.description}
            </p>

            <InteractionBar
              targetId={activeVideo.id}
              targetType="video"
              initialLikes={activeVideo.likes}
              initialDislikes={activeVideo.dislikes}
              itemTitle={activeVideo.title}
              language={language}
            />
          </div>
        </div>
      )}
    </section>
  );
};
