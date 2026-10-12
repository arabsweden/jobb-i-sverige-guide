import { JobPosting, JobCategoryInfo, OfficialSite, GuideArticle, ProfessionalProfile, Application } from '../types';

export const jobCategories: JobCategoryInfo[] = [
  {
    id: 'healthcare',
    titleAr: 'الرعاية الصحية والتمريض',
    titleSv: 'Hälso- och sjukvård',
    titleEn: 'Healthcare & Nursing',
    iconName: 'HeartPulse',
    description: 'وظائف الأطباء، الممرضين، مساعدي التمريض (Undersköterska)، ورعاية كبار السن.',
    commonSkills: ['Undersköterska certificate', 'Svenska C1/B2', 'Patient care', 'Journalföring', 'Legitimation'],
    searchTermsSv: ['Undersköterska', 'Sjuksköterska', 'Läkare', 'Vårdbiträde', 'Äldreomsorg'],
    searchTermsEn: ['Nurse', 'Caregiver', 'Doctor', 'Healthcare Assistant'],
    usefulSites: [
      { name: 'Socialstyrelsen (Legitimation)', url: 'https://legitimation.socialstyrelsen.se/' },
      { name: 'Vårdförbundet', url: 'https://www.vardforbundet.se/' }
    ],
    certificationInfo: 'تتطلب معظم الوظائف الطبية والتمريضية ترخيصاً رسمياً (Legitimation) من Socialstyrelsen ومعادلة الشهادات.'
  },
  {
    id: 'education',
    titleAr: 'التعليم والمدارس',
    titleSv: 'Pedagogiskt arbete & Skola',
    titleEn: 'Education & Schools',
    iconName: 'GraduationCap',
    description: 'وظائف المعلمين، معلمي الروضة (Förskollärare)، المساعدين التعليميين، وتدريس SFI.',
    commonSkills: ['Lärarlegitimation', 'Förskollärarutbildning', 'Svenska i tal och skrift', 'Pedagogik'],
    searchTermsSv: ['Förskollärare', 'Grundskollärare', 'Elevassistent', 'Modersmålslärare', 'SFI-lärare'],
    searchTermsEn: ['Teacher', 'Preschool Teacher', 'Teaching Assistant', 'SFI Teacher'],
    usefulSites: [
      { name: 'Skolverket (Lärarlegitimation)', url: 'https://www.skolverket.se/' },
      { name: 'Lärarförbundet', url: 'https://www.sverigeslarare.se/' }
    ],
    certificationInfo: 'معلمو المدارس والرياض يحتاجون إلى ترخيص (Lärarlegitimation) صادر من Skolverket.'
  },
  {
    id: 'it',
    titleAr: 'تقنية المعلومات والبرمجة',
    titleSv: 'Data & IT',
    titleEn: 'IT & Software Development',
    iconName: 'Code',
    description: 'تطوير البرمجيات، تحليلات البيانات، الدعم الفني، الأمن السيبراني، وإدارة الشبكات.',
    commonSkills: ['TypeScript', 'React', 'Node.js', 'Python', 'English Fluent', 'Cloud DevOps', 'Agile/Scrum'],
    searchTermsSv: ['Systemutvecklare', 'Frontendutvecklare', 'IT-support', 'DevOps', 'Data Analyst'],
    searchTermsEn: ['Software Developer', 'Frontend Developer', 'IT Support Specialist', 'DevOps Engineer'],
    usefulSites: [
      { name: 'Academic Work IT', url: 'https://www.academicwork.se/' },
      { name: 'LinkedIn Jobs Sweden', url: 'https://www.linkedin.com/jobs/' }
    ],
    certificationInfo: 'الكثير من وظائف IT تكتفي باللغة الإنجليزية وتوفر فرصة ممتازة للمقيمين الجدد.'
  },
  {
    id: 'engineering',
    titleAr: 'الهندسة والصناعة',
    titleSv: 'Teknik & Tillverkning',
    titleEn: 'Engineering & Industry',
    iconName: 'Cpu',
    description: 'الهندسة الميكانيكية، الكهربائية، الميكاترونكس، جودة الإنتاج، والتشغيل الصناعي.',
    commonSkills: ['CAD / SolidWorks', 'Quality Control', 'PLC Programming', 'Svenska & Engelsk', 'Project Management'],
    searchTermsSv: ['Maskiningenjör', 'Elektroingenjör', 'Produktionstekniker', 'Kvalitetsingenjör'],
    searchTermsEn: ['Mechanical Engineer', 'Electrical Engineer', 'Production Technician'],
    usefulSites: [
      { name: 'Sveriges Ingenjörer', url: 'https://www.sverigesingenjorer.se/' },
      { name: 'Volvo Group Careers', url: 'https://www.volvogroup.com/en/careers.html' }
    ],
    certificationInfo: 'يمكن معادلة شهادات الهندسة عن طريق UHR (Universitets- och högskolerådet).'
  },
  {
    id: 'cleaning',
    titleAr: 'التنظيف والخدمات',
    titleSv: 'Sanering & Rengöring',
    titleEn: 'Cleaning & Facility Services',
    iconName: 'Sparkles',
    description: 'تنظيف المنازل والمكاتب والمستشفيات والفنادق وصيانة المرافق.',
    commonSkills: ['Lokalvård utbildning', 'PRR certificate', 'Noggrannhet', 'B-körkort', 'Kundbemötande'],
    searchTermsSv: ['Städare', 'Lokalvårdare', 'Fönsterputsare', 'Hemstädare'],
    searchTermsEn: ['Cleaner', 'Housekeeper', 'Facility Service Worker'],
    usefulSites: [
      { name: 'Samhall Careers', url: 'https://samhall.se/' },
      { name: 'Hemfrid Jobs', url: 'https://jobb.hemfrid.se/' }
    ],
    certificationInfo: 'وظيفة ممتازة للبداية في السويد، ورخصة القيادة (B-körkort) تزيد فرص الحصول على العقد.'
  },
  {
    id: 'transport',
    titleAr: 'النقل والقطارات والمترو والحافلات',
    titleSv: 'Transport & Trafik',
    titleEn: 'Transport, Buses & Trains',
    iconName: 'Bus',
    description: 'قيادة الحافلات والمترو والقطارات والتكسي والشاحنات وتوصيل البضائع.',
    commonSkills: ['D-körkort + YKB (Buss)', 'C-körkort + YKB (Lastbil)', 'Taxi leg', 'Lokal kännedom'],
    searchTermsSv: ['Bussförare', 'Lastbilsförare', 'Lokförare', 'Taxiförare', 'Budförare'],
    searchTermsEn: ['Bus Driver', 'Truck Driver', 'Train Driver', 'Delivery Driver'],
    usefulSites: [
      { name: 'Keolis Karriär', url: 'https://www.keolis.se/karriar' },
      { name: 'Nobina Karriär', url: 'https://www.nobina.se/karriar' }
    ],
    certificationInfo: 'تتطلب شهادة YKB (Yrkeskompetensbevis) لسائقي الشاحنات والحافلات، وتوفر البلديات دورات تمويلية.'
  },
  {
    id: 'warehouse',
    titleAr: 'المستودعات واللوجستيات',
    titleSv: 'Lager & Logistik',
    titleEn: 'Warehouse & Logistics',
    iconName: 'Package',
    description: 'التعبئة والتغليف، تشغيل الرافعات الشوكية (Truck)، وإدارة المخزون.',
    commonSkills: ['Truckkort A+B', 'Lagerarbete', 'Orderplock', 'Skiftarbete', 'Svenska eller Engelska'],
    searchTermsSv: ['Lagerarbetare', 'Truckförare', 'Logistikassistent', 'Orderplockare'],
    searchTermsEn: ['Warehouse Worker', 'Forklift Driver', 'Logistics Associate'],
    usefulSites: [
      { name: 'Lernia Bemanning', url: 'https://www.lernia.se/' },
      { name: 'Manpower Lager', url: 'https://www.manpower.se/' }
    ],
    certificationInfo: 'رخصة الرافعة الشوكية (Truckkort TLP 10) ترفع نسبة القبول وتستغرق أياماً قليلة للحصول عليها.'
  },
  {
    id: 'restaurant',
    titleAr: 'المطاعم والفنادق والسياحة',
    titleSv: 'Restaurang & Hotell',
    titleEn: 'Restaurants & Hospitality',
    iconName: 'Utensils',
    description: 'الطهاة، المساعدون بالمطبخ، الويتر، الاستقبال بالفنادق، والخدمات السياحية.',
    commonSkills: ['Livsmedelshygien', 'Kockutbildning', 'Kundservice', 'Servering', 'Flerspråkighet'],
    searchTermsSv: ['Kock', 'Köksbiträde', 'Servitör', 'Hotellreceptionist', 'Barista'],
    searchTermsEn: ['Chef', 'Kitchen Assistant', 'Waiter/Waitress', 'Hotel Receptionist'],
    usefulSites: [
      { name: 'Visita Karriär', url: 'https://visita.se/' },
      { name: 'Scandic Careers', url: 'https://www.scandichotels.com/careers' }
    ],
    certificationInfo: 'مجال مرن جداً للعمل بالساعة أو بالصيف والمواسم.'
  },
  {
    id: 'construction',
    titleAr: 'البناء والحرف المهنية',
    titleSv: 'Bygg & Anläggning',
    titleEn: 'Construction & Trades',
    iconName: 'HardHat',
    description: 'النجارة، الدهان، السباكة، الكهرباء، أعمال البناء، وتشغيل الآلات.',
    commonSkills: ['ID06-kort', 'Heta arbeten', 'Byggutbildning', 'Säkerhetsmedvetande', 'B-körkort'],
    searchTermsSv: ['Snickare', 'Målare', 'Elektriker', 'VVS-montör', 'Anläggningsarbetare'],
    searchTermsEn: ['Carpenter', 'Painter', 'Electrician', 'Plumber', 'Construction Worker'],
    usefulSites: [
      { name: 'Byggnads', url: 'https://www.byggnads.se/' },
      { name: 'Peab Karriär', url: 'https://peab.se/karriar/' }
    ],
    certificationInfo: 'يتطلب بطاقة ID06 ودورة Heta Arbeten للعمل في مواقع البناء بشكل آمن ومطابق للقانون.'
  },
  {
    id: 'admin',
    titleAr: 'الإدارة والاقتصاد والسكرتارية',
    titleSv: 'Administration & Ekonomi',
    titleEn: 'Administration & Finance',
    iconName: 'Briefcase',
    description: 'المحاسبة، الإدارة المكتبية، خدمة الزبائن، الموارد البشرية (HR)، وإدخال البيانات.',
    commonSkills: ['Ekonomiutbildning', 'Fortnox / Visma', 'Excel Avancerad', 'Svenska flytande', 'HR administration'],
    searchTermsSv: ['Ekonomiassistent', 'Administratör', 'Redovisningsekonom', 'HR-assistent'],
    searchTermsEn: ['Administrative Assistant', 'Accountant', 'Payroll Specialist', 'HR Coordinator'],
    usefulSites: [
      { name: 'Poolia Bemanning', url: 'https://www.poolia.se/' },
      { name: 'Randstad Sweden', url: 'https://www.randstad.se/' }
    ],
    certificationInfo: 'إتقان برامج المحاسبة السويدية مثل Fortnox وVisma يعتبر ميزة تنافسية كبيرة.'
  },
  {
    id: 'sales',
    titleAr: 'المبيعات والتسويق وخدمة العملاء',
    titleSv: 'Försäljning & Kundservice',
    titleEn: 'Sales, Marketing & Support',
    iconName: 'ShoppingBag',
    description: 'خدمة العملاء الهاتفية، المبيعات في المتاجر، التسويق الرقمي، وإدارة الحسابات.',
    commonSkills: ['Kundservice mindset', 'B2B/B2C Sales', 'Svenska & Engelska', 'CRM Systems', 'Social Media'],
    searchTermsSv: ['Kundtjänstmedarbetare', 'Säljare', 'Butiksbiträde', 'Digital Marknadsförare'],
    searchTermsEn: ['Customer Service Representative', 'Sales Associate', 'Store Assistant', 'Digital Marketer'],
    usefulSites: [
      { name: 'Releasy Careers', url: 'https://www.releasy.se/' },
      { name: 'Teleperformance Sweden', url: 'https://www.teleperformance.com/' }
    ],
    certificationInfo: 'توجد وظائف متعددة اللغات تقدم خدمة العملاء للشركات العالمية من السويد.'
  },
  {
    id: 'public_sector',
    titleAr: 'القطاع العام والبلديات',
    titleSv: 'Offentlig sektor & Kommun',
    titleEn: 'Public Sector & Municipalities',
    iconName: 'Building2',
    description: 'وظائف البلديات (Kommuner)، المقاطعات (Regioner)، والجهات الحكومية (Myndigheter).',
    commonSkills: ['Offentlig förvaltning', 'Kommunal erfarenhet', 'Förvaltningslag', 'Svenska utmärkt'],
    searchTermsSv: ['Handläggare', 'Socialsekreterare', 'Kommunvägledare', 'Projektledare kommun'],
    searchTermsEn: ['Case Worker', 'Social Worker', 'Municipal Administrator'],
    usefulSites: [
      { name: 'Offentliga Jobb', url: 'https://www.offentligajobb.se/' },
      { name: 'SKR Karriär', url: 'https://skr.se/' }
    ],
    certificationInfo: 'موقع Offentliga Jobb يحتوي على آلاف الوظائف الحكومية والبلدية في كافة أنحاء السويد.'
  },
  {
    id: 'seasonal',
    titleAr: 'الوظائف الموسمية والصيفية',
    titleSv: 'Säsongsjobb & Sommarjobb',
    titleEn: 'Seasonal & Summer Jobs',
    iconName: 'Sun',
    description: 'فرص العمل في الصيف، مواسم الأعياد، الحدائق، المنتزهات، وحصاد الفواكه.',
    commonSkills: ['Flexibilitet', 'Engagemang', 'Teamwork', 'Ingen tidigare erfarenhet krävs'],
    searchTermsSv: ['Sommarjobb', 'Säsongsarbete', 'Parkarbetare', 'Gårdshjälp'],
    searchTermsEn: ['Summer Job', 'Seasonal Worker', 'Park Worker'],
    usefulSites: [
      { name: 'Platsbanken Sommarjobb', url: 'https://arbetsformedlingen.se/platsbanken/sommarjobb' }
    ],
    certificationInfo: 'تبدأ البلديات والشركات بطرح وظائف الصيف عادة بين شهري يناير ومارس من كل عام.'
  },
  {
    id: 'trainee',
    titleAr: 'التدريب وTrainee وInternship',
    titleSv: 'Praktik & Trainee',
    titleEn: 'Internship, Trainee & Practice',
    iconName: 'Award',
    description: 'برامج التدريب للطلاب والخريجين الجدد، وبطاقات التدريب عبر Arbetsförmedlingen.',
    commonSkills: ['Akademisk examen', 'Inlärningsförmåga', 'Driv', 'Goda studieresultat'],
    searchTermsSv: ['Trainee', 'Praktikant', 'Examensarbete', 'Arbetsträning'],
    searchTermsEn: ['Trainee Program', 'Internship', 'Thesis Work'],
    usefulSites: [
      { name: 'Traineeguiden', url: 'https://www.traineeguiden.se/' }
    ],
    certificationInfo: 'يمكن طلب فترة تدريب عملي (Praktik) من خلال Arbetsförmedlingen لدخول سوق العمل.'
  },
  {
    id: 'english_remote',
    titleAr: 'العمل عن بُعد والوظائف الناطقة بالإنجليزية',
    titleSv: 'Engelska jobb & Distansarbete',
    titleEn: 'Remote & English Speaking Jobs',
    iconName: 'Globe',
    description: 'الوظائف التي لا تتطلب اللغة السويدية كشرط أساسي أو تسمح بالعمل من المنزل.',
    commonSkills: ['English C1/C2', 'Remote Work Autonomy', 'Slack/Zoom/Jira', 'Self-motivation'],
    searchTermsSv: ['Engelsktalande', 'Distansarbete', 'Remote Sweden', 'English required'],
    searchTermsEn: ['English speaking', 'Remote work Sweden', 'English only'],
    usefulSites: [
      { name: 'LinkedIn English Jobs Sweden', url: 'https://www.linkedin.com/jobs/' },
      { name: 'RemoteOK', url: 'https://remoteok.com/' }
    ],
    certificationInfo: 'يناسب جداً القادمين الجدد المتحدثين بالإنجليزية في مجالات التقنية، التسويق، والخدمات العالمية.'
  },
  {
    id: 'freelance',
    titleAr: 'العمل الحر وتأسيس مشروع',
    titleSv: 'Egen företagare & Frilans',
    titleEn: 'Freelance & Business Startup',
    iconName: 'Rocket',
    description: 'تأسيس شركة F-skatt، العمل الحر، ودعم تأسيس المشاريع الصغيرة (Starta eget).',
    commonSkills: ['F-skatt sedel', 'Momsregistrering', 'Affärsplan', 'Marknadsföring', 'Skatteverket kunskap'],
    searchTermsSv: ['Frilansare', 'Konsult', 'Starta eget', 'Enskild firma'],
    searchTermsEn: ['Freelancer', 'Consultant', 'Self-employed', 'Sole Trader'],
    usefulSites: [
      { name: 'Verksamt.se (Official Startup)', url: 'https://www.verksamt.se/' },
      { name: 'Skatteverket Starta Eget', url: 'https://www.skatteverket.se/' }
    ],
    certificationInfo: 'منصة Verksamt.se هي البوابة الحكومية الموحدة لتأسيس الشركات وتسجيل F-skatt في السويد.'
  }
];

