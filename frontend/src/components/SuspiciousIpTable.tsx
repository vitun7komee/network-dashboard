// import { useEffect, useState } from "react";
// import { axiosInstance } from "../api/axiosInstance";

// interface SuspiciousIp {
//   ip: string;
//   reputation: string;
//   score: number;
//   country: string | null;
//   usage_type: string | null;
//   last_checked: string;
// }

// export default function SuspiciousIpTable() {
//   const [ips, setIps] = useState<SuspiciousIp[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     axiosInstance
//       .get<SuspiciousIp[]>("/suspicious-ips")
//       .then((res) => {
//         setIps(res.data);
//         setError(null);
//       })
//       .catch((err) => {
//         console.error("Ошибка загрузки подозрительных IP:", err);
//         setError("Не удалось загрузить данные о подозрительных IP");
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div className="p-4">Загрузка подозрительных IP...</div>;
//   if (error) return <div className="p-4 text-red-600">{error}</div>;
//   if (ips.length === 0) return <div className="p-4">Нет подозрительных IP за последнее время.</div>;

//   return (
//     <div className="mt-6">
//       <h2 className="text-xl font-bold mb-2">🚨 Подозрительные IP (Top 10)</h2>
//       <div className="overflow-x-auto rounded-lg shadow">
//         <table className="min-w-full table-auto border-collapse bg-white">
//           <thead>
//             <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
//               <th className="p-3">IP</th>
//               <th className="p-3">Репутация</th>
//               <th className="p-3">Score</th>
//               <th className="p-3">Страна</th>
//               <th className="p-3">Тип использования</th>
//               <th className="p-3">Последняя проверка</th>
//             </tr>
//           </thead>
//           <tbody>
//             {ips.map((ip) => (
//               <tr key={ip.ip} className="border-t hover:bg-gray-50 text-sm">
//                 <td className="p-3 font-mono">{ip.ip}</td>
//                 <td className="p-3 capitalize">{ip.reputation}</td>
//                 <td className={`p-3 font-semibold ${ip.score >= 85 ? 'text-red-600' : ip.score >= 40 ? 'text-yellow-500' : 'text-green-600'}`}>
//                   {ip.score}
//                 </td>
//                 <td className="p-3">{ip.country || "—"}</td>
//                 <td className="p-3">{ip.usage_type || "—"}</td>
//                 <td className="p-3 text-xs text-gray-500">{new Date(ip.last_checked).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import styled from "styled-components";
import { axiosInstance } from "../api/axiosInstance";

interface SuspiciousIp {
  ip: string;
  reputation: string;
  score: number;
  country: string | null;
  usage_type: string | null;
  last_checked: string;
}

const Container = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  // background: #f3f4f6;
background:  #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  // color: #dc2626; /* Red for alerts */
  margin-bottom: 1rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 0.75rem;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const Th = styled.th`
  padding: 1rem;
  background-color: #f9fafb;
  color: #1f2937;
  font-weight: 600;
  text-align: left;
`;

const Td = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
  text-align: left;
  font-family: 'Courier New', Courier, monospace;
`;

const Badge = styled.span<{ score: number }>`
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  background-color: ${({ score }) =>
    score >= 85
      ? "#ef4444" // Red for high risk
      : score >= 40
      ? "#f59e0b" // Yellow for medium risk
      : "#22c55e"}; // Green for low risk
  color: white;
`;

const SuspiciousIpTable = () => {
  const [ips, setIps] = useState<SuspiciousIp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get<SuspiciousIp[]>("/suspicious-ips")
      .then((res) => {
        setIps(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Ошибка загрузки подозрительных IP:", err);
        setError("Не удалось загрузить данные о подозрительных IP");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Загрузка подозрительных IP...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (ips.length === 0) return <div className="p-4">Нет подозрительных IP за последнее время.</div>;

  return (
    <Container>
      <Title>Топ 10 подозрительных ip</Title>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>IP</Th>
              <Th>Репутация</Th>
              <Th>Score</Th>
              <Th>Страна</Th>
              <Th>Тип использования</Th>
              <Th>Последняя проверка</Th>
            </tr>
          </thead>
          <tbody>
            {ips.map((ip) => (
              <tr key={ip.ip} className="hover:bg-gray-50">
                <Td>{ip.ip}</Td>
                <Td>{ip.reputation}</Td>
                <Td>
                  <Badge score={ip.score}>{ip.score}</Badge>
                </Td>
                <Td>{ip.country || "—"}</Td>
                <Td>{ip.usage_type || "—"}</Td>
                <Td>{new Date(ip.last_checked).toLocaleString()}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default SuspiciousIpTable;
