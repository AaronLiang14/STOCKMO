import ChatRoom from "@/components/ChatRoom";
import TAIEX from "@/components/Graph/StockPrice/TAIEX";
import industry from "@/data/Industry.json";
import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import StockOfIndustry from "./StockOfIndustry";

export default function Industry() {
  const [industryChosen, setIndustryChosen] = useState<string>("水泥工業");
  const [marketChosen, setMarketChosen] = useState<string>("全部");

  const market = [
    { marketName: "全部" },
    { marketName: "上市" },
    { marketName: "上櫃" },
  ];

  return (
    <>
      <div className="m-auto mb-24 min-h-[calc(100vh_-_120px)] w-11/12 pt-24">
        <div className="mt-12 grid grid-cols-3 gap-8">
          <TAIEX />
          <p className="flex items-center text-lg">
            發行量加權股價指數（簡稱：TAIEX），又稱為加權股價指數或加權指數，由臺灣證券交易所（TWSE）所擁有及編制。該指數以台灣股市中的股價為基礎，採用價格加權方式計算，是臺灣證券交易所自行編製的首個加權指數。由於其歷史悠久，成為臺灣證券市場中最為廣泛認識的股票指數之一，被視為展現台灣經濟走勢的重要指標。
          </p>
        </div>
        <div className="m-auto mt-12 flex w-full justify-end gap-5">
          <Select
            items={industry}
            aria-label="水泥工業"
            placeholder="水泥工業"
            className="max-w-xs"
            value={industryChosen}
            onChange={(e) => {
              setIndustryChosen(e.target.value);
            }}
          >
            {(industry) => (
              <SelectItem key={industry.industryName}>
                {industry.industryName}
              </SelectItem>
            )}
          </Select>
          <Select
            items={market}
            aria-label="全部"
            placeholder="全部"
            className="max-w-xs"
            value={marketChosen}
            onChange={(e) => {
              setMarketChosen(e.target.value);
            }}
          >
            {(market) => (
              <SelectItem key={market.marketName}>
                {market.marketName}
              </SelectItem>
            )}
          </Select>
        </div>
        <StockOfIndustry industry={industryChosen} market={marketChosen} />
      </div>
      <ChatRoom />
    </>
  );
}
