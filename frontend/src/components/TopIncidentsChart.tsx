// import { Card } from "antd";
// import React, { useEffect, useState } from "react";
// import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
// import { axiosInstance } from "../api/axiosInstance";

// type Incident = {
//   alert_category: string;
//   count: number;
// };

// export const TopIncidentsChart: React.FC = () => {
//   const [data, setData] = useState<Incident[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axiosInstance
//       .get<Incident[]>("/api/alerts/top-categories")
//       .then((res) => setData(res.data))
//       .catch((err) => console.error("Top incidents fetch error:", err))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <Card title="🔥 ТОП инцидентов (по типу атаки)" loading={loading}>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
//           <XAxis type="number" />
//           <YAxis type="category" dataKey="alert_category" width={120} />
//           <Tooltip />
//           <Bar dataKey="count" fill="#ff4d4f" />
//         </BarChart>
//       </ResponsiveContainer>
//     </Card>
//   );
// };
import { Card, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axiosInstance } from "../api/axiosInstance";

type Incident = {
  alert_category: string;
  count: number;
};

const RANGE_OPTIONS = [
  { label: "За день", value: "daily" },
  { label: "За неделю", value: "weekly" },
  { label: "Всё время", value: "all" },
];

export const TopIncidentsChart: React.FC = () => {
  const [data, setData] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"daily" | "weekly" | "all">("daily");

  useEffect(() => {
    setLoading(true);

    axiosInstance
      .get<Incident[]>("/api/alerts/top-categories", {
        params: range !== "all" ? { range } : {},
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Top incidents fetch error:", err))
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <Card
      title="🔥 ТОП инцидентов (по типу атаки)"
      loading={loading}
      extra={
        <Select
          options={RANGE_OPTIONS}
          value={range}
          onChange={(value) => setRange(value)}
          style={{ width: 120 }}
        />
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
          <XAxis type="number" />
          <YAxis type="category" dataKey="alert_category" width={120} />
          <Tooltip />
          <Bar dataKey="count" fill="#ff4d4f" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
