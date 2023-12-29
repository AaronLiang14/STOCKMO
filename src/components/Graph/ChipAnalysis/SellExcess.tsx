import api from "@/utils/finMindApi";
import { Card, Spinner } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import timeSelector from "../TimeSelect";

export default function SellExcess({ id }: { id: string }) {
  const [buyExcess, setBuyExcess] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getTradingDailyReport = async (id: string, startDate: string) => {
    try {
      const res = await api.getTradingDailyReport(id, startDate);
      const formatted = res.data.map(
        (item: { securities_trader: string; buy: number; sell: number }) => {
          return [item.securities_trader, (item.sell - item.buy) / 1000];
        },
      );
      setBuyExcess(
        formatted.sort((a: number[], b: number[]) => b[1] - a[1]).slice(0, 15),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) getTradingDailyReport(id, timeSelector.lastOpeningDate);
  }, [id]);

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: `券商賣超排行（${id}）`,
    },
    xAxis: {
      type: "category",
      labels: {
        rotation: -45,
        style: {
          fontSize: "13px",
          fontFamily: "Verdana, sans-serif",
        },
      },
    },
    yAxis: {
      title: {
        text: "",
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "賣超張數",
        color: "#b4e4b9",
        data: buyExcess,
        showInLegend: false,
      },
    ],
  };

  return (
    <Card className="h-full w-full p-4">
      {isLoading ? (
        <Spinner className="h-[400px]" />
      ) : (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { height: "100%", width: "100%" } }}
        />
      )}
    </Card>
  );
}
