// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvRh17YVcEyffSiDQ019E9MUZzG2-9Oio",
  authDomain: "rentalorg-firebase.firebaseapp.com",
  projectId: "rentalorg-firebase",
  storageBucket: "rentalorg-firebase.firebasestorage.app",
  messagingSenderId: "489685808326",
  appId: "1:489685808326:web:77bb544cd6fce2b248d3c7",
  measurementId: "G-ENBFMZKV47",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
