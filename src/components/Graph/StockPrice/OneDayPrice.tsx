import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";

interface StockChartProps {
  date: string;
  open: number;
  max: number;
  min: number;
  close: number;
}

export default function StockChart() {
  const { id } = useParams<string>();
  const [stockPrice, setStockPrice] = useState<[]>([]);

  const options = {
    chart: {
      type: "candlestick",
    },
    title: {
      text: "股價",
    },

    xAxis: {
      type: "datetime",
    },

    yAxis: {
      showFirstLabel: false,
      showLastLabel: true,
      title: {
        text: "股價",
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        type: "candlestick",
        name: "2330",
        data: stockPrice,
        color: "green",
        upColor: "red",
        upLineColor: "red",
        lineColor: "green",
      },
    ],
    tooltip: {
      borderWidth: 1,
      changeDecimals: 2,
    },
  };

  const getStockPrice = async (
    id: string,
    startDate: string,
    endDate: string,
  ) => {
    const res = await api.getStockPrice(id, startDate, endDate);
    const formattedData = res.data.map((item: StockChartProps) => {
      return [
        new Date(item.date).getTime(),
        item.open,
        item.max,
        item.min,
        item.close,
      ];
    });
    setStockPrice(formattedData);
  };
  console.log(new Date(Date.now()));
  //   useEffect(() => {
  //     if(!id) return
  //     getStockPrice(id, "2023-01-01", new Date(Date.now()));
  //   }, []);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
