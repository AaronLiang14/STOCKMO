import {
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";

import TradesCheck from "@/components/Modals/TradesCheck.tsx";
import { useOrderStore } from "@/utils/useTradesStore.tsx";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const orderType = ["ROD", "IOC", "FOK"];
const tradeType = ["現股", "融資", "融券"];
const unitType = ["整股", "零股"];
const buyOrSell = ["買", "賣"];

export default function Order() {
  const { state } = useLocation();

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

  useEffect(() => {
    getHistoryData(stockID);
    getMarketPrice(stockID);
  }, [stockID]);

  useEffect(() => {
    clear();
  }, []);

  return (
    <>
      <div className="m-auto flex flex-col items-center justify-center gap-3">
        <Input
          type="stock"
          label="請輸入標的"
          className=" max-w-xs"
          defaultValue={state ? state.stockID : ""}
          onChange={(e) => {
            setStockID(e.target.value);
            setPrice(0);
          }}
        />

        <RadioGroup
          label="買/賣"
          orientation="horizontal"
          defaultValue="買"
          onChange={(e) => setBuySell(e.target.value)}
        >
          {buyOrSell.map((type, index) => (
            <Radio key={index} value={type}>
              {type}
            </Radio>
          ))}
        </RadioGroup>

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
          type="price"
          label="請輸入價格"
          className=" max-w-xs"
          value={isNaN(price) ? "" : price.toString()}
          onChange={(e) => setPrice(parseInt(e.target.value))}
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
      </div>

      <div className="mt-12 flex justify-center">
        <TradesCheck />
      </div>
    </>
  );
}
