import { useState } from "react";
import Enterprise from "~icons/carbon/enterprise";
import NewsPaper from "~icons/fluent-emoji-high-contrast/rolled-up-newspaper";
import Dashboard from "~icons/material-symbols/space-dashboard";
import StockOutLined from "~icons/mdi/finance";
import Article from "~icons/ooui/articles-rtl";

import AddFavoriteStocks from "@/components/AddFavorite";
import ChatRoom from "@/components/ChatRoom";
import FinanceData from "@/data/StockDetail.json";
import { Button } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Articles from "./Articles";
import BasicInformation from "./BasicInformation";
import Latest from "./Latest";
import News from "./News";
import Report from "./Report";

import { auth } from "@/config/firebase";

export default function Stock() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<string>("latest");
  const company = FinanceData.filter(
    (item) => item.SecuritiesCompanyCode === id,
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "latest":
        return <Latest />;
      case "Basic":
        return <BasicInformation />;
      case "dashboard":
        return <Latest />;
      case "finance":
        return <Report />;
      case "articles":
        return <Articles />;
      case "news":
        return <News />;
      default:
        return null;
    }
  };

  const asideOptions = [
    {
      name: "最新動態",
      icon: <StockOutLined />,
      option: "latest",
    },
    {
      name: "基本資料",
      icon: <Enterprise />,
      option: "Basic",
    },
    {
      name: "儀表板",
      icon: <Dashboard />,
      option: "dashboard",
    },
    {
      name: "文章分享",
      icon: <Article />,
      option: "articles",
    },
    {
      name: "個股新聞",
      icon: <NewsPaper />,
      option: "news",
    },
  ];

  return (
    <>
      <div className="flex flex-row">
        <aside className="mx-8 mt-40 h-full w-60">
          <div className="w-full rounded-lg bg-gray-300 px-3 py-4">
            <ul className=" cursor-pointer space-y-2 font-medium">
              {asideOptions.map((item, index) => (
                <li key={index}>
                  <div
                    className={`group flex items-center rounded-lg p-2 text-gray-900 ${
                      activeTab === item.option && "bg-gray-100"
                    } `}
                    onClick={() => setActiveTab(item.option)}
                  >
                    {item.icon}
                    <span className="ms-3">{item.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <div className=" m-auto mt-16 flex w-[1280px] flex-col justify-center">
          <div className="flex justify-between">
            <h1 className="text-4xl font-semibold text-gray-900">
              {company[0].SecuritiesCompanyCode}
              {company[0].CompanyName}
              {company[0].Symbol}
            </h1>
            {auth.currentUser ? (
              <AddFavoriteStocks />
            ) : (
              <Button onClick={() => toast.error("請先登入")} color="primary">
                <span>加入追蹤</span>
              </Button>
            )}
          </div>
          {renderTabContent()}
        </div>
      </div>

      <ChatRoom />
    </>
  );
}
