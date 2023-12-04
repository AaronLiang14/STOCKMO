import api from "@/utils/api";
import { Select, SelectItem } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import timeSelector from "../TimeSelect";

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
  const [time, setTime] = useState<string>(timeSelector.oneYear);

  const chartsTime = [
    {
      label: "五年",
      value: timeSelector.fiveYears,
    },
    {
      label: "三年",
      value: timeSelector.threeYears,
    },
    {
      label: "一年",
      value: timeSelector.oneYear,
    },
    {
      label: "半年",
      value: timeSelector.halfYear,
    },
  ];

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
    if (id) getStockPrice(id, time, timeSelector.endDate);
  }, [id]);

  return (
    <>
      <div className="flex w-full flex-col items-end">
        <Select
          items={chartsTime}
          label="選擇時段"
          placeholder="一年"
          className="flex w-full max-w-xs justify-end"
          value={time}
          onChange={(e) => {
            setTime(e.target.value);
          }}
        >
          {chartsTime.map((item) => (
            <SelectItem key={item.value}>{item.label}</SelectItem>
          ))}
        </Select>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          className="w-full"
        />
      </div>
    </>
  );
}
