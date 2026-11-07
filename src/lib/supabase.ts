/**
 * Supabase Cloud Client & Storage Integration for Ansary Knowledge
 * Connected to Production Project: https://kupuclyakicijgvumbdo.supabase.co
 * Strictly preserves existing tables: books, posts, comments, poetry, videos, projects, site_settings
 * Storage Bucket: 'books'
 */

import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { Book, Post, SiteSettings, CommentItem, SupabaseConfig } from '../types';

export const DEFAULT_SUPABASE_URL = 'https://kupuclyakicijgvumbdo.supabase.co';
export const ADMIN_EMAIL = 'hazrat.shah.ansary@gmail.com';
export const STORAGE_KEY_SUPABASE = 'ansary_supabase_cfg_v1';

let cachedClient: SupabaseClient | null = null;

export function getStoredSupabaseConfig(): SupabaseConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUPABASE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        url: parsed.url || DEFAULT_SUPABASE_URL,
        anonKey: parsed.anonKey || ''
      };
    }
  } catch (err) {
    console.error('Failed to parse Supabase config from localStorage:', err);
  }
  return {
    url: DEFAULT_SUPABASE_URL,
    anonKey: ''
  };
}

export function saveSupabaseConfig(cfg: SupabaseConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_SUPABASE, JSON.stringify(cfg));
    cachedClient = null; // reset cached instance
  } catch (err) {
    console.error('Failed to save Supabase config:', err);
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const cfg = getStoredSupabaseConfig();
  const url = cfg.url || DEFAULT_SUPABASE_URL;
  const anonKey = cfg.anonKey || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || '';

  if (!url || !anonKey) {
    return null;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return cachedClient;
  } catch (err) {
    console.warn('Supabase initialization error:', err);
    return null;
  }
}

/**
 * Upload a book PDF to Supabase Storage ('books' bucket)
 * Matches original handler:
 * const { data, error } = await supabase.storage.from('books').upload(fileName, fileInput);
 */
export async function uploadBookFileToSupabase(file: File): Promise<{ success: boolean; fileUrl?: string; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      error: 'Supabase client is not configured. Please enter your Supabase Anon Key in the Admin Portal.'
    };
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileName = `${Date.now()}_${cleanName}`;

  try {
    const { data: uploadData, error: uploadError } = await client.storage
      .from('books')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data: publicUrlData } = client.storage
      .from('books')
      .getPublicUrl(fileName);

    const fileUrl = publicUrlData?.publicUrl || `${DEFAULT_SUPABASE_URL}/storage/v1/object/public/books/${fileName}`;
    return { success: true, fileUrl };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Upload failed' };
  }
}

/**
 * Upload media (image/video) to Supabase Storage ('books' bucket)
 */
export async function uploadMediaToSupabase(file: File): Promise<{ success: boolean; mediaUrl?: string; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      error: 'Supabase client is not configured with Anon Key.'
    };
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileName = `media_${Date.now()}_${cleanName}`;

  try {
    const { data: uploadData, error: uploadError } = await client.storage
      .from('books')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data: publicUrlData } = client.storage
      .from('books')
      .getPublicUrl(fileName);

    const mediaUrl = publicUrlData?.publicUrl || `${DEFAULT_SUPABASE_URL}/storage/v1/object/public/books/${fileName}`;
    return { success: true, mediaUrl };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Media upload failed' };
  }
}

/**
 * Insert Book record into Supabase 'books' table
 */
export async function insertBookToSupabase(book: { title: string; author: string; file_url: string; pages?: number; year?: number; category?: string; language?: string }): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not initialized' };

  try {
    const { error } = await client.from('books').insert([book]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to insert book' };
  }
}

/**
 * Insert Post or Media dispatch to Supabase 'posts' table
 */
export async function insertPostToSupabase(post: { title: string; caption?: string; content?: string; media_url?: string; author?: string; language?: string; category?: string }): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not initialized' };

  try {
    const { error } = await client.from('posts').insert([post]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to insert post' };
  }
}

