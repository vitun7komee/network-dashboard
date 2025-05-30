// const express = require("express");
// const pool = require("../db");
// const router = express.Router();

// async function logHeuristic(type, description, severity = "medium") {
//   const exists = await pool.query(
//     `SELECT id FROM heuristic_incidents WHERE type = $1 AND description = $2 AND resolved = false LIMIT 1`,
//     [type, description]
//   );
//   if (exists.rows.length === 0) {
//     await pool.query(
//       `INSERT INTO heuristic_incidents (type, description, severity) VALUES ($1, $2, $3)`,
//       [type, description, severity]
//     );
//   }
// }

// // 🔍 1. Частые подключения к IP не из вашей страны
// async function detectForeignConnections() {
//   const result = await pool.query(`
//     SELECT ip, country, COUNT(*) as cnt
//     FROM ip_reputation
//     WHERE country IS NOT NULL AND country <> 'RU'
//     GROUP BY ip, country
//     HAVING COUNT(*) > 10
//   `);

//   for (const row of result.rows) {
//     await logHeuristic(
//       "foreign_connections",
//       `Частые подключения (${row.cnt}) к IP ${row.ip} из страны ${row.country}`,
//       "high"
//     );
//   }
// }

// // 🔁 2. Много HTTP GET подряд
// async function detectSuspiciousHttpGets() {
//   const result = await pool.query(`
//     SELECT src_ip, COUNT(*) as count
//     FROM suricata_http
//     WHERE method = 'GET'
//     GROUP BY src_ip
//     HAVING COUNT(*) > 20
//   `);

//   for (const row of result.rows) {
//     await logHeuristic(
//       "many_get_requests",
//       `Источник ${row.src_ip} выполнил ${row.count} HTTP GET-запросов`,
//       "medium"
//     );
//   }
// }

// // 🧠 3. Один IP шлёт DNS на множество хостов
// async function detectDnsSweeps() {
//   const result = await pool.query(`
//     SELECT src_ip, COUNT(DISTINCT dest_ip) as targets
//     FROM suricata_dns
//     GROUP BY src_ip
//     HAVING COUNT(DISTINCT dest_ip) > 30
//   `);

//   for (const row of result.rows) {
//     await logHeuristic(
//       "dns_sweep",
//       `IP ${row.src_ip} отправил DNS-запросы более чем ${row.targets} адресатам`,
//       "high"
//     );
//   }
// }
// // 🔥 5. Частые ошибки (alerts с высоким уровнем severity)
// async function detectHighSeverityAlerts() {
//     const result = await pool.query(`
//       SELECT src_ip, alert_category, COUNT(*) as count
//       FROM suricata_alertsF
//       WHERE alert_severity >= 4 -- порог severity, можно подстроить
//       GROUP BY src_ip, alert_category
//       HAVING COUNT(*) > 5
//     `);
  
//     for (const row of result.rows) {
//       await logHeuristic(
//         "high_severity_alerts",
//         `IP ${row.src_ip} сгенерировал ${row.count} предупреждений категории "${row.alert_category}" с высокой серьезностью.`,
//         "high"
//       );
//     }
//   }
  
//   // 🚨 6. Аномальное количество HTTP POST запросов (часто признак атаки)
//   async function detectHttpPostFlood() {
//     const result = await pool.query(`
//       SELECT src_ip, COUNT(*) as count
//       FROM suricata_http
//       WHERE method = 'POST' AND timestamp > NOW() - INTERVAL '1 hour'
//       GROUP BY src_ip
//       HAVING COUNT(*) > 30
//     `);
  
//     for (const row of result.rows) {
//       await logHeuristic(
//         "http_post_flood",
//         `IP ${row.src_ip} выполнил более 30 POST запросов за последний час.`,
//         "medium"
//       );
//     }
//   }
  
//   // 🌐 7. DNS запросы на подозрительные домены (например, с определённым паттерном)
//   async function detectSuspiciousDnsQueries() {
//     const suspiciousPatterns = ['.xyz', '.ru', '.top']; // можно расширить
  
//     for (const pattern of suspiciousPatterns) {
//       const result = await pool.query(`
//         SELECT src_ip, COUNT(*) as count
//         FROM suricata_dns
//         WHERE query LIKE $1
//         GROUP BY src_ip
//         HAVING COUNT(*) > 10
//       `, [`%${pattern}`]);
  
//       for (const row of result.rows) {
//         await logHeuristic(
//           "suspicious_dns_query",
//           `IP ${row.src_ip} отправил более 10 DNS-запросов к доменам с паттерном "${pattern}".`,
//           "medium"
//         );
//       }
//     }
//   }
  
