import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDn59hldXbYdgh-raByJFGNJFJ25FCa-nI",
  authDomain: "pics-bf595.firebaseapp.com",
  projectId: "pics-bf595",
  storageBucket: "pics-bf595.firebasestorage.app",
  messagingSenderId: "39510431121",
  appId: "1:39510431121:web:1e9319eba8f97fe8b4f630"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
