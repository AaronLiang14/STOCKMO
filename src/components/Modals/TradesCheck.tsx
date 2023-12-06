import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

import { auth, db } from "@/config/firebase";
import api from "@/utils/api";
import { useOrderStore } from "@/utils/useTradesStore.tsx";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface memberStocksProps {
  stock_id: string;
  volume: number;
  average_price: number;
}

export default function CheckModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  const { stockID, trade, order, buySell, unit, price, volume } =
    useOrderStore();
  const ableToClick = () => {
    if (stockID && buySell && trade && order && price && volume) {
      return false;
    } else {
      return true;
    }
  };

  let units = 0;

  const formattedUnits = () => {
    if (unit === "整股") {
      units = volume * 1000;
    } else {
      units = volume;
    }
  };
  formattedUnits();

  const updateMemberStockHolding = async () => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser?.uid);
    const memberDoc = await getDoc(memberRef);
    const memberData = memberDoc.data();
    const unrealized = memberData?.unrealized;
    const stockPrice = await api.getTaiwanStockPriceTick(stockID);
    const marketPrice = stockPrice.data[0].close;

    let averagePrice = 0;
    let volume = 0;
    let isExist = false;

    unrealized.find((stock: memberStocksProps) => {
      if (stock.stock_id === stockID) {
        averagePrice = stock.average_price;
        volume = stock.volume;
        isExist = true;
      }
    });

    const newAveragePrice =
      buySell === "買"
        ? (averagePrice * volume + price * units) / (volume + units)
        : volume === units
          ? 0
          : (averagePrice * volume - price * units) / (volume - units);

    const newHold = buySell === "買" ? volume + units : volume - units;

    const fee = Math.round((newAveragePrice + price) * units * 0.001425 * 0.3);
    const tax = Math.round(price * units * 0.003);

    if (buySell === "買" && price >= marketPrice) {
      if (isExist) {
        const newUnrealized = unrealized.filter(
          (stock: memberStocksProps) => stock.stock_id !== stockID,
        );
        await updateDoc(memberRef, {
          unrealized: [
            ...newUnrealized,
            {
              stock_id: stockID,
              average_price: newAveragePrice,
              volume: newHold,
            },
          ],
          cash: memberData?.cash - price * units,
          securities_assets: price * units + memberData?.securities_assets,
        });
      }
      if (!isExist) {
        await updateDoc(memberRef, {
          unrealized: [
            ...unrealized,
            {
              stock_id: stockID,
              average_price: newAveragePrice,
              volume: newHold,
            },
          ],
          cash: memberData?.cash - price * units,
          securities_assets: price * units + memberData?.securities_assets,
        });
      }
    }
    //////
    if (buySell === "賣" && price <= marketPrice) {
      if (isExist) {
        const newUnrealized = unrealized.filter(
          (stock: memberStocksProps) => stock.stock_id !== stockID,
        );
        await updateDoc(memberRef, {
          unrealized: [
            ...newUnrealized,
            {
              stock_id: stockID,
              average_price: newAveragePrice,
              volume: newHold,
            },
          ],
          cash: memberData?.cash + price * units - fee - tax,
          securities_assets: price * units - memberData?.securities_assets,
        });
      }
      if (!isExist) {
        await updateDoc(memberRef, {
          unrealized: [
            ...unrealized,
            {
              stock_id: stockID,
              average_price: newAveragePrice,
              volume: newHold,
            },
          ],
          cash: memberData?.cash + price * units - fee - tax,
          securities_assets: price * units - memberData?.securities_assets,
        });
      }
    }
  };

  const updateMemberRealizedProfitLoss = async () => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser?.uid);
    const memberDoc = await getDoc(memberRef);
    const memberData = memberDoc.data();
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
      await updateDoc(memberRef, {
        realized: [
          ...realized,
          {
            stock_id: stockID,
            sell_price: price,
            volume: units,
            buy_price: buyPrice,
            time: new Date(),
          },
        ],
      });
    }
  };

  const handleTrade = async () => {
    if (!auth.currentUser) return;
    const docRef = await addDoc(collection(db, "Trades"), {
      buy_or_sell: buySell,
      stock_id: stockID,
      trade_type: trade,
      order_type: order,
      member_id: auth.currentUser?.uid,
      status: "委託成功",
      order: {
        price: price,
        volume: volume,
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

  return (
    <>
      <Button onPress={onOpen} isDisabled={ableToClick()} color="primary">
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
                  onClick={() => handleTrade()}
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