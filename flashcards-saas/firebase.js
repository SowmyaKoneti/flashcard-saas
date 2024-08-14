// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfNlTVBh68k-tqm4Zh4CO6eHRZET3mgkY",
  authDomain: "flashcardsaas-f6943.firebaseapp.com",
  projectId: "flashcardsaas-f6943",
  storageBucket: "flashcardsaas-f6943.appspot.com",
  messagingSenderId: "786190593871",
  appId: "1:786190593871:web:989517e230ac8649a39f3a",
  measurementId: "G-0T99E8G3MH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);