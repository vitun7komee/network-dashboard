// import { useEffect, useState } from "react";
// import { axiosInstance } from "../api/axiosInstance";

// type IpReputation = {
//   ip: string;
//   reputation: string;
//   score: number;
//   country: string;
//   usage_type: string;
// };

// export default function IpReputationList() {
//   const [data, setData] = useState<IpReputation[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axiosInstance
//       .get<IpReputation[]>("/ip-reputation")
//       .then(res => {
//         console.log("GET /ip-reputation response:", res.data);
//         setData(res.data);
//       })
//       .catch(err => console.error("IP reputation fetch error:", err))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <p>Loading IP reputation data…</p>;
//   if (data.length === 0) return <p>No IP reputation data yet.</p>;

//   return (
//     <div style={{ padding: 16 }}>
//       <h1>IP Reputation</h1>
//       <table border={1} cellPadding={8} cellSpacing={0}>
//         <thead>
//           <tr>
//             <th>IP</th>
//             <th>Score</th>
//             <th>Reputation</th>
//             <th>Country</th>
//             <th>Usage Type</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((entry) => (
//             <tr key={entry.ip}>
//               <td>{entry.ip}</td>
//               <td>{entry.score}</td>
//               <td>{entry.reputation}</td>
//               <td>{entry.country}</td>
//               <td>{entry.usage_type}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// last version
// import { useEffect, useState } from "react";
// import { axiosInstance } from "../api/axiosInstance";

// type IpReputation = {
//   ip: string;
//   reputation: string;
//   score: number;
//   country: string;
//   usage_type: string;
//   last_checked: string; // ISO timestamp
// };

// export default function IpReputationList() {
//   const [data, setData] = useState<IpReputation[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);

//   const fetchData = () => {
//     setLoading(true);
//     axiosInstance
//       .get<IpReputation[]>("/ip-reputation")
//       .then((res) => {
//         console.log("Fetched IP reputation data:", res.data);
//         setData(res.data);
//       })
//       .catch((err) => console.error("IP reputation fetch error:", err))
//       .finally(() => setLoading(false));
//   };

//   const handleUpdate = () => {
//     setUpdating(true);
//     axiosInstance
//       .post("/ip-reputation/fetch")
//       .then(() => fetchData()) // обновим данные после POST
//       .catch((err) => console.error("Reputation update error:", err))
//       .finally(() => setUpdating(false));
//   };

//   function getRowColor(reputation: string): string {
//     switch (reputation) {
//       case "malicious":
//         return "#ffd6d6"; // light red
//       case "suspicious":
//         return "#fffacc"; // light yellow
//       case "safe":
//         return "#e6ffed"; // light green
//       default:
//         return "white";
//     }
//   }
  

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, 10000); // обновление каждые 10 секунд
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) return <p>Loading IP reputation data…</p>;
//   if (data.length === 0) return <p>No IP reputation data yet.</p>;

//   return (
//     <div style={{ padding: 16 }}>
//       <h1>IP Reputation</h1>
//       <button onClick={handleUpdate} disabled={updating}>
//         {updating ? "Обновление…" : "Обновить репутацию IP"}
//       </button>
//       <table border={1} cellPadding={8} cellSpacing={0} style={{ marginTop: 12 }}>
//         <thead>
//           <tr>
//             <th>IP</th>
//             <th>Score</th>
//             <th>Reputation</th>
//             <th>Country</th>
//             <th>Usage Type</th>
//             <th>Last Checked</th> {/* ← Новая колонка */}
//           </tr>
//         </thead>
//         <tbody>
//             {[...data]
//                 .sort((a, b) => b.score - a.score) // жёсткая сортировка, можно убрать позже
//                 .map((entry) => (
//                     <tr key={entry.ip} style={{ backgroundColor: getRowColor(entry.reputation) }}>
//                     <td>{entry.ip}</td>
//                     <td>{entry.score}</td>
//                     <td>{entry.reputation}</td>
//                     <td>{entry.country}</td>
//                     <td>{entry.usage_type}</td>
//                     <td>{new Date(entry.last_checked).toLocaleString()}</td> {/* ← Новая ячейка */}
//                     </tr>
//         ))}
//     </tbody>

//         {/* <tbody>
//           {data.map((entry) => (
//             <tr key={entry.ip}>
//               <td>{entry.ip}</td>
//               <td>{entry.score}</td>
//               <td>{entry.reputation}</td>
//               <td>{entry.country}</td>
//               <td>{entry.usage_type}</td>
//             </tr>
//           ))}
//         </tbody> */}
//       </table>
//     </div>
//   );
// }
import { Button, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table"; // <-- импорт типа колонок
import { useEffect, useState } from "react";
import styled from "styled-components";
import { axiosInstance } from "../api/axiosInstance";

const { Title } = Typography;

type IpReputation = {
  ip: string;
  reputation: string;
  score: number;
  country: string;
  usage_type: string;
  last_checked: string; // ISO timestamp
};

const reputationColors: Record<string, string> = {
  malicious: "#ff4d4f",
  suspicious: "#faad14",
  safe: "#52c41a",
};

const PageContainer = styled.div`
  padding: 1.5rem 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export default function IpReputationList() {
  const [data, setData] = useState<IpReputation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchData = () => {
    setLoading(true);
    axiosInstance
      .get<IpReputation[]>("/ip-reputation")
      .then((res) => setData(res.data))
      .catch((err) => console.error("IP reputation fetch error:", err))
      .finally(() => setLoading(false));
  };

  const handleUpdate = () => {
    setUpdating(true);
    axiosInstance
      .post("/ip-reputation/fetch")
      .then(() => fetchData())
      .catch((err) => console.error("Reputation update error:", err))
      .finally(() => setUpdating(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // ** Вот здесь указываем тип ColumnsType<IpReputation> **
  const columns: ColumnsType<IpReputation> = [
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      // sorter: (a, b) => a.ip.localeCompare(b.ip),
      width: 140,
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      sorter: (a, b) => a.score - b.score,
      width: 90,
    },
    {
      title: "Reputation",
      dataIndex: "reputation",
      key: "reputation",
      render: (rep) => (
        <Tag color={reputationColors[rep] || "default"} style={{ textTransform: "capitalize" }}>
          {rep}
        </Tag>
      ),
      filters: [
        { text: "Malicious", value: "malicious" },
        { text: "Suspicious", value: "suspicious" },
        { text: "Safe", value: "safe" },
      ],
      onFilter: (value, record) => record.reputation === value,
      width: 120,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: 110,
    },
    {
      title: "Usage Type",
      dataIndex: "usage_type",
      key: "usage_type",
      width: 140,
      ellipsis: true,
    },
    {
      title: "Last Checked",
      dataIndex: "last_checked",
      key: "last_checked",
      render: (val) => new Date(val).toLocaleString(),
      sorter: (a, b) => new Date(a.last_checked).getTime() - new Date(b.last_checked).getTime(),
      width: 180,
    },
  ];

  return (
    <PageContainer>
      <Header>
        <Title level={2}>🌐 IP Reputation</Title>
        <Button type="primary" onClick={handleUpdate} loading={updating}>
          Обновить репутацию IP
        </Button>
      </Header>

      <Table
        rowKey="ip"
        columns={columns}
        dataSource={[...data].sort((a, b) => b.score - a.score)}
        loading={loading}
        pagination={{ pageSize: 20 }}
        bordered
        scroll={{ x: 900 }}
      />
    </PageContainer>
  );
}
