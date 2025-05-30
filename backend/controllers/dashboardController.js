const db = require('../db');
const geoip = require('geoip-lite');

exports.getOverview = async (req, res) => {
  try {
    // Уникальные IP-адреса
    const uniqueIPs = await db.query(`
      SELECT COUNT(DISTINCT ip) as total FROM (
        SELECT src_ip AS ip FROM suricata_alerts
        UNION
        SELECT dest_ip AS ip FROM suricata_alerts
        UNION
        SELECT src_ip AS ip FROM suricata_flows
        UNION
        SELECT dest_ip AS ip FROM suricata_flows
      ) AS all_ips;
    `);

    // Аномалии по типам
    const anomalies = await db.query(`
      SELECT alert_category AS type, COUNT(*) AS count
      FROM suricata_alerts
      GROUP BY alert_category;
    `);

    // Геораспределение
    const geoDistribution = await db.query(`
      SELECT country, COUNT(*) AS count
      FROM ip_reputation
      WHERE country IS NOT NULL
      GROUP BY country
      ORDER BY count DESC
      LIMIT 10;
    `);

    // Получим уникальные IP из alert и flows
    const ipResults = await db.query(`
      SELECT src_ip AS ip FROM suricata_alerts
      UNION
      SELECT dest_ip AS ip FROM suricata_alerts
      UNION
      SELECT src_ip AS ip FROM suricata_flows
      UNION
      SELECT dest_ip AS ip FROM suricata_flows
      LIMIT 200;
    `);

    const ipList = ipResults.rows.map(row => row.ip);
    const asnCounts = {};

    for (const ip of ipList) {
      const geo = geoip.lookup(ip);
      if (!geo || !geo.country) continue;

      // Простейшая имитация "ASN": /24 + страна
      const asnKey = `${ip.split('.').slice(0, 3).join('.')}.0/24 (${geo.country})`;

      asnCounts[asnKey] = (asnCounts[asnKey] || 0) + 1;
    }

    const asnDistribution = Object.entries(asnCounts)
      .map(([asn, count]) => ({ asn, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Инциденты
    const dailyIncidents = await db.query(`
      SELECT DATE(timestamp) AS date, COUNT(*) AS count
      FROM suricata_alerts
      WHERE timestamp >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(timestamp)
      ORDER BY date ASC;
    `);

    const weeklyIncidents = await db.query(`
      SELECT TO_CHAR(timestamp, 'IYYY-IW') AS week, COUNT(*) AS count
      FROM suricata_alerts
      WHERE timestamp >= NOW() - INTERVAL '30 days'
      GROUP BY TO_CHAR(timestamp, 'IYYY-IW')
      ORDER BY week ASC;
    `);

    // Ответ
    res.json({
      uniqueIPs: uniqueIPs.rows[0].total,
      anomalies: anomalies.rows.reduce((acc, row) => {
        acc[row.type] = row.count;
        return acc;
      }, {}),
      geoDistribution: geoDistribution.rows,
      asnDistribution,
      incidents: {
        daily: dailyIncidents.rows,
        weekly: weeklyIncidents.rows
      }
    });

  } catch (error) {
    console.error("❌ Ошибка при получении данных dashboard overview:", error);
    res.status(500).json({ error: 'Ошибка сервера при получении обзора' });
  }
};
