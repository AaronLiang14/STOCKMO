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
import { doc, onSnapshot } from "firebase/firestore";
import { SetStateAction, useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";
import ChartsOptions from "./ChartsOptions";

import { auth, db } from "@/config/firebase";
import { getDoc } from "firebase/firestore";
const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Dashboard() {
  const [id, setId] = useState("2330");

  const [layout, setLayout] = useState([]);

  const handleLayoutChange = (
    layout: SetStateAction<
      { i: string; x: number; y: number; w: number; h: number }[]
    >,
  ) => {
    setLayout(layout);
  };

  const charts: { [key: string]: JSX.Element } = {
    gdp: <GDP />,
    unemployment: <Unemployment />,
    buyExcess: <BuyExcess id={id} />,
    historyPrice: <HistoryPrice id={id} />,
    sellExcess: <SellExcess id={id} />,
    TAIEX: <TAIEX />,
    latestPrice: <LatestPrice id={id} />,
    eps: <EPS id={id} />,
    per: <PER id={id} />,
    revenue: <Revenue id={id} />,
  };

  const getLatestLayout = async () => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    const layout = await getDoc(memberRef);
    setLayout(layout.data()!.dashboard_layout.map((item) => item.position));
  };
  console.log(layout);
  useEffect(() => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    onSnapshot(memberRef, () => {
      getLatestLayout();
    });
  }, [auth.currentUser]);

  useEffect(() => {
    getLatestLayout();
  }, [auth.currentUser]);

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
            className="layout  rounded-xl border-2 border-gray-300 p-1"
            onLayoutChange={(layout) => handleLayoutChange(layout)}
          >
            {layout.map((item) => {
              return (
                <div key={item.i} className=" rounded-xl bg-white">
                  {charts[item.i]}
                </div>
              );
            })}
          </ResponsiveGridLayout>
        </div>
      </div>
    </>
  );
}
