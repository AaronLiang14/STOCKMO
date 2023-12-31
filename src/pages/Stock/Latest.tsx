import BuyExcess from "@/components/Graph/ChipAnalysis/BuyExcess";
import SellExcess from "@/components/Graph/ChipAnalysis/SellExcess";
import HistoryStock from "@/components/Graph/StockPrice/HistoryPrice";
import LatestPrice from "@/components/Graph/StockPrice/LatestPrice";
import { useParams } from "react-router-dom";

export default function Latest() {
  const { id } = useParams();
  return (
    <>
      <div className="mt-12">
        <LatestPrice id={id!.toString()} />
      </div>
      <div className="my-12">
        <p className="border-l-8 border-solid border-red-500 pl-4 text-2xl font-semibold text-gray-900">
          最新分點籌碼資訊
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <BuyExcess id={id!.toString()} />
        <SellExcess id={id!.toString()} />
      </div>

      <div className="my-12">
        <p className="border-l-8 border-solid border-red-500 pl-4 text-2xl font-semibold text-gray-900">
          歷史股價
        </p>
      </div>
      <HistoryStock id={id!.toString()} />
    </>
  );
}
