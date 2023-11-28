import api from "@/utils/api";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PER() {
  const { id } = useParams<string>();
  const [formattedData, setFormattedData] = useState<
    { x: number; y: number }[]
  >([]);

  const endDate = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  interface PERProps {
    date: string;
    PER: number;
  }

  const fetchPER = async (id: string, startDate: string, endDate: string) => {
    const res = await api.getPER(id, startDate, endDate);
    const newData = res.data.map((item: PERProps) => ({
      x: new Date(item.date).getTime(),
      y: item.PER,
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
      text: "本益比",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      showFirstLabel: false,
      showLastLabel: true,
      title: {
        text: "本益比",
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        type: "line",
        name: "本益比",
        data: formattedData,
        color: "green",
        upColor: "red",
        upLineColor: "red",
      },
    ],
  };

  useEffect(() => {
    if (id) fetchPER(id, "2023-01-01", endDate);
  }, [id]);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
