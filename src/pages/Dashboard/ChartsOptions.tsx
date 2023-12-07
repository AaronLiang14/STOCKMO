import { Select, SelectItem } from "@nextui-org/react";

const macro = {
  GDP: "GDP",
  Unemployment: "Unemployment",
};

const finance = {
  營收: "Revenue",
  EPS: "EPS",
  本益比: "PER",
};

const stockPrice = {
  歷史股價: "HistoryPrice",
  最新股價: "LatestPrice",
  大盤指數: "TAIEX",
};

const chipAnalysis = {
  買超: "BuyExcess",
  賣超: "SellExcess",
};

const charts = [
  {
    label: "總體經濟",
    value: macro,
  },
  {
    label: "基本面",
    value: finance,
  },
  {
    label: "技術面",
    value: stockPrice,
  },
  {
    label: "籌碼面",
    value: chipAnalysis,
  },
];

export default function ChartsOptions() {
  return (
    <>
      <div className=" m-auto flex h-24 w-11/12 items-center justify-end gap-4  ">
        {charts.map((item) => (
          <Select
            key={item.label}
            label={item.label}
            className="max-w-xs"
            selectionMode="multiple"
            placeholder="請選擇"
            onChange={(e) => {
              console.log(e.target.value);
            }}
          >
            {Object.keys(item.value).map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
        ))}
      </div>
    </>
  );
}
