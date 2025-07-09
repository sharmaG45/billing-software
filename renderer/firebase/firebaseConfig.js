import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfJ93zzk7XvYj6iIl9S9YAcR5dBI-Eu7c",
  authDomain: "paudhwala-bill.firebaseapp.com",
  projectId: "paudhwala-bill",
  storageBucket: "paudhwala-bill.firebasestorage.app",
  messagingSenderId: "678176320080",
  appId: "1:678176320080:web:b4ec5c6137a835721fbf55",
  measurementId: "G-MXVJWDJ6SP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
