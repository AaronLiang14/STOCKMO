import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { auth } from "../../config/firebase";

export default function Header() {
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
            <Link to="/member">
              <img
                className="h-12 w-12 rounded-full"
                src={
                  auth?.currentUser?.photoURL
                    ? auth.currentUser.photoURL
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
