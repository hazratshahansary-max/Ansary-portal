import {
  Post,
  Book,
  Poetry,
  VideoItem,
  Project,
  Comment,
  AnalyticsData,
  SupabaseConfig,
  Language,
} from '../types';
import {
  INITIAL_POSTS,
  INITIAL_BOOKS,
  INITIAL_POETRY,
  INITIAL_VIDEOS,
  INITIAL_PROJECTS,
  INITIAL_COMMENTS,
} from '../data/initialData';

const STORAGE_KEYS = {
  POSTS: 'ansary_posts_v1',
  BOOKS: 'ansary_books_v1',
  POETRY: 'ansary_poetry_v1',
  VIDEOS: 'ansary_videos_v1',
  PROJECTS: 'ansary_projects_v1',
  COMMENTS: 'ansary_comments_v1',
  ANALYTICS: 'ansary_analytics_v1',
  SUPABASE: 'ansary_supabase_cfg_v1',
  USER_VOTES: 'ansary_user_votes_v1', // item id -> 'like' | 'dislike'
  VISITOR_ID: 'ansary_visitor_id',
  VISITOR_SESSION: 'ansary_visitor_session',
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.error('Storage listener error:', e);
    }
  });
}

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notify();
  } catch (e) {
    console.error('Failed to write to localStorage:', e);
  }
}

// Initialize seed data if empty
export function initStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.POETRY)) {
    localStorage.setItem(STORAGE_KEYS.POETRY, JSON.stringify(INITIAL_POETRY));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VIDEOS)) {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(INITIAL_VIDEOS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
    const initialAnalytics: AnalyticsData = {
      totalVisitors: 842,
      pageViews: 4190,
      likesCount: 1485,
      dislikesCount: 22,
      commentsCount: 4,
      appDownloads: 128,
      activeUsers: 64,
      sectionViews: {
        home: 1840,
        news: 920,
        library: 560,
        poetry: 310,
        videos: 280,
        articles: 190,
        projects: 420,
        about: 210,
        contact: 150,
      },
      languageCounts: {
        ps: 2,
        fa: 2,
        en: 1,
      },
      history: [
        { date: 'Nov 1', views: 520, visitors: 110 },
        { date: 'Nov 2', views: 640, visitors: 140 },
        { date: 'Nov 3', views: 790, visitors: 185 },
        { date: 'Nov 4', views: 890, visitors: 210 },
      ],
    };
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(initialAnalytics));
  }

  // Ensure unique visitor tracking
  trackVisitor();
}

function trackVisitor(): void {
  let vid = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  const isNewVisitor = !vid;
  if (!vid) {
    vid = 'vid_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, vid);
  }

  const session = sessionStorage.getItem(STORAGE_KEYS.VISITOR_SESSION);
  if (!session) {
    sessionStorage.setItem(STORAGE_KEYS.VISITOR_SESSION, '1');
    const analytics = getAnalytics();
    if (isNewVisitor) {
      analytics.totalVisitors += 1;
    }
    analytics.activeUsers = Math.max(12, analytics.activeUsers + 1);
    setItem(STORAGE_KEYS.ANALYTICS, analytics);
  }
}

