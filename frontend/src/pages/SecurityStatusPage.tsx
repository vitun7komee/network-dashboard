import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

type SecurityStatus = "green" | "yellow" | "red";

interface StatusData {
  status: SecurityStatus;
  most_common_threat: string;
  threat_count: number;
}

const statusColors: Record<SecurityStatus, string> = {
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  red: "bg-red-600",
};

const statusLabels: Record<SecurityStatus, string> = {
  green: "Всё в порядке",
  yellow: "Возможна угроза",
  red: "Критическая ситуация",
};

export default function SecurityStatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = () => {
    setLoading(true);
    axiosInstance
      .get<StatusData>("/securitystatus")
      .then((res) => {
        setData(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Не удалось загрузить данные");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return <div className="p-4">Загрузка статуса безопасности...</div>;
  }

  if (error || !data) {
    return <div className="p-4 text-red-600">{error || "Ошибка загрузки данных"}</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">🚥 Статус безопасности</h1>

      <div className={`rounded-xl p-6 shadow-lg text-white ${statusColors[data.status]}`}>
        <h2 className="text-xl font-semibold">{statusLabels[data.status]}</h2>
        <p className="mt-2">
          Основная угроза: <strong>{data.most_common_threat}</strong>
        </p>
        <p>Количество таких угроз: {data.threat_count}</p>
      </div>

    </div>
  );
}
