// import { useEffect, useState } from "react";
// import { axiosInstance } from "../api/axiosInstance";

// type SecurityStatus = "green" | "yellow" | "red";

// interface StatusData {
//   status: SecurityStatus;
//   most_common_threat: string;
//   threat_count: number;
// }

// const statusColors: Record<SecurityStatus, string> = {
//   green: "bg-green-500",
//   yellow: "bg-yellow-400",
//   red: "bg-red-600",
// };

// const statusLabels: Record<SecurityStatus, string> = {
//   green: "Всё в порядке",
//   yellow: "Возможна угроза",
//   red: "Критическая ситуация",
// };

// export default function SecurityStatusPage() {
//   const [data, setData] = useState<StatusData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchStatus = () => {
//     setLoading(true);
//     axiosInstance
//       .get<StatusData>("/securitystatus")
//       .then((res) => {
//         setData(res.data);
//         setError(null);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("Не удалось загрузить данные");
//       })
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     fetchStatus();
//   }, []);

//   if (loading) {
//     return <div className="p-4">Загрузка статуса безопасности...</div>;
//   }

//   if (error || !data) {
//     return <div className="p-4 text-red-600">{error || "Ошибка загрузки данных"}</div>;
//   }

//   return (
//     <div className="p-6 max-w-2xl mx-auto space-y-4">
//       <h1 className="text-2xl font-bold">🚥 Статус безопасности</h1>

//       <div className={`rounded-xl p-6 shadow-lg text-white ${statusColors[data.status]}`}>
//         <h2 className="text-xl font-semibold">{statusLabels[data.status]}</h2>
//         <p className="mt-2">
//           Основная угроза: <strong>{data.most_common_threat}</strong>
//         </p>
//         <p>Количество таких угроз: {data.threat_count}</p>
//       </div>

//     </div>
//   );
// }
// components/SecurityStatusPage.tsx

// import { useEffect, useState } from "react";
// import { axiosInstance } from "../api/axiosInstance";

// type SecurityStatus = "green" | "yellow" | "red";

// interface StatusData {
//   status: SecurityStatus;
//   most_common_threat: string;
//   threat_count: number;
// }

// const statusColors: Record<SecurityStatus, string> = {
//   green: "bg-green-500",
//   yellow: "bg-yellow-400",
//   red: "bg-red-600",
// };

// const statusLabels: Record<SecurityStatus, string> = {
//   green: "Всё в порядке",
//   yellow: "Возможна угроза",
//   red: "Критическая ситуация",
// };

// const SecurityStatus = () => {
//   const [statusData, setStatusData] = useState<StatusData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchStatus = () => {
//     setLoading(true);
//     axiosInstance
//       .get<StatusData>("/securitystatus")
//       .then((res) => {
//         setStatusData(res.data);
//         setError(null);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("Не удалось загрузить данные");
//       })
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     fetchStatus();
//   }, []);

//   if (loading) {
//     return <div className="p-4">Загрузка статуса безопасности...</div>;
//   }

//   if (error) {
//     return <div className="p-4 text-red-600">{error}</div>;
//   }

//   return (
//     <div className={`rounded-xl p-6 shadow-lg text-white ${statusColors[statusData?.status || "green"]}`}>
//       <h2 className="text-xl font-semibold">{statusLabels[statusData?.status || "green"]}</h2>
//       <p className="mt-2">
//         Основная угроза: <strong>{statusData?.most_common_threat}</strong>
//       </p>
//       <p>Количество таких угроз: {statusData?.threat_count}</p>
//     </div>
//   );
// };

// export default SecurityStatus;
// import { useEffect, useState } from "react";
// import { FaExclamationTriangle, FaShieldAlt, FaTimesCircle } from "react-icons/fa";
// import styled from "styled-components";
// import { axiosInstance } from "../api/axiosInstance";

// type SecurityStatus = "green" | "yellow" | "red";

// interface StatusData {
//   status: SecurityStatus;
//   most_common_threat: string;
//   threat_count: number;
// }

// const statusColors: Record<SecurityStatus, string> = {
//   green: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
//   yellow: "linear-gradient(135deg, #fbbf24, #f59e0b)",
//   red: "linear-gradient(135deg, #ef4444, #dc2626)",
// };

// const statusIcons: Record<SecurityStatus, JSX.Element> = {
//   green: <FaShieldAlt size={30} />,
//   yellow: <FaExclamationTriangle size={30} />,
//   red: <FaTimesCircle size={30} />,
// };

// const statusLabels: Record<SecurityStatus, string> = {
//   green: "Всё в порядке",
//   yellow: "Возможна угроза",
//   red: "Критическая ситуация",
// };

// // Styled components
// const StatusCard = styled.div<{ status: SecurityStatus }>`
//   background: ${({ status }) => statusColors[status]};
//   border-radius: 1rem;
//   padding: 2rem;
//   color: white;
//   box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//   transition: all 0.3s ease-in-out;
//   transform: scale(1);
//   &:hover {
//     transform: scale(1.05);
//   }
// `;

