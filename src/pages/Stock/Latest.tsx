import BuyExcess from "@/components/Graph/ChipAnalysis/BuyExcess";
import SellExcess from "@/components/Graph/ChipAnalysis/SellExcess";
import EPS from "@/components/Graph/Finance/EPS";
import PER from "@/components/Graph/Finance/PER";
import StockChart from "@/components/Graph/StockPrice/OneDayPrice";

export default function Latest() {
  return (
    <>
      <p>即時股價、分點資訊</p>
      <StockChart />
      <PER />
      <EPS />
      <BuyExcess />
      <SellExcess />
    </>
  );
}
