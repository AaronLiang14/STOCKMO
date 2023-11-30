import logo from "@/assets/logo.png";
import { auth } from "@/config/firebase";
import useLoginStore from "@/utils/useLoginStore";
import { Link } from "react-router-dom";
import Avatar from "~icons/ooui/user-avatar";

import SearchBox from "./SearchBox";

export default function Header() {
  const { isLogin } = useLoginStore();

  return (
    <>
      <header className="bg-cyan-950">
        <nav className=" mx-auto p-5 sm:px-6 lg:px-24">
          <div className="flex items-center justify-between">
            <div className="mr-auto flex items-center">
              <Link to="/">
                <img className="h-12 w-auto" src={logo} alt="logo" />
                <p className="text-white">STOCK.MO</p>
              </Link>
              <div className="ml-10">
                <Link
                  to="/industry"
                  className="text-base font-medium text-white hover:text-indigo-50"
                >
                  產業類別
                </Link>
              </div>
              <div className="ml-10">
                <Link
                  to="/macro"
                  className="text-base font-medium text-white hover:text-indigo-50"
                >
                  總體經濟
                </Link>
              </div>

              <div className="ml-10">
                <Link
                  to="/trades/order"
                  className="text-base font-medium text-white hover:text-indigo-50"
                >
                  模擬交易
                </Link>
              </div>
            </div>
            <SearchBox />

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
