import React from 'react';
import { Language } from '../types';
import { translations } from '../lib/i18n';
import { Award, BookOpen, Code2, Globe2, Mail, MapPin } from 'lucide-react';

interface Props {
  language: Language;
  onContactClick: () => void;
}

export const AboutMeSection: React.FC<Props> = ({ language, onContactClick }) => {
  const t = translations[language];

  return (
    <section id="about" className="py-12 bg-white dark:bg-[#070D1E] border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Portrait Column (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 border-amber-400/30 shadow-2xl bg-gradient-to-br from-blue-950 to-slate-900 group">
              <img
                src="/src/assets/images/ansary_founder_portrait_1793805838391.jpg"
                alt="Hazrat Shah Ansary"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
                  Founder &amp; Principal Architect
                </span>
                <h3 className="font-display text-2xl font-bold">
                  {language === 'ps' ? 'حضرت شاه انصاري' : language === 'fa' ? 'حضرت شاه انصاری' : 'Hazrat Shah Ansary'}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {t.slogan}
                </p>
              </div>
            </div>
          </div>

          {/* Biography Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-amber-400 mb-1">
                <Globe2 className="w-4 h-4" />
                <span>{language === 'ps' ? 'د بنسټګر پېژندنه' : language === 'fa' ? 'زندگینامه و رسالت' : 'Biography & Mission'}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {t.sections.aboutFounder}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t.sections.aboutFounderSub}
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-serif">
              <p className="first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 [dir=rtl]:first-letter:float-none">
                {language === 'ps'
                  ? 'حضرت شاه انصاري یو پیاوړی افغان محقق، لیکوال او د سافټویر لوړپوړی انجنیر دی چې خپل ژوند یې د افغانستان د بډایه کلتوري او ادبي میراثونو ژوندي ساتلو او د عصري معلوماتي ټیکنالوژۍ او ډیټابیسونو ودې ته وقف کړی دی.'
                  : language === 'fa'
                  ? 'حضرت شاه انصاری پژوهشگر، نویسنده و مهندس ارشد سیستم‌های توزیع‌شده نرم‌افزاری و پایگاه داده است. ایشان سال‌ها در زمینه پل زدن میان ادبیات غنی و عرفانی کهن با جهان مدرن دیجیتال و الگوریتم‌های هوش مصنوعی فعالیت مستمر داشته‌اند.'
                  : 'Hazrat Shah Ansary is an Afghan author, research scholar, and senior software technology engineer. He has dedicated his career to bridging classical literature and poetic heritage with modern enterprise database engineering, cloud computing, and digital literacy.'}
              </p>
              <p>
                {language === 'ps'
                  ? 'د انصاري علمي او ټیکنالوژیکي پلیټفارم موخه دا ده چې د پښتو، دري او نړیوالو ژبو د یووالي له لارې ځوان نسل ته وړیا کتابونه، کره خبرونه، د لوړ کیفیت ویډیوګانې او د پرمختللو ډیټابیسونو عملي پوهه ورسوي.'
                  : language === 'fa'
                  ? 'پلتفرم چندزبانه انصاری بر پایه این باور استوار است که پیشرفت جامعه تنها با تلفیق اخلاق، آگاهی ادبی و فناوری‌های نوین داده‌محور میسر خواهد بود.'
                  : 'The ANSARY portal serves as an intellectual lighthouse offering uncensored educational knowledge, digital library books, classical Persian & Pashto poetry, and enterprise software architectures for scholars and developers worldwide.'}
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {language === 'ps' ? 'ډیټابیس او ټیکنالوژي' : language === 'fa' ? 'مهندسی دیتابیس' : 'Database Engineering'}
                </h4>
                <p className="text-[11px] text-slate-500">PostgreSQL, Supabase, Cloud &amp; Distributed Architectures</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {language === 'ps' ? 'ادب او تصوف' : language === 'fa' ? 'ادبیات و عرفان' : 'Literature & Poetics'}
                </h4>
                <p className="text-[11px] text-slate-500">Pashto &amp; Persian classical poetry, ghazals, critical essays</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {language === 'ps' ? 'بشپړ خپلواکي' : language === 'fa' ? 'پژوهش مستقل' : 'Independent Portal'}
                </h4>
                <p className="text-[11px] text-slate-500">Free open education, community engagement, verified news</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onContactClick}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition active:scale-95 inline-flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{t.nav.contact}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
