import React, { useState, useEffect } from 'react';
import { Language, Comment } from '../types';
import { translations } from '../lib/i18n';
import {
  getUserVote,
  toggleVote,
  getApprovedComments,
  addComment,
} from '../lib/storage';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Check,
  Send,
  ShieldCheck,
  User,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  targetId: string;
  targetType: 'post' | 'book' | 'poetry' | 'video' | 'project';
  initialLikes: number;
  initialDislikes: number;
  itemTitle: string;
  language: Language;
}

export const InteractionBar: React.FC<Props> = ({
  targetId,
  targetType,
  initialLikes,
  initialDislikes,
  itemTitle,
  language,
}) => {
  const t = translations[language];

  const [vote, setVote] = useState<'like' | 'dislike' | null>(() => getUserVote(targetId));
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(() => getApprovedComments(targetId));
  const [copied, setCopied] = useState(false);

  // Comment Form State
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [mathA, setMathA] = useState(() => Math.floor(Math.random() * 8) + 2);
  const [mathB, setMathB] = useState(() => Math.floor(Math.random() * 8) + 1);
  const [mathAnswer, setMathAnswer] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    setVote(getUserVote(targetId));
    setComments(getApprovedComments(targetId));
  }, [targetId]);

  const handleVote = (type: 'like' | 'dislike') => {
    const result = toggleVote(targetType, targetId, type);
    setVote(result.liked ? 'like' : result.disliked ? 'dislike' : null);
    setLikes(result.newLikes);
    setDislikes(result.newDislikes);

    if (result.liked && type === 'like') {
      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#D4AF37', '#2563EB', '#60A5FA'],
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${itemTitle} | ANSARY`,
      text: `${itemTitle} - ANSARY Portal`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // user cancelled or fallback
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      alert(window.location.href);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!authorName.trim()) {
      setFormError('Please enter your name');
      return;
    }
    if (!commentContent.trim()) {
      setFormError('Please enter your comment');
      return;
    }

    // Verify spam question
    if (parseInt(mathAnswer.trim(), 10) !== mathA + mathB) {
      setFormError(t.comments.spamError);
      return;
    }

    const newComment = addComment({
      targetId,
      targetType,
      authorName,
      authorEmail,
      content: commentContent,
    });

    setComments((prev) => [newComment, ...prev]);
    setAuthorName('');
    setAuthorEmail('');
    setCommentContent('');
    setMathAnswer('');
    // refresh math challenge
    setMathA(Math.floor(Math.random() * 8) + 2);
    setMathB(Math.floor(Math.random() * 8) + 1);
    setFormSuccess(t.comments.submitSuccess);
    setTimeout(() => setFormSuccess(''), 4000);
  };

  return (
    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {/* Like */}
          <button
            onClick={() => handleVote('like')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition font-medium ${
              vote === 'like'
                ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/50 dark:border-blue-700 dark:text-blue-300 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${vote === 'like' ? 'fill-current' : ''}`} />
            <span>{t.actions.like}</span>
            <span className="font-mono tabular-nums font-semibold">{likes}</span>
          </button>

          {/* Dislike */}
          <button
            onClick={() => handleVote('dislike')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition font-medium ${
              vote === 'dislike'
                ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/50 dark:border-rose-700 dark:text-rose-300 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <ThumbsDown className={`w-3.5 h-3.5 ${vote === 'dislike' ? 'fill-current' : ''}`} />
            <span>{t.actions.dislike}</span>
            <span className="font-mono tabular-nums font-semibold">{dislikes}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Comments Toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition font-medium ${
              showComments
                ? 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.actions.comment}</span>
            <span className="font-mono tabular-nums font-semibold">({comments.length})</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? t.actions.linkCopied : t.actions.share}</span>
          </button>
        </div>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-5 animate-in fade-in duration-200">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <span>{t.comments.title}</span>
            <span className="text-xs text-slate-400 font-mono">({comments.length})</span>
          </h4>

          {/* Comment submission form */}
          <form onSubmit={handleCommentSubmit} className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.comments.yourName}
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. احمد / Ahmad"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.comments.yourEmail}
                </label>
                <input
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.comments.yourComment}
              </label>
              <textarea
                required
                rows={3}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder={t.comments.yourComment}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
              />
            </div>

            {/* Anti-spam math protection */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  {t.comments.antiSpamQuestion}{' '}
                  <strong className="font-mono text-slate-900 dark:text-white font-bold">
                    {mathA} + {mathB} = ?
                  </strong>
                </span>
                <input
                  type="number"
                  required
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  className="w-16 px-2 py-1 text-xs text-center rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono"
                  placeholder="?"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.actions.submitComment}</span>
              </button>
            </div>

            {formError && (
              <p className="text-xs text-rose-500 font-medium">{formError}</p>
            )}
            {formSuccess && (
              <p className="text-xs text-emerald-500 font-medium">{formSuccess}</p>
            )}
          </form>

          {/* Comments list */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-2 italic text-center">
                {t.comments.noComments}
              </p>
            ) : (
              comments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-[10px]">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {comm.authorName}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {comm.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed ps-8">
                    {comm.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
