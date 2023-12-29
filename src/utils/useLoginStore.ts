import { storage } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "sonner";
import { create } from "zustand";
import { auth, db, provider } from "../config/firebase";
import firestoreApi from "./firestoreApi";
interface LoginProps {
  avatarFile: object;
  avatar: string;
  isLogin: boolean;
  init: () => void;
  handleGoogleLogin: () => void;
  handleLogout: () => void;
  handleNativeSignUp: (
    email: string,
    password: string,
    name: string,
    avatarFile: File,
    success: () => void,
  ) => void;
  handleNativeLogin: (
    email: string,
    password: string,
    success: () => void,
  ) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const loginInitialState = {
  isLogin: false,
  avatar: "",
  avatarFile: File,
};

const useLoginStore = create<LoginProps>((set) => ({
  ...loginInitialState,

  init: async () => {
    onAuthStateChanged(auth, (user) => {
      set({ isLogin: !!user });
    });
  },

  handleNativeSignUp: async (
    email: string,
    password: string,
    name: string,
    avatarFile: File,
    success: () => void,
  ) => {
    try {
      const imageRef = ref(storage, `images/${avatarFile.name}`);
      const imgUploadBytes = await uploadBytes(imageRef, avatarFile);
      const imgUrl = await getDownloadURL(imgUploadBytes.ref);

      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser!, { displayName: name });
      await updateProfile(auth.currentUser!, { photoURL: imgUrl });
      firestoreApi.setupMemberInfo(imgUrl, email, name);
      toast.success("註冊成功");
      if (success) success();
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.includes("auth/email-already-in-use")) {
          return toast.error("此信箱已被註冊過");
        }
        toast.error("錯誤：" + e.message);
        throw new Error(e.message);
      }
      throw new Error("An unknown error occurred");
    }
  },

  handleNativeLogin: async (
    email: string,
    password: string,
    success: () => void,
  ) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("登入成功");
      if (success) success();
    } catch (e) {
      toast.error("帳號或密碼錯誤，登入失敗");
      return;
    }
  },

  handleGoogleLogin: async () => {
    try {
      await signInWithPopup(auth, provider);
      const member = query(
        collection(db, "Member"),
        where("email", "==", auth.currentUser?.email),
      );
      const querySnapshot = await getDocs(member);
      if (!querySnapshot.empty) return;
      firestoreApi.setupMemberInfo(
        auth.currentUser?.photoURL as string,
        auth.currentUser?.email as string,
        auth.currentUser?.displayName as string,
      );
      toast.success("登入成功");
    } catch (e) {
      toast.error("登入失敗");
    }
  },

  handleLogout: async () => {
    await signOut(auth);
  },

  handleAvatarChange: async (e) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        set({ avatar: reader.result as string });
        set({ avatarFile: file });
      };
      reader.readAsDataURL(file);
    }
  },
}));

export default useLoginStore;
