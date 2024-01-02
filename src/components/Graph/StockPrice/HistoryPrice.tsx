import api from "@/utils/finMindApi";
import { Card, Select, SelectItem, Spinner } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
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

export default function StockChart({ id }: { id: string }) {
  const [stockPrice, setStockPrice] = useState<[]>([]);
  const [volume, setVolume] = useState<[]>([]);
  const [time, setTime] = useState<string>(timeSelector.oneMonth);
  const [isLoading, setIsLoading] = useState(true);
  console.log(timeSelector);
  const chartsTime = [
    {
      label: "一年",
      value: timeSelector.oneYear,
    },
    {
      label: "半年",
      value: timeSelector.halfYear,
    },
    {
      label: "三個月",
      value: timeSelector.threeMonths,
    },
    {
      label: "一個月",
      value: timeSelector.oneMonth,
    },
    {
      label: "五天",
      value: timeSelector.fiveDays,
    },
    {
      label: "昨日",
      value: timeSelector.lastOpeningDate,
    },
  ];

  const options = {
    chart: {},

    rangeSelector: {
      selected: 2,
    },

    title: {
      text: `歷史股價（${id}）`,
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
          text: "",
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
          text: "",
        },
        top: "70%",
        height: "30%",
        offset: 0,
        lineWidth: 2,
      },
    ],
    credits: {
      enabled: false,
    },
    tooltip: {
      split: true,
      style: {
        fontSize: "16px",
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
        showInLegend: false,
      },
      {
        type: "column",
        name: "Volume",
        id: "volume",
        data: volume,
        yAxis: 1,
        showInLegend: false,
      },
    ],
  };

  const getStockPrice = async (
    id: string,
    startDate: string,
    endDate: string,
  ) => {
    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) getStockPrice(id, time, timeSelector.endDate);
  }, [id, time]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Card className="flex h-full w-full flex-col items-start p-4">
          <Select
            items={chartsTime}
            label="選擇時段"
            placeholder="一個月"
            className="mb-4 flex max-w-xs justify-end pl-4 pt-4"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
            }}
          >
            {chartsTime.map((item) => (
              <SelectItem key={item.value}>{item.label}</SelectItem>
            ))}
          </Select>
          <div className="h-full w-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
              containerProps={{ style: { height: "100%", width: "100%" } }}
            />
          </div>
        </Card>
      )}
    </>
  );
}
