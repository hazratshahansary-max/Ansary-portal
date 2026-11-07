import React from 'react';
import { Language, ActiveTab } from '../types';
import { translations } from '../data/translations';
import {
  Sparkles,
  BookOpen,
  Link as LinkIcon,
  Bookmark,
  Shield,
  Search,
  X,
  Globe,
  SlidersHorizontal
} from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  promptsCount: number;
  linksCount: number;
  favoritesCount: number;
  isFilterOpen?: boolean;
  onToggleFilter?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onOpenAdmin,
  isAdminLoggedIn,
  promptsCount,
  linksCount,
  favoritesCount,
  isFilterOpen,
  onToggleFilter
}) => {
  const t = translations[currentLang];
  const isRtl = currentLang === 'ps' || currentLang === 'fa';

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ps', label: 'پښتو', flag: '🇦🇫' },
    { code: 'fa', label: 'دري', flag: '🇦🇫' },
    { code: 'en', label: 'English', flag: '🌐' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar: Brand, Language, Admin */}
        <div className="flex items-center justify-between py-3.5 border-b border-slate-800/60 gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-indigo-600 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white truncate">
                  {t.appName}
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[220px] sm:max-w-md">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Controls: Language Selector & Admin */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
              <Globe className="h-4 w-4 text-slate-400 mx-1.5 hidden sm:inline-block" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-150 ${
                    currentLang === lang.code
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  title={lang.label}
                >
                  <span className="sm:hidden">{lang.code.toUpperCase()}</span>
                  <span className="hidden sm:inline">{lang.label}</span>
                </button>
              ))}
            </div>

            <a href="/" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-800">
              بېرته اصلي وېب‌سایټ ته
            </a>

            {/* Admin Access Button */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                isAdminLoggedIn
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 hover:bg-slate-750'
              }`}
              title={isAdminLoggedIn ? t.adminTitle : t.adminLogin}
            >
              <Shield
                className={`h-3.5 w-3.5 ${
                  isAdminLoggedIn ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-400'
                }`}
              />
              <span className="hidden md:inline">
                {isAdminLoggedIn ? 'اډمین فعال دی' : t.adminLogin}
              </span>
              {isAdminLoggedIn && (
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Bar: Search, Category Tabs, Filter Toggle */}
        <div className="py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/90 overflow-x-auto no-scrollbar">
            {/* Prompts Tab */}
            <button
              onClick={() => onTabChange('prompts')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'prompts'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>{t.promptsTab}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'prompts'
                    ? 'bg-slate-950/20 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {promptsCount}
              </span>
            </button>

            {/* Links Tab */}
            <button
              onClick={() => onTabChange('links')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'links'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LinkIcon className="h-4 w-4" />
              <span>{t.linksTab}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'links'
                    ? 'bg-slate-950/20 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {linksCount}
              </span>
            </button>

            {/* Favorites Tab */}
            <button
              onClick={() => onTabChange('favorites')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'favorites'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              <span>{t.favoritesTab}</span>
              {favoritesCount > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'favorites'
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Search Box & Mobile Filter Button */}
          <div className="flex items-center gap-2 flex-1 md:max-w-md">
            <div className="relative flex-1">
              <div
                className={`absolute inset-y-0 ${
                  isRtl ? 'right-0 pr-3.5' : 'left-0 pl-3.5'
                } flex items-center pointer-events-none text-slate-400`}
              >
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full bg-slate-800/90 text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-xl border border-slate-700/80 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 shadow-inner ${
                  isRtl ? 'pr-9 pl-9' : 'pl-9 pr-9'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className={`absolute inset-y-0 ${
                    isRtl ? 'left-0 pl-2.5' : 'right-0 pr-2.5'
                  } flex items-center text-slate-400 hover:text-white`}
                  title="Clear"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {onToggleFilter && (
              <button
                onClick={onToggleFilter}
                className={`md:hidden p-2.5 rounded-xl border transition-all ${
                  isFilterOpen
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
                title="Filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
