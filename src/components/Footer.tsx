import React from 'react';
import { Language } from '../types';
import { translations } from '../lib/i18n';
import { Globe, Heart, Shield, Smartphone } from 'lucide-react';

interface Props {
  language: Language;
  onNavigate: (section: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<Props> = ({ language, onNavigate, onOpenAdmin }) => {
  const t = translations[language];

  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-[#050A18] border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-8 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B192C] to-[#102A4C] p-1.5 border border-amber-400/40 flex items-center justify-center">
                <img src="/icon.svg" alt="ANSARY Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-display text-xl font-bold tracking-wider text-white">
                ANSARY
              </span>
            </div>
            <p className="text-xs text-amber-400 font-medium">
              {t.slogan}
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              {language === 'ps'
                ? 'د پوهې، معاصرو ټیکنالوژیو، افغان ادب او خپلواکو خبرونو د خپرېدو او ډیجیټل کتابتون رسمي مرکز.'
                : language === 'fa'
                ? 'مرکز نشر دانش، مهندسی پایگاه‌های داده و کلاود، شعر و ادبیات کهن و اخبار موثق.'
                : 'Official multilingual knowledge repository, cloud database showcase, literature treasury, and progressive web application.'}
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {language === 'ps' ? 'اصلي برخې' : language === 'fa' ? 'بخش‌های اصلی' : 'Main Sections'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('news')} className="hover:text-amber-400 transition">
                  {t.nav.news}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('library')} className="hover:text-amber-400 transition">
                  {t.nav.library}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('poetry')} className="hover:text-amber-400 transition">
                  {t.nav.poetry}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('projects')} className="hover:text-amber-400 transition">
                  {t.nav.projects}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('articles')} className="hover:text-amber-400 transition">
                  {t.nav.articles}
                </button>
              </li>
            </ul>
          </div>

          {/* About & Admin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {language === 'ps' ? 'اړیکې او پینل' : language === 'fa' ? 'ارتباط و دسترسی' : 'Information'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-400 transition">
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-amber-400 transition">
                  {t.nav.contact}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('videos')} className="hover:text-amber-400 transition">
                  {t.nav.videos}
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold transition"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t.admin.dashboardTitle}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; 2026 ANSARY &middot; Hazrat Shah Ansary. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>PWA Enabled</span>
            <span>·</span>
            <span>RTL &amp; LTR Multilingual</span>
            <span>·</span>
            <span>Supabase Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
