const https = require('https');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

exports.handler = async () => {
  const key = process.env.FINNHUB_KEY;
  const symbols = ['VOO', 'QQQ', 'SCHD', 'VYM', 'GLD'];

  try {
    const results = await Promise.all(symbols.map(async sym => {
      const quote = await fetchJSON(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${key}`);
      return {
        symbol: sym,
        price: quote.c || 0,
        change: quote.dp || 0,
        open: quote.o || 0,
        high: quote.h || 0,
        low: quote.l || 0,
        prev: quote.pc || 0
      };
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ etfs: results, timestamp: new Date().toISOString() })
    };
  } catch(e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
