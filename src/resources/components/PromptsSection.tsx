import React, { useState, useMemo } from 'react';
import { PromptItem, Language, PromptCategory } from '../types';
import { translations } from '../data/translations';
import {
  Copy,
  Check,
  Star,
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles,
  Bot,
  Layers,
  Filter,
  Maximize2,
  X,
  Send,
  Plus,
  Flame,
  Clock,
  HelpCircle,
  Image as ImageIcon,
  Film,
  Music,
  FileText
} from 'lucide-react';

interface PromptsSectionProps {
  prompts: PromptItem[];
  currentLang: Language;
  searchQuery: string;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  isAdmin: boolean;
  onEditPrompt: (prompt: PromptItem) => void;
  onDeletePrompt: (id: string) => void;
  onAddNewPrompt: () => void;
  showOnlyFavorites?: boolean;
}

export const PromptsSection: React.FC<PromptsSectionProps> = ({
  prompts,
  currentLang,
  searchQuery,
  favorites,
  onToggleFavorite,
  isAdmin,
  onEditPrompt,
  onDeletePrompt,
  onAddNewPrompt,
  showOnlyFavorites = false
}) => {
  const t = translations[currentLang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [activeFilterStatus, setActiveFilterStatus] = useState<'all' | 'newest' | 'popular' | 'featured'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'featured' | 'title'>('newest');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectPrompt, setInspectPrompt] = useState<PromptItem | null>(null);
  const [customizedPromptText, setCustomizedPromptText] = useState<string>('');
  const [viewInstructionsId, setViewInstructionsId] = useState<string | null>(null);

  // The 14 official Prompt categories requested + 'all'
  const promptCategoriesList: PromptCategory[] = [
    'all',
    'image-generation',
    'funny-entertainment',
    'informational-scientific',
    'education-learning',
    'art-creative',
    'writing-poetry',
    'social-media',
    'business-professional',
    'programming-technology',
    'video-creation',
    'research-analysis',
    'translation-language',
    'audio-music',
    'other'
  ];

  const toolsList = ['All', 'ChatGPT', 'Gemini', 'Claude', 'Midjourney', 'DeepSeek'];

  // Normalize category key for legacy backward compatibility
  const normalizeCategory = (cat: string): string => {
    switch (cat) {
      case 'coding':
        return 'programming-technology';
      case 'writing':
        return 'writing-poetry';
      case 'education':
        return 'education-learning';
      case 'business':
        return 'business-professional';
      case 'creative':
        return 'art-creative';
      case 'productivity':
        return 'informational-scientific';
      case 'marketing':
        return 'social-media';
      case 'general':
        return 'other';
      default:
        return cat;
    }
  };

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    return prompts
      .filter((item) => {
        // Favorites tab filter
        if (showOnlyFavorites && !favorites.includes(item.id)) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all') {
          const itemCatNorm = normalizeCategory(item.category);
          if (itemCatNorm !== selectedCategory && item.category !== selectedCategory) {
            return false;
          }
        }

        // Target tool filter
        if (selectedTool !== 'All' && item.targetTool !== selectedTool) {
          return false;
        }

        // Language filter
        if (selectedLanguage !== 'all') {
          if (item.language && item.language !== 'all' && item.language !== selectedLanguage) {
            return false;
          }
        }

        // Quick status filter tab (Newest, Popular, Featured)
        if (activeFilterStatus === 'featured' && !item.isFeatured) {
          return false;
        }
        if (activeFilterStatus === 'popular' && !item.isPopular) {
          return false;
        }

        // Search query filter (matches title, description, prompt text, or tags)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle =
            (item.title.ps && item.title.ps.toLowerCase().includes(q)) ||
            (item.title.fa && item.title.fa.toLowerCase().includes(q)) ||
            (item.title.en && item.title.en.toLowerCase().includes(q));
          const matchDesc =
            (item.description.ps && item.description.ps.toLowerCase().includes(q)) ||
            (item.description.fa && item.description.fa.toLowerCase().includes(q)) ||
            (item.description.en && item.description.en.toLowerCase().includes(q));
          const matchPrompt = item.promptText && item.promptText.toLowerCase().includes(q);
          const matchTags = item.tags && item.tags.some((tag) => tag.toLowerCase().includes(q));

          if (!matchTitle && !matchDesc && !matchPrompt && !matchTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
        }
        if (sortBy === 'popular') {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
        }
        if (sortBy === 'title') {
          const titleA = a.title[currentLang] || a.title.en || a.title.ps || '';
          const titleB = b.title[currentLang] || b.title.en || b.title.ps || '';
          return titleA.localeCompare(titleB);
        }
        // Default: newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    prompts,
    selectedCategory,
    selectedTool,
    selectedLanguage,
    activeFilterStatus,
    sortBy,
    searchQuery,
    favorites,
    showOnlyFavorites,
    currentLang
  ]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const openInTool = (tool: string, promptText: string) => {
    navigator.clipboard.writeText(promptText);

    let url = 'https://gemini.google.com';
    const toolLower = tool.toLowerCase();

    if (toolLower.includes('chatgpt')) {
      url = `https://chatgpt.com/?q=${encodeURIComponent(promptText)}`;
    } else if (toolLower.includes('gemini')) {
      url = 'https://gemini.google.com/app';
    } else if (toolLower.includes('claude')) {
      url = 'https://claude.ai';
    } else if (toolLower.includes('midjourney')) {
      url = 'https://www.midjourney.com';
    } else if (toolLower.includes('deepseek')) {
      url = 'https://chat.deepseek.com';
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenInspect = (prompt: PromptItem) => {
    setInspectPrompt(prompt);
    setCustomizedPromptText(prompt.promptText);
  };

  const renderSamplePreview = (prompt: PromptItem) => {
    if (!prompt.sampleUrl) return null;
    const type = prompt.sampleType || 'image';

    return (
      <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1.5">
          {type === 'image' && <ImageIcon className="h-3.5 w-3.5 text-pink-400" />}
          {type === 'video' && <Film className="h-3.5 w-3.5 text-cyan-400" />}
          {type === 'audio' && <Music className="h-3.5 w-3.5 text-amber-400" />}
          {type === 'document' && <FileText className="h-3.5 w-3.5 text-emerald-400" />}
          <span>{t.samplePreview}</span>
        </div>
        {type === 'image' && (
          <img
            src={prompt.sampleUrl}
            alt="Sample preview"
            className="w-full h-36 object-cover rounded-lg border border-slate-700/60"
            loading="lazy"
          />
        )}
        {type === 'video' && (
          <video
            src={prompt.sampleUrl}
            controls
            className="w-full h-36 object-cover rounded-lg bg-black"
          />
        )}
        {type === 'audio' && (
          <audio src={prompt.sampleUrl} controls className="w-full mt-1" />
        )}
        {type === 'document' && (
          <a
            href={prompt.sampleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>کتل یا ډاونلوډ</span>
          </a>
        )}
      </div>
    );
  };

  return (
    <section className="py-6 space-y-6">
      {/* Category Pills & Quick Filter Controls */}
      <div className="space-y-4">
        {/* Categories Carousel/Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {promptCategoriesList.map((catKey) => {
            const isSelected = selectedCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                  isSelected
                    ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600'
                }`}
              >
                {t.promptCategories[catKey] || catKey}
              </button>
            );
          })}
        </div>

        {/* Status Filters (All, Newest, Trending, Featured) & Tool Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilterStatus === 'all'
                  ? 'bg-slate-700 text-white border border-slate-600'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.allCategories}
            </button>
            <button
              onClick={() => setActiveFilterStatus('newest')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilterStatus === 'newest'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="h-3 w-3" />
              <span>{t.newest}</span>
            </button>
            <button
              onClick={() => setActiveFilterStatus('popular')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilterStatus === 'popular'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="h-3 w-3" />
              <span>{t.popular}</span>
            </button>
            <button
              onClick={() => setActiveFilterStatus('featured')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilterStatus === 'featured'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>{t.featured}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 ms-auto">
            {/* Language Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 hidden sm:inline">{t.filterLanguage}</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-800 text-slate-200 text-xs rounded-xl border border-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">{t.allLanguages}</option>
                <option value="ps">پښتو (Pashto)</option>
                <option value="fa">دري (Dari)</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* AI Model Selector */}
            <div className="flex items-center gap-1 text-xs">
              <select
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="bg-slate-800 text-slate-200 text-xs rounded-xl border border-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {toolsList.map((tool) => (
                  <option key={tool} value={tool}>
                    {t.tools[tool] || tool}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-800 text-slate-200 text-xs rounded-xl border border-slate-700 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="newest">{t.newest}</option>
              <option value="popular">{t.popular}</option>
              <option value="featured">{t.featured}</option>
              <option value="title">{t.alphabetical}</option>
            </select>

            {isAdmin && (
              <button
                onClick={onAddNewPrompt}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md transition-all shrink-0"
              >
                <Plus className="h-3.5 w-3.5 stroke-[3]" />
                <span>{t.addNewPrompt}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Prompts Cards Grid */}
      {filteredPrompts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
          <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
            <Layers className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t.noResults}</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-5">
            {t.noResultsDesc}
          </p>
          {(selectedCategory !== 'all' || selectedTool !== 'All' || selectedLanguage !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTool('All');
                setSelectedLanguage('all');
                setActiveFilterStatus('all');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
            >
              {t.clearFilters}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrompts.map((prompt) => {
            const isFav = favorites.includes(prompt.id);
            const isCopied = copiedId === prompt.id;
            const title = prompt.title[currentLang] || prompt.title.ps || prompt.title.en;
            const desc = prompt.description[currentLang] || prompt.description.ps || prompt.description.en;
            const instructions = prompt.usageInstructions
              ? prompt.usageInstructions[currentLang] || prompt.usageInstructions.ps || prompt.usageInstructions.en
              : null;
            const isInstructionsOpen = viewInstructionsId === prompt.id;

            return (
              <article
                key={prompt.id}
                className="group relative flex flex-col justify-between bg-slate-800/70 hover:bg-slate-800 rounded-2xl border border-slate-700/80 hover:border-amber-500/40 p-5 shadow-lg transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5"
              >
                <div>
                  {/* Badges Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {t.promptCategories[prompt.category] || prompt.category}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                        <Bot className="h-3 w-3" />
                        {prompt.targetTool}
                      </span>
                      {prompt.isFeatured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5" />
                          {t.featured}
                        </span>
                      )}
                      {prompt.isPopular && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                          <Flame className="h-2.5 w-2.5" />
                          {t.popular}
                        </span>
                      )}
                      {prompt.isDraft && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {t.statusDraft}
                        </span>
                      )}
                    </div>

                    {/* Bookmark Favorite */}
                    <button
                      onClick={() => onToggleFavorite(prompt.id)}
                      className={`p-1.5 rounded-lg transition-all ${
                        isFav
                          ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                          : 'text-slate-400 hover:text-amber-400 hover:bg-slate-700/60'
                      }`}
                      title={isFav ? t.removeFromFavorites : t.addToFavorites}
                    >
                      <Star className={`h-4 w-4 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 mb-2">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 mb-3 leading-relaxed">
                    {desc}
                  </p>

                  {/* Usage Guide / Instructions Toggle */}
                  {instructions && (
                    <div className="mb-3">
                      <button
                        onClick={() =>
                          setViewInstructionsId(isInstructionsOpen ? null : prompt.id)
                        }
                        className="text-[11px] font-medium text-amber-400/90 hover:text-amber-300 inline-flex items-center gap-1"
                      >
                        <HelpCircle className="h-3 w-3" />
                        <span>{t.usageInstructions}</span>
                      </button>
                      {isInstructionsOpen && (
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/20 text-xs text-slate-300 leading-relaxed">
                          {instructions}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sample Output Preview (Image / Video / Audio) */}
                  {renderSamplePreview(prompt)}

                  {/* Prompt Text Preview Box */}
                  <div className="relative mt-3 bg-slate-950/70 border border-slate-800 rounded-xl p-3 mb-3 font-mono text-[11px] text-slate-300 leading-relaxed overflow-hidden">
                    <p className="line-clamp-3 select-all whitespace-pre-line">
                      {prompt.promptText}
                    </p>
                    <button
                      onClick={() => handleOpenInspect(prompt)}
                      className="absolute bottom-1.5 end-2 text-[10px] font-sans font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-1 border border-slate-700"
                    >
                      <Maximize2 className="h-2.5 w-2.5" />
                      <span>{t.quickPreview}</span>
                    </button>
                  </div>

                  {/* Tags */}
                  {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {prompt.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions: Copy, AI test launcher, and Admin CRUD */}
                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      onClick={() => handleCopy(prompt.id, prompt.promptText)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        isCopied
                          ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                          <span>{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>{t.copyPrompt}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => openInTool(prompt.targetTool, prompt.promptText)}
                      className="p-2 rounded-xl bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 transition-all"
                      title={`${t.openTool} (${prompt.targetTool})`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1 shrink-0 ps-1">
                      <button
                        onClick={() => onEditPrompt(prompt)}
                        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                        title={t.editPrompt}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeletePrompt(prompt.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
                        title={t.deletePrompt}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Variable Customization and Interactive Inspection Modal */}
      {inspectPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {inspectPrompt.title[currentLang] || inspectPrompt.title.ps || inspectPrompt.title.en}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {inspectPrompt.targetTool} • {t.promptCategories[inspectPrompt.category] || inspectPrompt.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectPrompt(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                💡 {t.promptVariablesNote}
              </div>

              {inspectPrompt.usageInstructions && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <HelpCircle className="h-3.5 w-3.5" />
                    {t.usageInstructions}:
                  </span>
                  <p className="leading-relaxed">
                    {inspectPrompt.usageInstructions[currentLang] ||
                      inspectPrompt.usageInstructions.ps ||
                      inspectPrompt.usageInstructions.en}
                  </p>
                </div>
              )}

              {renderSamplePreview(inspectPrompt)}

              <label className="block text-xs font-semibold text-slate-300">
                {t.promptContent}:
              </label>
              <textarea
                value={customizedPromptText}
                onChange={(e) => setCustomizedPromptText(e.target.value)}
                rows={9}
                className="w-full bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm rounded-xl border border-slate-700 p-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setCustomizedPromptText(inspectPrompt.promptText)}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                بېرته اصلي بڼې ته (Reset)
              </button>

              <div className="flex items-center gap-2 ms-auto">
                <button
                  onClick={() => openInTool(inspectPrompt.targetTool, customizedPromptText)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5 text-amber-400" />
                  <span>{t.openTool}</span>
                </button>
                <button
                  onClick={() => handleCopy(inspectPrompt.id, customizedPromptText)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  {copiedId === inspectPrompt.id ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>{t.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>{t.copyPrompt}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
