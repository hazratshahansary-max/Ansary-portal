import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language, ProjectItem, SiteSettings } from '../types';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface ContactSectionProps {
  language: Language;
  siteSettings: SiteSettings;
  selectedProject: ProjectItem | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  language,
  siteSettings,
  selectedProject
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(selectedProject ? `Architecture Inquiry: ${selectedProject.title}` : '');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const t = TRANSLATIONS[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contact" className="py-14 sm:py-20 bg-white dark:bg-[#070D1E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 pb-4 border-b border-slate-200 dark:border-blue-950">
          <div className="flex items-center gap-2 text-blue-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Mail className="w-4 h-4" />
            <span>{t.nav.contact}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.sections.contactTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {t.sections.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-slate-50 dark:bg-[#0A1428] border border-slate-200 dark:border-blue-900/50 p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'ps' ? 'رسمي معلومات او مخابره' : language === 'fa' ? 'اطلاعات رسمی و هماهنگی' : 'Official Coordinates'}
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px] font-medium">Email</p>
                    <a
                      href="mailto:hazrat.shah.ansary@gmail.com"
                      className="font-bold text-slate-900 dark:text-white hover:text-blue-600 transition"
                    >
                      hazrat.shah.ansary@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px] font-medium">Direct Telephone</p>
                    <p className="font-bold text-slate-900 dark:text-white font-mono">
                      {siteSettings.phone || '+93 70 000 0000'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px] font-medium">Headquarters</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {siteSettings.address || 'Kabul, Afghanistan · Ansary Knowledge'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Instant Channels */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {language === 'ps' ? 'فوري اړیکې' : 'Direct Channels'}
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={siteSettings.whatsapp || 'https://wa.me/93700000000'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={siteSettings.telegram || 'https://t.me/ansary_knowledge'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white dark:bg-[#0A1428] border border-slate-200 dark:border-blue-900/50 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                {language === 'ps' ? 'د پیغام لېږلو فورمه' : language === 'fa' ? 'ارسال پیام مستقیم' : 'Dispatch an Official Dispatch'}
              </h3>

              {submitted ? (
                <div className="p-8 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                    {language === 'ps' ? 'مننه! ستاسو پیغام ترلاسه شو او ډېر ژر به ځواب شي.' : 'Message received. We will respond promptly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {language === 'ps' ? 'ستاسو نوم:' : 'Your Name:'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Ahmad Khan"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {language === 'ps' ? 'ستاسو برېښنالیک:' : 'Email Address:'}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="e.g. user@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {language === 'ps' ? 'موضوع / پروژه:' : 'Subject:'}
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="e.g. Database Consultation / Book Ingestion"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {language === 'ps' ? 'د پیغام متن:' : 'Message:'} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Write your inquiry or feedback..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{language === 'ps' ? 'پیغام واستوئ' : language === 'fa' ? 'ارسال پیام' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
