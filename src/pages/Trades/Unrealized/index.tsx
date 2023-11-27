import { auth, db } from "@/config/firebase";
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
import DetailsModal from "./DetailsModal";

const columns = [
  {
    key: "stockID",
    label: "股票代碼/名稱",
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
    key: "detail",
    label: "查看明細",
  },
  {
    key: "sell",
    label: "賣出",
  },
];

interface stockProps {
  stock_id: string;
  holding: number;
  totalCost: number;
}

export default function Unrealized() {
  const [entrustment, setEntrustment] = useState<DocumentData[]>([]);
  const [stockPrice, setStockPrice] = useState<object>({});
  const [securitiesAssets, setSecuritiesAssets] = useState<DocumentData>([]);

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

  const organizeSecuritiesAssets = () => {
    const organizeData = entrustment.reduce((acc, cur) => {
      const stockId = cur.stock_id;
      const volume = cur.order.volume;
      const price = cur.order.price;
      const cost = volume * price;
      const existingStock = acc.find(
        (stock: { stock_id: string }) => stock.stock_id === stockId,
      );
      if (cur.buy_or_sell === "買") {
        if (existingStock) {
          existingStock.holding += volume;
          existingStock.totalCost += cost;
        } else {
          acc.push({
            stock_id: stockId,
            holding: volume,
            totalCost: cost,
          });
        }
      }
      return acc;
    }, []);
    setSecuritiesAssets(organizeData);
  };

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

  const rows = securitiesAssets.map((stock: stockProps) => {
    const marketPrice = stockPrice[stock.stock_id] || 0;
    const estimatedProfitLoss = stock.holding * marketPrice - stock.totalCost;
    const returnRate = (estimatedProfitLoss / stock.totalCost) * 100;

    return {
      key: stock.stock_id,
      stockID: stock.stock_id,
      volume: stock.holding,
      averagePrice: (stock.totalCost / stock.holding).toFixed(2),
      cost: stock.totalCost.toLocaleString(),
      marketPrice: marketPrice,
      presentValue: (stock.holding * marketPrice).toLocaleString(),
      estimatedProfitLoss: estimatedProfitLoss.toLocaleString(),
      returnRate: returnRate.toFixed(2) + "%",
      sell: (
        <Button
          size="sm"
          color="danger"
          onClick={() =>
            navigate("/trades/order", { state: { stockID: stock.stock_id } })
          }
        >
          賣出
        </Button>
      ),
      detail: (
        <DetailsModal
          details={entrustment
            .filter(
              (order) =>
                order.stock_id === stock.stock_id && order.buy_or_sell === "買",
            )
            .map((doc) => ({
              id: doc.id,
              stock_id: doc.stock_id,
              order: doc.order,
            }))}
          marketPrice={stockPrice[stock.stock_id]}
        />
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
    organizeSecuritiesAssets();
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
