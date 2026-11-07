import React from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language, Post } from '../types';
import { DEFAULT_HERO_BANNER } from '../assets/images';
import { FileText, Calendar, User, ArrowRight, ArrowLeft, BookOpen, Clock } from 'lucide-react';

interface ArticlesSectionProps {
  posts: Post[];
  language: Language;
  onSelectPost: (post: Post) => void;
  searchFilter?: string;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  posts,
  language,
  onSelectPost,
  searchFilter = ''
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language !== 'en';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const articlePosts = posts
    .filter(p => p.type === 'articles' || p.category === 'technology' || p.category === 'education')
    .filter(p => {
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(tag => tag.toLowerCase().includes(q))
      );
    });

  return (
    <section id="articles" className="py-14 sm:py-20 bg-slate-50 dark:bg-[#060B18] transition-colors border-b border-slate-200 dark:border-blue-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 pb-4 border-b border-slate-200 dark:border-blue-950">
          <div className="flex items-center gap-2 text-blue-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4" />
            <span>{t.nav.articles}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.sections.articlesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {t.sections.articlesSubtitle}
          </p>
        </div>

        {articlePosts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0B172E] rounded-3xl border border-dashed border-slate-200 dark:border-blue-900/40 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500 mb-2 opacity-70" />
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {language === 'ps'
                ? '«تر اوسه هېڅ محتوا نه ده خپره شوې»'
                : language === 'fa'
                ? '«تا هنوز هیچ محتوایی منتشر نشده است»'
                : '«No content has been published yet»'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ps'
                ? 'د مدیریت پینل له لارې نوې علمي او تخصصي مقاله خپره کړئ.'
                : language === 'fa'
                ? 'از طریق پنل مدیریت می‌توانید مقاله جدید علمی منتشر نمایید.'
                : 'Publish new specialized or analytical articles via the Admin Panel.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {articlePosts.map(post => (
            <article
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="group flex flex-col sm:flex-row gap-5 rounded-3xl bg-white dark:bg-[#0B172E] border border-slate-200/90 dark:border-blue-900/50 p-5 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer"
            >
              <div className="sm:w-44 h-40 rounded-2xl overflow-hidden shrink-0 bg-slate-900">
                <img
                  src={post.coverImage || DEFAULT_HERO_BANNER}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e: any) => {
                    e.target.src = DEFAULT_HERO_BANNER;
                  }}
                />
              </div>

              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </span>
                    <span>·</span>
                    <span className="text-blue-600 dark:text-amber-400 font-semibold">
                      {post.author}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {post.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                    <span>{(t.actions as any)?.readOnline || 'Read'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      </div>
    </section>
  );
};
