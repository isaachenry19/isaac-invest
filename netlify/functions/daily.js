const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'isaac-dashboard/1.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve(null); } });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// Local fallbacks — always work, rotate daily
const QUOTES = [
  { text: 'La inversión más importante que puedes hacer es en ti mismo.', author: 'Warren Buffett' },
  { text: 'El mercado transfiere dinero del impaciente al paciente.', author: 'Warren Buffett' },
  { text: 'No importa lo lento que vayas, siempre que no te detengas.', author: 'Confucio' },
  { text: 'El éxito no es definitivo, el fracaso no es fatal. Lo que cuenta es el coraje de continuar.', author: 'Winston Churchill' },
  { text: 'Quien controla sus finanzas, controla su libertad.', author: 'Anónimo' },
  { text: 'Comienza donde estás. Usa lo que tienes. Haz lo que puedas.', author: 'Arthur Ashe' },
  { text: 'La única manera de hacer un gran trabajo es amar lo que haces.', author: 'Steve Jobs' },
  { text: 'No ahorres lo que te queda después de gastar, gasta lo que queda después de ahorrar.', author: 'Warren Buffett' },
  { text: 'El riesgo viene de no saber lo que estás haciendo.', author: 'Warren Buffett' },
  { text: 'Una inversión en conocimiento paga el mejor interés.', author: 'Benjamin Franklin' },
  { text: 'No pongas todos los huevos en la misma canasta.', author: 'Miguel de Cervantes' },
  { text: 'El tiempo en el mercado supera al timing del mercado.', author: 'Ken Fisher' },
  { text: 'Las oportunidades son como los amaneceres: si esperas demasiado, te los pierdes.', author: 'William Arthur Ward' },
  { text: 'La disciplina es el puente entre tus metas y tus logros.', author: 'Jim Rohn' },
];

const HOROS = [
  { description: 'Venus favorece tus decisiones financieras hoy. Buen momento para revisar tu portafolio y confiar en tu intuición.', color: 'Verde', lucky_number: '7', mood: 'Optimista', compatibility: 'Virgo' },
  { description: 'La estabilidad es tu fortaleza hoy. Considera nuevas oportunidades con calma y sin apresurarte.', color: 'Azul', lucky_number: '4', mood: 'Reflexivo', compatibility: 'Capricornio' },
  { description: 'Tu energía financiera está alta. Los proyectos de largo plazo recibirán un impulso positivo hoy.', color: 'Dorado', lucky_number: '9', mood: 'Enérgico', compatibility: 'Cáncer' },
  { description: 'Día ideal para planificar el futuro. Las inversiones pacientes darán frutos. Confía en el proceso.', color: 'Blanco', lucky_number: '3', mood: 'Sereno', compatibility: 'Piscis' },
  { description: 'Mercurio impulsa tu mente analítica. Excelente día para revisar números y tomar decisiones inteligentes.', color: 'Terracota', lucky_number: '6', mood: 'Analítico', compatibility: 'Escorpio' },
  { description: 'La constancia es tu mayor virtud hoy. Mantén tus inversiones estables y verás resultados pronto.', color: 'Verde esmeralda', lucky_number: '2', mood: 'Perseverante', compatibility: 'Acuario' },
  { description: 'Buen día para aprender sobre finanzas. Tu intuición está afilada para detectar buenas oportunidades.', color: 'Morado', lucky_number: '8', mood: 'Curioso', compatibility: 'Libra' },
  { description: 'Júpiter trae abundancia a tu zona financiera. Considera aumentar tu aporte mensual de inversión.', color: 'Naranja', lucky_number: '1', mood: 'Abundante', compatibility: 'Sagitario' },
  { description: 'Día de reflexión profunda. Antes de actuar, analiza bien tus opciones financieras actuales.', color: 'Gris perla', lucky_number: '5', mood: 'Cauteloso', compatibility: 'Géminis' },
  { description: 'Saturno fortalece tu disciplina. Es el mejor momento para establecer hábitos financieros sólidos.', color: 'Negro', lucky_number: '10', mood: 'Disciplinado', compatibility: 'Tauro' },
  { description: 'La Luna nueva trae renovación financiera. Considera revisar y actualizar tus metas de inversión.', color: 'Plateado', lucky_number: '11', mood: 'Renovado', compatibility: 'Aries' },
  { description: 'Marte energiza tu ambición. Hoy tienes la fuerza para dar un paso más hacia tus metas financieras.', color: 'Rojo', lucky_number: '12', mood: 'Ambicioso', compatibility: 'Leo' },
  { description: 'La paciencia es tu mayor aliado hoy. Las mejores inversiones requieren tiempo para florecer.', color: 'Azul marino', lucky_number: '13', mood: 'Paciente', compatibility: 'Virgo' },
  { description: 'Urano trae innovación a tus finanzas. Explora nuevas opciones de inversión con mente abierta.', color: 'Turquesa', lucky_number: '14', mood: 'Innovador', compatibility: 'Acuario' },
];

