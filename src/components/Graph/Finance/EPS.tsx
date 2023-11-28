import api from "@/utils/api";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EPS() {
  const { id } = useParams<string>();
  const [formattedData, setFormattedData] = useState<
    { x: number; y: number }[]
  >([]);

  const endDate = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  interface EPSProps {
    date: string;
    value: number;
  }

  const fetchEPS = async (id: string, startDate: string, endDate: string) => {
    const res = await api.getIncomeStatements(id, startDate, endDate);
    const eps = res.data.filter(
      (item: { type: string }) => item.type === "EPS",
    );
    const newData = eps.map((item: EPSProps) => ({
      x: new Date(item.date).getTime(),
      y: item.value,
    }));
    setFormattedData(newData);
  };
  const options = {
    chart: {
      type: "line",
      height: 400,
      width: 800,
    },
    title: {
      text: "EPS",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      showFirstLabel: false,
      showLastLabel: true,
      title: {
        text: "EPS(元)",
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        type: "line",
        name: "EPS",
        data: formattedData,
      },
    ],
  };

  useEffect(() => {
    if (id) fetchEPS(id, "2018-01-01", endDate);
  }, [id]);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
