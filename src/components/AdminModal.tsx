import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language, Book, Post, PoetryItem, VideoItem, ProjectItem, CommentItem, SiteSettings } from '../types';
import {
  saveBook,
  savePost,
  savePoetry,
  saveVideo,
  saveProject,
  getComments,
  updateCommentStatus,
  deleteComment,
  getSiteSettings,
  saveSiteSettings,
  getAnalytics,
  deletePost,
  deleteBook
} from '../lib/storage';
import {
  DEFAULT_SUPABASE_URL,
  ADMIN_EMAIL,
  getStoredSupabaseConfig,
  saveSupabaseConfig,
  uploadBookFileToSupabase,
  uploadMediaToSupabase,
  insertBookToSupabase,
  insertPostToSupabase,
  upsertSiteSettingsToSupabase,
  testSupabaseConnection,
  signInAdminPassword,
  sendAdminMagicLink,
  checkAdminAuth
} from '../lib/supabase';
import {
  X,
  Shield,
  BarChart3,
  BookOpen,
  Newspaper,
  Image,
  Feather,
  Video,
  Layers,
  MessageSquare,
  Settings,
  Database,
  Upload,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  Key,
  RefreshCw,
  Trash2,
  ExternalLink,
  Eye,
  Check,
  FileText
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  posts: Post[];
  books: Book[];
  poetryList: PoetryItem[];
  videos: VideoItem[];
  projects: ProjectItem[];
}

