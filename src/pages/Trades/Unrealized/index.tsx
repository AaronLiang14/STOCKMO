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
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    key: "sell",
    label: "賣出",
  },
];

export default function Unrealized() {
  const [stockPrice, setStockPrice] = useState<{ [key: string]: number }>({});
  const [unrealizedStocks, setUnrealizedStocks] = useState<DocumentData[]>([]);
  const navigate = useNavigate();

  const getUnrealizedStocks = async () => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    const memberDoc = await getDoc(memberRef);

    if (!memberDoc.exists()) return;
    setUnrealizedStocks(memberDoc.data().unrealized);
  };

  const getMarketPrice = async () => {
    try {
      unrealizedStocks.map(async (stock) => {
        const res = await api.getTaiwanStockPriceTick(stock.stock_id);
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

  const rows = unrealizedStocks.map((stock) => {
    if (stock.volume === 0) return;
    const marketPrice = stockPrice[stock.stock_id] || 0;
    const averagePrice = stock.average_price || 0;
    const cost = averagePrice * stock.volume;
    const estimatedProfitLoss = stock.volume * marketPrice - cost;
    const returnRate = (estimatedProfitLoss / cost) * 100;

    return {
      key: stock.stock_id,
      stockID: stock.stock_id,
      volume: stock.volume.toLocaleString(),
      averagePrice: averagePrice.toFixed(2),
      cost: cost.toLocaleString(),
      marketPrice: marketPrice,
      presentValue: (stock.volume * marketPrice).toLocaleString(),
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
    };
  });

  useEffect(() => {
    getUnrealizedStocks();
  }, [auth.currentUser]);

  useEffect(() => {
    getMarketPrice();
  }, [unrealizedStocks]);

  return (
    <>
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
        {unrealizedStocks.length === 0 && (
          <p className="m-auto mt-12 text-2xl">查無資料</p>
        )}
      </div>
    </>
  );
}
