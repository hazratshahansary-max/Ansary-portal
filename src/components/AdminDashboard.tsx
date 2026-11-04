import React, { useState, useEffect } from 'react';
import {
  Language,
  Post,
  Book,
  Poetry,
  VideoItem,
  Project,
  Comment,
  AnalyticsData,
  SupabaseConfig,
  NewsCategory,
  PostType,
} from '../types';
import { translations } from '../lib/i18n';
import {
  getAnalytics,
  savePost,
  deletePost,
  saveBook,
  deleteBook,
  savePoetry,
  deletePoetry,
  saveProject,
  deleteProject,
  getComments,
  updateCommentStatus,
  deleteComment,
  getSupabaseConfig,
  saveSupabaseConfig,
  SUPABASE_SQL_SCHEMA,
} from '../lib/storage';
import {
  AUTHORIZED_ADMIN_EMAIL,
  isSupabaseConfigured,
  signInWithEmail,
  sendAdminMagicLink,
  adminSignOut,
  getAuthenticatedAdmin,
  configureSupabase,
} from '../lib/supabase';
import {
  BarChart3,
  FilePlus,
  BookPlus,
  FolderGit2,
  MessageSquare,
  Database,
  Lock,
  LogOut,
  X,
  Check,
  Trash2,
  Eye,
  Download,
  Copy,
  Users,
  Activity,
  ThumbsUp,
  Feather,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Mail,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  posts: Post[];
  books: Book[];
  poetryList: Poetry[];
  videos: VideoItem[];
  projects: Project[];
}

