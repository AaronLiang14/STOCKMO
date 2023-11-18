import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "~icons/ic/round-search";
import logo from "../../assets/logo.png";
import { auth } from "../../config/firebase";
import useLoginStore from "../../utils/useLoginStore";

export default function Header() {
  const { isLogin } = useLoginStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        navigate(`/stock/${search}`);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [search, navigate]);

  const handleSearch = () => {
    navigate(`/stock/${search}`);
  };
  return (
    <>
      <header className="bg-gray-500">
        <nav
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          aria-label="Top"
        >
          <div className="flex w-full items-center justify-between border-b border-gray-500 py-6 lg:border-none">
            <div className="flex items-center">
              <Link to="/">
                <img className="h-12 w-auto" src={logo} alt="" />
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
            </div>

            <form className="flex items-center">
              <label htmlFor="simple-search" className="sr-only">
                Search
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  id="simple-search"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="股票代碼/股票名稱"
                  value={search}
                  onChange={handleInputChange}
                />
              </div>
              <SearchIcon
                className="h-10 w-10 cursor-pointer"
                onClick={handleSearch}
              />
            </form>

            <Link to="/member">
              <img
                className="h-12 w-12 rounded-full"
                src={
                  isLogin
                    ? auth?.currentUser?.photoURL
                    : `https://via.placeholder.com/150`
                }
              />
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
