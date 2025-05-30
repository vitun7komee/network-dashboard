// backend/db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "suricata_logs",
  password: "123",
  port: 5432,
});

// При подключении создаём таблицы, если их нет
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS suricata_alerts (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMP NOT NULL,
      alert_category VARCHAR(255) NOT NULL,
      alert_severity INTEGER NOT NULL,
      alert_message TEXT,
      src_ip INET,
      dest_ip INET,
      src_port INTEGER,
      dest_port INTEGER
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS suricata_http (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMP NOT NULL,
      host VARCHAR(255),
      uri VARCHAR(255),
      method VARCHAR(10),
      src_ip INET,
      dest_ip INET
    );
  `);

  //new! dns info
// new! suricata_dns table
await pool.query(`
  CREATE TABLE IF NOT EXISTS suricata_dns (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMP,
      type TEXT,
      query TEXT,
      src_ip TEXT,
      dest_ip TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ip_reputation (
      ip INET PRIMARY KEY,
      reputation TEXT,
      score INTEGER,
      country TEXT,
      usage_type TEXT,
      last_checked TIMESTAMP DEFAULT NOW()
    );
  `);
  // DDOS
  await pool.query(`
    CREATE TABLE IF NOT EXISTS suricata_flows(
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMP NOT NULL,
      src_ip INET,
      dest_ip INET,
      src_port INTEGER,
      dest_port INTEGER,
      proto TEXT
    );
  `);
  await pool.query(`
  CREATE TABLE IF NOT EXISTS suricata_alertsF (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  alert_category VARCHAR(255) NOT NULL,
  alert_severity INTEGER NOT NULL,
  alert_message TEXT,
  signature TEXT,
  signature_id INTEGER,
  src_ip INET,
  dest_ip INET,
  src_port INTEGER,
  dest_port INTEGER
);
  `);

//   await pool.query(`
//   CREATE TABLE IF NOT EXISTS heuristic_incidents (
//   id SERIAL PRIMARY KEY,
//   timestamp TIMESTAMP DEFAULT NOW(),
//   type TEXT NOT NULL,
//   description TEXT NOT NULL,
//   severity TEXT CHECK (severity IN ('low', 'medium', 'high')) NOT NULL,
//   resolved BOOLEAN DEFAULT false
// );
//   `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS heuristic_incidents (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMP DEFAULT NOW(),
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT CHECK (severity IN ('low', 'medium', 'high')) NOT NULL,
      resolved BOOLEAN DEFAULT false,
      threat TEXT,
      recommendations TEXT
    );
  `);

  console.log("Tables ensured");
}

// Запускаем и экспортируем клиент
initDb().catch(err => {
  console.error("✅ DB init error:", err);
  process.exit(1);
});

//pool.on("connect", () => {
pool.once("connect", () => {
    console.log("🔗 Connected to PostgreSQL (first connection only)");
  });
  pool.on("error", err => {
    console.error("❌ PostgreSQL error:", err);
  });


module.exports = pool;

