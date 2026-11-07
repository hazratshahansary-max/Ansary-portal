export type Language = 'ps' | 'fa' | 'en';

export interface LocalizedString {
  ps: string;
  fa: string;
  en: string;
}

export type PromptCategory =
  | 'all'
  | 'image-generation'
  | 'funny-entertainment'
  | 'informational-scientific'
  | 'education-learning'
  | 'art-creative'
  | 'writing-poetry'
  | 'social-media'
  | 'business-professional'
  | 'programming-technology'
  | 'video-creation'
  | 'research-analysis'
  | 'translation-language'
  | 'audio-music'
  | 'other'
  // Backward compatibility
  | 'coding'
  | 'writing'
  | 'education'
  | 'business'
  | 'creative'
  | 'productivity'
  | 'marketing'
  | 'general';

export type LinkCategory =
  | 'all'
  | 'global-popular'
  | 'education-scientific'
  | 'free-courses'
  | 'books-libraries'
  | 'ai-tools'
  | 'design-photo'
  | 'video-tools'
  | 'tech-programming'
  | 'translation-languages'
  | 'research-papers'
  | 'news-media'
  | 'afghan-resources'
  | 'government-services'
  | 'jobs-scholarships'
  | 'other-links'
  // Backward compatibility
  | 'learning'
  | 'development'
  | 'design'
  | 'utilities'
  | 'books';

export interface PromptItem {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  promptText: string;
  category: PromptCategory | string;
  targetTool: string; // 'Gemini', 'ChatGPT', 'Claude', 'Midjourney', 'All', etc.
  tags: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  isDraft?: boolean; // For Draft/Published status workflow
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  language?: 'all' | 'ps' | 'fa' | 'en';
  usageInstructions?: LocalizedString;
  sampleUrl?: string;
  sampleType?: 'image' | 'video' | 'audio' | 'document';
  createdAt: string;
  author?: string;
}

export interface LinkItem {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  url: string;
  category: LinkCategory | string;
  tags: string[];
  badge?: LocalizedString;
  isFeatured?: boolean;
  isPopular?: boolean;
  isDraft?: boolean; // For Draft/Published status workflow
  pricing?: 'free' | 'freemium' | 'paid';
  language?: 'all' | 'ps' | 'fa' | 'en';
  logoUrl?: string;
  icon?: string;
  realClickCount?: number; // Only displayed if verified from backend
  createdAt: string;
}

export type UserRole = 'super_admin' | 'admin' | 'user';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  action:
    | 'login'
    | 'logout'
    | 'create'
    | 'update'
    | 'delete'
    | 'publish'
    | 'unpublish'
    | 'feature'
    | 'role_change'
    | 'import'
    | 'restore';
  entityType: 'prompt' | 'link' | 'user' | 'system';
  entityId?: string;
  entityTitle?: string;
  details?: string;
  timestamp: string;
}

export interface OperationResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ExportDataPackage {
  system: string;
  exportType: 'local_cache_export' | 'full_database_backup';
  exportNote: string;
  schemaVersion: string;
  exportDate: string;
  counts: {
    prompts: number;
    links: number;
    favorites: number;
    auditLogs: number;
  };
  prompts: PromptItem[];
  links: LinkItem[];
  favorites: string[];
  auditLogs?: AuditLogEntry[];
}

export interface AppState {
  prompts: PromptItem[];
  links: LinkItem[];
  favorites: string[]; // IDs of favorited prompts or links
}

export type ActiveTab = 'prompts' | 'links' | 'favorites';

