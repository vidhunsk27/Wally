// =============================================================================
// Wally MK 2 / C.A.S.P.E.R. backend
// - serves the app itself (the folder above this one)
// - stores the ledger, wishlist/library, workspace and all other app data
// - receives bank SMS from your phone and holds them until the app collects them
// - reads product / title pages for the link scraper
// Storage: Firestore when FIREBASE_SERVICE_ACCOUNT is set, otherwise a JSON file.
// =============================================================================
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const KEY = process.env.WALLY_KEY || '';
const DATA_FILE = process.env.WALLY_DATA_FILE || path.join(__dirname, 'data.json');

// ----------------------------------------------------------------------------- storage
function fileStore() {
  let db = { transactions: {}, wishlist: {}, state: {}, meta: {}, inbox: {}, deleted: {} };
  try { db = Object.assign(db, JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))); } catch (e) {}
  let timer = null;
  const save = () => { clearTimeout(timer); timer = setTimeout(() => { const tmp = DATA_FILE + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(db)); fs.renameSync(tmp, DATA_FILE); }, 150); };
  return {
    kind: 'file',
    async entries(col) { return Object.entries(db[col] || {}); },
    async all(col) { return Object.values(db[col] || {}); },
    async get(col, id) { return (db[col] || {})[id] || null; },
    async set(col, id, val) { (db[col] = db[col] || {})[id] = val; save(); },
    async del(col, id) { if (db[col]) delete db[col][id]; save(); }
  };
}
function firestoreStore() {
  const admin = require('firebase-admin'), { getFirestore } = require('firebase-admin/firestore');
  const app = admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  // Firebase names the database either "(default)" or "default" depending on when the project was made.
  // Try both (or the one named in FIRESTORE_DATABASE_ID) and keep whichever answers.
  const ids = process.env.FIRESTORE_DATABASE_ID ? [process.env.FIRESTORE_DATABASE_ID] : ['(default)', 'default'];
  let fsdb = null, opening = null;
  const open = async () => { let last; for (const id of ids) { try { const d = id === '(default)' ? getFirestore(app) : getFirestore(app, id); await d.collection('wally_meta').limit(1).get(); console.log('Firestore database in use: ' + id); return d; } catch (e) { last = e; console.error('Firestore database "' + id + '" not usable: ' + e.message); } } throw last; };
  const db = async () => { if (fsdb) return fsdb; if (!opening) opening = open().then(d => (fsdb = d)).finally(() => { opening = null; }); return opening; };
  const c = async col => (await db()).collection('wally_' + col), safe = id => encodeURIComponent(String(id)).slice(0, 1400);
  db().catch(() => {});
  return {
    kind: 'firestore',
    async entries(col) { const s = await (await c(col)).get(); return s.docs.map(d => { let id = d.id; try { id = decodeURIComponent(d.id); } catch (e) {} return [id, d.data().v]; }); },
    async all(col) { const s = await (await c(col)).get(); return s.docs.map(d => d.data().v); },
    async get(col, id) { const d = await (await c(col)).doc(safe(id)).get(); return d.exists ? d.data().v : null; },
    async set(col, id, val) { await (await c(col)).doc(safe(id)).set({ v: val }); },
    async del(col, id) { await (await c(col)).doc(safe(id)).delete(); }
  };
}
let store;
try { store = process.env.FIREBASE_SERVICE_ACCOUNT ? firestoreStore() : fileStore(); }
catch (e) { console.error('Firestore could not start, falling back to the local file:', e.message); store = fileStore(); }

