
// import { useState } from "react";
// import { axiosInstance } from "../api/axiosInstance";
// import '../global.css';

// type Mode = "ip" | "domain";

// export default function ThreatLookup() {
//   const [query, setQuery] = useState("");
//   const [mode, setMode] = useState<Mode>("ip");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   const isValidIp = (ip: string) =>
//     /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);

//   const isValidDomain = (domain: string) =>
//     /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);

//   const search = async () => {
//     if (!query) return;

//     if (mode === "ip" && !isValidIp(query)) {
//       return setError("Некорректный IP-адрес.");
//     }
//     if (mode === "domain" && !isValidDomain(query)) {
//       return setError("Некорректный домен.");
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axiosInstance.get(`/lookup/${mode}/${query}`);
//       setData(res.data);
//     } catch (err) {
//       setError("Не удалось получить данные.");
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   const Input = (
//     <div className="flex flex-col sm:flex-row items-center gap-3">
//       <select
//         value={mode}
//         onChange={(e) => setMode(e.target.value as Mode)}
//         className="px-3 py-2 border rounded-lg bg-white"
//       >
//         <option value="ip">🔎 Поиск по IP</option>
//         <option value="domain">🌐 Поиск по домену</option>
//       </select>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         onKeyDown={(e) => e.key === "Enter" && search()}
//         placeholder={
//           mode === "ip" ? "Введите IP (напр. 192.168.1.1)" : "Введите домен (напр. google.com)"
//         }
//         className="flex-1 px-4 py-2 border rounded-lg shadow-sm w-full sm:w-auto"
//       />
//       <button
//         onClick={search}
//         className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//       >
//         Искать
//       </button>
//     </div>
//   );

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-3xl font-bold text-gray-800">🧭 Threat Lookup</h2>
//       {Input}

//       {loading && <p className="text-gray-500">⏳ Загрузка...</p>}
//       {error && <p className="text-red-600">{error}</p>}

//       {data && (
//         Object.values(data).some((v) => Array.isArray(v) && v.length > 0) ? (
//           <div className="space-y-6">
//             {data.incidents && (
//               <Section title="🚨 Эвристики" items={data.incidents} render={(i: any) => (
//                 <li className="border-l-4 border-red-600 pl-3 mb-2">
//                   <p className="text-sm text-gray-500">
//                     {new Date(i.timestamp).toLocaleString()} — {i.severity}
//                   </p>
//                   <p className="font-medium">{i.description}</p>
//                 </li>
//               )} />
//             )}

//             {data.http && (
//               <Section title="🌐 HTTP-запросы" items={data.http} render={(i: any) => (
//                 <li className="text-sm text-gray-700 border-b py-1">
//                   <b>{i.method}</b>{" "}
//                   {i.url ?? `${i.host || ""}${i.uri || ""}`}{" "}
//                   <span className="text-gray-500">
//                     ({i.src_ip} ➜ {i.dest_ip})
//                   </span>
//                 </li>
//               )} />
//             )}

//             {data.dns && (
//               <Section title="🔍 DNS-запросы" items={data.dns} render={(i: any) => (
//                 <li className="text-sm text-gray-700 border-b py-1">
//                   <b>{i.query}</b> {i.src_ip ? `от ${i.src_ip}` : ""}
//                 </li>
//               )} />
//             )}

//             {data.alerts && (
//               <Section title="⚠️ Alert-ы Suricata" items={data.alerts} render={(i: any) => (
//                 <li className="text-sm border-b py-1">
//                   <span className="text-red-600 font-semibold">
//                     [{i.alert_severity}]
//                   </span>{" "}
//                   {i.alert_category} от {i.src_ip}
//                 </li>
//               )} />
//             )}

//             {data.flows && (
//               <Section title="📶 Flows" items={data.flows} render={(i: any) => (
//                 <li className="text-sm text-gray-700 border-b py-1">
//                   {i.src_ip} ➜ {i.dest_ip}:{i.dest_port} ({i.proto})
//                 </li>
//               )} />
//             )}
//           </div>
//         ) : (
//           <p className="text-gray-500">🔍 Ничего не найдено по запросу.</p>
//         )
//       )}
//     </div>
//   );
// }

// function Section({
//   title,
//   items,
//   render,
// }: {
//   title: string;
//   items: any[];
//   render: (item: any) => JSX.Element;
// }) {
//   return (
//     <div>
//       <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
//       <ul className="bg-white p-4 rounded-lg shadow space-y-1">
//         {items.length > 0 ? (
//           items.map((i, idx) => <div key={idx}>{render(i)}</div>)
//         ) : (
//           <p className="text-gray-500">Нет данных.</p>
//         )}
//       </ul>
//     </div>
//   );
// }

// last final version
// import { useState } from "react";
// import { axiosInstance } from "../api/axiosInstance";
// import '../global.css';

// type Mode = "ip" | "domain" | "agent" | "url" | "signature";

// export default function ThreatLookup() {
//   const [mode, setMode] = useState<Mode>("ip");
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   const search = async () => {
//     if (!query) return;
//     setLoading(true);
//     setError(null);
//     setData(null);

//     try {
//       const res = await axiosInstance.get(`/lookup/${mode}/${query}`);
//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//       setError("Ошибка при получении данных");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-3xl font-bold text-gray-800">🧭 Threat Lookup</h2>

//       <div className="flex flex-col sm:flex-row items-center gap-3">
//         <select
//           value={mode}
//           onChange={(e) => setMode(e.target.value as Mode)}
//           className="px-3 py-2 border rounded-lg bg-white"
//         >
//           <option value="ip">🔍 Поиск по IP</option>
//           <option value="domain">🌐 Поиск по домену</option>
//           <option value="agent">🧠 Поиск по User-Agent</option>
//           <option value="url">🧭 Поиск по URL</option>
//           <option value="signature">🚨 Поиск по сигнатуре</option>
//         </select>
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Введите значение запроса..."
//           className="flex-1 px-4 py-2 border rounded-lg shadow-sm w-full sm:w-auto"
//         />
//         <button
//           onClick={search}
//           className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//         >
//           Искать
//         </button>
//       </div>

//       {loading && <p className="text-gray-500">⏳ Загрузка...</p>}
//       {error && <p className="text-red-600">{error}</p>}

//       {data && (
//         <div className="space-y-6">
//           {data.summary && (
//             <div className="bg-gray-50 p-4 border rounded-lg shadow">
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">📊 Сводка</h3>
//               <ul className="text-sm text-gray-800 space-y-1">
//                 <li><b>Всего HTTP-запросов:</b> {data.summary.total_http}</li>
//                 <li><b>Уникальные URL:</b> {data.summary.unique_urls}</li>
//                 <li><b>Уникальные User-Agent:</b> {data.summary.unique_agents}</li>
//                 <li><b>Уникальные назначения:</b> {data.summary.unique_destinations}</li>
//                 <li><b>Последний запрос:</b> {new Date(data.summary.last_seen).toLocaleString()}</li>
//               </ul>
//             </div>
//           )}

//           {data.incidents && data.incidents.length > 0 && (
//             <Section title="🚨 Эвристические инциденты" items={data.incidents} render={(i: any) => (
//               <li className="border-l-4 border-red-500 pl-3 mb-2">
//                 <p className="text-sm text-gray-500">{new Date(i.timestamp).toLocaleString()} — {i.severity}</p>
//                 <p className="font-medium">{i.description}</p>
//               </li>
//             )} />
//           )}

//           {data.http && data.http.length > 0 && (
//             <Section title="🌐 HTTP-Запросы" items={data.http} render={(i: any) => (
//               <li className="text-sm text-gray-700 border-b py-1">
//                 <b>{i.http_method}</b> {i.url} <br />
//                 <span className="text-gray-500">
//                   {i.src_ip} ➜ {i.dest_ip} ({i.hostname})
//                 </span><br />
//                 <span className="italic text-xs text-gray-500">{i.http_user_agent}</span>
//               </li>
//             )} />
//           )}

//           {data.dns && data.dns.length > 0 && (
//             <Section title="🔍 DNS-запросы" items={data.dns} render={(i: any) => (
//               <li className="text-sm text-gray-700 border-b py-1">
//                 <b>{i.query}</b> от {i.src_ip} — {new Date(i.timestamp).toLocaleString()}
//               </li>
//             )} />
//           )}

//           {data.alerts && data.alerts.length > 0 && (
//             <Section title="⚠️ Suricata Alert'ы" items={data.alerts} render={(i: any) => (
//               <li className="text-sm border-b py-1">
//                 <span className="text-red-600 font-semibold">[{i.alert_severity}]</span> {i.alert_category}<br />
//                 <span className="text-gray-700 italic">{i.signature}</span> <br />
//                 <span className="text-xs text-gray-500">{i.src_ip} — {new Date(i.timestamp).toLocaleString()}</span>
//               </li>
//             )} />
//           )}

//           {data.flows && data.flows.length > 0 && (
//             <Section title="📶 Сетевые Flows" items={data.flows} render={(i: any) => (
//               <li className="text-sm text-gray-700 border-b py-1">
//                 {i.src_ip} ➜ {i.dest_ip}:{i.dest_port} ({i.proto})<br />
//                 <span className="text-xs text-gray-500">{new Date(i.timestamp).toLocaleString()}</span>
//               </li>
//             )} />
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function Section({ title, items, render }: { title: string; items: any[]; render: (item: any) => JSX.Element }) {
//   return (
//     <div>
//       <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
//       <ul className="bg-white p-4 rounded-lg shadow space-y-2">
//         {items.length > 0 ? items.map((item, idx) => <div key={idx}>{render(item)}</div>) : (
//           <p className="text-gray-500">Нет данных за последнюю неделю.</p>
//         )}
//       </ul>
//     </div>
//   );
// }

// last good version
// import { useState } from "react";
// import styled, { createGlobalStyle } from "styled-components";
// import { axiosInstance } from "../api/axiosInstance";

// type Mode = "ip" | "domain" | "agent" | "url" | "signature";

// export default function ThreatLookup() {
//   const [mode, setMode] = useState<Mode>("ip");
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   const search = async () => {
//     if (!query) return;
//     setLoading(true);
//     setError(null);
//     setData(null);

//     try {
//       const res = await axiosInstance.get(`/lookup/${mode}/${query}`);
//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//       setError("Ошибка при получении данных");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <GlobalStyle />
//       <PageContainer>
//         <PageTitle>🧭 Threat Lookup</PageTitle>

//         <Controls>
//           <Select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
//             <option value="ip">🔍 Поиск по IP</option>
//             <option value="domain">🌐 Поиск по домену</option>
//             <option value="agent">🧠 Поиск по User-Agent</option>
//             <option value="url">🧭 Поиск по URL</option>
//             <option value="signature">🚨 Поиск по сигнатуре</option>
//           </Select>

//           <Input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Введите значение запроса..."
//           />

//           <Button onClick={search}>Искать</Button>
//         </Controls>

//         {loading && <InfoText>⏳ Загрузка...</InfoText>}
//         {error && <ErrorText>{error}</ErrorText>}

//         {data && (
//           <Results>
//             {data.summary && (
//               <Card>
//                 <CardTitle>📊 Сводка</CardTitle>
//                 <List>
//                   <li><b>Всего HTTP-запросов:</b> {data.summary.total_http}</li>
//                   <li><b>Уникальные URL:</b> {data.summary.unique_urls}</li>
//                   <li><b>Уникальные User-Agent:</b> {data.summary.unique_agents}</li>
//                   <li><b>Уникальные назначения:</b> {data.summary.unique_destinations}</li>
//                   <li><b>Последний запрос:</b> {new Date(data.summary.last_seen).toLocaleString()}</li>
//                 </List>
//               </Card>
//             )}

//             {data.incidents?.length > 0 && (
//               <Section title="🚨 Эвристические инциденты" items={data.incidents} render={(i: any) => (
//                 <Item>
//                   <small>{new Date(i.timestamp).toLocaleString()} — {i.severity}</small>
//                   <div>{i.description}</div>
//                 </Item>
//               )} />
//             )}

//             {data.http?.length > 0 && (
//               <Section title="🌐 HTTP-Запросы" items={data.http} render={(i: any) => (
//                 <Item>
//                   <div><b>{i.http_method}</b> {i.url}</div>
//                   <small>{i.src_ip} ➜ {i.dest_ip} ({i.hostname})</small>
//                   <small><i>{i.http_user_agent}</i></small>
//                 </Item>
//               )} />
//             )}

//             {data.dns?.length > 0 && (
//               <Section title="🔍 DNS-запросы" items={data.dns} render={(i: any) => (
//                 <Item>
//                   <b>{i.query}</b> от {i.src_ip}<br />
//                   <small>{new Date(i.timestamp).toLocaleString()}</small>
//                 </Item>
//               )} />
//             )}

//             {data.alerts?.length > 0 && (
//               <Section title="⚠️ Suricata Alert'ы" items={data.alerts} render={(i: any) => (
//                 <Item>
//                   <span style={{ color: "#f87171", fontWeight: "bold" }}>
//                     [{i.alert_severity}]
//                   </span> {i.alert_category}<br />
//                   <i>{i.signature}</i><br />
//                   <small>{i.src_ip} — {new Date(i.timestamp).toLocaleString()}</small>
//                 </Item>
//               )} />
//             )}

//             {data.flows?.length > 0 && (
//               <Section title="📶 Сетевые Flows" items={data.flows} render={(i: any) => (
//                 <Item>
//                   {i.src_ip} ➜ {i.dest_ip}:{i.dest_port} ({i.proto})<br />
//                   <small>{new Date(i.timestamp).toLocaleString()}</small>
//                 </Item>
//               )} />
//             )}
//           </Results>
//         )}
//       </PageContainer>
//     </>
//   );
// }

// // 🔧 Общие компоненты

// const GlobalStyle = createGlobalStyle`
//   body, html {
//     margin: 0;
//     padding: 0;
//     background-color: #1f1f1f;
//     color: #e4e4e4;
//     font-family: 'Inter', sans-serif;
//   }
// `;

// const PageContainer = styled.div`
//   padding: 40px 20px;
//   min-height: 100vh;
// `;

// const PageTitle = styled.h1`
//   font-size: 28px;
//   font-weight: 700;
//   margin-bottom: 30px;
// `;

// const Controls = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 12px;
//   margin-bottom: 30px;
// `;

// const Select = styled.select`
//   padding: 10px 14px;
//   border-radius: 8px;
//   background-color: #2c2c2c;
//   color: #e4e4e4;
//   border: 1px solid #444;
// `;

// const Input = styled.input`
//   flex: 1;
//   padding: 10px 14px;
//   border-radius: 8px;
//   border: 1px solid #444;
//   background-color: #2c2c2c;
//   color: #e4e4e4;
// `;

// const Button = styled.button`
//   padding: 10px 18px;
//   background-color: #3b82f6;
//   color: white;
//   border-radius: 8px;
//   border: none;
//   cursor: pointer;
//   transition: background 0.2s;

//   &:hover {
//     background-color: #2563eb;
//   }
// `;

// const InfoText = styled.p`
//   color: #9ca3af;
// `;

// const ErrorText = styled.p`
//   color: #f87171;
//   font-weight: 500;
// `;

// const Results = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 24px;
//   margin-top: 20px;
// `;

// const Card = styled.div`
//   background-color: #2c2c2c;
//   padding: 20px;
//   border-radius: 14px;
//   box-shadow: 0 0 8px rgba(0,0,0,0.4);
// `;

// const CardTitle = styled.h3`
//   font-size: 20px;
//   font-weight: 600;
//   margin-bottom: 12px;
// `;

// const List = styled.ul`
//   list-style: none;
//   padding: 0;
//   margin: 0;
//   line-height: 1.6;
// `;

// const Item = styled.li`
//   padding: 10px 0;
//   border-bottom: 1px solid #3a3a3a;

//   small {
//     display: block;
//     color: #9ca3af;
//   }

//   &:last-child {
//     border-bottom: none;
//   }
// `;

// function Section({ title, items, render }: { title: string; items: any[]; render: (item: any) => JSX.Element }) {
//   return (
//     <div>
//       <CardTitle>{title}</CardTitle>
//       <Card>
//         {items.map((item, idx) => <div key={idx}>{render(item)}</div>)}
//       </Card>
//     </div>
//   );
// }
import { useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { axiosInstance } from "../api/axiosInstance";

type Mode = "ip" | "domain" | "agent" | "url" | "signature";

export default function ThreatLookup() {
  const [mode, setMode] = useState<Mode>("ip");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await axiosInstance.get(`/lookup/${mode}/${query}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Ошибка при получении данных");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <PageTitle>Threat Lookup</PageTitle>

        <Controls>
          <Select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="ip">Поиск по IP</option>
            <option value="domain">По домену</option>
            <option value="agent">По User-Agent</option>
            <option value="url">По URL</option>
            <option value="signature">По сигнатуре</option>
          </Select>

          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите значение..."
          />

          <Button onClick={search}>Искать</Button>
        </Controls>

        {loading && <InfoText>⏳ Загружаем данные...</InfoText>}
        {error && <ErrorText>{error}</ErrorText>}

        {data && (
          <Results>
            {/* {data.summary && (
              <Card>
                <CardTitle>📊 Сводка по активности</CardTitle>
                <List>
                  <li><b>HTTP-запросов:</b> {data.summary.total_http}</li>
                  <li><b>Уникальных URL:</b> {data.summary.unique_urls}</li>
                  <li><b>User-Agent:</b> {data.summary.unique_agents}</li>
                  <li><b>Уникальных назначений:</b> {data.summary.unique_destinations}</li>
                  <li><b>Последнее событие:</b> {new Date(data.summary.last_seen).toLocaleString()}</li>
                </List>
              </Card>
            )} */}

            {data.incidents?.length > 0 && (
              <DataTable
                title="Эвристические инциденты"
                columns={["Время", "Серьёзность", "Описание"]}
                rows={data.incidents.map((i: any) => [
                  new Date(i.timestamp).toLocaleString(),
                  i.severity,
                  i.description,
                ])}
              />
            )}

            {data.http?.length > 0 && (
              <DataTable
                title="HTTP-Запросы"
                columns={["Время", "Метод", "URL", "Источник ➝ Назначение", "User-Agent"]}
                rows={data.http.map((h: any) => [
                  new Date(h.timestamp).toLocaleString(),
                  h.http_method,
                  h.url,
                  `${h.src_ip} ➝ ${h.dest_ip} (${h.hostname})`,
                  h.http_user_agent,
                ])}
              />
            )}

            {data.dns?.length > 0 && (
              <DataTable
                title="DNS-запросы"
                columns={["Время", "Источник", "Запрос"]}
                rows={data.dns.map((d: any) => [
                  new Date(d.timestamp).toLocaleString(),
                  d.src_ip,
                  d.query,
                ])}
              />
            )}

            {data.alerts?.length > 0 && (
              <DataTable
                title="Suricata Alert'ы"
                columns={["Время", "Категория", "Сигнатура", "Источник", "Уровень"]}
                rows={data.alerts.map((a: any) => [
                  new Date(a.timestamp).toLocaleString(),
                  a.alert_category,
                  a.signature,
                  a.src_ip,
                  a.alert_severity,
                ])}
              />
            )}

            {data.flows?.length > 0 && (
              <DataTable
                title="Сетевые Flows"
                columns={["Время", "Источник ➝ Назначение", "Протокол"]}
                rows={data.flows.map((f: any) => [
                  new Date(f.timestamp).toLocaleString(),
                  `${f.src_ip} ➝ ${f.dest_ip}:${f.dest_port}`,
                  f.proto,
                ])}
              />
            )}
          </Results>
        )}
      </PageContainer>
    </>
  );
}

// 🌟 Универсальная таблица
function DataTable({ title, columns, rows }: { title: string; columns: string[]; rows: string[][] }) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <StyledTable>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </Card>
  );
}

// 🎨 Стилизация
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: #1f1f1f;
    color: #e4e4e4;
    font-family: 'Inter', sans-serif;
  }
`;

const PageContainer = styled.div`
  padding: 40px 20px;
  min-height: 100vh;
`;

const PageTitle = styled.h1`
  font-size: 30px;
  margin-bottom: 30px;
  font-weight: 700;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 30px;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  background: #2c2c2c;
  color: #e4e4e4;
  border: 1px solid #444;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  background: #2c2c2c;
  color: #e4e4e4;
  border: 1px solid #444;
`;

const Button = styled.button`
  padding: 10px 18px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover { background: #2563eb; }
`;

const InfoText = styled.p`
  color: #9ca3af;
`;

const ErrorText = styled.p`
  color: #f87171;
  font-weight: 500;
`;

const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 20px;
`;

const Card = styled.div`
  background: #2c2c2c;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 0 8px rgba(0,0,0,0.4);
  animation: ${fadeIn} 0.3s ease-out;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 16px;
  font-weight: 600;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  line-height: 1.6;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    border: 1px solid #3a3a3a;
    padding: 8px 10px;
    text-align: left;
  }
  th {
    background: #333;
    color: #f3f4f6;
  }
  td {
    color: #e4e4e4;
  }
  tr:nth-child(even) {
    background: #242424;
  }
`;



// import { useState } from "react";
// import styled, { createGlobalStyle } from "styled-components";
// import { axiosInstance } from "../api/axiosInstance";

// type Mode = "ip" | "domain" | "agent" | "url" | "signature";

// export default function ThreatLookup() {
//   const [mode, setMode] = useState<Mode>("ip");
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   const search = async () => {
//     if (!query) return;
//     setLoading(true);
//     setError(null);
//     setData(null);

//     try {
//       const res = await axiosInstance.get(`/lookup/${mode}/${query}`);
//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//       setError("Ошибка при получении данных");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <GlobalStyle />
//       <PageContainer>
//         <PageTitle>🧭 Threat Lookup</PageTitle>

//         <Controls>
//           <Select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
//             <option value="ip">🔍 Поиск по IP</option>
//             <option value="domain">🌐 Поиск по домену</option>
//             <option value="agent">🧠 Поиск по User-Agent</option>
//             <option value="url">🧭 Поиск по URL</option>
//             <option value="signature">🚨 Поиск по сигнатуре</option>
//           </Select>

//           <Input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Введите значение запроса..."
//           />

//           <Button onClick={search}>Искать</Button>
//         </Controls>

//         {loading && <InfoText>⏳ Загрузка...</InfoText>}
//         {error && <ErrorText>{error}</ErrorText>}

//         {data && (
//           <Results>
//             {data.summary && (
//               <Card>
//                 <CardTitle>📊 Сводка</CardTitle>
//                 <SummaryList>
//                   <li><b>Всего HTTP-запросов:</b> {data.summary.total_http}</li>
//                   <li><b>Уникальные URL:</b> {data.summary.unique_urls}</li>
//                   <li><b>Уникальные User-Agent:</b> {data.summary.unique_agents}</li>
//                   <li><b>Уникальные назначения:</b> {data.summary.unique_destinations}</li>
//                   <li><b>Последний запрос:</b> {new Date(data.summary.last_seen).toLocaleString()}</li>
//                 </SummaryList>
//               </Card>
//             )}

//             {/* Табличные секции */}
//             {data.incidents?.length > 0 && (
//               <TableSection title="🚨 Эвристические инциденты" columns={["Дата", "Тип", "Описание"]} data={data.incidents} rowRender={(item) => [
//                 new Date(item.timestamp).toLocaleString(),
//                 item.severity,
//                 item.description
//               ]} />
//             )}

//             {data.http?.length > 0 && (
//               <TableSection
//                 title="🌐 HTTP-Запросы"
//                 columns={["Дата", "Метод", "URL", "Источник", "Назначение", "Hostname", "User-Agent"]}
//                 data={data.http}
//                 rowRender={(item) => [
//                   new Date(item.timestamp).toLocaleString(),
//                   item.http_method,
//                   item.url,
//                   item.src_ip,
//                   item.dest_ip,
//                   item.hostname,
//                   item.http_user_agent
//                 ]}
//               />
//             )}

//             {data.dns?.length > 0 && (
//               <TableSection
//                 title="🔍 DNS-запросы"
//                 columns={["Дата", "Источник", "Запрос"]}
//                 data={data.dns}
//                 rowRender={(item) => [
//                   new Date(item.timestamp).toLocaleString(),
//                   item.src_ip,
//                   item.query
//                 ]}
//               />
//             )}

//             {data.alerts?.length > 0 && (
//               <TableSection
//                 title="⚠️ Suricata Alert'ы"
//                 columns={["Дата", "Источник", "Категория", "Уровень", "Сигнатура"]}
//                 data={data.alerts}
//                 rowRender={(item) => [
//                   new Date(item.timestamp).toLocaleString(),
//                   item.src_ip,
//                   item.alert_category,
//                   item.alert_severity,
//                   item.signature
//                 ]}
//                 severityColor={(sev) => {
//                   switch(sev.toLowerCase()) {
//                     case "high": return "#ef4444";
//                     case "medium": return "#fbbf24";
//                     case "low": return "#60a5fa";
//                     default: return "#9ca3af";
//                   }
//                 }}
//               />
//             )}

//             {data.flows?.length > 0 && (
//               <TableSection
//                 title="📶 Сетевые Flows"
//                 columns={["Дата", "Источник", "Назначение", "Порт", "Протокол"]}
//                 data={data.flows}
//                 rowRender={(item) => [
//                   new Date(item.timestamp).toLocaleString(),
//                   item.src_ip,
//                   item.dest_ip,
//                   item.dest_port,
//                   item.proto
//                 ]}
//               />
//             )}
//           </Results>
//         )}
//       </PageContainer>
//     </>
//   );
// }

// // Табличный компонент для вывода данных в виде таблицы
// function TableSection({
//   title,
//   columns,
//   data,
//   rowRender,
//   severityColor,
// }: {
//   title: string;
//   columns: string[];
//   data: any[];
//   rowRender: (item: any) => (string | number)[];
//   severityColor?: (severity: string) => string;
// }) {
//   return (
//     <SectionContainer>
//       <CardTitle>{title}</CardTitle>
//       <TableWrapper>
//         <StyledTable>
//           <thead>
//             <tr>
//               {columns.map((col) => (
//                 <th key={col}>{col}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item, idx) => {
//               const row = rowRender(item);
//               return (
//                 <tr key={idx}>
//                   {row.map((cell, i) => {
//                     // Для Alert severity раскрасим ячейку
//                     if (severityColor && columns[i].toLowerCase().includes("уровень")) {
//                       return (
//                         <td key={i} style={{ color: severityColor(String(cell)) }}>
//                           {cell}
//                         </td>
//                       );
//                     }
//                     return <td key={i}>{cell}</td>;
//                   })}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </StyledTable>
//       </TableWrapper>
//     </SectionContainer>
//   );
// }

// // Стили

// const GlobalStyle = createGlobalStyle`
//   body, html {
//     margin: 0;
//     padding: 0;
//     background-color: #1f1f1f;
//     color: #e4e4e4;
//     font-family: 'Inter', sans-serif;
//   }
// `;

// const PageContainer = styled.div`
//   padding: 40px 20px;
//   min-height: 100vh;
// `;

// const PageTitle = styled.h1`
//   font-size: 28px;
//   font-weight: 700;
//   margin-bottom: 30px;
// `;

// const Controls = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 12px;
//   margin-bottom: 30px;
// `;

// const Select = styled.select`
//   padding: 10px 14px;
//   border-radius: 8px;
//   background-color: #2c2c2c;
//   color: #e4e4e4;
//   border: 1px solid #444;
// `;

// const Input = styled.input`
//   flex: 1;
//   padding: 10px 14px;
//   border-radius: 8px;
//   border: 1px solid #444;
//   background-color: #2c2c2c;
//   color: #e4e4e4;
// `;

// const Button = styled.button`
//   padding: 10px 18px;
//   background-color: #3b82f6;
//   color: white;
//   border-radius: 8px;
//   border: none;
//   cursor: pointer;
//   transition: background 0.2s;

//   &:hover {
//     background-color: #2563eb;
//   }
// `;

// const InfoText = styled.p`
//   color: #9ca3af;
// `;

// const ErrorText = styled.p`
//   color: #f87171;
//   font-weight: 500;
// `;

// const Results = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 24px;
//   margin-top: 20px;
// `;

// const Card = styled.div`
//   background-color: #2c2c2c;
//   padding: 20px;
//   border-radius: 14px;
//   box-shadow: 0 0 8px rgba(0,0,0,0.4);
// `;

// const CardTitle = styled.h3`
//   font-size: 20px;
//   font-weight: 600;
//   margin-bottom: 12px;
// `;

// const SummaryList = styled.ul`
//   list-style: none;
//   padding: 0;
//   margin: 0;
//   line-height: 1.6;
// `;

// const SectionContainer = styled.div`
//   /* Обертка с отступами */
// `;

// const TableWrapper = styled.div`
//   max-height: 400px;
//   overflow-y: auto;
//   border-radius: 10px;
//   box-shadow: inset 0 0 5px #000000aa;
// `;

// const StyledTable = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   min-width: 700px;

//   thead {
//     position: sticky;
//     top: 0;
//     background-color: #111827;
//     color: #e4e4e4;
//     font-weight: 600;
//   }

//   th, td {
//     padding: 10px 15px;
//     border-bottom: 1px solid #444;
//     text-align: left;
//     font-size: 14px;
//   }

//   tbody tr:nth-child(even) {
//     background-color: #252525;
//   }

//   tbody tr:hover {
//     background-color: #333;
//   }
// `;
