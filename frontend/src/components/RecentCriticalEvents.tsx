import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

interface CriticalEvent {
  timestamp: string;
  src_ip: string;
  dest_ip: string;
  alert_signature: string;
  alert_category: string;
  alert_severity: number;
}

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
  }, []);

  if (loading) return <div className="p-4">Загрузка критических событий...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (events.length === 0) return <div className="p-4">Нет критических событий.</div>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-3">🛑 Последние критические события</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full table-auto border-collapse bg-white text-sm">
          <thead className="bg-gray-100 text-left font-semibold text-gray-700">
            <tr>
              <th className="p-3">Время</th>
              <th className="p-3">Источник</th>
              <th className="p-3">Назначение</th>
              <th className="p-3">Сигнатура</th>
              <th className="p-3">Категория</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="p-3 text-gray-500">{new Date(event.timestamp).toLocaleString()}</td>
                <td className="p-3 font-mono text-xs">{event.src_ip}</td>
                <td className="p-3 font-mono text-xs">{event.dest_ip}</td>
                <td className="p-3">{event.alert_signature}</td>
                <td className="p-3">{event.alert_category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
