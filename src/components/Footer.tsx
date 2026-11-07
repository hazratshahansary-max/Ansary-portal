import React from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language } from '../types';
import { Shield, Sparkles, BookOpen, Layers, Feather, GraduationCap, Video, FileText, Mail, Info } from 'lucide-react';

interface FooterProps {
  language: Language;
  onNavigate: (section: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onNavigate,
  onOpenAdmin
}) => {
  const t = TRANSLATIONS[language];

  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-[#050A18] border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-8 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-950 p-1.5 border border-amber-400/40 flex items-center justify-center">
                <img src="/icon.svg" alt="Ansary Knowledge" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-wider text-white">
                  {t.brandName}
                </span>
                <span className="block text-[10px] text-amber-400 font-medium">
                  {t.slogan}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              {language === 'ps'
                ? 'د پوهې، معاصرو ټیکنالوژیو، افغان ادب او خپلواکو خبرونو د خپرېدو او ډیجیټل کتابتون رسمي مرکز چې د حضرت شاه انصاري له لوري پرمخ وړل کېږي.'
                : language === 'fa'
                ? 'مرکز نشر دانش، مهندسی پایگاه‌های داده و کلاود، شعر و ادبیات کهن و اخبار موثق تحت نظارت حضرت شاه انصاری.'
                : 'Official multilingual knowledge repository, cloud database architecture showcase, literature treasury, and progressive web application.'}
            </p>
          </div>

          {/* Core Sections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {language === 'ps' ? 'اصلي برخې' : language === 'fa' ? 'بخش‌های اصلی' : 'Main Sections'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('news')} className="hover:text-blue-400 transition">
                  {t.nav.news}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('library')} className="hover:text-blue-400 transition">
                  {t.nav.library}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('research')} className="hover:text-blue-400 transition">
                  {(t.nav as any).research || 'Research Papers'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('poetry')} className="hover:text-blue-400 transition">
                  {t.nav.poetry}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('projects')} className="hover:text-blue-400 transition">
                  {t.nav.projects}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Admin Portal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {language === 'ps' ? 'اړیکې او پینل' : language === 'fa' ? 'ارتباط و دسترسی' : 'Information'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-blue-400 transition">
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition">
                  {t.nav.contact}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('videos')} className="hover:text-blue-400 transition">
                  {t.nav.videos}
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-300 hover:text-white font-semibold transition border border-blue-700/50"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t.admin.dashboardTitle || 'Admin Portal'}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Ansary Knowledge · Hazrat Shah Ansary. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              PWA Online
            </span>
            <span>·</span>
            <span>RTL &amp; LTR Multilingual</span>
            <span>·</span>
            <span className="text-blue-400 font-mono">Supabase Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
