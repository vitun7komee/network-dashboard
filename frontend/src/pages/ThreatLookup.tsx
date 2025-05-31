
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
import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import '../global.css';

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
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">🧭 Threat Lookup</h2>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="px-3 py-2 border rounded-lg bg-white"
        >
          <option value="ip">🔍 Поиск по IP</option>
          <option value="domain">🌐 Поиск по домену</option>
          <option value="agent">🧠 Поиск по User-Agent</option>
          <option value="url">🧭 Поиск по URL</option>
          <option value="signature">🚨 Поиск по сигнатуре</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите значение запроса..."
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm w-full sm:w-auto"
        />
        <button
          onClick={search}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Искать
        </button>
      </div>

      {loading && <p className="text-gray-500">⏳ Загрузка...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="space-y-6">
          {data.summary && (
            <div className="bg-gray-50 p-4 border rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">📊 Сводка</h3>
              <ul className="text-sm text-gray-800 space-y-1">
                <li><b>Всего HTTP-запросов:</b> {data.summary.total_http}</li>
                <li><b>Уникальные URL:</b> {data.summary.unique_urls}</li>
                <li><b>Уникальные User-Agent:</b> {data.summary.unique_agents}</li>
                <li><b>Уникальные назначения:</b> {data.summary.unique_destinations}</li>
                <li><b>Последний запрос:</b> {new Date(data.summary.last_seen).toLocaleString()}</li>
              </ul>
            </div>
          )}

          {data.incidents && data.incidents.length > 0 && (
            <Section title="🚨 Эвристические инциденты" items={data.incidents} render={(i: any) => (
              <li className="border-l-4 border-red-500 pl-3 mb-2">
                <p className="text-sm text-gray-500">{new Date(i.timestamp).toLocaleString()} — {i.severity}</p>
                <p className="font-medium">{i.description}</p>
              </li>
            )} />
          )}

          {data.http && data.http.length > 0 && (
            <Section title="🌐 HTTP-Запросы" items={data.http} render={(i: any) => (
              <li className="text-sm text-gray-700 border-b py-1">
                <b>{i.http_method}</b> {i.url} <br />
                <span className="text-gray-500">
                  {i.src_ip} ➜ {i.dest_ip} ({i.hostname})
                </span><br />
                <span className="italic text-xs text-gray-500">{i.http_user_agent}</span>
              </li>
            )} />
          )}

          {data.dns && data.dns.length > 0 && (
            <Section title="🔍 DNS-запросы" items={data.dns} render={(i: any) => (
              <li className="text-sm text-gray-700 border-b py-1">
                <b>{i.query}</b> от {i.src_ip} — {new Date(i.timestamp).toLocaleString()}
              </li>
            )} />
          )}

          {data.alerts && data.alerts.length > 0 && (
            <Section title="⚠️ Suricata Alert'ы" items={data.alerts} render={(i: any) => (
              <li className="text-sm border-b py-1">
                <span className="text-red-600 font-semibold">[{i.alert_severity}]</span> {i.alert_category}<br />
                <span className="text-gray-700 italic">{i.signature}</span> <br />
                <span className="text-xs text-gray-500">{i.src_ip} — {new Date(i.timestamp).toLocaleString()}</span>
              </li>
            )} />
          )}

          {data.flows && data.flows.length > 0 && (
            <Section title="📶 Сетевые Flows" items={data.flows} render={(i: any) => (
              <li className="text-sm text-gray-700 border-b py-1">
                {i.src_ip} ➜ {i.dest_ip}:{i.dest_port} ({i.proto})<br />
                <span className="text-xs text-gray-500">{new Date(i.timestamp).toLocaleString()}</span>
              </li>
            )} />
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, items, render }: { title: string; items: any[]; render: (item: any) => JSX.Element }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <ul className="bg-white p-4 rounded-lg shadow space-y-2">
        {items.length > 0 ? items.map((item, idx) => <div key={idx}>{render(item)}</div>) : (
          <p className="text-gray-500">Нет данных за последнюю неделю.</p>
        )}
      </ul>
    </div>
  );
}
