
// const express = require("express");
// const pool = require("../db");
// const router = express.Router();

// // Helper: временной фильтр
// const TIME_FILTER = `AND timestamp > NOW() - INTERVAL '7 days'`;

// // 🔍 IP Lookup
// router.get("/ip/:ip", async (req, res) => {
//   const { ip } = req.params;

//   try {
//     const [incidents, http, dns, alerts, flows, summary] = await Promise.all([

//       // Эвристики
//       pool.query(`
//         SELECT id, type, description, severity, timestamp
//         FROM heuristic_incidents
//         WHERE description ILIKE $1
//         ${TIME_FILTER}
//         ORDER BY timestamp DESC
//         LIMIT 100
//       `, [`%${ip}%`]),

//       // HTTP-запросы (новая таблица)
//       pool.query(`
//         SELECT DISTINCT ON (url, http_method, src_ip)
//                timestamp, src_ip, dest_ip, hostname, url, http_method, http_user_agent
//         FROM suricata_httpF
//         WHERE (src_ip = $1 OR dest_ip = $1)
//         ${TIME_FILTER}
//         ORDER BY url, http_method, src_ip, timestamp DESC
//         LIMIT 100
//       `, [ip]),

//       // DNS-запросы
//       pool.query(`
//         SELECT timestamp, src_ip, query
//         FROM suricata_dns
//         WHERE src_ip = $1
//         ${TIME_FILTER}
//         ORDER BY timestamp DESC
//         LIMIT 100
//       `, [ip]),

//       // Suricata Alerts
//       pool.query(`
//         SELECT timestamp, src_ip, alert_category, alert_severity, signature
//         FROM suricata_alertsF
//         WHERE src_ip = $1
//         ${TIME_FILTER}
//         ORDER BY timestamp DESC
//         LIMIT 100
//       `, [ip]),

//       // Flows
//       pool.query(`
//         SELECT timestamp, src_ip, dest_ip, dest_port, proto
//         FROM suricata_flows
//         WHERE src_ip = $1 OR dest_ip = $1
//         ${TIME_FILTER}
//         ORDER BY timestamp DESC
//         LIMIT 100
//       `, [ip]),

//       // Обобщённая сводка
//       pool.query(`
//         SELECT
//           COUNT(*) AS total_http,
//           COUNT(DISTINCT url) AS unique_urls,
//           COUNT(DISTINCT http_user_agent) AS unique_agents,
//           COUNT(DISTINCT dest_ip) AS unique_destinations,
//           MAX(timestamp) AS last_seen
//         FROM suricata_httpF
//         WHERE src_ip = $1 OR dest_ip = $1
//         ${TIME_FILTER}
//       `, [ip])
//     ]);

//     res.json({
//       summary: summary.rows[0],
//       incidents: incidents.rows,
//       http: http.rows,
//       dns: dns.rows,
//       alerts: alerts.rows,
//       flows: flows.rows
//     });
//   } catch (err) {
//     console.error("❌ Ошибка при IP lookup:", err);
//     res.status(500).json({ error: "Lookup failed" });
//   }
// });


// // 🔍 Domain Lookup
// router.get("/domain/:domain", async (req, res) => {
//   const { domain } = req.params;

//   try {
//     const dns = await pool.query(`
//       SELECT timestamp, src_ip, query
//       FROM suricata_dns
//       WHERE query ILIKE $1
//       ${TIME_FILTER}
//       ORDER BY timestamp DESC
//       LIMIT 100
//     `, [`%${domain}%`]);

//     const http = await pool.query(`
//       SELECT timestamp, src_ip, dest_ip, hostname, url, http_method, http_user_agent
//       FROM suricata_httpF
//       WHERE hostname ILIKE $1
//       ${TIME_FILTER}
//       ORDER BY timestamp DESC
//       LIMIT 100
//     `, [`%${domain}%`]);

//     res.json({ dns: dns.rows, http: http.rows });
//   } catch (err) {
//     console.error("❌ Ошибка при domain lookup:", err);
//     res.status(500).json({ error: "Lookup failed" });
//   }
// });


// // 🔍 User-Agent Lookup
// router.get("/agent/:agent", async (req, res) => {
//   const { agent } = req.params;

