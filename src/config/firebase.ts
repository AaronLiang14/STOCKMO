// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOtE-srSrz8moa_Ggtr0p0W-1qB6mJ9ko",
  authDomain: "stock-mo2.firebaseapp.com",
  projectId: "stock-mo2",
  storageBucket: "stock-mo2.appspot.com",
  messagingSenderId: "519215357743",
  appId: "1:519215357743:web:01e8d7045d0a9fe856cbda",
  measurementId: "G-GN4HJR6BV0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

async function initializeAuth() {
  await setPersistence(auth, browserLocalPersistence);
}

initializeAuth();
export { auth, db, provider, storage };
