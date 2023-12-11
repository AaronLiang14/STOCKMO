import { Button, Select, SelectItem } from "@nextui-org/react";

import { auth, db } from "@/config/firebase";
import stockCode from "@/data/StockCode.json";
import { Input } from "@nextui-org/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const charts: { [key: string]: string } = {
  gdp: "GDP",
  unemployment: "失業率",
  revenue: "營收",
  eps: "EPS",
  per: "本益比",
  historyPrice: "歷史股價",
  latestPrice: "最新股價",
  TAIEX: "大盤指數",
  buyExcess: "買超",
  sellExcess: "賣超",
};

export default function ChartsOptions() {
  const [stockID, setStockID] = useState("");
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [selectedCharts, setSelectedCharts] = useState<string>("");
  const [isInputDisabled, setInputDisabled] = useState<boolean>(true);
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStockID(e.target.value);

    if (isNaN(parseInt(e.target.value))) {
      const filter = stockCode.filter((item) => {
        return item.stockName.includes(e.target.value);
      });
      setFilterOptions(
        filter.map((item) => item.stockCode + "/" + item.stockName),
      );
    }

    if (!isNaN(parseInt(e.target.value))) {
      const filter = stockCode.filter((item) => {
        return item.stockCode.toString().includes(e.target.value);
      });
      setFilterOptions(
        filter.map((item) => item.stockCode + "/" + item.stockName),
      );
    }
  };

  const buttonAvailable = () => {
    if (
      selectedCharts === "gdp" ||
      selectedCharts === "unemployment" ||
      selectedCharts === "TAIEX"
    ) {
      setButtonDisabled(false);
    } else {
      if (
        stockID &&
        stockCode.find(
          (item) => item.stockCode.toString() === stockID.split("/")[0],
        )
      ) {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
      }
    }
  };

  const inputAvailable = () => {
    if (
      selectedCharts === "gdp" ||
      selectedCharts === "unemployment" ||
      selectedCharts === "TAIEX"
    ) {
      setInputDisabled(true);
    } else {
      setInputDisabled(false);
    }
  };

  const addChart = async (chart: string, stockID: string) => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser?.uid);
    const memberData = await getDoc(memberRef);
    const latestLayout = memberData.data()?.dashboard_layout;
    const newLayout = [
      ...latestLayout,
      {
        i: chart + "/" + stockID,
        x: 0,
        y: 0,
        w: 6,
        h: 4,
      },
    ];
    await updateDoc(memberRef, {
      dashboard_layout: newLayout,
    });
    setStockID("");
  };

  useEffect(() => {
    inputAvailable();
  }, [selectedCharts]);

  useEffect(() => {
    buttonAvailable();
  }, [selectedCharts, stockID]);
  return (
    <>
      <div className=" m-auto flex h-24 w-11/12 items-center justify-end gap-4 rounded-lg   ">
        <Select
          key={123}
          label={"請選擇圖表"}
          className="max-w-xs"
          placeholder="請選擇"
          value={selectedCharts}
          onChange={(e) => setSelectedCharts(e.target.value)}
        >
          {Object.keys(charts).map((item) => (
            <SelectItem key={item} value={item}>
              {charts[item]}
            </SelectItem>
          ))}
        </Select>

        <div className="relative">
          <Input
            type="text"
            id="simple-search"
            isClearable
            placeholder="股票代碼/股票名稱"
            value={stockID}
            onChange={handleInputChange}
            onClear={() => setStockID("")}
            isDisabled={isInputDisabled}
          />
          <div className="absolute z-10 mt-2 w-full rounded-lg bg-gray-100">
            {stockID && filterOptions.length > 0 && (
              <ul className="max-h-60  overflow-y-scroll py-2 text-sm text-gray-700 dark:text-gray-200">
                {filterOptions.map((item, index) => (
                  <li key={index}>
                    <div
                      className="block px-4 py-2  text-black hover:rounded-lg hover:bg-gray-200"
                      onClick={() => {
                        setStockID(item);
                        setFilterOptions([]);
                      }}
                    >
                      {item}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <Button
          isDisabled={isButtonDisabled}
          color="primary"
          onClick={() => addChart(selectedCharts, stockID.split("/")[0])}
        >
          新增圖表
        </Button>
      </div>
    </>
  );
}
