import logo from "@/assets/logo.png";
import { auth } from "@/config/firebase";
import stockCode from "@/data/StockCode.json";
import useLoginStore from "@/utils/useLoginStore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SearchIcon from "~icons/ic/round-search";
import Avatar from "~icons/ooui/user-avatar";

export default function Header() {
  const { isLogin } = useLoginStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    if (isNaN(parseInt(search))) {
      const searchStock = stockCode.filter((item) => {
        return item.證券名稱 === search;
      });
      if (searchStock.length === 0) {
        toast.error("查無此檔股票");
        return;
      }
      navigate(`/stock/${searchStock[0].證券代號}`);
      setSearch("");
    } else {
      const searchStock = stockCode.filter((item) => {
        return item.證券代號 === parseInt(search);
      });
      if (searchStock.length === 0) {
        toast.error("查無此檔股票");
        return;
      }
      navigate(`/stock/${searchStock[0].證券代號}`);
      setSearch("");
    }
  };

  return (
    <>
      <header className="bg-cyan-950">
        <nav className=" mx-auto p-5 sm:px-6 lg:px-24">
          <div className="flex w-full items-center justify-between border-b border-gray-500 lg:border-none">
            <div className="mr-auto flex items-center">
              <Link to="/">
                <img className="h-12 w-auto" src={logo} alt="" />
                <p className="text-white">STOCK.MO</p>
              </Link>
              <div className="ml-10 hidden space-x-8 lg:block">
                <Link
                  to="/industry"
                  className="text-base font-medium text-white hover:text-indigo-50"
                >
                  產業類別
                </Link>
              </div>
              <div className="ml-10 hidden space-x-8 lg:block">
                <Link
                  to="/macro"
                  className="text-base font-medium text-white hover:text-indigo-50"
                >
                  總體經濟
                </Link>
              </div>

              <div className="ml-10 hidden space-x-8 lg:block">
                <Link
                  to="/trades/order"
                  className="text-base font-medium text-white hover:text-indigo-50"
                >
                  模擬交易
                </Link>
              </div>
            </div>

            <form className="relative mr-12 flex items-center ">
              <label htmlFor="simple-search" className="sr-only ">
                Search
              </label>
              <div className="relative w-full ">
                <input
                  type="text"
                  id="simple-search"
                  className="block w-full rounded-lg border border-gray-300  p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500    dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="股票代碼/股票名稱"
                  value={search}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                />
              </div>
              <SearchIcon
                className="absolute right-0 h-9 w-9 cursor-pointer "
                onClick={handleSearch}
              />
            </form>

            <Link to="/member">
              {isLogin ? (
                <img
                  className="h-12 w-12 rounded-full"
                  src={auth?.currentUser?.photoURL || ""}
                />
              ) : (
                <Avatar className="h-12 w-12 rounded-full bg-gray-300 text-white" />
              )}
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
