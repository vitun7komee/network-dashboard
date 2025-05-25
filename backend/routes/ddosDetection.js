// routes/ddosDetection.js
const express = require("express");
const router = express.Router();
const pool = require("../db"); // ← Используем pool PostgreSQL

router.get("/", async (req, res) => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // Топ 10 IP по количеству соединений
    const topIpsResult = await pool.query(
      `SELECT src_ip, COUNT(*) AS connection_count
       FROM suricata_alerts
       WHERE timestamp >= $1
       GROUP BY src_ip
       ORDER BY connection_count DESC
       LIMIT 10`,
      [oneHourAgo]
    );

    // Кол-во соединений по протоколу (например, TCP/UDP если есть в логах)
    const protoCountsResult = await pool.query(
      `SELECT proto, COUNT(*) AS count
       FROM suricata_flows
       WHERE timestamp >= $1
       GROUP BY proto`,
      [oneHourAgo]
    );

    res.json({
      top_ips: topIpsResult.rows,
      protocol_counts: protoCountsResult.rows,
    });
  } catch (err) {
    console.error("DDOS route error:", err);
    res.status(500).json({ error: "Failed to fetch DDoS detection data" });
  }
});

module.exports = router;
