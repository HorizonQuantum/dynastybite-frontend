"use client";

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ProductChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("http://dynastybite.test/api/produk-terjual-per-hari")
      .then(res => res.json())
      .then(data => setChartData(data));
  }, []);

  // Buat daftar semua tanggal unik (labels)
  const labels = [...new Set(chartData.map(item => item.date))];

  // Buat data per periode
  const getPeriodeData = (periode) =>
    labels.map(date => {
      const item = chartData.find(i => i.date === date && i.periode === periode);
      return item ? item.total_terjual : 0;
    });

  const data = {
    labels,
    datasets: [
      {
        label: "Periode 1",
        data: getPeriodeData("periode_1"),
        backgroundColor: "#FFC107",
        stack: 'stack1'
      },
      {
        label: "Periode 2",
        data: getPeriodeData("periode_2"),
        backgroundColor: "#FF9800",
        stack: 'stack1'
      },
      {
        label: "Periode 3",
        data: getPeriodeData("periode_3"),
        backgroundColor: "#FF5722",
        stack: 'stack1'
      },
      {
        label: "Custom Order",
        data: getPeriodeData("custom"),
        backgroundColor: "#9E9E9E",
        stack: 'stack1'
      },
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow w-[98%]">
      <h2 className="text-lg font-semibold mb-4">Jumlah Produk Terjual per Hari (Stacked by Periode)</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
