import { auth, db } from "@/config/firebase";
import { DocumentData } from "@firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import StockCode from "@/data/StockCode.json";
import CancelModal from "./CancelEntrustmentModal.tsx";

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

  const orderQuery = query(
    collection(db, "Trades"),
    where("member_id", "==", auth.currentUser?.uid || ""),
  );

  const getOrders = async () => {
    if (!auth.currentUser) return;
    setEntrustment([]); //避免資料重複

    const orders = await getDocs(orderQuery);
    orders.forEach((doc) => {
      setEntrustment((prev) => [...prev, doc.data()]);
    });
  };

  const cancelEntrustment = async (id: string) => {
    const entrustmentRef = doc(db, "Trades", id);
    await updateDoc(entrustmentRef, {
      status: "已取消",
    });
    toast.success("成功取消委託");
    setEntrustment([]); //避免資料重複
    getOrders();
  };

  const rows = entrustment.map((item) => {
    const stockName =
      StockCode.find((stock) => stock.證券代號 === parseInt(item.stock_id))
        ?.證券名稱 || "";
    if (item.status !== "已成交")
      return {
        key: item.id,
        stockID: item.stock_id + " / " + stockName,
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

  useEffect(() => {
    onSnapshot(orderQuery, () => {
      getOrders();
    });
  }, [auth.currentUser]);

  return (
    <div className="flex flex-col gap-3">
      <Table
        aria-label="Rows actions table example with dynamic content"
        selectionMode="multiple"
        selectionBehavior="replace"
        onRowAction={(key) => alert(`Opening item ${key}...`)}
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
    </div>
  );
}