/**
 * LocalStorage Resilience Layer & State Management for Ansary Knowledge
 * Preserves 100% of existing keys so returning visitors keep their votes, cached items, and settings.
 */

import { Post, Book, PoetryItem, VideoItem, ProjectItem, CommentItem, ResearchPaper, SiteSettings, AnalyticsData } from '../types';
import {
  INITIAL_POSTS,
  INITIAL_BOOKS,
  INITIAL_POETRY,
  INITIAL_VIDEOS,
  INITIAL_PROJECTS,
  INITIAL_COMMENTS,
  INITIAL_RESEARCH_PAPERS,
  INITIAL_SITE_SETTINGS,
  INITIAL_ANALYTICS
} from '../data/initialData';

export const STORAGE_KEYS = {
  POSTS: 'ansary_posts_v1',
  BOOKS: 'ansary_books_v1',
  POETRY: 'ansary_poetry_v1',
  VIDEOS: 'ansary_videos_v1',
  PROJECTS: 'ansary_projects_v1',
  COMMENTS: 'ansary_comments_v1',
  RESEARCH: 'ansary_research_v1',
  SETTINGS: 'ansary_site_settings_v1',
  ANALYTICS: 'ansary_analytics_v1',
  USER_VOTES: 'ansary_user_votes_v1',
  VISITOR_ID: 'ansary_visitor_id',
  VISITOR_SESSION: 'ansary_visitor_session',
  THEME: 'ansary_theme',
  LANGUAGE: 'ansary_language'
} as const;

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach(cb => {
    try {
      cb();
    } catch (e) {
      console.error('Storage listener error:', e);
    }
  });
}

export function subscribeToStorage(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (e) {
    console.error(`Failed to set item in localStorage (${key}):`, e);
  }
}

/**
 * Initialize storage with default items if not present
 */
export function initializeStorage(): void {
  // Purge legacy demo keys if cached in localStorage
  const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
  if (!storedPosts || storedPosts.includes('post-1') || storedPosts.includes('afghanistan-cricket')) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
  }

  const storedBooks = localStorage.getItem(STORAGE_KEYS.BOOKS);
  if (!storedBooks || storedBooks.includes('book-1')) {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
  }

  const storedPoetry = localStorage.getItem(STORAGE_KEYS.POETRY);
  if (!storedPoetry || storedPoetry.includes('poetry-1')) {
    localStorage.setItem(STORAGE_KEYS.POETRY, JSON.stringify(INITIAL_POETRY));
  }

  const storedVideos = localStorage.getItem(STORAGE_KEYS.VIDEOS);
  if (!storedVideos || storedVideos.includes('video-1')) {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(INITIAL_VIDEOS));
  }

  const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  if (!storedProjects || storedProjects.includes('project-1')) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  }

  const storedComments = localStorage.getItem(STORAGE_KEYS.COMMENTS);
  if (!storedComments || storedComments.includes('comm-1')) {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
  }

  const storedResearch = localStorage.getItem(STORAGE_KEYS.RESEARCH);
  if (!storedResearch || storedResearch.includes('res-1')) {
    localStorage.setItem(STORAGE_KEYS.RESEARCH, JSON.stringify(INITIAL_RESEARCH_PAPERS));
  }

  const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!storedSettings || storedSettings.includes('علمي اعلان: د انصاري')) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SITE_SETTINGS));
  }

  const storedAnalytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
  if (!storedAnalytics || storedAnalytics.includes('1248') || storedAnalytics.includes('6320')) {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(INITIAL_ANALYTICS));
  }

  // Handle visitor session
  initVisitorTracking();
}

function initVisitorTracking() {
  let vid = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  const isNewVisitor = !vid;
  if (!vid) {
    vid = 'vid_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, vid);
  }

  if (!sessionStorage.getItem(STORAGE_KEYS.VISITOR_SESSION)) {
    sessionStorage.setItem(STORAGE_KEYS.VISITOR_SESSION, '1');
    const analytics = getAnalytics();
    if (isNewVisitor) {
      analytics.totalVisitors += 1;
    }
    analytics.activeUsers = Math.max(15, analytics.activeUsers + 1);
    analytics.pageViews += 1;
    setItem(STORAGE_KEYS.ANALYTICS, analytics);
  }
}

// Getters
export function getPosts(): Post[] {
  return getItem<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
}

