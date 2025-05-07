// import { useEffect, useState } from "react";
// import { axiosInstance } from "../api/axiosInstance";

// type DnsLog = {
//   id: number;
//   timestamp: string;
//   type: string;
//   query: string;
//   src_ip: string;
//   dest_ip: string;
// };

// export default function DnsList() {
//   const [logs, setLogs] = useState<DnsLog[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axiosInstance
//       .get<DnsLog[]>("/dns")
//       .then(res => setLogs(res.data))
//       .catch(err => console.error("DNS logs fetch error:", err))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <p>Loading DNS logs…</p>;
//   if (logs.length === 0) return <p>No DNS logs yet.</p>;

//   return (
//     <div style={{ padding: 16 }}>
//       <h1>DNS Logs</h1>
//       <table border={1} cellPadding={8} cellSpacing={0}>
//         <thead>
//           <tr>
//             <th>Time</th>
//             <th>Type</th>
//             <th>Query</th>
//             <th>Src IP</th>
//             <th>Dest IP</th>
//           </tr>
//         </thead>
//         <tbody>
//           {logs.map(l => (
//             <tr key={l.id}>
//               <td>{new Date(l.timestamp).toLocaleString()}</td>
//               <td>{l.type}</td>
//               <td>{l.query}</td>
//               <td>{l.src_ip}</td>
//               <td>{l.dest_ip}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { axiosInstance } from "../api/axiosInstance";

type DnsLog = {
  id: number;
  timestamp: string;
  type: string;
  query: string;
  src_ip: string;
  dest_ip: string;
};

export default function DnsList() {
  const [logs, setLogs] = useState<DnsLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) Начальный запрос
    axiosInstance
      .get<DnsLog[]>("/dns")
      .then(res => {
        console.log("GET /dns response:", res.data);
        setLogs(res.data);
      })
      .catch(err => console.error("DNS logs fetch error:", err))
      .finally(() => setLoading(false));

    // 2) Подключаем WebSocket
    const socket: Socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("✅ WebSocket connected:", socket.id);
    });

    // 3) Приход новых DNS-логов — добавляем их в начало списка
    socket.on("new-dns", (newLog: DnsLog) => {
      console.log("🛰️ Received new-dns:", newLog);
      setLogs(prev => [newLog, ...prev]);
    });

    socket.on("disconnect", () => {
      console.warn("🛑 WebSocket disconnected");
    });

    // 4) Очистка
    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) return <p>Loading DNS logs…</p>;
  if (logs.length === 0) return <p>No DNS logs yet.</p>;

  return (
    <div style={{ padding: 16 }}>
      <h1>DNS Logs</h1>
      <table border={1} cellPadding={8} cellSpacing={0}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Type</th>
            <th>Query</th>
            <th>Src IP</th>
            <th>Dest IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{new Date(l.timestamp).toLocaleString()}</td>
              <td>{l.type}</td>
              <td>{l.query}</td>
              <td>{l.src_ip}</td>
              <td>{l.dest_ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
