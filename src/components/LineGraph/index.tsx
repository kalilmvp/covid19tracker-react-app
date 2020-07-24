import React, { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";
import numeral from "numeral";

import "./styles.css";
import api from "../../services/api";
import { ChartOptions } from "chart.js";

const options: ChartOptions = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          parser: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

interface ILineGraphProps {
  casesType: string;
  isRed: boolean;
}

const LineGraph: React.FC<ILineGraphProps> = ({
  casesType = "cases",
  isRed,
}) => {
  const [chartData, setChartData] = useState([]);

  const buildChartData = (data: any, casesType: string) => {
    const chartData: any = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  useEffect(() => {
    async function getHistoricalData() {
      const response = await api.get("historical/all?lastdays=120");
      setChartData(buildChartData(response.data, casesType));
    }

    getHistoricalData();
  }, [casesType]);

  return (
    <div className="line">
      {chartData?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: `${
                  isRed ? "rgba(204,16,52,0.5)" : "rgba(178, 236, 116,0.5)"
                }`,
                borderColor: `${isRed ? "#cc1034" : "#7dd71d"}`,
                data: chartData,
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default LineGraph;
