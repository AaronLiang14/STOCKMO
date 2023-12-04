import api from "@/utils/api";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import timeSelector from "../TimeSelect";

export default function SellExcess() {
  const [buyExcess, setBuyExcess] = useState<[]>([]);

  const { id } = useParams();

  const getTradingDailyReport = async (id: string, startDate: string) => {
    const res = await api.getTradingDailyReport(id, startDate);
    const formatted = res.data.map(
      (item: { securities_trader: string; buy: number; sell: number }) => {
        return [item.securities_trader, (item.sell - item.buy) / 1000];
      },
    );
    setBuyExcess(
      formatted.sort((a: number[], b: number[]) => b[1] - a[1]).slice(0, 20),
    );
  };

  useEffect(() => {
    if (id) getTradingDailyReport(id, timeSelector.lastOpeningDate);
  }, [id]);

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "券商賣超(張)排行",
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
    <div className="w-full">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
