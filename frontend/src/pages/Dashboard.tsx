// import { Link } from "react-router-dom";

// export default function Dashboard() {
//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-2xl font-bold">Network Dashboard</h1>
//       <ul className="space-y-2">
//         <li><Link to="/alerts" className="text-blue-600 hover:underline">📢 Alerts</Link></li>
//         <li><Link to="/http" className="text-blue-600 hover:underline">🌐 HTTP</Link></li>
//         <li><Link to="/dns" className="text-blue-600 hover:underline">🧭 DNS</Link></li>
//         <li><Link to="/ip-reputation" className="text-blue-600 hover:underline">🚨 IP Reputation</Link></li>
//       </ul>
//     </div>
//   );
// }
import { Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

const dashboardLinks = [
  { path: "/alerts", title: "📢 Alerts", description: "Последние сетевые предупреждения и события" },
  { path: "/http", title: "🌐 HTTP Logs", description: "Мониторинг HTTP-запросов" },
  { path: "/dns", title: "🧭 DNS Queries", description: "Анализ DNS-запросов и ответов" },
  { path: "/ip-reputation", title: "🚨 IP Reputation", description: "Проверка IP-адресов по базам угроз" },
  { path: "/ddos", title: "🛡️ DDoS & Anomalies", description: "Обнаружение подозрительного сетевого поведения" },
  {
    path: "/anomalies",
    title: "🛡️ DDoS & Anomalies",
    description: "Обнаружение подозрительного сетевого поведения и атак типа DoS/DDoS",
  },
];

export default function Dashboard() {
  return (
    <div className="p-6">
      <Title level={2}>📊 Network Security Dashboard</Title>
      <p className="mb-6 text-gray-600">
        Обзор всех компонентов мониторинга безопасности вашей сети в реальном времени.
      </p>

      <Row gutter={[16, 16]}>
        {dashboardLinks.map((link) => (
          <Col xs={24} sm={12} md={8} key={link.path}>
            <Link to={link.path}>
              <Card
                hoverable
                title={link.title}
                bordered
                style={{ height: "100%" }}
              >
                <p>{link.description}</p>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
