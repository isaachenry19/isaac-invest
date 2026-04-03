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

function getSentiment(title) {
  const bull = ['rises','gains','surges','jumps','rally','record','growth','beats','strong','bullish','up','higher','positive'];
  const bear = ['falls','drops','plunges','crash','recession','fear','warning','weak','bearish','down','lower','tariff','inflation'];
  const t = title.toLowerCase();
  if (bull.some(w => t.includes(w))) return 'bull';
  if (bear.some(w => t.includes(w))) return 'bear';
  return 'neutral';
}

exports.handler = async () => {
  const key = process.env.NEWS_KEY;
  const url = `https://newsapi.org/v2/everything?q=ETF+stock+market+investment+S%26P500&language=en&sortBy=publishedAt&pageSize=10&apiKey=${key}`;

  try {
    const data = await fetchJSON(url);
    const articles = (data.articles || []).map(a => ({
      title: a.title,
      source: a.source,
      publishedAt: a.publishedAt,
      url: a.url,
      sentiment: getSentiment(a.title)
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles })
    };
  } catch(e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