// const StatusHeader = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
// `;

// const StatusTitle = styled.h2`
//   font-size: 1.5rem;
//   font-weight: 600;
//   margin: 0;
// `;

// const ThreatInfo = styled.p`
//   margin-top: 1rem;
//   font-size: 1.1rem;
// `;

// const ThreatDetails = styled.div`
//   margin-top: 1.5rem;
//   font-size: 1rem;
//   line-height: 1.6;
// `;

// const LoadingText = styled.div`
//   font-size: 1.2rem;
//   font-weight: 500;
//   color: #4b5563;
// `;

// const ErrorText = styled.div`
//   font-size: 1.2rem;
//   font-weight: 500;
//   color: #ef4444;
//   text-align: center;
// `;

// const SecurityStatus = () => {
//   const [statusData, setStatusData] = useState<StatusData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchStatus = () => {
//     setLoading(true);
//     axiosInstance
//       .get<StatusData>("/securitystatus")
//       .then((res) => {
//         setStatusData(res.data);
//         setError(null);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("Не удалось загрузить данные");
//       })
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     fetchStatus();
//   }, []);

//   if (loading) {
//     return <LoadingText>Загрузка статуса безопасности...</LoadingText>;
//   }

//   if (error) {
//     return <ErrorText>{error}</ErrorText>;
//   }

//   return (
//     <StatusCard status={statusData?.status || "green"}>
//       <StatusHeader>
//         {statusIcons[statusData?.status || "green"]}
//         <StatusTitle>{statusLabels[statusData?.status || "green"]}</StatusTitle>
//       </StatusHeader>
//       <ThreatInfo>
//         Основная угроза: <strong>{statusData?.most_common_threat}</strong>
//       </ThreatInfo>
//       <ThreatDetails>
//         Количество таких угроз: <strong>{statusData?.threat_count}</strong>
//       </ThreatDetails>
//     </StatusCard>
//   );
// };

// export default SecurityStatus;
import { useEffect, useState } from "react";
import { FaExclamationTriangle, FaShieldAlt, FaTimesCircle } from "react-icons/fa";
import styled from "styled-components";
import { axiosInstance } from "../api/axiosInstance";

type SecurityStatus = "green" | "yellow" | "red";

interface StatusData {
  status: SecurityStatus;
  most_common_threat: string;
  threat_count: number;
}
//#3b82f6)
const statusColors: Record<SecurityStatus, string> = {
  green: "linear-gradient(135deg, #6ee7b7,rgb(34, 235, 94))",
  yellow: "linear-gradient(135deg, #fbbf24, #f59e0b)",
  red: "linear-gradient(135deg, #ef4444, #dc2626)",
};

const statusIcons: Record<SecurityStatus, JSX.Element> = {
  green: <FaShieldAlt size={60} />,
  yellow: <FaExclamationTriangle size={50} />,
  red: <FaTimesCircle size={50} />,
};

const statusLabels: Record<SecurityStatus, string> = {
  green: "Угроз не обнаружено",
  yellow: "Возможна угроза",
  red: "Критическая ситуация",
};

// Styled Components
const StatusCard = styled.div<{ status: SecurityStatus }>`
  background: ${({ status }) => statusColors[status]};
  border-radius: 1.5rem;
  padding: 2.5rem;
  color: white;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease-in-out;
  transform: scale(1);
  &:hover {
    transform: scale(1.02);
  }
`;

const StatusIcon = styled.div`
  margin-bottom: 1rem;
`;

const StatusTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const ThreatInfo = styled.p`
  margin-top: 1.5rem;
  font-size: 1.2rem;
`;

const ThreatDetails = styled.div`
  margin-top: 1rem;
  font-size: 1.05rem;
  line-height: 1.6;
`;

const LoadingText = styled.div`
  font-size: 1.3rem;
  font-weight: 500;
  color: #4b5563;
  text-align: center;
  padding: 2rem;
`;

const ErrorText = styled.div`
  font-size: 1.3rem;
  font-weight: 500;
  color: #ef4444;
  text-align: center;
  padding: 2rem;
`;

const SecurityStatus = () => {
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = () => {
    setLoading(true);
    axiosInstance
      .get<StatusData>("/securitystatus")
      .then((res) => {
        setStatusData(res.data);
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
    return <LoadingText>Загрузка статуса безопасности…</LoadingText>;
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  const status = statusData?.status || "green";

  return (
    <StatusCard status={status}>
      <StatusIcon>{statusIcons[status]}</StatusIcon>
      <StatusTitle>{statusLabels[status]}</StatusTitle>

      {/* Если статус НЕ green — выводим детали */}
      {status !== "green" && (
        <>
          <ThreatInfo>
            Основная угроза: <strong>{statusData?.most_common_threat}</strong>
          </ThreatInfo>
          <ThreatDetails>
            Количество таких угроз: <strong>{statusData?.threat_count}</strong>
          </ThreatDetails>
        </>
      )}
    </StatusCard>
  );
};

export default SecurityStatus;
