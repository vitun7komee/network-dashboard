const express = require("express");
const pool = require("../db");

const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT COUNT(DISTINCT ip) AS unique_ips FROM (
//         SELECT src_ip::inet AS ip FROM suricata_http
//         UNION
//         SELECT src_ip::inet FROM suricata_dns
//         UNION
//         SELECT src_ip::inet FROM suricata_alertsF
//       ) AS all_src_ips;
//     `);

//     res.json({ uniqueSourceIps: result.rows[0].unique_ips });
//   } catch (err) {
//     console.error("Error fetching unique source IPs:", err);
//     res.status(500).json({ error: "Failed to fetch unique source IPs" });
//   }
// });

router.get("/daily", async (req, res) => {
    try {
      const result = await pool.query(`
WITH source_ips_by_hour AS (
  SELECT
    date_trunc('hour', timestamp) AS hour,
    (src_ip)::inet AS ip
  FROM (
    SELECT timestamp, src_ip::inet FROM suricata_http
    UNION ALL
    SELECT timestamp, src_ip::inet FROM suricata_dns
    UNION ALL
    SELECT timestamp, src_ip FROM suricata_alertsF
  ) AS all_sources
  WHERE timestamp::date = CURRENT_DATE
)
SELECT hour, COUNT(DISTINCT ip) AS unique_ips
FROM source_ips_by_hour
GROUP BY hour
ORDER BY hour;
      `);
  
      res.json(result.rows);
    } catch (err) {
      console.error("Ошибка при получении уникальных источников по времени:", err);
      res.status(500).json({ error: "Не удалось получить данные" });
    }
  });
  

module.exports = router;