export const demoJobPostings: JobPosting[] = [
  {
    id: 'demo-job-1',
    externalId: 'af-demo-101',
    sourceId: 'platsbanken',
    sourceName: 'Arbetsförmedlingen / Platsbanken',
    title: 'Lokalvårdare / städare till kontor i Stockholm',
    company: 'Nordic Clean AB (مثال تجريبي)',
    location: 'Stockholm',
    municipality: 'Stockholms stad',
    region: 'Stockholms län',
    description: 'Vi söker en noggrann och ansvarsfull lokalvårdare för städning av kontorslokaler i centrala Stockholm. Arbetsuppgifterna inkluderar dammsugning, golvvård, avtorkning av ytor samt påfyllning av förbrukningsmaterial.\n\nKrav:\n- Erfarenhet av kontorsstädning är meriterande.\n- Grundläggande kunskaper i svenska eller engelska.\n- B-körkort är ett plus men inget krav.\n\nVi erbjuder kollektivavtal och bra arbetsmiljö.',
    employmentType: 'permanent',
    workMode: 'onsite',
    salaryMin: 24000,
    salaryMax: 27500,
    salaryText: '24 000 - 27 500 SEK / شهرياً',
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 20).toISOString(),
    sourceUrl: 'https://arbetsformedlingen.se/platsbanken/annonser/demo-101',
    fetchedAt: new Date().toISOString(),
    status: 'active',
    isDemo: true,
    skills: ['Städning', 'Lokalvård', 'Kontorsstädning', 'Svenska', 'Engelska'],
    category: 'cleaning'
  },
  {
    id: 'demo-job-2',
    externalId: 'af-demo-102',
    sourceId: 'platsbanken',
    sourceName: 'Arbetsförmedlingen / Platsbanken',
    title: 'Lagerarbetare med truckkort A+B till Solna',
    company: 'Sverige Logistik AB (مثال تجريبي)',
    location: 'Solna',
    municipality: 'Solna stad',
    region: 'Stockholms län',
    description: 'Vi söker lagermedarbetare för orderplock, godshantering och truckkörning på vårt moderna centrallager i Solna.\n\nSkallkrav:\n- Giltigt truckkort A1-A4, B1-B3.\n- Förmåga att arbeta skift (morgon/kväll).\n- God fysik och punktlighet.\n- Svenska i tal och skrift (lägsta nivå B1).\n\nMeriterande:\n- Erfarenhet av handterminaler/WMS systems.',
    employmentType: 'fulltime',
    workMode: 'onsite',
    salaryMin: 28000,
    salaryMax: 32000,
    salaryText: '28 000 - 32 000 SEK / شهرياً',
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
    sourceUrl: 'https://arbetsformedlingen.se/platsbanken/annonser/demo-102',
    fetchedAt: new Date().toISOString(),
    status: 'active',
    isDemo: true,
    skills: ['Truckkort B', 'Lagerarbete', 'Orderplock', 'Svenska B1', 'Skiftarbete'],
    category: 'warehouse'
  },
  {
    id: 'demo-job-3',
    externalId: 'af-demo-103',
    sourceId: 'offentligajobb',
    sourceName: 'Kommunal Sektor / Offentliga Jobb',
    title: 'Elevassistent / Studiehandledare till grundskola',
    company: 'Göteborgs Stad (مثال تجريبي)',
    location: 'Göteborg',
    municipality: 'Göteborgs stad',
    region: 'Västra Götalands län',
    description: 'Göteborgs stad söker en engagerad elevassistent som kan stödja elever i behov av särskilt stöd samt ge studiehandledning på arabiska och svenska.\n\nKrav:\n- Avslutad gymnasieutbildning, gärna barn- och fritidsprogrammet.\n- Flytande svenska och arabiska.\n- Erfarenhet av pedagogiskt arbete med barn.\n- Utdrag ur belastningsregistret krävs före anställning.',
    employmentType: 'temporary',
    workMode: 'onsite',
    salaryMin: 26000,
    salaryMax: 29500,
    salaryText: '26 000 - 29 500 SEK / شهرياً',
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
    sourceUrl: 'https://arbetsformedlingen.se/platsbanken/annonser/demo-103',
    fetchedAt: new Date().toISOString(),
    status: 'active',
    isDemo: true,
    skills: ['Elevassistent', 'Arabiska flytande', 'Svenska flytande', 'Pedagogik', 'Belastningsregister'],
    category: 'education'
  },
  {
    id: 'demo-job-4',
    externalId: 'af-demo-104',
    sourceId: 'eures',
    sourceName: 'EURES / International Career',
    title: 'Customer Support Representative (English & Swedish)',
    company: 'Global Contact Solutions Sweden (مثال تجريبي)',
    location: 'Malmö / Hybrid',
    municipality: 'Malmö stad',
    region: 'Skåne län',
    description: 'Join our international support team in Malmö! You will handle incoming customer queries via phone, chat, and email for Scandinavian and global clients.\n\nRequirements:\n- Fluent English (written and spoken).\n- Intermediate to fluent Swedish (B2/C1).\n- Excellent communication and problem-solving skills.\n- Comfort using ticketing systems (Zendesk/Freshdesk).',
    employmentType: 'fulltime',
    workMode: 'hybrid',
    salaryMin: 30000,
    salaryMax: 35000,
    salaryText: '30 000 - 35 000 SEK / شهرياً',
    publishedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 25).toISOString(),
    sourceUrl: 'https://eures.europa.eu/job-demo-104',
    fetchedAt: new Date().toISOString(),
    status: 'active',
    isDemo: true,
    skills: ['Customer Support', 'English C1', 'Swedish B2', 'Ticketing', 'Zendesk'],
    category: 'sales'
  },
  {
    id: 'demo-job-5',
    externalId: 'af-demo-105',
    sourceId: 'platsbanken',
    sourceName: 'Arbetsförmedlingen / Platsbanken',
    title: 'Bussförare med D-körkort och YKB till SL-trafiken',
    company: 'Keolis Sverige AB (مثال تجريبي)',
    location: 'Uppsala',
    municipality: 'Uppsala kommun',
    region: 'Uppsala län',
    description: 'Vi söker trygga och serviceinriktade bussförare för linjetrafik i Uppsala län.\n\nKrav:\n- D-körkort för buss.\n- Giltigt YKB (Yrkeskompetensbevis).\n- Goda kunskaper i svenska (lägst nivå B1).\n- Servicekänsla och punktlighet.',
    employmentType: 'fulltime',
    workMode: 'onsite',
    salaryMin: 31000,
    salaryMax: 36000,
    salaryText: '31 000 - 36 000 SEK / شهرياً',
    publishedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
    sourceUrl: 'https://arbetsformedlingen.se/platsbanken/annonser/demo-105',
    fetchedAt: new Date().toISOString(),
    status: 'active',
    isDemo: true,
    skills: ['D-körkort', 'YKB', 'Svenska B1', 'Kundservice', 'Bussförarutbildning'],
    category: 'transport'
  },
  {
    id: 'demo-job-6',
    externalId: 'af-demo-106',
    sourceId: 'platsbanken',
    sourceName: 'Arbetsförmedlingen / Platsbanken',
    title: 'Frontend Web Developer (React / TypeScript)',
    company: 'TechNordic Solutions AB (مثال تجريبي)',
    location: 'Stockholm / Remote',
    municipality: 'Stockholms stad',
    region: 'Stockholms län',
    description: 'We are looking for a skilled Frontend Engineer to build web applications using React, TypeScript, and Tailwind CSS. Modern tech stack, remote-friendly culture, and collaborative team.\n\nRequirements:\n- 2+ years of experience with React and TypeScript.\n- Experience with REST APIs and state management.\n- Fluent English skills.\n- Swedish is a merit but not required.',
    employmentType: 'fulltime',
    workMode: 'remote',
    salaryMin: 45000,
    salaryMax: 55000,
    salaryText: '45 000 - 55 000 SEK / شهرياً',
    publishedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 14).toISOString(),
    sourceUrl: 'https://arbetsformedlingen.se/platsbanken/annonser/demo-106',
    fetchedAt: new Date().toISOString(),
    status: 'active',
    isDemo: true,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'English', 'REST API'],
    category: 'it'
  },
  {
    id: 'demo-job-7',
    externalId: 'af-demo-107',
    sourceId: 'platsbanken',
    sourceName: 'Arbetsförmedlingen / Platsbanken',
    title: 'Undersköterska / Vårdbiträde till äldreboende',
    company: 'Attendo Vård (مثال تجريبي)',
    location: 'Västerås',
    municipality: 'Västerås stad',
    region: 'Västmanlands län',
    description: 'Attendo söker engagerade undersköterskor eller erfarna vårdbiträden för dag- och kvällstjänstgöring på äldreboende i Västerås.\n\nSkallkrav:\n- Utbildad undersköterska eller motsvarande reell kompetens.\n- Svenska i tal och skrift (nivå B2).\n- Förmåga att samarbeta och bemöta de äldre med respekt och empati.',
    employmentType: 'permanent',
    workMode: 'onsite',
    salaryMin: 27000,
    salaryMax: 31000,
    salaryText: '27 000 - 31 000 SEK / شهرياً',
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 18).toISOString(),
    sourceUrl: 'https://arbetsformedlingen.se/platsbanken/annonser/demo-107',
    fetchedAt: new Date().toISOString(),
    status: 'active',
    isDemo: true,
    skills: ['Undersköterska', 'Äldreomsorg', 'Svenska B2', 'Omvårdnad', 'Journalföring'],
    category: 'healthcare'
  },
  {
    id: 'demo-job-8',
    externalId: 'af-demo-108',
    sourceId: 'platsbanken',
    sourceName: 'Arbetsförmedlingen / Platsbanken',
    title: 'Kock / Köksbiträde till restaurang i Örebro',
    company: 'Smak av Norden Restaurang (مثال تجريبي)',
    location: 'Örebro',
    municipality: 'Örebro kommun',
    region: 'Örebro län',
    description: 'Vi söker en passionerad kock eller erfaret köksbiträde som vill arbeta med lunch- och middagsservering.\n\nKrav:\n- Erfarenhet av arbete i restaurangkök.\n- Kunskap om livsmedelshygien (HACCP).\n- God samarbetsförmåga.',
    employmentType: 'fulltime',
    workMode: 'onsite',
    salaryMin: 27500,
    salaryMax: 33000,
    salaryText: '27 500 - 33 000 SEK / شهرياً',
    publishedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 12).toISOString(),
    sourceUrl: 'https://arbetsformedlingen.se/platsbanken/annonser/demo-108',
    fetchedAt: new Date().toISOString(),
    status: 'active',
    isDemo: true,
    skills: ['Kock', 'Köksbiträde', 'HACCP', 'Matlagning', 'Restaurang'],
    category: 'restaurant'
  }
];

