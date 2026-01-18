import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_JslPBtlwAP12LNkhiy23N9nMkHy2P-U",
  authDomain: "deiu-fitness.firebaseapp.com",
  projectId: "deiu-fitness",
  storageBucket: "deiu-fitness.firebasestorage.app",
  messagingSenderId: "827307745239",
  appId: "1:827307745239:web:7590b145017147bcccb592"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
};
