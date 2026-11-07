import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Language,
  ActiveTab,
  PromptItem,
  LinkItem,
  UserRole,
  OperationResult
} from './types';
import { translations } from './data/translations';
import {
  getStoredLanguage,
  setStoredLanguage,
  getStoredPrompts,
  setStoredPrompts,
  getStoredLinks,
  setStoredLinks,
  getStoredFavorites,
  toggleFavoriteItem,
  restoreDefaultData
} from './lib/storage';
import {
  supabase,
  isSupabaseConfigured,
  checkUserRole,
  checkIsAdminUser,
  fetchSupabasePrompts,
  fetchSupabaseLinks,
  upsertSupabasePrompt,
  deleteSupabasePrompt,
  upsertSupabaseLink,
  deleteSupabaseLink
} from './lib/supabase';
import { Header } from './components/Header';
import { PromptsSection } from './components/PromptsSection';
import { LinksSection } from './components/LinksSection';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import {
  BookOpen,
  Link as LinkIcon,
  Bookmark,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>(getStoredLanguage());
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
  const tab = new URLSearchParams(window.location.search).get('tab');

  if (tab === 'links' || tab === 'favorites') {
    return tab;
  }

  return 'prompts';
});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminUserEmail, setAdminUserEmail] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<UserRole | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptItem | null>(null);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Initialize and sync data
  const initializeData = useCallback(async () => {
    // 1. Initial load from local storage
    const localP = getStoredPrompts();
    const localL = getStoredLinks();
    setPrompts(localP);
    setLinks(localL);
    setFavorites(getStoredFavorites());

    // 2. Check Supabase auth session (STRICT Server-authoritative role verification)
    if (supabase && isSupabaseConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { isAdmin, role } = await checkUserRole(session.user);
          if (isAdmin && role) {
            setIsAdminLoggedIn(true);
            setAdminRole(role);
            setAdminUserEmail(session.user.email || null);
          } else {
            setIsAdminLoggedIn(false);
            setAdminRole(null);
            setAdminUserEmail(null);
          }
        }

        // 3. Try to sync prompts & links from Supabase
        const remoteP = await fetchSupabasePrompts();
        // An empty array is a valid remote result (the collection may have
        // been intentionally cleared). Only null means the fetch failed.
        if (remoteP !== null) {
          setPrompts(remoteP);
          setStoredPrompts(remoteP);
        }

        const remoteL = await fetchSupabaseLinks();
        if (remoteL !== null) {
          setLinks(remoteL);
          setStoredLinks(remoteL);
        }
      } catch (err) {
        console.warn('Supabase initialization skipped or offline', err);
      }
    } else {
      // Offline mode: No unauthenticated admin access allowed
      setIsAdminLoggedIn(false);
      setAdminRole(null);
      setAdminUserEmail(null);
    }
  }, []);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Subscribe once and always release the listener when the app unmounts.
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer role lookup out of the auth callback to avoid blocking Supabase auth.
      Promise.resolve().then(async () => {
        if (!session?.user) {
          setIsAdminLoggedIn(false);
          setAdminRole(null);
          setAdminUserEmail(null);
          return;
        }
        const { isAdmin, role } = await checkUserRole(session.user);
        setIsAdminLoggedIn(Boolean(isAdmin && role));
        setAdminRole(isAdmin ? role : null);
        setAdminUserEmail(isAdmin ? (session.user.email || null) : null);
      }).catch((error) => console.warn('Auth state update failed:', error));
    });
    return () => subscription.unsubscribe();
  }, []);

  // Update HTML direction and language attribute
  useEffect(() => {
    const isRtl = currentLang === 'ps' || currentLang === 'fa';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    if (currentLang === 'ps') {
      document.title = 'Ansary Knowledge - د فرامپټونو او ګټورو لینکونو مرجع';
    } else if (currentLang === 'fa') {
      document.title = 'Ansary Knowledge - مرجع پرامپت‌ها و لینک‌های کاربردی';
    } else {
      document.title = 'Ansary Knowledge - AI Prompts & Useful Resources';
    }
  }, [currentLang]);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    setStoredLanguage(lang);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = toggleFavoriteItem(id);
    setFavorites(updated);
  };

  // Prompt actions with dual sync & explicit verification
  const handleSavePrompt = async (newPrompt: PromptItem): Promise<OperationResult> => {
    if (supabase && isSupabaseConfigured) {
      const res = await upsertSupabasePrompt(newPrompt);
      if (!res.success) {
        return res;
      }
    }

    const exists = prompts.some((p) => p.id === newPrompt.id);
    const updated = exists
      ? prompts.map((p) => (p.id === newPrompt.id ? newPrompt : p))
      : [newPrompt, ...prompts];

    setPrompts(updated);
    setStoredPrompts(updated);
    return { success: true };
  };

  const handleDeletePrompt = async (id: string): Promise<OperationResult> => {
    if (supabase && isSupabaseConfigured) {
      const res = await deleteSupabasePrompt(id);
      if (!res.success) {
        return res;
      }
    }

    const updated = prompts.filter((p) => p.id !== id);
    setPrompts(updated);
    setStoredPrompts(updated);
    return { success: true };
  };

  // Link actions with dual sync & explicit verification
  const handleSaveLink = async (newLink: LinkItem): Promise<OperationResult> => {
    if (supabase && isSupabaseConfigured) {
      const res = await upsertSupabaseLink(newLink);
      if (!res.success) {
        return res;
      }
    }

    const exists = links.some((l) => l.id === newLink.id);
    const updated = exists
      ? links.map((l) => (l.id === newLink.id ? newLink : l))
      : [newLink, ...links];

    setLinks(updated);
    setStoredLinks(updated);
    return { success: true };
  };

  const handleDeleteLink = async (id: string): Promise<OperationResult> => {
    if (supabase && isSupabaseConfigured) {
      const res = await deleteSupabaseLink(id);
      if (!res.success) {
        return res;
      }
    }

    const updated = links.filter((l) => l.id !== id);
    setLinks(updated);
    setStoredLinks(updated);
    return { success: true };
  };

  // Restore defaults
  const handleResetDefaults = () => {
    const { prompts: p, links: l } = restoreDefaultData();
    setPrompts(p);
    setLinks(l);
  };

  // Admin login / logout
  const handleLoginSuccess = (email?: string, role?: UserRole) => {
    setIsAdminLoggedIn(true);
    setAdminRole(role || 'admin');
    setAdminUserEmail(email || 'Admin');
  };

  const handleLogout = async () => {
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Sign out error', err);
      }
    }
    setIsAdminLoggedIn(false);
    setAdminRole(null);
    setAdminUserEmail(null);
    setIsAdminModalOpen(false);
  };

  const handleDataImported = (importedPrompts: PromptItem[], importedLinks: LinkItem[]) => {
    setPrompts(importedPrompts);
    setLinks(importedLinks);
  };

  const t = translations[currentLang];

  const visiblePrompts = useMemo(
    () => (isAdminLoggedIn ? prompts : prompts.filter((p) => !p.isDraft)),
    [prompts, isAdminLoggedIn]
  );
  const visibleLinks = useMemo(
    () => (isAdminLoggedIn ? links : links.filter((l) => !l.isDraft)),
    [links, isAdminLoggedIn]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        promptsCount={visiblePrompts.length}
        linksCount={visibleLinks.length}
        favoritesCount={favorites.length}
        isFilterOpen={isFilterOpen}
        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 sm:p-8 mb-6 shadow-xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>د Ansary Knowledge نوې ډیجیټل سرچینه</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {activeTab === 'prompts' && (
                  <span>{t.promptsTab} - غوره او چمتو شوي فرامپټونه</span>
                )}
                {activeTab === 'links' && (
                  <span>{t.linksTab} - د AI او ټکنالوژۍ معتبرې سرچینې</span>
                )}
                {activeTab === 'favorites' && (
                  <span>{t.favoritesTab} - ستاسو شخصي ټولګه</span>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.aboutDesc}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 p-3 sm:p-4 rounded-2xl text-center shadow-md">
                <div className="flex items-center justify-center text-amber-400 mb-1">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-white">
                  {visiblePrompts.length}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400">
                  {t.statsPrompts}
                </div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 p-3 sm:p-4 rounded-2xl text-center shadow-md">
                <div className="flex items-center justify-center text-indigo-400 mb-1">
                  <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-white">
                  {visibleLinks.length}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400">
                  {t.statsLinks}
                </div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 p-3 sm:p-4 rounded-2xl text-center shadow-md">
                <div className="flex items-center justify-center text-emerald-400 mb-1">
                  <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-white">
                  {favorites.length}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400">
                  {t.statsFavorites}
                </div>
              </div>
            </div>
          </div>
        </section>

        {activeTab === 'prompts' && (
          <PromptsSection
            prompts={visiblePrompts}
            currentLang={currentLang}
            searchQuery={searchQuery}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            isAdmin={isAdminLoggedIn}
            onEditPrompt={(prompt) => {
              setEditingPrompt(prompt);
              setIsAdminModalOpen(true);
            }}
            onDeletePrompt={handleDeletePrompt}
            onAddNewPrompt={() => {
              setEditingPrompt(null);
              setIsAdminModalOpen(true);
            }}
          />
        )}

        {activeTab === 'links' && (
          <LinksSection
            links={visibleLinks}
            currentLang={currentLang}
            searchQuery={searchQuery}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            isAdmin={isAdminLoggedIn}
            onEditLink={(link) => {
              setEditingLink(link);
              setIsAdminModalOpen(true);
            }}
            onDeleteLink={handleDeleteLink}
            onAddNewLink={() => {
              setEditingLink(null);
              setIsAdminModalOpen(true);
            }}
          />
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-10 py-4">
            <div>
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
                <BookOpen className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  خوښ شوي فرامپټونه ({visiblePrompts.filter((p) => favorites.includes(p.id)).length})
                </h3>
              </div>
              <PromptsSection
                prompts={visiblePrompts}
                currentLang={currentLang}
                searchQuery={searchQuery}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                isAdmin={isAdminLoggedIn}
                onEditPrompt={(prompt) => {
                  setEditingPrompt(prompt);
                  setIsAdminModalOpen(true);
                }}
                onDeletePrompt={handleDeletePrompt}
                onAddNewPrompt={() => {
                  setEditingPrompt(null);
                  setIsAdminModalOpen(true);
                }}
                showOnlyFavorites={true}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
                <LinkIcon className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">
                  خوښ شوي لینکونه ({visibleLinks.filter((l) => favorites.includes(l.id)).length})
                </h3>
              </div>
              <LinksSection
                links={visibleLinks}
                currentLang={currentLang}
                searchQuery={searchQuery}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                isAdmin={isAdminLoggedIn}
                onEditLink={(link) => {
                  setEditingLink(link);
                  setIsAdminModalOpen(true);
                }}
                onDeleteLink={handleDeleteLink}
                onAddNewLink={() => {
                  setEditingLink(null);
                  setIsAdminModalOpen(true);
                }}
                showOnlyFavorites={true}
              />
            </div>
          </div>
        )}
      </main>

      <Footer
        currentLang={currentLang}
        onTabChange={setActiveTab}
        promptsCount={visiblePrompts.length}
        linksCount={visibleLinks.length}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          setEditingPrompt(null);
          setEditingLink(null);
        }}
        currentLang={currentLang}
        isAdminLoggedIn={isAdminLoggedIn}
        adminUserEmail={adminUserEmail}
        adminRole={adminRole}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        prompts={prompts}
        links={links}
        onSavePrompt={handleSavePrompt}
        onDeletePrompt={handleDeletePrompt}
        onSaveLink={handleSaveLink}
        onDeleteLink={handleDeleteLink}
        onResetDefaults={handleResetDefaults}
        editingPromptItem={editingPrompt}
        editingLinkItem={editingLink}
        onClearEditing={() => {
          setEditingPrompt(null);
          setEditingLink(null);
        }}
        onDataImported={handleDataImported}
      />
    </div>
  );
}
