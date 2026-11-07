import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language, Post, CommentItem } from '../types';
import { DEFAULT_HERO_BANNER } from '../assets/images';
import { toggleVote, getUserVote, getComments, addComment } from '../lib/storage';
import { submitCommentToSupabase } from '../lib/supabase';
import {
  X,
  Calendar,
  User,
  Share2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  Eye,
  Type,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
  language: Language;
}

export const PostModal: React.FC<PostModalProps> = ({
  post,
  onClose,
  language
}) => {
  if (!post) return null;

  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [, setForceUpdate] = useState(0);

  const t = TRANSLATIONS[language];
  const userVote = getUserVote(post.id);

  // Filter comments for this post
  const comments = getComments().filter(
    c => c.targetId === post.id && (c.status === 'approved' || c.status === 'pending')
  );

  const handleVote = (type: 'like' | 'dislike') => {
    toggleVote('post', post.id, type);
    setForceUpdate(prev => prev + 1);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    // 1. Save locally in localStorage
    addComment({
      targetId: post.id,
      targetType: 'post',
      authorName: commentName.trim(),
      authorEmail: commentEmail.trim() || undefined,
      content: commentText.trim()
    });

    // 2. Submit to Supabase table 'comments' (non-blocking)
    submitCommentToSupabase({
      target_id: post.id,
      target_type: 'post',
      author_name: commentName.trim(),
      author_email: commentEmail.trim() || undefined,
      content: commentText.trim()
    }).catch(err => console.warn('Supabase comment submit notice:', err));

    setCommentSuccess(true);
    setCommentName('');
    setCommentEmail('');
    setCommentText('');
    setForceUpdate(prev => prev + 1);

    setTimeout(() => setCommentSuccess(false), 5000);
  };

  const fontSizeClasses = {
    sm: 'text-xs sm:text-sm leading-relaxed',
    base: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-loose',
    xl: 'text-lg sm:text-xl leading-loose font-medium'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto bg-white dark:bg-[#0B172E] rounded-3xl shadow-2xl border border-slate-200 dark:border-blue-900/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white/95 dark:bg-[#0B172E]/95 backdrop-blur-md border-b border-slate-200 dark:border-blue-950">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase">
              {post.category}
            </span>
            <span className="text-xs text-slate-400">
              {post.date}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Font Resizing */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 rounded-lg font-bold ${fontSize === 'sm' ? 'bg-white dark:bg-slate-700 text-blue-600' : 'text-slate-500'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 rounded-lg font-bold ${fontSize === 'base' ? 'bg-white dark:bg-slate-700 text-blue-600' : 'text-slate-500'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded-lg font-bold ${fontSize === 'lg' ? 'bg-white dark:bg-slate-700 text-blue-600' : 'text-slate-500'}`}
              >
                A+
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="rounded-2xl overflow-hidden max-h-72 bg-slate-900">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.target.src = DEFAULT_HERO_BANNER;
                }}
              />
            </div>
          )}

          {/* Title & Author Meta */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-blue-950">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-blue-600 dark:text-amber-400 font-semibold">
                  <User className="w-3.5 h-3.5" />
                  <span>{post.author}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{post.date}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{post.views} views</span>
                </span>
              </div>
            </div>
          </div>

          {/* Full Article Content */}
          <div className={`text-slate-700 dark:text-slate-200 whitespace-pre-line ${fontSizeClasses[fontSize]}`}>
            {post.content}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-blue-950">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Voting Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">
                {language === 'ps' ? 'ستاسو رایه:' : 'Your Opinion:'}
              </span>
              <button
                onClick={() => handleVote('like')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  userVote === 'like'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes}</span>
              </button>
              <button
                onClick={() => handleVote('dislike')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  userVote === 'dislike'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>{post.dislikes}</span>
              </button>
            </div>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert(language === 'ps' ? 'لینک کاپي شو' : 'Link copied!');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{language === 'ps' ? 'شریکول' : 'Share'}</span>
            </button>
          </div>

          {/* Interactive Comments Section */}
          <div className="pt-6 border-t border-slate-200 dark:border-blue-950 space-y-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-amber-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'ps' ? 'د لوستونکو نظرونه او نظریات' : language === 'fa' ? 'دیدگاه‌ها و نظرات کاربران' : 'Community Discussion'} ({comments.length})
              </h3>
            </div>

            {/* Comment Form */}
            {commentSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  {language === 'ps'
                    ? 'ستاسو نظر په بریا سره ثبت شو او د ادارې له تایید وروسته به دلته ښکاره شي.'
                    : 'Your comment has been submitted and is pending moderation.'}
                </span>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={commentName}
                    onChange={e => setCommentName(e.target.value)}
                    placeholder={language === 'ps' ? 'ستاسو نوم *' : 'Your Name *'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                  <input
                    type="email"
                    value={commentEmail}
                    onChange={e => setCommentEmail(e.target.value)}
                    placeholder={language === 'ps' ? 'برېښنالیک (اختیاري)' : 'Email (optional)'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>

                <textarea
                  required
                  rows={3}
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder={language === 'ps' ? 'خپل علمي نظر دلته ولیکئ...' : 'Write your comment or reflection...'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    {language === 'ps' ? 'نظرونه د ادارې لخوا بررسي کېږي.' : 'Comments are subject to moderation.'}
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'ps' ? 'نظر ثبت کړئ' : 'Submit Comment'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map(c => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {c.authorName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {c.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {c.content}
                  </p>
                  {c.status === 'pending' && (
                    <span className="inline-block text-[10px] text-amber-500 font-semibold">
                      (Pending admin approval)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
