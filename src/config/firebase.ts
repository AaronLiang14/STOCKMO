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
  apiKey: "AIzaSyC6QVESzFfgm2vIrcRX_VLMHnZkyY1MIiE",
  authDomain: "stock-mo-6ef23.firebaseapp.com",
  projectId: "stock-mo-6ef23",
  storageBucket: "stock-mo-6ef23.appspot.com",
  messagingSenderId: "1035506872246",
  appId: "1:1035506872246:web:9a7e90ee35416fbbf05b17",
  measurementId: "G-37Q0TCL071",
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
