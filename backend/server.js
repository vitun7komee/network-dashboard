// backend/server.js
require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const fs       = require("fs");
const chokidar = require("chokidar");
const pool     = require("./db");

const app      = express();
const PORT     = process.env.PORT || 4000;
const EVE_PATH = process.env.EVE_PATH || "C:/Program Files/Suricata/log/eve.json";

app.use(cors());
app.use(express.json());

// Позиция последнего прочтения файла
let filePosition = 0;

/**
 * Читает новые строки из eve.json и вставляет их в PostgreSQL
 */
function ingestNewLines() {
  fs.stat(EVE_PATH, (err, stats) => {
    if (err) return console.error("FS error:", err);

    const stream = fs.createReadStream(EVE_PATH, {
      start: filePosition,
      end:   stats.size,
      encoding: "utf8",
    });

    let buffer = "";

    stream.on("data", chunk => {
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop(); // сохраняем неполную последнюю строку

      lines.filter(Boolean).forEach(line => {
        let log;
        try {
          log = JSON.parse(line);
        } catch {
          return;
        }
        // INSERT alert
        if (log.alert) {
          const { timestamp, alert, src_ip, dest_ip, src_port, dest_port } = log;
          pool.query(
            `INSERT INTO suricata_alerts
               (timestamp, alert_category, alert_severity, alert_message, src_ip, dest_ip, src_port, dest_port)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
              new Date(timestamp),
              alert.category,
              alert.severity,
              alert.message,
              src_ip,
              dest_ip,
              src_port,
              dest_port,
            ]
          ).catch(e => console.error("Alert insert error:", e));
        }
        // INSERT http
        if (log.http) {
          const { timestamp, http, src_ip, dest_ip } = log;
          pool.query(
            `INSERT INTO suricata_http
               (timestamp, host, uri, method, src_ip, dest_ip)
             VALUES ($1,$2,$3,$4,$5,$6)`,
            [
              new Date(timestamp),
              http.host,
              http.uri,
              http.method,
              src_ip,
              dest_ip,
            ]
          ).catch(e => console.error("HTTP insert error:", e));
        }
          // INSERT dns — изменено имя таблицы на suricata_dns 👈
        if (log.dns) {
          const { timestamp, dns, src_ip, dest_ip } = log;
          pool.query(
            `INSERT INTO suricata_dns
               (timestamp, type, query, src_ip, dest_ip)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              new Date(timestamp),
              dns.type,
              dns.rrname,
              src_ip,
              dest_ip
            ]
          ).catch(e => console.error("DNS insert error:", e));
        }
        
        
        // можно добавить dns, tls и т.д.
      });

      // обновляем позицию
      filePosition = stats.size;
    });
  });
}

// Сразу прогружаем существующие логи
ingestNewLines();

// Слежение за обновлениями файла
chokidar.watch(EVE_PATH).on("change", ingestNewLines);

// Эндпоинты для отдачи данных из БД
app.get("/alerts", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM suricata_alerts ORDER BY timestamp DESC LIMIT 100"
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching alerts");
  }
});

app.get("/http", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM suricata_http ORDER BY timestamp DESC LIMIT 100"
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching HTTP logs");
  }
});
//new! dns
app.get("/dns", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM suricata_dns ORDER BY timestamp DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching dns logs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});
