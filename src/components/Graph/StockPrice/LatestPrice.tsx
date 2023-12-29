import api from "@/utils/finMindApi";
import { Card, Spinner } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import timeSelector from "../TimeSelect";

interface PERProps {
  minute: string;
  close: number;
  date: string;
}

export default function LatestStockPrice({ id }: { id: string }) {
  const [formattedData, setFormattedData] = useState<
    { x: number; y: number }[]
  >([]);

  const [rise, setRise] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const chartsColor = rise ? "rgba(255, 0, 0, 0.5)" : "rgb(201,228,222)";
  const chartsBorderColor = rise ? "rgb(242,53,69)" : "#0A9981";

  const chartsTransparentColor = rise
    ? "rgba(255, 0, 0, 0.1)"
    : "rgba(39, 208, 115, 0.1)";

  const getTaiwanStockKBar = async (id: string, startDate: string) => {
    try {
      const res = await api.getTaiwanStockKBar(id, startDate);
      const newData = res.data.map((item: PERProps) => {
        const timeArray = item.minute.split(":");
        const year = item.date.split("-")[0];
        const month = item.date.split("-")[1];
        const day = item.date.split("-")[2];
        const dateTime = Date.UTC(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(timeArray[0]),
          parseInt(timeArray[1]),
          parseInt(timeArray[2]),
        );

        return {
          x: dateTime,
          y: item.close,
        };
      });
      setFormattedData(newData);
    } finally {
      setIsLoading(false);
    }
  };

  const judgeRiseOrFall = async () => {
    const res = await api.getTaiwanStockPriceTick(id.toString());
    if (res.data[0].change_rate > 0) {
      setRise(true);
      return;
    }
    setRise(false);
  };

  const options = {
    chart: {
      type: "area",
    },
    title: {
      text: `最新單日股價（${id}）`,
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      showFirstLabel: false,
      title: false,
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
            [0, chartsColor],
            [1, chartsTransparentColor],
          ],
        },
        marker: {
          radius: 2,
        },
        lineWidth: 0,
        states: {
          hover: {
            lineWidth: 0,
          },
        },
        threshold: null,
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        type: "area",
        name: "股價",
        data: formattedData,
        showInLegend: false,
        color: chartsBorderColor,
        lineWidth: 2,
      },
    ],
  };

  useEffect(() => {
    const currentHours = new Date().getHours();
    const chartDay =
      currentHours > 14 ? timeSelector.endDate : timeSelector.lastOpeningDate;
    if (id) getTaiwanStockKBar(id, chartDay);
    judgeRiseOrFall();
  }, [id]);

  return (
    <>
      <Card className="h-full w-full p-4">
        {isLoading ? (
          <Spinner className="h-[400px]" />
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            containerProps={{ style: { height: "100%", width: "100%" } }}
          />
        )}
      </Card>
    </>
  );
}
