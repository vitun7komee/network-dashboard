// import { Select } from "antd"; // new alerts

// import "chart.js/auto";
// import { format, parseISO } from "date-fns";
// import { useEffect, useState } from "react";
// import { Bar, Line, Pie } from "react-chartjs-2";
// import { axiosInstance } from "../api/axiosInstance";
// import RecentCriticalEvents from "../components/RecentCriticalEvents";
// import SuspiciousIpTable from "../components/SuspiciousIpTable";
// import UniqueSourcesDailyChart from "../components/UniqueSourcesDailyChart";
// //
// import SecurityStatus from "../components/SecurityStatusPage";

// interface OverviewData {
//   uniqueIps: number;
//   anomaliesByType: { [key: string]: number };
//   countryDistribution: { [country: string]: number };
//   incidentsDaily: { date: string; count: number }[];
//   incidentsWeekly: { week: string; count: number }[];
// }
// // 👇 ДОБАВЛЕНО: Интерфейс для топовых инцидентов
// interface TopCategory {
//   alert_category: string;
//   count: number;
// }

// export default function Dashboard() {
//   const [data, setData] = useState<OverviewData | null>(null);
//     // 👇 ДОБАВЛЕНО: Состояние для графика "ТОП инцидентов"
//   const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
//    // 👇 ДОБАВЛЕНО: Состояние для выбора диапазона
//   const [range, setRange] = useState<"daily" | "weekly" | "all">("daily");

//   useEffect(() => {
//     axiosInstance.get("/api/dashboard/overview")
//       .then(res => {
//         const raw = res.data;

//         const normalized: OverviewData = {
//           uniqueIps: parseInt(raw.uniqueIPs),
//           anomaliesByType: raw.anomalies,
//           countryDistribution: Object.fromEntries(
//             raw.geoDistribution.map((entry: any) => [entry.country, parseInt(entry.count)])
//           ),
//           incidentsDaily: raw.incidents.daily.map((e: any) => ({
//             date: e.date,
//             count: parseInt(e.count),
//           })),
//           incidentsWeekly: raw.incidents.weekly.map((e: any) => ({
//             week: e.week,
//             count: parseInt(e.count),
//           })),
//         };

//         setData(normalized);
//       })
//       .catch(console.error);

//     // // 👇 ДОБАВЛЕНО: Отдельный запрос для top-categories
//     // axiosInstance.get("/api/alerts/top-categories")
//     // .then(res => setTopCategories(res.data))
//     // .catch(console.error);
//   }, []);
//   // 👇 ОБНОВЛЕНО: useEffect с фильтром top-categories
//   useEffect(() => {
//     const params = range === "all" ? {} : { range };
//     axiosInstance.get("/api/alerts/top-categories", { params })
//       .then(res => setTopCategories(res.data))
//       .catch(console.error);
//   }, [range]);

//   if (!data) return <div className="p-4 text-gray-600">Загрузка...</div>;

//   return (
    
//     <div className="p-4 space-y-8">
//       <h1 className="text-2xl font-bold">📊 Обзор сети и угроз</h1>
//         {/* Таблица подозрительных IP */}
//         <SecurityStatus />
//       <div className="bg-white shadow rounded p-4 md:col-span-2">
//       <SuspiciousIpTable />
//       <RecentCriticalEvents />
//       <UniqueSourcesDailyChart />

//       </div>
//       <div className="text-lg font-medium">
//         Уникальные IP: <span className="font-bold">{data.uniqueIps}</span>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Pie: Типы аномалий */}
//         <div className="bg-white shadow rounded p-4">
//           <h2 className="text-xl font-semibold mb-2">Типы атак</h2>
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

