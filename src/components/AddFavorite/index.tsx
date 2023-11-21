import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { auth, db } from "../../config/firebase";

export default function AddFavoriteStocks() {
  const { id } = useParams();
  const memberRef = doc(db, "Member", auth.currentUser!.uid);
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = async () => {
    const docSnap = await getDoc(memberRef);

    if (docSnap.exists()) {
      if (docSnap.data().favorite_stocks.includes(id)) {
        await updateDoc(memberRef, {
          favorite_stocks: arrayRemove(id),
        });
        toast.success("已取消追蹤");
        return;
      } else {
        await updateDoc(memberRef, {
          favorite_stocks: arrayUnion(id),
        });
        toast.success("已加入追蹤");
      }
    }
  };

  const getFavoriteStocks = async () => {
    const docSnap = await getDoc(memberRef);
    if (docSnap.exists()) {
      setFavoriteStocks(docSnap.data().favorite_stocks);
    }
  };

  useEffect(() => {
    onSnapshot(memberRef, () => {
      getFavoriteStocks();
    });
  }, [id]);

  useEffect(() => {
    if (favoriteStocks.includes(id!)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [favoriteStocks]);

  return (
    <button
      className="group absolute right-28 top-40 mb-2 me-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-800 text-sm font-medium text-gray-900 hover:text-white focus:outline-none  focus:ring-cyan-200  dark:text-white dark:focus:ring-cyan-800"
      onClick={handleFavorite}
    >
      <span className=" relative rounded-md bg-cyan-700 px-5 py-2.5  text-white transition-all duration-75 ease-in group-hover:bg-opacity-0">
        {isFavorite ? "取消追蹤" : "加入追蹤"}
      </span>
    </button>
  );
}
