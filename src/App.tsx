import { NextUIProvider } from "@nextui-org/react";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Footer from "./components/Footer/index.tsx";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard/index.tsx";
import Home from "./pages/Home/index.tsx";
import Industry from "./pages/Industry/index.tsx";
import FavoriteArticles from "./pages/Member/FavoriteArticles.tsx";
import FavoriteStocks from "./pages/Member/FavoriteStocks";
import Login from "./pages/Member/Login";
import Member from "./pages/Member/index.tsx";
import NotFound from "./pages/NotFound/index.tsx";
import Articles from "./pages/Stock/Articles";
import BasicInformation from "./pages/Stock/BasicInformation";
import Latest from "./pages/Stock/Latest.tsx";
import News from "./pages/Stock/News";
import Stock from "./pages/Stock/index.tsx";
import Account from "./pages/Trades/Account.tsx";
import Deal from "./pages/Trades/Deal.tsx";
import Entrustment from "./pages/Trades/Entrustment";
import Order from "./pages/Trades/Order/index.tsx";
import Realized from "./pages/Trades/Realized.tsx";
import Unrealized from "./pages/Trades/Unrealized";
import Trades from "./pages/Trades/index.tsx";
import useLoginStore from "./utils/useLoginStore";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const { init } = useLoginStore();
  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <NextUIProvider>
        <BrowserRouter>
          <ScrollToTop />

          <Toaster position="top-center" />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="member" element={<Member />}>
              <Route path="favoriteArticles" element={<FavoriteArticles />} />
              <Route path="favoriteStocks" element={<FavoriteStocks />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="industry" element={<Industry />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="stock/:id" element={<Stock />}>
              <Route path="latest" element={<Latest />} />
              <Route path="basic" element={<BasicInformation />} />
              <Route path="news" element={<News />} />
              <Route path="articles" element={<Articles />} />
            </Route>
            <Route path="trades" element={<Trades />}>
              <Route path="order" element={<Order />} />
              <Route path="account" element={<Account />} />
              <Route path="deal" element={<Deal />} />
              <Route path="entrustment" element={<Entrustment />} />
              <Route path="realized" element={<Realized />} />
              <Route path="unrealized" element={<Unrealized />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </NextUIProvider>
    </>
  );
}

export default App;
