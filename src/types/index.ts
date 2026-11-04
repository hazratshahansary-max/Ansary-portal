export type Language = 'ps' | 'fa' | 'en';

export type PostType = 'news' | 'article';

export type NewsCategory = 'sports' | 'domestic' | 'international' | 'announcements';

export interface Post {
  id: string;
  slug: string;
  type: PostType;
  category: NewsCategory;
  title: string;
  excerpt: string;
  content: string;
  language: Language;
  author: string;
  date: string;
  coverImage?: string;
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
  description: string;
  coverImage: string;
  pdfUrl?: string;
  language: Language;
  pages: number;
  publicationYear: number;
  category: string;
  downloads: number;
  likes: number;
  dislikes: number;
  fileSize: string;
}

export interface PoetryVerse {
  line1: string;
  line2: string;
}

export interface Poetry {
  id: string;
  title: string;
  poet: string;
  era?: string;
  verses: PoetryVerse[];
  language: Language;
  genre: string; // e.g., Ghazal, Rubai, Qasida
  explanation?: string;
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

export interface Project {
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
    leadEngineer?: string;
  };
  databaseType: string; // e.g. PostgreSQL, Supabase, TimescaleDB, Cloud SQL
  securityNotice: string;
  likes: number;
  dislikes: number;
  shares: number;
  demoUrl?: string;
}

export interface Comment {
  id: string;
  targetId: string;
  targetType: 'post' | 'book' | 'poetry' | 'video' | 'project';
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
  likes: number;
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
  languageCounts: Record<Language, number>;
  history: Array<{ date: string; views: number; visitors: number }>;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastTested?: string;
}
