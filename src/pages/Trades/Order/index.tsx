import {
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";

import { useState } from "react";
import { useLocation } from "react-router-dom";
import CheckModal from "./CheckModal.tsx";

const orderType = ["ROD", "IOC", "FOK"];

const tradeType = ["現股", "融資", "融券"];

const priceType = ["限價", "市價", "漲停", "跌停", "平盤"];

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

  return (
    <>
      <div className="m-auto flex flex-col items-center justify-center gap-3">
        <Input
          type="stock"
          label="請輸入標的"
          className=" max-w-xs"
          defaultValue={state ? state.stockID : ""}
          onChange={(e) => setStockID(e.target.value)}
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
          onChange={(e) => setPrice(parseInt(e.target.value))}
        />

        <RadioGroup orientation="horizontal">
          {priceType.map((type, index) => (
            <Radio key={index} value={type}>
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
          type="number"
          label="單位股數"
          placeholder="0"
          labelPlacement="outside"
          className=" max-w-xs"
          onChange={(e) => setVolume(parseInt(e.target.value))}
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
