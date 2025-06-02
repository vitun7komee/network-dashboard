// import { useEffect, useState } from "react";
// import { axiosInstance } from "../api/axiosInstance";

// interface CriticalEvent {
//   timestamp: string;
//   src_ip: string;
//   dest_ip: string;
//   alert_signature: string;
//   alert_category: string;
//   alert_severity: number;
// }

// export default function RecentCriticalEvents() {
//   const [events, setEvents] = useState<CriticalEvent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     axiosInstance
//       .get<CriticalEvent[]>("/critical-alerts")
//       .then((res) => {
//         setEvents(res.data);
//         setError(null);
//       })
//       .catch((err) => {
//         console.error("Ошибка загрузки критических событий:", err);
//         setError("Не удалось загрузить критические события.");
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div className="p-4">Загрузка критических событий...</div>;
//   if (error) return <div className="p-4 text-red-600">{error}</div>;
//   if (events.length === 0) return <div className="p-4">Нет критических событий.</div>;

//   return (
//     <div className="mt-6">
//       <h2 className="text-xl font-bold mb-3">🛑 Последние критические события</h2>
//       <div className="overflow-x-auto rounded-lg shadow">
//         <table className="min-w-full table-auto border-collapse bg-white text-sm">
//           <thead className="bg-gray-100 text-left font-semibold text-gray-700">
//             <tr>
//               <th className="p-3">Время</th>
//               <th className="p-3">Источник</th>
//               <th className="p-3">Назначение</th>
//               <th className="p-3">Сигнатура</th>
//               <th className="p-3">Категория</th>
//             </tr>
//           </thead>
//           <tbody>
//             {events.map((event, idx) => (
//               <tr key={idx} className="border-t hover:bg-gray-50">
//                 <td className="p-3 text-gray-500">{new Date(event.timestamp).toLocaleString()}</td>
//                 <td className="p-3 font-mono text-xs">{event.src_ip}</td>
//                 <td className="p-3 font-mono text-xs">{event.dest_ip}</td>
//                 <td className="p-3">{event.alert_signature}</td>
//                 <td className="p-3">{event.alert_category}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import styled from "styled-components";
import { axiosInstance } from "../api/axiosInstance";

// Подключаем сокет
const socket: Socket = io("http://localhost:4000");

interface CriticalEvent {
  timestamp: string;
  src_ip: string;
  dest_ip: string;
  alert_signature: string;
  alert_category: string;
  alert_severity: number;
}

const Container = styled.div`
  // margin-top: 2rem;
  // background: linear-gradient(180deg, #f8fafc, #ffffff);
  // border-radius: 1rem;
  // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  // padding: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  //font-size: 1.5rem;
  font-weight: 600;
  // color: #e11d48; /* Red for attention */
  margin-bottom: 1rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 0.75rem;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  min-width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1rem;
  background-color: #f3f4f6;
  font-weight: 600;
  color: #374151;
  text-align: left;
`;

const Td = styled.td`
  padding: 1rem;
  color: #4b5563;
  text-align: left;
  font-size: 0.875rem;
  font-family: 'Courier New', Courier, monospace;
`;

const StatusBadge = styled.span<{ severity: number }>`
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  background-color: ${({ severity }) =>
    severity === 1
      ? "#ef4444" // Green for low severity
      : severity === 2 
      ? "#f59e0b" // Yellow for medium severity
      : "#22c55e"}; // Red for high severity 
  color: white;
`;
export default function RecentCriticalEvents() {
  const [events, setEvents] = useState<CriticalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get<CriticalEvent[]>("/critical-alerts")
      .then((res) => {
        setEvents(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Ошибка загрузки критических событий:", err);
        setError("Не удалось загрузить критические события.");
      })
      .finally(() => setLoading(false));

          // слушаем событие от сервера
    socket.on("new-critical-alert", (newEvent: CriticalEvent) => {
      setEvents((prevEvents) => [newEvent, ...prevEvents]);
    });
      socket.on("connect", () => {
      console.log(" RECENT CRITICAL EVENTS SOCKET:", socket.id);
    });
    // отписка при размонтировании компонента
    return () => {
      socket.off("new-critical-alert");
    };
  }, []);



  if (loading) return <div className="p-4">Загрузка критических событий...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (events.length === 0) return <div className="p-4">Нет критических событий.</div>;

  return (
    <Container>
      <Title>Последние критические события</Title>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Время</Th>
              <Th>Источник</Th>
              <Th>Назначение</Th>
              <Th>Сигнатура</Th>
              <Th>Категория</Th>
              <Th>Уровень угрозы</Th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, idx) => (
              <tr key={idx}>
                <Td>{new Date(event.timestamp).toLocaleString()}</Td>
                <Td>{event.src_ip}</Td>
                <Td>{event.dest_ip}</Td>
                <Td>{event.alert_signature}</Td>
                <Td>{event.alert_category}</Td>
                <Td>
                  <StatusBadge severity={event.alert_severity}>
                    {event.alert_severity === 1
                      ? "Высокий"
                      : event.alert_severity === 2
                      ? "Средний"
                      : "Низкий"}
                  </StatusBadge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
}// предыдущая версия снизу
// export default function RecentCriticalEvents() {
//   const [events, setEvents] = useState<CriticalEvent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     axiosInstance
//       .get<CriticalEvent[]>("/critical-alerts")
//       .then((res) => {
//         setEvents(res.data);
//         setError(null);
//       })
//       .catch((err) => {
//         console.error("Ошибка загрузки критических событий:", err);
//         setError("Не удалось загрузить критические события.");
//       })
//       .finally(() => setLoading(false));
//   }, []);
    
//   if (loading) return <div className="p-4">Загрузка критических событий...</div>;
//   if (error) return <div className="p-4 text-red-600">{error}</div>;
//   if (events.length === 0) return <div className="p-4">Нет критических событий.</div>;

//   return (
//     <Container>
//       <Title>🛑 Последние критические события</Title>
//       <TableWrapper>
//         <Table>
//           <thead>
//             <tr>
//               <Th>Время</Th>
//               <Th>Источник</Th>
//               <Th>Назначение</Th>
//               <Th>Сигнатура</Th>
//               <Th>Категория</Th>
//               <Th>Уровень угрозы</Th>
//             </tr>
//           </thead>
//           <tbody>
//             {events.map((event, idx) => (
//               <tr key={idx}>
//                 <Td>{new Date(event.timestamp).toLocaleString()}</Td>
//                 <Td>{event.src_ip}</Td>
//                 <Td>{event.dest_ip}</Td>
//                 <Td>{event.alert_signature}</Td>
//                 <Td>{event.alert_category}</Td>
//                 <Td>
//                   <StatusBadge severity={event.alert_severity}>
//                     {event.alert_severity === 1
//                       ? "Низкий"
//                       : event.alert_severity === 2
//                       ? "Средний"
//                       : "Высокий"}
//                   </StatusBadge>
//                 </Td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </TableWrapper>
//     </Container>
//   );
// }
