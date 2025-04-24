import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDU0Lls8dcyebSUUhoFN8ZcmQsEjHXx0QI",
  authDomain: "fir-nimble-12a33.firebaseapp.com",
  projectId: "fir-nimble-12a33",
  storageBucket: "fir-nimble-12a33.firebasestorage.app",
  messagingSenderId: "87860403726",
  appId: "1:87860403726:web:879b3ebe8598c85781665f",
  measurementId: "G-27WYCRP52L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, collection, getDocs, auth };