//   // ⚠️ 8. Попытки сканирования портов (множество разных dest_port от одного src_ip)
//   async function detectPortScanning() {
//     const result = await pool.query(`
//       SELECT src_ip, COUNT(DISTINCT dest_port) as ports_scanned
//       FROM suricata_flows
//       WHERE timestamp > NOW() - INTERVAL '1 hour'
//       GROUP BY src_ip
//       HAVING COUNT(DISTINCT dest_port) > 20
//     `);
  
//     for (const row of result.rows) {
//       await logHeuristic(
//         "port_scanning",
//         `IP ${row.src_ip} попытался подключиться к более чем ${row.ports_scanned} разным портам за последний час.`,
//         "high"
//       );
//     }
//   }
  
//   // 🚩 9. Негативная репутация IP из ip_reputation (score < 20, например)
// //   async function detectBadReputationIps() {
// //     const result = await pool.query(`
// //       SELECT ip, reputation, score
// //       FROM ip_reputation
// //       WHERE score > 40
// //     `);
  
// //     for (const row of result.rows) {
// //       await logHeuristic(
// //         "bad_ip_reputation",
// //         `IP ${row.ip} имеет плохую репутацию (${row.reputation}) с оценкой ${row.score}.`,
// //         "high"
// //       );
// //     }
// //   }
  

// // 📶 4. Аномальный объём соединений (на основе suricata_flows)
// // async function detectVolumeAnomaly() {
// //   const result = await pool.query(`
// //     SELECT
// //       COUNT(*) FILTER (WHERE timestamp::date = CURRENT_DATE) AS today,
// //       ROUND(AVG(count), 0) AS avg
// //     FROM (
// //       SELECT timestamp::date AS d, COUNT(*) AS count
// //       FROM suricata_flows
// //       GROUP BY d
// //     ) AS sub
// //   `);

// //   const { today, avg } = result.rows[0];
// //   if (avg && today > avg * 1.5) {
// //     await logHeuristic(
// //       "volume_anomaly",
// //       `Сегодня зафиксировано ${today} соединений — это значительно выше среднего (${avg})`,
// //       "medium"
// //     );
// //   }
// // }
// async function detectVolumeAnomaly() {
//     const result = await pool.query(`
//       SELECT
//         COUNT(*) FILTER (WHERE d = CURRENT_DATE) AS today,
//         ROUND(AVG(count), 0) AS avg
//       FROM (
//         SELECT timestamp::date AS d, COUNT(*) AS count
//         FROM suricata_flows
//         GROUP BY d
//       ) AS sub
//     `);
  
//     const { today, avg } = result.rows[0];
//     if (avg && today > avg * 1.5) {
//       await logHeuristic(
//         "volume_anomaly",
//         `Сегодня зафиксировано ${today} соединений — это значительно выше среднего (${avg})`,
//         "medium"
//       );
//      }
//     }
  
  


// // 🧪 Анализ эвристик
// router.post("/analyze", async (req, res) => {
//   try {
//     await detectForeignConnections();
//     await detectSuspiciousHttpGets();
//     await detectDnsSweeps();
//     await detectVolumeAnomaly();
//     // Новые эвристики
//     await detectHighSeverityAlerts();
//     await detectHttpPostFlood();
//     await detectSuspiciousDnsQueries();
//     await detectPortScanning();
//     //await detectBadReputationIps();
//     res.json({ status: "ok" });
//   } catch (err) {
//     console.error("❌ Ошибка анализа эвристик:", err);
//     res.status(500).json({ error: "Heuristic analysis failed" });
//   }
// });

// // 📋 Получение всех инцидентов
// router.get("/", async (req, res) => {
//   try {//SELECT * FROM heuristic_incidents ORDER BY timestamp DESC
//     const result = await pool.query(`
//         SELECT * FROM heuristic_incidents WHERE resolved = false ORDER BY timestamp DESC
//     `);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("❌ Ошибка при получении эвристик:", err);
//     res.status(500).json({ error: "Failed to fetch incidents" });
//   }
// });

// // ✅ Пометить инцидент как решённый
// router.post("/:id/resolve", async (req, res) => {
//   const { id } = req.params;
//   try {
//     await pool.query(`
//       UPDATE heuristic_incidents SET resolved = true WHERE id = $1
//     `, [id]);
//     res.json({ status: "resolved" });
//   } catch (err) {
//     console.error("❌ Ошибка при закрытии инцидента:", err);
//     res.status(500).json({ error: "Failed to resolve incident" });
//   }
// });

