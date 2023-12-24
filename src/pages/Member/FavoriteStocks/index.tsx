import { auth, db } from "@/config/firebase";
import StockCode from "@/data/StockCode.json";
import api from "@/utils/finMindApi";
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    getMemberInfo();
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
      stock: <Link to={`/stock/${item}/latest`}>{item + "/" + stockName}</Link>,
      industry: industry,
      market: market,
      price: price,
      changePrice: (
        <p className={`${changePrice > 0 ? "text-red-600" : "text-green-700"}`}>
          {changePrice}
        </p>
      ),
      changeRate: (
        <div
          className={`flex w-16 justify-center  ${
            changeRate === 10 && "rounded-sm bg-red-200"
          }`}
        >
          <p
            className={`${
              changePrice > 0 ? "text-red-600" : "text-green-700"
            } ${changeRate === 10 && "rounded-lg bg-red-200"}`}
          >
            {changeRate} %
          </p>
        </div>
      ),
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
    getMemberInfo();
  }, []);

  useEffect(() => {
    getStockPrice();
  }, [favoriteStocks]);

  return (
    <>
      <div className="mx-auto mt-12 w-11/12 ">
        <div>
          {favoriteItems.length > 0 ? (
            <Table aria-label="股票收藏">
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.key}
                    className="text-sm sm:text-base"
                  >
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={favoriteItems}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell className="text-xs sm:text-base">
                        {getKeyValue(item, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center gap-12">
              <p className="text-2xl">目前沒有收藏的股票，到個股頁面看看吧</p>
              <Link to="/stock/2330/latest">
                <Button color="primary">前往個股頁面</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
