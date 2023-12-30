import ChatRoom from "@/components/ChatRoom";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Trades() {
  const navigate = useNavigate();
  const location = useLocation();

  const tradesProcess: { [key: string]: string } = {
    下單: "order",
    委託: "entrustment",
    成交: "deal",
    未實現: "unrealized",
    已實現: "realized",
    帳戶: "account",
  };

  return (
    <>
      <div className={`m-auto min-h-[calc(100vh_-_20px)] w-11/12 pt-16`}>
        <div className="mb-6 mt-12 flex justify-center pb-3">
          <div className="flex w-full flex-row justify-center gap-3">
            {Object.keys(tradesProcess).map((item) => (
              <div
                className={`flex w-20 cursor-pointer justify-center pb-2 ${
                  location.pathname.split("/")[2] === tradesProcess[item] &&
                  "border-b-3 border-blue-800"
                } text-base hover:border-b-3 hover:border-blue-800 sm:text-lg`}
                onClick={() => navigate(`${tradesProcess[item]}`)}
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <Outlet />
      </div>
      <ChatRoom />
    </>
  );
}
