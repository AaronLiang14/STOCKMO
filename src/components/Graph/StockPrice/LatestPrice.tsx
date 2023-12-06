import api from "@/utils/api";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import timeSelector from "../TimeSelect";

interface PERProps {
  minute: string;
  close: number;
  date: string;
}

export default function LatestStockPrice({ stockID }: { stockID: string }) {
  const [formattedData, setFormattedData] = useState<
    { x: number; y: number }[]
  >([]);

  const [rise, setRise] = useState<boolean>(false);
  const chartsColor = rise ? "rgba(255, 0, 0, 0.5)" : "rgb(201,228,222)";
  const chartsBorderColor = rise ? "rgb(242,53,69)" : "#0A9981";

  const chartsTransparentColor = rise
    ? "rgba(255, 0, 0, 0.1)"
    : "rgba(39, 208, 115, 0.1)";

  const getTaiwanStockKBar = async (id: string, startDate: string) => {
    const res = await api.getTaiwanStockKBar(id, startDate);
    const newData = res.data.map((item: PERProps) => {
      const timeArray = item.minute.split(":");
      const year = item.date.split("-")[0];
      const month = item.date.split("-")[1];
      const day = item.date.split("-")[2];
      console.log(timeArray[0]);
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
  };

  const judgeRiseOrFall = async () => {
    const res = await api.getTaiwanStockPriceTick(stockID.toString());
    if (res.data[0].change_rate > 0) setRise(true);
    else setRise(false);
  };

  const options = {
    chart: {
      type: "area",
    },
    title: {
      text: "",
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
            [0, chartsColor], // 開始顏色
            [1, chartsTransparentColor], // 结束颜色，透明
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
      currentHours > 15 ? timeSelector.endDate : timeSelector.lastOpeningDate;
    if (stockID) getTaiwanStockKBar(stockID, chartDay);
    judgeRiseOrFall();
  }, [stockID]);

  return (
    <>
      <div className="mt-12 w-full">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </>
  );
}