//         {/* Bar: Геораспределение */}
//         <div className="bg-white shadow rounded p-4">
//           <h2 className="text-xl font-semibold mb-2">Геораспределение</h2>
//           <Bar data={{
//             labels: Object.keys(data.countryDistribution),
//             datasets: [{
//               label: "Количество IP",
//               data: Object.values(data.countryDistribution),
//               backgroundColor: "#f59e0b",
//             }],
//           }} />
//         </div>
//          {/* 🔥 ДОБАВЛЕННЫЙ ГРАФИК: ТОП инцидентов по категориям */}
//          <div className="bg-white shadow rounded p-4 md:col-span-2">
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="text-xl font-semibold">🔥 ТОП инцидентов по типам</h2>
//             {/* 👇 ДОБАВЛЕН Select для диапазона */}
//             <Select
//               value={range}
//               onChange={(v) => setRange(v)}
//               options={[
//                 { label: "За день", value: "daily" },
//                 { label: "За неделю", value: "weekly" },
//                 { label: "Все", value: "all" },
//               ]}
//               style={{ width: 120 }}
//             />
//           </div>
//           <Bar data={{
//             labels: topCategories.map(c => c.alert_category),
//             datasets: [{
//               label: "Количество",
//               data: topCategories.map(c => c.count),
//               backgroundColor: "#ef4444",
//             }],
//           }} options={{
//             indexAxis: 'y',
//             responsive: true,
//             plugins: {
//               legend: { display: false },
//             },
//             scales: {
//               x: {
//                 ticks: { precision: 0 }
//               }
//             }
//           }} />
//         </div>
//         {/* 🔥 КОНЕЦ нового блока */}
//         {/* 🔥 ДОБАВЛЕННЫЙ ГРАФИК: ТОП инцидентов по категориям */}
//         {/* <div className="bg-white shadow rounded p-4 md:col-span-2">
//           <h2 className="text-xl font-semibold mb-2">🔥 ТОП инцидентов по типам</h2>
//           <Bar data={{
//             labels: topCategories.map(c => c.alert_category),
//             datasets: [{
//               label: "Количество",
//               data: topCategories.map(c => c.count),
//               backgroundColor: "#ef4444",
//             }],
//           }} options={{
//             indexAxis: 'y',
//             responsive: true,
//             plugins: {
//               legend: { display: false },
//             },
//             scales: {
//               x: {
//                 ticks: { precision: 0 }
//               }
//             }
//           }} />
//         </div> */}
//         {/* 🔥 КОНЕЦ нового блока */}
//         {/* Line: Инциденты по дням */}
//         <div className="bg-white shadow rounded p-4 md:col-span-2">
//           <h2 className="text-xl font-semibold mb-2">Инциденты по дням</h2>
//           <Line data={{
//             labels: data.incidentsDaily.map(i => format(parseISO(i.date), "dd.MM")),
//             datasets: [{
//               label: "Инциденты в день",
//               data: data.incidentsDaily.map(i => i.count),
//               borderColor: "#3b82f6",
//               tension: 0.3,
//             }],
//           }} />
//         </div>

//         {/* Line: Инциденты по неделям */}
//         <div className="bg-white shadow rounded p-4 md:col-span-2">
//           <h2 className="text-xl font-semibold mb-2">Инциденты по неделям</h2>
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
// }// ...========== GOOD VERSION



// import { Select } from "antd";
// import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, Tooltip } from 'chart.js';
// import { format, parseISO } from "date-fns";
// import { useEffect, useState } from "react";
// import { Bar, Line, Pie } from "react-chartjs-2";

// import { NavLink } from 'react-router-dom';
// import { axiosInstance } from "../api/axiosInstance";
// import RecentCriticalEvents from "../components/RecentCriticalEvents";
// import SecurityStatus from "../components/SecurityStatusPage";
// import SuspiciousIpTable from "../components/SuspiciousIpTable";
// import UniqueSourcesDailyChart from "../components/UniqueSourcesDailyChart";
// //import "../global.css"; // Подключаем Tailwind
// import styled from 'styled-components';

// ChartJS.register(
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   Tooltip,
//   Legend
// );
// const Header = styled.header`
//   background: linear-gradient(to right, #6a11cb, #2575fc);
//   padding: 1rem 2rem;
// `;

// const StyledNavLink = styled(NavLink)`
//   font-size: 1.1rem;
//   color: white;
//   padding: 0.5rem 1rem;
//   text-decoration: none;
//   border-radius: 0.375rem;
//   transition: background-color 0.3s ease;

//   &.active {
//     background-color: #4c6ef5;
//   }

