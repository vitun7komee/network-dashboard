import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

interface SuspiciousIp {
  ip: string;
  reputation: string;
  score: number;
  country: string | null;
  usage_type: string | null;
  last_checked: string;
}

export default function SuspiciousIpTable() {
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
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">🚨 Подозрительные IP (Top 10)</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full table-auto border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="p-3">IP</th>
              <th className="p-3">Репутация</th>
              <th className="p-3">Score</th>
              <th className="p-3">Страна</th>
              <th className="p-3">Тип использования</th>
              <th className="p-3">Последняя проверка</th>
            </tr>
          </thead>
          <tbody>
            {ips.map((ip) => (
              <tr key={ip.ip} className="border-t hover:bg-gray-50 text-sm">
                <td className="p-3 font-mono">{ip.ip}</td>
                <td className="p-3 capitalize">{ip.reputation}</td>
                <td className={`p-3 font-semibold ${ip.score >= 85 ? 'text-red-600' : ip.score >= 40 ? 'text-yellow-500' : 'text-green-600'}`}>
                  {ip.score}
                </td>
                <td className="p-3">{ip.country || "—"}</td>
                <td className="p-3">{ip.usage_type || "—"}</td>
                <td className="p-3 text-xs text-gray-500">{new Date(ip.last_checked).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
