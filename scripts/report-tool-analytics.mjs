const { CLOUDFLARE_ACCOUNT_ID: accountId, CLOUDFLARE_API_TOKEN: token } = process.env;
if (!accountId || !/^[a-f0-9]{32}$/i.test(accountId) || !token) {
  throw new Error('Set CLOUDFLARE_ACCOUNT_ID and a CLOUDFLARE_API_TOKEN with Account Analytics Read permission.');
}

// Use the sampling weight, not COUNT(*), when reading Analytics Engine.
const query = `SELECT blob2 AS tool, blob1 AS event, blob3 AS format, blob4 AS error,
  SUM(_sample_interval) AS events,
  SUM(_sample_interval * double1) AS images,
  SUM(_sample_interval * double2) / SUM(_sample_interval) AS avg_duration_ms
FROM picthin_tool_events
WHERE timestamp >= NOW() - INTERVAL '7' DAY
GROUP BY tool, event, format, error
ORDER BY tool, event FORMAT JSON`;
const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`, {
  method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: query,
});
if (!response.ok) throw new Error(`Analytics query failed (${response.status}); check permission and dataset binding.`);
const result = await response.json();
console.table(result.data);
