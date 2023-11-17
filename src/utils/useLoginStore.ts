import { onAuthStateChanged, signInWithPopup } from "@firebase/auth";
import { signOut } from "firebase/auth";
import { create } from "zustand";
import { auth, provider } from "../config/firebase";

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
  },

  handleLogout: async () => {
    await signOut(auth);
  },
}));

export default useLoginStore;
