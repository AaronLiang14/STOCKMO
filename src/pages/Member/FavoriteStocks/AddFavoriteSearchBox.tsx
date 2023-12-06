import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import SearchIcon from "~icons/ph/magnifying-glass-bold";

export default function AddFavorite() {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <>
      <div className="flex items-center">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search by stock name"
          startContent={<SearchIcon />}
          value={searchValue}
          onClear={() => setSearchValue("")}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button color="primary" size="sm">
          新增收藏
        </Button>
      </div>
    </>
  );
}
