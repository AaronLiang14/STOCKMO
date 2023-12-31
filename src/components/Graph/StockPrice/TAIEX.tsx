import api from "@/utils/finMindApi";
import { Card, Spinner } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import timeSelector from "../TimeSelect";

interface PERProps {
  minute: string;
  date: string;
  TAIEX: number;
}

export default function LatestStockPrice() {
  const [formattedData, setFormattedData] = useState<
    { x: number; y: number }[]
  >([]);
  const location = useLocation();
  const [rise, setRise] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const chartsColor = rise ? "rgba(255, 0, 0, 0.5)" : "rgb(201,228,222)";
  const chartsBorderColor = rise ? "rgb(242,53,69)" : "#0A9981";

  const chartsTransparentColor = rise
    ? "rgba(255, 0, 0, 0.1)"
    : "rgba(39, 208, 115, 0.1)";

  const getTaiwanStockKBar = async (startDate: string) => {
    try {
      const res = await api.getTaiwanVariousIndicators5Seconds(startDate);
      console.log(res.data);
      console.log(startDate);

      if (res.data[0].TAIEX < res.data[res.data.length - 1].TAIEX)
        setRise(true);

      const chartsData = res.data.filter((item: PERProps) => {
        if (res.data.indexOf(item) % 10 === 0) {
          setDate(item.date.split(" ")[0]);
          const timeArray = item.date.split(" ");
          const year = timeArray[0].split("-")[0];
          const month = timeArray[0].split("-")[1];
          const day = timeArray[0].split("-")[2];
          const time = timeArray[1].split(":");
          const dateTime = Date.UTC(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(time[0]),
            parseInt(time[1]),
            parseInt(time[2]),
          );

          return {
            x: dateTime,
            y: item.TAIEX,
          };
        }
      });

      const newData = chartsData.map((item: PERProps) => {
        setDate(item.date.split(" ")[0]);
        const timeArray = item.date.split(" ");
        const year = timeArray[0].split("-")[0];
        const month = timeArray[0].split("-")[1];
        const day = timeArray[0].split("-")[2];
        const time = timeArray[1].split(":");
        const dateTime = Date.UTC(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(time[0]),
          parseInt(time[1]),
          parseInt(time[2]),
        );

        return {
          x: dateTime,
          y: item.TAIEX,
        };
      });
      setFormattedData(newData);
    } finally {
      setIsLoading(false);
    }
  };
  const options = {
    chart: {
      type: "area",
    },
    title: {
      text: `${date} 上市加權指數`,
      style: {
        fontSize: "24px",
      },
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
      enabled: false, // 刪除 Highcharts 連結
    },
    series: [
      {
        type: "area",
        name: "股價",
        turboThreshold: 4000,
        data: formattedData,
        showInLegend: false,
        color: chartsBorderColor,
        lineWidth: 2,
      },
    ],
  };

  useEffect(() => {
    const currentHours = new Date().getHours();
    const currentDay = new Date().getDay();
    const chartDay =
      currentHours > 16 && currentDay !== 6 && currentDay !== 7
        ? timeSelector.endDate
        : timeSelector.lastOpeningDate;
    getTaiwanStockKBar(chartDay);
  }, []);

  return (
    <>
      <Card className=" col-span-2 h-full w-full p-4">
        {isLoading ? (
          <Spinner className="h-[400px]" />
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            containerProps={
              location.pathname.split("/")[1] === "dashboard" && {
                style: { height: "100%", width: "100%" },
              }
            }
          />
        )}
      </Card>
    </>
  );
}
