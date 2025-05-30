import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from "chart.js";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { axiosInstance } from "../api/axiosInstance";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface HourlyData {
  hour: string;
  unique_ips: number;
}

export default function UniqueSourcesDailyChart() {
  const [data, setData] = useState<HourlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get<HourlyData[]>("/unique-sources/daily")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Ошибка при получении уникальных источников по времени:", err);
        setError("Не удалось загрузить данные");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Загрузка графика...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (data.length === 0) return <div className="p-4">Нет данных за сегодня.</div>;

  const labels = data.map((d) => format(new Date(d.hour), "HH:mm"));
  const values = data.map((d) => d.unique_ips);

  return (
    <div className="bg-white shadow rounded p-4 md:col-span-2">
      <h2 className="text-xl font-semibold mb-2">👥 Уникальные источники (по часам)</h2>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Уникальные IP-источники",
              data: values,
              borderColor: "#3b82f6",
              tension: 0.3,
              fill: false,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 },
            },
          },
        }}
      />
    </div>
  );
}
