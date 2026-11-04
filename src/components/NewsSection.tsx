import React, { useState } from 'react';
import { Post, NewsCategory, Language } from '../types';
import { translations } from '../lib/i18n';
import { InteractionBar } from './InteractionBar';
import { Search, Eye, Calendar, ArrowRight, User } from 'lucide-react';

interface Props {
  posts: Post[];
  language: Language;
  onSelectPost: (post: Post) => void;
  sectionType?: 'news' | 'articles';
}

export const NewsSection: React.FC<Props> = ({
  posts,
  language,
  onSelectPost,
  sectionType = 'news',
}) => {
  const t = translations[language];

  const [activeCategory, setActiveCategory] = useState<NewsCategory | 'all'>('all');
  const [langFilter, setLangFilter] = useState<Language | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter((post) => {
    // Match section type
    if (sectionType === 'articles' && post.type !== 'article') return false;
    if (sectionType === 'news' && post.type !== 'news') return false;

    // Filter category
    if (activeCategory !== 'all' && post.category !== activeCategory) return false;

    // Filter language
    if (langFilter !== 'all' && post.language !== langFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt.toLowerCase().includes(q);
      const matchTags = post.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchExcerpt && !matchTags) return false;
    }

    return true;
  });

  const categories: Array<{ id: NewsCategory | 'all'; label: string }> = [
    { id: 'all', label: t.newsCategories.all },
    { id: 'sports', label: t.newsCategories.sports },
    { id: 'domestic', label: t.newsCategories.domestic },
    { id: 'international', label: t.newsCategories.international },
    { id: 'announcements', label: t.newsCategories.announcements },
  ];

  return (
    <section id={sectionType} className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {sectionType === 'news' ? t.sections.latestNews : t.sections.educationalArticles}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {sectionType === 'news' ? t.sections.latestNewsSub : t.sections.educationalArticlesSub}
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.actions.search}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 rtl:left-auto rtl:right-3" />
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        {/* News Categories Segmented Tabs */}
        {sectionType === 'news' && (
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-white dark:bg-blue-600 text-slate-950 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Language Filter */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 font-medium mr-1">{t.actions.filterByLanguage}:</span>
          {(['all', 'ps', 'fa', 'en'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLangFilter(lang)}
              className={`px-2.5 py-1 rounded-md uppercase font-mono text-[11px] font-semibold transition ${
                langFilter === lang
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {lang === 'all' ? t.actions.allLanguages : lang}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Cards Grid */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500">
            {language === 'ps'
              ? 'په دې برخه کې کوم مواد ونه موندل شول.'
              : language === 'fa'
              ? 'مطلبی در این دسته یافت نشد.'
              : 'No articles found matching the selected criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md transition duration-200 overflow-hidden group"
            >
              {/* Cover Image */}
              {post.coverImage && (
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 [dir=rtl]:right-auto [dir=rtl]:left-3 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono uppercase text-amber-300 border border-amber-400/30">
                    {post.language}
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Clean unboxed metadata with separators (anti-pill) */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-2.5 font-medium">
                    <span className="capitalize">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Eye className="w-3 h-3" />
                      {post.views}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onSelectPost(post)}
                    className="font-display text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-amber-400 transition cursor-pointer line-clamp-2 leading-snug mb-2"
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div>
                  {/* Author line & Read full link */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      <span>{post.author}</span>
                    </span>
                    <button
                      onClick={() => onSelectPost(post)}
                      className="font-semibold text-blue-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>{t.actions.readMore}</span>
                      <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                    </button>
                  </div>

                  {/* Working Interaction Bar */}
                  <InteractionBar
                    targetId={post.id}
                    targetType="post"
                    initialLikes={post.likes}
                    initialDislikes={post.dislikes}
                    itemTitle={post.title}
                    language={language}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