export function subscribeStorage(callback: Listener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// ----------------- POSTS -----------------
export function getPosts(): Post[] {
  return getItem<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
}

export function savePost(post: Omit<Post, 'id' | 'likes' | 'dislikes' | 'shares' | 'views'> & { id?: string }): Post {
  const posts = getPosts();
  if (post.id) {
    const idx = posts.findIndex((p) => p.id === post.id);
    if (idx !== -1) {
      const updated = { ...posts[idx], ...post };
      posts[idx] = updated;
      setItem(STORAGE_KEYS.POSTS, posts);
      return updated;
    }
  }

  const newPost: Post = {
    ...post,
    id: 'post-' + Date.now(),
    likes: 0,
    dislikes: 0,
    shares: 0,
    views: 1,
  };
  posts.unshift(newPost);
  setItem(STORAGE_KEYS.POSTS, posts);

  // Update language breakdown in analytics
  const analytics = getAnalytics();
  analytics.languageCounts[newPost.language] = (analytics.languageCounts[newPost.language] || 0) + 1;
  setItem(STORAGE_KEYS.ANALYTICS, analytics);

  return newPost;
}

export function deletePost(id: string): void {
  const posts = getPosts().filter((p) => p.id !== id);
  setItem(STORAGE_KEYS.POSTS, posts);
}

// ----------------- BOOKS -----------------
export function getBooks(): Book[] {
  return getItem<Book[]>(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
}

export function saveBook(book: Omit<Book, 'id' | 'likes' | 'dislikes' | 'downloads'> & { id?: string }): Book {
  const books = getBooks();
  if (book.id) {
    const idx = books.findIndex((b) => b.id === book.id);
    if (idx !== -1) {
      const updated = { ...books[idx], ...book };
      books[idx] = updated;
      setItem(STORAGE_KEYS.BOOKS, books);
      return updated;
    }
  }

  const newBook: Book = {
    ...book,
    id: 'book-' + Date.now(),
    likes: 0,
    dislikes: 0,
    downloads: 0,
  };
  books.unshift(newBook);
  setItem(STORAGE_KEYS.BOOKS, books);
  return newBook;
}

export function deleteBook(id: string): void {
  const books = getBooks().filter((b) => b.id !== id);
  setItem(STORAGE_KEYS.BOOKS, books);
}

export function incrementBookDownload(id: string): void {
  const books = getBooks();
  const book = books.find((b) => b.id === id);
  if (book) {
    book.downloads += 1;
    setItem(STORAGE_KEYS.BOOKS, books);
  }
}

// ----------------- POETRY -----------------
export function getPoetry(): Poetry[] {
  return getItem<Poetry[]>(STORAGE_KEYS.POETRY, INITIAL_POETRY);
}

export function savePoetry(poetry: Omit<Poetry, 'id' | 'likes' | 'dislikes'> & { id?: string }): Poetry {
  const items = getPoetry();
  if (poetry.id) {
    const idx = items.findIndex((p) => p.id === poetry.id);
    if (idx !== -1) {
      const updated = { ...items[idx], ...poetry };
      items[idx] = updated;
      setItem(STORAGE_KEYS.POETRY, items);
      return updated;
    }
  }

  const newItem: Poetry = {
    ...poetry,
    id: 'poetry-' + Date.now(),
    likes: 0,
    dislikes: 0,
  };
  items.unshift(newItem);
  setItem(STORAGE_KEYS.POETRY, items);
  return newItem;
}

export function deletePoetry(id: string): void {
  const items = getPoetry().filter((p) => p.id !== id);
  setItem(STORAGE_KEYS.POETRY, items);
}

// ----------------- VIDEOS -----------------
export function getVideos(): VideoItem[] {
  return getItem<VideoItem[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
}

export function saveVideo(video: Omit<VideoItem, 'id' | 'views' | 'likes' | 'dislikes'> & { id?: string }): VideoItem {
  const items = getVideos();
  if (video.id) {
    const idx = items.findIndex((v) => v.id === video.id);
    if (idx !== -1) {
      const updated = { ...items[idx], ...video };
      items[idx] = updated;
      setItem(STORAGE_KEYS.VIDEOS, items);
      return updated;
    }
  }

  const newItem: VideoItem = {
    ...video,
    id: 'video-' + Date.now(),
    views: 1,
    likes: 0,
    dislikes: 0,
  };
  items.unshift(newItem);
  setItem(STORAGE_KEYS.VIDEOS, items);
  return newItem;
}

export function deleteVideo(id: string): void {
  const items = getVideos().filter((v) => v.id !== id);
  setItem(STORAGE_KEYS.VIDEOS, items);
}

// ----------------- PROJECTS -----------------
export function getProjects(): Project[] {
  return getItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
}

export function saveProject(project: Omit<Project, 'id' | 'likes' | 'dislikes' | 'shares'> & { id?: string }): Project {
  const items = getProjects();
  if (project.id) {
    const idx = items.findIndex((p) => p.id === project.id);
    if (idx !== -1) {
      const updated = { ...items[idx], ...project };
      items[idx] = updated;
      setItem(STORAGE_KEYS.PROJECTS, items);
      return updated;
    }
  }

  const newItem: Project = {
    ...project,
    id: 'proj-' + Date.now(),
    likes: 0,
    dislikes: 0,
    shares: 0,
  };
  items.unshift(newItem);
  setItem(STORAGE_KEYS.PROJECTS, items);
  return newItem;
}

export function deleteProject(id: string): void {
  const items = getProjects().filter((p) => p.id !== id);
  setItem(STORAGE_KEYS.PROJECTS, items);
}

// ----------------- INTERACTIONS (LIKE / DISLIKE / SHARE) -----------------
export function getUserVote(itemId: string): 'like' | 'dislike' | null {
  const votes = getItem<Record<string, 'like' | 'dislike'>>(STORAGE_KEYS.USER_VOTES, {});
  return votes[itemId] || null;
}

export function toggleVote(
  targetType: 'post' | 'book' | 'poetry' | 'video' | 'project',
  targetId: string,
  type: 'like' | 'dislike'
): { liked: boolean; disliked: boolean; newLikes: number; newDislikes: number } {
  const votes = getItem<Record<string, 'like' | 'dislike'>>(STORAGE_KEYS.USER_VOTES, {});
  const currentVote = votes[targetId] || null;

  let deltaLikes = 0;
  let deltaDislikes = 0;

  if (currentVote === type) {
    // Undo vote
    delete votes[targetId];
    if (type === 'like') deltaLikes = -1;
    if (type === 'dislike') deltaDislikes = -1;
  } else {
    // Switch or cast vote
    if (currentVote === 'like') deltaLikes = -1;
    if (currentVote === 'dislike') deltaDislikes = -1;

    votes[targetId] = type;
    if (type === 'like') deltaLikes += 1;
    if (type === 'dislike') deltaDislikes += 1;
  }

  localStorage.setItem(STORAGE_KEYS.USER_VOTES, JSON.stringify(votes));

  // Update target entity
  let finalLikes = 0;
  let finalDislikes = 0;

  if (targetType === 'post') {
    const items = getPosts();
    const item = items.find((i) => i.id === targetId);
    if (item) {
      item.likes = Math.max(0, item.likes + deltaLikes);
      item.dislikes = Math.max(0, item.dislikes + deltaDislikes);
      finalLikes = item.likes;
      finalDislikes = item.dislikes;
      setItem(STORAGE_KEYS.POSTS, items);
    }
  } else if (targetType === 'book') {
    const items = getBooks();
    const item = items.find((i) => i.id === targetId);
    if (item) {
      item.likes = Math.max(0, item.likes + deltaLikes);
      item.dislikes = Math.max(0, item.dislikes + deltaDislikes);
      finalLikes = item.likes;
      finalDislikes = item.dislikes;
      setItem(STORAGE_KEYS.BOOKS, items);
    }
  } else if (targetType === 'poetry') {
    const items = getPoetry();
    const item = items.find((i) => i.id === targetId);
    if (item) {
      item.likes = Math.max(0, item.likes + deltaLikes);
      item.dislikes = Math.max(0, item.dislikes + deltaDislikes);
      finalLikes = item.likes;
      finalDislikes = item.dislikes;
      setItem(STORAGE_KEYS.POETRY, items);
    }
  } else if (targetType === 'video') {
    const items = getVideos();
    const item = items.find((i) => i.id === targetId);
    if (item) {
      item.likes = Math.max(0, item.likes + deltaLikes);
      item.dislikes = Math.max(0, item.dislikes + deltaDislikes);
      finalLikes = item.likes;
      finalDislikes = item.dislikes;
      setItem(STORAGE_KEYS.VIDEOS, items);
    }
  } else if (targetType === 'project') {
    const items = getProjects();
    const item = items.find((i) => i.id === targetId);
    if (item) {
      item.likes = Math.max(0, item.likes + deltaLikes);
      item.dislikes = Math.max(0, item.dislikes + deltaDislikes);
      finalLikes = item.likes;
      finalDislikes = item.dislikes;
      setItem(STORAGE_KEYS.PROJECTS, items);
    }
  }

  // Update overall analytics
  const analytics = getAnalytics();
  analytics.likesCount = Math.max(0, analytics.likesCount + deltaLikes);
  analytics.dislikesCount = Math.max(0, analytics.dislikesCount + deltaDislikes);
  setItem(STORAGE_KEYS.ANALYTICS, analytics);

  return {
    liked: votes[targetId] === 'like',
    disliked: votes[targetId] === 'dislike',
    newLikes: finalLikes,
    newDislikes: finalDislikes,
  };
}

// ----------------- COMMENTS & MODERATION -----------------
export function getComments(targetId?: string): Comment[] {
  const comments = getItem<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
  if (targetId) {
    return comments.filter((c) => c.targetId === targetId);
  }
  return comments;
}

export function getApprovedComments(targetId: string): Comment[] {
  return getComments(targetId).filter((c) => c.status === 'approved');
}

export function addComment(comment: {
  targetId: string;
  targetType: 'post' | 'book' | 'poetry' | 'video' | 'project';
  authorName: string;
  authorEmail?: string;
  content: string;
}): Comment {
  const comments = getItem<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0] + ' ' + now.toTimeString().substring(0, 5);

  const newComment: Comment = {
    id: 'comm-' + Date.now(),
    targetId: comment.targetId,
    targetType: comment.targetType,
    authorName: comment.authorName.trim(),
    authorEmail: comment.authorEmail ? comment.authorEmail.trim() : undefined,
    content: comment.content.trim(),
    createdAt: dateStr,
    status: 'approved', // Live posting with instant moderation approval by default, manageable in dashboard!
    likes: 0,
  };

  comments.unshift(newComment);
  setItem(STORAGE_KEYS.COMMENTS, comments);

  const analytics = getAnalytics();
  analytics.commentsCount += 1;
  setItem(STORAGE_KEYS.ANALYTICS, analytics);

  return newComment;
}

export function updateCommentStatus(commentId: string, status: 'approved' | 'pending' | 'rejected'): void {
  const comments = getItem<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
  const comm = comments.find((c) => c.id === commentId);
  if (comm) {
    comm.status = status;
    setItem(STORAGE_KEYS.COMMENTS, comments);
  }
}

export function deleteComment(commentId: string): void {
  const comments = getItem<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS).filter((c) => c.id !== commentId);
  setItem(STORAGE_KEYS.COMMENTS, comments);
}

// ----------------- ANALYTICS -----------------
export function getAnalytics(): AnalyticsData {
  return getItem<AnalyticsData>(STORAGE_KEYS.ANALYTICS, {
    totalVisitors: 842,
    pageViews: 4190,
    likesCount: 1485,
    dislikesCount: 22,
    commentsCount: 4,
    appDownloads: 128,
    activeUsers: 64,
    sectionViews: {
      home: 1840,
      news: 920,
      library: 560,
      poetry: 310,
      videos: 280,
      articles: 190,
      projects: 420,
      about: 210,
      contact: 150,
    },
    languageCounts: { ps: 2, fa: 2, en: 1 },
    history: [
      { date: 'Nov 1', views: 520, visitors: 110 },
      { date: 'Nov 2', views: 640, visitors: 140 },
      { date: 'Nov 3', views: 790, visitors: 185 },
      { date: 'Nov 4', views: 890, visitors: 210 },
    ],
  });
}

export function trackPageView(sectionId: string): void {
  const analytics = getAnalytics();
  analytics.pageViews += 1;
  analytics.sectionViews[sectionId] = (analytics.sectionViews[sectionId] || 0) + 1;
  setItem(STORAGE_KEYS.ANALYTICS, analytics);
}

export function trackAppDownload(): void {
  const analytics = getAnalytics();
  analytics.appDownloads += 1;
  setItem(STORAGE_KEYS.ANALYTICS, analytics);
}

// ----------------- SUPABASE INTEGRATION & CONFIG -----------------
export function getSupabaseConfig(): SupabaseConfig {
  return getItem<SupabaseConfig>(STORAGE_KEYS.SUPABASE, {
    url: '',
    anonKey: '',
    isConnected: false,
  });
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  setItem(STORAGE_KEYS.SUPABASE, config);
}

// Generated SQL for complete Supabase tables + Row Level Security (RLS)
export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- ANSARY MULTILINGUAL PORTAL & PWA - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Brand: ANSARY (Knowledge, Literature, Technology & News)
-- Compatible with PostgreSQL 15+ and Supabase Cloud Free Tier
-- ==============================================================================

-- 1. Create Posts table (News, Articles, Announcements)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('news', 'article')),
    category TEXT NOT NULL CHECK (category IN ('sports', 'domestic', 'international', 'announcements')),
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('ps', 'fa', 'en')),
    author TEXT NOT NULL DEFAULT 'Hazrat Shah Ansary',
    cover_image TEXT,
    tags TEXT[] DEFAULT '{}',
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    shares INT DEFAULT 0,
    views INT DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Books table (Digital Library & PDFs)
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    pdf_url TEXT,
    language TEXT NOT NULL CHECK (language IN ('ps', 'fa', 'en')),
    pages INT NOT NULL,
    publication_year INT NOT NULL,
    category TEXT NOT NULL,
    downloads INT DEFAULT 0,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    file_size TEXT DEFAULT '15 MB',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Poetry table (Strophes, Ghazals & Afghan Heritage)
