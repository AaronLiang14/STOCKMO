import { auth } from "@/config/firebase";
import stockCode from "@/data/StockCode.json";
import firestoreApi from "@/utils/firestoreApi";
import useDashboardStore from "@/utils/useDashboardStore";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import WarningIcon from "~icons/ph/warning-fill";

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
  const { getLatestLayout, setUnLogInLayout, unLoginLayout } =
    useDashboardStore();

  const isSelectedChartsForMarket = () => {
    if (
      selectedCharts === "gdp" ||
      selectedCharts === "unemployment" ||
      selectedCharts === "TAIEX"
    ) {
      return true;
    }
    return false;
  };

  const inputAvailable = () => {
    if (isSelectedChartsForMarket()) {
      setInputDisabled(true);
      return;
    }
    setInputDisabled(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputID = e.target.value.split("/")[0];
    setStockID(inputID);

    if (isNaN(parseInt(inputID))) {
      const filter = stockCode.filter((item) => {
        return item.stockName.includes(inputID);
      });
      setFilterOptions(
        filter.map((item) => item.stockCode + "/" + item.stockName),
      );
      return;
    }

    if (!isNaN(parseInt(inputID))) {
      const filter = stockCode.filter((item) => {
        return item.stockCode.toString().includes(inputID);
      });
      setFilterOptions(
        filter.map((item) => item.stockCode + "/" + item.stockName),
      );
    }
  };

  const buttonAvailable = () => {
    if (isSelectedChartsForMarket()) {
      setButtonDisabled(false);
      return;
    }
    if (stockCode.find((item) => item.stockCode === parseInt(stockID))) {
      setButtonDisabled(false);
      return;
    }
    setButtonDisabled(true);
  };

  const addChart = async (chart: string, stockID: string) => {
    const newChartInfo = {
      i: chart + "/" + stockID,
      x: 0,
      y: -1,
      w: 6,
      h: 4,
    };
    if (!auth.currentUser) {
      const newUnLoginLayout = [...unLoginLayout, newChartInfo];
      setUnLogInLayout(newUnLoginLayout);
      return;
    }
    const memberInfo = await firestoreApi.getMemberInfo();
    const latestLayout = memberInfo?.dashboard_layout;
    const newLayout = [...latestLayout, newChartInfo];
    firestoreApi.updateDashboardLayout(newLayout);
    getLatestLayout();
    setStockID("");
  };

  useEffect(() => {
    setInputDisabled(true);
  }, []);

  useEffect(() => {
    inputAvailable();
  }, [selectedCharts]);

  useEffect(() => {
    buttonAvailable();
  }, [selectedCharts, stockID]);

  return (
    <>
      <div className="m-auto mb-4 flex w-11/12 flex-col items-center justify-end gap-4 rounded-lg sm:flex-row">
        {!auth.currentUser && (
          <div className="mr-auto flex items-center gap-3">
            <WarningIcon className="text-red-600" />
            <p className="text-red-600">登入後即可儲存圖表位置及大小</p>
          </div>
        )}

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

        <div className={`relative  ${isInputDisabled && "hidden"}`}>
          <Input
            type="text"
            id="simple-search"
            isClearable
            placeholder="股票代碼/股票名稱"
            value={stockID}
            onChange={handleInputChange}
            onClear={() => setStockID("")}
          />
          <div className="absolute z-10 mt-2 w-full rounded-lg bg-gray-200">
            {filterOptions.length > 0 && (
              <ul className="max-h-60  overflow-y-scroll px-1 py-2 text-sm text-gray-700 dark:text-gray-100">
                {filterOptions.map((item, index) => (
                  <li key={index}>
                    <div
                      className="block px-4 py-2  text-black hover:rounded-lg hover:bg-gray-100"
                      onClick={() => {
                        setStockID(item.split("/")[0]);
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
