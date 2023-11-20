import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "@firebase/auth";
import { signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { create } from "zustand";
import { auth, db, provider } from "../config/firebase";
const initialState = {
  isLogin: false,
};

interface LoginState {
  isLogin: boolean;
  init: () => void;
  handleGoogleLogin: () => void;
  handleLogout: () => void;
  handleNativeSignUp: (email: string, password: string, name: string) => void;
  handleNativeLogin: (email: string, password: string) => void;
}

const useLoginStore = create<LoginState>((set) => ({
  ...initialState,

  init: async () => {
    onAuthStateChanged(auth, (user) => {
      set({ isLogin: !!user });
    });
  },

  handleNativeSignUp: async (email: string, password: string, name: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "Member", auth.lastNotifiedUid), {
      avatar: auth.currentUser?.photoURL,
      email: auth.currentUser?.email,
      name: name,
      favorite_articles: [],
      favorite_stocks: [],
    });
  },

  handleNativeLogin: async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  handleGoogleLogin: async () => {
    await signInWithPopup(auth, provider);
    await setDoc(doc(db, "Member", auth.lastNotifiedUid), {
      avatar: auth.currentUser?.photoURL,
      email: auth.currentUser?.email,
      name: auth.currentUser?.displayName,
      favorite_articles: [],
      favorite_stocks: [],
    });
  },

  handleLogout: async () => {
    await signOut(auth);
  },
}));

export default useLoginStore;
