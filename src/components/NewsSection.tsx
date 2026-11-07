import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language, Post } from '../types';
import { DEFAULT_HERO_BANNER } from '../assets/images';
import { toggleVote, getUserVote } from '../lib/storage';
import {
  Newspaper,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  Filter,
  Eye
} from 'lucide-react';

interface NewsSectionProps {
  posts: Post[];
  language: Language;
  onSelectPost: (post: Post) => void;
  searchFilter?: string;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  posts,
  language,
  onSelectPost,
  searchFilter = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [, setForceUpdate] = useState(0);
  const t = TRANSLATIONS[language];
  const isRtl = language !== 'en';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const categories = [
    { id: 'all', label: (t.actions as any)?.all || 'All' },
    { id: 'domestic', label: t.newsCategories.domestic },
    { id: 'technology', label: t.newsCategories.technology },
    { id: 'sports', label: t.newsCategories.sports },
    { id: 'international', label: t.newsCategories.international },
    { id: 'education', label: t.newsCategories.education || 'Education' }
  ];

  const filteredPosts = posts
    .filter(p => p.type === 'news')
    .filter(p => (selectedCategory === 'all' ? true : p.category === selectedCategory))
    .filter(p => {
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(tag => tag.toLowerCase().includes(q))
      );
    });

  const handleVote = (e: React.MouseEvent, postId: string, type: 'like' | 'dislike') => {
    e.stopPropagation();
    toggleVote('post', postId, type);
    setForceUpdate(prev => prev + 1);
  };

  const handleShare = async (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(`${window.location.origin}#${post.id}`);
      alert(language === 'ps' ? 'د مقالې لینک کاپي شو!' : 'Link copied to clipboard!');
    }
  };

  return (
    <section id="news" className="py-14 sm:py-20 bg-white dark:bg-[#070D1E] transition-colors border-b border-slate-100 dark:border-blue-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-4 border-b border-slate-200 dark:border-blue-950">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Newspaper className="w-4 h-4" />
              <span>{t.nav.news}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t.sections.newsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {t.sections.newsSubtitle}
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-[#0A1428] rounded-3xl border border-dashed border-slate-200 dark:border-blue-900/40 space-y-2">
            <Newspaper className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500 mb-2 opacity-70" />
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {language === 'ps'
                ? '«تر اوسه هېڅ محتوا نه ده خپره شوې»'
                : language === 'fa'
                ? '«تا هنوز هیچ محتوایی منتشر نشده است»'
                : '«No content has been published yet»'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ps'
                ? 'د مدیریت له پینل څخه لومړنی خبر یا علمي اعلان خپور کړئ.'
                : language === 'fa'
                ? 'از طریق پنل مدیریت می‌توانید اولین خبر یا اطلاعیه را منتشر کنید.'
                : 'Publish the first news item or announcement via the Admin Panel.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map(post => {
              const userVote = getUserVote(post.id);
              return (
                <article
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="group flex flex-col rounded-3xl bg-white dark:bg-[#0B172E] border border-slate-200/90 dark:border-blue-900/50 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  {/* Card Cover */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900">
                    <img
                      src={post.coverImage || DEFAULT_HERO_BANNER}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e: any) => {
                        e.target.src = DEFAULT_HERO_BANNER;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-blue-600/90 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
                      {(t.newsCategories as any)?.[post.category] || post.category}
                    </span>
                    <span className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] text-slate-300 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      <Eye className="w-3 h-3" />
                      <span>{post.views}</span>
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-amber-400">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-blue-950 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => handleVote(e, post.id, 'like')}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition ${
                            userVote === 'like'
                              ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold'
                              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title="Like"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{post.likes}</span>
                        </button>

                        <button
                          onClick={e => handleVote(e, post.id, 'dislike')}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition ${
                            userVote === 'dislike'
                              ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 font-bold'
                              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title="Dislike"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>{post.dislikes}</span>
                        </button>

                        <button
                          onClick={e => handleShare(e, post)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title="Share"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                        <span>{(t.actions as any)?.readOnline || 'Read'}</span>
                        <ArrowIcon className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
