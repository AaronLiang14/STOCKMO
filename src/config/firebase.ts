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
  apiKey: "AIzaSyDGGhHG9vOA6m428rHXfUurMDqDoigTlYw",
  authDomain: "stockmo-ab857.firebaseapp.com",
  projectId: "stockmo-ab857",
  storageBucket: "stockmo-ab857.appspot.com",
  messagingSenderId: "56636594409",
  appId: "1:56636594409:web:369784878ef5f89c153878",
  measurementId: "G-QKDD289HCC",
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
