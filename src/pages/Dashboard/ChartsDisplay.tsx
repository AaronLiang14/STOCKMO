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
import firestoreApi from "@/utils/firestoreApi";
import useDashboardStore from "@/utils/useDashboardStore";
import { doc, updateDoc } from "firebase/firestore";
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
  const { getLatestLayout, layout, unLoginLayout, deleteUnLoginLayout } =
    useDashboardStore();

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
    if (!auth.currentUser) {
      deleteUnLoginLayout(id, unLoginLayout);
      return;
    }
    const memberInfo = await firestoreApi.getMemberInfo(auth.currentUser!.uid);
    const latestLayout = memberInfo?.dashboard_layout;
    const newLayout = latestLayout.filter((item: layoutProps) => item.i !== id);
    firestoreApi.updateDashboardLayout(newLayout);
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

  const getLayoutInfo = () => {
    if (layout.length === 0 && unLoginLayout.length === 0) {
      return {
        isLayoutExist: false,
        layout: [],
      };
    }
    if (unLoginLayout.length !== 0 && layout.length === 0) {
      return {
        isLayoutExist: true,
        layout: unLoginLayout,
      };
    }
    return {
      isLayoutExist: true,
      layout: layout,
    };
  };

  return (
    <>
      <div className="m-auto min-h-[calc(100vh_-_280px)] w-11/12">
        <div className={`${getLayoutInfo().isLayoutExist ? "hidden" : ""}`}>
          <NoChartsChosen />
        </div>
        <ResponsiveGridLayout
          layouts={{ lg: getLayoutInfo().layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}
          cols={{ lg: 12, md: 10, sm: 6 }}
          rowHeight={100}
          width={1200}
          isDroppable={true}
          resizeHandles={["se"]}
          className={`layout rounded-xl border-2 border-gray-300 ${
            getLayoutInfo().isLayoutExist ? "" : "hidden"
          }`}
          onLayoutChange={(layout) => handleLayoutChange(layout)}
        >
          {getLayoutInfo().layout.map((item) => {
            const id = item.i;
            const chartName = id.split("/")[0];
            const stockID = id.split("/")[1];
            return (
              <div key={id} className="relative rounded-xl bg-white pb-1">
                {charts[chartName](stockID)}
                <CrossIcon
                  className="absolute right-5 top-3 z-30 cursor-pointer"
                  onClick={() => handleDelete(id)}
                />
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>
    </>
  );
}
