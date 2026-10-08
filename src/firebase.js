// Firebase Cloud Authentication and Database Configuration
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCkfoAux0uHhLkXEY_rE7_x2oqbI-Q1xpM",
  authDomain: "to-do-list-110bb.firebaseapp.com",
  projectId: "to-do-list-110bb",
  storageBucket: "to-do-list-110bb.firebasestorage.app",
  messagingSenderId: "550845859859",
  appId: "1:550845859859:web:5bb5c096d6a0cc19b8d7e6",
  measurementId: "G-GK11TCKV1M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateFirebaseProfile,
  doc,
  getDoc,
  setDoc,
  updateDoc
};
