import HighchartsReact from "highcharts-react-official";
import HC_more from "highcharts/highcharts-more";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";

HC_more(Highcharts);

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

  const groupingUnits = [
    ["week", [1]],
    ["month", [1, 2, 3, 4, 6]],
  ];

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

  const options2 = {
    rangeSelector: {
      selected: 2,
    },

    title: {
      text: ` ${id}Historical`,
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
          text: "OHLC",
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
          text: "Volume",
        },
        top: "65%",
        height: "35%",
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

  const endDate = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  useEffect(() => {
    if (!id) return;
    getStockPrice(id, "2023-10-01", endDate);
  }, []);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
      <HighchartsReact highcharts={Highcharts} options={options2} />
    </div>
  );
}
