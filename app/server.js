#!/usr/bin/env node
// OTC Readiness Manager — zero-dependency backend (Node 22.5+; uses built-in node:sqlite).
// Serves the API + static front end. Run: node app/server.js  (default port 4550)

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');
const generator = require('../scripts/generate-docs.js');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');
const PUBLIC_DIR = path.join(__dirname, 'public');
const MASTER_PATH = path.join(ROOT, 'master', 'company-master.json');
const SCHEMA_PATH = path.join(ROOT, 'master', 'schema.json');
const REQS_PATH = path.join(ROOT, 'requirements', 'requirements.json');
const PORT = process.env.PORT || 4550;

fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(path.join(DATA_DIR, 'app.db'));

// ---------- schema ----------
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin','editor','viewer')),
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS requirements (
  id TEXT PRIMARY KEY,
  phase INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  template TEXT,
  recurring TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in_progress','blocked','done','na')),
  owner TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  sort INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT,
  action TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

// ---------- seed ----------
function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pw, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(pw, stored) {
  const [salt, hash] = stored.split(':');
  const candidate = crypto.scryptSync(pw, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidate, 'hex'));
}

const userCount = db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
if (userCount === 0) {
  const initialPw = crypto.randomBytes(9).toString('base64url');
  db.prepare('INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)')
    .run('ben@herzlcapital.com', 'Ben Bakhshi', hashPassword(initialPw), 'admin');
  const pwFile = path.join(DATA_DIR, 'initial-admin-password.txt');
  fs.writeFileSync(pwFile, `admin login: ben@herzlcapital.com\npassword: ${initialPw}\n(change it after first login; this file is gitignored — delete it once noted)\n`);
  console.log(`Seeded admin user ben@herzlcapital.com — initial password written to ${pwFile}`);
}

function seedRequirements() {
  const seed = JSON.parse(fs.readFileSync(REQS_PATH, 'utf8'));
  const ins = db.prepare(`INSERT OR IGNORE INTO requirements (id, phase, title, description, template, recurring, sort) VALUES (?,?,?,?,?,?,?)`);
  seed.requirements.forEach((r, i) => ins.run(r.id, r.phase, r.title, r.description || '', r.template, r.recurring || null, i));
  // refresh descriptive fields from seed (status/owner/notes are preserved)
  const upd = db.prepare(`UPDATE requirements SET phase=?, title=?, description=?, template=?, recurring=?, sort=? WHERE id=?`);
  seed.requirements.forEach((r, i) => upd.run(r.phase, r.title, r.description || '', r.template, r.recurring || null, i, r.id));
  return seed.phases;
}
let PHASES = seedRequirements();

function audit(email, action, detail) {
  db.prepare('INSERT INTO audit (user_email, action, detail) VALUES (?,?,?)').run(email || null, action, detail || '');
}

// ---------- helpers ----------
function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', c => { data += c; if (data.length > 2_000_000) { reject(new Error('body too large')); req.destroy(); } });
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); } });
  });
}
function getCookie(req, name) {
  const raw = req.headers.cookie || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}
function currentUser(req) {
  const token = getCookie(req, 'otc_session');
  if (!token) return null;
  const row = db.prepare(`SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
                          WHERE s.token = ? AND s.expires_at > datetime('now') AND u.active = 1`).get(token);
  return row || null;
}
function requireRole(user, roles) {
  return user && roles.includes(user.role);
}

// ---------- compliance calendar ----------
function computeCalendar() {
  const master = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
  const fye = master.company?.fiscal_year_end || '12-31';
  const [fm, fd] = fye.split('-').map(Number);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const events = [];
  const addDays = (date, n) => { const d = new Date(date); d.setDate(d.getDate() + n); return d; };
  const fmt = d => d.toISOString().slice(0, 10);

  for (const year of [today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1]) {
    const fyeDate = new Date(year, fm - 1, fd);
    // quarter ends = FYE minus 9/6/3 months; annual = FYE
    for (let q = 1; q <= 3; q++) {
      const qEnd = new Date(fyeDate); qEnd.setMonth(qEnd.getMonth() - (12 - q * 3));
      events.push({ type: 'Quarterly report', period_end: fmt(qEnd), due: fmt(addDays(qEnd, 45)),
        note: `Q${q} FY${year} disclosure + interim GAAP financials via OTCIQ (due 45 days after quarter end)` });
    }
    events.push({ type: 'Annual report', period_end: fmt(fyeDate), due: fmt(addDays(fyeDate, 90)),
      note: `FY${year} disclosure + annual GAAP financials via OTCIQ (due 90 days after fiscal year end)` });
    events.push({ type: 'Management Certification (annual)', period_end: fmt(fyeDate), due: fmt(addDays(fyeDate, 135)),
      note: `OTCID annual Management Certification — due no later than 45 days after the annual report deadline (OTCID Rules)` });
    events.push({ type: 'DE franchise tax & annual report', period_end: `${year}-12-31`, due: `${year + 1}-03-01`,
      note: 'Delaware annual report + franchise tax (assumed par value method usually far cheaper)' });
  }
  const verified = master.otc?.profile_verified_date;
  if (verified) {
    const d = new Date(verified); d.setMonth(d.getMonth() + 6);
    events.push({ type: 'OTCIQ profile verification', period_end: verified, due: fmt(d), note: 'Company profile must be re-verified at least every 6 months' });
  }
  return events
    .map(e => ({ ...e, days_remaining: Math.round((new Date(e.due) - today) / 86400000) }))
    .filter(e => e.days_remaining > -120)
    .sort((a, b) => a.due.localeCompare(b.due));
}

