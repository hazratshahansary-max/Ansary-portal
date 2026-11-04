import { Post, Book, Poetry, VideoItem, Project, Comment } from '../types';

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    slug: 'afghanistan-cricket-historic-victory',
    type: 'news',
    category: 'sports',
    title: 'د افغانستان د کرکټ ملي لوبډلې تاریخي بریا او نوې لاسته راوړنې',
    excerpt: 'د افغانستان کرکټ بورډ او ملي اتلانو په نړیوال جام کې په پرله‌پسې توګه لوړ پړاو ته لار ومونده او په زړه پورې سیالۍ یې نندارې ته وړاندې کړې.',
    content: `د هېواد د کرکټ اتلانو یو ځل بیا د ملت سرونه هسک کړل او په نړیوال ډګر کې یې وښودله چې د هیلې او زحمت په وسیله هر ډول خنډ له مخې لرې کېدای شي.

په دې سیالیو کې راشد خان، رحمن الله ګربز او فضل الحق فاروقي په توپ اچونه او توپ وهنه کې د پام وړ ریکارډونه جوړ کړل. د لوبو شنونکي دا بریا د افغان ځوانانو لپاره د لوړ مورال او نړۍ ته د افغانستان د مثبت انځور څرګندونه بولي. د لوبډلې مشر وویل چې زموږ راتلونکی هدف د کرکټ په ټولو فارمټونو کې د لومړیو درېیو نړیوالو هېوادونو په نوملړ کې ځای نیول دي.`,
    language: 'ps',
    author: 'حضرت شاه انصاري',
    date: '2026-11-02',
    coverImage: '/src/assets/images/ansary_hero_banner_1793805838021.jpg',
    tags: ['کرکټ', 'لوبې', 'ملي ویاړ', 'ورزش'],
    likes: 142,
    dislikes: 2,
    shares: 48,
    views: 1280,
    featured: true,
  },
  {
    id: 'post-2',
    slug: 'qosh-tepa-canal-second-phase',
    type: 'news',
    category: 'domestic',
    title: 'گزارش اختصاصی از پیشرفت فاز دوم کانال بزرگ قوش تیپه و رونق زراعت',
    excerpt: 'تکمیل بخش‌های کلیدی کانال بزرگ قوش‌تیپه نویدبخش خودکفایی زراعتی و ایجاد هزاران فرصت شغلی در ولایت‌های شمالی کشور می‌باشد.',
    content: `کانال آبیاری قوش‌تیپه به عنوان بزرگ‌ترین پروژه زیربنایی مدیریت منابع آبی در تاریخ نوین کشور با اتکا به مهندسان داخلی با سرعت بی‌سابقه‌ای در حال پیشرفت است.

طبق گزارش‌های رسمی، بیش از یکصد کیلومتر دیگر از خاکبرداری و تحکیمات بتونی فاز دوم با کیفیت عالی مهندسی به پایان رسیده است. با آبگیری کامل این بخش‌ها، بیش از نیم میلیون هکتار زمین بایر به کشتزار‌های غلات و باغداری مدرن تبدیل خواهد شد. این تحول نه‌تنها تأمین‌کننده امنیت غذایی پایدار خواهد بود، بلکه ساختارهای توزیع نوین آب را پایه‌گذاری می‌کند.`,
    language: 'fa',
    author: 'هیات تحریریه انصاری',
    date: '2026-10-28',
    coverImage: '/src/assets/images/ansary_hero_banner_1793805838021.jpg',
    tags: ['اقتصاد', 'زراعت', 'قوش تیپه', 'توسعه ملی'],
    likes: 215,
    dislikes: 4,
    shares: 89,
    views: 2450,
    featured: true,
  },
  {
    id: 'post-3',
    slug: 'distributed-database-architectures-2026',
    type: 'article',
    category: 'announcements',
    title: 'Modern Distributed Database Architectures: Scaling PostgreSQL and Supabase',
    excerpt: 'An architectural deep dive into horizontal scaling, logical replication, zero-downtime migrations, and Row-Level Security in mission-critical applications.',
    content: `Relational databases have evolved tremendously over the last decade. While NoSQL systems initially dominated discussions around high scalability, modern PostgreSQL and platforms like Supabase have bridged the divide with robust JSONB querying, logical replication, and edge routing.

Key Considerations for Enterprise Scale:
1. Connection Pooling & Proxying: Using PgBouncer and Supabase connection poolers to prevent connection exhaustion.
2. Row-Level Security (RLS): Enforcing multi-tenant authorization directly at the database engine level, removing the attack surface from buggy application layers.
3. Read Replicas & Regional Routing: Offloading read-heavy analytics queries to geographically distributed replicas.
4. Schema Migrations: Practicing backwards-compatible field additions to ensure zero downtime.`,
    language: 'en',
    author: 'Hazrat Shah Ansary',
    date: '2026-10-20',
    coverImage: '/src/assets/images/ansary_database_project_1793805839928.jpg',
    tags: ['Database', 'PostgreSQL', 'Supabase', 'Cloud Architecture'],
    likes: 98,
    dislikes: 1,
    shares: 34,
    views: 920,
    featured: true,
  },
  {
    id: 'post-4',
    slug: 'ansary-literary-fellowship-announcement',
    type: 'news',
    category: 'announcements',
    title: 'د پښتو او دري ادبیاتو د نوښتګرو څېړونکو لپاره د انصاري علمي بورس',
    excerpt: 'د انصاري علمي مرکز د ځوانو لیکوالانو، محققانو او پروګرامرانو لپاره د نوښتګرو ادبي او ټیکنالوژیکي پروژو د ملاتړ کلنۍ برنامه اعلان کړه.',
    content: `د ځوانو استعدادونو د ودې او د معاصرو علمي او ادبي منابعو د غنا په موخه، د انصاري بنسټ د ۱۲ میاشتنۍ مالي او تخنیکي مرستې اعلان کوي.

دا بورس هغو محققینو ته ځانګړی شوی چې د هېواد د کلاسیکو ادبیاتو ډیجیټل کول، په پښتو او دري ژبو کې د مصنوعي ځیرکتیا د ژبني موډلونو جوړول او د نوو ډیټابیسونو پراختیا په پام کې لري. مینه وال کولی شي خپل پروپوزلونه د اړیکې د فورمې له لارې واستوي.`,
    language: 'ps',
    author: 'د انصاري بنسټ دارالانشا',
    date: '2026-11-01',
    coverImage: '/src/assets/images/ansary_books_poetry_1793805839753.jpg',
    tags: ['بورس', 'علمي برنامه', 'ادبیات', 'ټیکنالوژي'],
    likes: 87,
    dislikes: 0,
    shares: 52,
    views: 890,
    featured: false,
  },
  {
    id: 'post-5',
    slug: 'quantum-computing-and-cryptography',
    type: 'article',
    category: 'international',
    title: 'رایانش کوانتومی و سرنوشت رمزنگاری پایگاه‌های داده جهانی',
    excerpt: 'بررسی تأثیر کامپیوترهای کوانتومی بر الگوریتم‌های سنتی رمزنگاری RSA و لزوم گذار فوری به رمزنگاری پسا-کوانتومی (PQC).',
    content: `سرعت خیره‌کننده پیشرفت در پردازنده‌های کوانتومی زنگ خطری جدی برای سیستم‌های بانکی، مراکز ذخیره‌سازی داده‌های دولتی و پایگاه‌های اطلاعاتی ابری به شمار می‌رود.

الگوریتم‌های معروفی مانند RSA و ECC که ستون فقرات امنیت اینترنت امروزی هستند، در برابر الگوریتم شور (Shor's Algorithm) آسیب‌پذیر خواهند بود. موسسه ملی استانداردها (NIST) استانداردهای جدید کریپتوگرافی شبکه-پایه را تصویب نموده است. مهندسان دیتابیس باید از هم‌اکنون استراتژی مهاجرت به کلیدهای ایمن در برابر کوانتوم را تدوین کنند.`,
    language: 'fa',
    author: 'حضرت شاه انصاری',
    date: '2026-10-15',
    coverImage: '/src/assets/images/ansary_database_project_1793805839928.jpg',
    tags: ['امنیت', 'کوانتوم', 'دیتابیس', 'رمزنگاری'],
    likes: 110,
    dislikes: 2,
    shares: 41,
    views: 1140,
    featured: false,
  },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'د معاصرې سافټویر انجنیرۍ او کلاوډ ډیټابیسونو لارښود',
    author: 'حضرت شاه انصاري',
    description: 'په دې کتاب کې د عصري ډیټابیسونو جوړښت، د SQL او NoSQL پرتلنه، د PostgreSQL پرمختللې بڼې او د ډیټا خوندیتوب اصول په پښتو ژبه په عملي بڼه تشریح شوي دي.',
    coverImage: '/src/assets/images/ansary_books_poetry_1793805839753.jpg',
    pdfUrl: '#',
    language: 'ps',
    pages: 340,
    publicationYear: 2025,
    category: 'ټیکنالوژي او کمپیوټر',
    downloads: 1420,
    likes: 184,
    dislikes: 3,
    fileSize: '14.8 MB',
  },
  {
    id: 'book-2',
    title: 'سیر حکمت و شعر در ادبیات خراسان و کابلستان',
    author: 'مولانا جلال الدین، بیدل و حواشی حضرت شاه انصاری',
    description: 'پژوهشی عمیق در ابعاد عرفانی، فلسفی و استعاری غزل‌های مولانا و میرزا عبدالقادر بیدل به همراه بررسی وزن‌های عروضی و تجلی حکمت در شعر کهن.',
    coverImage: '/src/assets/images/ansary_books_poetry_1793805839753.jpg',
    pdfUrl: '#',
    language: 'fa',
    pages: 420,
    publicationYear: 2024,
    category: 'ادبیات و عرفان',
    downloads: 2150,
    likes: 320,
    dislikes: 1,
    fileSize: '18.2 MB',
  },
  {
    id: 'book-3',
    title: 'Enterprise Database Design & Resilient Systems',
    author: 'Hazrat Shah Ansary',
    description: 'A comprehensive handbook for software architects and senior engineers covering relational modeling, schema normalization, high-concurrency transactions, and disaster recovery.',
    coverImage: '/src/assets/images/ansary_database_project_1793805839928.jpg',
    pdfUrl: '#',
    language: 'en',
    pages: 480,
    publicationYear: 2026,
    category: 'Computer Science',
    downloads: 3100,
    likes: 412,
    dislikes: 5,
    fileSize: '22.5 MB',
  },
  {
    id: 'book-4',
    title: 'د خوشحال خان خټک کلیات او د تورې او قلم فلسفه',
    author: 'تدوین او څېړنه: حضرت شاه انصاري',
    description: 'د پښتو ژبې د بابا، خوشحال بابا د جنګي، اخلاقي، ښوونیزو او ادبي منظومو بشپړ ټولګه د ژورو معنايي لمنلیکونو او لغتنامې سره.',
    coverImage: '/src/assets/images/ansary_books_poetry_1793805839753.jpg',
    pdfUrl: '#',
    language: 'ps',
    pages: 560,
    publicationYear: 2023,
    category: 'کلاسیک ادب',
    downloads: 1890,
    likes: 275,
    dislikes: 2,
    fileSize: '24.1 MB',
  },
];

