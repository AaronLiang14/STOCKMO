import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";

export default function FavoriteStocks() {
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>([]);

  const getMemberInfo = async () => {
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    const docSnap = await getDoc(memberRef);
    setFavoriteStocks(docSnap.data()?.favorite_stocks);
  };

  useEffect(() => {
    getMemberInfo();
  }, []);

  return (
    <>
      <p>FavoriteStocks</p>
    </>
  );
}