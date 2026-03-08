import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCA850coNSMSp70Cb3pDVyM_YK4kA8Gagk",
  authDomain: "beth-summarist-auth.firebaseapp.com",
  projectId: "beth-summarist-auth",
  storageBucket: "beth-summarist-auth.firebasestorage.app",
  messagingSenderId: "163992151718",
  appId: "1:163992151718:web:c29e04bb8ca4b8c43e3667"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
