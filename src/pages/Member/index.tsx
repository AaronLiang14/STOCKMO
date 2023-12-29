import ChatRoom from "@/components/ChatRoom";
import { Outlet } from "react-router";
import { useLocation, useNavigate } from "react-router-dom";
import StockIcon from "~icons/ant-design/stock-outlined";
import PencilIcon from "~icons/mdi/lead-pencil";

export default function Member() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const asideOptions = [
    {
      name: "股票收藏",
      icon: <StockIcon />,
      option: "favoriteStocks",
    },
    {
      name: "文章收藏",
      icon: <PencilIcon />,
      option: "favoriteArticles",
    },
  ];

  return (
    <>
      <div className="mx-auto mb-24 flex min-h-[calc(100vh_-_120px)] max-w-[1280px] flex-col pt-36">
        <div className="flex w-full flex-row justify-center gap-10">
          {asideOptions.map((item, index) => (
            <div key={index}>
              <div
                className={`flex cursor-pointer justify-center pb-4 ${
                  currentPath.split("/")[2] === item.option &&
                  "border-b-3 border-blue-800"
                } text-lg hover:border-b-3 hover:border-blue-800`}
                onClick={() => navigate(`/member/${item.option}`)}
              >
                {item.icon}
                <span className="ms-3">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
        <Outlet />
      </div>
      <ChatRoom />
    </>
  );
}
