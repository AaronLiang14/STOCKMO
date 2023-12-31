import api from "@/utils/finMindApi";
import { Spinner } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useEffect, useState } from "react";
import timeSelector from "../TimeSelect";

interface PERProps {
  minute: string;
  close: number;
}

export default function LatestStockPrice({ stockID }: { stockID: string }) {
  const [formattedData, setFormattedData] = useState<
    { x: number; y: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getTaiwanStockKBar = async (id: string, startDate: string) => {
    try {
      const res = await api.getTaiwanStockKBar(id, startDate);
      const newData = res.data.map((item: PERProps) => {
        const timeArray = item.minute.split(":");
        const dateTime = Date.UTC(
          2023,
          0,
          1,
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
  const [rise, setRise] = useState<boolean>(false);

  const getLatestInfo = async () => {
    const res = await api.getTaiwanStockPriceTick(stockID.toString());
    if (res.data[0].change_rate > 0) {
      setRise(true);
      return;
    }
    setRise(false);
  };

  const chartsColor = rise ? "rgba(255, 0, 0, 0.5)" : "rgb(201,228,222)";
  const chartsBorderColor = rise ? "rgb(242,53,69)" : "#0A9981";

  const chartsTransparentColor = rise
    ? "rgba(255, 0, 0, 0.1)"
    : "rgba(39, 208, 115, 0.1)";

  const options = {
    chart: {
      type: "area",
    },
    title: {
      text: "",
    },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
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
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
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
        name: "",
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
    if (stockID) getTaiwanStockKBar(stockID, chartDay);
    getLatestInfo();
  }, [stockID]);

  return (
    <>
      {isLoading ? (
        <div className="absolute left-48 top-28 z-10 ">
          <Spinner />
        </div>
      ) : (
        <div className=" absolute inset-0 z-10 scale-y-50 ">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      )}
    </>
  );
}
