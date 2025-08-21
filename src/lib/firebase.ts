import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, doc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNsk0_ODFYT4KbDcaFDBz3ikpnkAD7B_Y",
  authDomain: "resturant-landing-page-90f4c.firebaseapp.com",
  projectId: "resturant-landing-page-90f4c",
  storageBucket: "resturant-landing-page-90f4c.firebasestorage.app",
  messagingSenderId: "564869702209",
  appId: "1:564869702209:web:9ad7ab1f3be0219c81dcc0",
  measurementId: "G-LPB0LB1FMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Lazy initialization of analytics to avoid hydration issues
let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;
export const analytics = {
  get instance() {
    if (typeof window !== 'undefined' && !analyticsInstance) {
      analyticsInstance = getAnalytics(app);
    }
    return analyticsInstance;
  }
};

// Helper function to get a reference to a collection
export const getCollectionRef = (collectionName: string) => {
  return collection(db, collectionName);
};

// Helper function to get a reference to a document
export const getDocRef = (collectionName: string, docId: string) => {
  return doc(db, collectionName, docId);
};
