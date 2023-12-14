import LatestStockPriceCharts from "@/components/Graph/StockPrice/LastOpeningDay";
import StockCode from "@/data/StockCode.json";
import api from "@/utils/api";
import { Card, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface StockOfIndustryProps {
  industry: string;
  market: string;
}

interface LatestStockPriceProps {
  stockID: number;
}

const LatestStockPrice = ({ stockID }: LatestStockPriceProps) => {
  const [latestPrice, setLatestPrice] = useState<number>(0);
  const [rise, setRise] = useState<boolean>(false);

  const getLatestPrice = async () => {
    const res = await api.getTaiwanStockPriceTick(stockID.toString());
    setLatestPrice(res.data[0].close);
    if (res.data[0].change_rate > 0) setRise(true);
    else setRise(false);
  };

  const colorDependOnRise = rise
    ? " text-red-800 bg-red-100"
    : "text-green-800 bg-green-100";

  useEffect(() => {
    getLatestPrice();
  }, [stockID]);

  return (
    <span
      className={`rounded-full ${colorDependOnRise} px-2 py-1 text-xs font-medium`}
    >
      收盤價{latestPrice}
    </span>
  );
};

export default function StockOfIndustry({
  industry,
  market,
}: StockOfIndustryProps) {
  const stockDependOnIndustry = StockCode.filter(
    (stock) =>
      stock.industry === industry &&
      (market === "全部" || stock.market === market),
  );

  return (
    <>
      <div
        role="list"
        className="m-auto mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-3"
      >
        {stockDependOnIndustry.map((stock) => (
          <Link className="h-64" to={`/stock/${stock.stockCode}/latest`}>
            <Card
              key={stock.stockCode}
              className="h-full cursor-pointer rounded-lg hover:scale-105"
            >
              <LatestStockPriceCharts stockID={stock.stockCode.toString()} />

              <CardBody className="z-20 flex flex-1 flex-col p-8">
                <h3 className="mt-6 text-2xl font-medium text-gray-900">
                  {stock.stockName}
                  {stock.stockCode}
                </h3>
                <div className="mt-1 flex flex-grow flex-col justify-between">
                  <p className="text-sm text-gray-500">{stock.market}</p>
                  <div className="mt-3">
                    <LatestStockPrice stockID={stock.stockCode} />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
