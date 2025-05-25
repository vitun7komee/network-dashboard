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
import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

type IpReputation = {
  ip: string;
  reputation: string;
  score: number;
  country: string;
  usage_type: string;
  last_checked: string; // ISO timestamp
};

export default function IpReputationList() {
  const [data, setData] = useState<IpReputation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchData = () => {
    setLoading(true);
    axiosInstance
      .get<IpReputation[]>("/ip-reputation")
      .then((res) => {
        console.log("Fetched IP reputation data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("IP reputation fetch error:", err))
      .finally(() => setLoading(false));
  };

  const handleUpdate = () => {
    setUpdating(true);
    axiosInstance
      .post("/ip-reputation/fetch")
      .then(() => fetchData()) // обновим данные после POST
      .catch((err) => console.error("Reputation update error:", err))
      .finally(() => setUpdating(false));
  };

  function getRowColor(reputation: string): string {
    switch (reputation) {
      case "malicious":
        return "#ffd6d6"; // light red
      case "suspicious":
        return "#fffacc"; // light yellow
      case "safe":
        return "#e6ffed"; // light green
      default:
        return "white";
    }
  }
  

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // обновление каждые 10 секунд
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading IP reputation data…</p>;
  if (data.length === 0) return <p>No IP reputation data yet.</p>;

  return (
    <div style={{ padding: 16 }}>
      <h1>IP Reputation</h1>
      <button onClick={handleUpdate} disabled={updating}>
        {updating ? "Обновление…" : "Обновить репутацию IP"}
      </button>
      <table border={1} cellPadding={8} cellSpacing={0} style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>IP</th>
            <th>Score</th>
            <th>Reputation</th>
            <th>Country</th>
            <th>Usage Type</th>
            <th>Last Checked</th> {/* ← Новая колонка */}
          </tr>
        </thead>
        <tbody>
            {[...data]
                .sort((a, b) => b.score - a.score) // жёсткая сортировка, можно убрать позже
                .map((entry) => (
                    <tr key={entry.ip} style={{ backgroundColor: getRowColor(entry.reputation) }}>
                    <td>{entry.ip}</td>
                    <td>{entry.score}</td>
                    <td>{entry.reputation}</td>
                    <td>{entry.country}</td>
                    <td>{entry.usage_type}</td>
                    <td>{new Date(entry.last_checked).toLocaleString()}</td> {/* ← Новая ячейка */}
                    </tr>
        ))}
    </tbody>

        {/* <tbody>
          {data.map((entry) => (
            <tr key={entry.ip}>
              <td>{entry.ip}</td>
              <td>{entry.score}</td>
              <td>{entry.reputation}</td>
              <td>{entry.country}</td>
              <td>{entry.usage_type}</td>
            </tr>
          ))}
        </tbody> */}
      </table>
    </div>
  );
}
