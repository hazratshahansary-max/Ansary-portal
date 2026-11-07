import { PromptItem, LinkItem } from '../types';

export const INITIAL_PROMPTS: PromptItem[] = [
  {
    id: 'p-code-explainer',
    title: {
      ps: 'د پروګرامینګ کوډ تشریح کوونکی او تفتیش',
      fa: 'توضیح‌دهنده و بازبینی عمیق کد برنامه‌نویسی',
      en: 'Comprehensive Code Explainer & Auditor'
    },
    description: {
      ps: 'هر ډول پیچلی کوډ ګام په ګام تشریح کوي، احتمالي تېروتنې په ګوته کوي او د ښه کولو لارښوونې درکوي.',
      fa: 'کدهای پیچیده را گام‌به‌گام تحلیل کرده و خطاهای امنیتی یا کارایی را نشان می‌دهد.',
      en: 'Analyzes complex code snippets step-by-step, identifies bottlenecks, bugs, and suggests modern improvements.'
    },
    promptText: `ته یو لوړپوړی سافټویر انجنیر (Senior Software Engineer) یې. مهرباني وکړئ لاندې کوډ په غور سره وڅېړه:

[کوډ دلته ځای پر ځای کړئ / Insert Code Here]

د لاندې ټکو په پام کې نیولو سره ځواب راکړه:
1. لنډه پایله: دا کوډ په دقیقه توګه څه کوي؟
2. ګام په ګام تشریح: د مهمو متغیرونو او منطق تحلیل.
3. د کمزورتیاوو او بګونو په ګوته کول: (Security, Performance, Edge cases).
4. اصلاح شوی او مسلکي کوډ (Refactored Clean Code) وړاندې کړه.`,
    category: 'programming-technology',
    targetTool: 'Claude',
    tags: ['پروګرامینګ', 'کوډ', 'برنامه‌نویسی', 'debugging', 'clean-code'],
    isFeatured: true,
    isPopular: true,
    difficulty: 'intermediate',
    language: 'all',
    usageInstructions: {
      ps: 'خپل بشپړ کوډ د [کوډ دلته ځای پر ځای کړئ] پر ځای راکاپي کړئ او په Claude یا ChatGPT کې یې واستوئ.',
      fa: 'کد مورد نظر خود را به جای علامت مشخص شده کپی کرده و ارسال کنید.',
      en: 'Paste your raw source code replacing the bracketed code placeholder and submit to Claude or ChatGPT.'
    },
    createdAt: '2026-01-15'
  },
  {
    id: 'p-trilingual-translator',
    title: {
      ps: 'د پښتو، دري او انګلیسي تخصصي ژباړن',
      fa: 'مترجم تخصصی و ادیبانه پشتو، دری و انگلیسی',
      en: 'Trilingual Expert Translator (Pashto, Dari, English)'
    },
    description: {
      ps: 'متنونه په مسلکي ډول پرته له میخانیکي تېروتنو، د هرې ژبې د کلتوري او اصطلاحي نزاکتونو په ساتلو ژباړي.',
      fa: 'ترجمه دقیق و طبیعی با رعایت اصطلاحات بومی و بلاغت زبانی میان پشتو، دری و انگلیسی.',
      en: 'Natural, culturally coherent translation between Pashto, Dari, and English avoiding machine-like phrasing.'
    },
    promptText: `ته یو مسلکي ادبي او ژبپوه ژباړن یې چې په پښتو، دري او انګلیسي پوره برلاسی یې.
مهرباني وکړئ لاندې متن له [سرچینه ژبه: پښتو/دري/انګلیسي] څخه [هدف ژبې: ...] ته وژباړه:

"""
[ستاسو متن دلته / Your text here]
"""

لارښوونې:
- د ژبې رواني او اصطلاحي جوړښت وساته (کلمه په کلمه مه ژباړه).
- په ادبي او مسلکي لحن تمرکز وکړه.
- که په متن کې کلتوري یا تخصصي اصطلاحات وي، په پای کې یې لنډ تشریحي یادښت ولیکه.`,
    category: 'translation-language',
    targetTool: 'Gemini',
    tags: ['ژباړه', 'پښتو', 'دري', 'ترجمه', 'translation', 'languages'],
    isFeatured: true,
    isPopular: true,
    difficulty: 'beginner',
    language: 'ps',
    usageInstructions: {
      ps: 'د [سرچینه ژبه] او [هدف ژبه] پر ځای خپلې خوښې ژبې وټاکئ او متن مو دننه کړئ.',
      fa: 'زبان مبدأ و مقصد را تعیین نموده و متن خود را درج کنید.',
      en: 'Set source and target languages in the bracketed positions and insert your text.'
    },
    createdAt: '2026-01-18'
  },
  {
    id: 'p-socratic-tutor',
    title: {
      ps: 'د سقراطي میتود شخصي ښوونکی',
      fa: 'استاد اختصاصی با روش پرسشگری سقراطی',
      en: 'Socratic Method Personal Tutor'
    },
    description: {
      ps: 'مستقیم ځواب نه درکوي؛ بلکې د ځیرکو پوښتنو له لارې ستاسو ذهن فعالوي ترڅو موضوع پخپله درک کړئ.',
      fa: 'پاسخ مستقیم نمی‌دهد؛ بلکه با طرح سوال‌های راهنما به درک عمیق موضوع توسط خودتان کمک می‌کند.',
      en: 'Acts as an interactive Socratic tutor asking probing questions instead of spoon-feeding answers.'
    },
    promptText: `ته زما زغم لرونکی او هوښیار ښوونکی یې چې د سقراطي مېتود (Socratic Method) پر بنسټ تدریس کوې.
زه غواړم په دې موضوع پوه شم: "[موضوع / لکه: Machine Learning یا د کوانټم فزیک اساسات]".

مهرباني وکړئ:
- ماته مستقیم بشپړ ځواب مه راکوه.
- لومړی زما د اوسني مالوماتو د کچې سنجولو لپاره یوه بنسټیزه متفکره پوښتنه وپوښته.
- زما له هر ځواب وروسته لارښوونه کوونکې بله پوښتنه وکړه تر څو زه پخپله سمې پایلې ته ورسېږم.`,
    category: 'education-learning',
    targetTool: 'ChatGPT',
    tags: ['ښوونه', 'زده‌کړه', 'آموزش', 'education', 'socratic'],
    isFeatured: false,
    isPopular: true,
    difficulty: 'intermediate',
    language: 'all',
    createdAt: '2026-01-20'
  },
  {
    id: 'p-business-swot',
    title: {
      ps: 'د سوداګریز پلان او SWOT هراړخیز تحلیل',
      fa: 'تحلیل جامع استراتژی کسب‌وکار و مدل SWOT',
      en: 'Business Strategy & Full SWOT Analyst'
    },
    description: {
      ps: 'د نویو پیل کېدونکو سوداګریو او سټارټ اپونو لپاره قوتونه، کمزورتیاوې، فرصتونه او ګواښونه روښانه کوي.',
      fa: 'بررسی دقیق نقاط قوت، ضعف، فرصت‌ها و تهدیدها برای ایده‌های نوپا و کسب‌وکارهای در حال توسعه.',
      en: 'Analyzes business ideas, uncovering Strengths, Weaknesses, Opportunities, and Threats with actionable recommendations.'
    },
    promptText: `ته یو ستراتیژیک سوداګریز سلاکار یې. زما د سوداګرۍ مفکوره دا ده:
- د پروژې نوم/ډول: [د پروژې نوم او ساحه]
- هدف کاروونکي/پېرودونکي: [مشتریان څوک دي]
- د فعالیت ځای: [افغانستان / سیمه / نړیوال بازار]

مهرباني وکړئ یو هراړخیز SWOT جدول جوړ کړه چې پکې لاندې برخې وي:
1. پیاوړي ټکي (Strengths)
2. کمزوري ټکي (Weaknesses)
3. شته فرصتونه (Opportunities)
4. احتمالي ګواښونه (Threats)
په پای کې ماته ۳ ستراتیژیک ګامونه وړاندیز کړه چې د ګواښونو مخه ونیسي او له فرصتونو زیاته ګټه پورته کړي.`,
    category: 'business-professional',
    targetTool: 'ChatGPT',
    tags: ['سوداګري', 'پلان', 'تجارت', 'swot', 'startup'],
    isFeatured: true,
    isPopular: false,
    difficulty: 'intermediate',
    language: 'all',
    createdAt: '2026-02-01'
  },
  {
    id: 'p-midjourney-photoreal',
    title: {
      ps: 'د انځور جوړولو الټرا ریالسټیک پرامپټ جنراتور',
      fa: 'سازنده پرامپت فوق‌واقع‌گرایانه برای تولید تصویر',
      en: 'Photorealistic Visual Art & Image Prompt Generator'
    },
    description: {
      ps: 'د Midjourney او DALL-E لپاره تفصیلي، هنري او سینمایي پرامپټونه د کامرې او رڼا له جزئیاتو سره جوړوي.',
      fa: 'تولید پرامپت‌های عکاسی و سینمایی برای هوش مصنوعی تصویرساز با تنظیم زاویه لنز و نورپردازی.',
      en: 'Crafts hyper-detailed, cinematic prompts for Midjourney, Imagen, and DALL-E with camera lens, lighting, and mood parameters.'
    },
    promptText: `You are an elite prompt engineer for AI image generators (Midjourney v6, Imagen 3, DALL-E 3).
Transform my basic idea into an ultra-detailed, photorealistic prompt in English.

My concept: [Describe your scene, e.g., "An Afghan elder artisan weaving traditional carpet in a sunlit Herat courtyard"]

Provide the output in this format:
1. Master Prompt (with camera sensor, lighting, shot type, color palette, atmospheric depth)
2. Midjourney Parameter line (e.g., --ar 16:9 --style raw --v 6.1)
3. Negative Prompt (things to avoid, e.g., oversaturated, blurry, bad anatomy)`,
    category: 'image-generation',
    targetTool: 'Midjourney',
    tags: ['ډیزاین', 'هنر', 'انځور', 'تصویر', 'midjourney', 'imagen'],
    isFeatured: true,
    isPopular: true,
    difficulty: 'advanced',
    language: 'en',
    sampleType: 'image',
    sampleUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-02-05'
  },
  {
    id: 'p-academic-feynman',
    title: {
      ps: 'د فاینمن میتود له لارې د ساینسي مسایلو تشریح',
      fa: 'ساده‌سازی مفاهیم سخت علمی با تکنیک فاینمن',
      en: 'Feynman Technique Science & Tech Simplifier'
    },
    description: {
      ps: 'سخت او پېچلي علمي موضوعات په داسې عامه ژبه او مثالونو تشریح کوي چې حتی یو لس کلن ماشوم پرې وپوهېږي.',
      fa: 'تبدیل مفاهیم دشوار علمی و تکنالوژی به زبان ساده با مثال‌های روزمره بدون اصطلاحات گیج‌کننده.',
      en: 'Breaks down complex scientific, mathematical, or technical concepts using simple analogies anyone can understand.'
    },
    promptText: `د ریچارډ فاینمن (Richard Feynman) د مشهور میتود پر اساس چلند وکړه.
زه غواړم دا مفهوم زده کړم: "[سخته ساینسي یا تخنیکي اصطلاح لکه: Blockchain یا Neural Networks یا Einstein Relativity]".

ځواب په دریو برخو وویشه:
۱. په ساده ژبه تشریح (داسې چې یو ۱۲ کلن کس پرې وپوهېږي؛ له هېڅ پېچلي لغت پرته).
۲. یو ریښتینی، عامیانه مثال (Analogy) له ورځني ژوند څخه.
۳. په پای کې ۲ ترټولو عام غلط فهمونه (Common Misconceptions) چې خلک یې په اړه لري روښانه کړه.`,
    category: 'informational-scientific',
    targetTool: 'Gemini',
    tags: ['ساینس', 'پوهنه', 'فاینمن', 'آموزش', 'feynman', 'science'],
    isFeatured: false,
    isPopular: false,
    difficulty: 'beginner',
    language: 'all',
    createdAt: '2026-02-10'
  },
  {
    id: 'p-cv-ats-optimizer',
    title: {
      ps: 'د نړیوالو دندو لپاره د CV او Resume ښه کوونکی (ATS)',
      fa: 'بهینه‌سازی رزومه کاری برای استانداردهای بین‌المللی و ATS',
      en: 'ATS-Friendly Resume & Career Profile Enhancer'
    },
    description: {
      ps: 'ستاسو کاري تجربه په قوي فعلونو، اندازه کېدونکو لاسته راوړنو او معیارونو سمبالوي.',
      fa: 'بازنویسی بخش‌های رزومه برای عبور موفق از فیلترهای خودکار استخدامی (ATS) شرکت‌های بین‌المللی.',
      en: 'Re-writes resume bullet points using high-impact action verbs, quantifiable metrics, and ATS keywords.'
    },
    promptText: `ته د نړیوالو شرکتونو یو باتجربه HR او د استخدام مسؤل یې. مهرباني وکړئ زما لاندې دندې توضیحات او تجارب وڅېړه:

کاري سابقه:
"""
[خپل کاري تجارب یا د CV برخه دلته راکاپي کړئ]
"""

هدف وظیفه: [د هغه پوسټ نوم چې غواړئ ورته غوښتنه وکړئ / لکه Frontend Engineer]

مهرباني وکړئ:
1. کاري تجربې په ځواکمنو افعالو (Action Verbs) او د STAR (Situation, Task, Action, Result) په بڼه بیا ولیکه.
2. کلیدي کلمې (Keywords) اضافه کړه تر څو د ATS سیسټم لخوا ترټولو لوړه نمره ترلاسه کړي.
3. زما د رزومې ۳ بنسټیزې نیمګړتیاوې راته په ګوته کړه.`,
    category: 'business-professional',
    targetTool: 'Claude',
    tags: ['دندې', 'رزومه', 'CV', 'استخدام', 'resume', 'career'],
    isFeatured: true,
    isPopular: true,
    difficulty: 'intermediate',
    language: 'all',
    createdAt: '2026-02-14'
  },
  {
    id: 'p-social-media-viral',
    title: {
      ps: 'د ټولنیزو رسنیو د وایرلو پوسټونو او ویډیوګانو سکریپټ',
      fa: 'سناریونویسی وایرال برای شبکه‌های اجتماعی (تیک‌تاک و ریلز)',
      en: 'High-Engagement Viral Social Media Hook & Script'
    },
    description: {
      ps: 'د فېسبوک، ټیک ټاک او یوټیوب لپاره په لومړیو ۳ ثانیو کې د لیدونکي پام راګرځوونکی او باارزښته متن جوړوي.',
      fa: 'ایجاد هوک‌های جذاب ۳ ثانیه‌ای و ساختار وایرال برای اینستاگرام و یوتیوب.',
      en: 'Generates scroll-stopping 3-second hooks, body value, and calls to action for reels, TikTok, and threads.'
    },
    promptText: `You are a viral social media strategist.
Write 3 high-converting script variants for a 45-second short video on this topic:
Topic: [ستاسو موضوع دلته / Your topic here]

Each variant must include:
1. Hook (First 3 seconds, pattern interrupt)
2. Core message (3 bullet points, fast pacing)
3. Call To Action (Specific comment/share trigger)`,
    category: 'social-media',
    targetTool: 'ChatGPT',
    tags: ['سوشل میډیا', 'ټیک ټاک', 'انستاګرام', 'یوټیوب', 'viral', 'reels'],
    isFeatured: true,
    isPopular: true,
    difficulty: 'beginner',
    language: 'all',
    createdAt: '2026-02-18'
  }
];

