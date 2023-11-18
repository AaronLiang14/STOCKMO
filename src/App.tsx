import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home/index.tsx";
import Industry from "./pages/Industry/index.tsx";
import Macro from "./pages/Macroeconomics/index.tsx";
import Member from "./pages/Member/index.tsx";
import NotFound from "./pages/NotFound/index.tsx";
import Stock from "./pages/Stock/index.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
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
