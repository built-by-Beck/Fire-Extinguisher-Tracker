import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration — all values come from Vite env vars.
// IMPORTANT: Use import.meta.env.VITE_* directly (not through an alias)
// so Vite statically replaces them at build time.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

if (!firebaseConfig.apiKey) {
  throw new Error(
    'Missing VITE_FIREBASE_API_KEY. Set it in .env locally or in Netlify Environment Variables for production.'
  );
}

// Log environment in development (helpful for debugging)
if (import.meta.env.DEV) {
  console.log(`🔥 Firebase initialized for: ${import.meta.env.VITE_ENV || 'development'}`);
  console.log(`📦 Project ID: ${firebaseConfig.projectId}`);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence (queues writes, serves cached reads)
try {
  enableIndexedDbPersistence(db).catch((err) => {
    // Ignore known cases (multiple tabs) but log others for visibility
    if (err.code !== 'failed-precondition' && err.code !== 'unimplemented') {
      console.warn('Firestore persistence error:', err);
    }
  });
} catch (e) {
  console.warn('Failed to enable Firestore persistence:', e);
}
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Collection references
export const workspacesRef = collection(db, 'workspaces');

export default app;