// ----------------------------------------------------------------------------- memory copy + live updates
// The server keeps each list in memory after the first read and writes every change through to the
// database. Reads then cost nothing, so devices can check for changes every few seconds without using
// up the free database quota. "rev" goes up by one on every change; devices compare it to know when to sync.
const BOOT = Date.now().toString(36); let rev = 0; const listeners = new Set(); let bt = null;
const announce = () => { rev++; clearTimeout(bt); bt = setTimeout(() => { for (const r of listeners) { try { r.write('data: ' + BOOT + ':' + rev + '\n\n'); } catch (e) { listeners.delete(r); } } }, 120); };
function withMemory(inner) {
  const mem = {};
  const load = col => mem[col] || (mem[col] = inner.entries(col).then(list => new Map(list)).catch(e => { delete mem[col]; throw e; }));
  return {
    kind: inner.kind,
    async all(col) { return [...(await load(col)).values()]; },
    async get(col, id) { const v = (await load(col)).get(String(id)); return v === undefined ? null : v; },
    async set(col, id, val) { const m = await load(col); if (m.has(String(id)) && JSON.stringify(m.get(String(id))) === JSON.stringify(val)) return;   // nothing new: no write, no wake-up for other devices
      try { await inner.set(col, id, val); } catch (e) { delete mem[col]; throw e; } m.set(String(id), val); if (process.env.WALLY_DEBUG) console.log('SET', col, String(id).slice(0, 40)); announce(); },
    async del(col, id) { const m = await load(col); if (!m.has(String(id))) return; try { await inner.del(col, id); } catch (e) { delete mem[col]; throw e; } m.delete(String(id)); announce(); }
  };
}
store = withMemory(store);

// ----------------------------------------------------------------------------- app
const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' }));
const wrap = fn => (req, res) => fn(req, res).catch(e => { console.error(e); res.status(500).json({ error: 'server error' }); });

app.get('/api/health', (req, res) => res.json({ ok: true, store: store.kind, locked: !!KEY, time: Date.now() }));
app.use('/api', (req, res, next) => {
  if (!KEY) return next();
  if ((req.get('x-wally-key') || req.query.key) === KEY) return next();
  res.status(401).json({ error: 'key required' });
});

// live updates: /api/rev is a cheap "has anything changed" check, /api/events pushes the same number the moment it changes
app.get('/api/rev', (req, res) => res.json({ boot: BOOT, rev, clients: listeners.size }));
app.get('/api/events', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
  res.write('retry: 4000\n\ndata: ' + BOOT + ':' + rev + '\n\n'); listeners.add(res);
  const beat = setInterval(() => { try { res.write(': ping\n\n'); } catch (e) {} }, 25000);
  req.on('close', () => { clearInterval(beat); listeners.delete(res); });
});

// ledger
app.get('/api/get-transactions', wrap(async (req, res) => res.json(await store.all('transactions'))));
// a deleted item is remembered, so another device that still holds it cannot quietly put it back
const isGone = async (kind, id) => !!(await store.get('deleted', kind + ':' + id));
app.post('/api/add-transaction', wrap(async (req, res) => { const t = req.body || {}; if (t.id == null) return res.status(400).json({ error: 'id missing' }); if (await isGone('tx', String(t.id))) return res.json({ success: true, skipped: 'deleted' }); await store.set('transactions', String(t.id), t); res.json({ success: true }); }));
app.delete('/api/delete-transaction/:id', wrap(async (req, res) => { await store.del('transactions', req.params.id); if (!(await isGone('tx', req.params.id))) await store.set('deleted', 'tx:' + req.params.id, { kind: 'tx', id: req.params.id, at: Date.now() }); res.json({ success: true }); }));
app.get('/api/deleted', wrap(async (req, res) => { const all = await store.all('deleted'); res.json({ tx: all.filter(d => d.kind === 'tx').map(d => d.id), wish: all.filter(d => d.kind === 'wish').map(d => d.id) }); }));
app.post('/api/undelete', wrap(async (req, res) => { for (const id of (req.body.tx || [])) await store.del('deleted', 'tx:' + id); for (const id of (req.body.wish || [])) await store.del('deleted', 'wish:' + id); res.json({ success: true }); }));

