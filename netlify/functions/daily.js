const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'isaac-dashboard/1.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve(null); } });
    }).on('error', reject);
  });
}

exports.handler = async () => {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Panama' }));
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const results = {};

  // Quiz — Open Trivia DB
  try {
    const d = await get('https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple');
    if (d?.results?.[0]) {
      const q = d.results[0];
      const opts = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
      results.quiz = {
        question: dec(q.question),
        options: opts.map(o => dec(o)),
        answer: opts.indexOf(q.correct_answer),
        explanation: `Respuesta: ${dec(q.correct_answer)}`
      };
    }
  } catch(e) {}

  // Word — Free Dictionary API
  try {
    const words = ['resilient','leverage','compound','diversify','volatile','portfolio','dividend','momentum','equity','liquidity'];
    const doy = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const word = words[doy % words.length];
    const d = await get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (d?.[0]) {
      const m = d[0].meanings?.[0], def = m?.definitions?.[0];
      results.word = { word: d[0].word, phonetic: d[0].phonetics?.find(p=>p.text)?.text||'', partOfSpeech: m?.partOfSpeech||'', definition: def?.definition||'', example: def?.example||'' };
    }
  } catch(e) {}

  // History — Wikipedia On This Day
  try {
    const d = await get(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`);
    if (d?.events?.length) {
      const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      results.history = { date: `${day} de ${meses[month-1]}`, events: d.events.filter(e=>e.year>1900).slice(0,3).map(e=>({year:e.year,text:e.text})) };
    }
  } catch(e) {}

  // Fact — Useless Facts
  try {
    const d = await get('https://uselessfacts.jsph.pl/api/v1/facts/random?language=en');
    if (d?.text) results.fact = d.text;
  } catch(e) {}

  // Quote — Quotable API
  try {
    const d = await get('https://api.quotable.io/random?tags=success|business|life');
    if (d?.content) results.quote = { text: d.content, author: d.author };
  } catch(e) {}

  // Horoscope — Aztro
  try {
    const r = await new Promise((resolve,reject) => {
      const req = https.request({ hostname:'aztro.sameerkumar.website', path:'/?sign=taurus&day=today', method:'POST', headers:{'Content-Length':0} }, res => {
        let data=''; res.on('data',c=>data+=c); res.on('end',()=>{ try{resolve(JSON.parse(data));}catch{resolve(null);} });
      }); req.on('error',reject); req.end();
    });
    if (r?.description) results.horoscope = r;
  } catch(e) {}

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin':'*', 'Content-Type':'application/json', 'Cache-Control':'public,max-age=3600' },
    body: JSON.stringify(results)
  };
};

function dec(s){ return (s||'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#039;/g,"'"); }