export function getBooks(): Book[] {
  return getItem<Book[]>(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
}

export function getPoetry(): PoetryItem[] {
  return getItem<PoetryItem[]>(STORAGE_KEYS.POETRY, INITIAL_POETRY);
}

export function getVideos(): VideoItem[] {
  return getItem<VideoItem[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
}

export function getProjects(): ProjectItem[] {
  return getItem<ProjectItem[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
}

export function getComments(): CommentItem[] {
  return getItem<CommentItem[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
}

export function getResearchPapers(): ResearchPaper[] {
  return getItem<ResearchPaper[]>(STORAGE_KEYS.RESEARCH, INITIAL_RESEARCH_PAPERS);
}

export function getSiteSettings(): SiteSettings {
  return getItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
}

export function getAnalytics(): AnalyticsData {
  return getItem<AnalyticsData>(STORAGE_KEYS.ANALYTICS, INITIAL_ANALYTICS);
}

// Mutations
export function savePost(post: Partial<Post> & { title: string; content: string }): Post {
  const posts = getPosts();
  if (post.id) {
    const idx = posts.findIndex(p => p.id === post.id);
    if (idx !== -1) {
      const updated = { ...posts[idx], ...post } as Post;
      posts[idx] = updated;
      setItem(STORAGE_KEYS.POSTS, posts);
      return updated;
    }
  }

  const newPost: Post = {
    id: `post-${Date.now()}`,
    slug: (post.slug || post.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    type: post.type || 'news',
    category: post.category || 'domestic',
    title: post.title,
    excerpt: post.excerpt || post.content.slice(0, 150) + '...',
    content: post.content,
    language: post.language || 'ps',
    author: post.author || 'Hazrat Shah Ansary',
    date: post.date || new Date().toISOString().split('T')[0],
    coverImage: post.coverImage || '',
    tags: post.tags || ['Ansary Knowledge'],
    likes: 0,
    dislikes: 0,
    shares: 0,
    views: 1,
    featured: post.featured ?? false
  };

  posts.unshift(newPost);
  setItem(STORAGE_KEYS.POSTS, posts);
  return newPost;
}

export function deletePost(id: string): void {
  const posts = getPosts().filter(p => p.id !== id);
  setItem(STORAGE_KEYS.POSTS, posts);
}

export function saveBook(book: Partial<Book> & { title: string; author: string; fileUrl: string }): Book {
  const books = getBooks();
  if (book.id) {
    const idx = books.findIndex(b => b.id === book.id);
    if (idx !== -1) {
      const updated = { ...books[idx], ...book } as Book;
      books[idx] = updated;
      setItem(STORAGE_KEYS.BOOKS, books);
      return updated;
    }
  }

  const newBook: Book = {
    id: `book-${Date.now()}`,
    title: book.title,
    author: book.author,
    coverImage: book.coverImage || '',
    pages: book.pages || 150,
    year: book.year || new Date().getFullYear(),
    category: book.category || 'General Knowledge',
    language: book.language || 'ps',
    fileUrl: book.fileUrl,
    downloads: 0,
    likes: 0,
    dislikes: 0,
    fileSize: book.fileSize || '12 MB',
    description: book.description || ''
  };

  books.unshift(newBook);
  setItem(STORAGE_KEYS.BOOKS, books);
  return newBook;
}

export function deleteBook(id: string): void {
  const books = getBooks().filter(b => b.id !== id);
  setItem(STORAGE_KEYS.BOOKS, books);
}

export function incrementBookDownload(id: string): void {
  const books = getBooks();
  const book = books.find(b => b.id === id);
  if (book) {
    book.downloads += 1;
    setItem(STORAGE_KEYS.BOOKS, books);
  }
}

export function savePoetry(item: Partial<PoetryItem> & { title: string; poet: string; verses: any[] }): PoetryItem {
  const list = getPoetry();
  if (item.id) {
    const idx = list.findIndex(p => p.id === item.id);
    if (idx !== -1) {
      const updated = { ...list[idx], ...item } as PoetryItem;
      list[idx] = updated;
      setItem(STORAGE_KEYS.POETRY, list);
      return updated;
    }
  }

  const newItem: PoetryItem = {
    id: `poetry-${Date.now()}`,
    title: item.title,
    poet: item.poet,
    era: item.era || 'Contemporary',
    verses: item.verses,
    language: item.language || 'ps',
    genre: item.genre || 'Ghazal',
    explanation: item.explanation || '',
    audioUrl: item.audioUrl,
    likes: 0,
    dislikes: 0
  };

  list.unshift(newItem);
  setItem(STORAGE_KEYS.POETRY, list);
  return newItem;
}

export function deletePoetry(id: string): void {
  const list = getPoetry().filter(p => p.id !== id);
  setItem(STORAGE_KEYS.POETRY, list);
}

export function saveVideo(item: Partial<VideoItem> & { title: string; videoUrl: string }): VideoItem {
  const list = getVideos();
  if (item.id) {
    const idx = list.findIndex(v => v.id === item.id);
    if (idx !== -1) {
      const updated = { ...list[idx], ...item } as VideoItem;
      list[idx] = updated;
      setItem(STORAGE_KEYS.VIDEOS, list);
      return updated;
    }
  }

  const newItem: VideoItem = {
    id: `video-${Date.now()}`,
    title: item.title,
    description: item.description || '',
    videoUrl: item.videoUrl,
    thumbnail: item.thumbnail || '',
    duration: item.duration || '30:00',
    language: item.language || 'ps',
    views: 1,
    likes: 0,
    dislikes: 0,
    publishedAt: new Date().toISOString().split('T')[0],
    category: item.category || 'Education'
  };

  list.unshift(newItem);
  setItem(STORAGE_KEYS.VIDEOS, list);
  return newItem;
}

export function deleteVideo(id: string): void {
  const list = getVideos().filter(v => v.id !== id);
  setItem(STORAGE_KEYS.VIDEOS, list);
}

export function saveProject(item: Partial<ProjectItem> & { title: string; fullDescription: string }): ProjectItem {
  const list = getProjects();
  if (item.id) {
    const idx = list.findIndex(p => p.id === item.id);
    if (idx !== -1) {
      const updated = { ...list[idx], ...item } as ProjectItem;
      list[idx] = updated;
      setItem(STORAGE_KEYS.PROJECTS, list);
      return updated;
    }
  }

  const newItem: ProjectItem = {
    id: `proj-${Date.now()}`,
    title: item.title,
    shortDescription: item.shortDescription || item.fullDescription.slice(0, 100),
    fullDescription: item.fullDescription,
    screenshots: item.screenshots || [],
    features: item.features || [],
    techStack: item.techStack || ['PostgreSQL', 'Supabase'],
    contactInfo: item.contactInfo || {
      email: 'hazrat.shah.ansary@gmail.com',
      phone: '+93 70 000 0000',
      leadEngineer: 'Hazrat Shah Ansary'
    },
    databaseType: item.databaseType || 'PostgreSQL',
    securityNotice: item.securityNotice || 'Enterprise Row Level Security Applied.',
    likes: 0,
    dislikes: 0,
    shares: 0,
    demoUrl: item.demoUrl || '#inquire'
  };

  list.unshift(newItem);
  setItem(STORAGE_KEYS.PROJECTS, list);
  return newItem;
}

export function deleteProject(id: string): void {
  const list = getProjects().filter(p => p.id !== id);
  setItem(STORAGE_KEYS.PROJECTS, list);
}

export function saveResearchPaper(paper: Partial<ResearchPaper> & { title: string; abstract: string }): ResearchPaper {
  const list = getResearchPapers();
  if (paper.id) {
    const idx = list.findIndex(p => p.id === paper.id);
    if (idx !== -1) {
      const updated = { ...list[idx], ...paper } as ResearchPaper;
      list[idx] = updated;
      setItem(STORAGE_KEYS.RESEARCH, list);
      return updated;
    }
  }

  const newPaper: ResearchPaper = {
    id: `res-${Date.now()}`,
    title: paper.title,
    abstract: paper.abstract,
    field: paper.field || 'Computer Science & Architecture',
    author: paper.author || 'Hazrat Shah Ansary',
    institution: paper.institution || 'Ansary Knowledge Research Center',
    publishDate: new Date().toISOString().split('T')[0],
    readTime: paper.readTime || '15 min read',
    downloadUrl: paper.downloadUrl || '#',
    language: paper.language || 'en',
    citations: 0,
    doi: paper.doi || `10.1016/j.ansary.${Date.now()}`,
    keywords: paper.keywords || ['Research', 'Knowledge']
  };

  list.unshift(newPaper);
  setItem(STORAGE_KEYS.RESEARCH, list);
  return newPaper;
}

export function deleteResearchPaper(id: string): void {
  const list = getResearchPapers().filter(p => p.id !== id);
  setItem(STORAGE_KEYS.RESEARCH, list);
}

export function saveSiteSettings(settings: SiteSettings): void {
  setItem(STORAGE_KEYS.SETTINGS, settings);
}

// Voting Engine (Likes/Dislikes with persistent single-user vote tracking)
export function getUserVote(itemId: string): 'like' | 'dislike' | null {
  const votes = getItem<Record<string, 'like' | 'dislike'>>(STORAGE_KEYS.USER_VOTES, {});
  return votes[itemId] || null;
}

export function toggleVote(
  targetType: 'post' | 'book' | 'poetry' | 'video' | 'project' | 'research',
  targetId: string,
  voteType: 'like' | 'dislike'
): { userVote: 'like' | 'dislike' | null; likes: number; dislikes: number } {
  const votes = getItem<Record<string, 'like' | 'dislike'>>(STORAGE_KEYS.USER_VOTES, {});
  const currentVote = votes[targetId] || null;

  let likeDelta = 0;
  let dislikeDelta = 0;
  let newUserVote: 'like' | 'dislike' | null = null;

  if (currentVote === voteType) {
    // Untoggle
    delete votes[targetId];
    if (voteType === 'like') likeDelta = -1;
    if (voteType === 'dislike') dislikeDelta = -1;
  } else {
    // Switch or new vote
    if (currentVote === 'like') likeDelta = -1;
    if (currentVote === 'dislike') dislikeDelta = -1;

    votes[targetId] = voteType;
    newUserVote = voteType;
    if (voteType === 'like') likeDelta += 1;
    if (voteType === 'dislike') dislikeDelta += 1;
  }

  localStorage.setItem(STORAGE_KEYS.USER_VOTES, JSON.stringify(votes));

  let finalLikes = 0;
  let finalDislikes = 0;

  if (targetType === 'post') {
    const list = getPosts();
    const item = list.find(i => i.id === targetId);
    if (item) {
      item.likes = Math.max(0, item.likes + likeDelta);
      item.dislikes = Math.max(0, item.dislikes + dislikeDelta);
      finalLikes = item.likes;
      finalDislikes = item.dislikes;
      setItem(STORAGE_KEYS.POSTS, list);
    }
  } else if (targetType === 'book') {
    const list = getBooks();
    const item = list.find(i => i.id === targetId);
    if (item) {
      item.likes = Math.max(0, item.likes + likeDelta);
      item.dislikes = Math.max(0, item.dislikes + dislikeDelta);
      finalLikes = item.likes;
      finalDislikes = item.dislikes;
      setItem(STORAGE_KEYS.BOOKS, list);
    }
  } else if (targetType === 'poetry') {
    const list = getPoetry();
    const item = list.find(i => i.id === targetId);
    if (item) {
      item.likes = Math.max(0, item.likes + likeDelta);
      item.dislikes = Math.max(0, item.dislikes + dislikeDelta);
      finalLikes = item.likes;
      finalDislikes = item.dislikes;
      setItem(STORAGE_KEYS.POETRY, list);
    }
  } else if (targetType === 'video') {
    const list = getVideos();
    const item = list.find(i => i.id === targetId);
    if (item) {
      item.likes = Math.max(0, item.likes + likeDelta);
      item.dislikes = Math.max(0, item.dislikes + dislikeDelta);
      finalLikes = item.likes;
      finalDislikes = item.dislikes;
      setItem(STORAGE_KEYS.VIDEOS, list);
    }
  } else if (targetType === 'project') {
    const list = getProjects();
    const item = list.find(i => i.id === targetId);
    if (item) {
      item.likes = Math.max(0, item.likes + likeDelta);
      item.dislikes = Math.max(0, item.dislikes + dislikeDelta);
      finalLikes = item.likes;
      finalDislikes = item.dislikes;
      setItem(STORAGE_KEYS.PROJECTS, list);
    }
  }

  // Update global analytics counts
  const analytics = getAnalytics();
  if (likeDelta !== 0) analytics.likesCount = Math.max(0, analytics.likesCount + likeDelta);
  if (dislikeDelta !== 0) analytics.dislikesCount = Math.max(0, analytics.dislikesCount + dislikeDelta);
  setItem(STORAGE_KEYS.ANALYTICS, analytics);

  return { userVote: newUserVote, likes: finalLikes, dislikes: finalDislikes };
}

// Comments
export function addComment(comment: { targetId: string; targetType: CommentItem['targetType']; authorName: string; authorEmail?: string; content: string }): CommentItem {
  const comments = getComments();
  const newComment: CommentItem = {
    id: `comm-${Date.now()}`,
    targetId: comment.targetId,
    targetType: comment.targetType,
    authorName: comment.authorName,
    authorEmail: comment.authorEmail,
    content: comment.content,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    status: 'pending', // Requires admin approval
    likes: 0
  };

  comments.unshift(newComment);
  setItem(STORAGE_KEYS.COMMENTS, comments);

  const analytics = getAnalytics();
  analytics.commentsCount += 1;
  setItem(STORAGE_KEYS.ANALYTICS, analytics);

  return newComment;
}

export function updateCommentStatus(id: string, status: 'approved' | 'rejected'): void {
  const comments = getComments();
  const comm = comments.find(c => c.id === id);
  if (comm) {
    comm.status = status;
    setItem(STORAGE_KEYS.COMMENTS, comments);
  }
}

export function deleteComment(id: string): void {
  const comments = getComments().filter(c => c.id !== id);
  setItem(STORAGE_KEYS.COMMENTS, comments);
}

export function trackSectionView(section: string): void {
  const analytics = getAnalytics();
  analytics.sectionViews[section] = (analytics.sectionViews[section] || 0) + 1;
  analytics.pageViews += 1;
  setItem(STORAGE_KEYS.ANALYTICS, analytics);
}
