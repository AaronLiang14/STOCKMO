import { auth, db } from "@/config/firebase";
import StockCode from "@/data/StockCode.json";
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
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

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
    key: "dealVolumePrice",
    label: "成交量/價",
  },
  {
    key: "time",
    label: "委託時間",
  },
];

export default function Deal() {
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

  const rows = entrustment.map((item) => {
    const stockName =
      StockCode.find((stock) => stock.stockCode === parseInt(item.stock_id))
        ?.stockName || "";
    if (item.status === "已成交")
      return {
        key: item.id,
        stockID: item.stock_id + " / " + stockName,
        status: item.status,
        buyOrSell: item.buy_or_sell,
        tradeType: item.trade_type,
        orderType: item.order_type,
        dealVolumePrice: item.order.volume + "股/" + item.order.price,
        time: item.order.time.toDate().toLocaleString(),
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

      {entrustment.length === 0 && (
        <p className="m-auto mt-12 text-2xl">查無資料</p>
      )}
    </div>
  );
}
