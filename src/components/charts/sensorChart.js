import React from "react";
import Chart from "chart.js/auto";
import {Line} from "react-chartjs-2";
import "./chart.css"

function SensorChart({data, label, date}) {
    const dates = date.map((timestamp) => timestamp.toDate());
    const days = dates.map((date) => date.getDate());
    const months = dates.map((date) => date.getMonth() + 1);
    const labels = days.map((day, index) => `${day}/${months[index]}`);
    const dataKeys = data.map((data) => data);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allows the chart to adjust to the container size
    }

    return (
        <div className="chart-container">
            <Line
                data={
                    {
                        labels: labels,
                        datasets: [
                            {
                                label: label,
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
                                data: dataKeys
                            }
                        ]
                    }
                }
                options={chartOptions}
            />
        </div>
    )
}

export default SensorChart;