// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAT5vb1xQiRs2iG9VN2XrfsfIbDabeiCrc",
  authDomain: "buks-21c16.firebaseapp.com",
  projectId: "buks-21c16",
  storageBucket: "buks-21c16.appspot.com", // correto
  messagingSenderId: "1023288432204",
  appId: "1:1023288432204:web:42192d8dafd1f067d206e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export auth
const auth = getAuth(app);

export { auth };