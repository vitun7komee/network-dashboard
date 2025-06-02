const express = require("express");
const router = express.Router();
const pool = require("../db");

// Условная логика оценки состояния
function evaluateSecurity(alerts, flowCount) {
  const highSeverity = alerts.filter(a => a.alert_severity >= 3).length;
  const totalAlerts = alerts.length;

  const anomalyRatio = totalAlerts > 0 ? highSeverity / totalAlerts : 0;

  if (highSeverity > 20 || anomalyRatio > 0.5 || flowCount > 10000) {
    return "red"; // критическая ситуация
  } else if (highSeverity > 5 || anomalyRatio > 0.2 || flowCount > 5000) {
    return "yellow"; // потенциальная угроза
  } else {
    return "green"; // всё нормально
  }
}

router.get("/securitystatus", async (req, res) => {
  try {
    const { rows: alerts } = await pool.query(`
      SELECT alert_severity
      FROM suricata_alertsF
      WHERE timestamp >= NOW() - INTERVAL '24 HOURS'
    `);

    const { rows: flowResult } = await pool.query(`
      SELECT COUNT(*) FROM suricata_flows
      WHERE timestamp >= NOW() - INTERVAL '24 HOURS'
    `);

    const flowCount = parseInt(flowResult[0].count);
    const status = evaluateSecurity(alerts, flowCount);

    // Находим конкретную угрозу
    // const { rows: topThreats } = await pool.query(`
    //   SELECT alert_message, COUNT(*) as count
    //   FROM suricata_alertsF
    //   WHERE timestamp >= NOW() - INTERVAL '24 HOURS'
    //   GROUP BY alert_message
    //   ORDER BY count DESC
    //   LIMIT 1
    // `);
        const { rows: topThreats } = await pool.query(`
      SELECT signature, COUNT(*) as count
      FROM suricata_alertsF
      WHERE timestamp >= NOW() - INTERVAL '24 HOURS'
      GROUP BY signature
      ORDER BY count DESC
      LIMIT 1
    `);

    res.json({
      status,                          // "green", "yellow", "red"
      most_common_threat: topThreats[0]?.signature || "None",//alert_message
      threat_count: topThreats[0]?.count || 0
    });

  } catch (error) {
    console.error("Ошибка в /securitystatus:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
