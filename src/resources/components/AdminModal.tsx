import React, { useState, useEffect } from 'react';
import {
  PromptItem,
  LinkItem,
  Language,
  PromptCategory,
  LinkCategory,
  UserRole,
  AuditLogEntry,
  OperationResult
} from '../types';
import { translations } from '../data/translations';
import {
  X,
  Lock,
  Unlock,
  Trash2,
  Edit3,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Link as LinkIcon,
  Settings,
  Mail,
  KeyRound,
  ShieldCheck,
  UserCheck,
  Activity,
  Database,
  Eye,
  FileCheck2,
  Loader2,
  ShieldAlert,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import {
  exportAllDataJSON,
  validateImportJSON,
  applyImportedData,
  getStoredAuditLogs,
  addStoredAuditLog,
  clearStoredAuditLogs
} from '../lib/storage';
import {
  supabase,
  isSupabaseConfigured,
  checkUserRole,
  logAuditEventToSupabase,
  fetchSupabaseAuditLogs
} from '../lib/supabase';
import { isValidSafeUrl, getSafeUrl } from './LinksSection';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  isAdminLoggedIn: boolean;
  adminUserEmail?: string | null;
  adminRole?: UserRole | null;
  onLoginSuccess: (email?: string, role?: UserRole) => void;
  onLogout: () => void;
  prompts: PromptItem[];
  links: LinkItem[];
  onSavePrompt: (prompt: PromptItem) => Promise<OperationResult>;
  onDeletePrompt: (id: string) => Promise<OperationResult>;
  onSaveLink: (link: LinkItem) => Promise<OperationResult>;
  onDeleteLink: (id: string) => Promise<OperationResult>;
  onResetDefaults: () => void;
  editingPromptItem?: PromptItem | null;
  editingLinkItem?: LinkItem | null;
  onClearEditing: () => void;
  onDataImported: (prompts: PromptItem[], links: LinkItem[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  isAdminLoggedIn,
  adminUserEmail,
  adminRole,
  onLoginSuccess,
  onLogout,
  prompts,
  links,
  onSavePrompt,
  onDeletePrompt,
  onSaveLink,
  onDeleteLink,
  onResetDefaults,
  editingPromptItem,
  editingLinkItem,
  onClearEditing,
  onDataImported
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<'prompts' | 'links' | 'audit' | 'database'>('prompts');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Rate limiting / Brute-force protection
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  // Loading state for operations
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Import Preview Modal state
  const [importPreview, setImportPreview] = useState<{
    valid: boolean;
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
  } | null>(null);

  // Delete Confirmation state
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{
    type: 'prompt' | 'link';
    id: string;
    title: string;
  } | null>(null);

  // Form states for Prompt
  const [promptForm, setPromptForm] = useState<Partial<PromptItem>>({
    title: { ps: '', fa: '', en: '' },
    description: { ps: '', fa: '', en: '' },
    promptText: '',
    category: 'programming-technology',
    targetTool: 'Gemini',
    tags: [],
    difficulty: 'intermediate',
    language: 'all',
    usageInstructions: { ps: '', fa: '', en: '' },
    sampleUrl: '',
    sampleType: 'image',
    author: '',
    isFeatured: false,
    isPopular: false,
    isDraft: false
  });
  const [promptTagsInput, setPromptTagsInput] = useState('');

  // Form states for Link
  const [linkForm, setLinkForm] = useState<Partial<LinkItem>>({
    title: { ps: '', fa: '', en: '' },
    description: { ps: '', fa: '', en: '' },
    url: '',
    category: 'ai-tools',
    tags: [],
    badge: { ps: '', fa: '', en: '' },
    pricing: 'free',
    language: 'all',
    logoUrl: '',
    icon: '',
    isFeatured: false,
    isPopular: false,
    isDraft: false
  });
  const [linkTagsInput, setLinkTagsInput] = useState('');

  // Load audit logs when modal is open
  useEffect(() => {
    if (isOpen && isAdminLoggedIn) {
      loadAuditLogs();
    }
  }, [isOpen, isAdminLoggedIn]);

  const loadAuditLogs = async () => {
    if (supabase && isSupabaseConfigured) {
      const remote = await fetchSupabaseAuditLogs();
      if (remote && remote.length > 0) {
        setAuditLogs(remote);
        return;
      }
    }
    setAuditLogs(getStoredAuditLogs());
  };

  // Sync editing items
  useEffect(() => {
    if (editingPromptItem) {
      setPromptForm({
        ...editingPromptItem,
        usageInstructions: editingPromptItem.usageInstructions || { ps: '', fa: '', en: '' }
      });
      setPromptTagsInput(editingPromptItem.tags.join(', '));
      setActiveTab('prompts');
    } else {
      setPromptForm({
        title: { ps: '', fa: '', en: '' },
        description: { ps: '', fa: '', en: '' },
        promptText: '',
        category: 'programming-technology',
        targetTool: 'Gemini',
        tags: [],
        difficulty: 'intermediate',
        language: 'all',
        usageInstructions: { ps: '', fa: '', en: '' },
        sampleUrl: '',
        sampleType: 'image',
        author: '',
        isFeatured: false,
        isPopular: false,
        isDraft: false
      });
      setPromptTagsInput('');
    }
  }, [editingPromptItem]);

  useEffect(() => {
    if (editingLinkItem) {
      setLinkForm({
        ...editingLinkItem,
        badge: editingLinkItem.badge || { ps: '', fa: '', en: '' }
      });
      setLinkTagsInput(editingLinkItem.tags.join(', '));
      setActiveTab('links');
    } else {
      setLinkForm({
        title: { ps: '', fa: '', en: '' },
        description: { ps: '', fa: '', en: '' },
        url: '',
        category: 'ai-tools',
        tags: [],
        badge: { ps: '', fa: '', en: '' },
        pricing: 'free',
        language: 'all',
        logoUrl: '',
        icon: '',
        isFeatured: false,
        isPopular: false,
        isDraft: false
      });
      setLinkTagsInput('');
    }
  }, [editingLinkItem]);

  if (!isOpen) return null;

  // Check brute-force lockout
  const isLockedOut = lockoutTime !== null && Date.now() < lockoutTime;
  const remainingSeconds = lockoutTime ? Math.ceil((lockoutTime - Date.now()) / 1000) : 0;

  // Supabase Auth + Server-Authoritative Role Verification
  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (isLockedOut) {
      setAuthError(`${t.loginThrottled} (${remainingSeconds}s)`);
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      setAuthError(t.supabaseNotConfiguredWarning);
      return;
    }

    setIsLoadingAuth(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password: passwordInput.trim()
      });

      if (error || !data.user) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);

        if (nextAttempts >= 5) {
          const lockDuration = 15 * 60 * 1000; // 15 minutes lockout
          setLockoutTime(Date.now() + lockDuration);
          setAuthError(t.tooManyAttempts);
        } else {
          setAuthError(`${t.adminWrongPassword} (${5 - nextAttempts} attempts remaining)`);
        }
        setIsLoadingAuth(false);
        return;
      }

      // STRICT Server-authoritative role check
      const { isAdmin, role } = await checkUserRole(data.user);

      if (!isAdmin || !role) {
        // Sign user out immediately to prevent unauthorized session
        await supabase.auth.signOut();
        setAuthError(t.adminRoleRequired);
        setIsLoadingAuth(false);
        return;
      }

      // Reset failed attempts on genuine authenticated admin success
      setFailedAttempts(0);
      setLockoutTime(null);

      // Record Audit Log for login
      const logEntry = addStoredAuditLog({
        userId: data.user.id,
        userEmail: data.user.email || emailInput,
        action: 'login',
        entityType: 'user',
        details: `Authenticated as ${role}`
      });
      await logAuditEventToSupabase(logEntry);

      onLoginSuccess(data.user.email || emailInput, role);
      setMessage({ text: t.adminSuccessLogin, type: 'success' });
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      setAuthError(err?.message || 'Login authentication failure');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSavePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptForm.title?.ps?.trim() || !promptForm.promptText?.trim()) {
      alert('مهرباني وکړئ د فرامپټ سرلیک (پښتو) او متن ډک کړئ.');
      return;
    }

    // Duplicate check
    const isDuplicate = prompts.some(
      (p) =>
        p.id !== promptForm.id &&
        p.promptText.trim().toLowerCase() === promptForm.promptText?.trim().toLowerCase()
    );
    if (isDuplicate) {
      setMessage({ text: t.duplicatePromptError, type: 'error' });
      setTimeout(() => setMessage(null), 4000);
      return;
    }

    // Sample URL validation
    if (promptForm.sampleUrl && !isValidSafeUrl(promptForm.sampleUrl)) {
      setMessage({ text: t.invalidUrl, type: 'error' });
      setTimeout(() => setMessage(null), 4000);
      return;
    }

    setIsSubmitting(true);

    const tags = promptTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newPrompt: PromptItem = {
      id: promptForm.id || `p-${Date.now()}`,
      title: {
        ps: promptForm.title?.ps.trim() || '',
        fa: promptForm.title?.fa?.trim() || promptForm.title?.ps.trim() || '',
        en: promptForm.title?.en?.trim() || promptForm.title?.ps.trim() || ''
      },
      description: {
        ps: promptForm.description?.ps?.trim() || '',
        fa: promptForm.description?.fa?.trim() || promptForm.description?.ps?.trim() || '',
        en: promptForm.description?.en?.trim() || promptForm.description?.ps?.trim() || ''
      },
      promptText: promptForm.promptText.trim(),
      category: (promptForm.category as PromptCategory) || 'programming-technology',
      targetTool: promptForm.targetTool || 'Gemini',
      tags: tags.length ? tags : ['ai'],
      difficulty: promptForm.difficulty || 'intermediate',
      language: promptForm.language || 'all',
      usageInstructions: {
        ps: promptForm.usageInstructions?.ps?.trim() || '',
        fa: promptForm.usageInstructions?.fa?.trim() || promptForm.usageInstructions?.ps?.trim() || '',
        en: promptForm.usageInstructions?.en?.trim() || promptForm.usageInstructions?.ps?.trim() || ''
      },
      sampleUrl: promptForm.sampleUrl ? getSafeUrl(promptForm.sampleUrl) || undefined : undefined,
      sampleType: promptForm.sampleType || 'image',
      author: promptForm.author?.trim() || undefined,
      isFeatured: !!promptForm.isFeatured,
      isPopular: !!promptForm.isPopular,
      isDraft: !!promptForm.isDraft,
      createdAt: promptForm.createdAt || new Date().toISOString()
    };

    const res = await onSavePrompt(newPrompt);
    setIsSubmitting(false);

    if (res.success) {
      const logEntry = addStoredAuditLog({
        userId: adminUserEmail || 'admin',
        userEmail: adminUserEmail || 'admin',
        action: promptForm.id ? 'update' : 'create',
        entityType: 'prompt',
        entityId: newPrompt.id,
        entityTitle: newPrompt.title.ps,
        details: `Saved prompt in category ${newPrompt.category}`
      });
      await logAuditEventToSupabase(logEntry);

      onClearEditing();
      setMessage({ text: t.itemSavedSuccess, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      loadAuditLogs();
    } else {
      setMessage({ text: `${t.operationFailed}: ${res.error || res.message}`, type: 'error' });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleSaveLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkForm.title?.ps?.trim() || !linkForm.url?.trim()) {
      alert('مهرباني وکړئ د لینک سرلیک (پښتو) او URL وټاکئ.');
      return;
    }

    const safeUrl = getSafeUrl(linkForm.url);
    if (!safeUrl) {
      setMessage({ text: t.invalidUrl, type: 'error' });
      setTimeout(() => setMessage(null), 4000);
      return;
    }

    // Duplicate check
    const isDuplicate = links.some(
      (l) => l.id !== linkForm.id && getSafeUrl(l.url) === safeUrl
    );
    if (isDuplicate) {
      setMessage({ text: t.duplicateUrlError, type: 'error' });
      setTimeout(() => setMessage(null), 4000);
      return;
    }

    // Logo validation
    const safeLogoUrl = linkForm.logoUrl ? getSafeUrl(linkForm.logoUrl) : null;

    setIsSubmitting(true);

    const tags = linkTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newLink: LinkItem = {
      id: linkForm.id || `l-${Date.now()}`,
      title: {
        ps: linkForm.title?.ps.trim() || '',
        fa: linkForm.title?.fa?.trim() || linkForm.title?.ps.trim() || '',
        en: linkForm.title?.en?.trim() || linkForm.title?.ps.trim() || ''
      },
      description: {
        ps: linkForm.description?.ps?.trim() || '',
        fa: linkForm.description?.fa?.trim() || linkForm.description?.ps?.trim() || '',
        en: linkForm.description?.en?.trim() || linkForm.description?.ps?.trim() || ''
      },
      url: safeUrl,
      category: (linkForm.category as LinkCategory) || 'ai-tools',
      tags: tags.length ? tags : ['resource'],
      badge: {
        ps: linkForm.badge?.ps?.trim() || '',
        fa: linkForm.badge?.fa?.trim() || linkForm.badge?.ps?.trim() || '',
        en: linkForm.badge?.en?.trim() || linkForm.badge?.ps?.trim() || ''
      },
      pricing: linkForm.pricing || 'free',
      language: linkForm.language || 'all',
      logoUrl: safeLogoUrl || undefined,
      icon: linkForm.icon || undefined,
      realClickCount: linkForm.realClickCount,
      isFeatured: !!linkForm.isFeatured,
      isPopular: !!linkForm.isPopular,
      isDraft: !!linkForm.isDraft,
      createdAt: linkForm.createdAt || new Date().toISOString()
    };

    const res = await onSaveLink(newLink);
    setIsSubmitting(false);

    if (res.success) {
      const logEntry = addStoredAuditLog({
        userId: adminUserEmail || 'admin',
        userEmail: adminUserEmail || 'admin',
        action: linkForm.id ? 'update' : 'create',
        entityType: 'link',
        entityId: newLink.id,
        entityTitle: newLink.title.ps,
        details: `Saved link with URL ${newLink.url}`
      });
      await logAuditEventToSupabase(logEntry);

      onClearEditing();
      setMessage({ text: t.itemSavedSuccess, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      loadAuditLogs();
    } else {
      setMessage({ text: `${t.operationFailed}: ${res.error || res.message}`, type: 'error' });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleExecuteDelete = async () => {
    if (!deleteConfirmItem) return;
    setIsSubmitting(true);

    let res: OperationResult;
    if (deleteConfirmItem.type === 'prompt') {
      res = await onDeletePrompt(deleteConfirmItem.id);
    } else {
      res = await onDeleteLink(deleteConfirmItem.id);
    }

    setIsSubmitting(false);

    if (res.success) {
      const logEntry = addStoredAuditLog({
        userId: adminUserEmail || 'admin',
        userEmail: adminUserEmail || 'admin',
        action: 'delete',
        entityType: deleteConfirmItem.type,
        entityId: deleteConfirmItem.id,
        entityTitle: deleteConfirmItem.title,
        details: `Deleted ${deleteConfirmItem.type} permanently`
      });
      await logAuditEventToSupabase(logEntry);

      setMessage({ text: t.itemDeletedSuccess, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      setDeleteConfirmItem(null);
      loadAuditLogs();
    } else {
      setMessage({ text: `${t.operationFailed}: ${res.error || res.message}`, type: 'error' });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleExport = () => {
    const jsonStr = exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ansary_knowledge_export_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    addStoredAuditLog({
      userId: adminUserEmail || 'admin',
      userEmail: adminUserEmail || 'admin',
      action: 'restore',
      entityType: 'system',
      details: 'Exported local data package JSON'
    });
  };

  const handleImportFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const validation = validateImportJSON(content);

      if (!validation.valid) {
        setMessage({
          text: `${t.importValidationFailed}: ${validation.message}`,
          type: 'error'
        });
        return;
      }

      setImportPreview(validation);
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleConfirmImport = () => {
    if (!importPreview?.parsedData) return;

    const res = applyImportedData(importPreview.parsedData);
    if (res.success) {
      onDataImported(res.prompts, res.links);

      const logEntry = addStoredAuditLog({
        userId: adminUserEmail || 'admin',
        userEmail: adminUserEmail || 'admin',
        action: 'import',
        entityType: 'system',
        details: `Imported ${res.prompts.length} prompts and ${res.links.length} links`
      });
      logAuditEventToSupabase(logEntry);

      setMessage({
        text: `${t.importSuccess} (${t.preImportBackupCreated})`,
        type: 'success'
      });
      setTimeout(() => setMessage(null), 4000);
      setImportPreview(null);
      loadAuditLogs();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl p-6 shadow-2xl space-y-5 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{t.adminTitle}</h2>
                {isAdminLoggedIn && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    <span>
                      {adminRole === 'super_admin' ? t.superAdmin : t.adminRole}
                    </span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isAdminLoggedIn
                  ? `${adminUserEmail} • Supabase Auth Verified`
                  : 'د Supabase باوري تصدیق (Server-Side Verified Role)'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onClearEditing();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Notification Banner */}
        {message && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Login Form if NOT authenticated */}
        {!isAdminLoggedIn ? (
          <div className="py-6 px-4 max-w-md mx-auto text-center space-y-4">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-lg text-start">
              <div className="text-center mb-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-2">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {t.adminLogin} (Supabase Server Auth)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  یوازې هغه کاروونکي چې په Supabase کې د Admin یا SuperAdmin رول لري ننوتی شي.
                </p>
              </div>

              {!isSupabaseConfigured && (
                <div className="p-3 mb-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{t.supabaseNotConfiguredWarning}</p>
                </div>
              )}

              <form onSubmit={handleSupabaseLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.adminEmailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="absolute start-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      disabled={!isSupabaseConfigured || isLockedOut}
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setAuthError(null);
                      }}
                      placeholder="admin@ansaryknowledge.com"
                      className="w-full bg-slate-900 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-700 ps-9 pe-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.adminPasswordLabel}
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute start-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      disabled={!isSupabaseConfigured || isLockedOut}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setAuthError(null);
                      }}
                      placeholder={t.adminPasswordPlaceholder}
                      className="w-full bg-slate-900 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-700 ps-9 pe-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                {authError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoadingAuth || !isSupabaseConfigured || isLockedOut}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isLoadingAuth ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t.submittingReport}</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4" />
                      <span>{t.adminLogin}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Tabs */
          <div className="flex-1 flex flex-col min-h-0 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab('prompts')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'prompts'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>
                    {t.adminManagePrompts} ({prompts.length})
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('links')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'links'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span>
                    {t.adminManageLinks} ({links.length})
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'audit'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Activity className="h-3.5 w-3.5" />
                  <span>
                    {t.auditLogsTab} ({auditLogs.length})
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('database')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'database'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Database className="h-3.5 w-3.5" />
                  <span>بیک اپ او ډیټابېس</span>
                </button>
              </div>

              <button
                onClick={onLogout}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                {t.adminLogout}
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {/* TAB 1: PROMPTS */}
              {activeTab === 'prompts' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>{editingPromptItem ? t.editPrompt : t.addNewPrompt}</span>
                      </h4>
                      {editingPromptItem && (
                        <button
                          onClick={onClearEditing}
                          className="text-[11px] text-slate-400 hover:text-white"
                        >
                          نوی فرامپټ پیل کړئ
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSavePromptSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className="text-slate-300 font-medium">{t.titlePs} *</label>
                        <input
                          type="text"
                          required
                          value={promptForm.title?.ps || ''}
                          onChange={(e) =>
                            setPromptForm({
                              ...promptForm,
                              title: { ...promptForm.title, ps: e.target.value } as any
                            })
                          }
                          className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 px-3 py-2 mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400">{t.titleFa}</label>
                          <input
                            type="text"
                            value={promptForm.title?.fa || ''}
                            onChange={(e) =>
                              setPromptForm({
                                ...promptForm,
                                title: { ...promptForm.title, fa: e.target.value } as any
                              })
                            }
                            className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 px-3 py-1.5 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400">{t.titleEn}</label>
                          <input
                            type="text"
                            value={promptForm.title?.en || ''}
                            onChange={(e) =>
                              setPromptForm({
                                ...promptForm,
                                title: { ...promptForm.title, en: e.target.value } as any
                              })
                            }
                            className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 px-3 py-1.5 mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-300 font-medium">{t.descPs}</label>
                        <textarea
                          rows={2}
                          value={promptForm.description?.ps || ''}
                          onChange={(e) =>
                            setPromptForm({
                              ...promptForm,
                              description: { ...promptForm.description, ps: e.target.value } as any
                            })
                          }
                          className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 p-2.5 mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-medium">{t.promptContent} *</label>
                        <textarea
                          rows={5}
                          required
                          placeholder={t.promptContentPlaceholder}
                          value={promptForm.promptText || ''}
                          onChange={(e) =>
                            setPromptForm({ ...promptForm, promptText: e.target.value })
                          }
                          className="w-full bg-slate-950 font-mono text-slate-100 rounded-xl border border-slate-700 p-3 mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-slate-400">{t.category}</label>
                          <select
                            value={promptForm.category || 'programming-technology'}
                            onChange={(e) =>
                              setPromptForm({ ...promptForm, category: e.target.value })
                            }
                            className="w-full bg-slate-900 text-slate-200 rounded-xl border border-slate-700 px-2 py-1.5 mt-1"
                          >
                            <option value="image-generation">Image Generation</option>
                            <option value="funny-entertainment">Funny & Entertainment</option>
                            <option value="informational-scientific">Informational & Scientific</option>
                            <option value="education-learning">Education & Learning</option>
                            <option value="art-creative">Art & Creative</option>
                            <option value="writing-poetry">Writing & Poetry</option>
                            <option value="social-media">Social Media</option>
                            <option value="business-professional">Business & Professional</option>
                            <option value="programming-technology">Programming & Technology</option>
                            <option value="video-creation">Video Creation</option>
                            <option value="research-analysis">Research & Analysis</option>
                            <option value="translation-language">Translation & Language</option>
                            <option value="audio-music">Audio & Music</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-400">{t.targetToolLabel}</label>
                          <select
                            value={promptForm.targetTool || 'Gemini'}
                            onChange={(e) =>
                              setPromptForm({ ...promptForm, targetTool: e.target.value })
                            }
                            className="w-full bg-slate-900 text-slate-200 rounded-xl border border-slate-700 px-2 py-1.5 mt-1"
                          >
                            <option value="Gemini">Gemini</option>
                            <option value="ChatGPT">ChatGPT</option>
                            <option value="Claude">Claude</option>
                            <option value="Midjourney">Midjourney</option>
                            <option value="All">All</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-400">{t.filterLanguage}</label>
                          <select
                            value={promptForm.language || 'all'}
                            onChange={(e) =>
                              setPromptForm({ ...promptForm, language: e.target.value as any })
                            }
                            className="w-full bg-slate-900 text-slate-200 rounded-xl border border-slate-700 px-2 py-1.5 mt-1"
                          >
                            <option value="all">{t.allLanguages}</option>
                            <option value="ps">پښتو</option>
                            <option value="fa">دري</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400">{t.sampleUrlLabel}</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={promptForm.sampleUrl || ''}
                            onChange={(e) =>
                              setPromptForm({ ...promptForm, sampleUrl: e.target.value })
                            }
                            className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 px-3 py-1.5 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400">{t.sampleTypeLabel}</label>
                          <select
                            value={promptForm.sampleType || 'image'}
                            onChange={(e) =>
                              setPromptForm({ ...promptForm, sampleType: e.target.value as any })
                            }
                            className="w-full bg-slate-900 text-slate-200 rounded-xl border border-slate-700 px-2 py-1.5 mt-1"
                          >
                            <option value="image">انځور (Image)</option>
                            <option value="video">ویډیو (Video)</option>
                            <option value="audio">غږ (Audio)</option>
                            <option value="document">سند (Document)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-400">{t.instructionsPs}</label>
                        <input
                          type="text"
                          value={promptForm.usageInstructions?.ps || ''}
                          onChange={(e) =>
                            setPromptForm({
                              ...promptForm,
                              usageInstructions: {
                                ...promptForm.usageInstructions,
                                ps: e.target.value
                              } as any
                            })
                          }
                          className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 px-3 py-1.5 mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400">{t.tagsLabel}</label>
                          <input
                            type="text"
                            value={promptTagsInput}
                            onChange={(e) => setPromptTagsInput(e.target.value)}
                            placeholder={t.tagsHelper}
                            className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 px-3 py-1.5 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400">{t.authorLabel}</label>
                          <input
                            type="text"
                            value={promptForm.author || ''}
                            onChange={(e) =>
                              setPromptForm({ ...promptForm, author: e.target.value })
                            }
                            className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 px-3 py-1.5 mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-1 flex-wrap">
                        <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!promptForm.isFeatured}
                            onChange={(e) =>
                              setPromptForm({ ...promptForm, isFeatured: e.target.checked })
                            }
                            className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                          />
                          <span>{t.isFeaturedLabel}</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!promptForm.isPopular}
                            onChange={(e) =>
                              setPromptForm({ ...promptForm, isPopular: e.target.checked })
                            }
                            className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                          />
                          <span>{t.isPopularLabel}</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-amber-400 cursor-pointer font-bold">
                          <input
                            type="checkbox"
                            checked={!!promptForm.isDraft}
                            onChange={(e) =>
                              setPromptForm({ ...promptForm, isDraft: e.target.checked })
                            }
                            className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                          />
                          <span>{t.isDraftLabel}</span>
                        </label>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2">
                        {editingPromptItem && (
                          <button
                            type="button"
                            onClick={onClearEditing}
                            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                          >
                            {t.cancel}
                          </button>
                        )}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold flex items-center gap-1.5"
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : null}
                          <span>{t.save}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="lg:col-span-5 space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-1">
                      شته فرامپټونه ({prompts.length})
                    </h4>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {prompts.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-white truncate">
                                {p.title.ps || p.title.en}
                              </p>
                              {p.isDraft && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                  {t.statusDraft}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {p.targetTool} • {p.category}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setPromptForm(p);
                                setPromptTagsInput(p.tags.join(', '));
                              }}
                              className="p-1 text-blue-400 hover:text-blue-300"
                              title={t.editPrompt}
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirmItem({
                                  type: 'prompt',
                                  id: p.id,
                                  title: p.title.ps || p.title.en
                                });
                              }}
                              className="p-1 text-rose-400 hover:text-rose-300"
                              title={t.deletePrompt}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: LINKS */}
              {activeTab === 'links' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>{editingLinkItem ? t.editLink : t.addNewLink}</span>
                      </h4>
                      {editingLinkItem && (
                        <button
                          onClick={onClearEditing}
                          className="text-[11px] text-slate-400 hover:text-white"
                        >
                          نوی لینک پیل کړئ
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSaveLinkSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className="text-slate-300 font-medium">{t.titlePs} *</label>
                        <input
                          type="text"
                          required
                          value={linkForm.title?.ps || ''}
                          onChange={(e) =>
                            setLinkForm({
                              ...linkForm,
                              title: { ...linkForm.title, ps: e.target.value } as any
                            })
                          }
                          className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 px-3 py-2 mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400">{t.titleFa}</label>
                          <input
                            type="text"
                            value={linkForm.title?.fa || ''}
                            onChange={(e) =>
                              setLinkForm({
                                ...linkForm,
                                title: { ...linkForm.title, fa: e.target.value } as any
                              })
                            }
                            className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 px-3 py-1.5 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400">{t.titleEn}</label>
                          <input
                            type="text"
                            value={linkForm.title?.en || ''}
                            onChange={(e) =>
                              setLinkForm({
                                ...linkForm,
                                title: { ...linkForm.title, en: e.target.value } as any
                              })
                            }
                            className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 px-3 py-1.5 mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-300 font-medium">{t.linkUrl} *</label>
                        <input
                          type="text"
                          required
                          placeholder="https://example.com"
                          value={linkForm.url || ''}
                          onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                          className="w-full bg-slate-900 font-mono text-slate-100 rounded-xl border border-slate-700 px-3 py-2 mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300">{t.descPs}</label>
                        <textarea
                          rows={2}
                          value={linkForm.description?.ps || ''}
                          onChange={(e) =>
                            setLinkForm({
                              ...linkForm,
                              description: { ...linkForm.description, ps: e.target.value } as any
                            })
                          }
                          className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 p-2.5 mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-slate-400">{t.category}</label>
                          <select
                            value={linkForm.category || 'ai-tools'}
                            onChange={(e) =>
                              setLinkForm({ ...linkForm, category: e.target.value })
                            }
                            className="w-full bg-slate-900 text-slate-200 rounded-xl border border-slate-700 px-2 py-1.5 mt-1"
                          >
                            <option value="global-popular">Popular Global Sites</option>
                            <option value="education-scientific">Educational & Scientific</option>
                            <option value="free-courses">Free Courses</option>
                            <option value="books-libraries">Books & Libraries</option>
                            <option value="ai-tools">AI Tools</option>
                            <option value="design-photo">Design & Photos</option>
                            <option value="video-tools">Video Tools</option>
                            <option value="tech-programming">Tech & Programming</option>
                            <option value="translation-languages">Translation & Languages</option>
                            <option value="research-papers">Research & Papers</option>
                            <option value="news-media">News & Media</option>
                            <option value="afghan-resources">Afghan Resources</option>
                            <option value="government-services">Government Services</option>
                            <option value="jobs-scholarships">Jobs & Scholarships</option>
                            <option value="other-links">Other Links</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-400">{t.pricingLabel}</label>
                          <select
                            value={linkForm.pricing || 'free'}
                            onChange={(e) =>
                              setLinkForm({ ...linkForm, pricing: e.target.value as any })
                            }
                            className="w-full bg-slate-900 text-slate-200 rounded-xl border border-slate-700 px-2 py-1.5 mt-1"
                          >
                            <option value="free">{t.free}</option>
                            <option value="freemium">{t.freemium}</option>
                            <option value="paid">{t.paid}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-400">{t.filterLanguage}</label>
                          <select
                            value={linkForm.language || 'all'}
                            onChange={(e) =>
                              setLinkForm({ ...linkForm, language: e.target.value as any })
                            }
                            className="w-full bg-slate-900 text-slate-200 rounded-xl border border-slate-700 px-2 py-1.5 mt-1"
                          >
                            <option value="all">{t.allLanguages}</option>
                            <option value="ps">پښتو</option>
                            <option value="fa">دري</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400">Logo Image URL</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={linkForm.logoUrl || ''}
                            onChange={(e) =>
                              setLinkForm({ ...linkForm, logoUrl: e.target.value })
                            }
                            className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 px-3 py-1.5 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400">{t.badgePs}</label>
                          <input
                            type="text"
                            placeholder="وړیا / مهم"
                            value={linkForm.badge?.ps || ''}
                            onChange={(e) =>
                              setLinkForm({
                                ...linkForm,
                                badge: { ...linkForm.badge, ps: e.target.value } as any
                              })
                            }
                            className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 px-3 py-1.5 mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-400">{t.tagsLabel}</label>
                        <input
                          type="text"
                          value={linkTagsInput}
                          onChange={(e) => setLinkTagsInput(e.target.value)}
                          placeholder="ai, learning, web"
                          className="w-full bg-slate-900 text-slate-100 rounded-xl border border-slate-700 px-3 py-1.5 mt-1"
                        />
                      </div>

                      <div className="flex items-center gap-4 pt-1 flex-wrap">
                        <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!linkForm.isFeatured}
                            onChange={(e) =>
                              setLinkForm({ ...linkForm, isFeatured: e.target.checked })
                            }
                            className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                          />
                          <span>{t.isFeaturedLabel}</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!linkForm.isPopular}
                            onChange={(e) =>
                              setLinkForm({ ...linkForm, isPopular: e.target.checked })
                            }
                            className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                          />
                          <span>{t.isPopularLabel}</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-amber-400 cursor-pointer font-bold">
                          <input
                            type="checkbox"
                            checked={!!linkForm.isDraft}
                            onChange={(e) =>
                              setLinkForm({ ...linkForm, isDraft: e.target.checked })
                            }
                            className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                          />
                          <span>{t.isDraftLabel}</span>
                        </label>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2">
                        {editingLinkItem && (
                          <button
                            type="button"
                            onClick={onClearEditing}
                            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                          >
                            {t.cancel}
                          </button>
                        )}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold flex items-center gap-1.5"
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : null}
                          <span>{t.save}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="lg:col-span-5 space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-1">
                      شته لینکونه ({links.length})
                    </h4>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {links.map((l) => (
                        <div
                          key={l.id}
                          className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-white truncate">
                                {l.title.ps || l.title.en}
                              </p>
                              {l.isDraft && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                  {t.statusDraft}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono truncate">
                              {l.url}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setLinkForm(l);
                                setLinkTagsInput(l.tags.join(', '));
                              }}
                              className="p-1 text-blue-400 hover:text-blue-300"
                              title={t.editLink}
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirmItem({
                                  type: 'link',
                                  id: l.id,
                                  title: l.title.ps || l.title.en
                                });
                              }}
                              className="p-1 text-rose-400 hover:text-rose-300"
                              title={t.deleteLink}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: AUDIT LOGS */}
              {activeTab === 'audit' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <Activity className="h-4 w-4 text-amber-400" />
                      <span>{t.auditLogsTab}</span>
                    </div>
                    {auditLogs.length > 0 && adminRole === 'super_admin' && (
                      <button
                        onClick={() => {
                          clearStoredAuditLogs();
                          setAuditLogs([]);
                        }}
                        className="text-xs text-rose-400 hover:text-rose-300 underline"
                      >
                        {t.clearAuditLogs}
                      </button>
                    )}
                  </div>

                  {auditLogs.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      {t.noAuditLogs}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-start text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="py-2 px-3 text-start">{t.auditTimestamp}</th>
                            <th className="py-2 px-3 text-start">{t.auditUser}</th>
                            <th className="py-2 px-3 text-start">{t.auditAction}</th>
                            <th className="py-2 px-3 text-start">{t.auditEntity}</th>
                            <th className="py-2 px-3 text-start">جزئیات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-800/40">
                              <td className="py-2 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleString(
                                  currentLang === 'en' ? 'en-US' : 'fa-AF'
                                )}
                              </td>
                              <td className="py-2 px-3 text-slate-200 font-semibold truncate max-w-[150px]">
                                {log.userEmail}
                              </td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 border border-slate-700 text-amber-400">
                                  {log.action}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-slate-300 truncate max-w-[150px]">
                                {log.entityTitle || log.entityType}
                              </td>
                              <td className="py-2 px-3 text-slate-400 text-[11px] truncate max-w-[200px]">
                                {log.details || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: DATABASE & BACKUP */}
              {activeTab === 'database' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Download className="h-4 w-4 text-emerald-400" />
                      <span>{t.exportData}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      د محلي معلوماتو (Prompts, Links, Favorites, Audit Logs) د یوه پاک او معیاري JSON بستې په توګه ترلاسه کول.
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                      یادونه: دا Export یوازې د Frontend/کیش د معلوماتو بسته ده؛ د ریموټ Production د بشپړ ډیټابېس بیک اپ لپاره د Supabase رسمي ډشبورډ وکاروئ.
                    </div>
                    <button
                      onClick={handleExport}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <Download className="h-4 w-4" />
                      <span>ډاونلوډ (JSON Export)</span>
                    </button>
                  </div>

                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Upload className="h-4 w-4 text-blue-400" />
                      <span>{t.importData}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      د پخوانیو بیک اپ شویو فایلونو پورته کول. سیسټم د واردولو مخکې جوړښت Validate کوي او اتوماتیک بیړنی Snapshot اخلي.
                    </p>
                    <label className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer">
                      <Upload className="h-4 w-4" />
                      <span>فایل انتخاب کړئ (JSON)</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="md:col-span-2 bg-slate-800/40 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h4 className="text-xs font-bold text-rose-400">
                        {t.resetDefaults}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {t.resetDefaultsConfirm}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(t.resetDefaultsConfirm)) {
                          onResetDefaults();
                          setMessage({
                            text: `${t.resetDefaults}: معلومات اصلي حالت ته واوښتل.`,
                            type: 'success'
                          });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 font-bold text-xs transition-colors shrink-0"
                    >
                      {t.resetDefaults}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Import Preview Modal */}
      {importPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <FileCheck2 className="h-5 w-5" />
              <span>{t.importPreviewTitle}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.importPreviewDesc}
            </p>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>فرامپټونه:</span>
                <span className="font-bold text-white">{importPreview.summary?.promptsCount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ګټور لینکونه:</span>
                <span className="font-bold text-white">{importPreview.summary?.linksCount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>خوښ شوي:</span>
                <span className="font-bold text-white">{importPreview.summary?.favoritesCount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>نسخه:</span>
                <span className="font-mono text-amber-400">{importPreview.summary?.version}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setImportPreview(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                {t.confirmImport}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="h-5 w-5" />
              <span>{t.confirmDeleteTitle}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.confirmDeleteSpecific}
            </p>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold text-white truncate">
              {deleteConfirmItem.title}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleExecuteDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5"
              >
                {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                <span>{t.delete}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
