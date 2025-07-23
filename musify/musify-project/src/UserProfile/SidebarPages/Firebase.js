import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// Removed redundant import of _Auth

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAB5TzjFipTA3G6N0PlN39BgF7llf7_GqA",
  authDomain: "musify05-430ea.firebaseapp.com",
  projectId: "musify05-430ea",
  storageBucket: "musify05-430ea.appspot.com",
  messagingSenderId: "585909962600",
  appId: "1:585909962600:web:bfbd5988a6f0f485a278dd",
  measurementId: "G-YGY1R6ZFK2"
};

// Initialize Firebase only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase services
export const _Auth = getAuth(app);
export const DB = getFirestore(app);
export const storage = getStorage(app);

// Firestore collection references
export const profilesCollection = collection(DB, "profiles");

// Function to get the current authenticated user
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(_Auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        reject("No user logged in");
      }
    });
  });
};

// Export Firebase functions
export { addDoc, getDocs, doc, updateDoc, ref, uploadBytes, getDownloadURL, };
