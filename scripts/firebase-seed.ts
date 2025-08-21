import { db } from '../src/lib/firebase';
import { collection, doc, addDoc, setDoc, getDoc, getDocs } from 'firebase/firestore';

// Define the category type
interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

async function seedDatabase() {
  console.log('Seeding Firebase database...');

  try {
    // Seed restaurant settings
    const settingsRef = doc(db, 'restaurantSettings', 'default');
    const settingsDoc = await getDoc(settingsRef);

    if (!settingsDoc.exists()) {
      console.log('Creating default restaurant settings...');
      await setDoc(settingsRef, {
        restaurantName: 'مطعمنا المميز',
        logoUrl: '/restaurant-logo.png',
        primaryColor: '#f59e0b',
        secondaryColor: '#ea580c',
        backgroundColor: '#fffbeb',
        contactPhone: '1234-567-890',
        contactEmail: 'info@restaurant.com',
        address: 'شارع الملك فهد، الرياض',
        workingHours: 'من الساعة 11:00 صباحاً حتى 11:00 مساءً',
        welcomeText: 'مرحباً بك في مطعمنا! تصفح قائمتنا اللذيذة واختر من تشكيلتنا الواسعة من الأطباق الشرقية الأصيلة التي تقدمها أيدي طهاة محترفين بخبرة طويلة',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✓ Created restaurant settings');
    } else {
      console.log('Restaurant settings already exist');
    }

    // Seed categories
    const categoriesRef = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesRef);

    // Define the type explicitly
    let categoriesData: Category[] = [];
    if (categoriesSnapshot.empty) {
      console.log('Creating default categories...');

      const categoriesDataTemplate = [
        { 
          name: 'المقبلات', 
          description: 'مقبلات شهية لفتح الشهية', 
          image: '/appetizers.jpg', 
          order: 1,
          visible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          name: 'الأطباق الرئيسية', 
          description: 'أطباق رئيسية متنوعة ولذيذة', 
          image: '/main-dishes.jpg', 
          order: 2,
          visible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          name: 'المشويات', 
          description: 'مشويات طازجة وشهية', 
          image: '/grills.jpg', 
          order: 3,
          visible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          name: 'الحلويات', 
          description: 'حلويات شرقية تقليدية', 
          image: '/desserts.jpg', 
          order: 4,
          visible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          name: 'المشروبات', 
          description: 'مشروبات منعشة وباردة', 
          image: '/drinks.jpg', 
          order: 5,
          visible: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      for (const category of categoriesDataTemplate) {
        const docRef = await addDoc(categoriesRef, category);
        // Create properly typed category object
        const categoryWithId: Category = {
          id: docRef.id,
          name: category.name,
          description: category.description,
          image: category.image,
          order: category.order,
          visible: category.visible,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        };
        categoriesData.push(categoryWithId);
        console.log(`✓ Created category: ${category.name} with ID: ${docRef.id}`);
      }
    } else {
      console.log('Categories already exist');
      // Get existing categories for menu items
      categoriesSnapshot.forEach(doc => {
        const categoryData = doc.data();
        categoriesData.push({ 
          id: doc.id, 
          name: categoryData.name,
          description: categoryData.description,
          image: categoryData.image,
          order: categoryData.order,
          visible: categoryData.visible,
          createdAt: categoryData.createdAt?.toDate() || new Date(),
          updatedAt: categoryData.updatedAt?.toDate() || new Date()
        });
      });
    }

    // Seed menu items
    const menuItemsRef = collection(db, 'menuItems');
    const menuItemsSnapshot = await getDocs(menuItemsRef);

    if (menuItemsSnapshot.empty && categoriesData.length > 0) {
      console.log('Creating default menu items...');
      
      // Create a mapping of category names to IDs
      const categoryMap: { [key: string]: string } = {};
      categoriesData.forEach(category => {
        categoryMap[category.name] = category.id;
      });

      const menuItemsData = [
        // المقبلات
        { name: 'حمص بالطحينة', description: 'حمص كلاسيكي مع زيت الزيتون والفلفل', price: '15 ريال', categoryId: categoryMap['المقبلات'] },
        { name: 'متبل الباذنجان', description: 'باذنجان مشوي مع الطماطم والبصل', price: '18 ريال', categoryId: categoryMap['المقبلات'] },
        { name: 'ورق العنب', description: 'ورق عنب محشي بالأرز والخضروات', price: '20 ريال', categoryId: categoryMap['المقبلات'] },
        { name: 'الفتوش', description: 'سلطة خضروات طازجة مع الخبز المحمص', price: '16 ريال', categoryId: categoryMap['المقبلات'] },
        { name: 'تبولة', description: 'سلطة البرغل مع البقدونس والنعناع', price: '14 ريال', categoryId: categoryMap['المقبلات'] },
        { name: 'مخللات متنوعة', description: 'تشكيلة من المخللات الشرقية', price: '12 ريال', categoryId: categoryMap['المقبلات'] },

        // الأطباق الرئيسية
        { name: 'منسف لحم', description: 'أرز بسمتي مع اللحم المطهو على الطريقة الأردنية', price: '45 ريال', categoryId: categoryMap['الأطباق الرئيسية'] },
        { name: 'مقلوبة دجاج', description: 'أرز بالبازلاء والجزر مع الدجاج المشوي', price: '38 ريال', categoryId: categoryMap['الأطباق الرئيسية'] },
        { name: 'ورق عنب باللحم', description: 'ورق عنب محشي بالأرز واللحم المفروم', price: '42 ريال', categoryId: categoryMap['الأطباق الرئيسية'] },
        { name: 'كبة باللبن', description: 'كبة مقلية مع صلصة اللبن الثقيل', price: '35 ريال', categoryId: categoryMap['الأطباق الرئيسية'] },
        { name: 'مسخن دجاج', description: 'دجاج مع البصل والسماق والخبز العربي', price: '40 ريال', categoryId: categoryMap['الأطباق الرئيسية'] },
        { name: 'برياني دجاج', description: 'أرز بهارات هندية مع الدجاج', price: '36 ريال', categoryId: categoryMap['الأطباق الرئيسية'] },

        // المشويات
        { name: 'شيش طاووق', description: 'دجاج متبل مشوي مع الخضروات', price: '32 ريال', categoryId: categoryMap['المشويات'] },
        { name: 'كباب لحم', description: 'لحم مفروم متبل مشوي على الفحم', price: '48 ريال', categoryId: categoryMap['المشويات'] },
        { name: 'شيش كباب', description: 'قطع لحم مشوية مع الخضروات', price: '52 ريال', categoryId: categoryMap['المشويات'] },
        { name: 'فتة مشويات', description: 'مشويات مع الخبز واللبن الثقيل', price: '44 ريال', categoryId: categoryMap['المشويات'] },
        { name: 'ريش غنم', description: 'ريش غنم مشوي مع الأرز والسلطة', price: '55 ريال', categoryId: categoryMap['المشويات'] },
        { name: 'مشاوي مختلطة', description: 'تشكيلة من المشويات المختلفة', price: '65 ريال', categoryId: categoryMap['المشويات'] },

        // الحلويات
        { name: 'كنافة بالجبن', description: 'كنافة شرقية مع الجبن والقطر', price: '22 ريال', categoryId: categoryMap['الحلويات'] },
        { name: 'بقلاوة', description: 'بقلاوة بالمكسرات والقطر', price: '18 ريال', categoryId: categoryMap['الحلويات'] },
        { name: 'أم علي', description: 'حلوى بالخبز والحليب والمكسرات', price: '20 ريال', categoryId: categoryMap['الحلويات'] },
        { name: 'رز بحليب', description: 'أرز مطهو بالحليب ومزين بالقرفة', price: '16 ريال', categoryId: categoryMap['الحلويات'] },
        { name: 'مهلبية', description: 'مهلبية شرقية مع الفستق المطحون', price: '14 ريال', categoryId: categoryMap['الحلويات'] },
        { name: 'قطايف بالجبن', description: 'قطايف محشوة بالجبن ومقلية', price: '24 ريال', categoryId: categoryMap['الحلويات'] },

        // المشروبات
        { name: 'عصير برتقال طازج', description: 'عصير برتقال طازج معلق', price: '12 ريال', categoryId: categoryMap['المشروبات'] },
        { name: 'عصير ليمون نعناع', description: 'عصير ليمون منعش مع النعناع', price: '10 ريال', categoryId: categoryMap['المشروبات'] },
        { name: 'قهوة عربية', description: 'قهوة عربية أصيلة مع الهيل', price: '8 ريال', categoryId: categoryMap['المشروبات'] },
        { name: 'شاي بالنعناع', description: 'شاي أخضر مع النعناع الطازج', price: '6 ريال', categoryId: categoryMap['المشروبات'] },
        { name: 'عصير فراولة', description: 'عصير فراولة طازج ومثلج', price: '14 ريال', categoryId: categoryMap['المشروبات'] },
        { name: 'ماء معدني', description: 'ماء معدني بارد', price: '4 ريال', categoryId: categoryMap['المشروبات'] }
      ];

      for (const item of menuItemsData) {
        await addDoc(menuItemsRef, {
          ...item,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`✓ Created menu item: ${item.name}`);
      }
    } else {
      console.log('Menu items already exist');
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seeding function
seedDatabase().catch(error => {
  console.error('Seeding failed:', error);
});