// ---------- document listing ----------
function listDocs(dir, base) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return listDocs(p, base);
    if (!e.name.endsWith('.md')) return [];
    const st = fs.statSync(p);
    return [{ path: path.relative(base, p), modified: st.mtime.toISOString() }];
  });
}
function safeDocPath(kind, rel) {
  const base = path.join(ROOT, kind === 'template' ? 'templates' : 'generated');
  const full = path.resolve(base, rel);
  if (!full.startsWith(base + path.sep)) return null;
  return fs.existsSync(full) ? full : null;
}

// ---------- routes ----------
const routes = {
  'POST /api/login': async (req, res) => {
    const { email, password } = await readBody(req);
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND active = 1').get(String(email || '').toLowerCase().trim());
    if (!user || !verifyPassword(String(password || ''), user.password_hash)) {
      audit(email, 'login_failed', '');
      return json(res, 401, { error: 'Invalid email or password' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    db.prepare(`INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, datetime('now', '+14 days'))`).run(token, user.id);
    audit(user.email, 'login', '');
    res.setHeader('Set-Cookie', `otc_session=${token}; HttpOnly; Path=/; Max-Age=1209600; SameSite=Lax`);
    return json(res, 200, { email: user.email, name: user.name, role: user.role });
  },

  'POST /api/logout': async (req, res, user) => {
    const token = getCookie(req, 'otc_session');
    if (token) db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    res.setHeader('Set-Cookie', 'otc_session=; HttpOnly; Path=/; Max-Age=0');
    return json(res, 200, { ok: true });
  },

  'GET /api/me': async (req, res, user) => {
    if (!user) return json(res, 401, { error: 'not logged in' });
    return json(res, 200, { email: user.email, name: user.name, role: user.role });
  },

  'GET /api/dashboard': async (req, res, user) => {
    if (!user) return json(res, 401, { error: 'auth' });
    const reqs = db.prepare('SELECT phase, status, COUNT(*) n FROM requirements GROUP BY phase, status').all();
    const master = generator.loadMaster();
    const issues = generator.reconcile(master);
    const upcoming = computeCalendar().filter(e => e.days_remaining >= 0).slice(0, 6);
    return json(res, 200, { phases: PHASES, counts: reqs, reconciliation_issues: issues, upcoming,
      company: master.company.legal_name, tier: master.otc?.tier_target });
  },

  'GET /api/requirements': async (req, res, user) => {
    if (!user) return json(res, 401, { error: 'auth' });
    const rows = db.prepare('SELECT * FROM requirements ORDER BY sort').all();
    return json(res, 200, { phases: PHASES, requirements: rows });
  },

  'PATCH /api/requirements/:id': async (req, res, user, params) => {
    if (!requireRole(user, ['admin', 'editor'])) return json(res, 403, { error: 'read-only account' });
    const body = await readBody(req);
    const allowed = ['status', 'owner', 'notes'];
    const sets = [], vals = [];
    for (const k of allowed) if (k in body) { sets.push(`${k} = ?`); vals.push(String(body[k])); }
    if (!sets.length) return json(res, 400, { error: 'nothing to update' });
    vals.push(params.id);
    const r = db.prepare(`UPDATE requirements SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = ?`).run(...vals);
    if (!r.changes) return json(res, 404, { error: 'not found' });
    audit(user.email, 'requirement_update', `${params.id}: ${JSON.stringify(body)}`);
    return json(res, 200, db.prepare('SELECT * FROM requirements WHERE id = ?').get(params.id));
  },

  'GET /api/master': async (req, res, user) => {
    if (!user) return json(res, 401, { error: 'auth' });
    return json(res, 200, {
      master: JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8')),
      schema: JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'))
    });
  },

  'PUT /api/master': async (req, res, user) => {
    if (!requireRole(user, ['admin', 'editor'])) return json(res, 403, { error: 'read-only account' });
    const body = await readBody(req);
    if (!body || typeof body !== 'object' || !body.company) return json(res, 400, { error: 'invalid master payload' });
    // keep a timestamped snapshot before overwriting
    const snapDir = path.join(DATA_DIR, 'master-history');
    fs.mkdirSync(snapDir, { recursive: true });
    fs.copyFileSync(MASTER_PATH, path.join(snapDir, `master-${Date.now()}.json`));
    fs.writeFileSync(MASTER_PATH, JSON.stringify(body, null, 2) + '\n');
    audit(user.email, 'master_update', 'company-master.json updated');
    const issues = generator.reconcile(generator.loadMaster());
    return json(res, 200, { ok: true, reconciliation_issues: issues });
  },

  'GET /api/calendar': async (req, res, user) => {
    if (!user) return json(res, 401, { error: 'auth' });
    return json(res, 200, { events: computeCalendar() });
  },

  'GET /api/documents': async (req, res, user) => {
    if (!user) return json(res, 401, { error: 'auth' });
    return json(res, 200, {
      templates: listDocs(path.join(ROOT, 'templates'), path.join(ROOT, 'templates')),
      generated: listDocs(path.join(ROOT, 'generated'), path.join(ROOT, 'generated'))
    });
  },

  'GET /api/documents/file': async (req, res, user, params, query) => {
    if (!user) return json(res, 401, { error: 'auth' });
    const full = safeDocPath(query.get('kind') === 'template' ? 'template' : 'generated', query.get('path') || '');
    if (!full) return json(res, 404, { error: 'not found' });
    return json(res, 200, { content: fs.readFileSync(full, 'utf8') });
  },

  'POST /api/generate': async (req, res, user) => {
    if (!requireRole(user, ['admin', 'editor'])) return json(res, 403, { error: 'read-only account' });
    const report = generator.main();
    audit(user.email, 'generate_documents', `${report.files.length} files`);
    return json(res, 200, report);
  },

  'GET /api/users': async (req, res, user) => {
    if (!requireRole(user, ['admin'])) return json(res, 403, { error: 'admin only' });
    return json(res, 200, { users: db.prepare('SELECT id, email, name, role, active, created_at FROM users ORDER BY id').all() });
  },

  'POST /api/users': async (req, res, user) => {
    if (!requireRole(user, ['admin'])) return json(res, 403, { error: 'admin only' });
    const { email, name, role, password } = await readBody(req);
    if (!email || !name || !password) return json(res, 400, { error: 'email, name, password required' });
    if (!['admin', 'editor', 'viewer'].includes(role)) return json(res, 400, { error: 'invalid role' });
    try {
      db.prepare('INSERT INTO users (email, name, password_hash, role) VALUES (?,?,?,?)')
        .run(String(email).toLowerCase().trim(), name, hashPassword(password), role);
    } catch { return json(res, 409, { error: 'email already exists' }); }
    audit(user.email, 'user_create', `${email} (${role})`);
    return json(res, 200, { ok: true });
  },

  'PATCH /api/users/:id': async (req, res, user, params) => {
    if (!requireRole(user, ['admin'])) return json(res, 403, { error: 'admin only' });
    const body = await readBody(req);
    const target = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(params.id));
    if (!target) return json(res, 404, { error: 'not found' });
    if ('active' in body && target.email === user.email) return json(res, 400, { error: 'cannot deactivate yourself' });
    if ('role' in body && ['admin', 'editor', 'viewer'].includes(body.role))
      db.prepare('UPDATE users SET role = ? WHERE id = ?').run(body.role, target.id);
    if ('active' in body)
      db.prepare('UPDATE users SET active = ? WHERE id = ?').run(body.active ? 1 : 0, target.id);
    if (body.password)
      db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(String(body.password)), target.id);
    audit(user.email, 'user_update', `${target.email}: ${Object.keys(body).join(',')}`);
    return json(res, 200, { ok: true });
  },

  'GET /api/audit': async (req, res, user) => {
    if (!requireRole(user, ['admin'])) return json(res, 403, { error: 'admin only' });
    return json(res, 200, { entries: db.prepare('SELECT * FROM audit ORDER BY id DESC LIMIT 200').all() });
  }
};

// ---------- static files ----------
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
function serveStatic(req, res, pathname) {
  let rel = pathname === '/' ? '/index.html' : pathname;
  const full = path.resolve(PUBLIC_DIR, '.' + rel);
  if (!full.startsWith(PUBLIC_DIR) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
    res.writeHead(404); return res.end('not found');
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(full)] || 'application/octet-stream' });
  fs.createReadStream(full).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  try {
    if (pathname.startsWith('/api/')) {
      const user = currentUser(req);
      // exact match first, then parameterized
      const exact = routes[`${req.method} ${pathname}`];
      if (exact) return await exact(req, res, user, {}, url.searchParams);
      for (const key of Object.keys(routes)) {
        const [method, pattern] = key.split(' ');
        if (method !== req.method || !pattern.includes(':')) continue;
        const pParts = pattern.split('/'), uParts = pathname.split('/');
        if (pParts.length !== uParts.length) continue;
        const params = {};
        let ok = true;
        for (let i = 0; i < pParts.length; i++) {
          if (pParts[i].startsWith(':')) params[pParts[i].slice(1)] = decodeURIComponent(uParts[i]);
          else if (pParts[i] !== uParts[i]) { ok = false; break; }
        }
        if (ok) return await routes[key](req, res, user, params, url.searchParams);
      }
      return json(res, 404, { error: 'no such endpoint' });
    }
    return serveStatic(req, res, pathname);
  } catch (err) {
    console.error(err);
    return json(res, 500, { error: 'server error: ' + err.message });
  }
});

server.listen(PORT, () => console.log(`OTC Readiness Manager running at http://localhost:${PORT}`));
