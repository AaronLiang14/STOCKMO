import api from "@/utils/finMindApi";
import { Card, Select, SelectItem } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import timeSelector from "../TimeSelect";

interface PERProps {
  date: string;
  revenue: number;
}

export default function Revenue({ id }: { id: string }) {
  const [formattedData, setFormattedData] = useState<
    { x: number; y: number }[]
  >([]);

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

  const getRevenue = async (id: string, startDate: string, endDate: string) => {
    const res = await api.getStockRevenue(id, startDate, endDate);
    const newData = res.data.map((item: PERProps) => ({
      x: new Date(item.date).getTime(),
      y: item.revenue / 1000000,
    }));
    setFormattedData(newData);
  };

  const options = {
    chart: {
      type: "line",
    },
    title: {
      text: `月營收(百萬元)（${id}）`,
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      showFirstLabel: false,
      showLastLabel: true,
      title: {
        text: "",
      },
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "rgb(64,181,254)"],
            [1, "rgb(255, 255, 255)"],
          ],
        },

        marker: {
          radius: 2,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
      },
    },
    series: [
      {
        type: "area",
        name: "月營收(百萬元)",
        data: formattedData,
        showInLegend: false,
      },
    ],
    Tooltip: {
      shadow: false,
    },
  };

  useEffect(() => {
    if (id) getRevenue(id, time, timeSelector.endDate);
  }, [id, time]);

  return (
    <>
      <Card className="flex h-full w-full flex-col items-start p-4">
        <Select
          items={chartsTime}
          label="選擇時段"
          placeholder="一年"
          className="mb-4 flex max-w-xs  pl-4 pt-4"
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
    </>
  );
}
