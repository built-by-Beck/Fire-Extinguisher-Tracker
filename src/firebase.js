import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Environment-based Firebase configuration
// Supports: development, staging, production
// Set via .env files or VITE_ENV environment variable
const env = import.meta?.env || {};
const currentEnv = env.VITE_ENV || 'development';

// Default production config (fallback)
const defaultProjectId = 'fire-extinguisher-tracke-9e98f';
const defaultConfig = {
  apiKey: "AIzaSyB1e9aheHRCYCQF8iNH9C3D1tZlSkYXAlY",
  authDomain: "fire-extinguisher-tracke-9e98f.firebaseapp.com",
  projectId: defaultProjectId,
  storageBucket: `${defaultProjectId}.appspot.com`,
  messagingSenderId: "1068945798281",
  appId: "1:1068945798281:web:575102ab9851df0d870258",
  measurementId: "G-0M2WJ03MF0"
};

// Build config from environment variables or use defaults
const envProjectId = env.VITE_FIREBASE_PROJECT_ID || defaultConfig.projectId;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId: envProjectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || defaultConfig.appId,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || defaultConfig.measurementId
};

// Log environment in development (helpful for debugging)
if (currentEnv === 'development' && import.meta.env.DEV) {
  console.log(`🔥 Firebase initialized for: ${currentEnv}`);
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

// Guarded Analytics initialization (some environments, especially on Apple devices,
// can throw when initializing analytics; this prevents a full app crash)
let analyticsInstance = null;
try {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    analyticsInstance = getAnalytics(app);
    // #region agent log
    if (typeof fetch === 'function') {
      fetch('http://127.0.0.1:7244/ingest/c84b91a5-f1cf-4449-9aa5-3f7c4439b442', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'firebase.js:initAnalytics',
          message: 'analytics initialized',
          data: { projectId: firebaseConfig.projectId, env: currentEnv },
          timestamp: Date.now(),
          runId: 'initial',
          hypothesisId: 'H1'
        })
      }).catch(() => {});
    }
    // #endregion
  } else {
    // #region agent log
    if (typeof fetch === 'function') {
      fetch('http://127.0.0.1:7244/ingest/c84b91a5-f1cf-4449-9aa5-3f7c4439b442', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'firebase.js:initAnalytics',
          message: 'analytics skipped (non-browser environment)',
          data: { projectId: firebaseConfig.projectId, env: currentEnv },
          timestamp: Date.now(),
          runId: 'initial',
          hypothesisId: 'H1'
        })
      }).catch(() => {});
    }
    // #endregion
  }
} catch (err) {
  console.warn('Analytics initialization failed:', err);
  // #region agent log
  if (typeof fetch === 'function') {
    fetch('http://127.0.0.1:7244/ingest/c84b91a5-f1cf-4449-9aa5-3f7c4439b442', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'firebase.js:initAnalyticsError',
        message: 'analytics init failed',
        data: { projectId: firebaseConfig.projectId, env: currentEnv, errorMessage: err?.message || String(err) },
        timestamp: Date.now(),
        runId: 'initial',
        hypothesisId: 'H1'
      })
    }).catch(() => {});
  }
  // #endregion
}
export const analytics = analyticsInstance;

// Collection references
export const workspacesRef = collection(db, 'workspaces');

export default app;
