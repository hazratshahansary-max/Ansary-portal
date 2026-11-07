import React, { useState, useMemo } from 'react';
import { LinkItem, Language, LinkCategory } from '../types';
import { translations } from '../data/translations';
import { submitLinkReportToSupabase } from '../lib/supabase';
import {
  ExternalLink,
  Copy,
  Check,
  Star,
  Globe,
  Edit2,
  Trash2,
  Sparkles,
  Link2,
  Plus,
  BookOpen,
  Code,
  Palette,
  GraduationCap,
  Flame,
  Clock,
  AlertCircle,
  AlertTriangle,
  X,
  Send,
  Flag,
  Film,
  Languages,
  FileSearch,
  Newspaper,
  Landmark,
  Briefcase,
  Layers,
  ShieldAlert,
  Loader2
} from 'lucide-react';

interface LinksSectionProps {
  links: LinkItem[];
  currentLang: Language;
  searchQuery: string;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  isAdmin: boolean;
  onEditLink: (link: LinkItem) => void;
  onDeleteLink: (id: string) => void;
  onAddNewLink: () => void;
  showOnlyFavorites?: boolean;
}

/**
 * Validates whether a given URL is a safe HTTP or HTTPS link.
 * Strictly blocks malicious protocols (javascript:, data:, file:, etc.)
 */
export const isValidSafeUrl = (urlStr?: string): boolean => {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();
  if (!trimmed) return false;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('blob:') ||
    lower.startsWith('about:')
  ) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    try {
      const parsed = new URL(`https://${trimmed}`);
      return (
        parsed.protocol === 'https:' &&
        parsed.hostname.includes('.') &&
        !parsed.hostname.startsWith('.') &&
        !parsed.hostname.endsWith('.')
      );
    } catch {
      return false;
    }
  }
};

/**
 * Returns a normalized safe URL string starting with http:// or https://,
 * or null if the URL is invalid or unsafe.
 */
