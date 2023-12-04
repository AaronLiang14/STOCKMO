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
      <div className="m-auto flex max-w-[1280px] justify-end gap-5 pt-32">
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
            <SelectItem key={market.marketName}>{market.marketName}</SelectItem>
          )}
        </Select>
      </div>
      <StockOfIndustry industry={industryChosen} market={marketChosen} />
    </>
  );
}
