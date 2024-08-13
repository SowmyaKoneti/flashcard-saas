// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
require("dotenv").config()
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "flashcards-saas-2b035.firebaseapp.com",
  projectId: "flashcards-saas-2b035",
  storageBucket: "flashcards-saas-2b035.appspot.com",
  messagingSenderId: "345142191903",
  appId: "1:345142191903:web:78db224e613b9259a5f22a",
  measurementId: "G-EK7ESTRZ52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);