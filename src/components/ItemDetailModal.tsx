import React from 'react';
import { Post, Language } from '../types';
import { translations } from '../lib/i18n';
import { InteractionBar } from './InteractionBar';
import { X, Calendar, User, Eye, Tag } from 'lucide-react';

interface Props {
  post: Post | null;
  onClose: () => void;
  language: Language;
}

export const ItemDetailModal: React.FC<Props> = ({ post, onClose, language }) => {
  const t = translations[language];

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-left [dir=rtl]:text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 [dir=rtl]:right-auto [dir=rtl]:left-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Photo */}
        {post.coverImage && (
          <div className="relative aspect-[21/9] sm:aspect-[21/8] overflow-hidden bg-slate-950">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-10">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">
            <span className="uppercase font-mono text-amber-600 dark:text-amber-400 font-bold">
              {post.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono">
              <Eye className="w-3.5 h-3.5" />
              {post.views}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {post.author}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 border-s-4 border-amber-500 ps-4 py-1 italic mb-8">
            {post.excerpt}
          </p>

          {/* Prose Content */}
          <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 font-serif space-y-4 mb-8 whitespace-pre-line">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Universal Interaction Bar */}
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
    </div>
  );
};
