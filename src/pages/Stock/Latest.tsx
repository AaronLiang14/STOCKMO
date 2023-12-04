import BuyExcess from "@/components/Graph/ChipAnalysis/BuyExcess";
import SellExcess from "@/components/Graph/ChipAnalysis/SellExcess";
import EPS from "@/components/Graph/Finance/EPS";
import PER from "@/components/Graph/Finance/PER";
import Revenue from "@/components/Graph/Finance/Revenue";
import StockChart from "@/components/Graph/StockPrice/OneDayPrice";

export default function Latest() {
  return (
    <>
      <StockChart />
      <PER />
      <EPS />
      <BuyExcess />
      <SellExcess />
      <Revenue />
    </>
  );
}
