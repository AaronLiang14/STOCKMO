import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import LoadingIcon from "~icons/line-md/loading-twotone-loop";

const ModalWindow = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("opaque");

  const handleOpen = (backdrop) => {
    setBackdrop(backdrop);
    onOpen();
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          key="blur"
          variant="flat"
          color="warning"
          onPress={() => handleOpen("blur")}
          className="capitalize"
        >
          loading
        </Button>
      </div>
      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <LoadingIcon width="3rem" height="3rem" />

        <ModalContent>
          {(onClose) => (
            <>
              <LoadingIcon width="3rem" height="3rem" />

              <ModalBody></ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalWindow;
