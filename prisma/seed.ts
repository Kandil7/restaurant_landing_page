import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default restaurant settings (only if none exists)
  const settingsCount = await prisma.restaurantSettings.count();
  if (settingsCount === 0) {
    const settings = await prisma.restaurantSettings.create({
      data: {
        restaurantName: 'مطعمنا المميز',
        primaryColor: '#f59e0b',
        secondaryColor: '#ea580c',
        backgroundColor: '#fffbeb',
        contactPhone: '1234-567-890',
        contactEmail: 'info@restaurant.com',
        address: 'شارع الملك فهد، الرياض',
        workingHours: 'من الساعة 11:00 صباحاً حتى 11:00 مساءً',
        welcomeText: 'مرحباً بك في مطعمنا! تصفح قائمتنا اللذيذة واختر من تشكيلتنا الواسعة من الأطباق الشرقية الأصيلة التي تقدمها أيدي طهاة محترفين بخبرة طويلة'
      }
    });
    console.log('Created restaurant settings');
  }

  // Create categories only if they don't exist
  const existingCategories = await prisma.category.findMany();
  const existingCategoryNames = existingCategories.map(c => c.name);

  const categoriesData = [
    { name: 'المقبلات', description: 'مقبلات شهية لفتح الشهية', image: '/appetizers.jpg', order: 1 },
    { name: 'الأطباق الرئيسية', description: 'أطباق رئيسية متنوعة ولذيذة', image: '/main-dishes.jpg', order: 2 },
    { name: 'المشويات', description: 'مشويات طازجة وشهية', image: '/grills.jpg', order: 3 },
    { name: 'الحلويات', description: 'حلويات شرقية تقليدية', image: '/desserts.jpg', order: 4 },
    { name: 'المشروبات', description: 'مشروبات منعشة وباردة', image: '/drinks.jpg', order: 5 }
  ];

  const createdCategories: any[] = [];
  for (const categoryData of categoriesData) {
    if (!existingCategoryNames.includes(categoryData.name)) {
      const category = await prisma.category.create({
        data: categoryData
      });
      createdCategories.push(category);
      console.log(`Created category: ${category.name}`);
    } else {
      const category = existingCategories.find(c => c.name === categoryData.name);
      if (category) createdCategories.push(category);
    }
  }

  // Create menu items only if they don't exist
  const existingItems = await prisma.menuItem.findMany();
  const existingItemNames = existingItems.map(i => i.name);

  const menuItemsData = [
    // المقبلات
    { name: 'حمص بالطحينة', description: 'حمص كلاسيكي مع زيت الزيتون والفلفل', price: '15 ريال', category: 'المقبلات' },
    { name: 'متبل الباذنجان', description: 'باذنجان مشوي مع الطماطم والبصل', price: '18 ريال', category: 'المقبلات' },
    { name: 'ورق العنب', description: 'ورق عنب محشي بالأرز والخضروات', price: '20 ريال', category: 'المقبلات' },
    { name: 'الفتوش', description: 'سلطة خضروات طازجة مع الخبز المحمص', price: '16 ريال', category: 'المقبلات' },
    { name: 'تبولة', description: 'سلطة البرغل مع البقدونس والنعناع', price: '14 ريال', category: 'المقبلات' },
    { name: 'مخللات متنوعة', description: 'تشكيلة من المخللات الشرقية', price: '12 ريال', category: 'المقبلات' },
    
    // الأطباق الرئيسية
    { name: 'منسف لحم', description: 'أرز بسمتي مع اللحم المطهو على الطريقة الأردنية', price: '45 ريال', category: 'الأطباق الرئيسية' },
    { name: 'مقلوبة دجاج', description: 'أرز بالبازلاء والجزر مع الدجاج المشوي', price: '38 ريال', category: 'الأطباق الرئيسية' },
    { name: 'ورق عنب باللحم', description: 'ورق عنب محشي بالأرز واللحم المفروم', price: '42 ريال', category: 'الأطباق الرئيسية' },
    { name: 'كبة باللبن', description: 'كبة مقلية مع صلصة اللبن الثقيل', price: '35 ريال', category: 'الأطباق الرئيسية' },
    { name: 'مسخن دجاج', description: 'دجاج مع البصل والسماق والخبز العربي', price: '40 ريال', category: 'الأطباق الرئيسية' },
    { name: 'برياني دجاج', description: 'أرز بهارات هندية مع الدجاج', price: '36 ريال', category: 'الأطباق الرئيسية' },
    
    // المشويات
    { name: 'شيش طاووق', description: 'دجاج متبل مشوي مع الخضروات', price: '32 ريال', category: 'المشويات' },
    { name: 'كباب لحم', description: 'لحم مفروم متبل مشوي على الفحم', price: '48 ريال', category: 'المشويات' },
    { name: 'شيش كباب', description: 'قطع لحم مشوية مع الخضروات', price: '52 ريال', category: 'المشويات' },
    { name: 'فتة مشويات', description: 'مشويات مع الخبز واللبن الثقيل', price: '44 ريال', category: 'المشويات' },
    { name: 'ريش غنم', description: 'ريش غنم مشوي مع الأرز والسلطة', price: '55 ريال', category: 'المشويات' },
    { name: 'مشاوي مختلطة', description: 'تشكيلة من المشويات المختلفة', price: '65 ريال', category: 'المشويات' },
    
    // الحلويات
    { name: 'كنافة بالجبن', description: 'كنافة شرقية مع الجبن والقطر', price: '22 ريال', category: 'الحلويات' },
    { name: 'بقلاوة', description: 'بقلاوة بالمكسرات والقطر', price: '18 ريال', category: 'الحلويات' },
    { name: 'أم علي', description: 'حلوى بالخبز والحليب والمكسرات', price: '20 ريال', category: 'الحلويات' },
    { name: 'رز بحليب', description: 'أرز مطهو بالحليب ومزين بالقرفة', price: '16 ريال', category: 'الحلويات' },
    { name: 'مهلبية', description: 'مهلبية شرقية مع الفستق المطحون', price: '14 ريال', category: 'الحلويات' },
    { name: 'قطايف بالجبن', description: 'قطايف محشوة بالجبن ومقلية', price: '24 ريال', category: 'الحلويات' },
    
    // المشروبات
    { name: 'عصير برتقال طازج', description: 'عصير برتقال طازج معلق', price: '12 ريال', category: 'المشروبات' },
    { name: 'عصير ليمون نعناع', description: 'عصير ليمون منعش مع النعناع', price: '10 ريال', category: 'المشروبات' },
    { name: 'قهوة عربية', description: 'قهوة عربية أصيلة مع الهيل', price: '8 ريال', category: 'المشروبات' },
    { name: 'شاي بالنعناع', description: 'شاي أخضر مع النعناع الطازج', price: '6 ريال', category: 'المشروبات' },
    { name: 'عصير فراولة', description: 'عصير فراولة طازج ومثلج', price: '14 ريال', category: 'المشروبات' },
    { name: 'ماء معدني', description: 'ماء معدني بارد', price: '4 ريال', category: 'المشروبات' }
  ];

  for (const itemData of menuItemsData) {
    if (!existingItemNames.includes(itemData.name)) {
      const category = createdCategories.find(c => c.name === itemData.category);
      if (category) {
        await prisma.menuItem.create({
          data: {
            name: itemData.name,
            description: itemData.description,
            price: itemData.price,
            categoryId: category.id
          }
        });
        console.log(`Created menu item: ${itemData.name}`);
      }
    }
  }

  // Create admin user only if none exists
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await prisma.admin.create({
      data: {
        email: 'admin@restaurant.com',
        password: hashedPassword,
        name: 'مدير المطعم'
      }
    });
    console.log('Created admin user');
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });