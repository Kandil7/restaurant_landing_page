import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database...');

  // Get all categories and find duplicates by name
  const categories = await prisma.category.findMany({
    include: {
      items: true
    }
  });

  // Group categories by name
  const categoryGroups = categories.reduce((acc, category) => {
    if (!acc[category.name]) {
      acc[category.name] = [];
    }
    acc[category.name].push(category);
    return acc;
  }, {} as Record<string, typeof categories>);

  // For each duplicate group, keep the first one and delete the rest
  for (const [name, group] of Object.entries(categoryGroups)) {
    if (group.length > 1) {
      console.log(`Found ${group.length} duplicates for category: ${name}`);
      
      // Keep the first category (most recent)
      const [keepCategory, ...deleteCategories] = group.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      console.log(`Keeping category ${keepCategory.id} and deleting ${deleteCategories.length} duplicates`);

      // Delete duplicate categories and their items
      for (const categoryToDelete of deleteCategories) {
        await prisma.menuItem.deleteMany({
          where: {
            categoryId: categoryToDelete.id
          }
        });

        await prisma.category.delete({
          where: {
            id: categoryToDelete.id
          }
        });
      }
    }
  }

  console.log('Database cleanup completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });