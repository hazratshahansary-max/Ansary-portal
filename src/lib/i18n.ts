import { Language } from '../types';

export interface Translations {
  brandName: string;
  slogan: string;
  nav: {
    home: string;
    news: string;
    library: string;
    poetry: string;
    videos: string;
    articles: string;
    projects: string;
    about: string;
    contact: string;
    admin: string;
  };
  newsCategories: {
    all: string;
    sports: string;
    domestic: string;
    international: string;
    announcements: string;
  };
  actions: {
    readMore: string;
    like: string;
    dislike: string;
    comment: string;
    share: string;
    downloadPdf: string;
    readBook: string;
    viewProject: string;
    watchVideo: string;
    submitComment: string;
    installApp: string;
    installPWA: string;
    installAppDesc: string;
    close: string;
    search: string;
    filterByLanguage: string;
    allLanguages: string;
    inquireProject: string;
    copyLink: string;
    linkCopied: string;
    send: string;
  };
  pwa: {
    installTitle: string;
    installDesc: string;
    installBtn: string;
    iosInstructions: string;
    iosStep1: string;
    iosStep2: string;
    offlineMode: string;
    syncedNotice: string;
    enableNotifications: string;
    notificationsEnabled: string;
  };
  sections: {
    latestNews: string;
    latestNewsSub: string;
    booksLibrary: string;
    booksLibrarySub: string;
    poetryHeritage: string;
    poetryHeritageSub: string;
    featuredVideos: string;
    featuredVideosSub: string;
    educationalArticles: string;
    educationalArticlesSub: string;
    ourProjects: string;
    ourProjectsSub: string;
    aboutFounder: string;
    aboutFounderSub: string;
    contactUs: string;
    contactUsSub: string;
  };
  comments: {
    title: string;
    noComments: string;
    yourName: string;
    yourEmail: string;
    yourComment: string;
    antiSpamQuestion: string;
    submitSuccess: string;
    spamError: string;
    pendingModeration: string;
  };
  projects: {
    databaseTech: string;
    features: string;
    securityBanner: string;
    contactInquiry: string;
  };
  admin: {
    dashboardTitle: string;
    analytics: string;
    publishContent: string;
    manageContent: string;
    moderateComments: string;
    supabaseIntegration: string;
    settings: string;
    logout: string;
  };
}

