import { storage } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "sonner";
import { create } from "zustand";
import { auth, db, provider } from "../config/firebase";
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
      localStorage.setItem("auth", auth.currentUser!.uid);
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
      await setDoc(doc(db, "Member", auth.currentUser!.uid), {
        avatar: imgUrl,
        email: email,
        name: name,
        favorite_articles: [],
        favorite_stocks: [],
        realized: [],
        unrealized: [],
        cash: 100000,
        securities_assets: 0,
        dashboard_layout: [],
      });
      toast.success("註冊成功");
      if (success) success();
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        if (e.message.includes("auth/email-already-in-use")) {
          return toast.error("此信箱已被註冊過");
        }
        toast.error("錯誤：" + e.message);
        throw new Error(e.message);
      } else {
        console.error("An unknown error occurred");
        throw new Error("An unknown error occurred");
      }
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
      await setDoc(doc(db, "Member", auth.currentUser!.uid), {
        avatar: auth.currentUser?.photoURL,
        email: auth.currentUser?.email,
        name: auth.currentUser?.displayName,
        favorite_articles: [],
        favorite_stocks: [],
        realized: [],
        unrealized: [],
        cash: 100000,
        securities_assets: 0,
        dashboard_layout: [],
      });
      console.log("notmember");
      toast.success("登入成功");
    } catch (e) {
      toast.error("登入失敗");
    }
  },

  handleLogout: async () => {
    await signOut(auth);
    localStorage.removeItem("auth");
  },

  handleAvatarChange: async (e) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader(); //HTML5的API，讓瀏覽器讀取本地檔案
      reader.onloadend = () => {
        set({ avatar: reader.result as string }); //reader.result 包含一個代表檔案內容資料的URL
        set({ avatarFile: file });
      };
      reader.readAsDataURL(file); //啟動 FileReader 開始讀取檔案
    }
  },
}));

interface FavoriteArticlesProps {
  favoriteArticles: string[];
  getFavoriteArticles: (callback: void) => void;
}

const useFavoritesStore = create<FavoriteArticlesProps>((set) => ({
  favoriteArticles: [],
  getFavoriteArticles: async () => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    const docSnap = await getDoc(memberRef);
    if (docSnap.exists()) {
      set({ favoriteArticles: docSnap.data().favorite_articles });
    }
  },
}));

export default useLoginStore;

export { useFavoritesStore };