//   try {
//     const http = await pool.query(`
//       SELECT timestamp, src_ip, dest_ip, hostname, url, http_method, http_user_agent
//       FROM suricata_httpF
//       WHERE http_user_agent ILIKE $1
//       ${TIME_FILTER}
//       ORDER BY timestamp DESC
//       LIMIT 100
//     `, [`%${agent}%`]);

//     const summary = await pool.query(`
//       SELECT COUNT(*) AS total, COUNT(DISTINCT src_ip) AS unique_ips
//       FROM suricata_httpF
//       WHERE http_user_agent ILIKE $1
//       ${TIME_FILTER}
//     `, [`%${agent}%`]);

//     res.json({ summary: summary.rows[0], http: http.rows });
//   } catch (err) {
//     console.error("❌ Ошибка при agent lookup:", err);
//     res.status(500).json({ error: "Lookup failed" });
//   }
// });


// // 🔍 URL Lookup
// router.get("/url/:url", async (req, res) => {
//   const { url } = req.params;

//   try {
//     const http = await pool.query(`
//       SELECT timestamp, src_ip, dest_ip, hostname, url, http_method, http_user_agent
//       FROM suricata_httpF
//       WHERE url ILIKE $1
//       ${TIME_FILTER}
//       ORDER BY timestamp DESC
//       LIMIT 100
//     `, [`%${url}%`]);

//     res.json({ http: http.rows });
//   } catch (err) {
//     console.error("❌ Ошибка при url lookup:", err);
//     res.status(500).json({ error: "Lookup failed" });
//   }
// });


// // 🔍 Signature lookup
// router.get("/signature/:sig", async (req, res) => {
//   const { sig } = req.params;

//   try {
//     const alerts = await pool.query(`
//       SELECT timestamp, src_ip, alert_category, alert_severity, signature
//       FROM suricata_alertsF
//       WHERE signature ILIKE $1
//       ${TIME_FILTER}
//       ORDER BY timestamp DESC
//       LIMIT 100
//     `, [`%${sig}%`]);

//     res.json({ alerts: alerts.rows });
//   } catch (err) {
//     console.error("❌ Ошибка при signature lookup:", err);
//     res.status(500).json({ error: "Lookup failed" });
//   }
// });

// module.exports = router;
const express = require("express");
const pool = require("../db");
const router = express.Router();

const TIME_FILTER = `AND timestamp > NOW() - INTERVAL '7 days'`;

// 📌 IP Lookup
router.get("/ip/:ip", async (req, res) => {
  const { ip } = req.params;

  try {
    const [incidents, http, dns, alerts, flows, summary] = await Promise.all([

      pool.query(`
        SELECT DISTINCT ON (type, description, severity, timestamp)
               id, type, description, severity, timestamp
        FROM heuristic_incidents
        WHERE description ILIKE $1
        ${TIME_FILTER}
        ORDER BY type, description, severity, timestamp DESC
        LIMIT 100
      `, [`%${ip}%`]),

      pool.query(`
        SELECT DISTINCT ON (url, http_method, src_ip)
               timestamp, src_ip, dest_ip, hostname, url, http_method, http_user_agent
        FROM suricata_httpF
        WHERE (src_ip = $1 OR dest_ip = $1)
        ${TIME_FILTER}
        ORDER BY url, http_method, src_ip, timestamp DESC
        LIMIT 100
      `, [ip]),

      pool.query(`
        SELECT DISTINCT ON (timestamp, src_ip, query)
               timestamp, src_ip, query
        FROM suricata_dns
        WHERE src_ip = $1
        ${TIME_FILTER}
        ORDER BY timestamp DESC
        LIMIT 100
      `, [ip]),

      pool.query(`
        SELECT DISTINCT ON (timestamp, src_ip, alert_category, signature)
               timestamp, src_ip, alert_category, alert_severity, signature
        FROM suricata_alertsF
        WHERE src_ip = $1
        ${TIME_FILTER}
        ORDER BY timestamp DESC
        LIMIT 100
      `, [ip]),

      pool.query(`
        SELECT DISTINCT ON (timestamp, src_ip, dest_ip, dest_port, proto)
               timestamp, src_ip, dest_ip, dest_port, proto
        FROM suricata_flows
        WHERE src_ip = $1 OR dest_ip = $1
        ${TIME_FILTER}
        ORDER BY timestamp DESC
        LIMIT 100
      `, [ip]),

      pool.query(`
        SELECT
          COUNT(*) AS total_http,
          COUNT(DISTINCT url) AS unique_urls,
          COUNT(DISTINCT http_user_agent) AS unique_agents,
          COUNT(DISTINCT dest_ip) AS unique_destinations,
          MAX(timestamp) AS last_seen
        FROM suricata_httpF
        WHERE src_ip = $1 OR dest_ip = $1
        ${TIME_FILTER}
      `, [ip])
    ]);

    res.json({
      summary: summary.rows[0],
      incidents: incidents.rows,
      http: http.rows,
      dns: dns.rows,
      alerts: alerts.rows,
      flows: flows.rows
    });

  } catch (err) {
    console.error("❌ Ошибка при IP lookup:", err);
    res.status(500).json({ error: "Lookup failed" });
  }
});


