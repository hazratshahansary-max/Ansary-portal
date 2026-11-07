import { Language } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  searchPlaceholder: string;
  promptsTab: string;
  linksTab: string;
  favoritesTab: string;
  allCategories: string;
  allTools: string;
  filterBy: string;
  sortBy: string;
  newest: string;
  popular: string;
  featured: string;
  alphabetical: string;
  difficulty: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  copyPrompt: string;
  copied: string;
  copiedSuccess: string;
  openTool: string;
  testInGemini: string;
  visitLink: string;
  share: string;
  addToFavorites: string;
  removeFromFavorites: string;
  targetModel: string;
  noResults: string;
  noResultsDesc: string;
  clearFilters: string;
  adminTitle: string;
  adminLogin: string;
  adminLogout: string;
  adminEmailLabel: string;
  adminPasswordLabel: string;
  adminPasswordPlaceholder: string;
  adminRoleRequired: string;
  adminRoleVerified: string;
  adminWrongPassword: string;
  adminSuccessLogin: string;
  adminManagePrompts: string;
  adminManageLinks: string;
  addNewPrompt: string;
  editPrompt: string;
  deletePrompt: string;
  addNewLink: string;
  editLink: string;
  deleteLink: string;
  titlePs: string;
  titleFa: string;
  titleEn: string;
  descPs: string;
  descFa: string;
  descEn: string;
  promptContent: string;
  promptContentPlaceholder: string;
  category: string;
  targetToolLabel: string;
  tagsLabel: string;
  tagsHelper: string;
  badgePs: string;
  badgeFa: string;
  badgeEn: string;
  linkUrl: string;
  isFeaturedLabel: string;
  save: string;
  cancel: string;
  confirmDeleteTitle: string;
  confirmDeleteMsg: string;
  delete: string;
  resetDefaults: string;
  resetDefaultsConfirm: string;
  exportData: string;
  importData: string;
  importSuccess: string;
  importError: string;
  statsPrompts: string;
  statsLinks: string;
  statsFavorites: string;
  promptCategories: Record<string, string>;
  linkCategories: Record<string, string>;
  tools: Record<string, string>;
  quickPreview: string;
  close: string;
  footerText: string;
  footerRights: string;
  aboutTitle: string;
  aboutDesc: string;
  promptVariablesNote: string;
  clickToCustomize: string;
  // New requirements
  filterLanguage: string;
  allLanguages: string;
  pricing: string;
  free: string;
  freemium: string;
  paid: string;
  allPricing: string;
  usageInstructions: string;
  samplePreview: string;
  reportBrokenLink: string;
  reportSentSuccess: string;
  reportReason: string;
  linkNotOpening: string;
  linkOutdated: string;
  linkOther: string;
  sendReport: string;
  verifiedClicks: string;
  invalidUrl: string;
  linkSecurityWarning: string;
  copyFailed: string;
  linkCopied: string;
  alreadyReported: string;
  reportFailed: string;
  submittingReport: string;
  reportNotes: string;
  reportNotesPlaceholder: string;
  reportSavedLocal: string;
  websiteLabel: string;
  superAdmin: string;
  adminRole: string;
  userRole: string;
  insufficientPermissions: string;
  tooManyAttempts: string;
  loginThrottled: string;
  supabaseNotConfiguredWarning: string;
  auditLogsTab: string;
  auditAction: string;
  auditEntity: string;
  auditTimestamp: string;
  auditUser: string;
  noAuditLogs: string;
  clearAuditLogs: string;
  statusPublished: string;
  statusDraft: string;
  isDraftLabel: string;
  importPreviewTitle: string;
  importPreviewDesc: string;
  confirmImport: string;
  importValidationFailed: string;
  preImportBackupCreated: string;
  duplicateUrlError: string;
  duplicatePromptError: string;
  itemDeletedSuccess: string;
  itemSavedSuccess: string;
  operationFailed: string;
  instructionsPs: string;
  instructionsFa: string;
  instructionsEn: string;
  sampleUrlLabel: string;
  sampleTypeLabel: string;
  authorLabel: string;
  isPopularLabel: string;
  pricingLabel: string;
  confirmDeleteSpecific: string;
  undoBackupNotice: string;
}

