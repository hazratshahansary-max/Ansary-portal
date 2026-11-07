import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { PromptItem, LinkItem, UserRole, AuditLogEntry, OperationResult } from '../types';

/**
 * Safely parses JSON strings or returns objects/fallbacks without throwing unhandled exceptions.
 */
export function safeJsonParse<T>(input: any, fallback: T): T {
  if (input === null || input === undefined) return fallback;
  if (typeof input === 'object') return input as T;
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      return (parsed !== null && parsed !== undefined ? parsed : fallback) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function initSupabase(): SupabaseClient | null {
  try {
    const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
    const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

    if (!rawUrl || !rawKey) return null;
    if (
      rawUrl.includes('your-project') ||
      rawUrl.includes('placeholder') ||
      rawUrl.includes('MY_SUPABASE')
    ) {
      return null;
    }

    // Must be a valid HTTP or HTTPS URL
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    // Frontend uses strictly Public Anon key (never service_role)
    return createClient(rawUrl, rawKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  } catch (err) {
    console.warn('Supabase client initialization skipped (running in offline/local storage mode):', err);
    return null;
  }
}

export const supabase: SupabaseClient | null = initSupabase();
export const isSupabaseConfigured: boolean = Boolean(supabase !== null);

/**
 * Validates a user's role against strictly server-authoritative sources.
 * Security Rules Enforced:
 * 1. Checks user.app_metadata.role ('super_admin' or 'admin') - cannot be altered by client.
 * 2. If Supabase is connected, queries the server 'profiles' table for role column.
 * 3. EXPLICITLY REJECTS user_metadata.role (which any user can edit via client API).
 * 4. EXPLICITLY REJECTS email string heuristics (e.g. email containing "admin" or "ansary").
 * 5. Returns role: null and isAdmin: false if no server role is verified.
 */
export const checkUserRole = async (
  user: User | null
): Promise<{ isAdmin: boolean; isSuperAdmin: boolean; role: UserRole | null }> => {
  if (!user) {
    return { isAdmin: false, isSuperAdmin: false, role: null };
  }

  // 1. Check secure JWT app_metadata (Server controlled only)
  const appRole = user.app_metadata?.role;
  if (appRole === 'super_admin') {
    return { isAdmin: true, isSuperAdmin: true, role: 'super_admin' };
  }
  if (appRole === 'admin') {
    return { isAdmin: true, isSuperAdmin: false, role: 'admin' };
  }

  // 2. Query server-side 'profiles' table if Supabase is active
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (!error && data?.role) {
        if (data.role === 'super_admin') {
          return { isAdmin: true, isSuperAdmin: true, role: 'super_admin' };
        }
        if (data.role === 'admin') {
          return { isAdmin: true, isSuperAdmin: false, role: 'admin' };
        }
      }
    } catch {
      // Fall through to unauthorized
    }
  }

  // Unauthorized by default - no heuristics, no user_metadata
  return { isAdmin: false, isSuperAdmin: false, role: null };
};

export const checkIsAdminUser = async (user: User | null): Promise<boolean> => {
  const { isAdmin } = await checkUserRole(user);
  return isAdmin;
};

/**
 * Fetches all prompts from Supabase with safe parsing for all fields.
 */
export const fetchSupabasePrompts = async (): Promise<PromptItem[] | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase prompts fetch warning:', error?.message);
      return null;
    }

    return data.map((row: any) => ({
      id: String(row.id),
      title: safeJsonParse(row.title, { ps: '', fa: '', en: '' }),
      description: safeJsonParse(row.description, { ps: '', fa: '', en: '' }),
      promptText: row.prompt_text || row.promptText || '',
      category: row.category || 'general',
      targetTool: row.target_tool || row.targetTool || 'Gemini',
      tags: Array.isArray(row.tags) ? row.tags : [],
      isFeatured: Boolean(row.is_featured ?? row.isFeatured),
      isPopular: Boolean(row.is_popular ?? row.isPopular),
      isDraft: Boolean(row.is_draft ?? row.isDraft),
      difficulty: row.difficulty || 'intermediate',
      language: row.language || 'all',
      usageInstructions: safeJsonParse(row.usage_instructions || row.usageInstructions, {
        ps: '',
        fa: '',
        en: ''
      }),
      sampleUrl: row.sample_url || row.sampleUrl || undefined,
      sampleType: row.sample_type || row.sampleType || 'image',
      author: row.author || undefined,
      createdAt: row.created_at || row.createdAt || new Date().toISOString()
    }));
  } catch (err) {
    console.error('Error fetching prompts from Supabase:', err);
    return null;
  }
};

/**
 * Upserts a prompt to Supabase preserving all fields.
 */
