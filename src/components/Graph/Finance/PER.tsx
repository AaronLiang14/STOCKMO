import api from "@/utils/api";
import { Select, SelectItem } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import timeSelector from "../TimeSelect";

interface PERProps {
  date: string;
  PER: number;
}

export default function PER() {
  const { id } = useParams<string>();
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
        showInLegend: false,
      },
    ],
  };

  useEffect(() => {
    if (id) fetchPER(id, time, timeSelector.endDate);
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
        <div className="w-full">
          <HighchartsReact highcharts={Highcharts} options={options} />{" "}
        </div>
      </div>
    </>
  );
}
