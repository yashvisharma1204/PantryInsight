// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB5qOb_VGwhagMOvCU8U5wJB-gEXweLp6Y",
    authDomain: "pantry-tracker-6b60c.firebaseapp.com",
    projectId: "pantry-tracker-6b60c",
    storageBucket: "pantry-tracker-6b60c.appspot.com",
    messagingSenderId: "666591269687",
    appId: "1:666591269687:web:7ca168d338ffe5e334c0b2",
    measurementId: "G-K5W37SQSVP"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

export { auth, db };