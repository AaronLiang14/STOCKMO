import { onAuthStateChanged, signInWithPopup } from "@firebase/auth";
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
  handleLogin: () => void;
  handleLogout: () => void;
}

const useLoginStore = create<LoginState>((set) => ({
  ...initialState,

  init: async () => {
    onAuthStateChanged(auth, (user) => {
      set({ isLogin: !!user });
    });
  },

  handleLogin: async () => {
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
