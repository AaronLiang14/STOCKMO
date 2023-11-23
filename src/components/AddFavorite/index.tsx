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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { auth, db } from "../../config/firebase";

export default function AddFavoriteStocks() {
  const { id } = useParams();
  const memberRef = doc(db, "Member", auth.currentUser!.uid);
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

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
    <>
      <Button onClick={handleFavorite} color="primary">
        <span> {isFavorite ? "取消追蹤" : "加入追蹤"}</span>
      </Button>

      <Button
        color="danger"
        onClick={() => navigate("/trades", { state: { stockID: id } })}
      >
        <span> 模擬下單</span>
      </Button>
    </>
  );
}
