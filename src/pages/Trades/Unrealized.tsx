import { auth, db } from "@/config/firebase";
import StockCode from "@/data/StockCode.json";
import api from "@/utils/api";
import { DocumentData } from "@firebase/firestore";
import {
  Button,
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const columns = [
  {
    key: "stockID",
    label: "股票代碼/名稱",
  },
  {
    key: "tradeType",
    label: "交易類別",
  },
  {
    key: "volume",
    label: "持有股數",
  },
  {
    key: "averagePrice",
    label: "成交均價",
  },
  {
    key: "marketPrice",
    label: "市價",
  },
  {
    key: "presentValue",
    label: "現值",
  },
  {
    key: "cost",
    label: "付出成本",
  },
  {
    key: "estimatedProfitLoss",
    label: "預估損益",
  },

  {
    key: "returnRate",
    label: "報酬率",
  },
  {
    key: "sell",
    label: "賣出",
  },
];

export default function Unrealized() {
  const [entrustment, setEntrustment] = useState<DocumentData[]>([]);
  const [stockPrice, setStockPrice] = useState<object>({});
  const navigate = useNavigate();

  const orderQuery = query(
    collection(db, "Trades"),
    where("member_id", "==", auth.currentUser?.uid || ""),
    where("status", "==", "已成交"),
  );

  const getOrders = async () => {
    if (!auth.currentUser) return;
    setEntrustment([]); //避免資料重複
    const orders = await getDocs(orderQuery);
    orders.forEach((doc) => {
      setEntrustment((prev) => [...prev, doc.data()]);
    });
  };

  const uniqueStockIds = [
    ...new Set(entrustment.map((order) => order.stock_id)),
  ];

  const getStockPrice = async () => {
    try {
      uniqueStockIds.map(async (stockId) => {
        const res = await api.getTaiwanStockPriceTick(stockId);
        res.data.map((stock: { stock_id: string; close: number }) => {
          setStockPrice((prev) => ({
            ...prev,
            [stock.stock_id]: stock.close,
          }));
        });
      });
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
      console.log(error);
    }
  };

  console.log(entrustment);

  const rows = entrustment.map((item) => {
    const cost = item.order.price * item.order.volume;
    const marketPrice = stockPrice[item.stock_id] || 0;
    const estimatedProfitLoss =
      (marketPrice - item.order.price) * item.order.volume;
    const returnRate = (estimatedProfitLoss / cost) * 100;

    const stockName =
      StockCode.find((stock) => stock.證券代號 === parseInt(item.stock_id))
        ?.證券名稱 || "";

    return {
      key: item.id,
      stockID: item.stock_id + " / " + stockName,
      tradeType: item.trade_type,
      volume: item.order.volume + "股",
      averagePrice: item.order.price,
      presentValue: (item.order.volume * marketPrice).toLocaleString(),
      marketPrice: marketPrice,
      cost: cost.toLocaleString(),
      estimatedProfitLoss: estimatedProfitLoss.toLocaleString(),
      returnRate: returnRate.toFixed(2) + "%",
      sell: (
        <Button
          size="sm"
          color="danger"
          onClick={() =>
            navigate("/trades/order", { state: { stockID: item.stock_id } })
          }
        >
          賣出
        </Button>
      ),
    };
  });

  useEffect(() => {
    onSnapshot(orderQuery, () => {
      getOrders();
    });
  }, [auth.currentUser]);

  useEffect(() => {
    getStockPrice();
  }, [entrustment]);

  return (
    <>
      <p>未實現</p>
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
    </>
  );
}
