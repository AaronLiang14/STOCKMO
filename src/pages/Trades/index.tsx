import { Button, ButtonGroup } from "@nextui-org/react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Trades() {
  const navigate = useNavigate();

  const Bar: { [key: string]: string } = {
    下單: "order",
    委託: "entrustment",
    成交: "deal",
    未實現: "unrealized",
    已實現: "realized",
    帳戶: "account",
  };

  return (
    <div className="m-auto mb-24 min-h-[calc(100vh_-_120px)]  w-11/12 pt-24">
      <div className="mt-24 flex justify-center">
        <ButtonGroup className="mb-12 w-full">
          {Object.keys(Bar).map((item) => (
            <Button onClick={() => navigate(`${Bar[item]}`)} key={item}>
              {item}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <Outlet />
    </div>
  );
}
