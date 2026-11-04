import React, { useState } from 'react';
import { Book, Language } from '../types';
import { translations } from '../lib/i18n';
import { InteractionBar } from './InteractionBar';
import { incrementBookDownload } from '../lib/storage';
import { Download, BookOpen, Calendar, FileText, Check, Search, X } from 'lucide-react';

interface Props {
  books: Book[];
  language: Language;
}

export const LibrarySection: React.FC<Props> = ({ books, language }) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [readingBook, setReadingBook] = useState<Book | null>(null);

  const filteredBooks = books.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    );
  });

  const handleDownload = (book: Book) => {
    setDownloadingId(book.id);
    incrementBookDownload(book.id);

    // Create a mock/real PDF blob or trigger browser download
    const content = `%PDF-1.4
% ANSARY Library Digital Edition
% Title: ${book.title}
% Author: ${book.author}
% Year: ${book.publicationYear}
% Published by ANSARY Knowledge & Technology Portal
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj
4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
5 0 obj << /Length 80 >> stream
BT /F1 18 Tf 50 700 Td (${book.title}) Tj ET
endstream endobj
xref
0 6
trailer << /Root 1 0 R >>
%%EOF`;

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.replace(/\s+/g, '_')}_ANSARY.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadingId(null);
    }, 1500);
  };

  return (
    <section id="library" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t.sections.booksLibrary}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t.sections.booksLibrarySub}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.actions.search}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 rtl:left-auto rtl:right-3" />
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition group overflow-hidden"
          >
            <div>
              {/* Cover Book Graphic */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-slate-900 to-blue-950 border border-slate-800 shadow-inner flex items-center justify-center group-hover:shadow-lg transition">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-mono uppercase bg-amber-500/90 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                    {book.fileSize}
                  </span>
                </div>
              </div>

              {/* Unboxed Metadata */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-1">
                <span>{book.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{book.publicationYear}</span>
              </div>

              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug mb-1">
                {book.title}
              </h3>
              <p className="text-xs text-blue-600 dark:text-amber-400 font-medium mb-2">
                {book.author}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                {book.description}
              </p>

              {/* Book Specs */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg mb-4">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-slate-400" />
                  <span>{book.pages} {language === 'ps' ? 'مخونه' : language === 'fa' ? 'صفحه' : 'pages'}</span>
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Download className="w-3 h-3 text-slate-400" />
                  <span>{book.downloads} {language === 'ps' ? 'کښته شوی' : language === 'fa' ? 'دانلود' : 'dl'}</span>
                </span>
              </div>
            </div>

            <div>
              {/* Primary Actions: Read Online & Download */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setReadingBook(book)}
                  className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t.actions.readBook}</span>
                </button>

                <button
                  onClick={() => handleDownload(book)}
                  disabled={downloadingId === book.id}
                  className="py-2 px-3 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition flex items-center justify-center gap-1.5 shrink-0"
                  title={t.actions.downloadPdf}
                >
                  {downloadingId === book.id ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>PDF</span>
                </button>
              </div>

              {/* Interactive Like/Dislike/Comments/Share */}
              <InteractionBar
                targetId={book.id}
                targetType="book"
                initialLikes={book.likes}
                initialDislikes={book.dislikes}
                itemTitle={book.title}
                language={language}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {readingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative text-left [dir=rtl]:text-right">
            <button
              onClick={() => setReadingBook(null)}
              className="absolute top-5 right-5 [dir=rtl]:right-auto [dir=rtl]:left-5 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div className="w-32 h-44 shrink-0 rounded-xl overflow-hidden shadow-md">
                <img
                  src={readingBook.coverImage}
                  alt={readingBook.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-mono text-amber-500 font-semibold uppercase">
                  {readingBook.category} · {readingBook.publicationYear}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {readingBook.title}
                </h3>
                <p className="text-xs text-blue-600 dark:text-amber-400 font-medium mb-3">
                  {readingBook.author}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {readingBook.description}
                </p>
              </div>
            </div>

            {/* Simulated Digital Reading Folio */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 font-serif text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200">
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-slate-400 text-center border-b border-slate-200 dark:border-slate-800 pb-2">
                د کتاب پیژندنه او پیلامه / مقدمه و چکیده اثر
              </h4>
              <p className="first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-3 [dir=rtl]:first-letter:float-none">
                علم او پوهه هغه تلپاتې مشال دی چې د بشري ټولنو په اوږدو کې یې رڼا خپره کړې ده. دا اثر د حضرت شاه انصاري له لوري د معاصرو محصلینو، څېړونکو او علاقمندانو لپاره چمتو شوی ترڅو د نظري علم تر څنګ عملي تجربې هم ورسره مل شي.
              </p>
              <p>
                در این رساله، علاوه بر تبیین مبانی اصیل، جدیدترین استندردهای جهانی در زمینه معماری داده‌ها، هوش مصنوعی و امنیت سایبری مورد واکاوی دقیق قرار گرفته است. مطالعه این کتاب به عنوان یک مرجع دانشگاهی برای تمام دانش‌پژوهان توصیه می‌گردد.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => handleDownload(readingBook)}
                className="py-2.5 px-5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>{t.actions.downloadPdf}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
