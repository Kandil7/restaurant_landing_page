import { db, getCollectionRef, getDocRef, storage } from './firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Restaurant Settings
export const getRestaurantSettings = async () => {
  try {
    const settingsRef = doc(db, 'restaurantSettings', 'default');
    const settingsSnapshot = await getDoc(settingsRef);

    if (settingsSnapshot.exists()) {
      return { id: settingsSnapshot.id, ...settingsSnapshot.data() };
    } else {
      // Create default settings if none exists
      const defaultSettings = {
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
      };

      await setDoc(settingsRef, defaultSettings);
      return { id: 'default', ...defaultSettings };
    }
  } catch (error) {
    console.error('Error fetching restaurant settings:', error);
    throw error;
  }
};

export const updateRestaurantSettings = async (settings: any) => {
  try {
    const settingsRef = doc(db, 'restaurantSettings', 'default');
    await updateDoc(settingsRef, settings);
    return true;
  } catch (error) {
    console.error('Error updating restaurant settings:', error);
    throw error;
  }
};

// Categories
export const getCategories = async () => {
  try {
    const categoriesRef = collection(db, 'categories');
    // Simplified query without composite index requirement
    const q = query(categoriesRef, where('visible', '==', true));
    const querySnapshot = await getDocs(q);

    const categories = [];
    for (const docSnapshot of querySnapshot.docs) {
      const category = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
        items: [] // Items will be fetched separately
      };
      categories.push(category);
    }

    // Sort categories by order field
    categories.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Get items for each category
    for (const category of categories) {
      const items = await getMenuItemsByCategoryId(category.id);
      category.items = items;
    }

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const addCategory = async (category: any) => {
  try {
    const categoriesRef = collection(db, 'categories');
    const newCategory = {
      ...category,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(categoriesRef, newCategory);
    return { id: docRef.id, ...newCategory };
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId: string, updates: any) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, {
      ...updates,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await deleteDoc(categoryRef);
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Menu Items
export const getMenuItemsByCategoryId = async (categoryId: string) => {
  try {
    const itemsRef = collection(db, 'menuItems');
    // Simplified query without composite index requirement
    const q = query(itemsRef, where('categoryId', '==', categoryId));
    const querySnapshot = await getDocs(q);

    const items = [];
    for (const docSnapshot of querySnapshot.docs) {
      items.push({
        id: docSnapshot.id,
        ...docSnapshot.data()
      });
    }

    // Sort items by creation date
    items.sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateA - dateB;
    });

    return items;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

export const addMenuItem = async (item: any) => {
  try {
    const itemsRef = collection(db, 'menuItems');
    const newItem = {
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(itemsRef, newItem);
    return { id: docRef.id, ...newItem };
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

export const updateMenuItem = async (itemId: string, updates: any) => {
  try {
    const itemRef = doc(db, 'menuItems', itemId);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

export const deleteMenuItem = async (itemId: string) => {
  try {
    const itemRef = doc(db, 'menuItems', itemId);
    await deleteDoc(itemRef);
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// Admin Authentication
export const authenticateAdmin = async (email: string, password: string) => {
  try {
    // In a production app, you would use Firebase Authentication
    // For this example, we'll use a simple hardcoded check
    if (email === 'admin@restaurant.com' && password === 'admin123') {
      return { 
        id: 'admin', 
        email, 
        name: 'مدير المطعم',
        authenticated: true 
      };
    }
    return { authenticated: false };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

// File Upload
export const uploadFile = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
