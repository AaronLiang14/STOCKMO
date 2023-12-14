import { auth, db } from "@/config/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const columns = [
  {
    key: "cash",
    label: "現金資產",
  },
  {
    key: "securitiesAssets",
    label: "證券資產",
  },
  {
    key: "netAssets",
    label: "淨資產",
  },
];

export default function Account() {
  const [cash, setCash] = useState<number>(0);
  const [securitiesAssets, setSecuritiesAssets] = useState<number>(0);

  const getAssets = async () => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser.uid);
    const memberDoc = await getDoc(memberRef);
    const memberData = memberDoc.data();

    setCash(memberData?.cash);
    setSecuritiesAssets(memberData?.securities_assets);
  };

  useEffect(() => {
    getAssets();
  }, [auth.currentUser]);

  const rows = [
    {
      key: "cash",
      cash: cash.toLocaleString(),
      securitiesAssets: securitiesAssets.toLocaleString(),
      netAssets: (cash + securitiesAssets).toLocaleString(),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-3">
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
      </div>
    </>
  );
}
