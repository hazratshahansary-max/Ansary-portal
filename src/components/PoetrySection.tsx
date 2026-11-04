import React, { useState } from 'react';
import { Poetry, Language } from '../types';
import { translations } from '../lib/i18n';
import { InteractionBar } from './InteractionBar';
import { Feather, Play, Pause, Volume2, Sparkles } from 'lucide-react';

interface Props {
  poetryList: Poetry[];
  language: Language;
}

export const PoetrySection: React.FC<Props> = ({ poetryList, language }) => {
  const t = translations[language];
  const [playingId, setPlayingId] = useState<string | null>(null);

  const toggleAudio = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  return (
    <section id="poetry" className="py-12 bg-slate-100/60 dark:bg-[#0A1226]/60 border-y border-slate-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">
            <Feather className="w-4 h-4" />
            <span>{language === 'ps' ? 'د شعر او ادب څانګه' : language === 'fa' ? 'ادبیات و شعر فاخر' : 'Poetic Heritage'}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t.sections.poetryHeritage}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            {t.sections.poetryHeritageSub}
          </p>
        </div>

        {/* Poetry Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {poetryList.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 p-6 sm:p-8 shadow-sm hover:shadow-lg transition relative overflow-hidden group"
            >
              {/* Subtle Calligraphic Flourish Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      <span className="text-blue-600 dark:text-amber-400 font-semibold">{item.poet}</span>
                      {item.era && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.era}</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="italic">{item.genre}</span>
                    </div>
                  </div>

                  {/* Audio Recitation button */}
                  <button
                    onClick={() => toggleAudio(item.id)}
                    className={`p-2.5 rounded-full border transition flex items-center justify-center ${
                      playingId === item.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Audio Recitation"
                  >
                    {playingId === item.id ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Recitation Banner when active */}
                {playingId === item.id && (
                  <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 animate-in fade-in">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>{language === 'ps' ? 'غږیزه دکلمه روانه ده...' : language === 'fa' ? 'در حال پخش دکلمه صوتی...' : 'Audio recitation playing...'}</span>
                    </span>
                    <span className="font-mono text-[11px]">01:45</span>
                  </div>
                )}

                {/* Classical Two-Hemistich Strophes (بیتونه) */}
                <div className="space-y-4 my-6 font-serif text-sm sm:text-base leading-loose text-slate-800 dark:text-slate-100 py-2">
                  {item.verses.map((verse, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-6 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 text-center items-center"
                    >
                      <div className="px-2 font-medium tracking-wide">
                        {verse.line1}
                      </div>
                      <div className="px-2 font-medium tracking-wide text-slate-700 dark:text-slate-300">
                        {verse.line2}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                {item.explanation && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 italic bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/80 mb-4">
                    {item.explanation}
                  </div>
                )}
              </div>

              {/* Working Interaction Bar */}
              <InteractionBar
                targetId={item.id}
                targetType="poetry"
                initialLikes={item.likes}
                initialDislikes={item.dislikes}
                itemTitle={item.title}
                language={language}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
