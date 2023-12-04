import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Avatar from "./Avatar";
import SearchBox from "./SearchBox";

export default function Header() {
  const location = useLocation();

  const [backgroundColor, setBackgroundColor] = useState("bg-gray-300");

  useEffect(() => {
    if (location.pathname === "/") {
      setBackgroundColor("bg-gray-300");
    }
    if (location.pathname === "/login") {
      setBackgroundColor("");
    } else {
      setBackgroundColor("bg-gray-300");
    }
  }, [location]);

  return (
    <>
      <header
        className={`fixed z-50 flex h-24 w-full items-center ${backgroundColor} `}
      >
        <nav className=" mx-auto  w-10/12">
          <div className="flex items-center justify-between">
            <div className="mr-auto flex items-center">
              <Link to="/">
                <img className="h-12 w-auto" src={logo} alt="logo" />
                <p className="text-black">STOCK.MO</p>
              </Link>
              <div className="ml-10">
                <Link
                  to="/industry"
                  className="text-base font-medium text-black hover:text-indigo-50"
                >
                  產業類別
                </Link>
              </div>
              <div className="ml-10">
                <Link
                  to="/dashboard"
                  className="text-base font-medium text-black hover:text-indigo-50"
                >
                  儀表板
                </Link>
              </div>

              <div className="ml-10">
                <Link
                  to="/trades/order"
                  className="text-base font-medium text-black hover:text-indigo-50"
                >
                  模擬交易
                </Link>
              </div>
            </div>
            <SearchBox />
            <Avatar />
          </div>
        </nav>
      </header>
    </>
  );
}
