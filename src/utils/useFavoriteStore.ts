import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { auth, db } from "../config/firebase";

type FavoriteArticlesState = {
  favoriteArticles: string[];
  getFavoriteArticles: (callback: void) => void;
};

const useFavoritesStore = create<FavoriteArticlesState>((set) => ({
  favoriteArticles: [],
  getFavoriteArticles: async () => {
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    const docSnap = await getDoc(memberRef);
    if (docSnap.exists()) {
      set({ favoriteArticles: docSnap.data().favorite_articles });
    }
  },
}));

export default useFavoritesStore;