//   &:hover {
//     background-color: #4c6ef5;
//   }
// `;
// const NavBar = () => {
//   return (
//     <Header>
//       <nav>
//         <ul>
//           <li>
//             <StyledNavLink to="/threat-intel">Threat Intelligence</StyledNavLink>
//           </li>
//           <li>
//             <StyledNavLink to="/threat-lookup">Threat Lookup</StyledNavLink>
//           </li>
//         </ul>
//       </nav>
//     </Header>
//   );
// };

// interface OverviewData {
//   uniqueIps: number;
//   anomaliesByType: { [key: string]: number };
//   countryDistribution: { [country: string]: number };
//   incidentsDaily: { date: string; count: number }[];
//   incidentsWeekly: { week: string; count: number }[];
// }

// interface TopCategory {
//   alert_category: string;
//   count: number;
// }

// export default function Dashboard() {
//   const [data, setData] = useState<OverviewData | null>(null);
//   const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
//   const [range, setRange] = useState<"daily" | "weekly" | "all">("daily");

//   useEffect(() => {
//     axiosInstance.get("/api/dashboard/overview")
//       .then(res => {
//         const raw = res.data;

//         const normalized: OverviewData = {
//           uniqueIps: parseInt(raw.uniqueIPs),
//           anomaliesByType: raw.anomalies,
//           countryDistribution: Object.fromEntries(
//             raw.geoDistribution.map((entry: any) => [entry.country, parseInt(entry.count)])
//           ),
//           incidentsDaily: raw.incidents.daily.map((e: any) => ({
//             date: e.date,
//             count: parseInt(e.count),
//           })),
//           incidentsWeekly: raw.incidents.weekly.map((e: any) => ({
//             week: e.week,
//             count: parseInt(e.count),
//           })),
//         };

//         setData(normalized);
//       })
//       .catch(console.error);

//     axiosInstance.get("/api/alerts/top-categories", { params: { range } })
//       .then(res => setTopCategories(res.data))
//       .catch(console.error);
//   }, [range]);

//   if (!data) return <div className="p-4 text-gray-600">Загрузка...</div>;

//   return (
//     <div className="bg-gray-50 min-h-screen p-6">
//       <div className="max-w-7xl mx-auto space-y-8">
//         <NavBar />
//         <header className="text-center">
//           <h1 className="text-3xl font-bold text-gray-900">📊 Обзор сети и угроз</h1>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <SecurityStatus />

//           <div className="bg-white shadow-lg rounded-xl p-6">
//             <SuspiciousIpTable />
//             <RecentCriticalEvents />
//             <UniqueSourcesDailyChart />
//           </div>
//         </div>

//         <div className="text-lg font-medium text-gray-700">
//           Уникальные IP: <span className="font-bold text-blue-600">{data.uniqueIps}</span>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div className="bg-white shadow-lg rounded-xl p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Типы атак</h2>
//             <Pie data={{
//               labels: Object.keys(data.anomaliesByType),
//               datasets: [{
//                 data: Object.values(data.anomaliesByType),
//                 backgroundColor: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
//               }],
//             }} />
//           </div>

//           <div className="bg-white shadow-lg rounded-xl p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Геораспределение</h2>
//             <Bar data={{
//               labels: Object.keys(data.countryDistribution),
//               datasets: [{
//                 label: "Количество IP",
//                 data: Object.values(data.countryDistribution),
//                 backgroundColor: "#f59e0b",
//               }],
//             }} />
//           </div>

//           <div className="bg-white shadow-lg rounded-xl p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-gray-800">🔥 ТОП инцидентов по типам</h2>
//               <Select
//                 value={range}
//                 onChange={setRange}
//                 options={[
//                   { label: "За день", value: "daily" },
//                   { label: "За неделю", value: "weekly" },
//                   { label: "Все", value: "all" },
//                 ]}
//                 style={{ width: 120 }}
//               />
//             </div>
//             <Bar data={{
//               labels: topCategories.map(c => c.alert_category),
//               datasets: [{
//                 label: "Количество",
//                 data: topCategories.map(c => c.count),
//                 backgroundColor: "#ef4444",
//               }],
//             }} options={{
//               indexAxis: 'y',
//               responsive: true,
//               plugins: {
//                 legend: { display: false },
//               },
//               scales: {
//                 x: {
//                   ticks: { precision: 0 }
//                 }
//               }
//             }} />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white shadow-lg rounded-xl p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Инциденты по дням</h2>
//             <Line data={{
//               labels: data.incidentsDaily.map(i => format(parseISO(i.date), "dd.MM")),
//               datasets: [{
//                 label: "Инциденты в день",
//                 data: data.incidentsDaily.map(i => i.count),
//                 borderColor: "#3b82f6",
//                 tension: 0.3,
//               }],
//             }} />
//           </div>

