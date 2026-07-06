import { initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Auth is optional — if the Firebase env vars are missing (e.g. a build without
// secrets) we must NOT crash the whole app. `auth` is null and sign-in is disabled.
export let auth: Auth | null = null;

if (firebaseConfig.apiKey && firebaseConfig.appId) {
  try {
    auth = getAuth(initializeApp(firebaseConfig));
  } catch (err) {
    console.error("Firebase init failed — auth disabled.", err);
  }
} else {
  console.warn("Firebase config missing (VITE_FIREBASE_* env) — auth disabled.");
}