export const INITIAL_LINKS: LinkItem[] = [
  {
    id: 'link-gemini',
    title: {
      ps: 'ګوګل جیمینای (Google Gemini)',
      fa: 'هوش مصنوعی گوگل جمینای',
      en: 'Google Gemini'
    },
    description: {
      ps: 'د ګوګل ترټولو پیاوړی مصنوعي ځیرکتیا ماډل؛ په پښتو او دري ژبو خورا لوړ او روان درک لري.',
      fa: 'قوی‌ترین مدل هوش مصنوعی شرکت گوگل با تسلط عالی بر درک و تولید زبان‌های دری و پشتو.',
      en: 'Google’s multimodal flagship AI model with state-of-the-art multilingual reasoning and web grounding.'
    },
    url: 'https://gemini.google.com',
    category: 'ai-tools',
    tags: ['AI', 'Gemini', 'Google', 'چټ'],
    badge: {
      ps: 'وړیا او پیاوړی',
      fa: 'رایگان و قدرتمند',
      en: 'Free & Powerful'
    },
    isFeatured: true,
    isPopular: true,
    pricing: 'freemium',
    language: 'all',
    createdAt: '2026-01-01'
  },
  {
    id: 'link-chatgpt',
    title: {
      ps: 'چټ جي پي ټي (OpenAI ChatGPT)',
      fa: 'چت جی‌پی‌تی (OpenAI ChatGPT)',
      en: 'OpenAI ChatGPT'
    },
    description: {
      ps: 'د نړۍ مشهور هوښیار ژبنۍ ماډل د تحلیل، لیکنې، او کوډ کولو لپاره.',
      fa: 'معروف‌ترین چت‌بات هوش مصنوعی جهان مناسب تحلیل، تولید محتوا و کدنویسی.',
      en: 'The world-leading conversational AI model for text, programming, and complex problem solving.'
    },
    url: 'https://chatgpt.com',
    category: 'ai-tools',
    tags: ['OpenAI', 'ChatGPT', 'AI', 'کدنویسی'],
    badge: {
      ps: 'مشهور',
      fa: 'محبوب',
      en: 'Popular'
    },
    isFeatured: true,
    isPopular: true,
    pricing: 'freemium',
    language: 'all',
    createdAt: '2026-01-02'
  },
  {
    id: 'link-claude',
    title: {
      ps: 'کلود (Anthropic Claude)',
      fa: 'کلود هوش مصنوعی (Anthropic Claude)',
      en: 'Anthropic Claude'
    },
    description: {
      ps: 'په کوډینګ او اوږدو علمي او ادبي تحلیلونو کې د نړۍ ترټولو دقیق او باوري ماډل.',
      fa: 'دقیق‌ترین هوش مصنوعی برای برنامه‌نویسی پیشرفته و تحلیل مدارک طولانی.',
      en: 'Next-generation AI assistant known for exceptional coding precision, nuanced reasoning, and large context.'
    },
    url: 'https://claude.ai',
    category: 'ai-tools',
    tags: ['Claude', 'Anthropic', 'Coding', 'Research'],
    badge: {
      ps: 'د کوډ لپاره غوره',
      fa: 'برترین برای کد',
      en: 'Top for Coding'
    },
    isFeatured: true,
    isPopular: true,
    pricing: 'freemium',
    language: 'all',
    createdAt: '2026-01-03'
  },
  {
    id: 'link-qamosona',
    title: {
      ps: 'قاموسونه ډاټ کام (Qamosona.com)',
      fa: 'قاموس‌های آنلاین پشتو و دری (Qamosona)',
      en: 'Qamosona Online Lexicon'
    },
    description: {
      ps: 'د پښتو او دري ژبو ترټولو لوی وړیا انلاین قاموس او د لغتونو علمي زیرمه.',
      fa: 'بزرگترین فرهنگ لغت آنلاین زبان‌های پشتو، دری، انگلیسی و آلمانی با هزاران واژه تخصصی.',
      en: 'The premier online dictionary archive for Pashto, Dari, English, and German terminologies.'
    },
    url: 'https://www.qamosona.com',
    category: 'afghan-resources',
    tags: ['قاموسونه', 'لغتنامه', 'پښتو', 'دري', 'dictionary'],
    badge: {
      ps: 'ملي سرچینه',
      fa: 'منبع ملی',
      en: 'National Resource'
    },
    isFeatured: true,
    isPopular: true,
    pricing: 'free',
    language: 'ps',
    createdAt: '2026-01-10'
  },
  {
    id: 'link-mdn',
    title: {
      ps: 'د موزیلا ویب لارښود (MDN Web Docs)',
      fa: 'راهنمای توسعه وب موزیلا (MDN)',
      en: 'MDN Web Docs'
    },
    description: {
      ps: 'د HTML، CSS او JavaScript د پروګرامینګ ترټولو معتبره نړیواله سرچینه.',
      fa: 'معتبرترین مرجع استاندارد جهانی برای یادگیری و مستندات HTML، CSS و جاوااسکریپت.',
      en: 'The definitive learning resource and reference documentation for web platform standards.'
    },
    url: 'https://developer.mozilla.org',
    category: 'tech-programming',
    tags: ['Web', 'HTML', 'CSS', 'JavaScript', 'Docs'],
    badge: {
      ps: 'معتبر',
      fa: 'استاندارد',
      en: 'Essential'
    },
    isFeatured: false,
    isPopular: true,
    pricing: 'free',
    language: 'en',
    createdAt: '2026-01-12'
  },
  {
    id: 'link-freecodecamp',
    title: {
      ps: 'فري کوډ کمپ (freeCodeCamp)',
      fa: 'فری‌کدکمپ (آموزش رایگان برنامه‌نویسی)',
      en: 'freeCodeCamp'
    },
    description: {
      ps: 'په سلګونو ساعتونه د کوډینګ عملي او تصدیق شوي وړیا کورسونه له نړیوالو اسنادو سره.',
      fa: 'دوره‌های کاملاً رایگان و تعاملی برنامه‌نویسی و دریافت گواهینامه‌های معتبر بین‌المللی.',
      en: 'Learn to code with interactive hands-on coding challenges and verified certifications completely free.'
    },
    url: 'https://www.freecodecamp.org',
    category: 'free-courses',
    tags: ['کورسونه', 'زده‌کړه', 'پروګرامینګ', 'free', 'coding'],
    badge: {
      ps: '۱۰۰٪ وړیا',
      fa: '۱۰۰٪ رایگان',
      en: '100% Free'
    },
    isFeatured: true,
    isPopular: true,
    pricing: 'free',
    language: 'all',
    createdAt: '2026-01-15'
  },
  {
    id: 'link-figma',
    title: {
      ps: 'فیګما ډیزاین (Figma)',
      fa: 'نرم‌افزار آنلاین فیگما (Figma)',
      en: 'Figma Collaborative UI/UX'
    },
    description: {
      ps: 'د ویب او موبایل اپلیکیشنونو د UI او UX ډیزاین ترټولو مخکښ کلاوډ اوزار.',
      fa: 'ابزار طراحی رابط کاربری (UI) و تجربه کاربری (UX) مبتنی بر وب برای تیم‌ها و طراحان.',
      en: 'The leading collaborative interface design tool for modern product teams and creators.'
    },
    url: 'https://www.figma.com',
    category: 'design-photo',
    tags: ['UI', 'UX', 'Design', 'ډیزاین', 'ګرافیک'],
    badge: {
      ps: 'د ډیزاین لومړی انتخاب',
      fa: 'انتخاب اول طراحان',
      en: 'Industry Standard'
    },
    isFeatured: false,
    isPopular: true,
    pricing: 'freemium',
    language: 'en',
    createdAt: '2026-01-18'
  },
  {
    id: 'link-huggingface',
    title: {
      ps: 'هاګینګ فېس (Hugging Face)',
      fa: 'پلتفرم هاگینگ فیس (Hugging Face)',
      en: 'Hugging Face Open Source AI'
    },
    description: {
      ps: 'د نړۍ د پرانیستې سرچینې (Open Source) مصنوعي ځیرکتیا ماډلونو او ډیټاسیټونو لوی کور.',
      fa: 'بزرگترین کتابخانه مدل‌های متن‌باز هوش مصنوعی، دیتاست‌ها و فضای تست رایگان.',
      en: 'The platform where the machine learning community collaborates on open models, datasets, and apps.'
    },
    url: 'https://huggingface.co',
    category: 'ai-tools',
    tags: ['AI', 'OpenSource', 'Models', 'Data'],
    badge: {
      ps: 'اوپن سورس',
      fa: 'متن‌باز',
      en: 'Open Source'
    },
    isFeatured: false,
    isPopular: true,
    pricing: 'free',
    language: 'en',
    createdAt: '2026-01-20'
  },
  {
    id: 'link-khanacademy',
    title: {
      ps: 'خان اکاډمي (Khan Academy)',
      fa: 'خان آکادمی (آموزش رایگان جهانی)',
      en: 'Khan Academy'
    },
    description: {
      ps: 'د ریاضیاتو، فزیک، ساینس او کمپیوتري زده کړو لپاره د نړۍ غوره وړیا ویډیوګانې او تمرینونه.',
      fa: 'آموزش گام‌به‌گام و استاندارد ریاضیات، ساینس و علوم کامپیوتر برای تمام سنین.',
      en: 'Free, world-class education for anyone, anywhere across math, science, and computing.'
    },
    url: 'https://www.khanacademy.org',
    category: 'education-scientific',
    tags: ['ښوونه', 'ریاضی', 'ساینس', 'آموزش', 'academy'],
    badge: {
      ps: 'نړیواله ښوونه',
      fa: 'آموزش همگانی',
      en: 'Free Education'
    },
    isFeatured: false,
    isPopular: true,
    pricing: 'free',
    language: 'all',
    createdAt: '2026-02-01'
  }
];
