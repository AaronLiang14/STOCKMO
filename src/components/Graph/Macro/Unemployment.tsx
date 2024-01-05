import { Card } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

export default function Unemployment() {
  const UnemploymentRate = [
    5.21, 4.39, 4.24, 4.18, 3.96, 3.78, 3.92, 3.76, 3.71, 3.73, 3.85, 3.95,
    3.67,
  ];

  const years = [];
  for (let year = 2010; year <= UnemploymentRate.length + 2010; year++) {
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
        showInLegend: false,
      },
    ],
  };

  return (
    <Card className="h-full w-full p-4">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { height: "100%", width: "100%" } }}
      />
    </Card>
  );
}
