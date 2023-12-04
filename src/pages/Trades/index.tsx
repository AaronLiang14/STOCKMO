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
    <>
      <div className="flex justify-center pt-48">
        <ButtonGroup size="lg" className="mb-12">
          {Object.keys(Bar).map((item) => (
            <Button onClick={() => navigate(`${Bar[item]}`)} key={item}>
              {item}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <Outlet />
    </>
  );
}
