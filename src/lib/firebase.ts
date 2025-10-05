import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAnalytics, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyDtaYf6FLsPL9FsTqFEE6lJlxPepxnSOKg",
  authDomain: "pine-744dd.firebaseapp.com",
  projectId: "pine-744dd",
  storageBucket: "pine-744dd.firebasestorage.app",
  messagingSenderId: "266139672867",
  appId: "1:266139672867:web:2c6215cc3661d9652bac96",
  measurementId: "G-PHTMKDR4B0"
}

// Initialize Firebase
let app: FirebaseApp
let auth: Auth
let db: Firestore
let analytics: Analytics | null = null

try {
  if (typeof window !== 'undefined') {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)

    // Initialize analytics only in browser
    try {
      analytics = getAnalytics(app)
    } catch (error) {
      console.warn('Analytics not available:', error)
    }
  } else {
    // Server-side: Create placeholder app for build time
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)
  }
} catch (error) {
  console.error('Firebase initialization failed:', error)
  // Create fallback instances for error cases
  if (typeof window !== 'undefined') {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  }
}

const isConfigured = true

export { app, auth, db, analytics, isConfigured }
