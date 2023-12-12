import TradesModal from "@/components/Modals/Trades";
import { auth, db } from "@/config/firebase";
import { Button } from "@nextui-org/react";
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

export default function AddFavoriteStocks() {
  const { id } = useParams();

  const userUid = auth?.currentUser?.uid;
  const memberRef = userUid ? doc(db, "Member", userUid) : null;
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const handleFavorite = async () => {
    if (memberRef === null) return;
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
    if (memberRef === null) return;

    const docSnap = await getDoc(memberRef);
    if (docSnap.exists()) {
      setFavoriteStocks(docSnap.data().favorite_stocks);
    }
  };

  useEffect(() => {
    if (memberRef === null) return;
    onSnapshot(memberRef, () => {
      getFavoriteStocks();
    });
  }, [id]);

  useEffect(() => {
    if (favoriteStocks.includes(id!) && auth.currentUser) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [favoriteStocks]);

  return (
    <div className="flex gap-4">
      {auth.currentUser ? (
        <Button onClick={handleFavorite} color="primary">
          <span> {isFavorite ? "取消追蹤" : "加入追蹤"}</span>
        </Button>
      ) : (
        <Button color="primary" onClick={() => toast.error("請先登入")}>
          <span>加入追蹤</span>
        </Button>
      )}
      {auth.currentUser ? (
        <TradesModal />
      ) : (
        <Button color="danger" onClick={() => toast.error("請先登入")}>
          <span>模擬下單</span>
        </Button>
      )}
    </div>
  );
}