export const upsertSupabasePrompt = async (prompt: PromptItem): Promise<OperationResult> => {
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }
  try {
    const payload = {
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      prompt_text: prompt.promptText,
      category: prompt.category,
      target_tool: prompt.targetTool,
      tags: prompt.tags,
      is_featured: !!prompt.isFeatured,
      is_popular: !!prompt.isPopular,
      is_draft: !!prompt.isDraft,
      difficulty: prompt.difficulty || 'intermediate',
      language: prompt.language || 'all',
      usage_instructions: prompt.usageInstructions || { ps: '', fa: '', en: '' },
      sample_url: prompt.sampleUrl || null,
      sample_type: prompt.sampleType || 'image',
      author: prompt.author || null,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('prompts').upsert(payload);
    if (error) {
      console.error('Supabase upsertPrompt error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Error upserting prompt to Supabase:', err);
    return { success: false, error: err?.message || 'Database mutation failed' };
  }
};

/**
 * Deletes a prompt from Supabase with verification.
 */
export const deleteSupabasePrompt = async (id: string): Promise<OperationResult> => {
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }
  try {
    const { error } = await supabase.from('prompts').delete().eq('id', id);
    if (error) {
      console.error('Supabase deletePrompt error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting prompt from Supabase:', err);
    return { success: false, error: err?.message || 'Database delete failed' };
  }
};

/**
 * Fetches all useful links from Supabase preserving all fields.
 */
export const fetchSupabaseLinks = async (): Promise<LinkItem[] | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('useful_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase links fetch warning:', error?.message);
      return null;
    }

    return data.map((row: any) => ({
      id: String(row.id),
      title: safeJsonParse(row.title, { ps: '', fa: '', en: '' }),
      description: safeJsonParse(row.description, { ps: '', fa: '', en: '' }),
      url: row.url || '',
      category: row.category || 'ai-tools',
      tags: Array.isArray(row.tags) ? row.tags : [],
      badge: safeJsonParse(row.badge, { ps: '', fa: '', en: '' }),
      isFeatured: Boolean(row.is_featured ?? row.isFeatured),
      isPopular: Boolean(row.is_popular ?? row.isPopular),
      isDraft: Boolean(row.is_draft ?? row.isDraft),
      pricing: row.pricing || 'free',
      language: row.language || 'all',
      logoUrl: row.logo_url || row.logoUrl || undefined,
      icon: row.icon || undefined,
      realClickCount: typeof row.real_click_count === 'number' ? row.real_click_count : undefined,
      createdAt: row.created_at || row.createdAt || new Date().toISOString()
    }));
  } catch (err) {
    console.error('Error fetching links from Supabase:', err);
    return null;
  }
};

/**
 * Upserts a useful link to Supabase preserving all fields.
 */
export const upsertSupabaseLink = async (link: LinkItem): Promise<OperationResult> => {
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }
  try {
    const payload = {
      id: link.id,
      title: link.title,
      description: link.description,
      url: link.url,
      category: link.category,
      tags: link.tags,
      badge: link.badge || null,
      is_featured: !!link.isFeatured,
      is_popular: !!link.isPopular,
      is_draft: !!link.isDraft,
      pricing: link.pricing || 'free',
      language: link.language || 'all',
      logo_url: link.logoUrl || null,
      icon: link.icon || null,
      real_click_count: link.realClickCount || 0,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('useful_links').upsert(payload);
    if (error) {
      console.error('Supabase upsertLink error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Error upserting link to Supabase:', err);
    return { success: false, error: err?.message || 'Database mutation failed' };
  }
};

/**
 * Deletes a useful link from Supabase.
 */
export const deleteSupabaseLink = async (id: string): Promise<OperationResult> => {
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }
  try {
    const { error } = await supabase.from('useful_links').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteLink error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting link from Supabase:', err);
    return { success: false, error: err?.message || 'Database delete failed' };
  }
};

/**
 * Submits a broken link report to Supabase table 'link_reports' if provisioned.
 */
export const submitLinkReportToSupabase = async (report: {
  linkId: string;
  linkUrl: string;
  reason: string;
  notes?: string;
}): Promise<{ success: boolean; isRemote: boolean; error?: string }> => {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, isRemote: false, error: 'Supabase offline/not configured' };
  }
  try {
    const { error } = await supabase.from('link_reports').insert({
      link_id: report.linkId,
      link_url: report.linkUrl,
      reason: report.reason,
      notes: report.notes || null,
      created_at: new Date().toISOString()
    });

    if (error) {
      return { success: false, isRemote: false, error: error.message };
    }
    return { success: true, isRemote: true };
  } catch (err: any) {
    return { success: false, isRemote: false, error: err?.message || 'Connection error' };
  }
};

/**
 * Logs an administrative event to Supabase audit_logs table if provisioned.
 */
export const logAuditEventToSupabase = async (entry: AuditLogEntry): Promise<void> => {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.from('audit_logs').insert({
      id: entry.id,
      user_id: entry.userId,
      user_email: entry.userEmail,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId || null,
      entity_title: entry.entityTitle || null,
      details: entry.details || null,
      created_at: entry.timestamp
    });
  } catch {
    // Non-blocking log catch
  }
};

/**
 * Fetches audit logs from Supabase if table exists.
 */
export const fetchSupabaseAuditLogs = async (): Promise<AuditLogEntry[] | null> => {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: String(row.id),
      userId: row.user_id,
      userEmail: row.user_email,
      action: row.action,
      entityType: row.entity_type,
      entityId: row.entity_id || undefined,
      entityTitle: row.entity_title || undefined,
      details: row.details || undefined,
      timestamp: row.created_at
    }));
  } catch {
    return null;
  }
};