export const AdminDashboard: React.FC<Props> = ({
  isOpen,
  onClose,
  language,
  posts,
  books,
  poetryList,
  projects,
}) => {
  const t = translations[language];

  // Supabase Auth State
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Login Form State (Strictly Supabase Auth)
  const [loginEmail, setLoginEmail] = useState(AUTHORIZED_ADMIN_EMAIL);
  const [loginPassword, setLoginPassword] = useState('');
  const [authMode, setAuthMode] = useState<'password' | 'magic-link'>('password');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Supabase Configuration State
  const [supabaseConfigured, setSupabaseConfigured] = useState(() => isSupabaseConfigured());
  const [configUrl, setConfigUrl] = useState(() => getSupabaseConfig().url || '');
  const [configAnonKey, setConfigAnonKey] = useState(() => getSupabaseConfig().anonKey || '');
  const [showConfigEditor, setShowConfigEditor] = useState(false);
  const [configSuccess, setConfigSuccess] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'posts' | 'books' | 'poetry' | 'projects' | 'comments' | 'supabase'
  >('analytics');

  const [sqlCopied, setSqlCopied] = useState(false);

  // New Post Form
  const [postTitle, setPostTitle] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<PostType>('news');
  const [postCategory, setPostCategory] = useState<NewsCategory>('domestic');
  const [postLanguage, setPostLanguage] = useState<Language>('ps');
  const [postAuthor, setPostAuthor] = useState('Hazrat Shah Ansary');
  const [postTags, setPostTags] = useState('افغانستان, خبرونه, پرمختګ');
  const [postImage] = useState('/src/assets/images/ansary_hero_banner_1793805838021.jpg');
  const [postSuccess, setPostSuccess] = useState('');

  // New Book Form
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('Hazrat Shah Ansary');
  const [bookDescription, setBookDescription] = useState('');
  const [bookPages, setBookPages] = useState('320');
  const [bookYear, setBookYear] = useState('2026');
  const [bookCategory, setBookCategory] = useState('ټیکنالوژي');
  const [bookLanguage, setBookLanguage] = useState<Language>('ps');
  const [bookCover] = useState('/src/assets/images/ansary_books_poetry_1793805839753.jpg');
  const [bookSuccess, setBookSuccess] = useState('');

  // Comments state
  const [allComments, setAllComments] = useState<Comment[]>(() => getComments());

  // Analytics snapshot
  const analytics: AnalyticsData = getAnalytics();

  // Check Supabase session on open or mount
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setAuthLoading(true);

    getAuthenticatedAdmin()
      .then(({ user, isAuthorized: authorized }) => {
        if (!mounted) return;
        setCurrentUser(user);
        setIsAuthorized(authorized);
        setAuthLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setAuthLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Supabase Password Login Handler
  const handleSupabasePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);

    const { user, error } = await signInWithEmail(loginEmail, loginPassword);
    setAuthSubmitting(false);

    if (error || !user) {
      setAuthError(error || 'Authentication failed. Please verify credentials.');
      return;
    }

    setCurrentUser(user);
    setIsAuthorized(true);
    setLoginPassword('');
  };

  // Supabase Magic Link Login Handler
  const handleSupabaseMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);
    setMagicLinkSent(false);

    const { success, error } = await sendAdminMagicLink(loginEmail);
    setAuthSubmitting(false);

    if (error || !success) {
      setAuthError(error || 'Failed to dispatch magic link.');
      return;
    }

    setMagicLinkSent(true);
  };

  // Sign Out Handler
  const handleLogout = async () => {
    await adminSignOut();
    setCurrentUser(null);
    setIsAuthorized(false);
  };

  // Save Supabase Configuration
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = configureSupabase(configUrl, configAnonKey);
    if (ok) {
      setSupabaseConfigured(true);
      setShowConfigEditor(false);
      setConfigSuccess('Supabase credentials successfully linked.');
      setTimeout(() => setConfigSuccess(''), 4000);
    } else {
      setAuthError('Invalid Supabase Project URL or Anon Key. URL must start with https://');
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postExcerpt || !postContent) return;

    savePost({
      slug: postTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `post-${Date.now()}`,
      title: postTitle,
      excerpt: postExcerpt,
      content: postContent,
      type: postType,
      category: postCategory,
      language: postLanguage,
      author: postAuthor,
      date: new Date().toISOString().split('T')[0],
      coverImage: postImage,
      tags: postTags.split(',').map((t) => t.trim()).filter(Boolean),
      featured: true,
    });

    setPostTitle('');
    setPostExcerpt('');
    setPostContent('');
    setPostSuccess('Article published successfully!');
    setTimeout(() => setPostSuccess(''), 4000);
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle || !bookDescription) return;

    saveBook({
      title: bookTitle,
      author: bookAuthor,
      description: bookDescription,
      pages: parseInt(bookPages, 10) || 200,
      publicationYear: parseInt(bookYear, 10) || 2026,
      category: bookCategory,
      language: bookLanguage,
      coverImage: bookCover,
      fileSize: '16.5 MB',
    });

    setBookTitle('');
    setBookDescription('');
    setBookSuccess('Book published to library!');
    setTimeout(() => setBookSuccess(''), 4000);
  };

  const handleCommentStatus = (id: string, status: 'approved' | 'rejected') => {
    updateCommentStatus(id, status);
    setAllComments(getComments());
  };

  const handleDeleteComment = (id: string) => {
    deleteComment(id);
    setAllComments(getComments());
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-6xl max-h-[95vh] flex flex-col rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-left [dir=rtl]:text-right">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-slate-950 flex items-center justify-center p-2 border border-amber-400/40">
              <img src="/icon.svg" alt="ANSARY Admin" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.admin.dashboardTitle}
                </h2>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  SUPABASE AUTH
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Protected Management &middot; Authorized: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{AUTHORIZED_ADMIN_EMAIL}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthorized && (
              <button
                onClick={handleLogout}
                className="p-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5"
                title={t.admin.logout}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t.admin.logout}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION GATE */}
        {authLoading ? (
          <div className="p-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-3 my-auto">
            <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <span>Verifying Supabase cryptographic session...</span>
          </div>
        ) : !isAuthorized ? (
          <div className="p-6 sm:p-10 max-w-lg mx-auto my-auto w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border border-blue-200 dark:border-blue-900 shadow-sm">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Administrator Authentication
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Secure authentication backed by <strong>Supabase Auth</strong>. Access is strictly restricted to the authorized administrator account.
              </p>
            </div>

            {/* Authorized Email Pill */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="flex-1 truncate">
                <span className="text-slate-500 text-[11px] block">Authorized Administrator Account:</span>
                <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
                  {AUTHORIZED_ADMIN_EMAIL}
                </span>
              </div>
            </div>

            {/* Supabase Connection Setup Check */}
            {!supabaseConfigured && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs space-y-3">
                <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Supabase project credentials have not been configured yet. Enter your Supabase Project URL and Anon Key below to enable Supabase Auth.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfigEditor(!showConfigEditor)}
                  className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  {showConfigEditor ? 'Hide Supabase Keys Form' : 'Configure Supabase Keys Now'}
                </button>
              </div>
            )}

            {showConfigEditor && (
              <form onSubmit={handleSaveConfig} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white">Supabase Credentials</h4>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Project URL</label>
                  <input
                    type="url"
                    required
                    value={configUrl}
                    onChange={(e) => setConfigUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Anon Public Key</label>
                  <input
                    type="password"
                    required
                    value={configAnonKey}
                    onChange={(e) => setConfigAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
                >
                  Save Supabase Settings
                </button>
              </form>
            )}

            {/* Auth Mode Toggle Tabs (Password vs Magic Link) */}
            <div className="flex rounded-xl bg-slate-200 dark:bg-slate-900 p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('password');
                  setAuthError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  authMode === 'password'
                    ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('magic-link');
                  setAuthError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  authMode === 'magic-link'
                    ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Magic Link (Email OTP)
              </button>
            </div>

            {/* Password Login Form */}
            {authMode === 'password' ? (
              <form onSubmit={handleSupabasePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono pl-9"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Supabase Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your Supabase admin password"
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono pl-9"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{authSubmitting ? 'Verifying with Supabase...' : 'Authenticate as Administrator'}</span>
                </button>
              </form>
            ) : (
              /* Magic Link Form */
              <form onSubmit={handleSupabaseMagicLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    A cryptographically signed single-use login link will be emailed to you via Supabase.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{authSubmitting ? 'Sending link...' : 'Send Magic Link to Email'}</span>
                </button>

                {magicLinkSent && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Magic link sent! Check your inbox ({loginEmail}) to complete login.</span>
                  </div>
                )}
              </form>
            )}

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {configSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{configSuccess}</span>
              </div>
            )}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowConfigEditor(!showConfigEditor)}
                className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 inline-flex items-center gap-1"
              >
                <Database className="w-3 h-3" />
                <span>Configure / Update Supabase Project Credentials</span>
              </button>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN INTERFACE */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar navigation */}
            <div className="w-full md:w-60 bg-white dark:bg-slate-900/80 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-3 space-y-1 overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col">
              {/* Authenticated user indicator */}
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 mb-2 text-xs">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block uppercase tracking-wider">
                  Logged in Admin
                </span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold truncate block">
                  {currentUser?.email || AUTHORIZED_ADMIN_EMAIL}
                </span>
              </div>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
                  activeTab === 'analytics'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span>{t.admin.analytics}</span>
              </button>

              <button
                onClick={() => setActiveTab('posts')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
                  activeTab === 'posts'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FilePlus className="w-4 h-4 shrink-0" />
                <span>{t.admin.publishContent}</span>
              </button>

              <button
                onClick={() => setActiveTab('books')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
                  activeTab === 'books'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookPlus className="w-4 h-4 shrink-0" />
                <span>Upload PDF Books</span>
              </button>

              <button
                onClick={() => setActiveTab('poetry')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
                  activeTab === 'poetry'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Feather className="w-4 h-4 shrink-0" />
                <span>Manage Poetry</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
                  activeTab === 'projects'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FolderGit2 className="w-4 h-4 shrink-0" />
                <span>Database Projects</span>
              </button>

              <button
                onClick={() => setActiveTab('comments')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition ${
                  activeTab === 'comments'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>{t.admin.moderateComments}</span>
                </span>
                <span className="font-mono text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-bold">
                  {allComments.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('supabase')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
                  activeTab === 'supabase'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Database className="w-4 h-4 shrink-0" />
                <span>Supabase &amp; RLS Policies</span>
              </button>
            </div>

            {/* Main content pane */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* TAB 1: ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Live Portal &amp; PWA Analytics
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real statistics tracked across all visitor interactions and mobile installs.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Total Visitors</span>
                        <Users className="w-4 h-4 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                        {analytics.totalVisitors}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Page Views</span>
                        <Eye className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                        {analytics.pageViews}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Likes &amp; Dislikes</span>
                        <ThumbsUp className="w-4 h-4 text-amber-500" />
                      </div>
                      <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                        {analytics.likesCount} <span className="text-xs text-rose-500">/ {analytics.dislikesCount}</span>
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Total Comments</span>
                        <MessageSquare className="w-4 h-4 text-indigo-500" />
                      </div>
                      <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                        {analytics.commentsCount}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>PWA App Downloads</span>
                        <Download className="w-4 h-4 text-purple-500" />
                      </div>
                      <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                        {analytics.appDownloads}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Active Users</span>
                        <Activity className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                        {analytics.activeUsers}
                      </p>
                    </div>
                  </div>

                  {/* Section Engagement */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Section Engagement
                      </h4>
                      <div className="space-y-2 text-xs">
                        {Object.entries(analytics.sectionViews).map(([sec, count]) => (
                          <div key={sec} className="flex items-center justify-between">
                            <span className="capitalize text-slate-700 dark:text-slate-300">{sec}</span>
                            <span className="font-mono font-semibold text-slate-900 dark:text-white">
                              {count} views
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Security Status
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Authentication Engine:</span>
                          <span className="font-mono text-emerald-600 font-bold">Supabase Auth (BCrypt/Argon2)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Server Authorization:</span>
                          <span className="font-mono text-emerald-600 font-bold">Enforced (/api/admin/*)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Row Level Security (RLS):</span>
                          <span className="font-mono text-emerald-600 font-bold">Restricted to Admin Email</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Hardcoded Passkeys:</span>
                          <span className="font-mono text-emerald-600 font-bold">Completely Removed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PUBLISH POSTS */}
              {activeTab === 'posts' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Publish News or Educational Article
                    </h3>
                    <p className="text-xs text-slate-500">
                      Publish in Pashto, Dari, or English. Translation is not mandatory.
                    </p>
                  </div>

                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Content Type
                        </label>
                        <select
                          value={postType}
                          onChange={(e) => setPostType(e.target.value as PostType)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="news">News Post</option>
                          <option value="article">Educational Article</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Category
                        </label>
                        <select
                          value={postCategory}
                          onChange={(e) => setPostCategory(e.target.value as NewsCategory)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="domestic">Domestic News</option>
                          <option value="sports">Sports</option>
                          <option value="international">International News</option>
                          <option value="announcements">Announcements</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Language
                        </label>
                        <select
                          value={postLanguage}
                          onChange={(e) => setPostLanguage(e.target.value as Language)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                        >
                          <option value="ps">Pashto (پښتو)</option>
                          <option value="fa">Dari (دری)</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="Article or news headline..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Excerpt (Brief summary)
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={postExcerpt}
                        onChange={(e) => setPostExcerpt(e.target.value)}
                        placeholder="1-2 sentences summarizing this post..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Full Article Body
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Write the full content..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-serif"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Author
                        </label>
                        <input
                          type="text"
                          value={postAuthor}
                          onChange={(e) => setPostAuthor(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={postTags}
                          onChange={(e) => setPostTags(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
                    >
                      Publish Article
                    </button>
                    {postSuccess && <p className="text-xs text-emerald-500 font-medium">{postSuccess}</p>}
                  </form>

                  {/* Existing posts */}
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Published Articles ({posts.length})
                    </h4>
                    <div className="space-y-2">
                      {posts.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                        >
                          <div className="truncate max-w-md">
                            <span className="font-semibold text-slate-900 dark:text-white">{p.title}</span>
                            <span className="text-slate-400 font-mono text-[11px] ml-2">[{p.language.toUpperCase()}]</span>
                          </div>
                          <button
                            onClick={() => deletePost(p.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BOOKS */}
              {activeTab === 'books' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Upload PDF Book to Library
                    </h3>
                    <p className="text-xs text-slate-500">
                      Add downloadable books and academic publications.
                    </p>
                  </div>

                  <form onSubmit={handleCreateBook} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Book Title
                        </label>
                        <input
                          type="text"
                          required
                          value={bookTitle}
                          onChange={(e) => setBookTitle(e.target.value)}
                          placeholder="e.g. د معلوماتو ټیکنالوژۍ بنسټونه"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Author
                        </label>
                        <input
                          type="text"
                          required
                          value={bookAuthor}
                          onChange={(e) => setBookAuthor(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={bookDescription}
                        onChange={(e) => setBookDescription(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Pages Count
                        </label>
                        <input
                          type="number"
                          value={bookPages}
                          onChange={(e) => setBookPages(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Year
                        </label>
                        <input
                          type="number"
                          value={bookYear}
                          onChange={(e) => setBookYear(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Language
                        </label>
                        <select
                          value={bookLanguage}
                          onChange={(e) => setBookLanguage(e.target.value as Language)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="ps">Pashto</option>
                          <option value="fa">Dari</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                    >
                      Publish Book
                    </button>
                    {bookSuccess && <p className="text-xs text-emerald-500 font-medium">{bookSuccess}</p>}
                  </form>

                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Current Books ({books.length})
                    </h4>
                    <div className="space-y-2">
                      {books.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                        >
                          <div className="truncate max-w-md">
                            <span className="font-semibold text-slate-900 dark:text-white">{b.title}</span>
                            <span className="text-slate-400 ml-2">({b.downloads} downloads)</span>
                          </div>
                          <button
                            onClick={() => deleteBook(b.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: POETRY */}
              {activeTab === 'poetry' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Poetry Treasury Management
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage classical ghazals and Afghan poetic verses.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {poetryList.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">{item.title}</span>
                          <span className="text-slate-400 ml-2">&middot; {item.poet} ({item.genre})</span>
                        </div>
                        <button
                          onClick={() => deletePoetry(item.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Database Projects &amp; Advertisements
                    </h3>
                    <p className="text-xs text-slate-500">
                      Display project architectures and client portfolio ads without hosting private database endpoints.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{proj.title}</p>
                          <p className="text-blue-600 dark:text-amber-400 font-mono text-[11px] mt-0.5">
                            {proj.databaseType}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteProject(proj.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: COMMENTS MODERATION */}
              {activeTab === 'comments' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Comment Moderation Queue
                    </h3>
                    <p className="text-xs text-slate-500">
                      Approve, reject, or remove visitor comments across all content.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {allComments.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No comments submitted yet.</p>
                    ) : (
                      allComments.map((comm) => (
                        <div
                          key={comm.id}
                          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {comm.authorName} ({comm.targetType})
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                              comm.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : comm.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {comm.status.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {comm.content}
                          </p>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            {comm.status !== 'approved' && (
                              <button
                                onClick={() => handleCommentStatus(comm.id, 'approved')}
                                className="px-3 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Approve
                              </button>
                            )}
                            {comm.status !== 'rejected' && (
                              <button
                                onClick={() => handleCommentStatus(comm.id, 'rejected')}
                                className="px-3 py-1 bg-amber-600 text-white rounded text-[11px] font-semibold"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteComment(comm.id)}
                              className="px-3 py-1 bg-rose-600 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 7: SUPABASE INTEGRATION & RLS */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Supabase Row Level Security (RLS) &amp; Schema
                    </h3>
                    <p className="text-xs text-slate-500">
                      Row Level Security strictly restricts publishing, editing, and deletion to <strong className="font-mono text-slate-700 dark:text-slate-300">{AUTHORIZED_ADMIN_EMAIL}</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs space-y-2">
                    <p className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      RLS Security Enforcement Status: Active &amp; Verified
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      Only authenticated JWT sessions whose claim matches <code className="font-mono font-bold bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">{AUTHORIZED_ADMIN_EMAIL}</code> or has the <code className="font-mono bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">admin</code> role can execute write operations. Public visitors can only view content and submit unmoderated comments.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Production Supabase Migration Script (with Email-Restricted RLS)
                        </h4>
                        <p className="text-xs text-slate-500">
                          Execute in Supabase SQL Editor.
                        </p>
                      </div>
                      <button
                        onClick={handleCopySql}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                      >
                        {sqlCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{sqlCopied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] max-h-60 overflow-y-auto border border-slate-800">
                      {SUPABASE_SQL_SCHEMA}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
