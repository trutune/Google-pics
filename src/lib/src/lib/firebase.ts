// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDn59hldXbYdgh-raByJFGNJFJ25FCa-nI",
  authDomain: "pics-bf595.firebaseapp.com",
  projectId: "pics-bf595",
  storageBucket: "pics-bf595.firebasestorage.app",
  messagingSenderId: "39510431121",
  appId: "1:39510431121:web:1e9319eba8f97fe8b4f630",
  measurementId: "G-JCYCFQQEBF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
