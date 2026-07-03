// OTC Readiness Manager — front end (no framework, no build step)
let ME = null;
let MASTER_CACHE = null;

const $ = sel => document.querySelector(sel);
const main = () => $('#main');

async function api(path, opts = {}) {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...opts });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const canEdit = () => ME && (ME.role === 'admin' || ME.role === 'editor');

// ---------- boot ----------
async function boot() {
  try {
    ME = await api('/api/me');
    showApp();
  } catch {
    $('#login-screen').classList.remove('hidden');
    $('#app').classList.add('hidden');
  }
}
$('#login-form').addEventListener('submit', async e => {
  e.preventDefault();
  $('#login-error').textContent = '';
  try {
    ME = await api('/api/login', { method: 'POST', body: JSON.stringify({ email: $('#login-email').value, password: $('#login-password').value }) });
    showApp();
  } catch (err) { $('#login-error').textContent = err.message; }
});
$('#logout').addEventListener('click', async () => { await api('/api/logout', { method: 'POST' }); location.reload(); });

function showApp() {
  $('#login-screen').classList.add('hidden');
  $('#app').classList.remove('hidden');
  $('#me-label').textContent = `${ME.name} (${ME.role})`;
  if (ME.role === 'admin') $('#nav-users').classList.remove('hidden');
  render('dashboard');
}
document.querySelectorAll('nav button').forEach(b => b.addEventListener('click', () => render(b.dataset.view)));

function setActive(view) {
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
}
async function render(view, arg) {
  setActive(view);
  main().innerHTML = '<div class="card muted">Loading…</div>';
  try {
    if (view === 'dashboard') await renderDashboard();
    if (view === 'checklist') await renderChecklist();
    if (view === 'master') await renderMaster();
    if (view === 'documents') await renderDocuments(arg);
    if (view === 'calendar') await renderCalendar();
    if (view === 'users') await renderUsers();
  } catch (err) {
    main().innerHTML = `<div class="card error">Error: ${esc(err.message)}</div>`;
  }
}

// ---------- dashboard ----------
async function renderDashboard() {
  const d = await api('/api/dashboard');
  $('#company-name').textContent = '— ' + d.company;
  const byPhase = {};
  d.counts.forEach(c => {
    byPhase[c.phase] = byPhase[c.phase] || { total: 0, done: 0 };
    byPhase[c.phase].total += c.n;
    if (c.status === 'done' || c.status === 'na') byPhase[c.phase].done += c.n;
  });
  const totals = Object.values(byPhase).reduce((a, p) => ({ total: a.total + p.total, done: a.done + p.done }), { total: 0, done: 0 });
  const overallPct = totals.total ? Math.round(100 * totals.done / totals.total) : 0;

  const phaseRows = d.phases.map(p => {
    const s = byPhase[p.id] || { total: 0, done: 0 };
    const pct = s.total ? Math.round(100 * s.done / s.total) : 0;
    return `<div class="phase-row"><div class="label">Phase ${p.id}: ${esc(p.name)}</div>
      <div class="progress"><div style="width:${pct}%"></div></div>
      <div class="pct">${s.done}/${s.total} (${pct}%)</div></div>`;
  }).join('');

  const issues = d.reconciliation_issues.length
    ? `<div class="warn"><b>Cap table reconciliation:</b><br>${d.reconciliation_issues.map(esc).join('<br>')}</div>`
    : `<div class="ok-note">Cap table reconciles: issuance history matches outstanding shares.</div>`;

  const deadlineRows = d.upcoming.map(e => `<tr>
      <td>${esc(e.type)}</td><td>${esc(e.due)}</td>
      <td><span class="badge ${e.days_remaining < 14 ? 'overdue' : e.days_remaining < 45 ? 'soon' : 'later'}">${e.days_remaining} days</span></td>
      <td class="muted">${esc(e.note)}</td></tr>`).join('');

  main().innerHTML = `
    <div class="card"><h2>Readiness — target tier: ${esc(d.tier || 'OTCID Basic Market')}</h2>
      <div class="phase-row"><div class="label"><b>Overall</b></div>
        <div class="progress"><div style="width:${overallPct}%"></div></div>
        <div class="pct"><b>${overallPct}%</b></div></div>
      ${phaseRows}</div>
    ${issues}
    <div class="card"><h2>Next deadlines</h2>
      <div class="table-scroll"><table><thead><tr><th>Filing</th><th>Due</th><th>Remaining</th><th>Notes</th></tr></thead>
      <tbody>${deadlineRows || '<tr><td colspan="4" class="muted">No upcoming deadlines computed.</td></tr>'}</tbody></table></div></div>`;
}

