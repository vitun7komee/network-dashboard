// import { useEffect, useState } from "react";
// import { axiosInstance } from "../api/axiosInstance";
// import '../global.css';

// interface Incident {
//   id: number;
//   timestamp: string;
//   type: string;
//   description: string;
//   severity: "low" | "medium" | "high";
//   resolved: boolean;
// }

// export default function HeuristicIncidentList() {
//   const [incidents, setIncidents] = useState<Incident[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [analyzing, setAnalyzing] = useState(false);

//   const load = async () => {
//     setLoading(true);
//     const res = await axiosInstance.get("/heuristics");
//     setIncidents(res.data);
//     setLoading(false);
//   };

//   const resolve = async (id: number) => {
//     await axiosInstance.post(`/heuristics/${id}/resolve`);
//     setIncidents((prev) => prev.filter((i) => i.id !== id));
//   };

//   const analyze = async () => {
//     setAnalyzing(true);
//     try {
//       await axiosInstance.post("/heuristics/analyze");
//       await load();
//     } catch (err) {
//       console.error("Ошибка анализа", err);
//     }
//     setAnalyzing(false);
//   };

//   useEffect(() => {
//     load();
//   }, []);


//   return (
//     <div className="mt-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-3xl font-bold text-gray-800">🧠 Эвристические инциденты</h2>
//         <button
//           onClick={analyze}
//           disabled={analyzing}
//           className={`transition px-5 py-2 rounded-lg text-white font-medium shadow-sm ${
//             analyzing
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {analyzing ? "🔄 Анализ..." : "🔍 Запустить анализ"}
//         </button>
//       </div>

//       {loading ? (
//         <div className="text-gray-500">⏳ Загрузка инцидентов...</div>
//       ) : incidents.length === 0 ? (
//         <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg shadow text-green-700">
//           <span className="text-xl">✅</span>
//           <span>Система не зарегистрировала подозрительного поведения.</span>
//         </div>
//       ) : (
//         <div className="grid gap-4">
//           {incidents.map((i) => (
//             <div
//               key={i.id}
//               className={`p-5 rounded-xl border-l-8 shadow bg-white flex flex-col gap-2 ${
//                 i.severity === "high"
//                   ? "border-red-600"
//                   : i.severity === "medium"
//                   ? "border-yellow-500"
//                   : "border-gray-400"
//               }`}
//             >
//               <div className="flex justify-between text-sm text-gray-500">
//                 <span>{new Date(i.timestamp).toLocaleString()}</span>
//                 <span
//                   className={`px-2 py-0.5 rounded text-xs font-semibold ${
//                     i.severity === "high"
//                       ? "bg-red-100 text-red-700"
//                       : i.severity === "medium"
//                       ? "bg-yellow-100 text-yellow-800"
//                       : "bg-gray-100 text-gray-600"
//                   }`}
//                 >
//                   {i.severity.toUpperCase()}
//                 </span>
//               </div>
//               <div className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 {getIcon(i.type)} {i.type}
//               </div>
//               <div className="text-gray-700 text-sm">{i.description}</div>
//               {!i.resolved && (
//                 <button
//                   onClick={() => resolve(i.id)}
//                   className="self-start mt-2 text-sm text-blue-600 hover:underline"
//                 >
//                   ✅ Пометить как решённый
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // 🔧 Дополнительная иконка по типу
// function getIcon(type: string) {
//   switch (type) {
//     case "foreign_connections":
//       return "🌍";
//     case "many_get_requests":
//       return "🔁";
//     case "dns_sweep":
//       return "📡";
//     case "volume_anomaly":
//       return "📶";
//     default:
//       return "⚠️";
//   }
// }

// LAST VERSION
// import { useEffect, useState } from "react";
// import { axiosInstance } from "../api/axiosInstance";
// import "../global.css";

// interface Incident {
//   id: number;
//   timestamp: string;
//   type: string;
//   description: string;
//   severity: "low" | "medium" | "high";
//   resolved: boolean;
//   threat?: string;
//   recommendations?: string;
// }

// export default function HeuristicIncidentList() {
//   const [incidents, setIncidents] = useState<Incident[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [analyzing, setAnalyzing] = useState(false);

//   const load = async () => {
//     setLoading(true);
//     const res = await axiosInstance.get("/heuristics");
//     setIncidents(res.data);
//     setLoading(false);
//   };

//   const resolve = async (id: number) => {
//     await axiosInstance.post(`/heuristics/${id}/resolve`);
//     setIncidents((prev) => prev.filter((i) => i.id !== id));
//   };

