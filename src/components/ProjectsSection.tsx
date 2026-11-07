import React from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language, ProjectItem } from '../types';
import { DEFAULT_DATABASE_IMG } from '../assets/images';
import {
  Layers,
  Database,
  ShieldCheck,
  Server,
  Cpu,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  language: Language;
  onInquire: (project: ProjectItem) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  language,
  onInquire
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language !== 'en';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section id="projects" className="py-14 sm:py-20 bg-white dark:bg-[#070D1E] transition-colors border-b border-slate-200 dark:border-blue-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 pb-4 border-b border-slate-200 dark:border-blue-950 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Database className="w-4 h-4" />
              <span>{t.nav.projects}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t.sections.projectsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {t.sections.projectsSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 border border-blue-200 dark:border-blue-800">
              <Server className="w-3.5 h-3.5" />
              <span>PostgreSQL &amp; Supabase Multi-Cluster</span>
            </span>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-[#0A1428] rounded-3xl border border-dashed border-slate-200 dark:border-blue-900/40 space-y-2">
            <Database className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500 mb-2 opacity-70" />
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {language === 'ps'
                ? '«تر اوسه هېڅ محتوا نه ده خپره شوې»'
                : language === 'fa'
                ? '«تا هنوز هیچ محتوایی منتشر نشده است»'
                : '«No content has been published yet»'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ps'
                ? 'دا برخه د عملي کلاوډ او سافټویر ډیټابیس پروژو معرفي کولو لپاره چمتو ده.'
                : language === 'fa'
                ? 'این بخش برای معرفی پروژه‌های ابری و پایگاه‌های داده آماده می‌باشد.'
                : 'Ready to showcase production cloud architectures and relational database engineering projects.'}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className="rounded-3xl bg-slate-50 dark:bg-[#0A1428] border border-slate-200 dark:border-blue-900/50 overflow-hidden p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Overview */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                      {project.databaseType}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Lead: {project.contactInfo.leadEngineer}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {project.title}
                  </h3>

                  <p className="text-sm font-medium text-blue-600 dark:text-amber-400 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-white/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
                    {project.fullDescription}
                  </div>

                  {/* Key Architecture Features */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                      {language === 'ps' ? 'کلیدي معماري ځانګړتیاوې:' : 'Architectural Highlights:'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {project.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Notice */}
                  {project.securityNotice && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-300 text-xs">
                      <Lock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <span>{project.securityNotice}</span>
                    </div>
                  )}

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action CTA */}
                  <div className="pt-2">
                    <button
                      onClick={() => onInquire(project)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{language === 'ps' ? 'د ډیټابیس مشورې غوښتنه' : language === 'fa' ? 'مشاوره و استعلام پروژه' : 'Request Architecture Consultation'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Architecture Blueprint Diagram */}
                <div className="lg:col-span-5 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
                  <img
                    src={project.screenshots?.[0] || DEFAULT_DATABASE_IMG}
                    alt={project.title}
                    className="w-full h-auto object-cover"
                    onError={(e: any) => {
                      e.target.src = DEFAULT_DATABASE_IMG;
                    }}
                  />
                  <div className="p-4 bg-slate-900/90 text-center border-t border-slate-800">
                    <p className="text-xs text-blue-400 font-mono">
                      Database Schema Topology · Production Node {idx + 1}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
};
