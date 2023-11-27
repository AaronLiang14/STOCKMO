import {
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";

import api from "@/utils/api.tsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CheckModal from "./CheckModal.tsx";

const orderType = ["ROD", "IOC", "FOK"];

const tradeType = ["現股", "融資", "融券"];

const unitType = ["整股", "零股"];

const buyOrSell = ["買", "賣"];

export default function Order() {
  const { state } = useLocation();
  const [stockID, setStockID] = useState<string>(state ? state.stockID : "");
  const [trade, setTrade] = useState<string>("現股");
  const [order, setOrder] = useState<string>("ROD");
  const [buySell, setBuySell] = useState<string>("買");
  const [unit, setUnit] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [flatPrice, setFlatPrice] = useState<number>(0);
  const [marketPrice, setMarketPrice] = useState<number>(0);

  const limitUpPrice = () => {
    const price = flatPrice * 1.1;
    return parseInt(price.toFixed(2));
  };

  const limitDownPrice = () => {
    const price = flatPrice * 0.9;
    return parseInt(price.toFixed(2));
  };

  const priceType: { [key: string]: number } = {
    限價: flatPrice,
    市價: marketPrice,
    漲停: limitUpPrice(),
    跌停: limitDownPrice(),
    平盤: flatPrice,
  };

  const endDate = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  //0: 星期日, 6: 星期六
  const lastOpeningDate =
    new Date().getDay() === 0
      ? `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
          new Date().getDate() - 2
        }`
      : new Date().getDay() === 1
        ? `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
            new Date().getDate() - 3
          }`
        : `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
            new Date().getDate() - 1
          }`;

  const getHistoryData = async () => {
    if (stockID.length === 4) {
      const res = await api.getHistoryStockPrice(
        stockID,
        lastOpeningDate,
        endDate,
      );
      setFlatPrice(res.data[0].close);
    }
  };

  const getMarketPrice = async () => {
    if (stockID.length === 4) {
      const res = await api.getTaiwanStockPriceTick(stockID);
      setMarketPrice(res.data[0].close);
    }
  };

  useEffect(() => {
    getHistoryData();
    getMarketPrice();
  }, [stockID]);
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
          value={price.toString()}
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
          label={`單位股數：${unit === "整股" ? "1000股" : "1股"}`}
          placeholder="0"
          className=" max-w-xs"
          onChange={(e) => setVolume(parseInt(e.target.value))}
          endContent={"股"}
        />
      </div>

      <div className="mt-12 flex justify-center">
        <CheckModal
          stockID={stockID}
          buySell={buySell}
          tradingType={trade}
          orderType={order}
          price={price}
          volume={volume}
          unit={unit}
        />
      </div>
    </>
  );
}
