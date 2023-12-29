import { auth, db } from "@/config/firebase";
import api from "@/utils/finMindApi";
import firestoreApi from "@/utils/firestoreApi";
import { useOrderStore } from "@/utils/useTradesStore.ts";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface memberStocksProps {
  stock_id: string;
  volume: number;
  average_price: number;
}

const getHoldingAfterTrade = (
  buySell: string,
  oldVolume: number,
  tradeVolume: number,
) => {
  if (buySell === "買") {
    return oldVolume + tradeVolume;
  }
  return oldVolume - tradeVolume;
};

const getAveragePriceAfterTrade = (
  buySell: string,
  oldAveragePrice: number,
  oldVolume: number,
  tradeVolume: number,
  tradePrice: number,
) => {
  if (buySell === "買") {
    const newAveragePrice =
      (oldAveragePrice * oldVolume + tradePrice * tradeVolume) /
      (oldVolume + tradeVolume);
    return newAveragePrice;
  }
  if (oldVolume === tradeVolume) {
    return 0;
  }
  const newAveragePrice =
    (oldAveragePrice * oldVolume - tradePrice * tradeVolume) /
    (oldVolume - tradeVolume);
  return newAveragePrice;
};

const getTradingFee = (averagePrice: number, units: number, price: number) => {
  const DISCOUNT_RATE = 0.3;
  const FEE_RATE = 0.001425;
  const fee = Math.round(
    (averagePrice + price) * units * FEE_RATE * DISCOUNT_RATE,
  );
  return fee;
};

const getTradingTax = (price: number, units: number) => {
  const TAX_RATE = 0.003;
  const tax = Math.round(price * units * TAX_RATE);
  return tax;
};

const getUnrealizedHoldingAfterTrade = (
  stockID: string,
  unrealized: [],
  buySell: string,
  price: number,
  marketPrice: number,
  oldAveragePrice: number,
  oldVolume: number,
  tradeVolume: number,
) => {
  const existedUnrealized = unrealized.filter(
    (stock: memberStocksProps) => stock.stock_id !== stockID,
  );
  if (buySell === "買" && price >= marketPrice) {
    const newUnrealized = {
      stock_id: stockID,
      average_price: getAveragePriceAfterTrade(
        buySell,
        oldAveragePrice,
        oldVolume,
        tradeVolume,
        price,
      ),
      volume: getHoldingAfterTrade(buySell, oldVolume, tradeVolume),
    };
    return [...existedUnrealized, newUnrealized];
  }

  if (buySell === "賣" && price <= marketPrice) {
    if (getHoldingAfterTrade(buySell, oldVolume, tradeVolume) === 0) {
      return [...existedUnrealized];
    }
    return [
      ...existedUnrealized,
      {
        stock_id: stockID,
        average_price: getAveragePriceAfterTrade(
          buySell,
          oldAveragePrice,
          oldVolume,
          tradeVolume,
          price,
        ),
        volume: getHoldingAfterTrade(buySell, oldVolume, tradeVolume),
      },
    ];
  }
};

const getCashAfterTrade = (
  buySell: string,
  price: number,
  marketPrice: number,
  memberData: DocumentData,
  units: number,
  oldAveragePrice: number,
  oldVolume: number,
) => {
  if (buySell === "買" && price >= marketPrice) {
    return memberData?.cash - price * units;
  }
  if (buySell === "賣" && price <= marketPrice) {
    return (
      memberData?.cash +
      price * units -
      getTradingFee(
        getAveragePriceAfterTrade(
          buySell,
          oldAveragePrice,
          oldVolume,
          units,
          price,
        ),
        units,
        price,
      ) -
      getTradingTax(price, units)
    );
  }
};

