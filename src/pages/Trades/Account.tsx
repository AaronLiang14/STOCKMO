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
  const rows = [
    {
      key: "cash",
      cash: 100000,
      securitiesAssets: 0,
      netAssets: 0,
    },
  ];

  return (
    <>
      <p>未實現</p>
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
