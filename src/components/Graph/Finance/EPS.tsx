import api from "@/utils/finMindApi";
import { Card, Select, SelectItem } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import timeSelector from "../TimeSelect";

export default function EPS({ id }: { id: string }) {
  const [time, setTime] = useState<string>(timeSelector.oneYear);
  const [formattedData, setFormattedData] = useState<
    { x: number; y: number }[]
  >([]);

  interface EPSProps {
    date: string;
    value: number;
  }

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
    },
    title: {
      text: `EPS（${id}）`,
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
    series: [
      {
        type: "line",
        name: "EPS",
        data: formattedData,
        showInLegend: false,
      },
    ],
  };

  useEffect(() => {
    if (id) fetchEPS(id, time, timeSelector.endDate);
  }, [id, time]);

  return (
    <>
      <Card className="flex h-full w-full flex-col items-start p-4">
        <Select
          items={chartsTime}
          label="選擇時段"
          placeholder="一年"
          className="flex w-full max-w-xs justify-end pl-4 pt-4"
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
          />{" "}
        </div>
      </Card>
    </>
  );
}
