import React, { useState } from 'react';
import { Language, Project } from '../types';
import { translations } from '../lib/i18n';
import { Mail, Phone, MapPin, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  language: Language;
  selectedProject?: Project | null;
}

export const ContactSection: React.FC<Props> = ({ language, selectedProject }) => {
  const t = translations[language];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(
    selectedProject ? `Inquiry regarding ${selectedProject.title}` : ''
  );
  const [message, setMessage] = useState('');
  const [mathA] = useState(() => Math.floor(Math.random() * 7) + 3);
  const [mathB] = useState(() => Math.floor(Math.random() * 6) + 2);
  const [mathAnswer, setMathAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setErrorMessage('');

    if (parseInt(mathAnswer.trim(), 10) !== mathA + mathB) {
      setStatus('error');
      setErrorMessage(t.comments.spamError);
      return;
    }

    // Process contact inquiry
    setStatus('success');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setMathAnswer('');
  };

  return (
    <section id="contact" className="py-12 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t.sections.contactUs}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.sections.contactUsSub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Direct Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {language === 'ps' ? 'مستقیمې اړیکې' : language === 'fa' ? 'کانال‌های ارتباطی' : 'Direct Channels'}
              </h3>

              <div className="space-y-4 text-xs">
                <a
                  href="mailto:hazrat.shah.ansary@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/60 transition group"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Official Email</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono group-hover:text-blue-600 transition">
                      hazrat.shah.ansary@gmail.com
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">WhatsApp &amp; Telegram</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      +93 70 000 0000 / Available
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Headquarters</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Kabul, Afghanistan &amp; Global Remote
                    </p>
                  </div>
                </div>
              </div>

              {/* Slogan Pill */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <span className="font-display text-sm font-bold tracking-widest text-blue-600 dark:text-amber-400">
                  ANSARY
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {t.slogan}
                </p>
              </div>
            </div>
          </div>

          {/* Contact & Inquiries Form (7 cols) */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4"
            >
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                {language === 'ps'
                  ? 'پیغام واستوئ یا د پروژې مشوره وغواړئ'
                  : language === 'fa'
                  ? 'ارسال پیام و استعلام پروژه'
                  : 'Send an Inquiry or Feedback'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.comments.yourName}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. احمد / Ahmad"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.comments.yourEmail} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ps' ? 'موضوع' : language === 'fa' ? 'موضوع پیام' : 'Subject'}
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Database Architecture Consulting"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ps' ? 'ستاسو پیغام' : language === 'fa' ? 'متن پیام شما' : 'Your Message'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
                />
              </div>

              {/* Anti-spam math question */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    {t.comments.antiSpamQuestion}{' '}
                    <strong className="font-mono text-slate-900 dark:text-white">
                      {mathA} + {mathB} = ?
                    </strong>
                  </span>
                  <input
                    type="number"
                    required
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    className="w-16 px-2 py-1 text-xs text-center rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono"
                    placeholder="?"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-xs shadow-md transition active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.actions.send}</span>
                </button>
              </div>

              {status === 'success' && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {language === 'ps'
                      ? 'ستاسو پیغام په بریالیتوب سره واستول شو. ډېر ژر به ځواب درکړل شي.'
                      : language === 'fa'
                      ? 'پیام شما با موفقیت ارسال شد. به زودی با شما تماس گرفته خواهد شد.'
                      : 'Your message has been sent successfully. We will be in touch shortly.'}
                  </span>
                </div>
              )}

              {status === 'error' && (
                <p className="text-xs text-rose-500 font-medium">{errorMessage}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
