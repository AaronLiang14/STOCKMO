import api from "@/utils/api";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface StockPriceProps {
  date: string;
  open: number;
  max: number;
  min: number;
  close: number;
  Trading_Volume: number;
}

interface StockVolumeProps {
  date: string;
  Trading_Volume: number;
}

export default function StockChart() {
  const { id } = useParams<string>();
  const [stockPrice, setStockPrice] = useState<[]>([]);
  const [volume, setVolume] = useState<[]>([]);

  const endDate = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  const groupingUnits = [
    ["week", [1]],
    ["month", [1, 2, 3, 4, 6]],
  ];

  const options = {
    chart: {
      height: 400,
      width: 800,
    },

    rangeSelector: {
      selected: 2,
    },

    title: {
      text: `歷史股價`,
    },

    xAxis: {
      type: "datetime",
    },

    yAxis: [
      {
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "股價",
        },
        height: "60%",
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "成交量",
        },
        top: "70%",
        height: "30%",
        offset: 0,
        lineWidth: 2,
      },
    ],

    tooltip: {
      split: true,
    },

    plotOptions: {
      series: {
        dataGrouping: {
          units: groupingUnits,
        },
      },
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
      {
        type: "column",
        name: "Volume",
        id: "volume",
        data: volume,
        yAxis: 1,
      },
      // {
      //   type: "sma",
      //   linkedTo: "aapl",
      // },
      // {
      //   type: "sma",
      //   linkedTo: "aapl",
      //   params: {
      //     period: 50,
      //   },
      // },
    ],
  };

  const getStockPrice = async (
    id: string,
    startDate: string,
    endDate: string,
  ) => {
    const res = await api.getStockPrice(id, startDate, endDate);
    const formattedData = res.data.map((item: StockPriceProps) => {
      return [
        new Date(item.date).getTime(),
        item.open,
        item.max,
        item.min,
        item.close,
      ];
    });
    const formattedVolume = res.data.map((item: StockVolumeProps) => {
      return [new Date(item.date).getTime(), item.Trading_Volume];
    });
    setVolume(formattedVolume);
    setStockPrice(formattedData);
  };

  useEffect(() => {
    if (id) getStockPrice(id, "2023-10-01", endDate);
  }, [id]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
