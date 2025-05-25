//require("dotenv").config();
const fetch = require("node-fetch");

//= process.env.ABUSEIPDB_API_KEY || 
const ABUSEIPDB_API_KEY = 
const BASE_URL = "https://api.abuseipdb.com/api/v2/check";

async function getIpReputation(ip) {
//console.log("API KEY abuse:", process.env.ABUSEIPDB_API_KEY); // временно!

  const url = `${BASE_URL}?ipAddress=${ip}&maxAgeInDays=90`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Key: ABUSEIPDB_API_KEY,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`AbuseIPDB error: ${response.statusText}`);
  }

  const { data } = await response.json();

  const score = data.abuseConfidenceScore;

  let reputation = "safe";
  if (score >= 85) reputation = "malicious";
  else if (score >= 40) reputation = "suspicious";

  return {
    ip,
    score,
    reputation,
    country: data.countryCode,
    usageType: data.usageType,
  };
}

module.exports = { getIpReputation };
