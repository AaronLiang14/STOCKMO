import api from "@/utils/api";
import { Select, SelectItem } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import timeSelector from "../TimeSelect";

export default function EPS() {
  const { id } = useParams<string>();
  const [formattedData, setFormattedData] = useState<
    { x: number; y: number }[]
  >([]);
  interface EPSProps {
    date: string;
    value: number;
  }
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
    if (id) fetchEPS(id, time, timeSelector.endDate);
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
        <HighchartsReact highcharts={Highcharts} options={options} />{" "}
      </div>
    </>
  );
}
