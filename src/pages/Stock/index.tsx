import { useEffect, useState } from "react";
import Enterprise from "~icons/carbon/enterprise";
import Dashboard from "~icons/material-symbols/space-dashboard";
import StockOutLined from "~icons/mdi/finance";
import NewsPaper from "~icons/noto/rolled-up-newspaper";
import Article from "~icons/ooui/articles-rtl";

import ChatRoom from "../../components/ChatRoom";
import useLoginStore from "../../utils/useLoginStore";
import Articles from "./Articles";
import BasicInformation from "./BasicInformation";
import Latest from "./Latest";
import News from "./News";
import Report from "./Report";

import AddFavoriteStocks from "../../components/AddFavorite";

export default function Stock() {
  const { init } = useLoginStore();
  const [activeTab, setActiveTab] = useState("latest");

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
        <aside className="left-0 z-40 h-screen w-52 -translate-x-full  transition-transform sm:translate-x-0">
          <div className="h-full overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-gray-800">
            <ul className=" mt-12 cursor-pointer space-y-2 font-medium">
              <li>
                <div
                  className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => setActiveTab("latest")}
                >
                  <StockOutLined />
                  <span className="ms-3">最新動態</span>
                </div>
              </li>
              <li>
                <div
                  className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => setActiveTab("Basic")}
                >
                  <Enterprise />
                  <span className="ms-3 flex-1 whitespace-nowrap">
                    基本資料
                  </span>
                </div>
              </li>
              <li>
                <div
                  className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => setActiveTab("dashboard")}
                >
                  <Dashboard />
                  <span className="ms-3 flex-1 whitespace-nowrap">儀表板</span>
                </div>
              </li>
              <li>
                <div
                  className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => setActiveTab("articles")}
                >
                  <Article />
                  <span className="ms-3 flex-1 whitespace-nowrap">
                    文章分享
                  </span>
                </div>
              </li>
              <li>
                <div
                  className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => setActiveTab("news")}
                >
                  <NewsPaper />
                  <span className="ms-3 flex-1 whitespace-nowrap">
                    個股新聞
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </aside>
        {renderTabContent()}

        <AddFavoriteStocks />
      </div>

      <ChatRoom />
    </>
  );
}
