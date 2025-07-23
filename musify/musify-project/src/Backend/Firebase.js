import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAB5TzjFipTA3G6N0PlN39BgF7llf7_GqA",
  authDomain: "musify05-430ea.firebaseapp.com",
  projectId: "musify05-430ea",
  storageBucket: "musify05-430ea.appspot.com", // Fixed storageBucket
  messagingSenderId: "585909962600",
  appId: "1:585909962600:web:bfbd5988a6f0f485a278dd",
  measurementId: "G-YGY1R6ZFK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const _Auth = getAuth(app);
const DB = getFirestore(app);

export { DB, _Auth };
