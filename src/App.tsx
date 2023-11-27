import { NextUIProvider } from "@nextui-org/react";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "./components/Header";
import Home from "./pages/Home/index.tsx";
import Industry from "./pages/Industry/index.tsx";
import Macro from "./pages/Macroeconomics/index.tsx";
import Member from "./pages/Member/index.tsx";
import NotFound from "./pages/NotFound/index.tsx";
import Stock from "./pages/Stock/index.tsx";
import Account from "./pages/Trades/Account.tsx";
import Deal from "./pages/Trades/Deal.tsx";
import Entrustment from "./pages/Trades/Entrustment.tsx";
import Order from "./pages/Trades/Order/index.tsx";
import Realized from "./pages/Trades/Realized.tsx";
import Unrealized from "./pages/Trades/Unrealized.tsx";
import Trades from "./pages/Trades/index.tsx";
import useLoginStore from "./utils/useLoginStore";

function App() {
  const { init } = useLoginStore();
  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <NextUIProvider>
        <BrowserRouter>
          <Toaster position="top-center" />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="member" element={<Member />} />
            <Route path="industry" element={<Industry />} />
            <Route path="macro" element={<Macro />} />
            <Route path="stock/:id" element={<Stock />} />
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
        </BrowserRouter>
      </NextUIProvider>
    </>
  );
}

export default App;