// wishlist + library share one list (library items carry isMedia: true)
app.get('/api/get-wishlist', wrap(async (req, res) => res.json(await store.all('wishlist'))));
app.post('/api/add-wishlist', wrap(async (req, res) => { const w = req.body || {}; if (w.id == null) return res.status(400).json({ error: 'id missing' }); if (await isGone('wish', String(w.id))) return res.json({ success: true, skipped: 'deleted' }); await store.set('wishlist', String(w.id), w); res.json({ success: true }); }));
app.delete('/api/delete-wishlist/:id', wrap(async (req, res) => { await store.del('wishlist', req.params.id); if (!(await isGone('wish', req.params.id))) await store.set('deleted', 'wish:' + req.params.id, { kind: 'wish', id: req.params.id, at: Date.now() }); res.json({ success: true }); }));

// workspace
app.get('/api/get-workspace', wrap(async (req, res) => res.json((await store.get('meta', 'workspace')) || {})));
app.post('/api/save-workspace', wrap(async (req, res) => { await store.set('meta', 'workspace', { notes: req.body.notes || '', whiteboard: req.body.whiteboard || '', t: Date.now() }); res.json({ success: true }); }));

// everything else the app keeps (habits, planner, growth, fitness...) as key -> { v, t }
app.get('/api/state', wrap(async (req, res) => { const out = {}; (await store.all('state')).forEach(e => { out[e.k] = { v: e.v, t: e.t }; }); res.json(out); }));
app.put('/api/state', wrap(async (req, res) => {
  const body = req.body || {}; let n = 0;
  for (const k of Object.keys(body)) { const cur = await store.get('state', k), inc = body[k]; if (!inc || typeof inc.v !== 'string') continue; if (!cur || (inc.t || 0) >= (cur.t || 0)) { await store.set('state', k, { k, v: inc.v, t: inc.t || Date.now() }); n++; } }
  res.json({ success: true, written: n });
}));

// bank SMS drop-box: the phone posts here, the app collects and files them
const smsIn = wrap(async (req, res) => { const text = String((req.body && (req.body.text || req.body.sms || req.body.message)) || req.query.text || '').slice(0, 2000); if (text.trim().length < 12) return res.status(400).json({ error: 'text missing' }); const id = Date.now() + '_' + Math.random().toString(36).slice(2, 8); await store.set('inbox', id, { id, text, at: Date.now() }); res.json({ success: true, id }); });
app.post('/api/sms', smsIn); app.get('/api/sms', smsIn);
app.get('/api/sms-inbox', wrap(async (req, res) => res.json((await store.all('inbox')).sort((a, b) => a.at - b.at))));
app.post('/api/sms-ack', wrap(async (req, res) => { for (const id of (req.body.ids || [])) await store.del('inbox', String(id)); res.json({ success: true }); }));

// approval queue kept for compatibility with the original app
app.get('/api/pending', (req, res) => res.json([]));
app.post('/api/approve', (req, res) => res.json({ success: false }));
app.post('/api/reject', (req, res) => res.json({ success: true }));

