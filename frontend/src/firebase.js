// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlxvZzY8o2etPum7Xe0EPr6kn0Mtjoyws",
  authDomain: "ai-chatbot-bb4f1.firebaseapp.com",
  projectId: "ai-chatbot-bb4f1",
  storageBucket: "ai-chatbot-bb4f1.appspot.com",
  messagingSenderId: "324773607590",
  appId: "1:324773607590:web:e3d6ae8ac7406b09eadc67",
  measurementId: "G-WCHJS85G33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();

export {auth, provider, signInWithPopup};