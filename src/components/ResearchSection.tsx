import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language, ResearchPaper } from '../types';
import {
  GraduationCap,
  FileText,
  Download,
  Quote,
  Check,
  Calendar,
  Clock,
  Building,
  Award,
  ExternalLink
} from 'lucide-react';

interface ResearchSectionProps {
  papers: ResearchPaper[];
  language: Language;
  searchFilter?: string;
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({
  papers,
  language,
  searchFilter = ''
}) => {
  const [copiedDoi, setCopiedDoi] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const t = TRANSLATIONS[language];

  const filteredPapers = papers.filter(p => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.abstract.toLowerCase().includes(q) ||
      p.keywords.some(k => k.toLowerCase().includes(q))
    );
  });

  const handleCopyCitation = (paper: ResearchPaper) => {
    const citation = `${paper.author} (${paper.publishDate.slice(0, 4)}). "${paper.title}". ${paper.institution}. DOI: ${paper.doi || 'N/A'}`;
    navigator.clipboard.writeText(citation);
    setCopiedDoi(paper.id);
    setTimeout(() => setCopiedDoi(null), 2500);
  };

  const handleDownload = (paper: ResearchPaper) => {
    const content = `========================================================================\nANSARY KNOWLEDGE RESEARCH LAB & WHITE PAPERS\n========================================================================\n\nTITLE: ${paper.title}\nAUTHOR: ${paper.author}\nINSTITUTION: ${paper.institution}\nDATE: ${paper.publishDate}\nFIELD: ${paper.field}\nDOI: ${paper.doi || 'N/A'}\n\nABSTRACT:\n${paper.abstract}\n\nKEYWORDS:\n${paper.keywords.join(', ')}\n\nPublished in the Ansary Knowledge Repository.\nWebsite: https://ansary.netlify.app/\nFounder: Hazrat Shah Ansary`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paper.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_Paper.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section id="research" className="py-14 sm:py-20 bg-white dark:bg-[#070D1E] transition-colors border-b border-slate-200 dark:border-blue-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 pb-4 border-b border-slate-200 dark:border-blue-950">
          <div className="flex items-center gap-2 text-blue-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>{(t.nav as any).research || 'Research & Whitepapers'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {(t.sections as any).researchTitle || 'Scientific Research & Technical Whitepapers'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {(t.sections as any).researchSubtitle || 'Peer-reviewed research exploring distributed PostgreSQL architectures, Row-Level Security performance, and cultural archiving.'}
          </p>
        </div>

        {/* Papers List */}
        {filteredPapers.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-[#0A1428] rounded-3xl border border-dashed border-slate-200 dark:border-blue-900/40 space-y-2">
            <GraduationCap className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500 mb-2 opacity-70" />
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {language === 'ps'
                ? '«تر اوسه هېڅ محتوا نه ده خپره شوې»'
                : language === 'fa'
                ? '«تا هنوز هیچ محتوایی منتشر نشده است»'
                : '«No content has been published yet»'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ps'
                ? 'دا برخه د رسمي اکاډمیکو مقالو او څېړنو خپرولو لپاره چمتو ده.'
                : language === 'fa'
                ? 'این بخش برای نشر مقالات علمی و پژوهشی آماده می‌باشد.'
                : 'Ready for peer-reviewed academic whitepapers and research publications.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
          {filteredPapers.map(paper => {
            const isExpanded = expandedId === paper.id;
            return (
              <div
                key={paper.id}
                className="rounded-3xl bg-slate-50 dark:bg-[#0A1428] border border-slate-200 dark:border-blue-900/40 p-6 sm:p-8 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    {/* Field & Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                        {paper.field}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{paper.publishDate}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{paper.readTime}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                      {paper.title}
                    </h3>

                    {/* Author & Institution */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-blue-600 dark:text-amber-400">
                        {paper.author}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Building className="w-3 h-3" />
                        <span>{paper.institution}</span>
                      </span>
                    </div>

                    {/* Abstract */}
                    <p className={`text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                      {paper.abstract}
                    </p>

                    {paper.abstract.length > 200 && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : paper.id)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {isExpanded ? (language === 'ps' ? 'لنډول' : 'Show Less') : (language === 'ps' ? 'نور ولولئ...' : 'Read Full Abstract...')}
                      </button>
                    )}

                    {/* Keywords */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      {paper.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-mono"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="lg:w-48 shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => handleDownload(paper)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>{language === 'ps' ? 'مقاله کښته کول' : language === 'fa' ? 'دانلود مقاله' : 'Download Paper'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyCitation(paper)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-medium hover:border-blue-400 transition"
                    >
                      {copiedDoi === paper.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{language === 'ps' ? 'کاپي شو!' : 'Citation Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Quote className="w-3.5 h-3.5 text-blue-500" />
                          <span>{language === 'ps' ? 'د ماخذ کاپي' : 'Cite Paper'}</span>
                        </>
                      )}
                    </button>

                    <div className="text-center text-[11px] text-slate-400 font-mono pt-1">
                      <span>Citations: </span>
                      <span className="font-bold text-slate-600 dark:text-slate-200">{paper.citations}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </section>
  );
};
