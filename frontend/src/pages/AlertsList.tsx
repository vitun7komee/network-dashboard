// import { List, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
// import { useList } from "@refinedev/core";

// type Alert = {
//   id: number;
//   timestamp: string;
//   alert_category: string;
//   alert_severity: number;
//   alert_message: string;
//   src_ip: string;
//   dest_ip: string;
//   src_port: number;
//   dest_port: number;
// };

// export default function AlertsList() {
//   const { data, isLoading } = useList<Alert>({ resource: "alerts", config: { pagination: { pageSize: 50 } } });

//   if (isLoading) return <div>Loading alerts…</div>;

//   return (
//     <TableContainer component={Paper} sx={{ m: 2 }}>
//       <List title="Alerts">
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Time</TableCell>
//               <TableCell>Category</TableCell>
//               <TableCell>Severity</TableCell>
//               <TableCell>Src → Dest</TableCell>
//               <TableCell>Message</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data?.data.map(alert => (
//               <TableRow key={alert.id}>
//                 <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
//                 <TableCell>{alert.alert_category}</TableCell>
//                 <TableCell>{alert.alert_severity}</TableCell>
//                 <TableCell>
//                   {alert.src_ip}:{alert.src_port} → {alert.dest_ip}:{alert.dest_port}
//                 </TableCell>
//                 <TableCell>{alert.alert_message}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </List>
//     </TableContainer>
//   );
// }
// src/pages/AlertsList.tsx
import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

type Alert = {
  id: number;
  timestamp: string;
  alert_category: string;
  alert_severity: number;
  alert_message: string | null;
  src_ip: string;
  dest_ip: string;
  src_port: number;
  dest_port: number;
};

export default function AlertsList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get<Alert[]>("/alerts")
      .then(res => {
        console.log("GET /alerts response:", res.data);
        setAlerts(res.data);
      })
      .catch(err => console.error("Alerts fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading alerts…</p>;
  if (alerts.length === 0) return <p>No alerts yet.</p>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Alerts</h1>
      <table border={1} cellPadding={8} cellSpacing={0}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Category</th>
            <th>Severity</th>
            <th>Src → Dest</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map(a => (
            <tr key={a.id}>
              <td>{new Date(a.timestamp).toLocaleString()}</td>
              <td>{a.alert_category}</td>
              <td>{a.alert_severity}</td>
              <td>
                {a.src_ip}:{a.src_port} → {a.dest_ip}:{a.dest_port}
              </td>
              <td>{a.alert_message ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