export default function CheckModal() {
  const [units, setUnits] = useState(0);
  const [oldAveragePrice, setOldAveragePrice] = useState(0);
  const [oldVolume, setOldVolume] = useState(0);
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { stockID, trade, order, buySell, unit, price, volume, flatPrice } =
    useOrderStore();

  const ableToClickOrderButton = () => {
    if (stockID && buySell && trade && order && price && volume) {
      return false;
    }
    return true;
  };

  const formattedUnits = () => {
    if (unit === "整股") {
      setUnits(volume * 1000);
      return;
    }
    setUnits(volume);
  };

  const findOldAveragePriceAndVolume = async () => {
    if (!auth.currentUser) return;
    const memberData = await firestoreApi.getMemberInfo(auth.currentUser!.uid);
    const unrealized = memberData?.unrealized;
    unrealized.find((stock: memberStocksProps) => {
      if (stock.stock_id === stockID) {
        setOldAveragePrice(stock.average_price);
        setOldVolume(stock.volume);
      }
    });
  };

  const updateMemberStockHolding = async () => {
    if (!auth.currentUser) return;
    const memberData = await firestoreApi.getMemberInfo(auth.currentUser!.uid);
    const unrealized = memberData?.unrealized;
    const stockPrice = await api.getTaiwanStockPriceTick(stockID);
    const marketPrice = stockPrice.data[0].close;

    if (
      (buySell === "買" && price >= marketPrice) ||
      (buySell === "賣" && price <= marketPrice)
    ) {
      firestoreApi.updateMemberCashAndUnrealized(
        getCashAfterTrade(
          buySell,
          price,
          marketPrice,
          memberData as DocumentData,
          units,
          oldAveragePrice,
          oldVolume,
        )!,
        getUnrealizedHoldingAfterTrade(
          stockID,
          unrealized,
          buySell,
          price,
          marketPrice,
          oldAveragePrice,
          oldVolume,
          units,
        )!,
      );
    }
  };

  const updateMemberRealizedProfitLoss = async () => {
    if (!auth.currentUser) return;
    const memberData = await firestoreApi.getMemberInfo(auth.currentUser!.uid);
    const realized = memberData?.realized;
    const stockHolding = memberData?.unrealized;
    const stockPrice = await api.getTaiwanStockPriceTick(stockID);
    const marketPrice = stockPrice.data[0].close;

    let buyPrice = 0;
    stockHolding.find((stock: memberStocksProps) => {
      if (stock.stock_id === stockID) {
        buyPrice = stock.average_price;
      }
    });

    if (buySell === "賣" && price <= marketPrice) {
      firestoreApi.updateRealized(realized, {
        stock_id: stockID,
        sell_price: price,
        volume: units,
        buy_price: buyPrice,
        time: new Date(),
      });
    }
  };

  const handleTrade = async () => {
    if (!auth.currentUser) {
      toast.error("登入後即可進行模擬交易");
      return;
    }
    const memberData = await firestoreApi.getMemberInfo(auth.currentUser!.uid);

    if (buySell === "賣") {
      const stockHolding = memberData?.unrealized;
      let volume = 0;
      stockHolding.find((stock: memberStocksProps) => {
        if (stock.stock_id === stockID) {
          volume = stock.volume;
        }
      });
      if (volume < units) {
        toast.error("持有股數不足，請重新輸入");
        return;
      }
    }

    if (
      price > parseInt((flatPrice * 1.1).toFixed(2)) ||
      price < parseInt((flatPrice * 0.9).toFixed(2))
    ) {
      toast.error("盤中委託價超過漲跌停價，請重新輸入");
      return;
    }

    if (price * units > memberData?.cash && buySell === "買") {
      toast.error("總預估金額大於現金餘額，請重新選擇交易選項");
      return;
    }

    const docRef = await addDoc(collection(db, "Trades"), {
      buy_or_sell: buySell,
      stock_id: stockID,
      trade_type: trade,
      order_type: order,
      member_id: auth.currentUser?.uid,
      status: "委託成功",
      order: {
        price: price,
        volume: units,
        time: new Date(),
      },
      deal: {
        price: 0,
        volume: 0,
        time: new Date(),
      },
    });
    const newDocID = docRef.id;
    await updateDoc(doc(db, "Trades", newDocID), {
      id: newDocID,
    });
    updateMemberStockHolding();
    updateMemberRealizedProfitLoss();
    toast.success("下單成功");
    navigate("/trades/entrustment");
  };

  const determineIfPriceReasonable = () => {
    const judgePrice = parseInt((price * 100).toFixed());
    if (
      (price >= 1000 && price % 5 === 0) ||
      (price < 1000 && price >= 500 && judgePrice % 100 === 0) ||
      (price < 500 && price >= 100 && judgePrice % 50 === 0) ||
      (price < 100 && price >= 50 && judgePrice % 10 === 0) ||
      (price < 50 && price >= 10 && judgePrice % 5 === 0) ||
      (price < 10 && price >= 0 && judgePrice % 1 === 0)
    ) {
      handleTrade();
      return;
    }
    toast.error("此價格不在升降單位範圍，請重新輸入");
  };

  useEffect(() => {
    if (stockID.length !== 4) return;
    findOldAveragePriceAndVolume();
  }, [stockID]);

  useEffect(() => {
    formattedUnits();
  }, [volume]);

  return (
    <>
      <Button
        onPress={onOpen}
        isDisabled={ableToClickOrderButton()}
        color="primary"
      >
        下單
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                委託單號：{Math.floor(Math.random() * 900000000) + 100000000}
              </ModalHeader>
              <ModalBody>
                <p>標的：{stockID}</p>
                <p>買/賣：{buySell}</p>
                <p>交易類別：{trade}</p>
                <p>委託條件：{order}</p>
                <p>委託價格：{price}</p>
                <p>
                  委託股數：
                  {units.toLocaleString()}股
                </p>
                <p>交易幣別：台幣</p>
                <p>預估金額：{(price * units).toLocaleString()}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={() => {
                    determineIfPriceReasonable();
                  }}
                >
                  下單
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
