import { Card } from "@nextui-org/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

export default function GDP() {
  const GDPData = [
    3552329, 3470395, 3645975, 3593502, 3573234, 3560576, 3761673, 3782282,
    3670889, 3721253, 3877352, 4001234, 3864177, 3966585, 4137478, 4289807,
    4215980, 4157711, 4286649, 4394740, 4318253, 4258596, 4393874, 4584545,
    4405269, 4306257, 4556280, 4715541, 4498784, 4482674, 4597982, 4795582,
    4580792, 4614922, 4770449, 4942469, 4711195, 4743777, 5107788, 5352046,
    5293915, 5229577, 5400530, 5739209, 5666550, 5508669, 5719679, 5784945,
    5482976, 5697026, 6093017,
  ];

  const years = [];
  for (let year = 2010; year <= 2023; year++) {
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
      tickInterval: 2, // Set to 4 to display labels once per year
      max: years.length - 1, // Ensure only one label is shown for each year
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
    <Card className="h-full w-full">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { height: "100%", width: "100%" } }}
      />
    </Card>
  );
}
