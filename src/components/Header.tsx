import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language } from '../types';
import {
  BookOpen,
  Search,
  Moon,
  Sun,
  Shield,
  Menu,
  X,
  Globe,
  Sparkles,
  Newspaper,
  Feather,
  Video,
  FileText,
  Layers,
  Info,
  Mail,
  GraduationCap
} from 'lucide-react';

interface HeaderProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAdmin: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  onNavigate,
  language,
  onLanguageChange,
  darkMode,
  onToggleDarkMode,
  onOpenAdmin,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const navItems = [
    { id: 'home', label: t.nav.home, icon: BookOpen },
    { id: 'news', label: t.nav.news, icon: Newspaper },
    { id: 'library', label: t.nav.library, icon: BookOpen },
    { id: 'research', label: (t.nav as any).research || 'Research', icon: GraduationCap },
    { id: 'poetry', label: t.nav.poetry, icon: Feather },
    { id: 'videos', label: t.nav.videos, icon: Video },
    { id: 'articles', label: t.nav.articles, icon: FileText },
    { id: 'projects', label: t.nav.projects, icon: Layers },
    { id: 'about', label: t.nav.about, icon: Info },
    { id: 'contact', label: t.nav.contact, icon: Mail }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'ps', name: 'Pashto', nativeName: 'پښتو' },
    { code: 'fa', name: 'Dari / Persian', nativeName: 'دری / فارسی' },
    { code: 'en', name: 'English', nativeName: 'English' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 dark:bg-[#070D1E]/95 border-b border-blue-100 dark:border-blue-950/60 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-950 p-2 shadow-lg shadow-blue-500/10 border border-blue-400/30 flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/icon.svg" alt="Ansary Knowledge Crest" className="w-full h-full object-contain" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white dark:border-[#070D1E] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {t.brandName}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-blue-600 dark:text-amber-400/90 font-medium line-clamp-1 max-w-[220px] sm:max-w-xs">
                {t.slogan}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.slice(0, 8).map(item => {
              const active = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Controls: Search, Lang, Theme, Admin */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium transition"
              title="Search"
            >
              <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden md:inline text-[11px]">{(t.actions as any)?.searchPlaceholder?.slice(0, 10) || 'Search'}...</span>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-700 transition"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                <span className="uppercase">{language}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onLanguageChange(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-start text-xs font-medium flex items-center justify-between ${
                        language === l.code
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{l.nativeName}</span>
                      <span className="text-[10px] text-slate-400 uppercase">{l.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>

            {/* Admin Portal Launcher */}
            <button
              onClick={onOpenAdmin}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.nav.admin}</span>
            </button>

            {/* AI Prompts & Useful Links Portal */}
            <a
              href="/resources.html"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm transition-all"
            >
              <span>AI پرامپټونه او ګټور لینکونه</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070D1E] px-4 pt-3 pb-6 space-y-1.5 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-1.5 pb-3">
            {navItems.map(item => {
              const active = currentSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-start transition ${
                    active
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
            <a href="/resources.html" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold">
              AI پرامپټونه او ګټور لینکونه
            </a>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-xs font-bold"
            >
              <Shield className="w-4 h-4 text-amber-300" />
              <span>{t.admin.dashboardTitle || 'Admin Management Portal'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
