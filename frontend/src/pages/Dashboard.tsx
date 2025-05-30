
// import { Card, Col, Row, Typography } from "antd";
// import { Link } from "react-router-dom";

// const { Title } = Typography;

// const dashboardLinks = [
//   { path: "/alerts", title: "📢 Alerts", description: "Последние сетевые предупреждения и события" },
//   { path: "/http", title: "🌐 HTTP Logs", description: "Мониторинг HTTP-запросов" },
//   { path: "/dns", title: "🧭 DNS Queries", description: "Анализ DNS-запросов и ответов" },
//   { path: "/ip-reputation", title: "🚨 IP Reputation", description: "Проверка IP-адресов по базам угроз" },
//   { path: "/ddos", title: "🛡️ DDoS & Anomalies", description: "Обнаружение подозрительного сетевого поведения" },
//   {
//     path: "/anomalies",
//     title: "🛡️ DDoS & Anomalies",
//     description: "Обнаружение подозрительного сетевого поведения и атак типа DoS/DDoS",
//   },
// ];

// export default function Dashboard() {
//   return (
//     <div className="p-6">
//       <Title level={2}>📊 Network Security Dashboard</Title>
//       <p className="mb-6 text-gray-600">
//         Обзор всех компонентов мониторинга безопасности вашей сети в реальном времени.
//       </p>

//       <Row gutter={[16, 16]}>
//         {dashboardLinks.map((link) => (
//           <Col xs={24} sm={12} md={8} key={link.path}>
//             <Link to={link.path}>
//               <Card
//                 hoverable
//                 title={link.title}
//                 bordered
//                 style={{ height: "100%" }}
//               >
//                 <p>{link.description}</p>
//               </Card>
//             </Link>
//           </Col>
//         ))}
//       </Row>
//     </div>
//   );
// }

// src/pages/Dashboard.tsx

// import React, { useEffect, useState } from 'react';
// import AnomalyChart from '../components/AnomalyChart';
// import GeoDistributionChart from '../components/GeoDistributionChart';
// import IncidentTrends from '../components/IncidentTrends';
// import StatsCards from '../components/StatsCards';
// import { fetchDashboardData } from '../services/dashboardService';
// import { DashboardData } from '../types/dashboard';

// const Dashboard: React.FC = () => {
//   const [data, setData] = useState<DashboardData | null>(null);

//   useEffect(() => {
//     fetchDashboardData()
//       .then(setData)
//       .catch((err) => {
//         console.error('❌ Error fetching dashboard data:', err);
//       });
//   }, []);

//   if (!data) return <div>Loading...</div>;

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">📊 Обзор сети и угроз</h1>
//       <StatsCards uniqueIPs={data.uniqueIPs} anomalies={data.anomalies} />
//       <div className="grid md:grid-cols-2 gap-6">
//         <GeoDistributionChart geo={data.geoDistribution} />
//         <AnomalyChart anomalies={data.anomalies} />
//       </div>
//       <IncidentTrends daily={data.incidents.daily} weekly={data.incidents.weekly} />
//     </div>
//   );
// };

// export default Dashboard;
// import "chart.js/auto"; // обязательно
// import { useEffect, useState } from "react";
// import { Line, Pie } from "react-chartjs-2";
// import { axiosInstance } from "../api/axiosInstance";

// interface OverviewData {
//   uniqueIps: number;
//   anomaliesByType: { [key: string]: number };
//   countryDistribution: { [country: string]: number };
//   incidentsDaily: { date: string; count: number }[];
//   incidentsWeekly: { week: string; count: number }[];
// }

// export default function Dashboard() {
//   const [data, setData] = useState<OverviewData | null>(null);

//   useEffect(() => {
//     axiosInstance.get("/api/dashboard/overview")
//       .then(res => setData(res.data))
//       .catch(console.error);
//   }, []);

//   if (!data) return <div className="p-4">Загрузка...</div>;

//   return (
//     <div className="p-4 space-y-8">
//       <h1 className="text-2xl font-bold">Обзор сети и угроз</h1>

