// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAErE72pClpa03O6aTM2uh7WJw_dLsJmaU",
  authDomain: "event-app-4b5c6.firebaseapp.com",
  projectId: "event-app-4b5c6",
  storageBucket: "event-app-4b5c6.firebasestorage.app",
  messagingSenderId: "960051163665",
  appId: "1:960051163665:web:a8c4805464a25feaa3b7b0",
  measurementId: "G-D7MJTR9NVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
