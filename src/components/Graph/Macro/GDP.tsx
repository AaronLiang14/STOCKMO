import { Card } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

export default function GDP() {
  const GDPData = [
    14060345, 14262201, 14677765, 15270728, 16258047, 17055080, 17555268,
    17983347, 18375022, 18908632, 19914806, 21663231, 22679843,
  ];

  const years = [];
  for (let year = 2010; year <= GDPData.length + 2010; year++) {
    years.push(`${year}`);
  }

  const options = {
    chart: {
      type: "line",
    },
    rangeSelector: {
      selected: 1,
    },
    title: {
      text: "名目GDP",
    },
    xAxis: {
      categories: years,
      labels: {
        rotation: 0,
        style: {
          fontSize: "14px",
        },
      },
      tickInterval: 2,
      max: years.length - 1,
      min: 0,
    },
    yAxis: {
      showFirstLabel: false,
      showLastLabel: true,
      title: {
        text: "名目GDP(百萬元)",
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        type: "line",
        name: "名目GDP",
        data: GDPData,
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
