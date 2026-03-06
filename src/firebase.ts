import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDevZJ91ngfHfVC5e-mSIgGOiIrJEuvX88",
  authDomain: "fir-practice-e31ad.firebaseapp.com",
  projectId: "fir-practice-e31ad",
  storageBucket: "fir-practice-e31ad.firebasestorage.app",
  messagingSenderId: "216794425679",
  appId: "1:216794425679:web:445fd4c45d2a6b8800fd3a",
  measurementId: "G-569GXW593K"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
