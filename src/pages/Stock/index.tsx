import AddFavoriteStocks from "@/components/AddFavorite";
import ChatRoom from "@/components/ChatRoom";
import TradesModal from "@/components/Modals/Trades";
import FinanceData from "@/data/StockDetail.json";
import api from "@/utils/finMindApi";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import Enterprise from "~icons/carbon/enterprise";
import NewsPaper from "~icons/fluent-emoji-high-contrast/rolled-up-newspaper";
import DownArrow from "~icons/mdi/arrow-down-bold";
import UpArrow from "~icons/mdi/arrow-up-bold";
import StockOutLined from "~icons/mdi/finance";
import Article from "~icons/ooui/articles-rtl";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getLatestPrice = async () => {
    try {
      const res = await api.getTaiwanStockPriceTick(id!.toString());
      setLatestInfo(res.data[0]);
      if (res.data[0].change_rate > 0) {
        setRise(true);
        return;
      }
      setRise(false);
    } finally {
      setIsLoading(false);
    }
  };

  const colorDependOnRiseAndFall = rise ? " text-red-600 " : "text-green-800 ";

  useEffect(() => {
    getLatestPrice();
  }, [id]);

  return (
    <div className="flex flex-row justify-between">
      <div
        className={`rounded-full ${colorDependOnRiseAndFall} px-2 pb-4 text-3xl font-medium md:text-4xl`}
      >
        {latestInfo.close}
        {rise ? (
          <UpArrow className="inline-block" />
        ) : (
          <DownArrow className="inline-block transform" />
        )}
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <span className="ml-2 text-xs font-normal md:text-sm">
            {latestInfo.change_price} ({latestInfo.change_rate}%)
          </span>
        )}
      </div>
      <div className="flex flex-row gap-2 md:gap-8">
        <div className="flex flex-col items-center">
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <span className="text-xs font-normal text-red-600 md:text-sm">
              {latestInfo.high}
            </span>
          )}

          <span className="flex-col text-xs  font-normal text-red-600 md:text-sm">
            最高價
          </span>
        </div>

        <div className="flex flex-col  items-center">
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <span className=" text-xs  font-normal text-green-800 md:text-sm">
              {latestInfo.low}
            </span>
          )}
          <span className="text-xs  font-normal text-green-800 md:text-sm">
            最低價
          </span>
        </div>

        <div className="flex flex-col">
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <span className="text-center text-xs font-normal text-gray-800 md:text-sm">
              {latestInfo.total_volume &&
                latestInfo.total_volume.toLocaleString()}
            </span>
          )}

          <span className="text-xs font-normal text-gray-800 md:text-sm">
            累積成交量
          </span>
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

  const subTitle = [
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
      <div className="m-auto mb-24 flex min-h-[calc(100vh_-_120px)] w-full flex-col pt-20 sm:w-11/12">
        <div className="mx-auto flex w-11/12 flex-col justify-center">
          <div className="sticky top-20 z-20 mb-3 flex items-center justify-between bg-white py-6">
            <p className="text-xl font-medium text-gray-900 sm:text-3xl ">
              {company[0].CompanyName} {company[0].Symbol}
            </p>
            <div className="flex flex-col gap-1 sm:flex-row">
              <AddFavoriteStocks />
              <TradesModal />
            </div>
          </div>
          <LatestPrice />
          <div className="flex justify-start gap-4 border-b-1 text-sm sm:gap-8 sm:text-base">
            {subTitle.map((item) => (
              <div
                className={`flex cursor-pointer items-center gap-1 pb-2 sm:gap-3 ${
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
