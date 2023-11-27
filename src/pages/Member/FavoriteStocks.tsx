import { auth, db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

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
      {favoriteStocks.map((item) => (
        <p>{item}</p>
      ))}
      <p>FavoriteStocks</p>
    </>
  );
}
