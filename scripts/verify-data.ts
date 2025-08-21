import { db } from '../src/lib/db'

async function verifyData() {
  try {
    console.log('Verifying dummy data...')

    // Check restaurant settings
    const settings = await db.restaurantSettings.findFirst()
    console.log('\n🏪 Restaurant Settings:')
    console.log(`- Name: ${settings?.restaurantName}`)
    console.log(`- Phone: ${settings?.contactPhone}`)
    console.log(`- Email: ${settings?.contactEmail}`)
    console.log(`- Address: ${settings?.address}`)

    // Check categories
    const categories = await db.category.findMany({
      orderBy: { order: 'asc' }
    })
    console.log('\n📂 Categories:')
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} - ${category.description}`)
    })

    // Check menu items count per category
    console.log('\n🍽️ Menu Items per Category:')
    for (const category of categories) {
      const itemCount = await db.menuItem.count({
        where: { categoryId: category.id }
      })
      console.log(`${category.name}: ${itemCount} items`)
    }

    // Show sample menu items
    console.log('\n📋 Sample Menu Items:')
    for (const category of categories) {
      const items = await db.menuItem.findMany({
        where: { categoryId: category.id },
        take: 2,
        orderBy: { createdAt: 'asc' }
      })
      console.log(`\n${category.name}:`)
      items.forEach(item => {
        console.log(`  - ${item.name}: ${item.price}`)
        if (item.description) {
          console.log(`    ${item.description}`)
        }
      })
    }

    console.log('\n✅ Data verification completed successfully!')

  } catch (error) {
    console.error('❌ Error verifying data:', error)
  } finally {
    await db.$disconnect()
  }
}

verifyData()