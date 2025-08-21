// Static data configuration for the restaurant menu system
export const DEFAULT_RESTAURANT_SETTINGS = {
  restaurantName: 'مطعمنا المميز',
  logoUrl: '/restaurant-logo.png',
  primaryColor: '#f59e0b',
  secondaryColor: '#ea580c',
  backgroundColor: '#fffbeb',
  contactPhone: '1234-567-890',
  contactEmail: 'info@restaurant.com',
  address: 'شارع الملك فهد، الرياض',
  workingHours: 'من الساعة 11:00 صباحاً حتى 11:00 مساءً',
  welcomeText: 'مرحباً بك في مطعمنا! تصفح قائمتنا اللذيذة واختر من تشكيلتنا الواسعة من الأطباق الشرقية الأصيلة التي تقدمها أيدي طهاة محترفين بخبرة طويلة'
};

export const DEFAULT_CATEGORIES = [
  {
    name: 'المقبلات',
    description: 'مقبلات شهية لفتح الشهية',
    image: '/appetizers.jpg',
    order: 1,
    visible: true
  },
  {
    name: 'الأطباق الرئيسية',
    description: 'أطباق رئيسية متنوعة ولذيذة',
    image: '/main-dishes.jpg',
    order: 2,
    visible: true
  },
  {
    name: 'المشويات',
    description: 'مشويات طازجة وشهية',
    image: '/grills.jpg',
    order: 3,
    visible: true
  },
  {
    name: 'الحلويات',
    description: 'حلويات شرقية تقليدية',
    image: '/desserts.jpg',
    order: 4,
    visible: true
  },
  {
    name: 'المشروبات',
    description: 'مشروبات منعشة وباردة',
    image: '/drinks.jpg',
    order: 5,
    visible: true
  }
];

export const MENU_ITEMS_BY_CATEGORY = {
  'المقبلات': [
    { name: 'حمص بالطحينة', description: 'حمص كلاسيكي مع زيت الزيتون والفلفل', price: '15 ريال' },
    { name: 'متبل الباذنجان', description: 'باذنجان مشوي مع الطماطم والبصل', price: '18 ريال' },
    { name: 'ورق العنب', description: 'ورق عنب محشي بالأرز والخضروات', price: '20 ريال' },
    { name: 'الفتوش', description: 'سلطة خضروات طازجة مع الخبز المحمص', price: '16 ريال' },
    { name: 'تبولة', description: 'سلطة البرغل مع البقدونس والنعناع', price: '14 ريال' },
    { name: 'مخللات متنوعة', description: 'تشكيلة من المخللات الشرقية', price: '12 ريال' }
  ],
  'الأطباق الرئيسية': [
    { name: 'منسف لحم', description: 'أرز بسمتي مع اللحم المطهو على الطريقة الأردنية', price: '45 ريال' },
    { name: 'مقلوبة دجاج', description: 'أرز بالبازلاء والجزر مع الدجاج المشوي', price: '38 ريال' },
    { name: 'ورق عنب باللحم', description: 'ورق عنب محشي بالأرز واللحم المفروم', price: '42 ريال' },
    { name: 'كبة باللبن', description: 'كبة مقلية مع صلصة اللبن الثقيل', price: '35 ريال' },
    { name: 'مسخن دجاج', description: 'دجاج مع البصل والسماق والخبز العربي', price: '40 ريال' },
    { name: 'برياني دجاج', description: 'أرز بهارات هندية مع الدجاج', price: '36 ريال' }
  ],
  'المشويات': [
    { name: 'شيش طاووق', description: 'دجاج متبل مشوي مع الخضروات', price: '32 ريال' },
    { name: 'كباب لحم', description: 'لحم مفروم متبل مشوي على الفحم', price: '48 ريال' },
    { name: 'شيش كباب', description: 'قطع لحم مشوية مع الخضروات', price: '52 ريال' },
    { name: 'فتة مشويات', description: 'مشويات مع الخبز واللبن الثقيل', price: '44 ريال' },
    { name: 'ريش غنم', description: 'ريش غنم مشوي مع الأرز والسلطة', price: '55 ريال' },
    { name: 'مشاوي مختلطة', description: 'تشكيلة من المشويات المختلفة', price: '65 ريال' }
  ],
  'الحلويات': [
    { name: 'كنافة بالجبن', description: 'كنافة شرقية مع الجبن والقطر', price: '22 ريال' },
    { name: 'بقلاوة', description: 'بقلاوة بالمكسرات والقطر', price: '18 ريال' },
    { name: 'أم علي', description: 'حلوى بالخبز والحليب والمكسرات', price: '20 ريال' },
    { name: 'رز بحليب', description: 'أرز مطهو بالحليب ومزين بالقرفة', price: '16 ريال' },
    { name: 'مهلبية', description: 'مهلبية شرقية مع الفستق المطحون', price: '14 ريال' },
    { name: 'قطايف بالجبن', description: 'قطايف محشوة بالجبن ومقلية', price: '24 ريال' }
  ],
  'المشروبات': [
    { name: 'عصير برتقال طازج', description: 'عصير برتقال طازج معلق', price: '12 ريال' },
    { name: 'عصير ليمون نعناع', description: 'عصير ليمون منعش مع النعناع', price: '10 ريال' },
    { name: 'قهوة عربية', description: 'قهوة عربية أصيلة مع الهيل', price: '8 ريال' },
    { name: 'شاي بالنعناع', description: 'شاي أخضر مع النعناع الطازج', price: '6 ريال' },
    { name: 'عصير فراولة', description: 'عصير فراولة طازج ومثلج', price: '14 ريال' },
    { name: 'ماء معدني', description: 'ماء معدني بارد', price: '4 ريال' }
  ]
};

export const DEFAULT_ADMIN_USER = {
  email: 'admin@restaurant.com',
  password: 'admin123',
  name: 'مدير المطعم'
};

export const RESTAURANT_FEATURES = [
  { icon: '🍽️', title: 'مطبخ أصيل', description: 'أطباق شرقية تقليدية بإتقان' },
  { icon: '🌟', title: 'جودة عالية', description: 'مكونات طازجة ومختارة بعناية' },
  { icon: '👨‍🍳', title: 'طهاة محترفون', description: 'خبرة طويلة في المطبخ العربي' },
  { icon: '🏠', title: 'جو عائلي', description: 'بيئة مريحة ومناسبة للعائلات' }
];

export const COLOR_PRESETS = [
  {
    name: 'الأصلي (عنبري)',
    primary: '#f59e0b',
    secondary: '#ea580c',
    background: '#fffbeb'
  },
  {
    name: 'أخضر',
    primary: '#059669',
    secondary: '#047857',
    background: '#ecfdf5'
  },
  {
    name: 'أزرق',
    primary: '#2563eb',
    secondary: '#1d4ed8',
    background: '#eff6ff'
  },
  {
    name: 'بنفسجي',
    primary: '#7c3aed',
    secondary: '#6d28d9',
    background: '#f5f3ff'
  },
  {
    name: 'وردي',
    primary: '#db2777',
    secondary: '#be185d',
    background: '#fdf2f8'
  }
];

export const SUPPORTED_LANGUAGES = [
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'en', name: 'English', dir: 'ltr' }
];

export const DEFAULT_CURRENCY = 'ريال';

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/restaurant',
  instagram: 'https://instagram.com/restaurant',
  twitter: 'https://twitter.com/restaurant',
  whatsapp: 'https://wa.me/9661234567890'
};