import ChatRoom from "@/components/ChatRoom";
import { Avatar } from "@nextui-org/react";
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
      <div>
        <Avatar
          src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          className="h-6 w-6 text-tiny"
        />

        <div className="m-auto mb-24 flex min-h-[calc(100vh_-_120px)] max-w-[1280px] pt-24">
          <div className="flex flex-row">
            <aside className="mx-8 mt-24 h-full w-60 ">
              <div className="rounded-lg bg-gray-300 px-3 py-4">
                <ul className="cursor-pointer space-y-2 font-medium">
                  {asideOptions.map((item, index) => (
                    <li key={index}>
                      <div
                        className={`group flex items-center ${
                          currentPath.split("/")[2] === item.option &&
                          "bg-gray-100"
                        } rounded-lg p-2 text-gray-900  dark:text-black`}
                        onClick={() => navigate(`/member/${item.option}`)}
                      >
                        {item.icon}
                        <span className="ms-3">{item.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
          <Outlet />
        </div>
      </div>
      <ChatRoom />
    </>
  );
}
