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
import { auth, db } from "@/config/firebase";
import { useDashboardStore } from "@/utils/useLoginStore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import CrossIcon from "~icons/maki/cross";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";
import NoChartsChosen from "./NoChartsChosen";

const ResponsiveGridLayout = WidthProvider(Responsive);
interface layoutProps {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function ChartsDisplay() {
  const { getLatestLayout, layout } = useDashboardStore();

  const handleLayoutChange = async (layout: layoutProps[]) => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    const newLayout = layout.map((item) => {
      return {
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      };
    });
    await updateDoc(memberRef, {
      dashboard_layout: newLayout,
    });
    getLatestLayout();
  };

  const handleDelete = async (id: string) => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    const layout = await getDoc(memberRef);
    const newLayout = layout
      .data()
      ?.dashboard_layout.filter((item: layoutProps) => item.i !== id);

    await updateDoc(memberRef, {
      dashboard_layout: newLayout,
    });
    getLatestLayout();
  };

  const charts: { [key: string]: (stockID: string) => JSX.Element } = {
    gdp: () => <GDP />,
    unemployment: () => <Unemployment />,
    buyExcess: (stockID: string) => <BuyExcess id={stockID} />,
    historyPrice: (stockID: string) => <HistoryPrice id={stockID} />,
    sellExcess: (stockID: string) => <SellExcess id={stockID} />,
    TAIEX: () => <TAIEX />,
    latestPrice: (stockID: string) => <LatestPrice id={stockID} />,
    eps: (stockID: string) => <EPS id={stockID} />,
    per: (stockID: string) => <PER id={stockID} />,
    revenue: (stockID: string) => <Revenue id={stockID} />,
  };

  useEffect(() => {
    getLatestLayout();
  }, [auth.currentUser]);

  return (
    <>
      <div className="m-auto min-h-[calc(100vh_-_264px)] w-11/12">
        {layout.length === 0 ? (
          <NoChartsChosen />
        ) : (
          <ResponsiveGridLayout
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768 }}
            cols={{ lg: 12, md: 10, sm: 6 }}
            rowHeight={100}
            width={1200}
            isDroppable={true}
            resizeHandles={["se"]}
            className="layout  rounded-xl border-2 border-gray-300 p-1"
            onLayoutChange={(layout) => handleLayoutChange(layout)}
          >
            {layout.map((item) => {
              const id = item.i;
              const chartName = id.split("/")[0];
              const stockID = id.split("/")[1];
              return (
                <div key={id} className="relative rounded-xl bg-white">
                  {charts[chartName](stockID)}
                  <CrossIcon
                    className="absolute right-5 top-3 z-50 cursor-pointer"
                    onClick={() => handleDelete(id)}
                  />
                </div>
              );
            })}
          </ResponsiveGridLayout>
        )}
      </div>
    </>
  );
}
