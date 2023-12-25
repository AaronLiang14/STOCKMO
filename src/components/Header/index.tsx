import logo from "@/assets/logo.png";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchIcon from "~icons/ic/twotone-search";
import Avatar from "./Avatar";
import SearchBox from "./SearchBox";

export default function Header() {
  const location = useLocation();
  const [backgroundColor, setBackgroundColor] = useState("bg-gray-300");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchBoxRef = useRef(null);

  const headerOption: { [key: string]: string } = {
    industry: "產業類別",
    dashboard: "儀表板",
    trades: "模擬交易",
  };

  const mobileMenuOption: { [key: string]: { name: string; link: string } } = {
    industry: {
      name: "產業類別",
      link: "/industry",
    },
    dashboard: {
      name: "儀表板",
      link: "/dashboard",
    },
    trades: {
      name: "模擬交易",
      link: "/trades/order",
    },
    favoriteStocks: {
      name: "股票收藏",
      link: "/member/favoriteStocks",
    },
    favoriteArticles: {
      name: "文章收藏",
      link: "/member/favoriteArticles",
    },
  };

  useEffect(() => {
    if (location.pathname === "/" && isMenuOpen) {
      setBackgroundColor(" ");
      return;
    }

    if (location.pathname === "/") {
      setBackgroundColor("bg-transparent bg-opacity-0 ");
      return;
    }
    if (
      location.pathname === "/login/signIn" ||
      location.pathname === "/login/signUp"
    ) {
      setBackgroundColor("bg-white/60 backdrop-blur-md");
      return;
    }
    setBackgroundColor("bg-white border-b-2");
  }, [location, isMenuOpen]);

  return (
    <>
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className={`${backgroundColor} fixed top-0 z-50 w-full border-b-1 py-2 `}
      >
        <NavbarContent className="md:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        <NavbarBrand className="absolute left-1/2 -translate-x-1/2 transform md:hidden ">
          <Link to="/" className="flex items-center">
            <img className="m-auto h-10" src={logo} alt="logo" />
            <p className=" text-base">STOCK.MO</p>
          </Link>{" "}
        </NavbarBrand>

        <NavbarContent className="hidden gap-4 md:flex" justify="center">
          <NavbarBrand>
            <Link to="/">
              <img className="m-auto h-10" src={logo} alt="logo" />
              <p className="text-md text-black">STOCK.MO</p>
            </Link>
          </NavbarBrand>

          {Object.keys(headerOption).map((item) => {
            const Links = item === "trades" ? "trades/order" : item;
            return (
              <NavbarItem className="ml-10" key={item}>
                <Link
                  to={`/${Links}`}
                  className={`pb-4 text-base font-medium text-black ${
                    location.pathname.split("/")[1] === item &&
                    "border-b-4 border-gray-600"
                  } hover:border-b-4 hover:border-black`}
                >
                  {headerOption[item]}
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>

        <NavbarContent justify="end" className="hidden md:flex">
          <SearchBox />
          <Avatar />
        </NavbarContent>

        <NavbarContent justify="end" className="md:hidden">
          <SearchIcon
            className={`z-50 h-7 w-7 cursor-pointer`}
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          />
        </NavbarContent>
        {isMobileSearchOpen && (
          <div ref={searchBoxRef} className="absolute w-screen">
            <SearchBox />
          </div>
        )}

        <NavbarMenu className="pt-4">
          {Object.keys(mobileMenuOption).map((item, index) => {
            return (
              <Link
                key={`${item}-${index}`}
                className="border-b-2 border-gray-200"
                to={mobileMenuOption[item].link}
                onClick={() => setIsMenuOpen(false)}
              >
                <NavbarMenuItem className="w-full">
                  {mobileMenuOption[item].name}
                </NavbarMenuItem>
              </Link>
            );
          })}
        </NavbarMenu>
      </Navbar>
    </>
  );
}
