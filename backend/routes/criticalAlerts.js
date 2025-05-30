const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /critical-alerts — получить последние критические события
router.get("/critical-alerts", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT
          timestamp,
          src_ip,
          dest_ip,
          signature AS alert_signature,
          alert_category,
          alert_severity
        FROM suricata_alertsF
        WHERE alert_severity = 1
        ORDER BY timestamp DESC
        LIMIT 20;
      `);
    // const result = await pool.query(
    //   `
    //   SELECT
    //     timestamp,
    //     src_ip::TEXT,
    //     dest_ip::TEXT,
    //     alert_signature,
    //     alert_category,
    //     alert_severity
    //   FROM suricata_alerts
    //   WHERE alert_severity = 1
    //   ORDER BY timestamp DESC
    //   LIMIT 20
    // `
    // );

    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении критических алертов:", err);
    res.status(500).json({ error: "Не удалось получить критические события" });
  }
});

module.exports = router;
