import React, { useState } from 'react';
import { Language } from '../types';
import { translations, getDir } from '../lib/i18n';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Globe,
  Sun,
  Moon,
  Shield,
  Menu,
  X,
  BookOpen,
  Newspaper,
  Feather,
  Video,
  FileCode,
  FolderGit2,
  User,
  Mail,
  Home,
} from 'lucide-react';

interface Props {
  currentSection: string;
  onNavigate: (section: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<Props> = ({
  currentSection,
  onNavigate,
  language,
  onLanguageChange,
  darkMode,
  onToggleDarkMode,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const t = translations[language];
  const isRtl = getDir(language) === 'rtl';

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'news', label: t.nav.news, icon: Newspaper },
    { id: 'library', label: t.nav.library, icon: BookOpen },
    { id: 'poetry', label: t.nav.poetry, icon: Feather },
    { id: 'projects', label: t.nav.projects, icon: FolderGit2 },
  ];

  const secondaryNavItems = [
    { id: 'videos', label: t.nav.videos, icon: Video },
    { id: 'articles', label: t.nav.articles, icon: FileCode },
    { id: 'about', label: t.nav.about, icon: User },
    { id: 'contact', label: t.nav.contact, icon: Mail },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const languageLabels: Record<Language, { native: string; code: string }> = {
    ps: { native: 'پښتو', code: 'PS' },
    fa: { native: 'دری', code: 'FA' },
    en: { native: 'English', code: 'EN' },
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#070D1E]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: 3 zones */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Element */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B192C] to-[#102A4C] p-1.5 border border-amber-400/40 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
                <img src="/icon.svg" alt="ANSARY Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-wider text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
                  ANSARY
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight -mt-1 hidden sm:inline">
                  {t.slogan}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Primary Nav Links (whitespace-nowrap) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  currentSection === item.id
                    ? 'text-blue-600 dark:text-amber-400 font-semibold border-b-2 border-blue-600 dark:border-amber-400'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* More dropdown for additional sections */}
            <div className="relative group">
              <button className="whitespace-nowrap shrink-0 py-1 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1">
                <span>{language === 'ps' ? 'نور برخې' : language === 'fa' ? 'سایر بخش‌ها' : 'More'}</span>
                <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute top-full right-0 [dir=rtl]:right-auto [dir=rtl]:left-0 mt-1 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 hidden group-hover:block animate-in fade-in">
                {secondaryNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="w-full text-left [dir=rtl]:text-right px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Zone 3: Essential Controls (Language, Theme, PWA Install, Admin) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* PWA Install Button */}
            <PWAInstallButton language={language} variant="nav" />

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                title={t.actions.filterByLanguage}
              >
                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                <span className="uppercase font-mono">{languageLabels[language].code}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute top-full right-0 [dir=rtl]:right-auto [dir=rtl]:left-0 mt-1 w-32 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 animate-in fade-in duration-150">
                  {(['ps', 'fa', 'en'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        onLanguageChange(lang);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left [dir=rtl]:text-right px-3 py-1.5 text-xs font-medium flex items-center justify-between ${
                        language === lang
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-amber-400 font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{languageLabels[lang].native}</span>
                      <span className="font-mono text-[10px] text-slate-400">{languageLabels[lang].code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Admin Dashboard Entry */}
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
              title={t.nav.admin}
            >
              <Shield className="w-4 h-4 text-blue-600 dark:text-amber-400" />
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              aria-label="Open Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070D1E] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
            Navigation
          </p>
          {[...navItems, ...secondaryNavItems].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition text-left [dir=rtl]:text-right ${
                  currentSection === item.id
                    ? 'bg-blue-600 text-white dark:bg-amber-500 dark:text-slate-950 font-bold shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
