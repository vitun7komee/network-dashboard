import { Alert, Card, Col, Row, Spin, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

const { Title } = Typography;

const AnomalyDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance.get("/api/anomaly-detection")
      .then(res => {
        setData(res.data);
        setError(null);
      })
      .catch(() => setError("Ошибка загрузки"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin tip="Загрузка..." />;
  if (error) return <Alert type="error" message={error} showIcon />;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>🚨 DDoS и аномалии (последний час)</Title>
      <Row gutter={24}>
        <Col span={12}>
          <Card title="🌊 Подозрительные IP (много потоков)">
            <Table
              dataSource={data.flooding_ips}
              columns={[
                { title: "IP", dataIndex: "src_ip", key: "src_ip" },
                { title: "Потоки", dataIndex: "connection_count", key: "connection_count" },
              ]}
              rowKey="src_ip"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="📁 Категории алертов">
            <Table
              dataSource={data.alert_categories}
              columns={[
                { title: "Категория", dataIndex: "alert_category", key: "alert_category" },
                { title: "Количество", dataIndex: "count", key: "count" },
              ]}
              rowKey="alert_category"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="📊 Протоколы в трафике">
            <Table
              dataSource={data.protocol_distribution}
              columns={[
                { title: "Протокол", dataIndex: "proto", key: "proto" },
                { title: "Количество", dataIndex: "count", key: "count" },
              ]}
              rowKey="proto"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="☠️ IP с плохой репутацией">
            <Table
              dataSource={data.bad_ips}
              columns={[
                { title: "IP", dataIndex: "ip", key: "ip" },
                { title: "Репутация", dataIndex: "reputation", key: "reputation" },
                { title: "Оценка", dataIndex: "score", key: "score" },
                { title: "Страна", dataIndex: "country", key: "country" },
              ]}
              rowKey="ip"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnomalyDashboard;