//   const analyze = async () => {
//     setAnalyzing(true);
//     try {
//       await axiosInstance.post("/heuristics/analyze");
//       await load();
//     } catch (err) {
//       console.error("Ошибка анализа", err);
//     }
//     setAnalyzing(false);
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <div className="mt-10 space-y-6 max-w-4xl mx-auto px-4">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">🧠 Эвристические инциденты</h2>
//         <button
//           onClick={analyze}
//           disabled={analyzing}
//           className={`transition px-5 py-2 rounded-lg text-white font-semibold shadow-sm ${
//             analyzing ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
//           }`}
//         >
//           {analyzing ? "🔄 Анализ..." : "🔍 Запустить анализ"}
//         </button>
//       </div>

//       {loading ? (
//         <div className="text-gray-500 animate-pulse">⏳ Загрузка инцидентов...</div>
//       ) : incidents.length === 0 ? (
//         <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg shadow text-green-700">
//           <span className="text-xl">✅</span>
//           <span>Система не зарегистрировала подозрительного поведения.</span>
//         </div>
//       ) : (
//         <div className="grid gap-6">
//           {incidents.map((i) => (
//             <div
//               key={i.id}
//               className={`p-6 rounded-2xl shadow-md bg-white border-l-[6px] space-y-3 transition ${
//                 i.severity === "high"
//                   ? "border-red-600"
//                   : i.severity === "medium"
//                   ? "border-yellow-500"
//                   : "border-gray-400"
//               }`}
//             >
//               <div className="flex justify-between items-center text-sm text-gray-500">
//                 <span>{new Date(i.timestamp).toLocaleString()}</span>
//                 <span
//                   className={`px-2 py-0.5 rounded text-xs font-bold tracking-wide ${
//                     i.severity === "high"
//                       ? "bg-red-100 text-red-700"
//                       : i.severity === "medium"
//                       ? "bg-yellow-100 text-yellow-800"
//                       : "bg-gray-100 text-gray-600"
//                   }`}
//                 >
//                   {i.severity.toUpperCase()}
//                 </span>
//               </div>

//               <div className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 <span className="text-2xl">{getIcon(i.type)}</span> {getReadableName(i.type)}
//               </div>

//               <div className="text-gray-700 text-sm whitespace-pre-wrap">{i.description}</div>

//               {i.threat && (
//                 <div className="text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
//                   <strong>⚠️ Потенциальная угроза:</strong> {i.threat}
//                 </div>
//               )}

//               {i.recommendations && (
//                 <div className="text-sm text-blue-700 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
//                   <strong>🔧 Рекомендации:</strong> {i.recommendations}
//                 </div>
//               )}

//               {!i.resolved && (
//                 <button
//                   onClick={() => resolve(i.id)}
//                   className="text-sm text-indigo-600 hover:underline mt-2"
//                 >
//                   ✅ Пометить как решённый
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // 🧠 Иконки по типам эвристик
// function getIcon(type: string) {
//   const icons: Record<string, string> = {
//     foreign_connections: "🌍",
//     many_get_requests: "🔁",
//     dns_sweep: "📡",
//     volume_anomaly: "📶",
//     high_severity_alerts: "🚨",
//     http_post_flood: "📤",
//     suspicious_dns_query: "🌐",
//     port_scanning: "🛠️",
//   };
//   return icons[type] || "⚠️";
// }

// // 🏷️ Человеческие названия эвристик
// function getReadableName(type: string) {
//   const names: Record<string, string> = {
//     foreign_connections: "Частые зарубежные подключения",
//     many_get_requests: "Много GET-запросов",
//     dns_sweep: "DNS-сканирование",
//     volume_anomaly: "Аномалия объёма соединений",
//     high_severity_alerts: "Высокий уровень предупреждений",
//     http_post_flood: "Избыточные POST-запросы",
//     suspicious_dns_query: "Подозрительные DNS-запросы",
//     port_scanning: "Сканирование портов",
//   };
//   return names[type] || type;
// }
import { useEffect, useState } from "react";
import styled from "styled-components";
import { axiosInstance } from "../api/axiosInstance";
import "../global.css";

interface Incident {
  id: number;
  timestamp: string;
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  resolved: boolean;
  threat?: string;
  recommendations?: string;
}