//           <div className="bg-white shadow-lg rounded-xl p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Инциденты по неделям</h2>
//             <Line data={{
//               labels: data.incidentsWeekly.map(i => i.week),
//               datasets: [{
//                 label: "Инциденты в неделю",
//                 data: data.incidentsWeekly.map(i => i.count),
//                 borderColor: "#10b981",
//                 tension: 0.3,
//               }],
//             }} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// import { Select } from "antd";
// import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, Tooltip } from 'chart.js';
// import { format, parseISO } from "date-fns";
// import { useEffect, useState } from "react";
// import { Bar, Line, Pie } from "react-chartjs-2";
// import { NavLink } from 'react-router-dom';
// import styled from 'styled-components';
// import { axiosInstance } from "../api/axiosInstance";
// import RecentCriticalEvents from "../components/RecentCriticalEvents";
// import SecurityStatus from "../components/SecurityStatusPage";
// import SuspiciousIpTable from "../components/SuspiciousIpTable";
// import UniqueSourcesDailyChart from "../components/UniqueSourcesDailyChart";

// ChartJS.register(
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   Tooltip,
//   Legend
// );

// // Стилизация с помощью Styled Components

// const PageContainer = styled.div`
//   background-color: #f9fafb;
//   min-height: 100vh;
//   padding: 2rem;
// `;

// const ContentWrapper = styled.div`
//   max-width: 1280px;
//   margin: 0 auto;
//   padding: 2rem 0;
// `;

// const Header = styled.header`
//   background: linear-gradient(to right, #6a11cb, #2575fc);
//   padding: 1rem 2rem;
// `;

// const StyledNavLink = styled(NavLink)`
//   font-size: 1.1rem;
//   color: white;
//   padding: 0.5rem 1rem;
//   text-decoration: none;
//   border-radius: 0.375rem;
//   transition: background-color 0.3s ease;

//   &.active {
//     background-color: #4c6ef5;
//   }

//   &:hover {
//     background-color: #4c6ef5;
//   }
// `;

// const NavList = styled.ul`
//   display: flex;
//   list-style: none;
//   gap: 1rem;
// `;

// const SectionHeader = styled.h1`
//   font-size: 2.5rem;
//   font-weight: bold;
//   text-align: center;
//   margin: 2rem 0;
//   color: #1f2937;
// `;

// const DashboardCard = styled.div`
//   background-color: white;
//   border-radius: 0.75rem;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//   padding: 2rem;
//   margin-bottom: 2rem;
// `;

// const SectionTitle = styled.h2`
//   font-size: 1.25rem;
//   font-weight: 600;
//   margin-bottom: 1rem;
//   color: #374151;
// `;

// const InfoText = styled.div`
//   font-size: 1.25rem;
//   color: #374151;
// `;

// const ChartWrapper = styled.div`
//   margin-bottom: 2rem;
// `;

// const SelectWrapper = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
// `;

// const RangeSelect = styled(Select)`
//   width: 120px;
// `;
// interface OverviewData {
//   uniqueIps: number;
//   anomaliesByType: { [key: string]: number };
//   countryDistribution: { [country: string]: number };
//   incidentsDaily: { date: string; count: number }[];
//   incidentsWeekly: { week: string; count: number }[];
// }
// // 👇 ДОБАВЛЕНО: Интерфейс для топовых инцидентов
// interface TopCategory {
//   alert_category: string;
//   count: number;
// }
// const Dashboard = () => {
//   const [data, setData] = useState<OverviewData | null>(null);
//   const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
//   const [range, setRange] = useState<"daily" | "weekly" | "all">("daily");

