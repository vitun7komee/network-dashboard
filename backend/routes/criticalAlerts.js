const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /critical-alerts — получить последние критические события
router.get("/critical-alerts", async (req, res) => {
  try {
    // const result = await pool.query(`
    //     SELECT
    //       timestamp,
    //       src_ip,
    //       dest_ip,
    //       signature AS alert_signature,
    //       alert_category,
    //       alert_severity
    //     FROM suricata_alertsF
    //     WHERE alert_severity = 1
    //     ORDER BY timestamp DESC
    //     LIMIT 20;
    //   `);
        const result = await pool.query(`
      SELECT DISTINCT ON (timestamp)
        timestamp,
        src_ip,
        dest_ip,
        signature AS alert_signature,
        alert_category,
        alert_severity
      FROM suricata_alertsF
      WHERE alert_severity <= 3
      AND timestamp >= NOW() - INTERVAL '7 days'
      ORDER BY timestamp DESC
      LIMIT 10;
    `); // order by alert_signature,


    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении критических алертов:", err);
    res.status(500).json({ error: "Не удалось получить критические события" });
  }
});

module.exports = router;
