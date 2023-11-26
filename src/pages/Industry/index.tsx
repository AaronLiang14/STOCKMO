import industry from "@/data/Industry.json";
import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import StockOfIndustry from "./StockOfIndustry";

export default function Industry() {
  const [industryChosen, setIndustryChosen] = useState<string>("水泥工業");
  return (
    <>
      <div className="m-auto mt-12 flex max-w-[1280px] justify-end">
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
            <SelectItem key={industry.產業名稱}>{industry.產業名稱}</SelectItem>
          )}
        </Select>
      </div>
      <StockOfIndustry industry={industryChosen} />
    </>
  );
}
