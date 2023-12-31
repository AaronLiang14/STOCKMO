import { auth } from "@/config/firebase";
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
    key: "fee",
    label: "手續費",
  },
  {
    key: "tax",
    label: "交易稅",
  },
  {
    key: "totalProfitLoss",
    label: "總損益",
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
  const [isLoading, setIsLoading] = useState(true);

  const getRealizedStocks = async () => {
    try {
      const memberData = await firestoreApi.getMemberInfo(
        auth.currentUser!.uid,
      );
      setRealizedStocks(memberData?.realized);
    } finally {
      setIsLoading(false);
    }
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
      fee: fee.toLocaleString(),
      tax: tax.toLocaleString(),
      totalProfitLoss: (profitLoss - tax - fee).toLocaleString(),
      returnRate: returnRate.toFixed(2) + "%",
      time: stock.time.toDate().toLocaleString(),
    };
  });

  useEffect(() => {
    getRealizedStocks();
  }, [auth.currentUser]);

  return (
    <>
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

        {realizedStocks.length === 0 && !isLoading && (
          <p className="m-auto mt-12 text-2xl">查無資料</p>
        )}
      </div>
    </>
  );
}