// ---------- checklist ----------
async function renderChecklist() {
  const d = await api('/api/requirements');
  const statusOpts = ['todo', 'in_progress', 'blocked', 'done', 'na'];
  const groups = d.phases.map(p => {
    const items = d.requirements.filter(r => r.phase === p.id).map(r => `
      <div class="req-item" data-id="${esc(r.id)}">
        <div class="id">${esc(r.id)}</div>
        <div>
          <div class="title">${esc(r.title)} ${r.recurring ? `<span class="badge in_progress">${esc(r.recurring)}</span>` : ''}</div>
          <div class="desc">${esc(r.description)}</div>
          ${r.template ? `<span class="tpl-link" data-tpl="${esc(r.template)}">template: ${esc(r.template)}</span>` : ''}
        </div>
        <select class="req-status" ${canEdit() ? '' : 'disabled'}>
          ${statusOpts.map(s => `<option value="${s}" ${r.status === s ? 'selected' : ''}>${s.replace('_', ' ')}</option>`).join('')}
        </select>
        <input class="req-owner" placeholder="owner" value="${esc(r.owner)}" ${canEdit() ? '' : 'disabled'}>
        <div class="req-notes"><input class="req-notes-input" placeholder="notes…" value="${esc(r.notes)}" ${canEdit() ? '' : 'disabled'}></div>
      </div>`).join('');
    return `<div class="card"><h2>Phase ${p.id}: ${esc(p.name)}</h2><p class="muted" style="margin-bottom:8px">${esc(p.goal)}</p>${items}</div>`;
  }).join('');
  main().innerHTML = groups;

  main().querySelectorAll('.req-item').forEach(el => {
    const id = el.dataset.id;
    const save = async patch => {
      try { await api('/api/requirements/' + id, { method: 'PATCH', body: JSON.stringify(patch) }); }
      catch (err) { alert(err.message); }
    };
    el.querySelector('.req-status').addEventListener('change', e => save({ status: e.target.value }));
    el.querySelector('.req-owner').addEventListener('change', e => save({ owner: e.target.value }));
    el.querySelector('.req-notes-input').addEventListener('change', e => save({ notes: e.target.value }));
  });
  main().querySelectorAll('.tpl-link').forEach(el =>
    el.addEventListener('click', () => render('documents', { kind: 'template', path: el.dataset.tpl })));
}

// ---------- company master ----------
function fieldInput(pathStr, val) {
  const type = typeof val === 'number' ? 'number' : 'text';
  if (typeof val === 'boolean')
    return `<select data-path="${esc(pathStr)}" data-type="bool"><option value="true" ${val ? 'selected' : ''}>Yes</option><option value="false" ${!val ? 'selected' : ''}>No</option></select>`;
  return `<input data-path="${esc(pathStr)}" data-type="${type}" type="${type}" value="${esc(val)}" ${type === 'number' ? 'step="any"' : ''}>`;
}
function renderObjectFields(obj, prefix) {
  return Object.entries(obj)
    .filter(([k, v]) => !k.startsWith('_') && (typeof v !== 'object' || v === null))
    .map(([k, v]) => `<label>${esc(k.replace(/_/g, ' '))}${fieldInput(`${prefix}.${k}`, v)}</label>`).join('');
}
function renderArrayTable(arr, prefix, key) {
  if (!arr.length || typeof arr[0] !== 'object') {
    return `<label>${esc(key)} (comma-separated)<input data-path="${esc(prefix)}" data-type="csv" value="${esc(arr.join(', '))}"></label>`;
  }
  const cols = [...new Set(arr.flatMap(o => Object.keys(o)))];
  const rows = arr.map((item, i) => `<tr>${cols.map(c => `<td>${fieldInput(`${prefix}.${i}.${c}`, item[c] ?? '')}</td>`).join('')}
    <td><button class="btn small del-row" data-prefix="${esc(prefix)}" data-idx="${i}">✕</button></td></tr>`).join('');
  return `<div class="table-scroll array-table"><table><thead><tr>${cols.map(c => `<th>${esc(c.replace(/_/g, ' '))}</th>`).join('')}<th></th></tr></thead>
    <tbody>${rows}</tbody></table></div>
    <button class="btn small add-row" data-prefix="${esc(prefix)}">+ add row</button>`;
}

