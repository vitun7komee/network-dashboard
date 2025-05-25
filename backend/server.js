// // backend/server.js
// require("dotenv").config();
// const express  = require("express");
// const cors     = require("cors");
// const fs       = require("fs");
// const chokidar = require("chokidar");
// const pool     = require("./db");
// // added web-socket
// const socketIO = require("socket.io");

// const app      = express();
// const PORT     = process.env.PORT || 4000;
// const EVE_PATH = process.env.EVE_PATH || "C:/Program Files/Suricata/log/eve.json";
// // added web-socket
// const server = http.createServer(app);
// const io     = socketIO(server, { cors: { origin: "*" } });

// app.use(cors());
// app.use(express.json());

// // Позиция последнего прочтения файла
// let filePosition = 0;

// /**
//  * Читает новые строки из eve.json и вставляет их в PostgreSQL
//  */
// function ingestNewLines() {
//   fs.stat(EVE_PATH, (err, stats) => {
//     if (err) return console.error("FS error:", err);

//     const stream = fs.createReadStream(EVE_PATH, {
//       start: filePosition,
//       end:   stats.size,
//       encoding: "utf8",
//     });

//     let buffer = "";

//     stream.on("data", chunk => {
//       buffer += chunk;
//       const lines = buffer.split("\n");
//       buffer = lines.pop(); // сохраняем неполную последнюю строку

//       lines.filter(Boolean).forEach(line => {
//         let log;
//         try {
//           log = JSON.parse(line);
//         } catch {
//           return;
//         }
//         // INSERT alert
//         if (log.alert) {
//           const { timestamp, alert, src_ip, dest_ip, src_port, dest_port } = log;
//           pool.query(
//             `INSERT INTO suricata_alerts
//                (timestamp, alert_category, alert_severity, alert_message, src_ip, dest_ip, src_port, dest_port)
//              VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
//             [
//               new Date(timestamp),
//               alert.category,
//               alert.severity,
//               alert.message,
//               src_ip,
//               dest_ip,
//               src_port,
//               dest_port,
//             ]
//           ).catch(e => console.error("Alert insert error:", e));
//         }
//         // INSERT http
//         if (log.http) {
//           const { timestamp, http, src_ip, dest_ip } = log;
//           pool.query(
//             `INSERT INTO suricata_http
//                (timestamp, host, uri, method, src_ip, dest_ip)
//              VALUES ($1,$2,$3,$4,$5,$6)`,
//             [
//               new Date(timestamp),
//               http.host,
//               http.uri,
//               http.method,
//               src_ip,
//               dest_ip,
//             ]
//           ).catch(e => console.error("HTTP insert error:", e));
//         }
//           // INSERT dns — изменено имя таблицы на suricata_dns 👈
//         if (log.dns) {
//           const { timestamp, dns, src_ip, dest_ip } = log;
//           pool.query(
//             `INSERT INTO suricata_dns
//                (timestamp, type, query, src_ip, dest_ip)
//              VALUES ($1, $2, $3, $4, $5)`,
//             [
//               new Date(timestamp),
//               dns.type,
//               dns.rrname,
//               src_ip,
//               dest_ip
//             ]
//           ).catch(e => console.error("DNS insert error:", e));
//         }
        
        
//         // можно добавить dns, tls и т.д.
//       });

//       // обновляем позицию
//       filePosition = stats.size;
//     });
//   });
// }

// // Сразу прогружаем существующие логи
// ingestNewLines();

// // Слежение за обновлениями файла
// chokidar.watch(EVE_PATH).on("change", ingestNewLines);

// // Эндпоинты для отдачи данных из БД
// app.get("/alerts", async (req, res) => {
//   try {
//     const { rows } = await pool.query(
//       "SELECT * FROM suricata_alerts ORDER BY timestamp DESC LIMIT 100"
//     );
//     res.json(rows);
//   } catch (e) {
//     console.error(e);
//     res.status(500).send("Error fetching alerts");
//   }
// });

// app.get("/http", async (req, res) => {
//   try {
//     const { rows } = await pool.query(
//       "SELECT * FROM suricata_http ORDER BY timestamp DESC LIMIT 100"
//     );
//     res.json(rows);
//   } catch (e) {
//     console.error(e);
//     res.status(500).send("Error fetching HTTP logs");
//   }
// });
// //new! dns
// app.get("/dns", async (req, res) => {
//   try {
//     const { rows } = await pool.query("SELECT * FROM suricata_dns ORDER BY timestamp DESC");
//     res.json(rows);
//   } catch (err) {
//     console.error("Error fetching dns logs:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.listen(PORT, () => {
//   console.log(`🚀 Server is listening on http://localhost:${PORT}`);
// });



// backend/server.js

require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const fs        = require("fs");
const http      = require("http");
const chokidar  = require("chokidar");
const pool      = require("./db");           // наш db.js с once("connect") и initialized-флагом
const socketIO  = require("socket.io");
//REPUTATION NEW <
const ipReputationFetchRoute = require("./routes/ipReputationFetch");
const cron = require("node-cron");
const axios = require("axios");
const ipReputationRoutes = require("./routes/ipReputationFetch");
//REPUTATION NEW >

//DDOS NEW
const ddosDetectionRoute = require("./routes/ddosDetection");
const anomalyDetectionRoute = require("./routes/anomalyDetection");
//DDOS NEW
const app       = express();
const server    = http.createServer(app);
const io        = socketIO(server, { cors: { origin: "*" } });

