import React from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language } from '../types';
import { DEFAULT_FOUNDER_PORTRAIT } from '../assets/images';
import {
  Info,
  Award,
  CheckCircle,
  Database,
  GraduationCap,
  Shield,
  Heart,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface AboutSectionProps {
  language: Language;
  onContactClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  language,
  onContactClick
}) => {
  const t = TRANSLATIONS[language];

  return (
    <section id="about" className="py-14 sm:py-20 bg-slate-50 dark:bg-[#060B18] transition-colors border-b border-slate-200 dark:border-blue-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 pb-4 border-b border-slate-200 dark:border-blue-950">
          <div className="flex items-center gap-2 text-blue-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Info className="w-4 h-4" />
            <span>{t.nav.about}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.sections.aboutTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {t.sections.aboutSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Founder Portrait Card */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-72 sm:w-80 rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border-2 border-blue-200 dark:border-blue-900/60 group">
              <img
                src={DEFAULT_FOUNDER_PORTRAIT}
                alt="Hazrat Shah Ansary"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-5 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent text-center space-y-1">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Hazrat Shah Ansary
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  {language === 'ps' ? 'اصلي جوړونکی او ډیټابیس آرکیټکټ' : 'Founder & Principal Architect'}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  hazrat.shah.ansary@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Bio & Academic Vision */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                {language === 'ps'
                  ? 'حضرت شاه انصاري د سافټویر او کلاوډ ډیټابیسونو متخصص، د افغان ادب او کلتوري میراث څېړونکی او د انصاري علمي شبکې (Ansary Knowledge) بنسټ ایښودونکی دی. د نوموړي هدف د هېواد د ځوانانو، محصلینو او استادانو لپاره د وړیا پوهې، معاصرو ټیکنالوژیو او ملي ادب یوه عصري باوري سرچینه رامنځته کول دي.'
                  : language === 'fa'
                  ? 'حضرت شاه انصاری، مهندس ارشد پایگاه‌های داده کلاود و کارشناس سامانه‌های توزیع‌شده، پژوهشگر شعر کهن و بنیان‌گذار پورتال دانش انصاری (Ansary Knowledge) می‌باشد. این مجموعه با تکیه بر اصول اخلاق علمی و دسترسی آزاد، در جهت نشر آثار ماندگار، مستندات نرم‌افزاری و میراث غنی خراسان و کابلستان فعالیت می‌کند.'
                  : 'Hazrat Shah Ansary is a Principal Database Architect, software engineer, cultural researcher, and the founder of Ansary Knowledge. His mission bridges enterprise distributed data engineering (PostgreSQL, TimescaleDB, Supabase) with classical Afghan, Pashto, and Persian literature, preserving heritage while equipping new generations with cutting-edge engineering skills.'}
              </p>

              <p>
                {language === 'ps'
                  ? 'د دغه پورتال ټول محتوا، ډیجیټل کتابتون، تحلیلي مقالې او د ډیټابیس د معمارۍ نمونې په خپلواکه او مسلکي توګه چمتو شوي او په وړیا ډول د ټولنې د پرمختګ لپاره وړاندې کېږي.'
                  : language === 'fa'
                  ? 'کلیه محتوا، مخزن کتب دیجیتال، مقالات تحلیلی و کدهای نمونه به صورت مستقل و حرفه‌ای فراهم شده و بدون هیچ‌گونه هزینه یا محدودیت در اختیار دانشجویان و پژوهشگران قرار می‌گیرد.'
                  : 'All publications, digitized manuscripts, open books, and database architecture blueprints across Ansary Knowledge are independently authored, verified, and distributed under open-access principles.'}
              </p>
            </div>

            {/* Core Competencies Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Database className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Distributed PostgreSQL &amp; Supabase
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Row-Level Security, multi-tenant isolation, real-time replication
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Literature &amp; Manuscript Archiving
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Pashto &amp; Persian classical poetry, semantic vector search
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Zero-Trust Architecture &amp; RLS
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Cryptographic audit logging, HIPAA &amp; enterprise compliance
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Modern PWA &amp; Full-Stack React
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Offline caching, service workers, bidirectional multilingual i18n
                  </p>
                </div>
              </div>
            </div>

            {/* Inquire Action */}
            <div className="pt-2">
              <button
                onClick={onContactClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>{language === 'ps' ? 'له استاد انصاري سره مستقیمه اړیکه' : language === 'fa' ? 'ارتباط مستقیم با استاد انصاری' : 'Get in Touch with Author'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