export const INITIAL_POETRY: Poetry[] = [
  {
    id: 'poetry-1',
    title: 'د پوهې او وطن مینه (غزل)',
    poet: 'حضرت شاه انصاري',
    era: 'معاصر',
    language: 'ps',
    genre: 'غزل',
    explanation: 'دا غزل د وطن د بیا رغونې، پوهې ته د ارتقا او د قلم په زور د ناهیلیو د ماتولو په باب لیکل شوی دی.',
    verses: [
      {
        line1: 'چې قلم په لاس کې واخلو، تور تمونه رڼا کېږي',
        line2: 'د وطن وران شوي کلي په پوهه او تدبیر ودانېږي',
      },
      {
        line1: 'که تاریخ د تورې نوم و، نن د علم او تخنیک دور دی',
        line2: 'هر یو ګام چې پر مخ ږدو، یو نوی ویاړ راټوکېږي',
      },
      {
        line1: 'انصاري د حق اواز کړه تر نړیوالو غوږونو',
        line2: 'د بې‌وزلو زړونو هیلې په اخلاص سره پوره کېږي',
      },
    ],
    likes: 95,
    dislikes: 0,
  },
  {
    id: 'poetry-2',
    title: 'در هوای وصل و جویبار معرفت',
    poet: 'حضرت حافظ شیرازی (با شرح انصاری)',
    era: 'قرن هشتم',
    language: 'fa',
    genre: 'غزل عرفانی',
    explanation: 'یکی از شاهکارهای شعر صوفیانه در بیان تجلی حقیقت و عدم اعتنا به تعلقات زودگذر دنیوی.',
    verses: [
      {
        line1: 'در ازل پرتو حسنت ز تجلی دم زد',
        line2: 'عشق پیدا شد و آتش به همه عالم زد',
      },
      {
        line1: 'جلوه‌ای کرد رخت دید ملک عشق نداشت',
        line2: 'عین آتش شد از این غیرت و بر آدم زد',
      },
      {
        line1: 'مدعی خواست که آید به تماشاگه راز',
        line2: 'دست غیب آمد و بر سینه نامحرم زد',
      },
    ],
    likes: 182,
    dislikes: 1,
  },
  {
    id: 'poetry-3',
    title: 'د غیرت او ننګ پیغام',
    poet: 'خوشحال خان خټک',
    era: 'یوولسمه هجري پېړۍ',
    language: 'ps',
    genre: 'قصیده حماسي',
    explanation: 'د خوشحال بابا د حماسي او ملي شعور سمبول چې افغان ځوانان پوهې، ازادۍ او وقار ته هڅوي.',
    verses: [
      {
        line1: 'د افغان په ننګ مې وتړله توره',
        line2: 'ننګیالی د زمانې خوشحال خټک یم',
      },
      {
        line1: 'یا به دا وران افغانستان کړمه ودان',
        line2: 'یا به ځان په دې لاره کې کړم قربان',
      },
    ],
    likes: 140,
    dislikes: 1,
  },
  {
    id: 'poetry-4',
    title: 'Whispers of Midnight Code and Metaphor',
    poet: 'Hazrat Shah Ansary',
    era: 'Contemporary (2026)',
    language: 'en',
    genre: 'Modern Philosophical Poem',
    explanation: 'Reflecting on the bridge between ancient poetic rhythms and modern algorithmic logic.',
    verses: [
      {
        line1: 'In lines of code and rhymes of ancient thought,',
        line2: 'A timeless spark of human quest is sought.',
      },
      {
        line1: 'From Silk Road ink to silicon-etched light,',
        line2: 'We build the dawn to pierce the deep of night.',
      },
    ],
    likes: 64,
    dislikes: 0,
  },
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'video-1',
    title: 'د کلاوډ ډیټابیسونو او Supabase عملي تدریس په پښتو ژبه',
    description: 'په دې ۵۰ دقیقه‌اي درس کې د ډیټابیس سکیما ډیزاین، د RLS پالیسیو تنظیمول او د ری ایکټ سره د معلوماتو ژوندی نښلول په عملي توګه تدریس کېږي.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/src/assets/images/ansary_database_project_1793805839928.jpg',
    duration: '48:30',
    language: 'ps',
    views: 3410,
    likes: 245,
    dislikes: 3,
    publishedAt: '2026-10-12',
    category: 'ټیکنالوژي',
  },
  {
    id: 'video-2',
    title: 'سخنرانی علمی: تلاقی ادبیات کلاسیک و تحول دیجیتال در عصر هوش مصنوعی',
    description: 'کنفرانس بین‌المللی کابل پیرامون راهکارهای حفظ نسخ خطی کهن و ایجاد پایگاه داده‌های زبان‌شناسی با حضور اساتید برجسته دانشگاه.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/src/assets/images/ansary_books_poetry_1793805839753.jpg',
    duration: '35:15',
    language: 'fa',
    views: 2890,
    likes: 198,
    dislikes: 2,
    publishedAt: '2026-09-25',
    category: 'فرهنگ و پژوهش',
  },
  {
    id: 'video-3',
    title: 'Enterprise Architecture: Building Resilient Microservices with Zero-Trust',
    description: 'Technical symposium presentation on database replication topologies, tenant isolation, and high-availability clusters.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/src/assets/images/ansary_hero_banner_1793805838021.jpg',
    duration: '42:10',
    language: 'en',
    views: 4120,
    likes: 310,
    dislikes: 6,
    publishedAt: '2026-10-04',
    category: 'Software Architecture',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'project-1',
    title: 'Aurora Cloud: Enterprise Healthcare Electronic Records Database',
    shortDescription: 'High-availability, HIPAA-compliant patient management relational database with multi-region replication and encrypted vault storage.',
    fullDescription: `Aurora Cloud was architected to serve a nationwide network of clinics and hospitals with sub-10 millisecond query latency.

Database Architecture Highlights:
- PostgreSQL 16 engine coupled with custom Row-Level Security (RLS) enforcement
- Strict role-based isolation guaranteeing that medical practitioners only access patient charts within their authorized jurisdiction
- Audit trailing tables utilizing append-only cryptographic hashes for tamper-proof compliance logs
- Automated point-in-time recovery (PITR) with continuous WAL archiving to geographically isolated storage tiers.`,
    screenshots: [
      '/src/assets/images/ansary_database_project_1793805839928.jpg',
      '/src/assets/images/ansary_hero_banner_1793805838021.jpg',
    ],
    features: [
      'Multi-tenant database isolation with strict Row Level Security',
      'Zero-downtime automated schema migration pipeline',
      'Sub-second full-text patient diagnostic history indexing',
      'Automated nightly cold backups with cryptographic checksum verification',
      'Integrated real-time biometric and laboratory sensor ingest stream',
    ],
    techStack: ['PostgreSQL', 'Supabase', 'TypeScript', 'Node.js', 'Docker', 'Redis', 'Tailwind CSS'],
    contactInfo: {
      email: 'hazrat.shah.ansary@gmail.com',
      phone: '+93 70 000 0000',
      leadEngineer: 'Hazrat Shah Ansary',
    },
    databaseType: 'PostgreSQL & Supabase Multi-Cluster',
    securityNotice: 'Security Policy: Production database credentials, internal connection pools, and patient PII are isolated behind VPN firewalls and never exposed on public demonstrators.',
    likes: 178,
    dislikes: 2,
    shares: 63,
    demoUrl: '#inquire',
  },
  {
    id: 'project-2',
    title: 'Aryana Transit: High-Throughput Fleet Telemetry & Logistics Database',
    shortDescription: 'TimescaleDB and PostGIS-powered geospatial database tracking thousands of freight transports in real-time across mountainous corridors.',
    fullDescription: `A specialized telemetry infrastructure built to ingest sensor pings from commercial freight fleets operating in low-bandwidth trans-Eurasian transport corridors.

System Architecture:
- Built with time-series hypertables in TimescaleDB allowing seamless partition pruning
- PostGIS spatial indexing for high-speed geofencing and mountain pass hazard warnings
- Edge-caching SQLite store that buffers offline vehicle telemetry and synchronizes in batches once cellular 4G/satellite links resume.`,
    screenshots: [
      '/src/assets/images/ansary_database_project_1793805839928.jpg',
    ],
    features: [
      'Geospatial bounding-box queries executing in under 4ms across 10M records',
      'Automatic offline data buffering with progressive background sync',
      'Automated fuel consumption anomaly alerts via triggers',
      'Custom dispatcher dashboard with real-time WebSocket live updates',
    ],
    techStack: ['TimescaleDB', 'PostGIS', 'Express', 'React', 'Leaflet', 'Tailwind CSS'],
    contactInfo: {
      email: 'hazrat.shah.ansary@gmail.com',
      phone: '+93 70 000 0000',
      leadEngineer: 'Hazrat Shah Ansary',
    },
    databaseType: 'TimescaleDB & Spatial PostGIS',
    securityNotice: 'Security Notice: Vehicle coordinates and commercial cargo manifests are encrypted in transit and at rest using AES-256 GCM.',
    likes: 122,
    dislikes: 1,
    shares: 39,
    demoUrl: '#inquire',
  },
  {
    id: 'project-3',
    title: 'Maktaba: Central Scholarly Manuscript Repository & Vector Search',
    shortDescription: 'National digital archival repository cataloging rare Afghan literature, historical decrees, and Arabic calligraphy with semantic vector search.',
    fullDescription: `Maktaba indexes centuries of Afghan and regional scholarly heritage. It pairs relational metadata cataloging with pgvector embeddings to allow scholars to find thematic connections across disparate historical manuscripts.

Key Capabilities:
- Full-text search optimized for Perso-Arabic scripts and ligatures
- High-resolution deep zoom for manuscript folios
- Community annotations workflow with moderation queues and reviewer scoring.`,
    screenshots: [
      '/src/assets/images/ansary_books_poetry_1793805839753.jpg',
      '/src/assets/images/ansary_hero_banner_1793805838021.jpg',
    ],
    features: [
      'pgvector cosine similarity for semantic manuscript concept exploration',
      'OCR text layer integration with bilingual transcription side-by-side',
      'Granular curator permissions with public open-access read tiers',
    ],
    techStack: ['PostgreSQL (pgvector)', 'Next.js', 'Supabase Storage', 'TypeScript', 'Tailwind CSS'],
    contactInfo: {
      email: 'hazrat.shah.ansary@gmail.com',
      phone: '+93 70 000 0000',
      leadEngineer: 'Hazrat Shah Ansary',
    },
    databaseType: 'PostgreSQL with pgvector',
    securityNotice: 'Security Policy: High-resolution master TIFF scans are protected via signed time-limited URLs generated on demand.',
    likes: 210,
    dislikes: 0,
    shares: 78,
    demoUrl: '#inquire',
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    targetId: 'post-1',
    targetType: 'post',
    authorName: 'احمد ولي وردګ',
    content: 'د هېواد د ورزشکارانو دا بریا زموږ ټولو لپاره د ویاړ ځای دی. کور مو ودان چې دومره په زړه پورې خبرونه په اصیل پښتو ژبه خپروئ.',
    createdAt: '2026-11-03 14:20',
    status: 'approved',
    likes: 18,
  },
  {
    id: 'comm-2',
    targetId: 'post-3',
    targetType: 'post',
    authorName: 'Karim Nabizada',
    content: 'Exceptional architectural breakdown on Row Level Security. Implementing RLS in Supabase saved us weeks of redundant backend authorization code.',
    createdAt: '2026-10-22 09:15',
    status: 'approved',
    likes: 12,
  },
  {
    id: 'comm-3',
    targetId: 'book-1',
    targetType: 'book',
    authorName: 'فریدون هروی',
    content: 'کتاب بسیار کاربردی و ارزشمند است. از استاد انصاری کمال تشکر را داریم که این علم را به رایگان در اختیار محصلین قرار داده‌اند.',
    createdAt: '2026-10-30 18:40',
    status: 'approved',
    likes: 24,
  },
  {
    id: 'comm-4',
    targetId: 'project-1',
    targetType: 'project',
    authorName: 'Dr. S. Mohammad',
    content: 'We reviewed the architecture proposal for Aurora Cloud. The audit-trail implementation and RLS isolation strategy are top tier.',
    createdAt: '2026-11-01 11:05',
    status: 'approved',
    likes: 8,
  },
];