// module.exports = router;
// 📁 heuristics.js
const express = require("express");
const pool = require("../db");
const router = express.Router();
const crypto = require("crypto");//хеш

// 🆕 Расширенный логгер с угрозой и рекомендациями
// async function logHeuristic(type, description, severity = "medium", threat = "", recommendations = "") {
//   const exists = await pool.query(
//     `SELECT id FROM heuristic_incidents WHERE type = $1 AND description = $2 AND resolved = false LIMIT 1`,
//     [type, description]
//   );
//   if (exists.rows.length === 0) {
//     await pool.query(
//       `INSERT INTO heuristic_incidents (type, description, severity, threat, recommendations) VALUES ($1, $2, $3, $4, $5)`,
//       [type, description, severity, threat, recommendations]
//     );
//   }
// }
// 🆕 Расширенный логгер с проверкой дубликатов (включая resolved = true)
async function logHeuristic(type, description, severity = "medium", threat = "", recommendations = "") {
  // 🔒 Проверяем, существует ли уже такой инцидент (любого статуса)
  const existing = await pool.query(
    `SELECT id, resolved FROM heuristic_incidents WHERE type = $1 AND description = $2 ORDER BY timestamp DESC LIMIT 1`,
    [type, description]
  );

  // ❌ Если уже существует и нерешён — ничего не делаем
  if (existing.rows.length > 0 && existing.rows[0].resolved) {
    return; // 🔁 уже существует активный инцидент
  }

  // ✅ Если не существует или был решён ранее — создаём новый
  await pool.query(
    `INSERT INTO heuristic_incidents (type, description, severity, threat, recommendations) VALUES ($1, $2, $3, $4, $5)`,
    [type, description, severity, threat, recommendations]
  );
}



// 🔍 1. Частые подключения к IP не из вашей страны
async function detectForeignConnections() {
  const result = await pool.query(`
    SELECT ip, country, COUNT(*) as cnt
    FROM ip_reputation
    WHERE country IS NOT NULL AND country <> 'RU'
    AND last_checked > NOW() - INTERVAL '7 days'
    GROUP BY ip, country
    HAVING COUNT(*) > 10
  `);

  for (const row of result.rows) {
    await logHeuristic(
      "foreign_connections",
      `Частые подключения (${row.cnt}) к IP ${row.ip} из страны ${row.country}`,
      "high",
      "C2 / подозрительный трафик",
      "Проверьте процесс, установивший соединение. Заблокируйте IP на периметре, если он неизвестен."
    );
  }
}


// 🔁 2. Много HTTP GET подряд
async function detectSuspiciousHttpGets() {
  const result = await pool.query(`
    SELECT src_ip, COUNT(*) as count
    FROM suricata_http
    WHERE method = 'GET' AND timestamp > NOW() - INTERVAL '1 day'
    GROUP BY src_ip
    HAVING COUNT(*) > 20
  `);

  for (const row of result.rows) {
    await logHeuristic(
      "many_get_requests",
      `Источник ${row.src_ip} выполнил ${row.count} HTTP GET-запросов`,
      "medium",
      "Recon Activity",
      "Проверьте поведение этого IP. Часто используется при сканировании или подстановке URL."
    );
  }
}

// 🧠 3. Один IP шлёт DNS на множество хостов
async function detectDnsSweeps() {
  const result = await pool.query(`
    SELECT src_ip, COUNT(DISTINCT dest_ip) as targets
    FROM suricata_dns
    WHERE timestamp > NOW() - INTERVAL '1 day'
    GROUP BY src_ip
    HAVING COUNT(DISTINCT dest_ip) > 30
  `);

  for (const row of result.rows) {
    await logHeuristic(
      "dns_sweep",
      `IP ${row.src_ip} отправил DNS-запросы более чем ${row.targets} адресатам`,
      "high",
      "Recon / Beaconing",
      "Проверьте наличие зловредов или программ анализа инфраструктуры."
    );
  }
}

