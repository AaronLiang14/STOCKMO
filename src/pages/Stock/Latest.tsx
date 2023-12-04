import BuyExcess from "@/components/Graph/ChipAnalysis/BuyExcess";
import SellExcess from "@/components/Graph/ChipAnalysis/SellExcess";
import Revenue from "@/components/Graph/Finance/Revenue";
import HistoryStock from "@/components/Graph/StockPrice/HistoryPrice";

export default function Latest() {
  return (
    <>
      <HistoryStock />
      <BuyExcess />
      <SellExcess />
      <Revenue />
    </>
  );
}
