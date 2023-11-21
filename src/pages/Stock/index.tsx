import { useEffect, useState } from "react";
import Enterprise from "~icons/carbon/enterprise";
import Dashboard from "~icons/material-symbols/space-dashboard";
import StockOutLined from "~icons/mdi/finance";
import NewsPaper from "~icons/noto/rolled-up-newspaper";
import Article from "~icons/ooui/articles-rtl";

import { useParams } from "react-router-dom";
import { toast } from "sonner";
import AddFavoriteStocks from "../../components/AddFavorite";
import ChatRoom from "../../components/ChatRoom";
import FinanceData from "../../data/TWSE.json";
import useLoginStore from "../../utils/useLoginStore";
import Articles from "./Articles";
import BasicInformation from "./BasicInformation";
import Latest from "./Latest";
import News from "./News";
import Report from "./Report";

import { auth } from "../../config/firebase";

export default function Stock() {
  const { init } = useLoginStore();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<string>("latest");
  const company = FinanceData.filter((item) => item.公司代號 === id);

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

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="ms-3 mt-2 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <div className="flex flex-row">
        <aside className="ml-8 mt-40 h-full w-60 shadow-lg transition-transform sm:translate-x-0">
          <div className="rounded-lg bg-gray-300 px-3 py-4">
            <ul className=" cursor-pointer space-y-2 font-medium">
              {asideOptions.map((item) => (
                <li>
                  <div
                    className={`group flex items-center rounded-lg p-2 text-gray-900 ${
                      activeTab === item.option && "bg-gray-100"
                    } dark:text-black`}
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
              {company[0].公司代號}
              {company[0].公司名稱}
              {company[0].英文簡稱}
            </h1>
            {auth.currentUser ? (
              <AddFavoriteStocks />
            ) : (
              <button
                className="group mb-2 me-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-800 text-sm font-medium text-gray-900 hover:text-white focus:outline-none  focus:ring-cyan-200  dark:text-white dark:focus:ring-cyan-800"
                onClick={() => toast.error("請先登入")}
              >
                <span className="  rounded-md bg-cyan-700 px-5 py-2.5  text-white transition-all duration-75 ease-in group-hover:bg-opacity-0">
                  加入追蹤
                </span>
              </button>
            )}
          </div>
          {renderTabContent()}
        </div>
      </div>

      <ChatRoom />
    </>
  );
}
