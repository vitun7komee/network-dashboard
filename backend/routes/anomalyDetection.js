const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const topFloodingIps = await pool.query(`
      SELECT src_ip, COUNT(*) AS connection_count
      FROM suricata_flows
      WHERE timestamp >= $1
      GROUP BY src_ip
      HAVING COUNT(*) > 100 -- порог
      ORDER BY connection_count DESC
      LIMIT 10
    `, [since]);

    const alertStats = await pool.query(`
      SELECT alert_category, COUNT(*) AS count
      FROM suricata_alerts
      WHERE timestamp >= $1
      GROUP BY alert_category
    `, [since]);

    const protoStats = await pool.query(`
      SELECT proto, COUNT(*) AS count
      FROM suricata_flows
      WHERE timestamp >= $1
      GROUP BY proto
    `, [since]);

    const badReputation = await pool.query(`
      SELECT ip, reputation, score, country
      FROM ip_reputation
      WHERE score < 40
      ORDER BY score ASC
      LIMIT 10
    `);

    res.json({
      flooding_ips: topFloodingIps.rows,
      alert_categories: alertStats.rows,
      protocol_distribution: protoStats.rows,
      bad_ips: badReputation.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load anomaly data" });
  }
});

module.exports = router;