//   useEffect(() => {
//     axiosInstance.get("/api/dashboard/overview")
//       .then(res => {
//         const raw = res.data;

//         const normalized: OverviewData = {
//           uniqueIps: parseInt(raw.uniqueIPs),
//           anomaliesByType: raw.anomalies,
//           countryDistribution: Object.fromEntries(
//             raw.geoDistribution.map((entry: any) => [entry.country, parseInt(entry.count)]),
//           ),
//           incidentsDaily: raw.incidents.daily.map((e: any) => ({
//             date: e.date,
//             count: parseInt(e.count),
//           })),
//           incidentsWeekly: raw.incidents.weekly.map((e: any) => ({
//             week: e.week,
//             count: parseInt(e.count),
//           })),
//         };

//         setData(normalized);
//       })
//       .catch(console.error);

//     axiosInstance.get("/api/alerts/top-categories", { params: { range } })
//       .then(res => setTopCategories(res.data))
//       .catch(console.error);
//   }, [range]);

//   if (!data) return <div>Загрузка...</div>;

//   return (
//     <PageContainer>
//       <ContentWrapper>
//         <Header>
//           <nav>
//             <NavList>
//               <li>
//                 <StyledNavLink to="/threat-intel">Threat Intelligence</StyledNavLink>
//               </li>
//               <li>
//                 <StyledNavLink to="/threat-lookup">Threat Lookup</StyledNavLink>
//               </li>
//             </NavList>
//           </nav>
//         </Header>

//         <SectionHeader>📊 Обзор сети и угроз</SectionHeader>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <SecurityStatus />

//           <DashboardCard>
//             <SuspiciousIpTable />
//             <RecentCriticalEvents />
//             <UniqueSourcesDailyChart />
//           </DashboardCard>
//         </div>

//         <InfoText>
//           Уникальные IP: <span style={{ fontWeight: "bold", color: "#2563eb" }}>{data.uniqueIps}</span>
//         </InfoText>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <DashboardCard>
//             <SectionTitle>Типы атак</SectionTitle>
//             <Pie data={{
//               labels: Object.keys(data.anomaliesByType),
//               datasets: [{
//                 data: Object.values(data.anomaliesByType),
//                 backgroundColor: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
//               }],
//             }} />
//           </DashboardCard>

//           <DashboardCard>
//             <SectionTitle>Геораспределение</SectionTitle>
//             <Bar data={{
//               labels: Object.keys(data.countryDistribution),
//               datasets: [{
//                 label: "Количество IP",
//                 data: Object.values(data.countryDistribution),
//                 backgroundColor: "#f59e0b",
//               }],
//             }} />
//           </DashboardCard>

//           <DashboardCard>
//             <SelectWrapper>
//               <SectionTitle>🔥 ТОП инцидентов по типам</SectionTitle>
//               <RangeSelect
//                 value={range}
//                 onChange={setRange}
//                 options={[
//                   { label: "За день", value: "daily" },
//                   { label: "За неделю", value: "weekly" },
//                   { label: "Все", value: "all" },
//                 ]}
//               />
//             </SelectWrapper>
//             <Bar data={{
//               labels: topCategories.map(c => c.alert_category),
//               datasets: [{
//                 label: "Количество",
//                 data: topCategories.map(c => c.count),
//                 backgroundColor: "#ef4444",
//               }],
//             }} options={{
//               indexAxis: 'y',
//               responsive: true,
//               plugins: { legend: { display: false } },
//               scales: { x: { ticks: { precision: 0 } } },
//             }} />
//           </DashboardCard>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <DashboardCard>
//             <SectionTitle>Инциденты по дням</SectionTitle>
//             <Line data={{
//               labels: data.incidentsDaily.map(i => format(parseISO(i.date), "dd.MM")),
//               datasets: [{
//                 label: "Инциденты в день",
//                 data: data.incidentsDaily.map(i => i.count),
//                 borderColor: "#3b82f6",
//                 tension: 0.3,
//               }],
//             }} />
//           </DashboardCard>

