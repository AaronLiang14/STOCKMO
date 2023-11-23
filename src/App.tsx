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
import useLoginStore from "./utils/useLoginStore";

function App() {
  const { init } = useLoginStore();
  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="member" element={<Member />} />
          <Route path="industry" element={<Industry />} />
          <Route path="macro" element={<Macro />} />
          <Route path="stock/:id" element={<Stock />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
