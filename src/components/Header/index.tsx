import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

import { auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import Avatar from "./Avatar";
import SearchBox from "./SearchBox";

export default function Header() {
  const location = useLocation();

  const [backgroundColor, setBackgroundColor] = useState("bg-gray-300");

  useEffect(() => {
    if (location.pathname === "/") {
      setBackgroundColor("");
    } else if (location.pathname === "/login") {
      setBackgroundColor("bg-white/60 backdrop-blur-sm");
    } else {
      setBackgroundColor("bg-white border-b-2");
    }
  }, [location]);

  const headerOption: { [key: string]: string } = {
    industry: "產業類別",
    dashboard: "儀表板",
    trades: "模擬交易",
  };

  return (
    <>
      <header
        className={`fixed z-50 flex h-24  w-full items-center  ${backgroundColor}`}
      >
        <nav className=" mx-auto  w-10/12">
          <div className="flex items-center justify-between">
            <div className="mr-auto flex items-center">
              <Link to="/">
                <img className="h-12 w-auto" src={logo} alt="logo" />
                <p className="text-black">STOCK.MO</p>
              </Link>
              {Object.keys(headerOption).map((item) => {
                const Links =
                  item === "trades"
                    ? auth.currentUser
                      ? "trades/order"
                      : "login"
                    : item;
                return (
                  <div className="ml-10" key={item}>
                    <Link
                      to={`/${Links}`}
                      onClick={() => {
                        if (item === "trades" && !auth.currentUser) {
                          toast.error("請先登入");
                        }
                      }}
                      className={`pb-4 text-base font-medium text-black ${
                        location.pathname.split("/")[1] === item &&
                        "border-b-4 border-gray-600"
                      } hover:border-b-4  hover:border-black`}
                    >
                      {headerOption[item]}
                    </Link>
                  </div>
                );
              })}
            </div>
            <SearchBox />
            <Avatar />
          </div>
        </nav>
      </header>
    </>
  );
}