async function renderMaster(overrideMaster) {
  const d = await api('/api/master');
  if (overrideMaster) d.master = overrideMaster;
  MASTER_CACHE = d.master;
  const schema = d.schema.sections || {};
  const sections = Object.entries(d.master)
    .filter(([k, v]) => !k.startsWith('_') && typeof v === 'object' && v !== null)
    .map(([key, val]) => {
      const meta = schema[key] || { label: key.replace(/_/g, ' '), help: '' };
      let body;
      if (Array.isArray(val)) body = renderArrayTable(val, key, key);
      else {
        body = `<div class="field-grid">${renderObjectFields(val, key)}</div>`;
        // nested objects one level deep (e.g., securities.common)
        for (const [k2, v2] of Object.entries(val)) {
          if (v2 && typeof v2 === 'object' && !Array.isArray(v2)) {
            body += `<h3>${esc(k2.replace(/_/g, ' '))}</h3><div class="field-grid">${renderObjectFields(v2, `${key}.${k2}`)}</div>`;
          } else if (Array.isArray(v2)) {
            body += `<h3>${esc(k2.replace(/_/g, ' '))}</h3>` + renderArrayTable(v2, `${key}.${k2}`, k2);
          }
        }
      }
      return `<div class="card"><h2>${esc(meta.label)}</h2><div class="section-help">${esc(meta.help || '')}</div>${body}</div>`;
    }).join('');

  // scalar top-level fields (legal_proceedings etc.)
  const scalars = Object.entries(d.master).filter(([k, v]) => !k.startsWith('_') && (typeof v !== 'object' || v === null));
  const scalarCard = scalars.length
    ? `<div class="card"><h2>Other</h2><div class="field-grid">${scalars.map(([k, v]) => `<label>${esc(k.replace(/_/g, ' '))}${fieldInput(k, v)}</label>`).join('')}</div></div>` : '';

  main().innerHTML = sections + scalarCard + (canEdit()
    ? `<div class="save-bar"><button class="btn primary" id="save-master">Save Company Master</button>
       <span class="muted">Saving updates master/company-master.json — regenerate documents afterwards.</span><span id="save-msg"></span></div>`
    : '<div class="card muted">Read-only account — you can view but not edit.</div>');

  if (canEdit()) {
    $('#save-master').addEventListener('click', saveMaster);
    main().querySelectorAll('.add-row').forEach(b => b.addEventListener('click', () => {
      collectMasterEdits();
      const arr = getPath(MASTER_CACHE, b.dataset.prefix);
      const template = arr.length ? Object.fromEntries(Object.keys(arr[arr.length - 1]).map(k => [k, ''])) : { value: '' };
      arr.push(template);
      renderMaster(MASTER_CACHE);
    }));
    main().querySelectorAll('.del-row').forEach(b => b.addEventListener('click', () => {
      collectMasterEdits();
      getPath(MASTER_CACHE, b.dataset.prefix).splice(Number(b.dataset.idx), 1);
      renderMaster(MASTER_CACHE);
    }));
  }
}

function getPath(obj, dotPath) {
  return dotPath.split('.').reduce((o, k) => o?.[k], obj);
}
function setPath(obj, dotPath, value) {
  const parts = dotPath.split('.');
  let o = obj;
  for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]];
  o[parts[parts.length - 1]] = value;
}
function collectMasterEdits() {
  main().querySelectorAll('[data-path]').forEach(el => {
    let v = el.value;
    if (el.dataset.type === 'number') v = v === '' ? '' : Number(v);
    if (el.dataset.type === 'bool') v = v === 'true';
    if (el.dataset.type === 'csv') v = v.split(',').map(s => s.trim()).filter(Boolean);
    setPath(MASTER_CACHE, el.dataset.path, v);
  });
}
async function saveMaster() {
  collectMasterEdits();
  $('#save-msg').textContent = 'Saving…';
  try {
    const r = await api('/api/master', { method: 'PUT', body: JSON.stringify(MASTER_CACHE) });
    $('#save-msg').innerHTML = r.reconciliation_issues.length
      ? `<span class="error">Saved, but: ${esc(r.reconciliation_issues.join(' '))}</span>`
      : '<span style="color:var(--green)">Saved ✓</span>';
  } catch (err) { $('#save-msg').innerHTML = `<span class="error">${esc(err.message)}</span>`; }
}

