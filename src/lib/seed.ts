import { db } from './db';
import { 
  DEFAULT_RESTAURANT_SETTINGS, 
  DEFAULT_CATEGORIES, 
  MENU_ITEMS_BY_CATEGORY, 
  DEFAULT_ADMIN_USER 
} from './static-data';

export async function ensureDefaultData() {
  try {
    // Check if restaurant settings exist
    const settingsCount = await db.restaurantSettings.count();
    
    // Check if categories exist
    const categoriesCount = await db.category.count();
    
    // Check if menu items exist
    const menuItemsCount = await db.menuItem.count();
    
    // Check if admin user exists
    const adminCount = await db.admin.count();
    
    // If no data exists, seed the database
    if (settingsCount === 0 && categoriesCount === 0 && menuItemsCount === 0 && adminCount === 0) {
      console.log('No data found. Seeding database with default data...');
      
      // Create default restaurant settings
      await db.restaurantSettings.create({
        data: DEFAULT_RESTAURANT_SETTINGS
      });

      // Create categories with order
      const createdCategories: any[] = [];
      for (const categoryData of DEFAULT_CATEGORIES) {
        const category = await db.category.create({
          data: categoryData
        });
        createdCategories.push(category);
      }

      // Create menu items for each category
      for (const category of createdCategories) {
        const items = MENU_ITEMS_BY_CATEGORY[category.name as keyof typeof MENU_ITEMS_BY_CATEGORY];
        if (items) {
          for (const item of items) {
            await db.menuItem.create({
              data: {
                ...item,
                categoryId: category.id
              }
            });
          }
        }
      }

      // Create default admin user
      await db.admin.create({
        data: DEFAULT_ADMIN_USER
      });

      console.log('Database seeded successfully with default data!');
    } else {
      console.log('Database already contains data. Skipping seeding.');
    }
  } catch (error) {
    console.error('Error ensuring default data:', error);
  }
}