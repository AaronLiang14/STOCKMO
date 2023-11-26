import StockCode from "@/data/StockCode.json";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
interface StockOfIndustryProps {
  industry: string;
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

export default function StockOfIndustry({ industry }: StockOfIndustryProps) {
  const stockDependOnIndustry = StockCode.filter(
    (stock) => stock.產業別 === industry,
  );
  const navigate = useNavigate();
  return (
    <ul
      role="list"
      className="m-auto grid cursor-pointer grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:mt-6 lg:max-w-[1280px] lg:grid-cols-4"
    >
      {stockDependOnIndustry.map((stock) => (
        <li
          key={stock.證券代號}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-gray-100 text-center shadow"
          onClick={() => navigate(`/stock/${stock.證券代號}`)}
        >
          <div className="flex flex-1 flex-col p-8">
            <img className="mx-auto  flex-shrink-0 rounded-full" alt="" />
            <h3 className="mt-6 text-sm font-medium text-gray-900">
              {stock.證券名稱}
              {stock.證券代號}
            </h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Title</dt>
              <dd className="text-sm text-gray-500">{stock.市場別}</dd>
              <dt className="sr-only">Role</dt>
              <dd className="mt-3">
                <LatestStockPrice stockID={stock.證券代號} />
              </dd>
            </dl>
          </div>
        </li>
      ))}
    </ul>
  );
}
