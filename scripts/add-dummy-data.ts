import { db } from '../src/lib/db'

async function addDummyData() {
  try {
    console.log('Adding dummy data to the database...')

    // Clear existing data (optional - comment out if you want to preserve existing data)
    console.log('Clearing existing data...')
    await db.menuItem.deleteMany()
    await db.category.deleteMany()
    await db.restaurantSettings.deleteMany()

    // Add restaurant settings
    console.log('Adding restaurant settings...')
    const settings = await db.restaurantSettings.create({
      data: {
        restaurantName: 'مطعم الأصالة',
        logoUrl: '/logo.png',
        primaryColor: '#f59e0b',
        secondaryColor: '#ea580c',
        backgroundColor: '#fffbeb',
        contactPhone: '050-123-4567',
        contactEmail: 'info@alasalah-restaurant.com',
        address: 'شارع الملك فهد، حي النخيل، الرياض',
        workingHours: 'من الساعة 11:00 صباحاً حتى 11:00 مساءً',
        welcomeText: 'مرحباً بك في مطعم الأصالة! نقدم لكم أطيب الأطباق العربية والأصيلة بأيدي طهاة محترفين. تجربة تذوق لا تُنسى بانتظاركم.'
      }
    })

    // Add categories
    console.log('Adding categories...')
    const categories = await Promise.all([
      db.category.create({
        data: {
          name: 'المقبلات',
          description: 'مقبلات عربية شهية لبدء وجبتكم',
          image: '/images/categories/appetizers.jpg',
          order: 1,
          visible: true
        }
      }),
      db.category.create({
        data: {
          name: 'الشوربات',
          description: 'شوربات دافئة ولذيذة',
          image: '/images/categories/soups.jpg',
          order: 2,
          visible: true
        }
      }),
      db.category.create({
        data: {
          name: 'الأطباق الرئيسية',
          description: 'أطباق رئيسية متنوعة ولذيذة',
          image: '/images/categories/main-courses.jpg',
          order: 3,
          visible: true
        }
      }),
      db.category.create({
        data: {
          name: 'الأطباق الجانبية',
          description: 'أطباق جانبية تكمل وجبتكم',
          image: '/images/categories/sides.jpg',
          order: 4,
          visible: true
        }
      }),
      db.category.create({
        data: {
          name: 'الحلويات',
          description: 'حلويات عربية شهية',
          image: '/images/categories/desserts.jpg',
          order: 5,
          visible: true
        }
      })
    ])

    // Add menu items for each category
    console.log('Adding menu items...')

    // Appetizers
    await Promise.all([
      db.menuItem.create({
        data: {
          name: 'حمص بالطحينة',
          description: 'حمص كريمي مع زيت الزيتون والفلفل الحار',
          price: '15 ريال',
          categoryId: categories[0].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'متبل الباذنجان',
          description: 'باذنجان مشوي مع الطحينة والثوم',
          price: '18 ريال',
          categoryId: categories[0].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'فلافل',
          description: 'كرات الفلافل المقرمشة مع الصلصة',
          price: '12 ريال',
          categoryId: categories[0].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'تبولة',
          description: 'سلطة البرغل مع البقدونس والطماطم',
          price: '14 ريال',
          categoryId: categories[0].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'فتوش',
          description: 'سلطة خضروات مع خبز محمص',
          price: '16 ريال',
          categoryId: categories[0].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'ورق العنب',
          description: 'ورق عنب محشي بالأرز والخضروات',
          price: '20 ريال',
          categoryId: categories[0].id
        }
      })
    ])

    // Soups
    await Promise.all([
      db.menuItem.create({
        data: {
          name: 'شوربة العدس',
          description: 'شوربة عدس دافئة مع الليمون',
          price: '12 ريال',
          categoryId: categories[1].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'شوربة الدجاج',
          description: 'شوربة دجاج مع الخضروات',
          price: '14 ريال',
          categoryId: categories[1].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'شوربة الطماطم',
          description: 'شوربة طماطم كريمية مع الأعشاب',
          price: '13 ريال',
          categoryId: categories[1].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'شوربة الخضروات',
          description: 'شوربة خضروات مختلطة',
          price: '12 ريال',
          categoryId: categories[1].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'شوربة الفطر',
          description: 'شوربة فطر كريمية',
          price: '15 ريال',
          categoryId: categories[1].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'شوربة اليخنة',
          description: 'يخنة لحم مع الخضروات',
          price: '18 ريال',
          categoryId: categories[1].id
        }
      })
    ])

    // Main Courses
    await Promise.all([
      db.menuItem.create({
        data: {
          name: 'مندي لحم',
          description: 'لحم ضأن مطهو بالأرز والتوابل',
          price: '45 ريال',
          categoryId: categories[2].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'مظبي دجاج',
          description: 'دجاج مشوي مع الأرز البسمتي',
          price: '38 ريال',
          categoryId: categories[2].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'كبسة لحم',
          description: 'لحم مع الأرز والتوابل الخاصة',
          price: '42 ريال',
          categoryId: categories[2].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'مشاوي مشكلة',
          description: 'تشكيلة من المشاوي العربية',
          price: '55 ريال',
          categoryId: categories[2].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'سمك مشوي',
          description: 'سمك مشوي مع الأرز والسلطة',
          price: '48 ريال',
          categoryId: categories[2].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'برياني دجاج',
          description: 'برياني دجاج بالتوابل الهندية',
          price: '40 ريال',
          categoryId: categories[2].id
        }
      })
    ])

    // Side Dishes
    await Promise.all([
      db.menuItem.create({
        data: {
          name: 'أرز بسمتي',
          description: 'أرز بسمتي أبيض',
          price: '8 ريال',
          categoryId: categories[3].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'خبز عربي',
          description: 'خبز عربي طازج',
          price: '5 ريال',
          categoryId: categories[3].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'سلطة عربية',
          description: 'سلطة خضروات طازجة',
          price: '10 ريال',
          categoryId: categories[3].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'مخللات مشكلة',
          description: 'تشكيلة من المخللات العربية',
          price: '8 ريال',
          categoryId: categories[3].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'بطاطس مقلية',
          description: 'بطاطس مقلية مقرمشة',
          price: '12 ريال',
          categoryId: categories[3].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'زيتون وزيت',
          description: 'زيتون أسود وأخضر مع زيت الزيتون',
          price: '10 ريال',
          categoryId: categories[3].id
        }
      })
    ])

    // Desserts
    await Promise.all([
      db.menuItem.create({
        data: {
          name: 'كنافة',
          description: 'كنافة بالجبن والقطر',
          price: '18 ريال',
          categoryId: categories[4].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'بقلاوة',
          description: 'بقلاوة بالمكسرات',
          price: '20 ريال',
          categoryId: categories[4].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'أم علي',
          description: 'حلوى أم علي بالقشطة والمكسرات',
          price: '22 ريال',
          categoryId: categories[4].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'رز بحليب',
          description: 'رز بحليب مع القرفة والزبيب',
          price: '15 ريال',
          categoryId: categories[4].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'مهلبية',
          description: 'مهلبية بالفستق والزبيب',
          price: '14 ريال',
          categoryId: categories[4].id
        }
      }),
      db.menuItem.create({
        data: {
          name: 'تمر بالجوز',
          description: 'تمر محشي بالجوز والعسل',
          price: '16 ريال',
          categoryId: categories[4].id
        }
      })
    ])

    console.log('✅ Dummy data added successfully!')
    console.log(`- Restaurant: ${settings.restaurantName}`)
    console.log(`- Categories: ${categories.length}`)
    console.log(`- Menu Items: 30 (6 per category)`)

  } catch (error) {
    console.error('❌ Error adding dummy data:', error)
  } finally {
    await db.$disconnect()
  }
}

addDummyData()