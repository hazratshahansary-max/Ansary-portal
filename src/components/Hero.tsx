import React from 'react';
import { Language, Post } from '../types';
import { translations } from '../lib/i18n';
import { PWAInstallButton } from './PWAInstallButton';
import { ArrowRight, BookOpen, Newspaper, FolderGit2, Feather, Flame } from 'lucide-react';

interface Props {
  language: Language;
  featuredPosts: Post[];
  onNavigate: (section: string) => void;
  onSelectPost: (post: Post) => void;
}

export const Hero: React.FC<Props> = ({
  language,
  featuredPosts,
  onNavigate,
  onSelectPost,
}) => {
  const t = translations[language];

  const leadPost = featuredPosts[0] || null;

  return (
    <section className="relative overflow-hidden pt-6 pb-12">
      {/* Editorial Headline & Marquee Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* News Ticker */}
        {leadPost && (
          <div className="mb-6 flex items-center gap-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl px-4 py-2 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-amber-400 shrink-0">
              <Flame className="w-3.5 h-3.5" />
              <span>{language === 'ps' ? 'تازه خبر:' : language === 'fa' ? 'خبر فوری:' : 'Breaking:'}</span>
            </span>
            <button
              onClick={() => onSelectPost(leadPost)}
              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-amber-300 font-medium truncate text-left [dir=rtl]:text-right transition"
            >
              {leadPost.title}
            </button>
            <span className="text-slate-400 font-mono text-[11px] shrink-0 hidden sm:inline">
              {leadPost.date}
            </span>
          </div>
        )}

        {/* 2-Column Split Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          {/* Main Visual & Lead Story (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl relative min-h-[420px] group">
            {/* Background High-Fidelity Hero Image */}
            <img
              src="/src/assets/images/ansary_hero_banner_1793805838021.jpg"
              alt="ANSARY Hero Banner"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />

            {/* Content atop image */}
            <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-end h-full mt-auto">
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-3">
                <span>{t.brandName}</span>
                <span aria-hidden="true">·</span>
                <span>{t.slogan}</span>
                <span aria-hidden="true">·</span>
                <span>2026</span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight text-balance mb-4">
                {leadPost ? leadPost.title : 'ANSARY: Knowledge, Literature, Technology & News'}
              </h1>

              <p className="text-sm text-slate-200 line-clamp-3 leading-relaxed mb-6 max-w-2xl">
                {leadPost ? leadPost.excerpt : t.sections.latestNewsSub}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {leadPost && (
                  <button
                    onClick={() => onSelectPost(leadPost)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition active:scale-95"
                  >
                    <span>{t.actions.readMore}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                )}
                <button
                  onClick={() => onNavigate('projects')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-md border border-white/20 transition active:scale-95"
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>{t.nav.projects}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Curated Features (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            {/* Quick Pillars Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('news')}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-amber-400 transition text-left [dir=rtl]:text-right group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                  <Newspaper className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {t.nav.news}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {t.sections.latestNewsSub}
                </p>
              </button>

              <button
                onClick={() => onNavigate('library')}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-amber-400 transition text-left [dir=rtl]:text-right group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {t.nav.library}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {t.sections.booksLibrarySub}
                </p>
              </button>

              <button
                onClick={() => onNavigate('poetry')}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-amber-400 transition text-left [dir=rtl]:text-right group"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3 group-hover:scale-110 transition-transform">
                  <Feather className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {t.nav.poetry}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {t.sections.poetryHeritageSub}
                </p>
              </button>

              <button
                onClick={() => onNavigate('projects')}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-amber-400 transition text-left [dir=rtl]:text-right group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {t.nav.projects}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {t.sections.ourProjectsSub}
                </p>
              </button>
            </div>

            {/* PWA Feature card */}
            <PWAInstallButton language={language} variant="banner" />
          </div>
        </div>
      </div>
    </section>
  );
};
