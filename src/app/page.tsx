import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RESTAURANT_FEATURES } from '@/lib/static-data';
import { getRestaurantSettings, getCategories } from '@/lib/firebase-service';

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  visible: boolean;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  categoryId: string;
}

interface RestaurantSettings {
  id: string;
  restaurantName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  workingHours: string;
  welcomeText: string;
}

// مميزات المطعم - Using static data configuration
const restaurantFeatures = RESTAURANT_FEATURES;

async function getData() {
  try {
    // Get settings
    const settings = await getRestaurantSettings();

    // Get categories with items
    const categories = await getCategories();

    return { settings, categories };
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return fallback data
    return {
      settings: {
        id: 'fallback',
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
      },
      categories: []
    };
  }
}

export default async function Home() {
  const { settings, categories } = await getData();

  // Always show the page with fallback data if needed
  const primaryColor = settings?.primaryColor || '#f59e0b';
  const secondaryColor = settings?.secondaryColor || '#ea580c';
  const backgroundColor = settings?.backgroundColor || '#fffbeb';
  const selectedCategory = categories[0]?.id || '';
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto">
        {/* الهيدر */}
        <header className="text-center py-8 mb-8">
          <div className="mb-6">
            <img
              src={settings?.logoUrl || '/restaurant-logo.png'}
              alt={settings?.restaurantName || 'مطعمنا المميز'}
              className="w-32 h-32 mx-auto rounded-full shadow-lg border-4"
              style={{ borderColor: primaryColor }}
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
            {settings?.restaurantName || 'مطعمنا المميز'}
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: primaryColor }}>
            {settings?.welcomeText || 'مرحباً بك في مطعمنا! تصفح قائمتنا اللذيذة واختر من تشكيلتنا الواسعة من الأطباق الشرقية الأصيلة التي تقدمها أيدي طهاة محترفين بخبرة طويلة'}
          </p>
        </header>

        {/* مميزات المطعم */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {restaurantFeatures.map((feature, index) => (
              <Card key={index} className="text-center bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                    style={{ borderColor: primaryColor }}>
                <CardContent className="p-4">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold mb-1" style={{ color: primaryColor }}>{feature.title}</h3>
                  <p className="text-sm" style={{ color: primaryColor }}>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* الأقسام */}
        <div className="mb-8 px-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center" style={{ color: primaryColor }}>
            اختر القسم
          </h2>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`text-sm md:text-base px-4 md:px-6 py-2 md:py-3 h-auto font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'text-white shadow-lg'
                    : 'bg-white/90 border hover:bg-opacity-50'
                }`}
                style={selectedCategory === category.id
                  ? { background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }
                  : { color: primaryColor, borderColor: primaryColor }
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* صورة القسم المحدد */}
        {currentCategory && (
          <div className="mb-8 px-4">
            <div className="relative max-w-4xl mx-auto">
              <img
                src={currentCategory.image || '/restaurant-logo.png'}
                alt={currentCategory.name}
                className="w-full h-48 md:h-64 lg:h-80 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 drop-shadow-lg">{currentCategory.name}</h3>
                <p className="text-base md:text-lg opacity-95 drop-shadow-md">{currentCategory.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* محتوى القسم المحدد */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12 px-4">
          {currentCategory?.items.length ? (
            currentCategory.items.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-2 hover:border-opacity-100"
                style={{ borderColor: primaryColor + '40' }}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-base md:text-lg font-bold leading-tight" style={{ color: primaryColor }}>
                      {item.name}
                    </CardTitle>
                    <Badge variant="secondary" className="font-semibold px-2 py-1 text-xs md:text-sm text-white flex-shrink-0"
                           style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                      {item.price}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: primaryColor }}>
                {categories.length === 0 ? 'قائمة الطعام قيد التحضير' : 'لا توجد أطباق في هذا القسم'}
              </h3>
              <p className="text-gray-600">
                {categories.length === 0
                  ? 'نحن نعمل على تحديث قائمتنا. يرجى العودة قريباً.'
                  : 'يرجى اختيار قسم آخر أو التواصل مع إدارة المطعم.'
                }
              </p>
            </div>
          )}
        </div>

        {/* معلومات إضافية */}
        <footer className="text-center mt-12 py-8 bg-white/50 backdrop-blur-sm rounded-2xl mx-4"
                style={{ borderTopColor: primaryColor }}>
          <div className="grid md:grid-cols-2 gap-6 mb-6 px-4">
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: primaryColor }}>معلومات التواصل</h3>
              <p className="mb-1" style={{ color: primaryColor }}>
                📞 للطلب والتواصل: {settings?.contactPhone || '1234-567-890'}
              </p>
              <p style={{ color: primaryColor }}>
                📧 البريد الإلكتروني: {settings?.contactEmail || 'info@restaurant.com'}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: primaryColor }}>ساعات العمل</h3>
              <p className="mb-1" style={{ color: primaryColor }}>
                🕐 {settings?.workingHours || 'من الساعة 11:00 صباحاً حتى 11:00 مساءً'}
              </p>
              <p style={{ color: primaryColor }}>
                📍 العنوان: {settings?.address || 'شارع الملك فهد، الرياض'}
              </p>
            </div>
          </div>
          <p className="text-sm mt-4 px-4" style={{ color: primaryColor }}>
            © 2024 {settings?.restaurantName || 'مطعمنا المميز'}. جميع الحقوق محفوظة
          </p>
        </footer>
      </div>
    </div>
  );
}
