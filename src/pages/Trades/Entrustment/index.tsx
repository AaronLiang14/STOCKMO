import { auth, db } from "@/config/firebase";
import api from "@/utils/finMindApi";
import firestoreApi from "@/utils/firestoreApi";
import { DocumentData } from "@firebase/firestore";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CancelModal from "./CancelEntrustmentModal";

const columns = [
  {
    key: "stockID",
    label: "股票代碼/名稱",
  },
  {
    key: "status",
    label: "委託狀態",
  },
  {
    key: "buyOrSell",
    label: "買/賣",
  },
  {
    key: "tradeType",
    label: "交易類別",
  },
  {
    key: "orderType",
    label: "下單類別",
  },
  {
    key: "orderVolumePrice",
    label: "委託量/價",
  },
  {
    key: "time",
    label: "委託時間",
  },
  {
    key: "cancel",
    label: "取消委託",
  },
];

export default function Entrustment() {
  const [entrustment, setEntrustment] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const orderQuery = query(
    collection(db, "Trades"),
    where("member_id", "==", auth.currentUser?.uid || ""),
  );

  const getOrders = async () => {
    try {
      if (!auth.currentUser) return;
      setEntrustment([]); //避免資料重複
      const orders = await firestoreApi.getEntrustment();
      orders!.forEach((doc) => {
        setEntrustment((prev) => [...prev, doc.data()]);
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEntrustment = async (id: string) => {
    firestoreApi.cancelEntrustment(id);
    toast.success("成功取消委託");
    setEntrustment([]); //避免資料重複
    getOrders();
  };

  const rows = entrustment.map((item) => {
    if (item.status !== "已成交") console.log(item);
    return {
      key: item.id,
      stockID: item.stock_id,
      buyOrSell: item.buy_or_sell,
      status: item.status,
      tradeType: item.trade_type,
      orderType: item.order_type,
      orderVolumePrice: item.order.volume + "股/" + item.order.price,
      time: item.order.time.toDate().toLocaleString(),
      cancel: item.status === "委託成功" && (
        <CancelModal cancelEntrustment={() => cancelEntrustment(item.id)} />
      ),
    };
  });

  const matchEntrustment = async () => {
    entrustment.map(async (item) => {
      if (item.status === "委託成功") {
        const stockPrice = await api.getTaiwanStockPriceTick(item.stock_id);
        const marketPrice = stockPrice.data[0].close;
        if (
          (item.buy_or_sell === "買" && item.order.price >= marketPrice) ||
          (item.buy_or_sell === "賣" && item.order.price <= marketPrice)
        ) {
          firestoreApi.matchmaking(item.id, item.buy_or_sell, item.order.price);
          toast.success("成交");
        }
      }
    });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(orderQuery, () => {
      getOrders();
    });
    return () => unsubscribe();
  }, [auth.currentUser]);

  useEffect(() => {
    matchEntrustment();
  }, [entrustment]);

  return (
    <div className="flex flex-col gap-3">
      {isLoading ? (
        <Spinner />
      ) : (
        <Table
          aria-label="Rows actions table example with dynamic content"
          selectionMode="multiple"
          selectionBehavior="replace"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow key={item!.key}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {entrustment.length === 0 && !isLoading && (
        <p className="m-auto mt-12 text-2xl">查無資料</p>
      )}
    </div>
  );
}
