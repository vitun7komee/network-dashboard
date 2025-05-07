// import { List, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
// import { useList } from "@refinedev/core";

// type HttpLog = {
//   id: number;
//   timestamp: string;
//   host: string;
//   uri: string;
//   method: string;
//   src_ip: string;
//   dest_ip: string;
// };

// export default function HttpList() {
//   const { data, isLoading } = useList<HttpLog>({ resource: "http", config: { pagination: { pageSize: 50 } } });

//   if (isLoading) return <div>Loading HTTP logs…</div>;

//   return (
//     <TableContainer component={Paper} sx={{ m: 2 }}>
//       <List title="HTTP Logs">
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Time</TableCell>
//               <TableCell>Method</TableCell>
//               <TableCell>Host</TableCell>
//               <TableCell>URI</TableCell>
//               <TableCell>Src IP</TableCell>
//               <TableCell>Dest IP</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data?.data.map(log => (
//               <TableRow key={log.id}>
//                 <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
//                 <TableCell>{log.method}</TableCell>
//                 <TableCell>{log.host}</TableCell>
//                 <TableCell>{log.uri}</TableCell>
//                 <TableCell>{log.src_ip}</TableCell>
//                 <TableCell>{log.dest_ip}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </List>
//     </TableContainer>
//   );
// }
// src/pages/HttpList.tsx
import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

type HttpLog = {
  id: number;
  timestamp: string;
  host: string;
  uri: string;
  method: string;
  src_ip: string;
  dest_ip: string;
};

export default function HttpList() {
  const [logs, setLogs] = useState<HttpLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get<HttpLog[]>("/http")
      .then(res => {
        console.log("GET /http response:", res.data);
        setLogs(res.data);
      })
      .catch(err => console.error("HTTP logs fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading HTTP logs…</p>;
  if (logs.length === 0) return <p>No HTTP logs yet.</p>;

  return (
    <div style={{ padding: 16 }}>
      <h1>HTTP Logs</h1>
      <table border={1} cellPadding={8} cellSpacing={0}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Method</th>
            <th>Host</th>
            <th>URI</th>
            <th>Src IP</th>
            <th>Dest IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{new Date(l.timestamp).toLocaleString()}</td>
              <td>{l.method}</td>
              <td>{l.host}</td>
              <td>{l.uri}</td>
              <td>{l.src_ip}</td>
              <td>{l.dest_ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