export const getSafeUrl = (urlStr?: string): string | null => {
  if (!isValidSafeUrl(urlStr)) return null;
  const trimmed = (urlStr || '').trim();
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export const LinksSection: React.FC<LinksSectionProps> = ({
  links,
  currentLang,
  searchQuery,
  favorites,
  onToggleFavorite,
  isAdmin,
  onEditLink,
  onDeleteLink,
  onAddNewLink,
  showOnlyFavorites = false
}) => {
  const t = translations[currentLang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [activeFilterStatus, setActiveFilterStatus] = useState<'all' | 'newest' | 'popular' | 'featured'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'popular' | 'title'>('featured');
  
  // Toast notifications for Copy & Action
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Failed image cache (linkId -> true if both logoUrl and Google favicon failed)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Broken link report modal state
  const [reportingLink, setReportingLink] = useState<LinkItem | null>(null);
  const [reportReason, setReportReason] = useState<string>('not_opening');
  const [reportNotes, setReportNotes] = useState<string>('');
  const [isSubmittingReport, setIsSubmittingReport] = useState<boolean>(false);
  const [reportFeedback, setReportFeedback] = useState<{ text: string; isError?: boolean } | null>(null);

  // The 15 official Link categories + 'all'
  const linkCategoriesList: LinkCategory[] = [
    'all',
    'global-popular',
    'education-scientific',
    'free-courses',
    'books-libraries',
    'ai-tools',
    'design-photo',
    'video-tools',
    'tech-programming',
    'translation-languages',
    'research-papers',
    'news-media',
    'afghan-resources',
    'government-services',
    'jobs-scholarships',
    'other-links'
  ];

  // Map legacy category keys to modern ones for seamless backward compatibility
  const normalizeCategory = (cat: string): string => {
    switch (cat) {
      case 'learning':
        return 'education-scientific';
      case 'development':
        return 'tech-programming';
      case 'design':
        return 'design-photo';
      case 'utilities':
        return 'other-links';
      case 'books':
        return 'books-libraries';
      default:
        return cat || 'other-links';
    }
  };

  const getCategoryIcon = (category: string) => {
    const norm = normalizeCategory(category);
    switch (norm) {
      case 'global-popular':
        return <Globe className="h-4 w-4 text-blue-400" />;
      case 'education-scientific':
      case 'free-courses':
        return <GraduationCap className="h-4 w-4 text-emerald-400" />;
      case 'books-libraries':
        return <BookOpen className="h-4 w-4 text-amber-300" />;
      case 'ai-tools':
        return <Sparkles className="h-4 w-4 text-amber-400" />;
      case 'design-photo':
        return <Palette className="h-4 w-4 text-pink-400" />;
      case 'video-tools':
        return <Film className="h-4 w-4 text-purple-400" />;
      case 'tech-programming':
        return <Code className="h-4 w-4 text-cyan-400" />;
      case 'translation-languages':
        return <Languages className="h-4 w-4 text-indigo-400" />;
      case 'research-papers':
        return <FileSearch className="h-4 w-4 text-teal-400" />;
      case 'news-media':
        return <Newspaper className="h-4 w-4 text-rose-400" />;
      case 'afghan-resources':
        return <Globe className="h-4 w-4 text-emerald-500" />;
      case 'government-services':
        return <Landmark className="h-4 w-4 text-blue-500" />;
      case 'jobs-scholarships':
        return <Briefcase className="h-4 w-4 text-orange-400" />;
      default:
        return <Link2 className="h-4 w-4 text-slate-400" />;
    }
  };

  const getCleanDomain = (url: string) => {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsed.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  // Filter links
  const filteredLinks = useMemo(() => {
    return links
      .filter((item) => {
        if (showOnlyFavorites && !favorites.includes(item.id)) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all') {
          const itemCatNorm = normalizeCategory(item.category);
          if (itemCatNorm !== selectedCategory && item.category !== selectedCategory) {
            return false;
          }
        }

        // Language filter
        if (selectedLanguage !== 'all') {
          if (item.language && item.language !== 'all' && item.language !== selectedLanguage) {
            return false;
          }
        }

        // Pricing filter
        if (selectedPricing !== 'all') {
          const price = item.pricing || 'free';
          if (price !== selectedPricing) {
            return false;
          }
        }

        // Status filter: popular only shown when real verified data exists
        if (activeFilterStatus === 'featured' && !item.isFeatured) {
          return false;
        }
        if (activeFilterStatus === 'popular') {
          const hasVerifiedMetric =
            Boolean(item.isPopular) ||
            (typeof item.realClickCount === 'number' && item.realClickCount > 0);
          if (!hasVerifiedMetric) {
            return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle =
            (item.title.ps && item.title.ps.toLowerCase().includes(q)) ||
            (item.title.fa && item.title.fa.toLowerCase().includes(q)) ||
            (item.title.en && item.title.en.toLowerCase().includes(q));
          const matchDesc =
            (item.description.ps && item.description.ps.toLowerCase().includes(q)) ||
            (item.description.fa && item.description.fa.toLowerCase().includes(q)) ||
            (item.description.en && item.description.en.toLowerCase().includes(q));
          const matchUrl = item.url && item.url.toLowerCase().includes(q);
          const matchTags = item.tags && item.tags.some((tag) => tag.toLowerCase().includes(q));

          if (!matchTitle && !matchDesc && !matchUrl && !matchTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // If newest filter button was clicked, prioritize chronological order
        if (activeFilterStatus === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        if (sortBy === 'featured') {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
        }
        if (sortBy === 'popular') {
          const metricA = (a.isPopular ? 100 : 0) + (a.realClickCount || 0);
          const metricB = (b.isPopular ? 100 : 0) + (b.realClickCount || 0);
          if (metricA !== metricB) return metricB - metricA;
        }
        if (sortBy === 'title') {
          const titleA = a.title[currentLang] || a.title.en || a.title.ps || '';
          const titleB = b.title[currentLang] || b.title.en || b.title.ps || '';
          return titleA.localeCompare(titleB);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    links,
    selectedCategory,
    selectedLanguage,
    selectedPricing,
    activeFilterStatus,
    sortBy,
    searchQuery,
    favorites,
    showOnlyFavorites,
    currentLang
  ]);

  // Robust Copy URL with fallback for non-secure contexts and error handling
  const handleCopyUrl = async (id: string, rawUrl: string) => {
    const safeUrl = getSafeUrl(rawUrl) || rawUrl;
    let success = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(safeUrl);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = safeUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (err) {
        console.error('Fallback clipboard error', err);
        success = false;
      }
    }

    if (success) {
      setCopiedId(id);
      setToastMessage({ text: t.linkCopied, isError: false });
      setTimeout(() => {
        setCopiedId(null);
        setToastMessage(null);
      }, 2500);
    } else {
      setToastMessage({ text: t.copyFailed, isError: true });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Reset all active filters
  const handleClearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedLanguage('all');
    setSelectedPricing('all');
    setActiveFilterStatus('all');
    setSortBy('featured');
  };

  // Spam prevention: Check if already reported recently (within 24 hours)
  const isLinkAlreadyReported = (linkId: string): boolean => {
    try {
      const raw = localStorage.getItem('ansary_reported_link_ids_v1');
      if (raw) {
        const map = JSON.parse(raw);
        const reportTime = map[linkId];
        if (reportTime && Date.now() - reportTime < 24 * 60 * 60 * 1000) {
          return true;
        }
      }
    } catch {
      // ignore
    }
    return false;
  };

  const markLinkAsReported = (linkId: string) => {
    try {
      const raw = localStorage.getItem('ansary_reported_link_ids_v1');
      const map = raw ? JSON.parse(raw) : {};
      map[linkId] = Date.now();
      localStorage.setItem('ansary_reported_link_ids_v1', JSON.stringify(map));
    } catch {
      // ignore
    }
  };

  // Real report submission
  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingLink) return;

    if (isLinkAlreadyReported(reportingLink.id)) {
      setReportFeedback({ text: t.alreadyReported, isError: true });
      return;
    }

    setIsSubmittingReport(true);
    setReportFeedback(null);

    try {
      // Attempt remote recording if Supabase is connected
      const remoteRes = await submitLinkReportToSupabase({
        linkId: reportingLink.id,
        linkUrl: reportingLink.url,
        reason: reportReason,
        notes: reportNotes.trim()
      });

      // Always save locally so no reports are lost even if remote table is pending migration
      try {
        const rawExisting = localStorage.getItem('ansary_local_link_reports_v1');
        const existingReports = rawExisting ? JSON.parse(rawExisting) : [];
        const newReportItem = {
          id: `rep-${Date.now()}`,
          linkId: reportingLink.id,
          linkUrl: reportingLink.url,
          reason: reportReason,
          notes: reportNotes.trim(),
          isRemoteSynced: remoteRes.isRemote,
          createdAt: new Date().toISOString()
        };
        existingReports.unshift(newReportItem);
        localStorage.setItem(
          'ansary_local_link_reports_v1',
          JSON.stringify(existingReports.slice(0, 100))
        );
      } catch (err) {
        console.warn('Local storage report save warning:', err);
      }

      markLinkAsReported(reportingLink.id);

      if (remoteRes.isRemote) {
        setReportFeedback({ text: t.reportSentSuccess, isError: false });
      } else {
        setReportFeedback({ text: t.reportSavedLocal, isError: false });
      }

      setTimeout(() => {
        setReportFeedback(null);
        setReportingLink(null);
        setReportNotes('');
        setIsSubmittingReport(false);
      }, 2500);
    } catch (err) {
      console.error('Report submission failed:', err);
      setReportFeedback({ text: t.reportFailed, isError: true });
      setIsSubmittingReport(false);
    }
  };

  return (
    <section className="py-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 end-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border backdrop-blur-md ${
              toastMessage.isError
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
            }`}
          >
            {toastMessage.isError ? (
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            ) : (
              <Check className="h-4 w-4 text-emerald-400 shrink-0 stroke-[3]" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Category Pills & Top Controls */}
      <div className="space-y-4">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {linkCategoriesList.map((catKey) => {
            const isSelected = selectedCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600'
                }`}
              >
                {getCategoryIcon(catKey)}
                <span>{t.linkCategories[catKey] || catKey}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Row: Status, Language, Pricing, Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilterStatus === 'all'
                  ? 'bg-slate-700 text-white border border-slate-600'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.allCategories}
            </button>
            <button
              onClick={() => setActiveFilterStatus('newest')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilterStatus === 'newest'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="h-3 w-3" />
              <span>{t.newest}</span>
            </button>
            <button
              onClick={() => setActiveFilterStatus('popular')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilterStatus === 'popular'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="h-3 w-3" />
              <span>{t.popular}</span>
            </button>
            <button
              onClick={() => setActiveFilterStatus('featured')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilterStatus === 'featured'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>{t.featured}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 ms-auto">
            {/* Language filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 hidden sm:inline">{t.filterLanguage}</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-800 text-slate-200 text-xs rounded-xl border border-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">{t.allLanguages}</option>
                <option value="ps">پښتو (Pashto)</option>
                <option value="fa">دري (Dari)</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Pricing filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 hidden sm:inline">{t.pricing}</span>
              <select
                value={selectedPricing}
                onChange={(e) => setSelectedPricing(e.target.value)}
                className="bg-slate-800 text-slate-200 text-xs rounded-xl border border-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">{t.allPricing}</option>
                <option value="free">{t.free}</option>
                <option value="freemium">{t.freemium}</option>
                <option value="paid">{t.paid}</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-800 text-slate-200 text-xs rounded-xl border border-slate-700 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="featured">{t.featured}</option>
              <option value="popular">{t.popular}</option>
              <option value="newest">{t.newest}</option>
              <option value="title">{t.alphabetical}</option>
            </select>

            {isAdmin && (
              <button
                onClick={onAddNewLink}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md transition-all shrink-0"
              >
                <Plus className="h-3.5 w-3.5 stroke-[3]" />
                <span>{t.addNewLink}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Links Grid */}
      {filteredLinks.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
          <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
            <Link2 className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t.noResults}</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-5">
            {t.noResultsDesc}
          </p>
          {(selectedCategory !== 'all' ||
            selectedLanguage !== 'all' ||
            selectedPricing !== 'all' ||
            activeFilterStatus !== 'all' ||
            searchQuery) && (
            <button
              onClick={handleClearAllFilters}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
            >
              {t.clearFilters}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLinks.map((link) => {
            const isFav = favorites.includes(link.id);
            const isCopied = copiedId === link.id;
            const title = link.title[currentLang] || link.title.ps || link.title.en;
            const desc = link.description[currentLang] || link.description.ps || link.description.en;
            const badge = link.badge
              ? link.badge[currentLang] || link.badge.ps || link.badge.en
              : null;
            const domain = getCleanDomain(link.url);
            const safeHref = getSafeUrl(link.url);
            const isUrlValid = Boolean(safeHref);
            const pricing = link.pricing || 'free';
            const normCategory = normalizeCategory(link.category);
            const isImageFailed = failedImages[link.id];
            const hasValidLogo = link.logoUrl && isValidSafeUrl(link.logoUrl);

            return (
              <article
                key={link.id}
                className="group relative flex flex-col justify-between bg-slate-800/70 hover:bg-slate-800 rounded-2xl border border-slate-700/80 hover:border-amber-500/40 p-5 shadow-lg transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5"
              >
                <div>
                  {/* Top Bar: Category, Badge, Pricing & Favorite */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-700/60 text-slate-300 border border-slate-600/60 flex items-center gap-1.5">
                        {getCategoryIcon(link.category)}
                        {t.linkCategories[normCategory] || normCategory}
                      </span>

                      {/* Pricing badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                          pricing === 'free'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : pricing === 'freemium'
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {pricing === 'free'
                          ? t.free
                          : pricing === 'freemium'
                          ? t.freemium
                          : t.paid}
                      </span>

                      {badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {badge}
                        </span>
                      )}

                      {link.isFeatured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5" />
                          {t.featured}
                        </span>
                      )}

                      {link.isPopular && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                          <Flame className="h-2.5 w-2.5" />
                          {t.popular}
                        </span>
                      )}

                      {link.isDraft && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {t.statusDraft}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onToggleFavorite(link.id)}
                      className={`p-1.5 rounded-lg transition-all ${
                        isFav
                          ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                          : 'text-slate-400 hover:text-amber-400 hover:bg-slate-700/60'
                      }`}
                      title={isFav ? t.removeFromFavorites : t.addToFavorites}
                    >
                      <Star className={`h-4 w-4 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Logo / Favicon + Title */}
                  <div className="flex items-start gap-3 mb-2.5">
                    <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-inner p-1.5">
                      {!isImageFailed ? (
                        hasValidLogo ? (
                          <img
                            src={link.logoUrl}
                            alt=""
                            className="h-full w-full object-contain"
                            onError={() => {
                              // Try fallback to Google S2 favicon
                              const target = document.getElementById(`favicon-${link.id}`) as HTMLImageElement;
                              if (target) {
                                target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                              } else {
                                setFailedImages((prev) => ({ ...prev, [link.id]: true }));
                              }
                            }}
                          />
                        ) : (
                          <img
                            id={`favicon-${link.id}`}
                            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                            alt=""
                            className="h-5 w-5 object-contain"
                            onError={() => {
                              setFailedImages((prev) => ({ ...prev, [link.id]: true }));
                            }}
                          />
                        )
                      ) : (
                        getCategoryIcon(link.category)
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      {isUrlValid ? (
                        <a
                          href={safeHref!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-bold text-white group-hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 hover:underline"
                        >
                          <span className="line-clamp-1">{title}</span>
                          <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 shrink-0" />
                        </a>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-bold text-slate-300 line-clamp-1">
                            {title}
                          </span>
                          <span
                            className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded font-mono shrink-0 flex items-center gap-1"
                            title={t.linkSecurityWarning}
                          >
                            <ShieldAlert className="h-3 w-3" />
                            <span>{t.invalidUrl}</span>
                          </span>
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                        {domain}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-3 mb-3 leading-relaxed">
                    {desc}
                  </p>

                  {/* Real Click Counter (ONLY displayed if backend verified > 0) */}
                  {typeof link.realClickCount === 'number' && link.realClickCount > 0 && (
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mb-2 font-mono">
                      <span>{t.verifiedClicks}</span>
                      <span className="text-emerald-400 font-bold">{link.realClickCount}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {link.tags && link.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {link.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions: Visit Link, Copy URL, Broken Report, and Admin */}
                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1">
                    {isUrlValid ? (
                      <a
                        href={safeHref!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/10"
                      >
                        <ExternalLink className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>{t.visitLink}</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed border border-slate-700/60 opacity-60"
                        title={t.linkSecurityWarning}
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>{t.invalidUrl}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCopyUrl(link.id, link.url)}
                      className={`p-2 rounded-xl border transition-all ${
                        isCopied
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-600'
                      }`}
                      title={isCopied ? t.copied : t.copyPrompt}
                    >
                      {isCopied ? (
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {/* Report broken link button */}
                    <button
                      type="button"
                      onClick={() => {
                        setReportingLink(link);
                        setReportFeedback(null);
                        setReportNotes('');
                      }}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all"
                      title={t.reportBrokenLink}
                    >
                      <Flag className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1 shrink-0 ps-1">
                      <button
                        type="button"
                        onClick={() => onEditLink(link)}
                        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                        title={t.editLink}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteLink(link.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
                        title={t.deleteLink}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Broken Link Report Modal */}
      {reportingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{t.reportBrokenLink}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReportingLink(null);
                  setReportFeedback(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {reportFeedback ? (
              <div
                className={`py-6 text-center font-bold text-sm space-y-2 ${
                  reportFeedback.isError ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                <div className="flex justify-center">
                  {reportFeedback.isError ? (
                    <AlertTriangle className="h-8 w-8 text-rose-400" />
                  ) : (
                    <Check className="h-8 w-8 text-emerald-400 stroke-[3]" />
                  )}
                </div>
                <p>{reportFeedback.text}</p>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-4 text-xs">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400">{t.websiteLabel}</span>
                  <div className="font-bold text-white text-sm">
                    {reportingLink.title[currentLang] || reportingLink.title.ps || reportingLink.title.en}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 break-all">
                    {reportingLink.url}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5">{t.reportReason}</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 rounded-xl border border-slate-700 p-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="not_opening">{t.linkNotOpening}</option>
                    <option value="outdated">{t.linkOutdated}</option>
                    <option value="other">{t.linkOther}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5">{t.reportNotes}</label>
                  <textarea
                    rows={3}
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    placeholder={t.reportNotesPlaceholder}
                    className="w-full bg-slate-950 text-slate-100 rounded-xl border border-slate-700 p-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    disabled={isSubmittingReport}
                    onClick={() => {
                      setReportingLink(null);
                      setReportFeedback(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReport}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-rose-600/20"
                  >
                    {isSubmittingReport ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>{t.submittingReport}</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>{t.sendReport}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
