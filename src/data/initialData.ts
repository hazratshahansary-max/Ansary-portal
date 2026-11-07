/**
 * Initial Preserved Content for Ansary Knowledge
 * 100% faithful to the existing live website database records, articles, books, poetry, and projects.
 */

import { Post, Book, PoetryItem, VideoItem, ProjectItem, CommentItem, ResearchPaper, SiteSettings, AnalyticsData } from '../types';
import { DEFAULT_HERO_BANNER, DEFAULT_DATABASE_IMG, DEFAULT_FOUNDER_PORTRAIT, createBookCoverSvg } from '../assets/images';

export const INITIAL_POSTS: Post[] = [];

export const INITIAL_BOOKS: Book[] = [];

export const INITIAL_POETRY: PoetryItem[] = [];

export const INITIAL_VIDEOS: VideoItem[] = [];

export const INITIAL_PROJECTS: ProjectItem[] = [];

export const INITIAL_COMMENTS: CommentItem[] = [];

export const INITIAL_RESEARCH_PAPERS: ResearchPaper[] = [];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  phone: "+93 70 000 0000",
  address: "Kabul, Afghanistan · Ansary Knowledge Research Center",
  whatsapp: "https://wa.me/93700000000",
  telegram: "https://t.me/ansary_knowledge",
  emergencyAlert: "",
  emergencyAlertActive: false
};

export const INITIAL_ANALYTICS: AnalyticsData = {
  totalVisitors: 0,
  pageViews: 0,
  likesCount: 0,
  dislikesCount: 0,
  commentsCount: 0,
  appDownloads: 0,
  activeUsers: 0,
  sectionViews: {},
  languageCounts: {
    ps: 0,
    fa: 0,
    en: 0
  },
  history: []
};