export const officialSitesList: OfficialSite[] = [
  {
    id: 'arbetsformedlingen',
    name: 'Arbetsförmedlingen',
    url: 'https://arbetsformedlingen.se/',
    type: 'official',
    category: 'الحكومة والخدمات المباشرة',
    description: 'المكتب الحكومي الرسمي للتوظيف في السويد. يوفر نصائح، تسجيلاً، وبرامج دعم متعددة.',
    languages: ['sv', 'ar', 'en'],
    hasDirectApi: true,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'platsbanken',
    name: 'Platsbanken',
    url: 'https://arbetsformedlingen.se/platsbanken',
    type: 'official',
    category: 'البحث عن الوظائف',
    description: 'أكبر محرك بحث وظائف رسمي في السويد تابع لـ Arbetsförmedlingen.',
    languages: ['sv', 'en'],
    hasDirectApi: true,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'open_data_af',
    name: 'بيانات الوظائف المفتوحة (JobAd Links API)',
    url: 'https://data.arbetsformedlingen.se/',
    type: 'official',
    category: 'تكامل البرمجيات والبيانات',
    description: 'خدمة البيانات الرسمية المفتوحة من Arbetsförmedlingen للوصول إلى الوظائف مباشرة عبر API.',
    languages: ['sv', 'en'],
    hasDirectApi: true,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'eures',
    name: 'EURES Sweden',
    url: 'https://eures.europa.eu/',
    type: 'official',
    category: 'التنقل الأوروبي والوظائف الدوليّة',
    description: 'البوابة الأوروبية للتنقل المهني، توفر وظائف في السويد والدول الأوروبية باللغات المختلفة.',
    languages: ['en', 'sv'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'europass',
    name: 'Europass Europe',
    url: 'https://europass.europa.eu/',
    type: 'official',
    category: 'السيرة الذاتية الأوروبية ومعادلة المؤهلات',
    description: 'أداة الاتحاد الأوروبي لإنشاء السيرة الذاتية الموحدة وتوثيق المهارات.',
    languages: ['en', 'sv', 'ar'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'sweden_se',
    name: 'Sweden.se (Work in Sweden)',
    url: 'https://sweden.se/work-business',
    type: 'official',
    category: 'معلومات عامة وثقافة العمل',
    description: 'الموقع الرسمي لجمهورية السويد بالشراكة مع المعهد السويدي لشرح سوق العمل والثقافة والضرائب.',
    languages: ['en', 'sv'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'uhr',
    name: 'UHR (Universitets- och högskolerådet)',
    url: 'https://www.uhr.se/',
    type: 'education_rights',
    category: 'معادلة الشهادات الجامعية والدراسات العليا',
    description: 'الجهة الحكومية السويدية المعتمدة لمعادلة وتقييم الشهادات الجامعية الأجنبية.',
    languages: ['sv', 'en'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'skolverket',
    name: 'Skolverket',
    url: 'https://www.skolverket.se/',
    type: 'education_rights',
    category: 'معادلة شهادات التعليم والمدرسين',
    description: 'إدارة المدارس السويدية، المسؤولة عن ترخيص المعلمين ومعادلة شهادات الثانوبة والرياض.',
    languages: ['sv', 'en'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'myh',
    name: 'Myndigheten för yrkeshögskolan (MYH)',
    url: 'https://www.myh.se/',
    type: 'education_rights',
    category: 'التعليم المهني العالي (Yrkeshögskola)',
    description: 'إدارة التعليم المهني السويدي العالي YH التي تقدم دورات قصيرة ومباشرة لسوق العمل.',
    languages: ['sv'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'migrationsverket',
    name: 'Migrationsverket',
    url: 'https://www.migrationsverket.se/',
    type: 'education_rights',
    category: 'تصاريح العمل والإقامة',
    description: 'دائرة الهجرة السويدية الرسمية للتحقق من شروط وأحكام تصاريح العمل (Arbetstillstånd).',
    languages: ['sv', 'en'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'skatteverket',
    name: 'Skatteverket',
    url: 'https://www.skatteverket.se/',
    type: 'official',
    category: 'الضرائب والرقم الشخصي والتسجيل',
    description: 'مصلحة الضرائب السويدية لتسجيل النفوس (Folkbokföring) والرقم الشخصي وبطاقات الهوية.',
    languages: ['sv', 'en'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'forsakringskassan',
    name: 'Försäkringskassan',
    url: 'https://www.forsakringskassan.se/',
    type: 'official',
    category: 'التأمينات الاجتماعية والدعم',
    description: 'صندوق التأمينات الاجتماعية السويدي لإعانات الوالدين والمرض والتعويضات.',
    languages: ['sv', 'en'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Jobs Sweden',
    url: 'https://www.linkedin.com/jobs/search/?location=Sweden',
    type: 'general_search',
    category: 'محرك بحث مهني عالمي',
    description: 'المنصة العالمية الأولى للوظائف الأكاديمية والتقنية والشركات متعددة الجنسيات في السويد.',
    languages: ['en', 'sv'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'indeed',
    name: 'Indeed Sweden',
    url: 'https://se.indeed.com/',
    type: 'general_search',
    category: 'محرك بحث وظائف عام',
    description: 'محرك بحث شامل يجمع آلاف الإعلانات من مواقع الشركات والمجلات السويدية.',
    languages: ['sv', 'en'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'jobbsafari',
    name: 'JobbSafari',
    url: 'https://www.jobbsafari.se/',
    type: 'general_search',
    category: 'محرك بحث وظائف في السويد',
    description: 'أحد أقدم وأشهر مواقع البحث السويدية الخاصة.',
    languages: ['sv'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'academic_work',
    name: 'Academic Work',
    url: 'https://www.academicwork.se/',
    type: 'recruitment_agency',
    category: 'شركات التوظيف والطلاب والشباب المهنيين',
    description: 'شركة توظيف رائدة متخصصة في توظيف الطلاب والخريجين الجدد وأصحاب الخبرات.',
    languages: ['sv', 'en'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'manpower',
    name: 'Manpower Sweden',
    url: 'https://www.manpower.se/',
    type: 'recruitment_agency',
    category: 'شركة توظيف وتأجير عمالة',
    description: 'إحدى أكبر شركات Bemanningsföretag في السويد لمختلف القطاعات.',
    languages: ['sv', 'en'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'randstad',
    name: 'Randstad Sweden',
    url: 'https://www.randstad.se/',
    type: 'recruitment_agency',
    category: 'شركة توظيف عالمية',
    description: 'تقدم عقود إعارة وتوظيف مباشر في مجالات الإدارة، التقنية، واللوجستيات.',
    languages: ['sv', 'en'],
    hasDirectApi: false,
    lastReviewedAt: '2026-07-01'
  }
];

export const guideArticles: GuideArticle[] = [
  {
    id: 'platsbanken-guide',
    title: 'كيف تستخدم بنك الوظائف Platsbanken بفعالية؟',
    category: 'طرق البحث',
    summary: 'خطوات استخدام الفلاتر، إنشاء التنبيهات، والتقديم المباشر عبر البوابة الحكومية الرسمية.',
    steps: [
      'سجل دخولك عبر BankID إذا كان لديك رقم شخصي أو أنشئ حسابه كزائر.',
      'استخدم الكلمات المفتاحية باللغة السويدية المحددة لمهنتك (مثل Undersköterska أو Systemutvecklare).',
      'حدد نطاق البحث حسب البلدية (Kommun) أو المحافظة (Län).',
      'فعل خيار "Sommarjobb" أو "Distansarbete" حسب نوع العمل المرغوب.',
      'افحص طريقة التقديم المحددة في الإعلان (بريد إلكتروني، رابط خارجي، أو عبر البوابة).'
    ],
    commonMistakes: [
      'البحث باللغة العربية فقط في شريط البحث.',
      'إرسال سيرة ذاتية عامة دون تخصيصها لمسائل الإعلان.',
      'تجاهل آخر موعد للتقديم (Sista ansökningsdag).'
    ],
    officialLinks: [
      { label: 'زيارة Platsbanken', url: 'https://arbetsformedlingen.se/platsbanken' }
    ],
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'cv-swedish-style',
    title: 'كيف تكتب سيرة ذاتية متوافقة مع السوق السويدي ونظام ATS؟',
    category: 'السيرة الذاتية',
    summary: 'معايير السيرة الذاتية السويدية الناجحة: البساطة، الترتيب الزمني العكسي، والصدق التام.',
    steps: [
      'اجعل السيرة الذاتية بين صفحة إلى صفحتين كحد أقصى.',
      'اكتب ملخصاً مهنياً قصيراً في البداية (Profil / Sammanfattning).',
      'رتب الخبرات العملية من الأحدث إلى الأقدم مع ذكر الشهر والسنة.',
      'استخدم خطوطاً واضحة وتجنب الأشرطة البيانية الرسومية للتقييم.',
      'أضف قسم اللغات ورخص القيادة بشكل واضح.'
    ],
    commonMistakes: [
      'إضافة معلومات حساسة غير مطلوبة مثل الحالة العائلية أو الديانة.',
      'اختلاق مهارات أو خبرات غير حقيقية.',
      'استخدام تصميم معقد يحتوي جداول متشابكة تمنع ماسح ATS من قراءة النص.'
    ],
    officialLinks: [
      { label: 'دليل CV في Arbetsförmedlingen', url: 'https://arbetsformedlingen.se/for-arbetssokande/cv-och-personligt-brev' }
    ],
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'personligt-brev-guide',
    title: 'كيف تكتب خطاب تقديم Personligt Brev احترافي؟',
    category: 'خطاب التقديم',
    summary: 'الخطاب هو فرصتك ليشرح كيف تتطابق خبرتك مع متطلبات الوظيفة ولماذا اخترت هذه الشركة.',
    steps: [
      'حافظ على حجم صفحة A4 واحدة كحد أقصى.',
      'ابدأ بفقرة افتتاحية تحدد الوظيفة المطلوبة وحماسك لها.',
      'اشرح نقطتين أو ثلاث نقاط من الإعلان وتجاربك الحقيقية المطابقة.',
      'وضح القيمة التي ستضيفها للفريق.',
      'اختم بأسلوب إيجابي مع الدعوة للمقابلة الشخصية.'
    ],
    commonMistakes: [
      'نسخ وتكرار السيرة الذاتية حرفياً.',
      'إرسال خطاب موحد وعام لجميع الشركات دون تغيير اسم الوظيفة أو الشركة.',
      'الإطالة الزائدة عن صفحة واحدة.'
    ],
    officialLinks: [
      { label: 'نصائح Personligt Brev الرسمية', url: 'https://arbetsformedlingen.se/for-arbetssokande/cv-och-personligt-brev' }
    ],
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'uhr-degree-recognition',
    title: 'معادلة الشهادات والخبرات الأجنبية عبر UHR وSkolverket',
    category: 'الشهادات والمعادلة',
    summary: 'خطوات تقديم الطلب الحكومي لمعادلة شهادات الثانوية والبكالوريوس والماجستير.',
    steps: [
      'أنشئ حساباً في موقع UHR (Universitets- och högskolerådet).',
      'ارفض المستندات المطلوبة (الشهادة الكرتونية، كشف الدرجات المترجم للإنجليزية أو السويدية).',
      'إذا كانت مهنتك محددة بترخيص (مثل الطب أو التمريض أو المدارس)، توجه إلى Socialstyrelsen أو Skolverket.',
      'انتظر قرار التقييم الرسمي واستخدمه عند التقديم للشركات.'
    ],
    commonMistakes: [
      'تقديم ترجمات غير معتمدة من مترجم محلف.',
      'الاعتقاد بأن معادلة الشهادة تضمن الحصول المباشر على الوظيفة دون إتقان اللغة السويدية.'
    ],
    officialLinks: [
      { label: 'بوابة UHR لمعادلة الشهادات', url: 'https://www.uhr.se/bedomning-av-utlandsk-utbildning/' }
    ],
    lastReviewedAt: '2026-07-01'
  },
  {
    id: 'interview-star-guide',
    title: 'الاستعداد للمقابلة السويدية باستخدام نموذج STAR',
    category: 'المقابلات',
    summary: 'كيف تجيب على الأسئلة السلوكية باحترافية وتبرز مواقفك الحقيقية.',
    steps: [
      'Situation (الموقف): حدد سياق المشكلة أو المشروع باختصار.',
      'Task (المهمة): اشرح ما كان مطلوباً منك تنفيذه.',
      'Action (الإجراء): ركز على الدور الشخصي الذي قمت به بدقة.',
      'Result (النتيجة): اعرض النتيجة الرقمية أو العملية التي تحققت.'
    ],
    commonMistakes: [
      'الحديث بصيغة الفريق دائماً (نحن) دون توضيح دورك أنت (أنا).',
      'عدم تحضير أمثلة واقعية قبل المقابلة.',
      'التحدث بشكل سلبي عن أصحاب العمل السابقين.'
    ],
    officialLinks: [
      { label: 'دليل المقابلات من Arbetsförmedlingen', url: 'https://arbetsformedlingen.se/for-arbetssokande/forbered-dig-for-intervju' }
    ],
    lastReviewedAt: '2026-07-01'
  }
];

export const initialSampleProfile: ProfessionalProfile = {
  id: 'demo-user-profile',
  targetRoles: ['مطور ويب Frontend', 'مساعد مستودع', 'خدمة عملاء'],
  preferredLocations: ['Stockholm', 'Solna', 'Uppsala'],
  locations: ['Stockholm', 'Solna', 'Uppsala'],
  employmentTypes: ['fulltime', 'permanent'],
  workModes: ['hybrid', 'onsite'],
  languages: [
    { language: 'العربية', level: 'native' },
    { language: 'السويدية', level: 'intermediate' },
    { language: 'الإنجليزية', level: 'fluent' }
  ],
  yearsOfExperience: 3,
  experiences: [
    {
      id: 'exp-1',
      company: 'شركة حلول التقنية (دبي)',
      title: 'Frontend Developer',
      location: 'Dubai',
      startDate: '2022-01',
      endDate: '2024-05',
      isCurrent: false,
      description: 'تطوير واجهات المستخدم باستخدام React وTypeScript مع تحسين سرعة الأداء.',
      achievements: ['رفع سرعة تحميل الموقع بنسبة 30%', 'بناء 15 مكوناً معاد استخدامه']
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'جامعة دمشق',
      degree: 'بكالوريوس هندسة البرمجيات',
      fieldOfStudy: 'Software Engineering',
      year: '2021',
      description: 'معادلة مبدئية متوافقة مع UHR'
    }
  ],
  certificates: ['React Developer Certification', 'SFI Kurs D Complete'],
  driversLicense: ['B-körkort (سويسرية/أوروبية)'],
  technicalSkills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Git', 'Tailwind CSS'],
  softSkills: ['التواصل الفعال', 'العمل الجماعي', 'حل المشكلات', 'الالتزام بالمواعيد'],
  remotePreference: true,
  workAuthorizationStatus: 'مقيم دائم / تصريح عمل نافذ',
  contactName: 'أحمد محمود',
  contactEmail: 'ahmed.demo@example.com',
  contactPhone: '+46 70 123 4567',
  summary: 'مطور برمجيات ذو خبرة 3 سنوات في تطبيقات الويب، يتحدث العربية والإنجليزية بطلاقة مع مستوى متوسط في السويدية.'
};

export const initialApplications: Application[] = [
  {
    id: 'app-1',
    userId: 'demo-user',
    jobId: 'demo-job-6',
    jobTitle: 'Frontend Web Developer (React / TypeScript)',
    company: 'TechNordic Solutions AB',
    location: 'Stockholm / Remote',
    sourceUrl: 'https://arbetsformedlingen.se/platsbanken/annonser/demo-106',
    stage: 'interview_1',
    appliedAt: '2026-07-10',
    followUpAt: '2026-07-22',
    interviewAt: '2026-07-24T10:00:00',
    notes: 'المقابلة الأولى عبر Teams مع مدير الفريق التقني.',
    contactPerson: 'Karin Lindqvist (HR)',
    createdAt: '2026-07-10',
    updatedAt: '2026-07-10'
  },
  {
    id: 'app-2',
    userId: 'demo-user',
    jobId: 'demo-job-2',
    jobTitle: 'Lagerarbetare med truckkort A+B till Solna',
    company: 'Sverige Logistik AB',
    location: 'Solna',
    sourceUrl: 'https://arbetsformedlingen.se/platsbanken/annonser/demo-102',
    stage: 'applied',
    appliedAt: '2026-07-15',
    followUpAt: '2026-07-25',
    notes: 'تم إرسال CV السويدي المخصص للمستودعات.',
    createdAt: '2026-07-15',
    updatedAt: '2026-07-15'
  },
  {
    id: 'app-3',
    userId: 'demo-user',
    jobId: 'demo-job-4',
    jobTitle: 'Customer Support Representative (English & Swedish)',
    company: 'Global Contact Solutions Sweden',
    location: 'Malmö / Hybrid',
    sourceUrl: 'https://eures.europa.eu/job-demo-104',
    stage: 'saved',
    notes: 'تحتاج لمراجعة خطاب التقديم قبل الإرسال.',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18'
  }
];