//           <DashboardCard>
//             <SectionTitle>Инциденты по неделям</SectionTitle>
//             <Line data={{
//               labels: data.incidentsWeekly.map(i => i.week),
//               datasets: [{
//                 label: "Инциденты в неделю",
//                 data: data.incidentsWeekly.map(i => i.count),
//                 borderColor: "#10b981",
//                 tension: 0.3,
//               }],
//             }} />
//           </DashboardCard>
//         </div>
//       </ContentWrapper>
//     </PageContainer>
//   );
// };

// export default Dashboard;

import { Select } from "antd";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, Tooltip } from 'chart.js';
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { axiosInstance } from "../api/axiosInstance";
import RecentCriticalEvents from "../components/RecentCriticalEvents";
import SecurityStatus from "../components/SecurityStatusPage";
import SuspiciousIpTable from "../components/SuspiciousIpTable";
import UniqueSourcesDailyChart from "../components/UniqueSourcesDailyChart";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Tooltip,
  Legend
);

// Styled Components
const PageWrapper = styled.div`
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const TopNav = styled.nav`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const NavItem = styled(NavLink)`
  color: #374151;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  background-color: #e5e7eb;
  transition: background-color 0.3s ease;

  &.active, &:hover {
    background-color: #4f46e5;
    color: #fff;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  // margin-bottom: 2rem;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;

  @media(min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.06);
  padding: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const ChartContainer = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.06);
`;

const Loading = styled.div`
  font-size: 1.2rem;
  color: #6b7280;
`;

interface OverviewData {
  uniqueIps: number;
  anomaliesByType: { [key: string]: number };
  countryDistribution: { [country: string]: number };
  incidentsDaily: { date: string; count: number }[];
  incidentsWeekly: { week: string; count: number }[];
}

interface TopCategory {
  alert_category: string;
  count: number;
}

const Dashboard = () => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
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

    const params = range === "all" ? {} : { range };
    axiosInstance.get("/api/alerts/top-categories", { params })
      .then(res => setTopCategories(res.data))
      .catch(console.error);
  }, [range]);

  if (!data) return <Loading>Загрузка данных...</Loading>;

  return (
    <PageWrapper>
      <TopNav>
        <NavItem to="/threat-intel">Threat Intelligence</NavItem>
        <NavItem to="/threat-lookup">Threat Lookup</NavItem>
        <NavItem to="/ip-reputation">Ip Reputation</NavItem>
        <NavItem to="/alerts">Alerts</NavItem>
      </TopNav>

      <Title>Network Security Dashboard</Title>

      <SecurityStatus />
      <RecentCriticalEvents />

      <Grid>
        <SuspiciousIpTable />
        <UniqueSourcesDailyChart />
      </Grid>

      <Grid>
        <ChartContainer>
          <CardHeader>
            <CardTitle>Геораспределение</CardTitle>
          </CardHeader>
          <Bar data={{
            labels: Object.keys(data.countryDistribution),
            datasets: [{
              label: "Количество IP",
              data: Object.values(data.countryDistribution),
              backgroundColor: "#f59e0b",
            }],
          }} />
        </ChartContainer>

        <ChartContainer>
          <CardHeader>
            <CardTitle>График инцидентов по типам</CardTitle>
            <Select
              value={range}
              onChange={v => setRange(v)}
              options={[
                { label: "За день", value: "daily" },
                { label: "За неделю", value: "weekly" },
                { label: "Все", value: "all" },
              ]}
              style={{ width: 120 }}
            />
          </CardHeader>
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
              x: { ticks: { precision: 0 } }
            }
          }} />
        </ChartContainer>
      </Grid>
    </PageWrapper>
  );
};

export default Dashboard;



// ИТОГ ИТОГ
// import { Select } from "antd";
// import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, Tooltip } from 'chart.js';
// import { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";

// import { NavLink } from 'react-router-dom';
// import styled from 'styled-components';
// import { axiosInstance } from "../api/axiosInstance";
// import RecentCriticalEvents from "../components/RecentCriticalEvents";
// import SecurityStatus from "../components/SecurityStatusPage";
// import SuspiciousIpTable from "../components/SuspiciousIpTable";
// import UniqueSourcesDailyChart from "../components/UniqueSourcesDailyChart";

