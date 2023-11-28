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
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

interface Props {
  cancelEntrustment: () => void;
}

export default function CancelEntrustment({ cancelEntrustment }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const currentTime = new Date();
  const [orderID, setOrderID] = useState<string[]>([]);

  const orderQuery = query(
    collection(db, "Trades"),
    where("member_id", "==", auth.currentUser?.uid || ""),
    where("status", "==", "委託成功"),
  );

  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  const getOrders = async () => {
    const querySnapshot = await getDocs(orderQuery);
    querySnapshot.forEach((doc) => {
      setOrderID((prev: string[]) => [...prev, doc.id]);
    });
  };

  const checkTradingTime = async () => {
    if (currentHour < 23 || (currentHour === 23 && currentMinute <= 30)) {
      console.log("13:30之前。");
    } else {
      orderID.forEach((id) => {
        updateDoc(doc(db, "Trades", id), {
          status: "委託失敗",
        });
      });
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    checkTradingTime();
  }, [orderID]);

  return (
    <>
      <Button onPress={onOpen} color="danger" size="sm">
        取消委託
      </Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <p>確定要取消委託？</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  離開
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={cancelEntrustment}
                >
                  確定
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
