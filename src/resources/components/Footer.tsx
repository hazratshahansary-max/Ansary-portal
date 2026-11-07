import React from 'react';
import { Language, ActiveTab } from '../types';
import { translations } from '../data/translations';
import { Sparkles, Heart, ShieldCheck, Download, BookOpen, Link as LinkIcon } from 'lucide-react';
import { exportAllDataJSON } from '../lib/storage';

interface FooterProps {
  currentLang: Language;
  onTabChange: (tab: ActiveTab) => void;
  promptsCount: number;
  linksCount: number;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onTabChange,
  promptsCount,
  linksCount
}) => {
  const t = translations[currentLang];

  const handleDownloadBackup = () => {
    try {
      const json = exportAllDataJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ansary_knowledge_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Backup export failed', err);
    }
  };

  return (
    <footer className="mt-16 bg-slate-950 border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {t.appName}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg">
              {t.footerText}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400/90 pt-1">
              <ShieldCheck className="h-4 w-4" />
              <span>خوندي سیمه‌ییزه زېرمه (Offline First & Fast Local Storage)</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              ګړندي لینکونه
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onTabChange('prompts')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{t.promptsTab} ({promptsCount})</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('links')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span>{t.linksTab} ({linksCount})</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('favorites')}
                  className="hover:text-amber-400 transition-colors"
                >
                  {t.favoritesTab}
                </button>
              </li>
            </ul>
          </div>

          {/* Backup & Management */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              د معلوماتو ساتنه
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ستاسو ټول فرامپټونه او خوښ شوي مطالب په براوزر کې خوندي دي.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleDownloadBackup}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              >
                <Download className="h-3.5 w-3.5 text-amber-400" />
                <span>{t.exportData}</span>
              </button>
              <a
                href="/ansary_knowledge_source.zip"
                download="ansary_knowledge_source.zip"
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all"
              >
                <Download className="h-3.5 w-3.5 text-amber-400" />
                <span>Source ZIP</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{t.footerRights}</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>جوړ شوی په مینه د پوهې مینه والو لپاره</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
