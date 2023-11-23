import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

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

  const ableToClick = () => {
    if (stockID && buySell && tradingType && orderType && price && volume) {
      return false;
    } else {
      return true;
    }
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
                <p>委託股數：{volume}</p>
                <p>交易幣別：台幣</p>
                <p>預估金額：{price * volume}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose}>
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
