import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language, Post, SiteSettings } from '../types';
import { DEFAULT_HERO_BANNER } from '../assets/images';
import {
  Search,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Users,
  Layers,
  Bell
} from 'lucide-react';

interface HeroProps {
  language: Language;
  featuredPosts: Post[];
  siteSettings: SiteSettings;
  onNavigate: (section: string) => void;
  onSelectPost: (post: Post) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalBooks?: number;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  featuredPosts,
  siteSettings,
  onNavigate,
  onSelectPost,
  searchQuery,
  onSearchChange,
  totalBooks = 0
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language !== 'en';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const currentFeatured = featuredPosts.find(p => p.featured) || featuredPosts[0];

  return (
    <section className="relative overflow-hidden pt-6 pb-12 lg:pt-10 lg:pb-16 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 dark:from-[#070D1E] dark:via-[#091329] dark:to-[#070D1E]">
      {/* Background Decorative Polygons & Light Rings */}
      <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.2),transparent)] pointer-events-none" />
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Emergency Alert / Announcement Ticker */}
        {siteSettings.emergencyAlert && siteSettings.emergencyAlertActive && (
          <div className="mb-6 flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-md border border-blue-400/30">
            <div className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300 shrink-0">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <p className="text-xs sm:text-sm font-medium line-clamp-1 flex-1">
              {siteSettings.emergencyAlert}
            </p>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs font-bold text-amber-300 hover:text-amber-200 shrink-0 underline ml-2"
            >
              {language === 'ps' ? 'کتل' : language === 'fa' ? 'مشاهده' : 'View'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
              <span className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                {language === 'ps'
                  ? 'د پوهې او معاصرو ټیکنالوژیو رسمي علمي مرکز'
                  : language === 'fa'
                  ? 'مرکز رسمی پژوهش‌های نوین، داده و ادبیات'
                  : 'Official Multilingual Knowledge & Research Hub'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2]">
              {language === 'ps' ? (
                <>
                  د پوهې، افغان ادب او <span className="text-blue-600 dark:text-blue-400 underline decoration-amber-400 decoration-wavy decoration-2">ډیټابیس ټیکنالوژۍ</span> خزانه
                </>
              ) : language === 'fa' ? (
                <>
                  گنجینه دانش، ادبیات کهن و <span className="text-blue-600 dark:text-blue-400 underline decoration-amber-400 decoration-wavy decoration-2">فناوری پایگاه‌های داده</span>
                </>
              ) : (
                <>
                  Empowering Wisdom, Afghan Literature &amp; <span className="text-blue-600 dark:text-blue-400 underline decoration-amber-400 decoration-wavy decoration-2">Modern Cloud Systems</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {language === 'ps'
                ? 'د انصاري علمي پورتال د حضرت شاه انصاري له لوري رامنځته شوی ترڅو وړیا ډیجیټل کتابونه، مستند افغان خبرونه، کلاسیک شعرونه، او د لوړ ظرفیت کلاوډ ډیټابیسونو د معمارۍ نمونې ټولنې ته وړاندې کړي.'
                : language === 'fa'
                ? 'پورتال دانش انصاری تاسیس شده توسط حضرت شاه انصاری با هدف دسترسی همگانی به کتابخانه دیجیتال رایگان، اخبار تایید شده، شعر و ادب کهن، و الگوهای پیشرفته مهندسی پایگاه‌های داده کلاود.'
                : 'Ansary Knowledge is an official open repository providing peer-reviewed digital books, verified news, classical poetry, and enterprise distributed database architectures.'}
            </p>

            {/* Omnipresent Search Bar */}
            <div className="relative max-w-xl">
              <div className="flex items-center rounded-2xl border-2 border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-900 shadow-lg shadow-blue-500/5 focus-within:border-blue-500 transition-all overflow-hidden p-1.5">
                <div className="px-3 text-blue-600 dark:text-blue-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  placeholder={(t.actions as any)?.searchPlaceholder || 'Search library, articles, poetry...'}
                  className="w-full bg-transparent text-sm py-2 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
                <button
                  onClick={() => onNavigate('library')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shrink-0"
                >
                  {language === 'ps' ? 'پلټنه' : language === 'fa' ? 'جستجو' : 'Search'}
                </button>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('library')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all hover:translate-y-[-1px]"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.nav.library}</span>
                <ArrowIcon className="w-3.5 h-3.5 opacity-80" />
              </button>

              <button
                onClick={() => onNavigate('research')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 text-blue-700 dark:text-blue-300 text-xs font-bold transition"
              >
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                <span>{(t.nav as any).research || 'Research Papers'}</span>
              </button>

              <button
                onClick={() => onNavigate('projects')}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 text-xs font-medium transition"
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>{t.nav.projects}</span>
              </button>
            </div>
          </div>

          {/* Featured Spotlight Card or Empty State */}
          <div className="lg:col-span-5">
            {currentFeatured ? (
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#0C1A32] border border-blue-100 dark:border-blue-900/60 shadow-xl shadow-blue-500/5 group hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                {/* Image / Banner */}
                <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-900">
                  <img
                    src={currentFeatured.coverImage || DEFAULT_HERO_BANNER}
                    alt={currentFeatured.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e: any) => {
                      e.target.src = DEFAULT_HERO_BANNER;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-md">
                    ★ {language === 'ps' ? 'ځانګړې خپرونه' : language === 'fa' ? 'برگزیده' : 'Featured Publication'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{currentFeatured.date}</span>
                    <span className="font-semibold text-blue-600 dark:text-amber-400">
                      {currentFeatured.author}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {currentFeatured.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {currentFeatured.excerpt}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => onSelectPost(currentFeatured)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 transition"
                    >
                      <span>{(t.actions as any)?.readOnline || 'Read Full Publication'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-slate-400">
                      {currentFeatured.views} {language === 'ps' ? 'کتنې' : 'views'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#0C1A32] border border-blue-100 dark:border-blue-900/60 p-8 shadow-xl shadow-blue-500/5 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {language === 'ps' ? 'د انصاري علمي خزانه چمتو ده' : language === 'fa' ? 'پورتال دانش انصاری آماده است' : 'Ansary Knowledge Ready'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                  {language === 'ps'
                    ? 'دا برخه د لومړنۍ اصلي خپرونې لپاره چمتو ده. د اډمین پینل له لارې نوی خبر یا مقاله خپره کړئ.'
                    : 'Ready for new verified publications. Dispatch your first publication via the Management Portal.'}
                </p>
                <button
                  onClick={() => onNavigate('library')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{t.nav.library}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Metrics Row (Dynamically Calculated from Real Data) */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-blue-950/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
              {featuredPosts.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'ps' ? 'علمي او تخصصي خپرونې' : language === 'fa' ? 'مقالات و نشریات تخصصی' : 'Publications & News'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-amber-400 font-mono">
              {totalBooks}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'ps' ? 'وړیا ډیجیټل کتابونه' : language === 'fa' ? 'کتب دیجیتال رایگان' : 'Free Digital Books'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">100%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'ps' ? 'خپلواک او مستند محتوا' : language === 'fa' ? 'محتوای موثق و تایید شده' : 'Verified Open Access'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-300 font-mono">3 ژبې</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'ps' ? 'پښتو، دري او انګلیسي' : language === 'fa' ? 'پشتو، دری و انگلیسی' : 'Pashto, Dari & English'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
