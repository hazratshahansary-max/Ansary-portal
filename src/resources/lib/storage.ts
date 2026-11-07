import { PromptItem, LinkItem, Language, AuditLogEntry, ExportDataPackage } from '../types';
import { INITIAL_PROMPTS, INITIAL_LINKS } from '../data/initialData';

const STORAGE_KEYS = {
  PROMPTS: 'ansary_knowledge_prompts_v2',
  LINKS: 'ansary_knowledge_links_v2',
  FAVORITES: 'ansary_knowledge_favorites_v2',
  LANGUAGE: 'ansary_knowledge_lang_v2',
  AUDIT_LOGS: 'ansary_knowledge_audit_logs_v2',
  PRE_IMPORT_BACKUP: 'ansary_knowledge_pre_import_backup_v2',
  PROMPTS_INITIALIZED: 'ansary_knowledge_prompts_initialized_v3',
  LINKS_INITIALIZED: 'ansary_knowledge_links_initialized_v3'
};

export const getStoredLanguage = (): Language => {
  try {
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
    if (lang === 'ps' || lang === 'fa' || lang === 'en') {
      return lang;
    }
  } catch {
    // ignore
  }
  return 'ps'; // Pashto as default
};

export const setStoredLanguage = (lang: Language): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch {
    // ignore
  }
};

/**
 * Returns prompts from local storage.
 * Crucial fix: If a collection was intentionally emptied by the user (array length === 0),
 * it does NOT automatically overwrite with initial demo data.
 */
export const getStoredPrompts = (): PromptItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROMPTS);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed reading prompts from storage', err);
  }

  // First-time visit seeding
  // Seed each collection independently. A shared initialization flag caused
  // the first collection read to suppress seeding of the other collection.
  try {
    if (!localStorage.getItem(STORAGE_KEYS.PROMPTS_INITIALIZED)) {
      localStorage.setItem(STORAGE_KEYS.PROMPTS_INITIALIZED, 'true');
      setStoredPrompts(INITIAL_PROMPTS);
      return INITIAL_PROMPTS;
    }
  } catch {
    // Storage may be unavailable (private mode / quota restrictions).
  }
  return [];
};

export const setStoredPrompts = (prompts: PromptItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(prompts));
  } catch (err) {
    console.error('Failed saving prompts to storage', err);
  }
};

/**
 * Returns links from local storage.
 * Respects intentionally emptied collections.
 */
export const getStoredLinks = (): LinkItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LINKS);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed reading links from storage', err);
  }

  // Keep link seeding independent from prompt seeding.
  try {
    if (!localStorage.getItem(STORAGE_KEYS.LINKS_INITIALIZED)) {
      localStorage.setItem(STORAGE_KEYS.LINKS_INITIALIZED, 'true');
      setStoredLinks(INITIAL_LINKS);
      return INITIAL_LINKS;
    }
  } catch {
    // Storage may be unavailable (private mode / quota restrictions).
  }
  return [];
};

export const setStoredLinks = (links: LinkItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
  } catch (err) {
    console.error('Failed saving links to storage', err);
  }
};

export const getStoredFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return [];
};

export const setStoredFavorites = (favorites: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch {
    // ignore
  }
};

export const toggleFavoriteItem = (id: string): string[] => {
  const current = getStoredFavorites();
  const next = current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
  setStoredFavorites(next);
  return next;
};

/**
 * Restores initial seed data. Creates an automatic backup snapshot before resetting.
 */
export const restoreDefaultData = (): { prompts: PromptItem[]; links: LinkItem[] } => {
  createPreImportBackup('Pre-Reset Defaults Safety Backup');
  setStoredPrompts(INITIAL_PROMPTS);
  setStoredLinks(INITIAL_LINKS);
  return { prompts: INITIAL_PROMPTS, links: INITIAL_LINKS };
};

/**
 * Audit Logs Storage
 */
export const getStoredAuditLogs = (): AuditLogEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return [];
};

export const addStoredAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry => {
  const fullEntry: AuditLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString()
  };

  try {
    const existing = getStoredAuditLogs();
    const updated = [fullEntry, ...existing].slice(0, 200); // retain last 200 events
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed saving audit log', err);
  }

  return fullEntry;
};

export const clearStoredAuditLogs = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
  } catch {
    // ignore
  }
};

/**
 * Generates an ExportDataPackage JSON.
 * Explicitly distinguishes client-side local cache export from full remote database backup.
 */