// 📌 Domain Lookup
router.get("/domain/:domain", async (req, res) => {
  const { domain } = req.params;

  try {
    const dns = await pool.query(`
      SELECT DISTINCT ON (timestamp, src_ip, query)
             timestamp, src_ip, query
      FROM suricata_dns
      WHERE query ILIKE $1
      ${TIME_FILTER}
      ORDER BY timestamp DESC
      LIMIT 100
    `, [`%${domain}%`]);

    const http = await pool.query(`
      SELECT DISTINCT ON (timestamp, src_ip, dest_ip, hostname, url, http_method)
             timestamp, src_ip, dest_ip, hostname, url, http_method, http_user_agent
      FROM suricata_httpF
      WHERE hostname ILIKE $1
      ${TIME_FILTER}
      ORDER BY timestamp DESC
      LIMIT 100
    `, [`%${domain}%`]);

    res.json({ dns: dns.rows, http: http.rows });

  } catch (err) {
    console.error("❌ Ошибка при domain lookup:", err);
    res.status(500).json({ error: "Lookup failed" });
  }
});


// 📌 User-Agent Lookup
router.get("/agent/:agent", async (req, res) => {
  const { agent } = req.params;

  try {
    const http = await pool.query(`
      SELECT DISTINCT ON (timestamp, src_ip, dest_ip, hostname, url, http_method)
             timestamp, src_ip, dest_ip, hostname, url, http_method, http_user_agent
      FROM suricata_httpF
      WHERE http_user_agent ILIKE $1
      ${TIME_FILTER}
      ORDER BY timestamp DESC
      LIMIT 100
    `, [`%${agent}%`]);

    const summary = await pool.query(`
      SELECT COUNT(*) AS total, COUNT(DISTINCT src_ip) AS unique_ips
      FROM suricata_httpF
      WHERE http_user_agent ILIKE $1
      ${TIME_FILTER}
    `, [`%${agent}%`]);

    res.json({ summary: summary.rows[0], http: http.rows });

  } catch (err) {
    console.error("❌ Ошибка при agent lookup:", err);
    res.status(500).json({ error: "Lookup failed" });
  }
});


// 📌 URL Lookup
router.get("/url/:url", async (req, res) => {
  const { url } = req.params;

  try {
    const http = await pool.query(`
      SELECT DISTINCT ON (timestamp, src_ip, dest_ip, hostname, url, http_method)
             timestamp, src_ip, dest_ip, hostname, url, http_method, http_user_agent
      FROM suricata_httpF
      WHERE url ILIKE $1
      ${TIME_FILTER}
      ORDER BY timestamp DESC
      LIMIT 100
    `, [`%${url}%`]);

    res.json({ http: http.rows });

  } catch (err) {
    console.error("❌ Ошибка при url lookup:", err);
    res.status(500).json({ error: "Lookup failed" });
  }
});


// 📌 Signature lookup
router.get("/signature/:sig", async (req, res) => {
  const { sig } = req.params;

  try {
    const alerts = await pool.query(`
      SELECT DISTINCT ON (timestamp, src_ip, alert_category, signature)
             timestamp, src_ip, alert_category, alert_severity, signature
      FROM suricata_alertsF
      WHERE signature ILIKE $1
      ${TIME_FILTER}
      ORDER BY timestamp DESC
      LIMIT 100
    `, [`%${sig}%`]);

    res.json({ alerts: alerts.rows });

  } catch (err) {
    console.error("❌ Ошибка при signature lookup:", err);
    res.status(500).json({ error: "Lookup failed" });
  }
});

module.exports = router;
