import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";

export default function FavoriteArticles() {
  const [favoriteArticles, setFavoriteArticles] = useState<string[]>([]);

  const getMemberInfo = async () => {
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    const docSnap = await getDoc(memberRef);
    setFavoriteArticles(docSnap.data()?.favorite_articles);
  };

  useEffect(() => {
    getMemberInfo();
  }, []);

  return (
    <>
      <p>FavoriteArticles</p>
    </>
  );
}
