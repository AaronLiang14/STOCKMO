import api from "@/utils/api";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BuyExcess() {
  const [buyExcess, setBuyExcess] = useState<[]>([]);
  const { id } = useParams();

  const getTradingDailyReport = async (id: string, startDate: string) => {
    const res = await api.getTradingDailyReport(id, startDate);
    const formatted = res.data.map(
      (item: { securities_trader: string; buy: number; sell: number }) => {
        return [item.securities_trader, (item.buy - item.sell) / 1000];
      },
    );
    setBuyExcess(
      formatted.sort((a: number[], b: number[]) => b[1] - a[1]).slice(0, 20),
    );
  };
  const lastOpeningDate =
    new Date().getDay() === 0
      ? `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
          new Date().getDate() - 2
        }`
      : new Date().getDay() === 1
        ? `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
            new Date().getDate() - 3
          }`
        : `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
            new Date().getDate() - 1
          }`;

  useEffect(() => {
    if (id) getTradingDailyReport(id, lastOpeningDate);
  }, [id]);

  const options = {
    chart: {
      type: "column",
      height: 400,
      width: 800,
    },
    title: {
      text: "券商買超排行",
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
        text: "買超張數(張)",
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "買超張數",
        color: "#d28d71",

        data: buyExcess,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
