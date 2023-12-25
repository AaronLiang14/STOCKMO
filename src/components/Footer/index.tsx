import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const [backgroundColor, setBackgroundColor] = useState("");

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/") {
      setBackgroundColor("bg-transparent bg-opacity-0 absolute");
      return;
    }
    setBackgroundColor("bg-gray-100");
  }, [location]);

  return (
    <footer className={` bottom-0 w-full ${backgroundColor}`}>
      <div className=" flex flex-col items-end justify-start text-gray-500">
        <div>
          <p className=" text-xs">
            資料來源参考：公開資訊觀測站、台灣證券交易所、櫃檯買賣中心、FinMind、總體統計資料庫。
          </p>
        </div>
      </div>
    </footer>
  );
}
