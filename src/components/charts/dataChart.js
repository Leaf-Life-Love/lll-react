import React from "react";
import Chart from "chart.js/auto";
import {Line} from "react-chartjs-2";

function DataChart() {
    return (
        <Line
            data={
                {
                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    datasets: [
                        {
                            label: 'Temperature average',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(255,0,0,0.4)',
                            borderColor: 'rgba(255,0,0,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(255,0,0,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(255,0,0,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 3,
                            pointHitRadius: 10,
                            data: [21, 22, 19, 16, 5, 25, 0]
                        }
                    ]
                }
            }
        />
    )
}

export default DataChart;