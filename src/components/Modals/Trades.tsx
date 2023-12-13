import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";

import TradesCheck from "@/components/Modals/TradesCheck.tsx";
import { useOrderStore } from "@/utils/useTradesStore.ts";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const orderType = ["ROD", "IOC", "FOK"];

const tradeType = ["現股", "融資", "融券"];

const unitType = ["整股", "零股"];

const buyOrSell = ["買", "賣"];
export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { id } = useParams();

  const {
    getHistoryData,
    flatPrice,
    getMarketPrice,
    marketPrice,
    setStockID,
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
    clear();
    setStockID(id as string);
    getHistoryData(id as string);
    getMarketPrice(id as string);
  }, [id]);

  return (
    <>
      <Button onPress={onOpen} color="danger">
        模擬交易
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                模擬交易 標的：{id}
              </ModalHeader>
              <ModalBody>
                <div className="m-auto flex flex-col items-center justify-center gap-5 ">
                  <RadioGroup
                    label=""
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
                      <SelectItem key={type} value={type} color="primary">
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
                      <SelectItem key={type} value={type} color="primary">
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
                      <SelectItem key={type} value={type} color="primary">
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
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <TradesCheck />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