//       <div className="text-lg">Уникальные IP: {data.uniqueIps}</div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Pie: типы аномалий */}
//         <div className="bg-white shadow rounded p-4">
//           <h2 className="text-xl mb-2">Типы атак</h2>
//           <Pie data={{
//             labels: Object.keys(data.anomaliesByType),
//             datasets: [{
//               data: Object.values(data.anomaliesByType),
//               backgroundColor: [
//                 "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"
//               ],
//             }],
//           }} />
//         </div>

//         {/* Line: инциденты по дням */}
//         <div className="bg-white shadow rounded p-4">
//           <h2 className="text-xl mb-2">Инциденты по дням</h2>
//           <Line data={{
//             labels: data.incidentsDaily.map(i => i.date),
//             datasets: [{
//               label: "Инциденты в день",
//               data: data.incidentsDaily.map(i => i.count),
//               borderColor: "#3b82f6",
//               tension: 0.3,
//             }],
//           }} />
//         </div>

//         {/* Line: инциденты по неделям */}
//         <div className="bg-white shadow rounded p-4">
//           <h2 className="text-xl mb-2">Инциденты по неделям</h2>
//           <Line data={{
//             labels: data.incidentsWeekly.map(i => i.week),
//             datasets: [{
//               label: "Инциденты в неделю",
//               data: data.incidentsWeekly.map(i => i.count),
//               borderColor: "#10b981",
//               tension: 0.3,
//             }],
//           }} />
//         </div>
//       </div>
//     </div>
//   );
// }
import { Select } from "antd"; // new alerts

import "chart.js/auto";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { axiosInstance } from "../api/axiosInstance";
import RecentCriticalEvents from "../components/RecentCriticalEvents";
import SuspiciousIpTable from "../components/SuspiciousIpTable";
import UniqueSourcesDailyChart from "../components/UniqueSourcesDailyChart";

interface OverviewData {
  uniqueIps: number;
  anomaliesByType: { [key: string]: number };
  countryDistribution: { [country: string]: number };
  incidentsDaily: { date: string; count: number }[];
  incidentsWeekly: { week: string; count: number }[];
}
// 👇 ДОБАВЛЕНО: Интерфейс для топовых инцидентов
interface TopCategory {
  alert_category: string;
  count: number;
}

