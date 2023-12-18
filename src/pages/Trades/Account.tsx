import { auth, db } from "@/config/firebase";
import api from "@/utils/api";
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
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const columns = [
  {
    key: "cash",
    label: "現金資產",
  },
  {
    key: "securitiesAssets",
    label: "證券資產",
  },
  {
    key: "netAssets",
    label: "淨資產",
  },
];

interface memberStocksProps {
  stock_id: string;
  volume: number;
  average_price: number;
}

export default function Account() {
  const [cash, setCash] = useState<number>(0);
  const [securitiesAssets, setSecuritiesAssets] = useState<number>(0);
  const [unrealizedStocks, setUnrealizedStocks] = useState<DocumentData[]>([]);
  const [stockPrice, setStockPrice] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const getAssets = async () => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser.uid);
    const memberDoc = await getDoc(memberRef);
    const memberData = memberDoc.data();

    setCash(memberData?.cash);
    setSecuritiesAssets(
      memberData?.unrealized.reduce((acc: number, cur: memberStocksProps) => {
        return acc + cur.volume * stockPrice[cur.stock_id];
      }, 0),
    );
  };

  useEffect(() => {
    getUnrealizedStocks();
  }, [auth.currentUser]);

  useEffect(() => {
    getMarketPrice();
  }, [unrealizedStocks]);

  useEffect(() => {
    getAssets();
  }, [stockPrice]);

  const rows = [
    {
      key: "cash",
      cash: cash.toLocaleString(),
      securitiesAssets: isLoading ? (
        <Spinner />
      ) : (
        securitiesAssets.toLocaleString()
      ),
      netAssets: (cash + securitiesAssets).toLocaleString(),
    },
  ];

  return (
    <>
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
      </div>
    </>
  );
}
