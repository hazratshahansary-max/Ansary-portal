/**
 * Core Type Definitions for Ansary Knowledge
 * Preserves 100% compatibility with existing Supabase schema and LocalStorage structures.
 */

export type Language = 'ps' | 'fa' | 'en';

export interface Post {
  id: string;
  slug: string;
  type: 'news' | 'articles' | 'article' | 'analysis';
  category: 'sports' | 'domestic' | 'technology' | 'international' | 'education' | 'culture' | 'announcements' | string;
  title: string;
  excerpt: string;
  content: string;
  language: Language;
  author: string;
  date: string;
  coverImage: string;
  tags: string[];
  likes: number;
  dislikes: number;
  shares: number;
  views: number;
  featured?: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  pages: number;
  year?: number;
  publicationYear?: number;
  category: string;
  schoolGrade?: number;
  language: Language;
  fileUrl?: string;
  pdfUrl?: string;
  downloads: number;
  likes: number;
  dislikes: number;
  fileSize?: string;
  description?: string;
}

export interface VersePair {
  line1: string;
  line2: string;
}

export interface PoetryItem {
  id: string;
  title: string;
  poet: string;
  era: string;
  verses: VersePair[];
  language: Language;
  genre: string;
  explanation: string;
  audioUrl?: string;
  likes: number;
  dislikes: number;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  language: Language;
  views: number;
  likes: number;
  dislikes: number;
  publishedAt: string;
  category: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  screenshots: string[];
  features: string[];
  techStack: string[];
  contactInfo: {
    email: string;
    phone: string;
    leadEngineer: string;
  };
  databaseType: string;
  securityNotice: string;
  likes: number;
  dislikes: number;
  shares: number;
  demoUrl?: string;
}

export interface CommentItem {
  id: string;
  targetId: string;
  targetType: 'post' | 'book' | 'poetry' | 'video' | 'project' | 'research';
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
  likes: number;
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  field: string;
  author: string;
  institution: string;
  publishDate: string;
  readTime: string;
  downloadUrl?: string;
  language: Language;
  citations: number;
  doi?: string;
  keywords: string[];
}

export interface SiteSettings {
  phone: string;
  address: string;
  whatsapp: string;
  telegram: string;
  emergencyAlert?: string;
  emergencyAlertActive?: boolean;
}

export interface AnalyticsData {
  totalVisitors: number;
  pageViews: number;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  appDownloads: number;
  activeUsers: number;
  sectionViews: Record<string, number>;
  languageCounts: Record<string, number>;
  history: Array<{
    date: string;
    views: number;
    visitors: number;
  }>;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}