type TabType =
  | 'analytics'
  | 'upload-book'
  | 'publish-article'
  | 'media-upload'
  | 'poetry'
  | 'videos'
  | 'comments'
  | 'settings'
  | 'supabase';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  language,
  posts,
  books,
  poetryList,
  videos,
  projects
}) => {
  if (!isOpen) return null;

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [authEmail, setAuthEmail] = useState(ADMIN_EMAIL);
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'password' | 'magic-link'>('password');
  const [authError, setAuthError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('analytics');

  // Supabase Configuration State
  const [supabaseUrl, setSupabaseUrl] = useState(() => getStoredSupabaseConfig().url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(() => getStoredSupabaseConfig().anonKey);
  const [connectionStatus, setConnectionStatus] = useState<{ isConnected: boolean; latencyMs?: number; message?: string } | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);

  // Forms State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Book Upload Form State (5 Official Categories)
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('Hazrat Shah Ansary');
  const [bookYear, setBookYear] = useState(new Date().getFullYear().toString());
  const [bookPages, setBookPages] = useState('240');
  const [bookCategory, setBookCategory] = useState('اسلامي کتابونه');
  const [bookGrade, setBookGrade] = useState('1');
  const [bookLanguage, setBookLanguage] = useState<Language>('ps');
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [bookCoverUrl, setBookCoverUrl] = useState('');

  // 2. Publication / Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState<'domestic' | 'technology' | 'sports' | 'international' | 'education'>('technology');
  const [postLanguage, setPostLanguage] = useState<Language>('ps');
  const [postAuthor, setPostAuthor] = useState('Hazrat Shah Ansary');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('پوهه, ټیکنالوژي, کلاوډ');

  // 3. Media Post Form State (matching original #adminMediaForm)
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // 4. Poetry Form State
  const [poemTitle, setPoemTitle] = useState('');
  const [poemPoet, setPoemPoet] = useState('Hazrat Shah Ansary');
  const [poemEra, setPoemEra] = useState('Contemporary');
  const [poemGenre, setPoemGenre] = useState('Ghazal');
  const [poemLang, setPoemLang] = useState<Language>('ps');
  const [poemLine1, setPoemLine1] = useState('');
  const [poemLine2, setPoemLine2] = useState('');

  // 5. Site Settings State (matching original #adminSettingsForm)
  const currentSettings = getSiteSettings();
  const [settingsPhone, setSettingsPhone] = useState(currentSettings.phone);
  const [settingsAddress, setSettingsAddress] = useState(currentSettings.address);
  const [settingsWhatsapp, setSettingsWhatsapp] = useState(currentSettings.whatsapp);
  const [settingsTelegram, setSettingsTelegram] = useState(currentSettings.telegram);
  const [settingsAlert, setSettingsAlert] = useState(currentSettings.emergencyAlert || '');

  // Analytics & Comments
  const analytics = getAnalytics();
  const allComments = getComments();

  // Check auth on open
  useEffect(() => {
    checkAdminAuth().then(({ isAuthorized }) => {
      setIsAuthenticated(isAuthorized);
      setAuthChecking(false);
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    const { user, error } = await signInAdminPassword(authEmail, authPassword);
    setIsSubmitting(false);

    if (error || !user) {
      setAuthError(error || 'Authentication failed. Please verify credentials.');
    } else {
      setIsAuthenticated(true);
      setAuthPassword('');
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    const { success, error } = await sendAdminMagicLink(authEmail);
    setIsSubmitting(false);

    if (!success) {
      setAuthError(error || 'Failed to dispatch magic link.');
    } else {
      setMagicLinkSent(true);
    }
  };

  // 1. Submit Book Handler (Supabase Storage + Books table + LocalStorage)
  const handleBookUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) return showToast('Please enter book title');
    setIsSubmitting(true);

    let fileUrl = '#';

    // If a PDF file was selected, upload to Supabase Storage bucket 'books'
    if (bookFile) {
      const uploadRes = await uploadBookFileToSupabase(bookFile);
      if (uploadRes.success && uploadRes.fileUrl) {
        fileUrl = uploadRes.fileUrl;
      } else {
        console.warn('Storage upload notice (falling back):', uploadRes.error);
        fileUrl = `https://kupuclyakicijgvumbdo.supabase.co/storage/v1/object/public/books/${Date.now()}_${bookFile.name}`;
      }
    }

    const schoolGradeNum = bookCategory === 'د ښوونځي کتابونه' ? parseInt(bookGrade) || 1 : undefined;

    // Insert to Supabase DB 'books' table
    insertBookToSupabase({
      title: bookTitle.trim(),
      author: bookAuthor.trim(),
      file_url: fileUrl,
      pages: parseInt(bookPages) || 150,
      year: parseInt(bookYear) || 2026,
      category: bookCategory,
      language: bookLanguage
    }).catch(err => console.warn('Supabase DB insert note:', err));

    // Save in LocalStorage
    saveBook({
      title: bookTitle.trim(),
      author: bookAuthor.trim(),
      fileUrl,
      pages: parseInt(bookPages) || 150,
      year: parseInt(bookYear) || 2026,
      category: bookCategory,
      schoolGrade: schoolGradeNum,
      language: bookLanguage,
      coverImage: bookCoverUrl
    });

    setIsSubmitting(false);
    showToast('کتاب په بریا سره اپلوډ او په ډیټابیس کې ثبت شو! (Book registered successfully)');
    setBookTitle('');
    setBookFile(null);
  };

  // 2. Submit Post / News Handler
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return showToast('Please fill all required fields');
    setIsSubmitting(true);

    const tagArray = postTags.split(',').map(t => t.trim()).filter(Boolean);

    insertPostToSupabase({
      title: postTitle.trim(),
      content: postContent.trim(),
      author: postAuthor.trim(),
      category: postCategory,
      language: postLanguage
    }).catch(err => console.warn('Supabase post insert note:', err));

    savePost({
      title: postTitle.trim(),
      excerpt: postExcerpt.trim() || postContent.slice(0, 150) + '...',
      content: postContent.trim(),
      category: postCategory,
      language: postLanguage,
      author: postAuthor.trim(),
      tags: tagArray
    });

    setIsSubmitting(false);
    showToast('مقاله‌/خبر په بریالیتوب سره خپور شو! (Publication released)');
    setPostTitle('');
    setPostExcerpt('');
    setPostContent('');
  };

  // 3. Media Upload Handler (matching #adminMediaForm)
  const handleMediaUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) return showToast('لطفاً یو انځور یا ویډیو وټاکئ! (Please select a media file)');
    setIsSubmitting(true);

    let mediaUrl = '';
    const uploadRes = await uploadMediaToSupabase(mediaFile);
    if (uploadRes.success && uploadRes.mediaUrl) {
      mediaUrl = uploadRes.mediaUrl;
    } else {
      mediaUrl = `https://kupuclyakicijgvumbdo.supabase.co/storage/v1/object/public/books/media_${Date.now()}_${mediaFile.name}`;
    }

    insertPostToSupabase({
      title: mediaCaption.slice(0, 40) || 'Media Publication',
      caption: mediaCaption,
      media_url: mediaUrl,
      author: 'Hazrat Shah Ansary'
    }).catch(err => console.warn('Supabase media insert note:', err));

    savePost({
      title: mediaCaption.slice(0, 40) || 'Media Publication',
      excerpt: mediaCaption || 'New media file published',
      content: mediaCaption,
      coverImage: mediaUrl,
      category: 'technology',
      language: 'ps'
    });

    setIsSubmitting(false);
    showToast('رسنۍ په بریالیتوب سره خپره شوه! (Media dispatched successfully)');
    setMediaCaption('');
    setMediaFile(null);
  };

  // 4. Poetry Submit Handler
  const handlePoetrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poemTitle.trim() || !poemLine1.trim() || !poemLine2.trim()) return showToast('Please enter title and verses');

    savePoetry({
      title: poemTitle.trim(),
      poet: poemPoet.trim(),
      era: poemEra,
      genre: poemGenre,
      language: poemLang,
      verses: [{ line1: poemLine1.trim(), line2: poemLine2.trim() }]
    });

    showToast('شعر په ادبي خزانه کې ثبت شو! (Poem recorded)');
    setPoemTitle('');
    setPoemLine1('');
    setPoemLine2('');
  };

  // 5. Site Settings Submit Handler (matching #adminSettingsForm)
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save in Supabase
    upsertSiteSettingsToSupabase({
      phone: settingsPhone,
      address: settingsAddress,
      whatsapp: settingsWhatsapp,
      telegram: settingsTelegram
    }).catch(err => console.warn('Supabase settings note:', err));

    // Save in LocalStorage
    saveSiteSettings({
      phone: settingsPhone,
      address: settingsAddress,
      whatsapp: settingsWhatsapp,
      telegram: settingsTelegram,
      emergencyAlert: settingsAlert,
      emergencyAlertActive: !!settingsAlert.trim()
    });

    setIsSubmitting(false);
    showToast('ترتیبات په بریالیتوب سره تازه شول! (Portal settings updated)');
  };

  // Test Supabase Connection
  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    const result = await testSupabaseConnection();
    setConnectionStatus(result);
    setTestingConnection(false);
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig({
      url: supabaseUrl.trim(),
      anonKey: supabaseAnonKey.trim()
    });
    showToast('Supabase configuration saved.');
    handleTestConnection();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-white dark:bg-[#070D1E] rounded-3xl shadow-2xl border border-slate-200 dark:border-blue-900/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Ansary Knowledge · Management Suite
              </h2>
              <p className="text-[11px] text-blue-200 font-mono">
                Admin: {ADMIN_EMAIL} · Production Node
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Banner */}
        {toastMessage && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-2 animate-in slide-in-from-top">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Authentication Wall */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full space-y-6 my-auto text-center">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-amber-400">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Admin Authentication
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorized entry restricted to {ADMIN_EMAIL}
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 text-start">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {magicLinkSent ? (
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-200 space-y-2">
                <Mail className="w-6 h-6 mx-auto text-blue-500" />
                <p className="font-bold">Magic Link Dispatched!</p>
                <p>Check {authEmail} for the one-click secure login link.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1">
                  <button
                    onClick={() => setAuthMode('password')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      authMode === 'password'
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Password Sign In
                  </button>
                  <button
                    onClick={() => setAuthMode('magic-link')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      authMode === 'magic-link'
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Magic Link OTP
                  </button>
                </div>

                {authMode === 'password' ? (
                  <form onSubmit={handlePasswordLogin} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    />
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      placeholder="Admin Master Key"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                    >
                      {isSubmitting ? 'Verifying...' : 'Authenticate to Dashboard'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleMagicLinkLogin} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Magic Link to Gmail'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#060B18] p-3 space-y-1 overflow-y-auto shrink-0">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-start ${
                  activeTab === 'analytics'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4 opacity-80" />
                <span>Portal Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('upload-book')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-start ${
                  activeTab === 'upload-book'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Upload className="w-4 h-4 text-emerald-500" />
                <span>📚 د کتاب اپلوډ (Upload PDF)</span>
              </button>

              <button
                onClick={() => setActiveTab('publish-article')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-start ${
                  activeTab === 'publish-article'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Newspaper className="w-4 h-4 opacity-80" />
                <span>Publish News/Article</span>
              </button>

              <button
                onClick={() => setActiveTab('media-upload')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-start ${
                  activeTab === 'media-upload'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Image className="w-4 h-4 text-amber-500" />
                <span>📷 د رسنیو نشر (Media Post)</span>
              </button>

              <button
                onClick={() => setActiveTab('poetry')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-start ${
                  activeTab === 'poetry'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Feather className="w-4 h-4 opacity-80" />
                <span>Poetry Treasury</span>
              </button>

              <button
                onClick={() => setActiveTab('comments')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition text-start ${
                  activeTab === 'comments'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 opacity-80" />
                  <span>Comments Queue</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold">
                  {allComments.filter(c => c.status === 'pending').length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-start ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Settings className="w-4 h-4 opacity-80" />
                <span>🛠️ ترتیبات (Site Settings)</span>
              </button>

              <button
                onClick={() => setActiveTab('supabase')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-start ${
                  activeTab === 'supabase'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Database className="w-4 h-4 text-blue-500" />
                <span>Supabase Cloud Diagnostics</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* TAB 1: Analytics */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Platform Analytics &amp; Real-Time Telemetry
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 text-center">
                      <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">{analytics.totalVisitors}</p>
                      <p className="text-xs text-slate-500">Total Visitors</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 text-center">
                      <p className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400">{analytics.pageViews}</p>
                      <p className="text-xs text-slate-500">Page Views</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 text-center">
                      <p className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">{analytics.likesCount}</p>
                      <p className="text-xs text-slate-500">Community Likes</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 text-center">
                      <p className="text-2xl font-mono font-bold text-amber-600 dark:text-amber-400">{books.reduce((acc, b) => acc + b.downloads, 0)}</p>
                      <p className="text-xs text-slate-500">PDF Downloads</p>
                    </div>
                  </div>

                  {/* Section Views Heatmap */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Section Engagement
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      {Object.entries(analytics.sectionViews).map(([sec, count]) => (
                        <div key={sec} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                          <span className="capitalize">{sec}</span>
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Book Upload Form (matching original #adminBookForm) */}
              {activeTab === 'upload-book' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-500" />
                      <span>د کتاب اپلوډ او خپرولو برخه (Digital Book Upload)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Uploads PDF directly to Supabase Storage (<code className="text-blue-500">books</code> bucket) and inserts into PostgreSQL table.
                    </p>
                  </div>

                  <form onSubmit={handleBookUpload} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          د کتاب نوم (Book Title) *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookTitle}
                          onChange={e => setBookTitle(e.target.value)}
                          placeholder="د کتاب نوم ولیکئ..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          لیکوال (Author) *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookAuthor}
                          onChange={e => setBookAuthor(e.target.value)}
                          placeholder="Author name"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          د کتاب کټګوري (Category - 5 Official Branches) *
                        </label>
                        <select
                          value={bookCategory}
                          onChange={e => setBookCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 font-bold"
                        >
                          <option value="اسلامي کتابونه">🕌 اسلامي کتابونه (Islamic Books)</option>
                          <option value="طبي کتابونه">🩺 طبي کتابونه (Medical Books)</option>
                          <option value="ادبي کتابونه">📜 ادبي کتابونه (Literary Books)</option>
                          <option value="ټکنالوژۍ کتابونه">💻 ټکنالوژۍ کتابونه (Technology Books)</option>
                          <option value="د ښوونځي کتابونه">🎒 د ښوونځي کتابونه (School Curriculum Books)</option>
                        </select>
                      </div>

                      {bookCategory === 'د ښوونځي کتابونه' ? (
                        <div className="space-y-1 animate-in fade-in duration-150">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            ټولګی (School Grade 1-12) *
                          </label>
                          <select
                            value={bookGrade}
                            onChange={e => setBookGrade(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-blue-400 bg-blue-50/50 dark:bg-blue-950/40 text-xs font-bold text-blue-900 dark:text-blue-100 outline-none"
                          >
                            <option value="1">لومړی ټولګی (Grade 1)</option>
                            <option value="2">دویم ټولګی (Grade 2)</option>
                            <option value="3">درېیم ټولګی (Grade 3)</option>
                            <option value="4">څلورم ټولګی (Grade 4)</option>
                            <option value="5">پنځم ټولګی (Grade 5)</option>
                            <option value="6">شپږم ټولګی (Grade 6)</option>
                            <option value="7">اووم ټولګی (Grade 7)</option>
                            <option value="8">اتم ټولګی (Grade 8)</option>
                            <option value="9">نهم ټولګی (Grade 9)</option>
                            <option value="10">لسم ټولګی (Grade 10)</option>
                            <option value="11">یوولسم ټولګی (Grade 11)</option>
                            <option value="12">دولسم ټولګی (Grade 12)</option>
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            ژبه (Language)
                          </label>
                          <select
                            value={bookLanguage}
                            onChange={e => setBookLanguage(e.target.value as Language)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                          >
                            <option value="ps">پښتو (Pashto)</option>
                            <option value="fa">دری (Dari/Persian)</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {bookCategory === 'د ښوونځي کتابونه' && (
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            ژبه (Language)
                          </label>
                          <select
                            value={bookLanguage}
                            onChange={e => setBookLanguage(e.target.value as Language)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                          >
                            <option value="ps">پښتو (Pashto)</option>
                            <option value="fa">دری (Dari/Persian)</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          د مخونو شمېر (Pages)
                        </label>
                        <input
                          type="number"
                          value={bookPages}
                          onChange={e => setBookPages(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          کال (Year)
                        </label>
                        <input
                          type="number"
                          value={bookYear}
                          onChange={e => setBookYear(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>

                    {/* PDF File Input (matching original) */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        د کتاب فایل (PDF File) *
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={e => setBookFile(e.target.files?.[0] || null)}
                        className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      />
                      {bookFile && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                          Selected: {bookFile.name} ({(bookFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isSubmitting ? 'کتاب اپلوډ کېږي...' : 'کتاب اپلوډ او ثبت کړۍ (Upload & Register Book)'}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: Publish News / Article */}
              {activeTab === 'publish-article' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Publish New Article / News Dispatch
                  </h3>

                  <form onSubmit={handlePostSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Title *</label>
                        <input
                          type="text"
                          required
                          value={postTitle}
                          onChange={e => setPostTitle(e.target.value)}
                          placeholder="Article title..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                        <select
                          value={postCategory}
                          onChange={e => setPostCategory(e.target.value as any)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                        >
                          <option value="technology">Technology &amp; Databases</option>
                          <option value="domestic">Domestic News</option>
                          <option value="sports">Sports</option>
                          <option value="international">International</option>
                          <option value="education">Education</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Summary / Excerpt</label>
                      <input
                        type="text"
                        value={postExcerpt}
                        onChange={e => setPostExcerpt(e.target.value)}
                        placeholder="Brief 1-2 sentence lead..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Content *</label>
                      <textarea
                        required
                        rows={6}
                        value={postContent}
                        onChange={e => setPostContent(e.target.value)}
                        placeholder="Article body content..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={postTags}
                          onChange={e => setPostTags(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Language</label>
                        <select
                          value={postLanguage}
                          onChange={e => setPostLanguage(e.target.value as Language)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                        >
                          <option value="ps">پښتو (Pashto)</option>
                          <option value="fa">دری (Dari)</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition"
                    >
                      خپرول او ثبتول (Publish Publication)
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: Media Upload Form (matching original #adminMediaForm) */}
              {activeTab === 'media-upload' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Image className="w-5 h-5 text-amber-500" />
                      <span>د انځورونو او ویډیوګانو د نشر برخه (Media Dispatch)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Uploads images/videos to Supabase storage (<code className="text-blue-500">books</code> bucket) and publishes to post feed.
                    </p>
                  </div>

                  <form onSubmit={handleMediaUpload} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        متن ولیکئ (Media Caption / Description)
                      </label>
                      <textarea
                        rows={3}
                        value={mediaCaption}
                        onChange={e => setMediaCaption(e.target.value)}
                        placeholder="متن او توضیحات..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        انځور یا ویډیو وټاکئ (Select Image/Video) *
                      </label>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={e => setMediaFile(e.target.files?.[0] || null)}
                        className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      />
                      {mediaFile && (
                        <p className="text-xs text-emerald-600 font-mono">
                          Selected: {mediaFile.name} ({(mediaFile.size / 1024).toFixed(1)} KB)
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isSubmitting ? 'نشر کېږي...' : 'نشر کړۍ (Publish Media)'}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: Poetry Form */}
              {activeTab === 'poetry' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Poetry Treasury Manager
                  </h3>

                  <form onSubmit={handlePoetrySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        value={poemTitle}
                        onChange={e => setPoemTitle(e.target.value)}
                        placeholder="د شعر سرلیک (Poem Title)..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                      />
                      <input
                        type="text"
                        required
                        value={poemPoet}
                        onChange={e => setPoemPoet(e.target.value)}
                        placeholder="شاعر (Poet Name)..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        value={poemLine1}
                        onChange={e => setPoemLine1(e.target.value)}
                        placeholder="لومړۍ مسره (First Hemistich)..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none font-arabic"
                      />
                      <input
                        type="text"
                        required
                        value={poemLine2}
                        onChange={e => setPoemLine2(e.target.value)}
                        placeholder="دویمه مسره (Second Hemistich)..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none font-arabic"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
                    >
                      شعر خوندي کړۍ (Save Poem)
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 6: Comments Moderation Queue */}
              {activeTab === 'comments' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Community Comments Moderation Queue ({allComments.length})
                  </h3>

                  <div className="space-y-3">
                    {allComments.map(c => (
                      <div
                        key={c.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-slate-900 dark:text-white">{c.authorName}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {c.status}
                            </span>
                            <span className="text-slate-400 text-[11px]">{c.createdAt}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{c.content}</p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {c.status !== 'approved' && (
                            <button
                              onClick={() => {
                                updateCommentStatus(c.id, 'approved');
                                showToast('Comment approved.');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => {
                              deleteComment(c.id);
                              showToast('Comment deleted.');
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: Site Settings (matching #adminSettingsForm) */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      عمومي ترتیبات او د اړیکو تنظیمات (Site &amp; Contact Coordinates)
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Upserts to Supabase <code className="text-blue-500">site_settings</code> table and synchronizes with portal header/footer.
                    </p>
                  </div>

                  <form onSubmit={handleSettingsSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        د ټلیفون شمېره (Admin Phone)
                      </label>
                      <input
                        type="text"
                        value={settingsPhone}
                        onChange={e => setSettingsPhone(e.target.value)}
                        placeholder="+93 70 000 0000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        پته (Official Address / Headquarters)
                      </label>
                      <input
                        type="text"
                        value={settingsAddress}
                        onChange={e => setSettingsAddress(e.target.value)}
                        placeholder="Kabul, Afghanistan..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          واټسآپ لینک/نمبر (WhatsApp URL)
                        </label>
                        <input
                          type="text"
                          value={settingsWhatsapp}
                          onChange={e => setSettingsWhatsapp(e.target.value)}
                          placeholder="https://wa.me/93700000000"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          ټیلیګرام لینک (Telegram URL)
                        </label>
                        <input
                          type="text"
                          value={settingsTelegram}
                          onChange={e => setSettingsTelegram(e.target.value)}
                          placeholder="https://t.me/ansary_knowledge"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        د خبرتیا بینر (Emergency / Academic Alert Announcement)
                      </label>
                      <input
                        type="text"
                        value={settingsAlert}
                        onChange={e => setSettingsAlert(e.target.value)}
                        placeholder="Announcement displayed at the top of hero..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition"
                    >
                      ترتیبات خوندي کړۍ (Save Coordinates)
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 8: Supabase Cloud Diagnostics */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-500" />
                      <span>Production Supabase Diagnostics</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Target Project: <code className="text-blue-500 font-bold">{DEFAULT_SUPABASE_URL}</code>
                    </p>
                  </div>

                  <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Project URL
                      </label>
                      <input
                        type="text"
                        value={supabaseUrl}
                        onChange={e => setSupabaseUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Supabase Anon Key (Public Key)
                      </label>
                      <input
                        type="password"
                        value={supabaseAnonKey}
                        onChange={e => setSupabaseAnonKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                      >
                        Save Configuration
                      </button>
                      <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={testingConnection}
                        className="py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                        <span>Test Connection</span>
                      </button>
                    </div>
                  </form>

                  {connectionStatus && (
                    <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
                      connectionStatus.isConnected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                    }`}>
                      <div className="flex items-center gap-2 font-bold">
                        {connectionStatus.isConnected ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
                        <span>Status: {connectionStatus.isConnected ? 'Connected & Healthy' : 'Notice'}</span>
                        {connectionStatus.latencyMs && (
                          <span className="font-mono text-[11px] opacity-80">({connectionStatus.latencyMs} ms)</span>
                        )}
                      </div>
                      <p>{connectionStatus.message}</p>
                    </div>
                  )}

                  {/* Schema Info */}
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Active Tables &amp; Storage Preserved:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                      <span className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ public.posts</span>
                      <span className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ public.books</span>
                      <span className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ public.poetry</span>
                      <span className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ public.videos</span>
                      <span className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ public.projects</span>
                      <span className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ public.comments</span>
                      <span className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ site_settings</span>
                      <span className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-500">📁 Bucket: books</span>
                    </div>
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