// 📶 4. Аномальный объём соединений
async function detectVolumeAnomaly() {
  const result = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE d = CURRENT_DATE) AS today,
      ROUND(AVG(count), 0) AS avg
    FROM (
      SELECT timestamp::date AS d, COUNT(*) AS count
      FROM suricata_flows
      GROUP BY d
    ) AS sub
  `);

  const { today, avg } = result.rows[0];
  if (avg && today > avg * 1.5) {
    await logHeuristic(
      "volume_anomaly",
      `Сегодня зафиксировано ${today} соединений — выше среднего (${avg})`,
      "medium",
      "Anomalous Activity",
      "Проверьте все IP с наибольшим числом соединений. Возможна атака или сканирование."
    );
  }
}

// 🔥 5. Частые ошибки (alerts с высоким severity)
async function detectHighSeverityAlerts() {
  const result = await pool.query(`
    SELECT src_ip, alert_category, COUNT(*) as count
    FROM suricata_alertsF
    WHERE alert_severity >= 4 AND timestamp > NOW() - INTERVAL '1 day'
    GROUP BY src_ip, alert_category
    HAVING COUNT(*) > 5
  `);

  for (const row of result.rows) {
    await logHeuristic(
      "high_severity_alerts",
      `IP ${row.src_ip} сгенерировал ${row.count} предупреждений категории "${row.alert_category}"`,
      "high",
      "Malicious Traffic",
      "Проанализируйте предупреждения, изолируйте систему и проведите антивирусную проверку."
    );
  }
}

// 🚨 6. Аномальное количество HTTP POST запросов
async function detectHttpPostFlood() {
  const result = await pool.query(`
    SELECT src_ip, COUNT(*) as count
    FROM suricata_http
    WHERE method = 'POST' AND timestamp > NOW() - INTERVAL '1 hour'
    GROUP BY src_ip
    HAVING COUNT(*) > 30
  `);

  for (const row of result.rows) {
    await logHeuristic(
      "http_post_flood",
      `IP ${row.src_ip} выполнил более 30 POST запросов за последний час.`,
      "medium",
      "Potential DoS / Data Exfiltration",
      "Проверьте POST-запросы на утечку данных или подозрительные формы."
    );
  }
}

// 🌐 7. DNS запросы на подозрительные домены
async function detectSuspiciousDnsQueries() {
  const patterns = ['.xyz', '.ru', '.top'];
  for (const pattern of patterns) {
    const result = await pool.query(`
      SELECT src_ip, COUNT(*) as count
      FROM suricata_dns
      WHERE query LIKE $1 AND timestamp > NOW() - INTERVAL '7 days'
      GROUP BY src_ip
      HAVING COUNT(*) > 10
    `, [`%${pattern}`]);

    for (const row of result.rows) {
      await logHeuristic(
        "suspicious_dns_query",
        `IP ${row.src_ip} сделал более 10 DNS-запросов к доменам "${pattern}"`,
        "medium",
        "Suspicious DNS",
        "Изучите этот трафик. Часто используется в фишинге, малвари или C2."
      );
    }
  }
}

// ⚠️ 8. Попытки сканирования портов
async function detectPortScanning() {
  const result = await pool.query(`
    SELECT src_ip, COUNT(DISTINCT dest_port) as ports_scanned
    FROM suricata_flows
    WHERE timestamp > NOW() - INTERVAL '1 hour'
    GROUP BY src_ip
    HAVING COUNT(DISTINCT dest_port) > 20
  `);

  for (const row of result.rows) {
    await logHeuristic(
      "port_scanning",
      `IP ${row.src_ip} просканировал ${row.ports_scanned} портов`,
      "high",
      "Port Scan",
      "Блокируйте IP, проанализируйте логи. Возможна подготовка к атаке."
    );
  }
}

// 🧪 Анализ всех эвристик
router.post("/analyze", async (req, res) => {
  try {
    await detectForeignConnections();
    await detectSuspiciousHttpGets();
    await detectDnsSweeps();
    await detectVolumeAnomaly();
    await detectHighSeverityAlerts();
    await detectHttpPostFlood();
    await detectSuspiciousDnsQueries();
    await detectPortScanning();
    res.json({ status: "ok" });
  } catch (err) {
    console.error("❌ Ошибка анализа эвристик:", err);
    res.status(500).json({ error: "Heuristic analysis failed" });
  }
});

// 📋 Получение всех нерешённых инцидентов
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM heuristic_incidents WHERE resolved = false ORDER BY timestamp DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Ошибка при получении эвристик:", err);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

// ✅ Пометить инцидент как решённый
router.post("/:id/resolve", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`
      UPDATE heuristic_incidents SET resolved = true WHERE id = $1
    `, [id]);
    res.json({ status: "resolved" });
  } catch (err) {
    console.error("❌ Ошибка при закрытии инцидента:", err);
    res.status(500).json({ error: "Failed to resolve incident" });
  }
});

module.exports = router;