export default function Dashboard() {
  const [data, setData] = useState<OverviewData | null>(null);
    // 👇 ДОБАВЛЕНО: Состояние для графика "ТОП инцидентов"
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
   // 👇 ДОБАВЛЕНО: Состояние для выбора диапазона
  const [range, setRange] = useState<"daily" | "weekly" | "all">("daily");

  useEffect(() => {
    axiosInstance.get("/api/dashboard/overview")
      .then(res => {
        const raw = res.data;

        const normalized: OverviewData = {
          uniqueIps: parseInt(raw.uniqueIPs),
          anomaliesByType: raw.anomalies,
          countryDistribution: Object.fromEntries(
            raw.geoDistribution.map((entry: any) => [entry.country, parseInt(entry.count)])
          ),
          incidentsDaily: raw.incidents.daily.map((e: any) => ({
            date: e.date,
            count: parseInt(e.count),
          })),
          incidentsWeekly: raw.incidents.weekly.map((e: any) => ({
            week: e.week,
            count: parseInt(e.count),
          })),
        };

        setData(normalized);
      })
      .catch(console.error);

    // // 👇 ДОБАВЛЕНО: Отдельный запрос для top-categories
    // axiosInstance.get("/api/alerts/top-categories")
    // .then(res => setTopCategories(res.data))
    // .catch(console.error);
  }, []);
  // 👇 ОБНОВЛЕНО: useEffect с фильтром top-categories
  useEffect(() => {
    const params = range === "all" ? {} : { range };
    axiosInstance.get("/api/alerts/top-categories", { params })
      .then(res => setTopCategories(res.data))
      .catch(console.error);
  }, [range]);

  if (!data) return <div className="p-4 text-gray-600">Загрузка...</div>;

  return (
    
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">📊 Обзор сети и угроз</h1>
        {/* Таблица подозрительных IP */}
      <div className="bg-white shadow rounded p-4 md:col-span-2">
      <SuspiciousIpTable />
      <RecentCriticalEvents />
      <UniqueSourcesDailyChart />

      </div>
      <div className="text-lg font-medium">
        Уникальные IP: <span className="font-bold">{data.uniqueIps}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie: Типы аномалий */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Типы атак</h2>
          <Pie data={{
            labels: Object.keys(data.anomaliesByType),
            datasets: [{
              data: Object.values(data.anomaliesByType),
              backgroundColor: [
                "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"
              ],
            }],
          }} />
        </div>

        {/* Bar: Геораспределение */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Геораспределение</h2>
          <Bar data={{
            labels: Object.keys(data.countryDistribution),
            datasets: [{
              label: "Количество IP",
              data: Object.values(data.countryDistribution),
              backgroundColor: "#f59e0b",
            }],
          }} />
        </div>
         {/* 🔥 ДОБАВЛЕННЫЙ ГРАФИК: ТОП инцидентов по категориям */}
         <div className="bg-white shadow rounded p-4 md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">🔥 ТОП инцидентов по типам</h2>
            {/* 👇 ДОБАВЛЕН Select для диапазона */}
            <Select
              value={range}
              onChange={(v) => setRange(v)}
              options={[
                { label: "За день", value: "daily" },
                { label: "За неделю", value: "weekly" },
                { label: "Все", value: "all" },
              ]}
              style={{ width: 120 }}
            />
          </div>
          <Bar data={{
            labels: topCategories.map(c => c.alert_category),
            datasets: [{
              label: "Количество",
              data: topCategories.map(c => c.count),
              backgroundColor: "#ef4444",
            }],
          }} options={{
            indexAxis: 'y',
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: {
                ticks: { precision: 0 }
              }
            }
          }} />
        </div>
        {/* 🔥 КОНЕЦ нового блока */}
        {/* 🔥 ДОБАВЛЕННЫЙ ГРАФИК: ТОП инцидентов по категориям */}
        {/* <div className="bg-white shadow rounded p-4 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">🔥 ТОП инцидентов по типам</h2>
          <Bar data={{
            labels: topCategories.map(c => c.alert_category),
            datasets: [{
              label: "Количество",
              data: topCategories.map(c => c.count),
              backgroundColor: "#ef4444",
            }],
          }} options={{
            indexAxis: 'y',
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: {
                ticks: { precision: 0 }
              }
            }
          }} />
        </div> */}
        {/* 🔥 КОНЕЦ нового блока */}
        {/* Line: Инциденты по дням */}
        <div className="bg-white shadow rounded p-4 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Инциденты по дням</h2>
          <Line data={{
            labels: data.incidentsDaily.map(i => format(parseISO(i.date), "dd.MM")),
            datasets: [{
              label: "Инциденты в день",
              data: data.incidentsDaily.map(i => i.count),
              borderColor: "#3b82f6",
              tension: 0.3,
            }],
          }} />
        </div>

        {/* Line: Инциденты по неделям */}
        <div className="bg-white shadow rounded p-4 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Инциденты по неделям</h2>
          <Line data={{
            labels: data.incidentsWeekly.map(i => i.week),
            datasets: [{
              label: "Инциденты в неделю",
              data: data.incidentsWeekly.map(i => i.count),
              borderColor: "#10b981",
              tension: 0.3,
            }],
          }} />
        </div>
      </div>
    </div>
  );
}// ...========== GOOD VERSION
// import "chart.js/auto";
// import { format, parseISO } from "date-fns";
// import { useEffect, useState } from "react";
// import { Bar, Line, Pie } from "react-chartjs-2";
// import { axiosInstance } from "../api/axiosInstance";

// interface IncidentDaily {
//   date: string;
//   count: number;
// }

// interface IncidentWeekly {
//   week: string;
//   count: number;
// }

// interface OverviewData {
//   uniqueIps: number;
//   anomaliesByType: Record<string, number>;
//   countryDistribution: Record<string, number>;
//   incidentsDaily: IncidentDaily[];
//   incidentsWeekly: IncidentWeekly[];
// }

// export default function Dashboard(): JSX.Element {
//   const [data, setData] = useState<OverviewData | null>(null);

