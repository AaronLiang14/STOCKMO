import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Trades() {
  const navigate = useNavigate();
  const location = useLocation();

  const Bar: { [key: string]: string } = {
    下單: "order",
    委託: "entrustment",
    成交: "deal",
    未實現: "unrealized",
    已實現: "realized",
    帳戶: "account",
  };

  return (
    <div className="m-auto mb-24 min-h-[calc(100vh_-_120px)]  w-11/12 pt-24">
      <div className="mb-12 mt-24 flex justify-center pb-3">
        <div className=" flex w-full flex-row justify-center gap-10">
          {Object.keys(Bar).map((item) => (
            <div
              className={`flex cursor-pointer gap-3 pb-2 ${
                location.pathname.split("/")[2] === Bar[item] &&
                "border-b-3 border-blue-800"
              } text-lg hover:border-b-3 hover:border-blue-800`}
              onClick={() => navigate(`${Bar[item]}`)}
              key={item}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