CREATE TABLE IF NOT EXISTS public.poetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    poet TEXT NOT NULL,
    era TEXT,
    verses JSONB NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('ps', 'fa', 'en')),
    genre TEXT NOT NULL,
    explanation TEXT,
    audio_url TEXT,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Videos table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    duration TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('ps', 'fa', 'en')),
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    published_at TIMESTAMPTZ DEFAULT now(),
    category TEXT NOT NULL
);

-- 5. Create Projects Portfolio table (Database & Cloud Systems)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    screenshots TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    tech_stack TEXT[] DEFAULT '{}',
    database_type TEXT NOT NULL,
    contact_email TEXT NOT NULL DEFAULT 'hazrat.shah.ansary@gmail.com',
    contact_phone TEXT NOT NULL,
    security_notice TEXT NOT NULL,
    demo_url TEXT,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    shares INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create Comments table (With Spam Protection & Moderation)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_id TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('post', 'book', 'poetry', 'video', 'project')),
    author_name TEXT NOT NULL,
    author_email TEXT,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
    likes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Analytics Events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    section_name TEXT,
    visitor_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enables anonymous visitors to read content and insert comments/likes,
-- while restricting update/delete/publish mutations exclusively to the authorized admin:
-- hazrat.shah.ansary@gmail.com
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Posts Policies: Public read, Admin-only write
CREATE POLICY "Public visitors can read published posts" 
    ON public.posts FOR SELECT USING (true);

