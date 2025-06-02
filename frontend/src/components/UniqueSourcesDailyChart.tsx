// import {
//     CategoryScale,
//     Chart as ChartJS,
//     Legend,
//     LinearScale,
//     LineElement,
//     PointElement,
//     Tooltip,
// } from "chart.js";
// import { format } from "date-fns";
// import { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";
// import { axiosInstance } from "../api/axiosInstance";

// ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// interface HourlyData {
//   hour: string;
//   unique_ips: number;
// }

// export default function UniqueSourcesDailyChart() {
//   const [data, setData] = useState<HourlyData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     axiosInstance
//       .get<HourlyData[]>("/unique-sources/daily")
//       .then((res) => {
//         setData(res.data);
//       })
//       .catch((err) => {
//         console.error("Ошибка при получении уникальных источников по времени:", err);
//         setError("Не удалось загрузить данные");
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div className="p-4">Загрузка графика...</div>;
//   if (error) return <div className="p-4 text-red-600">{error}</div>;
//   if (data.length === 0) return <div className="p-4">Нет данных за сегодня.</div>;

//   const labels = data.map((d) => format(new Date(d.hour), "HH:mm"));
//   const values = data.map((d) => d.unique_ips);

//   return (
//     <div className="bg-white shadow rounded p-4 md:col-span-2">
//       <h2 className="text-xl font-semibold mb-2">👥 Уникальные источники (по часам)</h2>
//       <Line
//         data={{
//           labels,
//           datasets: [
//             {
//               label: "Уникальные IP-источники",
//               data: values,
//               borderColor: "#3b82f6",
//               tension: 0.3,
//               fill: false,
//             },
//           ],
//         }}
//         options={{
//           responsive: true,
//           plugins: {
//             legend: { display: false },
//           },
//           scales: {
//             y: {
//               beginAtZero: true,
//               ticks: { stepSize: 1 },
//             },
//           },
//         }}
//       />
//     </div>
//   );
// }
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
import styled from "styled-components";
import { axiosInstance } from "../api/axiosInstance";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface HourlyData {
  hour: string;
  unique_ips: number;
}

// Styled Components for enhanced design
// const Container = styled.div`
//   background: #ffffff;
//   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
//   border-radius: 1rem;
//   padding: 1.5rem;
//   margin-top: 2rem;
// `;
const Container = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;


const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  // color: #1d4ed8; /* Blue color for headers */
  margin-bottom: 1rem;
`;

// const ChartWrapper = styled.div`
//   position: relative;
//   width: 100%;
//   height: 300px;
//   background: #f9fafb;
//   border-radius: 1rem;
//   padding: 1rem;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
// `;
const ChartWrapper = styled.div`
  overflow-x: auto;
  border-radius: 0.75rem;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  min-width: 600px;
`;

const LoadingMessage = styled.div`
  padding: 1rem;
  color: #f97316; /* Orange for loading message */
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  color: #dc2626; /* Red for error messages */
`;

const UniqueSourcesDailyChart = () => {
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

  if (loading) return <LoadingMessage>Загрузка графика...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (data.length === 0) return <div className="p-4">Нет данных за сегодня.</div>;

  const labels = data.map((d) => format(new Date(d.hour), "HH:mm"));
  const values = data.map((d) => d.unique_ips);

  return (
    <Container>
      <Title>Уникальные источники (по часам)</Title>
      <ChartWrapper>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Уникальные IP-источники",
                data: values,
                borderColor: "#3b82f6", // Blue color for line
                backgroundColor: "rgba(59, 130, 246, 0.2)", // Light blue fill for the area
                tension: 0.3,
                fill: true,
                pointBackgroundColor: "#1d4ed8", // Blue for data points
                pointRadius: 5,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "#1f2937", // Dark tooltip background
                titleColor: "#ffffff", // White title in tooltip
                bodyColor: "#f3f4f6", // Light body color in tooltip
              },
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: {
                  color: "#6b7280", // Gray color for x-axis ticks
                },
              },
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1, color: "#6b7280" }, // Gray y-axis ticks
                grid: { color: "#e5e7eb" }, // Light gray grid lines
              },
            },
          }}
          height={225}
        />
      </ChartWrapper>
    </Container>
  );
};

export default UniqueSourcesDailyChart;