export const translations: Record<Language, Translations> = {
  ps: {
    appName: 'د انصاري پوهنې بنسټ',
    appSubtitle: 'د مصنوعي ځیرکتیا غوره فرامپټونه او ګټور ډیجیټل لینکونه',
    searchPlaceholder: 'د فرامپټ یا وېبپاڼې لټون (د سرلیک، منځپانګې، ټګ یا ادرس له مخې)...',
    promptsTab: 'د فرامپټونو ټولګه',
    linksTab: 'ګټور لینکونه او وېبپاڼې',
    favoritesTab: 'زما خوښ شوي',
    allCategories: 'ټولې کټګورۍ',
    allTools: 'ټول ماډلونه',
    filterBy: 'فلټر کول:',
    sortBy: 'ترتیب:',
    newest: 'ترټولو نوي',
    popular: 'مشهور او ټرینډ',
    featured: 'ځانګړي او غوره',
    alphabetical: 'د الفبا له مخې',
    difficulty: 'کچه:',
    beginner: 'ابتدائي',
    intermediate: 'منځنۍ',
    advanced: 'پرمختللې',
    copyPrompt: 'فرامپټ کاپي کړئ',
    copied: 'کاپي شو!',
    copiedSuccess: 'فرامپټ کلیپ‌بورډ ته کاپي شو',
    openTool: 'په AI کې کارول',
    testInGemini: 'په Gemini کې ازمویل',
    visitLink: 'وېبپاڼه پرانیزئ',
    share: 'شریکول',
    addToFavorites: 'خوښ شویو ته اضافه',
    removeFromFavorites: 'له خوښ شویو لرې کول',
    targetModel: 'وړاندیز شوی ماډل:',
    noResults: 'هیڅ پایله ونه موندل شوه!',
    noResultsDesc: 'د لټون کلمې یا د کټګورۍ فلټرونه بدل کړئ ترڅو نور معلومات وګورئ.',
    clearFilters: 'ټول فلټرونه پاک کړئ',
    adminTitle: 'د اډمین (مدیریت) پنل',
    adminLogin: 'اډمین ننوتل',
    adminLogout: 'وتل',
    adminEmailLabel: 'د اډمین برېښنالیک (Email)',
    adminPasswordLabel: 'د اډمین پټنوم (Password)',
    adminPasswordPlaceholder: 'پټنوم داخل کړئ...',
    adminRoleRequired: 'دا حساب د Admin Role واک نه لري!',
    adminRoleVerified: 'د اډمین واک تایید شو (Admin Role Verified)',
    adminWrongPassword: 'برېښنالیک یا پټنوم ناسم دی!',
    adminSuccessLogin: 'تاسو په بریا سره د اډمین حساب ته ننوتئ.',
    adminManagePrompts: 'د فرامپټونو سمبالښت',
    adminManageLinks: 'د لینکونو سمبالښت',
    addNewPrompt: 'نوی فرامپټ اضافه کړئ',
    editPrompt: 'د فرامپټ بدلون',
    deletePrompt: 'فرامپټ ړنګ کړئ',
    addNewLink: 'نوی ګټور لینک اضافه کړئ',
    editLink: 'د لینک بدلون',
    deleteLink: 'لینک ړنګ کړئ',
    titlePs: 'سرلیک (پښتو)',
    titleFa: 'سرلیک (دري)',
    titleEn: 'سرلیک (انګلیسي)',
    descPs: 'توضیحات (پښتو)',
    descFa: 'توضیحات (دري)',
    descEn: 'توضیحات (انګلیسي)',
    promptContent: 'د فرامپټ متن او لارښوونه',
    promptContentPlaceholder: 'دلته د AI بشپړ فرامپټ ولیکئ...',
    category: 'کټګوري',
    targetToolLabel: 'وړاندیز شوی AI ماډل',
    tagsLabel: 'ټګونه (په کامه جلا شوي)',
    tagsHelper: 'بېلګه: ژباړه, پروګرامینګ, ښوونه',
    badgePs: 'نښه/بیج (پښتو)',
    badgeFa: 'نښه/بیج (دري)',
    badgeEn: 'نښه/بیج (انګلیسي)',
    linkUrl: 'د ویب‌پاڼې بشپړ لینک (URL)',
    isFeaturedLabel: 'د ځانګړي / ټاپ محتوا په توګه وښودل شي',
    save: 'خوندي کول',
    cancel: 'لغوه',
    confirmDeleteTitle: 'ایا ډاډه یاست؟',
    confirmDeleteMsg: 'دا توکی به له حافظې څخه ړنګ شي او بېرته نشي ګرځېدلی.',
    delete: 'ړنګول',
    resetDefaults: 'اصلي حالت ته اړول',
    resetDefaultsConfirm: 'ایا غواړئ ټول معلومات اصلي ډیفالټ حالت ته واړوئ؟ ستاسو وروستي بدلونونه به پاک شي.',
    exportData: 'بیک اپ (Export JSON)',
    importData: 'ډاټا راوړل (Import JSON)',
    importSuccess: 'ډاټا په بریا راوړل شوه!',
    importError: 'د فایل په لوستلو کې تېروتنه رامنځته شوه!',
    statsPrompts: 'موجود فرامپټونه',
    statsLinks: 'ګټورې وېبپاڼې',
    statsFavorites: 'ستاسو په نښه شوي',
    filterLanguage: 'ژبه:',
    allLanguages: 'ټولې ژبې',
    pricing: 'حالت:',
    free: 'وړیا (Free)',
    freemium: 'فریمیم (Freemium)',
    paid: 'تادیه (Paid)',
    allPricing: 'ټول حالتونه',
    usageInstructions: 'د کارولو لارښوونې',
    samplePreview: 'د پایلې نمونه (Sample Output)',
    reportBrokenLink: 'د خراب لینک راپور',
    reportSentSuccess: 'مننه! د وېبپاڼې راپور ثبت شو.',
    reportReason: 'د ستونزې ډول وټاکئ:',
    linkNotOpening: 'وېبپاڼه نه پرانیستل کېږي',
    linkOutdated: 'محتوا بدله شوې یا غیر فعاله ده',
    linkOther: 'بله ستونزه',
    sendReport: 'راپور ولېږئ',
    verifiedClicks: 'واقعي کتونکي:',
    invalidUrl: 'ناسم لینک (معتبر نه دی)',
    linkSecurityWarning: 'د امنیتي ملحوظاتو له امله، دا لینک د پرانیستلو وړ نه دی.',
    copyFailed: 'د لینک کاپي کول ناکام شول',
    linkCopied: 'د وېبپاڼې لینک کلیپ‌بورډ ته کاپي شو',
    alreadyReported: 'تاسو مخکې د دې لینک راپور ثبت کړی دی.',
    reportFailed: 'د راپور په لېږلو کې ستونزه رامنځته شوه. مهرباني وکړئ وروسته هڅه وکړئ.',
    submittingReport: 'د راپور د ثبتولو په حال کې...',
    reportNotes: 'اضافي تشریح (اختیاري)',
    reportNotesPlaceholder: 'که نور وضاحت لرئ دلته یې ولیکئ...',
    reportSavedLocal: 'راپور په سیسټم کې ثبت شو او ژر به وڅېړل شي.',
    websiteLabel: 'وېبپاڼه:',
    superAdmin: 'عمومي مدیر (Super Admin)',
    adminRole: 'مدیر (Admin)',
    userRole: 'عادي کاروونکی',
    insufficientPermissions: 'تاسو د دې عملیاتو د ترسره کولو لازم صلاحیت نه لرئ.',
    tooManyAttempts: 'د ننوتلو هڅې له ټاکلي حد زیاتې شوې. مهرباني وکړئ وروسته هڅه وکړئ.',
    loginThrottled: 'د Brute-force د مخنیوي لپاره، مهرباني وکړئ څو دقیقې انتظار وکړئ.',
    supabaseNotConfiguredWarning: 'د Supabase اتصال فعال نه دی؛ د امنیتي پالیسۍ له مخې آفلاین اډمین ننوتل منع دي. مهرباني وکړئ د چاپېریال متغیرات تنظیم کړئ.',
    auditLogsTab: 'د فعالیتونو تاریخچه (Audit Logs)',
    auditAction: 'عملیات',
    auditEntity: 'محتوا / ډول',
    auditTimestamp: 'نېټه او وخت',
    auditUser: 'مسؤول کاروونکی',
    noAuditLogs: 'تر اوسه هېڅ فعالیت نه دی ثبت شوی.',
    clearAuditLogs: 'د تاریخچې پاکول',
    statusPublished: 'خپور شوی (Published)',
    statusDraft: 'مسوده (Draft)',
    isDraftLabel: 'دا توکی د مسودې په بڼه وساتل شي (عامه خلکو ته نه ښکاري)',
    importPreviewTitle: 'د فایل کتنه او د واردولو تایید',
    importPreviewDesc: 'مهرباني وکړئ د واردېدونکو معلوماتو شمېر وڅارئ. د تایید په صورت کې به د معلوماتو یو اتوماتیک بیک اپ واخیستل شي.',
    confirmImport: 'د معلوماتو واردول تایید کړئ',
    importValidationFailed: 'وارد شوی فایل د منلو وړ نه دی یا بڼه یې غلطه ده.',
    preImportBackupCreated: 'د واردولو مخکې اتوماتیک ژغورونکی بیک اپ واخیستل شو.',
    duplicateUrlError: 'دا وېبپاڼه (URL) دمخه په سیسټم کې شتون لري.',
    duplicatePromptError: 'دا فرامپټ لا دمخه په سیسټم کې ثبت شوی دی.',
    itemDeletedSuccess: 'توکی په بریا سره له ډیټابېس څخه ړنګ شو.',
    itemSavedSuccess: 'معلومات په بریا او باوري ډول په ډیټابېس کې خوندي شول.',
    operationFailed: 'عملیات د ډیټابېس د خطا له امله ترسره نه شول.',
    instructionsPs: 'د کارولو لارښوونه (پښتو)',
    instructionsFa: 'د کارولو لارښوونه (دري)',
    instructionsEn: 'د کارولو لارښوونه (انګلیسي)',
    sampleUrlLabel: 'د پایلې نمونې لینک (Sample URL)',
    sampleTypeLabel: 'د نمونې بڼه',
    authorLabel: 'لیکوال / جوړونکی',
    isPopularLabel: 'د مشهور او ټرینډ په توګه وښودل شي',
    pricingLabel: 'د بیې حالت',
    confirmDeleteSpecific: 'ایا ډاډه یاست چې غواړئ دا توکی په دایمي ډول ړنګ کړئ؟',
    undoBackupNotice: 'تاسو کولی شئ په ترتیباتو کې مخکینی محلي بیک اپ بېرته فعال کړئ.',
    promptCategories: {
      all: 'ټول فرامپټونه',
      'image-generation': 'د انځور جوړول (Image Generation)',
      'funny-entertainment': 'طنز او ساتېري (Funny & Entertainment)',
      'informational-scientific': 'معلوماتي او علمي (Informational & Scientific)',
      'education-learning': 'ښوونه او روزنه (Education & Learning)',
      'art-creative': 'هنر او نوښت (Art & Creative)',
      'writing-poetry': 'لیکوالي او شاعرۍ (Writing & Poetry)',
      'social-media': 'ټولنیزې رسنۍ (Social Media)',
      'business-professional': 'سوداګري او مسلکي (Business & Professional)',
      'programming-technology': 'پروګرامینګ او ټکنالوژي (Programming & Technology)',
      'video-creation': 'د ویډیو جوړول (Video Creation)',
      'research-analysis': 'څېړنه او تحلیل (Research & Analysis)',
      'translation-language': 'ژباړه او ژبپوهنه (Translation & Language)',
      'audio-music': 'غږ او موسیقي (Audio & Music)',
      other: 'نور اړوند فرامپټونه (Other)',
      // Aliases
      coding: 'پروګرامینګ او کوډ',
      writing: 'لیکوالي او ژباړه',
      education: 'ښوونه او روزنه',
      business: 'سوداګري او مدیریت',
      creative: 'نوښت او ډیزاین',
      productivity: 'شخصي پرمختګ',
      marketing: 'مارکیټینګ',
      general: 'عمومي اړتیاوې'
    },
    linkCategories: {
      all: 'ټولې وېبپاڼې او لینکونه',
      'global-popular': 'مشهورې نړیوالې وېبپاڼې',
      'education-scientific': 'تعلیمي او علمي وېبپاڼې',
      'free-courses': 'وړیا آنلاین کورسونه',
      'books-libraries': 'کتابونه او ډیجیټل کتابتونونه',
      'ai-tools': 'د AI اوزار او پلټفارمونه',
      'design-photo': 'د عکس او ډیزاین وېبپاڼې',
      'video-tools': 'د ویډیو جوړولو او ایډېټ وېبپاڼې',
      'tech-programming': 'ټکنالوژي او پروګرامینګ',
      'translation-languages': 'ژباړه او ژبې',
      'research-papers': 'علمي څېړنې او مقالې',
      'news-media': 'د خبرونو او معلوماتو سرچینې',
      'afghan-resources': 'د افغانستان اړوند وېبپاڼې',
      'government-services': 'دولتي او رسمي خدمات',
      'jobs-scholarships': 'دندې او بورسونه',
      'other-links': 'نور ګټور لینکونه',
      // Aliases
      learning: 'زده‌کړې بنسټونه',
      development: 'د ډیولپمنټ سرچینې',
      design: 'ګرافیک او ډیزاین',
      utilities: 'ګټور ډیجیټل اوزار',
      books: 'کتابتون او مقالې'
    },
    tools: {
      All: 'ټول ماډلونه',
      ChatGPT: 'ChatGPT',
      Gemini: 'Google Gemini',
      Claude: 'Claude AI',
      Midjourney: 'Midjourney',
      DeepSeek: 'DeepSeek',
      Perplexity: 'Perplexity'
    },
    quickPreview: 'چټکه لیدنه او ازموینه',
    close: 'بندول',
    footerText: 'د انصاري نالج پروژه؛ افغان ځوانانو ته د AI او ډیجیټل دور پرمختللو سرچینو وړاندې کوونکې مرجع.',
    footerRights: 'ټول حقونه خوندي دي © Ansary Knowledge',
    aboutTitle: 'د Ansary Knowledge په اړه',
    aboutDesc: 'دا پلټفارم د ځیرکو پروامپټونو، چټکو ډیجیټل حللارو او تصدیق شویو وېبپاڼو د راټولولو په موخه جوړ شوی دی ترڅو د پښتو، دري او انګلیسي ژبو کاروونکو سره مرسته وکړي.',
    promptVariablesNote: 'تاسو کولی شئ په فرامپټ کې د قوسونو [ ... ] دننه برخې د خپلې اړتیا سره سمې بدلې کړئ.',
    clickToCustomize: 'د متن بدلولو لپاره دلته کلیک وکړئ'
  },
  fa: {
    appName: 'مرکز دانش انصاری',
    appSubtitle: 'مجموعه پرامپت‌های برتر هوش مصنوعی و لینک‌های کاربردی دیجیتال',
    searchPlaceholder: 'جستجوی پرامپت یا وب‌سایت (بر اساس عنوان، متن، تگ یا آدرس)...',
    promptsTab: 'مجموعه پرامپت‌ها',
    linksTab: 'لینک‌ها و وب‌سایت‌های مفید',
    favoritesTab: 'علاقه‌مندی‌های من',
    allCategories: 'همه دسته‌بندی‌ها',
    allTools: 'همه مدل‌ها',
    filterBy: 'فیلتر بر اساس:',
    sortBy: 'ترتیب:',
    newest: 'جدیدترین‌ها',
    popular: 'محبوب و پرطرفدار',
    featured: 'برگزیده‌ها و ویژه',
    alphabetical: 'به ترتیب الفبا',
    difficulty: 'سطح:',
    beginner: 'مقدماتی',
    intermediate: 'متوسط',
    advanced: 'پیشرفته',
    copyPrompt: 'کپی پرامپت',
    copied: 'کپی شد!',
    copiedSuccess: 'پرامپت با موفقیت کپی شد',
    openTool: 'استفاده در هوش مصنوعی',
    testInGemini: 'آزمایش در Gemini',
    visitLink: 'باز کردن وب‌سایت',
    share: 'اشتراک‌گذاری',
    addToFavorites: 'افزودن به علاقه‌مندی‌ها',
    removeFromFavorites: 'حذف از علاقه‌مندی‌ها',
    targetModel: 'مدل پیشنهادی:',
    noResults: 'هیچ نتیجه‌ای یافت نشد!',
    noResultsDesc: 'کلمات جستجو یا فیلتر دسته‌بندی را تغییر دهید.',
    clearFilters: 'پاک کردن فیلترها',
    adminTitle: 'پنل مدیریت (Admin)',
    adminLogin: 'ورود مدیر',
    adminLogout: 'خروج مدیر',
    adminEmailLabel: 'ایمیل مدیر (Email)',
    adminPasswordLabel: 'رمز عبور مدیر (Password)',
    adminPasswordPlaceholder: 'رمز عبور را وارد کنید...',
    adminRoleRequired: 'این حساب کاربری دسترسی مدیر (Admin Role) ندارد!',
    adminRoleVerified: 'دسترسی مدیریت تأیید شد (Admin Role Verified)',
    adminWrongPassword: 'ایمیل یا رمز عبور نادرست است!',
    adminSuccessLogin: 'با موفقیت با حساب مدیر وارد شدید.',
    adminManagePrompts: 'مدیریت پرامپت‌ها',
    adminManageLinks: 'مدیریت لینک‌ها',
    addNewPrompt: 'افزودن پرامپت جدید',
    editPrompt: 'ویرایش پرامپت',
    deletePrompt: 'حذف پرامپت',
    addNewLink: 'افزودن لینک جدید',
    editLink: 'ویرایش لینک',
    deleteLink: 'حذف لینک',
    titlePs: 'عنوان (پشتو)',
    titleFa: 'عنوان (دری)',
    titleEn: 'عنوان (انگلیسی)',
    descPs: 'توضیحات (پشتو)',
    descFa: 'توضیحات (دری)',
    descEn: 'توضیحات (انگلیسی)',
    promptContent: 'متن و دستورالعمل پرامپت',
    promptContentPlaceholder: 'دستور کامل هوش مصنوعی را اینجا بنویسید...',
    category: 'دسته‌بندی',
    targetToolLabel: 'مدل پیشنهادی هوش مصنوعی',
    tagsLabel: 'تگ‌ها (با کامه جدا شود)',
    tagsHelper: 'مثال: ترجمه, برنامه‌نویسی, آموزش',
    badgePs: 'نشان/برچسب (پشتو)',
    badgeFa: 'نشان/برچسب (دری)',
    badgeEn: 'نشان/برچسب (انگلیسی)',
    linkUrl: 'آدرس کامل وب‌سایت (URL)',
    isFeaturedLabel: 'نمایش به عنوان محتوای ویژه',
    save: 'ذخیره',
    cancel: 'انصراف',
    confirmDeleteTitle: 'آیا اطمینان دارید؟',
    confirmDeleteMsg: 'این مورد از حافظه پاک می‌شود و قابل برگشت نیست.',
    delete: 'حذف',
    resetDefaults: 'بازنشانی به حالت پیش‌فرض',
    resetDefaultsConfirm: 'آیا می‌خواهید همه داده‌ها به حالت اولیه برگردند؟ تغییرات شما پاک خواهد شد.',
    exportData: 'پشتیبان‌گیری (Export JSON)',
    importData: 'ورود داده‌ها (Import JSON)',
    importSuccess: 'داده‌ها با موفقیت وارد شدند!',
    importError: 'خطا در خواندن فایل وارد شده!',
    statsPrompts: 'پرامپت‌های فعال',
    statsLinks: 'وب‌سایت‌های مفید',
    statsFavorites: 'نشان شده‌های شما',
    filterLanguage: 'زبان:',
    allLanguages: 'همه زبان‌ها',
    pricing: 'وضعیت هزینه:',
    free: 'رایگان (Free)',
    freemium: 'نیمه‌رایگان (Freemium)',
    paid: 'پولی (Paid)',
    allPricing: 'همه وضعیت‌ها',
    usageInstructions: 'راهنمای استفاده و اجرا',
    samplePreview: 'نمونه خروجی (Sample Output)',
    reportBrokenLink: 'گزارش خرابی لینک',
    reportSentSuccess: 'تشکر! گزارش خرابی وب‌سایت ثبت شد.',
    reportReason: 'علت مشکل را انتخاب نمایید:',
    linkNotOpening: 'وب‌سایت باز نمی‌شود',
    linkOutdated: 'محتوا قدیمی یا مسدود است',
    linkOther: 'سایر موارد',
    sendReport: 'ارسال گزارش',
    verifiedClicks: 'کلیک‌های ثبت‌شده:',
    invalidUrl: 'لینک نامعتبر است',
    linkSecurityWarning: 'به دلایل امنیتی، این پیوند قابل باز شدن نیست.',
    copyFailed: 'کپی آدرس با خطا مواجه شد',
    linkCopied: 'آدرس وب‌سایت در کلیپ‌بورد کپی شد',
    alreadyReported: 'شما قبلاً برای این وب‌سایت گزارش ثبت نموده‌اید.',
    reportFailed: 'خطا در ارسال گزارش. لطفاً بعداً تلاش فرمایید.',
    submittingReport: 'در حال ثبت گزارش...',
    reportNotes: 'توضیحات تکمیلی (اختیاری)',
    reportNotesPlaceholder: 'اگر توضیحات بیشتری دارید بنویسید...',
    reportSavedLocal: 'گزارش در سیستم ثبت شد و به زودی بررسی خواهد شد.',
    websiteLabel: 'وب‌سایت:',
    superAdmin: 'مدیر کل (Super Admin)',
    adminRole: 'مدیر (Admin)',
    userRole: 'کاربر عادی',
    insufficientPermissions: 'شما دسترسی لازم برای انجام این عملیات را ندارید.',
    tooManyAttempts: 'تعداد تلاش‌های ناموفق ورود بیش از حد مجاز است. لطفاً بعداً تلاش فرمایید.',
    loginThrottled: 'جهت جلوگیری از حملات Brute-force، لطفاً چند دقیقه صبر نمایید.',
    supabaseNotConfiguredWarning: 'اتصال دیتابیس Supabase برقرار نیست؛ بر اساس پالیسی امنیتی، ورود آفلاین ادمین مجاز نمی‌باشد. لطفاً متغیرهای محیطی را تنظیم نمایید.',
    auditLogsTab: 'گزارش فعالیت‌ها (Audit Logs)',
    auditAction: 'عملیات',
    auditEntity: 'محتوا / نوع',
    auditTimestamp: 'تاریخ و زمان',
    auditUser: 'کاربر مسئول',
    noAuditLogs: 'تاکنون هیچ فعالیتی ثبت نگردیده است.',
    clearAuditLogs: 'پاکسازی تاریخچه',
    statusPublished: 'منتشر شده (Published)',
    statusDraft: 'پیش‌نویس (Draft)',
    isDraftLabel: 'ذخیره به عنوان پیش‌نویس (عدم نمایش عمومی)',
    importPreviewTitle: 'پیش‌نمایش فایل و تایید واردسازی',
    importPreviewDesc: 'لطفاً تعداد داده‌های ورودی را بررسی نمایید. در صورت تایید، یک نسخه پشتیبان خودکار از داده‌های فعلی ذخیره خواهد شد.',
    confirmImport: 'تایید و بارگذاری داده‌ها',
    importValidationFailed: 'فرمت فایل وارد شده نامعتبر یا آسیب‌دیده است.',
    preImportBackupCreated: 'نسخه پشتیبان اضطراری قبل از واردسازی ذخیره شد.',
    duplicateUrlError: 'این آدرس اینترنتی (URL) قبلاً در سیستم ثبت شده است.',
    duplicatePromptError: 'این دستور پرامپت قبلاً در سیستم موجود است.',
    itemDeletedSuccess: 'مورد با موفقیت از دیتابیس حذف گردید.',
    itemSavedSuccess: 'داده‌ها با موفقیت در دیتابیس ذخیره شدند.',
    operationFailed: 'عملیات به دلیل خطای پایگاه داده با شکست مواجه شد.',
    instructionsPs: 'دستورالعمل استفاده (پشتو)',
    instructionsFa: 'دستورالعمل استفاده (دری)',
    instructionsEn: 'دستورالعمل استفاده (انگلیسی)',
    sampleUrlLabel: 'لینک نمونه خروجی (Sample URL)',
    sampleTypeLabel: 'نوع نمونه',
    authorLabel: 'نویسنده / سازنده',
    isPopularLabel: 'نمایش به عنوان محبوب و پرطرفدار',
    pricingLabel: 'وضعیت هزینه',
    confirmDeleteSpecific: 'آیا از حذف دائمی این مورد اطمینان دارید؟',
    undoBackupNotice: 'شما می‌توانید در تنظیمات نسخه پشتیبان محلی را بازیابی کنید.',
    promptCategories: {
      all: 'همه پرامپت‌ها',
      'image-generation': 'تولید تصویر (Image Generation)',
      'funny-entertainment': 'طنز و سرگرمی (Funny & Entertainment)',
      'informational-scientific': 'اطلاعاتی و علمی (Informational & Scientific)',
      'education-learning': 'آموزش و یادگیری (Education & Learning)',
      'art-creative': 'هنر و خلاقیت (Art & Creative)',
      'writing-poetry': 'نویسندگی و شعر (Writing & Poetry)',
      'social-media': 'شبکه‌های اجتماعی (Social Media)',
      'business-professional': 'کسب‌وکار و حرفه‌ای (Business & Professional)',
      'programming-technology': 'برنامه‌نویسی و تکنالوژی (Programming & Technology)',
      'video-creation': 'تولید ویدیو (Video Creation)',
      'research-analysis': 'تحقیق و تحلیل (Research & Analysis)',
      'translation-language': 'ترجمه و زبان‌ها (Translation & Language)',
      'audio-music': 'صدا و موسیقی (Audio & Music)',
      other: 'سایر پرامپت‌ها (Other)',
      // Aliases
      coding: 'برنامه‌نویسی و کدنویسی',
      writing: 'نویسندگی و ترجمه',
      education: 'آموزش و یادگیری',
      business: 'کسب‌وکار و مدیریت',
      creative: 'خلاقیت و طراحی',
      productivity: 'بهره‌وری',
      marketing: 'بازاریابی',
      general: 'عمومی'
    },
    linkCategories: {
      all: 'همه منابع و وب‌سایت‌ها',
      'global-popular': 'وب‌سایت‌های مشهور جهانی',
      'education-scientific': 'وب‌سایت‌های علمی و آموزشی',
      'free-courses': 'دوره‌های رایگان آنلاین',
      'books-libraries': 'کتاب‌ها و کتابخانه‌های دیجیتال',
      'ai-tools': 'ابزارهای هوش مصنوعی',
      'design-photo': 'وب‌سایت‌های عکس و طراحی',
      'video-tools': 'ابزارهای ویدیو و ادیت',
      'tech-programming': 'تکنالوژی و برنامه‌نویسی',
      'translation-languages': 'ترجمه و زبان‌ها',
      'research-papers': 'تحقیقات علمی و مقالات',
      'news-media': 'منابع خبری و اطلاعاتی',
      'afghan-resources': 'وب‌سایت‌های مرتبط با افغانستان',
      'government-services': 'خدمات دولتی و رسمی',
      'jobs-scholarships': 'فرصت‌های شغلی و بورسیه‌ها',
      'other-links': 'سایر لینک‌های مفید',
      // Aliases
      learning: 'پلتفرم‌های یادگیری',
      development: 'منابع توسعه‌دهندگان',
      design: 'گرافیک و طراحی',
      utilities: 'ابزارهای سودمند دیجیتال',
      books: 'کتابخانه‌ها و مقالات'
    },
    tools: {
      All: 'همه مدل‌ها',
      ChatGPT: 'ChatGPT',
      Gemini: 'Google Gemini',
      Claude: 'Claude AI',
      Midjourney: 'Midjourney',
      DeepSeek: 'DeepSeek',
      Perplexity: 'Perplexity'
    },
    quickPreview: 'پیش‌نمایش و بررسی سریع',
    close: 'بستن',
    footerText: 'پروژه Ansary Knowledge؛ مرجع ارائه منابع پیشرفته هوش مصنوعی و دیجیتال برای جوانان و دانشجویان.',
    footerRights: 'تمامی حقوق محفوظ است © Ansary Knowledge',
    aboutTitle: 'درباره Ansary Knowledge',
    aboutDesc: 'این پلتفرم برای گردآوری هوشمندانه‌ترین دستورهای پرامپت، ابزارهای مفید هوش مصنوعی و لینک‌های معتبر با پشتیبانی از سه زبان پشتو، دری و انگلیسی طراحی گردیده است.',
    promptVariablesNote: 'می‌توانید متغیرهای داخل پرانتز [ ... ] را متناسب با نیاز خود تغییر دهید.',
    clickToCustomize: 'برای تغییر متن اینجا کلیک کنید'
  },
  en: {
    appName: 'Ansary Knowledge',
    appSubtitle: 'Curated AI Prompts & Essential Digital Resources',
    searchPlaceholder: 'Search prompts or websites (by title, content, tag or URL)...',
    promptsTab: 'Prompt Library',
    linksTab: 'Useful Websites & Links',
    favoritesTab: 'My Favorites',
    allCategories: 'All Categories',
    allTools: 'All AI Models',
    filterBy: 'Filter by:',
    sortBy: 'Sort by:',
    newest: 'Newest First',
    popular: 'Trending & Popular',
    featured: 'Featured & Top',
    alphabetical: 'Alphabetical',
    difficulty: 'Level:',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    copyPrompt: 'Copy Prompt',
    copied: 'Copied!',
    copiedSuccess: 'Prompt copied to clipboard successfully',
    openTool: 'Use in AI',
    testInGemini: 'Test in Gemini',
    visitLink: 'Visit Website',
    share: 'Share',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    targetModel: 'Recommended Model:',
    noResults: 'No matches found!',
    noResultsDesc: 'Try adjusting your search query or selecting a different category.',
    clearFilters: 'Reset all filters',
    adminTitle: 'Admin Management Panel',
    adminLogin: 'Admin Sign In',
    adminLogout: 'Sign Out',
    adminEmailLabel: 'Admin Email',
    adminPasswordLabel: 'Password',
    adminPasswordPlaceholder: 'Enter your password...',
    adminRoleRequired: 'This account does not have Admin Role privileges!',
    adminRoleVerified: 'Admin Role Verified',
    adminWrongPassword: 'Invalid email or password!',
    adminSuccessLogin: 'Successfully authenticated as Administrator.',
    adminManagePrompts: 'Manage Prompts',
    adminManageLinks: 'Manage Links',
    addNewPrompt: 'Add New Prompt',
    editPrompt: 'Edit Prompt',
    deletePrompt: 'Delete Prompt',
    addNewLink: 'Add New Link',
    editLink: 'Edit Link',
    deleteLink: 'Delete Link',
    titlePs: 'Title (Pashto)',
    titleFa: 'Title (Dari/Persian)',
    titleEn: 'Title (English)',
    descPs: 'Description (Pashto)',
    descFa: 'Description (Dari/Persian)',
    descEn: 'Description (English)',
    promptContent: 'Prompt Template / Instructions',
    promptContentPlaceholder: 'Write your full AI prompt instruction here...',
    category: 'Category',
    targetToolLabel: 'Recommended AI Tool',
    tagsLabel: 'Tags (comma separated)',
    tagsHelper: 'Example: coding, writing, research',
    badgePs: 'Badge (Pashto)',
    badgeFa: 'Badge (Dari)',
    badgeEn: 'Badge (English)',
    linkUrl: 'Website URL',
    isFeaturedLabel: 'Mark as Featured',
    save: 'Save Changes',
    cancel: 'Cancel',
    confirmDeleteTitle: 'Are you sure?',
    confirmDeleteMsg: 'This item will be permanently removed from local storage.',
    delete: 'Delete',
    resetDefaults: 'Restore Default Data',
    resetDefaultsConfirm: 'Are you sure you want to restore defaults? All your custom modifications will be reset.',
    exportData: 'Export Backup (JSON)',
    importData: 'Import Data (JSON)',
    importSuccess: 'Data imported successfully!',
    importError: 'Failed to read or parse the imported file!',
    statsPrompts: 'Active Prompts',
    statsLinks: 'Useful Websites',
    statsFavorites: 'Bookmarked',
    filterLanguage: 'Language:',
    allLanguages: 'All Languages',
    pricing: 'Pricing:',
    free: 'Free',
    freemium: 'Freemium',
    paid: 'Paid',
    allPricing: 'All Pricing',
    usageInstructions: 'Usage Instructions',
    samplePreview: 'Sample Output',
    reportBrokenLink: 'Report Broken Link',
    reportSentSuccess: 'Thank you! Link report received.',
    reportReason: 'Select reason:',
    linkNotOpening: 'Website does not open',
    linkOutdated: 'Content is broken or outdated',
    linkOther: 'Other issue',
    sendReport: 'Submit Report',
    verifiedClicks: 'Verified Views:',
    invalidUrl: 'Invalid or unsafe URL',
    linkSecurityWarning: 'For security reasons, this link cannot be opened.',
    copyFailed: 'Failed to copy URL',
    linkCopied: 'Website URL copied to clipboard',
    alreadyReported: 'You have already submitted a report for this link.',
    reportFailed: 'Failed to submit report. Please try again later.',
    submittingReport: 'Submitting report...',
    reportNotes: 'Additional notes (optional)',
    reportNotesPlaceholder: 'Describe what went wrong...',
    reportSavedLocal: 'Report logged successfully and queued for review.',
    websiteLabel: 'Website:',
    superAdmin: 'Super Administrator',
    adminRole: 'Administrator',
    userRole: 'Standard User',
    insufficientPermissions: 'You do not have the required permissions to execute this action.',
    tooManyAttempts: 'Too many failed login attempts. Please try again later.',
    loginThrottled: 'For brute-force protection, please wait a few moments before trying again.',
    supabaseNotConfiguredWarning: 'Supabase database is not configured. Under strict security rules, offline admin logins are prohibited. Configure environment keys to proceed.',
    auditLogsTab: 'Audit & Activity Logs',
    auditAction: 'Action',
    auditEntity: 'Entity / Target',
    auditTimestamp: 'Timestamp',
    auditUser: 'Actor',
    noAuditLogs: 'No audit records logged yet.',
    clearAuditLogs: 'Clear Logs',
    statusPublished: 'Published',
    statusDraft: 'Draft',
    isDraftLabel: 'Keep as Draft (hidden from public view)',
    importPreviewTitle: 'Import Preview & Confirmation',
    importPreviewDesc: 'Inspect the incoming dataset counts below. An automatic pre-import safety backup will be created upon confirmation.',
    confirmImport: 'Confirm & Apply Import',
    importValidationFailed: 'The imported file is invalid or does not match the required schema.',
    preImportBackupCreated: 'Automatic rollback backup snapshot was created before importing.',
    duplicateUrlError: 'This URL already exists in your useful links collection.',
    duplicatePromptError: 'This prompt template already exists in your prompt library.',
    itemDeletedSuccess: 'Record was successfully and permanently removed from database.',
    itemSavedSuccess: 'Record was successfully committed to the database.',
    operationFailed: 'Operation could not be completed due to a database error.',
    instructionsPs: 'Usage Instructions (Pashto)',
    instructionsFa: 'Usage Instructions (Dari)',
    instructionsEn: 'Usage Instructions (English)',
    sampleUrlLabel: 'Sample Output URL',
    sampleTypeLabel: 'Sample Output Type',
    authorLabel: 'Author / Curator',
    isPopularLabel: 'Mark as Trending & Popular',
    pricingLabel: 'Pricing Model',
    confirmDeleteSpecific: 'Are you sure you want to permanently delete this item?',
    undoBackupNotice: 'You can restore previous local backup snapshots from the settings tab.',
    promptCategories: {
      all: 'All Prompts',
      'image-generation': 'Image Generation',
      'funny-entertainment': 'Funny & Entertainment',
      'informational-scientific': 'Informational & Scientific',
      'education-learning': 'Education & Learning',
      'art-creative': 'Art & Creative',
      'writing-poetry': 'Writing & Poetry',
      'social-media': 'Social Media',
      'business-professional': 'Business & Professional',
      'programming-technology': 'Programming & Technology',
      'video-creation': 'Video Creation',
      'research-analysis': 'Research & Analysis',
      'translation-language': 'Translation & Language',
      'audio-music': 'Audio & Music',
      other: 'Other Prompts',
      // Aliases
      coding: 'Coding & Development',
      writing: 'Writing & Translation',
      education: 'Learning & Academics',
      business: 'Business & Management',
      creative: 'Creativity & Design',
      productivity: 'Productivity & Planning',
      marketing: 'Marketing & Social Media',
      general: 'General & Everyday'
    },
    linkCategories: {
      all: 'All Websites & Links',
      'global-popular': 'Popular Global Websites',
      'education-scientific': 'Educational & Scientific Sites',
      'free-courses': 'Free Online Courses',
      'books-libraries': 'Books & Digital Libraries',
      'ai-tools': 'AI Tools & Platforms',
      'design-photo': 'Photo & Design Sites',
      'video-tools': 'Video Creation & Editing',
      'tech-programming': 'Tech & Programming',
      'translation-languages': 'Translation & Languages',
      'research-papers': 'Research & Academic Papers',
      'news-media': 'News & Media Outlets',
      'afghan-resources': 'Afghan & Regional Hubs',
      'government-services': 'Government & Public Services',
      'jobs-scholarships': 'Jobs & Scholarships',
      'other-links': 'Other Useful Links',
      // Aliases
      learning: 'Learning Platforms',
      development: 'Developer Resources',
      design: 'Design & Visual Arts',
      utilities: 'Useful Digital Utilities',
      books: 'Digital Libraries & Research'
    },
    tools: {
      All: 'All Models',
      ChatGPT: 'ChatGPT',
      Gemini: 'Google Gemini',
      Claude: 'Claude AI',
      Midjourney: 'Midjourney',
      DeepSeek: 'DeepSeek',
      Perplexity: 'Perplexity'
    },
    quickPreview: 'Quick Inspect & Test',
    close: 'Close',
    footerText: 'Ansary Knowledge Project - Empowering students, developers, and creators with curated AI prompts and web utilities.',
    footerRights: 'All rights reserved © Ansary Knowledge',
    aboutTitle: 'About Ansary Knowledge',
    aboutDesc: 'A unified portal curated for high-impact AI prompts, verified web portals, and local resources with full trilingual support in Pashto, Dari, and English.',
    promptVariablesNote: 'You can replace the bracketed placeholders [ ... ] with your actual topic or requirements.',
    clickToCustomize: 'Click here to customize prompt'
  }
};