export const translations: Record<Language, Translations> = {
  ps: {
    brandName: 'انصاري',
    slogan: 'پوهه، ادب، ټیکنالوژي او خبرونه',
    nav: {
      home: 'کور پاڼه',
      news: 'وروستي خبرونه',
      library: 'کتابونه او کتابتون',
      poetry: 'شعر او ادب',
      videos: 'ویډیوګانې',
      articles: 'مقالې او زده کړه',
      projects: 'زموږ پروژې',
      about: 'زما په اړه',
      contact: 'له موږ سره اړیکه',
      admin: 'د مدیر پاڼه',
    },
    newsCategories: {
      all: 'ټول خبرونه',
      sports: 'لوبې او ورزش',
      domestic: 'کورني خبرونه',
      international: 'نړیوال خبرونه',
      announcements: 'اعلانات او خبرتیاوې',
    },
    actions: {
      readMore: 'بشپړ لوستل',
      like: 'خوښوم',
      dislike: 'نه خوښوم',
      comment: 'نظرونه',
      share: 'شریکول',
      downloadPdf: 'د کتاب کښته کول (PDF)',
      readBook: 'آنلاین لوستل',
      viewProject: 'د پروژې کتنه',
      watchVideo: 'ویډیو کتل',
      submitComment: 'د نظر ثبتول',
      installApp: 'اپلیکیشن لګول',
      installPWA: 'د انصاري اپلیکیشن انسټال کړئ',
      installAppDesc: 'پرته له انټرنیټ لوستل او چټک لاسرسی',
      close: 'بندول',
      search: 'پلټنه وکړئ...',
      filterByLanguage: 'ژبه وټاکئ',
      allLanguages: 'ټولې ژبې',
      inquireProject: 'د پروژې امر یا اړیکه',
      copyLink: 'لینک کاپي کړئ',
      linkCopied: 'لینک کاپي شو!',
      send: 'استول',
    },
    pwa: {
      installTitle: 'د انصاري ګرځنده اپلیکیشن',
      installDesc: 'په تلیفون او کمپیوټر کې د انصاري اپلیکیشن لګولو سره له چټک او آفلاین لوستلو ګټه واخلئ.',
      installBtn: 'انسټال کړئ',
      iosInstructions: 'په آیفون او آیپډ کې د لګولو لارښود:',
      iosStep1: '۱. په سفاري (Safari) براوزر کې د Share نښه ووهئ.',
      iosStep2: '۲. ښکته لاړ شئ او "Add to Home Screen" انتخاب کړئ.',
      offlineMode: 'آفلاین حالت — مخکې زېرمه شوي مواد ښودل کېږي.',
      syncedNotice: 'انټرنیټ وصل شو؛ معلومات تازه شول.',
      enableNotifications: 'خبرتیاوې فعال کړئ',
      notificationsEnabled: 'خبرتیاوې فعالې شوې',
    },
    sections: {
      latestNews: 'وروستي خبرونه او پېښې',
      latestNewsSub: 'د ورزش، کورنیو او نړیوالو موضوعاتو او تازه اعلاناتو په اړه معتبر راپورونه',
      booksLibrary: 'ډیجیټل کتابتون او آثار',
      booksLibrarySub: 'د بېلابېلو علمي، ادبي، تاریخي او ټیکنالوژیکي کتابونو وړیا لوستل او کښته کول',
      poetryHeritage: 'شعر او ادبي بڼ',
      poetryHeritageSub: 'د پښتو او دري ژبو غوره غزلې، بیتونه او منظومې په اصیل ادبي هنر کې',
      featuredVideos: 'ویډیویي مرکې او ښوونیز مواد',
      featuredVideosSub: 'تحلیلي غونډې، علمي بحثونه او عملي ټیکنالوژیکي ښوونې',
      educationalArticles: 'ښوونیزې او علمي مقالې',
      educationalArticlesSub: 'د ساینس، سافټویر انجنیرۍ او تاریخ ژورې او تحلیلي لیکنې',
      ourProjects: 'د ډیټابیس او ټیکنالوژۍ پروژې',
      ourProjectsSub: 'مسلکي ډیټابیسونه، عصري کلاوډ سیسټمونه او تصدیق شوي نوښتونه',
      aboutFounder: 'د بنسټګر په اړه (حضرت شاه انصاري)',
      aboutFounderSub: 'پېژندنه، علمي مخینه او په ټیکنالوژۍ او معاصرو ادبیاتو کې لیدلوری',
      contactUs: 'له موږ سره اړیکه او مشوره',
      contactUsSub: 'ستاسو د وړاندیزونو، پروژو امر او پوښتنو هرکلی کوو',
    },
    comments: {
      title: 'د لوستونکو نظرونه او بحث',
      noComments: 'تر اوسه کوم نظر نه دی ثبت شوی. لومړی نظر تاسو ولیکئ!',
      yourName: 'ستاسو نوم (اړین)',
      yourEmail: 'ستاسو برېښنالیک (اختیاري)',
      yourComment: 'خپل مسلکي نظر دلته ولیکئ...',
      antiSpamQuestion: 'د سپام مخنیوی: د لاندې حساب ځواب ورکړئ:',
      submitSuccess: 'ستاسو نظر ترلاسه شو او له تایید وروسته به خپور شي.',
      spamError: 'د سپام ضد ځواب ناسم دی. مهرباني وکړئ بیا هڅه وکړئ.',
      pendingModeration: 'د مدیر د تایید په تمه',
    },
    projects: {
      databaseTech: 'ډیټابیس او کارول شوې ټیکنالوژي',
      features: 'د سیسټم اساسي وړتیاوې او ځانګړنې',
      securityBanner: 'امنیتي خبرتیا: د پیرودونکو خصوصي ډیټابیسونه او پټ معلومات دلته نه کوربه کېږي او په بشپړ ډول خوندي دي.',
      contactInquiry: 'د دې پروژې په اړه معلومات یا امر',
    },
    admin: {
      dashboardTitle: 'د انصاري مدیریت کنټرول پینل',
      analytics: 'د ویبپاڼې تفصیلي احصایه',
      publishContent: 'د نوي موادو خپرول',
      manageContent: 'د خپرو شویو توکو سمون',
      moderateComments: 'د نظرونو بررسي او تایید',
      supabaseIntegration: 'د سوپابیس ډیټابیس تنظیمات',
      settings: 'عمومي تنظیمات',
      logout: 'وتل',
    },
  },
  fa: {
    brandName: 'انصاری',
    slogan: 'دانش، ادبیات، تکنالوژی و اخبار',
    nav: {
      home: 'صفحه اصلی',
      news: 'تازه‌ترین اخبار',
      library: 'کتاب‌ها و کتابخانه',
      poetry: 'شعر و ادبیات',
      videos: 'ویدیوها',
      articles: 'مقالات و آموزش',
      projects: 'پروژه‌های ما',
      about: 'درباره من',
      contact: 'تماس با ما',
      admin: 'پنل مدیریت',
    },
    newsCategories: {
      all: 'تمام اخبار',
      sports: 'ورزش و مسابقات',
      domestic: 'اخبار داخلی',
      international: 'اخبار بین‌المللی',
      announcements: 'اعلانات و اطلاعیه‌ها',
    },
    actions: {
      readMore: 'مطالعه کامل',
      like: 'می‌پسندم',
      dislike: 'نمی‌پسندم',
      comment: 'دیدگاه‌ها',
      share: 'اشتراک‌گذاری',
      downloadPdf: 'دانلود کتاب (PDF)',
      readBook: 'مطالعه آنلاین',
      viewProject: 'مشاهده پروژه',
      watchVideo: 'تماشای ویدیو',
      submitComment: 'ارسال نظر',
      installApp: 'نصب اپلیکیشن',
      installPWA: 'نصب اپلیکیشن انصاری',
      installAppDesc: 'دسترسی سریع و قابلیت مطالعه آفلاین در موبایل و دسکتاپ',
      close: 'بستن',
      search: 'جستجو در آرشیف...',
      filterByLanguage: 'انتخاب زبان',
      allLanguages: 'همه زبان‌ها',
      inquireProject: 'سفارش یا استعلام پروژه',
      copyLink: 'کاپی لینک',
      linkCopied: 'لینک کاپی گردید!',
      send: 'ارسال',
    },
    pwa: {
      installTitle: 'اپلیکیشن کاربردی انصاری',
      installDesc: 'با نصب برنامه پیشرو وب (PWA) روی گوشی یا کمپیوتر خود، بدون نیاز به اینترنت متواتر به آثار دسترسی داشته باشید.',
      installBtn: 'نصب برنامه',
      iosInstructions: 'راهنمای نصب در آیفون و آیپد:',
      iosStep1: '۱. در مرورگر Safari دکمه Share را بزنید.',
      iosStep2: '۲. به پایین رفته و گزینه "Add to Home Screen" را انتخاب کنید.',
      offlineMode: 'حالت آفلاین فعال است — اطلاعات ذخیره شده نمایش داده می‌شود.',
      syncedNotice: 'اتصال به اینترنت برقرار شد؛ داده‌ها همگام شدند.',
      enableNotifications: 'فعال‌سازی نوتیفیکیشن‌ها',
      notificationsEnabled: 'اعلان‌ها فعال شدند',
    },
    sections: {
      latestNews: 'تازه‌ترین اخبار و رویدادها',
      latestNewsSub: 'پوشش دقیق و موثق خبرهای ورزشی، رویدادهای داخلی و منطقه‌ای و اعلانات مهم',
      booksLibrary: 'کتابخانه دیجیتال و آثار چاپی',
      booksLibrarySub: 'مجموعه‌ای ارزشمند از کتب علمی، تاریخی، فرهنگی و تخصصی به همراه فایل کامل PDF',
      poetryHeritage: 'گلستان شعر و ادبیات پارسی و پشتو',
      poetryHeritageSub: 'غزلیات ماندگار، دو بیتی‌ها و اشعار فاخر در قالب‌های اصیل و خطاطی کهن',
      featuredVideos: 'ویدیوها و گفتگوهای تصویری',
      featuredVideosSub: 'سخنرانی‌های علمی، مستندهای فرهنگی و آموزش‌های عملی نرم‌افزار و دیتابیس',
      educationalArticles: 'مقالات آموزشی و پژوهشی',
      educationalArticlesSub: 'نوشتارهای تحلیلی پیرامون مهندسی نرم‌افزار، هوش مصنوعی، تاریخ و معارف',
      ourProjects: 'پروژه‌های تخصصی دیتابیس و نرم‌افزار',
      ourProjectsSub: 'نمایش پورتفولیو و توانمندی‌های مهندسی دیتابیس و سیستم‌های مقیاس‌پذیر ابری',
      aboutFounder: 'درباره حضرت شاه انصاری',
      aboutFounderSub: 'زندگی‌نامه، دستاوردهای پژوهشی و مهندسی و چشم‌انداز پیوند ادب و تکنالوژی',
      contactUs: 'ارتباط مستقیم و همکاری',
      contactUsSub: 'پاسخگوی سوالات، پیشنهادات و نیازمندی‌های توسعه پروژه‌های نرم‌افزاری شما',
    },
    comments: {
      title: 'دیدگاه‌ها و نظرات کاربران',
      noComments: 'تاکنون نظری درج نشده است. نخستین نظر را شما بنویسید!',
      yourName: 'نام شما (الزامی)',
      yourEmail: 'ایمیل شما (اختیاری)',
      yourComment: 'دیدگاه یا نقد خود را اینجا بنویسید...',
      antiSpamQuestion: 'تاییدیه امنیتی ضد اسپم: حاصل عبارت زیر را بنویسید:',
      submitSuccess: 'دیدگاه شما با موفقیت ثبت شد و پس از بررسی منتشر خواهد شد.',
      spamError: 'پاسخ سوال ضد اسپم اشتباه است. لطفاً دوباره امتحان کنید.',
      pendingModeration: 'در انتظار تأیید مدیر',
    },
    projects: {
      databaseTech: 'پایگاه داده و فناوری‌های توسعه',
      features: 'ویژگی‌های کلیدی و معماری سیستم',
      securityBanner: 'هشدار امنیتی: داده‌های خصوصی و کدهای احراز هویت دیتابیس در محیط عمومی میزبانی نمی‌شوند و محرمانه می‌باشند.',
      contactInquiry: 'استعلام و تماس در مورد این پروژه',
    },
    admin: {
      dashboardTitle: 'پنل مدیریت اختصاصی انصاری',
      analytics: 'آمار و تجزیه و تحلیل زنده',
      publishContent: 'انتشار محتوای جدید',
      manageContent: 'مدیریت و ویرایش مطالب',
      moderateComments: 'بررسی و نظارت بر دیدگاه‌ها',
      supabaseIntegration: 'تنظیمات دیتابیس سوپابیس (Supabase)',
      settings: 'تنظیمات کلی',
      logout: 'خروج از حساب',
    },
  },
  en: {
    brandName: 'ANSARY',
    slogan: 'Knowledge, Literature, Technology & News',
    nav: {
      home: 'Home',
      news: 'Latest News',
      library: 'Books & Library',
      poetry: 'Poetry',
      videos: 'Videos',
      articles: 'Articles & Education',
      projects: 'Our Projects',
      about: 'About Me',
      contact: 'Contact Us',
      admin: 'Admin Portal',
    },
    newsCategories: {
      all: 'All News',
      sports: 'Sports',
      domestic: 'Domestic News',
      international: 'International News',
      announcements: 'Announcements',
    },
    actions: {
      readMore: 'Read Full Post',
      like: 'Like',
      dislike: 'Dislike',
      comment: 'Comments',
      share: 'Share',
      downloadPdf: 'Download Book (PDF)',
      readBook: 'Read Online',
      viewProject: 'View Project',
      watchVideo: 'Watch Video',
      submitComment: 'Post Comment',
      installApp: 'Install App',
      installPWA: 'Install ANSARY PWA',
      installAppDesc: 'Fast offline reading and home screen access on Android and iOS',
      close: 'Close',
      search: 'Search archive...',
      filterByLanguage: 'Language',
      allLanguages: 'All Languages',
      inquireProject: 'Inquire About Project',
      copyLink: 'Copy Link',
      linkCopied: 'Link Copied to Clipboard!',
      send: 'Send Message',
    },
    pwa: {
      installTitle: 'ANSARY Progressive Web App',
      installDesc: 'Install the official ANSARY application on your phone, tablet or desktop for offline access, fast loading, and notifications.',
      installBtn: 'Install App',
      iosInstructions: 'Installation instructions for iPhone and iPad:',
      iosStep1: '1. Tap the Share button in Safari toolbar.',
      iosStep2: '2. Scroll down and tap "Add to Home Screen".',
      offlineMode: 'Offline Mode Active — Showing locally cached articles and library items.',
      syncedNotice: 'Internet reconnected; content synchronized successfully.',
      enableNotifications: 'Enable Push Alerts',
      notificationsEnabled: 'Push Alerts Enabled',
    },
    sections: {
      latestNews: 'Latest News & Events',
      latestNewsSub: 'Accurate reporting on sports, domestic and international developments, and vital announcements',
      booksLibrary: 'Digital Library & Literature',
      booksLibrarySub: 'Explore authentic scholarly, literary, and technical volumes with PDF previews and downloads',
      poetryHeritage: 'Poetry & Cultural Treasury',
      poetryHeritageSub: 'Classical ghazals, couplets, and contemporary verses rendered in authentic typography',
      featuredVideos: 'Recorded Lectures & Documentaries',
      featuredVideosSub: 'Scholarly discussions, technical seminars, and video tutorials',
      educationalArticles: 'Educational Insights & Engineering',
      educationalArticlesSub: 'In-depth articles spanning distributed systems, database architectures, and academic research',
      ourProjects: 'Database & Cloud Projects',
      ourProjectsSub: 'Showcase of enterprise database architectures, full-stack systems, and engineering portfolios',
      aboutFounder: 'About Hazrat Shah Ansary',
      aboutFounderSub: 'Author, senior technology engineer, and scholar bridging literature with modern computing',
      contactUs: 'Direct Inquiries & Collaboration',
      contactUsSub: 'Reach out for system architecture consultations, speaking engagements, or project inquiries',
    },
    comments: {
      title: 'Visitor Discussion & Commentary',
      noComments: 'No comments yet. Be the first to share your thoughts!',
      yourName: 'Your Name (Required)',
      yourEmail: 'Your Email (Optional)',
      yourComment: 'Write your respectful review or question...',
      antiSpamQuestion: 'Spam Protection: Solve the math challenge:',
      submitSuccess: 'Your comment has been submitted for moderation.',
      spamError: 'Math answer incorrect. Please try again.',
      pendingModeration: 'Pending moderation approval',
    },
    projects: {
      databaseTech: 'Database & Core Architecture',
      features: 'System Capabilities & Key Features',
      securityBanner: 'Security Assurance: Client private databases and production credentials are never hosted or exposed on public demo interfaces.',
      contactInquiry: 'Request Technical Demo or Consultation',
    },
    admin: {
      dashboardTitle: 'ANSARY Administrator Management Suite',
      analytics: 'Live Website & Application Analytics',
      publishContent: 'Publish New Content',
      manageContent: 'Edit Existing Publications',
      moderateComments: 'Moderate Community Comments',
      supabaseIntegration: 'Supabase Database Integration',
      settings: 'Portal Settings',
      logout: 'Sign Out',
    },
  },
};

export function getDir(language: Language): 'rtl' | 'ltr' {
  return language === 'en' ? 'ltr' : 'rtl';
}
