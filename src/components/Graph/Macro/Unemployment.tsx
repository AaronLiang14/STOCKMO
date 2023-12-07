import { Card } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

export default function Unemployment() {
  const UnemploymentRate = [
    5.68, 5.76, 5.67, 5.39, 5.14, 5.16, 5.2, 5.17, 5.05, 4.92, 4.73, 4.67, 4.64,
    4.69, 4.48, 4.29, 4.27, 4.35, 4.41, 4.45, 4.28, 4.3, 4.28, 4.18, 4.18, 4.25,
    4.17, 4.1, 4.12, 4.21, 4.31, 4.4, 4.32, 4.33, 4.27, 4.18, 4.16, 4.24, 4.17,
    4.07, 4.06, 4.14, 4.25, 4.33, 4.24, 4.24, 4.16, 4.08, 4.02, 4.09, 4.03,
    3.91, 3.85, 3.92, 4.02, 4.08, 3.96, 3.95, 3.89, 3.79, 3.71, 3.69, 3.72,
    3.63, 3.62, 3.71, 3.82, 3.9, 3.89, 3.9, 3.91, 3.87, 3.87, 3.95, 3.89, 3.86,
    3.84, 3.92, 4.02, 4.08, 3.99, 3.95, 3.87, 3.79, 3.78, 3.85, 3.78, 3.67,
    3.66, 3.74, 3.84, 3.89, 3.77, 3.75, 3.71, 3.66, 3.63, 3.7, 3.66, 3.64, 3.63,
    3.7, 3.81, 3.87, 3.76, 3.75, 3.7, 3.66, 3.73, 3.64, 3.72, 3.68, 3.67, 3.67,
    3.73, 3.82, 3.89, 3.8, 3.77, 3.73, 3.67, 3.64, 3.7, 3.72, 4.03, 4.07, 3.96,
    4.0, 3.99, 3.83, 3.8, 3.75, 3.68, 3.66, 3.7, 3.67, 3.64, 4.11, 4.8, 4.53,
    4.24, 3.96, 3.83, 3.66, 3.64, 3.61, 3.65, 3.66, 3.62, 3.68, 3.74, 3.78,
    3.79, 3.66, 3.64, 3.61, 3.52, 3.5, 3.53, 3.56, 3.5, 3.46, 3.49, 3.56, 3.56,
    3.48, 3.43,
  ];

  const years = [];
  for (let year = 2010; year <= 2023; year++) {
    years.push(`${year}`);
  }

  const options = {
    chart: {
      type: "line",
    },
    title: {
      text: "失業率(%)",
    },
    xAxis: {
      categories: years,
      tickInterval: 2,
      max: years.length - 1,
      min: 0,
    },
    yAxis: {
      showFirstLabel: false,
      showLastLabel: true,
      title: {
        text: "失業率(%)",
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        type: "line",
        name: "失業率",
        data: UnemploymentRate,
      },
    ],
  };

  return (
    <Card className="h-full w-full">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { height: "100%", width: "100%" } }}
      />
    </Card>
  );
}
