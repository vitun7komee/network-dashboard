//require("dotenv").config();
const express = require("express");
const pool = require("../db");
const { getIpReputation } = require("../utils/abuseIpCheck");

const router = express.Router();
// router.get("/", async (req, res) => {
//     try {
//       const result = await pool.query("SELECT * FROM ip_reputation WHERE usage_type IS DISTINCT FROM 'reserved' ORDER BY last_checked DESC");//score DESC
//       res.json(result.rows);
//     } catch (err) {
//       console.error("Error fetching IP reputation data:", err);
//       res.status(500).json({ error: "Failed to fetch IP reputation data" });
//     }
//   });
  router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM ip_reputation
      WHERE usage_type IS DISTINCT FROM 'Reserved'
      ORDER BY last_checked DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching IP reputation data:", err);
    res.status(500).json({ error: "Failed to fetch IP reputation data" });
  }
});

router.post("/fetch", async (req, res) => {
  try {
    const ipsToCheck = await pool.query(`
        SELECT DISTINCT ip
    FROM (
    SELECT src_ip::INET AS ip FROM suricata_http
    UNION
    SELECT dest_ip::INET FROM suricata_http
    UNION
    SELECT src_ip::INET FROM suricata_dns
    UNION
    SELECT dest_ip::INET FROM suricata_dns
    UNION
    SELECT src_ip::INET FROM suricata_alerts
    UNION
    SELECT dest_ip::INET FROM suricata_alerts
    ) AS all_ips
    WHERE ip NOT IN (SELECT ip FROM ip_reputation)
    LIMIT 10;
`);
    //   SELECT DISTINCT ip
    //   FROM (
    //     SELECT src_ip AS ip FROM suricata_http
    //     UNION
    //     SELECT dest_ip FROM suricata_http
    //     UNION
    //     SELECT src_ip FROM suricata_dns
    //     UNION
    //     SELECT dest_ip FROM suricata_dns
    //     UNION
    //     SELECT src_ip FROM suricata_alerts
    //     UNION
    //     SELECT dest_ip FROM suricata_alerts
    //   ) AS all_ips
    //   WHERE ip NOT IN (SELECT ip FROM ip_reputation)
    //   LIMIT 10;
    // `);

    //console.log("📢 Using hardcoded API key:", ABUSEIPDB_API_KEY.slice(0, 10) + "...");
    console.log("🧪 IPs to check:", ipsToCheck.rows);

    const enriched = [];

    for (const row of ipsToCheck.rows) {
      try {
        const result = await getIpReputation(row.ip);
        await pool.query(
          `INSERT INTO ip_reputation (ip, reputation, score, country, usage_type)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (ip) DO NOTHING`,
          [result.ip, result.reputation, result.score, result.country, result.usageType]
        );
        enriched.push(result);
      } catch (err) {
        console.warn("Skip IP (API fail):", row.ip, err.message);
      }
    }

    res.json({ enriched });
  } catch (err) {
    console.error("IP reputation fetch error:", err);
    res.status(500).json({ error: "Failed to fetch IP reputations" });
  }
});

module.exports = router;