// link scraper
const num = s => { const v = parseFloat(String(s || '').replace(/[^\d.]/g, '')); return v > 0 && v < 1e8 ? v : 0; };
const meta = (html, name) => { const m = html.match(new RegExp('<meta[^>]+(?:property|name|itemprop)=["\']' + name + '["\'][^>]*content=["\']([^"\']*)["\']', 'i')) || html.match(new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name|itemprop)=["\']' + name + '["\']', 'i')); return m ? m[1].trim() : ''; };
const decode = s => String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
async function readPage(url) {
  if (!/^https?:\/\//i.test(url)) throw new Error('bad url');
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 12000);
  try {
    const r = await fetch(url, { signal: ctl.signal, redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36', 'Accept-Language': 'en-IN,en;q=0.9', 'Accept': 'text/html,application/xhtml+xml' } });
    const html = (await r.text()).slice(0, 3000000);
    const o = { title: '', price: 0, imageUrl: '', details: '', mediaType: '', genre: '' };
    let ld = null;
    for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) { try { const j = JSON.parse(m[1]); (Array.isArray(j) ? j : [j].concat(j['@graph'] || [])).forEach(x => { if (x && /Product|Movie|Book|TVSeries/.test([].concat(x['@type'] || '').join()) && (!ld || x.offers)) ld = x; }); } catch (e) {} }
    if (ld) { const of = Array.isArray(ld.offers) ? ld.offers[0] : (ld.offers || {}); o.price = num(of.price || of.lowPrice); let im = ld.image; if (Array.isArray(im)) im = im[0]; if (im && im.url) im = im.url; o.imageUrl = im || ''; o.title = ld.name || ''; const pn = x => { x = Array.isArray(x) ? x[0] : x; return x ? (x.name || x) : ''; }; o.details = [String(pn(ld.author) || pn(ld.director) || ''), ld.description || ''].filter(Boolean).join(' — ').slice(0, 300); const ty = [].concat(ld['@type'] || '').join(); o.mediaType = /TVSeries/.test(ty) ? 'Series' : /Book/.test(ty) ? 'Book' : /Movie/.test(ty) ? 'Movie' : ''; o.genre = [].concat(ld.genre || '')[0] || ''; }
    o.title = decode(o.title || meta(html, 'og:title') || (html.match(/id=["']productTitle["'][^>]*>([^<]+)</i) || [])[1] || (html.match(/<title[^>]*>([^<]+)</i) || [])[1] || '');
    o.imageUrl = decode(o.imageUrl || meta(html, 'og:image') || (html.match(/data-old-hires=["']([^"']+)["']/i) || [])[1] || '');
    o.details = decode(o.details || meta(html, 'og:description') || meta(html, 'description')).slice(0, 300);
    if (!o.price) o.price = num(meta(html, 'product:price:amount') || meta(html, 'og:price:amount') || meta(html, 'price'));
    if (!o.price) o.price = num((html.match(/class=["'][^"']*a-offscreen[^"']*["'][^>]*>\s*(?:₹|&#8377;|Rs\.?)?\s*([\d,]+(?:\.\d{1,2})?)/i) || [])[1]);
    if (!o.price) o.price = num((html.match(/class=["'][^"']*(?:Nx9bqj|_30jeq3|a-price-whole|pdp-price|selling-price|final-price)[^"']*["'][^>]*>\s*(?:<[^>]+>\s*)*(?:₹|&#8377;|Rs\.?)?\s*([\d,]+(?:\.\d{1,2})?)/i) || [])[1]);
    if (!o.price) o.price = num((html.match(/"(?:selling_?price|final_?price|sale_?price|price)"\s*:\s*"?(\d[\d,.]*)"?/i) || [])[1]);
    if (!o.price) o.price = num((html.match(/(?:₹|&#8377;|Rs\.?)\s?([\d,]{3,}(?:\.\d{1,2})?)/) || [])[1]);
    o.title = o.title.replace(/\s*[-|–:]\s*(Amazon\.in|Amazon\.com|Flipkart\.com|IMDb|Goodreads|Myntra|MyAnimeList\.net).*$/i, '').replace(/^Buy\s+/i, '').replace(/\s+Online at.*$/i, '').replace(/\s+/g, ' ').trim().slice(0, 140);
    return o;
  } finally { clearTimeout(t); }
}
// ---------------------------------------------------------------------------
// bookmark capture: save from any site without opening the dashboard
//   /api/bookmark-auto, /api/bookmark-media-auto : data already read on the page -> save, close tab
//   /api/bookmark, /api/bookmark-media           : small form to finish by hand
// ---------------------------------------------------------------------------
const hEsc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
const storeOf = u => { const h = hostOf(u); const m = h.match(/(amazon|flipkart|myntra|ajio|croma|meesho|nykaa|tatacliq|snapdeal|reliancedigital|ebay|etsy|ikea|decathlon)/i); return (m ? m[1] : (h.split('.').slice(-2, -1)[0] || 'CAPTURED')).toUpperCase(); };
const mediaTypeOf = (u, ty) => { const x = (u + ' ' + (ty || '')).toLowerCase(); if (/goodreads|book|kindle|audible|storygraph/.test(x)) return 'Book'; if (/crunchyroll|myanimelist|anilist|anime|funimation|hidive/.test(x)) return 'Anime'; if (/tvseries|\/tv\/|series|season|episode|show/.test(x)) return 'Series'; return 'Movie'; };
const GENRES = ['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'];
const cleanTitle = t => String(t || '').replace(/\s*[-|–:]\s*(Amazon\.in|Amazon\.com|Flipkart\.com|IMDb|Goodreads|Myntra|MyAnimeList\.net).*$/i, '').replace(/^Buy\s+/i, '').replace(/\s+Online at.*$/i, '').replace(/\s+/g, ' ').trim().slice(0, 140);
async function saveBookmark(q, media) {
  const url = String(q.url || ''), title = cleanTitle(q.title); if (!title) throw new Error('title missing');
  const dup = (await store.all('wishlist')).find(w => w && w.link && url && w.link === url && !!w.isMedia === media && !w.purchased); if (dup) return { item: dup, dup: true };
  const id = String(Date.now()) + Math.floor(Math.random() * 90 + 10), base = { id, title, price: num(q.price), link: url, imageUrl: /^https?:\/\//i.test(q.image || '') ? String(q.image) : '', timestamp: Date.now() };
  const item = media
    ? Object.assign(base, { category: 'MEDIA NODE', wishCategory: ['Movie', 'Book', 'Series', 'Anime'].includes(q.mtype) ? q.mtype : mediaTypeOf(url, q.type), mediaGenre: GENRES.find(g => String(q.genre || '').toLowerCase().includes(g.toLowerCase())) || 'Drama', mediaStatus: 'Planned', mediaRating: 'Unrated', mediaDetails: [q.by, q.details].filter(Boolean).join(' — ').slice(0, 300), isMedia: true })
    : Object.assign(base, { category: String(q.store || storeOf(url)).toUpperCase().slice(0, 24), wishCategory: String(q.category || 'Lifestyle').slice(0, 30), priority: 2 });
  await store.set('wishlist', id, item); return { item, dup: false };
}
const PAGE = (title, body) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${hEsc(title)}</title><style>body{margin:0;background:#04070d;color:#e2e8f0;font:14px/1.5 system-ui,Segoe UI,sans-serif;display:grid;place-items:center;min-height:100vh}main{width:min(380px,92vw);border:1px solid rgba(0,229,255,.45);border-radius:16px;padding:20px;background:#07101c;box-shadow:0 0 30px rgba(0,229,255,.15)}h1{font-size:15px;letter-spacing:.14em;text-transform:uppercase;color:#00e5ff;margin:0 0 4px}p{color:#94a3b8;font-size:12.5px;margin:0 0 14px}label{display:block;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:#94a3b8;margin:10px 0 4px}input,select{width:100%;box-sizing:border-box;background:#030810;border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:10px;color:#fff;font-size:14px}button{margin-top:16px;width:100%;padding:12px;border:0;border-radius:10px;background:#00e5ff;color:#000;font-weight:800;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}img{max-width:100%;max-height:120px;border-radius:10px;display:block;margin:0 auto 10px}.ok{color:#34d399;font-weight:700}</style></head><body><main>${body}</main></body></html>`;
const savedPage = (r, media) => PAGE('Saved', `<h1>${r.dup ? 'Already saved' : 'Saved'}</h1><p class="ok">${hEsc(r.item.title)}${!media && r.item.price ? ' • ₹' + r.item.price : ''}</p><p>It is in your ${media ? 'Library' : 'Wishlist'}. This window closes by itself.</p><script>setTimeout(function(){window.close()},${r.dup ? 1400 : 500});</script>`);
const formPage = (q, media, pre) => {
  const v = k => hEsc(q[k] || pre[k] || ''), img = q.image || pre.image || '';
  return PAGE('Save to Wally MK 2', `<h1>Save to ${media ? 'Library' : 'Wishlist'}</h1><p>${hEsc(hostOf(q.url || '') || 'No link')} — fill in what the page did not give.</p>${/^https?:/i.test(img) ? `<img src="${hEsc(img)}" alt="">` : ''}
<form method="get" action="${media ? 'bookmark-media-auto' : 'bookmark-auto'}"><input type="hidden" name="url" value="${v('url')}"><input type="hidden" name="key" value="${v('key')}"><input type="hidden" name="details" value="${v('details')}"><input type="hidden" name="by" value="${v('by')}"><input type="hidden" name="genre" value="${v('genre')}"><input type="hidden" name="type" value="${v('type')}">
<label>${media ? 'Title' : 'Name'}</label><input name="title" required value="${v('title')}">
${media ? `<label>Type</label><select name="mtype">${['Movie', 'Series', 'Anime', 'Book'].map(t => `<option ${t === mediaTypeOf(q.url || '', q.type) ? 'selected' : ''}>${t}</option>`).join('')}</select>` : `<label>Price (₹)</label><input name="price" type="number" min="0" step="any" required value="${hEsc(num(q.price) || num(pre.price) || '')}" autofocus><label>Category</label><select name="category">${['Gadgets', 'Fashion', 'Home', 'Books', 'Fitness', 'Lifestyle'].map(t => `<option ${t === 'Lifestyle' ? 'selected' : ''}>${t}</option>`).join('')}</select>`}
<label>Picture address</label><input name="image" value="${hEsc(img)}"><button>Save</button></form>`);
};
const bmAuto = media => wrap(async (req, res) => { try { res.type('html').send(savedPage(await saveBookmark(req.query, media), media)); } catch (e) { res.type('html').send(formPage(req.query, media, {})); } });
const bmForm = media => wrap(async (req, res) => { let pre = {}; if (req.query.url && !(req.query.title && (media || num(req.query.price)))) { try { const p = await readPage(String(req.query.url)); pre = { title: p.title, price: p.price, image: p.imageUrl, details: p.details }; } catch (e) {} } res.type('html').send(formPage(req.query, media, pre)); });
app.get('/api/bookmark-auto', bmAuto(false)); app.get('/api/bookmark-media-auto', bmAuto(true));
app.get('/api/bookmark', bmForm(false)); app.get('/api/bookmark-media', bmForm(true));

app.post('/api/scrape-price', wrap(async (req, res) => { try { res.json(await readPage(String(req.body.url || ''))); } catch (e) { res.json({ title: '', price: 0, imageUrl: '' }); } }));
app.post('/api/scrape-media', wrap(async (req, res) => { try { res.json(await readPage(String(req.body.url || ''))); } catch (e) { res.json({ title: '' }); } }));

// AI routes are not configured here; the app falls back to its built-in analysis
['jarvis-advice', 'jarvis-predict', 'jarvis-report'].forEach(r => app.post('/api/' + r, (req, res) => res.status(503).send('AI engine not configured')));

// ----------------------------------------------------------------------------- the app itself
const ROOT = path.join(__dirname, '..');
app.use((req, res, next) => { if (/^\/(server|node_modules|\.git)(\/|$)/.test(req.path) || /\.(env|md)$/i.test(req.path)) return res.status(404).end(); next(); });
app.use(express.static(ROOT, { extensions: ['html'] }));

app.listen(PORT, () => console.log(`Wally MK 2 server on port ${PORT} • storage: ${store.kind} • ${KEY ? 'locked with WALLY_KEY' : 'NO KEY SET (open to anyone who has the link)'}`));

// keep-awake: free hosts put the server to sleep when nobody visits. Visiting our own public address
// every 10 minutes counts as a visit. Render sets RENDER_EXTERNAL_URL by itself; elsewhere set KEEP_AWAKE_URL.
// Set KEEP_AWAKE=off to disable.
const SELF = (process.env.KEEP_AWAKE_URL || process.env.RENDER_EXTERNAL_URL || '').replace(/\/$/, '');
if (SELF && process.env.KEEP_AWAKE !== 'off') {
  const ping = () => fetch(SELF + '/api/health').then(r => { if (!r.ok) console.error('keep-awake ping answered ' + r.status); }).catch(e => console.error('keep-awake ping failed: ' + e.message));
  setInterval(ping, 10 * 60 * 1000); console.log('Keep-awake is on for ' + SELF);
}
