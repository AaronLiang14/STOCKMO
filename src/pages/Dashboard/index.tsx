import BuyExcess from "@/components/Graph/ChipAnalysis/BuyExcess";
import SellExcess from "@/components/Graph/ChipAnalysis/SellExcess";
import EPS from "@/components/Graph/Finance/EPS";
import PER from "@/components/Graph/Finance/PER";
import Revenue from "@/components/Graph/Finance/Revenue";
import GDP from "@/components/Graph/Macro/GDP";
import Unemployment from "@/components/Graph/Macro/Unemployment";
import HistoryPrice from "@/components/Graph/StockPrice/HistoryPrice";
import LatestPrice from "@/components/Graph/StockPrice/LatestPrice";
import TAIEX from "@/components/Graph/StockPrice/TAIEX";
import { SetStateAction, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";
import ChartsOptions from "./ChartsOptions";
const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Dashboard() {
  const [id, setId] = useState("2330");
  const initialLayout = [
    { i: "GDP", x: 0, y: 0, w: 6, h: 1 },
    { i: "Unemployment", x: 6, y: 0, w: 6, h: 1 },
    { i: "BuyExcess", x: 0, y: 0, w: 6, h: 1 },
    { i: "HistoryPrice", x: 6, y: 0, w: 6, h: 2 },
    { i: "SellExcess", x: 0, y: 0, w: 6, h: 1 },
    { i: "TAIEX", x: 6, y: 0, w: 6, h: 1 },
    { i: "LatestPrice", x: 0, y: 0, w: 6, h: 1 },
    { i: "EPS", x: 6, y: 0, w: 6, h: 1 },
    { i: "PER", x: 0, y: 0, w: 6, h: 1 },
    { i: "Revenue", x: 6, y: 0, w: 6, h: 1 },
  ];

  const [layout, setLayout] = useState(initialLayout);

  const handleLayoutChange = (
    layout: SetStateAction<
      { i: string; x: number; y: number; w: number; h: number }[]
    >,
  ) => {
    setLayout(layout);
  };

  return (
    <>
      <div className="m-auto flex w-11/12 flex-col gap-5 pt-36">
        <ChartsOptions />
        <div className="m-auto mb-24 min-h-[calc(100vh_-_120px)] w-11/12 ">
          <ResponsiveGridLayout
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768 }}
            cols={{ lg: 12, md: 10, sm: 6 }}
            rowHeight={400}
            width={1200}
            isDroppable={true}
            resizeHandles={["se"]}
            className="layout  bg-blue-100 "
            onLayoutChange={(layout) => handleLayoutChange(layout)}
          >
            {layout.map((item) => (
              <div key={item.i} className=" rounded-xl bg-white">
                {item.i === "GDP" && <GDP />}
                {item.i === "Unemployment" && <Unemployment />}
                {item.i === "BuyExcess" && <BuyExcess id={id} />}
                {item.i === "HistoryPrice" && <HistoryPrice id={id} />}
                {item.i === "SellExcess" && <SellExcess id={id} />}
                {item.i === "TAIEX" && <TAIEX />}
                {item.i === "LatestPrice" && <LatestPrice id={id} />}
                {item.i === "EPS" && <EPS id={id} />}
                {item.i === "PER" && <PER id={id} />}
                {item.i === "Revenue" && <Revenue id={id} />}
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>
    </>
  );
}