const FACTS = [
  'Los pulpos tienen 3 corazones, 9 cerebros y sangre azul.',
  'La Torre Eiffel crece 15 cm en verano por dilatación térmica del metal.',
  'El cerebro humano tiene más conexiones sinápticas que estrellas hay en la Vía Láctea.',
  'Una abeja debe visitar aproximadamente 2 millones de flores para producir 450 gramos de miel.',
  'El Sol representa el 99.86% de toda la masa del sistema solar.',
  'Los bananos son levemente radiactivos por su contenido de potasio-40.',
  'Un rayo golpea la Tierra unas 100 veces por segundo — 8.6 millones de veces al día.',
  'Los cocodrilos pueden vivir más de 100 años y han existido sin cambios desde la era de los dinosaurios.',
  'La miel nunca se echa a perder — se encontró miel de 3,000 años en las pirámides de Egipto, aún comestible.',
  'El ojo humano puede distinguir aproximadamente 10 millones de colores diferentes.',
  'El ADN de los humanos y los plátanos es idéntico en un 60%.',
  'Los tiburones existían antes que los árboles — hace 450 millones de años vs 350 millones.',
  'En Panamá nace el 3% de todas las especies del mundo en solo el 0.08% del territorio terrestre.',
  'El Canal de Panamá funciona sin bombas — usa solo gravedad y la diferencia de mareas.',
  'Un caracol puede dormir durante 3 años consecutivos.',
  'Los delfines tienen nombres propios — se llaman unos a otros con silbidos únicos.',
  'La velocidad de la luz tarda 8 minutos y 20 segundos en llegar del Sol a la Tierra.',
  'El corazón humano late más de 100,000 veces al día — 37 millones de veces al año.',
  'Los pulpos pueden cambiar de color en menos de un milisegundo.',
  'Hay más microbios en una cucharadita de tierra que personas en todo el planeta.',
  'La Gran Muralla China no es visible desde el espacio a simple vista — es un mito.',
];

exports.handler = async () => {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Panama' }));
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const doy = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const results = {};

  // 1. Quiz — Open Trivia DB (real API)
  try {
    const d = await get('https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple');
    if (d?.results?.[0]) {
      const q = d.results[0];
      const opts = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
      results.quiz = {
        question: dec(q.question),
        options: opts.map(o => dec(o)),
        answer: opts.indexOf(q.correct_answer),
        explanation: 'Respuesta correcta: ' + dec(q.correct_answer)
      };
    }
  } catch(e) {}

  // 2. Word — Free Dictionary API (real API)
  try {
    const words = ['resilient','leverage','compound','diversify','volatile','portfolio','dividend','momentum','equity','liquidity','inflation','recession','bullish','bearish','assets'];
    const word = words[doy % words.length];
    const d = await get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (d?.[0]) {
      const m = d[0].meanings?.[0], def = m?.definitions?.[0];
      results.word = {
        word: d[0].word,
        phonetic: d[0].phonetics?.find(p => p.text)?.text || '',
        partOfSpeech: m?.partOfSpeech || '',
        definition: def?.definition || '',
        example: def?.example || ''
      };
    }
  } catch(e) {}

  // 3. History — Wikipedia On This Day (real API)
  try {
    const d = await get(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`);
    if (d?.events?.length) {
      const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      results.history = {
        date: `${day} de ${meses[month-1]}`,
        events: d.events.filter(e => e.year > 1900).slice(0, 3).map(e => ({ year: e.year, text: e.text }))
      };
    }
  } catch(e) {}

  // 4. Fact — try Useless Facts API, fallback to local list
  try {
    const d = await get('https://uselessfacts.jsph.pl/api/v1/facts/random?language=en');
    if (d?.text) {
      results.fact = d.text;
    }
  } catch(e) {}
  // Always have a fact — fallback if API failed
  if (!results.fact) {
    results.fact = FACTS[doy % FACTS.length];
  }

  // 5. Quote — try Quotable API, fallback to local list
  try {
    const d = await get('https://api.quotable.io/random?tags=success|business|life|inspirational');
    if (d?.content) {
      results.quote = { text: d.content, author: d.author };
    }
  } catch(e) {}
  // Always have a quote — fallback if API failed
  if (!results.quote) {
    results.quote = QUOTES[doy % QUOTES.length];
  }

  // 6. Horoscope — try Aztro API, fallback to local list
  try {
    const r = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'aztro.sameerkumar.website',
        path: '/?sign=taurus&day=today',
        method: 'POST',
        headers: { 'Content-Length': 0 }
      }, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve(null); } });
      });
      req.on('error', reject);
      req.setTimeout(5000, () => { req.destroy(); reject(new Error('timeout')); });
      req.end();
    });
    if (r?.description) results.horoscope = r;
  } catch(e) {}
  // Always have a horoscope — fallback if API failed
  if (!results.horoscope) {
    results.horoscope = HOROS[doy % HOROS.length];
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=1800'
    },
    body: JSON.stringify(results)
  };
};

function dec(s) {
  return (s || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'");
}
