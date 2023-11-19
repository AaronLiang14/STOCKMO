import { useState } from "react";
import Enterprise from "~icons/carbon/enterprise";
import Finance from "~icons/carbon/finance";
import Dashboard from "~icons/material-symbols/space-dashboard";
import StockOutLined from "~icons/mdi/finance";
import NewsPaper from "~icons/noto/rolled-up-newspaper";
import Article from "~icons/ooui/articles-rtl";

import Articles from "./Articles";
import BasicInformation from "./BasicInformation";
import Latest from "./Latest";
import News from "./News";
import Report from "./Report";

import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { auth, db } from "../../config/firebase";

export default function Stock() {
  const [activeTab, setActiveTab] = useState("latest");
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams();

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

  const handleFavorite = async () => {
    const docSnap = await getDoc(memberRef);

    if (docSnap.exists()) {
      const memberRef = doc(db, "Member", auth.lastNotifiedUid);

      if (docSnap.data().favorite_stocks.includes(id)) {
        await updateDoc(memberRef, {
          favorite_stocks: arrayRemove(id),
        });
        setIsFavorite(false);
        return;
      } else {
        await updateDoc(memberRef, {
          favorite_stocks: arrayUnion(id),
        });
        setIsFavorite(true);
      }
    }
  };

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
        <aside className="left-0  z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0">
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
                  {/* <span className="ms-3 inline-flex items-center justify-center rounded-full bg-gray-100 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Pro
                  </span> */}
                </div>
              </li>
              <li>
                <div
                  className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => setActiveTab("dashboard")}
                >
                  <Dashboard />
                  <span className="ms-3 flex-1 whitespace-nowrap">儀表板</span>
                  {/* <span className="ms-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-100 p-3 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    3
                  </span> */}
                </div>
              </li>
              <li>
                <div
                  className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => setActiveTab("finance")}
                >
                  <Finance />
                  <span className="ms-3 flex-1 whitespace-nowrap">
                    財務報表
                  </span>
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

        <button
          className="group absolute right-10 top-40 mb-2 me-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-cyan-200 group-hover:from-cyan-500 group-hover:to-blue-500 dark:text-white dark:focus:ring-cyan-800"
          onClick={handleFavorite}
        >
          <span className="relative rounded-md bg-white px-5 py-2.5 text-gray-900 transition-all duration-75 ease-in  hover:text-white group-hover:bg-opacity-0">
            {isFavorite ? "取消收藏" : "收藏個股"}
          </span>
        </button>
      </div>
    </>
  );
}