// ChartJS.register(
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   Tooltip,
//   Legend
// );

// // Styled Components for Dashboard page
// const PageContainer = styled.div`
//   padding: 1rem;
//   background-color: #f9fafb;
// `;

// const Header = styled.header`
//   background: linear-gradient(to right, #6a11cb, #2575fc);
//   padding: 1rem 2rem;
// `;

// const Title = styled.h1`
//   font-size: 2rem;
//   font-weight: bold;
//   color: #1f2937;
//   margin-bottom: 1.5rem;
// `;

// const Section = styled.div`
//   display: grid;
//   gap: 1.5rem;
//   grid-template-columns: 1fr;
  
//   @media(min-width: 768px) {
//     grid-template-columns: repeat(2, 1fr);
//   }
// `;

// const Card = styled.div`
//   background: white;
//   border-radius: 0.5rem;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//   padding: 1.5rem;
// `;

// const CardTitle = styled.h2`
//   font-size: 1.25rem;
//   font-weight: 600;
//   margin-bottom: 1rem;
//   color: #1f2937;
// `;

// const CardContent = styled.div`
//   font-size: 1rem;
//   color: #4b5563;
// `;

// const ChartWrapper = styled.div`
//   background-color: white;
//   border-radius: 0.5rem;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//   padding: 1.5rem;
// `;

// const SelectWrapper = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
// `;

// const StyledNavLink = styled(NavLink)`
//   font-size: 1.1rem;
//   color: white;
//   padding: 0.5rem 1rem;
//   text-decoration: none;
//   border-radius: 0.375rem;
//   transition: background-color 0.3s ease;

//   &.active {
//     background-color: #4c6ef5;
//   }

//   &:hover {
//     background-color: #4c6ef5;
//   }
// `;
// interface OverviewData {
//   uniqueIps: number;
//   anomaliesByType: { [key: string]: number };
//   countryDistribution: { [country: string]: number };
//   incidentsDaily: { date: string; count: number }[];
//   incidentsWeekly: { week: string; count: number }[];
// }
// // 👇 ДОБАВЛЕНО: Интерфейс для топовых инцидентов
// interface TopCategory {
//   alert_category: string;
//   count: number;
// }
// const Dashboard = () => {
//   const [data, setData] = useState<OverviewData | null>(null);
//   const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
//   const [range, setRange] = useState<"daily" | "weekly" | "all">("daily");

//   useEffect(() => {
//     axiosInstance.get("/api/dashboard/overview")
//       .then(res => {
//         const raw = res.data;

//         const normalized: OverviewData = {
//           uniqueIps: parseInt(raw.uniqueIPs),
//           anomaliesByType: raw.anomalies,
//           countryDistribution: Object.fromEntries(
//             raw.geoDistribution.map((entry: any) => [entry.country, parseInt(entry.count)])
//           ),
//           incidentsDaily: raw.incidents.daily.map((e: any) => ({
//             date: e.date,
//             count: parseInt(e.count),
//           })),
//           incidentsWeekly: raw.incidents.weekly.map((e: any) => ({
//             week: e.week,
//             count: parseInt(e.count),
//           })),
//         };

//         setData(normalized);
//       })
//       .catch(console.error);

//     // 👇 Получение top-categories для выбранного диапазона
//     const params = range === "all" ? {} : { range };
//     axiosInstance.get("/api/alerts/top-categories", { params })
//       .then(res => setTopCategories(res.data))
//       .catch(console.error);
//   }, [range]);

//   if (!data) return <div>Загрузка...</div>;

//   return (
//     <PageContainer>
//       <Header>
//         <nav>
//           <ul>
//             <li>
//               <StyledNavLink to="/threat-intel">Threat Intelligence</StyledNavLink>
//             </li>
//             <li>
//               <StyledNavLink to="/threat-lookup">Threat Lookup</StyledNavLink>
//             </li>
//           </ul>
//         </nav>
//       </Header>

//       <Title>📊 Обзор сети и угроз</Title>

//       <SecurityStatus />

//       {/* <Section> */}
//         {/* <Card> */}
          
//         {/* </Card> */}

//         {/* <Card> */}
//           <RecentCriticalEvents />
//         {/* </Card> */}
//       {/* </Section> */}