const PORT      = process.env.PORT || 4000;
const EVE_PATH  = process.env.EVE_PATH || "C:/Program Files/Suricata/log/eve.json";

//app.use("/ip-reputation", ipReputationFetchRoute);//REPUTATION NEW
app.use(cors());
app.use(express.json());

// WebSocket: логируем соединения
io.on("connection", socket => {
  console.log("👤 WebSocket client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("👋 WebSocket client disconnected:", socket.id);
  });
});

// Позиция последнего прочтения файла
let filePosition = 0;

/**
 * Читает новые строки из eve.json и вставляет их в PostgreSQL,
 * а после каждого INSERT делает io.emit("new-<type>", newRow).
 */
function ingestNewLines() {
  fs.stat(EVE_PATH, (err, stats) => {
    if (err) return console.error("FS error:", err);

    if (stats.size === filePosition) {
      // нечего читать
      return;
    }
    console.log(`📂 File changed: ${filePosition} → ${stats.size}`);
    
    const stream = fs.createReadStream(EVE_PATH, {
      start:    filePosition,
      end:      stats.size,
      encoding: "utf8",
    });

    let buffer = "";

    stream.on("data", chunk => {
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop(); // неполная последняя строка

      lines.filter(Boolean).forEach(line => {
        let log;
        try {
          log = JSON.parse(line);
        } catch {
          return; // некорректный JSON
        }

        // INSERT alert
        if (log.alert) {
          const { timestamp, alert, src_ip, dest_ip, src_port, dest_port } = log;
          pool.query(
            `INSERT INTO suricata_alerts
               (timestamp, alert_category, alert_severity, alert_message, src_ip, dest_ip, src_port, dest_port)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
             RETURNING *;`,
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
          )
          .then(res => io.emit("new-alert", res.rows[0]))
          .catch(e => console.error("Alert insert error:", e));
        }

        // INSERT http
        if (log.http) {
          const { timestamp, http: h, src_ip, dest_ip } = log;
          pool.query(
            `INSERT INTO suricata_http
               (timestamp, host, uri, method, src_ip, dest_ip)
             VALUES ($1,$2,$3,$4,$5,$6)
             RETURNING *;`,
            [
              new Date(timestamp),
              h.host,
              h.uri,
              h.method,
              src_ip,
              dest_ip,
            ]
          )
          .then(res => io.emit("new-http", res.rows[0]))
          .catch(e => console.error("HTTP insert error:", e));
        }

        // INSERT dns
        if (log.dns) {
          const { timestamp, dns, src_ip, dest_ip } = log;
          pool.query(
            `INSERT INTO suricata_dns
               (timestamp, type, query, src_ip, dest_ip)
             VALUES ($1,$2,$3,$4,$5)
             RETURNING *;`,
            [
              new Date(timestamp),
              dns.type,
              dns.rrname,
              src_ip,
              dest_ip,
            ]
          )
          .then(res => io.emit("new-dns", res.rows[0]))
          .catch(e => console.error("DNS insert error:", e));
        }
        //DDOS NEW 
          // INSERT flow
    if (log.event_type === "flow") {
      const { timestamp, src_ip, dest_ip, src_port, dest_port, proto } = log;

      if (src_ip && dest_ip) {
        pool.query(
          `INSERT INTO suricata_flows (timestamp, src_ip, dest_ip, src_port, dest_port, proto)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;`,
          [
            new Date(timestamp),
            src_ip,
            dest_ip,
            src_port || null,
            dest_port || null,
            proto || null
          ]
        )
        .then(res => io.emit("new-flow", res.rows[0]))
        .catch(e => console.error("Flow insert error:", e));
      }
    }

      });

      // обновляем позицию
      filePosition = stats.size;
    });
  });
}

// Заливаем существующие логи и стартуем слежение
ingestNewLines();
//
//chokidar.watch(EVE_PATH).on("change", ingestNewLines);
chokidar
  .watch(EVE_PATH, {
    usePolling: true,      // опрашивать файл
    interval: 1000,        // раз в 1 секунду
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 100,
    }
  })
  .on("change", ingestNewLines);
// Эндпоинты для первичной загрузки истории
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

app.get("/dns", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM suricata_dns ORDER BY timestamp DESC LIMIT 100"
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching DNS logs");
  }
});
//flows
app.get("/flows", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM suricata_flows ORDER BY timestamp DESC LIMIT 100"
    );
    res.json(rows);
  } catch (e) {
    console.error("Error fetching flow logs:", e);
    res.status(500).send("Error fetching flow logs");
  }
});

//REPUTATION NEW
app.use("/ip-reputation", ipReputationRoutes);
cron.schedule("*/5 * * * *", () => {
  axios.post("http://localhost:4000/ip-reputation/fetch")
    .then(() => console.log("IP reputation updated"))
    .catch(err => console.error("Error updating IP reputation:", err));
});
//DDOS NEW
app.use("/api/ddos-detection", ddosDetectionRoute);
// ANOMALY ANALYSIS
app.use("/api/anomaly-detection", anomalyDetectionRoute);


// // Запускаем HTTP + WebSocket сервер
// server.listen(PORT, () => {
//   console.log(`🚀 Server listening on http://localhost:${PORT}`);
// });
 // Запускаем единый HTTP + WebSocket сервер
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
