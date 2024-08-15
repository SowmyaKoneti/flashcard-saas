import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "flashcards-22463.firebaseapp.com",
  projectId: "flashcards-22463",
  storageBucket: "flashcards-22463.appspot.com",
  messagingSenderId: "41962176741",
  appId: "1:41962176741:web:7d14fff3764bbcee50d40c",
  measurementId: "G-PBWFJWCDRV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { db, analytics };
