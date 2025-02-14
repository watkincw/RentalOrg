import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
// Analytics
// import { getAnalytics } from "firebase/analytics";

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
export const app = initializeApp(firebaseConfig);
// Initialize db
export const db = getFirestore(app);
// Initialize Auth
export const firebaseAuth = getAuth(app);

export const getUsers = async () => {
  const usersCol = collection(db, "users");
  const usersSnap = await getDocs(usersCol);
  const userList = usersSnap.docs.map((doc) => doc.data());

  return userList;
};

// Initialize Analytics
// const analytics = getAnalytics(app);