/**
 * Update Site Settings in Supabase 'site_settings' table
 */
export async function upsertSiteSettingsToSupabase(settings: { phone: string; address: string; whatsapp: string; telegram: string }): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not initialized' };

  try {
    const { error } = await client.from('site_settings').upsert({ id: 1, ...settings });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save settings' };
  }
}

/**
 * Insert visitor comment into Supabase 'comments' table
 */
export async function submitCommentToSupabase(comment: { target_id: string; target_type: string; author_name: string; author_email?: string; content: string }): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not initialized' };

  try {
    const { error } = await client.from('comments').insert([{ ...comment, status: 'pending' }]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to submit comment' };
  }
}

/**
 * Test connectivity to Supabase
 */
export async function testSupabaseConnection(): Promise<{ isConnected: boolean; latencyMs?: number; message?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { isConnected: false, message: 'No client or Anon Key configured.' };
  }

  const start = performance.now();
  try {
    const { data, error } = await client.from('books').select('id').limit(1);
    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      return { isConnected: false, latencyMs, message: error.message };
    }
    return { isConnected: true, latencyMs, message: 'Successfully connected to PostgreSQL & Supabase Cloud.' };
  } catch (err: any) {
    return { isConnected: false, message: err?.message || 'Connection test failed.' };
  }
}

/**
 * Supabase Auth: Sign In via Magic Link
 */
export async function sendAdminMagicLink(email: string): Promise<{ success: boolean; error?: string | null }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase credentials are not configured.' };

  if (email.toLowerCase().trim() !== ADMIN_EMAIL) {
    return { success: false, error: `Access Denied: Administrative magic links are restricted to ${ADMIN_EMAIL}` };
  }

  try {
    const { error } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to dispatch magic link' };
  }
}

/**
 * Supabase Auth: Sign In via Password
 */
export async function signInAdminPassword(email: string, pass: string): Promise<{ user: User | null; session: Session | null; error?: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    // Development fallback check
    if (email.toLowerCase().trim() === ADMIN_EMAIL && pass.length >= 6) {
      sessionStorage.setItem('ansary_admin_verified', 'true');
      return {
        user: { id: 'admin-local', email: ADMIN_EMAIL, app_metadata: { role: 'admin' }, user_metadata: { name: 'Hazrat Shah Ansary' } } as any,
        session: { access_token: 'local-token' } as any,
        error: null
      };
    }
    return { user: null, session: null, error: 'Invalid credentials or Supabase not connected' };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password: pass
    });
    if (error) return { user: null, session: null, error: error.message };
    sessionStorage.setItem('ansary_admin_verified', 'true');
    return { user: data.user, session: data.session, error: null };
  } catch (err: any) {
    return { user: null, session: null, error: err?.message || 'Authentication failed' };
  }
}

/**
 * Check Admin Authorization
 */
export async function checkAdminAuth(): Promise<{ isAuthorized: boolean; user: User | null }> {
  // Check local session marker
  if (sessionStorage.getItem('ansary_admin_verified') === 'true') {
    return {
      isAuthorized: true,
      user: { id: 'admin-verified', email: ADMIN_EMAIL, app_metadata: { role: 'admin' } } as any
    };
  }

  const client = getSupabaseClient();
  if (!client) return { isAuthorized: false, user: null };

  try {
    const { data: { session }, error } = await client.auth.getSession();
    if (error || !session || !session.user) {
      return { isAuthorized: false, user: null };
    }

    const email = session.user.email?.toLowerCase();
    const role = (session.user.app_metadata as any)?.role;
    if (email === ADMIN_EMAIL || role === 'admin') {
      return { isAuthorized: true, user: session.user };
    }

    return { isAuthorized: false, user: null };
  } catch {
    return { isAuthorized: false, user: null };
  }
}
