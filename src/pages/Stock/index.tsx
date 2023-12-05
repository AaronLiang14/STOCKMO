import Enterprise from "~icons/carbon/enterprise";
import NewsPaper from "~icons/fluent-emoji-high-contrast/rolled-up-newspaper";
import DownArrow from "~icons/mdi/arrow-down-bold";
import UpArrow from "~icons/mdi/arrow-up-bold";

import StockOutLined from "~icons/mdi/finance";
import Article from "~icons/ooui/articles-rtl";

import AddFavoriteStocks from "@/components/AddFavorite";
import ChatRoom from "@/components/ChatRoom";
import FinanceData from "@/data/StockDetail.json";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

interface LatestInfoType {
  close: number;
  change_price: number;
  change_rate: number;
  high: number;
  low: number;
  total_volume: number;
}

const LatestPrice = () => {
  const [latestInfo, setLatestInfo] = useState<LatestInfoType>(
    {} as LatestInfoType,
  );
  const [rise, setRise] = useState<boolean>(false);
  const { id } = useParams();

  const getLatestPrice = async () => {
    const res = await api.getTaiwanStockPriceTick(id!.toString());
    setLatestInfo(res.data[0]);
    if (res.data[0].change_rate > 0) setRise(true);
    else setRise(false);
  };

  const colorDependOnRise = rise ? " text-red-600 " : "text-green-800 ";

  useEffect(() => {
    getLatestPrice();
  }, []);

  return (
    <div className="flex flex-row justify-between">
      <div
        className={`rounded-full ${colorDependOnRise} px-2 pb-4 text-4xl font-medium`}
      >
        {latestInfo.close}
        {rise ? (
          <UpArrow className="inline-block" />
        ) : (
          <DownArrow className="inline-block transform" />
        )}
        <span className="ml-2 text-sm font-normal">
          {latestInfo.change_price} ({latestInfo.change_rate}%)
        </span>
      </div>
      <div className="flex flex-row gap-8">
        <div className="flex flex-col">
          <span className="ml-2 text-sm font-normal text-red-600">
            {latestInfo.high}
          </span>
          <span className="text-co text-sm font-normal text-red-600">
            最高價
          </span>
        </div>

        <div className="flex flex-col">
          <span className="ml-2 text-sm font-normal text-green-800">
            {latestInfo.low}
          </span>
          <span className="text-sm font-normal text-green-800">最低價</span>
        </div>

        <div className="flex flex-col">
          <span className="text-center text-sm font-normal text-gray-800">
            {latestInfo.total_volume &&
              latestInfo.total_volume.toLocaleString()}
          </span>
          <span className="text-sm font-normal text-gray-800">累積成交量</span>
        </div>
      </div>
    </div>
  );
};

export default function Stock() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const company = FinanceData.filter(
    (item) => item.SecuritiesCompanyCode === id,
  );

  const asideOptions = [
    {
      name: "最新動態",
      icon: <StockOutLined />,
      link: "latest",
    },
    {
      name: "基本資料",
      icon: <Enterprise />,
      link: "basic",
    },
    {
      name: "文章分享",
      icon: <Article />,
      option: "articles",
      link: "articles",
    },
    {
      name: "個股新聞",
      icon: <NewsPaper />,
      link: "news",
    },
  ];

  return (
    <>
      <div className="m-auto mb-24 flex min-h-[calc(100vh_-_120px)] w-11/12 flex-col  pt-24">
        <div className=" m-auto mt-8 flex w-11/12 flex-col justify-center">
          <div className="h-18 sticky top-24 z-40 mb-3 flex justify-between  py-6">
            <p className="text-4xl font-medium text-gray-900">
              {company[0].CompanyName}
              {company[0].Symbol}
            </p>
            <AddFavoriteStocks />
          </div>
          <LatestPrice />
          <div className="flex justify-start gap-8 border-b-1 text-base ">
            {asideOptions.map((item) => (
              <div
                className={`flex cursor-pointer gap-3 pb-2 ${
                  location.pathname.split("/")[3] === item.link &&
                  "border-b-3 border-blue-800"
                } hover:border-b-3 hover:border-blue-800`}
                onClick={() => navigate(`/stock/${id}/${item.link}`)}
                key={item.name}
              >
                {item.icon}
                {item.name}
              </div>
            ))}
          </div>
          <Outlet />
        </div>
      </div>

      <ChatRoom />
    </>
  );
}
