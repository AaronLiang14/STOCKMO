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
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";

const columns = [
  {
    key: "stockID",
    label: "股票代碼/名稱",
  },
  {
    key: "volume",
    label: "持有股數",
  },
  {
    key: "price",
    label: "成交價",
  },
  {
    key: "marketPrice",
    label: "市價",
  },
  {
    key: "presentValue",
    label: "現值",
  },
  {
    key: "cost",
    label: "付出成本",
  },
  {
    key: "estimatedProfitLoss",
    label: "預估損益",
  },

  {
    key: "returnRate",
    label: "報酬率",
  },
];

interface Order {
  volume: number;
  price: number;
}

interface Details {
  id: string;
  stock_id: string;
  order: Order;
}

interface DetailsProps {
  details: Details[];
  marketPrice: number;
}

export default function DetailsModal({ details, marketPrice }: DetailsProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const rows = details.map((item) => {
    const volume = item.order.volume;
    const price = item.order.price;
    const cost = volume * price;

    return {
      key: item.id,
      stockID: item.stock_id,
      volume: volume,
      price: price,
      marketPrice: marketPrice,
      presentValue: (marketPrice * volume).toLocaleString(),
      cost: cost.toLocaleString(),
      estimatedProfitLoss: (marketPrice * volume - cost).toLocaleString(),
      returnRate:
        (((marketPrice * volume - cost) / cost) * 100).toFixed(2) + "%",
    };
  });
  return (
    <>
      <Button onPress={onOpen} size="sm" color="primary">
        查看明細
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <Table
                  aria-label="Rows actions table example with dynamic content"
                  selectionMode="multiple"
                  selectionBehavior="replace"
                  onRowAction={(key) => alert(`Opening item ${key}...`)}
                >
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                  </TableHeader>
                  <TableBody items={rows}>
                    {(item) => (
                      <TableRow key={item!.key}>
                        {(columnKey) => (
                          <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  關閉
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
