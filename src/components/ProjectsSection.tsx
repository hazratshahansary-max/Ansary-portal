import React, { useState } from 'react';
import { Project, Language } from '../types';
import { translations } from '../lib/i18n';
import { InteractionBar } from './InteractionBar';
import {
  FolderGit2,
  Database,
  CheckCircle2,
  Mail,
  Phone,
  ShieldAlert,
  ExternalLink,
  Layers,
  ArrowRight,
  X,
} from 'lucide-react';

interface Props {
  projects: Project[];
  language: Language;
  onInquire: (project: Project) => void;
}

export const ProjectsSection: React.FC<Props> = ({ projects, language, onInquire }) => {
  const t = translations[language];
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-amber-400 mb-1">
          <Database className="w-4 h-4" />
          <span>{language === 'ps' ? 'د ډیټابیس او کلاوډ انجینرۍ پورټفولیو' : language === 'fa' ? 'پورتفولیو دیتابیس و کلاود' : 'Database & Enterprise Systems'}</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {t.sections.ourProjects}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
          {t.sections.ourProjectsSub}
        </p>

        {/* Prominent Security Notice Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start sm:items-center gap-3 text-xs text-amber-800 dark:text-amber-300">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0 text-amber-500" />
          <p className="leading-relaxed">
            {t.projects.securityBanner}
          </p>
        </div>
      </div>

      {/* Projects Showcase Cards */}
      <div className="space-y-12">
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl transition duration-300 flex flex-col lg:flex-row items-stretch"
          >
            {/* Screenshots / Mockup Gallery Side (5 cols) */}
            <div className="lg:w-5/12 bg-slate-950 p-6 flex flex-col justify-between relative group">
              <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-800 shadow-2xl">
                <img
                  src={project.screenshots[0] || '/src/assets/images/ansary_database_project_1793805839928.jpg'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-[11px] font-mono text-amber-400 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-400/30">
                    {project.databaseType}
                  </span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>RLS &amp; AES-256 Hardened</span>
                </span>
                <span className="font-mono text-slate-500">PROD-ISOLATED</span>
              </div>
            </div>

            {/* Content & Specs Side (7 cols) */}
            <div className="lg:w-7/12 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-amber-400 mb-2 font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{project.databaseType}</span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {project.shortDescription}
                </p>

                {/* Key Features */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    {t.projects.features}:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                    {project.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Development Technology Stack (Unboxed text with dots) */}
                <div className="mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {t.projects.databaseTech}:
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
                    {project.techStack.map((tech, tIdx) => (
                      <React.Fragment key={tIdx}>
                        {tIdx > 0 && <span className="text-slate-400">·</span>}
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-sans text-xs">
                          {tech}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                {/* Contact Information & Action Button */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                      <span className="font-mono text-slate-700 dark:text-slate-300">{project.contactInfo.email}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-mono text-slate-700 dark:text-slate-300">{project.contactInfo.phone}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition"
                    >
                      {t.actions.viewProject}
                    </button>

                    <button
                      onClick={() => onInquire(project)}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow transition flex items-center gap-1.5 active:scale-95"
                    >
                      <span>{t.actions.inquireProject}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>
                </div>

                {/* Working Likes / Dislikes / Comments / Share */}
                <InteractionBar
                  targetId={project.id}
                  targetType="project"
                  initialLikes={project.likes}
                  initialDislikes={project.dislikes}
                  itemTitle={project.title}
                  language={language}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative text-left [dir=rtl]:text-right">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 [dir=rtl]:right-auto [dir=rtl]:left-5 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono text-amber-500 font-semibold uppercase">
              {selectedProject.databaseType}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 mb-4">
              {selectedProject.title}
            </h3>

            <div className="rounded-2xl overflow-hidden aspect-video bg-slate-950 mb-6 border border-slate-800">
              <img
                src={selectedProject.screenshots[0]}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 mb-6">
              <div className="whitespace-pre-line">
                {selectedProject.fullDescription}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2 mb-6">
              <p className="font-bold text-slate-900 dark:text-white">Security &amp; Architecture Notes:</p>
              <p className="text-slate-600 dark:text-slate-400">{selectedProject.securityNotice}</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedProject(null);
                  onInquire(selectedProject);
                }}
                className="py-2.5 px-5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950"
              >
                {t.actions.inquireProject}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
