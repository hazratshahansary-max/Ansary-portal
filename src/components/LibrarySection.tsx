import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { Language, Book } from '../types';
import { createBookCoverSvg } from '../assets/images';
import { incrementBookDownload, toggleVote, getUserVote } from '../lib/storage';
import {
  BookOpen,
  Download,
  FileText,
  User,
  Calendar,
  Layers,
  ThumbsUp,
  ThumbsDown,
  Upload,
  ExternalLink,
  Search,
  GraduationCap,
  Sparkles,
  Stethoscope,
  Cpu,
  Feather,
  BookMarked
} from 'lucide-react';

interface LibrarySectionProps {
  books: Book[];
  language: Language;
  onOpenAdminUpload: () => void;
  searchFilter?: string;
}

export const LibrarySection: React.FC<LibrarySectionProps> = ({
  books,
  language,
  onOpenAdminUpload,
  searchFilter = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [, setForceUpdate] = useState(0);
  const t = TRANSLATIONS[language];

  // 1. The 5 Exact Official Categories
  const mainCategories = [
    {
      id: 'all',
      icon: BookOpen,
      labels: { ps: 'ټول کتابونه', fa: 'همه کتب', en: 'All Books' }
    },
    {
      id: 'islamic',
      matchKeys: ['اسلامي', 'اسلام', 'islamic', 'fiqh', 'hadith'],
      icon: BookMarked,
      labels: { ps: 'اسلامي کتابونه', fa: 'کتب اسلامی', en: 'Islamic Books' }
    },
    {
      id: 'medical',
      matchKeys: ['طبي', 'طب', 'medical', 'medicine', 'health'],
      icon: Stethoscope,
      labels: { ps: 'طبي کتابونه', fa: 'کتب طب و صحت', en: 'Medical Books' }
    },
    {
      id: 'literary',
      matchKeys: ['ادبي', 'ادب', 'شعر', 'literary', 'literature', 'poetry'],
      icon: Feather,
      labels: { ps: 'ادبي کتابونه', fa: 'کتب ادبیات', en: 'Literary Books' }
    },
    {
      id: 'technology',
      matchKeys: ['ټکنالوژۍ', 'ټیکنالوژي', 'تکنالوژی', 'technology', 'database', 'software'],
      icon: Cpu,
      labels: { ps: 'ټکنالوژۍ کتابونه', fa: 'کتب تکنالوژی', en: 'Technology Books' }
    },
    {
      id: 'school',
      matchKeys: ['ښوونځي', 'ښوونځی', 'مکتب', 'school', 'curriculum', 'grade'],
      icon: GraduationCap,
      labels: { ps: 'د ښوونځي کتابونه', fa: 'کتب مکتب', en: 'School Books' }
    }
  ];

  // 2. The 12 Grades (ښوونځی له لومړي تر ۱۲ ټولګي)
  const schoolGrades = [
    { grade: 'all', labels: { ps: 'ټول ټولګي', fa: 'همه صنوف', en: 'All Grades' } },
    { grade: '1', labels: { ps: 'لومړی ټولګی', fa: 'صنف اول', en: 'Grade 1' } },
    { grade: '2', labels: { ps: 'دویم ټولګی', fa: 'صنف دوم', en: 'Grade 2' } },
    { grade: '3', labels: { ps: 'درېیم ټولګی', fa: 'صنف سوم', en: 'Grade 3' } },
    { grade: '4', labels: { ps: 'څلورم ټولګی', fa: 'صنف چهارم', en: 'Grade 4' } },
    { grade: '5', labels: { ps: 'پنځم ټولګی', fa: 'صنف پنجم', en: 'Grade 5' } },
    { grade: '6', labels: { ps: 'شپږم ټولګی', fa: 'صنف ششم', en: 'Grade 6' } },
    { grade: '7', labels: { ps: 'اووم ټولګی', fa: 'صنف هفتم', en: 'Grade 7' } },
    { grade: '8', labels: { ps: 'اتم ټولګی', fa: 'صنف هشتم', en: 'Grade 8' } },
    { grade: '9', labels: { ps: 'نهم ټولګی', fa: 'صنف نهم', en: 'Grade 9' } },
    { grade: '10', labels: { ps: 'لسم ټولګی', fa: 'صنف دهم', en: 'Grade 10' } },
    { grade: '11', labels: { ps: 'یوولسم ټولګی', fa: 'صنف یازدهم', en: 'Grade 11' } },
    { grade: '12', labels: { ps: 'دولسم ټولګی', fa: 'صنف دوازدهم', en: 'Grade 12' } }
  ];

  const filteredBooks = books
    .filter(b => (selectedLang === 'all' ? true : b.language === selectedLang))
    .filter(b => {
      if (selectedCategory === 'all') return true;
      const catObj = mainCategories.find(c => c.id === selectedCategory);
      if (!catObj || !catObj.matchKeys) return true;
      const catLower = (b.category || '').toLowerCase();
      const titleLower = (b.title || '').toLowerCase();
      return catObj.matchKeys.some(k => catLower.includes(k) || titleLower.includes(k));
    })
    .filter(b => {
      if (selectedCategory !== 'school' || selectedGrade === 'all') return true;
      return b.schoolGrade === parseInt(selectedGrade) || (b.category || '').includes(`ټولګی ${selectedGrade}`);
    })
    .filter(b => {
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    });

  const handleDownload = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    incrementBookDownload(book.id);
    setForceUpdate(prev => prev + 1);

    if (book.fileUrl && book.fileUrl !== '#' && !book.fileUrl.startsWith('javascript:')) {
      window.open(book.fileUrl, '_blank');
    } else if (book.pdfUrl && book.pdfUrl !== '#') {
      window.open(book.pdfUrl, '_blank');
    } else {
      const element = document.createElement('a');
      const file = new Blob([
        `Ansary Knowledge Digital Library\n\nTitle: ${book.title}\nAuthor: ${book.author}\nYear: ${book.year || book.publicationYear || 2026}\nPages: ${book.pages}\nCategory: ${book.category}\n\nOfficial knowledge repository hosted at Ansary Knowledge.`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${book.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleVote = (e: React.MouseEvent, bookId: string, type: 'like' | 'dislike') => {
    e.stopPropagation();
    toggleVote('book', bookId, type);
    setForceUpdate(prev => prev + 1);
  };

  return (
    <section id="library" className="py-14 sm:py-20 bg-slate-50 dark:bg-[#060B18] transition-colors border-b border-slate-200 dark:border-blue-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-slate-200 dark:border-blue-950">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>{t.nav.library}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t.sections.libraryTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {language === 'ps'
                ? 'د ۵ اصلي کټګوریو او د ښوونځي د ۱ څخه تر ۱۲ ټولګي د کتابونو رسمي ډیجیټل کتابتون.'
                : language === 'fa'
                ? 'کتابخانه دیجیتال رسمی در ۵ بخش اصلی و کتب درسی صنوف اول الی دوازدهم مکتب.'
                : 'Official digital library structured across 5 primary categories and K-12 school grades.'}
            </p>
          </div>

          {/* Controls: Language filter & Admin upload shortcut */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedLang('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedLang === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                }`}
              >
                {(t.actions as any)?.all || 'All'}
              </button>
              <button
                onClick={() => setSelectedLang('ps')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedLang === 'ps'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                }`}
              >
                پښتو
              </button>
              <button
                onClick={() => setSelectedLang('fa')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedLang === 'fa'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                }`}
              >
                دری
              </button>
              <button
                onClick={() => setSelectedLang('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedLang === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={onOpenAdminUpload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{language === 'ps' ? 'د کتاب اپلوډ پینل' : language === 'fa' ? 'آپلود کتاب جدید' : 'Upload Book'}</span>
            </button>
          </div>
        </div>

        {/* 5 Main Categories Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {mainCategories.map(cat => {
              const active = selectedCategory === cat.id;
              const Icon = cat.icon;
              const label = cat.labels[language] || cat.labels.ps;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (cat.id !== 'school') setSelectedGrade('all');
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-blue-600 dark:text-amber-400'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary School Grade Selector (Appears when "School Books" is selected) */}
          {selectedCategory === 'school' && (
            <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 shadow-xs animate-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2 mb-2 px-1">
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'ps' ? 'د ټولګي وېش (له لومړي تر ۱۲ ټولګي):' : language === 'fa' ? 'انتخاب صنف (صنف اول الی دوازدهم):' : 'Select Grade (Grades 1 to 12):'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {schoolGrades.map(sg => {
                  const active = selectedGrade === sg.grade;
                  const label = sg.labels[language] || sg.labels.ps;
                  return (
                    <button
                      key={sg.grade}
                      onClick={() => setSelectedGrade(sg.grade)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        active
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Books Grid or Elegant Empty State */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl bg-white dark:bg-[#0B172E] border-2 border-dashed border-slate-200 dark:border-blue-950/80 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-amber-400 flex items-center justify-center">
              <BookOpen className="w-8 h-8 opacity-75" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                {language === 'ps'
                  ? '«تر اوسه هېڅ محتوا نه ده خپره شوې»'
                  : language === 'fa'
                  ? '«تاکنون هیچ محتوایی در این بخش منتشر نشده است»'
                  : '«No content has been published in this section yet»'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {language === 'ps'
                  ? 'دا برخه د رسمي کتابونو او اصلي خپرونو لپاره چمتو ده. د مدیریت پینل له لارې نوی کتاب اپلوډ او ثبت کړئ.'
                  : language === 'fa'
                  ? 'این بخش آماده بارگذاری کتب اصلی می‌باشد. از طریق پینل مدیریت می‌توانید اثر جدید را ثبت نمایید.'
                  : 'This section is prepared for verified publications. Use the Management Portal to upload new digital books.'}
              </p>
            </div>
            <button
              onClick={onOpenAdminUpload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition"
            >
              <Upload className="w-4 h-4" />
              <span>{language === 'ps' ? 'نوی کتاب اپلوډ او ثبت کړئ' : language === 'fa' ? 'آپلود کتاب جدید' : 'Upload Digital Book'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredBooks.map(book => {
              const userVote = getUserVote(book.id);
              const coverSrc = book.coverImage && !book.coverImage.includes('/src/assets/')
                ? book.coverImage
                : createBookCoverSvg(book.title, book.author, book.category);

              return (
                <div
                  key={book.id}
                  className="group flex flex-col justify-between rounded-3xl bg-white dark:bg-[#0B172E] border border-slate-200/90 dark:border-blue-900/50 p-5 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Book 3D Spine Mockup */}
                    <div className="relative mx-auto w-36 h-52 sm:w-40 sm:h-56 rounded-r-xl rounded-l-xs overflow-hidden shadow-2xl shadow-blue-950/20 group-hover:scale-105 transition-transform duration-300 bg-slate-900 border-l-4 border-l-amber-500">
                      <img
                        src={coverSrc}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.src = createBookCoverSvg(book.title, book.author, book.category);
                        }}
                      />
                      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 via-white/10 to-transparent" />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-300 uppercase">
                        {book.language}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1.5 text-center">
                      <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        {book.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{book.author}</span>
                      </p>
                    </div>

                    {/* Quick specs */}
                    <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-blue-950">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{book.pages} مخه</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{book.year || book.publicationYear || 2026}</span>
                      </span>
                    </div>
                  </div>

                  {/* Bottom Download & Votes */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-blue-950 space-y-2.5">
                    <button
                      onClick={e => handleDownload(e, book)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/20 transition-all hover:translate-y-[-1px]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{(t.actions as any)?.downloadPdf || 'Download PDF'}</span>
                      <span className="text-[10px] opacity-80">({book.downloads})</span>
                    </button>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={e => handleVote(e, book.id, 'like')}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition ${
                          userVote === 'like'
                            ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{book.likes}</span>
                      </button>
                      <button
                        onClick={e => handleVote(e, book.id, 'dislike')}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition ${
                          userVote === 'dislike'
                            ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 font-bold'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                        <span>{book.dislikes}</span>
                      </button>
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
