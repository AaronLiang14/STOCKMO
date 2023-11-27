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
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  unit: string;
  stockID: string;
  buySell: string;
  tradingType: string;
  orderType: string;
  price: number;
  volume: number;
}

export default function CheckModal({
  stockID,
  buySell,
  tradingType,
  orderType,
  price,
  volume,
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const ableToClick = () => {
    if (stockID && buySell && tradingType && orderType && price && volume) {
      return false;
    } else {
      return true;
    }
  };

  const handleTrade = async () => {
    const docRef = await addDoc(collection(db, "Trades"), {
      buy_or_sell: buySell,
      stock_id: stockID,
      trade_type: tradingType,
      order_type: orderType,
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
    toast.success("下單成功");
    navigate("/trades/entrustment");
  };

  return (
    <>
      <Button onPress={onOpen} isDisabled={ableToClick()}>
        下單
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                委託單號：123456789
              </ModalHeader>
              <ModalBody>
                <p>標的：{stockID}</p>
                <p>買/賣：{buySell}</p>
                <p>交易類別：{tradingType}</p>
                <p>委託條件：{orderType}</p>
                <p>委託價格：{price}</p>
                <p>委託股數：{volume}股</p>
                <p>交易幣別：台幣</p>
                <p>預估金額：{(price * volume).toLocaleString()}</p>
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
