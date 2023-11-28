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
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const columns = [
  {
    key: "stockID",
    label: "股票代碼/名稱",
  },
  {
    key: "volume",
    label: "股數",
  },
  {
    key: "buyPrice",
    label: "買價",
  },
  {
    key: "sellPrice",
    label: "賣價",
  },
  {
    key: "profitLoss",
    label: "損益",
  },
  {
    key: "fee",
    label: "手續費",
  },
  {
    key: "tax",
    label: "交易稅",
  },
  {
    key: "returnRate",
    label: "報酬率",
  },
  {
    key: "time",
    label: "時間",
  },
];

export default function Realized() {
  const [realizedStocks, setRealizedStocks] = useState<DocumentData[]>([]);

  const getRealizedStocks = async () => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    const memberDoc = await getDoc(memberRef);
    if (!memberDoc.exists()) return;
    setRealizedStocks(memberDoc.data().realized);
  };

  const rows = realizedStocks.map((stock) => {
    const buyPrice = stock.buy_price;
    const sellPrice = stock.sell_price;
    const volume = stock.volume;
    const fee = Math.round((buyPrice + sellPrice) * volume * 0.001425 * 0.3);
    const tax = Math.round(sellPrice * volume * 0.003);
    const profitLoss = (sellPrice - buyPrice) * volume;
    const returnRate = ((profitLoss - tax - fee) / (buyPrice * volume)) * 100;

    return {
      key: stock.stock_id + stock.sell_price,
      stockID: stock.stock_id,
      volume: volume.toLocaleString(),
      buyPrice: buyPrice.toLocaleString(),
      sellPrice: sellPrice,
      profitLoss: profitLoss.toLocaleString(),
      fee: fee.toLocaleString(),
      tax: tax.toLocaleString(),
      returnRate: returnRate.toFixed(2) + "%",
      time: stock.time.toDate().toLocaleString(),
    };
  });

  useEffect(() => {
    getRealizedStocks();
  }, [auth.currentUser]);

  return (
    <>
      <p>已實現</p>
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
