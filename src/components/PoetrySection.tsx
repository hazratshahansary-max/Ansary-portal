import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language, PoetryItem } from '../types';
import { toggleVote, getUserVote } from '../lib/storage';
import {
  Feather,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Copy,
  Check,
  Music,
  BookMarked,
  Sparkles
} from 'lucide-react';

interface PoetrySectionProps {
  poetryList: PoetryItem[];
  language: Language;
  searchFilter?: string;
}

export const PoetrySection: React.FC<PoetrySectionProps> = ({
  poetryList,
  language,
  searchFilter = ''
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [, setForceUpdate] = useState(0);
  const t = TRANSLATIONS[language];

  const filteredPoetry = poetryList.filter(p => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.poet.toLowerCase().includes(q) ||
      p.verses.some(v => v.line1.toLowerCase().includes(q) || v.line2.toLowerCase().includes(q))
    );
  });

  const handleCopy = (item: PoetryItem) => {
    const text = `${item.title} - ${item.poet}\n\n` +
      item.verses.map(v => `${v.line1}  /  ${v.line2}`).join('\n') +
      `\n\n— د انصاري پوهې ادبي خزانه (Ansary Knowledge)`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleVote = (itemId: string, type: 'like' | 'dislike') => {
    toggleVote('poetry', itemId, type);
    setForceUpdate(prev => prev + 1);
  };

  return (
    <section id="poetry" className="py-14 sm:py-20 bg-slate-50 dark:bg-[#060B18] transition-colors border-b border-slate-200 dark:border-blue-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 pb-4 border-b border-slate-200 dark:border-blue-950 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Feather className="w-4 h-4" />
              <span>{t.nav.poetry}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t.sections.poetryTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {t.sections.poetrySubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-800/60">
              ✦ {language === 'ps' ? 'اصیل افغان او خراساني ادب' : 'Afghan & Classical Heritage'}
            </span>
          </div>
        </div>

        {/* Poetry Grid */}
        {filteredPoetry.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0B172E] rounded-3xl border border-dashed border-slate-200 dark:border-blue-900/40 space-y-2">
            <Feather className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500 mb-2 opacity-70" />
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {language === 'ps'
                ? '«تر اوسه هېڅ محتوا نه ده خپره شوې»'
                : language === 'fa'
                ? '«تا هنوز هیچ محتوایی منتشر نشده است»'
                : '«No content has been published yet»'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ps'
                ? 'د اډمین پینل له لارې نوی شعر یا ادبي منظومه خپره کړئ.'
                : language === 'fa'
                ? 'از طریق پنل مدیریت می‌توانید شعر جدید یا منظومه ادبی ثبت کنید.'
                : 'Publish new poetry or literary verses via the Admin Panel.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredPoetry.map(poem => {
            const userVote = getUserVote(poem.id);
            return (
              <div
                key={poem.id}
                className="rounded-3xl bg-white dark:bg-[#0B172E] border border-slate-200/90 dark:border-blue-900/50 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Header info */}
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-blue-950 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase">
                          {poem.genre}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {poem.era}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {poem.title}
                      </h3>
                      <p className="text-xs text-blue-600 dark:text-amber-400 font-semibold mt-0.5">
                        {poem.poet}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(poem)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 transition shrink-0"
                      title="Copy Verses"
                    >
                      {copiedId === poem.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Stanzas Display with Calligraphic Styling */}
                  <div className="space-y-4 py-2">
                    {poem.verses.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 text-center space-y-1.5 font-arabic text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-loose"
                      >
                        <p className="font-medium text-slate-900 dark:text-amber-100">{v.line1}</p>
                        <p className="font-medium text-blue-700 dark:text-blue-300">{v.line2}</p>
                      </div>
                    ))}
                  </div>

                  {/* Explanation commentary */}
                  {poem.explanation && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 italic bg-blue-50/50 dark:bg-blue-950/30 p-3 rounded-xl border-l-2 border-l-blue-500">
                      <span className="font-bold not-italic text-slate-700 dark:text-slate-300 mr-1">
                        {language === 'ps' ? 'توضېح:' : 'Note:'}
                      </span>
                      {poem.explanation}
                    </div>
                  )}
                </div>

                {/* Footer votes */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-blue-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(poem.id, 'like')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition ${
                        userVote === 'like'
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold'
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{poem.likes}</span>
                    </button>
                    <button
                      onClick={() => handleVote(poem.id, 'dislike')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition ${
                        userVote === 'dislike'
                          ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 font-bold'
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{poem.dislikes}</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {poem.language.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </section>
  );
};
