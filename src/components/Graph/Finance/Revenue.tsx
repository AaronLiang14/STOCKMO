import api from "@/utils/api";
import { Select, SelectItem } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const fiveYears = `${new Date().getFullYear() - 5}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`;

const threeYears = `${new Date().getFullYear() - 3}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`;

const oneYear = `${new Date().getFullYear() - 1}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`;

const endDate = `${new Date().getFullYear()}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`;

interface PERProps {
  date: string;
  revenue: number;
}

const halfYear = `${new Date().getFullYear()}-${
  new Date().getMonth() - 6
}-${new Date().getDate()}`;

export default function Revenue() {
  const { id } = useParams<string>();
  const [formattedData, setFormattedData] = useState<
    { x: number; y: number }[]
  >([]);

  const [time, setTime] = useState<string>(oneYear);

  const chartsTime = [
    {
      label: "五年",
      value: fiveYears,
    },
    {
      label: "三年",
      value: threeYears,
    },
    {
      label: "一年",
      value: oneYear,
    },
    {
      label: "半年",
      value: halfYear,
    },
  ];

  const getRevenue = async (id: string, startDate: string, endDate: string) => {
    const res = await api.getStockRevenue(id, startDate, endDate);
    const newData = res.data.map((item: PERProps) => ({
      x: new Date(item.date).getTime(),
      y: item.revenue,
    }));
    setFormattedData(newData);
  };
  // 資料格式 [ {x: 時間, y: 值}, {x: 1622592000000, y: 0.0}, ...]

  const options = {
    chart: {
      type: "line",
      height: 400,
      width: 800,
    },
    title: {
      text: "月營收",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      showFirstLabel: false,
      showLastLabel: true,
      title: {
        text: "月營收",
      },
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
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              Highcharts.color(Highcharts.getOptions().colors[0])
                .setOpacity(0)
                .get("rgba"),
            ],
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
        name: "月營收",
        data: formattedData,
      },
    ],
  };

  useEffect(() => {
    if (id) getRevenue(id, time, endDate);
  }, [id, time]);

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
