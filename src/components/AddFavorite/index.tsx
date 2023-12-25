import { auth, db } from "@/config/firebase";
import firestoreApi from "@/utils/firestoreApi";
import { Button } from "@nextui-org/react";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function AddFavoriteStocks() {
  const { id } = useParams();
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = async () => {
    if (!auth.currentUser) {
      toast.error("請先登入");
      return;
    }
    const memberData = await firestoreApi.getMemberInfo();
    if (memberData?.favorite_stocks.includes(id)) {
      await firestoreApi.updateFavoriteStocks(id!, "remove");
      toast.success("已取消追蹤");
      return;
    }
    await firestoreApi.updateFavoriteStocks(id!, "add");
    toast.success("已加入追蹤");
  };

  const getFavoriteStocks = async () => {
    const memberData = await firestoreApi.getMemberInfo();
    setFavoriteStocks(memberData?.favorite_stocks);
  };

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsubscribe = onSnapshot(
      doc(db, "Member", auth.currentUser!.uid),
      () => {
        getFavoriteStocks();
      },
    );
    return () => unsubscribe();
  }, [id, auth.currentUser]);

  useEffect(() => {
    if (favoriteStocks.includes(id!)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [favoriteStocks]);

  return (
    <Button onClick={handleFavorite} color="primary" size="sm">
      <span> {isFavorite ? "取消追蹤" : "加入追蹤"}</span>
    </Button>
  );
}