// ---------- documents ----------
function mdToHtml(md) {
  // minimal markdown renderer: comments out, headings, hr, tables, bold, checkboxes, lists, blockquotes, paragraphs
  md = md.replace(/<!--[\s\S]*?-->/g, '');
  const lines = md.split('\n');
  let html = '', inTable = false, inList = false;
  const inline = s => esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.+?)\*/g, '<i>$1</i>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
  const closeAll = () => { if (inTable) { html += '</tbody></table>'; inTable = false; } if (inList) { html += '</ul>'; inList = false; } };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*\|/.test(line)) {
      const cells = line.replace(/^\s*\||\|\s*$/g, '').split('|').map(c => c.trim());
      if (/^[-\s:|]+$/.test(cells.join('|'))) continue; // separator row
      if (!inTable) {
        closeAll();
        html += `<table><thead><tr>${cells.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>`;
        inTable = true;
      } else html += `<tr>${cells.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`;
      continue;
    }
    if (inTable) { html += '</tbody></table>'; inTable = false; }
    if (/^#{1,4} /.test(line)) { closeAll(); const lvl = line.match(/^#+/)[0].length; html += `<h${lvl}>${inline(line.replace(/^#+ /, ''))}</h${lvl}>`; }
    else if (/^---+\s*$/.test(line)) { closeAll(); html += '<hr>'; }
    else if (/^> /.test(line)) { closeAll(); html += `<blockquote>${inline(line.slice(2))}</blockquote>`; }
    else if (/^\s*- /.test(line)) { if (!inList) { html += '<ul>'; inList = true; } html += `<li>${inline(line.replace(/^\s*- /, ''))}</li>`; }
    else if (line.trim() === '' || line.trim() === '&nbsp;') { closeAll(); html += ''; }
    else { closeAll(); html += `<p>${inline(line)}</p>`; }
  }
  closeAll();
  return html;
}

async function renderDocuments(openArg) {
  const d = await api('/api/documents');
  const list = (items, kind, label) => `<h3>${label}</h3>` + (items.length
    ? items.map(t => `<button data-kind="${kind}" data-path="${esc(t.path)}">${esc(t.path)}</button>`).join('')
    : '<div class="muted" style="padding:6px 10px">none yet</div>');
  main().innerHTML = `
    ${canEdit() ? `<div class="card"><button class="btn primary" id="gen-btn">Regenerate all documents from Company Master</button> <span id="gen-msg" class="muted"></span></div>` : ''}
    <div class="doc-layout">
      <div class="card doc-list">${list(d.templates, 'template', 'Templates')}${list(d.generated, 'generated', 'Generated documents')}</div>
      <div class="card doc-preview" id="doc-preview"><span class="muted">Select a document to preview.</span></div>
    </div>`;
  const open = async (kind, p, btn) => {
    main().querySelectorAll('.doc-list button').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const f = await api(`/api/documents/file?kind=${kind}&path=${encodeURIComponent(p)}`);
    $('#doc-preview').innerHTML = `<div class="muted" style="margin-bottom:8px">${esc(kind)}: ${esc(p)}</div>` + mdToHtml(f.content);
  };
  main().querySelectorAll('.doc-list button').forEach(b => b.addEventListener('click', () => open(b.dataset.kind, b.dataset.path, b)));
  if ($('#gen-btn')) $('#gen-btn').addEventListener('click', async () => {
    $('#gen-msg').textContent = 'Generating…';
    try {
      const r = await api('/api/generate', { method: 'POST' });
      const missing = r.files.filter(f => f.unresolved.length);
      const msg = `Generated ${r.files.length} documents` +
        (r.reconciliation_issues.length ? ` — ⚠ ${r.reconciliation_issues.join(' ')}` : '') +
        (missing.length ? ` — unresolved fields in ${missing.map(m => m.template).join(', ')}` : ' — all fields resolved ✓');
      await render('documents');
      $('#gen-msg').textContent = msg;
    } catch (err) { $('#gen-msg').textContent = err.message; }
  });
  if (openArg) open(openArg.kind, openArg.path);
}

