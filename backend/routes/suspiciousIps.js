const express = require("express");
const pool = require("../db");
const { getIpReputation } = require("../utils/abuseIpCheck");

const router = express.Router();

// Получить топ-10 подозрительных IP
router.get("/suspicious-ips", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT ip, reputation, score, country, usage_type, last_checked
      FROM ip_reputation
      WHERE score >= 30
      ORDER BY score DESC, last_checked DESC
      LIMIT 10
    `);

    res.json(rows);
  } catch (err) {
    console.error("Ошибка при получении IP-данных:", err);
    res.status(500).json({ error: "Ошибка получения данных о репутации IP" });
  }
});

// Обновить IP-репутации (вставка новых)
router.post("/fetch", async (req, res) => {
  try {
    const { rows: ipsToCheck } = await pool.query(`
      SELECT DISTINCT ip FROM (
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
      WHERE ip NOT IN (
        SELECT ip FROM ip_reputation
        WHERE last_checked >= NOW() - INTERVAL '7 days'
      )
      LIMIT 10
    `);

    console.log("🔍 Проверка IP:", ipsToCheck.map(r => r.ip).join(", "));

    const enriched = [];

    for (const row of ipsToCheck) {
      try {
        const data = await getIpReputation(row.ip);

        await pool.query(`
          INSERT INTO ip_reputation (ip, reputation, score, country, usage_type, last_checked)
          VALUES ($1, $2, $3, $4, $5, NOW())
          ON CONFLICT (ip) DO UPDATE
          SET reputation = EXCLUDED.reputation,
              score = EXCLUDED.score,
              country = EXCLUDED.country,
              usage_type = EXCLUDED.usage_type,
              last_checked = NOW()
        `, [data.ip, data.reputation, data.score, data.country, data.usageType]);

        enriched.push(data);
      } catch (err) {
        console.warn(`⚠️ Ошибка API по IP ${row.ip}:`, err.message);
      }
    }

    res.json({ updated: enriched.length, enriched });

  } catch (err) {
    console.error("Ошибка обновления IP-репутаций:", err);
    res.status(500).json({ error: "Ошибка обновления данных" });
  }
});

module.exports = router;