//       <Section>
//         <SuspiciousIpTable />
//         {/* <Card> */}
//           <UniqueSourcesDailyChart />
//         {/* </Card> */}

//         {/* <CardContent>
//           Уникальные IP: <strong>{data.uniqueIps}</strong>
//         </CardContent> */}
//       </Section>

//       <Section>
//         {/* Типы атак */}
//         {/* <ChartWrapper>
//           <CardTitle>Типы атак</CardTitle>
//           <Pie data={{
//             labels: Object.keys(data.anomaliesByType),
//             datasets: [{
//               data: Object.values(data.anomaliesByType),
//               backgroundColor: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
//             }],
//           }} />
//         </ChartWrapper> */}

//         {/* Геораспределение */}
//         <ChartWrapper>
//           <CardTitle>Геораспределение</CardTitle>
//           <Bar data={{
//             labels: Object.keys(data.countryDistribution),
//             datasets: [{
//               label: "Количество IP",
//               data: Object.values(data.countryDistribution),
//               backgroundColor: "#f59e0b",
//             }],
//           }} />
//         </ChartWrapper>

//               <ChartWrapper>
//         <SelectWrapper>
//           <CardTitle>🔥 ТОП инцидентов по типам</CardTitle>
//           <Select
//             value={range}
//             onChange={v => setRange(v)}
//             options={[
//               { label: "За день", value: "daily" },
//               { label: "За неделю", value: "weekly" },
//               { label: "Все", value: "all" },
//             ]}
//             style={{ width: 120 }}
//           />
//         </SelectWrapper>

//         <Bar data={{
//           labels: topCategories.map(c => c.alert_category),
//           datasets: [{
//             label: "Количество",
//             data: topCategories.map(c => c.count),
//             backgroundColor: "#ef4444",
//           }],
//         }} options={{
//           indexAxis: 'y',
//           responsive: true,
//           plugins: {
//             legend: { display: false },
//           },
//           scales: {
//             x: { ticks: { precision: 0 } }
//           }
//         }} />
//       </ChartWrapper>

//       </Section>

//       {/* ТОП инцидентов по категориям */}
//       {/* <ChartWrapper>
//         <SelectWrapper>
//           <CardTitle>🔥 ТОП инцидентов по типам</CardTitle>
//           <Select
//             value={range}
//             onChange={v => setRange(v)}
//             options={[
//               { label: "За день", value: "daily" },
//               { label: "За неделю", value: "weekly" },
//               { label: "Все", value: "all" },
//             ]}
//             style={{ width: 120 }}
//           />
//         </SelectWrapper>

//         <Bar data={{
//           labels: topCategories.map(c => c.alert_category),
//           datasets: [{
//             label: "Количество",
//             data: topCategories.map(c => c.count),
//             backgroundColor: "#ef4444",
//           }],
//         }} options={{
//           indexAxis: 'y',
//           responsive: true,
//           plugins: {
//             legend: { display: false },
//           },
//           scales: {
//             x: { ticks: { precision: 0 } }
//           }
//         }} />
//       </ChartWrapper> */}

//       {/* Инциденты по дням */}
//       {/* <ChartWrapper>
//         <CardTitle>Инциденты по дням</CardTitle>
//         <Line data={{
//           labels: data.incidentsDaily.map(i => format(parseISO(i.date), "dd.MM")),
//           datasets: [{
//             label: "Инциденты в день",
//             data: data.incidentsDaily.map(i => i.count),
//             borderColor: "#3b82f6",
//             tension: 0.3,
//           }],
//         }} />
//       </ChartWrapper> */}

//       {/* Инциденты по неделям */}
//       {/* <ChartWrapper>
//         <CardTitle>Инциденты по неделям</CardTitle>
//         <Line data={{
//           labels: data.incidentsWeekly.map(i => i.week),
//           datasets: [{
//             label: "Инциденты в неделю",
//             data: data.incidentsWeekly.map(i => i.count),
//             borderColor: "#10b981",
//             tension: 0.3,
//           }],
//         }} />
//       </ChartWrapper> */}
//     </PageContainer>
//   );
// };

// export default Dashboard;
