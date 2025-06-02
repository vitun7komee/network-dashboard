// import { Button, DatePicker, Input, Select, Space, Table } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import dayjs from "dayjs";
// import { useEffect, useState } from "react";
// import { axiosInstance } from "../api/axiosInstance";

// const { RangePicker } = DatePicker;

// interface Alert {
//   id: number;
//   timestamp: string;
//   alert_category: string;
//   alert_severity: number;
//   alert_message: string;
//   signature: string;
//   signature_id: number;
//   src_ip: string;
//   dest_ip: string;
//   src_port: number;
//   dest_port: number;
// }

// export default function AlertsPage() {
//   const [alerts, setAlerts] = useState<Alert[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Фильтры
//   const [category, setCategory] = useState<string | undefined>();
//   const [severity, setSeverity] = useState<number | undefined>();
//   const [srcIp, setSrcIp] = useState<string | undefined>();
//   const [destIp, setDestIp] = useState<string | undefined>();
//   const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

//   // Пагинация
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);

//   const fetchAlerts = () => {
//     setLoading(true);

//     const params: any = {
//       limit: 20,
//       offset: (page - 1) * 20,
//     };

//     if (category) params.category = category;
//     if (severity) params.severity = severity;
//     if (srcIp) params.src_ip = srcIp;
//     if (destIp) params.dest_ip = destIp;
//     if (dateRange) {
//       params.date_from = dateRange[0].toISOString();
//       params.date_to = dateRange[1].toISOString();
//     }

//     axiosInstance.get("/api/alerts", { params })
//       .then(res => {
//         setAlerts(res.data);
//         // Можно получать total с отдельного запроса, если нужно
//         setTotal(1000); // Условный максимум
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     fetchAlerts();
//   }, [category, severity, srcIp, destIp, dateRange, page]);

//   const columns: ColumnsType<Alert> = [
//     {
//       title: "⏱ Время",
//       dataIndex: "timestamp",
//       render: (val: string) => dayjs(val).format("DD.MM.YYYY HH:mm:ss"),
//     },
//     { title: "Категория", dataIndex: "alert_category" },
//     { title: "Уровень", dataIndex: "alert_severity" },
//     { title: "Сообщение", dataIndex: "alert_message", ellipsis: true },
//     { title: "Источник", dataIndex: "src_ip", render: (ip, row) => `${ip}:${row.src_port}` },
//     { title: "Назначение", dataIndex: "dest_ip", render: (ip, row) => `${ip}:${row.dest_port}` },
//     { title: "Сигнатура", dataIndex: "signature", ellipsis: true },
//   ];

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">🛡 Инциденты</h1>

//       {/* 🔍 Фильтры */}
//       <Space wrap size="middle">
//         <Input placeholder="Категория" value={category} onChange={e => setCategory(e.target.value)} />
//         <Select
//           placeholder="Серьезность"
//           value={severity}
//           onChange={val => setSeverity(val)}
//           allowClear
//           style={{ width: 120 }}
//           options={[
//             { label: "1", value: 1 },
//             { label: "2", value: 2 },
//             { label: "3", value: 3 },
//           ]}
//         />
//         <Input placeholder="Источник IP" value={srcIp} onChange={e => setSrcIp(e.target.value)} />
//         <Input placeholder="Назначение IP" value={destIp} onChange={e => setDestIp(e.target.value)} />
//         {/* <RangePicker value={dateRange} onChange={range => setDateRange(range)} /> */}
//         <RangePicker
//         value={dateRange}
//   onChange={(range) => {
//     if (!range || range[0] === null || range[1] === null) {
//       setDateRange(null);
//     } else {
//       setDateRange(range as [dayjs.Dayjs, dayjs.Dayjs]);
//     }
//         }}
//          />

//         <Button onClick={fetchAlerts}>🔄 Обновить</Button>
//       </Space>

//       {/* 📊 Таблица */}
//       <Table
//         rowKey="id"
//         loading={loading}
//         columns={columns}
//         dataSource={alerts}
//         pagination={{
//           current: page,
//           pageSize: 20,
//           total,
//           onChange: setPage,
//         }}
//         scroll={{ x: 1000 }}
//       />
//     </div>
//   );
// }

