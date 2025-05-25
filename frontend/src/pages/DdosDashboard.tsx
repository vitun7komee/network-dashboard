import { Alert, Card, Col, Row, Spin, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";


const { Title } = Typography;

interface AlertCategory {
  alert_category: string;
  count: number;
}

interface TopIP {
  src_ip: string;
  alert_count: number;
}

const DdosDashboard: React.FC = () => {
  const [topIps, setTopIps] = useState<TopIP[]>([]);
  const [categories, setCategories] = useState<AlertCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/ddos-detection");
      setTopIps(res.data.top_ips);
      setCategories(res.data.alert_categories);
      setError(null);
    } catch (e) {
      setError("Не удалось загрузить данные о DDoS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Spin tip="Загрузка статистики..." size="large" />;

  if (error) return <Alert message={error} type="error" showIcon />;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>📊 Анализ DDoS активности (последний час)</Title>
      <Row gutter={24}>
        <Col span={12}>
          <Card title="🔝 Топ-10 IP-источников по числу алертов" bordered>
            <Table
              dataSource={topIps}
              columns={[
                {
                  title: "Источник (IP)",
                  dataIndex: "src_ip",
                  key: "src_ip",
                },
                {
                  title: "Количество алертов",
                  dataIndex: "alert_count",
                  key: "alert_count",
                },
              ]}
              rowKey="src_ip"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="📂 Категории алертов" bordered>
            <Table
              dataSource={categories}
              columns={[
                {
                  title: "Категория",
                  dataIndex: "alert_category",
                  key: "alert_category",
                },
                {
                  title: "Количество",
                  dataIndex: "count",
                  key: "count",
                },
              ]}
              rowKey="alert_category"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DdosDashboard;
