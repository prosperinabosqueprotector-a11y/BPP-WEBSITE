import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTqcHIGKcRZRiFsJjTLSne0NKny13VVgA",
  authDomain: "bpp-website-fa794.firebaseapp.com",
  projectId: "bpp-website-fa794",
  storageBucket: "bpp-website-fa794.firebasestorage.app",
  messagingSenderId: "882815011826",
  appId: "1:882815011826:web:425202133e83a0f287796b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)

