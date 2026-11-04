import React, { useState, useEffect } from 'react';
import {
  Language,
  Post,
  Book,
  Poetry,
  VideoItem,
  Project,
} from './types';
import {
  initStorage,
  subscribeStorage,
  getPosts,
  getBooks,
  getPoetry,
  getVideos,
  getProjects,
  trackPageView,
} from './lib/storage';
import { getDir } from './lib/i18n';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { NewsSection } from './components/NewsSection';
import { LibrarySection } from './components/LibrarySection';
import { PoetrySection } from './components/PoetrySection';
import { VideosSection } from './components/VideosSection';
import { ProjectsSection } from './components/ProjectsSection';
import { AboutMeSection } from './components/AboutMeSection';
import { ContactSection } from './components/ContactSection';
import { AdminDashboard } from './components/AdminDashboard';
import { ItemDetailModal } from './components/ItemDetailModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Footer } from './components/Footer';

export default function App() {
  // Initialize storage once on mount
  useEffect(() => {
    initStorage();

    // Register PWA service worker if available in navigator
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('ANSARY ServiceWorker registered:', reg.scope))
        .catch((err) => console.log('ANSARY ServiceWorker registration failed:', err));
    }
  }, []);

  // Language state (defaults to Pashto per regional requirement, with quick toggle to Dari and English)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('ansary_language') as Language;
    return saved === 'ps' || saved === 'fa' || saved === 'en' ? saved : 'ps';
  });

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ansary_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Navigation state
  const [currentSection, setCurrentSection] = useState('home');

  // Admin Modal state
  const [adminOpen, setAdminOpen] = useState(false);

  // Selected Post for Full Detail Modal
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Selected Project for Contact Inquiry
  const [inquiryProject, setInquiryProject] = useState<Project | null>(null);

  // Reactive Data
  const [posts, setPosts] = useState<Post[]>(() => getPosts());
  const [books, setBooks] = useState<Book[]>(() => getBooks());
  const [poetryList, setPoetryList] = useState<Poetry[]>(() => getPoetry());
  const [videos, setVideos] = useState<VideoItem[]>(() => getVideos());
  const [projects, setProjects] = useState<Project[]>(() => getProjects());

  // Subscribe to storage updates
  useEffect(() => {
    const unsubscribe = subscribeStorage(() => {
      setPosts(getPosts());
      setBooks(getBooks());
      setPoetryList(getPoetry());
      setVideos(getVideos());
      setProjects(getProjects());
    });
    return unsubscribe;
  }, []);

  // Update HTML document attributes on language change
  useEffect(() => {
    localStorage.setItem('ansary_language', language);
    const dir = getDir(language);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Update Dark mode class on root element
  useEffect(() => {
    localStorage.setItem('ansary_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleNavigate = (sectionId: string) => {
    setCurrentSection(sectionId);
    trackPageView(sectionId);

    // Scroll smoothly to target element
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleInquireProject = (project: Project) => {
    setInquiryProject(project);
    handleNavigate('contact');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D1E] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Offline Status Toast */}
      <OfflineIndicator language={language} />

      {/* Top Bar Header */}
      <Header
        currentSection={currentSection}
        onNavigate={handleNavigate}
        language={language}
        onLanguageChange={setLanguage}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section & Marquee */}
        <Hero
          language={language}
          featuredPosts={posts}
          onNavigate={handleNavigate}
          onSelectPost={(post) => setSelectedPost(post)}
        />

        {/* 2. Latest News */}
        <NewsSection
          posts={posts}
          language={language}
          onSelectPost={(post) => setSelectedPost(post)}
          sectionType="news"
        />

        {/* 3. Books & Library */}
        <LibrarySection
          books={books}
          language={language}
        />

        {/* 4. Poetry & Cultural Heritage */}
        <PoetrySection
          poetryList={poetryList}
          language={language}
        />

        {/* 5. Featured Videos */}
        <VideosSection
          videos={videos}
          language={language}
        />

        {/* 6. Articles & Educational Information */}
        <NewsSection
          posts={posts}
          language={language}
          onSelectPost={(post) => setSelectedPost(post)}
          sectionType="articles"
        />

        {/* 7. Our Projects (Database Advertisements & Portfolios) */}
        <ProjectsSection
          projects={projects}
          language={language}
          onInquire={handleInquireProject}
        />

        {/* 8. About Me (Hazrat Shah Ansary) */}
        <AboutMeSection
          language={language}
          onContactClick={() => handleNavigate('contact')}
        />

        {/* 9. Contact Us */}
        <ContactSection
          language={language}
          selectedProject={inquiryProject}
        />
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Modals */}
      <ItemDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        language={language}
      />

      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        language={language}
        posts={posts}
        books={books}
        poetryList={poetryList}
        videos={videos}
        projects={projects}
      />
    </div>
  );
}