export const exportAllDataJSON = (): string => {
  const prompts = getStoredPrompts();
  const links = getStoredLinks();
  const favorites = getStoredFavorites();
  const auditLogs = getStoredAuditLogs();

  const data: ExportDataPackage = {
    system: 'Ansary Knowledge Platform',
    exportType: 'local_cache_export',
    exportNote:
      'This is a client-side JSON export of local cache, not a full production Supabase database backup.',
    schemaVersion: '2.0',
    exportDate: new Date().toISOString(),
    counts: {
      prompts: prompts.length,
      links: links.length,
      favorites: favorites.length,
      auditLogs: auditLogs.length
    },
    prompts,
    links,
    favorites,
    auditLogs
  };

  return JSON.stringify(data, null, 2);
};

/**
 * Creates an emergency safety snapshot before importing or restoring
 */
export const createPreImportBackup = (note: string = 'Pre-import rollback snapshot'): void => {
  try {
    const snapshot = {
      note,
      timestamp: new Date().toISOString(),
      prompts: getStoredPrompts(),
      links: getStoredLinks(),
      favorites: getStoredFavorites()
    };
    localStorage.setItem(STORAGE_KEYS.PRE_IMPORT_BACKUP, JSON.stringify(snapshot));
  } catch (err) {
    console.warn('Failed to save pre-import backup snapshot', err);
  }
};

export const getPreImportBackupSnapshot = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRE_IMPORT_BACKUP);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
};

/**
 * Validates file structure, version, and required fields before importing.
 * Rejects corrupt or invalid files and reports structured diagnostics.
 */
export const validateImportJSON = (
  jsonString: string
): {
  valid: boolean;
  message?: string;
  summary?: {
    promptsCount: number;
    linksCount: number;
    favoritesCount: number;
    version: string;
    exportDate?: string;
  };
  parsedData?: {
    prompts?: PromptItem[];
    links?: LinkItem[];
    favorites?: string[];
  };
} => {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      return { valid: false, message: 'File is empty or not valid text.' };
    }

    if (jsonString.length > 15 * 1024 * 1024) {
      return { valid: false, message: 'File size exceeds 15MB limit.' };
    }

    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, message: 'Invalid JSON root object.' };
    }

    const prompts = Array.isArray(parsed.prompts) ? parsed.prompts : [];
    const links = Array.isArray(parsed.links) ? parsed.links : [];
    const favorites = Array.isArray(parsed.favorites) ? parsed.favorites : [];

    if (prompts.length === 0 && links.length === 0) {
      return { valid: false, message: 'No valid prompts or useful links found in JSON.' };
    }

    // Validate prompt items
    for (const p of prompts) {
      if (!p || typeof p !== 'object' || !p.title || !p.title.ps || !p.promptText) {
        return {
          valid: false,
          message: 'One or more prompts are missing required fields (title.ps or promptText).'
        };
      }
    }

    // Validate link items
    for (const l of links) {
      if (!l || typeof l !== 'object' || !l.title || !l.title.ps || typeof l.url !== 'string') {
        return {
          valid: false,
          message: 'One or more links are missing required fields (title.ps or url).'
        };
      }
      try {
        const parsedUrl = new URL(l.url);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') throw new Error('Unsupported protocol');
      } catch {
        return { valid: false, message: 'One or more links contain an invalid web address.' };
      }
    }

    return {
      valid: true,
      summary: {
        promptsCount: prompts.length,
        linksCount: links.length,
        favoritesCount: favorites.length,
        version: parsed.schemaVersion || '1.0',
        exportDate: parsed.exportDate
      },
      parsedData: {
        prompts,
        links,
        favorites
      }
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return { valid: false, message: `JSON syntax error: ${errMsg}` };
  }
};

/**
 * Applies validated data, creating an automatic rollback snapshot first.
 */
export const applyImportedData = (
  data: { prompts?: PromptItem[]; links?: LinkItem[]; favorites?: string[] }
): { success: boolean; prompts: PromptItem[]; links: LinkItem[] } => {
  createPreImportBackup('Rollback snapshot before JSON import');

  let prompts = getStoredPrompts();
  let links = getStoredLinks();

  if (Array.isArray(data.prompts)) {
    prompts = data.prompts;
    setStoredPrompts(prompts);
  }

  if (Array.isArray(data.links)) {
    links = data.links;
    setStoredLinks(links);
  }

  if (Array.isArray(data.favorites)) {
    setStoredFavorites(data.favorites);
  }

  return { success: true, prompts, links };
};