export default function HeuristicIncidentList() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await axiosInstance.get("/heuristics");
    setIncidents(res.data);
    setLoading(false);
  };

  const resolve = async (id: number) => {
    await axiosInstance.post(`/heuristics/${id}/resolve`);
    setIncidents((prev) => prev.filter((i) => i.id !== id));
  };

  const analyze = async () => {
    setAnalyzing(true);
    try {
      await axiosInstance.post("/heuristics/analyze");
      await load();
    } catch (err) {
      console.error("Ошибка анализа", err);
    }
    setAnalyzing(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Эвристические инциденты</Title>
        <ActionButton onClick={analyze} disabled={analyzing}>
          {analyzing ? "🔄 Анализ..." : "Запустить анализ"}
        </ActionButton>
      </Header>

      {loading ? (
        <InfoText>⏳ Загрузка инцидентов...</InfoText>
      ) : incidents.length === 0 ? (
        <SuccessCard>
          <span>✅</span>
          <span>Система не зарегистрировала подозрительного поведения.</span>
        </SuccessCard>
      ) : (
        <IncidentsGrid>
          {incidents.map((i) => (
            <IncidentCard key={i.id} severity={i.severity}>
              <IncidentMeta>
                <span>{new Date(i.timestamp).toLocaleString()}</span>
                <SeverityBadge severity={i.severity}>{i.severity.toUpperCase()}</SeverityBadge>
              </IncidentMeta>

              <IncidentTitle>
                <span>{getIcon(i.type)}</span> {getReadableName(i.type)}
              </IncidentTitle>

              <Description>{i.description}</Description>

              {i.threat && (
                <ThreatCard>
                  <strong>Потенциальная угроза:</strong> {i.threat}
                </ThreatCard>
              )}

              {i.recommendations && (
                <AdviceCard>
                  <strong>Рекомендации:</strong> {i.recommendations}
                </AdviceCard>
              )}

              {!i.resolved && (
                <ResolveButton onClick={() => resolve(i.id)}>Пометить как решённый</ResolveButton>
              )}
            </IncidentCard>
          ))}
        </IncidentsGrid>
      )}
    </Container>
  );
}

// 📌 Стили
const Container = styled.div`
  padding: 40px 20px;
  max-width: 1100px;
  margin: 0 auto;
  background-color: #1f1f1f;
  min-height: 100vh;
  color: #e4e4e4;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
`;

const ActionButton = styled.button`
  background: #6366f1;
  color: #fff;
  padding: 10px 24px;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #4f46e5;
  }
  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

const InfoText = styled.div`
  color: #aaa;
  font-size: 16px;
`;

const SuccessCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #224422;
  border: 1px solid #2e7d32;
  padding: 16px;
  border-radius: 12px;
  color: #c8facc;
  box-shadow: 0 0 10px #133213;
`;

const IncidentsGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const IncidentCard = styled.div<{ severity: string }>`
  background: #2a2a2a;
  border-left: 6px solid
    ${({ severity }) =>
      severity === "high"
        ? "#ef4444"
        : severity === "medium"
        ? "#facc15"
        : "#6b7280"};
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
`;

const IncidentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #aaa;
  font-size: 14px;
  margin-bottom: 8px;
`;

const SeverityBadge = styled.span<{ severity: string }>`
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  background: ${({ severity }) =>
    severity === "high"
      ? "#fee2e2"
      : severity === "medium"
      ? "#fef9c3"
      : "#d1d5db"};
  color: ${({ severity }) =>
    severity === "high"
      ? "#b91c1c"
      : severity === "medium"
      ? "#92400e"
      : "#374151"};
`;

const IncidentTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  margin: 10px 0;
`;

const Description = styled.div`
  font-size: 14px;
  color: #d1d5db;
  white-space: pre-wrap;
`;

const ThreatCard = styled.div`
  background: #7f1d1d;
  color: #fef2f2;
  padding: 12px;
  border-radius: 10px;
  margin-top: 10px;
  border: 1px solid #991b1b;
`;

const AdviceCard = styled.div`
  background: #1e40af;
  color: #dbeafe;
  padding: 12px;
  border-radius: 10px;
  margin-top: 10px;
  border: 1px solid #1e3a8a;
`;

const ResolveButton = styled.button`
  margin-top: 12px;
  font-size: 14px;
  color: #818cf8;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    text-decoration: underline;
  }
`;


// 📌 Иконки по типам эвристик
function getIcon(type: string) {
  const icons: Record<string, string> = {
    foreign_connections: "🌍",
    many_get_requests: "🔁",
    dns_sweep: "📡",
    volume_anomaly: "📶",
    high_severity_alerts: "🚨",
    http_post_flood: "📤",
    suspicious_dns_query: "🌐",
    port_scanning: "🛠️",
  };
  return icons[type] || "⚠️";
}

// 📌 Названия эвристик
function getReadableName(type: string) {
  const names: Record<string, string> = {
    foreign_connections: "Частые зарубежные подключения",
    many_get_requests: "Много GET-запросов",
    dns_sweep: "DNS-сканирование",
    volume_anomaly: "Аномалия объёма соединений",
    high_severity_alerts: "Высокий уровень предупреждений",
    http_post_flood: "Избыточные POST-запросы",
    suspicious_dns_query: "Подозрительные DNS-запросы",
    port_scanning: "Сканирование портов",
  };
  return names[type] || type;
}
