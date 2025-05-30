import { Button, DatePicker, Input, Select, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
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
        // Можно получать total с отдельного запроса, если нужно
        setTotal(1000); // Условный максимум
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, [category, severity, srcIp, destIp, dateRange, page]);

  const columns: ColumnsType<Alert> = [
    {
      title: "⏱ Время",
      dataIndex: "timestamp",
      render: (val: string) => dayjs(val).format("DD.MM.YYYY HH:mm:ss"),
    },
    { title: "Категория", dataIndex: "alert_category" },
    { title: "Уровень", dataIndex: "alert_severity" },
    { title: "Сообщение", dataIndex: "alert_message", ellipsis: true },
    { title: "Источник", dataIndex: "src_ip", render: (ip, row) => `${ip}:${row.src_port}` },
    { title: "Назначение", dataIndex: "dest_ip", render: (ip, row) => `${ip}:${row.dest_port}` },
    { title: "Сигнатура", dataIndex: "signature", ellipsis: true },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🛡 Инциденты</h1>

      {/* 🔍 Фильтры */}
      <Space wrap size="middle">
        <Input placeholder="Категория" value={category} onChange={e => setCategory(e.target.value)} />
        <Select
          placeholder="Серьезность"
          value={severity}
          onChange={val => setSeverity(val)}
          allowClear
          style={{ width: 120 }}
          options={[
            { label: "1", value: 1 },
            { label: "2", value: 2 },
            { label: "3", value: 3 },
          ]}
        />
        <Input placeholder="Источник IP" value={srcIp} onChange={e => setSrcIp(e.target.value)} />
        <Input placeholder="Назначение IP" value={destIp} onChange={e => setDestIp(e.target.value)} />
        {/* <RangePicker value={dateRange} onChange={range => setDateRange(range)} /> */}
        <RangePicker
        value={dateRange}
  onChange={(range) => {
    if (!range || range[0] === null || range[1] === null) {
      setDateRange(null);
    } else {
      setDateRange(range as [dayjs.Dayjs, dayjs.Dayjs]);
    }
        }}
         />

        <Button onClick={fetchAlerts}>🔄 Обновить</Button>
      </Space>

      {/* 📊 Таблица */}
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
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
}