CREATE POLICY "Only authorized admin can insert posts" 
    ON public.posts FOR INSERT TO authenticated
    WITH CHECK (
        (lower(auth.jwt() ->> 'email') = 'hazrat.shah.ansary@gmail.com')
        OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    );

CREATE POLICY "Only authorized admin can update posts" 
    ON public.posts FOR UPDATE TO authenticated
    USING (
        (lower(auth.jwt() ->> 'email') = 'hazrat.shah.ansary@gmail.com')
        OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    );

CREATE POLICY "Only authorized admin can delete posts" 
    ON public.posts FOR DELETE TO authenticated
    USING (
        (lower(auth.jwt() ->> 'email') = 'hazrat.shah.ansary@gmail.com')
        OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    );

-- Books Policies: Public read, Admin-only write
CREATE POLICY "Public visitors can read books" 
    ON public.books FOR SELECT USING (true);

CREATE POLICY "Only authorized admin can manage books" 
    ON public.books FOR ALL TO authenticated
    USING (
        (lower(auth.jwt() ->> 'email') = 'hazrat.shah.ansary@gmail.com')
        OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    );

-- Poetry Policies: Public read, Admin-only write
CREATE POLICY "Public visitors can read poetry" 
    ON public.poetry FOR SELECT USING (true);

