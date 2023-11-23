import { Button, ButtonGroup } from "@nextui-org/react";
import { useState } from "react";
import Account from "./Account";
import Deal from "./Deal";
import Entrustment from "./Entrustment";
import Order from "./Order";
import Realized from "./Realized";
import Unrealized from "./Unrealized";

export default function Trades() {
  const [activeBar, setActiveBar] = useState("下單");

  const renderBar = () => {
    switch (activeBar) {
      case "下單":
        return <Order />;
      case "委託":
        return <Entrustment />;
      case "成交":
        return <Deal />;
      case "未實現":
        return <Unrealized />;
      case "已實現":
        return <Realized />;
      case "帳戶":
        return <Account />;
      default:
        return <Order />;
    }
  };

  const button = ["下單", "委託", "成交", "未實現", "已實現", "帳戶"];
  return (
    <>
      <div className="my-24 flex justify-center">
        <ButtonGroup size="lg">
          {button.map((item, index) => (
            <Button onClick={() => setActiveBar(item)} key={index}>
              {item}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      {renderBar()}
    </>
  );
}