//LAST GOOD VERSION
import { Button, DatePicker, Input, Select, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { axiosInstance } from "../api/axiosInstance";

const { RangePicker } = DatePicker;

interface Alert {
  id: number;
  timestamp: string;
  alert_category: string;
  alert_severity: number;
  alert_message: string;
  signature: string;
  signature_id: number;
  src_ip: string;
  dest_ip: string;
  src_port: number;
  dest_port: number;
}

// Стилизация контейнеров и заголовков
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
  padding: 1.5rem 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
`;


const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;


const FiltersWrapper = styled(Space)`
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  width: 100%;

  .ant-input,
  .ant-select-selector,
  .ant-picker {
    border-radius: 0.5rem !important;
  }

  button {
    border-radius: 0.5rem;
  }
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
`;

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  // Фильтры
  const [category, setCategory] = useState<string | undefined>();
  const [severity, setSeverity] = useState<number | undefined>();
  const [srcIp, setSrcIp] = useState<string | undefined>();
  const [destIp, setDestIp] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // Пагинация
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchAlerts = () => {
    setLoading(true);

    const params: any = {
      limit: 20,
      offset: (page - 1) * 20,
    };

    if (category) params.category = category;
    if (severity) params.severity = severity;
    if (srcIp) params.src_ip = srcIp;
    if (destIp) params.dest_ip = destIp;
    if (dateRange) {
      params.date_from = dateRange[0].toISOString();
      params.date_to = dateRange[1].toISOString();
    }

    axiosInstance.get("/api/alerts", { params })
      .then(res => {
        setAlerts(res.data);
        setTotal(1000); // Заглушка, можно получить с сервера
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, [category, severity, srcIp, destIp, dateRange, page]);

  const columns: ColumnsType<Alert> = [
    {
      title: "Дата и время",
      dataIndex: "timestamp",
      render: (val: string) => dayjs(val).format("DD.MM.YYYY HH:mm:ss"),
      //sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
      defaultSortOrder: "descend",
    },
    { title: "Категория", dataIndex: "alert_category", sorter: (a, b) => a.alert_category.localeCompare(b.alert_category) },
    { title: "Уровень", dataIndex: "alert_severity", sorter: (a, b) => a.alert_severity - b.alert_severity },
    // { title: "Сообщение", dataIndex: "alert_message", ellipsis: true },
    { title: "Источник", dataIndex: "src_ip", render: (ip, row) => `${ip}:${row.src_port}` },
    { title: "Назначение", dataIndex: "dest_ip", render: (ip, row) => `${ip}:${row.dest_port}` },
    { title: "Сигнатура", dataIndex: "signature", ellipsis: true },
  ];

  return (
      <>
      <GlobalStyle />
    <PageContainer>
      <Title>Alerts deep dive</Title>

      <FiltersWrapper size="middle" wrap>
        <Input
          placeholder="Категория"
          value={category}
          onChange={e => setCategory(e.target.value)}
          allowClear
          style={{ minWidth: 150 }}
        />
        <Select
          placeholder="Серьезность"
          value={severity}
          onChange={val => setSeverity(val)}
          allowClear
          style={{ width: 140 }}
          options={[
            { label: "1", value: 1 },
            { label: "2", value: 2 },
            { label: "3", value: 3 },
          ]}
        />
        <Input
          placeholder="Источник IP"
          value={srcIp}
          onChange={e => setSrcIp(e.target.value)}
          allowClear
          style={{ minWidth: 150 }}
        />
        <Input
          placeholder="Назначение IP"
          value={destIp}
          onChange={e => setDestIp(e.target.value)}
          allowClear
          style={{ minWidth: 150 }}
        />
        <RangePicker
          value={dateRange}
          onChange={(range) => {
            if (!range || range[0] === null || range[1] === null) {
              setDateRange(null);
            } else {
              setDateRange(range as [dayjs.Dayjs, dayjs.Dayjs]);
            }
          }}
          style={{ minWidth: 280 }}
          allowClear
        />
        <Button type="primary" onClick={fetchAlerts}>
          Обновить
        </Button>
      </FiltersWrapper>

      <TableWrapper>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={alerts}
          pagination={{
            current: page,
            pageSize: 20,
            total,
            onChange: setPage,
            showSizeChanger: false,
          }}
          scroll={{ x: 1000 }}
          bordered
        />
      </TableWrapper>
    </PageContainer>
    </>
  );
}
// нашаманенная версия
// import { Button, Card, DatePicker, Divider, Input, Select, Table, Typography, message } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import dayjs from "dayjs";
// import { useEffect, useState } from "react";
// import styled, { createGlobalStyle } from "styled-components";
// import { axiosInstance } from "../api/axiosInstance";

// const { RangePicker } = DatePicker;
// const { Title, Text } = Typography;

// interface Alert {
//   id: number;
//   timestamp: string;
//   alert_category: string;
//   alert_severity: number;
//   alert_message: string;
//   signature: string;
//   signature_id: number;
//   src_ip: string;
//   dest_ip: string;
//   src_port: number;
//   dest_port: number;
// }

// // Проверка IP
// const isValidIp = (ip: string) => /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);

// const GlobalStyle = createGlobalStyle`
//   body {
//     margin: 0;
//     padding: 0;
//     background: #1f1f1f;
//     color: #e4e4e4;
//     font-family: 'Inter', sans-serif;
//   }
// `;

// // Стилизация страницы
// const PageContainer = styled.div`
//   padding: 2rem;
//   background-color: #f3f4f6;
//   min-height: 100vh;
// `;

// const FiltersCard = styled(Card)`
//   border-radius: 0.75rem;
//   .ant-card-body {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 1rem;
//   }
// `;

// const TableWrapper = styled.div`
//   background: white;
//   border-radius: 0.75rem;
//   padding: 1rem;
//   box-shadow: 0 6px 12px rgb(0 0 0 / 0.05);
// `;

// export default function AlertsPage() {
//   const [alerts, setAlerts] = useState<Alert[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Фильтры
//   const [category, setCategory] = useState<string | undefined>();
//   const [severity, setSeverity] = useState<number | undefined>();
//   const [srcIp, setSrcIp] = useState<string | undefined>();
//   const [destIp, setDestIp] = useState<string | undefined>();
//   const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

//   // Пагинация
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);

