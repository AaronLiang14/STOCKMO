import {
  Card,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";

import TradesCheck from "@/components/Modals/TradesCheck.tsx";
import { auth } from "@/config/firebase";
import stockCode from "@/data/StockCode.json";
import { useOrderStore } from "@/utils/useTradesStore.ts";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import WarningIcon from "~icons/ph/warning-fill";

const orderType = ["ROD", "IOC", "FOK"];
const tradeType = ["現股", "融資", "融券"];
const unitType = ["整股", "零股"];
const buyOrSell = ["買", "賣"];

export default function Order() {
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const location = useLocation();

  const {
    getHistoryData,
    flatPrice,
    getMarketPrice,
    marketPrice,
    setStockID,
    stockID,
    setTrade,
    setOrder,
    setBuySell,
    setUnit,
    unit,
    setPrice,
    price,
    setVolume,
    clear,
  } = useOrderStore();

  const priceType: { [key: string]: number } = {
    限價: flatPrice,
    市價: marketPrice,
    漲停: parseInt((flatPrice * 1.1).toFixed(2)),
    跌停: parseInt((flatPrice * 0.9).toFixed(2)),
    平盤: flatPrice,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStockID(e.target.value);
    setPrice(0);
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

  useEffect(() => {
    getHistoryData(stockID);
    getMarketPrice(stockID);
  }, [stockID]);

  useEffect(() => {
    clear();
    if (location.state && location.state.stockID) {
      setStockID(location.state.stockID);
      setBuySell("賣");
    }
  }, []);

  return (
    <>
      {!auth.currentUser && (
        <div className=" mb-4 flex items-center justify-center gap-3">
          <WarningIcon className=" text-red-600 " />
          <p className=" text-red-600">登入後即可進行模擬交易</p>
        </div>
      )}
      <Card className="m-auto flex flex-col items-center justify-center gap-3 py-4 sm:w-96 ">
        <div className="flex w-80 flex-row items-center gap-4">
          <div className="relative">
            <Input
              type="text"
              id="simple-search"
              isClearable
              placeholder="股票代碼/股票名稱"
              value={stockID}
              onChange={handleInputChange}
              onClear={() => setStockID("")}
              className="max-w-xs"
            />
            <div className="absolute z-30 mt-2 w-full rounded-lg bg-gray-200">
              {stockID && filterOptions.length > 0 && (
                <ul className="max-h-60  overflow-y-scroll px-1 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {filterOptions.map((item, index) => (
                    <li key={index}>
                      <div
                        className="block cursor-pointer px-4 py-2 text-black hover:rounded-lg hover:bg-gray-100"
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

          <RadioGroup
            label=""
            orientation="horizontal"
            defaultValue={location.state ? "賣" : "買"}
            onChange={(e) => setBuySell(e.target.value)}
          >
            {buyOrSell.map((type, index) => (
              <Radio key={index} value={type}>
                {type}
              </Radio>
            ))}
          </RadioGroup>
        </div>

        <Select
          label="請選擇交易類別"
          className="max-w-xs"
          defaultSelectedKeys={["現股"]}
          onChange={(e) => setTrade(e.target.value)}
        >
          {tradeType.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="請選擇下單類別"
          className="max-w-xs"
          defaultSelectedKeys={["ROD"]}
          onChange={(e) => setOrder(e.target.value)}
        >
          {orderType.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </Select>

        <Input
          type="number"
          step="0.01"
          inputMode="decimal"
          label="請輸入價格"
          className=" max-w-xs"
          value={isNaN(price) ? "" : price.toString()}
          onChange={(e) => {
            setPrice(parseFloat(e.target.value));
          }}
        />

        <RadioGroup orientation="horizontal">
          {Object.keys(priceType).map((type, index) => (
            <Radio
              key={index}
              value={type}
              onClick={() => setPrice(priceType[type])}
            >
              {type}
            </Radio>
          ))}
        </RadioGroup>

        <Select
          label="請選擇單位"
          className="max-w-xs"
          onChange={(e) => setUnit(e.target.value)}
        >
          {unitType.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </Select>

        <Input
          label={`單位：${unit === "整股" ? "張" : "股"}`}
          placeholder="0"
          className=" max-w-xs"
          onChange={(e) => setVolume(parseInt(e.target.value))}
          endContent={`${unit === "整股" ? "張" : "股"}`}
        />
      </Card>

      <div className="mt-4 flex justify-center">
        <TradesCheck />
      </div>
    </>
  );
}
