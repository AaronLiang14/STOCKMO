import { auth, db } from "@/config/firebase";
import StockCode from "@/data/StockCode.json";
import api from "@/utils/api";
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
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddFavorite from "./AddFavoriteSearchBox";

const columns = [
  {
    key: "stock",
    label: "股票名稱",
  },
  {
    key: "industry",
    label: "產業類別",
  },
  {
    key: "market",
    label: "市場別",
  },
  {
    key: "price",
    label: "股價",
  },
  {
    key: "changePrice",
    label: "漲跌",
  },
  {
    key: "changeRate",
    label: "漲跌幅",
  },
  {
    key: "cancel",
    label: "取消收藏",
  },
];

interface StockProps {
  close: number;
  change_price: number;
  change_rate: number;
}

export default function FavoriteStocks() {
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>([]);
  const [stockPrice, setStockPrice] = useState<{
    [key: number]: StockProps[];
  }>({});

  const getMemberInfo = async () => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    const docSnap = await getDoc(memberRef);
    setFavoriteStocks(docSnap.data()?.favorite_stocks);
  };

  const getStockPrice = async () => {
    favoriteStocks.map(async (item) => {
      const res = await api.getTaiwanStockPriceTick(item);
      setStockPrice((stockPrice) => ({
        ...stockPrice,
        [item]: res.data,
      }));
    });
  };

  const handleCancelFavorite = async (id: string) => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    await updateDoc(memberRef, {
      favorite_stocks: favoriteStocks.filter((item) => item !== id),
    });
  };

  const favoriteItems = favoriteStocks.map((item) => {
    const industry = StockCode.filter(
      (stock) => stock.stockCode.toString() === item,
    )[0].industry;

    const market = StockCode.filter(
      (stock) => stock.stockCode.toString() === item,
    )[0].market;

    const stockName = StockCode.filter(
      (stock) => stock.stockCode.toString() === item,
    )[0].stockName;

    const price = stockPrice[parseInt(item)]?.[0]?.close;
    const changePrice = stockPrice[parseInt(item)]?.[0]?.change_price;
    const changeRate = stockPrice[parseInt(item)]?.[0]?.change_rate;

    return {
      id: item,
      stock: item + "/" + stockName,
      industry: industry,
      market: market,
      price: price,
      changePrice: changePrice,
      changeRate: changeRate + "%",
      cancel: (
        <Button
          color="danger"
          size="sm"
          onClick={() => handleCancelFavorite(item)}
        >
          移除
        </Button>
      ),
    };
  });

  useEffect(() => {
    if (auth.currentUser)
      onSnapshot(doc(db, "Member", auth.currentUser.uid), () => {
        getMemberInfo();
      });
  }, [auth.currentUser]);

  useEffect(() => {
    getStockPrice();
  }, [favoriteStocks]);

  return (
    <>
      <div className="mt-24 w-full">
        <AddFavorite />
        <div>
          <Table aria-label="我的最愛的股票" className=" mt-8 pr-8">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={favoriteItems}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