CREATE POLICY "Only authorized admin can manage poetry" 
    ON public.poetry FOR ALL TO authenticated
    USING (
        (lower(auth.jwt() ->> 'email') = 'hazrat.shah.ansary@gmail.com')
        OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    );

-- Videos Policies: Public view, Admin-only write
CREATE POLICY "Public visitors can view videos" 
    ON public.videos FOR SELECT USING (true);

CREATE POLICY "Only authorized admin can manage videos" 
    ON public.videos FOR ALL TO authenticated
    USING (
        (lower(auth.jwt() ->> 'email') = 'hazrat.shah.ansary@gmail.com')
        OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    );

-- Projects Policies: Public view, Admin-only write
CREATE POLICY "Public visitors can view project portfolios" 
    ON public.projects FOR SELECT USING (true);

CREATE POLICY "Only authorized admin can manage projects" 
    ON public.projects FOR ALL TO authenticated
    USING (
        (lower(auth.jwt() ->> 'email') = 'hazrat.shah.ansary@gmail.com')
        OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    );

-- Comments Policies: Public read approved, Public submit, Admin-only moderate
CREATE POLICY "Public visitors can read approved comments" 
    ON public.comments FOR SELECT USING (status = 'approved');

CREATE POLICY "Public visitors can submit comments without account" 
    ON public.comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authorized admin can moderate all comments" 
    ON public.comments FOR ALL TO authenticated
    USING (
        (lower(auth.jwt() ->> 'email') = 'hazrat.shah.ansary@gmail.com')
        OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    );

-- Analytics Policies
CREATE POLICY "Public visitors can insert analytics events" 
    ON public.analytics_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authorized admin can view analytics" 
    ON public.analytics_events FOR SELECT TO authenticated
    USING (
        (lower(auth.jwt() ->> 'email') = 'hazrat.shah.ansary@gmail.com')
        OR ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    );
`;
