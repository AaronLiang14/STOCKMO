import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { collection, doc, query, setDoc, where } from "firebase/firestore";
import { create } from "zustand";
import { auth, db, provider } from "../config/firebase";

interface LoginState {
  isLogin: boolean;
  init: () => void;
  handleGoogleLogin: () => void;
  handleLogout: () => void;
  handleNativeSignUp: (email: string, password: string, name: string) => void;
  handleNativeLogin: (email: string, password: string) => void;
}

const initialState = {
  isLogin: false,
};

const useLoginStore = create<LoginState>((set) => ({
  ...initialState,

  init: async () => {
    onAuthStateChanged(auth, (user) => {
      set({ isLogin: !!user });
    });
  },

  handleNativeSignUp: async (email: string, password: string, name: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser!, { displayName: name });
    await setDoc(doc(db, "Member", auth.currentUser!.uid), {
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
    const member = query(
      collection(db, "Member"),
      where("email", "==", auth.currentUser?.email),
    );
    if (member) return;
    await setDoc(doc(db, "Member", auth.currentUser!.uid), {
      avatar: auth.currentUser?.photoURL,
      email: auth.currentUser?.email,
      name: auth.currentUser?.displayName,
      favorite_articles: [],
      favorite_stocks: [],
      realized: [],
      unrealized: [],
      cash: 100000,
    });
  },

  handleLogout: async () => {
    await signOut(auth);
  },
}));

export default useLoginStore;
