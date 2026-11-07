/**
 * Ansary Knowledge - Main Application Entry
 * Official multilingual knowledge portal, digital library, poetry archive, and database architecture showcase.
 * Founded by Hazrat Shah Ansary.
 */

import React, { useState, useEffect } from 'react';
import { Language, Post, Book, PoetryItem, VideoItem, ProjectItem, ResearchPaper, SiteSettings } from './types';
import {
  initializeStorage,
  subscribeToStorage,
  getPosts,
  getBooks,
  getPoetry,
  getVideos,
  getProjects,
  getResearchPapers,
  getSiteSettings,
  trackSectionView
} from './lib/storage';
import { getDirection } from './data/translations';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { NewsSection } from './components/NewsSection';
import { LibrarySection } from './components/LibrarySection';
import { ResearchSection } from './components/ResearchSection';
import { PoetrySection } from './components/PoetrySection';
import { VideosSection } from './components/VideosSection';
import { ArticlesSection } from './components/ArticlesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PostModal } from './components/PostModal';
import { AdminModal } from './components/AdminModal';
import { OfflineBanner } from './components/OfflineBanner';

export default function App() {
  // 1. Initialize Storage & Service Worker
  useEffect(() => {
    initializeStorage();

    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => console.log('Ansary Knowledge ServiceWorker registered:', reg.scope))
        .catch(err => console.log('Ansary Knowledge ServiceWorker registration note:', err));
    }
  }, []);

  // 2. State & Language Preferences
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('ansary_language');
    return saved === 'ps' || saved === 'fa' || saved === 'en' ? saved : 'ps';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ansary_theme');
    if (saved) return saved === 'dark';
    return true; // Default to rich modern dark mode
  });

  const [currentSection, setCurrentSection] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedProjectForInquiry, setSelectedProjectForInquiry] = useState<ProjectItem | null>(null);

  // Content state loaded from LocalStorage (with Supabase backup)
  const [posts, setPosts] = useState<Post[]>(() => getPosts());
  const [books, setBooks] = useState<Book[]>(() => getBooks());
  const [poetryList, setPoetryList] = useState<PoetryItem[]>(() => getPoetry());
  const [videos, setVideos] = useState<VideoItem[]>(() => getVideos());
  const [projects, setProjects] = useState<ProjectItem[]>(() => getProjects());
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>(() => getResearchPapers());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getSiteSettings());

  // Subscribe to storage changes
  useEffect(() => {
    return subscribeToStorage(() => {
      setPosts(getPosts());
      setBooks(getBooks());
      setPoetryList(getPoetry());
      setVideos(getVideos());
      setProjects(getProjects());
      setResearchPapers(getResearchPapers());
      setSiteSettings(getSiteSettings());
    });
  }, []);

  // Sync Language & RTL direction
  useEffect(() => {
    localStorage.setItem('ansary_language', language);
    const dir = getDirection(language);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Sync Dark Mode class
  useEffect(() => {
    localStorage.setItem('ansary_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Section Navigation Handler
  const handleNavigate = (sectionId: string) => {
    setCurrentSection(sectionId);
    trackSectionView(sectionId);

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleInquireProject = (project: ProjectItem) => {
    setSelectedProjectForInquiry(project);
    handleNavigate('contact');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D1E] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Offline Toast */}
      <OfflineBanner language={language} />

      {/* Global Header */}
      <Header
        currentSection={currentSection}
        onNavigate={handleNavigate}
        language={language}
        onLanguageChange={setLanguage}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSearch={() => {
          handleNavigate('home');
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Showcase with Search & Metrics */}
        <Hero
          language={language}
          featuredPosts={posts}
          totalBooks={books.length}
          siteSettings={siteSettings}
          onNavigate={handleNavigate}
          onSelectPost={post => setSelectedPost(post)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 2. Latest News & Domestic Analysis */}
        <NewsSection
          posts={posts}
          language={language}
          onSelectPost={post => setSelectedPost(post)}
          searchFilter={searchQuery}
        />

        {/* 3. Maktaba Digital Library (PDFs & Books) */}
        <LibrarySection
          books={books}
          language={language}
          onOpenAdminUpload={() => setIsAdminOpen(true)}
          searchFilter={searchQuery}
        />

        {/* 4. NEW: Scientific Research & Technical Whitepapers */}
        <ResearchSection
          papers={researchPapers}
          language={language}
          searchFilter={searchQuery}
        />

        {/* 5. Poetry & Classical Cultural Heritage */}
        <PoetrySection
          poetryList={poetryList}
          language={language}
          searchFilter={searchQuery}
        />

        {/* 6. Video Academy & Lecture Series */}
        <VideosSection
          videos={videos}
          language={language}
        />

        {/* 7. Educational & Software Architecture Articles */}
        <ArticlesSection
          posts={posts}
          language={language}
          onSelectPost={post => setSelectedPost(post)}
          searchFilter={searchQuery}
        />

        {/* 8. Enterprise Database Architectures & Systems */}
        <ProjectsSection
          projects={projects}
          language={language}
          onInquire={handleInquireProject}
        />

        {/* 9. Founder Biography & Qualifications */}
        <AboutSection
          language={language}
          onContactClick={() => handleNavigate('contact')}
        />

        {/* 10. Contact Coordinates & Inquiries */}
        <ContactSection
          language={language}
          siteSettings={siteSettings}
          selectedProject={selectedProjectForInquiry}
        />
      </main>

      {/* Global Footer */}
      <Footer
        language={language}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Reader Modal for Articles & Publications */}
      <PostModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        language={language}
      />

      {/* Admin Management Suite & Upload Portal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
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
