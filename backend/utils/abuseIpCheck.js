// //require("dotenv").config();
// const fetch = require("node-fetch");

// //= process.env.ABUSEIPDB_API_KEY || 
// const ABUSEIPDB_API_KEY = "036db2dea9e98a3da0d2504eec7553d01e98fedfb312f6e7c59eee61c999646e845872186ce6bbd5";
// const BASE_URL = "https://api.abuseipdb.com/api/v2/check";

// async function getIpReputation(ip) {
// //console.log("API KEY abuse:", process.env.ABUSEIPDB_API_KEY); // временно!

//   const url = `${BASE_URL}?ipAddress=${ip}&maxAgeInDays=90`;

//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       Key: ABUSEIPDB_API_KEY,
//       Accept: "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`AbuseIPDB error: ${response.statusText}`);
//   }

//   const { data } = await response.json();

//   const score = data.abuseConfidenceScore;

//   let reputation = "safe";
//   if (score >= 85) reputation = "malicious";
//   else if (score >= 40) reputation = "suspicious";

//   return {
//     ip,
//     score,
//     reputation,
//     country: data.countryCode,
//     usageType: data.usageType,
//   };
// }

// module.exports = { getIpReputation };

//require("dotenv").config();
const fetch = require("node-fetch");
const geoip = require("geoip-lite");
//= process.env.ABUSEIPDB_API_KEY || 
const ABUSEIPDB_API_KEY = "036db2dea9e98a3da0d2504eec7553d01e98fedfb312f6e7c59eee61c999646e845872186ce6bbd5";
const BASE_URL = "https://api.abuseipdb.com/api/v2/check";

async function getIpReputation(ip) {
  let score = 0;
  let reputation = "unknown";
  let country = null;
  let usageType = null;

  try {
    const url = `${BASE_URL}?ipAddress=${ip}&maxAgeInDays=90`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Key: ABUSEIPDB_API_KEY,
        Accept: "application/json",
      },
    });

    if (!response.ok) throw new Error(`AbuseIPDB error: ${response.statusText}`);

    const { data } = await response.json();

    score = data.abuseConfidenceScore;
    if (score >= 85) reputation = "malicious";
    else if (score >= 40) reputation = "suspicious";
    else reputation = "safe";

    country = data.countryCode;
    usageType = data.usageType;
  } catch (err) {
    console.warn(`⚠️ API fallback for IP ${ip}: ${err.message}`);
  }

  // Если нет страны — берём из geoip-lite
  if (!country) {
    const geo = geoip.lookup(ip);
    if (geo && geo.country) {
      country = geo.country;
    }
  }

  return {
    ip,
    score,
    reputation,
    country,
    usageType,
  };
}

module.exports = { getIpReputation };