//   const fetchAlerts = () => {
//     setLoading(true);

//     const params: any = {
//       limit: 20,
//       offset: (page - 1) * 20,
//     };

//     if (category) params.category = category;
//     if (severity) params.severity = severity;
//     if (srcIp) {
//       if (!isValidIp(srcIp)) {
//         message.error("Некорректный IP-адрес источника");
//         setLoading(false);
//         return;
//       }
//       params.src_ip = srcIp;
//     }
//     if (destIp) {
//       if (!isValidIp(destIp)) {
//         message.error("Некорректный IP-адрес назначения");
//         setLoading(false);
//         return;
//       }
//       params.dest_ip = destIp;
//     }
//     if (dateRange) {
//       params.date_from = dateRange[0].toISOString();
//       params.date_to = dateRange[1].toISOString();
//     }

//     axiosInstance
//       .get("/api/alerts", { params })
//       .then((res) => {
//         setAlerts(res.data);
//         setTotal(1000); // пока заглушка
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     fetchAlerts();
//   }, [category, severity, srcIp, destIp, dateRange, page]);

//   const columns: ColumnsType<Alert> = [
//     {
//       title: "⏱ Время",
//       dataIndex: "timestamp",
//       render: (val: string) => dayjs(val).format("DD.MM.YYYY HH:mm:ss"),
//       sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
//       defaultSortOrder: "descend",
//     },
//     {
//       title: "Категория",
//       dataIndex: "alert_category",
//       sorter: (a, b) => a.alert_category.localeCompare(b.alert_category),
//     },
//     {
//       title: "Уровень",
//       dataIndex: "alert_severity",
//       sorter: (a, b) => a.alert_severity - b.alert_severity,
//     },
//     {
//       title: "Источник",
//       dataIndex: "src_ip",
//       render: (ip, row) => `${ip}:${row.src_port}`,
//     },
//     {
//       title: "Назначение",
//       dataIndex: "dest_ip",
//       render: (ip, row) => `${ip}:${row.dest_port}`,
//     },
//     {
//       title: "Сигнатура",
//       dataIndex: "signature",
//       ellipsis: true,
//     },
//   ];

//   return (
//     <>
//     <GlobalStyle />
//     <PageContainer>
//       <Title level={2} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
//         🛡 Alerts Deep Dive
//       </Title>

//       <FiltersCard>
//         <Input
//           placeholder="Категория"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           allowClear
//           style={{ minWidth: 160 }}
//         />
//         <Select
//           placeholder="Серьезность"
//           value={severity}
//           onChange={(val) => setSeverity(val)}
//           allowClear
//           style={{ width: 140 }}
//           options={[
//             { label: "1", value: 1 },
//             { label: "2", value: 2 },
//             { label: "3", value: 3 },
//           ]}
//         />
//         <Input
//           placeholder="Источник IP"
//           value={srcIp}
//           onChange={(e) => setSrcIp(e.target.value)}
//           allowClear
//           style={{ minWidth: 160 }}
//         />
//         <Input
//           placeholder="Назначение IP"
//           value={destIp}
//           onChange={(e) => setDestIp(e.target.value)}
//           allowClear
//           style={{ minWidth: 160 }}
//         />
//         <RangePicker
//           value={dateRange}
//           onChange={(range) => {
//             if (!range || range[0] === null || range[1] === null) {
//               setDateRange(null);
//             } else {
//               setDateRange(range as [dayjs.Dayjs, dayjs.Dayjs]);
//             }
//           }}
//           style={{ minWidth: 280 }}
//           allowClear
//         />
//         <Button type="primary" onClick={fetchAlerts}>
//           🔄 Обновить
//         </Button>
//       </FiltersCard>

//       <Divider />

//       <TableWrapper>
//         <Table
//           rowKey="id"
//           loading={loading}
//           columns={columns}
//           dataSource={alerts}
//           pagination={{
//             current: page,
//             pageSize: 20,
//             total,
//             onChange: setPage,
//             showSizeChanger: false,
//           }}
//           scroll={{ x: 1000 }}
//           bordered
//         />
//       </TableWrapper>
//     </PageContainer>
//     </>
//   );
// }