//   useEffect(() => {
//     axiosInstance
//       .get("/api/dashboard/overview")
//       .then((res) => {
//         const raw = res.data;
//         const normalized: OverviewData = {
//           uniqueIps: Number(raw.uniqueIPs),
//           anomaliesByType: raw.anomalies,
//           countryDistribution: Object.fromEntries(
//             raw.geoDistribution.map(
//               (entry: { country: string; count: string }) => [
//                 entry.country,
//                 Number(entry.count),
//               ]
//             )
//           ),
//           incidentsDaily: raw.incidents.daily.map(
//             (e: { date: string; count: string }) => ({
//               date: e.date,
//               count: Number(e.count),
//             })
//           ),
//           incidentsWeekly: raw.incidents.weekly.map(
//             (e: { week: string; count: string }) => ({
//               week: e.week,
//               count: Number(e.count),
//             })
//           ),
//         };
//         setData(normalized);
//       })
//       .catch(console.error);
//   }, []);

//   if (!data)
//     return <div className="p-6 text-gray-500">Загрузка данных...</div>;

//   return (
//     <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-semibold text-gray-800">
//         📊 Обзор сети и угроз
//       </h1>

//       {/* Метрики */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="bg-white shadow rounded-xl p-6">
//           <h2 className="text-gray-500 text-sm">Уникальные IP-адреса</h2>
//           <p className="text-2xl font-bold text-blue-600">{data.uniqueIps}</p>
//         </div>

//         <div className="bg-white shadow rounded-xl p-6">
//           <h2 className="text-gray-500 text-sm">Всего аномалий</h2>
//           <p className="text-2xl font-bold text-red-500">
//             {Object.values(data.anomaliesByType).reduce(
//               (a, b) => a + b,
//               0
//             )}
//           </p>
//         </div>

//         <div className="bg-white shadow rounded-xl p-6">
//           <h2 className="text-gray-500 text-sm">Страны-источники</h2>
//           <p className="text-2xl font-bold text-yellow-500">
//             {Object.keys(data.countryDistribution).length}
//           </p>
//         </div>
//       </div>

//       {/* Графики */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow p-6">
//           <h3 className="text-xl font-semibold mb-4">Типы атак</h3>
//           <Pie
//             data={{
//               labels: Object.keys(data.anomaliesByType),
//               datasets: [
//                 {
//                   data: Object.values(data.anomaliesByType),
//                   backgroundColor: [
//                     "#ef4444",
//                     "#3b82f6",
//                     "#10b981",
//                     "#f59e0b",
//                     "#8b5cf6",
//                   ],
//                 },
//               ],
//             }}
//             options={{
//               plugins: {
//                 legend: {
//                   position: "bottom",
//                 },
//               },
//             }}
//           />
//         </div>

//         <div className="bg-white rounded-xl shadow p-6">
//           <h3 className="text-xl font-semibold mb-4">Геораспределение</h3>
//           <Bar
//             data={{
//               labels: Object.keys(data.countryDistribution),
//               datasets: [
//                 {
//                   label: "Количество IP",
//                   data: Object.values(data.countryDistribution),
//                   backgroundColor: "#f59e0b",
//                 },
//               ],
//             }}
//             options={{
//               plugins: {
//                 legend: { display: false },
//               },
//               scales: {
//                 y: {
//                   beginAtZero: true,
//                   ticks: {
//                     stepSize: 1,
//                   },
//                 },
//               },
//             }}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow p-6">
//           <h3 className="text-xl font-semibold mb-4">Инциденты по дням</h3>
//           <Line
//             data={{
//               labels: data.incidentsDaily.map((i) =>
//                 format(parseISO(i.date), "dd.MM")
//               ),
//               datasets: [
//                 {
//                   label: "Инциденты в день",
//                   data: data.incidentsDaily.map((i) => i.count),
//                   borderColor: "#3b82f6",
//                   backgroundColor: "rgba(59, 130, 246, 0.1)",
//                   fill: true,
//                   tension: 0.4,
//                 },
//               ],
//             }}
//           />
//         </div>

//         <div className="bg-white rounded-xl shadow p-6">
//           <h3 className="text-xl font-semibold mb-4">Инциденты по неделям</h3>
//           <Line
//             data={{
//               labels: data.incidentsWeekly.map((i) => i.week),
//               datasets: [
//                 {
//                   label: "Инциденты в неделю",
//                   data: data.incidentsWeekly.map((i) => i.count),
//                   borderColor: "#10b981",
//                   backgroundColor: "rgba(16, 185, 129, 0.1)",
//                   fill: true,
//                   tension: 0.4,
//                 },
//               ],
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