// ---------- calendar ----------
async function renderCalendar() {
  const d = await api('/api/calendar');
  const rows = d.events.map(e => `<tr>
    <td>${esc(e.type)}</td><td>${esc(e.period_end)}</td><td><b>${esc(e.due)}</b></td>
    <td><span class="badge ${e.days_remaining < 0 ? 'overdue' : e.days_remaining < 30 ? 'soon' : 'later'}">
      ${e.days_remaining < 0 ? Math.abs(e.days_remaining) + ' days overdue' : e.days_remaining + ' days'}</span></td>
    <td class="muted">${esc(e.note)}</td></tr>`).join('');
  main().innerHTML = `<div class="card"><h2>Compliance calendar</h2>
    <p class="muted" style="margin-bottom:10px">Computed from fiscal year end in the Company Master. Quarterly reports due 45 days after quarter end; annual report 90 days after FYE; Management Certification 45 days after the annual report deadline; OTCIQ profile verification every 6 months. If a deadline will be missed, a Notification of Late Filing within 1 business day buys +5 days (quarterly) / +15 days (annual).</p>
    <div class="table-scroll"><table><thead><tr><th>Filing</th><th>Period end</th><th>Due date</th><th>Status</th><th>Notes</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}

// ---------- users ----------
async function renderUsers() {
  const d = await api('/api/users');
  const rows = d.users.map(u => `<tr>
    <td>${esc(u.email)}</td><td>${esc(u.name)}</td>
    <td><select class="u-role" data-id="${u.id}">
      ${['admin', 'editor', 'viewer'].map(r => `<option ${u.role === r ? 'selected' : ''}>${r}</option>`).join('')}</select></td>
    <td><span class="badge ${u.active ? 'done' : 'blocked'}">${u.active ? 'active' : 'disabled'}</span></td>
    <td>
      <button class="btn small u-toggle" data-id="${u.id}" data-active="${u.active}">${u.active ? 'Disable' : 'Enable'}</button>
      <button class="btn small u-pw" data-id="${u.id}">Reset password</button>
    </td></tr>`).join('');
  main().innerHTML = `
    <div class="card"><h2>Users</h2>
      <div class="table-scroll"><table><thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div></div>
    <div class="card"><h2>Add user</h2>
      <div class="field-grid">
        <label>Email<input id="nu-email" type="email"></label>
        <label>Name<input id="nu-name"></label>
        <label>Role<select id="nu-role"><option>editor</option><option>viewer</option><option>admin</option></select></label>
        <label>Temporary password<input id="nu-pw"></label>
      </div>
      <div style="margin-top:12px"><button class="btn primary" id="nu-add">Add user</button> <span id="nu-msg"></span></div></div>`;
  $('#nu-add').addEventListener('click', async () => {
    try {
      await api('/api/users', { method: 'POST', body: JSON.stringify({ email: $('#nu-email').value, name: $('#nu-name').value, role: $('#nu-role').value, password: $('#nu-pw').value }) });
      render('users');
    } catch (err) { $('#nu-msg').textContent = err.message; }
  });
  main().querySelectorAll('.u-role').forEach(s => s.addEventListener('change', async e => {
    await api('/api/users/' + s.dataset.id, { method: 'PATCH', body: JSON.stringify({ role: e.target.value }) });
  }));
  main().querySelectorAll('.u-toggle').forEach(b => b.addEventListener('click', async () => {
    await api('/api/users/' + b.dataset.id, { method: 'PATCH', body: JSON.stringify({ active: b.dataset.active !== '1' }) });
    render('users');
  }));
  main().querySelectorAll('.u-pw').forEach(b => b.addEventListener('click', async () => {
    const pw = prompt('New temporary password:');
    if (pw) await api('/api/users/' + b.dataset.id, { method: 'PATCH', body: JSON.stringify({ password: pw }) });
  }));
}

boot();
